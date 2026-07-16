// ColorVerse / Little Artists — AI coloring-page generation endpoint (Vercel serverless)
//
// Security & kid-safety hardening:
//   1. Strict input validation (type, length, allowed style/complexity values)
//   2. Kid-safety blocklist — rejects adult / violent / drug / hate / scary prompts
//   3. OpenAI Moderation API pre-check — every prompt is screened before generation
//   4. Kid-safe prompt wrapper — the image model is always instructed to produce
//      G-rated, child-appropriate content regardless of the input
//   5. Per-IP rate limiting (best-effort, per serverless instance)
//   6. CORS restricted to known app origins (no longer `*`)
//   7. Sanitized error responses — no internal/API errors leak to the client
//
// Setup: add OPENAI_API_KEY in the Vercel project settings. Without a key the
// endpoint returns { fallback: true } and the client uses the built-in generator.

export const maxDuration = 60;

/* ---------------- CORS ---------------- */
// Origins allowed to call this API: the deployed web app, the native iOS app
// (Capacitor WebView), and local development.
const ALLOWED_ORIGINS = new Set([
  'https://colorverse-delta.vercel.app',
  'capacitor://localhost',
  'ionic://localhost',
  'http://localhost',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://localhost:8000',
  'http://127.0.0.1:8000',
]);
function corsOrigin(req) {
  const o = req.headers.origin || '';
  if (ALLOWED_ORIGINS.has(o)) return o;
  // Vercel preview deployments of this project
  if (/^https:\/\/colorverse-[a-z0-9-]+\.vercel\.app$/.test(o)) return o;
  return null;
}

/* ---------------- Rate limiting (best-effort, in-memory) ---------------- */
// Serverless instances are ephemeral, so this is a soft limit per warm instance —
// it still stops rapid-fire abuse and script loops cheaply.
const RL_WINDOW_MS = 60_000; // 1 minute
const RL_MAX_PER_WINDOW = 6; // max generations per IP per minute
const RL_MAX_PER_DAY = 60; // max per IP per day (per instance)
const rlMinute = new Map();
const rlDay = new Map();
function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  return (Array.isArray(fwd) ? fwd[0] : (fwd || '')).split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
}
function rateLimited(ip) {
  const now = Date.now();
  const m = rlMinute.get(ip) || [];
  const recent = m.filter(t => now - t < RL_WINDOW_MS);
  if (recent.length >= RL_MAX_PER_WINDOW) return true;
  recent.push(now);
  rlMinute.set(ip, recent);
  const day = new Date().toISOString().slice(0, 10);
  const d = rlDay.get(ip) || { day, n: 0 };
  if (d.day !== day) { d.day = day; d.n = 0; }
  d.n += 1;
  rlDay.set(ip, d);
  if (rlMinute.size > 5000) rlMinute.clear(); // memory guard
  if (rlDay.size > 5000) rlDay.clear();
  return d.n > RL_MAX_PER_DAY;
}

/* ---------------- Kid-safety content filter ---------------- */
// Fast local blocklist — rejected before any API call. Word-boundary matched.
const BLOCKED_TERMS = [
  // sexual / adult
  'nude', 'naked', 'nsfw', 'sex', 'sexy', 'porn', 'erotic', 'hentai', 'fetish',
  'lingerie', 'bikini', 'topless', 'stripper', 'genital', 'penis', 'vagina',
  'breasts', 'boobs', 'nipple', 'orgasm', 'aroused', 'seductive', 'bdsm', 'xxx',
  // violence / gore
  'gore', 'gory', 'blood', 'bloody', 'beheading', 'decapitat', 'murder', 'kill',
  'killing', 'corpse', 'dead body', 'mutilat', 'torture', 'massacre', 'suicide',
  'self harm', 'self-harm', 'hanging', 'strangle', 'shooting', 'school shooting',
  'stab', 'dismember', 'slaughter',
  // weapons (realistic)
  'gun', 'guns', 'pistol', 'rifle', 'shotgun', 'firearm', 'ak47', 'ak-47', 'ar15',
  'ar-15', 'grenade', 'bomb', 'explosive', 'landmine', 'machete',
  // drugs / substances
  'drug', 'drugs', 'cocaine', 'heroin', 'meth', 'weed', 'marijuana', 'cannabis',
  'vape', 'vaping', 'cigarette', 'smoking', 'alcohol', 'beer', 'vodka', 'whiskey',
  'drunk', 'overdose',
  // hate / extremism
  'nazi', 'swastika', 'kkk', 'hitler', 'terrorist', 'isis', 'jihad', 'racist',
  'slavery', 'lynching',
  // horror / disturbing (beyond kid-friendly spooky)
  'demonic', 'satanic', 'satan', 'occult', 'exorcism', 'possessed', 'creepypasta',
  'jumpscare', 'slenderman', 'chucky', 'pennywise', 'saw trap',
];
const BLOCKED_RE = new RegExp('\\b(' + BLOCKED_TERMS.map(t => t.replace(/[-\s]/g, '[\\s-]?')).join('|') + ')', 'i');

function localSafetyCheck(prompt) {
  return !BLOCKED_RE.test(prompt);
}

// OpenAI Moderation API — free, catches what the blocklist misses (misspellings,
// other languages, innuendo). Fails CLOSED for clearly flagged content, but fails
// OPEN on network errors so a moderation outage doesn't take down the app
// (the blocklist + kid-safe wrapper + model's own safety system still apply).
async function moderationCheck(prompt, apiKey) {
  try {
    const r = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'omni-moderation-latest', input: prompt }),
    });
    if (!r.ok) return { ok: true }; // fail open on API errors
    const data = await r.json();
    const res = data?.results?.[0];
    if (!res) return { ok: true };
    if (res.flagged) return { ok: false };
    // Stricter-than-default thresholds for a kids app
    const s = res.category_scores || {};
    const strict = ['sexual', 'sexual/minors', 'violence', 'violence/graphic', 'hate',
      'harassment', 'self-harm', 'illicit', 'illicit/violent'];
    for (const cat of strict) {
      if ((s[cat] || 0) > 0.15) return { ok: false };
    }
    return { ok: true };
  } catch {
    return { ok: true }; // fail open on network errors
  }
}

/* ---------------- Prompt construction ---------------- */
const STYLE_HINT = {
  cartoon: 'cute cartoon style',
  anime: 'anime / manga style',
  lineart: 'clean minimal line art',
  sketch: 'hand-drawn pencil sketch style',
  realistic: 'realistic detailed illustration style',
};
const COMPLEXITY_HINT = {
  beginner: 'simple bold outlines, large open areas, minimal detail, great for young kids',
  intermediate: 'moderate detail with medium-sized regions',
  advanced: 'intricate, highly detailed professional illustration',
};
const MAX_PROMPT_LEN = 300;

export default async function handler(req, res) {
  const origin = corsOrigin(req);
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  if (req.method === 'OPTIONS') {
    res.status(origin ? 204 : 403).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  // Same-origin requests may omit the Origin header; block only requests that
  // present a foreign origin.
  if (req.headers.origin && !origin) {
    res.status(403).json({ error: 'Origin not allowed' });
    return;
  }

  if (rateLimited(clientIp(req))) {
    res.status(429).json({ error: 'Too many requests — please slow down and try again in a minute.' });
    return;
  }

  const body = req.body || {};
  let { prompt = '', style = 'cartoon', complexity = 'beginner' } = body;

  // ---- Input validation ----
  if (typeof prompt !== 'string' || typeof style !== 'string' || typeof complexity !== 'string') {
    res.status(400).json({ error: 'Invalid request' });
    return;
  }
  prompt = prompt.replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!prompt) {
    res.status(400).json({ error: 'Empty prompt' });
    return;
  }
  if (prompt.length > MAX_PROMPT_LEN) prompt = prompt.slice(0, MAX_PROMPT_LEN);
  if (!STYLE_HINT[style]) style = 'cartoon';
  if (!COMPLEXITY_HINT[complexity]) complexity = 'beginner';

  // ---- Kid-safety: local blocklist ----
  if (!localSafetyCheck(prompt)) {
    res.status(400).json({
      error: "Let's keep it kid-friendly! Try describing an animal, a place, or something fun to color.",
      blocked: true,
    });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(200).json({ fallback: true, prompt, style, complexity });
    return;
  }

  // ---- Kid-safety: OpenAI moderation pre-check ----
  const mod = await moderationCheck(prompt, apiKey);
  if (!mod.ok) {
    res.status(400).json({
      error: "Let's keep it kid-friendly! Try describing an animal, a place, or something fun to color.",
      blocked: true,
    });
    return;
  }

  // ---- Kid-safe prompt wrapper: enforced regardless of user input ----
  const fullPrompt =
    `Black and white coloring book page of: ${prompt}. ` +
    `${STYLE_HINT[style]}. ${COMPLEXITY_HINT[complexity]}. ` +
    `Family-friendly, G-rated, wholesome content appropriate for young children. ` +
    `No violence, no weapons, no scary or disturbing imagery, no adult content, no text or words. ` +
    `Bold clean black outlines only, no shading, no grey, no color, no fill, ` +
    `pure white background, thick continuous contour lines forming closed regions ` +
    `suitable for coloring. Centered subject, printable.`;

  try {
    const r = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: fullPrompt,
        size: '1024x1024',
        n: 1,
        background: 'opaque',
        moderation: 'auto', // keep OpenAI's built-in image safety at its strict default
      }),
    });

    const data = await r.json();
    if (!r.ok) {
      // Don't leak raw provider errors to the client.
      const status = r.status;
      const safeMsg =
        status === 400 ? 'That prompt could not be generated — try something else.' :
        status === 429 ? 'The generator is busy — please try again in a moment.' :
        'Generation failed — please try again.';
      console.error('openai_error', status, data?.error?.message);
      res.status(200).json({ fallback: true, error: safeMsg });
      return;
    }
    const b64 = data?.data?.[0]?.b64_json;
    if (!b64) {
      res.status(200).json({ fallback: true, error: 'No image returned — please try again.' });
      return;
    }
    res.status(200).json({ imageB64: `data:image/png;base64,${b64}` });
  } catch (err) {
    console.error('generate_error', err);
    res.status(200).json({ fallback: true, error: 'Generation failed — please try again.' });
  }
}

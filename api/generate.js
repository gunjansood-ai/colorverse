// ColorVerse — AI coloring-page generation endpoint (Vercel serverless function)
//
// Generates clean black-and-white coloring-book line art from a text prompt using
// OpenAI's image model (gpt-image-1). If no OPENAI_API_KEY is configured, it returns
// { fallback: true } and the client renders a built-in sample template instead, so
// the app always works.
//
// Setup: add an environment variable OPENAI_API_KEY in the Vercel project settings
// (or `vercel env add OPENAI_API_KEY`). The key must have image generation access.

// Image generation can take 20–40s; allow up to 60s so the function doesn't time out.
export const maxDuration = 60;

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { prompt = '', style = 'cartoon', complexity = 'beginner' } = req.body || {};
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    res.status(200).json({ fallback: true, prompt, style, complexity });
    return;
  }
  if (!prompt.trim()) {
    res.status(400).json({ error: 'Empty prompt' });
    return;
  }

  const fullPrompt =
    `Black and white coloring book page of: ${prompt}. ` +
    `${STYLE_HINT[style] || STYLE_HINT.cartoon}. ` +
    `${COMPLEXITY_HINT[complexity] || COMPLEXITY_HINT.beginner}. ` +
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
      }),
    });

    const data = await r.json();
    if (!r.ok) {
      const msg = data?.error?.message || `OpenAI returned ${r.status}`;
      res.status(200).json({ fallback: true, error: msg });
      return;
    }
    const b64 = data?.data?.[0]?.b64_json;
    if (!b64) {
      res.status(200).json({ fallback: true, error: 'No image returned' });
      return;
    }
    res.status(200).json({ imageB64: `data:image/png;base64,${b64}` });
  } catch (err) {
    res.status(200).json({ fallback: true, error: String(err) });
  }
}

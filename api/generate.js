// ColorVerse — AI coloring-page generation endpoint (Vercel serverless function)
//
// By default this returns { fallback: true } and the client renders a clean
// procedural line-art page locally, so the app works with zero configuration.
//
// To enable real AI image→line-art generation, set an env var in Vercel
// (REPLICATE_API_TOKEN or OPENAI_API_KEY) and implement the call below. The
// model should return black line art on white; convert to an SVG/PNG and
// return it as { svg } or { imageUrl }.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { prompt = '', style = 'cartoon', complexity = 'beginner' } = req.body || {};

  const hasModel = !!(process.env.REPLICATE_API_TOKEN || process.env.OPENAI_API_KEY);
  if (!hasModel) {
    // No model configured → tell the client to use its local generator.
    res.status(200).json({ fallback: true, prompt, style, complexity });
    return;
  }

  try {
    // ---- Example wiring (uncomment & adapt once a key is set) ----------------
    // const r = await fetch('https://api.replicate.com/v1/predictions', {
    //   method: 'POST',
    //   headers: {
    //     Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     version: '<a line-art / coloring-book model version>',
    //     input: {
    //       prompt: `${prompt}, clean black and white coloring book line art, ${style}, ${complexity} detail, white background`,
    //     },
    //   }),
    // });
    // const data = await r.json();
    // return res.status(200).json({ imageUrl: data.output });
    // -------------------------------------------------------------------------
    res.status(200).json({ fallback: true, prompt, style, complexity });
  } catch (err) {
    res.status(200).json({ fallback: true, error: String(err) });
  }
}

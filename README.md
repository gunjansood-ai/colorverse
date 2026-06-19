# 🎨 ColorVerse — Imagine. Color. Share.

An **AI-native digital coloring app**. Generate personalized coloring pages from a text
prompt, turn any photo into clean line art, and color it with realistic brushes — then
export, print, or share.

Built as a fast, zero-build static web app (HTML/CSS/vanilla JS) with a Vercel serverless
function for AI generation. Works on desktop, tablet, and mobile.

## Features (per the ColorVerse PRD)

**Coloring engine** — pencil, marker, crayon, watercolor, oil, airbrush, glitter, metallic
and texture brushes; brush size, opacity & pressure; eraser, color picker, zoom/pan;
freehand, smart **paint-bucket flood fill**, and AI auto-color.

**Layers** — Line Art, Color, Shadow, Highlight & Effects layers with visibility and select
controls (line art acts as the fill boundary).

**AI coloring page generator** — text-to-coloring-page with 5 styles (Cartoon, Anime,
Line Art, Sketch, Realistic) and 3 complexity levels (Beginner / Intermediate / Advanced).
Returns clean black-and-white line art optimized for coloring.

**Import & convert** — turn photos/illustrations into coloring pages via on-device edge
detection (coloring / cartoon / manga / sketch modes).

**AI assist** — auto-color and palette suggestions (Pixar, Fantasy, Anime, Storybook,
Watercolor themes).

**Kids Mode** — simplified large-button interface, category & page pickers, reduced toolset.

**Share / Export** — PNG, JPEG, transparent PNG, **PDF**, **time-lapse video** (WebM),
before/after comparison, print modes, and share links.

**Gallery & Profile** — save projects locally, browse templates, manage Free / Premium
($9.99) / Creator ($19.99) tiers.

## Run locally

```bash
npx serve .
# or: python3 -m http.server 8000
```

Then open the printed URL.

## Deploy

Push to GitHub and import the repo in Vercel (no build step — it's a static site with one
serverless function under `/api`). The app deploys as-is.

## Enable real AI image generation (optional)

Out of the box, generation uses a built-in **procedural line-art generator** so the demo
always works with no keys. To plug in a real model, set `REPLICATE_API_TOKEN` or
`OPENAI_API_KEY` in your Vercel project and implement the call in
[`api/generate.js`](api/generate.js) (the hook is documented inline).

## Tech

- Vanilla JS + Canvas coloring engine (`js/editor.js`)
- Hash-router SPA (`js/app.js`)
- Procedural SVG line-art library (`js/data.js`)
- Vercel serverless function (`api/generate.js`)

## Design system

Primary `#5B67FF` · Accent `#FFB84D` · Success `#28C76F` · Background `#F8F8F8` ·
SF Pro type scale.

---
MIT licensed.

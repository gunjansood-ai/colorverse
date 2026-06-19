/* ColorVerse — Learn to Draw: hand-authored step-by-step lessons.
   Each lesson is a sequence of steps; each step has one or more strokes.
   Stroke {d} is an SVG path. {c:true} marks a faint "construction" guide
   (basic shapes you block in first) that is NOT scored in trace feedback. */
const LV = 400; // lesson viewBox is 0 0 400 400

// path helpers (authoring convenience)
const _C = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
const _E = (cx, cy, rx, ry) => `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0`;
const _L = (x1, y1, x2, y2) => `M${x1} ${y1}L${x2} ${y2}`;
const _P = (...pts) => 'M' + pts.map(p => p.join(' ')).join('L');
const F = (d) => ({ d });            // final stroke
const G = (d) => ({ d, c: true });   // construction (guide) stroke

const LESSONS = [
  {
    id: 'circle', title: 'Perfect Circle', cat: 'basics', level: 'beginner',
    steps: [
      { label: 'Lightly mark the center with a cross', strokes: [G(_L(200, 150, 200, 250)), G(_L(150, 200, 250, 200))] },
      { label: 'Draw around it in one smooth motion', strokes: [F(_C(200, 200, 110))] },
    ],
  },
  {
    id: 'square', title: 'Straight Square', cat: 'basics', level: 'beginner',
    steps: [
      { label: 'Draw the top edge — keep it straight', strokes: [F(_L(120, 120, 280, 120))] },
      { label: 'Down the right side', strokes: [F(_L(280, 120, 280, 280))] },
      { label: 'Across the bottom', strokes: [F(_L(280, 280, 120, 280))] },
      { label: 'Up the left side to close it', strokes: [F(_L(120, 280, 120, 120))] },
    ],
  },
  {
    id: 'star', title: 'Five-Point Star', cat: 'basics', level: 'beginner',
    steps: [
      { label: 'Block in a guide circle', strokes: [G(_C(200, 190, 110))] },
      { label: 'Connect five points into a star', strokes: [F('M200 80L226 154L305 156L242 204L265 279L200 234L135 279L158 204L95 156L174 154Z')] },
    ],
  },
  {
    id: 'smiley', title: 'Smiley Face', cat: 'basics', level: 'beginner',
    steps: [
      { label: 'Draw a big round face', strokes: [F(_C(200, 200, 130))] },
      { label: 'Add two eyes, evenly spaced', strokes: [F(_C(160, 175, 13)), F(_C(240, 175, 13))] },
      { label: 'Curve a happy smile', strokes: [F('M135 235Q200 305 265 235')] },
    ],
  },
  {
    id: 'cat', title: 'Cute Cat', cat: 'animals', level: 'beginner',
    steps: [
      { label: 'Start with a round head', strokes: [F(_C(200, 215, 105))] },
      { label: 'Add the first pointy ear', strokes: [F(_P([125, 150], [150, 55], [215, 135]))] },
      { label: 'Add the second ear to match', strokes: [F(_P([275, 150], [250, 55], [185, 135]))] },
      { label: 'Two eyes, level with each other', strokes: [F(_C(165, 205, 12)), F(_C(235, 205, 12))] },
      { label: 'A little triangle nose', strokes: [F('M200 235l-13 13h26z')] },
      { label: 'Mouth and whiskers', strokes: [F('M200 248V262M200 262Q178 278 160 268M200 262Q222 278 240 268'), F(_L(120, 230, 70, 222)), F(_L(120, 248, 70, 250)), F(_L(280, 230, 330, 222)), F(_L(280, 248, 330, 250))] },
    ],
  },
  {
    id: 'fish', title: 'Happy Fish', cat: 'animals', level: 'beginner',
    steps: [
      { label: 'Draw an oval body', strokes: [F(_E(185, 205, 120, 80))] },
      { label: 'Add a triangle tail', strokes: [F(_P([300, 205], [375, 155], [375, 255], [300, 205]))] },
      { label: 'A big round eye', strokes: [F(_C(130, 185, 14)), F(_C(130, 185, 4))] },
      { label: 'Top and bottom fins', strokes: [F('M170 130Q200 105 230 132'), F('M170 280Q200 305 230 278')] },
      { label: 'A smile and some scales', strokes: [F('M95 220Q120 240 150 222'), F('M210 175Q230 205 210 235'), F('M250 180Q268 205 250 230')] },
    ],
  },
  {
    id: 'flower', title: 'Simple Flower', cat: 'nature', level: 'beginner',
    steps: [
      { label: 'Draw the round center', strokes: [F(_C(200, 165, 38))] },
      { label: 'Add petals all the way around', strokes: [
        F(_E(200, 100, 26, 40)), F(_E(258, 130, 40, 26)), F(_E(258, 200, 40, 26)),
        F(_E(200, 230, 26, 40)), F(_E(142, 200, 40, 26)), F(_E(142, 130, 40, 26)),
      ] },
      { label: 'Draw the stem down', strokes: [F('M200 203L200 350')] },
      { label: 'Add two leaves', strokes: [F('M200 260Q150 250 130 290Q185 300 200 275'), F('M200 300Q250 290 270 330Q215 340 200 315')] },
    ],
  },
  {
    id: 'house', title: 'Little House', cat: 'places', level: 'beginner',
    steps: [
      { label: 'Draw the walls (a square)', strokes: [F('M120 200H280V330H120Z')] },
      { label: 'Add a triangle roof', strokes: [F(_P([105, 200], [200, 120], [295, 200]))] },
      { label: 'Put in the door', strokes: [F('M175 330V255H225V330')] },
      { label: 'Add a window', strokes: [F('M135 225H170V260H135ZM152 225V260M135 242H170')] },
      { label: 'Sun and a little path', strokes: [F(_C(330, 95, 26)), F('M120 330Q150 360 200 360')] },
    ],
  },
  {
    id: 'elephant', title: 'Baby Elephant', cat: 'animals', level: 'intermediate',
    steps: [
      { label: 'Draw the head — a big circle', strokes: [F(_C(200, 165, 82))] },
      { label: 'Add the first ear', strokes: [F(_C(120, 165, 52))] },
      { label: 'Add the second ear to match', strokes: [F(_C(280, 165, 52))] },
      { label: 'Two small eyes', strokes: [F(_C(178, 160, 8)), F(_C(222, 160, 8))] },
      { label: 'Curve the trunk down', strokes: [F('M200 220C196 270 176 300 190 345Q200 355 210 345')] },
      { label: 'Add the rounded body', strokes: [F(_E(210, 295, 120, 80))] },
      { label: 'Four little legs', strokes: [F('M150 365V388'), F('M195 372V392'), F('M245 372V392'), F('M290 365V388')] },
    ],
  },
  {
    id: 'butterfly', title: 'Butterfly', cat: 'animals', level: 'intermediate',
    steps: [
      { label: 'Draw the body down the middle', strokes: [F(_E(200, 200, 12, 75))] },
      { label: 'Add the two upper wings', strokes: [F('M192 160C120 90 100 130 110 175C120 205 175 200 192 180'), F('M208 160C280 90 300 130 290 175C280 205 225 200 208 180')] },
      { label: 'Add the two lower wings', strokes: [F('M192 215C140 230 120 285 160 305C190 315 200 250 195 220'), F('M208 215C260 230 280 285 240 305C210 315 200 250 205 220')] },
      { label: 'Draw the antennae', strokes: [F('M196 132C188 105 175 100 168 96'), F('M204 132C212 105 225 100 232 96')] },
      { label: 'Add spots on the wings', strokes: [F(_C(150, 150, 12)), F(_C(250, 150, 12)), F(_C(165, 270, 9)), F(_C(235, 270, 9))] },
    ],
  },
  {
    id: 'rocket', title: 'Rocket Ship', cat: 'places', level: 'intermediate',
    steps: [
      { label: 'Draw the rocket body', strokes: [F('M160 160H240V300H160Z')] },
      { label: 'Add the nose cone on top', strokes: [F(_P([160, 160], [200, 95], [240, 160]))] },
      { label: 'A round window', strokes: [F(_C(200, 195, 24))] },
      { label: 'Add fins on the sides', strokes: [F(_P([160, 250], [125, 315], [160, 300])), F(_P([240, 250], [275, 315], [240, 300]))] },
      { label: 'Whoosh — add the flames!', strokes: [F('M172 300Q185 350 200 305Q215 350 228 300')] },
    ],
  },
];

const LESSON_CATS = [
  { id: 'basics', label: 'Basics', emoji: '✏️' },
  { id: 'animals', label: 'Animals', emoji: '🐾' },
  { id: 'nature', label: 'Nature', emoji: '🌿' },
  { id: 'places', label: 'Places', emoji: '🏠' },
];

// Static thumbnail = all FINAL strokes drawn (no construction guides).
function lessonThumb(lesson) {
  const d = lesson.steps.flatMap(s => s.strokes.filter(k => !k.c).map(k => k.d)).join(' ');
  return `<svg viewBox="0 0 ${LV} ${LV}" xmlns="http://www.w3.org/2000/svg">
    <path d="${d}" fill="none" stroke="#1b1b1b" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

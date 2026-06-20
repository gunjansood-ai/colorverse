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

  {
    id: 'triangle', title: 'Triangle', cat: 'basics', level: 'beginner',
    steps: [
      { label: 'Draw the flat bottom', strokes: [F(_L(110, 290, 290, 290))] },
      { label: 'Up the left side to the peak', strokes: [F(_L(110, 290, 200, 120))] },
      { label: 'Down the right side to close it', strokes: [F(_L(200, 120, 290, 290))] },
    ],
  },
  {
    id: 'heart', title: 'Heart', cat: 'basics', level: 'beginner',
    steps: [
      { label: 'Lightly mark the top dip and the point', strokes: [G(_L(200, 178, 200, 200)), G(_L(200, 270, 200, 298))] },
      { label: 'Draw the left hump down to the point', strokes: [F('M200 188C188 150 145 148 132 178C122 205 165 240 200 295')] },
      { label: 'Draw the right hump to meet it', strokes: [F('M200 188C212 150 255 148 268 178C278 205 235 240 200 295')] },
    ],
  },
  {
    id: 'sun', title: 'Sunshine', cat: 'nature', level: 'beginner',
    steps: [
      { label: 'Draw the round sun', strokes: [F(_C(200, 200, 68))] },
      { label: 'Add rays all the way around', strokes: [F(_L(280, 200, 320, 200)), F(_L(257, 143, 285, 115)), F(_L(200, 120, 200, 80)), F(_L(143, 143, 115, 115)), F(_L(120, 200, 80, 200)), F(_L(143, 257, 115, 285)), F(_L(200, 280, 200, 320)), F(_L(257, 257, 285, 285))] },
      { label: 'Add a happy little face', strokes: [F(_C(180, 190, 6)), F(_C(220, 190, 6)), F('M175 215Q200 240 225 215')] },
    ],
  },
  {
    id: 'ladybug', title: 'Ladybug', cat: 'animals', level: 'beginner',
    steps: [
      { label: 'Draw the round body', strokes: [F(_C(200, 220, 90))] },
      { label: 'Add the head at the top', strokes: [F('M150 165Q200 120 250 165')] },
      { label: 'Draw the line down the middle', strokes: [F(_L(200, 135, 200, 308))] },
      { label: 'Add the spots', strokes: [F(_C(155, 205, 15)), F(_C(245, 205, 15)), F(_C(165, 260, 12)), F(_C(235, 260, 12)), F(_C(200, 182, 11))] },
      { label: 'Add the antennae', strokes: [F(_L(182, 128, 170, 98)), F(_C(170, 95, 6)), F(_L(218, 128, 230, 98)), F(_C(230, 95, 6))] },
    ],
  },
  {
    id: 'ice-cream', title: 'Ice Cream', cat: 'things', level: 'beginner',
    steps: [
      { label: 'Draw the cone', strokes: [F(_P([165, 250], [200, 360], [235, 250]))] },
      { label: 'Add the criss-cross lines', strokes: [F(_L(178, 278, 205, 251)), F(_L(192, 300, 232, 262)), F(_L(222, 278, 195, 251)), F(_L(208, 300, 168, 262))] },
      { label: 'Add the first scoop', strokes: [F(_C(178, 228, 42))] },
      { label: 'Add a second scoop on top', strokes: [F(_C(222, 182, 38))] },
      { label: 'Top it with a cherry', strokes: [F(_C(222, 138, 12)), F(_L(222, 127, 232, 110))] },
    ],
  },
  {
    id: 'sailboat', title: 'Sailboat', cat: 'things', level: 'beginner',
    steps: [
      { label: 'Draw the wavy water', strokes: [F('M70 300Q110 285 150 300Q190 315 230 300Q270 285 330 300')] },
      { label: 'Draw the boat hull', strokes: [F('M115 295L285 295L255 335L145 335Z')] },
      { label: 'Stand up the mast', strokes: [F(_L(200, 295, 200, 120))] },
      { label: 'Add the big sail', strokes: [F(_P([208, 130], [208, 278], [300, 278]))] },
      { label: 'Add the small sail', strokes: [F(_P([192, 155], [192, 278], [120, 278]))] },
    ],
  },
  {
    id: 'balloon', title: 'Balloon', cat: 'things', level: 'beginner',
    steps: [
      { label: 'Draw the round balloon', strokes: [F(_E(200, 170, 78, 95))] },
      { label: 'Add the little knot', strokes: [F(_P([190, 262], [200, 278], [210, 262]))] },
      { label: 'Draw the wavy string', strokes: [F('M200 278Q222 318 196 350Q174 376 200 396')] },
      { label: 'Add a shiny highlight', strokes: [F('M165 132Q150 162 166 188')] },
    ],
  },
  {
    id: 'dog', title: 'Puppy Face', cat: 'animals', level: 'beginner',
    steps: [
      { label: 'Draw a round head', strokes: [F(_C(200, 205, 92))] },
      { label: 'Add two floppy ears', strokes: [F(_E(118, 215, 30, 58)), F(_E(282, 215, 30, 58))] },
      { label: 'Add the eyes', strokes: [F(_C(170, 192, 11)), F(_C(230, 192, 11))] },
      { label: 'Draw the nose', strokes: [F(_E(200, 228, 16, 12))] },
      { label: 'Add the mouth and tongue', strokes: [F('M200 240V258M200 258Q172 280 162 260M200 258Q228 280 238 260'), F('M192 268Q200 290 208 268')] },
    ],
  },
  {
    id: 'owl', title: 'Wise Owl', cat: 'animals', level: 'intermediate',
    steps: [
      { label: 'Draw the body — an egg shape', strokes: [F(_E(200, 215, 92, 118))] },
      { label: 'Add two big eye circles', strokes: [F(_C(165, 165, 40)), F(_C(235, 165, 40))] },
      { label: 'Add the pupils', strokes: [F(_C(165, 172, 15)), F(_C(235, 172, 15))] },
      { label: 'Draw the pointy beak', strokes: [F(_P([186, 198], [200, 228], [214, 198]))] },
      { label: 'Add the ear tufts', strokes: [F(_P([118, 108], [145, 150], [175, 120])), F(_P([282, 108], [255, 150], [225, 120]))] },
      { label: 'Draw the wings on each side', strokes: [F('M115 205Q100 285 150 322'), F('M285 205Q300 285 250 322')] },
      { label: 'Add the feet and a tummy line', strokes: [F(_L(178, 330, 178, 352)), F(_L(192, 330, 192, 352)), F(_L(208, 330, 208, 352)), F(_L(222, 330, 222, 352)), F('M150 235Q200 270 250 235')] },
    ],
  },
  {
    id: 'car', title: 'Little Car', cat: 'things', level: 'intermediate',
    steps: [
      { label: 'Draw the lower body', strokes: [F('M80 235H320V275H80Z')] },
      { label: 'Add the curved roof', strokes: [F('M135 235Q165 185 240 185Q275 185 285 235')] },
      { label: 'Add the windows', strokes: [F(_L(205, 192, 205, 235)), F(_L(150, 232, 265, 232))] },
      { label: 'Draw the two wheels', strokes: [F(_C(140, 278, 28)), F(_C(280, 278, 28))] },
      { label: 'Add hubs, a light and a door', strokes: [F(_C(140, 278, 11)), F(_C(280, 278, 11)), F(_C(312, 250, 8)), F(_L(210, 240, 210, 272))] },
    ],
  },
  {
    id: 'turtle', title: 'Sea Turtle', cat: 'animals', level: 'intermediate',
    steps: [
      { label: 'Draw the shell dome', strokes: [F('M115 250Q200 150 285 250')] },
      { label: 'Close the bottom of the shell', strokes: [F('M115 250Q200 285 285 250')] },
      { label: 'Add the head', strokes: [F(_C(312, 232, 26))] },
      { label: 'Add the eye and a smile', strokes: [F(_C(320, 224, 5)), F('M298 240Q312 250 326 240')] },
      { label: 'Draw the four flippers', strokes: [F(_E(145, 265, 28, 16)), F(_E(255, 265, 28, 16)), F(_E(170, 205, 16, 24)), F(_E(245, 205, 16, 24))] },
      { label: 'Add the shell pattern', strokes: [F(_P([200, 165], [160, 225], [200, 255], [240, 225], [200, 165])), F(_L(160, 225, 130, 235)), F(_L(240, 225, 270, 235)), F(_L(200, 255, 200, 283))] },
    ],
  },
  {
    id: 'tree', title: 'Leafy Tree', cat: 'nature', level: 'intermediate',
    steps: [
      { label: 'Draw the trunk', strokes: [F('M180 360L186 250'), F('M220 360L214 250'), F(_L(180, 360, 220, 360))] },
      { label: 'Add the branches', strokes: [F('M200 280Q160 240 138 212'), F('M200 280Q240 240 262 212'), F(_L(200, 300, 200, 180))] },
      { label: 'Draw the leafy cloud top', strokes: [F('M125 200Q105 150 155 142Q165 102 212 112Q262 98 276 148Q318 160 292 206Q298 242 250 236Q200 250 152 236Q112 234 125 200Z')] },
      { label: 'Add a couple of apples', strokes: [F(_C(170, 180, 8)), F(_C(235, 200, 8))] },
    ],
  },
  {
    id: 'castle', title: 'Castle', cat: 'places', level: 'advanced',
    steps: [
      { label: 'Draw the main wall', strokes: [F('M150 200H250V330H150Z')] },
      { label: 'Add the two towers', strokes: [F('M110 170H150V330H110Z'), F('M250 170H290V330H250Z')] },
      { label: 'Add battlements along the tops', strokes: [F('M110 170V155H120V165H132V155H142V165H150'), F('M250 170V155H260V165H272V155H282V165H290'), F('M150 200V188H162V198H174V188H186V198H198V188H210V198H222V188H234V198H246V188H250')] },
      { label: 'Add tower roofs and flags', strokes: [F(_P([105, 155], [130, 110], [155, 155])), F(_P([245, 155], [270, 110], [295, 155])), F('M130 110V86L152 95L130 102'), F('M270 110V86L292 95L270 102')] },
      { label: 'Draw the arched gate', strokes: [F('M178 330V250Q200 232 222 250V330')] },
      { label: 'Add windows', strokes: [F('M122 210H138V236H122Z'), F('M262 210H278V236H262Z')] },
    ],
  },
  {
    id: 'mandala', title: 'Mandala', cat: 'basics', level: 'advanced',
    steps: [
      { label: 'Start with the center circle', strokes: [F(_C(200, 200, 26))] },
      { label: 'Add the first ring', strokes: [F(_C(200, 200, 62))] },
      { label: 'Draw a ring of petals', strokes: [F(_E(200, 138, 16, 28)), F(_E(244, 156, 28, 16)), F(_E(262, 200, 16, 28)), F(_E(244, 244, 28, 16)), F(_E(200, 262, 16, 28)), F(_E(156, 244, 28, 16)), F(_E(138, 200, 16, 28)), F(_E(156, 156, 28, 16))] },
      { label: 'Add the outer ring', strokes: [F(_C(200, 200, 118))] },
      { label: 'Draw the spokes', strokes: [F(_L(200, 82, 200, 318)), F(_L(82, 200, 318, 200)), F(_L(117, 117, 283, 283)), F(_L(283, 117, 117, 283))] },
      { label: 'Finish with outer dots', strokes: [F(_C(200, 200, 152)), F(_C(200, 48, 8)), F(_C(200, 352, 8)), F(_C(48, 200, 8)), F(_C(352, 200, 8))] },
    ],
  },
  {
    id: 'rose', title: 'Rose', cat: 'nature', level: 'advanced',
    steps: [
      { label: 'Draw the spiral bud', strokes: [F('M200 178C214 171 226 185 218 199C208 215 184 207 184 189C184 165 214 159 232 177')] },
      { label: 'Cup the bud with a petal', strokes: [F('M168 203C160 178 185 161 200 168C215 161 240 178 232 203')] },
      { label: 'Add the side petals', strokes: [F('M165 208Q150 238 175 253Q195 245 195 218'), F('M235 208Q250 238 225 253Q205 245 205 218')] },
      { label: 'Draw the outer bloom', strokes: [F('M150 218Q120 253 160 278Q140 303 180 303Q200 323 220 303Q260 303 240 278Q280 253 250 218')] },
      { label: 'Add the stem', strokes: [F('M200 303L200 382')] },
      { label: 'Add two leaves with veins', strokes: [F('M200 337Q150 327 130 362Q185 374 200 347'), F('M155 344Q178 352 195 354'), F('M200 360Q250 350 270 385Q215 395 200 368'), F('M245 374Q222 368 205 368')] },
    ],
  },
];

const LESSON_CATS = [
  { id: 'basics', label: 'Basics', emoji: '✏️' },
  { id: 'animals', label: 'Animals', emoji: '🐾' },
  { id: 'nature', label: 'Nature', emoji: '🌿' },
  { id: 'things', label: 'Things', emoji: '🎈' },
  { id: 'places', label: 'Places', emoji: '🏠' },
];

// Static thumbnail = all FINAL strokes drawn (no construction guides).
function lessonThumb(lesson) {
  const d = lesson.steps.flatMap(s => s.strokes.filter(k => !k.c).map(k => k.d)).join(' ');
  return `<svg viewBox="0 0 ${LV} ${LV}" xmlns="http://www.w3.org/2000/svg">
    <path d="${d}" fill="none" stroke="#1b1b1b" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

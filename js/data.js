/* ColorVerse — static data, icons, and procedural line-art coloring pages */
const ICONS = {
  search:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>`,
  discover:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>`,
  generate:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2 2M16.4 16.4l2 2M18.4 5.6l-2 2M7.6 16.4l-2 2"/><circle cx="12" cy="12" r="3"/></svg>`,
  gallery:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>`,
  profile:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>`,
  back:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 6-6 6 6 6"/></svg>`,
  close:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>`,
  undo:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 7 4 12l5 5"/><path d="M4 12h11a5 5 0 0 1 0 10h-1"/></svg>`,
  redo:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 7 5 5-5 5"/><path d="M20 12H9a5 5 0 0 0 0 10h1"/></svg>`,
  layers:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="m3 13 9 5 9-5M3 17l9 5 9-5" opacity=".6"/></svg>`,
  heart:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7-4.5-9.5-9C1 9 2.5 5.5 6 5.5c2 0 3.2 1.2 4 2.3.8-1.1 2-2.3 4-2.3 3.5 0 5 3.5 3.5 6.5C19 16.5 12 21 12 21Z"/></svg>`,
  crown:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 7l4 4 5-6 5 6 4-4-2 12H5L3 7Z"/></svg>`,
  brush:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4 20 10 9 21l-5 1 1-5L14 4Z"/></svg>`,
  eraser:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16 13 7l5 5-9 9H7l-3-3Z"/><path d="M9 21h11"/></svg>`,
  fill:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 3 4 10l7 7 7-7-7-7Z"/><path d="M4 10h14"/><path d="M20 16c0 1.5-2 3-2 3"/></svg>`,
  picker:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 6 3 3"/><path d="M18 3 21 6 9 18l-4 1 1-4L18 3Z"/></svg>`,
  zoom:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3M8 11h6M11 8v6"/></svg>`,
  zoomOut:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3M8 11h6"/></svg>`,
  magic:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 19 9-9"/><path d="M14 6h.01M18 10h.01M19 4h.01M9 4h.01"/><path d="m16 4 1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z"/></svg>`,
  download:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0 4-4m-4 4-4-4"/><path d="M5 21h14"/></svg>`,
  share:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5 8.6 10.5"/></svg>`,
  image:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>`,
  sparkle:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 2.2 6.2L20 10l-5.8 1.8L12 18l-2.2-6.2L4 10l5.8-1.8L12 2Z"/></svg>`,
};

const CATEGORIES = [
  {id:'animals',label:'Animals',emoji:'🐾'},
  {id:'nature',label:'Nature',emoji:'🌿'},
  {id:'fantasy',label:'Fantasy',emoji:'🦄'},
  {id:'mandala',label:'Mandala',emoji:'🌀'},
  {id:'patterns',label:'Patterns',emoji:'🔷'},
  {id:'more',label:'More',emoji:'⋯'},
];

const STYLES = [
  {id:'cartoon',label:'Cartoon',ic:'🦊'},
  {id:'anime',label:'Anime',ic:'🐱'},
  {id:'lineart',label:'Line Art',ic:'🐺'},
  {id:'sketch',label:'Sketch',ic:'✏️'},
  {id:'realistic',label:'Realistic',ic:'🐈'},
];

const COMPLEXITY = [
  {id:'beginner',t:'Beginner',s:'Simple shapes'},
  {id:'intermediate',t:'Intermediate',s:'Moderate detail'},
  {id:'advanced',t:'Advanced',s:'High detail'},
];

const PALETTE = ['#1c1f2e','#5b6072','#ff5b7f','#ff3b3b','#FFB84D','#ffd34d',
  '#28C76F','#7ed957','#37b6ff','#5B67FF','#9b6bff','#b06a4a','#ffffff','#f3a8c0'];

/* ---------- Procedural line-art (black outline on white) ---------- */
const W = 700, H = 700;
function page(inner, bg){
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${bg||'#fff'}"/>
  <g fill="none" stroke="#1b1b1b" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${inner}</g></svg>`;
}

const LINEART = {
  fox: page(`
    <ellipse cx="350" cy="430" rx="120" ry="150"/>
    <path d="M250 320 L210 200 L300 280"/><path d="M450 320 L490 200 L400 280"/>
    <circle cx="350" cy="360" r="120"/>
    <circle cx="312" cy="345" r="10" fill="#1b1b1b"/><circle cx="388" cy="345" r="10" fill="#1b1b1b"/>
    <path d="M335 390 q15 14 30 0"/>
    <path d="M350 375 l-14 12 14 8 14-8z"/>
    <path d="M300 430 q50 40 100 0"/>
    <path d="M470 470 q120 20 90 150 q-50 -40 -110 -60"/>
    <path d="M250 560 v60 M330 580 v60 M410 580 v60 M470 560 v60"/>
    <circle cx="180" cy="160" r="34"/><path d="M560 200 l10 26 28 4-20 20 6 28-24-14-24 14 6-28-20-20 28-4z"/>`),

  cat: page(`
    <circle cx="350" cy="360" r="150"/>
    <path d="M220 250 L180 130 L300 230"/><path d="M480 250 L520 130 L400 230"/>
    <circle cx="305" cy="345" r="14" fill="#1b1b1b"/><circle cx="395" cy="345" r="14" fill="#1b1b1b"/>
    <path d="M350 380 l-16 14 16 10 16-10z"/>
    <path d="M334 404 q16 16 32 0"/>
    <path d="M250 380 h-70 M250 400 h-70 M450 380 h70 M450 400 h70"/>
    <ellipse cx="350" cy="560" rx="120" ry="90"/>
    <path d="M300 640 q50 30 100 0"/>
    <path d="M470 560 q120 30 80 140"/>`),

  house: page(`
    <path d="M150 350 L350 180 L550 350"/>
    <rect x="190" y="350" width="320" height="240"/>
    <rect x="310" y="470" width="80" height="120"/>
    <rect x="230" y="390" width="70" height="70"/><rect x="400" y="390" width="70" height="70"/>
    <path d="M265 390 v70 M230 425 h70 M435 390 v70 M400 425 h70"/>
    <path d="M120 590 h470"/>
    <circle cx="560" cy="180" r="45"/>
    <path d="M120 520 q30 -50 60 0 M150 520 v70"/>
    <path d="M90 560 q-20 -30 0 -50 q20 20 0 50"/>`),

  mandala: page(`
    <circle cx="350" cy="350" r="40"/><circle cx="350" cy="350" r="80"/>
    <circle cx="350" cy="350" r="130"/><circle cx="350" cy="350" r="190"/><circle cx="350" cy="350" r="250"/>
    ${Array.from({length:12}).map((_,i)=>{const a=i*30*Math.PI/180;const x1=350+80*Math.cos(a),y1=350+80*Math.sin(a);const x2=350+250*Math.cos(a),y2=350+250*Math.sin(a);const px=350+160*Math.cos(a),py=350+160*Math.sin(a);return `<path d="M${x1} ${y1} L${x2} ${y2}"/><circle cx="${px}" cy="${py}" r="22"/>`}).join('')}
    ${Array.from({length:12}).map((_,i)=>{const a=(i*30+15)*Math.PI/180;const x=350+220*Math.cos(a),y=350+220*Math.sin(a);return `<path d="M${x} ${y} l0 0" /><circle cx="${x}" cy="${y}" r="14"/>`}).join('')}`),

  flower: page(`
    ${Array.from({length:8}).map((_,i)=>{const a=i*45*Math.PI/180;const x=350+130*Math.cos(a),y=300+130*Math.sin(a);return `<ellipse cx="${x}" cy="${y}" rx="55" ry="90" transform="rotate(${i*45} ${x} ${y})"/>`}).join('')}
    <circle cx="350" cy="300" r="70"/>
    <path d="M350 370 Q360 520 350 640"/>
    <path d="M350 470 Q260 440 230 520 Q320 540 350 500"/>
    <path d="M350 540 Q450 510 480 590 Q380 600 350 560"/>`),

  butterfly: page(`
    <path d="M350 230 v260"/>
    <circle cx="350" cy="220" r="20"/>
    <path d="M340 210 q-30 -50 -60 -40 M360 210 q30 -50 60 -40"/>
    <path d="M345 270 Q180 170 150 300 Q160 420 345 380 Z"/>
    <path d="M355 270 Q520 170 550 300 Q540 420 355 380 Z"/>
    <path d="M345 390 Q220 380 210 480 Q260 560 345 470 Z"/>
    <path d="M355 390 Q480 380 490 480 Q440 560 355 470 Z"/>
    <circle cx="240" cy="300" r="26"/><circle cx="460" cy="300" r="26"/>
    <circle cx="270" cy="470" r="18"/><circle cx="430" cy="470" r="18"/>`),

  dino: page(`
    <path d="M180 480 Q150 300 300 260 Q360 250 400 290 Q470 240 470 300 Q470 350 420 360"/>
    <path d="M420 360 Q520 380 560 470 Q580 560 500 600"/>
    <path d="M180 480 Q170 560 230 600"/>
    <path d="M230 600 h270"/>
    <path d="M230 600 v-40 M300 600 v-50 M380 600 v-50 M460 600 v-40"/>
    <circle cx="300" cy="300" r="9" fill="#1b1b1b"/>
    <path d="M300 470 l30-30 30 30 30-30 30 30"/>
    <path d="M280 300 q-20 -40 -50 -30 M330 290 q-10 -45 20 -55"/>`),

  unicorn: page(`
    <ellipse cx="340" cy="430" rx="120" ry="100"/>
    <path d="M300 360 Q260 250 320 200 Q360 170 410 200 Q440 240 420 320"/>
    <path d="M360 180 l-12 -90 40 70 z"/>
    <path d="M320 210 q-30 -10 -50 30 q40 -5 55 10"/>
    <path d="M390 210 q60 -30 90 30 q-50 0 -70 30"/>
    <circle cx="330" cy="300" r="8" fill="#1b1b1b"/>
    <path d="M250 480 v90 M330 500 v90 M390 500 v90 M450 480 v90"/>
    <path d="M460 410 q90 0 110 120 q-60 -30 -100 -50"/>`),

  rocket: page(`
    <path d="M350 120 Q430 220 430 420 L270 420 Q270 220 350 120 Z"/>
    <circle cx="350" cy="280" r="40"/>
    <path d="M270 420 Q200 440 210 540 L270 480 Z"/>
    <path d="M430 420 Q500 440 490 540 L430 480 Z"/>
    <path d="M300 480 Q350 600 400 480"/>
    <path d="M330 540 q20 50 0 90 M370 540 q-20 50 0 90 M350 540 v100"/>
    <circle cx="160" cy="200" r="10"/><circle cx="540" cy="160" r="14"/><circle cx="560" cy="320" r="8"/>`),

  bear: page(`
    <circle cx="350" cy="360" r="150"/>
    <circle cx="235" cy="245" r="50"/><circle cx="465" cy="245" r="50"/>
    <circle cx="305" cy="345" r="13" fill="#1b1b1b"/><circle cx="395" cy="345" r="13" fill="#1b1b1b"/>
    <ellipse cx="350" cy="410" rx="55" ry="42"/>
    <path d="M350 380 v30 M350 410 q-22 22 -45 10 M350 410 q22 22 45 10"/>
    <path d="M250 520 q100 60 200 0"/>
    <circle cx="350" cy="560" r="6"/>`),
};

const SAMPLE_PAGES = [
  {id:'cat',title:'Kitten',cat:'animals'},
  {id:'house',title:'Cozy Cottage',cat:'nature'},
  {id:'mandala',title:'Mandala',cat:'mandala'},
  {id:'bear',title:'Teddy Bear',cat:'animals'},
  {id:'flower',title:'Blossom',cat:'nature'},
  {id:'butterfly',title:'Butterfly',cat:'animals'},
  {id:'dino',title:'Dino',cat:'fantasy'},
  {id:'unicorn',title:'Unicorn',cat:'fantasy'},
  {id:'rocket',title:'Rocket',cat:'fantasy'},
  {id:'fox',title:'Magic Fox',cat:'animals'},
];

const KIDS_CATS = [
  {id:'animals',label:'Animals',emoji:'🐼',pages:['lion','panda','rabbit','turtle','penguin','cat-yarn']},
  {id:'dinosaurs',label:'Dinosaurs',emoji:'🦕',pages:['trex','stegosaurus','brachiosaurus']},
  {id:'unicorns',label:'Unicorns',emoji:'🦄',pages:['unicorn','fairy','mermaid','butterfly-garden']},
  {id:'vehicles',label:'Vehicles',emoji:'🚗',pages:['car','rocket','train','airplane','fire-truck','tractor']},
];

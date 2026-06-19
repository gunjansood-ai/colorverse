/* ColorVerse — app shell, router, and screens */
(function () {
  const app = document.getElementById('app');
  const store = {
    user: { name: 'Gunjan', initial: 'G', tier: 'Free' },
    gallery: loadGallery(),
    gen: { prompt: '', style: 'cartoon', complexity: 'beginner' },
  };

  /* ---------------- utilities ---------------- */
  function svgThumb(id) { return LINEART[id] || LINEART.cat; }
  function kidsThumb(id) {
    return (typeof CATALOG !== 'undefined' && CATALOG.find(x => x.id === id))
      ? `<img src="${catImg(id)}" loading="lazy" alt=""/>` : svgThumb(id);
  }
  function toast(msg) {
    const host = document.getElementById('toast-host');
    const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
    host.appendChild(t); setTimeout(() => t.remove(), 2200);
  }
  function loadGallery() {
    try { return JSON.parse(localStorage.getItem('cv_gallery') || '[]'); } catch (e) { return []; }
  }
  function saveGallery() { try { localStorage.setItem('cv_gallery', JSON.stringify(store.gallery)); } catch (e) {} }
  function go(route) { location.hash = route; }

  /* ---------------- navigation tab bar ---------------- */
  function tabbar(active) {
    const tabs = [['discover','Discover','discover'],['generate','Generate','generate'],
      ['gallery','Gallery','gallery'],['profile','Profile','profile']];
    return `<nav class="tabbar">${tabs.map(([r,l,ic]) =>
      `<button class="${active===r?'active':''}" onclick="location.hash='#/${r}'">${ICONS[ic]}<span>${l}</span></button>`).join('')}</nav>`;
  }
  function appbar(title, opts = {}) {
    return `<header class="appbar">
      ${opts.back ? `<button class="icon-btn" onclick="history.back()">${ICONS.back}</button>` : ''}
      <div class="title">${title}</div>
      <button class="icon-btn crown" title="Go Premium" onclick="CV.premium()">${ICONS.crown}</button>
      <button class="icon-btn" title="Kids Mode" onclick="location.hash='#/kids'">🧒</button>
      <div class="avatar">${store.user.initial}</div>
    </header>`;
  }

  /* ---------------- LANDING ---------------- */
  function Landing() {
    return `<div class="landing">
      <div class="left">
        <div class="brand"><div class="logo">🎨</div><h1>ColorVerse</h1></div>
        <div class="tag">Imagine. Color. Share.</div>
        <p style="max-width:380px">AI-powered coloring made simple for everyone. Generate coloring pages from a prompt, turn photos into line art, and color with realistic brushes.</p>
        <div style="display:flex;flex-direction:column;gap:12px;max-width:340px">
          <button class="btn btn-primary btn-block" onclick="location.hash='#/discover'">Get Started</button>
          <button class="btn btn-ghost btn-block" onclick="location.hash='#/discover'">I have an account</button>
        </div>
        <div class="feat-strip">
          ${[['AI Powered','Generate anything','sparkle'],['Realistic Brushes','Natural tools','brush'],
             ['Layers','Build your art','layers'],['Share Anywhere','Export & print','share'],
             ['Made for Everyone','Kids to pros','heart']].map(([t,s,ic]) =>
            `<div class="feat"><div class="fic">${ICONS[ic]}</div><div><b>${t}</b><span>${s}</span></div></div>`).join('')}
        </div>
      </div>
      <div class="right">
        <div style="text-align:center">
          <div style="width:280px;height:280px;background:#fff;border-radius:24px;box-shadow:var(--shadow-lg);padding:12px;margin:auto">
            ${svgThumb('fox')}
          </div>
          <p style="margin-top:16px;font-weight:600;color:var(--primary)">Cute fox in a magical forest</p>
        </div>
      </div>
    </div>`;
  }

  /* ---------------- DISCOVER ---------------- */
  function Discover() {
    const sel = store.browseCat || 'all';
    const featured = CATALOG.slice(0, 6);
    const browse = sel === 'all' ? CATALOG : CATALOG.filter(p => p.cat === sel);
    return `<div class="screen">
      ${appbar('Home / Discover')}
      <div class="container">
        <div class="search">${ICONS.search}<input value="${store.q||''}" placeholder="Search ${CATALOG.length} coloring pages…" oninput="CV.search(this.value)"/></div>
        <div class="cards grid-2" style="margin-top:16px">
          <div class="hero-card hero-gen" onclick="location.hash='#/generate'">
            <div><h3>AI Generate</h3><p>Create any coloring page with a prompt</p></div>
            <span class="emoji">✨</span>
          </div>
          <div class="hero-card hero-import" onclick="CV.import()">
            <div><h3>Import Image</h3><p>Turn any image into a coloring page</p></div>
            <span class="emoji">🖼️</span>
          </div>
        </div>
        <div class="chips" style="margin-top:18px">
          <div class="chip-cat" onclick="CV.browse('all')">
            <div class="bubble" style="${sel==='all'?'border-color:var(--primary);color:var(--primary)':''}">✨</div><span>All</span></div>
          ${CAT_META.map(c => `<div class="chip-cat" onclick="CV.browse('${c.id}')">
            <div class="bubble" style="${sel===c.id?'border-color:var(--primary);color:var(--primary)':''}">${c.emoji}</div><span>${c.label}</span></div>`).join('')}
        </div>
        <div class="section-head"><h3>Featured For You</h3><a class="see-all" onclick="CV.browse('all')">See All</a></div>
        <div class="cards grid-3">${featured.map(p => tile(p.id, p.title, p.level)).join('')}</div>
        <div class="section-head"><h3>${sel==='all' ? 'Browse All Pages' : (CAT_META.find(c=>c.id===sel)||{}).label} <span class="badge" style="margin-left:6px">${browse.length}</span></h3></div>
        <div class="cards grid-3">${browse.map(p => tile(p.id, p.title, p.level)).join('')}</div>
      </div>
      ${tabbar('discover')}
    </div>`;
  }
  // tile: catalog items render their AI image; built-in svg pages render the svg
  function tile(id, title, level) {
    const c = CATALOG.find(x => x.id === id);
    const thumb = c ? `<img src="${catImg(id)}" loading="lazy" alt="${title||''}"/>` : svgThumb(id);
    const badge = level ? `<span class="lvl-badge">${level[0].toUpperCase()}</span>` : '';
    return `<div class="tile" onclick="CV.open('${id}')">
      <div class="thumb">${thumb}<div class="heart">${ICONS.heart}</div>${badge}</div>
      <div class="cap">${title || (c && c.title) || 'Coloring Page'}</div>
    </div>`;
  }

  /* ---------------- GENERATE ---------------- */
  function Generate() {
    const g = store.gen;
    return `<div class="screen">
      ${appbar('Generate', { back: true })}
      <div class="container" style="max-width:640px">
        <div class="field-label">Describe what you want to create</div>
        <textarea class="prompt-box" id="genPrompt" oninput="CV.savePrompt(this.value)" placeholder="e.g. Cute baby Hanuman eating mangoes">${g.prompt}</textarea>
        <div class="field-label">Choose Style</div>
        <div class="style-row">
          ${STYLES.map(s => `<div class="style-card ${g.style===s.id?'active':''}" onclick="CV.setStyle('${s.id}')">
            <div class="ic">${s.ic}</div>${s.label}</div>`).join('')}
        </div>
        <div class="field-label">Complexity</div>
        <div class="complexity">
          ${COMPLEXITY.map(c => `<div class="cx-card ${g.complexity===c.id?'active':''}" onclick="CV.setCx('${c.id}')">
            <div class="t">${c.t}</div><div class="s">${c.s}</div></div>`).join('')}
        </div>
        <button class="btn btn-primary btn-block" style="margin-top:24px" onclick="CV.generate()">Generate ✨</button>
        <p style="text-align:center;font-size:12px;margin-top:10px">Free tier: limited generations · <a class="see-all" onclick="CV.premium()">Go unlimited</a></p>
      </div>
      ${tabbar('generate')}
    </div>`;
  }

  /* ---------------- GALLERY ---------------- */
  function Gallery() {
    const items = store.gallery;
    return `<div class="screen">
      ${appbar('Gallery')}
      <div class="container">
        <div class="seg" style="margin-bottom:16px">
          <button class="active">Recent</button><button onclick="CV.toast('Favorites')">Favorites</button>
          <button onclick="CV.toast('Collections')">Collections</button>
        </div>
        ${items.length ? `<div class="cards grid-3">${items.map((it,i) => `
          <div class="tile" onclick="CV.openSaved(${i})">
            <div class="thumb"><img src="${it.thumb}"/><div class="heart">${ICONS.heart}</div></div>
            <div class="cap">${it.title}</div>
          </div>`).join('')}</div>`
        : `<div style="text-align:center;padding:60px 0;color:var(--ink-3)">
            <div style="font-size:48px">🎨</div>
            <p>No saved artwork yet.<br/>Color a page and tap Save.</p>
            <button class="btn btn-primary" style="margin-top:10px" onclick="location.hash='#/discover'">Browse pages</button>
          </div>`}
        <div class="section-head"><h3>Template Library</h3><span class="badge">${CATALOG.length} pages</span></div>
        <div class="cards grid-3">${CATALOG.map(p => tile(p.id,p.title,p.level)).join('')}</div>
      </div>
      ${tabbar('gallery')}
    </div>`;
  }

  /* ---------------- PROFILE ---------------- */
  function Profile() {
    return `<div class="screen">
      ${appbar('Profile')}
      <div class="container" style="max-width:560px">
        <div style="display:flex;align-items:center;gap:14px;background:#fff;border:1px solid var(--line);border-radius:16px;padding:18px">
          <div class="avatar" style="width:56px;height:56px;font-size:22px">${store.user.initial}</div>
          <div><h3>${store.user.name}</h3><span class="badge">${store.user.tier} plan</span></div>
        </div>
        <div class="section-head"><h3>Subscription</h3></div>
        ${planCard('Free','$0','Basic pages, basic brushes, limited AI', store.user.tier==='Free')}
        ${planCard('Premium','$9.99/mo','Unlimited AI, advanced brushes, layers, HD & time-lapse', store.user.tier==='Premium')}
        ${planCard('Creator','$19.99/mo','Commercial rights, batch generation, PDF coloring books', store.user.tier==='Creator')}
        <div class="section-head"><h3>Settings</h3></div>
        <div style="background:#fff;border:1px solid var(--line);border-radius:16px;overflow:hidden">
          ${['Storage · ' + store.gallery.length + ' projects','Export History','Print Mode (Letter / A4 / A5)','Kids Mode & Parent Controls','Account Settings'].map(s =>
            `<div style="padding:15px 18px;border-bottom:1px solid var(--line);font-weight:600" onclick="CV.toast('${s.split(' ·')[0]}')">${s}</div>`).join('')}
        </div>
      </div>
      ${tabbar('profile')}
    </div>`;
  }
  function planCard(name, price, desc, active) {
    return `<div style="background:#fff;border:2px solid ${active?'var(--primary)':'var(--line)'};border-radius:16px;padding:16px;margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <h3>${name}</h3><strong style="color:var(--primary)">${price}</strong></div>
      <p style="margin:6px 0 0;font-size:14px">${desc}</p>
      ${active ? '<span class="badge" style="margin-top:8px">Current plan</span>'
        : `<button class="btn btn-primary btn-sm" style="margin-top:10px" onclick="CV.upgrade('${name}')">Upgrade</button>`}
    </div>`;
  }

  /* ---------------- KIDS MODE ---------------- */
  function Kids() {
    return `<div class="kids">
      <header class="appbar">
        <button class="icon-btn" onclick="location.hash='#/discover'">${ICONS.back}</button>
        <div class="title" style="color:var(--success)">🛡️ Kids Mode</div>
        <button class="icon-btn" onclick="CV.toast('Parent controls')">⚙️</button>
      </header>
      <div class="container">
        <h2>Let's have fun coloring! 🎉</h2>
        <div class="field-label" style="text-align:center">Pick a category</div>
        <div class="cards grid-4">
          ${KIDS_CATS.map(c => `<div class="cat" onclick="CV.kidsCat('${c.id}')">
            <div class="big">${c.emoji}</div>${c.label}</div>`).join('')}
        </div>
        <div class="field-label" style="text-align:center">Pick a page</div>
        <div class="cards grid-4" id="kidsPages">
          ${KIDS_CATS[0].pages.map(id => `<div class="tile" onclick="CV.open('${id}', true)">
            <div class="thumb">${kidsThumb(id)}</div></div>`).join('')}
        </div>
      </div>
    </div>`;
  }

  /* ---------------- EDITOR ---------------- */
  let ED = null, currentTitle = 'Untitled', kidsFlag = false;
  function openEditor(pageId, kids, savedIndex) {
    kidsFlag = !!kids;
    const cItem = CATALOG.find(x => x.id === pageId);
    const p = cItem || SAMPLE_PAGES.find(x => x.id === pageId);
    currentTitle = p ? p.title : (pageId ? 'Coloring Page' : 'Imported');
    const el = document.createElement('div');
    el.className = 'editor'; el.id = 'editor';
    el.innerHTML = editorHTML(kids);
    document.body.appendChild(el);

    const stage = el.querySelector('#stage');
    ED = new ColorVerseEditor(stage);
    ED.onHistory = (u, r) => {
      el.querySelector('#btnUndo').disabled = !u;
      el.querySelector('#btnRedo').disabled = !r;
    };
    ED.onColorPick = (c) => { ED.color = c; syncSwatches(el, c); };
    ED.onZoom = (s) => { const lvl = document.getElementById('zoomLvl'); if (lvl) lvl.textContent = Math.round(s * 100) + '%'; };
    ED.color = PALETTE[9];

    if (savedIndex != null) loadSavedInto(savedIndex);
    else if (cItem) ED.loadImageAsLineArt(catImg(pageId));        // AI catalog page
    else if (pageId && LINEART[pageId]) ED.loadLineArt(LINEART[pageId]); // built-in svg
    else ED.loadLineArt(LINEART.cat);

    wireEditor(el, kids);
  }
  function closeEditor() { const e = document.getElementById('editor'); if (e) e.remove(); ED = null; }

  function editorHTML(kids) {
    const tools = [
      ['brush','Brush', ICONS.brush],
      ['eraser','Eraser', ICONS.eraser],
      ['fill','Fill', ICONS.fill],
      ['picker','Picker', ICONS.picker],
      ['zoom','Zoom', ICONS.zoom],
      ['magic','AI', ICONS.magic],
    ];
    const brushNames = { pencil:'Pencil', marker:'Marker', crayon:'Crayon', watercolor:'Watercolor',
      oil:'Oil Paint', airbrush:'Airbrush', glitter:'Glitter', metallic:'Metallic', texture:'Texture' };
    return `
      <div class="ed-top">
        <button class="icon-btn" onclick="CV.closeEditor()" title="Close">${ICONS.close}</button>
        <button class="icon-btn" id="btnUndo" disabled onclick="CV.ed('undo')">${ICONS.undo}</button>
        <button class="icon-btn" id="btnRedo" disabled onclick="CV.ed('redo')">${ICONS.redo}</button>
        <div class="title" style="font-family:var(--font-head);font-weight:700">${currentTitle}</div>
        <div class="sp"></div>
        <button class="icon-btn" onclick="CV.zoom(-1)" title="Zoom out">${ICONS.zoomOut}</button>
        <span id="zoomLvl" style="font-size:12px;font-weight:600;color:var(--ink-3);min-width:42px;text-align:center">100%</span>
        <button class="icon-btn" onclick="CV.zoom(1)" title="Zoom in">${ICONS.zoom}</button>
        <button class="btn btn-primary btn-sm" onclick="CV.save()" style="margin-left:6px">${ICONS.download}<span style="margin-left:4px">Save</span></button>
        <button class="btn btn-success btn-sm" onclick="CV.exportModal()" style="margin-left:6px">Export</button>
      </div>
      <div class="ed-body">
        <div class="ed-rail">
          ${tools.filter(t => !kids || ['brush','eraser','fill'].includes(t[0]))
            .map(([id,l,ic]) => `<button class="tool ${id==='brush'?'active':''}" data-tool="${id}" onclick="CV.tool('${id}')">${ic}<span>${l}</span></button>`).join('')}
          ${kids ? '' : `<div style="height:8px"></div>
            <select id="brushSel" onchange="CV.setBrush(this.value)" style="width:62px;font-size:10px;border-radius:10px;padding:6px 2px;border:1px solid var(--line)">
              ${Object.entries(brushNames).map(([v,n]) => `<option value="${v}" ${v==='crayon'?'selected':''}>${n}</option>`).join('')}
            </select>`}
        </div>
        <div class="canvas-wrap"><div id="stage"></div></div>
        ${kids ? '' : `<div class="ed-right">
          <div style="font-weight:700;font-size:12px;margin-bottom:8px">Layers</div>
          ${[['lineart','Line Art'],...CV_LAYERS.map(l => [l.id, l.name])].map(([id,name],i) =>
            `<div class="layer on ${id==='color'?'sel':''}" data-layer="${id}">
              <span class="eye" onclick="CV.toggleLayer('${id}',this)">👁</span>
              <span style="flex:1" onclick="CV.selectLayer('${id}',this)">${name}</span>
            </div>`).join('')}
          <div style="font-weight:700;font-size:12px;margin:14px 0 6px">AI Assist</div>
          <button class="btn btn-ghost btn-sm btn-block" style="margin-bottom:6px" onclick="CV.autoColor('pixar')">Auto Color</button>
          <button class="btn btn-ghost btn-sm btn-block" onclick="CV.suggest()">Suggest Palette</button>
        </div>`}
      </div>
      <div class="ed-bottom">
        <div class="swatches" id="swatches">
          ${PALETTE.map((c,i) => `<div class="sw ${i===9?'active':''}" style="background:${c}" data-c="${c}" onclick="CV.pickSwatch('${c}',this)"></div>`).join('')}
          <input type="color" value="#5B67FF" onchange="CV.pickSwatch(this.value)" style="width:30px;height:30px;border:none;background:none;border-radius:50%" title="Custom color"/>
        </div>
        <div class="controls">
          <label>Size <input type="range" min="2" max="80" value="24" oninput="CV.setSize(this.value)"/><span class="size-dot" id="sizeDot">24</span></label>
          ${kids ? '' : `<label>Opacity <input type="range" min="10" max="100" value="100" oninput="CV.setOpacity(this.value)"/></label>`}
        </div>
      </div>`;
  }

  function wireEditor(el, kids) {
    // nothing extra; handlers via CV.*
  }
  function syncSwatches(el, color) {
    el.querySelectorAll('.sw').forEach(s => s.classList.toggle('active', s.dataset.c === color));
  }
  function loadSavedInto(index) {
    const it = store.gallery[index];
    if (!it) return;
    // load line art if present, then overlay saved color image on color layer
    const finalize = () => {
      const img = new Image();
      img.onload = () => { ED.layers.color.getContext('2d').drawImage(img, 0, 0, 700, 700); ED._pushUndo(); };
      img.src = it.thumb;
    };
    if (it.lineId && LINEART[it.lineId]) ED.loadLineArt(LINEART[it.lineId]).then(finalize);
    else finalize();
  }

  /* ---------------- EXPORT MODAL ---------------- */
  function exportModal() {
    const m = document.createElement('div');
    m.className = 'modal-bg'; m.onclick = e => { if (e.target === m) m.remove(); };
    m.innerHTML = `<div class="modal">
      <span class="x" onclick="this.closest('.modal-bg').remove()">×</span>
      <h3>Share / Export</h3><p style="font-size:13px">Save your artwork or share it anywhere.</p>
      <div style="border-radius:14px;overflow:hidden;border:1px solid var(--line);margin:12px 0">
        <img id="exPreview" style="width:100%;display:block"/>
      </div>
      <div style="font-weight:700;font-size:13px">Export as</div>
      <div class="opt-row">
        <div class="opt active" data-f="png" onclick="CV.exFmt('png',this)">PNG</div>
        <div class="opt" data-f="jpeg" onclick="CV.exFmt('jpeg',this)">JPEG</div>
        <div class="opt" data-f="pdf" onclick="CV.exFmt('pdf',this)">PDF</div>
        <div class="opt" data-f="transparent" onclick="CV.exFmt('transparent',this)">Transparent</div>
      </div>
      <div class="switch-row">Time-lapse video <div class="switch" id="swTl" onclick="this.classList.toggle('on')"></div></div>
      <div class="switch-row">Before / After comparison <div class="switch" id="swBa" onclick="this.classList.toggle('on')"></div></div>
      <div class="switch-row">Print ready (300 DPI) <div class="switch" id="swPr" onclick="this.classList.toggle('on')"></div></div>
      <div style="display:flex;gap:8px;margin-top:14px">
        <button class="btn btn-ghost btn-block" onclick="CV.shareLink()">${ICONS.share} Share link</button>
        <button class="btn btn-primary btn-block" onclick="CV.doExport()">Export</button>
      </div>
    </div>`;
    document.body.appendChild(m);
    m.querySelector('#exPreview').src = ED.exportPNG(false);
    CV._exFmt = 'png';
  }

  function download(dataUrl, name) {
    const a = document.createElement('a'); a.href = dataUrl; a.download = name; a.click();
  }
  function makeBeforeAfter() {
    const c = document.createElement('canvas'); c.width = 1420; c.height = 700;
    const ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0,0,1420,700);
    return Promise.all([loadImage(ED.lineArtPNG()), loadImage(ED.exportPNG(false))]).then(([a,b]) => {
      ctx.drawImage(a, 0, 0, 700, 700); ctx.drawImage(b, 720, 0, 700, 700);
      ctx.fillStyle = '#5B67FF'; ctx.fillRect(710,0,2,700);
      return c.toDataURL('image/png');
    });
  }
  function loadImage(src){ return new Promise(r => { const i = new Image(); i.onload=()=>r(i); i.src=src; }); }

  /* ---------------- AI generation ---------------- */
  async function runGenerate() {
    const prompt = (document.getElementById('genPrompt')?.value || '').trim();
    store.gen.prompt = prompt;
    if (!prompt) { toast('Describe what you want to create'); return; }
    const overlay = genOverlay(prompt);
    document.body.appendChild(overlay);

    let image = null, svg = null, usedAI = false;
    try {
      const r = await fetch('/api/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style: store.gen.style, complexity: store.gen.complexity }),
      });
      if (r.ok) {
        const j = await r.json();
        if (j.imageB64) { image = j.imageB64; usedAI = true; }
        else if (j.imageUrl) { image = j.imageUrl; usedAI = true; }
        else if (j.svg) { svg = j.svg; usedAI = true; }
        else if (j.error) { toast('AI error: ' + j.error); }
      } else {
        toast('Generator returned ' + r.status);
      }
    } catch (e) { /* network — fall back below */ }

    // Fall back to the built-in template generator when no AI image is available.
    if (!image && !svg) {
      svg = proceduralLineArt(prompt, store.gen.complexity);
      toast('No AI key set — used a sample template');
    }

    currentTitle = prompt.length > 24 ? prompt.slice(0, 24) + '…' : prompt;
    openEditorWith({ image, svg });
    if (usedAI && image) toast('Generated with AI ✨');
    overlay.remove();
  }

  // Open the editor and load either an AI raster image (as line art) or an SVG.
  function openEditorWith({ image, svg }) {
    const el = document.createElement('div'); el.className = 'editor'; el.id = 'editor';
    el.innerHTML = editorHTML(false); document.body.appendChild(el);
    ED = new ColorVerseEditor(el.querySelector('#stage'));
    ED.onHistory = (u, r) => { el.querySelector('#btnUndo').disabled = !u; el.querySelector('#btnRedo').disabled = !r; };
    ED.onColorPick = (c) => { ED.color = c; syncSwatches(el, c); };
    ED.onZoom = (s) => { const lvl = document.getElementById('zoomLvl'); if (lvl) lvl.textContent = Math.round(s * 100) + '%'; };
    ED.color = PALETTE[9];
    if (image) ED.loadImageAsLineArt(image);
    else ED.loadLineArt(svg);
  }
  function genOverlay(prompt) {
    const o = document.createElement('div'); o.className = 'modal-bg';
    o.innerHTML = `<div class="modal" style="text-align:center">
      <div class="spin" style="margin:8px auto 16px"></div>
      <h3>Generating your coloring page…</h3>
      <p style="font-size:13px">"${prompt}"</p>
      <p style="font-size:12px;color:var(--ink-3)">Style: ${store.gen.style} · ${store.gen.complexity}</p>
    </div>`;
    return o;
  }
  function openEditorWithSvg(svg) {
    const el = document.createElement('div'); el.className = 'editor'; el.id = 'editor';
    el.innerHTML = editorHTML(false); document.body.appendChild(el);
    ED = new ColorVerseEditor(el.querySelector('#stage'));
    ED.onHistory = (u, r) => { el.querySelector('#btnUndo').disabled = !u; el.querySelector('#btnRedo').disabled = !r; };
    ED.onColorPick = (c) => { ED.color = c; syncSwatches(el, c); };
    ED.onZoom = (s) => { const lvl = document.getElementById('zoomLvl'); if (lvl) lvl.textContent = Math.round(s * 100) + '%'; };
    ED.color = PALETTE[9];
    ED.loadLineArt(svg);
  }

  // Local procedural generator: picks/blends template shapes by keyword so the demo
  // always returns clean line art even without an AI image API key.
  function proceduralLineArt(prompt, complexity) {
    const p = prompt.toLowerCase();
    const map = [
      [/fox|wolf/, 'fox'], [/cat|kitten|kitty/, 'cat'], [/bear|teddy|panda/, 'bear'],
      [/house|home|cottage|castle/, 'house'], [/mandala|pattern|geometr/, 'mandala'],
      [/flower|blossom|rose|garden/, 'flower'], [/butterfly|bug|insect/, 'butterfly'],
      [/dino|dragon|rex/, 'dino'], [/unicorn|pony|horse/, 'unicorn'],
      [/rocket|space|ship|car|vehicle/, 'rocket'],
    ];
    let base = 'flower';
    for (const [re, id] of map) if (re.test(p)) { base = id; break; }
    let svg = LINEART[base];
    // add complexity: sprinkle decorative dots/stars for intermediate/advanced
    if (complexity !== 'beginner') {
      const extras = [];
      const n = complexity === 'advanced' ? 14 : 7;
      for (let i = 0; i < n; i++) {
        const x = 40 + Math.random() * 620, y = 40 + Math.random() * 620, r = 6 + Math.random() * 16;
        extras.push(Math.random() > .5
          ? `<circle cx="${x|0}" cy="${y|0}" r="${r|0}"/>`
          : `<path d="M${x|0} ${y|0} l${r|0} ${r|0} l-${r|0} ${r|0} l-${r|0} -${r|0} z"/>`);
      }
      svg = svg.replace('</g></svg>', extras.join('') + '</g></svg>');
    }
    return svg;
  }

  /* ---------------- import image ---------------- */
  function importImage() {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = 'image/*';
    inp.onchange = () => {
      const f = inp.files[0]; if (!f) return;
      const url = URL.createObjectURL(f);
      currentTitle = 'Imported';
      const el = document.createElement('div'); el.className = 'editor'; el.id = 'editor';
      el.innerHTML = editorHTML(false); document.body.appendChild(el);
      ED = new ColorVerseEditor(el.querySelector('#stage'));
      ED.onHistory = (u, r) => { el.querySelector('#btnUndo').disabled = !u; el.querySelector('#btnRedo').disabled = !r; };
      ED.onColorPick = (c) => { ED.color = c; syncSwatches(el, c); };
      ED.onZoom = (s) => { const lvl = document.getElementById('zoomLvl'); if (lvl) lvl.textContent = Math.round(s * 100) + '%'; };
    ED.onZoom = (s) => { const lvl = document.getElementById('zoomLvl'); if (lvl) lvl.textContent = Math.round(s * 100) + '%'; };
      ED.color = PALETTE[9];
      ED.importImage(url, 'coloring').then(() => toast('Converted to coloring page'));
    };
    inp.click();
  }

  /* ---------------- palettes for AI assist ---------------- */
  const AI_PALETTES = {
    pixar: ['#FFB84D','#ff7e5f','#37b6ff','#5B67FF','#28C76F','#ffd34d','#9b6bff'],
    fantasy: ['#9b6bff','#5B67FF','#37b6ff','#28C76F','#f3a8c0','#ffd34d'],
    anime: ['#ff5b7f','#ffd34d','#37b6ff','#5B67FF','#7ed957','#fff'],
    storybook: ['#b06a4a','#28C76F','#FFB84D','#37b6ff','#ff7e5f'],
    watercolor: ['#a7d3ff','#ffc9d6','#c9f0d6','#fff0bf','#d9c9ff'],
  };

  /* ---------------- public API (CV) ---------------- */
  const CV = {
    open(id, kids) { openEditor(id, kids); },
    openSaved(i) { openEditor(store.gallery[i].lineId, false, i); },
    closeEditor() { closeEditor(); },
    tool(t) {
      if (t === 'magic') { CV.autoColor('pixar'); return; }
      if (!ED) return;
      ED.tool = t;
      document.querySelectorAll('.tool').forEach(b => b.classList.toggle('active', b.dataset.tool === t));
      if (t === 'zoom') toast('Drag to pan · scroll to zoom');
    },
    ed(action) {
      if (!ED) return;
      if (action === 'undo') ED.undo();
      else if (action === 'redo') ED.redo();
      else if (action === 'zoom') toast('Zoom: ' + ED.cycleZoom().toFixed(1) + '×');
    },
    setBrush(v) { if (ED) { ED.brush = v; ED.tool = 'brush'; document.querySelectorAll('.tool').forEach(b => b.classList.toggle('active', b.dataset.tool === 'brush')); } },
    setSize(v) { if (ED) ED.size = +v; const d = document.getElementById('sizeDot'); if (d) d.textContent = v; },
    setOpacity(v) { if (ED) ED.opacity = v / 100; },
    pickSwatch(c, el) {
      if (ED) { ED.color = c; ED.tool = ED.tool === 'eraser' ? 'brush' : ED.tool; }
      document.querySelectorAll('.sw').forEach(s => s.classList.toggle('active', s === el));
      if (!el) { const m = [...document.querySelectorAll('.sw')].find(s => s.dataset.c === c); if (m) m.classList.add('active'); }
    },
    toggleLayer(id, el) {
      if (!ED) return;
      const on = !el.parentElement.classList.contains('on');
      el.parentElement.classList.toggle('on', on);
      el.textContent = on ? '👁' : '🚫';
      ED.setLayerVisible(id, on);
    },
    selectLayer(id, el) {
      if (!ED) return; ED.setActiveLayer(id === 'lineart' ? 'color' : id);
      document.querySelectorAll('.layer').forEach(l => l.classList.remove('sel'));
      el.closest('.layer').classList.add('sel');
      if (id === 'lineart') toast('Line art is locked — draw on Color');
    },
    autoColor(style) { if (ED) { ED.autoColor(AI_PALETTES[style] || AI_PALETTES.pixar); toast('AI auto-colored ✨'); } },
    suggest() {
      const keys = Object.keys(AI_PALETTES);
      const k = keys[Math.floor(Math.random() * keys.length)];
      if (ED) ED.autoColor(AI_PALETTES[k]);
      toast('Suggested: ' + k + ' palette');
    },
    // Update style/complexity WITHOUT a full re-render, so the typed prompt is preserved.
    setStyle(s) {
      const t = document.getElementById('genPrompt'); if (t) store.gen.prompt = t.value;
      store.gen.style = s;
      document.querySelectorAll('.style-card').forEach((el, i) => el.classList.toggle('active', STYLES[i] && STYLES[i].id === s));
    },
    setCx(c) {
      const t = document.getElementById('genPrompt'); if (t) store.gen.prompt = t.value;
      store.gen.complexity = c;
      document.querySelectorAll('.cx-card').forEach((el, i) => el.classList.toggle('active', COMPLEXITY[i] && COMPLEXITY[i].id === c));
    },
    zoom(dir) {
      if (!ED) return;
      const s = ED.zoomBy(dir > 0 ? 1.35 : 1 / 1.35);
      const lvl = document.getElementById('zoomLvl'); if (lvl) lvl.textContent = Math.round(s * 100) + '%';
    },
    savePrompt(v) { store.gen.prompt = v; },
    generate() { runGenerate(); },
    import() { importImage(); },
    browse(cat) { store.browseCat = cat; store.q = ''; render(); },
    // live filter the visible tiles by caption (no re-render, keeps input focus)
    search(q) {
      store.q = q;
      const t = (q || '').trim().toLowerCase();
      document.querySelectorAll('.tile').forEach(el => {
        const cap = (el.querySelector('.cap')?.textContent || '').toLowerCase();
        el.style.display = (!t || cap.includes(t)) ? '' : 'none';
      });
    },
    premium() { go('#/profile'); setTimeout(() => toast('Unlock Premium for unlimited AI'), 200); },
    upgrade(plan) { store.user.tier = plan; render(); toast('Upgraded to ' + plan + ' 🎉'); },
    kidsCat(id) {
      const c = KIDS_CATS.find(x => x.id === id);
      document.querySelectorAll('.kids .cat').forEach((el, i) => el.classList.toggle('active', KIDS_CATS[i] && KIDS_CATS[i].id === id));
      document.getElementById('kidsPages').innerHTML = c.pages.map(pid =>
        `<div class="tile" onclick="CV.open('${pid}', true)"><div class="thumb">${kidsThumb(pid)}</div></div>`).join('');
    },
    save() {
      if (!ED) return;
      const thumb = ED.exportPNG(false);
      store.gallery.unshift({ title: currentTitle, thumb, lineId: null, ts: Date.now() });
      saveGallery();
      toast('Saved to Gallery ✓');
    },
    exportModal() { exportModal(); },
    exFmt(f, el) { CV._exFmt = f; document.querySelectorAll('.modal .opt').forEach(o => o.classList.toggle('active', o === el)); },
    async doExport() {
      if (!ED) return;
      const f = CV._exFmt || 'png';
      const ba = document.getElementById('swBa')?.classList.contains('on');
      const tl = document.getElementById('swTl')?.classList.contains('on');
      const name = (currentTitle || 'colorverse').replace(/[^\w]+/g, '_');
      if (tl) {
        toast('Rendering time-lapse…');
        try { const blob = await ED.exportTimelapse(15); download(URL.createObjectURL(blob), name + '_timelapse.webm'); }
        catch (e) { toast(e.message); }
      }
      if (ba) { download(await makeBeforeAfter(), name + '_before_after.png'); }
      if (f === 'pdf') { await exportPDF(name); }
      else if (f === 'jpeg') download(ED.exportJPEG(), name + '.jpg');
      else if (f === 'transparent') download(ED.exportPNG(true), name + '.png');
      else download(ED.exportPNG(false), name + '.png');
      toast('Exported ✓');
      document.querySelector('.modal-bg')?.remove();
    },
    shareLink() {
      const id = Math.random().toString(36).slice(2, 8);
      const url = location.origin + '/#/p/' + id;
      navigator.clipboard?.writeText(url).then(() => toast('Share link copied'), () => toast(url));
    },
    toast(m) { toast(m); },
  };
  window.CV = CV;

  async function exportPDF(name) {
    // lazy-load jsPDF from CDN; fall back to print dialog
    try {
      if (!window.jspdf) {
        await new Promise((res, rej) => {
          const s = document.createElement('script');
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
          s.onload = res; s.onerror = rej; document.head.appendChild(s);
        });
      }
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
      const img = ED.exportPNG(false);
      const pw = pdf.internal.pageSize.getWidth(), s = pw - 60;
      pdf.addImage(img, 'PNG', 30, 40, s, s);
      pdf.setFontSize(10); pdf.text(currentTitle + '  ·  ColorVerse', 30, s + 70);
      pdf.save(name + '.pdf');
    } catch (e) {
      const w = window.open('');
      w.document.write('<img src="' + ED.exportPNG(false) + '" style="width:100%"/>');
      w.document.title = name; setTimeout(() => w.print(), 400);
    }
  }

  /* ---------------- router ---------------- */
  function render() {
    const h = location.hash || '#/';
    let html;
    if (h.startsWith('#/discover')) html = Discover();
    else if (h.startsWith('#/generate')) html = Generate();
    else if (h.startsWith('#/gallery')) { store.gallery = loadGallery(); html = Gallery(); }
    else if (h.startsWith('#/profile')) html = Profile();
    else if (h.startsWith('#/kids')) html = Kids();
    else if (h.startsWith('#/p/')) { html = Discover(); }
    else html = Landing();
    app.innerHTML = html;
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', render);
  render();
})();

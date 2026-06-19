/* ColorVerse — Coloring engine
   Stacked-canvas editor: paper + color/shadow/highlight/effects layers + line-art on top.
   Tools: brush family, eraser, paint-bucket (flood fill), color picker, zoom/pan.
   Undo/redo, layers, image import → line art, PNG/PDF export, time-lapse capture. */
(function (global) {
  const SIZE = 700; // internal resolution

  const BRUSHES = {
    pencil:    { opacity: .9, soft: 0,  texture: 'grain' },
    marker:    { opacity: .7, soft: 0,  texture: 'flat'  },
    crayon:    { opacity: .85,soft: 1,  texture: 'grain' },
    watercolor:{ opacity: .35,soft: 14, texture: 'flat'  },
    oil:       { opacity: 1,  soft: 2,  texture: 'flat'  },
    airbrush:  { opacity: .25,soft: 22, texture: 'spray' },
    glitter:   { opacity: .9, soft: 2,  texture: 'glitter'},
    metallic:  { opacity: 1,  soft: 4,  texture: 'metal' },
    texture:   { opacity: .8, soft: 0,  texture: 'grain' },
  };

  const LAYER_DEFS = [
    { id: 'color',     name: 'Color',     base: true },
    { id: 'shadow',    name: 'Shadow' },
    { id: 'highlight', name: 'Highlight' },
    { id: 'effects',   name: 'Effects' },
  ];

  class Editor {
    constructor(stage) {
      this.stage = stage;
      this.scale = 1; this.tx = 0; this.ty = 0;
      this.tool = 'brush';
      this.brush = 'crayon';
      this.color = '#5B67FF';
      this.size = 24;
      this.opacity = 1;
      this.activeLayer = 'color';
      this.layers = {};
      this.visible = {};
      this.undoStack = [];
      this.redoStack = [];
      this.timelapse = [];
      this.drawing = false;
      this._build();
    }

    _build() {
      this.stage.innerHTML = '';
      this.stage.style.position = 'relative';
      this.stage.style.width = SIZE + 'px';
      this.stage.style.height = SIZE + 'px';
      const fit = Math.min(
        (this.stage.parentElement.clientWidth - 24) / SIZE,
        (this.stage.parentElement.clientHeight - 24) / SIZE
      );
      this.baseFit = Math.min(1, fit || 1);
      this._applyTransform();

      // paper
      this.paper = this._canvas(0);
      const p = this.paper.getContext('2d');
      p.fillStyle = '#fff'; p.fillRect(0, 0, SIZE, SIZE);

      // color layers
      LAYER_DEFS.forEach((d, i) => {
        const c = this._canvas(1 + i);
        this.layers[d.id] = c;
        this.visible[d.id] = true;
      });
      // line art on top
      this.lineCanvas = this._canvas(1 + LAYER_DEFS.length);
      this.visible.lineart = true;

      this._bindPointer();
    }

    _canvas(z) {
      const c = document.createElement('canvas');
      c.width = SIZE; c.height = SIZE;
      c.style.position = 'absolute'; c.style.inset = '0';
      c.style.width = '100%'; c.style.height = '100%';
      c.style.zIndex = z;
      this.stage.appendChild(c);
      return c;
    }

    _applyTransform() {
      const s = this.baseFit * this.scale;
      this.stage.style.transformOrigin = 'center center';
      this.stage.style.transform = `translate(${this.tx}px,${this.ty}px) scale(${s})`;
    }

    /* ---------- Load line art (SVG string) ---------- */
    async loadLineArt(svgString) {
      const img = await svgToImage(svgString);
      const ctx = this.lineCanvas.getContext('2d');
      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.drawImage(img, 0, 0, SIZE, SIZE);
      // make near-white transparent so coloring shows through
      const d = ctx.getImageData(0, 0, SIZE, SIZE);
      const a = d.data;
      for (let i = 0; i < a.length; i += 4) {
        const lum = (a[i] + a[i+1] + a[i+2]) / 3;
        if (lum > 180) { a[i+3] = 0; }      // white paper → transparent
      }
      ctx.putImageData(d, 0, 0);
      this._snapshotBarrier();
      this.clearColors();
      this._pushUndo(true);
      this._recordFrame();
    }

    /* cache the line-art as a boundary mask for flood fill */
    _snapshotBarrier() {
      const ctx = this.lineCanvas.getContext('2d');
      this.barrier = ctx.getImageData(0, 0, SIZE, SIZE).data;
    }

    clearColors() {
      Object.values(this.layers).forEach(c =>
        c.getContext('2d').clearRect(0, 0, SIZE, SIZE));
    }

    /* ---------- Pointer / drawing ---------- */
    _bindPointer() {
      const s = this.stage;
      const pos = (e) => {
        const r = s.getBoundingClientRect();
        return {
          x: (e.clientX - r.left) / r.width * SIZE,
          y: (e.clientY - r.top) / r.height * SIZE,
        };
      };
      let last = null, panStart = null;

      s.addEventListener('pointerdown', (e) => {
        s.setPointerCapture(e.pointerId);
        const pt = pos(e);
        if (this.tool === 'zoom') { panStart = { x: e.clientX - this.tx, y: e.clientY - this.ty }; return; }
        if (this.tool === 'fill') { this.floodFill(pt.x | 0, pt.y | 0); this._pushUndo(); this._recordFrame(); return; }
        if (this.tool === 'picker') { this.pickColor(pt.x | 0, pt.y | 0); return; }
        this.drawing = true; last = pt;
        this._stamp(pt.x, pt.y, e.pressure || 0.5);
      });

      s.addEventListener('pointermove', (e) => {
        const pt = pos(e);
        if (this.tool === 'zoom' && panStart) {
          this.tx = e.clientX - panStart.x; this.ty = e.clientY - panStart.y; this._applyTransform(); return;
        }
        if (!this.drawing) return;
        const pr = e.pressure || 0.5;
        const dist = Math.hypot(pt.x - last.x, pt.y - last.y);
        const steps = Math.max(1, Math.floor(dist / 3));
        for (let i = 1; i <= steps; i++) {
          this._stamp(last.x + (pt.x - last.x) * i / steps,
                      last.y + (pt.y - last.y) * i / steps, pr);
        }
        last = pt;
      });

      const end = () => {
        if (this.drawing) { this.drawing = false; this._pushUndo(); this._recordFrame(); }
        panStart = null;
      };
      s.addEventListener('pointerup', end);
      s.addEventListener('pointerleave', end);

      // wheel / trackpad zoom — always active over the canvas
      this.stage.parentElement.addEventListener('wheel', (e) => {
        e.preventDefault();
        this.zoomBy(e.deltaY < 0 ? 1.12 : 1 / 1.12);
      }, { passive: false });
    }

    _stamp(x, y, pressure) {
      const ctx = this.layers[this.activeLayer].getContext('2d');
      const b = BRUSHES[this.brush] || BRUSHES.crayon;
      const r = this.size / 2 * (0.6 + pressure * 0.8);
      ctx.save();
      if (this.tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fillStyle = 'rgba(0,0,0,1)'; ctx.fill();
        ctx.restore(); return;
      }
      ctx.globalAlpha = b.opacity * this.opacity;
      ctx.fillStyle = this.color;
      ctx.strokeStyle = this.color;
      if (b.soft) { ctx.shadowColor = this.color; ctx.shadowBlur = b.soft; }

      if (b.texture === 'spray') {
        for (let i = 0; i < 26; i++) {
          const a = Math.random() * 7, rr = Math.random() * r;
          ctx.globalAlpha = b.opacity * this.opacity * Math.random();
          ctx.beginPath(); ctx.arc(x + Math.cos(a) * rr, y + Math.sin(a) * rr, 1.1, 0, 7); ctx.fill();
        }
      } else if (b.texture === 'glitter') {
        ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
        for (let i = 0; i < 6; i++) {
          ctx.globalAlpha = 1; ctx.fillStyle = ['#fff','#ffe9a8',this.color][i % 3];
          ctx.beginPath(); ctx.arc(x + (Math.random()-.5)*r*1.6, y + (Math.random()-.5)*r*1.6, Math.random()*1.6+.6, 0, 7); ctx.fill();
        }
      } else if (b.texture === 'metal') {
        const g = ctx.createRadialGradient(x - r/3, y - r/3, 1, x, y, r);
        g.addColorStop(0, '#ffffff'); g.addColorStop(.4, this.color); g.addColorStop(1, '#00000044');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
      } else if (b.texture === 'grain') {
        ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
        ctx.globalAlpha = b.opacity * this.opacity * .25;
        for (let i = 0; i < 4; i++) {
          ctx.beginPath(); ctx.arc(x + (Math.random()-.5)*r, y + (Math.random()-.5)*r, r*0.4, 0, 7); ctx.fill();
        }
      } else {
        ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
      }
      ctx.restore();
    }

    /* ---------- Flood fill (paint bucket) ---------- */
    floodFill(sx, sy) {
      if (sx < 0 || sy < 0 || sx >= SIZE || sy >= SIZE) return;
      // composite of current colors to detect filled region; line art is the barrier
      const comp = this._composite(false); // without line art
      const src = comp.getContext('2d').getImageData(0, 0, SIZE, SIZE);
      const sd = src.data, bar = this.barrier;
      const layerCtx = this.layers[this.activeLayer].getContext('2d');
      const out = layerCtx.getImageData(0, 0, SIZE, SIZE);
      const od = out.data;
      const idx = (sy * SIZE + sx) * 4;
      const tr = sd[idx], tg = sd[idx+1], tb = sd[idx+2], ta = sd[idx+3];
      const fc = hexRgb(this.color);
      const stack = [[sx, sy]];
      const seen = new Uint8Array(SIZE * SIZE);
      const tol = 48;
      const isBarrier = (i) => bar[i*4+3] > 40 && (bar[i*4]+bar[i*4+1]+bar[i*4+2]) < 360;
      const match = (i) => {
        const j = i*4;
        return Math.abs(sd[j]-tr) < tol && Math.abs(sd[j+1]-tg) < tol &&
               Math.abs(sd[j+2]-tb) < tol && Math.abs(sd[j+3]-ta) < tol;
      };
      while (stack.length) {
        const [x, y] = stack.pop();
        if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) continue;
        const i = y * SIZE + x;
        if (seen[i]) continue; seen[i] = 1;
        if (isBarrier(i) || !match(i)) continue;
        const j = i*4;
        od[j] = fc[0]; od[j+1] = fc[1]; od[j+2] = fc[2]; od[j+3] = 255;
        stack.push([x+1,y],[x-1,y],[x,y+1],[x,y-1]);
      }
      layerCtx.putImageData(out, 0, 0);
    }

    pickColor(x, y) {
      const comp = this._composite(true);
      const d = comp.getContext('2d').getImageData(x, y, 1, 1).data;
      if (d[3] === 0) return;
      this.color = rgbHex(d[0], d[1], d[2]);
      if (this.onColorPick) this.onColorPick(this.color);
    }

    /* ---------- Composite ---------- */
    _composite(withLine) {
      const c = document.createElement('canvas'); c.width = SIZE; c.height = SIZE;
      const ctx = c.getContext('2d');
      ctx.drawImage(this.paper, 0, 0);
      LAYER_DEFS.forEach(d => {
        if (!this.visible[d.id]) return;
        ctx.globalAlpha = this.layers[d.id].dataset && this.layers[d.id].style.opacity ? parseFloat(this.layers[d.id].style.opacity) : 1;
        ctx.drawImage(this.layers[d.id], 0, 0);
      });
      ctx.globalAlpha = 1;
      if (withLine && this.visible.lineart) ctx.drawImage(this.lineCanvas, 0, 0);
      return c;
    }

    /* ---------- Undo / redo (active layer snapshots) ---------- */
    _pushUndo(reset) {
      if (reset) { this.undoStack = []; this.redoStack = []; }
      const ctx = this.layers[this.activeLayer].getContext('2d');
      this.undoStack.push({ layer: this.activeLayer, data: ctx.getImageData(0, 0, SIZE, SIZE) });
      if (this.undoStack.length > 40) this.undoStack.shift();
      this.redoStack = [];
      this._emit();
    }
    undo() {
      if (this.undoStack.length < 2) return;
      const cur = this.undoStack.pop();
      this.redoStack.push(cur);
      const prev = [...this.undoStack].reverse().find(s => s.layer === cur.layer);
      const ctx = this.layers[cur.layer].getContext('2d');
      if (prev) ctx.putImageData(prev.data, 0, 0);
      else ctx.clearRect(0, 0, SIZE, SIZE);
      this._emit();
    }
    redo() {
      if (!this.redoStack.length) return;
      const s = this.redoStack.pop();
      this.layers[s.layer].getContext('2d').putImageData(s.data, 0, 0);
      this.undoStack.push(s);
      this._emit();
    }
    _emit() { if (this.onHistory) this.onHistory(this.undoStack.length > 1, this.redoStack.length > 0); }

    /* ---------- Layers ---------- */
    setLayerVisible(id, v) {
      this.visible[id] = v;
      const c = id === 'lineart' ? this.lineCanvas : this.layers[id];
      c.style.display = v ? 'block' : 'none';
    }
    setLayerOpacity(id, o) {
      const c = id === 'lineart' ? this.lineCanvas : this.layers[id];
      c.style.opacity = o;
    }
    setActiveLayer(id) { this.activeLayer = id; }

    /* ---------- Zoom ---------- */
    zoomBy(factor) {
      this.scale = Math.min(6, Math.max(1, this.scale * factor));
      if (this.scale <= 1.001) { this.scale = 1; this.tx = 0; this.ty = 0; }
      this._applyTransform();
      if (this.onZoom) this.onZoom(this.scale);
      return this.scale;
    }
    cycleZoom() { return this.zoomBy(this.scale >= 2.4 ? 1 / this.scale : 1.5); }

    /* ---------- Import image → line art ---------- */
    async importImage(fileOrUrl, mode = 'coloring') {
      const img = await loadImg(fileOrUrl);
      const off = document.createElement('canvas'); off.width = SIZE; off.height = SIZE;
      const o = off.getContext('2d');
      o.fillStyle = '#fff'; o.fillRect(0, 0, SIZE, SIZE);
      const ratio = Math.min(SIZE / img.width, SIZE / img.height);
      const w = img.width * ratio, h = img.height * ratio;
      o.drawImage(img, (SIZE - w) / 2, (SIZE - h) / 2, w, h);
      const data = o.getImageData(0, 0, SIZE, SIZE);
      const edges = toLineArt(data, mode);
      const ctx = this.lineCanvas.getContext('2d');
      ctx.putImageData(edges, 0, 0);
      this._snapshotBarrier();
      this.clearColors();
      this._pushUndo(true);
      this._recordFrame();
    }

    /* Load an AI-generated line-art image directly as the line layer.
       The model returns near-black outlines on white; we threshold so dark
       pixels become crisp opaque lines and everything light becomes
       transparent (so colors show through and flood fill has clean barriers). */
    async loadImageAsLineArt(src) {
      const img = await loadImg(src);
      const off = document.createElement('canvas'); off.width = SIZE; off.height = SIZE;
      const o = off.getContext('2d');
      o.fillStyle = '#fff'; o.fillRect(0, 0, SIZE, SIZE);
      const ratio = Math.min(SIZE / img.width, SIZE / img.height);
      const w = img.width * ratio, h = img.height * ratio;
      o.drawImage(img, (SIZE - w) / 2, (SIZE - h) / 2, w, h);
      const d = o.getImageData(0, 0, SIZE, SIZE);
      const a = d.data;
      for (let i = 0; i < a.length; i += 4) {
        const lum = 0.299 * a[i] + 0.587 * a[i + 1] + 0.114 * a[i + 2];
        if (lum < 110) { a[i] = a[i + 1] = a[i + 2] = 20; a[i + 3] = 255; } // line
        else { a[i + 3] = 0; }                                            // paper → clear
      }
      const ctx = this.lineCanvas.getContext('2d');
      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.putImageData(d, 0, 0);
      this._snapshotBarrier();
      this.clearColors();
      this._pushUndo(true);
      this._recordFrame();
    }

    /* ---------- Auto color (AI assist) ---------- */
    autoColor(palette) {
      // flood-fill enclosed regions with a themed palette by scanning a grid
      const ctx = this.layers.color.getContext('2d');
      ctx.clearRect(0, 0, SIZE, SIZE);
      let pi = 0;
      const step = 26;
      for (let y = step; y < SIZE; y += step) {
        for (let x = step; x < SIZE; x += step) {
          const i = (y * SIZE + x);
          if (this.barrier && this.barrier[i*4+3] > 40 && (this.barrier[i*4]+this.barrier[i*4+1]+this.barrier[i*4+2]) < 360) continue;
          // only fill if currently empty there
          const cur = ctx.getImageData(x, y, 1, 1).data;
          if (cur[3] > 0) continue;
          this.color = palette[pi % palette.length]; pi++;
          this.floodFill(x, y);
        }
      }
      this._pushUndo(); this._recordFrame();
    }

    /* ---------- Export ---------- */
    exportPNG(transparent) {
      const c = document.createElement('canvas'); c.width = SIZE; c.height = SIZE;
      const ctx = c.getContext('2d');
      if (!transparent) { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, SIZE, SIZE); }
      LAYER_DEFS.forEach(d => { if (this.visible[d.id]) ctx.drawImage(this.layers[d.id], 0, 0); });
      if (this.visible.lineart) ctx.drawImage(this.lineCanvas, 0, 0);
      return c.toDataURL('image/png');
    }
    exportJPEG() {
      const c = document.createElement('canvas'); c.width = SIZE; c.height = SIZE;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, SIZE, SIZE);
      LAYER_DEFS.forEach(d => { if (this.visible[d.id]) ctx.drawImage(this.layers[d.id], 0, 0); });
      if (this.visible.lineart) ctx.drawImage(this.lineCanvas, 0, 0);
      return c.toDataURL('image/jpeg', 0.92);
    }
    lineArtPNG() {
      const c = document.createElement('canvas'); c.width = SIZE; c.height = SIZE;
      const ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0,0,SIZE,SIZE);
      ctx.drawImage(this.lineCanvas, 0, 0); return c.toDataURL('image/png');
    }

    /* ---------- Time-lapse ---------- */
    _recordFrame() {
      try { this.timelapse.push(this._composite(true).toDataURL('image/jpeg', 0.6)); } catch (e) {}
      if (this.timelapse.length > 120) this.timelapse.shift();
    }
    async exportTimelapse(seconds = 15) {
      if (this.timelapse.length < 2) throw new Error('Not enough frames yet — color a bit first.');
      const c = document.createElement('canvas'); c.width = SIZE; c.height = SIZE;
      const ctx = c.getContext('2d');
      const stream = c.captureStream(30);
      const rec = new MediaRecorder(stream, { mimeType: pickMime() });
      const chunks = [];
      rec.ondataavailable = e => e.data.size && chunks.push(e.data);
      const done = new Promise(res => rec.onstop = res);
      rec.start();
      const frames = this.timelapse;
      const per = (seconds * 1000) / frames.length;
      for (const f of frames) {
        const im = await loadImg(f);
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, SIZE, SIZE);
        ctx.drawImage(im, 0, 0, SIZE, SIZE);
        await wait(per);
      }
      await wait(300);
      rec.stop();
      await done;
      return new Blob(chunks, { type: chunks[0]?.type || 'video/webm' });
    }
  }

  /* ---------- helpers ---------- */
  function hexRgb(h) { const n = parseInt(h.slice(1), 16); return [(n>>16)&255,(n>>8)&255,n&255]; }
  function rgbHex(r,g,b){ return '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join(''); }
  function wait(ms){ return new Promise(r => setTimeout(r, ms)); }
  function pickMime(){ return ['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'].find(m => MediaRecorder.isTypeSupported(m)) || 'video/webm'; }
  function svgToImage(svg) {
    return new Promise((res, rej) => {
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => { res(img); URL.revokeObjectURL(url); };
      img.onerror = rej; img.src = url;
    });
  }
  function loadImg(src) {
    return new Promise((res, rej) => {
      const img = new Image(); img.crossOrigin = 'anonymous';
      img.onload = () => res(img); img.onerror = rej; img.src = src;
    });
  }
  function toLineArt(imgData, mode) {
    const { data, width: w, height: h } = imgData;
    const gray = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) {
      gray[i] = 0.299*data[i*4] + 0.587*data[i*4+1] + 0.114*data[i*4+2];
    }
    const out = new ImageData(w, h);
    const od = out.data;
    const thresh = mode === 'sketch' ? 24 : mode === 'manga' ? 40 : 32;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y*w + x;
        let gx = 0, gy = 0;
        if (x > 0 && x < w-1 && y > 0 && y < h-1) {
          gx = gray[i-1] - gray[i+1];
          gy = gray[i-w] - gray[i+w];
        }
        const mag = Math.hypot(gx, gy);
        const edge = mag > thresh;
        const j = i*4;
        if (edge) { od[j]=od[j+1]=od[j+2]=20; od[j+3]=255; }
        else { od[j]=od[j+1]=od[j+2]=255; od[j+3]=0; }
      }
    }
    return out;
  }

  global.ColorVerseEditor = Editor;
  global.CV_BRUSHES = BRUSHES;
  global.CV_LAYERS = LAYER_DEFS;
})(window);

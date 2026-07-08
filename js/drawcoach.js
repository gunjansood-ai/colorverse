/* ColorVerse — DrawCoach engine
   Watch mode: SVG strokes draw themselves (stroke-dashoffset animation), step by step.
   Trace mode: faint guide underneath; the learner draws on a canvas and gets live
   feedback — green when on the line, red + a nudge arrow when they drift — using a
   precomputed distance field of the target. All client-side, no video. */
(function (global) {
  const LV = 400;       // lesson coordinate space
  const DRAW = 600;     // user-canvas backing resolution
  const FIELD = 200;    // distance-field resolution
  const SVGNS = 'http://www.w3.org/2000/svg';

  class DrawCoach {
    constructor(container) {
      this.el = container;
      this.mode = 'watch';
      this.stepIndex = -1;
      this.playing = false;
      this._timers = [];
      this.tolLV = 22;    // forgiveness band (in LV units) — generous/encouraging
      this._build();
    }

    _build() {
      this.el.innerHTML = '';
      this.el.classList.add('coach-root', 'mode-watch');
      // left/guide panel (animated SVG)
      this.svgBox = document.createElement('div'); this.svgBox.className = 'coach-svgbox coach-panel';
      this.svg = document.createElementNS(SVGNS, 'svg');
      this.svg.setAttribute('viewBox', `0 0 ${LV} ${LV}`);
      this.svg.setAttribute('class', 'coach-svg');
      this.svgBox.appendChild(this.svg);
      // right/draw panel (user canvas + feedback overlay)
      this.drawBox = document.createElement('div'); this.drawBox.className = 'coach-canvasbox coach-panel';
      this.userC = document.createElement('canvas'); this.userC.width = this.userC.height = DRAW; this.userC.className = 'coach-user';
      this.fxC = document.createElement('canvas'); this.fxC.width = this.fxC.height = DRAW; this.fxC.className = 'coach-fx';
      const hint = document.createElement('div'); hint.className = 'coach-hint'; hint.textContent = 'Your turn — draw here';
      this.drawBox.append(this.userC, this.fxC, hint);
      this.el.append(this.svgBox, this.drawBox);
      this._bindDraw();
    }

    /* ---------- load a lesson ---------- */
    loadLesson(lesson) {
      this.lesson = lesson;
      this.clearTimers();
      this.playing = false;
      this.stepIndex = -1;
      this.svg.innerHTML = '';
      this.steps = lesson.steps.map((st, si) => {
        const g = document.createElementNS(SVGNS, 'g');
        g.setAttribute('data-step', si);
        const strokes = st.strokes.map(k => {
          const p = document.createElementNS(SVGNS, 'path');
          p.setAttribute('d', k.d);
          p.setAttribute('class', 'coach-path ' + (k.c ? 'is-guide' : 'is-final'));
          g.appendChild(p);
          const len = p.getTotalLength() || 1;
          p.style.strokeDasharray = len;
          p.style.strokeDashoffset = len;
          return { el: p, len, guide: !!k.c };
        });
        this.svg.appendChild(g);
        return { strokes, label: st.label };
      });
      this._field = null;
      this.clearTrace();
      this.setMode('watch');
      this._emitStep();
    }

    get total() { return this.steps ? this.steps.length : 0; }

    /* ---------- watch-mode animation ---------- */
    clearTimers() { this._timers.forEach(clearTimeout); this._timers = []; }

    _setStrokeShown(s, shown) {
      s.el.style.transition = 'none';
      s.el.style.strokeDashoffset = shown ? 0 : s.len;
    }
    // show steps 0..k fully (no animation); hide the rest
    showUpTo(k) {
      this.clearTimers(); this.playing = false; this._setPlaying(false);
      this.steps.forEach((st, i) => st.strokes.forEach(s => this._setStrokeShown(s, i <= k)));
      this.stepIndex = k;
      this._emitStep();
    }
    _animateStroke(s, delay, dur) {
      this._timers.push(setTimeout(() => {
        s.el.style.transition = 'none'; s.el.style.strokeDashoffset = s.len;
        s.el.getBoundingClientRect();
        s.el.style.transition = `stroke-dashoffset ${dur}ms ease-in-out`;
        s.el.style.strokeDashoffset = 0;
      }, delay));
    }
    // animate step k; steps before are static-on, after are hidden.
    // Pacing scales with the real path length so long outlines don't whip by:
    // short strokes ~1s, long traced outlines up to 8s. When a step has many
    // strokes, later ones overlap the tail of the previous so a complex step
    // still finishes in a reasonable time.
    animateStep(k) {
      this.clearTimers();
      this.steps.forEach((st, i) => { if (i !== k) st.strokes.forEach(s => this._setStrokeShown(s, i < k)); });
      const strokes = this.steps[k].strokes;
      const many = strokes.length > 4;
      let t = 0, end = 0;
      strokes.forEach(s => {
        const dur = Math.min(8000, Math.max(950, s.len * 11));
        this._animateStroke(s, t, dur);
        end = Math.max(end, t + dur);
        // dense steps: overlap the next stroke into the last 30% of this one
        t += many ? dur * 0.7 : dur + 300;
      });
      // safety net — force every stroke of this step fully drawn at the end,
      // even if a CSS transition was interrupted (backgrounded tab, mode switch)
      this._timers.push(setTimeout(() => {
        strokes.forEach(s => this._setStrokeShown(s, true));
      }, end + 120));
      this.stepIndex = k; this._emitStep();
      return end + 150;
    }
    async play() {
      if (this.mode !== 'watch' && this.mode !== 'parallel') this.setMode('watch');
      let start = this.stepIndex + 1;
      if (start >= this.total) { start = 0; }
      this.playing = true; this._setPlaying(true);
      for (let i = start; i < this.total && this.playing; i++) {
        const dur = this.animateStep(i);
        await wait(dur + 550);   // a clear pause between steps
      }
      this.playing = false; this._setPlaying(false);
    }
    pause() { this.playing = false; this._setPlaying(false); this.clearTimers(); }
    togglePlay() { this.playing ? this.pause() : this.play(); }
    nextStep() { this.pause(); const k = Math.min(this.total - 1, this.stepIndex + 1); this.animateStep(k); }
    prevStep() { this.pause(); const k = Math.max(0, this.stepIndex - 1); this.showUpTo(k); }
    replayStep() { this.pause(); this.animateStep(Math.max(0, this.stepIndex)); }
    gotoStep(k) { this.pause(); this.showUpTo(k); }
    // re-run the whole guide animation from the start (keeps the learner's drawing)
    replayGuide() {
      this.pause();
      this.steps.forEach(st => st.strokes.forEach(s => this._setStrokeShown(s, false)));
      this.stepIndex = -1; this._emitStep();
      this.play();
    }

    /* ---------- modes: watch | trace | parallel ---------- */
    setMode(mode) {
      this.mode = mode;
      this.pause();
      this.erasing = false;
      this.el.classList.remove('mode-watch', 'mode-trace', 'mode-parallel');
      this.el.classList.add('mode-' + mode);
      if (mode === 'watch') {
        this.showUpTo(this.total - 1);   // show the finished drawing; user can replay
      } else if (mode === 'trace') {
        this.showUpTo(this.total - 1);   // whole guide, shown faint to trace over
        this._ensureField();
        this.clearTrace();
      } else if (mode === 'parallel') {
        // guide animates on the left; learner draws on the right (blank)
        this._ensureField();
        this.clearTrace();
        this.steps.forEach(st => st.strokes.forEach(s => this._setStrokeShown(s, false)));
        this.stepIndex = -1; this._emitStep();
        setTimeout(() => { if (this.mode === 'parallel') this.play(); }, 500);
      }
      if (this.onMode) this.onMode(mode);
    }

    /* ---------- distance field (built from FINAL strokes) ---------- */
    _ensureField() {
      if (this._field) return;
      const c = document.createElement('canvas'); c.width = c.height = FIELD;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, FIELD, FIELD);
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      const sc = FIELD / LV;
      ctx.setTransform(sc, 0, 0, sc, 0, 0);
      this.steps.forEach(st => st.strokes.forEach(s => { if (!s.guide) ctx.stroke(new Path2D(s.el.getAttribute('d'))); }));
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      const px = ctx.getImageData(0, 0, FIELD, FIELD).data;
      const INF = 1e9, d = new Float32Array(FIELD * FIELD);
      for (let i = 0; i < FIELD * FIELD; i++) d[i] = px[i * 4] > 80 ? 0 : INF;
      const A = 1, B = 1.41421356;
      const at = (x, y) => d[y * FIELD + x];
      for (let y = 0; y < FIELD; y++) for (let x = 0; x < FIELD; x++) {
        let v = at(x, y);
        if (x > 0) v = Math.min(v, at(x - 1, y) + A);
        if (y > 0) v = Math.min(v, at(x, y - 1) + A);
        if (x > 0 && y > 0) v = Math.min(v, at(x - 1, y - 1) + B);
        if (x < FIELD - 1 && y > 0) v = Math.min(v, at(x + 1, y - 1) + B);
        d[y * FIELD + x] = v;
      }
      for (let y = FIELD - 1; y >= 0; y--) for (let x = FIELD - 1; x >= 0; x--) {
        let v = at(x, y);
        if (x < FIELD - 1) v = Math.min(v, at(x + 1, y) + A);
        if (y < FIELD - 1) v = Math.min(v, at(x, y + 1) + A);
        if (x < FIELD - 1 && y < FIELD - 1) v = Math.min(v, at(x + 1, y + 1) + B);
        if (x > 0 && y < FIELD - 1) v = Math.min(v, at(x - 1, y + 1) + B);
        d[y * FIELD + x] = v;
      }
      this._field = d;
    }
    // distance (in LV units) at an LV-space point
    _distLV(xLV, yLV) {
      const fx = clamp(Math.round(xLV * FIELD / LV), 0, FIELD - 1);
      const fy = clamp(Math.round(yLV * FIELD / LV), 0, FIELD - 1);
      return this._field[fy * FIELD + fx] * (LV / FIELD);
    }
    // unit vector pointing toward the nearest line (descent of the field), in LV space
    _toNearest(xLV, yLV) {
      const fx = clamp(Math.round(xLV * FIELD / LV), 1, FIELD - 2);
      const fy = clamp(Math.round(yLV * FIELD / LV), 1, FIELD - 2);
      const gx = this._field[fy * FIELD + fx + 1] - this._field[fy * FIELD + fx - 1];
      const gy = this._field[(fy + 1) * FIELD + fx] - this._field[(fy - 1) * FIELD + fx];
      const m = Math.hypot(gx, gy) || 1;
      return { x: -gx / m, y: -gy / m };
    }

    /* ---------- trace drawing + feedback ---------- */
    clearTrace() {
      this.userC.getContext('2d').clearRect(0, 0, DRAW, DRAW);
      this.fxC.getContext('2d').clearRect(0, 0, DRAW, DRAW);
      this._on = 0; this._tot = 0; this._last = null;
      if (this.onScore) this.onScore(null);
    }
    // The learner's own drawing, recolored to clean black line art (or null if blank).
    userDrawingDataURL() {
      const src = this.userC.getContext('2d').getImageData(0, 0, DRAW, DRAW);
      const out = document.createElement('canvas'); out.width = out.height = DRAW;
      const octx = out.getContext('2d');
      const od = octx.createImageData(DRAW, DRAW), o = od.data, s = src.data;
      let any = false;
      for (let i = 0; i < s.length; i += 4) {
        if (s[i + 3] > 24) { o[i] = o[i + 1] = o[i + 2] = 20; o[i + 3] = 255; any = true; }
      }
      if (!any) return null;
      octx.putImageData(od, 0, 0);
      return out.toDataURL('image/png');
    }
    _bindDraw() {
      const ptLV = (e) => {
        const r = this.userC.getBoundingClientRect();
        return { x: (e.clientX - r.left) / r.width * LV, y: (e.clientY - r.top) / r.height * LV };
      };
      const canDraw = () => this.mode === 'trace' || this.mode === 'parallel';
      const down = (e) => {
        if (!canDraw()) return;
        this.userC.setPointerCapture(e.pointerId);
        this._drawing = true; this._last = ptLV(e);
        this._plot(this._last);
      };
      const move = (e) => {
        if (!this._drawing || !canDraw()) return;
        const p = ptLV(e);
        this._segment(this._last, p);
        this._cursor(p);
        this._last = p;
      };
      const up = () => { this._drawing = false; this._last = null; this.fxC.getContext('2d').clearRect(0, 0, DRAW, DRAW); };
      this.userC.addEventListener('pointerdown', down);
      this.userC.addEventListener('pointermove', move);
      this.userC.addEventListener('pointerup', up);
      this.userC.addEventListener('pointerleave', up);
    }
    _ok(pLV) { return this._distLV(pLV.x, pLV.y) <= this.tolLV; }
    _plot(p) { this._segment(p, p); }
    _segment(a, b) {
      const ctx = this.userC.getContext('2d');
      const sc = DRAW / LV;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (this.erasing) {                       // erase part of the learner's drawing
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 22; ctx.beginPath();
        ctx.moveTo(a.x * sc, a.y * sc); ctx.lineTo(b.x * sc, b.y * sc); ctx.stroke();
        ctx.restore();
        return;
      }
      const ok = this._ok(b);
      ctx.strokeStyle = ok ? '#28C76F' : '#ff3b3b';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(a.x * sc, a.y * sc); ctx.lineTo(b.x * sc, b.y * sc); ctx.stroke();
      this._tot++; if (ok) this._on++;
      if (this.onScore) this.onScore(Math.round(this._on / this._tot * 100));
    }
    toggleErase() { this.erasing = !this.erasing; return this.erasing; }
    // live cursor: green ring when on track, red ring + arrow toward the line when off
    _cursor(p) {
      const ctx = this.fxC.getContext('2d'); const sc = DRAW / LV;
      ctx.clearRect(0, 0, DRAW, DRAW);
      const cx = p.x * sc, cy = p.y * sc;
      if (this.erasing) {                       // neutral eraser ring
        ctx.strokeStyle = '#9aa0b4'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(cx, cy, 22, 0, 7); ctx.stroke(); return;
      }
      const ok = this._ok(p);
      if (ok) {
        ctx.strokeStyle = '#28C76F'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(cx, cy, 14, 0, 7); ctx.stroke();
      } else {
        const dir = this._toNearest(p.x, p.y);
        ctx.strokeStyle = '#ff3b3b'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(cx, cy, 14, 0, 7); ctx.stroke();
        const bx = cx + dir.x * 46, by = cy + dir.y * 46;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(bx, by); ctx.stroke();
        const ang = Math.atan2(dir.y, dir.x);
        ctx.fillStyle = '#ff3b3b'; ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(bx - 12 * Math.cos(ang - 0.4), by - 12 * Math.sin(ang - 0.4));
        ctx.lineTo(bx - 12 * Math.cos(ang + 0.4), by - 12 * Math.sin(ang + 0.4));
        ctx.closePath(); ctx.fill();
      }
    }

    /* ---------- callbacks ---------- */
    _emitStep() { if (this.onStep) this.onStep(this.stepIndex, this.total, this.stepIndex >= 0 ? this.steps[this.stepIndex].label : 'Press play to watch'); }
    _setPlaying(v) { if (this.onPlay) this.onPlay(v); }
  }

  function wait(ms) { return new Promise(r => setTimeout(r, ms)); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  global.DrawCoach = DrawCoach;
})(window);

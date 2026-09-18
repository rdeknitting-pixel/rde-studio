/* RDE “Studio” — interactive loom: draw a programme, watch it being knitted. */
(function () {
  var COLS = 32, ROWS = 24;
  var YARNS = [
    { name: 'Ecru', hex: '#e9e1cf' },
    { name: 'Nero', hex: '#1a1a1c' },
    { name: 'Smeraldo', hex: '#0f8a5f' },
    { name: 'Rosso', hex: '#b3202c' },
    { name: 'Blu notte', hex: '#1d2f5e' },
    { name: 'Ocra', hex: '#d49a1e' }
  ];

  var gridCv = document.getElementById('loomGrid');
  var knitCv = document.getElementById('loomKnit');
  if (!gridCv || !knitCv) return;
  var gctx = gridCv.getContext('2d');
  var kctx = knitCv.getContext('2d');
  var carriage = document.getElementById('loomCarriage');
  var statusEl = document.getElementById('loomStatus');
  var runBtn = document.getElementById('loomRun');
  var T = window.RDE_I18N || { t: function (k, f) { return f; } };

  var cells = new Uint8Array(COLS * ROWS);
  var colA = 2, colB = 0;         // A = pattern yarn, B = ground yarn
  var knitRows = ROWS;            // rows currently visible in the fabric
  var running = false, raf = 0;
  var dpr = 1, gw = 0, gh = 0, kw = 0, kh = 0;

  /* ---------- presets ---------- */
  var RDE_GLYPH = [
    '11110.11110.11111',
    '10001.10001.10000',
    '10001.10001.10000',
    '11110.10001.11110',
    '10100.10001.10000',
    '10010.10001.10000',
    '10001.11110.11111'
  ];
  var PRESETS = {
    rombi: function (x, y) { var p = 8, a = Math.abs((x % p) - p / 2) + Math.abs((y % p) - p / 2); return a === 2 || a === 0 ? 1 : 0; },
    righe: function (x, y) { var m = y % 6; return m === 0 || m === 1 || m === 3 ? 1 : 0; },
    pied: function (x, y) {
      var t = ['1100', '0110', '1111', '1001'];
      return t[y % 4][x % 4] === '1' ? 1 : 0;
    },
    greca: function (x, y) {
      var t = ['11111110', '10000010', '10111010', '10100010', '10111110', '10000000', '11111111', '00000000'];
      if (y < 4 || y >= 20) return t[(y + 4) % 8][x % 8] === '1' ? 1 : 0;
      return 0;
    },
    rde: function (x, y) {
      var ox = Math.floor((COLS - 17) / 2), oy = Math.floor((ROWS - 7) / 2);
      if (y === 2 || y === ROWS - 3) return 1;
      if (y === 4 || y === ROWS - 5) return x % 2;
      var gx = x - ox, gy = y - oy;
      if (gx < 0 || gy < 0 || gy >= 7 || gx >= 17) return 0;
      return RDE_GLYPH[gy][gx] === '1' ? 1 : 0;
    }
  };
  function loadPreset(name) {
    var fn = PRESETS[name]; if (!fn) return;
    for (var y = 0; y < ROWS; y++) for (var x = 0; x < COLS; x++) cells[y * COLS + x] = fn(x, y);
    stopRun(); drawAll();
  }

  /* ---------- sizing ---------- */
  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    var r = gridCv.getBoundingClientRect();
    if (!r.width) return;
    gw = r.width; gh = r.height;
    gridCv.width = Math.round(gw * dpr); gridCv.height = Math.round(gh * dpr);
    var k = knitCv.getBoundingClientRect();
    kw = k.width; kh = k.height;
    knitCv.width = Math.round(kw * dpr); knitCv.height = Math.round(kh * dpr);
    drawAll();
  }

  /* ---------- colour helpers ---------- */
  function shade(hex, f) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    function c(v) { return Math.max(0, Math.min(255, Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f))); }
    return 'rgb(' + c(r) + ',' + c(g) + ',' + c(b) + ')';
  }

  /* ---------- grid (the programme) ---------- */
  function drawGrid() {
    if (!gw) return;
    gctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    gctx.fillStyle = '#0d0d0c'; gctx.fillRect(0, 0, gw, gh);
    var cw = gw / COLS, ch = gh / ROWS, a = YARNS[colA].hex, b = YARNS[colB].hex;
    for (var y = 0; y < ROWS; y++) for (var x = 0; x < COLS; x++) {
      gctx.fillStyle = cells[y * COLS + x] ? a : b;
      gctx.globalAlpha = cells[y * COLS + x] ? 1 : 0.16;
      gctx.fillRect(x * cw + 0.5, y * ch + 0.5, cw - 1, ch - 1);
    }
    gctx.globalAlpha = 1;
    gctx.strokeStyle = 'rgba(236,231,220,.09)'; gctx.lineWidth = 1;
    gctx.beginPath();
    for (var i = 0; i <= COLS; i += 4) { gctx.moveTo(Math.round(i * cw) + 0.5, 0); gctx.lineTo(Math.round(i * cw) + 0.5, gh); }
    for (var j = 0; j <= ROWS; j += 4) { gctx.moveTo(0, Math.round(j * ch) + 0.5); gctx.lineTo(gw, Math.round(j * ch) + 0.5); }
    gctx.stroke();
  }

  /* ---------- knit renderer ---------- */
  function stitch(ctx, x, y, w, h, hex) {
    var cx = x + w / 2, top = y - h * 0.28, bot = y + h * 1.02, lw = w * 0.4;
    ctx.lineCap = 'round';
    // shadow
    ctx.strokeStyle = shade(hex, -0.55); ctx.lineWidth = lw * 1.25;
    ctx.beginPath(); ctx.moveTo(x + w * 0.2, top); ctx.lineTo(cx - w * 0.04, bot);
    ctx.moveTo(x + w * 0.8, top); ctx.lineTo(cx + w * 0.04, bot); ctx.stroke();
    // yarn
    ctx.strokeStyle = hex; ctx.lineWidth = lw;
    ctx.beginPath(); ctx.moveTo(x + w * 0.2, top); ctx.lineTo(cx - w * 0.04, bot);
    ctx.moveTo(x + w * 0.8, top); ctx.lineTo(cx + w * 0.04, bot); ctx.stroke();
    // highlight (ply twist)
    ctx.strokeStyle = shade(hex, 0.28); ctx.lineWidth = Math.max(0.6, lw * 0.22);
    ctx.beginPath(); ctx.moveTo(x + w * 0.16, top + h * 0.12); ctx.lineTo(cx - w * 0.14, bot - h * 0.22);
    ctx.moveTo(x + w * 0.76, top + h * 0.12); ctx.lineTo(cx - w * 0.04 + w * 0.02, bot - h * 0.3); ctx.stroke();
  }
  function drawKnit(progress) {
    if (!kw) return;
    kctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    kctx.fillStyle = '#0b0b0a'; kctx.fillRect(0, 0, kw, kh);
    var w = kw / COLS, h = kh / ROWS, a = YARNS[colA].hex, b = YARNS[colB].hex;
    var full = Math.floor(knitRows), partial = progress == null ? 0 : progress;
    for (var y = 0; y < ROWS; y++) {
      var lim = y < full ? COLS : (y === full ? partial : 0);
      if (!lim) continue;
      var ltr = y % 2 === 0;
      for (var i = 0; i < lim; i++) {
        var x = ltr ? i : COLS - 1 - i;
        stitch(kctx, x * w, y * h, w, h, cells[y * COLS + x] ? a : b);
      }
    }
    // needles ahead of the fabric
    if (full < ROWS) {
      kctx.fillStyle = 'rgba(236,231,220,.16)';
      for (var n = 0; n < COLS; n++) kctx.fillRect(n * w + w / 2 - 0.5, (full + 1) * h + 4, 1, kh);
    }
  }
  function drawAll() { drawGrid(); drawKnit(); }

  /* ---------- run animation ---------- */
  function setStatus(key, fb) { if (statusEl) statusEl.textContent = T.t(key, fb); }
  function stopRun() {
    running = false; cancelAnimationFrame(raf); knitRows = ROWS;
    if (carriage) carriage.classList.remove('is-on');
    if (runBtn) runBtn.removeAttribute('disabled');
    setStatus('loom.ready', 'Pronto');
  }
  function run() {
    if (running) return;
    running = true; knitRows = 0;
    runBtn.setAttribute('disabled', '');
    carriage.classList.add('is-on');
    setStatus('loom.running', 'In lavoro…');
    var rowTime = 230, start = performance.now(), head = carriage.querySelector('i');
    (function frame(now) {
      if (!running) return;
      var t = (now - start) / rowTime, row = Math.floor(t), f = t - row;
      if (row >= ROWS) { stopRun(); drawKnit(); setStatus('loom.done', 'Fatto'); return; }
      knitRows = row;
      var e = f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2;
      drawKnit(Math.ceil(e * COLS));
      var h = kh / ROWS, ltr = row % 2 === 0, px = (ltr ? e : 1 - e) * (kw - 46);
      carriage.style.transform = 'translateY(' + ((row + 1) * h) + 'px)';
      head.style.transform = 'translateX(' + px + 'px)';
      raf = requestAnimationFrame(frame);
    })(start);
  }

  /* ---------- painting ---------- */
  var painting = false, paintVal = 1, last = -1;
  function cellAt(e) {
    var r = gridCv.getBoundingClientRect();
    var x = Math.floor((e.clientX - r.left) / r.width * COLS), y = Math.floor((e.clientY - r.top) / r.height * ROWS);
    if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return -1;
    return y * COLS + x;
  }
  function paint(e) {
    var i = cellAt(e); if (i < 0 || i === last) return;
    last = i; cells[i] = paintVal; drawAll();
  }
  gridCv.addEventListener('pointerdown', function (e) {
    e.preventDefault(); if (running) stopRun();
    var i = cellAt(e); if (i < 0) return;
    painting = true; paintVal = cells[i] ? 0 : 1; last = -1;
    try { gridCv.setPointerCapture(e.pointerId); } catch (err) {}
    paint(e); clearPresetActive();
  });
  gridCv.addEventListener('pointermove', function (e) { if (painting) paint(e); });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (ev) {
    gridCv.addEventListener(ev, function () { painting = false; });
  });

  /* ---------- controls ---------- */
  function clearPresetActive() {
    document.querySelectorAll('#loomPresets .chip').forEach(function (c) { c.classList.remove('is-active'); });
  }
  document.querySelectorAll('#loomPresets .chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      clearPresetActive(); chip.classList.add('is-active'); loadPreset(chip.getAttribute('data-preset'));
    });
  });
  function buildSwatches(id, get, set) {
    var box = document.getElementById(id); if (!box) return;
    YARNS.forEach(function (yarn, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'swatch' + (i === get() ? ' is-active' : '');
      b.style.background = yarn.hex; b.title = yarn.name; b.setAttribute('aria-label', yarn.name);
      b.addEventListener('click', function () {
        set(i);
        drawAll();
      });
      box.appendChild(b);
    });
  }
  function syncSwatches() {
    [['swA', colA], ['swB', colB]].forEach(function (p) {
      document.querySelectorAll('#' + p[0] + ' .swatch').forEach(function (s, j) { s.classList.toggle('is-active', j === p[1]); });
    });
  }
  // two identical yarns would hide the pattern: picking the other yarn's colour swaps them
  buildSwatches('swA', function () { return colA; }, function (i) { if (i === colB) colB = colA; colA = i; syncSwatches(); });
  buildSwatches('swB', function () { return colB; }, function (i) { if (i === colA) colA = colB; colB = i; syncSwatches(); });

  document.getElementById('loomInvert').addEventListener('click', function () {
    stopRun(); for (var i = 0; i < cells.length; i++) cells[i] = cells[i] ? 0 : 1; drawAll();
  });
  document.getElementById('loomClear').addEventListener('click', function () {
    stopRun(); cells.fill(0); clearPresetActive(); drawAll();
  });
  runBtn.addEventListener('click', run);

  /* ---------- boot ---------- */
  loadPreset('rombi');
  size();
  var rz; window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(size, 120); });
  if ('ResizeObserver' in window) new ResizeObserver(function () { clearTimeout(rz); rz = setTimeout(size, 60); }).observe(gridCv);

  // knit it once automatically the first time it scrolls into view
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { io.disconnect(); size(); run(); }
    }, { threshold: 0.55 });
    io.observe(knitCv);
  }
})();

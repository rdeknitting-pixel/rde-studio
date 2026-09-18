/* RDE “Studio” — main interactions */
(function () {
  'use strict';
  var doc = document, html = doc.documentElement, body = doc.body;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var I18N = window.RDE_I18N || { lang: 'it', label: function (k) { return k; }, toggle: function () {} };
  var hasGSAP = !!(window.gsap && window.ScrollTrigger);
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var lenis = null;

  $('#year').textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------ */
  /* Preloader                                                           */
  /* ------------------------------------------------------------------ */
  var preloader = $('#preloader'), preNum = $('#preloaderNum'), preBar = $('#preloaderBar');
  var pre = { shown: 0, target: 12, done: false };
  body.classList.add('is-locked');

  function bump(v) { pre.target = Math.max(pre.target, v); }
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { bump(55); }); else bump(55);
  var heroVideo = $('#heroVideo');
  if (heroVideo) {
    if (heroVideo.readyState >= 3) bump(85);
    heroVideo.addEventListener('canplay', function () { bump(85); }, { once: true });
  }
  window.addEventListener('load', function () { bump(100); });
  setTimeout(function () { bump(100); }, 4500); // never trap the visitor

  (function tick() {
    if (pre.done) return;
    pre.shown += Math.max(0.35, (pre.target - pre.shown) * 0.07);
    if (pre.shown > pre.target) pre.shown = pre.target;
    var v = Math.round(pre.shown);
    preNum.textContent = ('00' + v).slice(-3);
    preBar.style.transform = 'scaleX(' + (pre.shown / 100) + ')';
    if (v >= 100) { pre.done = true; setTimeout(reveal, 260); return; }
    requestAnimationFrame(tick);
  })();

  function reveal() {
    preloader.classList.add('is-done');
    body.classList.remove('is-locked');
    if (lenis) lenis.start();
    heroIntro();
    if (hasGSAP) ScrollTrigger.refresh();
  }

  /* ------------------------------------------------------------------ */
  /* Text splitting helpers                                              */
  /* ------------------------------------------------------------------ */
  function splitLines(el) {               // split on explicit <br>
    var parts = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = parts.map(function (p) { return '<span class="sl"><span>' + p + '</span></span>'; }).join('');
    return $$('.sl > span', el);
  }
  function splitWords(node) {             // wrap every word, keep inline markup
    $$('*', node).concat([node]).forEach(function (el) {
      Array.prototype.slice.call(el.childNodes).forEach(function (n) {
        if (n.nodeType !== 3 || !n.nodeValue.trim()) return;
        var frag = doc.createDocumentFragment();
        n.nodeValue.split(/(\s+)/).forEach(function (w) {
          if (!w) return;
          if (/^\s+$/.test(w)) { frag.appendChild(doc.createTextNode(' ')); return; }
          var s = doc.createElement('span'); s.className = 'w'; s.textContent = w; frag.appendChild(s);
        });
        el.replaceChild(frag, n);
      });
    });
    return $$('.w', node);
  }

  /* ------------------------------------------------------------------ */
  /* Smooth scroll                                                       */
  /* ------------------------------------------------------------------ */
  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);
  if (hasGSAP && window.Lenis && !reduced) {
    lenis = new Lenis({ lerp: 0.095, wheelMultiplier: 1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
    window.__lenis = lenis;
  }
  function scrollToTarget(target) {
    if (lenis) lenis.scrollTo(target, { duration: 1.6, easing: function (t) { return 1 - Math.pow(1 - t, 4); } });
    else {
      var el = typeof target === 'string' ? $(target) : target;
      if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    }
  }
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2 || !$(id)) return;
      e.preventDefault();
      closeMenu();
      scrollToTarget(id === '#top' ? 0 : id);
    });
  });

  /* ------------------------------------------------------------------ */
  /* Header, menu, language                                              */
  /* ------------------------------------------------------------------ */
  var header = $('#header'), burger = $('#burger'), menu = $('#menu');
  function closeMenu() {
    if (!menu.classList.contains('is-open')) return;
    menu.classList.remove('is-open'); menu.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    body.classList.remove('is-locked'); if (lenis) lenis.start();
  }
  burger.addEventListener('click', function () {
    if (menu.classList.contains('is-open')) return closeMenu();
    menu.classList.add('is-open'); menu.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    body.classList.add('is-locked'); if (lenis) lenis.stop();
  });
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', function () { if (window.innerWidth > 980) closeMenu(); });
  $('#langBtn').addEventListener('click', function () { I18N.toggle(); });

  var lastY = 0;
  function onScrollHeader() {
    var y = window.pageYOffset;
    if (menu.classList.contains('is-open')) return;
    header.classList.toggle('is-hidden', y > 500 && y > lastY + 2);
    if (y < lastY - 2 || y <= 500) header.classList.remove('is-hidden');
    lastY = y;
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* scroll thread */
  var threadFill = $('#threadFill'), threadNeedle = $('#threadNeedle');
  function onScrollThread() {
    var max = doc.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, window.pageYOffset / max) : 0;
    threadFill.style.transform = 'scaleY(' + p + ')';
    threadNeedle.style.transform = 'translateY(' + (p * (window.innerHeight - 7)) + 'px)';
  }
  window.addEventListener('scroll', onScrollThread, { passive: true });
  window.addEventListener('resize', onScrollThread);
  onScrollThread();

  /* ------------------------------------------------------------------ */
  /* Cursor + magnetic                                                   */
  /* ------------------------------------------------------------------ */
  if (finePointer && !reduced) {
    html.classList.add('has-cursor');
    var cur = $('#cursor'), curLabel = $('#cursorLabel');
    var cx = -100, cy = -100, tx = -100, ty = -100;
    window.addEventListener('pointermove', function (e) { tx = e.clientX; ty = e.clientY; }, { passive: true });
    (function loop() {
      cx += (tx - cx) * 0.22; cy += (ty - cy) * 0.22;
      cur.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)';
      requestAnimationFrame(loop);
    })();
    doc.addEventListener('pointerover', function (e) {
      var t = e.target;
      if (!t.closest) return;
      var lab = t.closest('[data-cursor-label],[data-cursor]');
      var hide = t.closest('[data-cursor-hide]');
      var link = t.closest('a,button,.swatch,.chip');
      cur.classList.toggle('is-hidden', !!hide);
      if (lab && !link || (lab && lab === link)) {
        curLabel.textContent = lab.hasAttribute('data-cursor') ? lab.getAttribute('data-cursor') : I18N.label(lab.getAttribute('data-cursor-label'));
        cur.classList.add('is-label'); cur.classList.remove('is-link');
      } else {
        cur.classList.remove('is-label');
        cur.classList.toggle('is-link', !!link);
      }
    });
    doc.addEventListener('mouseleave', function () { cur.classList.add('is-hidden'); });
    doc.addEventListener('mouseenter', function () { cur.classList.remove('is-hidden'); });

    if (hasGSAP) $$('[data-magnetic]').forEach(function (el) {
      var qx = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' }), qy = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        qx((e.clientX - r.left - r.width / 2) * 0.35); qy((e.clientY - r.top - r.height / 2) * 0.45);
      });
      el.addEventListener('pointerleave', function () { qx(0); qy(0); });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Videos: play only while visible                                     */
  /* ------------------------------------------------------------------ */
  if ('IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else v.pause();
      });
    }, { rootMargin: '200px 0px', threshold: 0.01 });
    $$('video[data-autoplay]').forEach(function (v) { v.muted = true; vio.observe(v); });
    if (heroVideo) vio.observe(heroVideo);
  }

  /* ------------------------------------------------------------------ */
  /* Hero                                                                */
  /* ------------------------------------------------------------------ */
  var heroPlayed = false;
  function heroIntro() {
    if (heroPlayed) return; heroPlayed = true;
    if (!hasGSAP || reduced) return;
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('#heroMedia', { scale: 1.25, duration: 2.4 }, 0)
      .from('.hero__title .line > span', { yPercent: 115, duration: 1.5, stagger: 0.12 }, 0.15)
      .from('.hero__kicker, .hero__lead, .hero .btn', { y: 30, opacity: 0, duration: 1.2, stagger: 0.08 }, 0.7)
      .from('.hero__meta', { opacity: 0, duration: 1.2 }, 1)
      .from('#header', { yPercent: -120, duration: 1.2, clearProps: 'transform' }, 0.6);
  }

  /* ------------------------------------------------------------------ */
  /* Scroll-driven scenes                                                */
  /* ------------------------------------------------------------------ */
  var hscroll = $('#hscroll'), track = $('#hscrollTrack');

  if (hasGSAP && !reduced) {
    html.classList.add('js-ready');

    // hero parallax out
    gsap.to('#heroMedia video', { yPercent: 18, scale: 1.08, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__content', { yPercent: -18, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });

    // manifesto words
    var words = splitWords($('#manifestoText'));
    ScrollTrigger.create({
      trigger: '#manifestoText', start: 'top 82%', end: 'bottom 45%', scrub: true,
      onUpdate: function (self) {
        var n = self.progress * words.length;
        for (var i = 0; i < words.length; i++) words[i].style.opacity = i < n ? 1 : 0.14;
      }
    });

    // headings
    $$('[data-split]').forEach(function (el) {
      var lines = splitLines(el);
      gsap.from(lines, { yPercent: 112, duration: 1.4, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
    // chapter numbers
    $$('.chapter__head .chapter__num').forEach(function (el) {
      gsap.from(el, { xPercent: -14, opacity: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });
    // generic reveals
    $$('[data-reveal]').forEach(function (el) {
      gsap.to(el, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });
    // figures: clip reveal + inner parallax
    $$('.ph').forEach(function (fig) {
      gsap.from(fig, { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.5, ease: 'expo.out', scrollTrigger: { trigger: fig, start: 'top 92%', once: true } });
    });
    $$('[data-parallax]').forEach(function (fig) {
      var amt = parseFloat(fig.getAttribute('data-parallax')) || 6, img = $('img', fig);
      if (img && !fig.classList.contains('device')) gsap.fromTo(img, { yPercent: -amt }, { yPercent: amt, ease: 'none', scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true } });
      if (fig.classList.contains('device')) gsap.fromTo(fig, { y: amt * 6 }, { y: -amt * 6, ease: 'none', scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    var ibg = $('[data-parallax-bg]');
    if (ibg) gsap.fromTo(ibg, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.italy', start: 'top bottom', end: 'bottom top', scrub: true } });

    // counters
    $$('[data-count]').forEach(function (el) {
      var end = parseInt(el.getAttribute('data-count'), 10), o = { v: end > 1000 ? end - 85 : 0 };
      el.textContent = Math.round(o.v);
      gsap.to(o, { v: end, duration: 2.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true }, onUpdate: function () { el.textContent = Math.round(o.v); } });
    });

    // horizontal weaving scene
    var mm = gsap.matchMedia();
    mm.add('(min-width: 981px) and (hover: hover) and (pointer: fine)', function () {
      hscroll.classList.remove('is-native');
      var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
      var tw = gsap.to(track, {
        x: function () { return -dist(); }, ease: 'none',
        scrollTrigger: {
          trigger: hscroll, start: 'top top', end: function () { return '+=' + dist(); },
          pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: function (s) { $('#hscrollBar').style.transform = 'scaleX(' + s.progress + ')'; }
        }
      });
      $$('.hpanel--img img', track).forEach(function (img) {
        gsap.fromTo(img, { scale: 1.18, xPercent: -5 }, { xPercent: 5, ease: 'none', scrollTrigger: { trigger: img.parentNode, containerAnimation: tw, start: 'left right', end: 'right left', scrub: true } });
      });
      return function () { gsap.set(track, { clearProps: 'all' }); };
    });
    mm.add('(max-width: 980px), (hover: none), (pointer: coarse)', function () {
      hscroll.classList.add('is-native');
      return function () { hscroll.classList.remove('is-native'); };
    });

    // measuring tape
    gsap.to('#tapeStrip', { x: function () { return -window.innerWidth * 1.6; }, ease: 'none', scrollTrigger: { trigger: '.chapter--misura', start: 'top bottom', end: 'bottom top', scrub: 0.4, invalidateOnRefresh: true } });

    // years
    var yTo = $('#yearTo'), yNow = new Date().getFullYear(), yo = { v: 1985 };
    gsap.to(yo, { v: yNow, ease: 'none', scrollTrigger: { trigger: '.story__head', start: 'top 85%', end: 'top 25%', scrub: true }, onUpdate: function () { yTo.textContent = Math.round(yo.v); } });

    // footer logo
    gsap.from('.footer__logo > *', { yPercent: 40, opacity: 0, duration: 1.6, ease: 'expo.out', stagger: 0.15, scrollTrigger: { trigger: '.footer__logo', start: 'top 92%', once: true } });
  } else {
    hscroll.classList.add('is-native');
    $('#yearTo').textContent = new Date().getFullYear();
  }

  /* rail: active chapter + visibility */
  var rail = $('#rail'), railLinks = $$('[data-rail]');
  if (hasGSAP) {
    $$('[data-chapter]').forEach(function (sec) {
      var i = sec.getAttribute('data-chapter');
      ScrollTrigger.create({
        trigger: sec, start: 'top 55%', end: 'bottom 55%',
        onToggle: function (s) { if (s.isActive) railLinks.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('data-rail') === i); }); }
      });
    });
    ScrollTrigger.create({ trigger: '#fase-filo', endTrigger: '#fase-imballo', start: 'top 60%', end: 'bottom 40%', onToggle: function (s) { rail.classList.toggle('is-visible', s.isActive); } });
  }

  /* ------------------------------------------------------------------ */
  /* Measuring tape numbers                                              */
  /* ------------------------------------------------------------------ */
  (function () {
    var strip = $('#tapeStrip'); if (!strip) return;
    var n = Math.ceil((window.innerWidth * 4) / 80), h = '';
    for (var i = 1; i < n; i++) h += '<span style="left:' + (i * 80) + 'px">' + (i * 10) + '</span>';
    strip.innerHTML = h;
  })();

  /* ------------------------------------------------------------------ */
  /* Packing tape marquee                                                */
  /* ------------------------------------------------------------------ */
  $$('.scotch__run').forEach(function (run, idx) {
    var unit = '<span><img src="assets/logo-rde.svg" alt="">Knitting Developers</span><span><em>Made in Italy</em></span><span>Tessitura · Maglieria</span><span><em>“Studio”</em></span>';
    var half = ''; for (var i = 0; i < 6; i++) half += unit;
    run.innerHTML = half + half;
    if (hasGSAP && !reduced) gsap.fromTo(run, { xPercent: idx ? -50 : 0 }, { xPercent: idx ? 0 : -50, duration: 60, ease: 'none', repeat: -1 });
  });

  /* ------------------------------------------------------------------ */
  /* Inspection lens                                                     */
  /* ------------------------------------------------------------------ */
  (function () {
    var box = $('#lens'); if (!box) return;
    var glass = $('#lensGlass'), base = $('.lens__base', box), ZOOM = 1.9;
    var colorSrc = 'assets/img/lente-11.webp', iw = 1800, ih = 1200;
    var pos = { x: 0.62, y: 0.42 }, target = { x: 0.62, y: 0.42 }, user = false, visible = false, t0 = 0;
    glass.style.backgroundImage = 'url("' + colorSrc + '")';

    function layout() {
      var W = box.clientWidth, H = box.clientHeight; if (!W) return;
      var s = Math.max(W / iw, H / ih), dw = iw * s, dh = ih * s, ox = (W - dw) / 2, oy = (H - dh) / 2;
      var R = glass.offsetWidth / 2, px = pos.x * W, py = pos.y * H;
      glass.style.left = px + 'px'; glass.style.top = py + 'px';
      glass.style.backgroundSize = (dw * ZOOM) + 'px ' + (dh * ZOOM) + 'px';
      glass.style.backgroundPosition = (-((px - ox) * ZOOM - R)) + 'px ' + (-((py - oy) * ZOOM - R)) + 'px';
    }
    function frame(now) {
      if (!visible) return;
      if (!user) { t0 = now / 1000; target.x = 0.5 + Math.cos(t0 * 0.45) * 0.26; target.y = 0.48 + Math.sin(t0 * 0.7) * 0.2; }
      pos.x += (target.x - pos.x) * (user ? 0.2 : 0.05); pos.y += (target.y - pos.y) * (user ? 0.2 : 0.05);
      layout(); requestAnimationFrame(frame);
    }
    function move(e) {
      var r = box.getBoundingClientRect(); user = true;
      target.x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      target.y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    }
    box.addEventListener('pointermove', move);
    box.addEventListener('pointerdown', move);
    box.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') user = false; });
    if (reduced) { visible = false; layout(); window.addEventListener('resize', layout); box.addEventListener('pointermove', function () { pos.x = target.x; pos.y = target.y; layout(); }); }
    else if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        var was = visible; visible = en[0].isIntersecting;
        if (visible && !was) requestAnimationFrame(frame);
      }, { threshold: 0.05 }).observe(box);
    } else { visible = true; requestAnimationFrame(frame); }

    $$('.lens__switch button', box).forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        $$('.lens__switch button', box).forEach(function (o) { o.classList.toggle('is-active', o === b); });
        var pre = new Image();
        pre.onload = function () { glass.style.backgroundImage = 'url("' + b.getAttribute('data-color') + '")'; };
        pre.src = b.getAttribute('data-color');
        base.style.opacity = 0;
        var nb = new Image();
        nb.onload = function () { base.src = nb.src; base.style.opacity = 1; };
        nb.src = b.getAttribute('data-base');
      });
    });
  })();

  /* ------------------------------------------------------------------ */
  /* Generative knit field (manifesto background)                        */
  /* ------------------------------------------------------------------ */
  (function () {
    var cv = $('#knitField'); if (!cv) return;
    var ctx = cv.getContext('2d'), sec = cv.parentNode, W = 0, H = 0, dpr = 1, S = 26, baseCv = doc.createElement('canvas');
    var mx = -999, my = -999, sx = -999, sy = -999, visible = false, dirty = true;
    function v(c, x, y, w, h) {
      c.moveTo(x + w * 0.18, y); c.lineTo(x + w * 0.5, y + h * 0.95);
      c.moveTo(x + w * 0.82, y); c.lineTo(x + w * 0.5, y + h * 0.95);
    }
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = sec.clientWidth; H = sec.clientHeight; if (!W) return;
      cv.width = baseCv.width = Math.round(W * dpr); cv.height = baseCv.height = Math.round(H * dpr);
      var b = baseCv.getContext('2d'); b.setTransform(dpr, 0, 0, dpr, 0, 0); b.clearRect(0, 0, W, H);
      b.strokeStyle = 'rgba(236,231,220,.075)'; b.lineWidth = S * 0.2; b.lineCap = 'round'; b.beginPath();
      for (var y = -S; y < H + S; y += S * 0.8) for (var x = 0; x < W + S; x += S) v(b, x, y, S, S);
      b.stroke(); dirty = true;
    }
    function draw() {
      if (!visible) return;
      sx += (mx - sx) * 0.12; sy += (my - sy) * 0.12;
      if (dirty || Math.abs(mx - sx) > 0.3 || Math.abs(my - sy) > 0.3) {
        dirty = false;
        ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); ctx.drawImage(baseCv, 0, 0);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.lineCap = 'round';
        var R = 210, step = S * 0.8;
        var y0 = Math.floor((sy - R + S) / step) * step - S, x0 = Math.floor((sx - R) / S) * S;
        for (var y = y0; y < sy + R; y += step) for (var x = x0; x < sx + R; x += S) {
          var dx = x + S / 2 - sx, dy = y + S / 2 - sy, d = Math.sqrt(dx * dx + dy * dy); if (d > R) continue;
          var k = 1 - d / R; k = k * k;
          ctx.strokeStyle = 'rgba(217,200,160,' + (k * 0.85) + ')'; ctx.lineWidth = S * (0.2 + k * 0.16);
          ctx.beginPath(); v(ctx, x + dx / d * k * -6 || x, y + dy / d * k * -6 || y, S, S); ctx.stroke();
        }
      }
      requestAnimationFrame(draw);
    }
    sec.addEventListener('pointermove', function (e) { var r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
    sec.addEventListener('pointerleave', function () { mx = my = -999; });
    resize(); var rz; window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(resize, 150); });
    if (reduced || !('IntersectionObserver' in window)) { ctx.drawImage(baseCv, 0, 0); return; }
    new IntersectionObserver(function (en) { var was = visible; visible = en[0].isIntersecting; if (visible && !was) { dirty = true; requestAnimationFrame(draw); } }).observe(sec);
  })();

  /* ------------------------------------------------------------------ */
  /* The thread you can pull (verlet rope)                               */
  /* ------------------------------------------------------------------ */
  (function () {
    var cv = $('#rope'); if (!cv) return;
    cv.setAttribute('data-cursor-label', 'tira');
    var ctx = cv.getContext('2d'), W = 0, H = 0, dpr = 1, N = 46, pts = [], seg = 0, visible = false;
    var ptr = { x: -999, y: -999, px: -999, py: -999, down: false, grab: -1 };

    function init() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight; if (!W) return;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      var ax = -20, ay = H * 0.3, bx = W + 20, by = H * 0.22;
      seg = Math.hypot(bx - ax, by - ay) / (N - 1) * 1.035;
      pts = [];
      for (var i = 0; i < N; i++) { var t = i / (N - 1), x = ax + (bx - ax) * t, y = ay + (by - ay) * t + Math.sin(t * Math.PI) * H * 0.2; pts.push({ x: x, y: y, ox: x, oy: y, pin: i === 0 || i === N - 1 }); }
    }
    function step() {
      var i, p;
      for (i = 0; i < N; i++) {
        p = pts[i]; if (p.pin) continue;
        var vx = (p.x - p.ox) * 0.985, vy = (p.y - p.oy) * 0.985;
        p.ox = p.x; p.oy = p.y; p.x += vx; p.y += vy + 0.32;
        if (ptr.grab < 0) {                      // brushing the thread pushes it
          var dx = p.x - ptr.x, dy = p.y - ptr.y, d2 = dx * dx + dy * dy;
          if (d2 < 3600) { p.x += (ptr.x - ptr.px) * 0.45; p.y += (ptr.y - ptr.py) * 0.45; }
        }
      }
      if (ptr.grab >= 0) { p = pts[ptr.grab]; p.x = ptr.x; p.y = ptr.y; }
      for (var k = 0; k < 8; k++) for (i = 0; i < N - 1; i++) {
        var a = pts[i], b = pts[i + 1], ex = b.x - a.x, ey = b.y - a.y, d = Math.sqrt(ex * ex + ey * ey) || 0.001, diff = (d - seg) / d * 0.5;
        var ag = a.pin || i === ptr.grab, bg = b.pin || i + 1 === ptr.grab;
        if (!ag) { a.x += ex * diff * (bg ? 2 : 1); a.y += ey * diff * (bg ? 2 : 1); }
        if (!bg) { b.x -= ex * diff * (ag ? 2 : 1); b.y -= ey * diff * (ag ? 2 : 1); }
      }
      ptr.px = ptr.x; ptr.py = ptr.y;
    }
    function path() {
      ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
      for (var i = 1; i < N - 1; i++) { var mx = (pts[i].x + pts[i + 1].x) / 2, my = (pts[i].y + pts[i + 1].y) / 2; ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my); }
      ctx.lineTo(pts[N - 1].x, pts[N - 1].y);
    }
    function draw() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.save(); ctx.translate(0, 14); ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.lineWidth = 9; ctx.filter = 'blur(8px)'; path(); ctx.stroke(); ctx.restore();
      ctx.filter = 'none';
      ctx.strokeStyle = '#8f8263'; ctx.lineWidth = 6.5; path(); ctx.stroke();
      ctx.strokeStyle = '#d9c8a0'; ctx.lineWidth = 4.6; path(); ctx.stroke();
      ctx.setLineDash([2.5, 7]); ctx.strokeStyle = 'rgba(80,68,40,.75)'; ctx.lineWidth = 4.6; ctx.lineCap = 'butt'; path(); ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = 'rgba(255,250,235,.55)'; ctx.lineWidth = 1; ctx.save(); ctx.translate(0, -1.5); path(); ctx.stroke(); ctx.restore();
    }
    function loop() { if (!visible) return; step(); draw(); requestAnimationFrame(loop); }
    function local(e) { var r = cv.getBoundingClientRect(); ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top; }
    cv.addEventListener('pointermove', function (e) { local(e); });
    cv.addEventListener('pointerdown', function (e) {
      local(e); ptr.px = ptr.x; ptr.py = ptr.y;
      var best = -1, bd = 90 * 90;
      for (var i = 1; i < N - 1; i++) { var dx = pts[i].x - ptr.x, dy = pts[i].y - ptr.y, d = dx * dx + dy * dy; if (d < bd) { bd = d; best = i; } }
      ptr.grab = best;
      if (best >= 0) { try { cv.setPointerCapture(e.pointerId); } catch (err) {} }
    });
    ['pointerup', 'pointercancel'].forEach(function (ev) { cv.addEventListener(ev, function () { ptr.grab = -1; }); });
    cv.addEventListener('pointerleave', function () { if (ptr.grab < 0) { ptr.x = ptr.y = ptr.px = ptr.py = -999; } });

    init(); var rz; window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(function () { init(); if (reduced) { for (var i = 0; i < 200; i++) step(); draw(); } }, 150); });
    if (reduced || !('IntersectionObserver' in window)) { for (var i = 0; i < 200; i++) step(); draw(); return; }
    new IntersectionObserver(function (en) { var was = visible; visible = en[0].isIntersecting; if (visible && !was) requestAnimationFrame(loop); }).observe(cv);
  })();

  /* ------------------------------------------------------------------ */
  /* Final layout pass                                                   */
  /* ------------------------------------------------------------------ */
  if (hasGSAP) {
    ScrollTrigger.sort();
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }
})();

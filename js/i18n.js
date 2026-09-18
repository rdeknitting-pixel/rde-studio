/* RDE “Studio” — i18n. Italian lives in the HTML; English is applied on top. */
(function () {
  var EN = {
    'pre.label': 'Threading up',
    'nav.process': 'The making', 'nav.loom': 'The loom', 'nav.tech': 'Technology', 'nav.story': 'Heritage', 'nav.contact': 'Contact',
    'hero.kicker': 'Knitwear manufacture · since 1985',
    'hero.t1': 'From yarn',
    'hero.t2': 'to <em>garment.</em>',
    'hero.lead': 'This is not a company website. It is the story of a craft: seven gestures, a single thread, all under one roof.',
    'hero.cta': 'Step into the workshop',
    'hero.live': '100% Made in Italy',
    'man.kicker': 'Manifesto',
    'man.text': 'A sweater is not printed, not assembled, not improvised. It is <em>programmed</em> stitch by stitch, <em>knitted</em> needle after needle, <em>measured</em> to the centimetre and <em>inspected</em> against the light, loop by loop. RDE “Studio” is where all of this happens — by hand, by machine, in Italy.',
    'man.f1': 'The year we threaded our first needle',
    'man.f2': 'Stages of making, all in-house',
    'man.f3': 'Made in Italy, from yarn to box',
    'intro.kicker': 'The making',
    'intro.title': 'Seven gestures.<br>One single <em>thread.</em>',
    'intro.lead': 'Follow the thread: it leads you through the workshop, stage by stage, in the exact order a garment takes shape. Touch, drag, draw. Here you learn by watching.',
    'intro.hint': '↑ it is a real thread: go on, pull it',
    'ch1.kicker': 'The yarn',
    'ch1.title': 'It all begins<br>with a <em>cone.</em>',
    'ch1.lead': 'Before the design, before the machine, there is the material. Wools, cashmere, cottons, silks: they arrive on cones and each has a character — a hand, a weight, a twist.',
    'ch1.p': 'We choose the count, test the tension, listen to how the yarn runs through the feeder. It is touch before technique: a yarn well understood is half the garment.',
    'ch1.s1k': 'Material', 'ch1.s1v': 'Natural and noble fibres',
    'ch1.s2k': 'Supply chain', 'ch1.s2v': 'GOTS · RWS · RMS · RAS certified',
    'ch1.s3k': 'Gesture', 'ch1.s3v': 'Threaded by hand, cone by cone',
    'ch1.cap1': 'Cones waiting above the machine', 'ch1.cap2': 'Blue and white mouliné',
    'ch2.kicker': 'The design',
    'ch2.title': 'Every stitch<br>is a line of <em>code.</em>',
    'ch2.lead': 'A knitted garment is born on a screen. The programmer translates the designer’s sketch into a language the machine understands: one square, one stitch.',
    'ch2.p': 'Cables, jacquards, intarsia, pointelle, fashioning: every structure is drawn stitch by stitch with pen and tablet, simulated, corrected, tried on a swatch. This is where we find out whether an idea can become a sweater.',
    'ch2.cap1': 'Real programming, RDE technical office',
    'loom.kicker': 'Interactive loom', 'loom.title': 'Now you try.',
    'loom.intro': 'Draw on the grid just like our programmer does: every square is a stitch. Then press “Knit it” and watch the carriage knit your design, course after course.',
    'loom.prog': 'Programme', 'loom.out': 'Fabric', 'loom.ready': 'Ready', 'loom.running': 'Knitting…', 'loom.done': 'Done',
    'loom.presets': 'Structures', 'loom.p1': 'Diamonds', 'loom.p2': 'Stripes', 'loom.p3': 'Houndstooth', 'loom.p4': 'Greek key',
    'loom.yarnA': 'Yarn A', 'loom.yarnB': 'Yarn B', 'loom.invert': 'Invert', 'loom.clear': 'Clear', 'loom.run': 'Knit it',
    'ch3.kicker': 'The knitting',
    'ch3.title': 'Thousands of needles,<br>a single <em>breath.</em>',
    'ch3.lead': 'The programme goes down to the machine. The carriage runs along the needle beds, needles rise and fall, feeders cross: the yarn stops being yarn.',
    'ch3.hint': 'Scroll',
    'ch3.capA': 'Yarn feeders in position above the needle bed',
    'ch3.h1': 'Stoll electronic flat-knitting machines',
    'ch3.p1': 'We work with latest-generation electronic flat-bed machines. German technology, Italian hands: the machine executes, but it is the technician who tunes it — tensions, take-down, speed — until the fabric is exactly as intended.',
    'ch3.tag': 'Motorised yarn feeders, independent of the carriage',
    'ch3.capB': 'ADF 530: the panel comes down from the take-down',
    'ch3.capC': 'The heart of the machine, seen from inside',
    'ch3.h2': 'The thread never stops',
    'ch3.p2': 'From cone to tensioner, from tensioner to feeder, from feeder to needle. A path of a few metres where one extra gram of tension changes the hand of a garment. That is why, on the knitting floor, we look, touch and listen.',
    'ch3.capD': 'Tensioners: they meter the tension of every yarn end',
    'ch3.capE': 'A panel is born: an openwork mesh descends from the needle bed',
    'ch3.capF': 'The knitting floor',
    'ch4.kicker': 'The panels',
    'ch4.title': 'The garment already<br>exists, in <em>pieces.</em>',
    'ch4.lead': 'Front, back, sleeves, collars. What leaves the machine is not a sweater: it is fully-fashioned panels, shaped stitch by stitch to the garment’s form.',
    'ch4.p': 'No cutting, no waste: the shape is in the programme. Each panel is gathered, counted and matched with its siblings — same dye lot, same yarn batch — before moving on.',
    'ch4.cap1': 'Panels fresh off the machine', 'ch4.cap2': 'The swatch archive',
    'ch5.kicker': 'The measure',
    'ch5.title': 'Luxury has one<br>tolerance: <em>zero.</em>',
    'ch5.lead': 'Knit is alive: it breathes, gives, recovers. That is why every garment is laid flat and measured by hand, tape in hand, point by point against the spec sheet.',
    'ch5.p': 'Shoulder, chest, hem, sleeve length, neckline. Each dimension is checked against what the maison asked for and written down. If a centimetre is off, the garment does not pass.',
    'ch5.q1': 'Chest width', 'ch5.q2': 'Total length', 'ch5.q3': 'Sleeve length', 'ch5.q4': 'Neck opening', 'ch5.q5': 'Rib height',
    'ch5.cap1': 'The spec sheet: filled in by pen, garment by garment',
    'ch6.kicker': 'The inspection',
    'ch6.title': 'Against the light,<br>loop by <em>loop.</em>',
    'ch6.hint': 'Move the lens over the image',
    'ch6.lead': 'No sensor sees what a trained eye sees. Every panel goes over the light table and under the lens: a dropped stitch, a pulled thread, a knot — nothing gets past.',
    'ch6.p': 'The inspection plate flattens the fabric and reveals its structure; light from below shows its evenness. What can be mended is mended by needle, by hand. What is not perfect does not leave.',
    'ch7.kicker': 'The departure',
    'ch7.title': 'One tape, one signature,<br>and off it <em>goes.</em>',
    'ch7.lead': 'Counted, folded, protected. The garments leave Montagnana for the ateliers of the maisons that imagined them.',
    'ch7.p': 'The tape that seals every box says who we are and where we come from. Our name will not appear on the garment’s label — but whoever wears it will feel everything else.',
    'ch7.cap1': 'The finished garment',
    'tech.kicker': 'Technology',
    'tech.title': 'Craftspeople,<br>in real <em>time.</em>',
    'tech.lead': 'Every machine is connected. From the control room we follow production machine by machine: what it is knitting, how far along it is, when it will finish.',
    'tech.p': 'Technology does not replace the hand: it removes what is superfluous. Less downtime, fewer errors, more attention where it truly matters — on the garment.',
    'tech.l1': 'In-house sampling and development', 'tech.l2': 'Knitting on Stoll electronic machines', 'tech.l3': 'Quality control on every single garment',
    'story.kicker': 'Heritage',
    'story.cap1': '1985 — Where it all began',
    'story.title': 'Forty years<br>behind the <em>scenes.</em>',
    'story.lead': 'Since 1985 we have worked for the most prestigious Italian and international fashion houses. Quietly, as befits those who do this job.',
    'story.p': 'Machines, software and yarns have changed. The way has not: one workshop, one site in Montagnana — between medieval walls and the Paduan countryside — where every stage stays under our eyes.',
    'story.cap2': 'Today — The knitting floor from above',
    'it.kicker': 'Origin',
    'it.lead': 'Not a label: an address. Everything you have seen happens here, at Via dell’Industria 6, Montagnana, province of Padua.',
    'it.c1': 'Global Organic Textile Standard', 'it.c2': 'Responsible Wool Standard', 'it.c3': 'Responsible Mohair Standard', 'it.c4': 'Responsible Alpaca Standard',
    'it.note': 'Certifications issued by ICEA · GOTS-31605 · ICEA-TX-4402',
    'ft.kicker': 'Contact',
    'ft.cta': 'Let’s talk about your<br><em>next garment.</em>',
    'ft.h1': 'Workshop', 'ft.h2': 'Write to us', 'ft.h3': 'Call us', 'ft.h4': 'The company',
    'ft.corp': 'The corporate website',
    'ft.made': 'Designed, knitted and told in Italy',
    'ft.top': 'Back to top ↑'
  };

  var LABELS = {
    it: { filo: 'filo', disegna: 'disegna', telaio: 'telaio', teli: 'teli', scrivi: 'scrivi', tira: 'tira' },
    en: { filo: 'yarn', disegna: 'draw', telaio: 'loom', teli: 'panels', scrivi: 'write', tira: 'pull' }
  };

  var lang = 'it';
  try { lang = localStorage.getItem('rde-lang') || ((navigator.language || 'it').toLowerCase().indexOf('it') === 0 ? 'it' : 'en'); } catch (e) {}
  var q = /[?&]lang=(it|en)/.exec(location.search);
  if (q) lang = q[1];
  if (lang !== 'it' && lang !== 'en') lang = 'it';

  function apply() {
    document.documentElement.lang = lang;
    if (lang === 'en') {
      document.querySelectorAll('[data-i18n]').forEach(function (el) {
        var v = EN[el.getAttribute('data-i18n')];
        if (v != null) el.innerHTML = v;
      });
      document.title = 'RDE “Studio” — The making of knitwear, 100% Made in Italy';
      var d = document.querySelector('meta[name="description"]');
      if (d) d.setAttribute('content', 'RDE “Studio” tells how a luxury knitted garment is made: from yarn to shipping, every stage of the RDE Knitting Developers manufacture. Montagnana (Padua), since 1985. 100% Made in Italy.');
    }
    document.querySelectorAll('[data-lang]').forEach(function (s) { s.classList.toggle('is-on', s.getAttribute('data-lang') === lang); });
  }
  apply();

  window.RDE_I18N = {
    lang: lang,
    t: function (key, fallback) { return lang === 'en' && EN[key] != null ? EN[key] : fallback; },
    label: function (k) { return (LABELS[lang] && LABELS[lang][k]) || k; },
    toggle: function () {
      var next = lang === 'it' ? 'en' : 'it';
      try { localStorage.setItem('rde-lang', next); } catch (e) {}
      location.href = location.pathname + '?lang=' + next;
    }
  };
})();

/* ============================================================================
   KANSAWALA custom section JavaScript
   ----------------------------------------------------------------------------
   Migrated verbatim from the old build's assets/theme.js into this standalone
   asset so the stock assets/theme.js stays untouched. Loaded in
   layout/theme.liquid AFTER theme.js (defer), so window.theme and
   theme.initWhenVisible are available by the time this runs.

   Blocks: hero-slider, generic fade-up reveal, trust-numbers count-up,
   three-sacred-metals slider, bestsellers tabs, b2b-trust carousel,
   footer-kansawala accordion. The hero-slider self-boots at the bottom of this
   file (the old build registered it via theme.sections.register inside theme.js).
   ============================================================================ */

  /* KANSAWALA hero-slider (9.1.0 migration · Phase 1).
     Native port of the 9.0.0 initHero engine: fade carousel via .active,
     autoplay honoring prefers-reduced-motion, ARIA tablist dots with
     roving tabindex (←→↑↓/Home/End), prev/next arrows, 40px touch swipe.
     Section root carries data-section-type="hero-slider" + data-autoplay
     + data-speed. See MIGRATION-LOG.md / COMPONENTS.md. */
  theme.HeroSlider = (function() {

    function HeroSlider(container) {
      this.container = container;
      this.slides = container.querySelectorAll('.slide');
      this.dots = container.querySelectorAll('[data-hero-dot]');
      this.total = this.slides.length;
      this.cur = 0;
      this.timer = null;
      this.userPaused = false;
      this.listeners = [];
      this.autoplay = container.dataset.autoplay === 'true';
      this.speed = (parseFloat(container.dataset.speed) || 5) * 1000;
      this.reduceMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (this.total === 0) { return; }

      var sectionEl = container.parentElement;
      var sectionIndex = [].indexOf.call(sectionEl.parentElement.children, sectionEl);

      if (sectionIndex === 0) {
        this.init();
      } else {
        theme.initWhenVisible({
          element: this.container,
          callback: this.init.bind(this)
        });
      }
    }

    HeroSlider.prototype = Object.assign({}, HeroSlider.prototype, {
      init: function() {
        if (this._booted) { return; }
        this._booted = true;

        var _this = this;

        this.container.querySelectorAll('[data-hero-next]').forEach(function(b) {
          _this._on(b, 'click', _this.next.bind(_this));
        });
        this.container.querySelectorAll('[data-hero-prev]').forEach(function(b) {
          _this._on(b, 'click', _this.prev.bind(_this));
        });

        this.dots.forEach(function(d) {
          _this._on(d, 'click', function() {
            _this.goSlide(parseInt(d.dataset.heroDot, 10));
          });
          _this._on(d, 'keydown', function(e) {
            var key = e.key;
            if (key === 'ArrowRight' || key === 'ArrowDown') { e.preventDefault(); _this.goSlide(_this.cur + 1, true); }
            else if (key === 'ArrowLeft' || key === 'ArrowUp') { e.preventDefault(); _this.goSlide(_this.cur - 1, true); }
            else if (key === 'Home') { e.preventDefault(); _this.goSlide(0, true); }
            else if (key === 'End') { e.preventDefault(); _this.goSlide(_this.total - 1, true); }
          });
        });

        var sx = 0;
        this._on(this.container, 'touchstart', function(e) {
          sx = e.changedTouches[0].screenX;
        }, { passive: true });
        this._on(this.container, 'touchend', function(e) {
          var dx = e.changedTouches[0].screenX - sx;
          if (Math.abs(dx) > 40) { dx < 0 ? _this.next() : _this.prev(); }
        });

        // Pause autoplay on hover & keyboard focus (usability + a11y) so the
        // slide can't advance while a user is reading or operating a control.
        this._on(this.container, 'mouseenter', function() { _this.pause(); });
        this._on(this.container, 'mouseleave', function() { if (!_this.userPaused) { _this.resetTimer(); } });
        this._on(this.container, 'focusin', function() { _this.pause(); });
        this._on(this.container, 'focusout', function(e) {
          if (!_this.userPaused && !_this.container.contains(e.relatedTarget)) { _this.resetTimer(); }
        });

        this.resetTimer();
      },

      _on: function(target, event, handler, options) {
        target.addEventListener(event, handler, options);
        this.listeners.push({ t: target, e: event, h: handler, o: options });
      },

      goSlide: function(n, focusDot) {
        var prev = this.slides[this.cur];
        if (prev) {
          prev.classList.remove('active');
          prev.setAttribute('aria-hidden', 'true');
          prev.setAttribute('inert', '');
        }
        if (this.dots[this.cur]) {
          this.dots[this.cur].classList.remove('active');
          this.dots[this.cur].removeAttribute('aria-current');
          this.dots[this.cur].setAttribute('tabindex', '-1');
        }
        this.cur = ((n % this.total) + this.total) % this.total;
        var curSlide = this.slides[this.cur];
        if (curSlide) {
          curSlide.classList.add('active');
          curSlide.removeAttribute('aria-hidden');
          curSlide.removeAttribute('inert');
        }
        if (this.dots[this.cur]) {
          this.dots[this.cur].classList.add('active');
          this.dots[this.cur].setAttribute('aria-current', 'true');
          this.dots[this.cur].setAttribute('tabindex', '0');
          if (focusDot) { this.dots[this.cur].focus(); }
        }
        this.resetTimer();
      },

      next: function() { this.goSlide(this.cur + 1); },
      prev: function() { this.goSlide(this.cur - 1); },

      resetTimer: function() {
        if (this.timer) { clearInterval(this.timer); this.timer = null; }
        if (this.autoplay && this.total > 1 && !this.reduceMotion && !this.userPaused) {
          this.timer = setInterval(this.next.bind(this), this.speed);
        }
      },

      pause: function() {
        if (this.timer) { clearInterval(this.timer); this.timer = null; }
      },

      onUnload: function() {
        this.pause();
        this.listeners.forEach(function(l) {
          l.t.removeEventListener(l.e, l.h, l.o);
        });
        this.listeners.length = 0;
        this._booted = false;
      },

      onDeselect: function() {
        this.resetTimer();
      },

      onBlockSelect: function(evt) {
        var slide = this.container.querySelector('.slide[data-block-id="' + evt.detail.blockId + '"]');
        if (slide) {
          this.pause();
          this.goSlide(parseInt(slide.dataset.slide, 10));
        }
      },

      onBlockDeselect: function() {
        this.resetTimer();
      }
    });

    return HeroSlider;
  })();

  /* KANSAWALA generic fade-up reveal (9.1.0 migration · Phase 4).
     Self-booting; ports 9.0.0 theme.custom.js initFadeUp. Section root:
     <section data-kw-fade-up [data-kw-fade-up-selector=".fu"] [data-kw-fade-up-threshold="0.1"]>.
     Adds js-kw-fadeup to <html> so the reveal CSS only activates with JS alive,
     then IntersectionObserver adds .in to .fu elements (one-shot). Reduced motion
     is handled by the kw-tokens global floor (collapses the reveal transition). */
  (function () {
    'use strict';
    var BOOTED = false;
    function ensureHtmlFlag() {
      if (BOOTED) return;
      BOOTED = true;
      document.documentElement.classList.add('js-kw-fadeup');
    }
    function initFadeUp(root) {
      if (root.dataset.kwFadeInit === '1') return;
      root.dataset.kwFadeInit = '1';
      ensureHtmlFlag();
      var selector = root.dataset.kwFadeUpSelector || '.fu';
      var threshold = parseFloat(root.dataset.kwFadeUpThreshold || '0.1');
      var els = root.querySelectorAll(selector);
      if (!els.length) return;
      if (!('IntersectionObserver' in window)) {
        els.forEach(function (el) { el.classList.add('in'); });
        return;
      }
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
        });
      }, { threshold: threshold });
      els.forEach(function (el) { obs.observe(el); });
    }
    function bootFadeUp() {
      document.querySelectorAll('[data-kw-fade-up]').forEach(initFadeUp);
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bootFadeUp);
    } else {
      bootFadeUp();
    }
    document.addEventListener('shopify:section:load', function (e) {
      if (!e.target || !e.target.querySelectorAll) return;
      e.target.querySelectorAll('[data-kw-fade-up]').forEach(initFadeUp);
      if (e.target.matches && e.target.matches('[data-kw-fade-up]')) {
        initFadeUp(e.target);
      }
    });
  })();

  /* KANSAWALA trust-numbers count-up + fade-up reveal (9.1.0 migration · Phase 5).
     Self-booting; ports 9.0.0 theme.custom.js initTrustNumbers. Section root
     <... data-kw-trust-numbers>: counts .trust-num[data-target] up on scroll
     (IO threshold 0.5), reveals .fu items (threshold 0.1), honors reduced-motion,
     and falls back to final values when IntersectionObserver is unavailable. */
  (function () {
    'use strict';
    function initTrustNumbers(root) {
      if (root.dataset.kwTrustInit === '1') return;
      root.dataset.kwTrustInit = '1';
      // Flag the document so the section's .fu hide rules only apply with JS alive
      // (no-JS / failed-JS keeps the band visible — no hidden-content trap).
      document.documentElement.classList.add('js-kw-fadeup');
      var reduceMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      function fmt(n) { return n.toLocaleString('en-US'); }
      function animCount(el, target, suffix) {
        if (reduceMotion) { el.textContent = fmt(target) + suffix; return; }
        var c = 0, step = target / 55;
        var t = setInterval(function () {
          c += step;
          if (c >= target) { el.textContent = fmt(target) + suffix; clearInterval(t); }
          else el.textContent = fmt(Math.floor(c)) + suffix;
        }, 16);
      }
      if (!('IntersectionObserver' in window)) {
        root.querySelectorAll('[data-target]').forEach(function (el) {
          var n = parseInt(el.dataset.target, 10);
          el.textContent = (isNaN(n) ? (el.dataset.target || '') : fmt(n)) + (el.dataset.suffix || '');
        });
        root.querySelectorAll('.fu').forEach(function (el) { el.classList.add('in'); });
        return;
      }
      var fuObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in'); fuObs.unobserve(e.target); }
        });
      }, { threshold: 0.1 });
      root.querySelectorAll('.fu').forEach(function (el) { fuObs.observe(el); });
      var cObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.querySelectorAll('[data-target]').forEach(function (el) {
              var raw = el.dataset.target || '';
              var suffix = el.dataset.suffix || '';
              var target = parseInt(raw, 10);
              if (isNaN(target)) { el.textContent = raw + suffix; return; }
              animCount(el, target, suffix);
            });
            cObs.unobserve(e.target);
          }
        });
      }, { threshold: 0.2 });
      cObs.observe(root);
    }
    function bootTrustNumbers() {
      document.querySelectorAll('[data-kw-trust-numbers]').forEach(initTrustNumbers);
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bootTrustNumbers);
    } else {
      bootTrustNumbers();
    }
    document.addEventListener('shopify:section:load', function (e) {
      if (!e.target || !e.target.querySelectorAll) return;
      e.target.querySelectorAll('[data-kw-trust-numbers]').forEach(initTrustNumbers);
      if (e.target.matches && e.target.matches('[data-kw-trust-numbers]')) {
        initTrustNumbers(e.target);
      }
    });
  })();

  /* KANSAWALA three-sacred-metals — mobile scroll-snap slider + dots + autoplay
     (9.1.0 migration · Phase 8). Self-booting; ports 9.0.0 initSacredMetals.
     Desktop (>=990px) stays a static 3-col grid; slider runs <=989px. Honors
     prefers-reduced-motion, re-inits on shopify:section:load, cleans up on
     unload, jumps to the selected card on shopify:block:select. */
  (function () {
    'use strict';

    var registry = []; // { root, teardown } — for unload cleanup

    function initSacredMetals(root) {
      if (root.dataset.tsmBooted === '1') return;
      root.dataset.tsmBooted = '1';

      var grid = root.querySelector('.tsm-grid');
      if (!grid) return;
      var slides = grid.querySelectorAll('.tsm-card');
      if (!slides.length) return;
      var dots = root.querySelectorAll('.tsm-dot');

      var reduceMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var mqMobile = window.matchMedia ? window.matchMedia('(max-width:989px)') : null;

      var listeners = [];
      function on(target, evt, handler, opts) {
        target.addEventListener(evt, handler, opts);
        listeners.push({ t: target, e: evt, h: handler, o: opts });
      }

      function activeIndex() {
        var center = grid.scrollLeft + grid.clientWidth / 2;
        var best = 0, bestDist = Infinity;
        for (var i = 0; i < slides.length; i++) {
          var sc = slides[i].offsetLeft + slides[i].offsetWidth / 2;
          var d = Math.abs(sc - center);
          if (d < bestDist) { bestDist = d; best = i; }
        }
        return best;
      }
      function setActive(i) {
        for (var k = 0; k < dots.length; k++) {
          dots[k].classList.toggle('is-active', k === i);
        }
      }
      function scrollToIndex(idx) {
        var s = slides[idx];
        if (!s) return;
        grid.scrollTo({ left: s.offsetLeft - (grid.clientWidth - s.offsetWidth) / 2, behavior: 'smooth' });
      }

      var raf = null;
      on(grid, 'scroll', function () {
        if (raf) return;
        raf = requestAnimationFrame(function () { raf = null; setActive(activeIndex()); });
      }, { passive: true });

      for (var i = 0; i < dots.length; i++) {
        (function (idx) {
          on(dots[idx], 'click', function () { scrollToIndex(idx); pauseTemp(); });
        })(i);
      }

      on(grid, 'touchstart', function () { pauseTemp(); }, { passive: true });
      on(grid, 'pointerdown', function () { pauseTemp(); }, { passive: true });
      on(grid, 'wheel', function () { pauseTemp(); }, { passive: true });

      var autoplay = root.dataset.autoplay === 'true';
      var intervalMs = Math.max(1, parseFloat(root.dataset.interval || '5')) * 1000;
      var sliderMode = (root.dataset.mobileLayout || 'slider') === 'slider';
      var timer = null, paused = false, visible = true, pauseT = null;

      function canRun() {
        return autoplay && sliderMode && slides.length > 1 && !reduceMotion &&
               visible && !paused && (!mqMobile || mqMobile.matches);
      }
      function tick() {
        scrollToIndex((activeIndex() + 1) % slides.length);
      }
      function start() {
        if (timer || !canRun()) return;
        timer = setInterval(tick, intervalMs);
      }
      function stop() { if (timer) { clearInterval(timer); timer = null; } }
      function pauseTemp(ms) {
        paused = true; stop();
        clearTimeout(pauseT);
        pauseT = setTimeout(function () { paused = false; start(); }, ms || 6000);
      }

      var io = null;
      if ('IntersectionObserver' in window) {
        io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            visible = e.isIntersecting;
            if (visible) start(); else stop();
          });
        }, { threshold: 0.25 });
        io.observe(root);
      }
      on(document, 'visibilitychange', function () {
        if (document.hidden) stop(); else start();
      });
      if (mqMobile) {
        var onMq = function () { if (mqMobile.matches) start(); else stop(); };
        if (mqMobile.addEventListener) mqMobile.addEventListener('change', onMq);
        else if (mqMobile.addListener) mqMobile.addListener(onMq);
        listeners.push({ mq: mqMobile, h: onMq });
      }

      start();

      function teardown() {
        stop();
        clearTimeout(pauseT);
        if (io) { io.disconnect(); io = null; }
        listeners.forEach(function (l) {
          if (l.mq) {
            if (l.mq.removeEventListener) l.mq.removeEventListener('change', l.h);
            else if (l.mq.removeListener) l.mq.removeListener(l.h);
          } else {
            l.t.removeEventListener(l.e, l.h, l.o);
          }
        });
        listeners.length = 0;
        root.dataset.tsmBooted = '';
      }
      registry.push({ root: root, teardown: teardown, scrollToIndex: scrollToIndex });
    }

    function entryFor(el) {
      for (var i = 0; i < registry.length; i++) { if (registry[i].root === el) return registry[i]; }
      return null;
    }
    function removeEntry(el) {
      for (var i = registry.length - 1; i >= 0; i--) {
        if (registry[i].root === el) { registry[i].teardown(); registry.splice(i, 1); }
      }
    }

    function boot() {
      document.querySelectorAll('[data-section-type="three-sacred-metals"]').forEach(initSacredMetals);
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', boot);
    } else {
      boot();
    }

    document.addEventListener('shopify:section:load', function (e) {
      if (!e.target || !e.target.querySelectorAll) return;
      e.target.querySelectorAll('[data-section-type="three-sacred-metals"]').forEach(initSacredMetals);
      if (e.target.matches && e.target.matches('[data-section-type="three-sacred-metals"]')) {
        initSacredMetals(e.target);
      }
    });

    document.addEventListener('shopify:section:unload', function (e) {
      if (!e.target) return;
      var roots = e.target.querySelectorAll ? e.target.querySelectorAll('[data-section-type="three-sacred-metals"]') : [];
      roots.forEach(removeEntry);
      if (e.target.matches && e.target.matches('[data-section-type="three-sacred-metals"]')) {
        removeEntry(e.target);
      }
    });

    document.addEventListener('shopify:block:select', function (e) {
      if (!e.target || !e.detail) return;
      var root = e.target.closest ? e.target.closest('[data-section-type="three-sacred-metals"]') : null;
      if (!root) return;
      var entry = entryFor(root);
      var card = root.querySelector('.tsm-card[data-block-id="' + e.detail.blockId + '"]');
      if (entry && card) { entry.scrollToIndex(parseInt(card.dataset.tsmSlide, 10) || 0); }
    });
  })();

  /* KANSAWALA bestsellers — tabbed featured-products grid (9.1.0 migration ·
     Phase 5). Self-booting; wires the ARIA tablist (roving tabindex + arrows),
     re-inits on shopify:section:load, activates the editor-selected tab on
     shopify:block:select. Init-once via data-bsl-booted. */
  (function () {
    function activate(section, idx, focusTab) {
      var tabs   = section.querySelectorAll('[data-bsl-tab]');
      var panels = section.querySelectorAll('[data-bsl-panel]');
      if (!tabs.length) return;
      if (idx < 0) idx = 0;
      if (idx > tabs.length - 1) idx = tabs.length - 1;

      for (var i = 0; i < tabs.length; i++) {
        var on = i === idx;
        tabs[i].classList.toggle('is-active', on);
        tabs[i].setAttribute('aria-selected', on ? 'true' : 'false');
        tabs[i].setAttribute('tabindex', on ? '0' : '-1');
      }
      for (var p = 0; p < panels.length; p++) {
        var pon = p === idx;
        panels[p].classList.toggle('is-active', pon);
        if (pon) { panels[p].removeAttribute('hidden'); }
        else     { panels[p].setAttribute('hidden', ''); }
      }
      if (focusTab && tabs[idx]) tabs[idx].focus();
    }

    function indexOfTab(section, tab) {
      var tabs = section.querySelectorAll('[data-bsl-tab]');
      for (var i = 0; i < tabs.length; i++) { if (tabs[i] === tab) return i; }
      return 0;
    }

    function bind(section) {
      if (!section || section.dataset.bslBooted === 'true') return;
      section.dataset.bslBooted = 'true';

      var tabs = section.querySelectorAll('[data-bsl-tab]');
      if (!tabs.length) return;

      Array.prototype.forEach.call(tabs, function (tab) {
        tab.addEventListener('click', function () {
          activate(section, indexOfTab(section, tab), false);
        });
        tab.addEventListener('keydown', function (e) {
          var count = tabs.length;
          var cur = indexOfTab(section, tab);
          var next = null;
          switch (e.key) {
            case 'ArrowRight':
            case 'ArrowDown': next = (cur + 1) % count; break;
            case 'ArrowLeft':
            case 'ArrowUp':   next = (cur - 1 + count) % count; break;
            case 'Home':      next = 0; break;
            case 'End':       next = count - 1; break;
            default: return;
          }
          e.preventDefault();
          activate(section, next, true);
        });
      });
    }

    function boot(root) {
      var scope = root && root.querySelectorAll ? root : document;
      var sections = scope.querySelectorAll('[data-section-type="bestsellers"]');
      Array.prototype.forEach.call(sections, bind);
      if (root && root.getAttribute && root.getAttribute('data-section-type') === 'bestsellers') {
        bind(root);
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { boot(document); });
    } else {
      boot(document);
    }

    document.addEventListener('shopify:section:load', function (e) {
      boot(e.target);
    });

    document.addEventListener('shopify:block:select', function (e) {
      var section = e.target.closest
        ? e.target.closest('[data-section-type="bestsellers"]')
        : null;
      if (!section) return;
      var blockId = e.target.getAttribute('data-block-id');
      var tab = section.querySelector('[data-bsl-tab][data-block-id="' + blockId + '"]');
      if (tab) activate(section, indexOfTab(section, tab), false);
    });
  })();

  /* KANSAWALA b2b-trust — testimonial-card mobile carousel + autoplay (9.1.0
     migration · Phase 10). Self-booting; drives only the testimonial slider
     (the partner-logo strip is a pure CSS marquee). Autoplay runs <=989px (tablet + mobile),
     paused under reduced-motion / hover / interaction / tab-hidden / offscreen.
     Re-inits on shopify:section:load, cleans up on unload, jumps to the selected
     testimonial on shopify:block:select. */
  (function () {
    'use strict';

    function initB2bTrust(root) {
      if (root.dataset.b2bBooted === '1') return;
      root.dataset.b2bBooted = '1';

      var reduceMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      var grid = root.querySelector('.b2b-grid');
      if (!grid) return;
      var slides = grid.querySelectorAll('.b2b-card');
      if (!slides.length) return;
      var dots = root.querySelectorAll('.b2b-dot');
      var listeners = [];
      function on(t, e, h, o) { t.addEventListener(e, h, o); listeners.push({ t: t, e: e, h: h, o: o }); }

      function activeIndex() {
        var center = grid.scrollLeft + grid.clientWidth / 2;
        var best = 0, bestDist = Infinity;
        for (var i = 0; i < slides.length; i++) {
          var s = slides[i];
          var sc = s.offsetLeft + s.offsetWidth / 2;
          var d = Math.abs(sc - center);
          if (d < bestDist) { bestDist = d; best = i; }
        }
        return best;
      }
      function setActive(i) {
        for (var k = 0; k < dots.length; k++) { dots[k].classList.toggle('is-active', k === i); }
      }
      function scrollToIndex(idx) {
        var s = slides[idx];
        if (!s) return;
        grid.scrollTo({ left: s.offsetLeft - (grid.clientWidth - s.offsetWidth) / 2, behavior: 'smooth' });
      }

      if (dots.length) {
        var raf = null;
        on(grid, 'scroll', function () {
          if (raf) return;
          raf = requestAnimationFrame(function () { raf = null; setActive(activeIndex()); });
        }, { passive: true });
        for (var i = 0; i < dots.length; i++) {
          (function (idx) { on(dots[idx], 'click', function () { scrollToIndex(idx); }); })(i);
        }
      }

      function onBlockSelect(e) {
        var id = e && e.detail && e.detail.blockId;
        if (!id) return;
        for (var k = 0; k < slides.length; k++) {
          if (slides[k].getAttribute('data-block-id') === id) { scrollToIndex(k); break; }
        }
      }
      document.addEventListener('shopify:block:select', onBlockSelect);

      var autoplay = root.dataset.autoplay === 'true';
      var intervalMs = Math.max(1, parseFloat(root.dataset.interval || '5')) * 1000;

      var timer = null, paused = false, visible = true, mq = null, io = null;
      function start() {
        if (timer || paused || !visible || !mq || !mq.matches) return;
        timer = setInterval(function () { scrollToIndex((activeIndex() + 1) % slides.length); }, intervalMs);
      }
      function stop() { if (timer) { clearInterval(timer); timer = null; } }
      function pauseTemp(ms) {
        paused = true; stop();
        clearTimeout(pauseTemp._t);
        pauseTemp._t = setTimeout(function () { paused = false; start(); }, ms || 6000);
      }
      function onVisibility() { if (document.hidden) stop(); else start(); }

      if (autoplay && slides.length > 1 && !reduceMotion &&
          'matchMedia' in window && 'IntersectionObserver' in window) {
        mq = window.matchMedia('(max-width: 989px)');
        io = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) { visible = en.isIntersecting; if (visible) start(); else stop(); });
        }, { threshold: 0.25 });
        io.observe(root);
        document.addEventListener('visibilitychange', onVisibility);
        on(grid, 'touchstart', function () { pauseTemp(); }, { passive: true });
        on(grid, 'pointerdown', function () { pauseTemp(); }, { passive: true });
        on(grid, 'wheel', function () { pauseTemp(); }, { passive: true });
        on(root, 'mouseenter', function () { paused = true; stop(); });
        on(root, 'mouseleave', function () { paused = false; start(); });
        for (var d = 0; d < dots.length; d++) { on(dots[d], 'click', function () { pauseTemp(); }); }
        if (mq.addEventListener) { mq.addEventListener('change', function () { if (mq.matches) start(); else stop(); }); }
        start();
      }

      function cleanup() {
        stop();
        clearTimeout(pauseTemp._t);
        if (io) { io.disconnect(); io = null; }
        document.removeEventListener('visibilitychange', onVisibility);
        document.removeEventListener('shopify:block:select', onBlockSelect);
        listeners.forEach(function (l) { l.t.removeEventListener(l.e, l.h, l.o); });
        listeners.length = 0;
        document.removeEventListener('shopify:section:unload', onUnload);
        delete root.dataset.b2bBooted;
      }
      function onUnload(e) {
        if (e && e.target && (e.target === root || e.target.contains(root))) cleanup();
      }
      document.addEventListener('shopify:section:unload', onUnload);
    }

    function boot(scope) {
      (scope || document).querySelectorAll('[data-section-type="b2b-trust"]').forEach(initB2bTrust);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { boot(); });
    } else {
      boot();
    }
    document.addEventListener('shopify:section:load', function (e) {
      if (!e.target || !e.target.querySelectorAll) return;
      boot(e.target);
      if (e.target.matches && e.target.matches('[data-section-type="b2b-trust"]')) initB2bTrust(e.target);
    });
  })();

  /* KANSAWALA footer-kansawala — accordion mobile-collapse / desktop-expand
     (ported 9.0.0 → 9.1.0). Section root: <footer data-kw-footer>. Accordion
     items: details.fc. At <=1023px each <details> collapses by default (user
     toggles remembered via data-userToggled); at >=1024px every <details> is
     force-open. Native <details> means it degrades fully with no JS. */
  (function () {
    'use strict';

    function initFooter(root) {
      if (root.dataset.footerBooted === '1') return;
      root.dataset.footerBooted = '1';

      if (!('matchMedia' in window)) return;
      var mq = window.matchMedia('(max-width: 1023px)');
      var items = root.querySelectorAll('details.fc');
      if (!items.length) return;

      function sync() {
        for (var i = 0; i < items.length; i++) {
          var d = items[i];
          if (mq.matches) {
            if (!d.dataset.userToggled) d.removeAttribute('open');
          } else {
            d.setAttribute('open', '');
          }
        }
      }
      for (var j = 0; j < items.length; j++) {
        (function (d) {
          d.addEventListener('toggle', function () {
            if (mq.matches) d.dataset.userToggled = '1';
          });
        })(items[j]);
      }
      sync();
      if (mq.addEventListener) mq.addEventListener('change', sync);
      else if (mq.addListener) mq.addListener(sync);
    }

    function bootFooter(scope) {
      (scope || document).querySelectorAll('[data-kw-footer]').forEach(initFooter);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { bootFooter(); });
    } else {
      bootFooter();
    }
    document.addEventListener('shopify:section:load', function (e) {
      if (!e.target || !e.target.querySelectorAll) return;
      bootFooter(e.target);
      if (e.target.matches && e.target.matches('[data-kw-footer]')) initFooter(e.target);
    });
  })();

/* KANSAWALA hero-slider self-boot (standalone-asset migration).
   Replaces the old theme.sections.register('hero-slider', theme.HeroSlider) hookup
   so the carousel boots regardless of the stock Sections-framework timing. */
(function () {
  'use strict';
  function initHero(el) {
    if (!el || el.dataset.kwHeroInit === '1') return;
    if (!window.theme || typeof theme.HeroSlider !== 'function') return;
    el.dataset.kwHeroInit = '1';
    new theme.HeroSlider(el);
  }
  function bootHero(scope) {
    (scope || document).querySelectorAll('[data-section-type="hero-slider"]').forEach(initHero);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { bootHero(); });
  } else {
    bootHero();
  }
  document.addEventListener('shopify:section:load', function (e) {
    if (!e.target) return;
    bootHero(e.target);
    if (e.target.matches && e.target.matches('[data-section-type="hero-slider"]')) initHero(e.target);
  });
})();

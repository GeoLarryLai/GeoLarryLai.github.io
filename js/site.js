/* Phone menu, install tabs, and copy buttons. No dependencies. */
(function () {
  // Phone menu
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Install tabs: without JS every panel stays visible.
  document.querySelectorAll('[data-tabs]').forEach(function (box) {
    var tabs = box.querySelectorAll('[role="tab"]');
    var panels = box.querySelectorAll('[role="tabpanel"]');
    function show(i) {
      tabs.forEach(function (t, k) { t.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
      panels.forEach(function (p, k) { p.hidden = k !== i; });
    }
    tabs.forEach(function (t, i) { t.addEventListener('click', function () { show(i); }); });
    if (tabs.length) show(0);
  });

  // Copy buttons: copy the visible [data-copy-src] inside the nearest [data-copy-root].
  document.querySelectorAll('button.copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var root = btn.closest('[data-copy-root]');
      if (!root) return;
      var src = Array.prototype.find.call(root.querySelectorAll('[data-copy-src]'), function (el) {
        return !el.closest('[hidden]');
      });
      if (!src || !navigator.clipboard) return;
      navigator.clipboard.writeText(src.innerText.trim()).then(function () {
        var old = btn.textContent;
        btn.textContent = 'Copied';
        setTimeout(function () { btn.textContent = old; }, 1400);
      });
    });
  });

  // Expertise slider: arrow buttons scroll one card; buttons dim at either end.
  document.querySelectorAll('[data-slider]').forEach(function (row) {
    var box = row.closest('section') || document;
    var prev = box.querySelector('.slider-btn[data-dir="-1"]');
    var next = box.querySelector('.slider-btn[data-dir="1"]');
    function step() {
      var card = row.querySelector('.card');
      var gap = parseFloat(getComputedStyle(row).columnGap) || 0;
      return card ? card.getBoundingClientRect().width + gap : row.clientWidth * 0.8;
    }
    function update() {
      if (prev) prev.disabled = row.scrollLeft < 4;
      if (next) next.disabled = row.scrollLeft > row.scrollWidth - row.clientWidth - 4;
    }
    [prev, next].forEach(function (b) {
      if (!b) return;
      b.addEventListener('click', function () {
        row.scrollBy({ left: Number(b.dataset.dir) * step(), behavior: 'smooth' });
      });
    });
    row.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  // Respect reduced motion: do not autoplay videos.
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('video[autoplay]').forEach(function (v) { v.removeAttribute('autoplay'); v.pause(); });
  }

  // Scroll fade-in: reveal [data-reveal] items as they enter the view, in order within each batch.
  var items = document.querySelectorAll('[data-reveal]');
  if (items.length) {
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      document.documentElement.classList.add('reveal-on');
      var io = new IntersectionObserver(function (entries) {
        var n = 0;
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.style.setProperty('--delay', (n++ * 0.09) + 's');
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        });
      }, { threshold: 0.05, rootMargin: '0px 0px -6% 0px' });
      items.forEach(function (el) { io.observe(el); });
    }
  }
})();

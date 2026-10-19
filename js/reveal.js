/* Slide cards up as they scroll into view. Without JavaScript, or with reduced motion, every card just shows. */
(function () {
  var cards = document.querySelectorAll('.stagger .card');
  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    cards.forEach(function (c) { c.classList.add('is-in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
  cards.forEach(function (c) { io.observe(c); });
})();

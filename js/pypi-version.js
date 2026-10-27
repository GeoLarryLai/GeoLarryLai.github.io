/* Replace the text of [data-pypi="name"] elements with the latest PyPI version.
   The hardcoded text stays as a fallback; failures are silent. */
(function () {
  var els = document.querySelectorAll('[data-pypi]');
  if (!els.length || !window.fetch) return;
  var names = {};
  els.forEach(function (el) { names[el.getAttribute('data-pypi')] = true; });
  Object.keys(names).forEach(function (name) {
    var key = 'pypi-version:' + name;
    var apply = function (v) {
      document.querySelectorAll('[data-pypi="' + name + '"]').forEach(function (el) { el.textContent = v; });
    };
    try { var c = sessionStorage.getItem(key); if (c) { apply(c); return; } } catch (e) {}
    fetch('https://pypi.org/pypi/' + encodeURIComponent(name) + '/json')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        var v = d && d.info && d.info.version;
        if (!v) return;
        apply(v);
        try { sessionStorage.setItem(key, v); } catch (e) {}
      })
      .catch(function () {});
  });
})();

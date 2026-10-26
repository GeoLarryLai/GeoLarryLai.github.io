#!/usr/bin/env python3
"""Rebuild the card list in projects.html from data/projects.json.

Cards are grouped by theme; projects with "hidden": true are skipped.
Only the text between the BEGIN/END markers in projects.html is replaced.
"""
import html, json, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
BEGIN, END = "<!-- BEGIN projects (generated from data/projects.json) -->", "<!-- END projects -->"
e = lambda s: html.escape(s, quote=True)


def badges(p):
    out = []
    if p.get("pypi"):
        n = p["pypi"]
        out.append((f"https://pypi.org/project/{n}/", f"https://img.shields.io/pypi/v/{n}.svg", "PyPI version"))
        if p.get("pepy", True):
            out.append((f"https://pepy.tech/project/{n}", f"https://static.pepy.tech/badge/{n}", "Downloads"))
    if p.get("crate"):
        n = p["crate"]
        out.append((f"https://crates.io/crates/{n}", f"https://img.shields.io/crates/v/{n}.svg", "crates.io version"))
    if p.get("conda"):
        n = p["conda"]
        out.append((f"https://anaconda.org/conda-forge/{n}", f"https://img.shields.io/conda/vn/conda-forge/{n}.svg", "conda-forge version"))
        out.append((f"https://anaconda.org/conda-forge/{n}", f"https://img.shields.io/conda/dn/conda-forge/{n}.svg", "conda-forge downloads"))
    if p.get("zenodo"):
        d = p["zenodo"]
        out.append((f"https://doi.org/{d}", f"https://zenodo.org/badge/DOI/{d}.svg", f"DOI {d}"))
    if not out:
        return ""
    li = "".join(f'<li><a href="{e(h)}"><img src="{e(s)}" alt="{e(a)}" height="20" loading="lazy"></a></li>' for h, s, a in out)
    return f'\n            <ul class="badges">{li}</ul>'


def card(p, i):
    imgs = p.get("images") or ([p["image"]] if p.get("image") else [])
    tag = lambda img: f'<img src="{e(img["src"])}" width="{img["width"]}" height="{img["height"]}" loading="lazy" alt="{e(img["alt"])}">'
    media = ((f'\n            {tag(imgs[0])}' if len(imgs) == 1 else
              '\n            <div class="card-figs">' + "".join(tag(i) for i in imgs) + '</div>')
             if imgs else f'\n            <span class="card-tile contour-bg" style="--cpos: {p.get("tile", "50% 50%")}" aria-hidden="true"></span>')
    cite = ""
    if p.get("citation"):
        cite = (f'\n            <div class="cite-box cite-line" data-copy-root><p data-copy-src>{e(p["citation"])}</p>'
                f'<button class="copy" type="button">Copy</button></div>')
    return (f'          <article class="card" style="--i:{i}">\n'
            f'            <p class="label">{e(p["label"]).replace("·", "&middot;")}</p>\n'
            f'            <h3><a href="{e(p["page"])}">{e(p["name"])} <span aria-hidden="true">&rarr;</span></a></h3>\n'
            f'            <p>{e(p["description"])}</p>{badges(p)}{media}{cite}\n'
            f'          </article>')


def build():
    data = json.loads((ROOT / "data/projects.json").read_text())
    parts, i = [], 0
    for t in data["themes"]:
        ps = [p for p in data["projects"] if p["theme"] == t["id"] and not p.get("hidden")]
        if not ps:
            continue
        cols = [[], []]
        for k, p in enumerate(ps):
            i += 1
            cols[k % 2].append(card(p, i))
        parts.append(f'      <section class="theme" id="{e(t["id"])}">\n'
                     f'        <p class="label theme-head">{e(t["label"])}</p>\n        <h2>{e(t["title"])}</h2>\n'
                     f'        <div class="stagger">\n' +
                     "".join(f'        <div class="stagger-col">\n{chr(10).join(c)}\n        </div>\n' for c in cols) +
                     '        </div>\n      </section>')
    page = ROOT / "projects.html"
    s = page.read_text()
    a, b = s.index(BEGIN) + len(BEGIN), s.index(END)
    page.write_text(s[:a] + "\n" + "\n\n".join(parts) + "\n      " + s[b:])


if __name__ == "__main__":
    build()

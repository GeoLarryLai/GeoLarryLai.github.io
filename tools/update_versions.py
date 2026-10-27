"""Refresh fallback PyPI versions in project pages ([data-pypi] spans) and data/projects.json."""
import json, re, urllib.request, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[1]
cache = {}
def latest(n):
    if n not in cache:
        try:
            with urllib.request.urlopen(f"https://pypi.org/pypi/{n}/json", timeout=20) as r:
                cache[n] = json.load(r)["info"]["version"]
        except Exception:
            cache[n] = None
    return cache[n]
pat = re.compile(r'(<span data-pypi="([^"]+)">)([^<]*)(</span>)')
for f in ROOT.glob("projects/*/index.html"):
    s = f.read_text(); new = pat.sub(lambda m: m.group(1) + (latest(m.group(2)) or m.group(3)) + m.group(4), s)
    if new != s: f.write_text(new); print("updated", f)
p = ROOT / "data/projects.json"; d = json.loads(p.read_text()); ch = False
for proj in d.get("projects", []):
    if proj.get("pypi") and "version" in proj:
        v = latest(proj["pypi"])
        if v and v != proj["version"]: proj["version"] = v; ch = True
if ch: p.write_text(json.dumps(d, indent=2, ensure_ascii=False) + "\n"); print("updated", p)

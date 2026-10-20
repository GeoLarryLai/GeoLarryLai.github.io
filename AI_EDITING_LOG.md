---
id: AI_EDITING_LOG
path: AI_EDITING_LOG.md
audience: LLM
purpose: domain ledger so new chats skip rediscovery
updated: 2026-10-19
quality_gate: visual check at 1440 and phone width, links and images resolve
---

# AI_EDITING_LOG

**MANDATORY:** Before non-trivial edits in this project, Read this file (min: DOMAIN_GOALS, FAILURES, CONTRACTS, ANTI, latest EDIT_LOG). After method changes, append EDIT_LOG; patch FAILURES/CONTRACTS/OPEN if truth changed. Follow END_RITUAL below.

**Talk / Work prefs** live in Cursor **User Rules** only. This file is the **domain** ledger for this project.

---

## DOMAIN_GOALS

Personal academic site for Syu-Heng (Larry) Lai (GitHub `GeoLarryLai`). Static HTML/CSS/JS on GitHub Pages, no build step.
Look: professional, clean, unique, aesthetic, one consistent topographic identity (faint Oso-lidar contour lines, small uppercase labels above titles).
References the user cited: rubenkuipers.design (cards, fonts), watracz.com (case-study pages), academic-project-astro-template (project pages), gitfolio (sticky profile), academicpages.

---

## GLOSSARY

| Term | Meaning |
|------|---------|
| Oso contours | SVG lines from `Ososlid2014_m_6ftgrid.tif`, in `assets/contours/` |
| contour-bg | CSS class that shows the contour SVG through a mask |
| case page | Research topic page: sticky facts column + body (`.case`) |
| sample pages | `projects/pyTopoComplexity/index.html` (project) and `research/east-taiwan-basins.html` (research); copy their markup |

---

## COLD_START

1. Read DOMAIN_GOALS, FAILURES, CONTRACTS, ANTI, latest EDIT_LOG.
2. Plan: one issue, confirm, next.
3. Do not rediscover closed FAILURES without new evidence.
4. Local preview: `python3 -m http.server 8765 --bind 127.0.0.1` in the project root; add `?v=N` to dodge cache.

---

## PROGRESS

| Era | What | Result |
|-----|------|--------|
| 2026-10 | Site-wide polish: design system, 7 project pages, 6 research pages, About, Projects, front page, 404, favicon/og | Pushed and published at the user's request |

---

## FAILURES

| ID | Symptom | Cause | Fix | St |
|----|---------|-------|-----|-----|
| F1 | Contour strip empty on the right | crop rows not evenly covered | `best_start()` in `drafts/make_contours.py` | closed |
| F2 | Headless Chrome width floor ~500px | Chrome limit | phone shots via 390px iframe wrapper in `drafts/phone_*.html` | closed |
| F3 | Resume iframe blank grey in screenshots | headless cannot render Google Docs | expected, not a bug | closed |
| F4 | Research facts column squeezed on phone | 2-column grid on dt/dd | `.case-facts dl{display:block}` at max-width 900px | closed |
| F5 | Browser tool shows old page | cache | `?v=N` | closed |

---

## DECISIONS

| Topic | Chose | Rejected |
|-------|-------|----------|
| Identity | Topographic contours | other motifs |
| Project pages | One shared order, long README text in "How it works" fold-outs | long single page |
| Research pages | Case-study layout with sticky facts | old prose pages |
| Old pages | Delete `blogs.html` and `contact.html` | keep |
| Images | `.webp` siblings next to PNG/JPG, originals kept | replace originals |
| pyLogCrafter | Repo is private: never link github.com | |

---

## CONTRACTS

Break = bug.
- Repo is public and GitHub Pages serves it (user asked on 2026-10-19). Custom domain in `CNAME` is `larrysyuhenglai.com`; DNS is set at the registrar, not in this repo. No further push unless the user asks.
- `css/style.css` is the only stylesheet (`projects/project.css` deleted). `js/site.js` = nav toggle, tabs, copy buttons. `js/reveal.js` = stagger-card reveal.
- Palette: paper `#f4f0e8`, ink `#1b2330`, muted `#5a6370`, rust `#7c341f`, ridge `#1a3948`.
- Every page uses the shared head (og, favicon, theme-color, `js` class script), header with `.nav-toggle`, and footer with `.footer-contour`. The front page keeps its skydive closing block.
- Page width: `--page-max: clamp(1160px, 80vw, 1600px)`; `.teaser` caps at 1280px; reading columns keep their own caps.
- Front page: intro (label, h1, portrait flush on the contour band) + one sliding expertise row (`.slider[data-slider]`, scroll-snap, arrows from `js/site.js`) + contact block over the skydive photo. No `.stagger` on the front page.
- Every inner page footer is only the contour strip and "(c) 2026 Larry Syu-Heng Lai" (`.footer-base`). Bluesky is not used anywhere.
- Animated figures are looping muted `<video autoplay muted loop playsinline>` with a `-poster.webp`; the GIF originals stay in `assets/from-site/`. `research__quantitative-stratigraphic-analysis.gif` stays a GIF (100 KB). Reduced-motion users get no autoplay (`site.js`).
- `og:image` is the absolute URL `https://geolarrylai.github.io/assets/og-image.png` on every page.
- Photos are never cropped on project/research pages (`height:auto`).
- Videos: `preload="none"` + poster, except the pyLogCrafter overview (autoplay, muted, no loop, 720p copy `pyLogCrafter_explain_720p.mp4`; the 1080p original is kept, unused).
- `404.html` uses root-absolute paths. `cv.html` stays as the redirect to `about.html#resume`.
- Do not edit SubsurfiX or CISR source folders.
- Do not invent facts, years, versions or collaborators. Move text, do not rewrite.
- `drafts/` is gitignored (scripts, shots).

---

## OPEN

- `pyLogCrafter_explain_1080p.mp4` (28 MB) is unused now; delete only if the user says so.
- The in-app browser caches `css/style.css`; force a fresh load with `fetch(url,{cache:"reload"})` then reload before testing CSS changes.
- Local server: run `python3 -m http.server 8765 --bind 127.0.0.1` as a background terminal (a `nohup` from a short shell dies).
- `portrait-full-body.webp` is waist-up (only tall photo available).
- Unknown facts left blank: pyValleyWidth version/license/install; pyPetrograph Python version; pyBasinSubs license; research project years, funding, coordinates (except Eastern Taiwan "23.5N 121.4E", taken from the plan).
- Enforce HTTPS on the custom domain after DNS propagates (GitHub Settings, Pages).

---

## ANTI

- Edit methods without updating this file.
- Add github.com links to pyLogCrafter.
- Edit `css/style.css` or `js/` from a subagent; main agent owns shared pieces.
- Commit, push or enable Pages without being asked.

---

## END_RITUAL

After page or style edits:

1. Check against DOMAIN_GOALS and CONTRACTS above.
2. Link check: every local `src`/`href`/`poster` exists (`drafts/audit.py` checks head/header/footer pieces).
3. Screenshot at 1440 and phone width (`drafts/shot.sh NAME W H PATH`), look at the changed pages and one neighbor that shares the CSS.
4. Click-test interactions touched (nav toggle, tabs, copy, fold-outs).
5. Append EDIT_LOG.

---

## EDIT_LOG

Append only. ≤15 lines each entry.

### 2026-10-19 — Site-wide polish (local only)
Symptom: non-front pages and project pages looked amateur | Cause: no shared design system | Decision: topographic identity, shared header/footer/labels, project template with fold-outs, research case layout, About timeline, 404, favicon/og | Files: css/style.css, js/site.js, all HTML pages, assets/contours/*, many .webp siblings; deleted blogs.html, contact.html, projects/project.css | Cache_bump: none | Status: DONE (not pushed)

### 2026-10-19 — pyLogCrafter overview autoplay
Symptom: 28 MB overview needed a click | Cause: preload none, 1080p | Decision: 7.5 MB 720p copy (no audio track in original), autoplay muted, controls kept, no loop | Files: projects/pyLogCrafter/index.html, videos/pyLogCrafter_explain_720p.mp4 | Cache_bump: none | Status: DONE

### 2026-10-19 — Front page redesign + review fixes
Symptom: front page still looked heavy (6 screens of cards), wide screens wasted space, small review gaps | Cause: stagger columns, fixed 1160px width | Decision: one sliding expertise row, title-block intro, wider page, contact block with icons, footer icons + (c), GIFs to video, repeated lede sentences removed from 5 project pages, 404 pill arrows, absolute og:image | Files: index.html, css/style.css, js/site.js, all inner pages (footer, og), 4 research/project pages (video swaps), assets/from-site/*.mp4 + posters | Cache_bump: none | Status: DONE (not pushed)

### 2026-10-19 — Titles, intro, contact copy
Symptom: user wanted PhD as a title (not after the name), fuller intro, tighter contact | Decision: titles "Quantitative geoscientist | Sedimentologist | PhD" (front) and three lines (About); QCL moved into the 2024-2026 Employment entry; degrees spelled out; front intro blends the user's self-intro (no invented years); contact shows only the Gmail address and the work address with mail and briefcase icons | Files: index.html, about.html, css/style.css | Cache_bump: none | Status: DONE

### 2026-10-19 — Front page fade-in, bigger labels, minimal footer
Decision: front intro fades in top to bottom on load (`.fx`, `--d` order); expertises head, cards and contact fade in on scroll (`[data-reveal]` + IntersectionObserver in `js/site.js`; slider cards reveal as they slide into view); reduced-motion shows everything. "Expertises" and "Contact" labels enlarged. Intro text width 40em. Inner-page footers now only "(c) 2026 Larry Syu-Heng Lai" (address, emails, social icons removed; Bluesky removed everywhere). Note: headless screenshots show unrevealed items hidden (no scroll, no animation clock); verify fades in the in-app browser | Files: index.html, css/style.css, js/site.js, 16 inner pages | Status: DONE

### 2026-10-19 — Publish
Decision: user asked to push and make the site public. Repo set public, Pages enabled from main /, CNAME larrysyuhenglai.com. DNS records are the user's step at the registrar | Files: CNAME, this log | Status: DONE

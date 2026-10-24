# Slides — Ayoub Ghriss

A static presentation index for `slides.ayghri.me`. Each presentation lives in its own folder and can be built or served independently.

| URL path | Page |
| --- | --- |
| `/` | [Presentation index](index.html) |
| `/llm-recall/` | [How LLMs recall](llm-recall/index.html) — 24 slides, 20 minutes |

## Preview locally

From the repository root:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/` for the index, or `http://localhost:8000/llm-recall/` for the presentation. The presentation page loads only files inside `llm-recall/`.

For an offline presentation, open [llm-recall/presentation.html](llm-recall/presentation.html) directly in a browser.

## Edit the presentation

The complete deck lives in [llm-recall/](llm-recall/), including its Markdown, speaker script, graphics, styles, vendored dependencies, simulation data, and build scripts. See the [deck README](llm-recall/README.md) for its controls and editing guide.

Rebuild the standalone HTML from the repository root:

```sh
python3 llm-recall/scripts/build.py
```

The same build works inside the presentation folder with `python3 scripts/build.py`. No parent-directory files or npm dependencies are required.

## GitHub Pages

This repository can be served directly as a static site; no build workflow is required. When publishing, use the `main` branch and repository root as the Pages source, and set the custom domain to `slides.ayghri.me`.

[CNAME](CNAME) records that hostname, and [.nojekyll](.nojekyll) keeps the site as plain static files. The public presentation path is `/llm-recall/`. GitHub Pages settings and DNS configuration are managed separately from these local files.

## Add a presentation

Create another folder alongside `llm-recall/` with its own `index.html` and dependencies, then add a link to the presentation list in the root [index.html](index.html).

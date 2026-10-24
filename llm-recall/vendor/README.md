# Bundled dependencies

These files are stored locally so the presentation works without a CDN connection.

- reveal.js **5.2.1**, including its Markdown parser and speaker notes plugin. [Project](https://revealjs.com/). License: [MIT](reveal/LICENSE).
- KaTeX **0.16.22**, including its WOFF2 fonts. [Project](https://katex.org/). License: [MIT](katex/LICENSE).

The packages were retrieved from the official npm registry. `scripts/build.py` embeds the required files into `presentation.html`. No package installation is needed to use or rebuild the deck.

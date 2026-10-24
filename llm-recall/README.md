# How LLMs recall

[presentation.html](presentation.html) is the self-contained Reveal.js deck: **24 slides for a 20-minute presentation**, by Ayoub Ghriss. Open it directly in a modern browser. Scripts, fonts, diagrams, simulation data, and speaker notes are embedded for offline use.

John’s café order connects associative memory, softmax attention, and linear attention. The central animation replaces exponential matching with a dot product, regroups the sum, and pools the separate key–value pairs into one fixed state. A worked three-neuron example introduces the outer product. The KATA section follows capacity with unit keys, separated addresses, symmetric-cone families, and the PSD capacity result. The ending covers overwrite and the delta rule, then closes with four main ideas and three questions for discussion.

[story.md](story.md) contains the narrative. [slides.md](slides.md) contains the headlines, embedded speaker notes, transitions, and sources. [notes.md](notes.md) is the complete spoken script, with elapsed-time cues and animation instructions totaling 20 minutes. Slides use short cues and large figures; the algebra is introduced through familiar café records.

## Presenting

| Key | Action |
| --- | --- |
| Right arrow / Space | Next animation build, then next slide |
| Left arrow | Previous build or slide |
| R | Replay the current slide |
| A | Show the final frame |
| S | Open speaker view with notes and timer |
| F | Fullscreen |
| Esc / O | Slide overview |
| M | Toggle reduced motion |
| ? | Keyboard help |

There are **58 presenter-controlled builds and 82 authored figure states**. Nothing advances automatically. Geometry, colors, and equation tokens ease between persistent SVG states; reverse navigation can interrupt motion without jumping. Reduced motion settles immediately.

The timing budget includes explanation and audience pauses. Rehearse using the speaker notes for the full 20-minute delivery.

## Pacing

| Slides | Time | Story |
| --- | --- | --- |
| 1 | 00:00–00:20 | Title and presenter |
| 2–3 | 00:20–02:45 | Hebbian association, activity vectors, and the outer product |
| 4–5 | 02:45–04:05 | Recognize and recover a cup |
| 6–9 | 04:05–07:15 | Lookup, context, attention, and a changed prompt |
| 10–12 | 07:15–11:00 | Separate pairs → regroup the sum → write and read one state |
| 13 | 11:00–11:45 | Capacity and interference |
| 14–16 | 11:45–14:10 | Unit keys, address spacing, and symmetric-cone families |
| 17–18 | 14:10–16:00 | PSD features and the capacity/state tradeoff |
| 19 | 16:00–16:50 | Adding is not overwriting |
| 20–21 | 16:50–18:30 | Read the prediction and write the correction |
| 22 | 18:30–18:45 | Return to John’s current order |
| 23 | 18:45–19:15 | Four main ideas |
| 24 | 19:15–20:00 | Open questions and discussion |

## Editing

| File | Purpose |
| --- | --- |
| [story.md](story.md) | Narrative and conceptual transitions |
| [slides.md](slides.md) | Headlines, placeholders, timing, and speaker notes |
| [notes.md](notes.md) | Spoken script and build cues for all 24 slides, timed to 20 minutes |
| [js/figures.js](js/figures.js) | Figures, equation animation, and toy memory calculations |
| [js/transitions.js](js/transitions.js) | Geometry, color, text, and signal interpolation |
| [js/drawing.js](js/drawing.js) | Shared SVG primitives |
| [js/deck.js](js/deck.js) | Markdown, notes, navigation, and build updates |
| [styles/deck.css](styles/deck.css) | Full-width layout and high-contrast theme |
| [assets/hopfield.json](assets/hopfield.json) | Verified recovery trajectory |

Text before `Note:` is audience-facing. Each section contains a headline and a figure placeholder; the renderer substitutes the corresponding SVG. Text after `Note:` contains narration, timing, precision notes, and sources. Horizontal `---` separators define the slides.

Stable `data-key` attributes preserve SVG elements across builds. `data-duration` and `data-delay` control interpolation. Equation symbols are individual groups, so q can move outside the sum and S can replace the accumulated terms. Stage descriptions remain available to assistive technology without adding visible paragraphs.

Rebuild the standalone artifact after editing:

```sh
python3 scripts/build.py
```

For source development, serve the folder and open `http://localhost:8000`:

```sh
python3 -m http.server 8000
```

[index.html](index.html) needs HTTP to load source files. [presentation.html](presentation.html) opens directly from disk. No npm installation is required.

Append `?static` before the slide hash to show final states. Reveal.js PDF export uses `?print-pdf`; print landscape with background graphics enabled. See the [export instructions](https://revealjs.com/pdf-export/).

## Mathematical scope

The Hebbian example uses a = [1, 1, 0]. The raw outer product aᵀa strengthens A–B and B–A, plus the active diagonal entries. Repetition accumulates the matrix; entries involving C stay zero. The subsequent Hopfield simulation separately excludes self-connections.

The softmax expression shows its numerator, with scaling and normalization omitted. Replacing exp with a dot product changes the matching rule. The subsequent regrouping is exact, using row vectors:

```text
Σᵢ (q · kᵢ) vᵢ = q (Σᵢ kᵢᵀ vᵢ) = qS
```

The slides use the unnormalized dot-product case. The subsequent KATA section introduces mapped addresses; normalizers stay in the notes. The separate KV-cache picture describes ordinary exact softmax attention; it does not claim that approximation or other compression methods are impossible. The derivation follows [Katharopoulos et al., §3.2–3.4](https://arxiv.org/html/2006.16236v3).

The toy memory uses distributed outer-product writes. Its first three keys are orthogonal unit vectors. Adding John’s second order makes both values contribute. The delta update writes the prediction error:

```text
v̂_t = k_t S_{t−1}
e_t = v_t − v̂_t
ΔS_t = β_t k_tᵀ e_t
S_t = S_{t−1} + ΔS_t
```

The delta slides build these equations alongside the read, subtraction, and write animations. The error is a value vector; k_tᵀe_t turns it into a matrix update. With a unit key and full write strength, the same-key read becomes the new value. Partial updates interpolate toward it; overlapping keys can affect other associations. The delta rule helps revise memory while capacity remains finite. See [Schlag et al., §4](https://arxiv.org/html/2102.11174v3).

The KATA figures separate normalized projected keys from normalized feature addresses. Spreading points follows an arc, so the radius stays fixed during animation. Positions 1, 2, and 3 keep their sequence order, illustrating the goal of well-separated positional addresses. The positive-quadrant example computes the shown overlaps directly. PSD addresses are represented as matrices rather than a misleading three-dimensional cone.

The rank-one lift kᵀk preserves unit norm in the Frobenius metric and squares pairwise dot products when both queries and keys are lifted. The slide shows sharper retrieval through 0.1 → 0.01 while 1 → 1. The capacity slide uses the paper’s idealized retrieval scaling, with the larger feature-value state made explicit. It does not compare equal byte budgets or promise exact recall at arbitrary length. See [Ghriss & Chakraborty, §§3–4](https://arxiv.org/html/2607.17419v1) and the slide notes for the assumptions.

Café labels and attention shares illustrate mechanisms. Interference bars are schematic rather than measured accuracy. The Hopfield animation uses seven verified simulation states with 24 initial corruptions and zero final errors:

```sh
python3 scripts/generate_hopfield.py --check
```

## Verification

Checked 24 slides, contiguous 20-minute timings, and one headline per slide. Rendered all 82 figure states and reviewed the title, Hebbian example, geometry sequence, equation sequence, and ending. All 116 forward/reverse transitions settle correctly. Query-token midpoint, reversal, persistent-node, and reduced-motion checks pass.

Numerical checks verify the sum-to-qS identity, additive overwrite failure, full/partial/zero delta corrections, orthogonal-key preservation, and effects on overlapping keys. Reading leaves the state unchanged. The new checks cover the Hebbian table, PSD norm and squared-match identity, antipodal equivalence, and constant-radius packing motion.

The standalone deck is checked without network access in a simulated DOM, including navigation, replay, reduced motion, static mode, slide count, and dark background. Full browser layout and print verification remain pending because no browser is connected. Visual review uses rendered SVG frames at the authored slide dimensions.

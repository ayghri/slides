# How LLMs recall

A 20-minute presentation by **Ayoub Ghriss** — [ghriss@wustl.edu](mailto:ghriss@wustl.edu) · [ayghri.me](https://ayghri.me).

The story now spans **24 visual slides**. John’s café order connects every part: learning an association, recalling it from context, compressing many associations into one state, choosing better addresses, and correcting an old order. The screen carries a cue and a picture. [slides.md](slides.md) holds the timed narration and sources.

## Introduce the question — 00:00–00:20 · slide 1

**On screen:** How LLMs recall

Introduce yourself and the question: how can a small cue bring back information associated with it? The title shows the presenter’s name, email, and website.

**Lead into the café:** “Imagine you work at a café.”

## Learn John’s usual order — 00:20–01:30 · slide 2

**On screen:** John → ?

On Monday, John orders espresso. Tuesday and Wednesday are the same. On Friday, show John without the drink and let the audience supply it.

Introduce Hebb after that small act of recall. Repeated paired activity can strengthen a connection. Later, the cue can use the connection to bring back associated activity. The café illustrates the idea; it is not a claim that a model learns a person using one biological connection.

**Visual:** The line between John and the cup strengthens with repeated pairings. During recall its strength stays fixed.

**Lead into numbers:** “What would that strengthened connection look like as numbers?”

## Turn activity into a connection — 01:30–02:45 · slide 3

**On screen:** An association, in numbers.

Use three toy neurons. A and B are active; C is quiet. Their row vector is a = [1, 1, 0]. An outer product makes a table of pairwise products:

```text
           A  B  C
        A  1  1  0
aᵀa =   B  1  1  0
        C  0  0  0
```

Follow row A to column B. One times one writes an association. Three repetitions accumulate an A–B weight of three; entries involving C remain zero. The raw update also includes the symmetric B–A entry and active diagonal entries.

**Visual:** Neurons → activity vector → product table → A–B highlight → repeated writes. This gives the audience a concrete outer product to recognize later.

**Lead into completion:** “The connections contain a trace of what happened together. Can a partial cue bring the pattern back?”

## Recover a pattern — 02:45–04:05 · slides 4–5

**On screen:** What do you see? / Let the memory settle.

First show a partial cup. Let the audience recognize it, then complete it. Next show a small Hopfield network doing a related task. Its connections encode three patterns; a damaged cue evolves into the cup.

**Visual:** Use the verified seven-frame recovery. Activity changes while weights stay fixed. The simulated Hopfield rule excludes self-connections, unlike the raw three-neuron product just shown.

**Lead into lookup:** “A few pixels brought back a shape. John’s name brings back something associated with it.”

## Give the association an address — 04:05–04:45 · slide 6

**On screen:** Cue → association

Name the three parts through the familiar café picture: a cue matches a key and brings back its associated value. John is the cue; espresso is the content to recover. Matching will become graded in the next scene.

**Visual:** Trace the cue to the matching key, then to its value.

**Lead into attention:** “How does a language model get these associations from a conversation?”

## Recall today’s orders from context — 04:45–07:15 · slides 7–9

**On screen:** Today’s orders. / What did John order? / A new order.

The prompt supplies three orders. Context representations produce keys and values. The question supplies a query. Compare it with the keys, turn scores into weights, and mix the values. Keep this sequence concrete: compare, weight, recall.

Change John’s statement to orange juice and ask the same question. The relevant value changes because the prompt changed. Learned projections stay fixed during ordinary inference. Restore espresso before continuing.

**Visual:** Keep the cards in place across these scenes. Change one part at a time. The weights are illustrative; the answer icon represents information contributed to later prediction.

**Lead into storage:** “Three orders were easy. Now the morning rush starts.”

## Keep the pairs available — 07:15–08:25 · slide 10

**On screen:** Keep the pairs.

Introduce the softmax numerator through the objects already on screen:

```text
Σᵢ exp(q · kᵢ) vᵢ
```

Read it as adding each value’s contribution. Each query sits inside a separate exponential for each key. Ordinary exact softmax attention keeps the key–value pairs available to score them. More context grows the cache.

**Visual:** Highlight the exponential, fan the query toward separate records, and add more records. A caption states that scaling and normalization are omitted.

**Lead into compression:** “What if we change the matching rule so we can add the pairs together first?”

## Accumulate one state — 08:25–11:00 · slides 11–12

**On screen:** Remove exp. Regroup. / Write. Then read.

Removing exp changes the matching rule. The following regrouping of the new linear expression is exact:

```text
Σᵢ (q · kᵢ) vᵢ = q (Σᵢ kᵢᵀ vᵢ) = qS
```

The query can move outside the sum. Each remaining term is an outer product—like the earlier activity table, now binding a key to a value. Accumulate these terms into S. Its dimensions stay fixed as more context arrives.

Write John’s order, then two others. Query the state with John and show the associated contribution. Reading leaves the state unchanged.

**Visual:** Persistent equation tokens move into their new positions. Cards pool into the same matrix. Keep its outline fixed through every write.

**Lead into capacity:** “We can keep writing. Can we keep recalling?”

## Notice the interference — 11:00–11:45 · slide 13

**On screen:** How many can we recall?

Overlapping keys let John’s query bring back unwanted values too. Accepting a write does not guarantee that the association remains distinguishable later.

**Visual:** More associations share the same matrix. Show wanted and unwanted contributions, with schematic bars rather than an invented accuracy curve.

**Lead into the paper:** “Can we give the keys better addresses, so they interfere less?”

## Normalize, spread, and choose the geometry — 11:45–14:10 · slides 14–16

**On screen:** Put the keys on a sphere. / Spread the addresses. / Choose the geometry.

Introduce the geometric question from KATA. Unit norm controls the length of an address, leaving its direction. Spread normalized feature addresses across the allowed sphere section to reduce their closest overlaps.

Make this tangible with three successive positions on a positive quarter-circle. Positional embeddings provide sequence information; our design goal is to spread the keys while preserving that order. In this simple example, the best spacing places positions 1, 2, and 3 evenly along the arc. The middle query stays fixed; its neighbors move farther away. Self-match remains one and the largest other match drops from 0.98 to 0.71. This is a calculated ordered-packing illustration, rather than a claim that positional embeddings automatically produce optimal spacing.

Then introduce the three requested cone families one at a time: positive orthant, Lorentz cone, and PSD matrices. The pictures name alternatives; the talk does not need an abstract definition of symmetric cones.

**Visual:** Normalize arrows smoothly, then spread points labeled 1, 2, and 3 along an arc at constant radius, preserving their sequence order. Reveal the three families afterward. Show PSD addresses as matrices, including valid negative off-diagonal entries.

**Lead into the lift:** “What changes when the address itself becomes a matrix?”

## Use a matrix address — 14:10–16:00 · slides 17–18

**On screen:** Make the key a matrix. / PSD: more recall capacity.

Return to the outer product in a new role: k becomes kᵀk, the address itself. Map the query the same way. Matching the two PSD matrices changes ⟨q, k⟩ into ⟨q, k⟩²: a weak match of 0.1 becomes 0.01, while one stays one. This makes retrieval sharper by reducing weak cross-matches while preserving the exact match.

The capacity slide shows the paper’s conditional linear-to-quadratic retrieval scaling, with the larger feature-state cost visible. The comparisons and assumptions are detailed in the speaker notes; this is a capacity result rather than a speedup section.

**Visual:** Unit vector → signed 3×3 PSD matrix → squared score examples → linear and PSD scaling. Avoid an equal-byte claim or a promise of unlimited exact recall.

**Lead into updating:** “Better addresses help separate different customers. But what if the same customer changes his order?”

## Adding is not replacing — 16:00–16:50 · slide 19

**On screen:** John changes his order.

John’s espresso is already in the recurrent state. Add a new association at the same key for orange juice. Both values now contribute. Earlier we edited a prompt; here we are revising an existing memory.

**Visual:** Deliver the new message, apply the additive write, then show the two contributions.

**Lead into correction:** “Rewind to before that write. First, read what the state already predicts.”

## Write a correction — 16:50–18:30 · slides 20–21

**On screen:** Read before writing. / Write the correction.

Read John’s old value with v̂_t = k_t S_{t−1}. Subtract that prediction from the desired new value: e_t = v_t − k_t S_{t−1}. Bind the correction to John’s key through another outer product, ΔS_t = β_t k_tᵀe_t, and add it to the previous state.

In this unit-key, full-strength example the next read returns orange juice. A correct prediction would produce zero correction. Overlapping keys can still affect one another, so updating does not remove the capacity limit.

**Visual:** Read → new minus recalled → correction vector → write → current order. The prediction and error equations accompany the first scene. On the next slide, ΔS_t = β_t k_tᵀe_t expands into S_t = S_{t−1} + β_t k_tᵀe_t as the matrix updates. The matrix remains the same size.

**Lead into the closing:** “Where we write and what we write both shape recall.”

## Return to John — 18:30–18:45 · slide 22

**On screen:** Recall. Update.

John’s cue now returns his current order. Complete the café example in one sentence: we have learned an association, recalled it, and corrected it.

**Lead into the recap:** “Let’s take four ideas away from that story.”

## Keep four ideas — 18:45–19:15 · slide 23

**On screen:** Main ideas.

Reveal four familiar operations: **Recall — match the cue. Compress — pairs into one state. Separate — geometry sets capacity. Update — write the error.** Reuse the cue, matrix, spaced keys, and correction graphics. Explain each in a sentence without reopening the derivations.

**Lead into discussion:** “That leaves a few questions worth exploring.”

## Leave room for questions — 19:15–20:00 · slide 24

**On screen:** Open questions.

End with three directions for discussion: **Recall per byte? Order without collisions? What should we forget?** Ask how much recall feature maps deliver under equal storage budgets, how positional structure and separated addresses can coexist over longer contexts, and how to balance retention with new updates.

Reveal one question at a time. Leave all three visible, with email and website links, while opening the discussion.

## Mathematical and visual conventions

Use row vectors throughout. The Hebbian example writes aᵀa; linear attention writes kᵀv; the PSD feature map builds kᵀk. Name their different roles when returning to the outer product.

The softmax expression omits scaling and its denominator. The linear demonstration uses the unnormalized dot-product case; general kernel attention can use feature maps and an accumulated normalizer. The exact regrouping applies after changing the rule.

The delta update is S_t = S_{t−1} + β_t k_tᵀ(v_t − k_t S_{t−1}). The error is a value vector; the outer product turns it into a matrix update. The toy example uses a unit key and β_t = 1. Its other initial keys are orthogonal.

All numerical toy examples are computed. The Hopfield frames are verified simulation states. Café records, cone sketches, and interference bars are explanatory illustrations. KATA’s capacity assumptions, feature-state dimensions, and primary-source links are in [slides.md](slides.md).

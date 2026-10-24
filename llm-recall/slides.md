<!-- .slide: id="s01" -->

# How LLMs recall

> **[FIG-01 / ANIM-01]** Main title with Ayoub Ghriss, ghriss@wustl.edu, and ayghri.me.

Note:

**Timing:** 00:00–00:20 · 20 seconds.

**Say:** I’m Ayoub Ghriss. We’ll follow one familiar association—from remembering a café order to storing and updating information in attention.

**Presenter:** Ayoub Ghriss · [ghriss@wustl.edu](mailto:ghriss@wustl.edu) · [ayghri.me](https://ayghri.me).

**Build and pace:** Let the title sit while introducing the question. This slide has no builds.

**Transition:** “Imagine you work at a café.”

---

<!-- .slide: id="s02" -->

## John → ?

> **[FIG-02 / ANIM-02]** John and his espresso, learning and recall.

Note:

**Timing:** 00:20–01:30 · 70 seconds.

**Say:** You work at a café. On Monday, John orders an espresso. On Tuesday, the same. On Wednesday, the same. On Friday, John walks in. What will he order? Pause for the audience. Seeing John now brings his order to mind. Repetition has left an association.

Introduce Hebb after the audience supplies the answer. His proposal was that a neuron repeatedly helping another fire can strengthen their connection. Later, a partial cue can help reactivate associated activity.

**Build and pace:** Advance through the three repeated orders, pause on Friday’s cue, then reveal recall. Spend roughly half the time establishing the association and half explaining what changed.

**Precision:** This is a conceptual analogy. During learning the connection changes; during this recall demonstration it stays fixed. LLM parameters are trained using gradient-based optimization.

**Transition:** “What would that strengthened connection look like as numbers?”

**Source:** [Hebb · 1949](https://pure.mpg.de/pubman/item/item_2346268_3/component/file_2346267/Hebb_1949_The_Organization_of_Behavior.pdf), p. 62.

---

<!-- .slide: id="s03" -->

## An association, in numbers.

> **[FIG-03 / ANIM-03]** A and B fire, C stays quiet; an activity vector becomes an outer-product matrix.

Note:

**Timing:** 01:30–02:45 · 75 seconds.

**Say:** Use three toy neurons: A, B, and C. A and B are active; C is quiet. Encode their activity as one, one, zero.

An outer product is a table of pairwise products. Put one copy of the vector down the rows and another across the columns. The A–B entry multiplies A’s activity by B’s: one times one. Any entry involving the quiet neuron C is zero.

Add this table to the connection weights. Repeat the same activity three times and A–B grows from one to three. Paired activity has become a stronger connection that can influence later recall.

**Build and pace:** Reveal the activity vector, the product table, the A–B highlight, and finally three accumulated writes. Trace row A to column B with the pointer. Let each update settle.

**Precision:** With row vectors, the raw update is ΔW = aᵀa. Starting from zero, three identical writes give W = 3aᵀa. A–B and B–A both grow, as do the active diagonal entries A–A and B–B. This is a symmetric toy co-activity rule, not a literal model of every biological Hebbian mechanism. The Hopfield simulation separately excludes self-connections. The 1/0 encoding is specific to this demonstration.

**Transition:** “The connections now contain a trace of what happened together. Can a partial cue bring the pattern back?”

**Sources:** [Hebb · 1949](https://pure.mpg.de/pubman/item/item_2346268_3/component/file_2346267/Hebb_1949_The_Organization_of_Behavior.pdf), p. 62; [Hopfield · 1982](https://authors.library.caltech.edu/records/w41x7-8bn13).

---

<!-- .slide: id="s04" -->

## What do you see?

> **[FIG-04 / ANIM-04]** A partial cup becomes a complete cup.

Note:

**Timing:** 02:45–03:10 · 25 seconds.

**Say:** Keep the café in mind. Here is only part of an image. What do you see? Give the audience five seconds to recognize the cup, then reveal the rest. John’s name brought back his order; a few pixels brought back a whole shape. Both are associative recall: retrieving related content and completing a pattern.

**Build and pace:** Ask for the cup, pause briefly, and complete the image with one click.

**Transition:** “Can we make a small network do that completion for us?”

**Basis:** [Hopfield · 1982](https://authors.library.caltech.edu/records/w41x7-8bn13). This recognition example is illustrative; the next slide uses a verified simulation.

---

<!-- .slide: id="s05" -->

## Let the memory settle.

> **[FIG-05 / ANIM-05]** The verified Hopfield recovery.

Note:

**Timing:** 03:10–04:05 · 55 seconds.

**Say:** A Hopfield network stores associations among simple units in its connections. We have encoded three patterns: a cup, a cross, and a diagonal stripe. Those thumbnails are references for us. The network uses its connection weights during recall.

Give it this damaged cup. Each update changes the network’s activity. Over several updates, the recognizable pattern returns. The weights stay fixed throughout. The changing activity becomes the recalled pattern.

**Build and pace:** Introduce the stored patterns, then advance through the six updates at a steady pace. Hold the recovered cup and explain that activity changed while weights stayed fixed.

**Precision:** Actual recorded states: 24 corrupted pixels, seven frames, zero final errors. Recovery depends on the patterns and initial cue.

**Transition:** “Now let’s give a language model a few café orders.”

**Source:** [Hopfield · 1982](https://authors.library.caltech.edu/records/w41x7-8bn13).

---

<!-- .slide: id="s06" -->

## Cue → association

> **[FIG-06 / ANIM-06]** A cue finds a key and its associated value.

Note:

**Timing:** 04:05–04:45 · 40 seconds.

**Say:** The cup example completed a damaged pattern. John’s name brings back something associated with it: his order. Both begin with a cue.

We can describe the second operation using keys and values. A key is the representation we match against; a value is the associated content we want to recover. John is our cue, and espresso is the content associated with the matching key. We reach the memory through a match to its content.

**Build and pace:** First find the matching key, then follow its association to the value. Keep the three terms connected to the café example.

**Precision:** This is a conceptual lookup, not a literal database implementation. Matching can be graded. In attention, queries and keys are learned representations and values are combined with weights.

**Transition:** “How does a language model get these associations from a conversation?”

**Basis:** [Vaswani et al. · 2017](https://arxiv.org/html/1706.03762v7), §3.2.

---

<!-- .slide: id="s07" -->

## Today’s orders.

> **[FIG-07 / ANIM-07]** Context representations produce keys and values.

Note:

**Timing:** 04:45–05:35 · 50 seconds.

**Say:** Give the model these three statements: John ordered an espresso, Theo ordered tea, and Mina ordered cocoa. These are the associations for today.

Attention derives keys and values from representations of the context. Keys provide something a later query can match. Values carry the information that matching will bring forward. The information about John’s particular order came from this prompt.

The model has learned how to produce these representations during training. At inference its learned projections stay fixed, while the keys and values depend on the conversation.

**Build and pace:** Read the three orders once. Introduce keys and values on separate clicks, then ask the retrieval question.

**Precision:** One card per order is an explanatory simplification. Actual keys and values are vectors associated with token positions, rather than literal name–drink records.

**Transition:** “Now we ask: what did John order?”

**Source:** [Vaswani et al. · 2017](https://arxiv.org/html/1706.03762v7), §3.2.

---

<!-- .slide: id="s08" -->

## What did John order?

> **[FIG-08 / ANIM-08]** Compare, weight, and recall.

Note:

**Timing:** 05:35–06:40 · 65 seconds.

**Say:** The current question supplies a query. Compare that query with the available keys. Each match gets a score.

Turn the scores into positive weights that sum to one. A stronger match gets more influence. In this illustration, John’s value contributes 80%, Theo’s 15%, and Mina’s 5%. We then mix the values using those weights.

Walk along the arrows: compare the addresses, determine the influence of each stored value, and gather the associated information. That is the recall view of attention.

**Build and pace:** Allow a short pause at each of the three builds: compare, weight, recall. Follow the strongest contribution through the diagram.

**Precision:** The shares are illustrative, not measured model attention. The weighted readout is a representation that contributes to later prediction. Attention can combine multiple relevant values; retrieval does not require a single winner.

**Optional equation, kept in notes:** softmax(q Kᵀ / √d_k) V. The exponential and normalization turn match scores into weights; V provides the context-derived values.

**Transition:** “We can test this idea by changing just one association.”

**Source:** [Vaswani et al. · 2017](https://arxiv.org/html/1706.03762v7), §3.2.

---

<!-- .slide: id="s09" -->

## A new order.

> **[FIG-09 / ANIM-09]** Change the prompt and recall the new association.

Note:

**Timing:** 06:40–07:15 · 35 seconds.

**Say:** John decides on orange juice today. Change that statement in the prompt, then ask the same question. The relevant value changes because the context changed. We did not retrain the model to make this new association available.

This is attention as in-context recall. Learned projections stay fixed during ordinary inference; the keys and values they produce depend on the context. Keep the distinction between parameters and temporary context information clear.

**Build and pace:** Change John’s prompt statement, let the audience predict the answer, reveal juice, then restore espresso. Keep the distinction between context and parameters brief.

**Precision:** Recall is one function of attention, which also transforms and combines information. This example edits the original prompt; handling two conflicting writes is a separate problem.

**Transition:** “Three orders were easy. Now the morning rush starts.”

**Source:** [Vaswani et al. · 2017](https://arxiv.org/html/1706.03762v7), §3.2.

---

<!-- .slide: id="s10" -->

## Keep the pairs.

> **[FIG-10 / ANIM-10]** The softmax sum reads separate key–value pairs.

Note:

**Timing:** 07:15–08:25 · 70 seconds.

**Say:** Here is the attention picture in one line: add up exp(q · k_i) times v_i. Read the sum sign as “add the contributions.” The query is our question, each key is an address, and each value is associated content. For this picture, we have set scaling and normalization aside.

Point to the exponential. The query sits inside a separate exponential for each key. A new query needs a new score for each stored key. In ordinary exact softmax attention, we keep those key–value pairs separately in the KV cache.

Now the café gets busy. More context means more pairs to retain. That is why the cache keeps growing.

**Build and pace:** Spend about 25 seconds on the sum, 25 on query-dependent scores, and 25 on the growing cache.

**Precision:** The displayed expression is the softmax numerator, with the scale absorbed into q for notation. The full output divides by the sum of exponential scores. The factorization into a finite matrix shown next does not apply to the exponential kernel in general. Approximations and other cache-compression schemes are outside this example.

**Transition:** “What if we change the matching rule so the pairs can be added together first?”

**Sources:** [Vaswani et al. · 2017](https://arxiv.org/html/1706.03762v7), §3.2; [Katharopoulos et al. · 2020](https://arxiv.org/html/2006.16236v3), §3.2.

---

<!-- .slide: id="s11" -->

## Remove exp. Regroup.

> **[FIG-11 / ANIM-11]** Remove the exponential, move the query outside the sum, and name the remaining matrix S.

Note:

**Timing:** 08:25–10:05 · 100 seconds.

**Say:** Start from the same expression. Remove the exponential and use the dot product as the match. This changes the attention rule. It is not an algebraic identity with softmax.

Now regroup the new expression. The query is the same for every term, so it can move outside the sum. What remains is a sum of key–value outer products. Each pair contributes a small matrix; we add these matrices together. This is the same outer-product construction we used for the three neurons, now binding a key to a value.

Call that sum S. It does not depend on the future query, so we can accumulate it as context arrives. Later, a query reads with qS. The individual cached pairs have become one fixed-size state.

**Build and pace:** Name removal of exp as a change of rule. Give each subsequent rearrangement time to settle before speaking about it. Finish by pointing from qS to the shared state.

**Reference, using row vectors:** sum_i (q · k_i) v_i = q [sum_i k_iᵀ v_i] = qS. The transpose makes k_iᵀ v_i an outer-product matrix, not a scalar.

**Precision:** We show the unnormalized dot-product case to make regrouping visible. Normalized kernel linear attention uses feature maps and may also accumulate a normalizer. Those details do not change the fixed-state idea. Dropping exp can produce signed scores; it is a change of matching mechanism.

**Transition:** “Let’s see what writing and reading this state look like.”

**Source:** [Katharopoulos et al. · 2020](https://arxiv.org/html/2006.16236v3), §3.2–3.4.

---

<!-- .slide: id="s12" -->

## Write. Then read.

> **[FIG-12 / ANIM-12]** Add three associations to S, then read John’s order with qS.

Note:

**Timing:** 10:05–11:00 · 55 seconds.

**Say:** Start with an empty state. John and espresso contribute one outer-product update. Theo and tea add another; Mina and cocoa add a third. Every write changes entries in the same matrix. Its dimensions stay fixed.

Now John is our cue. Apply the query to S and follow the associated contribution to espresso. Reading in this picture leaves the state unchanged.

This returns us to the opening: paired activity leaves a trace, and a later cue uses that trace. The temporary state is an associative memory. The trained model produces the representations; the state is updated during the conversation.

**Build and pace:** Advance once for each write, then once for the query and once for the answer. Keep the outline of S in view throughout.

**Precision:** The colored matrix uses actual toy outer-product writes with three orthogonal unit keys. It is an unnormalized signed-feature example, not a trained model’s memory. The first three bindings are exactly recoverable in this example.

**Transition:** “We can keep writing. Can we keep recalling?”

**Sources:** [Schlag et al. · 2021](https://arxiv.org/html/2102.11174v3), §3–4; [Katharopoulos et al. · 2020](https://arxiv.org/html/2006.16236v3).

---

<!-- .slide: id="s13" -->

## How many can we recall?

> **[FIG-13 / ANIM-13]** Capacity: overlapping associations interfere in a fixed state.

Note:

**Timing:** 11:00–11:45 · 45 seconds.

**Say:** Keep writing more orders into the same matrix. John’s association is now sharing entries with many others. When keys overlap, the readout can pick up unrelated values too.

This is the capacity cost of squeezing associations into a fixed state. We have bounded the storage, but we have not obtained unlimited reliable recall. Useful capacity depends on how distinguishable the associations remain.

Point to the wanted contribution and the unwanted ones. The state can continue accepting writes even while recall becomes less reliable.

**Build and pace:** Add the two batches of associations, watching the unwanted contribution grow. End on the question of what makes keys distinguishable.

**Precision:** The bars are schematic contributions, not benchmark accuracy. There is no universal “one association per matrix cell” capacity. Geometry, values, precision, update rules, and the recall criterion all matter.

**Transition:** “Can we give the keys better addresses, so they interfere less?”

**Source:** [Schlag et al. · 2021](https://arxiv.org/html/2102.11174v3), §4.1.

---

<!-- .slide: id="s14" -->

## Put the keys on a sphere.

> **[FIG-14 / ANIM-14]** Keys smoothly normalize to a common radius.

Note:

**Timing:** 11:45–12:30 · 45 seconds.

**Say:** Keep the question of interference in mind. First control length: give every key unit norm. Now direction determines which address it represents. A sphere collects those unit-length directions.

**Build and pace:** Point out the unequal arrow lengths, then normalize them in one smooth build. The circle is a great-circle slice, not a picture of all the dimensions.

**Precision:** Distinguish a normalized projected key from its mapped feature address. Packing is measured after mapping and normalization.

**Transition:** “If two addresses point almost the same way, a query can confuse them.”

**Source:** [Ghriss & Chakraborty · KATA](https://arxiv.org/html/2607.17419v1), §1 and §3.

---

<!-- .slide: id="s15" -->

## Spread the addresses.

> **[FIG-15 / ANIM-15]** Positional embeddings give keys sequence information; addresses 1, 2, and 3 spread evenly in order along a positive quarter-circle.

Note:

**Timing:** 12:30–13:15 · 45 seconds.

**Say:** These are successive positions: one, two, three. Positional embeddings give the model sequence information. Ideally, we want the keys spread out in sequence, so they carry order and remain distinguishable. Here we read position two. When its neighbors crowd it, they also match strongly. In this simple arc example, the best spacing distributes the three keys evenly in order. Their unwanted matches weaken while the exact match stays one.

**Build and pace:** Trace labels 1 → 2 → 3 in the crowded configuration. Advance once and follow the labeled keys as they spread without changing order or radius. Compare the two bars.

**Worked illustration:** In this two-dimensional positive quadrant, the three directions move from 35°, 45°, 55° to 0°, 45°, 90°. The middle query stays fixed. Self-match is 1; the largest other match falls from cos(10°) ≈ 0.98 to cos(45°) ≈ 0.71. These values are calculated for this drawing, not benchmark measurements.

**Precision:** “Evenly” means improving separation of the closest addresses; it does not require every pair to be equally distant. The optimal statement here applies to three ordered points on this quarter-circle under the maximum-overlap objective. Sequence order is a desired positional structure, not an implication of spherical packing alone. Positional embeddings supply order information but do not automatically guarantee an optimal or uniformly spaced key configuration. The illustration is a design goal, not a literal plot of RoPE features.

**Transition:** “The allowed region matters too. What shapes can our addresses live in?”

**Source:** [Ghriss & Chakraborty · KATA](https://arxiv.org/html/2607.17419v1), §3 (packing) and §5.2–5.3 (position-dependent features).

---

<!-- .slide: id="s16" -->

## Choose the geometry.

> **[FIG-16 / ANIM-16]** Positive orthant, Lorentz cone, and PSD matrix addresses appear in turn.

Note:

**Timing:** 13:15–14:10 · 55 seconds.

**Say:** The paper studies three symmetric-cone families: positive coordinates, a Lorentz cone, and positive semidefinite matrices. They support nonnegative feature matches. We normalize the addresses and spread them across the sphere section allowed by their cone.

**Build and pace:** Introduce one family per click. Use the pictures to name the alternatives; leave the formal definition of a symmetric cone to questions. Highlight the matrix-valued option.

**Figure note:** These are schematic family illustrations, not equal-dimensional packing experiments. The PSD panel uses 3×3 matrices; PSD does not mean that every matrix entry is positive. A 2×2 PSD cone is isomorphic to a 3D Lorentz cone, so those two pictures would not establish a capacity difference.

**Transition:** “What changes when the address itself becomes a matrix?”

**Source:** [Ghriss & Chakraborty · KATA](https://arxiv.org/html/2607.17419v1), §2.

---

<!-- .slide: id="s17" -->

## Make the key a matrix.

> **[FIG-17 / ANIM-17]** A key becomes its outer product; the match is squared: 0.1 → 0.01 while 1 → 1.

Note:

**Timing:** 14:10–15:05 · 55 seconds.

**Say:** Take an outer product again, this time to build the address itself. The key k becomes kᵀk, a unit PSD matrix. We map the query the same way. Comparing these matrix addresses turns ⟨q, k⟩ into ⟨q, k⟩². A weak match of 0.1 becomes 0.01, while a perfect match of one stays one. That gives sharper retrieval: less contribution from weak cross-matches, with the exact match preserved.

**Build and pace:** Reveal the matrix, then the squared-match expression and the two score examples. Point to the unchanged 1 before following 0.1 down to 0.01. Connect this operation to the earlier three-neuron table, while naming its new role: constructing a key.

**Worked illustration:** k = [2/3, −2/3, 1/3], so the displayed matrix is kᵀk, rounded to two decimals. Its Frobenius norm is one. With both queries and keys lifted, ⟨qᵀq, kᵀk⟩_F = ⟨q, k⟩². Thus 0.1 becomes 0.01 and a self-match remains one. Negative off-diagonal entries are valid. Opposite raw vectors map to the same matrix; squaring reduces weak matches in magnitude, not every possible distractor.

**Transition:** “That weaker crosstalk changes how many associations remain readable.”

**Source:** [Ghriss & Chakraborty · KATA](https://arxiv.org/html/2607.17419v1), §3.1.

---

<!-- .slide: id="s18" -->

## PSD: more recall capacity.

> **[FIG-18 / ANIM-18]** Linear and PSD recall scaling, followed by the larger-state tradeoff.

Note:

**Timing:** 15:05–16:00 · 55 seconds.

**Say:** Among the studied families, PSD gives the strongest capacity regime. In the paper’s idealized readout, linear retrieval scales like p and PSD like p squared. The lift expands the feature state; its size still stays fixed as context grows.

**Build and pace:** Start with the linear address, reveal the PSD matrix, then reveal the storage tradeoff. Read the scaling as “more room for associations,” without asking the audience to derive it.

**Precision:** The comparison assumes Welch-scale distractor correlations and independent isotropic values, using signal power greater than aggregate interference as the criterion. It is not an equal-byte benchmark or a guarantee of exact recall. A full symmetric PSD lift has p(p+1)/2 feature coordinates; the memory also has a value dimension.

**Transition:** “Better addresses help separate different customers. But what if the same customer changes his order?”

**Source:** [Ghriss & Chakraborty · KATA](https://arxiv.org/html/2607.17419v1), §3.3, Theorem 7, and §4.1.

---

<!-- .slide: id="s19" -->

## John changes his order.

> **[FIG-19 / ANIM-19]** Adding a new value at the same key leaves both values contributing.

Note:

**Timing:** 16:00–16:50 · 50 seconds.

**Say:** John’s espresso is already stored. Now a new message arrives: “Orange juice, please.”

Use the same additive rule. Write John paired with orange juice into the existing state. What should happen on the next read? Pause for the audience.

Both the old and new values contribute. Adding an association did not replace the previous one. This time we are updating an existing state; earlier we edited the original prompt before computing its representations.

**Build and pace:** Show John’s update, pause for a prediction, then reveal both value contributions. Name the distinction between adding and replacing.

**Precision:** With the unit key in this unnormalized example, naive addition changes the readout from v_old to v_old + v_new. The icons represent a mixture of value vectors, not a literal generated answer containing two drinks.

**Transition:** “Rewind to before that write. First, let’s read what the state already predicts.”

**Source:** [Schlag et al. · 2021](https://arxiv.org/html/2102.11174v3), §4.2.

---

<!-- .slide: id="s20" -->

## Read before writing.

> **[FIG-20 / ANIM-20]** Read v̂_t = k_t S_{t−1}, then reveal e_t = v_t − v̂_t = v_t − k_t S_{t−1} beside the value comparison.

Note:

**Timing:** 16:50–17:45 · 55 seconds.

**Say:** Return to the state before John’s new order was added. The top equation reads: the prediction is John’s key times the previous state. It gives espresso; the new target is orange juice.

Subtract the prediction from the new value to get the error e_t. Then replace the prediction with k_t S_{t−1}: the correction is v_t − k_t S_{t−1}. If the memory already gave the right answer, the correction would be zero.

This is the idea behind the delta rule: make the write depend on what the memory currently predicts.

**Build and pace:** Point to the prediction equation while reading the old association. First click arranges new minus recalled and reveals e_t = v_t − v̂_t. Second click reveals the correction and expands v̂_t into k_t S_{t−1}. Let the equation tokens settle before continuing.

**Equations, using row vectors:**

```text
v̂_t = k_t S_{t−1}
e_t = v_t − v̂_t = v_t − k_t S_{t−1}
```

**Precision:** The icons stand for value vectors. With S shaped d_k × d_v, both v_t and k_t S_{t−1} are value rows of length d_v. The outer product k_tᵀv_t is a matrix write, so it belongs in the state update rather than in this value-vector subtraction. The starting state is reset to before the naive additive write so the two rules can be compared.

**Transition:** “Now write that correction at John’s key.”

**Source:** [Schlag et al. · 2021](https://arxiv.org/html/2102.11174v3), §4.2.

---

<!-- .slide: id="s21" -->

## Write the correction.

> **[FIG-21 / ANIM-21]** Build ΔS_t = β_t k_tᵀe_t, then animate it into S_t = S_{t−1} + β_t k_tᵀe_t as the state changes.

Note:

**Timing:** 17:45–18:30 · 45 seconds.

**Say:** Multiply the error by the transposed key: an outer product again. This makes the matrix update ΔS_t. Beta controls write strength; here it is one. Add the update to the previous state. Ask about John again, and the readout gives orange juice.

The write changed the existing association. The matrix has the same size. This helps memory stay current; its capacity is still finite.

**Build and pace:** Begin with the outer-product update equation. First click inserts the previous state and plus sign while updating the matrix. Second click reads the current order; the full update equation stays visible. Keep the existing 15-second beats.

**Equations, using row vectors:**

```text
ΔS_t = β_t k_tᵀ e_t
S_t = S_{t−1} + β_t k_tᵀ (v_t − k_t S_{t−1})
```

**Precision:** Expanding the matrix correction gives ΔS_t = β_t(k_tᵀv_t − k_tᵀk_t S_{t−1}); both terms now have the same dimensions as S. For a unit key and β_t = 1, the same-key read becomes v_t. Smaller write strength makes a partial correction. Updates can affect other associations when their keys overlap. This example uses orthogonal keys, so its other two stored orders remain unchanged.

**Transition:** “The memory has to recall associations and revise them.”

**Source:** [Schlag et al. · 2021](https://arxiv.org/html/2102.11174v3), §4.2.

---

<!-- .slide: id="s22" -->

## Recall. Update.

> **[FIG-22 / ANIM-22]** Return to John and his current order before the recap.

Note:

**Timing:** 18:30–18:45 · 15 seconds.

**Say:** John still gives us the cue. Now the memory returns his current order. We have learned an association, recalled it, and corrected it. Let’s take four ideas away from that story.

**Build and pace:** Reveal orange juice and hold briefly. Move directly to the main ideas.

**Source:** [Schlag et al. · 2021](https://arxiv.org/html/2102.11174v3).

---

<!-- .slide: id="s23" -->

## Main ideas.

> **[FIG-23 / ANIM-23]** Four visual cues: recall, compress, separate, update.

Note:

**Timing:** 18:45–19:15 · 30 seconds.

**Say:** Recall starts with a cue and a match. Linear attention compresses separate associations into one fixed-size state. Geometry determines how much the addresses interfere; PSD features suppress weak cross-matches. When an association changes, write the prediction error to keep it current.

**Build and pace:** Begin with Recall, then reveal Compress, Separate, and Update on three clicks. Allow seven or eight seconds per idea. Keep the recap verbal; the screen carries only the four cues and their familiar graphics.

**Transition:** “That leaves a few questions worth exploring.”

**Sources:** [Vaswani et al. · 2017](https://arxiv.org/html/1706.03762v7); [Katharopoulos et al. · 2020](https://arxiv.org/html/2006.16236v3); [Ghriss & Chakraborty · KATA](https://arxiv.org/html/2607.17419v1); [Schlag et al. · 2021](https://arxiv.org/html/2102.11174v3).

---

<!-- .slide: id="s24" -->

## Open questions.

> **[FIG-24 / ANIM-24]** Recall per byte? Order without collisions? What should we forget?

Note:

**Timing:** 19:15–20:00 · 45 seconds.

**Say:** First, recall per byte. At the same memory budget, how much reliable recall do different feature maps actually buy us?

Second, order without collisions. Can positional embeddings preserve sequence structure and keep addresses separated as the context grows?

Finally, what should we forget? How should a memory choose between retaining an old association and trusting a new update? Thank you—let’s discuss.

**Build and pace:** Spend 15 seconds on each question. Reveal the second and third on separate clicks. Leave all three visible for discussion; the final build also shows email and website links.

**Discussion focus:** These questions connect the talk’s state-size tradeoff, ordered address geometry, and error-based updates. Compare recall under equal memory budgets and specified error criteria. Ask how positional generalization, noisy updates, and selective forgetting interact with the feature geometry.

**Source:** [Ghriss & Chakraborty · KATA](https://arxiv.org/html/2607.17419v1), §§3–5.

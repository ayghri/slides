# How LLMs recall — speaker notes

**Ayoub Ghriss · 24 slides · 20:00 total**

Times are elapsed presentation time and match [slides.md](slides.md). They include animation builds and audience pauses. Read the prose aloud; bracketed instructions are presenter actions. Advance only when a cue says to click, and let each animation settle before continuing.

## 01 — How LLMs recall

**Timing:** 00:00–00:20 · 20 seconds.

[Hold the title.]

I’m Ayoub Ghriss. We’ll follow one café order from a learned association to attention, then ask how to fit more memories into a fixed state—and keep them current.

Imagine you work at a café.

## 02 — John → ?

**Timing:** 00:20–01:30 · 70 seconds.

**00:20–00:42 — Learn the association.**

On Monday, John comes in and orders an espresso. Nothing surprising yet: you have a person and an order.

[Click to Tuesday.]

On Tuesday, John returns. Espresso again.

[Click to Wednesday.]

And on Wednesday, the same thing. Notice the connection becoming stronger. These two things keep happening together.

**00:42–00:55 — Ask for recall.**

[Click to Friday.]

Now it’s Friday. John walks through the door. What do you think he’ll order?

[Pause for the audience, about five seconds.]

**00:55–01:30 — Introduce Hebb.**

[Click to reveal espresso.]

Seeing John brings back his order. The cup wasn’t there, but the cue was enough.

That is the intuition behind Hebbian learning: when activity repeatedly occurs together, the connection can strengthen. A later cue can use that connection to reactivate associated activity.

Notice the two phases. During learning, the connection changed. During recall, we used the connection that was already there. This café story is an analogy for that mechanism.

What would the strengthened connection look like as numbers?

## 03 — An association, in numbers.

**Timing:** 01:30–02:45 · 75 seconds.

**01:30–01:48 — Encode activity.**

Let’s use three toy neurons: A, B, and C. A and B are active together; C is quiet.

[Click to reveal the vector.]

We can write that activity as one, one, zero. Each number just tells us whether that neuron is active.

**01:48–02:10 — Build the table.**

[Click to reveal the outer product and matrix.]

An outer product makes a table of pairwise products. Put one copy of the activity vector down the rows and another across the columns. Multiply the corresponding numbers at each crossing. That gives us a small matrix of connection updates.

**02:10–02:27 — Find A–B.**

[Click to highlight A–B. Trace row A to column B.]

Here is A meeting B: one times one gives one. Both were active, so this connection gets an update. Any entry involving C stays zero, because C was quiet. B–A grows too in this simple symmetric example.

**02:27–02:45 — Accumulate repetitions.**

[Click to repeat the association.]

Repeat that activity three times and the A–B entry grows to three. Paired activity has left a trace in the connections.

Remember this table: we’ll meet the outer product again inside linear attention.

## 04 — What do you see?

**Timing:** 02:45–03:10 · 25 seconds.

[Show the partial image.]

What do you see here?

[Wait about four seconds, then click to complete the cup.]

You probably recognized the cup before all the pixels appeared. A partial cue brought back a whole pattern. John’s name brought back his order; these pixels brought back a shape. Both are examples of associative recall.

Can a small network do that completion?

## 05 — Let the memory settle.

**Timing:** 03:10–04:05 · 55 seconds.

**03:10–03:25 — Set up the memory.**

This is a Hopfield network. We encoded three patterns in its connections: a cup, a cross, and a stripe. The thumbnails are there for us; the network recalls through its connection weights.

**03:25–03:45 — Recover the cup.**

[Advance through all six updates, allowing roughly three seconds per frame.]

Give it a damaged cup. As the units update, the activity settles toward the stored pattern. Watch the errors disappear. These frames come from an actual small simulation.

**03:45–04:05 — Explain what changed.**

The connections stayed fixed during this process. The activity changed until the cup returned. Here, twenty-four corrupted pixels were corrected; recovery depends on what is stored and the starting cue.

Now let’s return to John. His name brings back related content: his order.

## 06 — Cue → association

**Timing:** 04:05–04:45 · 40 seconds.

**04:05–04:20 — Name the cue and key.**

We can describe that lookup with three simple ideas. First, a cue: John. Then a key: the representation we compare that cue against.

[Click to highlight the matching key.]

**04:20–04:45 — Follow the association.**

[Click to reveal the value.]

The value is the associated content we want to bring back: espresso. Follow the path from the cue, through a match, to the content.

In attention, these are vectors and the match can be gradual. Several values can contribute. But this picture gives us the basic operation.

How does a language model get today’s associations?

## 07 — Today’s orders.

**Timing:** 04:45–05:35 · 50 seconds.

**04:45–05:00 — Introduce the context.**

We give it a prompt: John ordered espresso, Theo ordered tea, and Mina ordered cocoa. Those are the associations available in this conversation.

**05:00–05:15 — Introduce keys.**

[Click to reveal keys.]

From representations of that context, attention produces keys: addresses that a later question can match against.

**05:15–05:35 — Introduce values.**

[Click to reveal values.]

It also produces values: the information that a match will bring forward. The particular orders came from this prompt. Training taught the model how to form useful representations.

These cards simplify the picture; actual keys and values belong to token positions.

Now ask: what did John order?

## 08 — What did John order?

**Timing:** 05:35–06:40 · 65 seconds.

**05:35–05:49 — Query.**

The question gives us a query. Think of it as a representation of what we are looking for. We now compare it with the available keys.

**05:49–06:03 — Compare.**

[Click to show comparisons.]

Each comparison gives a score. In this illustration, John’s key matches the question more strongly than the others.

**06:03–06:21 — Weight.**

[Click to show weights.]

Turn those scores into positive weights that add to one. A stronger match gets more influence.
The percentages here are illustrative: most of the contribution comes from John, with smaller contributions from the other records.

**06:21–06:40 — Recall.**

[Click to reveal the readout.]

Then mix the values using those weights. The result carries the information about espresso forward into the model’s prediction.

Compare, weight, recall. That is the memory view of attention. It can combine several relevant values; it doesn’t have to choose just one.

## 09 — A new order.

**Timing:** 06:40–07:15 · 35 seconds.

**06:40–06:55 — Change the prompt.**

Suppose we change John’s statement in the prompt to orange juice.

[Click to change the order. Pause briefly.]

Same question: what did John order?

[Click to reveal orange juice.]

**06:55–07:15 — Explain the change.**

The answer changes because the context changed. We didn’t retrain the model. Its learned projections stayed fixed, while the temporary keys and values changed.
That is the sense in which attention supports in-context recall.

[Click to restore espresso.]

Three orders were easy. Now the café gets busy.

## 10 — Keep the pairs.

**Timing:** 07:15–08:25 · 70 seconds.

**07:15–07:38 — Read the expression.**

Here is the same operation in one line. Read the big sum sign as “add the contributions.” For each key, compare it with the query, apply the exponential, and multiply its value by that score.

We’ve left scaling and normalization out of this picture to focus on the storage question.

**07:38–08:02 — Show why the keys stay separate.**

[Click to highlight the exponential and comparisons.]

Notice where the query lives: inside a separate exponential for each key. When the question changes, those scores have to be computed again.
In ordinary exact softmax attention, we keep the key–value pairs separately available in the KV cache.

**08:02–08:25 — Grow the cache.**

[Click to add cached pairs.]

More context means more pairs to retain. The café can keep taking orders, but the cache keeps growing.

What if we change the matching rule so the pairs can be added together before the next question arrives?

## 11 — Remove exp. Regroup.

**Timing:** 08:25–10:05 · 100 seconds.

**08:25–08:43 — Change the rule.**

Start with the same expression.

[Click to remove exp.]

Now replace the exponential with the dot product itself. This changes the attention rule. We’re defining a different kind of matching; we haven’t simplified softmax into an equivalent formula.

**08:43–09:10 — Move the query.**

[Click to regroup. Let the query finish moving.]

Once the matching rule is linear, we can rearrange the sum. The query is the same in every term, so move it outside.

What remains is a sum of key–value outer products. Remember the table for A, B, and C? Each pair now contributes a table that binds an address to its content. We add those tables together.

**09:10–09:38 — Name the state.**

[Click to box the sum and name S.]

Call the accumulated matrix S. It depends on the pairs we have seen, but not on the next question. That means we can build it as the conversation arrives, one write at a time.

**09:38–10:05 — Read from the state.**

[Click to collapse the sum into S.]

A future query reads with q times S. The separate cards have become one shared state. Its dimensions stay fixed as the sequence grows.

The regrouping after changing the matching rule is exact. The important storage idea is simple: accumulate the associations first, then query the result.

Let’s watch that memory being written.

## 12 — Write. Then read.

**Timing:** 10:05–11:00 · 55 seconds.

**10:05–10:33 — Three writes.**

Start with an empty state.

[Click for John.]

John and espresso contribute one outer-product update.

[Click for Theo.]

Theo and tea add another.

[Click for Mina.]

Mina and cocoa add a third. Every write changes entries in the same matrix. The outline stays the same size.

**10:33–11:00 — Query and recall.**

[Click to introduce John’s query, then click to reveal espresso.]

Now read with John’s cue. In this toy example, it recovers his associated value. Reading leaves the state unchanged.

We’ve returned to the opening idea: paired activity leaves a trace, and a later cue uses it. Here the trace lives in a temporary matrix updated during the conversation.

We can keep writing. Can we keep recalling?

## 13 — How many can we recall?

**Timing:** 11:00–11:45 · 45 seconds.

**11:00–11:25 — Add more associations.**

[Click to add the first batch, then the second.]

Keep adding orders into the same state. When their keys overlap, John’s query starts picking up contributions from other values as well. The wanted association is still there, but now it comes with interference.

**11:25–11:45 — Pose the capacity question.**

Accepting another write doesn’t guarantee that we can read it back reliably. We squeezed many associations into bounded storage; they now have to coexist there.

These bars illustrate the idea. The capacity question is: how distinguishable can we keep the addresses?

That brings us to the geometry studied in KATA.

## 14 — Put the keys on a sphere.

**Timing:** 11:45–12:30 · 45 seconds.

**11:45–12:05 — Control length.**

First, separate length from direction. These keys have different lengths, so a comparison can reflect both their size and where they point.

[Click to normalize. Let the arrows settle.]

Give each key length one. The tips now lie on a sphere.

**12:05–12:30 — Think in directions.**

With length controlled, the address is its direction. The drawing shows a slice through the sphere; a real key has many more dimensions.

Now we can ask a geometric question: which directions should different addresses use? If they nearly coincide, a query can confuse them. If they are better separated, they can interfere less.

Let’s look at the spacing.

## 15 — Spread the addresses.

**Timing:** 12:30–13:15 · 45 seconds.

**12:30–12:50 — Add sequence information.**

[Trace labels 1 → 2 → 3.]

These are successive positions: one, two, three. Positional embeddings give the model sequence information. Ideally, we want the keys spread out in sequence, so they carry order and remain distinguishable.

Here we read position two, but its neighbors crowd it and also match strongly.

**12:50–13:15 — Spread in order.**

[Click. Follow the labeled points along the arc.]

In this simple example, the best spacing places the three positions evenly along the arc, preserving their order. The unwanted matches weaken while the exact match stays one.

That is the design goal: ordered, well-separated addresses. The allowed region matters too. What shapes can these addresses live in?

## 16 — Choose the geometry.

**Timing:** 13:15–14:10 · 55 seconds.

**13:15–13:30 — Positive orthant.**

The paper considers three symmetric-cone families. The first is the positive orthant: addresses with nonnegative coordinates. Think of restricting the available directions to a positive part of the space.

**13:30–13:45 — Lorentz cone.**

[Click to reveal the Lorentz cone.]

The second is the Lorentz cone. Its constraints give another geometry for the addresses. For this talk, the picture and name are enough.

**13:45–14:10 — PSD matrices.**

[Click to reveal PSD matrices.]

The third uses positive semidefinite matrices as addresses. All three families support nonnegative matches, but they offer different ways to separate keys.

We normalize the addresses and spread them across the sphere section allowed by their cone. Let’s focus on the matrix option: what changes when the key itself becomes a matrix?

## 17 — Make the key a matrix.

**Timing:** 14:10–15:05 · 55 seconds.

**14:10–14:30 — Lift the address.**

Here is a unit key. Take its outer product: k becomes k transpose k.

[Click to reveal the matrix.]

The address is now a PSD matrix. We transform the query the same way. This outer product builds the address itself.

**14:30–14:50 — Square the match.**

[Click to reveal the match expression and examples.]

Comparing those matrix addresses turns the original query–key dot product into its square. Look at the two examples: a perfect match of one stays one. A weak match of zero point one becomes zero point zero one.

**14:50–15:05 — Explain sharper retrieval.**

That is sharper retrieval: weak cross-matches contribute less, while the exact match is preserved. This extra separation changes how many associations can remain readable.

What does that mean for capacity?

## 18 — PSD: more recall capacity.

**Timing:** 15:05–16:00 · 55 seconds.

**15:05–15:23 — Establish the comparison.**

Let p stand for the width of the projected key. In the paper’s idealized retrieval model, the linear case supports a recall regime that grows roughly with p.

[Point to the left-hand representation.]

**15:23–15:42 — Show the PSD regime.**

[Click to reveal PSD.]

The PSD lift squares weak interference and extends that idealized regime to roughly p squared. Among the studied families, it gives the strongest capacity regime under the comparison’s assumptions. These are theoretical scaling statements, not measured accuracy bars.

**15:42–16:00 — State the tradeoff.**

[Click to reveal the state-size cue.]

The lift uses a larger feature state. Its size still stays fixed as context grows. We gain room for associations by changing their representation.

Better addresses help separate different customers. But what if the same customer changes his order?

## 19 — John changes his order.

**Timing:** 16:00–16:50 · 50 seconds.

**16:00–16:14 — Recall the old association.**

John’s espresso is already stored. Now a new message arrives: orange juice, please. We want the memory to reflect his current order.

**16:14–16:32 — Try an additive write.**

[Click to deliver the message and add its write.]

Use the same rule: add John paired with orange juice. What should the next read return?

[Pause for a prediction, then click to reveal both contributions.]

**16:32–16:50 — Identify the problem.**

Both values contribute. Adding the new association didn’t remove the previous one. Earlier, we edited the original prompt. Here, we are updating a state that already contains an order.

Rewind to before that write. First, let’s read what the memory already predicts.

## 20 — Read before writing.

**Timing:** 16:50–17:45 · 55 seconds.

**16:50–17:10 — Read the prediction.**

[Point to the prediction equation above the diagram.]

Return to the state before the new order. The first equation reads: the prediction is John’s key times the previous state. That gives espresso; our new target is orange juice.

**17:10–17:25 — Compare target and prediction.**

[Click to arrange new minus recalled and reveal the error equation.]

Subtract what the memory predicts from what we want. This gives the error, e. The drink icons stand for vectors, so we are subtracting one value vector from another.

**17:25–17:45 — Identify the correction.**

[Click to reveal the correction and expand the prediction in the equation.]

Replace the predicted value with key times old state. The correction is the new value minus that readout. If they already agree, the error is zero. Now write the correction at John’s address.

## 21 — Write the correction.

**Timing:** 17:45–18:30 · 45 seconds.

**17:45–18:00 — Update.**

[Point to the outer-product update equation.]

Multiply the error by the transposed key: an outer product again. Beta controls write strength; here it is one.

[Click to write the correction and expand the equation.]

Add that update to the previous state.

**18:00–18:15 — Read again.**

[Click to query the updated state.]

Ask about John again. In this unit-key, full-strength example, the readout now gives orange juice. The state has exactly the same dimensions.

**18:15–18:30 — Connect updating to capacity.**

The delta rule helps keep an association current. Overlapping keys can still affect one another, so capacity remains a concern.

Where we write and what we write both shape recall.

## 22 — Recall. Update.

**Timing:** 18:30–18:45 · 15 seconds.

[Click to reveal John’s current order. Hold briefly.]

John still gives us the cue. Now the memory returns his current order. We have learned an association, recalled it, and corrected it. Let’s take four ideas away from that story.

## 23 — Main ideas.

**Timing:** 18:45–19:15 · 30 seconds.

**18:45–18:52 — Recall.**

Recall starts with a cue and a match. Attention brings the associated information forward.

**18:52–19:00 — Compress.**

[Click to reveal Compress.]

Linear attention accumulates separate associations into one fixed-size state. That creates a capacity tradeoff.

**19:00–19:07 — Separate.**

[Click to reveal Separate.]

Geometry controls interference. PSD features make weak cross-matches weaker, improving the capacity regime.

**19:07–19:15 — Update.**

[Click to reveal Update.]

When an association changes, write the prediction error to keep it current.

That leaves a few questions worth exploring.

## 24 — Open questions.

**Timing:** 19:15–20:00 · 45 seconds.

**19:15–19:30 — Recall per byte?**

First, recall per byte. At the same memory budget, how much reliable recall do different feature maps actually buy us?

**19:30–19:45 — Order without collisions?**

[Click to reveal the second question.]

Second, order without collisions. Can positional embeddings preserve sequence structure and keep addresses separated as the context grows?

**19:45–20:00 — What should we forget?**

[Click to reveal the third question and contact details.]

Finally, what should we forget? How should a memory choose between retaining an old association and trusting a new update? Thank you—let’s discuss.

[Leave the final slide visible for discussion.]

---

## Reference notes for questions — outside the 20-minute script

- **Hebbian table:** The raw update aᵀa includes A–A and B–B as well as A–B and B–A. The later Hopfield simulation removes self-connections separately.
- **Softmax bridge:** The displayed expression omits scaling and normalization. Removing exp changes the matching rule; only the subsequent linear regrouping is an identity.
- **Ordered packing:** Slide 15 shows the optimal spacing of three ordered points on a positive quarter-circle for minimizing maximum pairwise overlap. Preserving sequence order is the positional design goal. A positional embedding does not by itself guarantee this packing, and the diagram is not a literal RoPE trajectory.
- **PSD match:** Both sides are lifted: ⟨qᵀq, kᵀk⟩_F = ⟨q, k⟩². Opposite raw directions map to the same matrix. Squaring suppresses weak matches in magnitude; it does not resolve every possible collision.
- **Capacity:** The displayed p-to-p² comparison uses the paper’s idealized Welch-scale correlations and isotropic-value readout. It is not an equal-byte comparison or a guarantee of exact recall. The full symmetric PSD feature width is p(p+1)/2, multiplied by the value width in the stored state.
- **Delta rule:** Prediction v̂_t = k_t S_{t−1}; value error e_t = v_t − k_t S_{t−1}; matrix update ΔS_t = β_t k_tᵀe_t; new state S_t = S_{t−1} + ΔS_t. Expanding the matrix update gives β_t(k_tᵀv_t − k_tᵀk_t S_{t−1}). The demonstration uses a unit key and β_t = 1; its other stored keys are orthogonal.
- **Vector convention:** The slides use row vectors. With column vectors and a transposed memory M_t = S_tᵀ, the equivalent equations are e_t = v_t − M_{t−1}k_t and M_t = M_{t−1} + β_t e_t k_tᵀ. The outer-product write and the value error are different-shaped objects; they cannot be subtracted directly.

Primary sources and per-slide precision notes are in [slides.md](slides.md). The geometry and positional-feature discussion follows [Ghriss & Chakraborty, KATA, §§3 and 5.2–5.3](https://arxiv.org/html/2607.17419v1).

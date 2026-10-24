#!/usr/bin/env python3
"""Generate the verified Hopfield recall frames used on slides 3–5.

Standard-library only. Run from any directory:
    python3 scripts/generate_hopfield.py
    python3 scripts/generate_hopfield.py --check

All animation frames are actual states from deterministic asynchronous updates.
The 0/1 pixels are display encodings of internal -1/+1 neural states.
"""

import argparse
import json
import random
from pathlib import Path


WIDTH = HEIGHT = 12
SEED = 0
CORRUPTED_PIXELS = 24
FLIPS_PER_FRAME = 4

CUP_ROWS = [
    "000000000000",
    "000101000000",
    "000010100000",
    "000000000000",
    "001111111000",
    "001111111110",
    "001111110010",
    "001111110010",
    "000111111100",
    "000011110000",
    "000000000000",
    "001111111100",
]


def display_pixels(state):
    return [(value + 1) // 2 for value in state]


def make_patterns():
    cross_rows = [
        "".join("1" if 5 <= y <= 6 or 5 <= x <= 6 else "0" for x in range(WIDTH))
        for y in range(HEIGHT)
    ]
    stripe_rows = [
        "".join("1" if abs(x - y) <= 1 else "0" for x in range(WIDTH))
        for y in range(HEIGHT)
    ]
    return [
        {
            "name": name,
            "label": label,
            "rows": rows,
            "pixels": [int(pixel) for row in rows for pixel in row],
        }
        for name, label, rows in [
            ("cup", "Cup", CUP_ROWS),
            ("cross", "Cross", cross_rows),
            ("stripe", "Diagonal stripe", stripe_rows),
        ]
    ]


def generate():
    patterns = make_patterns()
    states = [[2 * value - 1 for value in pattern["pixels"]] for pattern in patterns]
    target = states[0]
    size = WIDTH * HEIGHT

    # Keep unnormalized integer weights internally to make tie handling and
    # energy-monotonicity checks exact. Multiplying every field by 1/N does
    # not change its sign, and normalized energies are reported below.
    weights = [
        [sum(pattern[i] * pattern[j] for pattern in states) if i != j else 0 for j in range(size)]
        for i in range(size)
    ]

    def field(state, i):
        return sum(weight * value for weight, value in zip(weights[i], state))

    def energy_numerator(state):
        # E = -1/2 sum_ij W_ij s_i s_j. Symmetry lets us sum just i < j.
        return -sum(
            weights[i][j] * state[i] * state[j]
            for i in range(size)
            for j in range(i + 1, size)
        )

    def error_count(state):
        return sum(value != expected for value, expected in zip(state, target))

    def is_stable(state):
        # The current state is retained at an exact zero field.
        return all(state[i] * field(state, i) >= 0 for i in range(size))

    assert all(weights[i][i] == 0 for i in range(size)), "Self-connections must be zero"
    assert all(weights[i][j] == weights[j][i] for i in range(size) for j in range(size))
    assert all(is_stable(state) for state in states), "Every displayed stored pattern must be stable"

    rng = random.Random(SEED)
    corrupted_indices = rng.sample(range(size), CORRUPTED_PIXELS)
    state = target.copy()
    for index in corrupted_indices:
        state[index] *= -1
    initial = state.copy()
    frames = []
    updates = []
    pending_changes = []
    previous_energy = energy_numerator(state)
    visits = 0
    sweeps_with_changes = 0

    def append_frame(sweep):
        frames.append({
            "step": len(frames),
            "pixels": display_pixels(state),
            "energy": round(energy_numerator(state) / size, 6),
            "energyNumerator": energy_numerator(state),
            "errorCount": error_count(state),
            "changedIndices": pending_changes.copy(),
            "flipCount": len(updates),
            "visitCount": visits,
            "sweep": sweep,
        })
        pending_changes.clear()

    append_frame(0)
    converged = False
    for sweep in range(1, 21):
        order = list(range(size))
        rng.shuffle(order)
        changed_in_sweep = 0
        for index in order:
            visits += 1
            local_field = field(state, index)
            next_value = 1 if local_field > 0 else -1 if local_field < 0 else state[index]
            if next_value == state[index]:
                continue
            old_value = state[index]
            state[index] = next_value
            current_energy = energy_numerator(state)
            assert current_energy <= previous_energy, "Asynchronous update increased energy"
            assert current_energy - previous_energy == 2 * old_value * local_field
            previous_energy = current_energy
            changed_in_sweep += 1
            pending_changes.append(index)
            updates.append({
                "index": index,
                "from": (old_value + 1) // 2,
                "to": (next_value + 1) // 2,
                "fieldNumerator": local_field,
                "energyNumerator": current_energy,
                "errorCount": error_count(state),
                "visitCount": visits,
                "sweep": sweep,
            })
            if len(pending_changes) == FLIPS_PER_FRAME:
                append_frame(sweep)
        if changed_in_sweep:
            sweeps_with_changes += 1
        else:
            converged = True
            break

    if pending_changes:
        append_frame(sweep)
    assert converged, "Simulation failed to converge within 20 sweeps"
    assert state == target, "Noisy cue did not recover the intended cup"
    assert is_stable(state), "Recovered cup is not stable"
    assert frames[-1]["pixels"] == display_pixels(state)

    # Replay the changes to ensure every exported frame is an actual state.
    replay = initial.copy()
    previous_flip_count = 0
    for frame in frames:
        for update in updates[previous_flip_count:frame["flipCount"]]:
            index = update["index"]
            assert field(replay, index) == update["fieldNumerator"]
            assert (replay[index] + 1) // 2 == update["from"]
            replay[index] = 2 * update["to"] - 1
            assert energy_numerator(replay) == update["energyNumerator"]
        assert display_pixels(replay) == frame["pixels"]
        assert error_count(replay) == frame["errorCount"]
        assert energy_numerator(replay) == frame["energyNumerator"]
        previous_flip_count = frame["flipCount"]

    return {
        "schemaVersion": 1,
        "width": WIDTH,
        "height": HEIGHT,
        "seed": SEED,
        "target": "cup",
        "pixelOrder": "Row-major; 0 = background / neural state -1, 1 = lit / neural state +1",
        "patterns": patterns,
        "initial": display_pixels(initial),
        "corruptedIndices": corrupted_indices,
        "corruptionCount": CORRUPTED_PIXELS,
        "corruptionFraction": CORRUPTED_PIXELS / size,
        "frames": frames,
        "updates": updates,
        "final": display_pixels(state),
        "normalization": {
            "denominator": size,
            "rule": "W_ij = sum_p(pattern_p[i] * pattern_p[j]) / N for i != j; W_ii = 0",
        },
        "dynamics": {
            "rule": "Asynchronous sign(W_i dot state); retain current state when local field is zero",
            "order": "Seeded shuffled unit order each sweep; RNG is also used to select the initial corruption",
            "totalFlips": len(updates),
            "totalVisits": visits,
            "sweepsWithChanges": sweeps_with_changes,
            "sweepsIncludingConvergenceCheck": sweep,
            "flipsPerFrame": FLIPS_PER_FRAME,
        },
        "verification": {
            "weightsSymmetric": True,
            "zeroDiagonal": True,
            "allStoredPatternsStable": True,
            "energyNeverIncreases": True,
            "recoveredTarget": True,
            "everyFrameReplayed": True,
            "convergenceChecked": True,
        },
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Verify the simulation and compare the committed JSON")
    args = parser.parse_args()
    data = generate()
    destination = Path(__file__).resolve().parents[1] / "assets" / "hopfield.json"
    serialized = json.dumps(data, indent=2) + "\n"
    if args.check:
        if not destination.is_file() or destination.read_text() != serialized:
            raise SystemExit("Hopfield asset differs from deterministic simulation; regenerate it")
        verb = "Verified"
    else:
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(serialized)
        verb = "Generated"
    print(
        f"{verb} {destination.name}: {WIDTH}x{HEIGHT}, {len(data['patterns'])} stable patterns, "
        f"{CORRUPTED_PIXELS} corrupted pixels, {len(data['frames'])} true frames, "
        f"{data['dynamics']['totalFlips']} flips, final errors = 0."
    )


if __name__ == "__main__":
    main()

# Banker's Algorithm: The Vault

An interactive simulator for the **Banker's algorithm** (deadlock avoidance). Processes orbit a vault of
resources; you can solve for a safe sequence, let an AI run the bank, or take the banker's chair yourself.

No build step, no dependencies. Plain HTML + CSS + JavaScript.

## Run it

Open `index.html` in any modern browser (double-click works). Fonts load from Google Fonts; offline it
falls back to system fonts.

Optional local server:

```bash
python3 -m http.server 8000     # then open http://localhost:8000
```

## Features

| Feature | What it does |
|---|---|
| **Ledger** | Edit Allocation, Max and Available. Need = Max − Allocation updates live. Resize to 1-10 processes and 1-8 resource types. |
| **Presets** | *Textbook* (5 processes, 3 resources), *Deadlock trap* (safe start, but granting recklessly dooms it), *Random*, *Clear*. |
| **Solve** | Animates the safety algorithm: a yellow route draws through the ring in safe order while the vault shows Work. Unsafe states pulse orange on the stuck processes. |
| **Banker's AI** | Live run. Processes request resources at random; only requests that keep the state safe are granted. |
| **Reckless AI** | Same run, but grants anything that is free. Use it on *Deadlock trap* to watch deadlock happen. |
| **You are the banker** | Each request is yours to Grant or Deny. +10 for a correct call, -15 for an unsafe grant, -3 for needless caution. "Ask the algorithm" gives a hint. |

## How the algorithm works

1. `Work = Available`, all processes unfinished.
2. Find an unfinished process `i` with `Need[i] <= Work` (lowest index first).
3. Assume it finishes: `Work += Allocation[i]`, mark it finished. Repeat step 2.
4. If every process finished, the state is **safe** and the order found is a safe sequence. Otherwise it is **unsafe**.

A request is granted only if `Request <= Need`, `Request <= Available`, and the state after a trial
allocation is still safe.

Note: several safe sequences can exist. This tool reports the first-fit one. For the textbook example it
gives `P1 → P3 → P0 → P2 → P4` (the textbook lists `P1, P3, P4, P0, P2`; both are valid).

## Project layout

```
bankers-vault/
├── index.html            page markup, loads css + scripts in order
├── css/style.css         theme (cobalt/yellow), layout, light/dark
├── js/
│   ├── core.js           helpers (vector math), shared global state
│   ├── algorithm.js      safety() and isSafe(): pure logic, no DOM
│   ├── ledger.js         editable tables, presets, validation
│   ├── ui.js             event log + status HUD
│   ├── solve.js          animated safe-sequence solver
│   ├── simulation.js     live bank: Banker / Reckless / play-as-banker
│   ├── canvas.js         vault ring renderer, particles, theme colours
│   └── main.js           event wiring and start-up
├── tests/algorithm.test.js
└── README.md
```

Scripts are classic (non-module) files sharing one global scope, so they must load in the order listed in
`index.html`. This keeps the project openable straight from `file://`.

## Tests

Requires Node 18+. Runs the same `core.js` and `algorithm.js` in a bare VM:

```bash
node tests/algorithm.test.js
```

Covers the textbook example and requests, unsafe states, input immutability, and a 500-case fuzz that replays
every returned safe sequence to confirm it is valid.

## Limits

- Max 10 processes and 8 resource types.
- Simulation requests are random, so runs differ each time.
- Allocation above Max is rejected with a message.

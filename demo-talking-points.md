# UXP vs UXPScript in InDesign — demo talking points

Terse cue sheet. Explain in own words. Don't forget the starred (★) items.

---

## 0. Pre-flight

- Scripts Panel list tidy.
- Have Scripts Panel + UDT + a test document open. Document with an `[indesignbrot]` INI text frame optional.-
- Know the recovery moves (bottom of sheet) in case a crash demo refuses to crash.

---

## 1. `wait.idjs` — draining pending promises vs hard crash

**Concept**
- UXPScript engine is torn down when the top-level script returns.
- Pending `setTimeout` / `setImmediate` callback that fires *after* teardown → runs into a dead JS engine → InDesign hard crash (use-after-free).
- CRDT_UXP `crdtuxp.init()` swaps in a proxy `Promise` class that tracks pending promises. `crdtuxp.deinit()` / `finalize()` = drain loop (`setImmediate` poll until no tracked promise pending). Holds the engine alive.

**Demo A — drain works**
- `USE_DRAIN = true`, `USE_TIMEOUT = true`, timeout 10 s.
- Run. Log shows `sync body done` (mainReturned=false) → later `deferred work RAN` → `deinit() drain resolved`. Engine survived. No crash.

**Demo B — no drain, crash**
- `USE_DRAIN = false`. `USE_TIMEOUT = false` (setImmediate branch = tighter race, more reliable than timeout 0).
- Run a few times. InDesign crashes fairly reliably.
- Point at log: `mainReturned=true` printed, callback scheduled, never drained.

**★ Accuracy points (say these, don't overclaim)**
- Drain tracks **proxy Promises**, not bare timers. `wait.idjs` is drainable only because `fireAndForget()` wraps its timer in `new Promise`. A naked `setTimeout` would still crash even with drain installed.
- With `USE_DRAIN=false`, `crdtuxp.init()` never runs → stock `Promise`, no tracking. Clean demo.
- `main` is declared `async` here → this file already runs in InDesign's slow mode. Irrelevant to the crash point; don't reuse this file for the speed demo.
- Crash is timing/build dependent. "Fairly reliably", not "always".

---

## 2. `InDesignBrot.idjs` — the injected async wrapper and the 10× slowdown

### 2a. Minimal repro — repaint cadence (`wrapperSync.idjs` / `wrapperAsync.idjs`)

Both launchers `require("./wrappedWait.js")` and call the same `async waitTest()`. `waitTest` logs to a text frame, `fireAndForget()` schedules a **5000 ms** timer wrapped in a Promise, drain on. Only difference between the two files: `wrapperAsync.idjs` has one uncalled `async function dummy() {}`.

**Run `wrapperSync.idjs`** (no `async` token)
- Screen frozen ~5 s. Then all log lines appear at once — including the two timestamps that are 5 s apart.
- ⇒ sync mode = zero repaints mid-run, one repaint when the returned promise fully settles. `enableRedraw` not even involved.

**Run `wrapperAsync.idjs`** (uncalled `async function dummy(){}`)
- First 3 lines paint immediately (`start`, `drain installed`, `sync body done`) → 5 s frozen → last 2 lines paint (`deferred work RAN`, `deinit drain resolved`).
- ⇒ async mode = host returns to its idle loop on every `await`; repaint follows the `await` points. The 5 s gap lands exactly on `await crdtuxp.deinit()` waiting on the timer.

**★ Why this repro is good**
- Wall-clock ~same (~5 s, timer-bound) in both → isolates **repaint cadence** from **speed**. Mandelbrot (below) shows the speed cost; this shows the mechanism.
- One uncalled `async function` flips it. Same nested module, same `await`s. Proves: trigger = top-level source token, not runtime behavior.

### 2b. The cost — Mandelbrot

**Setup**
- Briefly: Mandelbrot, `numPixels²` rectangles, thousands of DOM ops. Script sets `app.scriptPreferences.enableRedraw = false`.
- In UDT, show line 1: `(async function (exports, require, module, __filename, __dirname) {` — **injected by InDesign**, file on disk starts with `// Copyright`.

**Demo**
- Run from Scripts Panel with **no** `async` token in the top file (comments fine now). ~1 s on my machine. No redraw during run. Honors "don't redraw".
- Uncomment `async function dummy() {}` (line 8). Never called. Run again. ~10× slower, redraws constantly.

**★ Working theory (present as empirical, not documented Adobe behavior)**
- InDesign does a **static source scan of the top `.idjs`** for real `async` syntax. Uncalled `async function dummy(){}` triggers it. Comments used to (substring bug), now fixed. Debugger/UDT always runs async mode.
- Nested async doesn't matter: `InDesignBrot_main.js` `main` is `async` + full of `await`, runs fast in the fast case. Show it.
- Returning a Promise from a plain `function` is fine — the runner awaits a returned thenable in **both** modes. `InDesignBrot.idjs` `main` is a plain `function` building a `Promise` chain + `.then(crdtuxp.finalize)`.
- **Two separate things, keep distinct:** (a) fast vs slow = presence of `async`/`await` token in the top file; (b) the drain is crash-safety, not speed.

**★ Why slow / why redraw (the mechanism)**
- Not JS. UXP/JS has no API to force an InDesign redraw. It's the host calling code.
- Sync path: host runs the script as one blocking call, one scripting transaction, pumps only the job queue to settle the returned promise. `enableRedraw=false` holds. One repaint at end.
- Async path: host flagged it async, drives it through the **full app event loop** — returns to its idle loop on every `await` continuation. Idle loop does redraw / screen composite. Cost ≈ (spread recompose + composite) × number of yield points. That's the whole slowdown.
- `enableRedraw = false` is effectively bypassed in async mode: redraw is driven by the idle pump between continuations, not by the scripting pref.
- Likely Adobe rationale: top-level `async` assumed to mean long I/O (`showModal`, file, network) → keep UI responsive. Sync assumed short → run blocking. Detection is cheap + syntactic, so it over-triggers a compute loop.

**Confirming experiments (optional, if time)**
- Uncalled `dummy` with zero awaits → still slow ⇒ syntactic trigger.
- Scaling: async penalty scales with `numPixels²` ⇒ per-yield interleaving, not fixed startup cost.
- The bridge (Part 3) = the control: same file, no top-level `async`, fast.

**Mention**
- Can strip the injected async wrapper by faking a closing `}` and re-opening a new wrapper — http://coppieters.nz/injecting-uxpscript-wrapper/ . Fragile, build-dependent, breaks UDT debugging.

**★ Gotcha (now fixed in `InDesignBrot_main.js`)**
- `configureInDesign` saves the prior `enableRedraw` and returns it; `main` restores it after the `do/while`. Without this, a fast run left a blank/stale spread — the elapsed-time `crdtuxp.alert` modal was what forced the repaint you normally saw. Suppress the dialog (bridge/panel do) and the old code left the screen stale until scroll/zoom/window-activate.
- Nuance still worth saying: the restore only cures the **stale screen after a fast run**. In slow/async mode the host re-enables redraw between every `await`, so restoring at the end does nothing about the mid-run redraw storm.

---

## 3. Three ways to run InDesignBrot

- **(a) Scripts Panel, standalone `.idjs`** — `IS_STANDALONE_SCRIPT` true. Plain UXPScript. Fast.
- **(b) UXP panel, direct** — `uxp-panel/main.js` `runDirectInPanel` requires `InDesignBrot_main.js` in the panel engine. Panel UXP engine is always event-loop / async → always slow + redraw.
- **(c) UXP panel → bridge → UXPScript** — `runViaUXPScript` → `crdtuxpIDSN.doUXPScriptFile` → `app.doScript(runnerPath, ScriptLanguage.UXPSCRIPT)`. Launches `InDesignBrot.idjs` (no top-level `async`) in a fresh engine. Fast compute.

**Bridge data channel**
- Cross-engine transport = **app script labels** (`crdtuxpIDSN.setAppLabel` = `app.insertLabel`/`extractLabel`) + bridge-state labels.
- Payload passed = a **file path**, not the data (`getBridgePayload` → `runPayload(filePath)`).
- Result (elapsed seconds) written to a label; panel **polls** it (`waitForBridgeResult`). Async handshake, not a return value.

---

## 4. Undo intricacy (UXP regression vs ExtendScript)

- Async vs sync run: **same number of undo steps** (same model ops). Not a transaction-count difference.
- Sync run + `enableRedraw=false`: view invalidation suppressed. Single-step undo, even waiting seconds, **does not repaint**. Model correct, screen stale until global refresh.
- Async run: view is live, each undo repaints.
- **★ `app.doScript(..., UndoModes.ENTIRE_SCRIPT, "name")`** — the classic ExtendScript "collapse to one undo step" idiom. UXP appears to **ignore** `undoMode`/`undoName` (async execution model = no single begin/end transaction bracket). Repo passes only 2 args.
  - Quick test if asked: sync payload, 3 rects, via doScript with ENTIRE_SCRIPT → count undo steps. 1 = honored for sync payloads; 3 = ignored.
  - No API to merge existing undo steps. `FAST_ENTIRE_SCRIPT` may suppress recording entirely (fast, nothing undoable).
- Slide-worthy: UXP's async-capable model broke a standard automation idiom.

---

## 5. Recovery moves (if live demo misbehaves)

- Crash demo won't crash: switch `wait.idjs` to `USE_TIMEOUT=false` (setImmediate), run 3–4×. Or reduce other load.
- Screen stale after fast run: scroll / zoom / `doc.recompose()` in console.
- Slowdown not obvious: increase `numPixels` in the doc INI (e.g. 41) to widen the gap.
- Numbers: always say "on this machine, this doc size" — ~1 s vs ~10×.

---

## 6. One-line summary for the audience

- UXPScript ≈ fast, synchronous, single-transaction — **as long as the top file has no `async`/`await` token**.
- Add one `async` anywhere at top level → InDesign drives the script through its event loop → constant redraw, ~10× slower, `enableRedraw` ignored.
- Promises are fine. `async` keyword in the launcher is not.
- CRDT_UXP hides all the async behind proxy promises + a drain, so the launcher stays a plain sync `function` and pending work can't crash the torn-down engine.

# Monthly Config Guide

## The only file you need to edit: `config.js`

At the start of each month, open `config.js` in the repo root and update the numbers below. Then `git push` — the dashboard updates live.

---

## What each setting does

### Targets

```js
monthlyTarget:  300,   // KYCs each agent needs for full payout
gate:           225,   // minimum KYCs before any payout releases at all
teamTarget:     1800,  // team floor (bottom of the progress bar range)
teamTargetAim:  2400,  // team stretch goal (mid bar)
teamTargetMax:  3400,  // team moonshot — 100% on the bar = this number
sprintRate:      17,   // KYCs/day used to project "max possible earnings"
```

- **gate** is the hard unlock threshold. Agents below this show ₹0 payout regardless of slab.
- **teamTargetMax** controls the visual progress bar — set it to whatever "full bar" should look like.
- **sprintRate** is only used for the projected max earnings shown on each agent card. It assumes the agent hits this many KYCs every remaining day of the month.

### Special Monthly Challenges

All three right-column cards are challenges. The eyebrow tag on each card is configurable — by default all three say `special challenge`, but you can give each a different label if you want (e.g. `'flash challenge'`, `'team challenge'`).

#### Challenge 1 — blue card (milestone race)

```js
challenge1Eyebrow:   'special challenge',   // tag shown at top of card
incentivePrizeAt:    200,                   // KYC count to win
incentivePrizeLabel: 'win the led panda 🐼',
incentivePrizeDesc:  'first agent to hit 200 kycs takes the trophy home',
```

#### Challenge 2 — purple card (fastest to target)

```js
challenge2Eyebrow:   'special challenge',
mysteryATitle:       '🎁 fastest to 300 kycs',
mysteryADesc:        'first agent to close 300 kycs this month wins a prize',
// mysteryATarget: 350,  // uncomment if the finish line differs from monthlyTarget
```

- `mysteryATarget` is optional — omit it and it uses `monthlyTarget`.

#### Challenge 3 — green card (best single day)

```js
challenge3Eyebrow:   'special challenge',
mysteryBTitle:       '🎁 best day on the floor',
mysteryBDesc:        'most kycs completed in a single working day this month',
mysteryBNote:        'record resets each month · prize announced end of month',
```

This card always tracks whoever holds the highest single-day KYC record. Update any field mid-month to reveal the prize once announced.

---

## Payout Slabs

```js
window.TRACKER_SLABS = [
  { min: 17, rate: 120, label: '17+' },
  { min: 15, rate: 100, label: '15–16' },
  ...
];
```

Each slab says: **if an agent does ≥ `min` KYCs on a given day, they earn `rate` rupees per KYC for that entire day.**

Rules:
- **Order matters** — keep highest `min` first. The first matching slab wins.
- **`rate` is per-KYC**, not a flat amount. 17 KYCs at ₹120/KYC = ₹2,040 for that day.
- To add a new tier: insert a new `{ min, rate, label }` line in the right position.
- To remove a tier: delete the line.
- The `label` is display-only (shown in the slab reference table on the dashboard).

### Example: adding a ₹150 tier for 20+ KYCs

```js
window.TRACKER_SLABS = [
  { min: 20, rate: 150, label: '20+' },   // ← new tier
  { min: 17, rate: 120, label: '17–19' }, // ← update label
  { min: 15, rate: 100, label: '15–16' },
  ...
];
```

---

## Month-end checklist

1. Open `config.js`
2. Update targets, gate, and incentive/mystery prize fields if changed
3. Update slabs if the payout structure changed
4. Save the file
5. Run: `git add config.js && git commit -m "config: july targets" && git push`
6. Vercel auto-deploys in ~30 seconds

> **Note:** `monthDays` (calendar days in the month) and `totalWorkingDays` are computed automatically from the dates in the Google Sheet — you don't need to set them.

---

## What auto-updates from the sheet (no config change needed)

- The current month and year label
- Working days elapsed / remaining
- Each agent's KYC count, daily earnings, pace
- "As of" date shown at the top

These are all derived from the live Google Sheet data.

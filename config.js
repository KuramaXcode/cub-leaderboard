/* =============================================================
   CUB TELESALES LEADERBOARD — MONTHLY CONFIG
   Edit this file at the start of each month, then git push.
   No other file needs to change.
   ============================================================= */

window.TRACKER_CONFIG = {

  /* ── TARGETS ──────────────────────────────────────────────── */
  monthlyTarget:  300,   // KYCs each agent must hit for full payout
  gate:           225,   // minimum KYCs before ANY payout releases
  teamTarget:     1800,  // team floor target (shown on progress bar)
  teamTargetAim:  2400,  // team aim / stretch target
  teamTargetMax:  3400,  // team max / moonshot (100% bar = this)
  sprintRate:      17,   // KYCs/day assumed for "max possible" projection

  /* ── SPECIAL MONTHLY CHALLENGES ──────────────────────────── */
  // Challenge 1 — blue card (e.g. LED Panda, first to hit a KYC milestone)
  challenge1Eyebrow:   'special challenge',
  incentivePrizeAt:    200,
  incentivePrizeLabel: 'win the led panda 🐼',
  incentivePrizeDesc:  'first agent to hit 200 kycs takes the trophy home',

  // Challenge 2 — purple card (fastest to monthly target)
  challenge2Eyebrow:   'special challenge',
  mysteryATitle:       '🎁 fastest to 300 kycs',
  mysteryADesc:        'first agent to close 300 kycs this month wins a prize',
  // mysteryATarget defaults to monthlyTarget above — set only if different

  // Challenge 3 — green card (best single day)
  challenge3Eyebrow:   'special challenge',
  mysteryBTitle:       '🎁 best day on the floor',
  mysteryBDesc:        'most kycs completed in a single working day this month',
  mysteryBNote:        'record resets each month · prize announced end of month',

};

/* ── PAYOUT SLABS ─────────────────────────────────────────────
   Rate is ₹ per KYC earned on days where daily count >= min.
   Order matters: first match wins (highest min first).
   ─────────────────────────────────────────────────────────── */
window.TRACKER_SLABS = [
  { min: 17, rate: 120, label: '17+' },
  { min: 15, rate: 100, label: '15–16' },
  { min: 12, rate:  80, label: '12–14' },
  { min: 11, rate:  60, label: '11' },
  { min: 10, rate:  50, label: '10' },
  { min:  9, rate:  40, label: '9' },
  { min:  0, rate:   0, label: '<9' },
];

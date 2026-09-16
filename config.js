/* =============================================================
   CUB TELESALES LEADERBOARD — MONTHLY CONFIG
   Edit this file at the start of each month, then git push.
   No other file needs to change.
   ============================================================= */

window.TRACKER_CONFIG = {

  /* ── TARGETS ──────────────────────────────────────────────── */
  monthlyTarget:  200,   // KYCs each agent must hit for full payout
  gate:           160,   // minimum KYCs before ANY payout releases
  teamTarget:     2000,  // team floor target (shown on progress bar)
  teamTargetAim:  2400,  // team aim / stretch target
  teamTargetMax:  3200,  // team max / moonshot (100% bar = this)
  sprintRate:      11,   // KYCs/day assumed for "max possible" projection

  /* ── SPECIAL MONTHLY CHALLENGES ──────────────────────────── */
  // Challenge 1 — blue card (e.g. LED Panda, first to hit a KYC milestone)
  challenge1Eyebrow:   'special challenge',
  incentivePrizeAt:    160,
  incentivePrizeLabel: 'win the led panda 🐼',
  incentivePrizeDesc:  'first agent to hit 160 kycs takes the trophy home',

  // Challenge 2 — purple card (fastest to monthly target)
  challenge2Eyebrow:   'special challenge',
  mysteryATitle:       '🎁 fastest to 200 kycs',
  mysteryADesc:        'first agent to close 200 kycs this month wins a prize',
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
  { min: 12, rate: 120, label: '12+' },
  { min: 11, rate: 100, label: '11' },
  { min:  9, rate:  80, label: '9–10' },
  { min:  8, rate:  60, label: '8' },
  { min:  7, rate:  50, label: '7' },
  { min:  6, rate:  40, label: '6' },
  { min:  0, rate:   0, label: '0–5' },
];

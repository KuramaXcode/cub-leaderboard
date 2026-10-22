/* =============================================================
   CUB TELESALES LEADERBOARD — MONTHLY CONFIG
   Edit this file at the start of each month, then git push.
   No other file needs to change.
   ============================================================= */

window.TRACKER_CONFIG = {

  /* ── TARGETS ──────────────────────────────────────────────── */
  monthlyTarget:  220,   // KYCs each agent must hit for full payout
  gate:           220,   // default gate (per-group gates live in TRACKER_GROUPS)
  teamTarget:     3300,  // team floor target (shown on progress bar)
  teamTargetAim:  3700,  // team aim / stretch target
  teamTargetMax:  4000,  // team max / moonshot (100% bar = this)

  /* ── SPECIAL MONTHLY CHALLENGES ──────────────────────────── */
  // Challenge 1 — blue card (e.g. LED Panda, first to hit a KYC milestone)
  challenge1Eyebrow:   'special challenge',
  incentivePrizeAt:    220,
  incentivePrizeLabel: 'win the led panda 🐼',
  incentivePrizeDesc:  'first agent to hit 220 kycs takes the trophy home',

  // Challenge 2 — purple card (fastest to monthly target)
  challenge2Eyebrow:   'special challenge',
  mysteryATitle:       '🎁 fastest to 280 kycs',
  mysteryADesc:        'first agent to close 280 kycs this month wins a prize',
  mysteryATarget:      280,   // differs from monthlyTarget (220)

  // Challenge 3 — green card (best single day)
  challenge3Eyebrow:   'special challenge',
  mysteryBTitle:       '🎁 best day on the floor',
  mysteryBDesc:        'most kycs completed in a single working day this month',
  mysteryBNote:        'record resets each month · prize announced end of month',

};

/* ── PAYOUT GROUPS ───────────────────────────────────────────
   Each group has its own monthly gate and daily rate ladder.
   Rate is ₹ per KYC earned on days where daily count >= min.
   Order matters: first match wins (highest min first).
   The FIRST group is the default for any agent not listed in a
   group's `members` (matched case-insensitively on the sheet's RM name).
   ─────────────────────────────────────────────────────────── */
window.TRACKER_GROUPS = [
  {
    id: 'mg220', gate: 220,
    members: ['Anjali Bharti', 'Antara', 'Fiza', 'Hanok', 'Khushboo', 'Kunal Kumar', 'Mayank',
              'Pratikshya', 'Rishabh Kumar', 'Sanjana', 'Sonali', 'Yashveer Singh', 'Satyam'],
    slabs: [
      { min: 15, rate: 125, label: '15+' },
      { min: 14, rate: 105, label: '14' },
      { min: 12, rate:  85, label: '12–13' },
      { min: 11, rate:  65, label: '11' },
      { min: 10, rate:  55, label: '10' },
      { min:  9, rate:  45, label: '9' },
      { min:  0, rate:   0, label: '0–8' },
    ],
  },
  {
    id: 'mg170', gate: 170,
    members: ['Arpit', 'Nikhil', 'Anoj', 'Divya'],
    slabs: [
      { min: 13, rate: 125, label: '13+' },
      { min: 12, rate: 105, label: '12' },
      { min: 10, rate:  85, label: '10–11' },
      { min:  9, rate:  65, label: '9' },
      { min:  8, rate:  55, label: '8' },
      { min:  7, rate:  45, label: '7' },
      { min:  0, rate:   0, label: '0–6' },
    ],
  },
];

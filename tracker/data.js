/* CUB TeleSales Performance Tracker — data model.
   Parses the CSV (first 5 cols: Date, Phone, vKYC Status, RM, Card).
   Each row = one conversion. Working days = unique dates per agent.

   EARNINGS LOGIC — daily rate, not monthly average:
     Each day, an agent's KYC count for that day determines their rate tier.
     Earnings = Σ(dayRate × dayKyc) across all working days.
     This is the "daily payout" model confirmed by the PNL tracker.

   DAYS REMAINING — calendar-based, 6-of-7 roster:
     calendarDaysLeft = 30 − today (or month-end date).
     workingDaysLeft  = floor(calendarDaysLeft × 6/7).                     */
(function () {

  const CONFIG = {
    monthlyTarget: 300,
    teamTarget: 1800,
    teamTargetAim: 2400,
    teamTargetMax: 3400,
    gate: 225,
    totalWorkingDays: 25,    // June: floor(30 × 6/7) = 25
    sprintRate: 17,
    monthDays: 30,           // calendar days in June
    incentivePrizeAt: 200,
    incentivePrizeLabel: 'win the led panda 🐼',
    incentivePrizeDesc: 'first agent to hit 200 kycs takes the trophy home',
  };

  const SLABS = [
    { min: 17, rate: 120, label: '17+' },
    { min: 15, rate: 100, label: '15–16' },
    { min: 12, rate: 80,  label: '12–14' },
    { min: 11, rate: 60,  label: '11' },
    { min: 10, rate: 50,  label: '10' },
    { min: 9,  rate: 40,  label: '9' },
    { min: 0,  rate: 0,   label: '<9' },
  ];

  const TIER_BOUNDARIES = [9, 10, 11, 12, 15, 17];

  function rateForDay(kyc) {
    const n = Math.floor(kyc + 1e-9);
    for (const s of SLABS) if (n >= s.min) return s.rate;
    return 0;
  }
  function rateForAvg(avg) {
    return rateForDay(avg);
  }
  function slabForAvg(avg) {
    const a = Math.floor(avg + 1e-9);
    for (const s of SLABS) if (a >= s.min) return s;
    return SLABS[SLABS.length - 1];
  }

  function inr(n) {
    return '₹' + Math.round(n).toLocaleString('en-IN');
  }
  function inrPlain(n) {
    return Math.round(n).toLocaleString('en-IN');
  }

  /* Remaining working days from today to month end (6-of-7 roster). */
  function calcRemainingDays() {
    const now = new Date();
    // If we're in a different month, default to 0
    const dayOfMonth = now.getDate();
    const calendarLeft = Math.max(0, CONFIG.monthDays - dayOfMonth);
    const workingLeft = Math.floor(calendarLeft * 6 / 7);
    return { calendarDaysLeft: calendarLeft, workingDaysLeft: workingLeft };
  }

  /* Parse CSV text → RAW agent array for the most recent month.
     Each row = one conversion. Only first 5 cols used:
       0=Date, 1=Phone, 2=vKYC Status, 3=RM, 4=Card

     Returns { raw, monthLabel, asOf, calendarDaysLeft, workingDaysLeft }
     where each raw entry has: { name, kyc, days, dailyEarnings }           */
  function parseCSV(text) {
    const lines = text.split(/\r?\n/);
    const rows = lines.slice(1).filter(l => l.trim().length > 0);

    const MONTHS_ORDER = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    function parseDate(d) {
      const m = d.trim().match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/);
      if (!m) return null;
      return { day: parseInt(m[1]), mon: m[2], year: parseInt(m[3]),
               month: m[2] + '-' + m[3], dateStr: d.trim() };
    }

    // Build: monthMap[month][agentName] = { kyc, dates: Set, dailyKycs: {dateStr: count} }
    const monthMap = {};

    for (const line of rows) {
      const cols = line.split(',');
      if (cols.length < 5) continue;
      const dateStr = cols[0].trim();
      const rm = cols[3].trim();
      if (!dateStr || !rm) continue;

      const parsed = parseDate(dateStr);
      if (!parsed) continue;

      const { month, dateStr: ds } = parsed;
      if (!monthMap[month]) monthMap[month] = {};
      if (!monthMap[month][rm]) monthMap[month][rm] = { kyc: 0, dates: new Set(), dailyKycs: {} };
      monthMap[month][rm].kyc++;
      monthMap[month][rm].dates.add(ds);
      monthMap[month][rm].dailyKycs[ds] = (monthMap[month][rm].dailyKycs[ds] || 0) + 1;
    }

    const months = Object.keys(monthMap).sort((a, b) => {
      const [ma, ya] = a.split('-'); const [mb, yb] = b.split('-');
      const ya2 = parseInt(ya), yb2 = parseInt(yb);
      if (ya2 !== yb2) return ya2 - yb2;
      return MONTHS_ORDER.indexOf(ma) - MONTHS_ORDER.indexOf(mb);
    });

    if (!months.length) return { raw: [], monthLabel: 'unknown', asOf: '', calendarDaysLeft: 0, workingDaysLeft: 0 };

    const latestMonth = months[months.length - 1];
    const agentData = monthMap[latestMonth];
    const [mon, yr] = latestMonth.split('-');

    // Compute daily earnings + best single day per agent
    const raw = Object.entries(agentData).map(([name, d]) => {
      let dailyEarnings = 0;
      let bestDayKyc = 0;
      for (const kyc of Object.values(d.dailyKycs)) {
        dailyEarnings += rateForDay(kyc) * kyc;
        if (kyc > bestDayKyc) bestDayKyc = kyc;
      }
      return { name, kyc: d.kyc, days: d.dates.size, dailyEarnings, bestDayKyc };
    }).sort((a, b) => b.kyc - a.kyc);

    // Month label
    const MONTH_NAMES = {
      Jan:'january', Feb:'february', Mar:'march', Apr:'april',
      May:'may', Jun:'june', Jul:'july', Aug:'august',
      Sep:'september', Oct:'october', Nov:'november', Dec:'december'
    };
    const monthLabel = (MONTH_NAMES[mon] || mon.toLowerCase()) + ' ' + yr;

    // Latest data date → "as of" label
    const allDates = Object.values(agentData).flatMap(d => [...d.dates]);
    allDates.sort((a, b) => {
      const pa = a.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/);
      const pb = b.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/);
      if (!pa || !pb) return 0;
      const ya = parseInt(pa[3]), yb = parseInt(pb[3]);
      if (ya !== yb) return ya - yb;
      const mi = MONTHS_ORDER.indexOf(pa[2]), mj = MONTHS_ORDER.indexOf(pb[2]);
      if (mi !== mj) return mi - mj;
      return parseInt(pa[1]) - parseInt(pb[1]);
    });
    const lastDate = allDates[allDates.length - 1] || '';
    const asOf = lastDate ? lastDate.replace(/-\d{4}$/, '') : '';

    // Update monthDays for the detected month (June=30, others vary)
    const MONTH_DAYS = { Jan:31, Feb:28, Mar:31, Apr:30, May:31, Jun:30, Jul:31, Aug:31, Sep:30, Oct:31, Nov:30, Dec:31 };
    CONFIG.monthDays = MONTH_DAYS[mon] || 30;
    CONFIG.totalWorkingDays = Math.floor(CONFIG.monthDays * 6 / 7);

    const { calendarDaysLeft, workingDaysLeft } = calcRemainingDays();

    return { raw, monthLabel, asOf, calendarDaysLeft, workingDaysLeft };
  }

  /* derive() builds the full agent model from raw input.
     workingDaysLeft — remaining working days in the month (calendar-based).
     If not provided, falls back to CONFIG-based calculation.               */
  function derive(rawInput, workingDaysLeft) {
    const raw = rawInput || [];
    const leaderKyc = raw.length ? Math.max(...raw.map(a => a.kyc)) : 0;

    // Use passed remaining days, or compute from today
    const remDays = workingDaysLeft !== undefined
      ? workingDaysLeft
      : calcRemainingDays().workingDaysLeft;

    const agents = raw.map((a, i) => {
      const avg = a.days > 0 ? a.kyc / a.days : 0;
      const slab = slabForAvg(avg);

      // DAILY EARNINGS: pre-computed in parseCSV; use if available, else fall back
      const earnings = a.dailyEarnings !== undefined ? a.dailyEarnings : slab.rate * a.kyc;
      const unlocked = a.kyc >= CONFIG.gate;

      // Projected MAX if sprinting at 17/day for remaining days (17 → ₹120/kyc daily)
      const projSprintEarnings = 17 * 120 * remDays;
      const projEarnings = earnings + projSprintEarnings;
      const projKyc = a.kyc + CONFIG.sprintRate * remDays;

      const reqForTarget = remDays > 0 ? (CONFIG.monthlyTarget - a.kyc) / remDays : 0;
      const reqForGate   = remDays > 0 ? Math.max(0, (CONFIG.gate - a.kyc) / remDays) : 0;

      // Next earning tier nudge: what daily rate would push them to the next tier?
      let nextTier = null;
      for (const boundary of TIER_BOUNDARIES) {
        if (boundary > Math.floor(avg + 1e-9)) {
          nextTier = { avg: boundary, rate: rateForAvg(boundary) };
          break;
        }
      }

      let status = 'ontrack';
      if (reqForTarget > avg + 3) status = 'behind';
      if (reqForTarget > CONFIG.sprintRate) status = 'urgent';

      return {
        id: 'a' + i, name: a.name, kyc: a.kyc, days: a.days,
        avg, slab, earnings, unlocked, remDays,
        projKyc, projEarnings,
        reqForTarget, reqForGate, nextTier, status,
        bestDayKyc: a.bestDayKyc || 0,
        gapToLeader: leaderKyc - a.kyc,
        toGate: Math.max(0, CONFIG.gate - a.kyc),
        toTarget: Math.max(0, CONFIG.monthlyTarget - a.kyc),
      };
    });

    agents.sort((x, y) => y.kyc - x.kyc);
    agents.forEach((a, i) => { a.rank = i + 1; });

    const totalKyc = agents.reduce((s, a) => s + a.kyc, 0);
    const team = {
      totalKyc,
      target: CONFIG.teamTarget,
      targetAim: CONFIG.teamTargetAim,
      targetMax: CONFIG.teamTargetMax,
      pct: totalKyc / CONFIG.teamTargetMax,
      pctMin: totalKyc / CONFIG.teamTarget,
      pctAim: totalKyc / CONFIG.teamTargetAim,
      remDays,
      kycNeeded: Math.max(0, CONFIG.teamTarget - totalKyc),
      kycToAim: Math.max(0, CONFIG.teamTargetAim - totalKyc),
      kycToMax: Math.max(0, CONFIG.teamTargetMax - totalKyc),
      crossedGate: agents.filter(a => a.unlocked).length,
      perAgentPace: remDays > 0 && agents.length > 0
        ? (CONFIG.teamTargetAim - totalKyc) / remDays / agents.length
        : 0,
    };

    const paceKing = [...agents].sort((a, b) => b.avg - a.avg)[0] || agents[0];
    const bestDayAgent = [...agents].sort((a, b) => b.bestDayKyc - a.bestDayKyc)[0] || agents[0];
    const closestUnlock = [...agents]
      .filter(a => !a.unlocked)
      .sort((a, b) => a.toGate - b.toGate)[0]
      || [...agents].sort((a, b) => a.toGate - b.toGate)[0]
      || agents[0];

    return { agents, team, paceKing, closestUnlock, bestDayAgent };
  }

  window.TRACKER = { CONFIG, SLABS, parseCSV, derive, rateForDay, rateForAvg, slabForAvg, inr, inrPlain, calcRemainingDays };

})();

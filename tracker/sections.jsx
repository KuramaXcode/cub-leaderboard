// CUB TeleSales Tracker — TeamStrip, Leaderboard, UnlockRace (with side quests)
const { useState, useEffect, useRef } = React;
const T = window.TRACKER;

// ── shared atoms ──────────────────────────────────────────────────
function CountUp({ value, fmt, className, style }) {
  const [disp, setDisp] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const from = prev.current, to = value;
    if (from === to) { setDisp(to); return; }
    const dur = 700, t0 = performance.now();
    let raf;
    const tick = now => {
      const k = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      setDisp(from + (to - from) * e);
      if (k < 1) raf = requestAnimationFrame(tick);
      else prev.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  const out = fmt ? fmt(disp) : Math.round(disp).toLocaleString('en-IN');
  return <span className={className} style={style}>{out}</span>;
}

function rankColor(rank) {
  if (rank === 1) return 'var(--ss-yellow-1)';
  if (rank === 2) return 'var(--ss-blue-1)';
  if (rank === 3) return 'var(--ss-purple-1)';
  return 'var(--ss-white-50)';
}

const Lock = ({ s = 18, c = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.2" /><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
  </svg>
);
const Bolt = ({ s = 18, c = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={c} stroke="none"><path d="M13 2 4 13h6l-1 9 9-12h-6l1-8z" /></svg>
);
const Crown = ({ s = 20, c = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={c} stroke="none"><path d="M3 7l4 4 5-7 5 7 4-4-2 13H5L3 7z" /></svg>
);
const Trophy = ({ s = 22, c = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 4h10v5a5 5 0 0 1-10 0V4z" /><path d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3" /><path d="M10 16h4M9 20h6M12 16v4" />
  </svg>
);
const Star = ({ s = 16, c = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={c} stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
);

// ── 1. TEAM OVERVIEW STRIP ────────────────────────────────────────
function TeamStrip({ team, accent, live, monthLabel, asOf, calendarDaysLeft }) {
  const acc = accent === 'yellow' ? 'var(--ss-yellow-1)' : 'var(--ss-blue-4)';
  const accGlow = accent === 'yellow' ? 'var(--shadow-glow-yellow)' : 'var(--shadow-glow-blue)';
  const pct = Math.round(team.pct * 100);

  const Stat = ({ label, children, sub }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: 20, borderLeft: '1px solid var(--border-faint)', whiteSpace: 'nowrap' }}>
      <div style={{ fontSize: 12, letterSpacing: '0.08em', color: 'var(--fg-muted)', textTransform: 'lowercase' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>{children}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{sub}</div>}
    </div>
  );

  return (
    <header style={{
      display: 'flex', alignItems: 'center', gap: 24, padding: '0 28px', height: 100,
      background: 'linear-gradient(90deg, rgba(61,65,250,0.18), rgba(61,65,250,0.02) 60%, transparent)',
      border: '1px solid var(--border-faint)', borderRadius: 18, flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 300 }}>
        <img src="assets/ss-logomark.svg" alt="" style={{ width: 46, height: 46 }} />
        <div>
          <div style={{ fontWeight: 900, fontSize: 22, letterSpacing: '-0.02em', lineHeight: '24px' }}>team alpha</div>
          <div style={{ fontSize: 13, color: 'var(--ss-yellow-1)', fontWeight: 900, letterSpacing: '0.02em' }}>performance tracker</div>
          <div style={{ fontSize: 11, color: 'var(--fg-muted)', letterSpacing: '0.02em' }}>cub credit card · kyc</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 340 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
          <CountUp value={team.totalKyc} className="num" style={{ fontWeight: 900, fontSize: 38, letterSpacing: '-0.03em' }} />
          <span style={{ fontSize: 13, color: 'var(--fg-muted)', fontWeight: 900 }}>kycs</span>
          <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>·</span>
          <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>floor <span className="num" style={{ color: 'var(--fg-secondary)', fontWeight: 900 }}>1,800</span></span>
          <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>·</span>
          <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>aim <span className="num" style={{ color: acc, fontWeight: 900 }}>2,400</span></span>
          <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>·</span>
          <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>max <span className="num" style={{ color: 'var(--ss-yellow-1)', fontWeight: 900 }}>3,400</span></span>
        </div>
        <div style={{ height: 10, borderRadius: 99, background: 'var(--ss-white-10)', overflow: 'visible', position: 'relative', marginTop: 4 }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: Math.min(100, team.pct * 100) + '%', background: acc, borderRadius: 99, boxShadow: accGlow, transition: 'width 700ms var(--ease-out)' }} />
          {/* 1800 milestone marker */}
          <div style={{ position: 'absolute', left: (1800/3400*100) + '%', top: -4, bottom: -4, width: 2, background: 'rgba(255,255,255,0.3)', transform: 'translateX(-1px)' }} />
          {/* 2400 milestone marker */}
          <div style={{ position: 'absolute', left: (2400/3400*100) + '%', top: -5, bottom: -5, width: 2, background: acc, opacity: 0.7, transform: 'translateX(-1px)' }} />
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 2 }}>
          <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>
            <span className="num" style={{ color: team.kycNeeded === 0 ? 'var(--ss-green-3)' : 'var(--fg-secondary)', fontWeight: 900 }}>{team.kycNeeded > 0 ? team.kycNeeded + ' to floor' : '✓ floor hit'}</span>
          </span>
          <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>·
            <span className="num" style={{ color: acc, fontWeight: 900 }}> {team.kycToAim} to aim</span>
          </span>
          <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>·
            <span className="num" style={{ color: 'var(--ss-yellow-1)', fontWeight: 900 }}> {team.kycToMax} to max</span>
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 18, alignItems: 'center', flexShrink: 0 }}>
        <Stat label="days left" sub="till 30 june">
          <span className="num" style={{ fontWeight: 900, fontSize: 30, letterSpacing: '-0.02em' }}>{calendarDaysLeft}</span>
        </Stat>
        <Stat label="to aim (2400)" sub="team kycs needed">
          <CountUp value={team.kycToAim} className="num" style={{ fontWeight: 900, fontSize: 30, letterSpacing: '-0.02em', color: acc }} />
        </Stat>
        <Stat label="pace needed" sub="per agent / day">
          <span className="num" style={{ fontWeight: 900, fontSize: 30, letterSpacing: '-0.02em', color: acc }}>{team.perAgentPace.toFixed(1)}</span>
        </Stat>
        <Stat label="unlocked" sub="crossed ₹ gate">
          <span className="num" style={{ fontWeight: 900, fontSize: 30, letterSpacing: '-0.02em' }}>{team.crossedGate}</span>
          <span style={{ fontSize: 14, color: 'var(--fg-muted)', fontWeight: 900 }}>/ 8</span>
        </Stat>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, paddingLeft: 20, borderLeft: '1px solid var(--border-faint)', whiteSpace: 'nowrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: 'var(--ss-green-3)', boxShadow: '0 0 10px var(--ss-green-3)', animation: live ? 'pulse 1.6s infinite' : 'none' }} />
            <span style={{ fontSize: 12, letterSpacing: '0.08em', color: 'var(--ss-green-1)' }}>live</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--fg-secondary)', letterSpacing: '0.04em' }}>{monthLabel} · {asOf}</div>
          <div style={{ fontSize: 10, color: 'var(--fg-muted)' }}>refreshes every 5 min</div>
        </div>
      </div>
    </header>
  );
}

// ── gate progress bar ─────────────────────────────────────────────
function GateBar({ a, accent, gateViz, rowDesign, height = 16 }) {
  const acc = accent === 'yellow' ? 'var(--ss-yellow-1)' : 'var(--ss-blue-4)';
  const accGlow = accent === 'yellow' ? '0 0 16px rgba(238,255,65,0.5)' : '0 0 16px rgba(61,65,250,0.6)';
  const max = T.CONFIG.monthlyTarget;
  const gatePct = (T.CONFIG.gate / max) * 100;
  const curPct = Math.min(100, (a.kyc / max) * 100);
  const unlocked = a.unlocked;
  const minimal = rowDesign === 'stat';

  let fill = acc, fillGlow = accGlow;
  if (gateViz === 'lock') {
    fill = unlocked ? 'var(--ss-green-4)' : 'var(--ss-grey)';
    fillGlow = unlocked ? '0 0 16px rgba(0,224,11,0.5)' : 'none';
  }

  return (
    <div style={{ position: 'relative', height, borderRadius: 99, background: 'var(--ss-white-10)', overflow: 'visible' }}>
      {gateViz === 'zones' && (
        <div style={{ position: 'absolute', left: gatePct + '%', right: 0, top: 0, bottom: 0, background: 'rgba(0,224,11,0.14)', borderRadius: '0 99px 99px 0' }} />
      )}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: curPct + '%', minWidth: curPct > 0 ? 6 : 0, background: fill, borderRadius: 99, boxShadow: fillGlow, transition: 'width 700ms var(--ease-out), background 300ms' }} />
      <div style={{ position: 'absolute', left: gatePct + '%', top: -5, bottom: -5, width: 2, background: unlocked ? 'var(--ss-green-3)' : 'var(--ss-yellow-1)', transform: 'translateX(-1px)', zIndex: 2 }} />
      {minimal ? (
        <div title="payout unlocks at 225 kycs" style={{ position: 'absolute', left: gatePct + '%', top: -14, transform: 'translateX(-50%)', zIndex: 3, color: unlocked ? 'var(--ss-green-3)' : 'var(--ss-yellow-1)' }}>
          <Lock s={10} />
        </div>
      ) : (
        <div title="payout unlocks at 225 kycs" style={{
          position: 'absolute', left: gatePct + '%', top: '50%', transform: 'translate(-50%,-50%)', zIndex: 3,
          width: 20, height: 20, borderRadius: 99, display: 'grid', placeItems: 'center',
          background: unlocked ? 'var(--ss-green-4)' : 'var(--ss-black)',
          border: `2px solid ${unlocked ? 'var(--ss-green-3)' : 'var(--ss-yellow-1)'}`,
          color: unlocked ? 'var(--ss-black)' : 'var(--ss-yellow-1)',
        }}>
          <Lock s={10} />
        </div>
      )}
    </div>
  );
}

// ── 2. AGENT LEADERBOARD ──────────────────────────────────────────
function Leaderboard({ agents, accent, gateViz, rowDesign, onHover, hovered }) {
  const ROW_H = 61;
  const GAP = 10;
  return (
    <section style={{ display: 'flex', flexDirection: 'column', flex: '1.62', minWidth: 0,
      background: 'var(--ss-white-10)', borderRadius: 18, border: '1px solid var(--border-faint)', padding: '14px 18px 10px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8, gap: 12, flexShrink: 0 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', whiteSpace: 'nowrap', flexShrink: 0 }}>live leaderboard</h2>
        <span style={{ fontSize: 12, color: 'var(--fg-muted)', letterSpacing: '0.04em', whiteSpace: 'nowrap', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>ranked by total kycs · gate at 225 · target 300</span>
        <div style={{ fontSize: 11, color: 'var(--fg-muted)', display: 'flex', gap: 16, flexShrink: 0, letterSpacing: '0.04em' }}>
          <span style={{ width: 230 }}>agent</span>
          <span style={{ flex: 1 }}>progress to 300</span>
          <span>earnings</span>
        </div>
      </div>
      <div style={{ position: 'relative', flex: 1 }}>
        {agents.map(a => (
          <AgentRow key={a.id} a={a} accent={accent} gateViz={gateViz} rowDesign={rowDesign}
            top={(a.rank - 1) * (ROW_H + GAP)} h={ROW_H}
            onHover={onHover} hovered={hovered === a.id} />
        ))}
      </div>
    </section>
  );
}

function AgentRow({ a, accent, gateViz, rowDesign, top, h, onHover, hovered }) {
  const acc = accent === 'yellow' ? 'var(--ss-yellow-1)' : 'var(--ss-blue-4)';
  const rc = rankColor(a.rank);
  const statusDot = a.status === 'urgent' ? 'var(--ss-blood)' : a.status === 'behind' ? 'var(--ss-orange-3)' : 'var(--ss-green-3)';

  return (
    <div
      onMouseEnter={() => onHover(a.id)} onMouseLeave={() => onHover(null)}
      style={{
        position: 'absolute', left: 0, right: 0, top, height: h,
        transition: 'top 650ms var(--ease-out)',
        display: 'grid', gridTemplateColumns: '46px 230px 1fr 210px', alignItems: 'center', gap: 14,
        padding: '0 12px', borderRadius: 12,
        background: hovered ? 'var(--ss-white-10)' : (a.rank === 1 ? 'rgba(238,255,65,0.06)' : 'transparent'),
        border: a.rank === 1 ? '1px solid rgba(238,255,65,0.22)' : '1px solid transparent',
        boxShadow: hovered ? '0 0 0 1px var(--border-subtle)' : 'none',
      }}>
      {/* rank */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {a.rank === 1
          ? <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: rc }}><Crown s={16} /><span className="num" style={{ fontWeight: 900, fontSize: 24, lineHeight: '22px', letterSpacing: '-0.04em' }}>1</span></div>
          : <span className="num" style={{ fontWeight: 900, fontSize: 28, color: rc, letterSpacing: '-0.04em' }}>{a.rank}</span>}
      </div>
      {/* name + pace */}
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ width: 6, height: 6, borderRadius: 99, background: statusDot, flexShrink: 0 }} />
          <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textTransform: 'lowercase' }}>{a.name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 3 }}>
          <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 3, padding: '2px 8px', borderRadius: 99, background: 'var(--ss-white-10)', border: '1px solid var(--border-faint)', whiteSpace: 'nowrap' }}>
            <span className="num" style={{ fontWeight: 900, fontSize: 14 }}>{a.avg.toFixed(1)}</span>
            <span style={{ fontSize: 10, color: 'var(--fg-muted)', letterSpacing: '0.04em' }}>avg/day</span>
          </span>
          {(() => {
            const tier80 = { avg: 12, rate: 80 };
            const target = a.slab.rate < 80 ? tier80 : a.nextTier;
            return target
              ? <span style={{ fontSize: 12, color: 'var(--fg-muted)', fontWeight: 900, whiteSpace: 'nowrap' }}>
                  aim <span className="num" style={{ color: 'var(--ss-yellow-1)' }}>{target.avg}</span>/day
                  {' → '}<span style={{ color: acc }}>{T.inr(target.rate)}/kyc</span>
                </span>
              : <span style={{ fontSize: 12, color: 'var(--ss-yellow-1)', fontWeight: 900, whiteSpace: 'nowrap' }}>
                  {T.inr(a.slab.rate)}/kyc · peak 🔥
                </span>;
          })()}
        </div>
      </div>
      {/* progress */}
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: rowDesign === 'stat' ? 4 : 6 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
            <CountUp value={a.kyc} className="num" style={{ fontWeight: 900, fontSize: rowDesign === 'stat' ? 34 : 26, letterSpacing: '-0.03em', lineHeight: 1 }} />
            <span style={{ fontSize: 12, color: 'var(--fg-muted)', fontWeight: 900 }}>kycs</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>
            {a.toGate > 0
              ? <span><span style={{ color: 'var(--ss-yellow-1)', fontWeight: 900 }} className="num">{a.toGate}</span> to unlock</span>
              : <span><span style={{ color: 'var(--ss-green-3)', fontWeight: 900 }} className="num">{a.toTarget}</span> to 300</span>}
          </div>
        </div>
        <GateBar a={a} accent={accent} gateViz={gateViz} rowDesign={rowDesign} height={rowDesign === 'stat' ? 7 : 14} />
      </div>
      {/* earnings — daily payout model */}
      <EarningsCell a={a} accent={accent} />
      {/* hover tooltip */}
      {hovered && a.nextTier && (
        <div style={{
          position: 'absolute', right: 224, top: '50%', transform: 'translateY(-50%)', zIndex: 20,
          display: 'flex', alignItems: 'center', gap: 7, padding: '6px 12px', borderRadius: 10,
          background: 'rgba(12,14,18,0.97)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-deep)',
          whiteSpace: 'nowrap', pointerEvents: 'none',
        }}>
          <Bolt s={13} c="var(--ss-yellow-1)" />
          <span style={{ fontSize: 12, color: 'var(--fg-secondary)' }}>next tier</span>
          <span className="num" style={{ fontSize: 13, fontWeight: 900, color: acc }}>{T.inr(a.nextTier.rate)}/kyc</span>
          <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>on days you hit</span>
          <span className="num" style={{ fontSize: 13, fontWeight: 900, color: 'var(--ss-yellow-1)' }}>{a.nextTier.avg}/day</span>
        </div>
      )}
    </div>
  );
}

function EarningsCell({ a, accent }) {
  const acc = accent === 'yellow' ? 'var(--ss-yellow-1)' : 'var(--ss-blue-4)';
  const projColor = a.unlocked ? acc : 'var(--ss-yellow-1)';
  if (a.unlocked) {
    return (
      <div style={{ textAlign: 'right' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 5 }}>
          <span style={{ fontSize: 10, letterSpacing: '0.08em', color: 'var(--ss-green-1)', textTransform: 'lowercase' }}>payable</span>
          <span style={{ width: 6, height: 6, borderRadius: 99, background: 'var(--ss-green-3)' }} />
        </div>
        <CountUp value={a.earnings} fmt={v => T.inr(v)} className="num" style={{ fontWeight: 900, fontSize: 27, letterSpacing: '-0.03em', color: 'var(--ss-green-3)' }} />
        <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 1 }}>max <span className="num" style={{ color: acc, fontWeight: 900 }}>{T.inr(a.projEarnings)}</span></div>
      </div>
    );
  }
  return (
    <div style={{ textAlign: 'right' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 5, color: 'var(--fg-muted)' }}>
        <Lock s={12} />
        <span style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'lowercase' }}>locked · earned so far</span>
      </div>
      <CountUp value={a.earnings} fmt={v => T.inr(v)} className="num" style={{ fontWeight: 900, fontSize: 27, letterSpacing: '-0.03em', color: 'var(--fg-secondary)' }} />
      <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 1 }}>max <span className="num" style={{ color: 'var(--ss-yellow-1)', fontWeight: 900 }}>{T.inr(a.projEarnings)}</span></div>
    </div>
  );
}

// ── 3. UNLOCK RACE + SIDE QUESTS (integrated) ─────────────────────
function UnlockRace({ agents, accent, data, extraQuests }) {
  const acc = accent === 'yellow' ? 'var(--ss-yellow-1)' : 'var(--ss-blue-4)';
  const max = T.CONFIG.gate;
  const ranked = [...agents].sort((a, b) => b.kyc - a.kyc);
  const unlockedCount = agents.filter(a => a.unlocked).length;

  // Built-in side quests
  const { paceKing, closestUnlock, team } = data;

  const QuestCard = ({ icon, tone, label, value, sub, isPlaceholder }) => (
    <div style={{
      flex: 1, background: isPlaceholder ? 'transparent' : 'var(--ss-white-10)',
      border: isPlaceholder ? '1px dashed rgba(255,255,255,0.15)' : '1px solid var(--border-faint)',
      borderRadius: 12, padding: '9px 11px', display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0,
    }}>
      {isPlaceholder ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 4, opacity: 0.3 }}>
          <Star s={14} c="var(--ss-white-50)" />
          <div style={{ fontSize: 10, color: 'var(--fg-muted)', textTransform: 'lowercase', letterSpacing: '0.06em' }}>coming soon</div>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: tone }}>
            {icon}<span style={{ fontSize: 10, letterSpacing: '0.06em', color: 'var(--fg-muted)', textTransform: 'lowercase' }}>{label}</span>
          </div>
          <div style={{ fontWeight: 900, fontSize: 16, letterSpacing: '-0.02em', textTransform: 'lowercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</div>
          <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{sub}</div>
        </>
      )}
    </div>
  );

  return (
    <section style={{ flex: '1.55', minWidth: 0, background: 'var(--ss-white-10)', borderRadius: 18, border: '1px solid var(--border-faint)', padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'nowrap', flexShrink: 0 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap', flexShrink: 0 }}>
          <Lock s={16} c="var(--ss-yellow-1)" /> unlock race
        </h2>
        <span style={{ fontSize: 12, color: 'var(--fg-muted)', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
          first to 225 turns on payout · {unlockedCount} of 8 unlocked
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 900, color: 'var(--ss-yellow-1)', whiteSpace: 'nowrap' }}>finish · 225</span>
      </div>

      {/* race track */}
      <div style={{ position: 'relative', flex: 1, paddingRight: 8, minHeight: 0 }}>
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 0, borderRight: '2px dashed var(--ss-yellow-1)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: '100%' }}>
          {ranked.map(a => {
            const p = Math.min(100, (a.kyc / max) * 100);
            const done = a.kyc >= max;
            return (
              <div key={a.id} style={{ position: 'relative', height: 20 }}>
                <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 5, transform: 'translateY(-50%)', background: 'var(--ss-white-10)', borderRadius: 99 }} />
                <div style={{
                  position: 'absolute', left: 0, top: '50%', height: 5, transform: 'translateY(-50%)',
                  width: (done ? 100 : p) + '%', background: done ? 'var(--ss-green-4)' : acc,
                  borderRadius: 99, transition: 'width 700ms var(--ease-out)', boxShadow: done ? '0 0 10px rgba(0,224,11,0.5)' : 'none',
                }} />
                <div style={{ position: 'absolute', left: `calc(${Math.min(p, 97)}%)`, top: '50%', transform: 'translate(-50%,-50%)', display: 'flex', alignItems: 'center', gap: 5, transition: 'left 700ms var(--ease-out)', pointerEvents: 'none' }}>
                  <span style={{ fontSize: 11, fontWeight: 900, color: done ? 'var(--ss-green-3)' : 'var(--ss-white)', whiteSpace: 'nowrap', textShadow: '0 0 6px #000', textTransform: 'lowercase' }}>{a.name.split(' ')[0]}</span>
                  <span className="num" style={{ fontSize: 11, fontWeight: 900, color: done ? 'var(--ss-green-3)' : acc, textShadow: '0 0 6px #000' }}>{a.kyc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* side quests row — 3 active + 2 placeholder */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <Bolt s={13} c="var(--ss-yellow-1)" />
          <span style={{ fontSize: 12, fontWeight: 900, letterSpacing: '-0.01em', textTransform: 'lowercase' }}>side quests</span>
        </div>
        <div style={{ display: 'flex', gap: 7, height: 72 }}>
          <QuestCard
            icon={<Crown s={13} />} tone="var(--ss-yellow-1)" label="pace king"
            value={paceKing ? paceKing.name : '—'}
            sub={paceKing ? <span><span className="num" style={{ color: 'var(--ss-yellow-1)', fontWeight: 900 }}>{paceKing.avg.toFixed(1)}</span> kyc/day</span> : ''} />
          <QuestCard
            icon={<Lock s={12} />} tone={acc} label="closest to unlock"
            value={closestUnlock ? closestUnlock.name : '—'}
            sub={closestUnlock ? <span><span className="num" style={{ color: acc, fontWeight: 900 }}>{closestUnlock.toGate}</span> kycs to 225</span> : ''} />
          <QuestCard
            icon={<Trophy s={12} />} tone="var(--ss-green-3)" label="gate cleared"
            value={<span><span className="num">{team.crossedGate}</span> of 8</span>}
            sub="agents are payable" />
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { CountUp, TeamStrip, Leaderboard, UnlockRace, GateBar, Lock, Bolt, Crown, Trophy, Star, rankColor });

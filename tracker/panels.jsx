// CUB TeleSales Tracker — IncentiveBanner, MysteryOffer, PayoutTiers
const TT = window.TRACKER;

// ── shared offer card base ────────────────────────────────────────
// Reused by all three right-column cards (LED Panda + 2 mystery rewards).
function OfferCard({ accentColor, glowColor, eyebrow, title, desc, leader, leaderSub, progress, total, trailingNote, isPlaceholder }) {
  if (isPlaceholder) {
    return (
      <section style={{
        position: 'relative', overflow: 'hidden', borderRadius: 18, padding: '14px 18px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px dashed rgba(255,255,255,0.18)', flex: 1,
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8,
      }}>
        <div style={{ opacity: 0.35 }}>
          <Star s={22} c="var(--ss-yellow-1)" />
        </div>
        <div style={{ fontWeight: 900, fontSize: 15, letterSpacing: '-0.01em', opacity: 0.45, textTransform: 'lowercase' }}>special challenge</div>
        <div style={{ fontSize: 11, color: 'var(--fg-muted)', textAlign: 'center', opacity: 0.55 }}>coming soon<br/>announced by team lead</div>
      </section>
    );
  }

  const pct = total > 0 ? Math.min(100, (progress / total) * 100) : 0;
  const won = total > 0 && progress >= total;

  return (
    <section style={{
      position: 'relative', overflow: 'hidden', borderRadius: 18, padding: '13px 16px', flex: 1,
      background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}bb 100%)`,
      boxShadow: won ? '0 0 36px rgba(0,224,11,0.55)' : `0 0 28px ${glowColor}`,
      border: won ? '1px solid rgba(0,224,11,0.5)' : '1px solid transparent',
      transition: 'box-shadow 600ms, border-color 600ms',
    }}>
      <div style={{ position: 'absolute', right: -22, top: -22, width: 110, height: 110, borderRadius: 99, background: won ? 'var(--ss-green-3)' : 'var(--ss-yellow-1)', opacity: 0.1, filter: 'blur(20px)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 900, letterSpacing: '0.1em', color: won ? 'var(--ss-green-3)' : 'var(--ss-yellow-1)', textTransform: 'uppercase' }}>
            <Trophy s={14} c={won ? 'var(--ss-green-3)' : 'var(--ss-yellow-1)'} /> {eyebrow}
          </span>
          <span style={{ fontSize: 11, color: won ? 'var(--ss-green-3)' : 'rgba(255,255,255,0.6)', fontWeight: won ? 900 : 400, letterSpacing: '0.04em' }}>
            {won ? '✓ claimed!' : 'this month'}
          </span>
        </div>
        <div style={{ fontWeight: 900, fontSize: 24, letterSpacing: '-0.02em', lineHeight: '28px' }}>{title}</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 3, lineHeight: 1.4 }}>{desc}</div>
        <div style={{ marginTop: 10, background: won ? 'rgba(0,224,11,0.12)' : 'rgba(0,0,0,0.3)', borderRadius: 10, padding: '9px 12px', border: won ? '1px solid rgba(0,224,11,0.3)' : 'none', transition: 'background 600ms' }}>
          {won && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
              <span style={{ fontSize: 13, fontWeight: 900, color: 'var(--ss-green-3)', letterSpacing: '-0.01em' }}>🏆 claimed by</span>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: won ? 4 : 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Crown s={15} c={won ? 'var(--ss-green-3)' : 'var(--ss-yellow-1)'} />
              <span style={{ fontWeight: 900, fontSize: won ? 18 : 15, textTransform: 'lowercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160, color: won ? 'var(--ss-green-3)' : 'inherit' }}>
                {leader}
              </span>
            </div>
            <div style={{ fontWeight: 900, fontSize: 20, whiteSpace: 'nowrap' }}>
              <CountUp value={progress} className="num" style={{ fontWeight: 900, fontSize: 20, color: won ? 'var(--ss-green-3)' : 'inherit' }} />
              {total > 0 && <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 900, fontSize: 13 }}> / {total}</span>}
            </div>
          </div>
          {total > 0 && (
            <div style={{ height: 8, borderRadius: 99, background: 'rgba(255,255,255,0.15)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: pct + '%', background: won ? 'var(--ss-green-3)' : 'var(--ss-yellow-1)', borderRadius: 99, transition: 'width 700ms var(--ease-out)', boxShadow: won ? '0 0 8px rgba(0,224,11,0.8)' : 'none' }} />
            </div>
          )}
          {!won && leaderSub && (
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 5 }}>{leaderSub}</div>
          )}
        </div>
        {trailingNote && (
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 7 }}>{trailingNote}</div>
        )}
      </div>
    </section>
  );
}

// ── 1. LED Panda — first to 200 KYCs ─────────────────────────────
function IncentiveBanner({ agents }) {
  const PRIZE_AT = TT.CONFIG.incentivePrizeAt;
  const sorted = [...agents].sort((a, b) => b.kyc - a.kyc);
  const leader = sorted[0];
  const runnerUp = sorted[1];
  const won = leader && leader.kyc >= PRIZE_AT;
  const remaining = leader ? Math.max(0, PRIZE_AT - leader.kyc) : PRIZE_AT;
  return (
    <OfferCard
      accentColor="var(--ss-blue-4)"
      glowColor="rgba(61,65,250,0.45)"
      eyebrow={TT.CONFIG.challenge1Eyebrow}
      title={TT.CONFIG.incentivePrizeLabel}
      desc={TT.CONFIG.incentivePrizeDesc}
      leader={leader ? leader.name : '—'}
      progress={leader ? leader.kyc : 0}
      total={PRIZE_AT}
      leaderSub={!won && runnerUp
        ? <span><span className="num" style={{ color: 'var(--ss-yellow-1)', fontWeight: 900 }}>{remaining}</span> kycs to claim · {runnerUp.name.split(' ')[0]} chasing at <span className="num">{runnerUp.kyc}</span></span>
        : null}
    />
  );
}

// ── 2. Mystery Reward A — first to hit 300 KYCs ───────────────────
function MysteryFastest300({ agents }) {
  const TARGET = TT.CONFIG.mysteryATarget || TT.CONFIG.monthlyTarget;
  const sorted = [...agents].sort((a, b) => b.kyc - a.kyc);
  const leader = sorted[0];
  const runnerUp = sorted[1];
  const won = leader && leader.kyc >= TARGET;
  const remaining = leader ? Math.max(0, TARGET - leader.kyc) : TARGET;
  return (
    <OfferCard
      accentColor="#1a1060"
      glowColor="rgba(100,80,250,0.35)"
      eyebrow={TT.CONFIG.challenge2Eyebrow}
      title={TT.CONFIG.mysteryATitle}
      desc={TT.CONFIG.mysteryADesc}
      leader={leader ? leader.name : '—'}
      progress={leader ? leader.kyc : 0}
      total={TARGET}
      leaderSub={!won && runnerUp
        ? <span><span className="num" style={{ color: 'var(--ss-yellow-1)', fontWeight: 900 }}>{remaining}</span> to go · {runnerUp.name.split(' ')[0]} at <span className="num">{runnerUp.kyc}</span></span>
        : null}
    />
  );
}

// ── 3. Mystery Reward B — most KYCs in a single day ───────────────
function MysteryBestDay({ data }) {
  const { bestDayAgent, agents } = data;
  if (!bestDayAgent) return null;
  const runnerUp = [...agents].sort((a, b) => b.bestDayKyc - a.bestDayKyc)[1];
  return (
    <OfferCard
      accentColor="#0d3020"
      glowColor="rgba(61,255,71,0.2)"
      eyebrow={TT.CONFIG.challenge3Eyebrow}
      title={TT.CONFIG.mysteryBTitle}
      desc={TT.CONFIG.mysteryBDesc}
      leader={bestDayAgent.name}
      progress={bestDayAgent.bestDayKyc}
      total={0}
      leaderSub={runnerUp && runnerUp.bestDayKyc > 0
        ? <span>{runnerUp.name.split(' ')[0]} close with <span className="num" style={{ color: 'var(--ss-yellow-1)', fontWeight: 900 }}>{runnerUp.bestDayKyc}</span> kycs in a day</span>
        : null}
      trailingNote={TT.CONFIG.mysteryBNote}
    />
  );
}

// ── Payout Tiers ──────────────────────────────────────────────────
function PayoutTiers({ agents, accent }) {
  const occ = {};
  agents.forEach(a => { occ[a.slab.rate] = (occ[a.slab.rate] || 0) + 1; });
  return (
    <section style={{ flex: '1.05', minWidth: 0, background: 'var(--ss-white-10)', border: '1px solid var(--border-faint)', borderRadius: 18, padding: '12px 16px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 7 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, letterSpacing: '-0.02em' }}>payout tiers</h2>
        <span style={{ fontSize: 11, color: 'var(--fg-muted)', letterSpacing: '0.04em' }}>rate per kyc by daily count</span>
      </div>
      <div style={{ flex: 1, display: 'flex', gap: 6 }}>
        {[...TT.SLABS].reverse().map(s => {
          const here = occ[s.rate] || 0;
          const top = s.rate >= 100;
          return (
            <div key={s.label} style={{
              flex: 1, borderRadius: 10, padding: '8px 5px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', gap: 5,
              background: here ? (top ? 'rgba(238,255,65,0.12)' : 'rgba(61,65,250,0.14)') : 'var(--ss-white-10)',
              border: here ? `1px solid ${top ? 'rgba(238,255,65,0.4)' : 'rgba(61,65,250,0.45)'}` : '1px solid var(--border-faint)',
            }}>
              <div style={{ fontSize: 11, color: 'var(--fg-muted)', fontWeight: 900, letterSpacing: '0.02em', textAlign: 'center' }}>
                {s.label}<span style={{ fontSize: 8, fontWeight: 400, display: 'block', marginTop: -1 }}>/day</span>
              </div>
              <div className="num" style={{ fontWeight: 900, fontSize: s.rate === 0 ? 16 : 19, letterSpacing: '-0.03em', color: s.rate === 0 ? 'var(--fg-muted)' : (top ? 'var(--ss-yellow-1)' : 'var(--fg-primary)') }}>
                {s.rate === 0 ? '₹0' : TT.inr(s.rate)}
              </div>
              <div style={{ height: 18, display: 'flex', alignItems: 'center' }}>
                {here > 0
                  ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 10, fontWeight: 900, padding: '1px 6px', borderRadius: 99, background: top ? 'var(--ss-yellow-1)' : 'var(--ss-blue-4)', color: top ? '#000' : '#fff' }}><span className="num">{here}</span> here</span>
                  : <span style={{ fontSize: 9, color: 'var(--fg-muted)' }}>—</span>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

Object.assign(window, { IncentiveBanner, MysteryFastest300, MysteryBestDay, PayoutTiers });

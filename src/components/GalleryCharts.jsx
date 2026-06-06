// Composite charts for the Visual Library — built on SetupChart primitives.

import { useState, useEffect, useRef } from 'react'
import SetupChart from './SetupChart.jsx'
import { Icon } from './Icon.jsx'

// ───────────────────────────────────────────────────────────────────────────────
// G3 — Multi-timeframe (3 stacked mini-charts: 15m / 5m / 2m)
// ───────────────────────────────────────────────────────────────────────────────
export function MultiTimeframeChart() {
  // 15-min uptrend, with the pullback "moment" highlighted
  const v15 = [10, 18, 32, 26, 40, 32, 48, 42, 56, 50, 64]
  // 5-min view of the same pullback — lower high holding above prior swing low
  const v5  = [62, 48, 35, 42, 38, 46, 38, 44, 52, 60, 70]
  // 2-min trigger: dip-bounce-dip with entry on close
  const v2  = [46, 38, 32, 44, 36, 44, 36, 42, 50, 58, 66]

  return (
    <div className="card-elev rounded-card p-3 md:p-4 border border-border space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="pill pill-violet">G3 · 15m / 5m / 2m</span>
        <span className="text-textt text-[11px] font-display tracking-wide">Same moment, three lenses</span>
      </div>

      <PanelLabel label="15-min" sub="HH/HL · IF" color="emerald">
        <SetupChart
          values={v15}
          ema20={[8,12,18,22,28,30,38,40,46,52,58]}
          markers={[
            { idx: 1, kind: 'flag', label: '1' },
            { idx: 3, kind: 'flag', label: '2' },
            { idx: 5, kind: 'flag', label: '3' },
            { idx: 7, kind: 'flag', label: '4' },
            { idx: 9, kind: 'dip2', label: 'Pullback' },
          ]}
          axisLabels={false}
          height={180}
        />
      </PanelLabel>

      <PanelLabel label="5-min" sub="Lower high holding prior swing low · WHERE" color="cyan">
        <SetupChart
          values={v5}
          ema20={[58,52,46,44,40,42,40,42,46,52,60]}
          markers={[
            { idx: 2, kind: 'dot', label: 'Prior swing low (holds)', color: '#2DD4F0' },
            { idx: 5, kind: 'dip2', label: 'Lower high — pullback forming' },
          ]}
          axisLabels={false}
          height={180}
        />
      </PanelLabel>

      <PanelLabel label="2-min" sub="Second-entry trigger · WHEN" color="gold">
        <SetupChart
          values={v2}
          triggerY={44}
          triggerLabel="Trigger"
          markers={[
            { idx: 2, kind: 'dip1', label: 'Dip 1' },
            { idx: 6, kind: 'dip2', label: 'Dip 2' },
            { idx: 7, kind: 'enter', label: 'Enter — close above' },
          ]}
          stopY={28}
          crowdStopY={31}
          stopLabel="Your stop"
          axisLabels={false}
          height={200}
        />
      </PanelLabel>
    </div>
  )
}

function PanelLabel({ label, sub, color, children }) {
  const pillMap = { emerald: 'pill-emerald', coral: 'pill-coral', gold: 'pill-gold', violet: 'pill-violet', cyan: 'pill-cyan' }
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className={`pill ${pillMap[color] || 'pill-violet'} text-[10px]`}>{label}</span>
        <span className="text-texts text-[12px] font-display tracking-wide">{sub}</span>
      </div>
      {children}
    </div>
  )
}

// ───────────────────────────────────────────────────────────────────────────────
// G6 — Stop hunt: a wick takes out the crowd stop, your stop survives, price reverses up.
// ───────────────────────────────────────────────────────────────────────────────
export function StopHuntChart() {
  // Synthetic candle data showing a stop run: a single bar wicks below the crowd line,
  // then the trend resumes up.
  const candles = [
    { open: 30, close: 48, high: 50, low: 28, up: true },
    { open: 48, close: 60, high: 62, low: 46, up: true },
    { open: 60, close: 52, high: 62, low: 48, up: false }, // pullback begins
    { open: 52, close: 44, high: 54, low: 42, up: false }, // Dip 1
    { open: 44, close: 56, high: 58, low: 42, up: true },  // bounce
    { open: 56, close: 47, high: 58, low: 46, up: false }, // Dip 2 forming
    { open: 47, close: 44, high: 50, low: 30, up: false }, // LIQUIDITY GRAB — long lower wick to 30, takes the crowd stop
    { open: 44, close: 60, high: 62, low: 44, up: true },  // reversal
    { open: 60, close: 72, high: 74, low: 58, up: true },  // continuation
  ]
  return (
    <SetupChart
      candles={candles}
      kind="candle"
      triggerY={56}
      triggerLabel="Trigger"
      markers={[
        { idx: 3, kind: 'dip1', label: 'Dip 1' },
        { idx: 5, kind: 'dip2', label: 'Dip 2' },
        { idx: 6, kind: 'dot', label: 'Liquidity grab — crowd stopped out', color: '#FF5C72' },
        { idx: 7, kind: 'enter', label: 'Survives + reverses' },
      ]}
      stopY={26}
      crowdStopY={38}
      stopLabel="Your stop (survives)"
      crowdStopLabel="crowd stop (hunted)"
      contextLabel="G6 · Behind the hunt"
      contextColor="coral"
      caption="Be behind the hunt, not the first target."
    />
  )
}

// ───────────────────────────────────────────────────────────────────────────────
// G9 — Breakeven mechanic: before/after T1 fills, the stop snaps to entry
// ───────────────────────────────────────────────────────────────────────────────
export function BreakevenChart() {
  const [phase, setPhase] = useState('before') // 'before' | 'after'

  return (
    <div className="card-elev rounded-card p-3 md:p-4 border border-border space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="pill pill-emerald">G9 · Breakeven mechanic</span>
        <div className="inline-flex p-0.5 rounded-md border border-border bg-bg" role="tablist" aria-label="Breakeven step">
          {[
            { k: 'before', l: 'Before T1' },
            { k: 'after',  l: 'After T1 fills' },
          ].map(o => (
            <button
              key={o.k}
              role="tab"
              aria-selected={phase === o.k}
              className={`font-display tracking-wide text-[11px] py-1 px-2.5 rounded transition ${phase === o.k ? 'bg-emerald2 text-bg' : 'text-texts hover:text-textp'}`}
              onClick={() => setPhase(o.k)}
            >{o.l}</button>
          ))}
        </div>
      </div>

      <SetupChart
        values={[40, 56, 70, 58, 70, 60, 76, 84]}
        triggerY={70}
        triggerLabel="Trigger"
        markers={[
          { idx: 3, kind: 'dip1', label: 'Dip 1' },
          { idx: 5, kind: 'dip2', label: 'Dip 2' },
          { idx: 6, kind: 'enter', label: phase === 'before' ? 'Entry' : 'T1 hit — stop snapped to BE' },
        ]}
        stopY={phase === 'before' ? 50 : 60}
        stopLabel={phase === 'before' ? 'Stop = −1R (below Dip 1)' : 'Stop = breakeven (entry)'}
        t1Y={76}
        t2Y={84}
        contextLabel={phase === 'before' ? 'Phase 1 · risk on' : 'Phase 2 · risk off — trade can no longer lose'}
        contextColor={phase === 'before' ? 'coral' : 'emerald'}
        caption={phase === 'before'
          ? 'Before T1 fills, the original stop sits below Dip 1.'
          : 'The instant T1 fills, the stop snaps up to entry. The trade can no longer lose.'}
      />
    </div>
  )
}

// ───────────────────────────────────────────────────────────────────────────────
// Do-Not chart: any SetupChart values, but stamped with a coral "NOT THIS" overlay
// ───────────────────────────────────────────────────────────────────────────────
export function DoNotChart({ values, ctx, ctxColor = 'muted', tops, highlight }) {
  const markers = []
  if (tops) {
    tops.forEach((t, i) => markers.push({ idx: t, kind: 'dot', label: `T${i + 1}`, color: '#FF5C72' }))
  }
  if (highlight) {
    highlight.forEach(idx => markers.push({ idx, kind: 'dot', label: 'standalone candle', color: '#FF5C72' }))
  }

  return (
    <div className="relative">
      <SetupChart
        values={values}
        markers={markers}
        contextLabel={ctx}
        contextColor={ctxColor}
        axisLabels={false}
        height={220}
      />
      {/* Diagonal "NOT THIS" stamp */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="font-display font-semibold tracking-[0.25em] text-[26px] md:text-[34px] uppercase"
          style={{
            color: 'rgba(255, 92, 114, 0.85)',
            transform: 'rotate(-12deg)',
            border: '3px solid rgba(255, 92, 114, 0.85)',
            padding: '6px 22px',
            borderRadius: 8,
            background: 'rgba(10, 14, 26, 0.55)',
            boxShadow: '0 0 24px rgba(255, 92, 114, 0.35)',
            textShadow: '0 0 12px rgba(255, 92, 114, 0.45)',
          }}
        >
          NOT THIS
        </div>
      </div>
    </div>
  )
}

// ───────────────────────────────────────────────────────────────────────────────
// AnatomyCandle — a single zoomed candle with body/wick labels + meaning/grade
// ───────────────────────────────────────────────────────────────────────────────
export function AnatomyCandle({ entry }) {
  const w = 360, h = 280
  const cx = w * 0.34
  const padT = 24, padB = 28
  const innerH = h - padT - padB
  const yFor = v => padT + (1 - v / 100) * innerH

  const isShort = entry.side === 'short'
  const baseColor = isShort ? '#FF5C72' : '#1FE0A0'
  const accent = entry.color === 'gold' ? '#FFB347' : entry.color === 'violet' ? '#9B8CFF' : baseColor

  // 3-bar morning star
  if (entry.isThree) {
    const bars = [
      { open: 70, close: 32, high: 72, low: 28, up: false },  // big down
      { open: 32, close: 34, high: 38, low: 26, up: true },   // indecision
      { open: 34, close: 72, high: 76, low: 30, up: true },   // big up
    ]
    return (
      <CandleCard entry={entry}>
        <svg viewBox={`0 0 ${w} ${h}`} width="100%" preserveAspectRatio="xMidYMid meet" style={{ height: 'auto', display: 'block' }}>
          <CandleSVGDefs/>
          <rect x={12} y={padT} width={w - 24} height={innerH} fill="url(#g-bg)" rx={6}/>
          {bars.map((b, i) => {
            const x = 60 + i * 90
            const color = b.up ? '#1FE0A0' : '#FF5C72'
            const yO = yFor(b.open), yC = yFor(b.close), yH = yFor(b.high), yL = yFor(b.low)
            const top = Math.min(yO, yC)
            const bodyH = Math.max(2, Math.abs(yO - yC))
            return (
              <g key={i}>
                <line x1={x} x2={x} y1={yH} y2={yL} stroke={color} strokeWidth="2"/>
                <rect x={x - 16} y={top} width={32} height={bodyH} fill={color} rx={2}/>
              </g>
            )
          })}
          <text x={60}  y={h - 8} textAnchor="middle" fill="#9BA6BE" fontFamily="Space Mono" fontSize="10">Bar 1</text>
          <text x={150} y={h - 8} textAnchor="middle" fill="#9BA6BE" fontFamily="Space Mono" fontSize="10">Bar 2</text>
          <text x={240} y={h - 8} textAnchor="middle" fill="#9BA6BE" fontFamily="Space Mono" fontSize="10">Bar 3</text>
        </svg>
      </CandleCard>
    )
  }

  // Single-candle (engulfing draws the prior bar too)
  const showPrior = entry.candle?.priorOpen != null
  const main = entry.candle
  const yMO = yFor(main.open), yMC = yFor(main.close), yMH = yFor(main.high), yML = yFor(main.low)
  const top = Math.min(yMO, yMC)
  const bodyH = Math.max(3, Math.abs(yMO - yMC))
  const mainColor = main.up ? '#1FE0A0' : '#FF5C72'

  return (
    <CandleCard entry={entry}>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" preserveAspectRatio="xMidYMid meet" style={{ height: 'auto', display: 'block' }}>
        <CandleSVGDefs/>
        <rect x={12} y={padT} width={w - 24} height={innerH} fill="url(#g-bg)" rx={6}/>

        {showPrior && (() => {
          const pO = yFor(main.priorOpen), pC = yFor(main.priorClose), pH = yFor(main.priorHigh), pL = yFor(main.priorLow)
          const ptop = Math.min(pO, pC)
          const ph = Math.max(2, Math.abs(pO - pC))
          const pcol = main.priorClose >= main.priorOpen ? '#1FE0A0' : '#FF5C72'
          return (
            <g opacity="0.55">
              <line x1={cx - 70} x2={cx - 70} y1={pH} y2={pL} stroke={pcol} strokeWidth="1.6"/>
              <rect x={cx - 70 - 14} y={ptop} width={28} height={ph} fill={pcol} rx={2}/>
              <text x={cx - 70} y={h - 8} textAnchor="middle" fill="#9BA6BE" fontFamily="Space Mono" fontSize="10">prior bar</text>
            </g>
          )
        })()}

        {/* Main candle */}
        <line x1={cx} x2={cx} y1={yMH} y2={yML} stroke={mainColor} strokeWidth="2.2" filter="url(#g-glow)"/>
        <rect x={cx - 22} y={top} width={44} height={bodyH} fill={mainColor} rx={2.5} filter="url(#g-glow)"/>

        {/* Labels with leader lines */}
        <LeaderLabel x1={cx + 22} y1={(top + bodyH / 2)} x2={cx + 90} y2={(top + bodyH / 2)} text="Body — open vs close" color="#E8ECF4"/>
        <LeaderLabel x1={cx + 1}  y1={yMH + 2}            x2={cx + 90} y2={yMH + 10}            text="Upper wick — rejection from above" color="#9BA6BE"/>
        <LeaderLabel x1={cx + 1}  y1={yML - 2}            x2={cx + 90} y2={yML - 6}             text="Lower wick — rejection from below" color="#9BA6BE"/>

        <text x={cx} y={h - 8} textAnchor="middle" fill="#9BA6BE" fontFamily="Space Mono" fontSize="10">{showPrior ? 'main bar' : 'the candle'}</text>
      </svg>
    </CandleCard>
  )
}

function CandleSVGDefs() {
  return (
    <defs>
      <linearGradient id="g-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0E1428"/>
        <stop offset="100%" stopColor="#0B0F1F"/>
      </linearGradient>
      <filter id="g-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1.6" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
  )
}

function LeaderLabel({ x1, y1, x2, y2, text, color }) {
  return (
    <g>
      <line x1={x1} x2={x2} y1={y1} y2={y2} stroke={color} strokeDasharray="2 3" opacity="0.6"/>
      <text x={x2 + 6} y={y2 + 4} fill={color} fontFamily="Space Mono" fontSize="11">{text}</text>
    </g>
  )
}

function CandleCard({ entry, children }) {
  const pillMap = { emerald: 'pill-emerald', coral: 'pill-coral', gold: 'pill-gold', violet: 'pill-violet' }
  const sideLabel = entry.side === 'long' ? 'longs' : entry.side === 'short' ? 'shorts' : 'either'
  return (
    <div className="card-elev rounded-card p-3 md:p-4 border border-border space-y-2">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h4 className="font-display font-semibold text-textp text-base">{entry.title}</h4>
        <div className="flex items-center gap-2">
          <span className={`pill ${pillMap[entry.color] || 'pill-violet'} text-[10px]`}>{entry.grade}</span>
          <span className="pill pill-muted text-[10px]">{sideLabel}</span>
        </div>
      </div>
      {children}
      <p className="text-texts text-[13px] leading-relaxed mt-1">{entry.meaning}</p>
    </div>
  )
}

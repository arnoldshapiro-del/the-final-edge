// Reusable inline SVG chart primitives for teaching diagrams.

import React from 'react'

// Map a 0..100 "price" array to a polyline path in an SVG viewbox.
function buildPath(values, { w = 600, h = 260, padL = 36, padR = 24, padT = 14, padB = 28 } = {}) {
  if (!values.length) return ''
  const n = values.length
  const innerW = w - padL - padR
  const innerH = h - padT - padB
  const xs = values.map((_, i) => padL + (i / (n - 1)) * innerW)
  // y inverted: higher value = higher on screen
  const ys = values.map(v => padT + (1 - v / 100) * innerH)
  let d = `M ${xs[0]} ${ys[0]}`
  // smooth Bezier between points
  for (let i = 1; i < n; i++) {
    const cx = (xs[i - 1] + xs[i]) / 2
    d += ` Q ${cx} ${ys[i - 1]} ${xs[i]} ${ys[i]}`
  }
  return { d, xs, ys, padL, padR, padT, padB, w, h, innerW, innerH }
}

export function ChartFromPath({
  values,
  triggerY,           // optional: 0..100 dashed gold trigger line value
  triggerLabel = 'Trigger line',
  markers = [],       // [{ idx, label, color, dotColor }]
  stopY,              // 0..100; if set, dashed coral stop line
  stopLabel = 'Stop',
  ema20,              // optional array of EMA values 0..100 to plot as cyan dashed
  ema9,               // optional gold dashed line
  height = 260,
  caption,
  contextLabel,       // small badge at top
  contextColor = 'violet',
}) {
  const w = 700, h = height
  const built = buildPath(values, { w, h })
  if (!built) return null
  const { d, xs, ys, padL, padR, padT, padB, innerW, innerH } = built
  const yFromVal = v => padT + (1 - v / 100) * innerH

  // EMA lines
  const emaPath = arr => {
    if (!arr || arr.length === 0) return ''
    const n = arr.length
    let dd = ''
    arr.forEach((v, i) => {
      const x = padL + (i / (n - 1)) * innerW
      const y = padT + (1 - v / 100) * innerH
      dd += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`
    })
    return dd
  }

  const ctxColors = {
    emerald: 'pill-emerald', coral: 'pill-coral', gold: 'pill-gold', violet: 'pill-violet', cyan: 'pill-cyan', muted: 'pill-muted',
  }

  return (
    <div className="card-elev rounded-card p-3 md:p-4 border border-border">
      {contextLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className={`pill ${ctxColors[contextColor] || 'pill-violet'}`}>{contextLabel}</span>
        </div>
      )}
      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${w} ${h}`} width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label={caption || 'Chart'} style={{ height: 'auto', display: 'block' }}>
          {/* grid */}
          <g opacity="0.18">
            {[0.25, 0.5, 0.75].map(t => (
              <line key={t} x1={padL} x2={w - padR} y1={padT + t * innerH} y2={padT + t * innerH} stroke="#E8ECF4" strokeDasharray="2 6" />
            ))}
          </g>

          {/* EMA 20 cyan */}
          {ema20 && <path d={emaPath(ema20)} stroke="#2DD4F0" strokeWidth="1.8" strokeDasharray="6 5" fill="none" opacity="0.85" />}
          {/* EMA 9 gold */}
          {ema9 && <path d={emaPath(ema9)} stroke="#FFB347" strokeWidth="1.8" strokeDasharray="3 4" fill="none" opacity="0.85" />}

          {/* trigger line */}
          {typeof triggerY === 'number' && (
            <>
              <line x1={padL} x2={w - padR} y1={yFromVal(triggerY)} y2={yFromVal(triggerY)} stroke="#FFB347" strokeWidth="1.6" strokeDasharray="7 5" opacity="0.85" />
              <text x={w - padR} y={yFromVal(triggerY) - 6} textAnchor="end" fill="#FFB347" fontFamily="Space Mono" fontSize="11">{triggerLabel}</text>
            </>
          )}
          {/* stop line */}
          {typeof stopY === 'number' && (
            <>
              <line x1={padL} x2={w - padR} y1={yFromVal(stopY)} y2={yFromVal(stopY)} stroke="#FF5C72" strokeWidth="1.4" strokeDasharray="3 4" opacity="0.85" />
              <text x={padL + 6} y={yFromVal(stopY) + 14} fill="#FF5C72" fontFamily="Space Mono" fontSize="11">{stopLabel}</text>
            </>
          )}

          {/* price line */}
          <path d={d} stroke="#E8ECF4" strokeWidth="2.4" fill="none" />

          {/* markers */}
          {markers.map((m, i) => {
            const idx = Math.max(0, Math.min(values.length - 1, m.idx))
            const x = xs[idx], y = ys[idx]
            return (
              <g key={i}>
                <circle cx={x} cy={y} r="6.5" fill={m.dotColor || m.color || '#9B8CFF'} stroke="#0A0E1A" strokeWidth="2" />
                <text
                  x={x}
                  y={y - 12}
                  textAnchor={m.anchor || 'middle'}
                  fontFamily="Oxanium"
                  fontSize="11"
                  fontWeight="600"
                  fill={m.labelColor || m.color || '#E8ECF4'}
                >
                  {m.label}
                </text>
              </g>
            )
          })}

          {/* axis labels */}
          <text x={padL} y={h - 6} fill="#5E6884" fontFamily="Space Mono" fontSize="10">time →</text>
          <text x={w - padR} y={h - 6} textAnchor="end" fill="#5E6884" fontFamily="Space Mono" fontSize="10">price ↑</text>
        </svg>
      </div>
      {caption && <div className="mt-2 text-texts text-[13px] font-body leading-relaxed">{caption}</div>}
    </div>
  )
}

// Simple "ladder" chart for 2-2-2 exits
export function LadderChart({ entry, riskPts, height = 260 }) {
  const w = 700, h = height
  const padL = 40, padR = 24, padT = 16, padB = 28
  const innerH = h - padT - padB
  // Levels: stop = entry - 1R, BE/entry, T1 = +1R, T2 = +2R, runner extends up
  const levels = [
    { label: 'Runner — trails 9 EMA', val: entry + riskPts * 3, color: '#9B8CFF' },
    { label: 'T2 = +2R (2 ct)', val: entry + riskPts * 2, color: '#1FE0A0' },
    { label: 'T1 = +1R (2 ct), then stop → BE', val: entry + riskPts, color: '#1FE0A0' },
    { label: 'Entry', val: entry, color: '#E8ECF4' },
    { label: 'Stop = −1R (below first dip)', val: entry - riskPts, color: '#FF5C72' },
  ]
  const min = entry - riskPts * 1.6
  const max = entry + riskPts * 3.5
  const yFor = v => padT + (1 - (v - min) / (max - min)) * innerH

  return (
    <div className="card-elev rounded-card p-3 md:p-4 border border-border">
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="2-2-2 exit ladder" style={{ height: 'auto', display: 'block' }}>
        {/* vertical guide */}
        <line x1={padL + 80} x2={padL + 80} y1={padT} y2={h - padB} stroke="#252C44" strokeWidth="1.2" />
        {/* 6-contracts column visual */}
        {[0,1,2,3,4,5].map(i => (
          <rect key={i} x={padL + 88 + i * 14} y={yFor(entry) - 8} width="10" height="16" rx="2" fill="#161D33" stroke="#252C44" />
        ))}
        {/* level lines */}
        {levels.map((l, i) => (
          <g key={i}>
            <line x1={padL} x2={w - padR} y1={yFor(l.val)} y2={yFor(l.val)} stroke={l.color} strokeWidth="1.4" strokeDasharray={l.label.startsWith('Entry') ? '0' : '5 5'} opacity={l.label.startsWith('Entry') ? 0.9 : 0.7} />
            <text x={w - padR} y={yFor(l.val) - 5} textAnchor="end" fill={l.color} fontFamily="Space Mono" fontSize="12">{l.label}</text>
            <text x={padL} y={yFor(l.val) + 4} fill="#9BA6BE" fontFamily="Space Mono" fontSize="11">{l.val.toFixed(2)}</text>
          </g>
        ))}
        <text x={padL} y={h - 8} fill="#5E6884" fontFamily="Space Mono" fontSize="10">6 contracts: 2 / 2 / 2</text>
      </svg>
    </div>
  )
}

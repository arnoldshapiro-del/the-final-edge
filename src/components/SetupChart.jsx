// The Final Edge — SetupChart engine.
// One reusable engine that powers every teaching chart in the app.
//
// Reuses the design tokens defined in tailwind.config.js + index.css:
//   emerald = with-trend / longs / wins (#1FE0A0)
//   coral   = stops / shorts / losses    (#FF5C72)
//   cyan    = 20 EMA                     (#2DD4F0)
//   gold    = 9 EMA / trigger / A+       (#FFB347)
//   violet  = accents                    (#9B8CFF)
//
// Fonts: Oxanium (display, marker labels), Space Mono (axis/data), Inter (captions).
// Reduced-motion safe — play & reveal collapse to instant draws when the user requests less motion.

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { Icon } from './Icon.jsx'

const COLORS = {
  bg:       '#0A0E1A',
  panel:    '#121829',
  border:   '#252C44',
  text:     '#E8ECF4',
  texts:    '#9BA6BE',
  textt:    '#5E6884',
  emerald:  '#1FE0A0',
  coral:    '#FF5C72',
  cyan:     '#2DD4F0',
  gold:     '#FFB347',
  violet:   '#9B8CFF',
}

const PILL_FOR_CONTEXT = {
  emerald: 'pill-emerald',
  coral:   'pill-coral',
  gold:    'pill-gold',
  violet:  'pill-violet',
  cyan:    'pill-cyan',
  muted:   'pill-muted',
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })
  useEffect(() => {
    if (!window.matchMedia) return
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(m.matches)
    m.addEventListener?.('change', onChange)
    return () => m.removeEventListener?.('change', onChange)
  }, [])
  return reduced
}

// Smooth Bézier polyline from an array of normalised (0-100) values across [padL, w-padR].
function buildSmoothPath(values, xs, ys) {
  if (values.length < 2) return ''
  let d = `M ${xs[0]} ${ys[0]}`
  for (let i = 1; i < values.length; i++) {
    const cx = (xs[i - 1] + xs[i]) / 2
    d += ` Q ${cx} ${ys[i - 1]} ${xs[i]} ${ys[i]}`
  }
  return d
}

// Path traversal helpers — for the "play" animation we use stroke-dasharray + stroke-dashoffset.
function pathLengthFromValues(xs, ys) {
  let len = 0
  for (let i = 1; i < xs.length; i++) {
    len += Math.hypot(xs[i] - xs[i - 1], ys[i] - ys[i - 1])
  }
  return len * 1.05 // smoothed Bézier is a bit longer than the polyline
}

// Synthesise OHLC candles from a values[] (close) array. The "wick" magnitude is deterministic.
function synthCandles(values) {
  const out = []
  for (let i = 0; i < values.length; i++) {
    const close = values[i]
    const open = i === 0 ? values[0] - 1.6 : values[i - 1]
    // Deterministic wick using a hash of the index
    const seed = Math.sin(i * 9.137 + close * 0.13) * 0.5 + 0.5 // 0..1
    const wickTop = 1.4 + seed * 2.6
    const wickBot = 1.0 + (1 - seed) * 2.4
    const top = Math.min(100, Math.max(open, close) + wickTop)
    const bot = Math.max(0, Math.min(open, close) - wickBot)
    out.push({ open, close, high: top, low: bot, up: close >= open })
  }
  return out
}

// ===================================================================================
// Main component
// ===================================================================================
export default function SetupChart({
  values,                         // number[] in 0..100 (higher = higher price)
  candles,                        // optional explicit candles; falls back to synth
  kind: kindProp = 'line',        // 'line' | 'candle'
  showKindToggle = false,         // small toggle in the header
  ema20, ema9,                    // overlay arrays (0..100)
  triggerY, triggerLabel = 'Trigger',
  stopY, stopLabel = 'Stop',
  crowdStopY, crowdStopLabel = 'crowd stop (typical)',
  markers = [],                   // { idx, kind?:'dip1'|'dip2'|'enter'|'dot'|'exhaust'|'flag', label?, color? }
  levels = [],                    // { y, label, color, dashed? }
  t1Y, t2Y,                       // shortcut chips for the 2-2-2 levels
  measuredMove,                   // { fromY, toY, projectFromY } — translucent band
  height = 280,
  caption,
  contextLabel,
  contextColor = 'violet',
  mode = 'static',                // 'static' | 'reveal' | 'play'
  playable = false,               // show Play / Replay button (mode becomes 'play' on click)
  autoPlay = false,
  axisLabels = true,
  className = '',
}) {
  const reduced = usePrefersReducedMotion()
  const [kind, setKind] = useState(kindProp)
  useEffect(() => setKind(kindProp), [kindProp])

  // -------------------------------------------------------------------------------
  // Geometry
  // -------------------------------------------------------------------------------
  const w = 760
  const h = height
  const padL = 40, padR = 28, padT = 18, padB = 28
  const innerW = w - padL - padR
  const innerH = h - padT - padB
  const yFromVal = useCallback(v => padT + (1 - v / 100) * innerH, [padT, innerH])

  const n = values?.length || candles?.length || 0
  const xs = useMemo(() => Array.from({ length: n }, (_, i) => padL + (i / Math.max(1, n - 1)) * innerW), [n, padL, innerW])
  const ys = useMemo(() => values ? values.map(v => yFromVal(v)) : (candles || []).map(c => yFromVal(c.close)), [values, candles, yFromVal])

  const smoothD = useMemo(() => buildSmoothPath(values || (candles || []).map(c => c.close), xs, ys), [values, candles, xs, ys])
  const pathLen = useMemo(() => pathLengthFromValues(xs, ys), [xs, ys])

  const cdata = useMemo(() => candles || synthCandles(values || []), [candles, values])

  // -------------------------------------------------------------------------------
  // Animation
  // -------------------------------------------------------------------------------
  const [progress, setProgress] = useState(mode === 'static' ? 1 : (mode === 'reveal' ? 1 : (autoPlay ? 0 : 1)))
  const [playing, setPlaying] = useState(false)
  const rafRef = useRef(0)
  const startRef = useRef(0)

  const startPlay = useCallback(() => {
    if (reduced) { setProgress(1); return }
    setPlaying(true)
    setProgress(0)
    startRef.current = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - startRef.current) / 1500)
      setProgress(t)
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setPlaying(false)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [reduced])

  useEffect(() => {
    if (mode === 'play' && autoPlay) startPlay()
    return () => cancelAnimationFrame(rafRef.current)
  }, [mode, autoPlay, startPlay])

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  // For reveal mode, overlays fade in immediately. For play, they fade in after the line completes.
  const overlaysAt = mode === 'play' ? Math.max(0, Math.min(1, (progress - 0.7) / 0.3)) : 1
  const markersAt = mode === 'play' ? Math.max(0, Math.min(1, (progress - 0.85) / 0.15)) : 1

  // -------------------------------------------------------------------------------
  // EMA paths
  // -------------------------------------------------------------------------------
  const emaPath = arr => {
    if (!arr || !arr.length) return ''
    return arr.map((v, i) => {
      const x = padL + (i / (arr.length - 1)) * innerW
      const y = yFromVal(v)
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')
  }

  // -------------------------------------------------------------------------------
  // Render helpers
  // -------------------------------------------------------------------------------
  const renderGrid = () => (
    <g aria-hidden>
      <defs>
        <linearGradient id="sc-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0E1428" />
          <stop offset="100%" stopColor="#0B0F1F" />
        </linearGradient>
        <filter id="sc-glow-emerald" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="sc-glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="sc-glow-gold" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <rect x={padL} y={padT} width={innerW} height={innerH} fill="url(#sc-bg)" rx={6} />
      {[0.2, 0.4, 0.6, 0.8].map(t => (
        <line key={t}
          x1={padL} x2={w - padR}
          y1={padT + t * innerH} y2={padT + t * innerH}
          stroke={COLORS.border} strokeDasharray="2 6" opacity="0.55"
        />
      ))}
    </g>
  )

  const renderMeasuredMove = () => {
    if (!measuredMove) return null
    const { fromY, toY, projectFromY, label = 'Measured move' } = measuredMove
    const yA = yFromVal(projectFromY)
    const yB = yFromVal(projectFromY + (toY - fromY))
    return (
      <g opacity={0.65 * overlaysAt}>
        <rect x={padL + innerW * 0.6} y={Math.min(yA, yB)} width={innerW * 0.4} height={Math.abs(yA - yB)} fill={COLORS.emerald} opacity="0.10" rx={3} />
        <line x1={padL + innerW * 0.6} x2={w - padR} y1={yB} y2={yB} stroke={COLORS.emerald} strokeWidth="1.2" strokeDasharray="4 4" opacity="0.8"/>
        <text x={w - padR - 6} y={yB - 6} textAnchor="end" fill={COLORS.emerald} fontFamily="Space Mono" fontSize="11">{label}</text>
      </g>
    )
  }

  const renderEMAs = () => (
    <g opacity={overlaysAt}>
      {ema20 && (
        <path d={emaPath(ema20)} stroke={COLORS.cyan} strokeWidth="1.9" strokeDasharray="6 5" fill="none"
              opacity="0.95" filter="url(#sc-glow-cyan)" />
      )}
      {ema9 && (
        <path d={emaPath(ema9)} stroke={COLORS.gold} strokeWidth="1.6" strokeDasharray="3 4" fill="none"
              opacity="0.95" />
      )}
    </g>
  )

  const renderHorizontalLevels = () => (
    <g opacity={overlaysAt}>
      {/* user-supplied horizontal levels */}
      {levels.map((lv, i) => {
        const y = yFromVal(lv.y)
        const color = lv.color || COLORS.violet
        return (
          <g key={`lv-${i}`}>
            <line x1={padL} x2={w - padR} y1={y} y2={y} stroke={color} strokeWidth="1.2" strokeDasharray={lv.dashed === false ? '0' : '5 5'} opacity="0.8"/>
            {lv.label && <text x={padL + 6} y={y - 5} fill={color} fontFamily="Space Mono" fontSize="11">{lv.label}</text>}
          </g>
        )
      })}

      {/* Trigger line */}
      {typeof triggerY === 'number' && (
        <g>
          <line x1={padL} x2={w - padR} y1={yFromVal(triggerY)} y2={yFromVal(triggerY)} stroke={COLORS.gold} strokeWidth="1.7" strokeDasharray="7 5" opacity="0.95" filter="url(#sc-glow-gold)"/>
          <text x={w - padR - 6} y={yFromVal(triggerY) - 6} textAnchor="end" fill={COLORS.gold} fontFamily="Space Mono" fontSize="11" style={{ paintOrder: 'stroke', stroke: COLORS.bg, strokeWidth: 3 }}>{triggerLabel}</text>
        </g>
      )}

      {/* Crowd stop (subtle) */}
      {typeof crowdStopY === 'number' && (
        <g opacity="0.7">
          <line x1={padL} x2={w - padR} y1={yFromVal(crowdStopY)} y2={yFromVal(crowdStopY)} stroke={COLORS.coral} strokeWidth="1.0" strokeDasharray="2 5"/>
          <text x={padL + 6} y={yFromVal(crowdStopY) - 4} fill={COLORS.coral} fontFamily="Space Mono" fontSize="10" opacity="0.85" style={{ paintOrder: 'stroke', stroke: COLORS.bg, strokeWidth: 3 }}>{crowdStopLabel}</text>
        </g>
      )}

      {/* Stop */}
      {typeof stopY === 'number' && (
        <g>
          <line x1={padL} x2={w - padR} y1={yFromVal(stopY)} y2={yFromVal(stopY)} stroke={COLORS.coral} strokeWidth="1.5" strokeDasharray="3 4"/>
          <text x={padL + 6} y={yFromVal(stopY) + 14} fill={COLORS.coral} fontFamily="Space Mono" fontSize="11" style={{ paintOrder: 'stroke', stroke: COLORS.bg, strokeWidth: 3 }}>{stopLabel}</text>
        </g>
      )}

      {/* T1 / T2 chips */}
      {typeof t1Y === 'number' && (
        <g>
          <line x1={padL} x2={w - padR} y1={yFromVal(t1Y)} y2={yFromVal(t1Y)} stroke={COLORS.emerald} strokeWidth="1.2" strokeDasharray="5 4" opacity="0.75"/>
          <ChipLabel x={w - padR - 4} y={yFromVal(t1Y)} text="T1 · 1R" color={COLORS.emerald}/>
        </g>
      )}
      {typeof t2Y === 'number' && (
        <g>
          <line x1={padL} x2={w - padR} y1={yFromVal(t2Y)} y2={yFromVal(t2Y)} stroke={COLORS.emerald} strokeWidth="1.2" strokeDasharray="5 4" opacity="0.75"/>
          <ChipLabel x={w - padR - 4} y={yFromVal(t2Y)} text="T2 · 2R" color={COLORS.emerald}/>
        </g>
      )}
    </g>
  )

  // -------------------------------------------------------------------------------
  // Price (line or candle) with play animation
  // -------------------------------------------------------------------------------
  const renderPrice = () => {
    if (kind === 'candle') {
      return (
        <g>
          {cdata.map((c, i) => {
            const x = xs[i]
            const colW = innerW / Math.max(8, n) * 0.62
            const yO = yFromVal(c.open)
            const yC = yFromVal(c.close)
            const yH = yFromVal(c.high)
            const yL = yFromVal(c.low)
            const top = Math.min(yO, yC)
            const bodyH = Math.max(1.5, Math.abs(yO - yC))
            const color = c.up ? COLORS.emerald : COLORS.coral
            const tBar = (i + 1) / n
            const op = mode === 'play' ? (progress >= tBar ? 1 : 0) : 1
            return (
              <g key={i} opacity={op}>
                <line x1={x} x2={x} y1={yH} y2={yL} stroke={color} strokeWidth="1.1" opacity="0.9"/>
                <rect x={x - colW / 2} y={top} width={colW} height={bodyH} fill={color} stroke={color} strokeWidth="1" rx={1.5} opacity={c.up ? 1 : 0.95}/>
              </g>
            )
          })}
        </g>
      )
    }
    // Line
    const stroke = COLORS.text
    return (
      <g>
        <path
          d={smoothD}
          stroke={stroke}
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={mode === 'play' ? {
            strokeDasharray: pathLen,
            strokeDashoffset: pathLen * (1 - progress),
            transition: 'none',
          } : {}}
          filter="url(#sc-glow-emerald)"
          opacity="0.96"
        />
      </g>
    )
  }

  // -------------------------------------------------------------------------------
  // Markers (dip / enter / dot / exhaust)
  // -------------------------------------------------------------------------------
  const renderMarkers = () => (
    <g opacity={markersAt}>
      {markers.map((m, i) => {
        const idx = Math.max(0, Math.min(n - 1, m.idx ?? 0))
        const x = xs[idx], y = ys[idx]
        const isDip1 = m.kind === 'dip1'
        const isDip2 = m.kind === 'dip2'
        const isEnter = m.kind === 'enter'
        const isExhaust = m.kind === 'exhaust'
        const isFlag = m.kind === 'flag'

        let color = m.color || COLORS.violet
        if (isDip1) color = COLORS.coral
        else if (isDip2) color = COLORS.gold
        else if (isEnter) color = COLORS.emerald
        else if (isExhaust) color = COLORS.coral

        if (isEnter) {
          // Glowing emerald arrow pointing UP into the entry bar from below
          const arrowY = y + 28
          return (
            <g key={i}>
              <line x1={x} x2={x} y1={arrowY - 16} y2={y + 6} stroke={color} strokeWidth="1.4" strokeDasharray="3 3" opacity="0.7"/>
              <path d={`M ${x - 7} ${arrowY} L ${x + 7} ${arrowY} L ${x} ${arrowY - 12} Z`} fill={color} filter="url(#sc-glow-emerald)"/>
              <text x={x} y={arrowY + 14} textAnchor="middle" fontFamily="Oxanium" fontWeight="600" fontSize="11" fill={color}>{m.label || 'Enter'}</text>
            </g>
          )
        }

        if (isFlag) {
          // small flag marker (used for "push 1", "push 2" labels)
          return (
            <g key={i}>
              <rect x={x - 8} y={y - 22} width={16} height={12} rx={2} fill={color} opacity="0.85"/>
              <text x={x} y={y - 13} textAnchor="middle" fontFamily="Oxanium" fontWeight="600" fontSize="10" fill={COLORS.bg}>{m.label}</text>
            </g>
          )
        }

        // Dot marker with label callout (leader line into clear space ABOVE the dot)
        const aboveSpace = y > padT + 36
        const labelY = aboveSpace ? y - 22 : y + 26
        const leaderY = aboveSpace ? y - 8 : y + 8
        return (
          <g key={i}>
            <line x1={x} x2={x} y1={leaderY} y2={labelY + (aboveSpace ? 6 : -6)} stroke={color} strokeDasharray="2 3" opacity="0.55"/>
            <circle cx={x} cy={y} r="6.5" fill={color} stroke={COLORS.bg} strokeWidth="2" filter={isDip2 ? 'url(#sc-glow-gold)' : undefined}/>
            <text
              x={x}
              y={labelY}
              textAnchor="middle"
              fontFamily="Oxanium"
              fontSize="11"
              fontWeight="600"
              fill={color}
              style={{ paintOrder: 'stroke', stroke: COLORS.bg, strokeWidth: 3 }}
            >
              {m.label}
            </text>
          </g>
        )
      })}
    </g>
  )

  // -------------------------------------------------------------------------------
  // Header bar (badges + kind toggle + play)
  // -------------------------------------------------------------------------------
  const showHeader = !!(contextLabel || showKindToggle || playable)
  const playLabel = progress >= 1 && !playing ? 'Replay' : (playing ? 'Playing…' : 'Play')

  return (
    <div className={`card-elev rounded-card p-3 md:p-4 border border-border ${className}`}>
      {showHeader && (
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            {contextLabel && <span className={`pill ${PILL_FOR_CONTEXT[contextColor] || 'pill-violet'}`}>{contextLabel}</span>}
          </div>
          <div className="flex items-center gap-2">
            {showKindToggle && (
              <div className="inline-flex p-0.5 rounded-md border border-border bg-bg" role="tablist" aria-label="Chart type">
                {[
                  { k: 'line', l: 'Line' },
                  { k: 'candle', l: 'Candles' },
                ].map(o => (
                  <button
                    key={o.k}
                    role="tab"
                    aria-selected={kind === o.k}
                    className={`font-display tracking-wide text-[11px] py-1 px-2.5 rounded transition ${kind === o.k ? 'bg-elevated text-textp' : 'text-texts hover:text-textp'}`}
                    onClick={() => setKind(o.k)}
                  >{o.l}</button>
                ))}
              </div>
            )}
            {playable && !reduced && (
              <button
                className="inline-flex items-center gap-1 text-[11px] font-display tracking-wide py-1 px-2.5 rounded border border-border bg-bg text-emerald2 hover:bg-elevated transition"
                onClick={startPlay}
                disabled={playing}
                aria-label={playLabel}
              >
                <Icon name="play" className="w-3 h-3"/>{playLabel}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${w} ${h}`} width="100%" preserveAspectRatio="xMidYMid meet"
             role="img" aria-label={caption || 'Setup chart'}
             style={{ height: 'auto', display: 'block' }}>
          {renderGrid()}
          {renderMeasuredMove()}
          {renderEMAs()}
          {renderHorizontalLevels()}
          {renderPrice()}
          {renderMarkers()}
          {axisLabels && (
            <>
              <text x={padL} y={h - 6} fill={COLORS.textt} fontFamily="Space Mono" fontSize="10">time →</text>
              <text x={w - padR} y={h - 6} textAnchor="end" fill={COLORS.textt} fontFamily="Space Mono" fontSize="10">price ↑</text>
            </>
          )}
        </svg>
      </div>

      {caption && <div className="mt-2 text-texts text-[13px] font-body leading-relaxed">{caption}</div>}
    </div>
  )
}

// ===================================================================================
// Subcomponents
// ===================================================================================
function ChipLabel({ x, y, text, color }) {
  // Right-aligned chip: rectangle behind text
  const padX = 6, padY = 2.5
  const w = (text.length * 6.4) + padX * 2
  return (
    <g transform={`translate(${x - w}, ${y - 8})`}>
      <rect width={w} height={16} rx={4} fill={COLORS.bg} stroke={color} strokeWidth="1" opacity="0.95"/>
      <text x={padX} y={11} fontFamily="Space Mono" fontSize="10" fill={color}>{text}</text>
    </g>
  )
}

// ===================================================================================
// LadderChart — built atop SetupChart's design vocabulary (no parallel system)
// ===================================================================================
export function LadderChart({ entry, riskPts, contracts = 6, animate = false }) {
  const reduced = usePrefersReducedMotion()
  const w = 760, h = 280
  const padL = 40, padR = 28, padT = 18, padB = 28
  const innerH = h - padT - padB

  const stop = entry - riskPts
  const t1 = entry + riskPts
  const t2 = entry + riskPts * 2
  const runner = entry + riskPts * 3
  const min = entry - riskPts * 1.6
  const max = entry + riskPts * 3.6
  const yFor = v => padT + (1 - (v - min) / (max - min)) * innerH

  const [filled, setFilled] = useState(reduced || !animate ? 3 : 0)
  useEffect(() => {
    if (reduced || !animate) { setFilled(3); return }
    let alive = true
    const fill = async () => {
      for (let i = 1; i <= 3; i++) {
        await new Promise(r => setTimeout(r, 500))
        if (!alive) return
        setFilled(i)
      }
    }
    fill()
    return () => { alive = false }
  }, [animate, reduced])

  const replay = () => {
    setFilled(0)
    setTimeout(() => {
      const tick = (k) => {
        if (k > 3) return
        setFilled(k)
        setTimeout(() => tick(k + 1), 500)
      }
      tick(1)
    }, 100)
  }

  return (
    <div className="card-elev rounded-card p-3 md:p-4 border border-border">
      <div className="flex justify-between items-center mb-2">
        <span className="pill pill-emerald">2 / 2 / 2 ladder</span>
        {animate && !reduced && (
          <button onClick={replay} className="inline-flex items-center gap-1 text-[11px] font-display tracking-wide py-1 px-2.5 rounded border border-border bg-bg text-emerald2 hover:bg-elevated transition">
            <Icon name="play" className="w-3 h-3"/>Replay
          </button>
        )}
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="2-2-2 exit ladder" style={{ height: 'auto', display: 'block' }}>
        <defs>
          <linearGradient id="ladder-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0E1428" />
            <stop offset="100%" stopColor="#0B0F1F" />
          </linearGradient>
          <filter id="ladder-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <rect x={padL} y={padT} width={w - padL - padR} height={innerH} fill="url(#ladder-bg)" rx={6}/>

        {/* Level lines */}
        {[
          { val: runner, label: 'Runner — trails 9 EMA → measured move', color: COLORS.violet },
          { val: t2, label: 'T2 = +2R · scale 2', color: COLORS.emerald },
          { val: t1, label: 'T1 = +1R · scale 2 → stop to BE', color: COLORS.emerald },
          { val: entry, label: 'Entry', color: COLORS.text },
          { val: stop, label: 'Stop = −1R · below first dip', color: COLORS.coral },
        ].map((l, i) => (
          <g key={i}>
            <line x1={padL} x2={w - padR} y1={yFor(l.val)} y2={yFor(l.val)}
              stroke={l.color}
              strokeWidth={l.label.startsWith('Entry') ? 1.7 : 1.3}
              strokeDasharray={l.label.startsWith('Entry') ? '0' : '5 5'}
              opacity={l.label.startsWith('Entry') ? 0.95 : 0.78}
              filter={l.label.startsWith('Entry') ? 'url(#ladder-glow)' : undefined}
            />
            <text x={w - padR - 4} y={yFor(l.val) - 5} textAnchor="end" fill={l.color} fontFamily="Space Mono" fontSize="12">{l.label}</text>
            <text x={padL + 4} y={yFor(l.val) + 4} fill={COLORS.texts} fontFamily="Space Mono" fontSize="11">{l.val.toFixed(2)}</text>
          </g>
        ))}

        {/* Contracts column: 2 stop-out (gray), 2 fill T1 (emerald), 2 fill T2 (emerald), 2 runner (violet) */}
        {Array.from({ length: contracts }).map((_, i) => {
          const x = padL + 120 + i * 18
          const baseY = yFor(entry) - 9
          let color = COLORS.border
          let fill = COLORS.panel
          if (i < 2 && filled >= 1) { color = COLORS.emerald; fill = COLORS.emerald }
          else if (i < 4 && filled >= 2) { color = COLORS.emerald; fill = COLORS.emerald }
          else if (i < 6 && filled >= 3) { color = COLORS.violet; fill = COLORS.violet }
          return (
            <rect key={i} x={x} y={baseY} width="12" height="18" rx="2" fill={fill} stroke={color} strokeWidth="1.4" opacity={filled === 0 ? 0.5 : 0.95}/>
          )
        })}
        <text x={padL + 120} y={yFor(entry) + 26} fill={COLORS.textt} fontFamily="Space Mono" fontSize="10">6 contracts: 2 / 2 / 2</text>
      </svg>
    </div>
  )
}

// ===================================================================================
// Backwards-compatible alias so existing imports keep working.
// All consumers should migrate to <SetupChart .../>.
// ===================================================================================
export function ChartFromPath(props) {
  // Translate the legacy markers prop (idx, label, color, anchor) into the new format.
  const markers = (props.markers || []).map(m => ({
    idx: m.idx,
    label: m.label,
    color: m.color,
    kind: m.label?.toLowerCase().includes('dip 1') ? 'dip1'
        : m.label?.toLowerCase().includes('dip 2') || m.label?.toLowerCase().includes('higher low') || m.label?.toLowerCase().includes('lower high') ? 'dip2'
        : m.label?.toLowerCase().includes('entry') || m.label?.toLowerCase().includes('enter') ? 'enter'
        : 'dot',
  }))
  return <SetupChart {...props} markers={markers} />
}

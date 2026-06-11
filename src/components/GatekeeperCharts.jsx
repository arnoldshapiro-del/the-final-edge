// Gatekeeper diagrams — the four canonical pictures for the VWAP + EMA Location Filter.
// Built on SetupChart primitives, same design vocabulary as GalleryCharts.jsx:
//   emerald = with-trend / go        (#1FE0A0)
//   coral   = 200 EMA / walls / no   (#FF5C72)
//   cyan    = 20 EMA                 (#2DD4F0)
//   gold    = 9 EMA / trigger / wait (#FFB347)
//   violet  = session VWAP           (#9B8CFF)

import SetupChart from './SetupChart.jsx'

// ───────────────────────────────────────────────────────────────────────────────
// 1 · The green light — price riding above the full stack + VWAP, flag, trigger
// ───────────────────────────────────────────────────────────────────────────────
export function GateGreenLightChart() {
  return (
    <SetupChart
      values={[30, 44, 58, 62, 56, 52, 58, 66, 72, 80]}
      ema9={[26, 38, 50, 55, 54, 51, 54, 60, 66, 73]}
      ema20={[22, 30, 40, 45, 46, 47, 48, 52, 57, 63]}
      vwap={[20, 24, 28, 31, 33, 35, 37, 39, 41, 43]}
      ema200={[16, 17, 18, 19, 20, 21, 22, 23, 24, 25]}
      labelLines
      triggerY={57}
      triggerLabel="flag trendline (trigger)"
      markers={[
        { idx: 5, kind: 'dip1', label: 'Flag rides the 9/20 — healthy' },
        { idx: 6, kind: 'enter', label: 'Close through the flag line — GO' },
      ]}
      contextLabel="A+ · fully stacked"
      contextColor="emerald"
      caption="The green light. On the 2-minute: price above the 9 EMA, the 9 above the 20, the 20 above the 200, and VWAP below price. Fully stacked — buyers own the session. The flag pulls back to the 9/20 without closing below the 20 or VWAP, and the 2-min close through the flag trendline is the trigger. This is the only neighborhood where the long trigger means anything."
    />
  )
}

// ───────────────────────────────────────────────────────────────────────────────
// 2 · The trap — 15-min inset says HH/HL while the 2-min sits below all four lines
// ───────────────────────────────────────────────────────────────────────────────
export function GateTrapChart() {
  return (
    <div className="card-elev rounded-card p-3 md:p-4 border border-border space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="pill pill-coral">The trap the Gatekeeper exists to stop</span>
        <span className="text-textt text-[11px] font-display tracking-wide">Two charts, one moment</span>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="pill pill-emerald text-[10px]">15-min</span>
          <span className="text-texts text-[12px] font-display tracking-wide">Higher highs &amp; higher lows — structure looks bullish</span>
        </div>
        <SetupChart
          values={[20, 34, 28, 44, 38, 54, 47, 62]}
          axisLabels={false}
          height={150}
        />
      </div>

      <div className="relative">
        <div className="flex items-center gap-2 mb-1">
          <span className="pill pill-coral text-[10px]">2-min</span>
          <span className="text-texts text-[12px] font-display tracking-wide">Same moment — price below VWAP, 9, 20 AND 200</span>
        </div>
        <SetupChart
          values={[44, 38, 30, 25, 29, 26, 31, 28, 33, 30]}
          ema9={[46, 41, 35, 31, 32, 30, 33, 31, 34, 32]}
          ema20={[50, 46, 41, 38, 37, 36, 36, 35, 36, 35]}
          vwap={[58, 56, 54, 52, 51, 50, 49, 48, 48, 47]}
          ema200={[62, 62, 61, 61, 60, 60, 59, 59, 58, 58]}
          labelLines
          markers={[
            { idx: 7, kind: 'dot', label: 'Trap flag — wrong side of the stack', color: '#FF5C72' },
          ]}
          axisLabels={false}
          height={230}
        />
        {/* Diagonal stamp — same treatment as the Do-Not-Trade gallery */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="font-display font-semibold tracking-[0.2em] text-[20px] md:text-[28px] uppercase"
            style={{
              color: 'rgba(255, 92, 114, 0.85)',
              transform: 'rotate(-12deg)',
              border: '3px solid rgba(255, 92, 114, 0.85)',
              padding: '6px 18px',
              borderRadius: 8,
              background: 'rgba(10, 14, 26, 0.55)',
              boxShadow: '0 0 24px rgba(255, 92, 114, 0.35)',
              textShadow: '0 0 12px rgba(255, 92, 114, 0.45)',
            }}
          >
            GATE CLOSED — FLAT
          </div>
        </div>
      </div>

      <p className="text-texts text-[13px] font-body leading-relaxed m-0">
        The 15 and 5 print higher highs and higher lows — structure says "uptrend." But the 2-minute trades below
        VWAP, the 9, the 20 and the 200: sellers own right now. That is a deep pullback or an early reversal — not a
        buy zone. And the "bull flag" forming down there is the same shape with opposite context — viewed from the
        other side it is often the bear flag. No long (gate closed). No short either (you'd be shorting a pullback
        inside an uptrend). Flat is a position.
      </p>
    </div>
  )
}

// ───────────────────────────────────────────────────────────────────────────────
// 3 · The Reclaim Sequence — how red turns green, in three steps
// ───────────────────────────────────────────────────────────────────────────────
export function GateReclaimChart() {
  return (
    <SetupChart
      values={[26, 22, 28, 24, 31, 47, 54, 50, 47.5, 52, 49, 58, 68]}
      vwap={[40, 40, 40, 40, 40, 41, 41, 42, 42, 42, 43, 43, 44]}
      ema200={[45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 46, 46]}
      triggerY={53}
      triggerLabel="flag trendline (trigger)"
      markers={[
        { idx: 6, kind: 'dot', label: '1 · Decisive close above VWAP + 200', color: '#1FE0A0' },
        { idx: 8, kind: 'dot', label: '2 · Pulls back — HOLDS from above', color: '#2DD4F0' },
        { idx: 11, kind: 'enter', label: '3 · First flag after the hold — GO' },
      ]}
      contextLabel="The Reclaim Sequence"
      contextColor="emerald"
      caption="How red turns green. Step 1: a decisive 2-min close above BOTH VWAP and the 200 — not a poke, a close. Step 2: HOLD — price pulls back to those lines and finds support on them from above. Step 3: the FIRST flag after a held reclaim is valid — and often the best trade of the move. Shorts mirror it exactly. This turns waiting into hunting: you know precisely what you are waiting for."
    />
  )
}

// ───────────────────────────────────────────────────────────────────────────────
// 4 · The decision flow — TREND → LOCATION → PATTERN → TRIGGER, with outcomes
// ───────────────────────────────────────────────────────────────────────────────
export function GateDecisionFlow() {
  const C = {
    bg: '#0A0E1A', panel: '#121829', border: '#252C44',
    text: '#E8ECF4', texts: '#9BA6BE', textt: '#5E6884',
    emerald: '#1FE0A0', coral: '#FF5C72', cyan: '#2DD4F0', gold: '#FFB347', violet: '#9B8CFF',
  }
  const w = 760, h = 360
  const boxW = 158, boxH = 88, boxY = 36
  const xs = [22, 209, 396, 583]
  const STAGES = [
    { title: 'TREND', sub: '15/5 structure', line: 'directional permission only', color: C.emerald },
    { title: 'LOCATION', sub: 'the Gatekeeper', line: 'VWAP + 9/20/200 · now or not now', color: C.violet },
    { title: 'PATTERN', sub: 'bull / bear flag', line: 'the only pattern we trade', color: C.cyan },
    { title: 'TRIGGER', sub: '2-min CLOSE', line: 'through the flag trendline', color: C.gold },
  ]
  const flatY = 268
  return (
    <div className="card-elev rounded-card p-3 md:p-4 border border-border">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <span className="pill pill-violet">Trend → Location → Pattern → Trigger</span>
        <span className="text-textt text-[11px] font-display tracking-wide">All four must agree</span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" preserveAspectRatio="xMidYMid meet" role="img"
           aria-label="Decision flow: Trend then Location then Pattern then Trigger. All four must agree or you stay flat."
           style={{ height: 'auto', display: 'block' }}>
        <defs>
          <linearGradient id="gk-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0E1428" />
            <stop offset="100%" stopColor="#0B0F1F" />
          </linearGradient>
          <filter id="gk-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <marker id="gk-arr-e" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={C.emerald} />
          </marker>
          <marker id="gk-arr-c" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={C.coral} />
          </marker>
        </defs>
        <rect x={8} y={8} width={w - 16} height={h - 16} fill="url(#gk-bg)" rx={8} />

        {/* Stage boxes */}
        {STAGES.map((s, i) => (
          <g key={s.title}>
            <rect x={xs[i]} y={boxY} width={boxW} height={boxH} rx={10}
                  fill={C.panel} stroke={s.color} strokeWidth="1.6" />
            <text x={xs[i] + boxW / 2} y={boxY + 24} textAnchor="middle" fill={s.color}
                  fontFamily="Oxanium" fontWeight="700" fontSize="16" letterSpacing="2">{s.title}</text>
            <text x={xs[i] + boxW / 2} y={boxY + 44} textAnchor="middle" fill={C.text}
                  fontFamily="Oxanium" fontWeight="600" fontSize="12">{s.sub}</text>
            <text x={xs[i] + boxW / 2} y={boxY + 64} textAnchor="middle" fill={C.texts}
                  fontFamily="Space Mono" fontSize="9.5">{s.line}</text>
            {/* pass arrow to the next stage */}
            {i < 3 && (
              <g>
                <line x1={xs[i] + boxW + 3} y1={boxY + boxH / 2} x2={xs[i + 1] - 5} y2={boxY + boxH / 2}
                      stroke={C.emerald} strokeWidth="2" markerEnd="url(#gk-arr-e)" />
                <text x={(xs[i] + boxW + xs[i + 1]) / 2} y={boxY + boxH / 2 - 8} textAnchor="middle"
                      fill={C.emerald} fontFamily="Space Mono" fontSize="9.5">agrees</text>
              </g>
            )}
            {/* fail arrow down to the FLAT bar */}
            <line x1={xs[i] + boxW / 2} y1={boxY + boxH + 2} x2={xs[i] + boxW / 2} y2={flatY - 6}
                  stroke={C.coral} strokeWidth="1.4" strokeDasharray="4 4" markerEnd="url(#gk-arr-c)" opacity="0.85" />
          </g>
        ))}

        {/* GO outcome — from TRIGGER */}
        <g>
          <line x1={xs[3] + boxW / 2 + 46} y1={boxY + boxH + 2} x2={xs[3] + boxW / 2 + 46} y2={boxY + boxH + 50}
                stroke={C.emerald} strokeWidth="2.2" markerEnd="url(#gk-arr-e)" filter="url(#gk-glow)" />
          <rect x={xs[3] - 28} y={boxY + boxH + 56} width={boxW + 56} height={50} rx={10}
                fill="rgba(31,224,160,0.10)" stroke={C.emerald} strokeWidth="1.8" filter="url(#gk-glow)" />
          <text x={xs[3] + boxW / 2 + 0} y={boxY + boxH + 77} textAnchor="middle" fill={C.emerald}
                fontFamily="Oxanium" fontWeight="700" fontSize="14" letterSpacing="1">ALL FOUR AGREE → GO</text>
          <text x={xs[3] + boxW / 2 + 0} y={boxY + boxH + 95} textAnchor="middle" fill={C.texts}
                fontFamily="Space Mono" fontSize="9.5">enter at the open of the next candle</text>
        </g>

        {/* Conflict note — the yellow middle outcome */}
        <g>
          <rect x={xs[0]} y={boxY + boxH + 56} width={boxW * 2 + 40} height={50} rx={10}
                fill="rgba(255,179,71,0.07)" stroke={C.gold} strokeWidth="1.4" />
          <text x={xs[0] + (boxW * 2 + 40) / 2} y={boxY + boxH + 77} textAnchor="middle" fill={C.gold}
                fontFamily="Oxanium" fontWeight="600" fontSize="12.5">CONFLICT — 15/5 bullish, 2-min below VWAP/200</text>
          <text x={xs[0] + (boxW * 2 + 40) / 2} y={boxY + boxH + 95} textAnchor="middle" fill={C.texts}
                fontFamily="Space Mono" fontSize="9.5">no long AND no short — wait for the Reclaim Sequence</text>
        </g>

        {/* FLAT bar */}
        <rect x={22} y={flatY} width={w - 44} height={56} rx={10}
              fill="rgba(255,92,114,0.08)" stroke={C.coral} strokeWidth="1.6" />
        <text x={w / 2} y={flatY + 24} textAnchor="middle" fill={C.coral}
              fontFamily="Oxanium" fontWeight="700" fontSize="15" letterSpacing="1.5">ANY LAYER DISAGREES → FLAT</text>
        <text x={w / 2} y={flatY + 43} textAnchor="middle" fill={C.texts}
              fontFamily="Space Mono" fontSize="10.5">three positions exist: long, short, and flat — FLAT IS A POSITION</text>
      </svg>
      <p className="text-texts text-[13px] font-body leading-relaxed mt-2 mb-0">
        The upgraded sequence. TREND (15/5 structure) grants directional permission only. LOCATION (the Gatekeeper)
        decides "now, or not now." PATTERN is the flag — the only pattern we trade. TRIGGER is the 2-min close through
        the flag trendline. All four must agree; neither the 15/5 nor the 2-min overrides the other.
      </p>
    </div>
  )
}

// ───────────────────────────────────────────────────────────────────────────────
// The cheat sheet — one compact card, sized for a phone screen
// ───────────────────────────────────────────────────────────────────────────────
export function GateCheatSheet() {
  return (
    <div className="card p-4 max-w-sm mx-auto" style={{ borderColor: 'rgba(155,140,255,0.45)' }}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="pill pill-violet text-[10px]">THE GATEKEEPER · cheat sheet</span>
        <span className="font-mono text-textt text-[10px]">2-min chart</span>
      </div>

      <div className="rounded-lg border border-emerald2/40 bg-emerald2/5 p-3 mb-2">
        <p className="font-display font-semibold text-emerald2 text-[12px] tracking-wide uppercase m-0">Long gate — ALL required</p>
        <ul className="m-0 mt-1 pl-4 space-y-0.5 text-[12.5px] text-textp list-disc marker:text-emerald2">
          <li>15/5: higher highs &amp; higher lows</li>
          <li>Price above VWAP</li>
          <li>Above the 9 EMA</li>
          <li>Above the 20 EMA — and the 20 rising</li>
          <li>Above the 200 EMA</li>
          <li>Runway clear — no VWAP/200 wall before T1</li>
        </ul>
        <p className="font-mono text-emerald2 text-[10.5px] m-0 mt-1">A+ = fully stacked: 9 &gt; 20 &gt; 200, VWAP below price</p>
      </div>

      <div className="rounded-lg border border-coral/40 bg-coral/5 p-3 mb-2">
        <p className="font-display font-semibold text-coral text-[12px] tracking-wide uppercase m-0">Short gate — exact mirror</p>
        <ul className="m-0 mt-1 pl-4 space-y-0.5 text-[12.5px] text-textp list-disc marker:text-coral">
          <li>15/5: lower highs &amp; lower lows</li>
          <li>Below VWAP · below the 9</li>
          <li>Below the 20 — and the 20 falling</li>
          <li>Below the 200 · runway clear below</li>
        </ul>
        <p className="font-mono text-coral text-[10.5px] m-0 mt-1">A+ = stacked 9 &lt; 20 &lt; 200</p>
      </div>

      <div className="rounded-lg border border-gold/40 bg-gold/5 p-3 mb-2">
        <p className="font-display font-semibold text-gold text-[12px] tracking-wide uppercase m-0">Flat when (any one)</p>
        <ul className="m-0 mt-1 pl-4 space-y-0.5 text-[12.5px] text-textp list-disc marker:text-gold">
          <li>Any single gate item misses — gate closed</li>
          <li>Conflict: 15/5 up but 2-min below VWAP/200 — no long, no short</li>
          <li>Chop tells: 9/20 braided flat · flat VWAP · price crossing VWAP repeatedly (~30 min) · the squeeze · failed breaks both ways</li>
          <li>Wall between entry and T1 (Runway Rule)</li>
        </ul>
        <p className="font-mono text-gold text-[10.5px] m-0 mt-1">FLAT IS A POSITION</p>
      </div>

      <div className="rounded-lg border border-cyan2/40 bg-cyan2/5 p-3">
        <p className="font-display font-semibold text-cyan2 text-[12px] tracking-wide uppercase m-0">Reclaim Sequence (red → green)</p>
        <ol className="m-0 mt-1 pl-4 space-y-0.5 text-[12.5px] text-textp list-decimal marker:text-cyan2">
          <li>Decisive 2-min CLOSE above BOTH VWAP + 200</li>
          <li>HOLD — pullback finds support on them from above</li>
          <li>FIRST flag after the held reclaim is valid — often the best trade of the move</li>
        </ol>
        <p className="font-mono text-cyan2 text-[10.5px] m-0 mt-1">Shorts mirror it · never anticipate the reclaim</p>
      </div>
    </div>
  )
}

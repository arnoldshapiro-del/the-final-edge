// Visual Library content — Setup Gallery (G1-G10), Candle Anatomy, Do-Not-Trade.
// All rendered via the SetupChart engine. Each entry: { id, title, caption, render() }.

import SetupChart, { LadderChart } from './components/SetupChart.jsx'
import { DoNotChart, StructureTrailChart, MultiTimeframeChart, StopHuntChart } from './components/GalleryCharts.jsx'

export const SETUP_GALLERY = [
  {
    id: 'g1',
    title: 'G1 · The long entry — bull flag, trendline trigger',
    caption: 'A with-trend BULL FLAG. The pullback prints lower highs against a descending trendline while holding above the prior swing low — A-grade when the flag low holds at or near the 20 EMA (full size), B-grade when it pokes below the 20 but holds above both gates (half size or pass). LOCATION (the Gatekeeper, Lesson 3) must agree at the entry candle\'s close: this entry exists only with the 2-min above BOTH Location Gates — session VWAP and the 200 EMA — and the identical shape below the gates is a trap flag, a NO-trade. The TRIGGER, and the only trigger, is the FIRST 2-min candle that CLOSES above the DESCENDING 2-min trendline (the diagonal connecting those lower highs — shown here as a horizontal level for clarity; in practice it slopes down to where price breaks through). Confirming candle ideally bullish engulfing or dragonfly. ENTER at the open of the next candle. STOP — TWO STEPS: tentative 4-6 ticks beyond the broken trendline (the trendline level itself at the break — not below the breakout candle\'s close), then FINAL just past the STRUCTURE (the swing low at the bottom of the pullback).',
    render: () => (
      <SetupChart
        values={[18, 36, 56, 44, 56, 48, 62, 76]}
        ema20={[16, 24, 32, 34, 40, 42, 48, 56]}
        ema9={[18, 30, 44, 40, 50, 46, 58, 70]}
        triggerY={56}
        triggerLabel="2-min trendline (entry trigger)"
        markers={[
          { idx: 3, kind: 'dip1', label: 'Pullback low' },
          { idx: 5, kind: 'dip2', label: 'Higher low' },
          { idx: 6, kind: 'enter', label: 'First close above 2-min trendline — ENTER' },
        ]}
        stopY={38}
        crowdStopY={42}
        stopLabel="Final stop — at the structure (pullback swing low)"
        t1Y={64}
        t2Y={72}
        showKindToggle
        playable
        contextLabel="2-min · 15-min HH/HL"
        contextColor="emerald"
      />
    ),
  },
  {
    id: 'g2',
    title: 'G2 · The short entry — BEAR FLAG, trendline trigger',
    caption: 'A with-trend BEAR FLAG — exact mirror of the bull flag. PERMISSION (MANDATORY): 15-minute AND 5-minute downtrends — lower highs AND lower lows. LOCATION (the Gatekeeper, Lesson 3): at the entry candle\'s close the 2-min must be below BOTH Location Gates — session VWAP and the 200 EMA — and a bear flag above the gates is the trap-flag mirror, a NO-trade. Pole = sharp drop. Flag = price drifting UP on lighter volume in a small rising channel against the downtrend; the bounce prints higher lows while holding below the prior swing high — A-grade when the bounce holds at/near the 20 from below. DEFINING BOUNDARY = the ASCENDING trendline connecting those HIGHER LOWS (the lower edge of the rising flag). TRIGGER = FIRST 2-min candle that CLOSES BELOW the ascending trendline. Enter short at the open of the next candle. STOP — TWO STEPS: tentative 4-6 ticks ABOVE the broken trendline (the trendline level itself at the break — not above the breakout candle\'s close), then FINAL just past the STRUCTURE (the swing HIGH at the top of the bounce). TIME STOP IS TIGHTER: 2 candles (4 minutes), not 3 — bear flags work fast or they fail.',
    render: () => (
      <SetupChart
        values={[82, 64, 44, 56, 44, 52, 38, 24]}
        ema20={[84, 76, 68, 66, 60, 58, 52, 44]}
        ema9={[82, 70, 56, 60, 50, 54, 42, 30]}
        triggerY={44}
        triggerLabel="2-min trendline (entry trigger)"
        markers={[
          { idx: 3, kind: 'dip1', label: 'Bounce high' },
          { idx: 5, kind: 'dip2', label: 'Lower high' },
          { idx: 6, kind: 'enter', label: 'First close below 2-min trendline — ENTER' },
        ]}
        stopY={62}
        crowdStopY={58}
        stopLabel="Final stop — at the structure (bounce swing high)"
        t1Y={36}
        t2Y={28}
        showKindToggle
        playable
        contextLabel="2-min · 15-min LH/LL"
        contextColor="coral"
      />
    ),
  },
  {
    id: 'g3',
    title: 'G3 · Three timeframes, three jobs',
    caption: '15 says IF; 5 and 2 say WHEN and WHERE. Same pullback moment, viewed from each timeframe.',
    render: () => <MultiTimeframeChart />,
  },
  {
    id: 'g4',
    title: 'G4 · The 20 EMA grade — A-grade vs VOID',
    caption: 'A-grade: shallow flag, the low holds at/near the 20 → full size permitted. VOID: the pullback gives back more than half the pole (or a 2-min candle CLOSES below the 200/VWAP during the flag) → not a flag, no trade. In between sits B-grade: a poke below the 20 that holds above both gates → half size or pass.',
    render: () => (
      <div className="grid md:grid-cols-2 gap-3">
        <SetupChart
          values={[18, 32, 48, 40, 48, 44, 58, 70]}
          ema20={[16, 22, 30, 32, 36, 38, 44, 52]}
          markers={[{ idx: 3, kind: 'dot', label: 'Holds the 20 — A-grade', color: '#2DD4F0' }]}
          contextLabel="A-GRADE · full size"
          contextColor="emerald"
          height={240}
          axisLabels={false}
        />
        <SetupChart
          values={[28, 44, 58, 38, 26, 20, 22, 24]}
          ema20={[24, 30, 38, 38, 34, 30, 28, 26]}
          markers={[{ idx: 4, kind: 'dot', label: 'Gave back >½ the pole — VOID', color: '#FF5C72' }]}
          contextLabel="VOID · no trade"
          contextColor="coral"
          height={240}
          axisLabels={false}
        />
      </div>
    ),
  },
  {
    id: 'g5',
    title: 'G5 · The 2-2-2 ladder',
    caption: 'Entry. T1 (1R): scale 2 → stop tucks 4–6 ticks under the newest 2-min swing low. T2 (2R): scale 2. Runner trails the 9 EMA up to the measured-move target. The stop only ever tightens.',
    render: () => <LadderChart entry={100} riskPts={3} animate />,
  },
  {
    id: 'g6',
    title: 'G6 · Stop vs the crowd',
    caption: 'A liquidity grab takes out the crowd stops just below the obvious pullback low. Yours, anchored a few ticks past the structure, survives — and the move reverses.',
    render: () => <StopHuntChart />,
  },
  {
    id: 'g7',
    title: 'G7 · The trendline close is the entry — nothing before it counts',
    caption: 'The pullback forming and making lower highs is the shape of the setup — but it is not the entry. Do NOT enter on the shape. Do NOT enter on a "price trigger." Wait for the 2-min candle to CLOSE above the descending trendline — that close is your one and only trigger. (And the trigger only counts where the Gatekeeper is open: at that candle\'s close, price above BOTH gates — session VWAP and the 2-min 200 EMA — for longs. A perfect trigger in the wrong location is still a no-trade.)',
    render: () => (
      <SetupChart
        values={[20, 36, 54, 44, 54, 48, 60, 72]}
        triggerY={54}
        triggerLabel="2-min trendline (entry trigger)"
        markers={[
          { idx: 3, kind: 'dip1', label: 'Pullback low' },
          { idx: 5, kind: 'dip2', label: 'Higher low' },
          { idx: 6, kind: 'enter', label: 'First close above 2-min trendline — ENTER' },
        ]}
        contextLabel="Trendline close = the only trigger"
        contextColor="gold"
      />
    ),
  },
  {
    id: 'g8',
    title: 'G8 · Anatomy of a trend — the pullback count',
    caption: 'Flag #1 after the gates turn green: full size — the highest-probability trade of the leg. Flag #2: A-grade only (its breakout is the leg\'s third push, the last reliable one). Flag #3: NO TRADE, ever — three pushes form a wedge, and the third flag is where reversal traders enter. The count resets when price tags VWAP or the 2-min 200 EMA and a fresh setup forms, or at a new session. Climactic bar + deep pullback = exhaustion either way. Stop.',
    render: () => (
      <SetupChart
        values={[16, 32, 28, 48, 44, 64, 60, 78, 72, 92, 76]}
        ema20={[14, 20, 26, 30, 36, 42, 48, 54, 60, 66, 70]}
        markers={[
          { idx: 1,  kind: 'flag', label: '1' },
          { idx: 3,  kind: 'flag', label: '2' },
          { idx: 5,  kind: 'flag', label: '3' },
          { idx: 7,  kind: 'flag', label: '4' },
          { idx: 9,  kind: 'flag', label: '5', color: '#FF5C72' },
          { idx: 10, kind: 'exhaust', label: 'Exhaustion · stop', color: '#FF5C72' },
        ]}
        contextLabel="Pushes 1 → 5"
        contextColor="violet"
      />
    ),
  },
  {
    id: 'g9',
    title: 'G9 · The structure trail',
    caption: 'The instant T1 fills, the stop tucks 4–6 ticks under the most recent 2-minute swing low — never at entry — and ratchets behind each new swing until the trade is done.',
    render: () => <StructureTrailChart />,
  },
  {
    id: 'g10',
    title: 'G10 · Measured move',
    caption: 'Prior leg (the flagpole) projected from entry = the runner\'s target.',
    render: () => (
      <SetupChart
        values={[20, 22, 36, 50, 64, 60, 58, 62, 76, 86]}
        ema9={[20, 24, 32, 42, 52, 56, 56, 58, 66, 76]}
        markers={[
          { idx: 1, kind: 'dot', label: 'Flagpole low', color: '#9B8CFF' },
          { idx: 4, kind: 'dot', label: 'Flagpole high', color: '#9B8CFF' },
          { idx: 6, kind: 'enter', label: 'Entry' },
        ]}
        measuredMove={{ fromY: 22, toY: 64, projectFromY: 58, label: 'Measured move target' }}
        contextLabel="Measured move"
        contextColor="violet"
      />
    ),
  },
]

export const CANDLE_GALLERY = [
  {
    id: 'c-be', title: 'Bullish engulfing',
    grade: 'A+', side: 'long', color: 'emerald',
    meaning: 'A bigger up bar fully engulfs the prior down bar — buyers overwhelmed sellers at the trendline close. The confirming candle at the pullback low.',
    candle: { open: 30, close: 80, high: 84, low: 26, up: true, priorOpen: 60, priorClose: 36, priorHigh: 62, priorLow: 32 },
  },
  {
    id: 'c-df', title: 'Dragonfly doji',
    grade: 'A+', side: 'long', color: 'emerald',
    meaning: 'Open ≈ close at the top, long lower wick — sellers tried, buyers rejected the low. Strong pullback-low signal at the trendline close.',
    candle: { open: 70, close: 70.5, high: 71, low: 30, up: true },
  },
  {
    id: 'c-ms', title: 'Morning star (3-bar)',
    grade: 'Strong', side: 'long', color: 'gold',
    meaning: 'Big down bar → small indecision bar → big up bar. Three-bar reversal that confirms at the trendline close. Rare. Take it if seen.',
    isThree: true,
  },
  {
    id: 'c-bge', title: 'Bearish engulfing',
    grade: 'A+ (shorts)', side: 'short', color: 'coral',
    meaning: 'A bigger down bar engulfs the prior up bar — sellers overwhelmed buyers at the trendline close. The confirming candle at the bounce high.',
    candle: { open: 75, close: 25, high: 80, low: 22, up: false, priorOpen: 35, priorClose: 60, priorHigh: 63, priorLow: 33 },
  },
  {
    id: 'c-wd', title: 'Weak / star doji',
    grade: 'Low conviction', side: 'either', color: 'violet',
    meaning: 'Small body, no clear rejection. The structure may be valid but the candle doesn\'t agree. Smaller or skip.',
    candle: { open: 52, close: 50, high: 56, low: 46, up: false },
  },
]

export const DONT_TRADE_GALLERY = [
  {
    id: 'd1',
    title: 'Counter-trend long attempt (in a downtrend)',
    why: 'Trying to buy inside a downtrend. Counter-trend trades fight momentum. Skip.',
    render: () => <DoNotChart values={[70,55,42,40,44,41,42,46]} ctx="DOWNTREND" ctxColor="coral" />,
  },
  {
    id: 'd2',
    title: 'Counter-trend short attempt (in an uptrend)',
    why: 'Trying to sell into a healthy uptrend. With-trend only. Never short an uptrend.',
    render: () => <DoNotChart values={[20,40,60,50,60,55,52,48]} ctx="UPTREND" ctxColor="emerald" tops={[2,4]} />,
  },
  {
    id: 'd3',
    title: 'Head & shoulders',
    why: 'Famous, romantic, and not our edge. We don\'t call reversals.',
    render: () => <DoNotChart values={[30,42,50,42,62,42,48,38]} ctx="reversal pattern" ctxColor="muted" tops={[2,4,6]} />,
  },
  {
    id: 'd4',
    title: 'Symmetrical triangle',
    why: 'Bilateral pattern — 50/50 outcome. We don\'t trade coin flips.',
    render: () => <DoNotChart values={[30,60,40,55,42,52,44,50]} ctx="bilateral" ctxColor="muted" />,
  },
  {
    id: 'd5',
    title: 'Trading range',
    why: 'No trend = no permission. Sitting out IS the trade.',
    render: () => <DoNotChart values={[48,42,54,43,53,44,53,45]} ctx="range" ctxColor="muted" />,
  },
  {
    id: 'd6',
    title: 'Standalone candle, no context',
    why: 'A great candle in the wrong context is worse than a mediocre one in the right context.',
    render: () => <DoNotChart values={[55, 50, 45, 40, 35, 30, 36, 33]} ctx="no trend context" ctxColor="muted" highlight={[5]} />,
  },
]

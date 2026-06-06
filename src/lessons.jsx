import { ChartFromPath, LadderChart } from './components/Charts.jsx'

// Each lesson: { id, n, title, oneLine, render() -> JSX, lockIt }
// Body uses .prose-edge CSS for typography (Inter).

export const LESSONS = [
  {
    id: 'l1',
    n: 1,
    title: 'The One Edge',
    oneLine: 'One setup. With the trend. Reps until it\'s reflex.',
    lockIt: 'Buy pullbacks in an uptrend. Sell rallies in a downtrend. With the trend, never against it. When unclear — sit out.',
    render: () => (
      <div className="prose-edge">
        <p><strong>The rule.</strong> Buy pullbacks in an uptrend; sell rallies in a downtrend; trade <em>with the trend</em>, never against it; when unclear, sit out.</p>
        <p><strong>Why 5.5 years hurt.</strong> You traded reversals — double tops, double bottoms — and you fought the trend. Counter-trend trading fights <em>momentum</em>, the strongest force on the chart. And the stop sat in front of the crowd, where it was hunted before the move could breathe.</p>
        <p><strong>Why mentors (80%) and Al Brooks win where you didn't.</strong> The candle was never the edge — the <em>context</em> was. They unconsciously filter which signals to take, a filter built over thousands of with-trend reps. Brooks's "second entry" is a <em>with-trend</em> tool you were using <em>against</em> the trend. The candle they read was confirming the trend, not predicting a reversal of it.</p>
        <p><strong>The fix.</strong> One setup. With the trend. Entered on the second push. Stop behind the crowd. Repeat until it's reflex.</p>
        <p>The next nine lessons are this single edge, broken into its working parts. Master each. Then drill them in the Trainer until you don't think — you see.</p>
      </div>
    ),
  },

  {
    id: 'l2',
    n: 2,
    title: 'The Multi-Timeframe Gate',
    oneLine: '15 says IF. 5 and 2 say WHEN and WHERE.',
    lockIt: '15-min decides IF you trade. 5-min is WHERE the pullback forms. 2-min gives the trigger.',
    render: () => (
      <div className="prose-edge">
        <p><strong>Three timeframes. Three jobs.</strong></p>
        <ul>
          <li><strong>15-min — IF.</strong> The 15-min decides if you trade at all. For longs it MUST be making <em>higher highs AND higher lows</em>. A lower high, or a broken swing low on the 15-min, is a hard <em>no long</em>. This is a gate, not a suggestion.</li>
          <li><strong>5-min — WHERE.</strong> The 5-min is where the pullback appears. It is <em>allowed</em> to pull back — that's the setup forming. The only rule on the 5-min: the pullback must <em>not</em> break below the prior 5-min swing low. If it does, the structure is broken.</li>
          <li><strong>2-min — WHEN.</strong> The 2-min gives the trigger: the dip-bounce-dip and the entry candle.</li>
        </ul>
        <p>The mantra. Carry it into every chart you open:</p>
        <p className="text-center font-display text-xl tracking-wide text-emerald2 text-glow-emerald my-4">"15 says <em>IF</em>; 5 and 2 say <em>WHEN</em> and <em>WHERE</em>."</p>
        <p>If the 15-min is sideways — no trend at all — <em>none</em> of the lower timeframes matter. Sitting out is the trade.</p>
      </div>
    ),
  },

  {
    id: 'l3',
    n: 3,
    title: 'The Entry, Step by Step',
    oneLine: 'Dip 1 → bounce → Dip 2 (higher low) → close above trigger.',
    lockIt: 'Wait for the second dip. Enter on a 2-min CLOSE above the trigger line. Never jump early.',
    render: () => (
      <div className="prose-edge space-y-4">
        <p>This is the flagship setup. Long version — shorts are the mirror image.</p>
        <ol className="list-decimal pl-5 space-y-1 marker:text-violet2">
          <li><strong>15-min HH/HL confirmed.</strong> The gate is open.</li>
          <li><strong>Price pulls back on the 2-min: Dip 1.</strong> The crowd watches the low.</li>
          <li><strong>Price bounces.</strong> The bounce high is the <em>trigger line</em> — the same spot you used to mistakenly call the "neckline."</li>
          <li><strong>Price dips again to a HIGHER LOW: Dip 2.</strong> This is the second entry. The first bounce was the bait — skip it.</li>
          <li><strong>ENTRY.</strong> A 2-min candle <em>closes</em> above the trigger line. Buy.</li>
        </ol>
        <p>Wait for the close. Never jump on a wick. Never anticipate. The close is the contract.</p>

        <ChartFromPath
          values={[20, 38, 56, 46, 56, 50, 64, 76]}
          triggerY={56}
          triggerLabel="Trigger line"
          markers={[
            { idx: 3, label: 'Dip 1', color: '#FF5C72' },
            { idx: 5, label: 'Dip 2 (higher low)', color: '#FFB347' },
            { idx: 6, label: 'Entry (close above trigger)', color: '#1FE0A0' },
          ]}
          stopY={42}
          stopLabel="Stop (a few ticks below Dip 1)"
          caption="The flagship 2-min picture. Dip 1, bounce up through the trigger, second dip that holds higher, entry candle closes above the trigger. Stop sits below the first dip."
          contextLabel="2-min trigger chart · 15-min HH/HL"
          contextColor="emerald"
        />

        <p>Five years of false starts came from steps 2 and 4. You acted on the first bounce, and you acted before the close. From now on: <em>second dip, then close, then buy</em>. Anything less is not the setup.</p>
      </div>
    ),
  },

  {
    id: 'l4',
    n: 4,
    title: 'The 20 EMA & 9 EMA',
    oneLine: '20 = health filter. 9 = runner trail.',
    lockIt: 'A healthy pullback holds near/above the 20 EMA. The 9 EMA only trails the runner — it is NOT a separate strategy.',
    render: () => (
      <div className="prose-edge space-y-4">
        <p><strong>The 20 EMA — your health filter.</strong> A healthy pullback in an uptrend holds near or just above the 20 EMA. A pullback that knifes well <em>below</em> the 20 EMA and stays there isn't a pullback — it's a change of character. Stand aside.</p>
        <p>You do <em>not</em> need two bounces off the EMA. Every normal pullback gives you the dip-bounce-dip. The EMA's only job is to tell you whether the pullback is healthy.</p>
        <p><strong>The 9 EMA — your runner's trail.</strong> The 9 EMA is momentum context, and the line behind which your runner trails. It is <em>not</em> a separate strategy. You don't fade it, ride it, or wait for "9 EMA crosses." The decision line is the 20.</p>

        <ChartFromPath
          values={[18, 30, 44, 38, 50, 44, 58, 70]}
          ema20={[16, 22, 30, 32, 38, 40, 46, 54]}
          ema9={[18, 28, 40, 38, 46, 44, 54, 66]}
          markers={[
            { idx: 3, label: 'Pullback holds 20 EMA = healthy', color: '#2DD4F0', anchor: 'start' },
          ]}
          caption="Cyan dashed = 20 EMA (health). Gold dashed = 9 EMA (runner trail). The pullback holds the 20 EMA → green light to look for Dip 2."
          contextLabel="Healthy pullback"
          contextColor="cyan"
        />

        <ChartFromPath
          values={[30, 48, 60, 42, 32, 26, 30, 35]}
          ema20={[26, 32, 40, 40, 38, 34, 32, 32]}
          markers={[
            { idx: 4, label: 'Knifed BELOW 20 → stand aside', color: '#FF5C72', anchor: 'start' },
          ]}
          caption="Same outline of price, very different story. This pullback knifed well below the 20 EMA and stayed there. Change of character. Skip."
          contextLabel="Unhealthy — character change"
          contextColor="coral"
        />
      </div>
    ),
  },

  {
    id: 'l5',
    n: 5,
    title: 'Candles Are the Grade, Not the Signal',
    oneLine: 'Candle = GO/NO-GO and conviction. Same size every trade.',
    lockIt: 'A+ (bullish engulfing / dragonfly) → take confidently. Strong (morning star) → take if seen. Weak/none → smaller or skip.',
    render: () => (
      <div className="prose-edge space-y-4">
        <p>Never trade a candle alone. At Dip 2 the candle <em>grades</em> the entry. It doesn't <em>create</em> the entry; the context did that.</p>
        <ul>
          <li><strong>A+.</strong> Bullish engulfing or dragonfly doji at Dip 2. Take confidently.</li>
          <li><strong>Strong (but rare).</strong> Morning star. Take it if you see it. Don't hunt for it.</li>
          <li><strong>Lowest conviction.</strong> Weak rejection, plain star doji, or no clear rejection. Smaller, or skip.</li>
        </ul>
        <p><strong>The candle is a GO/NO-GO filter and a confidence cue.</strong> It is <em>not</em> a size dial. Same number of contracts every trade. Sizing variance is how good systems become bad systems.</p>
        <p>Your mentor reads candles brilliantly because his unconscious already filtered the trend. Repurpose that skill: grade <em>with-trend second entries</em>, never call reversals. The same candle that fails at a counter-trend top fires beautifully at a with-trend pullback. <em>Context</em>, not candle.</p>
      </div>
    ),
  },

  {
    id: 'l6',
    n: 6,
    title: 'The Stop — Behind the Crowd',
    oneLine: 'A few ticks below the FIRST dip. Lower than the obvious level.',
    lockIt: 'The stop goes below the first (lower) dip, a few ticks LOWER than where everyone else puts theirs. Mechanical. Same every time.',
    render: () => (
      <div className="prose-edge space-y-4">
        <p>This single rule is the difference between getting stopped at the low tick of the move and surviving the hunt.</p>
        <p><strong>Where.</strong> Below the first dip — the lower of the two. Place it a few ticks <em>lower</em> than the obvious level the crowd uses.</p>
        <p><strong>Why.</strong> The market hunts the obvious stop. Sitting a few ticks behind the crowd puts you behind the hunt, not its first target. Wider-but-behind beats tighter-and-clipped.</p>
        <p><strong>How.</strong> Mechanical. Same placement every trade. No judging liquidity sweeps live, no nudging it in, no "feel." The discretion is in <em>whether</em> you take the trade — not in where the stop goes.</p>
        <ChartFromPath
          values={[22, 40, 56, 44, 56, 48, 62, 72]}
          markers={[
            { idx: 3, label: 'Dip 1 (the lower dip)', color: '#FF5C72' },
            { idx: 5, label: 'Dip 2', color: '#FFB347' },
          ]}
          stopY={37}
          stopLabel="Stop — a few ticks below Dip 1"
          caption="The stop sits below the first dip, lower than the obvious level. You are behind the crowd, not in front of it."
          contextLabel="Where the stop goes"
          contextColor="coral"
        />
      </div>
    ),
  },

  {
    id: 'l7',
    n: 7,
    title: 'The Exits — 2/2/2',
    oneLine: 'T1 = 1R. T2 = 2R. Runner trails the 9 EMA. T1 hit → stop to BE.',
    lockIt: 'Trade 6 contracts. 2 at T1 (1R). 2 at T2 (2R). 2 as the runner. T1 fills → stop moves to breakeven. Trade can no longer lose.',
    render: () => (
      <div className="prose-edge space-y-4">
        <p>Six contracts. Three pairs. One simple ladder.</p>
        <ul>
          <li><strong>2 at T1.</strong> +1R. The first pair locks in proof.</li>
          <li><strong>2 at T2.</strong> +2R. The middle pair takes the meat.</li>
          <li><strong>2 as the runner.</strong> Trails the 9 EMA. Sometimes does nothing. Sometimes pays for the week.</li>
          <li><strong>T1 hits → stop to breakeven.</strong> Immediately. Not "after the candle closes," not "after a second confirmation." The instant the fill hits, the trade is risk-off. It can no longer lose.</li>
        </ul>
        <p><strong>R:R is a glance, not a calculation.</strong> T1 is 1R by definition. Before entry, the only question is: <em>is there room above to reach my targets before obvious resistance?</em> Yes → take it. No → skip. You don't compute ratios on the fly.</p>
        <LadderChart entry={100} riskPts={3} />
      </div>
    ),
  },

  {
    id: 'l8',
    n: 8,
    title: 'Sizing, Pushes & Discipline',
    oneLine: 'Fixed 6. Don\'t count pushes. Get pickier as the trend ages.',
    lockIt: 'Fixed 6 contracts. No variable sizing (yet). No adding to winners (yet). Trade while the 15-min makes HH/HL. Get pickier as pushes age.',
    render: () => (
      <div className="prose-edge space-y-4">
        <p><strong>Fixed 6.</strong> Same size every trade. No conviction-based sizing yet — that is a graduate-level adjustment, not a starter rule.</p>
        <p><strong>No adding to a winner. No pyramiding.</strong> Not yet. A fresh, separate, valid setup later in the day is a <em>new</em> trade — that's fine. Adding to an existing trade is not.</p>
        <p><strong>How many pushes?</strong> Don't count to a number. Trade while the 15-min keeps making HH/HL. On the third, fourth, fifth push: get pickier — A+ only. Watch for exhaustion: smaller pushes, deeper pullbacks, climactic bars. Stop when the 15-min breaks structure or exhaustion shows.</p>
        <p><strong>Circuit breaker.</strong> Set a max trades per session and a max loss per session. When either is hit, the day is done. The cockpit will enforce it for you. The rule of trading isn't to win every day — it's to be there for the easy days.</p>
      </div>
    ),
  },

  {
    id: 'l9',
    n: 9,
    title: 'What We Do NOT Trade',
    oneLine: 'No reversals. No ranges. No standalone candles.',
    lockIt: 'No double tops/bottoms, head & shoulders, triple tops, wedges, V-reversals. No symmetrical triangles, ranges, broadening. No standalone candle trades.',
    render: () => (
      <div className="prose-edge space-y-4">
        <p>Discipline is partly knowing what to do. It is mostly knowing what <em>not</em> to do.</p>
        <ul>
          <li><strong>No reversals against the trend.</strong> No double tops, double bottoms, head &amp; shoulders, triple tops, wedges, V-reversals. These are the trades that bled the last five years. They look brilliant on losers' charts and on traders' regret tweets.</li>
          <li><strong>No bilateral / neutral patterns.</strong> No symmetrical triangles, ranges, broadening formations. Bilateral patterns have a 50/50 outcome. We don't trade coin flips.</li>
          <li><strong>No standalone candle trades.</strong> A great candle in the wrong context is a worse trade than a mediocre candle in the right context.</li>
        </ul>
        <p>When the 15-min is sideways and going nowhere, <em>sitting out is the trade</em>. You will lose months of P&amp;L in a sideways tape if you force trades. The market gives a trend most days, sometimes after lunch, sometimes for ten minutes. Be there for those windows. Skip the rest.</p>
      </div>
    ),
  },

  {
    id: 'l10',
    n: 10,
    title: 'Going Live — The Right Way',
    oneLine: 'Sim → green by rule → 1 micro → scale slowly.',
    lockIt: 'Go live only when net green in sim AND every trade followed the checklist. Start at 1 micro. Scale only after disciplined real-money green stretches.',
    render: () => (
      <div className="prose-edge space-y-4">
        <p><strong>The three weeks is a deadline to groove this — not a promise to go live.</strong> Treat it as a deadline by which to be <em>ready</em>. Going live is the reward for readiness, not the goal of the calendar.</p>
        <p><strong>Go live only when:</strong></p>
        <ul>
          <li>Net green in sim on this exact system, over a meaningful sample.</li>
          <li>Every trade followed the 7-step checklist (high rule-adherence %).</li>
        </ul>
        <p><strong>Then:</strong> start at the smallest real size — 1 micro. Scale only after a stretch of disciplined, green real-money sessions. Not after one good day. A stretch.</p>
        <p><strong>How to grade yourself.</strong> Grade on whether you followed the 7 steps — not on whether the trade won. A rule-following loss is a <em>good</em> trade. A rule-breaking win is a <em>dangerous</em> trade. The dangerous one teaches the wrong lesson and bleeds you next week.</p>
        <p>You've been trading for five and a half years. The reason this works now isn't that the market changed — it's that you finally chose <em>one edge</em> and refused everything else. That choice is the edge.</p>
      </div>
    ),
  },
]

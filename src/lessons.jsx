import SetupChart, { LadderChart } from './components/SetupChart.jsx'

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
        <p><strong>Why 5.5 years hurt.</strong> You traded counter-trend reversals and you fought the trend. Counter-trend trading fights <em>momentum</em>, the strongest force on the chart. And the stop sat in front of the crowd, where it was hunted before the move could breathe.</p>
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

        <div className="my-4 rounded-lg border border-cyan2/40 bg-cyan2/5 p-4">
          <p className="font-display tracking-wide text-cyan2 text-[14px] mb-2">THE THREE TIMEFRAMES — EACH DOES ONE JOB</p>
          <p className="text-[13px] italic mb-2">(and the 5-minute "lower high" is NOT a contradiction)</p>
          <ul className="list-disc pl-5 space-y-2 text-[14px]">
            <li><strong>15-minute = THE TREND (the IF).</strong> This is the one that must be higher highs / higher lows. This is your permission to be long at all.</li>
            <li><strong>5-minute = THE PULLBACK HEALTH (the WHERE).</strong> During a pullback, the 5-minute will print a lower high — that lower high IS the pullback. It's supposed to happen. It does not break the uptrend, as long as the pullback holds above the prior swing low and ideally rides the rising 20 EMA. What you reject is the 5-minute breaking BELOW its prior swing low — that's real trend damage, and you skip.</li>
            <li><strong>2-minute = THE TRIGGER (the WHEN).</strong> The close above the flag trendline.</li>
          </ul>
        </div>

        <p><strong>For shorts (bear flag): mirror.</strong> 15-minute downtrend is permission; the 5-minute will print a HIGHER LOW during the bounce (that higher low IS the bounce, not a reversal); reject only if the 5-minute breaks ABOVE its prior swing high; the 2-minute close BELOW the trendline is the trigger.</p>
      </div>
    ),
  },

  {
    id: 'l3',
    n: 3,
    title: 'The Entry — The Only Trigger Is the 2-Min Trendline Close',
    oneLine: 'The shape of the pullback is not the entry. The 2-min close through the trendline is.',
    lockIt: 'Wait for a 2-minute candle to CLOSE above the descending trendline (long) or below the ascending trendline (short). That close is your one and only trigger. Enter all 6 contracts at the open of the next candle.',
    render: () => (
      <div className="prose-edge space-y-4">
        <p>This is the flagship setup — the <strong>BULL FLAG</strong>, the one setup we trade with the trend. Long version below; the BEAR FLAG (shorts) is the exact mirror — see Lesson 9 and the Visual Library (G2).</p>

        <p><strong>The picture.</strong> Pole = a sharp upmove. Flag = price drifting down on lighter volume; a small descending channel against the uptrend (lower highs and lower lows of the pullback). The <em>defining boundary</em> of the bull flag = the <strong>DESCENDING trendline</strong> connecting the lower highs of the pullback.</p>

        <p><strong>The shape forming is not the entry.</strong> Watching the pullback build is part of the read — it tells you a trendline close is becoming likely. But the pullback shape on its own gives you nothing to act on. <em>Do NOT enter on a chart pattern.</em> <em>Do NOT enter on a "price trigger."</em></p>

        <p><strong>The trigger — the ONLY trigger.</strong> Wait for a 2-minute candle to <strong>CLOSE</strong> above the descending trendline. That close is your one and only trigger. The moment it closes above the line, enter all 6 contracts at the open of the next candle.</p>

        <div className="my-4 rounded-lg border border-gold/40 bg-gold/5 p-4">
          <p className="font-display tracking-wide text-gold text-[14.5px] leading-[1.65]">The close is your edge — wait for it. Anticipating the trigger is how you hand that edge back.</p>
        </div>

        <p><strong>The invalidation.</strong> The setup is alive as long as price holds above the prior swing low. The moment the pullback breaks that prior low, the setup is dead — no trade.</p>

        <ol className="list-decimal pl-5 space-y-1 marker:text-violet2">
          <li><strong>15-min HH/HL confirmed.</strong> The gate is open.</li>
          <li><strong>Wait for the 2-min candle that CLOSES above the descending trendline.</strong> No retest. No second close. The trendline close is the contract.</li>
          <li><strong>ENTER all 6 contracts at the open of the next candle.</strong> Take your hands off the mouse.</li>
        </ol>

        <SetupChart
          values={[20, 38, 56, 46, 56, 50, 64, 76]}
          showKindToggle
          playable
          triggerY={56}
          triggerLabel="2-min trendline (entry trigger)"
          markers={[
            { idx: 3, kind: 'dip1', label: 'Pullback low' },
            { idx: 5, kind: 'dip2', label: 'Higher low' },
            { idx: 6, kind: 'enter', label: 'First close above 2-min trendline — ENTER' },
          ]}
          stopY={42}
          crowdStopY={45}
          stopLabel="Final stop — at the structure (pullback swing low)"
          caption="The flagship 2-min picture. The pullback prints lower highs against the descending 2-min trendline. The TRIGGER is the first close above that trendline. (In practice the trendline is a diagonal connecting the lower highs of the pullback; shown here as a horizontal level for clarity.) Stop sits at the structure — the swing low at the bottom of the pullback."
          contextLabel="2-min · 15-min HH/HL"
          contextColor="emerald"
        />

        <p>From now on: <em>see the pullback build → know a trendline close is becoming likely → wait for the close above the trendline → buy.</em> Anything less is not the setup.</p>
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

        <SetupChart
          values={[18, 30, 44, 38, 50, 44, 58, 70]}
          ema20={[16, 22, 30, 32, 38, 40, 46, 54]}
          ema9={[18, 28, 40, 38, 46, 44, 54, 66]}
          markers={[
            { idx: 3, kind: 'dot', label: 'Holds the 20 EMA — healthy', color: '#2DD4F0' },
          ]}
          caption="Cyan dashed = 20 EMA (health). Gold dashed = 9 EMA (runner trail). The pullback holds the 20 EMA → green light to look for the trendline close."
          contextLabel="Healthy pullback"
          contextColor="cyan"
        />

        <SetupChart
          values={[30, 48, 60, 42, 32, 26, 30, 35]}
          ema20={[26, 32, 40, 40, 38, 34, 32, 32]}
          markers={[
            { idx: 4, kind: 'dot', label: 'Knifed below 20 — stand aside', color: '#FF5C72' },
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
        <p>Never trade a candle alone. At the trendline close the candle <em>grades</em> the entry. It doesn't <em>create</em> the entry; the context did that.</p>
        <ul>
          <li><strong>A+.</strong> Bullish engulfing or dragonfly doji at the trendline close. Take confidently.</li>
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
    title: 'The Stop — Two Steps: Tentative at the Trendline, Final at the Structure',
    oneLine: 'TENTATIVE: 4-6 ticks beyond the broken trendline. FINAL: just past the STRUCTURE.',
    lockIt: 'STEP 1 (tentative): 4 to 6 ticks beyond the broken trendline — the price level of the trendline itself at the break, NOT below the breakout candle\'s close. STEP 2 (final): move the stop to just past the STRUCTURE — the swing low at the bottom of the bull-flag pullback (longs), or the swing high at the top of the bear-flag bounce (shorts). The structure is the anchor.',
    render: () => (
      <div className="prose-edge space-y-4">
        <p><strong>Read this carefully — the stop has TWO steps.</strong> Where the stop ends up is the difference between a normal retest taking you out and a real failure being the only thing that can.</p>

        <p><strong>STEP 1 — TENTATIVE: 4 to 6 ticks below the broken trendline.</strong> "Below the broken trendline" means below the <em>price level of the trendline itself</em>, at the exact spot where price punched through it. It does <em>NOT</em> mean 4 to 6 ticks below where the breakout candle closed. The candle's close is only the trigger — it is never the stop reference. (A strong breakout candle closes far above the line; a weak one barely above. Your stop must not depend on that.)</p>

        <p><strong>STEP 2 — FINAL (my adjustment): move the stop to just beyond the STRUCTURE.</strong> The structure is the swing low at the bottom of the pullback. Depending on exactly where that low sits, this may land a few ticks higher or a few ticks lower than the tentative spot. I make that call.</p>

        <p><strong>Why the structure is the better stop.</strong> A stop tucked tight under the diagonal trendline gets wicked out on a normal retest. A stop just beyond the structure only triggers if the pattern has actually failed. Because premature stop-outs have been the costliest leak in this trader's results, anchor the stop to the structure.</p>

        <p><strong>For shorts (bear flag): mirror.</strong> Tentative: 4 to 6 ticks ABOVE the broken trendline. Final: just past the structure — the swing HIGH at the top of the bounce.</p>

        <SetupChart
          values={[22, 40, 56, 44, 56, 48, 62, 72]}
          triggerY={56}
          triggerLabel="2-min trendline (broken at entry)"
          markers={[
            { idx: 3, kind: 'dip1', label: 'Pullback low' },
            { idx: 5, kind: 'dip2', label: 'Higher low' },
          ]}
          stopY={37}
          crowdStopY={48}
          stopLabel="Final stop — at the STRUCTURE (pullback swing low)"
          crowdStopLabel="Tentative (4-6 ticks past trendline level)"
          caption="Two-step stop. Tentative: 4-6 ticks past where the trendline was broken (the trendline level itself, NOT the breakout candle's close). Final: anchor to the STRUCTURE — the swing low at the bottom of the pullback."
          contextLabel="Stop = at the structure"
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
        <LadderChart entry={100} riskPts={3} animate />
      </div>
    ),
  },

  {
    id: 'l-odds',
    n: 8,
    title: 'Know The Odds',
    oneLine: 'Reliability isn’t profitability. The edge is the FILTERS — the math does the rest.',
    lockIt: 'A loose flag is a coin flip; the tight flag after a steep pole wins ~85%. Your confirmed trendline-close entries with-trend run ~70%. With 2/2/2 and stop to BE after T1, a 50–70% rate is a strong positive-expectancy game. Reliability isn’t profitability.',
    render: () => (
      <div className="prose-edge space-y-4">
        <p><strong>THE MYTH:</strong> “Flags are 70–80% reliable.” They are not — not the loose ones.</p>

        <p><strong>THE DATA</strong> (daily stock charts; treat as direction, not a promise): a standard, loose flag fails to even cover its cost about 44% of the time, averages only a ~9% move, and reaches its target only about half the time. A loose flag is close to a coin flip.</p>

        <p><strong>WHAT ACTUALLY HAS AN EDGE:</strong> the <em>TIGHT</em> flag after a <em>STEEP</em> pole. The high-and-tight version succeeds about 85% of the time. Same pattern, opposite odds. The difference is entirely the quality of the setup — a clean steep pole into a tight pullback, not a sloppy drift.</p>

        <p><strong>OUR EDGE ISN’T THE PATTERN — IT’S THE FILTERS:</strong></p>
        <ul>
          <li>Steep, clean flagpole into a tight pullback (long) or bounce (short)</li>
          <li>15-min trend agrees: long only in an uptrend, short only in a downtrend</li>
          <li>We wait for the 2-min candle to CLOSE through the trendline — never the touch, never the wick</li>
        </ul>
        <p>On a 2-min chart, noise manufactures false breaks all day. Waiting for the close plus trend alignment is what turns the coin flip back into an edge.</p>

        <p><strong>YOUR NUMBER:</strong> on your own confirmed trendline-close entries, traded with the trend, your backtested reliability is about 70%. That number exists because you wait for the close and you trade with the 15-min. Break either rule and you are back to the coin flip.</p>

        <p><strong>BEAR FLAGS:</strong> the mirror of the bull flag, but historically a touch weaker and more erratic, and downward breakouts fail more often when the broad market is rising. The 15-min downtrend filter is not optional on the short side — it is the whole edge.</p>

        <p><strong>RELIABILITY IS NOT PROFITABILITY:</strong> you do not need a high win rate to win. With the 2/2/2 split, stop to breakeven after T1, and tiered targets against a tight fixed stop, one runner pays for several scratches. A 50–70% confirmed-entry rate with that exit structure is a strong, positive-expectancy game. Protect the process; the math does the rest.</p>
      </div>
    ),
  },

  {
    id: 'l8',
    n: 9,
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
    n: 10,
    title: 'What We Do NOT Trade',
    oneLine: 'No reversals. No ranges. No standalone candles.',
    lockIt: 'No counter-trend reversal attempts. No head & shoulders, triple tops, wedges, V-reversals. No symmetrical triangles, ranges, broadening. No standalone candle trades.',
    render: () => (
      <div className="prose-edge space-y-4">
        <p>Discipline is partly knowing what to do. It is mostly knowing what <em>not</em> to do.</p>
        <ul>
          <li><strong>No counter-trend reversal attempts.</strong> No head &amp; shoulders, triple tops, wedges, V-reversals. No trying to buy a downtrend or short an uptrend on any pullback shape. These are the trades that bled the last five years. They look brilliant on losers' charts and on traders' regret tweets.</li>
          <li><strong>No bilateral / neutral patterns.</strong> No symmetrical triangles, ranges, broadening formations. Bilateral patterns have a 50/50 outcome. We don't trade coin flips.</li>
          <li><strong>No standalone candle trades.</strong> A great candle in the wrong context is a worse trade than a mediocre candle in the right context.</li>
        </ul>
        <p>When the 15-min is sideways and going nowhere, <em>sitting out is the trade</em>. You will lose months of P&amp;L in a sideways tape if you force trades. The market gives a trend most days, sometimes after lunch, sometimes for ten minutes. Be there for those windows. Skip the rest.</p>
      </div>
    ),
  },

  {
    id: 'l10',
    n: 11,
    title: 'Going Live — The Right Way',
    oneLine: 'Sim → green by rule → 1 micro → scale slowly.',
    lockIt: 'Go live only when net green in sim AND every trade followed the checklist. Start at 1 micro. Scale only after disciplined real-money green stretches.',
    render: () => (
      <div className="prose-edge space-y-4">
        <p><strong>The three weeks is a deadline to groove this — not a promise to go live.</strong> Treat it as a deadline by which to be <em>ready</em>. Going live is the reward for readiness, not the goal of the calendar.</p>
        <p><strong>Go live only when:</strong></p>
        <ul>
          <li>Net green in sim on this exact system, over a meaningful sample.</li>
          <li>Every trade followed the 6-step checklist (high rule-adherence %).</li>
        </ul>
        <p><strong>Then:</strong> start at the smallest real size — 1 micro. Scale only after a stretch of disciplined, green real-money sessions. Not after one good day. A stretch.</p>
        <p><strong>How to grade yourself.</strong> Grade on whether you followed the 7 steps — not on whether the trade won. A rule-following loss is a <em>good</em> trade. A rule-breaking win is a <em>dangerous</em> trade. The dangerous one teaches the wrong lesson and bleeds you next week.</p>
        <p>You've been trading for five and a half years. The reason this works now isn't that the market changed — it's that you finally chose <em>one edge</em> and refused everything else. That choice is the edge.</p>
      </div>
    ),
  },
]

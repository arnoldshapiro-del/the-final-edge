import SetupChart, { LadderChart } from './components/SetupChart.jsx'
import { GateGreenLightChart, GateTrapChart, GateReclaimChart, GateDecisionFlow, GateCheatSheet } from './components/GatekeeperCharts.jsx'

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
        <p>The lessons that follow are this single edge, broken into its working parts. Master each. Then drill them in the Trainer until you don't think — you see.</p>
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

        <p><strong>One more thing — and it's the next lesson.</strong> Everything above is STRUCTURE: where price <em>has been</em>. Structure grants <em>directional permission only</em>. Before any trigger means anything, LOCATION — where price sits relative to session VWAP and the 200 EMA on the 2-minute chart — must agree too. That filter is <strong>the Gatekeeper</strong>, and it decides "now, or not now." Lesson 3 installs it.</p>
      </div>
    ),
  },

  {
    id: 'l-gate',
    n: 3,
    title: 'The Gatekeeper — The Two Location Gates (VWAP + 200 EMA)',
    oneLine: 'Structure says where price HAS BEEN. The two Location Gates — session VWAP and the 200 EMA on the 2-minute chart — say who is in control NOW. Both must agree.',
    lockIt: 'TREND → LOCATION → PATTERN → TRIGGER. THE LOCATION GATES — the only two: for LONGS, at the CLOSE of the 2-minute entry candle, price must be above BOTH the 200 EMA on the 2-minute chart AND session VWAP. For SHORTS, below both. The gates are checked at the entry candle\'s close — NOT throughout the pullback; a flag dipping below the fast EMAs is normal and expected, never a disqualifier by itself. The 20 EMA is a GRADER, not a gate: A-grade flag holds at/near the 20 → full size; B-grade pokes below the 20 but holds above both gates → half size or pass. The 9 EMA is not a rule — reference only. VOID: any 2-min candle CLOSES below the 200 EMA or VWAP during the flag, or the pullback retraces more than 50% of the pole → not a flag, no trade. Conflict (15/5 up, 2-min below the gates) = FLAT — no long AND no short. Flat is a position. No wall (VWAP or 200) between entry and T1 — the Runway Rule. Red turns green only through the Reclaim Sequence: decisive close above both gates, hold from above, first flag. Risk is untouched: the Gatekeeper changes WHICH trades qualify — never how trades are managed.',
    render: () => (
      <div className="prose-edge space-y-4">
        <p><strong>What the losing day taught us.</strong> Live fire exposed the one hole in the system. The 15-minute and the 5-minute were printing higher highs and higher lows — structure said "uptrend, longs allowed." And the longs kept losing. Why? Because on the 2-minute execution chart, price was trading <em>below the entire EMA stack and below VWAP</em>. Structure checks where price <em>has been</em>. It has no opinion about who is in control <em>right now</em>. The 15 and 5 can be telling yesterday's truth while the 2-minute shows you today's: sellers own the tape, and every "buy the pullback" is a swim against the current.</p>

        <p><strong>The lesson, in one line:</strong> the 15-min and 5-min can print higher highs and higher lows while the 2-min trades below everything — that is a deep pullback or an early reversal, <em>not a buy zone</em>. Structure = where price has been. Session VWAP + the 200 EMA on the 2-minute chart = who is in control now. <strong>Both must agree before any trade.</strong> From today, a new layer sits between trend and trigger, and nothing gets through without its permission: <em>the Gatekeeper</em>.</p>

        <p><strong>The four lines on the chart — and their four very different jobs (all on the 2-minute, all calculated on 2-minute data):</strong></p>
        <ul>
          <li><strong>Session VWAP — GATE.</strong> The institutional benchmark. Large players measure their fills against it, defend it, and trade around it. Above VWAP, buyers own the session; below it, sellers do. It resets every day.</li>
          <li><strong>The 200 EMA on the 2-minute chart — GATE.</strong> The regime line of the execution chart.</li>
          <li><strong>20 EMA — GRADER, not a gate.</strong> It grades flag quality (A or B — next section). It opens and closes nothing.</li>
          <li><strong>9 EMA — NOT A RULE.</strong> It stays drawn as a visual reference only. It is part of no entry requirement; its one job in this system is trailing the runner (Lesson 8).</li>
        </ul>
        <p>Chart setup, so there is no ambiguity: your 2-minute M2K chart displays session VWAP, the 9 EMA, the 20 EMA, and the 200 EMA — all calculated on 2-minute data. All four are drawn; <strong>only two are gates: VWAP and the 200.</strong> If they're not on the chart, you are trading blind to location.</p>

        <p><strong>The upgraded sequence: TREND → LOCATION → PATTERN → TRIGGER.</strong></p>
        <ul>
          <li><strong>TREND</strong> = 15/5 structure (Lesson 2, unchanged) — grants <em>directional permission only</em>.</li>
          <li><strong>LOCATION</strong> = the Gatekeeper (new) — decides <em>"now, or not now."</em></li>
          <li><strong>PATTERN</strong> = bull flags and bear flags ONLY (unchanged).</li>
          <li><strong>TRIGGER</strong> = a 2-min candle CLOSE through the flag trendline (unchanged).</li>
        </ul>
        <p>All four layers must agree. Neither the 15/5 nor the 2-min overrides the other — they are answering different questions.</p>

        <GateDecisionFlow />

        <p><strong>THE LONG GATE — the only two location requirements:</strong> at the <strong>CLOSE of the 2-minute entry candle</strong>, price must be above BOTH <strong>(a) the 200 EMA on the 2-minute chart</strong> AND <strong>(b) session VWAP</strong>. Either one missed = gate closed = <em>no long</em>. Not "smaller size." Not "probably fine." Closed. And note <em>when</em> the gates are checked: <strong>at the entry candle's close — NOT throughout the pullback.</strong> A pullback dipping below the fast EMAs during the flag is normal and expected, never a disqualifier by itself.</p>

        <p><strong>THE SHORT GATE — the exact mirror:</strong> 15-minute AND 5-minute downtrends (lower highs and lower lows); a bear flag; price below BOTH the 200 EMA on the 2-minute chart AND session VWAP at the entry candle's close; and the trigger is a 2-minute close below the flag trendline.</p>

        <p><strong>THE 20 EMA — A GRADER, NOT A GATE.</strong> The 20 no longer opens or closes anything; it grades the flag and sets the size. <strong>A-GRADE:</strong> the flag low holds at or near the 2-minute 20 EMA → <strong>full size permitted.</strong> <strong>B-GRADE:</strong> the flag pokes below the 20 EMA but holds above both Location Gates → <strong>half size, or pass.</strong> <strong>VOID:</strong> any 2-minute candle CLOSES below the 200 EMA or VWAP during the flag, OR the pullback retraces more than 50% of the pole → <strong>it is not a flag; no trade.</strong></p>

        <GateGreenLightChart />

        <p><strong>CONFLICT = FLAT.</strong> Here is the subtle one. Bullish 15/5 with the 2-min below VWAP and the 200 means <em>no long</em> — the gate is closed. But it also means <em>NO SHORT</em>. Shorting there is shorting a pullback inside an uptrend — the mirror image of the original mistake. Three positions exist: long, short, and flat. <strong>Flat is a position.</strong> Some of your best trades from now on will be the ones you don't take.</p>

        <GateTrapChart />

        <p><strong>Trap flags.</strong> A "bull flag" forming below the Location Gates is the same shape with opposite context — viewed from the other side, it is often the bear flag. Same picture, opposite odds. <strong>The flag-grade rule:</strong> the pullback may dip below the 9, and may even poke below the 20 — a poke below the 20 only downgrades the flag to B-grade (half size or pass). What <strong>VOIDS</strong> the flag is a 2-minute candle <strong>CLOSING</strong> below the 200 EMA or VWAP during the flag, or the pullback giving back more than 50% of the pole. Exact mirror for bear flags: pokes above the 20 from below = B-grade; a 2-min CLOSE above the 200 or VWAP, or a bounce retracing more than half the pole, voids it.</p>

        <p><strong>The Runway Rule.</strong> Before entry, look at what stands between your entry price and your first scale-out target: no wall — VWAP or the 200 EMA — may sit in that path. Price slows, stalls, and reverses at those lines; that is where the other side defends. Wall in the way = skip the trade, even if every other box is checked.</p>

        <p><strong>Chop tells — any ONE of these means sit on your hands:</strong></p>
        <ul>
          <li>The 9 and 20 flat and braided together.</li>
          <li>A flat VWAP.</li>
          <li>Price crossing VWAP repeatedly over the last ~30 minutes.</li>
          <li><strong>The squeeze:</strong> price sandwiched between the 9/20 on one side and VWAP/200 on the other — walls everywhere, no room to run.</li>
          <li>Failed breakouts in both directions with small overlapping candles.</li>
        </ul>

        <p><strong>The Reclaim Sequence — how red turns green.</strong> When the 2-min is below VWAP and the 200, you are not banned from longs forever — you are waiting for a specific, watchable event. 1) A <em>decisive</em> 2-min close above BOTH VWAP and the 200. 2) <strong>HOLD</strong> — price pulls back and finds support on them <em>from above</em>. 3) The FIRST flag after a held reclaim is valid — and often the best trade of the move. Exact mirror for shorts. This turns waiting into hunting: you know precisely what you are waiting for, and you'll see it forming minutes before it completes.</p>

        <GateReclaimChart />

        <p><strong>What we never trade:</strong></p>
        <ul>
          <li>No mean-reversion longs below the 200 "because it's a magnet." We considered it. We rejected it. It's counter-trend with extra steps.</li>
          <li>No shorting pullbacks inside uptrends.</li>
          <li>No anticipating a reclaim before it prints. The close completes the reclaim, not your conviction.</li>
        </ul>

        <p><strong>Early-session note.</strong> Early in the day, the 2-min 200 EMA mostly reflects the <em>prior session</em> — which is exactly why VWAP (it resets daily) is ALSO mandatory; together the two gates cover both regimes. And in the first ~20–30 minutes after the open, VWAP itself is still forming on very few data points — treat the open as a no-rush zone. None of this creates exceptions to the two-gate rule; it only adds patience.</p>

        <div className="my-4 rounded-lg border border-gold/40 bg-gold/5 p-4">
          <p className="font-display tracking-wide text-gold text-[14px] mb-2">RISK IS UNTOUCHED</p>
          <p className="text-[14.5px] leading-[1.7]">The Gatekeeper changes WHICH trades qualify — never how trades are managed. Everything stays exactly as this app already states it: <strong>6 contracts, the structure stop you type (on the M2K that typed distance IS your 1R), the 2/2/2 scale-outs, and your daily limit — 3 losses or 3 full stops, whichever comes first.</strong> Same stop rules, same structure trail, same targets. The only thing that changes is how many bad trades never get taken.</p>
        </div>

        <p><strong>Drill it.</strong> Six Gatekeeper scenarios (D1–D6) are loaded in the <em>Trainer</em> — the same six below, in one breath each:</p>
        <ul>
          <li><strong>D1:</strong> 15 and 5 both HH/HL; 2-min below BOTH Location Gates — VWAP and the 200. → <strong>FLAT.</strong> No long (gate closed); no short (you'd short a pullback inside an uptrend).</li>
          <li><strong>D2:</strong> 2-min reclaims the fast EMAs but still sits below VWAP and the 200. → <strong>FLAT.</strong> The fast EMAs are not gates — the gates are VWAP and the 200, and the reclaim is incomplete.</li>
          <li><strong>D3:</strong> 2-min above the fast EMAs but below VWAP and the 200 — the squeeze. → <strong>FLAT.</strong> Walls overhead, no runway.</li>
          <li><strong>D4:</strong> Decisive close above VWAP and the 200, held on a retest from above, then the first bull flag forms holding the 20 — A-grade. → <strong>GO LONG</strong> on a 2-min close through the flag trendline, full size.</li>
          <li><strong>D5:</strong> 15 and 5 both LH/LL; 2-min below both gates at the entry close; A-grade bear flag (the bounce holds at/near the 20 from below, never CLOSING above VWAP or the 200); runway clear below. → <strong>GO SHORT</strong> on the trigger.</li>
          <li><strong>D6:</strong> The 9/20 braided flat and price has crossed VWAP four times in 30 minutes. → <strong>FLAT.</strong> Chop. No setups exist here in either direction.</li>
        </ul>

        <p><strong>The cheat sheet</strong> — small enough for one phone screen. Screenshot it:</p>
        <GateCheatSheet />
      </div>
    ),
  },

  {
    id: 'l3',
    n: 4,
    title: 'The Entry — The Only Trigger Is the 2-Min Trendline Close',
    oneLine: 'The shape of the pullback is not the entry. The 2-min close through the trendline is.',
    lockIt: 'With trend permission granted AND the Gatekeeper open (at the entry candle\'s close: price above BOTH Location Gates — session VWAP and the 200 EMA on the 2-minute chart — for longs; below both for shorts), wait for a 2-minute candle to CLOSE above the descending trendline (long) or below the ascending trendline (short). That close is your one and only trigger. Enter at the open of the next candle — full size if the flag is A-grade, half or pass if B-grade.',
    render: () => (
      <div className="prose-edge space-y-4">
        <p>This is the flagship setup — the <strong>BULL FLAG</strong>, the one setup we trade with the trend. Long version below; the BEAR FLAG (shorts) is the exact mirror — see the Visual Library (G2).</p>

        <p><strong>The picture.</strong> Pole = a sharp upmove. Flag = price drifting down on lighter volume; a small descending channel against the uptrend (lower highs and lower lows of the pullback). The <em>defining boundary</em> of the bull flag = the <strong>DESCENDING trendline</strong> connecting the lower highs of the pullback.</p>

        <div className="my-4 rounded-lg border border-cyan2/40 bg-cyan2/5 p-4">
          <p className="font-display tracking-wide text-cyan2 text-[14px] mb-2">FLAG QUALITY — THE 5-POINT GRADE</p>
          <ol className="list-decimal pl-5 space-y-1.5 text-[14px]">
            <li><strong>STRONG POLE</strong> — 3+ candles, mostly one color, big bodies, small wicks, steep. A weak pole = no trade, regardless of flag quality.</li>
            <li><strong>SHALLOW</strong> — the pullback retraces less than half the pole; the best flags give back roughly a third or less. Eyeball test: the flag stays in the TOP HALF of the pole.</li>
            <li><strong>TIGHT</strong> — small overlapping bars drifting sideways or gently counter-trend in a narrow, orderly channel; no large opposite-color bars inside the flag.</li>
            <li><strong>SHORT</strong> — roughly 3–10 two-minute bars. A breather, not a campout.</li>
            <li><strong>QUIET THEN LOUD</strong> — volume contracts during the flag and expands on the breakout candle.</li>
          </ol>
          <p className="text-[13.5px] italic mt-2 mb-0">A tight flag is a staircase pausing on a landing; a loose flag is the staircase collapsing into a ball of yarn.</p>
        </div>

        <p><strong>The shape forming is not the entry.</strong> Watching the pullback build is part of the read — it tells you a trendline close is becoming likely. But the pullback shape on its own gives you nothing to act on. <em>Do NOT enter on a chart pattern.</em> <em>Do NOT enter on a "price trigger."</em></p>

        <p><strong>The trigger — the ONLY trigger.</strong> Wait for a 2-minute candle to <strong>CLOSE</strong> above the descending trendline. That close is your one and only trigger. The moment it closes above the line, enter all 6 contracts at the open of the next candle.</p>

        <div className="my-4 rounded-lg border border-gold/40 bg-gold/5 p-4">
          <p className="font-display tracking-wide text-gold text-[14.5px] leading-[1.65]">The close is your edge — wait for it. Anticipating the trigger is how you hand that edge back.</p>
        </div>

        <p><strong>The invalidation.</strong> The setup is alive as long as price holds above the prior swing low. The moment the pullback breaks that prior low, the setup is dead — no trade.</p>

        <ol className="list-decimal pl-5 space-y-1 marker:text-violet2">
          <li><strong>15-min HH/HL confirmed.</strong> Trend permission granted.</li>
          <li><strong>The Gatekeeper is open (Lesson 3).</strong> At the CLOSE of the 2-minute entry candle: price above BOTH Location Gates — session VWAP and the 200 EMA on the 2-minute chart — and no VWAP/200 wall between entry and T1. Either gate missed = no trade, no matter how clean the flag.</li>
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

        <p>From now on: <em>trend agrees → the Gatekeeper is open → see the pullback build → wait for the close above the trendline → buy.</em> Anything less is not the setup.</p>
      </div>
    ),
  },

  {
    id: 'l4',
    n: 5,
    title: 'The 20 EMA & 9 EMA',
    oneLine: '20 = the GRADER (A / B / VOID). 9 = reference only.',
    lockIt: 'The 20 EMA GRADES the flag — it is not a gate. A-GRADE: the flag low holds at or near the 2-min 20 EMA → full size permitted. B-GRADE: the flag pokes below the 20 but holds above both Location Gates → half size or pass. VOID: any 2-min candle CLOSES below the 200 EMA or VWAP during the flag, OR the pullback retraces more than 50% of the pole → not a flag, no trade. The 9 EMA is not a rule — drawn as reference only; its one job is trailing the runner.',
    render: () => (
      <div className="prose-edge space-y-4">
        <p><strong>The 20 EMA — your GRADER, not a gate.</strong> The 20 EMA opens and closes nothing; the gates are VWAP and the 200 (Lesson 3). What the 20 does is grade the flag and set your size:</p>
        <ul>
          <li><strong>A-GRADE:</strong> the flag low holds at or near the 2-minute 20 EMA → <strong>full size permitted.</strong></li>
          <li><strong>B-GRADE:</strong> the flag pokes below the 20 EMA but holds above both Location Gates → <strong>half size, or pass.</strong></li>
          <li><strong>VOID:</strong> any 2-minute candle <strong>CLOSES</strong> below the 200 EMA or VWAP during the flag, OR the pullback retraces more than 50% of the pole → <strong>it is not a flag; no trade.</strong></li>
        </ul>
        <p>You do <em>not</em> need two bounces off the EMA. Every normal pullback gives you the dip-bounce-dip. The 20's only job is to grade the pullback — and a dip below it is a downgrade, never an automatic disqualifier.</p>
        <p><strong>The 9 EMA — reference only.</strong> The 9 EMA is part of <em>no</em> entry requirement. It stays drawn on the chart as a visual reference, and its one job in this system is the runner's trail (Lesson 8). It is <em>not</em> a separate strategy. You don't fade it, ride it, or wait for "9 EMA crosses." The grading line is the 20; the gates are VWAP and the 200.</p>

        <SetupChart
          values={[18, 30, 44, 38, 50, 44, 58, 70]}
          ema20={[16, 22, 30, 32, 38, 40, 46, 54]}
          ema9={[18, 28, 40, 38, 46, 44, 54, 66]}
          markers={[
            { idx: 3, kind: 'dot', label: 'Flag low holds the 20 EMA — A-grade', color: '#2DD4F0' },
          ]}
          caption="Cyan dashed = 20 EMA (the grader). Gold dashed = 9 EMA (reference only — the runner's trail). The flag low holds at the 20 EMA → A-grade: full size permitted, if both Location Gates pass at the entry candle's close."
          contextLabel="A-grade flag"
          contextColor="cyan"
        />

        <SetupChart
          values={[30, 48, 60, 42, 32, 26, 30, 35]}
          ema20={[26, 32, 40, 40, 38, 34, 32, 32]}
          markers={[
            { idx: 4, kind: 'dot', label: 'Gave back more than half the pole — VOID', color: '#FF5C72' },
          ]}
          caption="Same outline of price, very different story. This pullback gave back far more than half the pole — and a retrace past 50% of the pole means it is not a flag at all. VOID. No trade. (A 2-min CLOSE below VWAP or the 200 during the flag voids it the same way.)"
          contextLabel="VOID — not a flag"
          contextColor="coral"
        />
      </div>
    ),
  },

  {
    id: 'l5',
    n: 6,
    title: 'Candles Are the Grade, Not the Signal',
    oneLine: 'Candle = GO/NO-GO and conviction. The flag grade — not the candle — sets the size.',
    lockIt: 'A+ (bullish engulfing / dragonfly) → take confidently. Strong (morning star) → take if seen. Weak/none → smaller or skip.',
    render: () => (
      <div className="prose-edge space-y-4">
        <p>Never trade a candle alone. At the trendline close the candle <em>grades</em> the entry. It doesn't <em>create</em> the entry; the context did that.</p>
        <ul>
          <li><strong>A+.</strong> Bullish engulfing or dragonfly doji at the trendline close. Take confidently.</li>
          <li><strong>Strong (but rare).</strong> Morning star. Take it if you see it. Don't hunt for it.</li>
          <li><strong>Lowest conviction.</strong> Weak rejection, plain star doji, or no clear rejection. Smaller, or skip.</li>
        </ul>
        <p><strong>The candle is a GO/NO-GO filter and a confidence cue.</strong> It is <em>not</em> a size dial. The FLAG GRADE sets the size ceiling — A-grade full size, B-grade half or pass (Lesson 5) — and the candle can only talk you down to a skip, never up. Sizing by conviction is how good systems become bad systems.</p>
        <p>Your mentor reads candles brilliantly because his unconscious already filtered the trend. Repurpose that skill: grade <em>with-trend second entries</em>, never call reversals. The same candle that fails at a counter-trend top fires beautifully at a with-trend pullback. <em>Context</em>, not candle.</p>
      </div>
    ),
  },

  {
    id: 'l6',
    n: 7,
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
    n: 8,
    title: 'The Exits — 2/2/2 + The Structure Trail',
    oneLine: 'T1 = 1R. T2 = 2R. Runner trails the 9 EMA. T1 fills → stop trails the newest 2-min swing.',
    lockIt: 'Trade 6 contracts. 2 at T1 (1R). 2 at T2 (2R). 2 as the runner. ON ENTRY: the stop goes 4–6 ticks beyond the setup structure — that typed distance is your 1R. T1 FILLS: move the stop to 4–6 ticks beyond the most recent 2-min swing — only if that tightens it. Then ratchet behind every new swing. The stop only ever tightens. Never loosen a stop.',
    render: () => (
      <div className="prose-edge space-y-4">
        <p>Six contracts. Three pairs. One simple ladder.</p>
        <ul>
          <li><strong>2 at T1.</strong> +1R. The first pair locks in proof.</li>
          <li><strong>2 at T2.</strong> +2R. The middle pair takes the meat.</li>
          <li><strong>2 as the runner.</strong> Trails the 9 EMA. Sometimes does nothing. Sometimes pays for the week.</li>
        </ul>

        <p><strong>And the stop has a life of its own. Three steps, mechanical:</strong></p>

        <p><strong>STEP 1 — ON ENTRY.</strong> The ATM places the stop where you typed it and sets T1 at 1R and T2 at 2R from your entry (2 contracts each; the runner has no fixed target). Your FIRST ACTION: make sure that stop sits <strong>4–6 ticks beyond the setup structure</strong> — 4–6 ticks UNDER the setup swing low for longs, 4–6 ticks ABOVE the setup swing high for shorts. On the M2K that typed distance IS your 1R: the structure decides the stop, and the stop decides everything else.</p>

        <p><strong>STEP 2 — THE MOMENT T1 FILLS.</strong> Do <strong>NOT</strong> park the stop at your entry price. Immediately move it to <strong>4–6 ticks below the most recent 2-MINUTE swing low</strong> (longs) / <strong>above the most recent 2-minute swing high</strong> (shorts) — but ONLY if that tightens the stop. If the most recent swing is wider than where your stop already sits, leave the stop alone.</p>

        <div className="my-4 rounded-lg border border-coral/40 bg-coral/5 p-4">
          <p className="font-display tracking-wide text-coral text-[14px] mb-2">WHY WE RETIRED "MOVE IT TO BREAK EVEN"</p>
          <p className="text-[14.5px] leading-[1.7]">Your entry price sits exactly in the retest zone — the spot price normally pulls back to in order to test a broken level before continuing, and the exact spot where everyone else's break-even stops cluster. A stop parked at entry gets hit by the market breathing normally, right before the move you wanted. That habit was costing T2 and the runner on most trades. A stop tucked beyond the swing low only gets hit when the pattern has genuinely failed — which is exactly when you want out.</p>
        </div>

        <p><strong>HOW TO SPOT THE SWING — don't wait for the textbook.</strong> A textbook swing low needs 2 candles to its left and 2 to its right — that's 4 minutes on a 2-minute chart, and the move may be over before it confirms. You don't wait for it. <em>One 2-minute candle closing back UP off the low</em> (back DOWN off the high for shorts) is enough confirmation to act — combined with the 4–6 tick buffer, that's your spot.</p>

        <p><strong>STEP 3 — KEEP RATCHETING.</strong> As the trade prints each new HIGHER swing low (longs), move the stop up to 4–6 ticks under it. Shorts: each new LOWER swing high, move the stop down to 4–6 ticks above it. Keep going through T2 and the runner, until the trail takes you out.</p>

        <div className="my-4 rounded-lg border border-gold/40 bg-gold/5 p-4">
          <p className="font-display tracking-wide text-gold text-[14.5px] leading-[1.65]">THE IRON RULE: the stop only ever moves in the protective direction — UP for longs, DOWN for shorts. NEVER loosen a stop. If a trailed swing breaks, that break is information: the pattern failed, you're out, you keep what you locked in. "Moving it a little lower to give it room" is the habit that destroys accounts.</p>
        </div>

        <p><strong>The honest tradeoff.</strong> Trailing the structure slightly lowers your win rate versus parking the stop at your entry — and materially raises your average winner. Traders who made this switch report roughly 8–12% fewer wins but 40–60% bigger average winners. That is net strongly positive, and it is the trade we are making, on purpose.</p>

        <p><strong>What 4–6 ticks means on M2K:</strong> 0.4–0.6 points. Same rule on the MES, where 4–6 ticks = 1.0–1.5 points — proportionally nearly identical given the Russell's lower index level and the M2K's 0.10-point tick. Same rule, both instruments.</p>
        <p><strong>R:R is a glance, not a calculation.</strong> T1 is 1R by definition. Before entry, the only question is: <em>is there room above to reach my targets before obvious resistance?</em> Yes → take it. No → skip. You don't compute ratios on the fly.</p>
        <LadderChart entry={100} riskPts={3} animate />
      </div>
    ),
  },

  {
    id: 'l-odds',
    n: 9,
    title: 'Know The Odds',
    oneLine: 'Reliability isn’t profitability. The edge is the FILTERS — the math does the rest.',
    lockIt: 'Loose flags failed ~55% of the time; tight flags with strong poles succeeded ~85% (Bulkowski, 1,028 trades, DAILY-chart data — intraday runs lower across the board, but the tight-vs-loose gap persists). Flag tightness is a bigger statistical lever than any moving-average filter. Your confirmed trendline-close entries with-trend run ~70%. With 2/2/2 and the structure trail after T1, a 50–70% rate is a strong positive-expectancy game. Reliability isn’t profitability.',
    render: () => (
      <div className="prose-edge space-y-4">
        <p><strong>THE MYTH:</strong> “Flags are 70–80% reliable.” They are not — not the loose ones.</p>

        <p><strong>THE DATA — honestly caveated:</strong> in Bulkowski's sample of 1,028 flag trades, <strong>loose flags failed about 55% of the time</strong>, while <strong>tight flags after strong poles succeeded about 85% of the time</strong>. Same pattern, opposite odds. Two honest caveats: that data is from DAILY charts, and intraday success runs lower across the board — but the tight-vs-loose gap persists on every timeframe. The best flags also retraced little: 10–34% retracements performed best, which is why the 5-point grade (Lesson 4) demands a shallow, tight flag.</p>

        <p><strong>WHAT ACTUALLY HAS AN EDGE:</strong> the <em>TIGHT</em> flag after a <em>STRONG, STEEP</em> pole. The difference is entirely the quality of the setup — a clean steep pole into a tight, shallow pullback, not a sloppy drift. Say it plainly: <strong>flag tightness is a bigger statistical lever than any moving-average filter.</strong> The Location Gates keep you out of the wrong neighborhood; the 5-point grade is what the odds actually ride on.</p>

        <p><strong>OUR EDGE ISN’T THE PATTERN — IT’S THE FILTERS:</strong></p>
        <ul>
          <li>Strong, steep flagpole into a tight, shallow pullback (long) or bounce (short) — the 5-point grade (Lesson 4)</li>
          <li>15-min trend agrees: long only in an uptrend, short only in a downtrend</li>
          <li>LOCATION agrees — the Gatekeeper (Lesson 3): at the entry candle's close, above BOTH Location Gates (session VWAP and the 2-minute 200 EMA) for longs, below both for shorts. The same flag shape on the wrong side of the gates is a trap flag — not a lower-odds trade, a NO-trade.</li>
          <li>We wait for the 2-min candle to CLOSE through the trendline — never the touch, never the wick</li>
        </ul>
        <p>On a 2-min chart, noise manufactures false breaks all day. Waiting for the close plus trend alignment plus correct location is what turns the coin flip back into an edge.</p>

        <p><strong>YOUR NUMBER:</strong> on your own confirmed trendline-close entries, traded with the trend, your backtested reliability is about 70%. That number exists because you wait for the close and you trade with the 15-min — and it assumes the setup is correctly located (the live losses that prompted the Gatekeeper were structurally "valid" longs taken below the gates). Break any of those rules and you are back to the coin flip.</p>

        <p><strong>BEAR FLAGS:</strong> the mirror of the bull flag, but historically a touch weaker and more erratic, and downward breakouts fail more often when the broad market is rising. The 15-min downtrend filter is not optional on the short side — it is the whole edge.</p>

        <p><strong>RELIABILITY IS NOT PROFITABILITY:</strong> you do not need a high win rate to win. With the 2/2/2 split, the structure trail kicking in after T1, and tiered targets against a tight stop, one runner pays for several scratches. A 50–70% confirmed-entry rate with that exit structure is a strong, positive-expectancy game. Protect the process; the math does the rest.</p>
      </div>
    ),
  },

  {
    id: 'l-orb',
    n: 10,
    title: 'Method 3 — The Opening Range Break (ORB)',
    oneLine: 'A SEPARATE playbook: the 9:30–9:45 range, broken on the first 2-min close, confirmed by VWAP. Smaller size, exits pre-committed in writing.',
    lockIt: 'A SEPARATE playbook — never blended with the flag rules. Range: 9:30–9:45 AM ET (15 minutes). Entry: the FIRST 2-min candle CLOSE above the range high = long; below the range low = short. Direction comes from the break itself — NO 15-minute or 5-minute trend alignment is required. Confirmation: at entry, price on the matching side of VWAP (above for longs, below for shorts). Skip if the logical stop (opposite side of the range, or the range midpoint) exceeds the 32-tick budget, or if the range is so narrow it is noise. Exit style pre-committed IN WRITING before 9:45 (default: the standard 2/2/2 scale-out). Position size smaller than flag trades. Expect 25–45% win rates BY DESIGN; judge only on 20+ logged trades.',
    render: () => (
      <div className="prose-edge space-y-4">
        <p><strong>This is a SEPARATE playbook.</strong> The ORB is not the flag setup at a new level — it is its own method with its own range, its own trigger, its own confirmation, its own size, and its own math. Flag rules never bleed into the ORB; ORB rules never bleed into flags. Keep them in separate boxes in your head.</p>

        <p><strong>Step by step:</strong></p>
        <ol className="list-decimal pl-5 space-y-2 marker:text-violet2">
          <li><strong>9:30–9:45 AM ET: watch only.</strong> Mark the highest high and the lowest low of the first 15 minutes. Extend both lines to the right. <em>Why 15 minutes:</em> research-confirmed — shorter ranges outperformed longer ones in academic testing, 15 minutes is the day-trading standard balancing speed and accuracy, and 30-minute ranges enter later with stops that too often exceed the 32-tick budget. Not 5, not 30.</li>
          <li><strong>Before 9:45: pre-commit your exit IN WRITING.</strong> Write the exit style down before the range even completes (default: the standard 2/2/2 scale-out). The exit is never decided mid-trade.</li>
          <li><strong>The entry.</strong> The <strong>FIRST 2-minute candle that CLOSES above the range high = long</strong>; the <strong>first 2-minute close below the range low = short</strong>. A wick through does not count — the close is the signal.</li>
          <li><strong>Direction comes from the break itself.</strong> NO 15-minute or 5-minute trend alignment is required. This is intentional and research-based — and it is the one place in the system where the 15-minute gate does not apply, which is exactly why the ORB lives in its own playbook.</li>
          <li><strong>VWAP confirmation.</strong> At entry, price must be on the matching side of VWAP — above it for longs, below it for shorts. Wrong side of VWAP = no trade.</li>
          <li><strong>Skip conditions.</strong> Skip if the logical stop (the opposite side of the range, or the range midpoint) exceeds the 32-tick risk budget (3.2 M2K points). Skip if the range is so narrow it is noise.</li>
          <li><strong>Position size: smaller than flag trades.</strong> The win rate is lower by design (see the box below); the size must respect that.</li>
        </ol>

        <div className="my-4 rounded-lg border border-coral/40 bg-coral/5 p-4">
          <p className="font-display tracking-wide text-coral text-[14px] mb-2">THE HONEST EXPECTATIONS — READ BEFORE TRADING THE ORB</p>
          <p className="text-[14.5px] leading-[1.7]">ORB win rates run roughly <strong>25–45% BY DESIGN</strong>. Profitability comes from winners being much larger than losers — never from a high hit rate. <strong>Losing streaks of 3–5 are normal, not a malfunction.</strong> Judge the method only on 20+ logged trades. And two failed opening-range attempts in one day = done with the open.</p>
        </div>

        <div className="my-4 rounded-lg border border-emerald2/40 bg-emerald2/5 p-4">
          <p className="font-display tracking-wide text-emerald2 text-[14px] mb-2">NOT TRADING THE ORB IS ALWAYS FINE</p>
          <p className="text-[14.5px] leading-[1.7]">This playbook is optional. If you skip it, the marked range high and low still earn their keep: they act as key support and resistance all day for your normal flag setups, with every standard flag rule unchanged.</p>
        </div>
      </div>
    ),
  },

  {
    id: 'l8',
    n: 11,
    title: 'Sizing, the Pullback Count & Discipline',
    oneLine: 'Fixed 6 (A-grade). COUNT the flags: #1 full size · #2 A-grade only · #3 never.',
    lockIt: 'Fixed full size on A-grade flags; half or pass on B-grade. No adding to winners (yet). THE PULLBACK COUNT: Flag #1 after the Location Gates turn green = full size. Flag #2 = A-grade only. Flag #3 = NO TRADE, ever. The count resets when price tags VWAP or the 2-min 200 EMA and a fresh setup then forms, or at a new session. Prime window 9:45–11:00 AM ET (secondary 3:00–4:00 PM). Skip the lunch chop. Never trade overnight. GIVE-BACK RULE: open day P&L falls to 50% of its intraday peak → done for the day. No exceptions.',
    render: () => (
      <div className="prose-edge space-y-4">
        <p><strong>Fixed 6.</strong> Same baseline size every trade — full size on A-grade flags, half or pass on B-grade (Lesson 5). No conviction-based sizing — the grade sets the size, never the feeling.</p>
        <p><strong>No adding to a winner. No pyramiding.</strong> Not yet. A fresh, separate, valid setup later in the day is a <em>new</em> trade — that's fine. Adding to an existing trade is not.</p>
        <p><strong>THE PULLBACK COUNT — count the flags of the leg.</strong> <strong>Flag #1</strong> after the Location Gates turn green = <strong>full size</strong> — the highest-probability trade of the leg (Raschke's "first pullback" principle). <strong>Flag #2</strong> = permitted <strong>only if A-grade</strong> — its breakout is the leg's third push, the last reliable one. <strong>Flag #3 = NO TRADE, ever.</strong> Three pushes form a wedge, and the third flag forms exactly where reversal traders enter — treat flag #3 as a defensive warning, not an opportunity. <strong>THE COUNT RESETS</strong> when price tags VWAP or the 2-minute 200 EMA and a fresh setup then forms, or at a new session. Alongside the count, watch for exhaustion: smaller pushes, deeper pullbacks, climactic bars.</p>
        <p><strong>Circuit breaker.</strong> Set a max trades per session and a max loss per session. When either is hit, the day is done. The cockpit will enforce it for you. <strong>And the GIVE-BACK RULE sits on top:</strong> if your open day P&amp;L falls to 50% of its intraday peak, trading is finished for the day. No exceptions. The rule of trading isn't to win every day — it's to be there for the easy days.</p>

        <div className="my-4 rounded-lg border border-cyan2/40 bg-cyan2/5 p-4">
          <p className="font-display tracking-wide text-cyan2 text-[14px] mb-2">WHEN TO TRADE — THE CLOCK IS A FILTER TOO</p>
          <ul className="list-disc pl-5 space-y-2 text-[14px]">
            <li><strong>Prime window: 9:45–11:00 AM ET.</strong> Highest liquidity, tightest spreads, cleanest follow-through. This is where the edge lives. <strong>Secondary window: 3:00–4:00 PM ET.</strong></li>
            <li><strong>Do not trade the literal 9:30 open.</strong> Let the first real 2-minute structure print before you act on anything.</li>
            <li><strong>Avoid the lunch chop (~11:30 AM–1:30 PM ET).</strong> Tight ranges and false breakouts — the exact conditions that bleed a flag trader.</li>
            <li><strong>Never trade overnight (4:00 PM–9:30 AM).</strong> Thin volume, wide spreads, false breakouts — and false breakouts are poison for a flag trader. Roughly 70% of index-futures volume happens in regular hours; the edge lives there.</li>
          </ul>
        </div>
      </div>
    ),
  },

  {
    id: 'l9',
    n: 12,
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
          <li><strong>No mean-reversion longs below the 200 "because it's a magnet."</strong> Considered and deliberately rejected — it's counter-trend with a story attached.</li>
          <li><strong>No flags on the wrong side of the Location Gates.</strong> A bull flag below session VWAP and the 200 EMA on the 2-minute chart, or a bear flag above them, is a trap flag (Lesson 3). Same shape, opposite odds. And no anticipating a reclaim before it prints.</li>
          <li><strong>No third flag of a leg — ever.</strong> Three pushes form a wedge, and the third flag forms exactly where reversal traders enter (Lesson 11). The count resets only when price tags VWAP or the 2-minute 200 EMA and a fresh setup forms, or at a new session.</li>
        </ul>
        <p>When the 15-min is sideways and going nowhere, <em>sitting out is the trade</em>. You will lose months of P&amp;L in a sideways tape if you force trades. The market gives a trend most days, sometimes after lunch, sometimes for ten minutes. Be there for those windows. Skip the rest.</p>
      </div>
    ),
  },

  {
    id: 'l10',
    n: 13,
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

import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon.jsx'
import { useSettings } from '../hooks.js'

function Block({ title, color = 'violet', icon, children, span }) {
  const pillMap = { emerald: 'pill-emerald', coral: 'pill-coral', gold: 'pill-gold', violet: 'pill-violet', cyan: 'pill-cyan' }
  return (
    <section className={`card p-4 md:p-5 ${span ? 'md:col-span-2' : ''} break-inside-avoid`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={`pill ${pillMap[color]} text-[10px]`}>{title}</span>
        {icon && <Icon name={icon} className="w-4 h-4 text-texts"/>}
      </div>
      <div className="text-textp text-[14px] leading-relaxed font-body">{children}</div>
    </section>
  )
}

export default function TradePlan() {
  const settings = useSettings()
  const onPrint = () => window.print()
  return (
    <div className="space-y-6 max-w-5xl mx-auto print:max-w-none print:m-0">
      <header className="flex items-end justify-between gap-3 flex-wrap print:hidden">
        <div>
          <div className="pill pill-gold inline-flex mb-3"><Icon name="shield" className="w-3.5 h-3.5"/> Reference</div>
          <h1 className="font-display font-semibold text-3xl md:text-4xl text-textp tracking-tight">Trade plan</h1>
          <p className="text-texts mt-2">One page. The whole system. Read it before the bell.</p>
        </div>
        <button className="btn btn-ghost" onClick={onPrint}><Icon name="edit" className="w-4 h-4"/> Print</button>
      </header>

      {/* Hero block */}
      <section className="card p-5 md:p-6 relative overflow-hidden break-inside-avoid">
        <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 w-56 h-56 rounded-full" style={{ background: 'radial-gradient(circle, rgba(31,224,160,0.10), transparent 65%)' }}/>
        <div className="pill pill-emerald inline-flex mb-2">The rule</div>
        <h2 className="font-display font-semibold text-2xl md:text-3xl text-textp leading-tight">
          Buy pullbacks in an <span className="text-emerald2 text-glow-emerald">uptrend</span>.
          Sell rallies in a <span className="text-coral text-glow-coral">downtrend</span>.
        </h2>
        <p className="font-display tracking-wide text-lg md:text-xl text-texts mt-2">
          With the trend, <span className="text-gold">never</span> against it. When unclear — <span className="text-gold">sit out</span>.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-4 print:gap-3">
        <Block title="15 says IF" color="emerald" icon="chart">
          The 15-min must be making <strong>higher highs AND higher lows</strong> (longs) — or LH/LL (shorts).
          A lower high or a broken swing low = <span className="text-coral">hard NO</span>.
        </Block>
        <Block title="5 says WHERE" color="cyan" icon="chart">
          The 5-min is where the pullback forms, and a lower high here is normal — that's the pullback doing its job, not a reversal, so don't flinch at it. The one hard line: it must hold above the prior swing low, and "hold" means on the CLOSE. A wick that stabs below the prior low and closes back above does NOT end the flag — that's usually a stop-hunt in your favor. Only a 5-min candle that CLOSES below the prior swing low kills the setup. (Shorts mirror it: a higher low on the bounce is normal; only a close above the prior swing high ends it.)
        </Block>
        <Block title="WICK vs CLOSE" color="violet" icon="chart">
          Two different jobs — not a contradiction. To DRAW the structure — higher highs / higher lows for longs, lower highs / lower lows for shorts — read the WICKS: a swing high or low sits at the very tip of its wick, and that tip is the line you watch. To decide whether a line has BROKEN, read the CLOSE: a wick that pokes past it but closes back is only a test (usually a stop-hunt) — it makes no new high or low and breaks nothing. Only a CLOSE past the line counts. In one breath: the wick shows you WHERE the line is; the close tells you whether it BROKE.
        </Block>
        <Block title="2 says WHEN" color="gold" icon="chart">
          The 2-min gives the trigger: a close above the descending trendline (long) or below the ascending trendline (short). The close through the trendline is the only thing that puts you in — nothing before it counts.
        </Block>
        <Block title="The 3-step entry — trendline close ONLY" color="emerald" icon="target" span>
          <ol className="list-decimal pl-5 space-y-1 marker:text-violet2">
            <li>15-min HH/HL confirmed. (Mandatory permission to be long.)</li>
            <li>Wait for a 2-min candle to <strong>CLOSE above the descending 2-min trendline</strong> — the diagonal connecting the lower highs of the pullback. That close is your ONE and ONLY trigger.</li>
            <li>Enter all 6 contracts at the open of the next candle. <span className="text-emerald2">Buy.</span></li>
          </ol>
          <p className="text-gold text-[12.5px] mt-3 font-display tracking-wide leading-[1.6]">The close is your edge — wait for it. Anticipating the trigger is how you hand that edge back.</p>
        </Block>

        <Block title="The stop — TWO STEPS" color="coral" icon="shield">
          <strong>TENTATIVE:</strong> 4 to 6 ticks beyond the broken trendline — the trendline LEVEL itself at the break, <em>not</em> below the breakout candle's close.<br/>
          <strong>FINAL (my adjustment):</strong> just past the <strong>STRUCTURE</strong> — the swing low at the bottom of the pullback (long) or the swing high at the top of the bounce (short). A stop tight under the trendline gets wicked on a retest; a stop just past the structure only triggers on real failure.
        </Block>
        <Block title="The exits — 2 / 2 / 2" color="emerald" icon="check">
          {settings.contracts} contracts in thirds. <strong>Scale at T1 (1R)</strong>, then tuck the stop 4–6 ticks behind the newest 2-min swing the instant T1 fills — never at your entry — and ratchet it behind each new swing. <strong>Scale at T2 (2R)</strong>. <strong>Final third</strong> trails the 9 EMA to the measured-move target. The stop only ever tightens.
        </Block>

        <Block title="Candle grade at the trendline close" color="gold" icon="flame">
          <ul className="space-y-1">
            <li><span className="text-emerald2">A+</span> — bullish engulfing / dragonfly. Take confidently.</li>
            <li><span className="text-gold">Strong</span> — morning star (rare). Take if seen.</li>
            <li><span className="text-coral">Weak / none</span> — smaller or skip.</li>
          </ul>
          <p className="text-textt text-[12px] mt-2">Candle grades the trade; it does <em>not</em> set the size. Same {settings.contracts} contracts every trade.</p>
        </Block>
        <Block title="Daily guardrails" color="violet" icon="lock">
          Max <strong>{settings.maxTradesPerSession} trades</strong> per session.
          Max loss <strong>{settings.maxLossPerSession}R</strong>. When either trips — done for the day.
        </Block>

        <Block title="M2K tick / point / $" color="violet" icon="shield" span>
          <ul className="grid md:grid-cols-2 gap-x-6 gap-y-1">
            <li>1 tick = <strong>0.10 pts</strong> = <strong>$0.50 / contract</strong></li>
            <li>1 point = <strong>10 ticks</strong> = <strong>$5 / contract</strong></li>
            <li>"A few ticks" past structure = <strong>0.20 – 0.50 pts</strong> buffer</li>
            <li>2-pt stop × {settings.contracts} contracts = <strong>${settings.contracts * 10} risk</strong> = your 1R</li>
          </ul>
          <p className="text-textt text-[12px] mt-2">M2K is $5 per point, and 10 ticks make a point — count your ticks in chunks of 10. Express stops in points or R; ticks are the fine grain.</p>
        </Block>

        <Block title="BULL FLAG &amp; BEAR FLAG — full parity" color="gold" icon="flame" span>
          <p className="mb-2"><strong className="text-emerald2">BULL FLAG (long, uptrend).</strong> Pole = sharp upmove. Flag = price drifting DOWN on lighter volume; a small descending channel where the pullback prints lower highs and lower lows while holding above the prior swing low. DEFINING BOUNDARY = the <strong>DESCENDING trendline</strong> connecting those LOWER HIGHS (the upper edge of the falling flag). TRIGGER = FIRST 2-min candle that CLOSES ABOVE the descending trendline. INVALIDATION = price breaks the prior swing low. STOP: tentative 4-6 ticks above the broken trendline level, then final at the STRUCTURE — the swing low at the bottom of the pullback.</p>
          <p className="mb-2"><strong className="text-coral">BEAR FLAG (short, downtrend) — exact mirror.</strong> <em>15-min downtrend (lower highs AND lower lows) is MANDATORY permission.</em> Pole = sharp drop. Flag = price drifting UP on lighter volume; a small rising channel where the bounce prints higher highs and higher lows while holding below the prior swing high. DEFINING BOUNDARY = the <strong>ASCENDING trendline</strong> connecting those HIGHER LOWS (the lower edge of the rising flag). TRIGGER = FIRST 2-min candle that CLOSES BELOW the ascending trendline. INVALIDATION = price breaks the prior swing high. STOP: tentative 4-6 ticks BELOW the broken trendline level, then final at the STRUCTURE — the swing HIGH at the top of the bounce.</p>
          <p className="text-textt text-[12px]"><strong>Bear-flag specific:</strong> TIME STOP IS TIGHTER — 2 candles (4 minutes), not 3. Bear flags work fast or they fail. Same logic as longs: wait for the trendline close.</p>
        </Block>

        <Block title="The 6-step gate" color="cyan" icon="check" span>
          <ol className="list-decimal pl-5 space-y-1 marker:text-violet2">
            <li>15-min trending my way (HH/HL · LH/LL)? <span className="text-coral">[Hard gate — if no, sit out.]</span></li>
            <li>With-trend pullback / bounce (flag), not a counter-trend reversal attempt?</li>
            <li>5-min pullback (long) / bounce (short) healthy — holds the prior swing low (long) / prior swing high (short), rides the 20 EMA?</li>
            <li>Confirming candle at the trendline close? (A+ / Strong / weak → smaller or skip)</li>
            <li>FIRST 2-min candle has CLOSED above the descending trendline (long) / below the ascending trendline (short)? <em>The trendline close is the ONLY trigger.</em></li>
            <li>Stop placed at the STRUCTURE (swing low at the bottom of the pullback for longs; swing high at the top of the bounce for shorts) — tentative 4-6 ticks past broken trendline, then final at the structure?</li>
          </ol>
        </Block>

        <Block title="NEVER trade" color="coral" icon="x" span>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
            <li>Counter-trend reversal attempts (head &amp; shoulders, V-reversals, trying to fade the trend).</li>
            <li>Ranges &amp; symmetrical triangles.</li>
            <li>Standalone candles, no context.</li>
            <li>Any pullback or bounce shape as an entry on its own — only the trendline close gets you in.</li>
            <li>Wicks. Wait for the trendline CLOSE.</li>
            <li>Chasing when there's no pullback.</li>
          </ul>
        </Block>
      </div>

      <section className="card p-5 border-l-4 break-inside-avoid" style={{ borderLeftColor: '#FFB347' }}>
        <div className="flex items-start gap-3">
          <Icon name="shield" className="w-5 h-5 text-gold mt-0.5"/>
          <div>
            <h3 className="font-display font-semibold text-textp">Grade yourself on following the plan, not on winning.</h3>
            <p className="text-texts text-[14px] mt-1">A rule-following loss is a good trade. A rule-breaking win is the dangerous one.</p>
          </div>
        </div>
      </section>

      <div className="text-center pt-2 print:hidden">
        <Link to="/" className="text-texts hover:text-textp text-[13px] font-display">← Home</Link>
      </div>
    </div>
  )
}

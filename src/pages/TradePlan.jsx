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
          The 5-min is where the pullback forms. Allowed to pull back; <strong>must not break the prior swing low</strong>.
        </Block>
        <Block title="2 says WHEN" color="gold" icon="chart">
          The 2-min gives the trigger: dip → bounce → second dip → close above (long) or below (short).
        </Block>
        <Block title="The 5-step entry" color="emerald" icon="target" span>
          <ol className="list-decimal pl-5 space-y-1 marker:text-violet2">
            <li>15-min HH/HL confirmed.</li>
            <li>2-min prints Dip 1.</li>
            <li>Price rallies but <strong>FAILS at the <span className="text-gold">neckline</span></strong> — the swing high between the two dips. No close above. That failure IS the bait — no entry to skip.</li>
            <li>Price falls back to a <strong>higher low</strong> (Dip 2). Double-bottom complete.</li>
            <li>The <strong>FIRST</strong> 2-min candle that <strong>closes</strong> above the neckline. <span className="text-emerald2">Buy.</span> No retest. Never jump on a wick.</li>
          </ol>
        </Block>

        <Block title="The stop" color="coral" icon="shield">
          Below the FIRST dip — a few ticks <strong>lower than the crowd</strong>. Mechanical, same placement every time. Wider-but-behind beats tight-and-clipped.
        </Block>
        <Block title="The exits — 2 / 2 / 2" color="emerald" icon="check">
          {settings.contracts} contracts in thirds. <strong>Scale at T1 (1R)</strong>, then stop → breakeven the instant T1 fills. <strong>Scale at T2 (2R)</strong>. <strong>Final third</strong> trails the 9 EMA to the measured-move target.
        </Block>

        <Block title="Candle grade at Dip 2" color="gold" icon="flame">
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

        <Block title="Bull flag / bear flag = our setup" color="gold" icon="flame" span>
          What you may have called a <strong>bull flag</strong> (uptrend) or a <strong>bear flag</strong> (downtrend) is the same picture as our <strong>with-trend double bottom / double top</strong>. The flagpole is the trend leg; the flag is the pullback that holds Dip 1, the failed rally at the neckline, and Dip 2. Our timing: wait for Dip 2, then enter on the <strong>FIRST</strong> 2-min candle that closes above the neckline (long) or below (short). The first rally never closed above — that failure WAS the bait; no entry was skipped.
        </Block>

        <Block title="The 7-step gate" color="cyan" icon="check" span>
          <ol className="list-decimal pl-5 space-y-1 marker:text-violet2">
            <li>15-min trending my way (HH/HL · LH/LL)? <span className="text-coral">[Hard gate — if no, sit out.]</span></li>
            <li>With-trend pullback, not a counter-trend reversal?</li>
            <li>Second dip formed (higher low / lower high) — double-bottom / double-top complete?</li>
            <li>Pullback healthy — holding near/above the 20 EMA, prior swing intact?</li>
            <li>Candle grade at the second dip? (A+ / Strong / weak → smaller or skip)</li>
            <li>Stop below the first dip (lower than the crowd) AND room above to T1/T2?</li>
            <li>FIRST 2-min candle has CLOSED above the neckline (long) / below (short)? No retest needed.</li>
          </ol>
        </Block>

        <Block title="NEVER trade" color="coral" icon="x" span>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
            <li>Counter-trend reversals (DT in uptrend, DB in downtrend, H&amp;S, V).</li>
            <li>Ranges &amp; symmetrical triangles.</li>
            <li>Standalone candles, no context.</li>
            <li>Anticipating — entering before the FIRST close above the neckline.</li>
            <li>Wicks. Wait for the close.</li>
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

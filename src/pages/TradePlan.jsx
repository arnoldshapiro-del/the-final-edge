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
            <li>Price bounces — that high becomes the <span className="text-gold">trigger line</span>.</li>
            <li>Price dips again to a <strong>higher low</strong> (Dip 2). Second entry — first bounce was the bait.</li>
            <li>A 2-min candle <strong>closes</strong> above the trigger. <span className="text-emerald2">Buy.</span> Never jump on a wick.</li>
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

        <Block title="The 7-step gate" color="cyan" icon="check" span>
          <ol className="list-decimal pl-5 space-y-1 marker:text-violet2">
            <li>15-min trending my way (HH/HL · LH/LL)? <span className="text-coral">[Hard gate — if no, sit out.]</span></li>
            <li>With-trend pullback, not a counter-trend reversal?</li>
            <li>Second dip formed (higher low / lower high)?</li>
            <li>Pullback healthy — holding near/above the 20 EMA?</li>
            <li>Candle grade at the second dip? (A+ / Strong / weak → smaller or skip)</li>
            <li>Stop below the first dip (lower than the crowd) AND room above to T1/T2?</li>
            <li>Taking this because it's the plan — not because I'm bored or chasing?</li>
          </ol>
        </Block>

        <Block title="NEVER trade" color="coral" icon="x" span>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
            <li>Reversals against the trend (DT/DB, H&amp;S, V).</li>
            <li>Ranges &amp; symmetrical triangles.</li>
            <li>Standalone candles, no context.</li>
            <li>The first bounce — that's the bait.</li>
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

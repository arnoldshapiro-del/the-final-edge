import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon.jsx'

const INSTRUMENT = 'M2K'
const FILLED = false // M2K version intentionally blank — backup instrument

const VALUES = {
  perTradeSub:  'To be set.',
  dailyMaxSub:  'To be set — 3 losing trades or your dollar cap, whichever first.',
  weeklyMaxSub: 'To be set.',
  bannerText:   'M2K is your backup instrument — these limits aren\'t set yet. Fill them in with Claude if you ever switch to trading M2K.',
  bannerPill:   'NOT SET',
}

function Block({ title, value, valueAccent = 'plain', sub, isRule = false }) {
  const accentMap = {
    emerald: 'text-emerald2 text-glow-emerald',
    coral:   'text-coral text-glow-coral',
    gold:    'text-gold text-glow-gold',
    violet:  'text-violet2 text-glow-violet',
    plain:   'text-textp text-glow-soft',
    muted:   'text-textt',
  }
  return (
    <div className="card p-5 md:p-6 break-inside-avoid">
      <div className="font-display text-[11px] tracking-[0.2em] uppercase text-textt">{title}</div>
      {FILLED || isRule ? (
        <div className={`font-mono font-bold mt-2 ${isRule ? 'text-xl md:text-2xl leading-tight' : 'text-4xl md:text-5xl'} ${accentMap[valueAccent]}`}>
          {value}
        </div>
      ) : (
        <div className="mt-2 flex items-baseline gap-3">
          <div className="font-mono font-bold text-4xl md:text-5xl text-textt opacity-50">—</div>
          <span className="font-display text-[11px] tracking-[0.18em] uppercase text-textt">to be set</span>
        </div>
      )}
      {sub && <p className="text-texts text-[13px] md:text-[14px] mt-3 font-body leading-[1.65]">{sub}</p>}
    </div>
  )
}

export default function MyRisk() {
  return (
    <div className="space-y-6 max-w-4xl">
      <header>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald2/15 border border-emerald2/60 font-display font-bold tracking-[0.22em] text-emerald2 text-glow-emerald text-[12px]">
            {INSTRUMENT}
          </span>
          <span className="pill pill-violet inline-flex"><Icon name="lock" className="w-3.5 h-3.5"/> Reference</span>
        </div>
        <h1 className="font-display font-semibold text-3xl md:text-4xl text-textp tracking-tight">MY RISK — {INSTRUMENT}</h1>
        <p className="text-texts mt-2">The dollar limits I trade inside. Glance — then trade.</p>
      </header>

      {/* Banner — "not set" since M2K is the backup */}
      <section className="card p-5 border-l-4 break-inside-avoid" style={{ borderLeftColor: '#FFB347' }}>
        <div className="flex items-start gap-3">
          <Icon name="shield" className="w-5 h-5 text-gold mt-0.5 shrink-0"/>
          <div>
            <div className="pill pill-gold inline-flex mb-2">{VALUES.bannerPill}</div>
            <p className="text-textp font-body text-[14px] md:text-[15px] leading-[1.7]">{VALUES.bannerText}</p>
          </div>
        </div>
      </section>

      {/* The 4 blocks — same layout, dollar values intentionally blank */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Block
          title="Per trade"
          valueAccent="emerald"
          sub={VALUES.perTradeSub}
        />
        <Block
          title="The stop rule"
          value="3 losing trades = done for the day"
          valueAccent="gold"
          sub="Three losses and you walk away. This is the mentor's rule."
          isRule
        />
        <Block
          title="Daily max"
          valueAccent="coral"
          sub={VALUES.dailyMaxSub}
        />
        <Block
          title="Weekly max"
          valueAccent="coral"
          sub={VALUES.weeklyMaxSub}
        />
      </section>

      {/* Footnote callout — SAME in both apps */}
      <section className="card p-5 md:p-6 border-l-4 break-inside-avoid" style={{ borderLeftColor: '#1FE0A0' }}>
        <div className="flex items-start gap-3">
          <Icon name="shield" className="w-5 h-5 text-emerald2 mt-0.5 shrink-0"/>
          <p className="text-textp font-body text-[14px] md:text-[15px] leading-[1.75]">
            <strong className="text-emerald2">If a red day ever feels too big, the fix is fewer contracts — never a tighter stop.</strong> Size down, never choke the stop. The stop always goes under the actual pattern; any tick numbers here are just the default starting point.
          </p>
        </div>
      </section>

      <div className="text-center pt-2">
        <Link to="/" className="text-texts hover:text-textp text-[13px] font-display">← Home</Link>
      </div>
    </div>
  )
}

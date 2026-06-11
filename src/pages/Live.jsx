import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon.jsx'
import { PreMarket, EndOfDay } from '../components/Routines.jsx'
import { setPreflight, sumTradeDollars, todayStr } from '../storage.js'
import {
  useSettings, useSession, usePremarket, usePreflight, useWeekStats, useTrades, useClock, useCooldown,
} from '../hooks.js'
import { CARDS } from '../flashcardData.js'
import { etParts, phaseFor, fmtCountdown, OPEN_MIN, WINDOW_END } from '../marketClock.js'

const STATES = [
  { key: 'calm', label: 'Calm', good: true },
  { key: 'focused', label: 'Focused', good: true },
  { key: 'eager', label: 'Eager', good: false },
  { key: 'anxious', label: 'Anxious', good: false },
  { key: 'tired', label: 'Tired', good: false },
  { key: 'revenge', label: 'Chasing yesterday', good: false },
]

const IF_THEN = [
  { ifPart: 'the 2-min candle only WICKS through the trendline', thenPart: 'I do NOTHING. Only a CLOSE counts.' },
  { ifPart: 'the 15-min is sideways or unclear', thenPart: 'I sit out. Sitting out IS the trade.' },
  { ifPart: 'the 15/5 look bullish but the 2-min is below VWAP or the 200', thenPart: 'FLAT. No long (gate closed), no short (that\'s a pullback inside an uptrend). Flat is a position.' },
  { ifPart: 'price is below VWAP/200 and I want back in', thenPart: 'I wait for the Reclaim Sequence: decisive close above BOTH → hold from above → FIRST flag. Never anticipate it.' },
  { ifPart: 'the 9/20 are braided flat or price keeps crossing VWAP', thenPart: 'chop. Hands off — no setups exist there in either direction.' },
  { ifPart: 'a VWAP or 200 wall sits between entry and T1', thenPart: 'I skip the trade. No runway, no trade.' },
  { ifPart: 'T1 fills', thenPart: 'stop tucks 4–6 ticks behind the newest 2-min swing — instantly, and only if tighter. Never at entry.' },
  { ifPart: 'I take my 2nd loss', thenPart: 'one more A+ only — or I stop early. Stopping is winning.' },
  { ifPart: 'I take my 3rd loss OR hit my daily max', thenPart: 'I am DONE. Close NinjaTrader. No debate.' },
  { ifPart: 'the clock hits 10:30', thenPart: 'my edge window is over. I am done for the day.' },
]

function Meter({ label, used, max, dollars, danger }) {
  const ratio = Math.min(1, Math.abs(used) / max)
  const color = danger ? '#FF5C72' : ratio >= 1 ? '#FF5C72' : ratio >= 0.5 ? '#FFB347' : '#1FE0A0'
  return (
    <div className="rounded-card border border-border bg-bg/50 p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="font-display text-[11px] uppercase tracking-[0.14em] text-textt">{label}</span>
        <span className="font-mono text-[12px] text-textp">{dollars != null ? dollars : `${used}/${max}`}</span>
      </div>
      <div className="mt-2 w-full h-2 rounded-full bg-bg border border-border overflow-hidden">
        <div className="h-full transition-all" style={{ width: `${ratio * 100}%`, background: color, boxShadow: `0 0 10px ${color}66` }} />
      </div>
    </div>
  )
}

function WarmupQuiz({ done, onDone }) {
  const [deck] = useState(() => {
    const a = CARDS.slice()
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]
    }
    return a.slice(0, 3)
  })
  const [idx, setIdx] = useState(0)
  const [showBack, setShowBack] = useState(false)
  if (done) return <p className="text-emerald2 text-[13px] font-display"><Icon name="check" className="inline w-4 h-4 mr-1" />Warm-up complete — recognition primed.</p>
  const card = deck[idx]
  return (
    <div className="rounded-card border border-border bg-bg/50 p-4">
      <div className="font-display text-[11px] uppercase tracking-[0.14em] text-textt mb-2">Warm-up · card {idx + 1} of 3</div>
      <div className="text-textp text-[15px] font-display">{card.front}</div>
      {showBack && <div className="text-texts text-[13px] mt-2 leading-relaxed font-body">{card.back}</div>}
      <div className="mt-3 flex gap-2 flex-wrap">
        {!showBack ? (
          <button className="btn btn-ghost text-[12px] py-1.5 px-3" onClick={() => setShowBack(true)}>Show answer</button>
        ) : (
          <button className="btn btn-primary text-[12px] py-1.5 px-3" onClick={() => {
            if (idx + 1 >= deck.length) onDone()
            else { setIdx(idx + 1); setShowBack(false) }
          }}>
            <Icon name="check" className="w-3.5 h-3.5" /> {idx + 1 >= deck.length ? 'Done — cleared' : 'Next card'}
          </button>
        )}
      </div>
    </div>
  )
}

export default function Live() {
  const settings = useSettings()
  const session = useSession()
  const premarket = usePremarket()
  const preflight = usePreflight()
  const week = useWeekStats('live')
  const trades = useTrades()
  const now = useClock(1000)
  const cooldown = useCooldown()
  const et = etParts(now)
  const phase = phaseFor(et)

  const today = todayStr()
  const premarketDone = premarket && premarket.date === today
  const pf = preflight || { date: today, checks: {}, state: null }
  const checks = pf.checks || {}
  const patch = (patchObj) => setPreflight({ ...pf, date: today, ...patchObj })
  const setCheck = (id, v) => patch({ checks: { ...checks, [id]: v } })

  const GATE = [
    { id: 'g1', label: 'Pre-market routine saved (trend + key levels)', auto: premarketDone },
    { id: 'g2', label: 'Mission read — out loud if you can' },
    { id: 'g3', label: 'Warm-up — 3 flashcards', quiz: true },
    { id: 'g6', label: 'Gatekeeper lines on the 2-min chart: session VWAP + 9 / 20 / 200 EMA, all calculated on 2-min data' },
    { id: 'g4', label: 'Daily loss limit set inside NinjaTrader (your daily max)' },
    { id: 'g5', label: `Risk acknowledged: ${settings.maxLossPerSession} losses = done for the day · window closes 10:30` },
  ]
  const gateDone = GATE.every(g => g.auto || checks[g.id]) && !!pf.state
  const stateInfo = STATES.find(s => s.key === pf.state)
  const riskyState = stateInfo && !stateInfo.good

  // Today's live picture — limits live in R (M2K dollar limits are still "to be set");
  // dollars shown are the real sum from each trade's actual stop.
  const dailyLimitR = (settings.maxLossPerSession || 3) * 6
  const halfWay = -session.rToday >= dailyLimitR / 2 && session.rToday < 0

  const todaysTrades = useMemo(() => trades.filter(t => {
    const d = new Date(t.datetime)
    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    return k === today
  }), [trades, today])
  const dayD = sumTradeDollars(todaysTrades)
  const processScore = todaysTrades.length
    ? Math.round((todaysTrades.filter(t => t.followedAll7).length / todaysTrades.length) * 100)
    : null

  const phasePill = {
    cyan: 'pill-cyan', emerald: 'pill-emerald', gold: 'pill-gold', muted: 'pill-muted',
  }[phase.color]

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* HEADER + CLOCK */}
      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <div className="pill pill-coral inline-flex mb-3"><Icon name="flame" className="w-3.5 h-3.5" /> Live day</div>
          <h1 className="font-display font-semibold text-3xl md:text-4xl text-textp tracking-tight">Command center</h1>
          <p className="text-texts mt-2">Real money. One setup. One hour. The plan flies the plane.</p>
        </div>
        <div className="text-right">
          <div className="font-mono text-textp text-3xl md:text-4xl tracking-tight">
            {String(et.h).padStart(2, '0')}:{String(et.m).padStart(2, '0')}<span className="text-textt text-xl">:{String(et.s).padStart(2, '0')}</span>
            <span className="text-textt text-[13px] ml-2">ET</span>
          </div>
          <div className={`pill ${phasePill} mt-1 inline-flex`}>{phase.label}</div>
        </div>
      </header>

      {/* PHASE BANNER */}
      {phase.key === 'pre' && (
        <section className="card p-5 border-l-4" style={{ borderLeftColor: '#22D3EE' }}>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h2 className="font-display font-semibold text-textp text-lg flex items-center gap-2"><Icon name="clock" className="w-5 h-5 text-cyan2" /> Opening bell in <span className="font-mono text-cyan2 text-glow-cyan">{fmtCountdown(OPEN_MIN, et)}</span></h2>
              <p className="text-texts text-[13px] mt-1">Use this time: pre-flight below, then watch the 15-min for trend permission.</p>
            </div>
          </div>
        </section>
      )}
      {phase.key === 'window' && (
        <section className="card p-5 border-l-4" style={{ borderLeftColor: '#1FE0A0' }}>
          <h2 className="font-display font-semibold text-textp text-lg flex items-center gap-2">
            <Icon name="clock" className="w-5 h-5 text-emerald2" /> Edge window closes in <span className="font-mono text-emerald2 text-glow-emerald">{fmtCountdown(WINDOW_END, et)}</span>
          </h2>
          <p className="text-texts text-[13px] mt-1">This is your hour. Patience inside the window beats activity outside it.</p>
        </section>
      )}
      {phase.key === 'after' && (
        <section className="card p-5 border-l-4" style={{ borderLeftColor: '#FFB347' }}>
          <h2 className="font-display font-semibold text-gold text-lg flex items-center gap-2"><Icon name="alert" className="w-5 h-5" /> 10:30 has passed — your edge window is closed.</h2>
          <p className="text-texts text-[13px] mt-1">The setup was validated at the open, not at lunch. Log your debrief and close the platform.</p>
        </section>
      )}

      {/* WEEK LOCKOUT */}
      {week.locked && (
        <section className="card p-6 border border-coral/50 text-center">
          <Icon name="lock" className="w-10 h-10 text-coral mx-auto mb-2" />
          <h2 className="font-display font-semibold text-2xl md:text-3xl text-coral text-glow-coral">Weekly limit hit — back to SIM for the week</h2>
          <p className="text-texts text-[14px] mt-2 max-w-lg mx-auto">
            Live net this week: <span className="font-mono text-coral">−{Math.abs(week.netR)}R (−${Math.abs(week.netDollars)})</span> of your {week.weeklyLimitR}R weekly max.
            This is the deal you made with yourself. Sim trades still count toward your skill.
          </p>
        </section>
      )}

      {/* COOLDOWN */}
      {cooldown && <CooldownCard until={cooldown.until} now={now} />}

      {/* GUARDRAIL METERS */}
      <section className="card p-5">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h2 className="font-display font-semibold text-textp text-lg flex items-center gap-2"><Icon name="shield" className="w-5 h-5 text-gold" /> Guardrails</h2>
          <div className="flex items-center gap-2">
            {processScore != null && (
              <span className={`pill ${processScore === 100 ? 'pill-emerald' : 'pill-coral'}`}>Process {processScore}%</span>
            )}
            <span className="pill pill-muted">Mode · {settings.mode.toUpperCase()}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Meter label="Trades today" used={session.tradesToday} max={settings.maxTradesPerSession} />
          <Meter label="Losses today" used={session.lossesToday || 0} max={settings.maxLossPerSession || 3} />
          <Meter
            label={`Day P&L (max −${dailyLimitR}R)`}
            used={session.rToday < 0 ? -session.rToday : 0}
            max={dailyLimitR}
            dollars={`${session.rToday >= 0 ? '+' : '−'}${Math.abs(Math.round(session.rToday * 100) / 100)}R · ${dayD >= 0 ? '+' : '−'}$${Math.abs(dayD)}`}
          />
          <Meter
            label={`Week live (max −${week.weeklyLimitR}R)`}
            used={week.netR < 0 ? -week.netR : 0}
            max={week.weeklyLimitR}
            dollars={`${week.netR >= 0 ? '+' : '−'}${Math.abs(week.netR)}R · ${week.netDollars >= 0 ? '+' : '−'}$${Math.abs(week.netDollars)}`}
            danger={week.locked}
          />
        </div>
        {halfWay && !session.locked && (
          <p className="text-gold text-[13px] font-display mt-3 flex items-center gap-1.5">
            <Icon name="alert" className="w-4 h-4" /> Half the daily limit is gone. A+ setups only from here — or stop early. Stopping early is a win.
          </p>
        )}
        {(session.lossesToday || 0) === (settings.maxLossPerSession || 3) - 1 && !session.locked && (
          <p className="text-coral text-[13px] font-display mt-2 flex items-center gap-1.5">
            <Icon name="alert" className="w-4 h-4" /> One more loss and the day is over. If you take another trade, it must be textbook A+.
          </p>
        )}
        {session.locked && (
          <p className="text-coral text-[14px] font-display mt-3 flex items-center gap-1.5">
            <Icon name="lock" className="w-4 h-4" /> Circuit breaker tripped — you're done for today. Scroll down and log your debrief.
          </p>
        )}
      </section>

      {/* PRE-FLIGHT GATE */}
      <section className={`card p-5 ${gateDone ? 'border-emerald2/40' : ''}`}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="font-display font-semibold text-textp text-xl flex items-center gap-2">
            <Icon name="check" className="w-5 h-5 text-cyan2" /> Pre-flight
          </h2>
          {gateDone
            ? <span className="pill pill-emerald"><Icon name="check" className="w-3 h-3" /> CLEARED FOR LAUNCH</span>
            : <span className="pill pill-muted">{GATE.filter(g => g.auto || checks[g.id]).length + (pf.state ? 1 : 0)}/{GATE.length + 1}</span>}
        </div>
        <ul className="space-y-2">
          {GATE.map(g => (
            <li key={g.id}>
              {g.quiz ? (
                <div className={`p-3 rounded-lg border ${checks[g.id] ? 'border-emerald2/40 bg-emerald2/5' : 'border-border bg-bg/40'}`}>
                  <div className="text-textp text-[14px] mb-2">{g.label}</div>
                  <WarmupQuiz done={!!checks[g.id]} onDone={() => setCheck(g.id, true)} />
                </div>
              ) : (
                <label className={`flex items-start gap-3 p-3 rounded-lg border transition ${g.auto || checks[g.id] ? 'border-emerald2/40 bg-emerald2/5' : 'border-border bg-bg/40'} ${g.auto ? '' : 'cursor-pointer'}`}>
                  <input
                    type="checkbox"
                    className="mt-0.5 w-5 h-5 accent-[#1FE0A0]"
                    checked={!!(g.auto || checks[g.id])}
                    disabled={!!g.auto}
                    onChange={e => setCheck(g.id, e.target.checked)}
                  />
                  <span className="text-textp text-[14px] flex-1">
                    {g.label}
                    {g.id === 'g1' && !premarketDone && <Link to="/" className="text-cyan2 ml-2 text-[13px]">→ do it on Home</Link>}
                    {g.id === 'g1' && premarketDone && <span className="text-emerald2 ml-2 text-[12px] font-display">done · {premarket.trend15m}</span>}
                  </span>
                </label>
              )}
            </li>
          ))}
        </ul>

        {/* State check */}
        <div className="mt-4">
          <label className="field-label">How am I arriving at the screen?</label>
          <div className="flex gap-2 flex-wrap">
            {STATES.map(s => (
              <button
                key={s.key}
                className={`btn text-[13px] py-2 px-3 ${pf.state === s.key ? (s.good ? 'btn-primary' : 'btn-danger') : 'btn-ghost'}`}
                onClick={() => patch({ state: s.key })}
              >{s.label}</button>
            ))}
          </div>
          {riskyState && (
            <div className="mt-3 rounded-card border border-gold/40 bg-gold/5 p-3">
              <p className="text-gold text-[13px] font-display">
                Honest answer — good. On days like this the data says trade SIM or sit out. If you trade live anyway: A+ setups only, and consider 1 contract instead of 6.
              </p>
            </div>
          )}
        </div>

        <div className="mt-5 flex items-center gap-3 flex-wrap">
          <Link
            to="/trade"
            className={`btn ${gateDone && !week.locked ? 'btn-primary' : 'btn-ghost opacity-50 pointer-events-none'}`}
          >
            <Icon name="chart" className="w-4 h-4" /> Open trade cockpit
          </Link>
          {!gateDone && <span className="text-textt text-[12px] font-body">Finish pre-flight to unlock the cockpit link.</span>}
        </div>
      </section>

      {/* ONE-GLANCE RULE CARD */}
      <section className="card p-5">
        <h2 className="font-display font-semibold text-textp text-lg flex items-center gap-2 mb-3">
          <Icon name="target" className="w-5 h-5 text-emerald2" /> The only trade that exists today
        </h2>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="rounded-card border border-emerald2/30 bg-emerald2/5 p-4">
            <div className="font-display text-[11px] uppercase tracking-[0.16em] text-emerald2 mb-1">LONG — bull flag</div>
            <p className="text-textp text-[13.5px] leading-relaxed">15-min HH/HL → <strong>Gatekeeper OPEN</strong> (2-min above VWAP + 9 + 20 rising + 200, runway clear) → pullback holds prior swing low → FIRST 2-min candle <strong>CLOSES above the descending trendline</strong> → enter next candle open.</p>
          </div>
          <div className="rounded-card border border-coral/30 bg-coral/5 p-4">
            <div className="font-display text-[11px] uppercase tracking-[0.16em] text-coral mb-1">SHORT — bear flag</div>
            <p className="text-textp text-[13.5px] leading-relaxed">15-min LH/LL → <strong>Gatekeeper OPEN</strong> (2-min below VWAP + 9 + 20 falling + 200, runway clear) → bounce holds below prior swing high → FIRST 2-min candle <strong>CLOSES below the ascending trendline</strong> → enter next candle open.</p>
          </div>
        </div>
        <div className="rounded-card border border-gold/30 bg-gold/5 p-4 mt-3">
          <div className="font-display text-[11px] uppercase tracking-[0.16em] text-gold mb-1">FLAT — the third position</div>
          <p className="text-textp text-[13.5px] leading-relaxed m-0">Trend and location disagree (15/5 up, 2-min below VWAP/200 — or the mirror) → <strong>no long AND no short</strong>. Chop tells or no runway → flat. Red turns green only through the Reclaim Sequence: decisive close above both → hold from above → first flag. <strong>Flat is a position.</strong></p>
        </div>
        <div className="grid md:grid-cols-3 gap-3 mt-3">
          <div className="rounded-card border border-border bg-bg/50 p-3 text-center">
            <div className="font-display text-[10px] uppercase tracking-[0.14em] text-textt">Stop</div>
            <div className="text-textp text-[13px] mt-1">Tentative 4–6 ticks past the broken trendline → FINAL at the structure</div>
          </div>
          <div className="rounded-card border border-border bg-bg/50 p-3 text-center">
            <div className="font-display text-[10px] uppercase tracking-[0.14em] text-textt">Exits</div>
            <div className="text-textp text-[13px] mt-1">2/2/2 · T1 1R → stop trails the newest 2-min swing · T2 2R · runner trails 9 EMA</div>
          </div>
          <div className="rounded-card border border-border bg-bg/50 p-3 text-center">
            <div className="font-display text-[10px] uppercase tracking-[0.14em] text-textt">Never</div>
            <div className="text-textp text-[13px] mt-1">Reversals · ranges · wicks · chasing · counter-trend</div>
          </div>
        </div>
      </section>

      {/* IF-THEN CARDS */}
      <section className="card p-5">
        <h2 className="font-display font-semibold text-textp text-lg flex items-center gap-2 mb-3">
          <Icon name="compass" className="w-5 h-5 text-violet2" /> If–then (decided in advance, so live-you doesn't have to)
        </h2>
        <ul className="grid md:grid-cols-2 gap-2">
          {IF_THEN.map((c, i) => (
            <li key={i} className="rounded-card border border-border bg-bg/40 p-3">
              <span className="font-display text-violet2 text-[12px] uppercase tracking-wide">IF </span>
              <span className="text-texts text-[13.5px]">{c.ifPart}, </span>
              <span className="font-display text-gold text-[12px] uppercase tracking-wide">THEN </span>
              <span className="text-textp text-[13.5px]">{c.thenPart}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ROUTINES — premarket + debrief in place */}
      <section className="space-y-3">
        <h2 className="font-display font-semibold text-xl text-textp tracking-wide">Routines</h2>
        <PreMarket />
        <EndOfDay />
      </section>
    </div>
  )
}

function CooldownCard({ until, now }) {
  const remain = Math.max(0, Math.floor((new Date(until).getTime() - now.getTime()) / 1000))
  const m = Math.floor(remain / 60)
  const s = remain % 60
  return (
    <section className="card p-6 border border-gold/40 text-center relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-40 h-40 rounded-full border border-gold/20" style={{ animation: 'breathe 8s ease-in-out infinite' }} />
      </div>
      <style>{`@keyframes breathe { 0%,100% { transform: scale(0.7); opacity: .25 } 50% { transform: scale(1.15); opacity: .6 } }`}</style>
      <div className="relative">
        <Icon name="pause" className="w-8 h-8 text-gold mx-auto mb-2" />
        <h2 className="font-display font-semibold text-2xl text-gold text-glow-gold">Cooldown · {m}:{String(s).padStart(2, '0')}</h2>
        <p className="text-texts text-[14px] mt-2 max-w-md mx-auto">
          Breathe with the circle — in 4, hold 4, out 6. That loss tells you nothing about the next trade.
          The edge plays out over many trades, never this one.
        </p>
      </div>
    </section>
  )
}

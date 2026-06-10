import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon.jsx'
import { useTrades, useSettings } from '../hooks.js'
import { tradeDollars } from '../storage.js'

function r2(n) { return Math.round(n * 100) / 100 }

const STEP_LABELS = {
  q1: '15-min trend gate',
  q2: 'With-trend only',
  q3: 'Healthy pullback / bounce',
  q4: 'Confirming candle',
  q5: 'Trendline CLOSE trigger',
  q6: 'Stop at the structure',
}

const RISKY_EMOTIONS = ['fomo', 'revenge', 'anxious', 'tired', 'eager']

// Group trades by local date. Returns [{ date, trades:[], net, clean }]
function groupByDate(trades) {
  const map = new Map()
  for (const t of trades) {
    const d = new Date(t.datetime)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(t)
  }
  return Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, ts]) => {
      const net = ts.reduce((sum, t) => sum + (typeof t.totalR === 'number' ? t.totalR : 0), 0)
      const clean = ts.every(t => t.followedAll7)
      return { date, trades: ts, net, clean }
    })
}

export default function Discipline() {
  const trades = useTrades()
  const settings = useSettings()

  const stats = useMemo(() => {
    const days = groupByDate(trades)
    // clean-day streak = consecutive most-recent days where every trade followed all 6
    let cleanStreak = 0
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].clean && days[i].trades.length > 0) cleanStreak++
      else break
    }
    const cleanDays = days.filter(d => d.clean && d.trades.length > 0).length
    const totalDays = days.filter(d => d.trades.length > 0).length

    // rule-following loss tally — "good trades"
    const followingLosses = trades.filter(t => t.followedAll7 && (t.totalR ?? 0) < 0).length
    // rule-breaking win — "dangerous"
    const breakingWins = trades.filter(t => !t.followedAll7 && (t.totalR ?? 0) > 0).length

    const overallAdh = trades.length > 0 ? trades.filter(t => t.followedAll7).length / trades.length : null

    // tilt watch: scan today's trades by datetime ascending
    const todayKey = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` })()
    const todays = trades.filter(t => {
      const d = new Date(t.datetime)
      const k = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
      return k === todayKey
    }).sort((a, b) => new Date(a.datetime) - new Date(b.datetime))

    const tilt = []
    if (todays.length > settings.maxTradesPerSession) {
      tilt.push({ kind: 'over-trades', msg: `${todays.length} trades today — over the ${settings.maxTradesPerSession} limit.` })
    }
    // Trade logged after a prior loss without all 6 checked
    for (let i = 1; i < todays.length; i++) {
      const prev = todays[i - 1], cur = todays[i]
      if ((prev.totalR ?? 0) < 0 && !cur.followedAll7) {
        tilt.push({ kind: 'after-loss', msg: `Trade after a losing one didn't pass all 6. Watch the chase reflex.` })
        break
      }
    }
    // Revenge timing today: next trade fired < 5 minutes after a loss
    for (let i = 1; i < todays.length; i++) {
      const prev = todays[i - 1], cur = todays[i]
      const gapMin = (new Date(cur.datetime) - new Date(prev.datetime)) / 60000
      if ((prev.totalR ?? 0) < 0 && gapMin < 5) {
        tilt.push({ kind: 'revenge-speed', msg: `A trade went in ${Math.round(gapMin)} min after a loss. The cooldown exists for exactly this.` })
        break
      }
    }

    // ---- All-time mistake taxonomy ----
    // Which of the 6 steps gets skipped most, and what those breaches cost in $.
    const stepBreaks = {}
    let breachCostR = 0
    const chrono = trades.slice().sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
    trades.forEach(t => {
      if (!t.followedAll7) breachCostR += Math.min(0, t.totalR ?? 0)
      ;(t.missedSteps || []).forEach(id => {
        if (!stepBreaks[id]) stepBreaks[id] = { n: 0, r: 0, d: 0 }
        stepBreaks[id].n++
        stepBreaks[id].r += (t.totalR ?? 0)
        stepBreaks[id].d += tradeDollars(t)
      })
    })
    // Revenge-speed trades all-time (within a day, < 5 min after a loss)
    let revengeCount = 0, revengeR = 0, revengeD = 0
    for (let i = 1; i < chrono.length; i++) {
      const prev = chrono[i - 1], cur = chrono[i]
      const sameDay = new Date(prev.datetime).toDateString() === new Date(cur.datetime).toDateString()
      const gapMin = (new Date(cur.datetime) - new Date(prev.datetime)) / 60000
      if (sameDay && (prev.totalR ?? 0) < 0 && gapMin < 5) { revengeCount++; revengeR += (cur.totalR ?? 0); revengeD += tradeDollars(cur) }
    }
    // Risky-state trades all-time
    const riskyTrades = trades.filter(t => RISKY_EMOTIONS.includes(t.emotion))
    const riskyR = riskyTrades.reduce((a, t) => a + (t.totalR ?? 0), 0)
    const riskyD = riskyTrades.reduce((a, t) => a + tradeDollars(t), 0)
    const calmTrades = trades.filter(t => t.emotion === 'calm' || t.emotion === 'focused')
    const calmR = calmTrades.reduce((a, t) => a + (t.totalR ?? 0), 0)
    const calmD = calmTrades.reduce((a, t) => a + tradeDollars(t), 0)

    return {
      days, cleanStreak, cleanDays, totalDays, followingLosses, breakingWins, overallAdh, todays, tilt,
      stepBreaks, breachCostR, revengeCount, revengeR, revengeD,
      riskyN: riskyTrades.length, riskyR, riskyD, calmN: calmTrades.length, calmR, calmD,
    }
  }, [trades, settings])

  if (!trades.length) {
    return (
      <div className="space-y-5 max-w-3xl">
        <header>
          <div className="pill pill-violet inline-flex mb-3"><Icon name="compass" className="w-3.5 h-3.5"/> Discipline</div>
          <h1 className="font-display font-semibold text-3xl md:text-4xl text-textp tracking-tight">Discipline dashboard</h1>
          <p className="text-texts mt-2">A rule-following loss is a good trade. A rule-breaking win is the dangerous one.</p>
          <p className="text-texts mt-2">Log your first trade in the cockpit and discipline shows up here.</p>
        </header>
        <Link to="/trade" className="btn btn-primary inline-flex w-fit"><Icon name="chart" className="w-4 h-4"/> Open trade cockpit</Link>
      </div>
    )
  }

  // Rule-break counts by checklist step (we don't store per-step breaks today — show distribution by trade)
  const cleanCount = trades.filter(t => t.followedAll7).length
  const breakCount = trades.length - cleanCount

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <header>
        <div className="pill pill-violet inline-flex mb-3"><Icon name="compass" className="w-3.5 h-3.5"/> Discipline</div>
        <h1 className="font-display font-semibold text-3xl md:text-4xl text-textp tracking-tight">Discipline dashboard</h1>
        <p className="text-texts mt-2">You're graded on the plan — not on the P&amp;L. This is the page that knows the difference.</p>
      </header>

      {stats.tilt.length > 0 && (
        <section className="card p-5 border-l-4" style={{ borderLeftColor: '#FF5C72' }}>
          <div className="flex items-center gap-2 mb-2"><Icon name="shield" className="w-5 h-5 text-coral"/><h2 className="font-display font-semibold text-textp text-lg">Tilt watch</h2></div>
          <ul className="space-y-1">
            {stats.tilt.map((t, i) => (
              <li key={i} className="text-textp text-[14px]">· {t.msg}</li>
            ))}
          </ul>
          <p className="text-texts text-[13px] mt-2">No shame — just the signal. Step back, breathe, return tomorrow.</p>
        </section>
      )}

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Tile label="Clean-session streak" value={stats.cleanStreak} sub="consecutive all-7 days" color="emerald" big/>
        <Tile label="Clean days" value={`${stats.cleanDays}/${stats.totalDays}`} sub="rule-following sessions" color="violet"/>
        <Tile label="Overall adherence" value={stats.overallAdh != null ? `${Math.round(stats.overallAdh * 100)}%` : '—'} sub={`${cleanCount}/${trades.length}`} color={stats.overallAdh >= 0.9 ? 'emerald' : 'gold'}/>
        <Tile label="Rule-following losses" value={stats.followingLosses} sub="good trades" color="cyan"/>
      </section>

      <section className="card p-5">
        <h3 className="font-display font-semibold text-textp text-lg mb-3 flex items-center gap-2">
          <Icon name="shield" className="w-5 h-5 text-gold"/> The good vs the dangerous
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="card-elev p-4 rounded-card border border-emerald2/30 bg-emerald2/5">
            <div className="font-display text-[11px] uppercase tracking-[0.16em] text-emerald2">A rule-following loss</div>
            <div className="font-display font-semibold text-3xl text-emerald2 text-glow-emerald mt-1">{stats.followingLosses}</div>
            <p className="text-texts text-[13px] mt-2 leading-relaxed">A good trade. The edge isn't a single result — it's the discipline that compounds.</p>
          </div>
          <div className="card-elev p-4 rounded-card border border-coral/30 bg-coral/5">
            <div className="font-display text-[11px] uppercase tracking-[0.16em] text-coral">A rule-breaking win</div>
            <div className="font-display font-semibold text-3xl text-coral text-glow-coral mt-1">{stats.breakingWins}</div>
            <p className="text-texts text-[13px] mt-2 leading-relaxed">The dangerous one. Teaches the wrong lesson; bleeds next week.</p>
          </div>
        </div>
      </section>

      <section className="card p-5">
        <h3 className="font-display font-semibold text-textp text-lg mb-3 flex items-center gap-2">
          <Icon name="stats" className="w-5 h-5 text-cyan2"/> Rule-break distribution
        </h3>
        <p className="text-texts text-[13px] mb-3">A simple count of trades where any of the 7 steps wasn't ticked. Lower is better; 0 is the goal.</p>
        <div className="w-full h-6 rounded-lg border border-border bg-bg overflow-hidden flex">
          {cleanCount > 0 && (
            <div className="h-full" style={{ width: `${(cleanCount / trades.length) * 100}%`, background: '#1FE0A0', boxShadow: '0 0 18px rgba(31,224,160,0.45)' }} title={`Clean: ${cleanCount}`}/>
          )}
          {breakCount > 0 && (
            <div className="h-full" style={{ width: `${(breakCount / trades.length) * 100}%`, background: '#FF5C72' }} title={`Breaks: ${breakCount}`}/>
          )}
        </div>
        <div className="flex justify-between mt-2 text-[12px] font-mono">
          <span className="text-emerald2">{cleanCount} clean</span>
          <span className="text-coral">{breakCount} broken</span>
        </div>
      </section>

      {/* Mistake taxonomy — which rule, how often, what it cost */}
      <section className="card p-5">
        <h3 className="font-display font-semibold text-textp text-lg mb-1 flex items-center gap-2">
          <Icon name="target" className="w-5 h-5 text-coral"/> The leak finder
        </h3>
        <p className="text-texts text-[13px] mb-3">Every breach is tagged with the steps that were skipped. The most expensive rule to break is the one to drill this week.</p>
        {Object.keys(stats.stepBreaks).length === 0 && stats.revengeCount === 0 && stats.riskyN === 0 ? (
          <p className="text-emerald2 text-[14px] font-display"><Icon name="check" className="inline w-4 h-4 mr-1"/>No tagged breaches yet. Keep it that way.</p>
        ) : (
          <ul className="space-y-2">
            {Object.entries(stats.stepBreaks).sort((a, b) => b[1].n - a[1].n).map(([id, v]) => (
              <li key={id} className="flex items-center justify-between gap-3 py-2 border-b border-border last:border-0">
                <span className="text-textp text-[14px]">{STEP_LABELS[id] || id} <span className="text-textt text-[12px]">(step {id.slice(1)})</span></span>
                <span className="flex items-center gap-3">
                  <span className="font-mono text-textt text-[12px]">skipped {v.n}×</span>
                  <span className={`font-display font-semibold text-[15px] ${v.r >= 0 ? 'text-emerald2' : 'text-coral'}`}>{v.d >= 0 ? '+' : '−'}${Math.abs(v.d)}</span>
                </span>
              </li>
            ))}
            {stats.revengeCount > 0 && (
              <li className="flex items-center justify-between gap-3 py-2 border-b border-border last:border-0">
                <span className="text-textp text-[14px]">Fired &lt; 5 min after a loss <span className="text-textt text-[12px]">(revenge timing)</span></span>
                <span className="flex items-center gap-3">
                  <span className="font-mono text-textt text-[12px]">{stats.revengeCount}×</span>
                  <span className={`font-display font-semibold text-[15px] ${stats.revengeR >= 0 ? 'text-emerald2' : 'text-coral'}`}>{stats.revengeD >= 0 ? '+' : '−'}${Math.abs(stats.revengeD)}</span>
                </span>
              </li>
            )}
            {stats.riskyN > 0 && (
              <li className="flex items-center justify-between gap-3 py-2">
                <span className="text-textp text-[14px]">Entered in a risky state <span className="text-textt text-[12px]">(FOMO / revenge / anxious / tired / eager)</span></span>
                <span className="flex items-center gap-3">
                  <span className="font-mono text-textt text-[12px]">{stats.riskyN} trades</span>
                  <span className={`font-display font-semibold text-[15px] ${stats.riskyR >= 0 ? 'text-emerald2' : 'text-coral'}`}>{stats.riskyD >= 0 ? '+' : '−'}${Math.abs(stats.riskyD)}</span>
                </span>
              </li>
            )}
          </ul>
        )}
        {stats.calmN > 0 && stats.riskyN > 0 && (
          <p className="text-textt text-[12.5px] mt-3 font-body">
            For contrast: your {stats.calmN} calm/focused trades net {stats.calmD >= 0 ? '+' : '−'}${Math.abs(stats.calmD)}.
            The market pays the version of you that shows up calm.
          </p>
        )}
      </section>

      <section className="card p-5">
        <h3 className="font-display font-semibold text-textp text-lg mb-3 flex items-center gap-2">
          <Icon name="book" className="w-5 h-5 text-violet2"/> Recent days
        </h3>
        <ul className="space-y-2">
          {stats.days.slice(-10).reverse().map(d => (
            <li key={d.date} className="flex items-center justify-between gap-3 flex-wrap py-2 border-b border-border last:border-0">
              <span className="font-mono text-texts text-[13px]">{d.date}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-textt text-[12px]">{d.trades.length} trade{d.trades.length === 1 ? '' : 's'}</span>
                <span className={`pill ${d.clean ? 'pill-emerald' : 'pill-coral'} text-[10px]`}>
                  {d.clean ? 'All 7' : 'Break'}
                </span>
                <span className={`font-display font-semibold ${d.net >= 0 ? 'text-emerald2' : 'text-coral'}`}>
                  {d.net >= 0 ? '+' : ''}{r2(d.net)}R
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="card p-5 border-l-4" style={{ borderLeftColor: '#FFB347' }}>
        <p className="text-textp text-[15px] font-display">A rule-following loss is a <span className="text-emerald2">good trade</span>. A rule-breaking win is the <span className="text-coral">dangerous one</span>.</p>
      </section>
    </div>
  )
}

function Tile({ label, value, sub, color, big }) {
  const colorMap = {
    emerald: 'text-emerald2 text-glow-emerald',
    gold: 'text-gold text-glow-gold',
    violet: 'text-violet2 text-glow-violet',
    cyan: 'text-cyan2 text-glow-cyan',
    coral: 'text-coral text-glow-coral',
  }
  return (
    <div className="card p-4 md:p-5">
      <div className="font-display text-[11px] tracking-[0.18em] uppercase text-textt">{label}</div>
      <div className={`font-display font-semibold mt-2 ${big ? 'text-4xl' : 'text-3xl'} ${colorMap[color] || 'text-textp'}`}>{value}</div>
      {sub && <div className="text-texts text-[12px] mt-2 font-mono">{sub}</div>}
    </div>
  )
}

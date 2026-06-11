import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon.jsx'
import { useTrades, useProgress, useWeekStats } from '../hooks.js'
import { getDerivedStats, tradeDollars } from '../storage.js'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid,
  BarChart, Bar, Cell,
} from 'recharts'

const MODES = [
  { key: 'all', label: 'All' },
  { key: 'sim', label: 'Sim' },
  { key: 'live', label: 'Live' },
]

function pct(n) { return `${Math.round(n * 100)}%` }
function r2(n) { return Math.round(n * 100) / 100 }

function StatTile({ label, value, sub, accent = 'plain', big = false }) {
  const colorMap = {
    emerald: 'text-emerald2 text-glow-emerald',
    gold: 'text-gold text-glow-gold',
    violet: 'text-violet2 text-glow-violet',
    cyan: 'text-cyan2 text-glow-cyan',
    coral: 'text-coral text-glow-coral',
    plain: 'text-textp text-glow-soft',
  }
  return (
    <div className="card p-4 md:p-5">
      <div className="font-display text-[11px] tracking-[0.18em] uppercase text-textt">{label}</div>
      <div className={`font-display font-semibold mt-2 ${big ? 'text-4xl md:text-5xl' : 'text-3xl'} ${colorMap[accent]}`}>{value}</div>
      {sub && <div className="text-texts text-[12px] mt-2 font-mono">{sub}</div>}
    </div>
  )
}

function SampleChip({ stats }) {
  if (!stats) return null
  const map = {
    'PRELIMINARY': { cls: 'pill-gold', note: 'under 30 trades — treat every number as a sketch' },
    'MEANINGFUL': { cls: 'pill-cyan', note: '30–99 trades — patterns are forming' },
    'DECISION-GRADE': { cls: 'pill-emerald', note: '100+ trades — these numbers mean something' },
  }
  const m = map[stats.sampleLabel]
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className={`pill ${m.cls}`}>{stats.sampleLabel} · {stats.n} trades</span>
      <span className="text-textt text-[12px] font-body">{m.note}</span>
    </div>
  )
}

function Verdict({ stats, mode }) {
  if (!stats || stats.n < 20) {
    const have = stats?.n || 0
    return (
      <div className="card p-6 relative overflow-hidden">
        <div className="pill pill-violet inline-flex mb-3">Building data</div>
        <h2 className="font-display font-semibold text-2xl md:text-3xl text-textp">{have}/20 trades toward verdict</h2>
        <p className="text-texts text-[14px] mt-2 max-w-lg">A meaningful sample lives at 20+. Trade your sim trades like real ones until then. Go live when the data says you're ready — not when the calendar says so.</p>
        <div className="mt-4 w-full bg-bg rounded-full h-2 border border-border overflow-hidden">
          <div className="h-full bg-violet2 transition-all" style={{ width: `${Math.min(100, (have/20)*100)}%`, boxShadow: '0 0 16px rgba(155,140,255,0.4)' }} />
        </div>
      </div>
    )
  }
  const okExp = stats.expectancy > 0
  const okRule = stats.ruleAdherence >= 0.9
  const okWin = stats.winRate >= 0.5
  const green = okExp && okRule && okWin
  return (
    <div className={`card p-6 relative overflow-hidden ${green ? 'border-emerald2/40' : 'border-coral/40'}`} style={{ borderWidth: 1 }}>
      <div className={`pill mb-3 inline-flex ${green ? 'pill-emerald' : 'pill-coral'}`}>{green ? 'GREEN LIGHT' : 'NOT YET'}</div>
      <h2 className={`font-display font-semibold text-3xl md:text-4xl ${green ? 'text-emerald2 text-glow-emerald' : 'text-coral text-glow-coral'}`}>
        {green ? 'The data says you’re ready.' : 'The data says: keep grooving.'}
      </h2>
      <p className="text-texts text-[14px] mt-3 max-w-2xl">
        Go live when the data says you're ready — not when the calendar says so.
      </p>

      <ul className="mt-5 grid md:grid-cols-3 gap-3">
        <Criterion ok={okExp} label="Expectancy > 0" value={`${stats.expectancy >= 0 ? '+' : ''}${r2(stats.expectancy)}R / trade`} miss={!okExp ? `${r2(-stats.expectancy)}R short` : ''} />
        <Criterion ok={okRule} label="Rule adherence ≥ 90%" value={pct(stats.ruleAdherence)} miss={!okRule ? `${pct(0.9 - stats.ruleAdherence)} short` : ''} />
        <Criterion ok={okWin} label="Win rate ≥ 50%" value={pct(stats.winRate)} miss={!okWin ? `${pct(0.5 - stats.winRate)} short` : ''} />
      </ul>
      <div className="mt-4"><SampleChip stats={stats} /></div>
      <div className="mt-2 text-textt text-[12px] font-mono">Mode: {mode.toUpperCase()}</div>
    </div>
  )
}

// Live-only safety panel: the rules that send you back to sim, checked automatically.
function BackToSim({ liveStats, week }) {
  if (!liveStats || !liveStats.n) return null
  const triggers = [
    {
      hit: week.locked,
      label: 'Weekly max loss hit',
      detail: week.locked ? `−${Math.abs(week.netR)}R this week — sim until Monday` : `${Math.abs(Math.min(0, week.netR))}R of ${week.weeklyLimitR}R used`,
    },
    {
      hit: liveStats.currentLossStreak >= 4,
      label: '4+ losses in a row',
      detail: liveStats.currentLossStreak >= 4 ? `${liveStats.currentLossStreak} straight — rebuild confidence in sim` : `current streak: ${liveStats.currentLossStreak}`,
    },
    {
      hit: liveStats.rolling20N >= 20 && liveStats.rolling20 < 0,
      label: 'Rolling 20-trade expectancy negative',
      detail: liveStats.rolling20N >= 20 ? `${liveStats.rolling20 >= 0 ? '+' : ''}${r2(liveStats.rolling20)}R/trade over last 20` : `${liveStats.rolling20N}/20 trades so far`,
    },
  ]
  const anyHit = triggers.some(t => t.hit)
  return (
    <div className={`card p-5 ${anyHit ? 'border-coral/50' : ''}`}>
      <h3 className="font-display font-semibold text-textp text-lg mb-1 flex items-center gap-2">
        <Icon name="shield" className={`w-5 h-5 ${anyHit ? 'text-coral' : 'text-emerald2'}`} /> Back-to-sim triggers · LIVE
      </h3>
      <p className="text-texts text-[13px] mb-3">Decided in advance so a bad week can't talk you out of them.</p>
      <ul className="grid md:grid-cols-3 gap-3">
        {triggers.map((t, i) => (
          <li key={i} className={`rounded-card p-3 border ${t.hit ? 'border-coral/40 bg-coral/5' : 'border-emerald2/30 bg-emerald2/5'}`}>
            <div className="flex items-center gap-2">
              <Icon name={t.hit ? 'alert' : 'check'} className={`w-4 h-4 ${t.hit ? 'text-coral' : 'text-emerald2'}`} />
              <span className="font-display text-textp text-[13px]">{t.label}</span>
            </div>
            <div className={`font-mono text-[12px] mt-1 ${t.hit ? 'text-coral' : 'text-texts'}`}>{t.detail}</div>
          </li>
        ))}
      </ul>
      {anyHit && <p className="text-coral text-[13px] font-display mt-3">A trigger is hit — the plan says SIM. Honoring it is what professionals do.</p>}
    </div>
  )
}

// Sim vs live divergence — execution or psychology check.
function SimVsLive({ sim, live }) {
  if (!sim || !live || sim.n < 10 || live.n < 5) return null
  const rows = [
    { label: 'Win rate', s: pct(sim.winRate), l: pct(live.winRate), bad: live.winRate < sim.winRate - 0.15 },
    { label: 'Expectancy', s: `${sim.expectancy >= 0 ? '+' : ''}${r2(sim.expectancy)}R`, l: `${live.expectancy >= 0 ? '+' : ''}${r2(live.expectancy)}R`, bad: live.expectancy < 0 && sim.expectancy > 0 },
    { label: 'Rule adherence', s: pct(sim.ruleAdherence), l: pct(live.ruleAdherence), bad: live.ruleAdherence < sim.ruleAdherence - 0.1 },
  ]
  const diverging = rows.some(r => r.bad)
  return (
    <div className={`card p-5 ${diverging ? 'border-gold/50' : ''}`}>
      <h3 className="font-display font-semibold text-textp text-lg mb-3 flex items-center gap-2">
        <Icon name="stats" className="w-5 h-5 text-violet2" /> Sim vs Live — same trader?
      </h3>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="font-display text-[11px] uppercase tracking-[0.14em] text-textt text-left">Metric</div>
        <div className="font-display text-[11px] uppercase tracking-[0.14em] text-violet2">SIM ({sim.n})</div>
        <div className="font-display text-[11px] uppercase tracking-[0.14em] text-coral">LIVE ({live.n})</div>
        {rows.map((r, i) => (
          <FragmentRow key={i} r={r} />
        ))}
      </div>
      {diverging
        ? <p className="text-gold text-[13px] font-display mt-3"><Icon name="alert" className="inline w-4 h-4 mr-1" />Live is running well below sim. That gap is usually psychology or execution, not the setup — diagnose before risking more.</p>
        : <p className="text-texts text-[13px] mt-3">Live tracks sim within normal variance. The skill is transferring.</p>}
    </div>
  )
}
function FragmentRow({ r }) {
  return (
    <>
      <div className="text-texts text-[13px] text-left">{r.label}</div>
      <div className="font-mono text-textp text-[14px]">{r.s}</div>
      <div className={`font-mono text-[14px] ${r.bad ? 'text-coral' : 'text-textp'}`}>{r.l}</div>
    </>
  )
}

function Criterion({ ok, label, value, miss }) {
  return (
    <li className={`rounded-card p-3 border ${ok ? 'border-emerald2/40 bg-emerald2/5' : 'border-coral/30 bg-coral/5'}`}>
      <div className="flex items-center gap-2">
        <Icon name={ok ? 'check' : 'x'} className={`w-4 h-4 ${ok ? 'text-emerald2' : 'text-coral'}`} />
        <span className="font-display text-textp text-[13px]">{label}</span>
      </div>
      <div className={`font-display font-semibold text-xl mt-1 ${ok ? 'text-emerald2' : 'text-coral'}`}>{value}</div>
      {miss && <div className="font-mono text-textt text-[11px] mt-1">{miss}</div>}
    </li>
  )
}

function Distribution({ items, label, accentKey }) {
  if (!items.length) return null
  return (
    <div className="card p-5">
      <h3 className="font-display font-semibold text-textp text-base mb-3">{label}</h3>
      <ul className="space-y-2">
        {items.map(([k, v]) => (
          <li key={k} className="flex items-center justify-between gap-3">
            <span className="font-mono text-texts text-[13px] truncate">{k}</span>
            <span className="flex items-center gap-3">
              <span className="font-mono text-textt text-[12px]">{v.n} trades</span>
              <span className={`font-display font-semibold text-[15px] ${v.r >= 0 ? 'text-emerald2' : 'text-coral'}`}>{v.r >= 0 ? '+' : ''}{r2(v.r)}R</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function buildByDayCurve(trades) {
  // Group by local date, cumulative sum, output [{label: 'YYYY-MM-DD', short: 'MM/DD', r}]
  if (!trades.length) return []
  const byDate = new Map()
  for (const t of trades) {
    const d = new Date(t.datetime)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const r = typeof t.totalR === 'number' ? t.totalR : 0
    byDate.set(key, (byDate.get(key) || 0) + r)
  }
  const dates = Array.from(byDate.keys()).sort()
  let acc = 0
  return dates.map(d => {
    acc += byDate.get(d)
    const [_, m, day] = d.split('-')
    return { label: d, short: `${m}/${day}`, r: Math.round(acc * 100) / 100, dayR: Math.round(byDate.get(d) * 100) / 100 }
  })
}

function buildHistogram(totals) {
  const bins = [
    { label: '−6R', test: r => r <= -5 },
    { label: '−4..−2R', test: r => r > -5 && r <= -1.5 },
    { label: '−1.5..0', test: r => r > -1.5 && r < 0 },
    { label: '0..2R', test: r => r >= 0 && r < 2 },
    { label: '2..4R', test: r => r >= 2 && r < 4 },
    { label: '4..8R', test: r => r >= 4 && r < 8 },
    { label: '8R+', test: r => r >= 8 },
  ]
  return bins.map(b => ({ label: b.label, n: totals.filter(b.test).length, neg: b.label.startsWith('−') }))
}

export default function Stats() {
  const [mode, setMode] = useState('sim')
  const [curveView, setCurveView] = useState('trade') // 'trade' | 'day'
  const trades = useTrades()
  const progress = useProgress()
  const stats = getDerivedStats(mode)
  const simStats = getDerivedStats('sim')
  const liveStats = getDerivedStats('live')
  const week = useWeekStats('live')

  if (!trades.length) {
    return (
      <div className="space-y-5 max-w-3xl">
        <header>
          <div className="pill pill-cyan inline-flex mb-3"><Icon name="stats" className="w-3.5 h-3.5"/> Stats</div>
          <h1 className="font-display font-semibold text-3xl md:text-4xl text-textp tracking-tight">Stats dashboard</h1>
          <p className="text-texts mt-2">Nothing to measure yet. Log your first sim trade.</p>
        </header>
        <Link to="/trade" className="btn btn-primary inline-flex w-fit"><Icon name="chart" className="w-4 h-4"/> Open trade cockpit</Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <div className="pill pill-cyan inline-flex mb-3"><Icon name="stats" className="w-3.5 h-3.5"/> Stats</div>
          <h1 className="font-display font-semibold text-3xl md:text-4xl text-textp tracking-tight">Stats dashboard</h1>
          <p className="text-texts mt-2">Win rate alone is a liar. Expectancy + adherence are the truth.</p>
        </div>
        <div className="flex gap-2">
          {MODES.map(m => (
            <button key={m.key} className={`btn ${mode === m.key ? 'btn-primary' : 'btn-ghost'} text-[12px] py-1.5 px-3`} onClick={() => setMode(m.key)}>{m.label}</button>
          ))}
        </div>
      </header>

      <Verdict stats={stats} mode={mode} />

      {stats ? (
        <>
          {/* Stat row — win rate + avg win + avg loss together */}
          <section>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatTile label="Win rate" value={pct(stats.winRate)} sub={`${Math.round(stats.winRate * stats.n)}/${stats.n} winners`} accent="emerald" />
              <StatTile label="Avg win" value={`+${r2(stats.avgWinR)}R`} sub="per winning trade" accent="emerald" />
              <StatTile label="Avg loss" value={`${r2(stats.avgLossR)}R`} sub="per losing trade" accent="coral" />
              <StatTile label="Expectancy" value={`${stats.expectancy >= 0 ? '+' : ''}${r2(stats.expectancy)}R`} sub={(() => {
                const avgD = Math.round(stats.trades.reduce((a, t) => a + tradeDollars(t), 0) / stats.n)
                return `${avgD >= 0 ? '+' : '−'}$${Math.abs(avgD)} per trade (actual stops)`
              })()} accent="gold" big />
            </div>
            <p className="text-textt text-[12px] mt-3 font-body italic text-center">
              We never show win rate without average win vs loss. A 30% win rate with +3R wins beats a 60% win rate with -1R losses every day.
            </p>
          </section>

          {/* Pro metrics */}
          <section>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatTile
                label="Profit factor"
                value={stats.profitFactor === Infinity ? '∞' : r2(stats.profitFactor)}
                sub={stats.profitFactor >= 1.3 ? '>1.3 = real edge' : 'target > 1.3'}
                accent={stats.profitFactor >= 1.3 ? 'emerald' : 'gold'}
              />
              <StatTile label="Max drawdown" value={`−${r2(stats.maxDD)}R`} sub="deepest dip from an equity peak" accent="coral" />
              <StatTile label="Streaks" value={`${stats.bestWinStreak}W / ${stats.worstLossStreak}L`} sub="best run / worst run" accent="violet" />
              <StatTile
                label="Last 20 trades"
                value={`${stats.rolling20 >= 0 ? '+' : ''}${r2(stats.rolling20)}R`}
                sub={stats.rolling20N >= 20 ? 'rolling expectancy — is the edge here NOW?' : `${stats.rolling20N}/20 logged`}
                accent={stats.rolling20 >= 0 ? 'cyan' : 'coral'}
              />
            </div>
          </section>

          {mode === 'live' && <BackToSim liveStats={liveStats} week={week} />}
          <SimVsLive sim={simStats} live={liveStats} />

          {/* Equity curve */}
          <section className="card p-5">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
              <h3 className="font-display font-semibold text-textp text-lg flex items-center gap-2">
                <Icon name="chart" className="w-5 h-5 text-emerald2"/> Cumulative R · {mode.toUpperCase()}
              </h3>
              <div className="flex gap-1 p-1 rounded-lg border border-border bg-bg" role="tablist" aria-label="Equity curve view">
                {[
                  { k: 'trade', l: 'By trade' },
                  { k: 'day', l: 'By day' },
                ].map(o => (
                  <button
                    key={o.k}
                    role="tab"
                    aria-selected={curveView === o.k}
                    className={`font-display tracking-wide text-[12px] py-1.5 px-3 rounded-md transition ${curveView === o.k ? 'bg-emerald2 text-bg shadow-glow' : 'text-texts hover:text-textp'}`}
                    onClick={() => setCurveView(o.k)}
                  >
                    {o.l}
                  </button>
                ))}
              </div>
            </div>
            <div className="w-full h-64">
              {(() => {
                if (curveView === 'trade') {
                  return (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stats.cum} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
                        <CartesianGrid stroke="#252C44" strokeDasharray="3 5" />
                        <XAxis dataKey="idx" stroke="#5E6884" tick={{ fontSize: 11, fontFamily: 'Space Mono' }} />
                        <YAxis stroke="#5E6884" tick={{ fontSize: 11, fontFamily: 'Space Mono' }} />
                        <Tooltip
                          contentStyle={{ background: '#121829', border: '1px solid #252C44', borderRadius: 8, fontFamily: 'Space Mono', color: '#E8ECF4' }}
                          labelStyle={{ color: '#9BA6BE' }}
                          formatter={(v) => [`${v >= 0 ? '+' : ''}${v}R`, 'Cumulative']}
                          labelFormatter={(l) => `Trade #${l}`}
                        />
                        <ReferenceLine y={0} stroke="#5E6884" strokeDasharray="3 3" />
                        <Line type="monotone" dataKey="r" stroke="#1FE0A0" strokeWidth={2.2} dot={false} activeDot={{ r: 5, fill: '#1FE0A0' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  )
                }
                const byDay = buildByDayCurve(stats.trades)
                if (!byDay.length) return <div className="h-full flex items-center justify-center text-texts text-[13px]">No completed days yet.</div>
                return (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={byDay} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
                      <CartesianGrid stroke="#252C44" strokeDasharray="3 5" />
                      <XAxis dataKey="short" stroke="#5E6884" tick={{ fontSize: 11, fontFamily: 'Space Mono' }} />
                      <YAxis stroke="#5E6884" tick={{ fontSize: 11, fontFamily: 'Space Mono' }} />
                      <Tooltip
                        contentStyle={{ background: '#121829', border: '1px solid #252C44', borderRadius: 8, fontFamily: 'Space Mono', color: '#E8ECF4' }}
                        labelStyle={{ color: '#9BA6BE' }}
                        formatter={(v, _n, ctx) => [`${v >= 0 ? '+' : ''}${v}R`, ctx?.dataKey === 'dayR' ? 'That day' : 'Cumulative']}
                        labelFormatter={(l, items) => {
                          const full = items?.[0]?.payload?.label
                          return full ? `Day · ${full}` : `Day · ${l}`
                        }}
                      />
                      <ReferenceLine y={0} stroke="#5E6884" strokeDasharray="3 3" />
                      <Line type="monotone" dataKey="r" name="Cumulative" stroke="#1FE0A0" strokeWidth={2.2} dot={{ r: 3, fill: '#1FE0A0' }} activeDot={{ r: 5, fill: '#1FE0A0' }} />
                      <Line type="monotone" dataKey="dayR" name="That day" stroke="#9B8CFF" strokeWidth={1.4} strokeDasharray="4 4" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                )
              })()}
            </div>
          </section>

          {/* R-multiple histogram */}
          <section className="card p-5">
            <h3 className="font-display font-semibold text-textp text-lg mb-1 flex items-center gap-2">
              <Icon name="stats" className="w-5 h-5 text-cyan2"/> R-multiple distribution
            </h3>
            <p className="text-texts text-[13px] mb-3">The healthy shape: a wall of small controlled losses on the left, a long tail of big wins on the right.</p>
            <div className="w-full h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={buildHistogram(stats.totals)} margin={{ top: 10, right: 16, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="#252C44" strokeDasharray="3 5" vertical={false} />
                  <XAxis dataKey="label" stroke="#5E6884" tick={{ fontSize: 10, fontFamily: 'Space Mono' }} />
                  <YAxis allowDecimals={false} stroke="#5E6884" tick={{ fontSize: 11, fontFamily: 'Space Mono' }} />
                  <Tooltip
                    contentStyle={{ background: '#121829', border: '1px solid #252C44', borderRadius: 8, fontFamily: 'Space Mono', color: '#E8ECF4' }}
                    formatter={(v) => [`${v} trade${v === 1 ? '' : 's'}`, 'Count']}
                  />
                  <Bar dataKey="n" radius={[4, 4, 0, 0]}>
                    {buildHistogram(stats.totals).map((b, i) => (
                      <Cell key={i} fill={b.neg ? '#FF5C72' : '#1FE0A0'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Rule adherence + by grade + by candle */}
          <section className="grid md:grid-cols-3 gap-3">
            <StatTile
              label="Rule adherence"
              value={pct(stats.ruleAdherence)}
              sub={`${Math.round(stats.ruleAdherence * stats.n)} of ${stats.n} followed all 7`}
              accent={stats.ruleAdherence >= 0.9 ? 'emerald' : 'gold'}
              big
            />
            <Distribution
              label="By setup grade"
              items={Object.entries(stats.byGrade).filter(([_, v]) => v.n > 0)}
            />
            <Distribution
              label="By candle"
              items={Object.entries(stats.byCandle).sort((a, b) => b[1].n - a[1].n)}
            />
          </section>

          {/* Edge finder — where the money actually comes from */}
          <section>
            <h3 className="font-display font-semibold text-textp text-lg mb-3 flex items-center gap-2">
              <Icon name="target" className="w-5 h-5 text-gold"/> Edge finder
            </h3>
            <div className="grid md:grid-cols-3 gap-3">
              <Distribution
                label="By state at entry"
                items={Object.entries(stats.byEmotion).sort((a, b) => b[1].n - a[1].n)}
              />
              <Distribution
                label="By time of day"
                items={Object.entries(stats.byTimeBucket).sort((a, b) => b[1].n - a[1].n)}
              />
              <Distribution
                label="By day of week"
                items={Object.entries(stats.byDOW).sort((a, b) => b[1].n - a[1].n)}
              />
            </div>
            <p className="text-textt text-[12px] mt-3 font-body italic text-center">
              This is where leaks hide: if "FOMO" or "After 10:30" rows bleed red while "Calm · 9:30–9:45" prints green, the data has spoken.
            </p>
          </section>
        </>
      ) : (
        <div className="card p-6 text-center">
          <p className="text-texts">No trades in <span className="font-display text-textp">{mode}</span> mode yet.</p>
        </div>
      )}
    </div>
  )
}

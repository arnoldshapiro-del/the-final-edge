import { Link } from 'react-router-dom'
import { useSettings, useProgress, useTrades } from '../hooks.js'
import { setSettings, getDerivedStats } from '../storage.js'
import { Icon } from '../components/Icon.jsx'
import { useState, useEffect } from 'react'

function StatTile({ label, value, sub, accent = 'emerald', to, big = false }) {
  const colorMap = {
    emerald: 'text-emerald2 text-glow-emerald',
    gold: 'text-gold text-glow-gold',
    violet: 'text-violet2 text-glow-violet',
    cyan: 'text-cyan2 text-glow-cyan',
    coral: 'text-coral text-glow-coral',
    plain: 'text-textp text-glow-soft',
  }
  const inner = (
    <div className="card card-hover p-4 md:p-5 h-full flex flex-col">
      <div className="font-display text-[11px] tracking-[0.18em] uppercase text-textt">{label}</div>
      <div className={`font-display font-semibold mt-2 ${big ? 'text-4xl md:text-5xl' : 'text-3xl'} ${colorMap[accent]}`}>{value}</div>
      {sub && <div className="text-texts text-[12px] mt-2 font-mono">{sub}</div>}
    </div>
  )
  return to ? <Link to={to} className="block h-full">{inner}</Link> : inner
}

export default function Home() {
  const settings = useSettings()
  const progress = useProgress()
  useTrades() // refresh trigger
  const stats = getDerivedStats('sim')
  const [editingMission, setEditingMission] = useState(false)
  const [draft, setDraft] = useState(settings.mission)
  useEffect(() => setDraft(settings.mission), [settings.mission])

  const trainerAcc = progress.trainerAttempts > 0
    ? Math.round((progress.trainerCorrect / progress.trainerAttempts) * 100)
    : null
  const lessonsDone = progress.lessonsCompleted?.length || 0

  const verdict = (() => {
    if (!stats || stats.n < 20) return { label: 'Building data', color: 'violet', sub: stats ? `${stats.n}/20 sim trades` : '0/20 sim trades' }
    const ok = stats.expectancy > 0 && stats.ruleAdherence >= 0.9 && stats.winRate >= 0.5
    return ok
      ? { label: 'Green light', color: 'emerald', sub: 'Discipline confirmed' }
      : { label: 'Not yet', color: 'coral', sub: 'Refine the edges' }
  })()

  const saveMission = () => { setSettings({ ...settings, mission: draft }); setEditingMission(false) }
  const resetMission = () => {
    const DEFAULT = "Five and a half years brought me here. I no longer chase reversals or fight the trend. I trade one setup — a pullback with the trend, entered on the second push, stop behind the crowd — and I trade it with discipline. I do this for myself, for Ela, for the future we're building, and for the quiet satisfaction of finally doing it right."
    setDraft(DEFAULT)
  }

  return (
    <div className="space-y-8">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="relative">
          <div className="pill pill-violet mb-4 inline-flex">
            <Icon name="flame" className="w-3.5 h-3.5" />
            The transformation
          </div>
          <h1 className="font-display font-semibold text-[40px] md:text-[58px] leading-[1.05] tracking-tight text-textp">
            THE <span className="text-emerald2 text-glow-emerald">FINAL</span> EDGE
          </h1>
          <p className="mt-3 text-texts font-display tracking-wide text-lg md:text-xl">
            One setup. <span className="text-gold">With the trend.</span> Mastered.
          </p>
        </div>
        <div aria-hidden className="pointer-events-none absolute -top-12 -right-12 w-72 h-72 rounded-full" style={{ background: 'radial-gradient(circle, rgba(31,224,160,0.10), transparent 65%)' }} />
      </header>

      {/* Mission card */}
      <section className="card p-6 md:p-7">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Icon name="compass" className="w-5 h-5 text-violet2" />
            <h2 className="font-display font-semibold text-xl text-textp tracking-wide">My mission</h2>
          </div>
          {!editingMission ? (
            <button className="btn btn-ghost text-[12px] py-1.5 px-3" onClick={() => setEditingMission(true)}>
              <Icon name="edit" className="w-3.5 h-3.5" /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button className="btn btn-ghost text-[12px] py-1.5 px-3" onClick={resetMission}>Default</button>
              <button className="btn btn-primary text-[12px] py-1.5 px-3" onClick={saveMission}>Save</button>
            </div>
          )}
        </div>
        {!editingMission ? (
          <p className="font-body text-textp text-[17px] md:text-[18px] leading-[1.8] tracking-[0.005em]">
            {settings.mission}
          </p>
        ) : (
          <textarea className="w-full min-h-[160px]" value={draft} onChange={e => setDraft(e.target.value)} />
        )}
      </section>

      {/* Transformation row */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-xl text-textp tracking-wide">Your transformation</h2>
          <Link to="/stats" className="text-texts hover:text-textp font-display text-[13px] flex items-center gap-1">See stats <Icon name="arrow" className="w-3.5 h-3.5"/></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          <StatTile label="Lessons mastered" value={`${lessonsDone}/10`} sub={lessonsDone === 10 ? 'All locked in' : 'Keep going'} accent="gold" to="/learn" />
          <StatTile label="Trainer accuracy" value={trainerAcc != null ? `${trainerAcc}%` : '—'} sub={trainerAcc != null ? `${progress.trainerCorrect}/${progress.trainerAttempts}` : 'Run your first set'} accent="cyan" to="/trainer" />
          <StatTile label="Sim green streak" value={progress.simGreenStreak || 0} sub="Consecutive green days" accent="emerald" to="/stats" />
          <StatTile
            label="Rule adherence"
            value={stats ? `${Math.round(stats.ruleAdherence * 100)}%` : '—'}
            sub={stats ? `${stats.n} sim trades` : 'Log your first trade'}
            accent="violet"
            to="/trade"
          />
          <StatTile
            label="Go-live verdict"
            value={verdict.label}
            sub={verdict.sub}
            accent={verdict.color}
            to="/stats"
          />
        </div>
      </section>

      {/* Quick actions */}
      <section className="grid md:grid-cols-3 gap-4">
        <Link to="/learn" className="card card-hover p-5 group">
          <Icon name="book" className="w-6 h-6 text-gold mb-3"/>
          <h3 className="font-display font-semibold text-textp text-lg">Open the playbook</h3>
          <p className="text-texts text-[14px] mt-1">10 lessons. One edge. Study like a master.</p>
        </Link>
        <Link to="/trainer" className="card card-hover p-5 group">
          <Icon name="target" className="w-6 h-6 text-cyan2 mb-3"/>
          <h3 className="font-display font-semibold text-textp text-lg">Drill the setup</h3>
          <p className="text-texts text-[14px] mt-1">Trade or skip. Build the reflex.</p>
        </Link>
        <Link to="/trade" className="card card-hover p-5 group">
          <Icon name="chart" className="w-6 h-6 text-emerald2 mb-3"/>
          <h3 className="font-display font-semibold text-textp text-lg">Trade with the cockpit</h3>
          <p className="text-texts text-[14px] mt-1">Checklist gate. Stay honest.</p>
        </Link>
      </section>

      <section className="card p-5 border-l-4" style={{ borderLeftColor: '#FFB347' }}>
        <div className="flex items-start gap-3">
          <Icon name="shield" className="w-5 h-5 text-gold mt-0.5"/>
          <div>
            <h3 className="font-display font-semibold text-textp">The deadline is a deadline to be ready — not to go live.</h3>
            <p className="text-texts text-[14px] mt-1">Real money comes when the data says you've earned it. Until then: sim, sim, sim.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

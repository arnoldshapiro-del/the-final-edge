import { useState, useEffect } from 'react'
import { Icon } from './Icon.jsx'
import { getPremarket, setPremarket, addEOD, getEOD, getSession, todayStr, getProgress, patchProgress } from '../storage.js'
import { useSettings, usePremarket, useEOD } from '../hooks.js'

const PREMARKET_STEPS = [
  { id: 'p1', text: 'Mark the 15-min trend direction (HH/HL · LH/LL · sideways)' },
  { id: 'p2', text: 'Note today’s key levels (overnight high/low, prior day high/low)' },
  { id: 'p3', text: 'Confirm today’s max trades & max loss in settings' },
  { id: 'p4', text: 'Read the mantras (15 says IF; 5 and 2 say WHEN and WHERE)' },
]

export function PreMarket() {
  const settings = useSettings()
  const stored = usePremarket()
  const today = todayStr()
  const isToday = stored && stored.date === today
  const [open, setOpen] = useState(false)
  const [trend, setTrend] = useState(isToday ? stored.trend15m : 'up')
  const [levels, setLevels] = useState(isToday ? stored.keyLevels : '')
  const [checks, setChecks] = useState(() => {
    if (isToday && stored.checks) return stored.checks
    return Object.fromEntries(PREMARKET_STEPS.map(s => [s.id, false]))
  })

  useEffect(() => {
    if (isToday) {
      setTrend(stored.trend15m)
      setLevels(stored.keyLevels)
      setChecks(stored.checks || Object.fromEntries(PREMARKET_STEPS.map(s => [s.id, false])))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stored?.date])

  const allDone = Object.values(checks).every(Boolean) && trend && (trend !== 'sideways' || true)
  const save = () => {
    setPremarket({
      date: today,
      trend15m: trend,
      keyLevels: levels,
      maxTrades: settings.maxTradesPerSession,
      maxLoss: settings.maxLossPerSession,
      checks,
    })
    setOpen(false)
  }

  return (
    <div className="card overflow-hidden">
      <button className="w-full p-5 flex items-center justify-between gap-3 text-left card-hover" onClick={() => setOpen(o => !o)}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-cyan2/10 border border-cyan2/30">
            <Icon name="compass" className="w-5 h-5 text-cyan2"/>
          </div>
          <div>
            <h3 className="font-display font-semibold text-textp text-base">Pre-market routine</h3>
            <p className="text-texts text-[13px]">
              {isToday ? <span className="text-emerald2">Today: {stored.trend15m} · ready</span> : 'Set up your edge before the bell'}
            </p>
          </div>
        </div>
        <Icon name={open ? 'x' : 'arrow'} className="w-4 h-4 text-textt"/>
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-border pt-5">
          <div>
            <label className="field-label">15-min trend</label>
            <div className="flex gap-2 flex-wrap">
              {[{k:'up',label:'Uptrend',c:'emerald'},{k:'down',label:'Downtrend',c:'coral'},{k:'sideways',label:'Sideways',c:'gold'}].map(o => (
                <button
                  key={o.k}
                  className={`btn ${trend === o.k ? (o.c === 'emerald' ? 'btn-primary' : o.c === 'coral' ? 'btn-danger' : 'btn-gold') : 'btn-ghost'}`}
                  onClick={() => setTrend(o.k)}
                >{o.label}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="field-label">Key levels</label>
            <input type="text" value={levels} onChange={e => setLevels(e.target.value)} placeholder="e.g. ONH 2192.4, ONL 2178.1, PDH 2189.0" />
          </div>
          <ul className="space-y-2">
            {PREMARKET_STEPS.map((s, i) => (
              <li key={s.id}>
                <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${checks[s.id] ? 'border-emerald2/40 bg-emerald2/5' : 'border-border'}`}>
                  <input
                    type="checkbox"
                    className="mt-0.5 w-5 h-5 accent-[#1FE0A0]"
                    checked={!!checks[s.id]}
                    onChange={e => setChecks(c => ({ ...c, [s.id]: e.target.checked }))}
                  />
                  <span className="text-textp text-[14px]">{s.text}</span>
                </label>
              </li>
            ))}
          </ul>
          <button className="btn btn-primary w-full md:w-auto" onClick={save}>
            <Icon name="check" className="w-4 h-4"/> Save pre-market
          </button>
          {trend === 'sideways' && (
            <div className="text-gold text-[13px] font-display">Sideways = no permission. Today might be a sit-out day.</div>
          )}
        </div>
      )}
    </div>
  )
}

export function EndOfDay() {
  const eod = useEOD()
  const [open, setOpen] = useState(false)
  const [followed, setFollowed] = useState('yes')
  const [change, setChange] = useState('')
  const [summary, setSummary] = useState('')

  const submit = () => {
    addEOD({
      date: todayStr(),
      followed,
      change,
      summary,
      at: new Date().toISOString(),
    })
    setChange('')
    setSummary('')
    setOpen(false)
  }

  const lastEntry = eod[0]

  return (
    <div className="card overflow-hidden">
      <button className="w-full p-5 flex items-center justify-between gap-3 text-left card-hover" onClick={() => setOpen(o => !o)}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-violet2/10 border border-violet2/30">
            <Icon name="book" className="w-5 h-5 text-violet2"/>
          </div>
          <div>
            <h3 className="font-display font-semibold text-textp text-base">End-of-day review</h3>
            <p className="text-texts text-[13px]">
              {lastEntry ? `Last logged ${lastEntry.date}` : 'Reflect on what you followed and what to change'}
            </p>
          </div>
        </div>
        <Icon name={open ? 'x' : 'arrow'} className="w-4 h-4 text-textt"/>
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-border pt-5">
          <div>
            <label className="field-label">Did I follow the plan?</label>
            <div className="flex gap-2">
              {[{k:'yes', l:'Yes — all of it'},{k:'mostly', l:'Mostly'},{k:'no', l:'No'}].map(o => (
                <button key={o.k} className={`btn ${followed === o.k ? (o.k === 'yes' ? 'btn-primary' : o.k === 'no' ? 'btn-danger' : 'btn-gold') : 'btn-ghost'}`} onClick={() => setFollowed(o.k)}>
                  {o.l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="field-label">What would I change tomorrow?</label>
            <textarea rows={2} value={change} onChange={e => setChange(e.target.value)} placeholder="One specific change."></textarea>
          </div>
          <div>
            <label className="field-label">Summary</label>
            <textarea rows={3} value={summary} onChange={e => setSummary(e.target.value)} placeholder="Pushes seen, exhaustion noted, key trades, emotional state…"></textarea>
          </div>
          <button className="btn btn-primary" onClick={submit}><Icon name="check" className="w-4 h-4"/> Save review</button>
          {eod.length > 0 && (
            <div className="pt-3 border-t border-border space-y-2 max-h-60 overflow-auto">
              <div className="font-display text-textt text-[11px] uppercase tracking-[0.16em]">Recent reviews</div>
              {eod.slice(0, 5).map((e, i) => (
                <div key={i} className="text-texts text-[13px]">
                  <span className="font-mono text-textp">{e.date}</span>
                  <span className={`pill ml-2 text-[10px] ${e.followed === 'yes' ? 'pill-emerald' : e.followed === 'no' ? 'pill-coral' : 'pill-gold'}`}>{e.followed}</span>
                  {e.summary && <div className="text-textt text-[12px] mt-0.5 line-clamp-2">{e.summary}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

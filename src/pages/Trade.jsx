import { useState, useMemo, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon.jsx'
import {
  getSettings, getTrades, addTrade, updateTrade, removeTrade,
  getSession, bumpSession, markDayPracticed, tradeTotalR,
} from '../storage.js'
import { useSettings, useTrades, useSession } from '../hooks.js'

const CHECKLIST_STEPS = [
  { id: 'q1', hard: true, text: 'Is the 15-min trending my way? (HH/HL for longs, LH/LL for shorts)' },
  { id: 'q2', text: 'With-trend pullback — not a counter-trend reversal?' },
  { id: 'q3', text: 'Has the second dip formed? (higher low for longs / lower high for shorts)' },
  { id: 'q4', text: 'Pullback healthy — holding near or above the 20 EMA?' },
  { id: 'q5', text: 'Candle grade at the second dip? (A+ / Strong / Weak — if weak/none, smaller or skip)' },
  { id: 'q6', text: 'Stop set below the first dip (lower than the crowd), AND room above to reach targets?' },
  { id: 'q7', text: 'Taking this because it\'s the plan — not because I\'m bored or chasing?' },
]

function blankForm() {
  return {
    direction: 'long',
    setupGrade: 'A+',
    candle: 'engulfing',
    entry: '',
    stop: '',
    t1Hit: false,
    t2Hit: false,
    runnerR: 0,
    note: '',
  }
}

function r2(n) { return Math.round(n * 100) / 100 }
function isNum(v) { return typeof v === 'number' && !Number.isNaN(v) }

export default function Trade() {
  const settings = useSettings()
  const trades = useTrades()
  const session = useSession()

  const [checks, setChecks] = useState(() => Object.fromEntries(CHECKLIST_STEPS.map(s => [s.id, false])))
  const [form, setForm] = useState(blankForm)
  const [editingId, setEditingId] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const allChecked = CHECKLIST_STEPS.every(s => checks[s.id])
  const hardGateFail = !checks.q1
  const entryNum = Number(form.entry)
  const stopNum = Number(form.stop)
  const validNums = isNum(entryNum) && isNum(stopNum) && entryNum > 0 && stopNum > 0 && entryNum !== stopNum
  const riskPts = validNums ? Math.abs(entryNum - stopNum) : 0
  const isLong = form.direction === 'long'
  const t1 = validNums ? (isLong ? entryNum + riskPts : entryNum - riskPts) : 0
  const t2 = validNums ? (isLong ? entryNum + riskPts * 2 : entryNum - riskPts * 2) : 0
  const directionSigned = (() => {
    if (!validNums) return false
    if (isLong && stopNum >= entryNum) return false
    if (!isLong && stopNum <= entryNum) return false
    return true
  })()

  const canLog = allChecked && validNums && directionSigned && !session.locked

  const change = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const resetAll = () => { setForm(blankForm()); setChecks(Object.fromEntries(CHECKLIST_STEPS.map(s => [s.id, false]))); setEditingId(null) }

  const logTrade = () => {
    if (!canLog) return
    const totalR = (() => {
      const synthetic = { t1Hit: form.t1Hit, t2Hit: form.t2Hit, runnerR: Number(form.runnerR) || 0 }
      return tradeTotalR(synthetic)
    })()
    const record = {
      id: editingId || `t_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      datetime: new Date().toISOString(),
      direction: form.direction,
      setupGrade: form.setupGrade,
      candle: form.candle,
      entry: entryNum,
      stop: stopNum,
      riskPts: r2(riskPts),
      t1: r2(t1),
      t2: r2(t2),
      t1Hit: form.t1Hit,
      t2Hit: form.t2Hit,
      runnerR: Number(form.runnerR) || 0,
      totalR: r2(totalR),
      followedAll7: allChecked,
      mode: settings.mode,
      note: form.note,
    }
    if (editingId) updateTrade(editingId, record)
    else {
      addTrade(record)
      bumpSession(totalR)
      markDayPracticed()
    }
    resetAll()
  }

  const startEdit = (t) => {
    setEditingId(t.id)
    setChecks(Object.fromEntries(CHECKLIST_STEPS.map(s => [s.id, t.followedAll7])))
    setForm({
      direction: t.direction,
      setupGrade: t.setupGrade,
      candle: t.candle,
      entry: String(t.entry),
      stop: String(t.stop),
      t1Hit: !!t.t1Hit,
      t2Hit: !!t.t2Hit,
      runnerR: t.runnerR || 0,
      note: t.note || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const sortedTrades = useMemo(() => trades.slice(), [trades])

  // Keyboard shortcuts for fast logging:
  //   1-7 → toggle that checklist step
  //   e   → focus the Entry price input
  //   s   → log the trade (save) if all 7 pass + valid prices
  //   ?   → toggle the help panel
  const entryInputRef = useRef(null)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  // latest refs so the keydown handler always sees current state
  const checksRef = useRef(checks); checksRef.current = checks
  const canLogRef = useRef(canLog); canLogRef.current = canLog
  const logTradeRef = useRef(logTrade); logTradeRef.current = logTrade
  useEffect(() => {
    const onKey = (e) => {
      // Don't hijack typing in inputs/textarea/select
      const tgt = e.target
      const inField = tgt && (tgt.tagName === 'INPUT' || tgt.tagName === 'TEXTAREA' || tgt.tagName === 'SELECT' || tgt.isContentEditable)
      if (inField && e.key !== 'Escape') return
      if (e.metaKey || e.ctrlKey || e.altKey) return

      if (/^[1-7]$/.test(e.key)) {
        const idx = parseInt(e.key, 10) - 1
        const step = CHECKLIST_STEPS[idx]
        if (step) {
          setChecks(c => ({ ...c, [step.id]: !c[step.id] }))
          e.preventDefault()
        }
      } else if (e.key === 'e' || e.key === 'E') {
        if (entryInputRef.current) { entryInputRef.current.focus(); entryInputRef.current.select?.() }
        e.preventDefault()
      } else if (e.key === 's' || e.key === 'S') {
        if (canLogRef.current) { logTradeRef.current(); e.preventDefault() }
      } else if (e.key === '?') {
        setShortcutsOpen(o => !o)
        e.preventDefault()
      } else if (e.key === 'Escape') {
        setShortcutsOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <div className="pill pill-emerald inline-flex mb-3"><Icon name="chart" className="w-3.5 h-3.5"/> Trade cockpit</div>
          <h1 className="font-display font-semibold text-3xl md:text-4xl text-textp tracking-tight">Trade with discipline</h1>
          <p className="text-texts mt-2">Pass the 7-step gate. Log the trade. Stay honest.</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 justify-end mb-1">
            <button
              className="hidden md:inline-flex items-center gap-1 text-[11px] font-display tracking-wide py-1 px-2 rounded border border-border bg-bg text-texts hover:text-textp transition"
              onClick={() => setShortcutsOpen(true)}
              aria-label="Keyboard shortcuts"
              title="Keyboard shortcuts (?)"
            >
              <span className="font-mono">?</span> Shortcuts
            </button>
            <div className="pill pill-muted">Mode · {settings.mode.toUpperCase()}</div>
          </div>
          <div className="font-mono text-textt text-[12px]">Today: {session.tradesToday}/{settings.maxTradesPerSession} · {session.rToday >= 0 ? '+' : ''}{r2(session.rToday)}R</div>
        </div>
      </header>

      {session.locked && (
        <SessionLockedBanner session={session} settings={settings} />
      )}

      {/* CHECKLIST GATE */}
      <section className="card p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="font-display font-semibold text-textp text-xl flex items-center gap-2">
            <Icon name="shield" className="w-5 h-5 text-gold"/> Pre-trade checklist
          </h2>
          <div className="flex items-center gap-2">
            <span className={`pill ${allChecked ? 'pill-emerald' : 'pill-muted'}`}>
              {Object.values(checks).filter(Boolean).length}/{CHECKLIST_STEPS.length}
            </span>
            <button className="btn btn-ghost text-[12px] py-1.5 px-3" onClick={() => setChecks(Object.fromEntries(CHECKLIST_STEPS.map(s => [s.id, false])))}>
              <Icon name="refresh" className="w-3.5 h-3.5"/> Reset
            </button>
          </div>
        </div>

        <ol className="space-y-2">
          {CHECKLIST_STEPS.map((s, i) => (
            <li key={s.id}>
              <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${checks[s.id] ? 'border-emerald2/40 bg-emerald2/5' : 'border-border bg-bg/40 hover:border-border'}`}>
                <input
                  type="checkbox"
                  className="mt-1 w-5 h-5 rounded accent-[#1FE0A0]"
                  style={{ width: '20px' }}
                  checked={!!checks[s.id]}
                  onChange={e => setChecks(c => ({ ...c, [s.id]: e.target.checked }))}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display text-textt text-[11px] uppercase tracking-[0.16em]">Step {i+1}</span>
                    {s.hard && <span className="pill pill-coral text-[10px]">Hard gate</span>}
                  </div>
                  <div className="text-textp text-[14px] mt-1 leading-snug">{s.text}</div>
                </div>
              </label>
            </li>
          ))}
        </ol>

        {hardGateFail ? (
          <div className="mt-5 rounded-card border border-coral/40 bg-coral/5 p-5 text-center">
            <div className="font-display font-semibold text-2xl md:text-3xl text-coral text-glow-coral">NO TRADE — SIT OUT</div>
            <p className="text-texts text-[14px] mt-2 max-w-lg mx-auto">The 15-min isn’t trending your way. Sitting out IS the trade. Come back when the gate opens.</p>
          </div>
        ) : !allChecked ? (
          <div className="mt-4 text-texts text-[13px] font-body text-center">Finish all seven steps to unlock the calculator.</div>
        ) : (
          <div className="mt-4 text-emerald2 text-[13px] font-display tracking-wide text-center">
            <Icon name="check" className="inline w-4 h-4 mr-1"/> Gate open — log the trade below.
          </div>
        )}
      </section>

      {/* CALCULATOR + LOG FORM */}
      <section className={`card p-5 ${!allChecked && 'opacity-60 pointer-events-none'}`}>
        <h2 className="font-display font-semibold text-textp text-xl flex items-center gap-2 mb-4">
          <Icon name="chart" className="w-5 h-5 text-emerald2"/> {editingId ? 'Edit trade' : 'Log the trade'}
        </h2>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="field-label">Direction</label>
            <div className="flex gap-2">
              {['long', 'short'].map(d => (
                <button key={d} type="button"
                  className={`btn ${form.direction === d ? (d === 'long' ? 'btn-primary' : 'btn-danger') : 'btn-ghost'}`}
                  onClick={() => change('direction', d)}>
                  {d === 'long' ? 'Long' : 'Short'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="field-label">Setup grade</label>
            <div className="flex gap-2">
              {['A+', 'B'].map(g => (
                <button key={g} type="button"
                  className={`btn ${form.setupGrade === g ? 'btn-gold' : 'btn-ghost'}`}
                  onClick={() => change('setupGrade', g)}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="field-label">Candle at Dip 2</label>
            <select value={form.candle} onChange={e => change('candle', e.target.value)}>
              <option value="engulfing">Bullish/Bearish engulfing (A+)</option>
              <option value="dragonfly">Dragonfly doji (A+)</option>
              <option value="morningstar">Morning star (Strong)</option>
              <option value="weak">Weak / star doji (Lowest)</option>
              <option value="none">No clear rejection</option>
            </select>
          </div>

          <div>
            <label className="field-label">Contracts</label>
            <input type="number" value={settings.contracts} disabled />
            <p className="text-textt text-[11px] mt-1 font-body">Fixed. Change in Settings.</p>
          </div>

          <div>
            <label className="field-label">Entry price</label>
            <input ref={entryInputRef} type="number" step="0.01" value={form.entry} onChange={e => change('entry', e.target.value)} placeholder="e.g. 2185.30" />
          </div>

          <div>
            <label className="field-label">Stop (below Dip 1 / above Rally High)</label>
            <input type="number" step="0.01" value={form.stop} onChange={e => change('stop', e.target.value)} placeholder="a few ticks lower than the obvious level" />
          </div>
        </div>

        {/* Calculator strip */}
        <div className="mt-5 rounded-card border border-border bg-elevated p-4 grid grid-cols-2 md:grid-cols-5 gap-3">
          <CalcCell label="Risk" value={validNums && directionSigned ? `${r2(riskPts)} pts` : '—'} color="coral" />
          <CalcCell label="T1 (1R)" value={validNums && directionSigned ? r2(t1) : '—'} color="emerald" />
          <CalcCell label="T2 (2R)" value={validNums && directionSigned ? r2(t2) : '—'} color="emerald" />
          <CalcCell label="R:R to T1" value={validNums && directionSigned ? '1 : 1' : '—'} color="violet" small />
          <CalcCell label="2-2-2 split" value={`${settings.contracts/3*1}/${settings.contracts/3*1}/${settings.contracts/3*1}`} color="gold" small />
        </div>
        <p className="text-textt text-[12px] mt-3 font-body">
          Targets beyond T1 are bonus — never recalculated. <span className="text-gold">The instant T1 fills, move stop to breakeven.</span>
        </p>
        {validNums && !directionSigned && (
          <p className="text-coral text-[12px] mt-2 font-body">For a long, stop must be BELOW entry. For a short, stop must be ABOVE entry.</p>
        )}

        {/* Result */}
        <div className="divider" />
        <h3 className="font-display font-semibold text-textp text-base mb-3">After the trade</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-5 h-5 accent-[#1FE0A0]" checked={form.t1Hit} onChange={e => change('t1Hit', e.target.checked)} />
            <span className="text-textp text-[14px]">T1 (1R) hit</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-5 h-5 accent-[#1FE0A0]" checked={form.t2Hit} onChange={e => change('t2Hit', e.target.checked)} disabled={!form.t1Hit} />
            <span className={`${form.t1Hit ? 'text-textp' : 'text-textt'} text-[14px]`}>T2 (2R) hit</span>
          </label>
          <div>
            <label className="field-label">Runner closed (R)</label>
            <input type="number" step="0.5" value={form.runnerR} onChange={e => change('runnerR', Number(e.target.value))} disabled={!form.t1Hit} />
          </div>
          <div className="rounded-card border border-emerald2/30 bg-emerald2/5 p-3 flex flex-col items-center justify-center">
            <div className="font-display text-[11px] text-textt uppercase tracking-[0.16em]">Total trade</div>
            <div className="font-display font-semibold text-2xl text-emerald2 text-glow-emerald mt-1">
              {validNums ? `${tradeTotalR({ t1Hit: form.t1Hit, t2Hit: form.t2Hit, runnerR: Number(form.runnerR)||0 }) >= 0 ? '+' : ''}${r2(tradeTotalR({ t1Hit: form.t1Hit, t2Hit: form.t2Hit, runnerR: Number(form.runnerR)||0 }))}R` : '—'}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <label className="field-label">Note (optional)</label>
          <textarea rows={2} value={form.note} onChange={e => change('note', e.target.value)} placeholder="Anything noteworthy: pushes count, exhaustion signs, how you felt at entry, what you did right or could improve…"></textarea>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 justify-end">
          {editingId && <button className="btn btn-ghost" onClick={resetAll}>Cancel edit</button>}
          <button className="btn btn-primary" disabled={!canLog} onClick={logTrade}>
            <Icon name="check" className="w-4 h-4"/> {editingId ? 'Save changes' : 'Log trade'}
          </button>
        </div>
      </section>

      {/* JOURNAL */}
      <section>
        <h2 className="font-display font-semibold text-textp text-xl flex items-center gap-2 mb-4">
          <Icon name="book" className="w-5 h-5 text-violet2"/> Journal · {trades.length} trade{trades.length === 1 ? '' : 's'}
        </h2>
        {trades.length === 0 ? (
          <div className="card p-6 text-center">
            <Icon name="spark" className="w-7 h-7 text-violet2 mx-auto mb-2"/>
            <p className="text-texts text-[14px]">No trades logged yet. Your first disciplined sim trade lives here.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {sortedTrades.map(t => (
              <TradeRow key={t.id} t={t} onEdit={() => startEdit(t)} onAskDelete={() => setConfirmDelete(t.id)} />
            ))}
          </ul>
        )}
      </section>

      {confirmDelete && (
        <ConfirmDelete onCancel={() => setConfirmDelete(null)} onConfirm={() => { removeTrade(confirmDelete); setConfirmDelete(null) }} />
      )}

      {shortcutsOpen && <ShortcutsHelp onClose={() => setShortcutsOpen(false)} />}
    </div>
  )
}

function ShortcutsHelp({ onClose }) {
  const ROWS = [
    { keys: ['1', '2', '3', '4', '5', '6', '7'], label: 'Toggle each checklist step' },
    { keys: ['E'], label: 'Focus the Entry price input' },
    { keys: ['S'], label: 'Save / log the trade (if all 7 + valid prices)' },
    { keys: ['?'], label: 'Open / close this help' },
    { keys: ['Esc'], label: 'Close dialogs' },
  ]
  return (
    <div className="fixed inset-0 z-50 bg-bg/85 backdrop-blur flex items-center justify-center p-4" onClick={onClose}>
      <div className="card p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-textp text-lg">Keyboard shortcuts</h3>
          <button className="text-texts hover:text-textp" onClick={onClose} aria-label="Close"><Icon name="x" className="w-4 h-4"/></button>
        </div>
        <ul className="space-y-2">
          {ROWS.map((row, i) => (
            <li key={i} className="flex items-center justify-between gap-3">
              <span className="text-textp text-[14px]">{row.label}</span>
              <span className="flex gap-1">
                {row.keys.map(k => (
                  <kbd key={k} className="font-mono text-[12px] px-2 py-0.5 rounded border border-border bg-bg text-textp">{k}</kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-textt text-[12px] mt-4 font-body">Shortcuts work whenever you're not typing in an input.</p>
      </div>
    </div>
  )
}

function CalcCell({ label, value, color, small }) {
  const colorMap = {
    emerald: 'text-emerald2', coral: 'text-coral', gold: 'text-gold', violet: 'text-violet2', plain: 'text-textp',
  }
  return (
    <div className="text-center">
      <div className="font-display text-[10px] text-textt uppercase tracking-[0.14em]">{label}</div>
      <div className={`font-display font-semibold ${small ? 'text-lg' : 'text-2xl'} mt-1 ${colorMap[color] || 'text-textp'}`}>{value}</div>
    </div>
  )
}

function TradeRow({ t, onEdit, onAskDelete }) {
  const dt = new Date(t.datetime)
  const dateStr = `${String(dt.getMonth()+1).padStart(2,'0')}/${String(dt.getDate()).padStart(2,'0')} ${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')}`
  const r = typeof t.totalR === 'number' ? t.totalR : 0
  const positive = r >= 0
  return (
    <li className="card p-4 flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-display font-semibold text-sm border ${t.direction === 'long' ? 'bg-emerald2/10 text-emerald2 border-emerald2/40' : 'bg-coral/10 text-coral border-coral/40'}`}>
          {t.direction === 'long' ? '↑' : '↓'}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-semibold text-textp text-[14px]">{t.direction.toUpperCase()}</span>
            <span className="pill pill-gold text-[10px]">{t.setupGrade}</span>
            <span className="pill pill-muted text-[10px]">{t.candle}</span>
            {t.followedAll7 ? <span className="pill pill-emerald text-[10px]">All 7</span> : <span className="pill pill-coral text-[10px]">Rule breach</span>}
            <span className="pill pill-violet text-[10px]">{t.mode.toUpperCase()}</span>
          </div>
          <div className="font-mono text-texts text-[12px] mt-1 truncate">
            {dateStr} · Entry {t.entry} · Stop {t.stop} · T1 {t.t1} · T2 {t.t2}
          </div>
          {t.note && <div className="text-textt text-[12px] mt-1 italic truncate font-body">{t.note}</div>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className={`font-display font-semibold text-xl ${positive ? 'text-emerald2 text-glow-emerald' : 'text-coral text-glow-coral'}`}>
          {positive ? '+' : ''}{r}R
        </div>
        <button className="btn btn-ghost py-1.5 px-2.5 text-[12px]" onClick={onEdit}><Icon name="edit" className="w-3.5 h-3.5"/></button>
        <button className="btn btn-ghost py-1.5 px-2.5 text-[12px]" onClick={onAskDelete}><Icon name="trash" className="w-3.5 h-3.5"/></button>
      </div>
    </li>
  )
}

function ConfirmDelete({ onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 bg-bg/85 backdrop-blur flex items-center justify-center p-4">
      <div className="card p-6 max-w-md">
        <h3 className="font-display font-semibold text-textp text-lg">Delete this trade?</h3>
        <p className="text-texts text-[14px] mt-1">Your sample is your truth. Only delete if it was a mistake entry.</p>
        <div className="flex justify-end gap-2 mt-4">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  )
}

function SessionLockedBanner({ session, settings }) {
  const tripped = session.tradesToday >= settings.maxTradesPerSession ? 'max-trades' : 'max-loss'
  return (
    <div className="fixed inset-0 z-40 bg-bg/95 backdrop-blur flex items-center justify-center p-4 animate-fadeup">
      <div className="card p-8 max-w-lg text-center">
        <Icon name="lock" className="w-12 h-12 mx-auto text-coral mb-3"/>
        <h2 className="font-display font-semibold text-3xl text-coral text-glow-coral">You’re done for today</h2>
        <p className="text-texts text-[15px] mt-3">
          {tripped === 'max-trades'
            ? `You hit your ${settings.maxTradesPerSession}-trade limit. The good days are won by being there for them, not by forcing trades on the bad ones.`
            : `You hit your -${settings.maxLossPerSession}R loss limit. Protect the account. Tomorrow is another setup.`}
        </p>
        <div className="font-mono text-textp mt-4 text-[13px]">Today: {session.tradesToday} trade(s) · {session.rToday >= 0 ? '+' : ''}{Math.round(session.rToday * 100)/100}R</div>
        <Link to="/" className="btn btn-ghost mt-5"><Icon name="home" className="w-4 h-4"/> Back to mission</Link>
      </div>
    </div>
  )
}

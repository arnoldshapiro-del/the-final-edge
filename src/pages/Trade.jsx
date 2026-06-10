import { useState, useMemo, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon.jsx'
import {
  getSettings, getTrades, addTrade, updateTrade, removeTrade,
  getSession, bumpSession, markDayPracticed, tradeTotalR,
  tradeDollars, dayDollars, startCooldown, clearCooldown,
} from '../storage.js'
import { useSettings, useTrades, useSession, useCooldown, useWeekStats, useClock } from '../hooks.js'
import { etParts, phaseFor } from '../marketClock.js'

const CHECKLIST_STEPS = [
  { id: 'q1', hard: true, text: 'Is the 15-min trending my way? (HH/HL for longs, LH/LL for shorts)' },
  { id: 'q2', text: 'With-trend direction only — not a counter-trend reversal attempt?' },
  { id: 'q3', text: 'Pullback (long) or bounce (short) healthy — holds the prior swing low (long) / prior swing high (short) AND rides above/below the 20 EMA (not knifing)?' },
  { id: 'q4', text: 'Confirming candle at the trendline close? (A+ engulfing/dragonfly or Strong morning star — not a weak doji)' },
  { id: 'q5', text: 'FIRST 2-min candle has CLOSED through the 2-min TRENDLINE? (Above the descending trendline for longs, below the ascending trendline for shorts. The trendline close is the one and only trigger.)' },
  { id: 'q6', text: 'Stop placed at the STRUCTURE (swing low at the bottom of the pullback for longs; swing high at the top of the bounce for shorts) — tentative 4-6 ticks beyond the broken trendline, then moved to the structure?' },
]

const EMOTIONS = [
  { key: 'calm', label: 'Calm', good: true },
  { key: 'focused', label: 'Focused', good: true },
  { key: 'eager', label: 'Eager', good: false },
  { key: 'anxious', label: 'Anxious', good: false },
  { key: 'fomo', label: 'FOMO', good: false },
  { key: 'revenge', label: 'Revenge', good: false },
  { key: 'tired', label: 'Tired', good: false },
]

function blankForm() {
  return {
    direction: 'long',
    setupGrade: 'A+',
    candle: 'engulfing',
    emotion: null,
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
  const [riskAccepted, setRiskAccepted] = useState(false)
  const [confirmBreach, setConfirmBreach] = useState(false)
  const cooldown = useCooldown()
  const week = useWeekStats('live')
  const now = useClock(15000)

  const isLive = settings.mode === 'live'
  const weekLockedLive = isLive && week.locked
  // Edge-window enforcement (live mode only, toggleable in Settings)
  const enforceWindow = settings.enforceWindow !== false
  const et = etParts(now)
  const phase = phaseFor(et)
  const outsideWindow = isLive && enforceWindow && phase.key !== 'window'

  const allChecked = CHECKLIST_STEPS.every(s => checks[s.id])
  const hardGateFail = !checks.q1
  const entryNum = Number(form.entry)
  const stopNum = Number(form.stop)
  const validNums = isNum(entryNum) && isNum(stopNum) && entryNum > 0 && stopNum > 0 && entryNum !== stopNum
  // M2K risk model — R is set by the ACTUAL stop you typed (no locked system stop).
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

  // Shared requirements for ANY log: prices valid, state logged, risk accepted (live), no blockers.
  const baseReady = validNums && directionSigned && !session.locked && !!form.emotion &&
    (!isLive || riskAccepted) && (!cooldown || editingId) && !weekLockedLive && !(outsideWindow && !editingId)
  const canLog = allChecked && baseReady
  // Honest journaling: a trade taken in breach of the gate CAN be recorded — flagged, never hidden.
  const canLogBreach = !allChecked && baseReady

  const change = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const resetAll = () => {
    setForm(blankForm())
    setChecks(Object.fromEntries(CHECKLIST_STEPS.map(s => [s.id, false])))
    setEditingId(null)
    setRiskAccepted(false)
    setConfirmBreach(false)
  }

  const logTrade = (asBreach = false) => {
    if (asBreach ? !canLogBreach : !canLog) return
    const totalR = (() => {
      const synthetic = { t1Hit: form.t1Hit, t2Hit: form.t2Hit, runnerR: Number(form.runnerR) || 0 }
      return tradeTotalR(synthetic)
    })()
    const missedSteps = CHECKLIST_STEPS.filter(s => !checks[s.id]).map(s => s.id)
    const record = {
      id: editingId || `t_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      datetime: new Date().toISOString(),
      direction: form.direction,
      setupGrade: form.setupGrade,
      candle: form.candle,
      emotion: form.emotion,
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
      missedSteps: allChecked ? [] : missedSteps,
      mode: settings.mode,
      note: form.note,
    }
    if (editingId) updateTrade(editingId, record)
    else {
      addTrade(record)
      const nextSession = bumpSession(totalR)
      markDayPracticed()
      // Anti-revenge cooldown after any loss. Longer once you're one loss from done. Sim gets a lighter timer.
      if (totalR < 0 && !nextSession.locked) {
        const nearDone = (nextSession.lossesToday || 0) >= (settings.maxLossPerSession || 3) - 1
        startCooldown(isLive ? (nearDone ? 10 : 5) : 3)
      }
    }
    resetAll()
  }

  const startEdit = (t) => {
    setEditingId(t.id)
    setChecks(Object.fromEntries(CHECKLIST_STEPS.map(s => [s.id, t.missedSteps ? !t.missedSteps.includes(s.id) : t.followedAll7])))
    setForm({
      direction: t.direction,
      setupGrade: t.setupGrade,
      candle: t.candle,
      emotion: t.emotion || null,
      entry: String(t.entry),
      stop: String(t.stop),
      t1Hit: !!t.t1Hit,
      t2Hit: !!t.t2Hit,
      runnerR: t.runnerR || 0,
      note: t.note || '',
    })
    setRiskAccepted(true) // already-taken trade; the risk was accepted at entry
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const sortedTrades = useMemo(() => trades.slice(), [trades])

  // Keyboard shortcuts for fast logging:
  //   1-7 → toggle that checklist step
  //   e   → focus the Entry price input
  //   s   → log the trade (save) if all 6 pass + valid prices
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

      if (/^[1-6]$/.test(e.key)) {
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
          <p className="text-texts mt-2">Pass the 6-step gate. Log the trade. Stay honest.</p>
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
          <div className="font-mono text-textt text-[12px]">
            Today: {session.tradesToday}/{settings.maxTradesPerSession} · {session.rToday >= 0 ? '+' : ''}{r2(session.rToday)}R · {dayDollars() >= 0 ? '+' : '−'}${Math.abs(dayDollars())}
          </div>
        </div>
      </header>

      {session.locked && (
        <SessionLockedBanner session={session} settings={settings} />
      )}

      {weekLockedLive && (
        <section className="card p-5 border border-coral/50 text-center">
          <Icon name="lock" className="w-8 h-8 text-coral mx-auto mb-2"/>
          <h2 className="font-display font-semibold text-2xl text-coral text-glow-coral">Weekly limit hit — SIM for the rest of the week</h2>
          <p className="text-texts text-[14px] mt-2">Live net this week: −{Math.abs(week.netR)}R (−${Math.abs(week.netDollars)}) of your {week.weeklyLimitR}R weekly max. Switch mode to SIM in Settings to keep practicing.</p>
        </section>
      )}

      {outsideWindow && !session.locked && !weekLockedLive && (
        <section className="card p-5 border-l-4" style={{ borderLeftColor: '#FFB347' }}>
          <h2 className="font-display font-semibold text-gold text-lg flex items-center gap-2">
            <Icon name="clock" className="w-5 h-5"/> {phase.key === 'pre' ? 'Market not open yet' : 'Outside your 9:30–10:30 edge window'}
          </h2>
          <p className="text-texts text-[13px] mt-1">
            Live entries are locked outside the window — your edge was proven at the open, not at lunch.
            {' '}You can still edit existing trades. (Toggle window enforcement in Settings.)
          </p>
        </section>
      )}

      {cooldown && !session.locked && (
        <CooldownBanner cooldown={cooldown} isLive={isLive} />
      )}

      {!session.locked && session.rToday <= -((settings.maxLossPerSession || 3) * 6) / 2 && (
        <section className="card p-4 border-l-4" style={{ borderLeftColor: '#FFB347' }}>
          <p className="text-gold text-[14px] font-display flex items-center gap-2">
            <Icon name="alert" className="w-4 h-4 shrink-0"/> Half the daily limit is gone. From here: textbook A+ only — or stop early. Stopping early is a win.
          </p>
        </section>
      )}

      {!session.locked && (session.lossesToday || 0) === (settings.maxLossPerSession || 3) - 1 && (
        <section className="card p-4 border-l-4" style={{ borderLeftColor: '#FF5C72' }}>
          <p className="text-coral text-[14px] font-display flex items-center gap-2">
            <Icon name="alert" className="w-4 h-4 shrink-0"/> One more loss ends the day. If you trade again it must be undeniable — and it's also fine to be done now.
          </p>
        </section>
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
          <div className="mt-4 text-texts text-[13px] font-body text-center">Finish all six steps to unlock the calculator.</div>
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

        {/* STATE CHECK — the 7th rule */}
        <div className="mb-5">
          <label className="field-label">State check — how did you feel at entry? (required)</label>
          <div className="flex gap-2 flex-wrap">
            {EMOTIONS.map(em => (
              <button
                key={em.key}
                type="button"
                className={`btn text-[13px] py-2 px-3 ${form.emotion === em.key ? (em.good ? 'btn-primary' : 'btn-danger') : 'btn-ghost'}`}
                onClick={() => change('emotion', em.key)}
              >{em.label}</button>
            ))}
          </div>
          {form.emotion && !EMOTIONS.find(e => e.key === form.emotion)?.good && (
            <p className="text-gold text-[12.5px] mt-2 font-display">
              Logged honestly — that's the point. Trades tagged like this get tracked in Stats; watch what they cost you.
            </p>
          )}
        </div>

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
            <label className="field-label">Confirming candle at the trendline close</label>
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
            <label className="field-label">Stop (at the STRUCTURE — swing low at the bottom of the pullback for longs; swing high at the top of the bounce for shorts)</label>
            <input type="number" step="0.01" value={form.stop} onChange={e => change('stop', e.target.value)} placeholder="just past the structure — not below the breakout candle's close" />
          </div>
        </div>

        {/* Calculator strip */}
        <div className="mt-5 rounded-card border border-border bg-elevated p-4 grid grid-cols-2 md:grid-cols-6 gap-3">
          <CalcCell label="Risk" value={validNums && directionSigned ? `${r2(riskPts)} pts` : '—'} color="coral" />
          <CalcCell label="$ at risk" value={validNums && directionSigned ? `$${Math.round(riskPts * 5 * (settings.contracts || 6))}` : '—'} color="coral" />
          <CalcCell label="T1 (1R)" value={validNums && directionSigned ? r2(t1) : '—'} color="emerald" />
          <CalcCell label="T2 (2R)" value={validNums && directionSigned ? r2(t2) : '—'} color="emerald" />
          <CalcCell label="R:R to T1" value={validNums && directionSigned ? '1 : 1' : '—'} color="violet" small />
          <CalcCell label="2-2-2 split" value={(() => {
            const per = Math.floor((settings.contracts || 6) / 3)
            const remainder = (settings.contracts || 6) - per * 3
            // Distribute any leftover to the runner so T1/T2/Runner sums to total.
            const a = per, b = per, c = per + remainder
            return `${a}/${b}/${c}`
          })()} color="gold" small />
        </div>
        <p className="text-textt text-[12px] mt-2 font-body text-center md:text-left">
          <span className="text-violet2">M2K math:</span> $5.00 per point · 10 ticks per point · 1 tick = 0.10 pts = $0.50 / contract.
        </p>
        <p className="text-textt text-[12px] mt-2 font-body">
          Targets beyond T1 are bonus — never recalculated. <span className="text-gold">The instant T1 fills, trail the stop to 4–6 ticks behind the newest 2-min swing — only ever tighter, never at entry.</span>
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
              {validNums ? (() => {
                const r = tradeTotalR({ t1Hit: form.t1Hit, t2Hit: form.t2Hit, runnerR: Number(form.runnerR)||0 })
                return `${r >= 0 ? '+' : ''}${r2(r)}R`
              })() : '—'}
            </div>
            {validNums && (
              <div className="font-mono text-[12px] text-texts mt-0.5">
                {(() => {
                  const d = Math.round(tradeTotalR({ t1Hit: form.t1Hit, t2Hit: form.t2Hit, runnerR: Number(form.runnerR)||0 }) * riskPts * 5)
                  return `${d >= 0 ? '+' : '−'}$${Math.abs(d)}`
                })()}
              </div>
            )}
          </div>
        </div>

        <div className="mt-5">
          <label className="field-label">Note (optional)</label>
          <textarea rows={2} value={form.note} onChange={e => change('note', e.target.value)} placeholder="Anything noteworthy: pushes count, exhaustion signs, how you felt at entry, what you did right or could improve…"></textarea>
        </div>

        {isLive && !editingId && (
          <label className={`mt-5 flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${riskAccepted ? 'border-emerald2/40 bg-emerald2/5' : 'border-gold/40 bg-gold/5'}`}>
            <input type="checkbox" className="mt-0.5 w-5 h-5 accent-[#1FE0A0]" checked={riskAccepted} onChange={e => setRiskAccepted(e.target.checked)} />
            <span className="text-textp text-[14px]">
              <strong className="text-gold">I accept losing the full stop on this trade{validNums ? ` — about $${Math.abs(Math.round(riskPts * 5 * (settings.contracts || 6)))}` : ''}.</strong>{' '}
              <span className="text-texts">The stop is pre-paid tuition, not a surprise. (Required in live mode.)</span>
            </span>
          </label>
        )}

        <div className="mt-5 flex flex-wrap gap-2 justify-end items-center">
          {!form.emotion && validNums && <span className="text-textt text-[12px] font-body mr-auto">Pick your state check to enable logging.</span>}
          {editingId && <button className="btn btn-ghost" onClick={resetAll}>Cancel edit</button>}
          {canLogBreach && !editingId && (
            <button className="btn btn-ghost border-coral/40 text-coral hover:bg-coral/10" onClick={() => setConfirmBreach(true)}>
              <Icon name="alert" className="w-4 h-4"/> Log honestly as a rule breach
            </button>
          )}
          <button className="btn btn-primary" disabled={!canLog} onClick={() => logTrade(false)}>
            <Icon name="check" className="w-4 h-4"/> {editingId ? 'Save changes' : 'Log trade'}
          </button>
        </div>
        {canLogBreach && !editingId && (
          <p className="text-textt text-[12px] mt-2 text-right font-body">
            Took the trade without all 6? Record it anyway — an honest journal is worth more than a perfect-looking one.
          </p>
        )}
      </section>

      {confirmBreach && (
        <div className="fixed inset-0 z-50 bg-bg/85 backdrop-blur flex items-center justify-center p-4">
          <div className="card p-6 max-w-md">
            <h3 className="font-display font-semibold text-coral text-lg flex items-center gap-2"><Icon name="alert" className="w-5 h-5"/> Logging a rule breach</h3>
            <p className="text-texts text-[14px] mt-2">
              This records the trade with the steps you skipped: {CHECKLIST_STEPS.filter(s => !checks[s.id]).map((s, i) => `Step ${CHECKLIST_STEPS.indexOf(s) + 1}`).join(', ')}.
              It will count against your rule adherence — that's the point. Honest data is how the leak gets fixed.
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button className="btn btn-ghost" onClick={() => setConfirmBreach(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => { setConfirmBreach(false); logTrade(true) }}>Log it honestly</button>
            </div>
          </div>
        </div>
      )}

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
    { keys: ['1', '2', '3', '4', '5', '6'], label: 'Toggle each checklist step' },
    { keys: ['E'], label: 'Focus the Entry price input' },
    { keys: ['S'], label: 'Save / log the trade (if all 6 + valid prices)' },
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

const EMOTION_LABELS = Object.fromEntries(EMOTIONS.map(e => [e.key, e]))

function TradeRow({ t, onEdit, onAskDelete }) {
  const dt = new Date(t.datetime)
  const dateStr = `${String(dt.getMonth()+1).padStart(2,'0')}/${String(dt.getDate()).padStart(2,'0')} ${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')}`
  const r = typeof t.totalR === 'number' ? t.totalR : 0
  const positive = r >= 0
  const dollars = tradeDollars(t)
  const emo = t.emotion ? EMOTION_LABELS[t.emotion] : null
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
            {t.followedAll7 ? <span className="pill pill-emerald text-[10px]">All 6</span> : <span className="pill pill-coral text-[10px]">Breach{t.missedSteps?.length ? ` ·${t.missedSteps.map(id => ' ' + (parseInt(id.slice(1), 10))).join(',')}` : ''}</span>}
            {emo && <span className={`pill text-[10px] ${emo.good ? 'pill-cyan' : 'pill-coral'}`}>{emo.label}</span>}
            <span className="pill pill-violet text-[10px]">{t.mode.toUpperCase()}</span>
          </div>
          <div className="font-mono text-texts text-[12px] mt-1 truncate">
            {dateStr} · Entry {t.entry} · Stop {t.stop} · T1 {t.t1} · T2 {t.t2}
          </div>
          {t.note && <div className="text-textt text-[12px] mt-1 italic truncate font-body">{t.note}</div>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className={`font-display font-semibold text-xl ${positive ? 'text-emerald2 text-glow-emerald' : 'text-coral text-glow-coral'}`}>
            {positive ? '+' : ''}{r}R
          </div>
          <div className="font-mono text-[11px] text-textt">{dollars >= 0 ? '+' : '−'}${Math.abs(dollars)}</div>
        </div>
        <button className="btn btn-ghost py-1.5 px-2.5 text-[12px]" onClick={onEdit}><Icon name="edit" className="w-3.5 h-3.5"/></button>
        <button className="btn btn-ghost py-1.5 px-2.5 text-[12px]" onClick={onAskDelete}><Icon name="trash" className="w-3.5 h-3.5"/></button>
      </div>
    </li>
  )
}

function CooldownBanner({ cooldown, isLive }) {
  const remain = Math.max(0, Math.floor((new Date(cooldown.until).getTime() - Date.now()) / 1000))
  const m = Math.floor(remain / 60)
  const s = remain % 60
  return (
    <section className="card p-5 border border-gold/40 text-center relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 rounded-full border border-gold/20" style={{ animation: 'tfe-breathe 8s ease-in-out infinite' }} />
      </div>
      <style>{`@keyframes tfe-breathe { 0%,100% { transform: scale(0.7); opacity: .25 } 50% { transform: scale(1.15); opacity: .6 } }`}</style>
      <div className="relative">
        <Icon name="pause" className="w-7 h-7 text-gold mx-auto mb-1"/>
        <h2 className="font-display font-semibold text-xl text-gold text-glow-gold">Cooldown · {m}:{String(s).padStart(2, '0')}</h2>
        <p className="text-texts text-[13px] mt-1 max-w-md mx-auto">
          Breathe — in 4, hold 4, out 6. That loss says nothing about the next trade; the edge lives across many trades.
          Logging unlocks when the timer ends.
        </p>
        {!isLive && (
          <button className="btn btn-ghost text-[12px] py-1.5 px-3 mt-3" onClick={clearCooldown}>
            Skip (sim only)
          </button>
        )}
      </div>
    </section>
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
  const reason = session.lockReason || (session.tradesToday >= settings.maxTradesPerSession ? 'max-trades' : 'max-dollars')
  const dollars = dayDollars()
  const msg = {
    'max-trades': `You hit your ${settings.maxTradesPerSession}-trade limit. The good days are won by being there for them, not by forcing trades on the bad ones.`,
    'max-losses': `${settings.maxLossPerSession || 3} losing trades — the mentor's rule says you're done. Walking away now is the discipline that keeps you in the game.`,
    'max-dollars': `You hit your daily max loss of ${(settings.maxLossPerSession || 3) * 6}R (${settings.maxLossPerSession || 3} full stops). Protect the account. Tomorrow is another setup.`,
  }[reason]
  return (
    <div className="fixed inset-0 z-40 bg-bg/95 backdrop-blur flex items-center justify-center p-4 animate-fadeup">
      <div className="card p-8 max-w-lg text-center">
        <Icon name="lock" className="w-12 h-12 mx-auto text-coral mb-3"/>
        <h2 className="font-display font-semibold text-3xl text-coral text-glow-coral">You’re done for today</h2>
        <p className="text-texts text-[15px] mt-3">{msg}</p>
        <div className="font-mono text-textp mt-4 text-[13px]">
          Today: {session.tradesToday} trade(s) · {session.rToday >= 0 ? '+' : ''}{Math.round(session.rToday * 100)/100}R · {dollars >= 0 ? '+' : '−'}${Math.abs(dollars)}
        </div>
        <p className="text-texts text-[13px] mt-3">One last job: log your end-of-day debrief while it's fresh.</p>
        <div className="flex justify-center gap-2 mt-5 flex-wrap">
          <Link to="/live" className="btn btn-primary"><Icon name="book" className="w-4 h-4"/> Debrief on Live day</Link>
          <Link to="/" className="btn btn-ghost"><Icon name="home" className="w-4 h-4"/> Back to mission</Link>
        </div>
      </div>
    </div>
  )
}

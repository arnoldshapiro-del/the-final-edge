import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SCENARIOS } from '../trainerData.js'
import SetupChart from '../components/SetupChart.jsx'
import { Icon } from '../components/Icon.jsx'
import { getProgress, patchProgress } from '../storage.js'

function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const CHOICES = [
  { key: 'LONG', label: 'Long', color: 'emerald', icon: 'arrow' },
  { key: 'SHORT', label: 'Short', color: 'coral', icon: 'arrow' },
  { key: 'WAIT', label: 'Wait', color: 'gold', icon: 'pause' },
  { key: 'SKIP', label: 'Skip', color: 'violet', icon: 'x' },
]

function ChoiceButton({ choice, onClick, disabled, isCorrect, picked }) {
  const cls = {
    emerald: 'bg-emerald2/10 text-emerald2 border-emerald2/40 hover:bg-emerald2/20',
    coral: 'bg-coral/10 text-coral border-coral/40 hover:bg-coral/20',
    gold: 'bg-gold/10 text-gold border-gold/40 hover:bg-gold/20',
    violet: 'bg-violet2/10 text-violet2 border-violet2/40 hover:bg-violet2/20',
  }
  const state = disabled
    ? (picked && isCorrect ? 'ring-2 ring-emerald2 ring-offset-2 ring-offset-bg' :
       picked && !isCorrect ? 'ring-2 ring-coral ring-offset-2 ring-offset-bg' :
       isCorrect ? 'ring-2 ring-emerald2 ring-offset-2 ring-offset-bg opacity-90' : 'opacity-40')
    : ''
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`btn border ${cls[choice.color]} font-display font-semibold tracking-wider text-[14px] py-3 px-2 ${state}`}
    >
      <Icon name={choice.icon} className="w-4 h-4" />
      <span>{choice.label}</span>
    </button>
  )
}

const MODES = [
  { key: 'instant', label: 'Instant', icon: 'spark', desc: 'Show the whole picture, call it.' },
  { key: 'play',    label: 'Watch it form', icon: 'play', desc: 'Bar by bar — then call it.' },
  { key: 'step',    label: 'Step through', icon: 'arrow', desc: 'Reveal a bar at a time; call when ready.' },
]

function defaultPerType() {
  return {
    long:  { correct: 0, total: 0 },
    short: { correct: 0, total: 0 },
    wait:  { correct: 0, total: 0 },
    trap:  { correct: 0, total: 0 },
  }
}

export default function Trainer() {
  const [trainMode, setTrainMode] = useState('instant')
  const [deck, setDeck] = useState(() => shuffle(SCENARIOS))
  const [pos, setPos] = useState(0)
  const [picked, setPicked] = useState(null)
  const [sessionAnswered, setSessionAnswered] = useState(0)
  const [sessionCorrect, setSessionCorrect] = useState(0)
  const [sessionTrapsAvoided, setSessionTrapsAvoided] = useState(0)
  const [perType, setPerType] = useState(() => defaultPerType())
  const [showSummary, setShowSummary] = useState(false)
  const [stepIdx, setStepIdx] = useState(0)            // bars revealed in step mode
  const [playReady, setPlayReady] = useState(false)    // play mode: animation finished?
  const scenario = deck[pos]
  const done = picked !== null
  const isCorrect = picked === scenario?.expected
  const progress = getProgress()

  // Reset per-card state when card changes or mode changes
  useEffect(() => {
    if (!scenario) return
    if (trainMode === 'step') {
      setStepIdx(Math.min(3, scenario.values.length))   // start with 3 bars
    } else {
      setStepIdx(scenario.values.length)
    }
    setPlayReady(trainMode !== 'play')
  }, [pos, trainMode, scenario])

  // Play mode: when the chart finishes animating (~1.6s), unlock choices
  useEffect(() => {
    if (trainMode !== 'play' || done) return
    setPlayReady(false)
    const t = setTimeout(() => setPlayReady(true), 1700)
    return () => clearTimeout(t)
  }, [pos, trainMode, done])

  const overallAcc = progress.trainerAttempts > 0
    ? Math.round((progress.trainerCorrect / progress.trainerAttempts) * 100)
    : null

  const markers = useMemo(() => {
    if (!scenario) return []
    const ms = []
    const showAll = done   // show all annotations once an answer is committed
    if (typeof scenario.dip1Idx === 'number' && (showAll || stepIdx > scenario.dip1Idx)) {
      ms.push({ idx: scenario.dip1Idx, kind: 'dip1', label: scenario.expected === 'SHORT' ? 'Rally high' : 'Dip 1' })
    }
    if (typeof scenario.dip2Idx === 'number' && (showAll || stepIdx > scenario.dip2Idx)) {
      ms.push({ idx: scenario.dip2Idx, kind: 'dip2', label: scenario.expected === 'SHORT' ? 'Lower high' : 'Dip 2' })
    }
    if (done && typeof scenario.entryIdx === 'number') {
      ms.push({ idx: scenario.entryIdx, kind: 'enter', label: 'Enter on close' })
    }
    return ms
  }, [scenario, done, stepIdx])

  const visibleValues = useMemo(() => {
    if (!scenario) return []
    if (trainMode === 'step' && !done) return scenario.values.slice(0, stepIdx)
    return scenario.values
  }, [scenario, trainMode, stepIdx, done])

  const canRevealMore = trainMode === 'step' && !done && stepIdx < (scenario?.values?.length || 0)
  const choicesEnabled = !done && (trainMode === 'instant' || (trainMode === 'play' && playReady) || trainMode === 'step')

  const handlePick = (choiceKey) => {
    if (done || !choicesEnabled) return
    setPicked(choiceKey)
    const correct = choiceKey === scenario.expected
    const newAnswered = sessionAnswered + 1
    const newCorrect = sessionCorrect + (correct ? 1 : 0)
    const trapsAvoided = sessionTrapsAvoided + (scenario.trap && (choiceKey === 'SKIP' || choiceKey === 'WAIT') && correct ? 1 : 0)
    setSessionAnswered(newAnswered)
    setSessionCorrect(newCorrect)
    setSessionTrapsAvoided(trapsAvoided)

    // Per-type tracking (per the round)
    const next = { ...perType, long: { ...perType.long }, short: { ...perType.short }, wait: { ...perType.wait }, trap: { ...perType.trap } }
    if (scenario.expected === 'LONG')  { next.long.total++;  if (correct) next.long.correct++ }
    if (scenario.expected === 'SHORT') { next.short.total++; if (correct) next.short.correct++ }
    if (scenario.expected === 'WAIT')  { next.wait.total++;  if (correct) next.wait.correct++ }
    if (scenario.trap)                 { next.trap.total++;  if (correct) next.trap.correct++ }
    setPerType(next)

    patchProgress({
      trainerAttempts: (progress.trainerAttempts || 0) + 1,
      trainerCorrect: (progress.trainerCorrect || 0) + (correct ? 1 : 0),
      trainerTrapsAvoided: (progress.trainerTrapsAvoided || 0) + (scenario.trap && correct ? 1 : 0),
    })
  }

  const next = () => {
    if (pos + 1 >= deck.length) {
      setShowSummary(true)
    } else {
      setPos(pos + 1)
      setPicked(null)
    }
  }

  const reshuffle = () => {
    setDeck(shuffle(SCENARIOS))
    setPos(0)
    setPicked(null)
    setSessionAnswered(0)
    setSessionCorrect(0)
    setSessionTrapsAvoided(0)
    setPerType(defaultPerType())
    setShowSummary(false)
  }

  if (showSummary) {
    const trapsTotal = SCENARIOS.filter(s => s.trap).length
    const pct = sessionAnswered > 0 ? Math.round((sessionCorrect / sessionAnswered) * 100) : 0
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <header>
          <div className="pill pill-cyan inline-flex mb-3"><Icon name="target" className="w-3.5 h-3.5"/> Round complete</div>
          <h1 className="font-display font-semibold text-3xl md:text-4xl text-textp tracking-tight">Round summary</h1>
        </header>
        <div className="grid md:grid-cols-3 gap-3">
          <div className="card p-5 text-center">
            <div className="font-display text-[11px] uppercase tracking-[0.18em] text-textt">Accuracy</div>
            <div className="font-display font-semibold text-4xl text-emerald2 text-glow-emerald mt-2">{pct}%</div>
            <div className="font-mono text-texts text-[12px] mt-1">{sessionCorrect}/{sessionAnswered}</div>
          </div>
          <div className="card p-5 text-center">
            <div className="font-display text-[11px] uppercase tracking-[0.18em] text-textt">Traps avoided</div>
            <div className="font-display font-semibold text-4xl text-gold text-glow-gold mt-2">{sessionTrapsAvoided}/{trapsTotal}</div>
            <div className="font-mono text-texts text-[12px] mt-1">The bleed-stoppers</div>
          </div>
          <div className="card p-5 text-center">
            <div className="font-display text-[11px] uppercase tracking-[0.18em] text-textt">All-time accuracy</div>
            <div className="font-display font-semibold text-4xl text-violet2 text-glow-violet mt-2">
              {progress.trainerAttempts > 0 ? Math.round((progress.trainerCorrect / progress.trainerAttempts) * 100) : 0}%
            </div>
            <div className="font-mono text-texts text-[12px] mt-1">{progress.trainerCorrect}/{progress.trainerAttempts}</div>
          </div>
        </div>
        <div className="card p-5">
          <h3 className="font-display font-semibold text-textp text-lg mb-3 flex items-center gap-2">
            <Icon name="stats" className="w-5 h-5 text-violet2"/> Accuracy by type
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { k: 'long',  label: 'Valid longs',  color: 'emerald' },
              { k: 'short', label: 'Valid shorts', color: 'coral'   },
              { k: 'wait',  label: 'Wait calls',   color: 'gold'    },
              { k: 'trap',  label: 'Traps avoided', color: 'violet' },
            ].map(row => {
              const v = perType[row.k]
              const p = v.total > 0 ? Math.round((v.correct / v.total) * 100) : null
              const bar = v.total > 0 ? `${v.correct}/${v.total}` : '0/0'
              const color = row.color === 'emerald' ? '#1FE0A0' : row.color === 'coral' ? '#FF5C72' : row.color === 'gold' ? '#FFB347' : '#9B8CFF'
              return (
                <div key={row.k} className="card-elev p-3 rounded-card border border-border">
                  <div className="font-display text-[10px] uppercase tracking-[0.16em] text-textt">{row.label}</div>
                  <div className="font-display font-semibold text-2xl mt-1" style={{ color }}>{p == null ? '—' : `${p}%`}</div>
                  <div className="font-mono text-texts text-[12px]">{bar}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-display font-semibold text-textp text-lg mb-3 flex items-center gap-2">
            <Icon name="shield" className="w-5 h-5 text-gold"/> Traps you saw
          </h3>
          <ul className="space-y-2">
            {SCENARIOS.filter(s => s.trap).map(s => (
              <li key={s.id} className="flex items-start gap-3">
                <span className="pill pill-coral text-[10px] mt-0.5 shrink-0">Trap</span>
                <span className="text-textp text-[14px]">{s.title}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button className="btn btn-primary" onClick={reshuffle}><Icon name="refresh" className="w-4 h-4"/> Shuffle & run again</button>
          <Link to="/flashcards" className="btn btn-ghost"><Icon name="spark" className="w-4 h-4"/> Flashcards</Link>
          <Link to="/learn" className="btn btn-ghost"><Icon name="book" className="w-4 h-4"/> Back to lessons</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <div className="pill pill-cyan inline-flex mb-3"><Icon name="target" className="w-3.5 h-3.5"/> Setup trainer</div>
          <h1 className="font-display font-semibold text-3xl md:text-4xl text-textp tracking-tight">Trade or skip</h1>
          <p className="text-texts mt-2">Build the reflex. The setup is one. The traps are many.</p>
        </div>
        <div className="text-right">
          <div className="font-mono text-textp text-[14px]">Card {pos + 1}/{deck.length}</div>
          <div className="font-mono text-textt text-[12px] mt-1">
            This round: {sessionCorrect}/{sessionAnswered}
            {overallAcc != null && <span className="ml-2 text-texts">· All-time: {overallAcc}%</span>}
          </div>
        </div>
      </header>

      {/* Mode picker */}
      <div className="card p-3 md:p-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <span className="font-display tracking-[0.16em] text-textt text-[11px] uppercase">Training mode</span>
          <div className="inline-flex p-0.5 rounded-lg border border-border bg-bg" role="tablist" aria-label="Training mode">
            {MODES.map(m => (
              <button
                key={m.key}
                role="tab"
                aria-selected={trainMode === m.key}
                className={`inline-flex items-center gap-1 font-display tracking-wide text-[12px] py-1.5 px-3 rounded transition ${trainMode === m.key ? 'bg-cyan2 text-bg shadow-glowCyan' : 'text-texts hover:text-textp'}`}
                onClick={() => { setTrainMode(m.key); setPicked(null) }}
              >
                <Icon name={m.icon} className="w-3.5 h-3.5"/> {m.label}
              </button>
            ))}
          </div>
        </div>
        <p className="text-textt text-[12px] mt-2 font-body">{MODES.find(m => m.key === trainMode)?.desc}</p>
      </div>

      <div className="card p-4 md:p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className={`pill ${
            scenario.ctxColor === 'emerald' ? 'pill-emerald' :
            scenario.ctxColor === 'coral'   ? 'pill-coral' :
            scenario.ctxColor === 'muted'   ? 'pill-muted' :
            scenario.ctxColor === 'gold'    ? 'pill-gold'  : 'pill-violet'
          }`}>{scenario.ctx}</span>
          <span className="pill pill-violet">2-min · candle: {scenario.candle}</span>
        </div>

        <SetupChart
          key={`${pos}-${trainMode}-${stepIdx}-${done}`}
          values={visibleValues}
          triggerY={scenario.triggerY}
          triggerLabel="2-min trendline"
          markers={markers}
          stopY={done && (scenario.expected === 'LONG' || scenario.expected === 'SHORT') ? scenario.stopY : undefined}
          stopLabel={scenario.stopLabel || 'Your stop'}
          ema20={scenario.ema20 ? scenario.ema20.slice(0, visibleValues.length) : undefined}
          height={280}
          mode={!done && trainMode === 'play' ? 'play' : (done ? 'reveal' : 'static')}
          autoPlay={!done && trainMode === 'play'}
          axisLabels
        />

        {canRevealMore && (
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="font-mono text-texts text-[12px]">Bars revealed: {stepIdx} / {scenario.values.length}</span>
            <button
              className="btn btn-ghost border-cyan2/40 text-cyan2 hover:bg-cyan2/10 text-[12px] py-2 px-3"
              onClick={() => setStepIdx(i => Math.min(scenario.values.length, i + 1))}
            >
              <Icon name="arrow" className="w-3.5 h-3.5"/> Reveal next bar
            </button>
          </div>
        )}
        {trainMode === 'play' && !playReady && !done && (
          <div className="font-mono text-texts text-[12px] text-center">Watching it form…</div>
        )}

        {!done ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            {CHOICES.map(c => (
              <ChoiceButton key={c.key} choice={c} onClick={() => handlePick(c.key)} disabled={!choicesEnabled} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
              {CHOICES.map(c => (
                <ChoiceButton
                  key={c.key}
                  choice={c}
                  onClick={() => {}}
                  disabled
                  isCorrect={c.key === scenario.expected}
                  picked={picked === c.key}
                />
              ))}
            </div>
            <div className={`card-elev p-4 border-l-4 ${isCorrect ? 'border-l-emerald2' : 'border-l-coral'}`} style={{ borderRadius: 8 }}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect
                  ? <span className="pill pill-emerald"><Icon name="check" className="w-3 h-3"/> Correct — {scenario.expected}</span>
                  : <span className="pill pill-coral"><Icon name="x" className="w-3 h-3"/> Answer was {scenario.expected}</span>}
                {scenario.trap && <span className="pill pill-gold">Trap card</span>}
              </div>
              <h3 className="font-display font-semibold text-textp">{scenario.title}</h3>
              <p className="text-texts text-[14px] mt-1 leading-relaxed">{scenario.why}</p>
            </div>
            <div className="flex justify-end">
              <button className="btn btn-primary" onClick={next}>
                {pos + 1 >= deck.length ? 'See summary' : 'Next card'} <Icon name="arrow" className="w-4 h-4"/>
              </button>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-between items-center gap-3">
        <button className="btn btn-ghost text-[12px] py-2 px-3" onClick={reshuffle}>
          <Icon name="refresh" className="w-3.5 h-3.5"/> Shuffle deck
        </button>
        <Link to="/flashcards" className="btn btn-ghost text-[12px] py-2 px-3">
          <Icon name="spark" className="w-3.5 h-3.5"/> Flashcards
        </Link>
      </div>
    </div>
  )
}

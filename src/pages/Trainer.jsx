import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SCENARIOS } from '../trainerData.js'
import { ChartFromPath } from '../components/Charts.jsx'
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

export default function Trainer() {
  const [deck, setDeck] = useState(() => shuffle(SCENARIOS))
  const [pos, setPos] = useState(0)
  const [picked, setPicked] = useState(null)
  const [sessionAnswered, setSessionAnswered] = useState(0)
  const [sessionCorrect, setSessionCorrect] = useState(0)
  const [sessionTrapsAvoided, setSessionTrapsAvoided] = useState(0)
  const [showSummary, setShowSummary] = useState(false)
  const scenario = deck[pos]
  const done = picked !== null
  const isCorrect = picked === scenario?.expected
  const progress = getProgress()

  const overallAcc = progress.trainerAttempts > 0
    ? Math.round((progress.trainerCorrect / progress.trainerAttempts) * 100)
    : null

  const markers = useMemo(() => {
    if (!scenario) return []
    const ms = []
    if (typeof scenario.dip1Idx === 'number') ms.push({ idx: scenario.dip1Idx, label: 'Dip 1', color: '#FF5C72' })
    if (typeof scenario.dip2Idx === 'number') ms.push({ idx: scenario.dip2Idx, label: scenario.expected === 'SHORT' ? 'Lower high' : 'Dip 2', color: '#FFB347' })
    if (done && typeof scenario.entryIdx === 'number') ms.push({ idx: scenario.entryIdx, label: 'Entry', color: '#1FE0A0' })
    return ms
  }, [scenario, done])

  const handlePick = (choiceKey) => {
    if (done) return
    setPicked(choiceKey)
    const correct = choiceKey === scenario.expected
    const newAnswered = sessionAnswered + 1
    const newCorrect = sessionCorrect + (correct ? 1 : 0)
    const trapsAvoided = sessionTrapsAvoided + (scenario.trap && (choiceKey === 'SKIP' || choiceKey === 'WAIT') && correct ? 1 : 0)
    setSessionAnswered(newAnswered)
    setSessionCorrect(newCorrect)
    setSessionTrapsAvoided(trapsAvoided)
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

        <ChartFromPath
          values={scenario.values}
          triggerY={scenario.triggerY}
          markers={markers}
          stopY={done && (scenario.expected === 'LONG' || scenario.expected === 'SHORT') ? scenario.stopY : undefined}
          stopLabel={scenario.stopLabel || 'Stop (a few ticks below Dip 1)'}
          ema20={scenario.ema20}
          height={260}
        />

        {!done ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            {CHOICES.map(c => (
              <ChoiceButton key={c.key} choice={c} onClick={() => handlePick(c.key)} disabled={false} />
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

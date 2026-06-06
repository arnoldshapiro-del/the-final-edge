import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { CARDS } from '../flashcardData.js'
import { Icon } from '../components/Icon.jsx'
import { getProgress, patchProgress } from '../storage.js'

// Lightweight spaced repetition:
//   known++ on "I knew it" → card de-prioritized for this session
//   known stays / decreased on "Show me again" → card cycles back

function buildDeck(progress) {
  // Sort by least-known (weakest first), then by least-seen.
  return CARDS.slice().sort((a, b) => {
    const knownA = progress.flashcardKnown[a.id] || 0
    const knownB = progress.flashcardKnown[b.id] || 0
    if (knownA !== knownB) return knownA - knownB
    const seenA = progress.flashcardSeen[a.id] || 0
    const seenB = progress.flashcardSeen[b.id] || 0
    return seenA - seenB
  })
}

export default function Flashcards() {
  const initialProgress = useMemo(() => getProgress(), [])
  const [progress, setProgress] = useState(initialProgress)
  const [deck, setDeck] = useState(() => buildDeck(initialProgress))
  const [pos, setPos] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const card = deck[pos]

  const total = CARDS.length
  const knownCount = Object.values(progress.flashcardKnown || {}).filter(v => v > 0).length

  const flip = () => setFlipped(f => !f)

  const advance = (knew) => {
    const fk = { ...(progress.flashcardKnown || {}) }
    const fs = { ...(progress.flashcardSeen || {}) }
    fs[card.id] = (fs[card.id] || 0) + 1
    fk[card.id] = Math.max(0, (fk[card.id] || 0) + (knew ? 1 : -1))
    const next = { ...progress, flashcardKnown: fk, flashcardSeen: fs }
    patchProgress({ flashcardKnown: fk, flashcardSeen: fs })
    setProgress(next)

    let nextPos = pos + 1
    let nextDeck = deck
    if (!knew) {
      // Cycle this card to the end for another attempt this session
      nextDeck = deck.slice()
      const [taken] = nextDeck.splice(pos, 1)
      nextDeck.push(taken)
    }
    if (nextPos >= nextDeck.length) {
      nextDeck = buildDeck(next)
      nextPos = 0
    }
    setDeck(nextDeck)
    setPos(nextPos)
    setFlipped(false)
  }

  useEffect(() => {
    const onKey = e => {
      if (e.key === ' ') { e.preventDefault(); flip() }
      else if (e.key === 'Enter' || e.key === 'ArrowRight') { if (flipped) advance(true) }
      else if (e.key === 'ArrowLeft' || e.key === 'Backspace') { if (flipped) advance(false) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <div className="pill pill-violet inline-flex mb-3"><Icon name="spark" className="w-3.5 h-3.5"/> Flashcards</div>
          <h1 className="font-display font-semibold text-3xl md:text-4xl text-textp tracking-tight">Lock in the mantras</h1>
          <p className="text-texts mt-2">Front → flip → answer honestly. Repeat until it&apos;s reflex.</p>
        </div>
        <div className="text-right">
          <div className="font-mono text-textp text-[14px]">{knownCount}/{total} known</div>
          <div className="font-mono text-textt text-[12px] mt-1">Session card {pos + 1}/{deck.length}</div>
        </div>
      </header>

      <div className="card p-6 md:p-8 min-h-[280px] flex flex-col items-center justify-center text-center relative cursor-pointer card-hover" onClick={flip} role="button" tabIndex={0} aria-label="Flashcard">
        <div className="pill pill-muted absolute top-3 left-3 text-[10px]">{flipped ? 'Answer' : 'Front — tap to flip'}</div>
        {!flipped ? (
          <h2 className="font-display font-semibold text-2xl md:text-3xl text-textp leading-tight max-w-2xl">{card.front}</h2>
        ) : (
          <p className="font-body text-textp text-xl md:text-2xl leading-relaxed max-w-2xl">{card.back}</p>
        )}
        <div className="mt-6 text-textt text-[12px] font-mono">{flipped ? '' : 'Press Space to flip · ← Show again · → Knew it'}</div>
      </div>

      {flipped ? (
        <div className="grid grid-cols-2 gap-3">
          <button className="btn btn-ghost border-coral/40 text-coral hover:bg-coral/10" onClick={() => advance(false)}>
            <Icon name="refresh" className="w-4 h-4"/> Show me again
          </button>
          <button className="btn btn-primary" onClick={() => advance(true)}>
            <Icon name="check" className="w-4 h-4"/> I knew it
          </button>
        </div>
      ) : (
        <div className="flex justify-center">
          <button className="btn btn-gold" onClick={flip}>
            <Icon name="spark" className="w-4 h-4"/> Reveal answer
          </button>
        </div>
      )}

      <div className="flex justify-between items-center pt-2">
        <Link to="/trainer" className="text-texts hover:text-textp text-[13px] font-display flex items-center gap-1">
          <Icon name="back" className="w-3.5 h-3.5"/> Back to Trainer
        </Link>
        <Link to="/learn" className="text-texts hover:text-textp text-[13px] font-display flex items-center gap-1">
          Lessons <Icon name="arrow" className="w-3.5 h-3.5"/>
        </Link>
      </div>
    </div>
  )
}

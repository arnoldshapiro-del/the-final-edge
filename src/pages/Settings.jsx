import { useState, useEffect } from 'react'
import { useSettings, useTrades } from '../hooks.js'
import { setSettings, setTrades, setProgress, setSession } from '../storage.js'
import { Icon } from '../components/Icon.jsx'

export default function Settings() {
  const s = useSettings()
  const trades = useTrades()
  const [draft, setDraft] = useState(s)
  const [askReset, setAskReset] = useState(null) // 'trades' | 'all' | null
  const [saved, setSaved] = useState(false)
  useEffect(() => setDraft(s), [s.contracts, s.maxTradesPerSession, s.maxLossPerSession, s.mode])

  const save = () => { setSettings(draft); setSaved(true); setTimeout(() => setSaved(false), 1800) }
  const change = (k, v) => setDraft({ ...draft, [k]: v })

  const resetTrades = () => {
    setTrades([])
    setSession({ date: null, tradesToday: 0, rToday: 0, locked: false })
    setAskReset(null)
  }
  const resetAll = () => {
    setTrades([])
    setSettings({ contracts: 6, maxTradesPerSession: 3, maxLossPerSession: 3, mode: 'sim', mission: s.mission })
    setProgress({ lessonsCompleted: [], trainerAttempts: 0, trainerCorrect: 0, trainerSessionTotal: 0, trainerSessionCorrect: 0, trainerTrapsAvoided: 0, flashcardKnown: {}, flashcardSeen: {}, simGreenStreak: 0, daysPracticed: 0, lastSessionDate: null })
    setSession({ date: null, tradesToday: 0, rToday: 0, locked: false })
    setAskReset(null)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <header>
        <div className="pill pill-muted inline-flex mb-3"><Icon name="gear" className="w-3.5 h-3.5"/> Settings</div>
        <h1 className="font-display font-semibold text-3xl text-textp">Cockpit settings</h1>
        <p className="text-texts mt-2">Sizing, daily guardrails, and mode.</p>
      </header>

      <div className="card p-5 space-y-5">
        <div>
          <label className="field-label">Mode</label>
          <div className="flex gap-2">
            {['sim', 'live'].map(m => (
              <button
                key={m}
                className={`btn ${draft.mode === m ? (m === 'live' ? 'btn-danger' : 'btn-primary') : 'btn-ghost'}`}
                onClick={() => change('mode', m)}
              >
                {m === 'live' ? 'Live (real money)' : 'Sim'}
              </button>
            ))}
          </div>
          <p className="text-textt text-[12px] mt-2 font-body">Live mode is a tag on the trade record — protect your sample. Switch only after Stats says green-light.</p>
        </div>

        <div>
          <label className="field-label">Contracts per trade</label>
          <input type="number" min={1} max={20} value={draft.contracts} onChange={e => change('contracts', Math.max(1, Math.min(20, parseInt(e.target.value || '6'))))} />
          <p className="text-textt text-[12px] mt-1 font-body">Default 6 (2/2/2 ladder). Same size every trade.</p>
        </div>

        <div>
          <label className="field-label">Max trades per session</label>
          <input type="number" min={1} max={10} value={draft.maxTradesPerSession} onChange={e => change('maxTradesPerSession', parseInt(e.target.value || '3'))} />
        </div>

        <div>
          <label className="field-label">Max loss per session (R)</label>
          <input type="number" min={1} max={20} value={draft.maxLossPerSession} onChange={e => change('maxLossPerSession', parseInt(e.target.value || '3'))} />
          <p className="text-textt text-[12px] mt-1 font-body">In R units. When the day's net hits −Max, the cockpit locks until tomorrow.</p>
        </div>

        <div className="flex gap-3 items-center">
          <button className="btn btn-primary" onClick={save}><Icon name="check" className="w-4 h-4"/> Save settings</button>
          {saved && <span className="pill pill-emerald animate-fadeup"><Icon name="check" className="w-3 h-3"/> Saved</span>}
        </div>
      </div>

      <div className="card p-5 space-y-3 border-l-4" style={{ borderLeftColor: '#FF5C72' }}>
        <h2 className="font-display font-semibold text-textp text-lg">Danger zone</h2>
        <p className="text-textt text-[13px] font-body">{trades.length} trade(s) logged. Resetting deletes your sample — usually you don’t want to.</p>
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-ghost border-coral/40 text-coral hover:bg-coral/10" onClick={() => setAskReset('trades')}>
            <Icon name="trash" className="w-4 h-4"/> Reset trade journal
          </button>
          <button className="btn btn-ghost border-coral/40 text-coral hover:bg-coral/10" onClick={() => setAskReset('all')}>
            <Icon name="refresh" className="w-4 h-4"/> Reset everything
          </button>
        </div>
      </div>

      {askReset && (
        <div className="fixed inset-0 z-50 bg-bg/85 backdrop-blur flex items-center justify-center p-4">
          <div className="card p-6 max-w-md text-center">
            <Icon name="lock" className="w-9 h-9 text-coral mx-auto mb-2"/>
            <h3 className="font-display font-semibold text-textp text-xl">{askReset === 'all' ? 'Reset everything?' : 'Reset trade journal?'}</h3>
            <p className="text-texts text-[14px] mt-2">
              {askReset === 'all'
                ? 'Deletes all trades, lesson progress, trainer stats, flashcards, and session counters. Mission text is kept. This can\'t be undone.'
                : 'Deletes all logged trades and resets today\'s session counter. Lesson progress and trainer stats are kept. This can\'t be undone.'}
            </p>
            <div className="flex justify-center gap-2 mt-5">
              <button className="btn btn-ghost" onClick={() => setAskReset(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => askReset === 'all' ? resetAll() : resetTrades()}>
                Yes, reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

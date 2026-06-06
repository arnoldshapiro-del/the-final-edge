import { useState, useEffect } from 'react'
import { useSettings } from '../hooks.js'
import { setSettings } from '../storage.js'
import { Icon } from '../components/Icon.jsx'

export default function Settings() {
  const s = useSettings()
  const [draft, setDraft] = useState(s)
  useEffect(() => setDraft(s), [s.contracts, s.maxTradesPerSession, s.maxLossPerSession, s.mode])

  const save = () => setSettings(draft)
  const change = (k, v) => setDraft({ ...draft, [k]: v })

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

        <button className="btn btn-primary" onClick={save}><Icon name="check" className="w-4 h-4"/> Save settings</button>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { LESSONS } from '../lessons.jsx'
import { useProgress } from '../hooks.js'
import { Icon } from '../components/Icon.jsx'

export default function Learn() {
  const progress = useProgress()
  const done = new Set(progress.lessonsCompleted || [])
  const pct = Math.round((done.size / LESSONS.length) * 100)

  return (
    <div className="space-y-6">
      <header>
        <div className="pill pill-gold inline-flex mb-3"><Icon name="book" className="w-3.5 h-3.5" /> The playbook</div>
        <h1 className="font-display font-semibold text-3xl md:text-4xl text-textp tracking-tight">Learn the one edge</h1>
        <p className="text-texts text-[15px] md:text-base mt-2 max-w-2xl">Ten lessons. One setup, decomposed. Study each, lock it in, then move on. The Trainer drills what you read here.</p>
      </header>

      <div className="card p-4 md:p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="font-display tracking-wide text-texts text-[12px] uppercase">Progress</span>
          <span className="font-mono text-textp text-[13px]">{done.size}/10 · {pct}%</span>
        </div>
        <div className="w-full bg-bg rounded-full h-2 overflow-hidden border border-border">
          <div className="h-full bg-emerald2 transition-all" style={{ width: `${pct}%`, boxShadow: '0 0 18px rgba(31,224,160,0.45)' }} />
        </div>
      </div>

      <ol className="space-y-3">
        {LESSONS.map(l => {
          const isDone = done.has(l.id)
          return (
            <li key={l.id}>
              <Link
                to={`/learn/${l.id}`}
                className="card card-hover p-4 md:p-5 flex items-center gap-4 group"
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-display font-semibold text-lg shrink-0 border ${isDone ? 'bg-emerald2/10 text-emerald2 border-emerald2/40' : 'bg-elevated text-violet2 border-border'}`}>
                  {isDone ? <Icon name="check" className="w-5 h-5" /> : `L${l.n}`}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-display font-semibold text-textp text-[16px] md:text-[17px]">{l.title}</div>
                  <div className="text-texts text-[13px] md:text-sm mt-0.5 truncate">{l.oneLine}</div>
                </div>
                <Icon name="arrow" className="w-4 h-4 text-texts group-hover:text-textp shrink-0" />
              </Link>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

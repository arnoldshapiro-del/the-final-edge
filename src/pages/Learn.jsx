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
        <p className="text-texts text-[15px] md:text-base mt-2 max-w-2xl">Twelve lessons. One setup, decomposed. Study each, lock it in, then move on. The Trainer drills what you read here.</p>
      </header>

      <div className="card p-4 md:p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="font-display tracking-wide text-texts text-[12px] uppercase">Progress</span>
          <span className="font-mono text-textp text-[13px]">{done.size}/{LESSONS.length} · {pct}%</span>
        </div>
        <div className="w-full bg-bg rounded-full h-2 overflow-hidden border border-border">
          <div className="h-full bg-emerald2 transition-all" style={{ width: `${pct}%`, boxShadow: '0 0 18px rgba(31,224,160,0.45)' }} />
        </div>
      </div>

      <Link
        to="/learn/gallery"
        className="card card-hover p-4 md:p-5 flex items-center gap-4 group relative overflow-hidden"
        style={{ borderColor: 'rgba(155, 140, 255, 0.35)' }}
      >
        <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 w-44 h-44 rounded-full" style={{ background: 'radial-gradient(circle, rgba(155, 140, 255, 0.18), transparent 65%)' }}/>
        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-violet2/10 border border-violet2/40 shrink-0">
          <Icon name="spark" className="w-5 h-5 text-violet2"/>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="pill pill-violet text-[10px]">New</span>
            <div className="font-display font-semibold text-textp text-[16px] md:text-[17px]">Visual library</div>
          </div>
          <div className="text-texts text-[13px] md:text-sm mt-0.5">10 setup charts · candle anatomy · 6 patterns we never trade.</div>
        </div>
        <Icon name="arrow" className="w-4 h-4 text-texts group-hover:text-textp shrink-0" />
      </Link>

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

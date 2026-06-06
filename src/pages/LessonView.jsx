import { Link, useParams, useNavigate } from 'react-router-dom'
import { LESSONS } from '../lessons.jsx'
import { getProgress, patchProgress } from '../storage.js'
import { useProgress } from '../hooks.js'
import { Icon } from '../components/Icon.jsx'

export default function LessonView() {
  const { id } = useParams()
  const nav = useNavigate()
  const progress = useProgress()
  const idx = LESSONS.findIndex(l => l.id === id)
  const lesson = LESSONS[idx]
  if (!lesson) return <div className="text-coral">Lesson not found.</div>
  const prev = idx > 0 ? LESSONS[idx - 1] : null
  const next = idx < LESSONS.length - 1 ? LESSONS[idx + 1] : null
  const done = progress.lessonsCompleted?.includes(lesson.id)

  const toggleComplete = () => {
    const set = new Set(progress.lessonsCompleted || [])
    if (set.has(lesson.id)) set.delete(lesson.id); else set.add(lesson.id)
    patchProgress({ lessonsCompleted: Array.from(set) })
  }

  const completeAndNext = () => {
    const set = new Set(progress.lessonsCompleted || [])
    set.add(lesson.id)
    patchProgress({ lessonsCompleted: Array.from(set) })
    if (next) nav(`/learn/${next.id}`)
    else nav('/learn')
  }

  return (
    <article className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <Link to="/learn" className="text-texts hover:text-textp text-[13px] flex items-center gap-1 font-display"><Icon name="back" className="w-4 h-4"/> All lessons</Link>
        <div className="text-textt text-[12px] font-mono">{lesson.n} / {LESSONS.length}</div>
      </div>

      <header>
        <div className="pill pill-violet inline-flex mb-3">Lesson {lesson.n}</div>
        <h1 className="font-display font-semibold text-3xl md:text-[40px] leading-tight text-textp tracking-tight">{lesson.title}</h1>
        <p className="font-display text-texts text-lg mt-2">{lesson.oneLine}</p>
      </header>

      <div className="divider" />

      <section className="prose-edge font-body">
        {lesson.render()}
      </section>

      <section className="lockit">
        <h4>Lock it in</h4>
        <p className="text-textp text-[15px] leading-relaxed">{lesson.lockIt}</p>
      </section>

      <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
        <button
          className={`btn ${done ? 'btn-ghost' : 'btn-primary'}`}
          onClick={toggleComplete}
        >
          <Icon name={done ? 'check' : 'play'} className="w-4 h-4" />
          {done ? 'Marked complete' : 'Mark complete'}
        </button>
        <div className="flex gap-2">
          {prev && (
            <Link to={`/learn/${prev.id}`} className="btn btn-ghost">
              <Icon name="back" className="w-4 h-4" /> L{prev.n}
            </Link>
          )}
          {next ? (
            <button className="btn btn-primary" onClick={completeAndNext}>
              Continue → L{next.n} <Icon name="arrow" className="w-4 h-4" />
            </button>
          ) : (
            <button className="btn btn-gold" onClick={completeAndNext}>
              Finish playbook <Icon name="check" className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

import { Routes, Route, NavLink, useLocation, Navigate } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import { processGreenStreak, migrateTradeRValues } from './storage.js'
import Home from './pages/Home.jsx'
import Learn from './pages/Learn.jsx'
import LessonView from './pages/LessonView.jsx'
import Trainer from './pages/Trainer.jsx'
import Flashcards from './pages/Flashcards.jsx'
import Gallery from './pages/Gallery.jsx'
import TradePlan from './pages/TradePlan.jsx'
import MyRisk from './pages/MyRisk.jsx'
import Discipline from './pages/Discipline.jsx'
import Manual from './pages/Manual.jsx'
import Trade from './pages/Trade.jsx'
import Settings from './pages/Settings.jsx'
import { Icon } from './components/Icon.jsx'

// Stats is the only Recharts consumer — code-split it so Recharts doesn't sit in the initial bundle.
const Stats = lazy(() => import('./pages/Stats.jsx'))

function StatsFallback() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-border border-t-emerald2 animate-spin" style={{ borderTopColor: '#1FE0A0' }} />
        <div className="font-display tracking-wide text-texts text-[13px]">Loading stats…</div>
      </div>
    </div>
  )
}

const NAV = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/learn', label: 'Learn', icon: 'book' },
  { to: '/trainer', label: 'Trainer', icon: 'target' },
  { to: '/trade', label: 'Trade', icon: 'chart' },
  { to: '/stats', label: 'Stats', icon: 'stats' },
]

const DESKTOP_EXTRAS = [
  { to: '/manual', label: 'Field manual', icon: 'book' },
  { to: '/learn/gallery', label: 'Visual library', icon: 'spark' },
  { to: '/flashcards', label: 'Flashcards', icon: 'flame' },
  { to: '/plan', label: 'Trade plan', icon: 'shield' },
  { to: '/risk', label: 'My Risk', icon: 'lock' },
  { to: '/discipline', label: 'Discipline', icon: 'compass' },
]

function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-border bg-panel/85 backdrop-blur sticky top-0 h-screen overflow-y-auto print:hidden">
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-bg border border-border flex items-center justify-center shadow-glow">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
              <path d="M3 18 L9 12 L13 16 L21 6" stroke="#1FE0A0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="21" cy="6" r="2" fill="#FFB347"/>
            </svg>
          </div>
          <div>
            <div className="font-display font-semibold tracking-wide text-textp text-[15px] leading-none">THE FINAL</div>
            <div className="font-display font-semibold tracking-[0.2em] text-emerald2 text-glow-emerald text-[15px] leading-none mt-0.5">EDGE</div>
          </div>
        </div>
      </div>
      <nav className="px-2 mt-4 flex flex-col gap-1">
        {NAV.map(n => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.to === '/'}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-lg font-display font-medium text-[14px] tracking-wide transition ${
                isActive
                  ? 'bg-elevated text-textp border border-border shadow-[inset_0_0_0_1px_rgba(155,140,255,0.18)]'
                  : 'text-texts hover:text-textp hover:bg-elevated/60 border border-transparent'
              }`
            }
          >
            <Icon name={n.icon} className="w-4 h-4" />
            <span>{n.label}</span>
          </NavLink>
        ))}
        <div className="h-px mx-3 my-2 bg-border" />
        {DESKTOP_EXTRAS.map(n => (
          <NavLink
            key={n.to}
            to={n.to}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2 rounded-lg font-display font-medium text-[13px] tracking-wide transition ${
                isActive
                  ? 'bg-elevated text-textp border border-border'
                  : 'text-texts hover:text-textp hover:bg-elevated/60 border border-transparent'
              }`
            }
          >
            <Icon name={n.icon} className="w-4 h-4" />
            <span>{n.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto p-4">
        <NavLink to="/settings" className={({ isActive }) =>
          `flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-display font-medium border ${isActive ? 'border-border bg-elevated text-textp' : 'border-transparent text-texts hover:text-textp'}`
        }>
          <Icon name="gear" className="w-4 h-4" />
          Settings
        </NavLink>
        <div className="text-[11px] text-textt mt-3 px-3 font-mono">v1.0</div>
      </div>
    </aside>
  )
}

function MobileTabs() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-panel/95 backdrop-blur border-t border-border" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="grid grid-cols-5">
        {NAV.map(n => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2.5 text-[11px] font-display tracking-wide ${isActive ? 'text-emerald2' : 'text-texts'}`
            }
          >
            <Icon name={n.icon} className="w-5 h-5 mb-0.5" />
            <span>{n.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

function DisciplineBanner() {
  return (
    <div className="w-full bg-bg/95 backdrop-blur border-b border-border sticky top-0 z-40 print:hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-2 flex items-center justify-center gap-3 flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald2/15 border border-emerald2/60 font-display font-bold tracking-[0.22em] text-emerald2 text-glow-emerald text-[12px] md:text-[13px]">
          M2K
        </span>
        <span className="font-display tracking-wide text-[11px] md:text-[12px] text-textt hidden sm:inline">Micro Russell 2000</span>
        <span className="text-border hidden sm:inline">·</span>
        <p className="font-display tracking-wide text-[12px] md:text-[13px] text-texts m-0">
          Grade yourself on <span className="text-gold">following the plan</span>, not on winning.
        </p>
      </div>
    </div>
  )
}

export default function App() {
  const loc = useLocation()
  useEffect(() => {
    // One-time migration of legacy journals whose full-stop trades were stored as
    // −3R (pre-audit) instead of the correct −6R. Idempotent, no-op for fresh data.
    migrateTradeRValues()
    // Roll the green-day streak forward once per app open (idempotent).
    processGreenStreak()
  }, [])
  return (
    <div className="min-h-screen flex flex-col">
      <DisciplineBanner />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 min-w-0 pb-24 md:pb-8" key={loc.pathname}>
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-8 animate-fadeup">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/learn/gallery" element={<Gallery />} />
              <Route path="/learn/:id" element={<LessonView />} />
              <Route path="/trainer" element={<Trainer />} />
              <Route path="/flashcards" element={<Flashcards />} />
              <Route path="/trade" element={<Trade />} />
              <Route path="/stats" element={<Suspense fallback={<StatsFallback />}><Stats /></Suspense>} />
              <Route path="/plan" element={<TradePlan />} />
              <Route path="/risk" element={<MyRisk />} />
              <Route path="/discipline" element={<Discipline />} />
              <Route path="/manual" element={<Manual />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
      <MobileTabs />
    </div>
  )
}

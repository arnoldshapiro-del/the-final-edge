// Centralized localStorage with safe JSON, defaults, and a tiny pub/sub.

const KEY_SETTINGS = 'tfe_settings'
const KEY_TRADES = 'tfe_trades'
const KEY_PROGRESS = 'tfe_progress'
const KEY_SESSION = 'tfe_session' // per-day session counter for circuit breaker
const KEY_PREMARKET = 'tfe_premarket'
const KEY_EOD = 'tfe_eod'

export const DEFAULT_MISSION = "Five and a half years brought me here. I no longer chase reversals or fight the trend. I trade one setup — a pullback with the trend, entered on the second push, stop behind the crowd — and I trade it with discipline. I do this for myself, for Ela, for the future we're building, and for the quiet satisfaction of finally doing it right."

const defaults = {
  settings: {
    contracts: 6,
    maxTradesPerSession: 3,
    maxLossPerSession: 3, // in R
    mode: 'sim',
    mission: DEFAULT_MISSION,
  },
  trades: [],
  progress: {
    lessonsCompleted: [],
    trainerAttempts: 0,
    trainerCorrect: 0,
    trainerSessionTotal: 0,
    trainerSessionCorrect: 0,
    trainerTrapsAvoided: 0,
    flashcardKnown: {}, // {cardId: timesKnown}
    flashcardSeen: {},
    simGreenStreak: 0,
    daysPracticed: 0,
    lastSessionDate: null, // YYYY-MM-DD
  },
  session: {
    date: null,        // YYYY-MM-DD
    tradesToday: 0,
    rToday: 0,         // cumulative R for today
    locked: false,     // hit circuit breaker?
  },
  premarket: null,     // {date, trend15m, keyLevels, maxTrades, maxLoss}
  eod: [],             // [{date, followed, change, summary}]
}

const KEYS = {
  tfe_settings: 'settings',
  tfe_trades: 'trades',
  tfe_progress: 'progress',
  tfe_session: 'session',
  tfe_premarket: 'premarket',
  tfe_eod: 'eod',
}

function read(key) {
  try {
    const raw = localStorage.getItem(key)
    if (raw == null) return structuredClone(defaults[KEYS[key]])
    const parsed = JSON.parse(raw)
    if (KEYS[key] === 'settings' || KEYS[key] === 'progress' || KEYS[key] === 'session') {
      return { ...structuredClone(defaults[KEYS[key]]), ...parsed }
    }
    return parsed
  } catch {
    return structuredClone(defaults[KEYS[key]])
  }
}

function write(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
  emit(key)
}

const listeners = new Set()
function emit(key) { listeners.forEach(fn => fn(key)) }
export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn) }

export function getSettings() { return read(KEY_SETTINGS) }
export function setSettings(v) { write(KEY_SETTINGS, v) }

export function getTrades() { return read(KEY_TRADES) }
export function setTrades(v) { write(KEY_TRADES, v) }
export function addTrade(t) {
  const all = getTrades(); all.unshift(t); setTrades(all)
}
export function updateTrade(id, patch) {
  const all = getTrades().map(t => t.id === id ? { ...t, ...patch } : t)
  setTrades(all)
}
export function removeTrade(id) {
  setTrades(getTrades().filter(t => t.id !== id))
}

export function getProgress() { return read(KEY_PROGRESS) }
export function setProgress(v) { write(KEY_PROGRESS, v) }
export function patchProgress(patch) { setProgress({ ...getProgress(), ...patch }) }

export function todayStr() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function getSession() {
  const s = read(KEY_SESSION)
  const t = todayStr()
  if (s.date !== t) {
    const fresh = { date: t, tradesToday: 0, rToday: 0, locked: false }
    write(KEY_SESSION, fresh)
    return fresh
  }
  return s
}
export function setSession(v) { write(KEY_SESSION, v) }
export function bumpSession(addR) {
  const s = getSession()
  const next = { ...s, tradesToday: s.tradesToday + 1, rToday: s.rToday + (addR || 0) }
  const settings = getSettings()
  if (next.tradesToday >= settings.maxTradesPerSession) next.locked = true
  if (-next.rToday >= settings.maxLossPerSession) next.locked = true
  setSession(next)
  return next
}

export function getPremarket() { return read(KEY_PREMARKET) }
export function setPremarket(v) { write(KEY_PREMARKET, v) }

export function getEOD() { return read(KEY_EOD) }
export function addEOD(entry) {
  const all = getEOD(); all.unshift(entry); write(KEY_EOD, all)
}

// Walk completed sim-trading days (strictly before today) that haven't been graded yet.
// For each: net R > 0 → streak++, net R < 0 → streak resets to 0, net R = 0 → no change.
// Idempotent: stores lastStreakDate (YYYY-MM-DD) of the most-recently-graded day; uncounted days roll forward only.
// Returns the (possibly updated) progress.
export function processGreenStreak() {
  const progress = getProgress()
  const trades = getTrades().filter(t => t.mode === 'sim')
  if (!trades.length) return progress

  // Group sim trades by local date (YYYY-MM-DD)
  const byDate = new Map()
  for (const t of trades) {
    const d = new Date(t.datetime)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const r = typeof t.totalR === 'number' ? t.totalR : tradeTotalR(t)
    byDate.set(key, (byDate.get(key) || 0) + r)
  }

  const today = todayStr()
  // Days that are STRICTLY BEFORE today (today's PnL is still live), in chronological order
  const completedDays = Array.from(byDate.keys()).filter(d => d < today).sort()
  if (!completedDays.length) return progress

  const lastGraded = progress.lastStreakDate || ''
  const toGrade = completedDays.filter(d => d > lastGraded)
  if (!toGrade.length) return progress

  let streak = progress.simGreenStreak || 0
  let lastStreakDate = lastGraded
  for (const day of toGrade) {
    const netR = byDate.get(day)
    if (netR > 0) streak += 1
    else if (netR < 0) streak = 0
    // netR === 0 → no change
    lastStreakDate = day
  }
  const next = { ...progress, simGreenStreak: streak, lastStreakDate }
  setProgress(next)
  return next
}

// Mark day practiced (today)
export function markDayPracticed() {
  const p = getProgress()
  const t = todayStr()
  if (p.lastSessionDate !== t) {
    setProgress({ ...p, daysPracticed: (p.daysPracticed || 0) + 1, lastSessionDate: t })
  }
}

// Trade math — 6-contract 2/2/2 ladder reported as a sum of per-contract R.
// Pair A: 2 contracts at T1 (+1R each = +2R won, or −1R each = −2R lost).
// Pair B: 2 contracts at T2 (+2R each = +4R won; 0R at BE after T1; −2R if stopped before T1).
// Pair C: 2 runner contracts (+runnerR × 2 if T1 hit; −2R if stopped before T1).
// Full stop-out (no T1) = −2 − 2 − 2 = −6R per contract count of 6.
export function tradeTotalR(t) {
  let total = 0
  // Pair A — T1
  if (t.t1Hit) total += 2
  else        total += -2
  // Pair B — T2 (BE if T1 hit but T2 missed; full stop if T1 never reached)
  if (t.t2Hit)        total += 4
  else if (t.t1Hit)   total += 0
  else                total += -2
  // Pair C — runner (free roll if T1 hit; stopped at original −1R if T1 never reached)
  if (t.t1Hit) total += 2 * (Number(t.runnerR) || 0)
  else         total += -2
  return total
}

// One-time migration: existing journals stored with the legacy "-3R full stop"
// convention need to be re-keyed to the correct -6R. Idempotent via _r6Fixed flag.
export function migrateTradeRValues() {
  const trades = getTrades()
  if (!trades.length) return false
  let changed = false
  const next = trades.map(t => {
    if (t._r6Fixed) return t
    const correct = tradeTotalR(t)
    const stored = typeof t.totalR === 'number' ? t.totalR : correct
    if (stored !== correct) {
      changed = true
      return { ...t, totalR: Math.round(correct * 100) / 100, _r6Fixed: true }
    }
    return { ...t, _r6Fixed: true }
  })
  if (changed) setTrades(next)
  else write(KEY_TRADES, next) // persist the flag so we don't rescan
  return changed
}

export function getDerivedStats(filterMode = 'all') {
  const trades = getTrades().filter(t => filterMode === 'all' ? true : t.mode === filterMode)
  if (!trades.length) return null
  const totals = trades.map(t => (typeof t.totalR === 'number' ? t.totalR : tradeTotalR(t)))
  const wins = totals.filter(r => r > 0)
  const losses = totals.filter(r => r < 0)
  const winRate = wins.length / trades.length
  const avgWinR = wins.length ? wins.reduce((a, b) => a + b, 0) / wins.length : 0
  const avgLossR = losses.length ? losses.reduce((a, b) => a + b, 0) / losses.length : 0
  const expectancy = totals.reduce((a, b) => a + b, 0) / trades.length
  const ruleAdherence = trades.filter(t => t.followedAll7).length / trades.length
  const cum = []
  let acc = 0
  trades.slice().reverse().forEach((t, i) => {
    acc += (typeof t.totalR === 'number' ? t.totalR : tradeTotalR(t))
    cum.push({ idx: i + 1, r: Number(acc.toFixed(2)) })
  })
  const byGrade = { 'A+': { n: 0, r: 0 }, 'B': { n: 0, r: 0 } }
  const byCandle = {}
  trades.forEach(t => {
    const r = typeof t.totalR === 'number' ? t.totalR : tradeTotalR(t)
    if (byGrade[t.setupGrade]) { byGrade[t.setupGrade].n++; byGrade[t.setupGrade].r += r }
    const c = t.candle || 'none'
    if (!byCandle[c]) byCandle[c] = { n: 0, r: 0 }
    byCandle[c].n++; byCandle[c].r += r
  })
  return { trades, totals, winRate, avgWinR, avgLossR, expectancy, ruleAdherence, cum, byGrade, byCandle, n: trades.length }
}

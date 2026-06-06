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

// Mark day practiced (today)
export function markDayPracticed() {
  const p = getProgress()
  const t = todayStr()
  if (p.lastSessionDate !== t) {
    setProgress({ ...p, daysPracticed: (p.daysPracticed || 0) + 1, lastSessionDate: t })
  }
}

// Trade math
export function tradeTotalR(t) {
  // 2-2-2: 2 contracts at T1 (1R), 2 at T2 (2R), 2 runner.
  // If t1Hit false → all 6 stopped = -3R (entire trade is -1R per contract, 6/2 = -3R worth of contracts)
  // Actually convention: report R per contract pair. Use R-multiples in 2/2/2 pieces.
  if (t.t1Hit === false) return -3 // all 6 contracts stopped at -1R each => -6R per-contract = -3R in 2-2-2 pair terms? Use simpler: report sum R across pairs
  // 2 ct @ T1=+1R = +2R; 2 ct @ T2=+2R = +4R; 2 ct runner = +2*runnerR
  let total = 0
  if (t.t1Hit) total += 2  // 2 ct * 1R
  else total += -2          // 2 ct * -1R
  if (t.t2Hit) total += 4  // 2 ct * 2R
  else if (t.t1Hit) total += 0 // BE: 2 ct * 0R (stop moved to BE after T1)
  else total += -2          // never reached T1: 2 ct stopped -1R
  if (t.t1Hit) total += 2 * (Number(t.runnerR) || 0)
  else total += -2          // runner stopped at original stop -1R * 2 ct
  return total
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

// Centralized localStorage with safe JSON, defaults, and a tiny pub/sub.

const KEY_SETTINGS = 'tfe_settings'
const KEY_TRADES = 'tfe_trades'
const KEY_PROGRESS = 'tfe_progress'
const KEY_SESSION = 'tfe_session' // per-day session counter for circuit breaker
const KEY_PREMARKET = 'tfe_premarket'
const KEY_EOD = 'tfe_eod'
const KEY_COOLDOWN = 'tfe_cooldown'   // {until: ISO} post-loss cooldown
const KEY_PREFLIGHT = 'tfe_preflight' // {date, checks, state} live-day pre-flight gate

// M2K money math — R is defined per trade by the ACTUAL stop distance you typed
// (M2K has no locked system stop; MyRisk dollar limits are still "to be set").
// $ per R-unit for a trade = its riskPts × $5/point (per contract).
// Journal totalR is a sum of per-contract R, so trade $ = totalR × riskPts × 5.
export const DOLLARS_PER_POINT = 5
export function tradeDollars(t) {
  const r = typeof t.totalR === 'number' ? t.totalR : tradeTotalR(t)
  const pts = Number(t.riskPts) || 0
  return Math.round(r * pts * DOLLARS_PER_POINT)
}
export function sumTradeDollars(trades) {
  return trades.reduce((a, t) => a + tradeDollars(t), 0)
}
// Sum of actual dollars across today's trades (any mode filter).
export function dayDollars(mode = 'all') {
  const t = todayStr()
  return sumTradeDollars(getTrades().filter(tr => {
    if (mode !== 'all' && tr.mode !== mode) return false
    const d = new Date(tr.datetime)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    return key === t
  }))
}

export const DEFAULT_MISSION = "Five and a half years brought me here. I no longer chase reversals or fight the trend. I trade one setup — a pullback with the trend, entered on the second push, stop behind the crowd — and I trade it with discipline. I do this for myself, for Ela, for the future we're building, and for the quiet satisfaction of finally doing it right."

const defaults = {
  settings: {
    contracts: 6,
    maxTradesPerSession: 3,
    maxLossPerSession: 3, // in FULL LOSSES (one full stop = 6 R-units)
    mode: 'sim',
    mission: DEFAULT_MISSION,
    enforceWindow: true, // live mode: lock entries outside the 9:30–10:30 ET edge window
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
    lossesToday: 0,    // count of losing trades today (mentor's rule: 3 = done)
    locked: false,     // hit circuit breaker?
    lockReason: null,  // 'max-trades' | 'max-losses' | 'max-dollars'
  },
  premarket: null,     // {date, trend15m, keyLevels, maxTrades, maxLoss}
  eod: [],             // [{date, followed, change, summary}]
  cooldown: null,      // {until: ISO}
  preflight: null,     // {date, checks: {...}, state}
}

const KEYS = {
  tfe_settings: 'settings',
  tfe_trades: 'trades',
  tfe_progress: 'progress',
  tfe_session: 'session',
  tfe_premarket: 'premarket',
  tfe_eod: 'eod',
  tfe_cooldown: 'cooldown',
  tfe_preflight: 'preflight',
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
    // Return a fresh session WITHOUT persisting — getSession runs during React render,
    // and a write here would emit() mid-render. bumpSession persists the real state.
    return { date: t, tradesToday: 0, rToday: 0, lossesToday: 0, locked: false, lockReason: null }
  }
  return s
}
export function setSession(v) { write(KEY_SESSION, v) }
// Circuit breaker — the mentor's rule in R (M2K dollar limits are still "to be set"):
//   max trades per session (default 3)
//   3 losing trades = done for the day
//   down maxLossPerSession full losses (default 3 × 6 = 18 R-units) = done for the day
export function bumpSession(addR) {
  const s = getSession()
  const r = addR || 0
  const next = {
    ...s,
    tradesToday: s.tradesToday + 1,
    rToday: s.rToday + r,
    lossesToday: (s.lossesToday || 0) + (r < 0 ? 1 : 0),
  }
  const settings = getSettings()
  const fullLossLimit = settings.maxLossPerSession || 3 // in FULL LOSSES (one full stop = 6 R-units = $240)
  if (next.tradesToday >= settings.maxTradesPerSession) { next.locked = true; next.lockReason = 'max-trades' }
  if (next.lossesToday >= fullLossLimit) { next.locked = true; next.lockReason = 'max-losses' }
  if (-next.rToday >= fullLossLimit * 6) { next.locked = true; next.lockReason = 'max-dollars' }
  setSession(next)
  return next
}

// ---- Post-loss cooldown (anti-revenge timer) ----
export function getCooldown() {
  const c = read(KEY_COOLDOWN)
  if (!c || !c.until) return null
  if (new Date(c.until).getTime() <= Date.now()) return null
  return c
}
export function startCooldown(minutes) {
  const until = new Date(Date.now() + minutes * 60 * 1000).toISOString()
  write(KEY_COOLDOWN, { until })
  return { until }
}
export function clearCooldown() { write(KEY_COOLDOWN, null) }

// ---- Live-day pre-flight gate (per-day) ----
export function getPreflight() {
  const p = read(KEY_PREFLIGHT)
  if (!p || p.date !== todayStr()) return null
  return p
}
export function setPreflight(v) { write(KEY_PREFLIGHT, v) }

// ---- Weekly guardrail (derived from the journal — can't drift) ----
// Week runs Monday → Sunday, local time. Weekly max loss = 2 bad days = maxLossPerSession × 6 × 2 R-units.
export function weekStartStr(d = new Date()) {
  const day = d.getDay() // 0 Sun … 6 Sat
  const diff = day === 0 ? 6 : day - 1
  const mon = new Date(d.getFullYear(), d.getMonth(), d.getDate() - diff)
  const y = mon.getFullYear()
  const m = String(mon.getMonth() + 1).padStart(2, '0')
  const dd = String(mon.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}
export function getWeekStats(mode = 'live') {
  const start = weekStartStr()
  const trades = getTrades().filter(t => {
    if (mode !== 'all' && t.mode !== mode) return false
    const d = new Date(t.datetime)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    return key >= start
  })
  const netR = trades.reduce((a, t) => a + (typeof t.totalR === 'number' ? t.totalR : tradeTotalR(t)), 0)
  const settings = getSettings()
  const weeklyLimitR = (settings.maxLossPerSession || 3) * 6 * 2 // 36 R-units = ~2 bad days
  return {
    weekStart: start,
    n: trades.length,
    netR: Math.round(netR * 100) / 100,
    netDollars: sumTradeDollars(trades), // actual $, from each trade's real stop
    weeklyLimitR,
    locked: -netR >= weeklyLimitR,
  }
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
  const byEmotion = {}
  const byTimeBucket = {}
  const byDOW = {}
  const DOW_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  trades.forEach(t => {
    const r = typeof t.totalR === 'number' ? t.totalR : tradeTotalR(t)
    if (byGrade[t.setupGrade]) { byGrade[t.setupGrade].n++; byGrade[t.setupGrade].r += r }
    const c = t.candle || 'none'
    if (!byCandle[c]) byCandle[c] = { n: 0, r: 0 }
    byCandle[c].n++; byCandle[c].r += r
    const emo = t.emotion || 'unlogged'
    if (!byEmotion[emo]) byEmotion[emo] = { n: 0, r: 0 }
    byEmotion[emo].n++; byEmotion[emo].r += r
    const d = new Date(t.datetime)
    const mins = d.getHours() * 60 + d.getMinutes()
    const bucket =
      mins < 570 ? 'Before 9:30' :
      mins < 585 ? '9:30–9:45' :
      mins < 600 ? '9:45–10:00' :
      mins < 630 ? '10:00–10:30' : 'After 10:30'
    if (!byTimeBucket[bucket]) byTimeBucket[bucket] = { n: 0, r: 0 }
    byTimeBucket[bucket].n++; byTimeBucket[bucket].r += r
    const dow = DOW_NAMES[d.getDay()]
    if (!byDOW[dow]) byDOW[dow] = { n: 0, r: 0 }
    byDOW[dow].n++; byDOW[dow].r += r
  })

  // Profit factor — gross wins ÷ gross losses. >1.3 over a real sample = real edge.
  const grossWin = wins.reduce((a, b) => a + b, 0)
  const grossLoss = Math.abs(losses.reduce((a, b) => a + b, 0))
  const profitFactor = grossLoss > 0 ? grossWin / grossLoss : (grossWin > 0 ? Infinity : 0)

  // Max drawdown on the cumulative-R curve (chronological)
  let peak = 0, maxDD = 0
  cum.forEach(p => {
    if (p.r > peak) peak = p.r
    const dd = peak - p.r
    if (dd > maxDD) maxDD = dd
  })

  // Win/loss streaks (chronological) + current consecutive losses
  const chrono = trades.slice().reverse().map(t => (typeof t.totalR === 'number' ? t.totalR : tradeTotalR(t)))
  let bestWinStreak = 0, worstLossStreak = 0, runW = 0, runL = 0
  chrono.forEach(r => {
    if (r > 0) { runW++; runL = 0; if (runW > bestWinStreak) bestWinStreak = runW }
    else if (r < 0) { runL++; runW = 0; if (runL > worstLossStreak) worstLossStreak = runL }
    else { runW = 0; runL = 0 }
  })
  let currentLossStreak = 0
  for (let i = chrono.length - 1; i >= 0; i--) {
    if (chrono[i] < 0) currentLossStreak++
    else break
  }

  // Rolling expectancy — last 20 trades (is the edge still here right now?)
  const last20 = chrono.slice(-20)
  const rolling20 = last20.length ? last20.reduce((a, b) => a + b, 0) / last20.length : 0

  // Sample-size verdict
  const sampleLabel = trades.length < 30 ? 'PRELIMINARY' : trades.length < 100 ? 'MEANINGFUL' : 'DECISION-GRADE'

  return {
    trades, totals, winRate, avgWinR, avgLossR, expectancy, ruleAdherence, cum, byGrade, byCandle,
    byEmotion, byTimeBucket, byDOW,
    profitFactor, maxDD, bestWinStreak, worstLossStreak, currentLossStreak,
    rolling20, rolling20N: last20.length, sampleLabel,
    grossWin, grossLoss,
    n: trades.length,
  }
}

// ---- Backup / restore — real-money journals must be exportable ----
export function exportAllData() {
  const payload = {
    app: 'the-final-edge-mes',
    exportedAt: new Date().toISOString(),
    version: 2,
    settings: getSettings(),
    trades: getTrades(),
    progress: getProgress(),
    premarket: getPremarket(),
    eod: getEOD(),
  }
  return JSON.stringify(payload, null, 2)
}

export function importAllData(parsed) {
  if (!parsed || typeof parsed !== 'object') throw new Error('Not a valid backup file.')
  if (!Array.isArray(parsed.trades)) throw new Error('Backup has no trades array.')
  if (parsed.settings) write(KEY_SETTINGS, { ...structuredClone(defaults.settings), ...parsed.settings })
  write(KEY_TRADES, parsed.trades)
  if (parsed.progress) write(KEY_PROGRESS, { ...structuredClone(defaults.progress), ...parsed.progress })
  if (parsed.premarket) write(KEY_PREMARKET, parsed.premarket)
  if (Array.isArray(parsed.eod)) write(KEY_EOD, parsed.eod)
  return parsed.trades.length
}

export function buildTradesCSV() {
  const trades = getTrades()
  const cols = ['datetime', 'mode', 'direction', 'setupGrade', 'candle', 'emotion', 'entry', 'stop', 't1', 't2', 't1Hit', 't2Hit', 'runnerR', 'totalR', 'dollars', 'followedAll7', 'missedSteps', 'note']
  const esc = (v) => {
    const s = v == null ? '' : String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const rows = trades.slice().reverse().map(t => cols.map(c => {
    if (c === 'dollars') return tradeDollars(t)
    if (c === 'missedSteps') return (t.missedSteps || []).join('|')
    return esc(t[c])
  }).join(','))
  return [cols.join(','), ...rows].join('\n')
}

export function markBackupDone() {
  patchProgress({ lastBackupAt: new Date().toISOString() })
}

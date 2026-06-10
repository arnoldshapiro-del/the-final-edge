// Eastern-time market clock shared by the Live command center and the Trade cockpit.
// All session math runs in America/New_York so the 9:30–10:30 edge window is correct
// even if the laptop travels.

export const OPEN_MIN = 9 * 60 + 30    // 9:30 ET
export const WINDOW_END = 10 * 60 + 30 // 10:30 ET — the edge window
export const CLOSE_MIN = 16 * 60       // 16:00 ET

export function etParts(now = new Date()) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    weekday: 'short', hour12: false,
  })
  const parts = Object.fromEntries(fmt.formatToParts(now).map(p => [p.type, p.value]))
  return {
    h: Number(parts.hour) % 24,
    m: Number(parts.minute),
    s: Number(parts.second),
    weekday: parts.weekday,
  }
}

export function phaseFor(et) {
  const mins = et.h * 60 + et.m
  if (et.weekday === 'Sat' || et.weekday === 'Sun') return { key: 'closed', label: 'MARKET CLOSED', color: 'muted' }
  if (mins < OPEN_MIN) return { key: 'pre', label: 'PRE-MARKET', color: 'cyan', until: OPEN_MIN }
  if (mins < WINDOW_END) return { key: 'window', label: 'PRIME WINDOW · 9:30–10:30', color: 'emerald', until: WINDOW_END }
  if (mins < CLOSE_MIN) return { key: 'after', label: 'EDGE WINDOW CLOSED', color: 'gold' }
  return { key: 'closed', label: 'MARKET CLOSED', color: 'muted' }
}

export function fmtCountdown(toMin, et) {
  const nowSec = (et.h * 60 + et.m) * 60 + et.s
  const total = toMin * 60 - nowSec
  if (total <= 0) return '0:00'
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`
}

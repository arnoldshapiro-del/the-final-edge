import { useEffect, useState } from 'react'
import { subscribe, getSettings, getTrades, getProgress, getSession, getPremarket, getEOD, getCooldown, getPreflight, getWeekStats } from './storage.js'

export function useStorageVersion() {
  const [v, setV] = useState(0)
  useEffect(() => subscribe(() => setV(x => x + 1)), [])
  return v
}

export function useSettings() {
  const v = useStorageVersion()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemoFresh(() => getSettings(), [v])
}
export function useTrades() {
  const v = useStorageVersion()
  return useMemoFresh(() => getTrades(), [v])
}
export function useProgress() {
  const v = useStorageVersion()
  return useMemoFresh(() => getProgress(), [v])
}
export function useSession() {
  const v = useStorageVersion()
  return useMemoFresh(() => getSession(), [v])
}
export function usePremarket() {
  const v = useStorageVersion()
  return useMemoFresh(() => getPremarket(), [v])
}
export function useEOD() {
  const v = useStorageVersion()
  return useMemoFresh(() => getEOD(), [v])
}
export function usePreflight() {
  const v = useStorageVersion()
  return useMemoFresh(() => getPreflight(), [v])
}
export function useWeekStats(mode = 'live') {
  const v = useStorageVersion()
  return useMemoFresh(() => getWeekStats(mode), [v, mode])
}
// Cooldown ticks once a second so countdowns render live.
export function useCooldown() {
  const v = useStorageVersion()
  const [, setTick] = useState(0)
  const cd = getCooldown()
  useEffect(() => {
    if (!cd) return
    const t = setInterval(() => setTick(x => x + 1), 1000)
    return () => clearInterval(t)
  }, [cd?.until])
  return getCooldown()
}
// Live clock — re-renders every `ms` (for session-phase displays).
export function useClock(ms = 1000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), ms)
    return () => clearInterval(t)
  }, [ms])
  return now
}

import { useMemo } from 'react'
function useMemoFresh(fn, deps) { return useMemo(fn, deps) }

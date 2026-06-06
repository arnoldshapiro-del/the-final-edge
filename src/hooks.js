import { useEffect, useState } from 'react'
import { subscribe, getSettings, getTrades, getProgress, getSession, getPremarket, getEOD } from './storage.js'

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

import { useMemo } from 'react'
function useMemoFresh(fn, deps) { return useMemo(fn, deps) }

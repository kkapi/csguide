import { useCallback, useSyncExternalStore } from 'react'

import type { Nade } from '@/data/types'

const STORAGE_KEY = 'csguide.learned'

/**
 * Отметки «выучено» лежат в одном модульном сторе, а не в хуке на компонент:
 * галочка в модалке и галочка на карточке в сетке — это разные компоненты,
 * и они обязаны видеть одно и то же состояние.
 */
let learned = read()
const listeners = new Set<() => void>()

function read(): ReadonlySet<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return new Set(Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [])
  } catch {
    return new Set()
  }
}

function emit() {
  for (const l of listeners) l()
}

function write(next: ReadonlySet<string>) {
  learned = next
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
  } catch {
    // Приватный режим или переполненное хранилище — состояние живёт в памяти.
  }
  emit()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  if (listeners.size === 1) window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) window.removeEventListener('storage', onStorage)
  }
}

function onStorage(e: StorageEvent) {
  if (e.key !== STORAGE_KEY) return
  learned = read()
  emit()
}

export function useLearnedNades() {
  const set = useSyncExternalStore(
    subscribe,
    () => learned,
    () => learned,
  )

  const isLearned = useCallback((id: string) => set.has(id), [set])

  const toggle = useCallback((id: string) => {
    const next = new Set(learned)
    if (!next.delete(id)) next.add(id)
    write(next)
  }, [])

  const markLearned = useCallback((id: string) => {
    if (learned.has(id)) return
    write(new Set(learned).add(id))
  }, [])

  const countLearned = useCallback(
    (nades: Nade[]) => nades.reduce((n, nade) => (set.has(nade.id) ? n + 1 : n), 0),
    [set],
  )

  return { learnedIds: set, isLearned, toggle, markLearned, countLearned }
}

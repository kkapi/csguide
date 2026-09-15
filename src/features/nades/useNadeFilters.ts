import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import {
  NADE_PURPOSES,
  NADE_TYPES,
  type NadePurpose,
  type NadeType,
  type Side,
  SIDES,
} from '@/data/types'

import { EMPTY_FILTERS, type LearnedFilter, type NadeFilters } from './filters'

const NADE_PARAM = 'nade'

function readList<T extends string>(raw: string | null, allowed: readonly T[]): T[] {
  if (!raw) return []
  return raw.split(',').filter((v): v is T => (allowed as readonly string[]).includes(v))
}

export function parseFilters(sp: URLSearchParams): NadeFilters {
  const side = sp.get('side')
  const learned = sp.get('learned')
  return {
    q: sp.get('q') ?? '',
    types: readList<NadeType>(sp.get('type'), NADE_TYPES),
    side: SIDES.includes(side as Side) ? (side as Side) : null,
    zones: sp.get('zone')?.split(',').filter(Boolean) ?? [],
    purposes: readList<NadePurpose>(sp.get('purpose'), NADE_PURPOSES),
    learned: learned === 'yes' || learned === 'no' ? (learned as LearnedFilter) : null,
  }
}

/**
 * Пишет фильтры в существующие параметры, не трогая чужие (например `nade`).
 * Пустые значения удаляются — чистая страница остаётся чистым URL.
 */
export function writeFilters(sp: URLSearchParams, f: NadeFilters): URLSearchParams {
  const next = new URLSearchParams(sp)
  const set = (key: string, value: string) => {
    if (value) next.set(key, value)
    else next.delete(key)
  }
  set('q', f.q.trim())
  set('type', f.types.join(','))
  set('side', f.side ?? '')
  set('zone', f.zones.join(','))
  set('purpose', f.purposes.join(','))
  set('learned', f.learned ?? '')
  return next
}

export function useNadeFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo(() => parseFilters(searchParams), [searchParams])
  const activeNadeId = searchParams.get(NADE_PARAM)

  const setFilters = useCallback(
    (update: NadeFilters | ((prev: NadeFilters) => NadeFilters)) => {
      setSearchParams(
        (prev) => {
          const next = typeof update === 'function' ? update(parseFilters(prev)) : update
          return writeFilters(prev, next)
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const resetFilters = useCallback(() => setFilters(EMPTY_FILTERS), [setFilters])

  // Открытие/закрытие гранаты — в историю, чтобы «назад» закрывал модалку.
  const openNade = useCallback(
    (id: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        next.set(NADE_PARAM, id)
        return next
      })
    },
    [setSearchParams],
  )

  const closeNade = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.delete(NADE_PARAM)
      return next
    })
  }, [setSearchParams])

  return { filters, setFilters, resetFilters, activeNadeId, openNade, closeNade }
}

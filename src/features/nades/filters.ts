import type { Nade, NadePurpose, NadeType, Side } from '@/data/types'

import { nadeTitle } from './nade'

export type LearnedFilter = 'yes' | 'no' | null

export interface NadeFilters {
  q: string
  types: NadeType[]
  side: Side | null
  zones: string[]
  purposes: NadePurpose[]
  learned: LearnedFilter
}

export const EMPTY_FILTERS: NadeFilters = {
  q: '',
  types: [],
  side: null,
  zones: [],
  purposes: [],
  learned: null,
}

/**
 * Внутри одного фильтра — ИЛИ (смок или флеш), между фильтрами — И.
 * Исключение: назначение требует все выбранные сразу, иначе «ретейк + парный»
 * выдавал бы все ретейки и все парные вместо их пересечения.
 */
export function matchesFilters(
  nade: Nade,
  filters: NadeFilters,
  isLearned: (id: string) => boolean,
): boolean {
  if (filters.types.length > 0 && !filters.types.includes(nade.type)) return false
  if (filters.side && nade.side !== filters.side) return false
  if (filters.zones.length > 0 && !filters.zones.includes(nade.zone)) return false
  if (filters.purposes.length > 0 && !filters.purposes.every((p) => nade.purpose.includes(p))) {
    return false
  }
  if (filters.learned === 'yes' && !isLearned(nade.id)) return false
  if (filters.learned === 'no' && isLearned(nade.id)) return false

  const q = filters.q.trim().toLowerCase()
  if (q) {
    const haystack = [nadeTitle(nade), nade.from, nade.to, nade.throw, nade.note ?? '']
      .join(' ')
      .toLowerCase()
    if (!haystack.includes(q)) return false
  }
  return true
}

export function countActiveFilters(f: NadeFilters): number {
  return (
    (f.q.trim() ? 1 : 0) +
    f.types.length +
    (f.side ? 1 : 0) +
    f.zones.length +
    f.purposes.length +
    (f.learned ? 1 : 0)
  )
}

/** Переключает значение в списке — общий помощник для всех наборов чипсов. */
export function toggleIn<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((x) => x !== value) : [...list, value]
}

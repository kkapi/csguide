import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import { NadeCard } from '@/components/nades/NadeCard'
import { NadeFilters, type NadeFiltersState } from '@/components/nades/NadeFilters'
import { NadeListItem } from '@/components/nades/NadeListItem'
import { NadeModal } from '@/components/nades/NadeModal'
import { type NadeViewMode,NadeViewToggle } from '@/components/nades/NadeViewToggle'
import { mirageNades } from '@/data/maps/mirage/nades'
import type { NadeTag, NadeType } from '@/data/types'
import { useLocalStorage } from '@/utils/useLocalStorage'

const SEARCH_PARAM = 'nade'
const VIEW_STORAGE_KEY = 'nade-view-mode'
const FILTERS_STORAGE_KEY = 'nade-filters-mirage'

const DEFAULT_FILTERS: NadeFiltersState = {
  search: '',
  types: [],
  tags: [],
}

function matchesFilters(
  nade: (typeof mirageNades)[number],
  filters: NadeFiltersState,
): boolean {
  if (filters.types.length > 0 && !filters.types.includes(nade.type as NadeType)) {
    return false
  }
  if (filters.tags.length > 0 && !filters.tags.every((t) => nade.tags.includes(t as NadeTag))) {
    return false
  }
  if (filters.search.trim()) {
    const q = filters.search.toLowerCase()
    const haystack = `${nade.title} ${nade.from} ${nade.to}`.toLowerCase()
    if (!haystack.includes(q)) return false
  }
  return true
}

export function MirageNades() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useLocalStorage<NadeViewMode>(VIEW_STORAGE_KEY, 'grid')
  const [filters, setFilters] = useLocalStorage<NadeFiltersState>(FILTERS_STORAGE_KEY, DEFAULT_FILTERS)

  const activeNadeId = searchParams.get(SEARCH_PARAM)

  const filtered = useMemo(
    () => mirageNades.filter((n) => matchesFilters(n, filters)),
    [filters],
  )

  const activeIndex = filtered.findIndex((n) => n.id === activeNadeId)
  const activeNade = activeIndex !== -1 ? filtered[activeIndex] : null

  const openNade = useCallback(
    (id: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        next.set(SEARCH_PARAM, id)
        return next
      })
    },
    [setSearchParams],
  )

  const closeNade = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.delete(SEARCH_PARAM)
      return next
    })
  }, [setSearchParams])

  const goPrev = useCallback(() => {
    if (activeIndex > 0) openNade(filtered[activeIndex - 1].id)
  }, [activeIndex, filtered, openNade])

  const goNext = useCallback(() => {
    if (activeIndex < filtered.length - 1) openNade(filtered[activeIndex + 1].id)
  }, [activeIndex, filtered, openNade])

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-3xl font-bold">Гранаты Mirage</h1>

      {/* Фильтры + переключатель вида */}
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <NadeFilters filters={filters} onChange={setFilters} />
          </div>
          <NadeViewToggle value={viewMode} onChange={setViewMode} />
        </div>
      </div>

      {/* Счётчик */}
      <p className="text-sm text-zinc-500">
        {filtered.length === mirageNades.length
          ? `${mirageNades.length} гранат`
          : `${filtered.length} из ${mirageNades.length}`}
      </p>

      {/* Список / сетка */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-zinc-500">
          Ничего не найдено. Попробуй изменить фильтры.
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((nade) => (
            <NadeCard key={nade.id} nade={nade} onClick={() => openNade(nade.id)} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((nade) => (
            <NadeListItem key={nade.id} nade={nade} onClick={() => openNade(nade.id)} />
          ))}
        </div>
      )}

      {/* Модалка */}
      <NadeModal
        nade={activeNade}
        open={!!activeNade}
        onClose={closeNade}
        onPrev={goPrev}
        onNext={goNext}
        hasPrev={activeIndex > 0}
        hasNext={activeIndex < filtered.length - 1}
      />
    </div>
  )
}

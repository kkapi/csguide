import { useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { NadeCard } from '@/components/nades/NadeCard'
import { NadeFilters } from '@/components/nades/NadeFilters'
import { NadeListItem } from '@/components/nades/NadeListItem'
import { NadeModal } from '@/components/nades/NadeModal'
import type { NadeViewMode } from '@/components/nades/NadeViewToggle'
import { getMap, MAP_LABELS } from '@/data/maps'
import { isMapSlug } from '@/data/maps'
import { matchesFilters } from '@/features/nades/filters'
import { useLearnedNades } from '@/features/nades/useLearnedNades'
import { useNadeFilters } from '@/features/nades/useNadeFilters'
import { useLocalStorage } from '@/utils/useLocalStorage'

export function MapNades() {
  const { map: slug } = useParams()
  const map = getMap(slug)

  const { filters, setFilters, resetFilters, activeNadeId, openNade, closeNade } =
    useNadeFilters()
  const [view, setView] = useLocalStorage<NadeViewMode>('csguide.nades.view', 'grid')
  const [withSetang, setWithSetang] = useLocalStorage('csguide.nades.setang', true)
  const { isLearned, toggle, countLearned } = useLearnedNades()

  const nades = useMemo(() => map?.nades ?? [], [map])

  const filtered = useMemo(
    () => nades.filter((n) => matchesFilters(n, filters, isLearned)),
    [nades, filters, isLearned],
  )

  const zoneLabels = useMemo(
    () => new Map((map?.zones ?? []).map((z) => [z.id, z.label])),
    [map],
  )

  const activeIndex = filtered.findIndex((n) => n.id === activeNadeId)
  // Гранату, открытую по ссылке, показываем даже если она отфильтрована —
  // иначе ссылка из разбора раунда молча открывала бы пустоту.
  const activeNade =
    activeIndex !== -1
      ? filtered[activeIndex]
      : (nades.find((n) => n.id === activeNadeId) ?? null)

  const goPrev = useCallback(() => {
    if (activeIndex > 0) openNade(filtered[activeIndex - 1].id)
  }, [activeIndex, filtered, openNade])

  const goNext = useCallback(() => {
    if (activeIndex !== -1 && activeIndex < filtered.length - 1) {
      openNade(filtered[activeIndex + 1].id)
    }
  }, [activeIndex, filtered, openNade])

  if (!map) {
    const label = isMapSlug(slug) ? MAP_LABELS[slug] : slug
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Гранаты {label}</h1>
        <p className="text-muted-foreground">
          По этой карте гранат пока нет — данные ещё не завезли.
        </p>
      </div>
    )
  }

  const learnedCount = countLearned(nades)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Гранаты {map.label}</h1>
        <span className="text-sm text-muted-foreground">
          выучено {learnedCount} из {nades.length}
        </span>
      </div>

      <NadeFilters
        filters={filters}
        onChange={setFilters}
        onReset={resetFilters}
        zones={map.zones}
        view={view}
        onViewChange={setView}
      />

      <p className="text-sm text-muted-foreground">
        {filtered.length === nades.length
          ? `${nades.length} гранат`
          : `${filtered.length} из ${nades.length}`}
      </p>

      {filtered.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          Ничего не найдено. Попробуй ослабить фильтры.
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((nade) => (
            <NadeCard
              key={nade.id}
              nade={nade}
              onClick={() => openNade(nade.id)}
              learned={isLearned(nade.id)}
              onToggleLearned={() => toggle(nade.id)}
              zoneLabel={zoneLabels.get(nade.zone)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((nade) => (
            <NadeListItem
              key={nade.id}
              nade={nade}
              onClick={() => openNade(nade.id)}
              learned={isLearned(nade.id)}
              onToggleLearned={() => toggle(nade.id)}
              zoneLabel={zoneLabels.get(nade.zone)}
            />
          ))}
        </div>
      )}

      <NadeModal
        nade={activeNade}
        open={!!activeNade}
        onClose={closeNade}
        onPrev={goPrev}
        onNext={goNext}
        hasPrev={activeIndex > 0}
        hasNext={activeIndex !== -1 && activeIndex < filtered.length - 1}
        learned={activeNade ? isLearned(activeNade.id) : false}
        onToggleLearned={() => activeNade && toggle(activeNade.id)}
        withSetang={withSetang}
        onToggleSetang={() => setWithSetang((v) => !v)}
        zoneLabel={activeNade ? zoneLabels.get(activeNade.zone) : undefined}
        outsideFilters={!!activeNade && activeIndex === -1}
      />
    </div>
  )
}

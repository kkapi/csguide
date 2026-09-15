import { Link2, ListFilter, Search, SlidersHorizontal, X } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import {
  NADE_PURPOSE_LABELS,
  NADE_PURPOSES,
  NADE_TYPE_LABELS,
  NADE_TYPES,
  type NadeZone,
  SIDE_LABELS,
  SIDES,
} from '@/data/types'
import {
  countActiveFilters,
  type NadeFilters as Filters,
  toggleIn,
} from '@/features/nades/filters'
import { copyToClipboard } from '@/lib/clipboard'
import { cn } from '@/lib/utils'

import { type NadeViewMode, NadeViewToggle } from './NadeViewToggle'

function Chip({
  active,
  onClick,
  children,
  className,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full border px-3 py-1 text-sm transition-colors',
        active
          ? 'border-primary bg-primary/15 font-medium text-primary'
          : 'border-border text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground',
        className,
      )}
    >
      {children}
    </button>
  )
}

/** Переключатель с одним выбранным значением и пунктом «Все». */
function Segmented<T extends string>({
  value,
  options,
  onChange,
  allLabel = 'Все',
}: {
  value: T | null
  options: { value: T; label: string }[]
  onChange: (v: T | null) => void
  allLabel?: string
}) {
  return (
    <div className="inline-flex shrink-0 rounded-md border border-border p-0.5">
      {[{ value: null, label: allLabel }, ...options].map((opt) => (
        <button
          key={opt.label}
          type="button"
          onClick={() => onChange(opt.value as T | null)}
          aria-pressed={value === opt.value}
          className={cn(
            'rounded px-2.5 py-1 text-sm transition-colors',
            value === opt.value
              ? 'bg-primary/15 font-medium text-primary'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

interface NadeFiltersProps {
  filters: Filters
  onChange: (f: Filters) => void
  onReset: () => void
  zones: NadeZone[]
  view: NadeViewMode
  onViewChange: (v: NadeViewMode) => void
}

export function NadeFilters({
  filters,
  onChange,
  onReset,
  zones,
  view,
  onViewChange,
}: NadeFiltersProps) {
  const [showPurpose, setShowPurpose] = useState(filters.purposes.length > 0)
  const [sheetOpen, setSheetOpen] = useState(false)
  const active = countActiveFilters(filters)

  const typeChips = NADE_TYPES.map((type) => (
    <Chip
      key={type}
      active={filters.types.includes(type)}
      onClick={() => onChange({ ...filters, types: toggleIn(filters.types, type) })}
    >
      {NADE_TYPE_LABELS[type]}
    </Chip>
  ))

  const zoneChips = zones.map((zone) => (
    <Chip
      key={zone.id}
      active={filters.zones.includes(zone.id)}
      onClick={() => onChange({ ...filters, zones: toggleIn(filters.zones, zone.id) })}
    >
      {zone.label}
    </Chip>
  ))

  const purposeChips = NADE_PURPOSES.map((p) => (
    <Chip
      key={p}
      active={filters.purposes.includes(p)}
      onClick={() => onChange({ ...filters, purposes: toggleIn(filters.purposes, p) })}
    >
      {NADE_PURPOSE_LABELS[p]}
    </Chip>
  ))

  const sideSegmented = (
    <Segmented
      value={filters.side}
      onChange={(side) => onChange({ ...filters, side })}
      options={SIDES.map((s) => ({ value: s, label: SIDE_LABELS[s] }))}
    />
  )

  const learnedSegmented = (
    <Segmented
      value={filters.learned}
      onChange={(learned) => onChange({ ...filters, learned })}
      options={[
        { value: 'yes' as const, label: 'Выучено' },
        { value: 'no' as const, label: 'Не выучено' },
      ]}
    />
  )

  const search = (
    <div className="relative min-w-0 flex-1">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Поиск: позиция, бросок, комментарий…"
        value={filters.q}
        onChange={(e) => onChange({ ...filters, q: e.target.value })}
        className="pl-9"
      />
      {filters.q && (
        <button
          type="button"
          onClick={() => onChange({ ...filters, q: '' })}
          aria-label="Очистить поиск"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )

  const resetButton = active > 0 && (
    <Button variant="ghost" size="sm" onClick={onReset} className="text-muted-foreground">
      <X className="size-3.5" />
      Сбросить
    </Button>
  )

  const copyLinkButton = (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => copyToClipboard(window.location.href, 'Ссылка скопирована')}
      className="text-muted-foreground"
      title="Скопировать ссылку с текущими фильтрами"
    >
      <Link2 className="size-3.5" />
      Ссылка
    </Button>
  )

  return (
    <div className="flex flex-col gap-3">
      {/* Мобильная раскладка: поиск, кнопка фильтров, вид */}
      <div className="flex items-center gap-2 md:hidden">
        {search}
        <NadeViewToggle value={view} onChange={onViewChange} />
      </div>
      <div className="flex items-center gap-2 md:hidden">
        <Button variant="outline" size="sm" onClick={() => setSheetOpen(true)}>
          <SlidersHorizontal className="size-4" />
          Фильтры
          {active > 0 && (
            <span className="ml-1 rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
              {active}
            </span>
          )}
        </Button>
        {resetButton}
        {copyLinkButton}
      </div>

      {/* Десктопная раскладка */}
      <div className="hidden items-center gap-2 md:flex">
        {search}
        {sideSegmented}
        {learnedSegmented}
        <NadeViewToggle value={view} onChange={onViewChange} />
      </div>
      <div className="hidden flex-wrap items-center gap-1.5 md:flex">
        {typeChips}
        <span className="mx-1 h-5 w-px bg-border" />
        {zoneChips}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowPurpose((v) => !v)}
          className={cn('ml-1 text-muted-foreground', showPurpose && 'text-foreground')}
        >
          <ListFilter className="size-3.5" />
          Назначение
          {filters.purposes.length > 0 && (
            <span className="ml-0.5 rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
              {filters.purposes.length}
            </span>
          )}
        </Button>
        <div className="ml-auto flex items-center">
          {resetButton}
          {copyLinkButton}
        </div>
      </div>
      {showPurpose && (
        <div className="hidden flex-wrap gap-1.5 md:flex">{purposeChips}</div>
      )}

      {/* Все группы фильтров на телефоне — в шторке снизу */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="max-h-[85svh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Фильтры</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-5 px-4 pb-8">
            <Group label="Сторона">{sideSegmented}</Group>
            <Group label="Прогресс">{learnedSegmented}</Group>
            <Group label="Тип">{typeChips}</Group>
            <Group label="Зона">{zoneChips}</Group>
            <Group label="Назначение">{purposeChips}</Group>
            {active > 0 && (
              <Button variant="outline" onClick={onReset}>
                <X className="size-4" />
                Сбросить всё
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

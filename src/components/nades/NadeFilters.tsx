import { Search, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Toggle } from '@/components/ui/toggle'
import { NADE_TAGS, type NadeTag, type NadeType } from '@/data/types'

import { NadeTypeBadge } from './NadeTypeBadge'

const ALL_TYPES: NadeType[] = ['smoke', 'flash', 'molotov', 'he']

export interface NadeFiltersState {
  search: string
  types: NadeType[]
  tags: NadeTag[]
}

interface NadeFiltersProps {
  filters: NadeFiltersState
  onChange: (filters: NadeFiltersState) => void
}

export function NadeFilters({ filters, onChange }: NadeFiltersProps) {
  const hasActive =
    filters.search !== '' || filters.types.length > 0 || filters.tags.length > 0

  function toggleType(type: NadeType) {
    const next = filters.types.includes(type)
      ? filters.types.filter((t) => t !== type)
      : [...filters.types, type]
    onChange({ ...filters, types: next })
  }

  function toggleTag(tag: NadeTag) {
    const next = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag]
    onChange({ ...filters, tags: next })
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Поиск */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
        <Input
          placeholder="Поиск по названию, позиции..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="pl-9"
        />
        {filters.search && (
          <button
            onClick={() => onChange({ ...filters, search: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Тип гранаты */}
      <div className="flex flex-wrap gap-1.5">
        {ALL_TYPES.map((type) => (
          <Toggle
            key={type}
            size="sm"
            variant="default"
            pressed={filters.types.includes(type)}
            onPressedChange={() => toggleType(type)}
            className="px-1 py-0.5 h-auto"
          >
            <NadeTypeBadge type={type} />
          </Toggle>
        ))}
      </div>

      {/* Теги */}
      <div className="flex flex-wrap gap-1.5">
        {NADE_TAGS.map((tag) => (
          <Toggle
            key={tag}
            size="sm"
            variant="outline"
            pressed={filters.tags.includes(tag)}
            onPressedChange={() => toggleTag(tag)}
          >
            {tag}
          </Toggle>
        ))}
      </div>

      {/* Сброс */}
      {hasActive && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange({ search: '', types: [], tags: [] })}
          className="self-start text-xs text-zinc-500 hover:text-zinc-300 px-0"
        >
          <X className="mr-1 h-3 w-3" />
          Сбросить фильтры
        </Button>
      )}
    </div>
  )
}

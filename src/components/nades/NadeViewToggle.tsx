import { LayoutGrid, List } from 'lucide-react'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

export type NadeViewMode = 'grid' | 'list'

interface NadeViewToggleProps {
  value: NadeViewMode
  onChange: (value: NadeViewMode) => void
}

export function NadeViewToggle({ value, onChange }: NadeViewToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => v && onChange(v as NadeViewMode)}
      variant="outline"
      size="sm"
    >
      <ToggleGroupItem value="grid" aria-label="Сетка">
        <LayoutGrid className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="Список">
        <List className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

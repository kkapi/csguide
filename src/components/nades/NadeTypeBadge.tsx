import { Badge } from '@/components/ui/badge'
import type { NadeType } from '@/data/types'
import { cn } from '@/lib/utils'

const TYPE_LABELS: Record<NadeType, string> = {
  smoke:   'Смок',
  flash:   'Флеш',
  molotov: 'Молотов',
  he:      'HE',
}

const TYPE_COLORS: Record<NadeType, string> = {
  smoke:   'bg-zinc-700 text-zinc-200 border-zinc-600',
  flash:   'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  molotov: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  he:      'bg-red-500/20 text-red-300 border-red-500/30',
}

interface NadeTypeBadgeProps {
  type: NadeType
  className?: string
}

export function NadeTypeBadge({ type, className }: NadeTypeBadgeProps) {
  return (
    <Badge className={cn(TYPE_COLORS[type], className)}>
      {TYPE_LABELS[type]}
    </Badge>
  )
}

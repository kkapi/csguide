import type { Nade } from '@/data/types'
import { nadeTitle } from '@/features/nades/nade'
import { cn } from '@/lib/utils'

import { LearnedToggle } from './LearnedToggle'
import { NadeTypeBadge } from './NadeTypeBadge'

interface NadeListItemProps {
  nade: Nade
  onClick: () => void
  learned: boolean
  onToggleLearned: () => void
  zoneLabel?: string
}

export function NadeListItem({
  nade,
  onClick,
  learned,
  onToggleLearned,
  zoneLabel,
}: NadeListItemProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5 transition-colors',
        learned ? 'border-emerald-600/40' : 'border-border hover:border-muted-foreground/40',
      )}
    >
      <LearnedToggle variant="icon" learned={learned} onToggle={onToggleLearned} />

      <button
        type="button"
        onClick={onClick}
        className="flex min-w-0 flex-1 items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <NadeTypeBadge type={nade.type} className="shrink-0" />

        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">{nadeTitle(nade)}</div>
          <div className="mt-0.5 truncate text-xs text-muted-foreground">
            {nade.from} → {nade.to}
          </div>
        </div>

        <div className="hidden shrink-0 items-center gap-1 text-[11px] text-muted-foreground/70 sm:flex">
          <span className="rounded bg-muted px-1.5 py-0.5 uppercase">{nade.side}</span>
          {zoneLabel && <span className="rounded bg-muted px-1.5 py-0.5">{zoneLabel}</span>}
        </div>

        <div className="hidden shrink-0 font-mono text-xs text-muted-foreground sm:block">
          {nade.throw}
        </div>
      </button>
    </div>
  )
}

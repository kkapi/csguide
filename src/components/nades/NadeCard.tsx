import { ImageIcon } from 'lucide-react'

import type { Nade } from '@/data/types'
import { nadeImageUrl, nadeTitle } from '@/features/nades/nade'
import { cn } from '@/lib/utils'

import { LearnedToggle } from './LearnedToggle'
import { NadeTypeBadge } from './NadeTypeBadge'

interface NadeCardProps {
  nade: Nade
  onClick: () => void
  learned: boolean
  onToggleLearned: () => void
  zoneLabel?: string
}

export function NadeCard({
  nade,
  onClick,
  learned,
  onToggleLearned,
  zoneLabel,
}: NadeCardProps) {
  return (
    // Обёртка div, а не button: внутри есть своя кнопка «выучено»,
    // а кнопка внутри кнопки — невалидная разметка.
    <div
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl border bg-card text-left transition-colors',
        learned ? 'border-emerald-600/40' : 'border-border hover:border-muted-foreground/40',
      )}
    >
      <button
        type="button"
        onClick={onClick}
        className="flex flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="aspect-video w-full overflow-hidden bg-muted">
          {nade.images[0] ? (
            <img
              src={nadeImageUrl(nade.images[0])}
              alt={nadeTitle(nade)}
              loading="lazy"
              decoding="async"
              className={cn(
                'size-full object-cover transition-transform duration-200 group-hover:scale-105',
                learned && 'opacity-70',
              )}
            />
          ) : (
            <div className="grid size-full place-items-center text-muted-foreground/40">
              <ImageIcon className="size-8" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5 p-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm leading-tight font-medium">{nadeTitle(nade)}</span>
            <NadeTypeBadge type={nade.type} className="shrink-0" />
          </div>

          <div className="text-xs text-muted-foreground">
            {nade.from} → {nade.to}
          </div>

          <div className="flex flex-wrap items-center gap-1 text-[11px] text-muted-foreground/70">
            <span className="rounded bg-muted px-1.5 py-0.5 uppercase">{nade.side}</span>
            {zoneLabel && <span className="rounded bg-muted px-1.5 py-0.5">{zoneLabel}</span>}
            <span className="ml-auto font-mono">{nade.throw}</span>
          </div>
        </div>
      </button>

      <LearnedToggle
        variant="icon"
        learned={learned}
        onToggle={onToggleLearned}
        className="absolute right-2 top-2"
      />
    </div>
  )
}

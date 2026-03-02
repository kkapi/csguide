import type { Nade } from '@/data/types'
import { cn } from '@/lib/utils'

import { NadeTypeBadge } from './NadeTypeBadge'

interface NadeListItemProps {
  nade: Nade
  onClick: () => void
}

export function NadeListItem({ nade, onClick }: NadeListItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group flex w-full items-center gap-4 rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-left',
        'hover:border-zinc-600 hover:bg-zinc-900 transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500',
      )}
    >
      <NadeTypeBadge type={nade.type} className="shrink-0" />

      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-zinc-100">{nade.title}</div>
        <div className="mt-0.5 text-xs text-zinc-500">
          {nade.from} → {nade.to}
        </div>
      </div>

      <div className="hidden shrink-0 flex-wrap justify-end gap-1 sm:flex">
        {nade.tags.map((tag) => (
          <span
            key={tag}
            className="rounded px-1.5 py-0.5 text-xs bg-zinc-800 text-zinc-400"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="shrink-0 text-xs text-zinc-600 font-mono">{nade.throw}</div>
    </button>
  )
}

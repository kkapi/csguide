import { ImageIcon } from 'lucide-react'

import type { Nade } from '@/data/types'
import { cn } from '@/lib/utils'

import { NadeTypeBadge } from './NadeTypeBadge'

interface NadeCardProps {
  nade: Nade
  onClick: () => void
}

export function NadeCard({ nade, onClick }: NadeCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/60 text-left',
        'hover:border-zinc-600 hover:bg-zinc-900 transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500',
      )}
    >
      {/* Превью изображения */}
      <div className="aspect-video w-full overflow-hidden rounded-t-xl bg-zinc-800/60">
        {nade.images[0] ? (
          <img
            src={nade.images[0]}
            alt={nade.title}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-600">
            <ImageIcon className="h-8 w-8" />
          </div>
        )}
      </div>

      {/* Инфо */}
      <div className="flex flex-col gap-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-medium text-zinc-100 leading-tight">
            {nade.title}
          </span>
          <NadeTypeBadge type={nade.type} />
        </div>

        <div className="text-xs text-zinc-500">
          {nade.from} → {nade.to}
        </div>

        {nade.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {nade.tags.map((tag) => (
              <span
                key={tag}
                className="rounded px-1.5 py-0.5 text-xs bg-zinc-800 text-zinc-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  )
}

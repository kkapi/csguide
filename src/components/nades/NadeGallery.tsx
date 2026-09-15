import { ChevronLeft, ChevronRight, ImageIcon, Maximize2 } from 'lucide-react'
import { useState } from 'react'

import { ImageZoom } from '@/components/ImageZoom'
import type { Nade } from '@/data/types'
import { nadeImageUrl, nadeTitle } from '@/features/nades/nade'
import { cn } from '@/lib/utils'

/**
 * Порядок кадров: первый — результат броска, дальше объяснение, как кидать.
 * Открываемся с первого: в тренировке это вопрос («какой смок?»), а листание
 * вправо — ответ.
 */
interface NadeGalleryProps {
  nade: Nade
  className?: string
}

export function NadeGallery({ nade, className }: NadeGalleryProps) {
  const [index, setIndex] = useState(0)
  const [zoomOpen, setZoomOpen] = useState(false)

  // Смена гранаты возвращает галерею в начало.
  const [shownId, setShownId] = useState(nade.id)
  if (nade.id !== shownId) {
    setShownId(nade.id)
    setIndex(0)
  }

  const images = nade.images
  const current = images[index]

  if (!current) {
    return (
      <div className={cn('grid place-items-center bg-black text-muted-foreground/40', className)}>
        <ImageIcon className="size-12" />
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden bg-black', className)}>
      <button
        type="button"
        onClick={() => setZoomOpen(true)}
        className="size-full cursor-zoom-in"
        aria-label="Открыть во весь экран"
      >
        <img
          src={nadeImageUrl(current)}
          alt={`${nadeTitle(nade)} — кадр ${index + 1}`}
          className="size-full object-contain"
        />
      </button>

      {images.length > 1 && (
        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white/80">
          {index === 0 ? 'Результат' : 'Как кидать'}
        </span>
      )}

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            aria-label="Предыдущий кадр"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/75 disabled:pointer-events-none disabled:opacity-0"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => Math.min(images.length - 1, i + 1))}
            disabled={index === images.length - 1}
            aria-label="Следующий кадр"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/75 disabled:pointer-events-none disabled:opacity-0"
          >
            <ChevronRight className="size-5" />
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/55 px-3 py-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={i === 0 ? 'Результат' : `Как кидать, кадр ${i + 1}`}
                className={cn(
                  'size-1.5 rounded-full transition-colors',
                  i === index ? 'bg-white' : 'bg-white/40 hover:bg-white/70',
                )}
              />
            ))}
            <span className="ml-1 text-[11px] tabular-nums text-white/70">
              {index + 1}/{images.length}
            </span>
          </div>
        </>
      )}

      <button
        type="button"
        onClick={() => setZoomOpen(true)}
        aria-label="Открыть во весь экран"
        className="absolute bottom-3 right-3 rounded-full bg-black/55 p-2 text-white/80 transition hover:bg-black/80 hover:text-white"
      >
        <Maximize2 className="size-4" />
      </button>

      <ImageZoom
        src={nadeImageUrl(current)}
        alt={nadeTitle(nade)}
        open={zoomOpen}
        onClose={() => setZoomOpen(false)}
      />
    </div>
  )
}

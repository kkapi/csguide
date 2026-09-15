import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { ConsoleCommand } from '@/components/ConsoleCommand'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import type { Nade } from '@/data/types'
import { buildCommand, nadeTitle } from '@/features/nades/nade'
import { copyToClipboard } from '@/lib/clipboard'
import { cn } from '@/lib/utils'

import { LearnedToggle } from './LearnedToggle'
import { NadeGallery } from './NadeGallery'
import { NadeTypeBadge } from './NadeTypeBadge'

/**
 * Ширину диалога считаем от доступной высоты: `(92dvh - 15rem) * 16/9`, где
 * 15rem — полоса с деталями. Тогда картинка остаётся 16:9, а комментарий,
 * команда и кнопки листания всегда на первом экране.
 *
 * Классы записаны целиком: Tailwind сканирует исходный текст и не видит
 * имена классов, собранные из кусков.
 */
interface NadeModalProps {
  nade: Nade | null
  open: boolean
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
  learned: boolean
  onToggleLearned: () => void
  withSetang: boolean
  onToggleSetang: () => void
  zoneLabel?: string
  /** Открыта по ссылке, но под текущие фильтры не подходит. */
  outsideFilters?: boolean
}

export function NadeModal({
  nade,
  open,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  learned,
  onToggleLearned,
  withSetang,
  onToggleSetang,
  zoneLabel,
  outsideFilters,
}: NadeModalProps) {
  const [copied, setCopied] = useState(false)

  const command = nade ? buildCommand(nade, withSetang) : ''

  // Копируем сразу при открытии и при листании — чтобы не нужно было
  // отдельно тыкать «скопировать» на каждой гранате (п.11).
  useEffect(() => {
    if (!open || !command) return
    let alive = true
    let timer: ReturnType<typeof setTimeout> | undefined
    void copyToClipboard(command, 'Команда скопирована').then((ok) => {
      if (!alive || !ok) return
      setCopied(true)
      timer = setTimeout(() => setCopied(false), 1600)
    })
    return () => {
      alive = false
      if (timer) clearTimeout(timer)
    }
  }, [open, command])

  const copyManually = useCallback(() => {
    void copyToClipboard(command, 'Команда скопирована')
  }, [command])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && hasPrev) onPrev()
      else if (e.key === 'ArrowRight' && hasNext) onNext()
      else if (e.key === 'l' || e.key === 'L' || e.key === 'д' || e.key === 'Д') {
        onToggleLearned()
      } else if (e.key === 'c' || e.key === 'C' || e.key === 'с' || e.key === 'С') {
        copyManually()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, hasPrev, hasNext, onPrev, onNext, onToggleLearned, copyManually])

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className={cn(
          'w-[96vw] max-w-[min(96vw,1600px,calc((92dvh-15rem)*16/9))]',
          'sm:max-w-[min(96vw,1600px,calc((92dvh-15rem)*16/9))]',
          'flex max-h-[92dvh] flex-col gap-0 overflow-hidden p-0',
          'max-sm:h-dvh max-sm:max-h-dvh max-sm:w-screen max-sm:max-w-none max-sm:rounded-none',
          // Крестик лежит поверх чёрной картинки, поэтому он всегда белый
          // на тёмной плашке — иначе на светлой теме его не видно.
          '[&_[data-slot=dialog-close]]:top-3 [&_[data-slot=dialog-close]]:right-3',
          '[&_[data-slot=dialog-close]]:rounded-full [&_[data-slot=dialog-close]]:bg-black/55',
          '[&_[data-slot=dialog-close]]:p-2 [&_[data-slot=dialog-close]]:text-white',
          '[&_[data-slot=dialog-close]]:opacity-100 [&_[data-slot=dialog-close]]:hover:bg-black/80',
        )}
      >
        <DialogTitle className="sr-only">{nade ? nadeTitle(nade) : ''}</DialogTitle>

        {nade && (
          <>
            <NadeGallery
              nade={nade}
              preload
              className="aspect-video w-full shrink-0 max-sm:aspect-auto max-sm:min-h-0 max-sm:flex-1"
            />

            {/* flex-1 + overflow-y-auto: длинный комментарий скроллится внутри
                полосы, а не выпихивает кнопки за край диалога. */}
            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto border-t p-4 max-sm:flex-none max-sm:shrink-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pr-8">
                <NadeTypeBadge type={nade.type} />
                <h2 className="text-base leading-tight font-semibold">{nadeTitle(nade)}</h2>
                <span className="text-sm text-muted-foreground">
                  {nade.from} → {nade.to}
                </span>
                <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                  {nade.throw}
                </span>
                <span className="rounded bg-muted px-1.5 py-0.5 text-xs uppercase">
                  {nade.side}
                </span>
                {zoneLabel && (
                  <span className="rounded bg-muted px-1.5 py-0.5 text-xs">{zoneLabel}</span>
                )}

                <div className="ml-auto flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={onPrev} disabled={!hasPrev}>
                    <ChevronLeft className="size-4" />
                    <span className="max-sm:sr-only">Пред</span>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={onNext} disabled={!hasNext}>
                    <span className="max-sm:sr-only">След</span>
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>

              {nade.note && (
                <p className="text-base leading-relaxed text-foreground/85">{nade.note}</p>
              )}

              {outsideFilters && (
                <p className="text-sm text-amber-500">
                  Эта граната не попадает под текущие фильтры — листание её пропустит.
                </p>
              )}

              {/* На узком экране контролы уходят под команду отдельной строкой:
                  втроём в ряд они не помещаются. На широком `sm:contents`
                  растворяет обёртку, и кнопки встают в один рост с командой. */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
                <ConsoleCommand
                  text={command}
                  copied={copied}
                  className="min-w-0 flex-1 p-3 pr-14 text-xs sm:text-sm"
                />
                <div className="flex items-center gap-2 sm:contents">
                  <button
                    type="button"
                    onClick={onToggleSetang}
                    aria-pressed={withSetang}
                    title="Добавлять ли в команду setang, который выставляет прицел"
                    className={cn(
                      'inline-flex shrink-0 items-center justify-center rounded-md border px-2.5',
                      'gap-1.5 py-2 text-xs transition-colors sm:py-0',
                      withSetang
                        ? 'border-primary bg-primary/15 text-primary'
                        : 'border-border text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {withSetang && <Check className="size-3.5" />}
                    Установить прицел
                  </button>
                  <LearnedToggle
                    learned={learned}
                    onToggle={onToggleLearned}
                    className="shrink-0 py-1.5 sm:py-0"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

import { X, ZoomIn } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

const MIN_SCALE = 1
const MAX_SCALE = 6
const DOUBLE_TAP_SCALE = 2.5
/** Насколько палец может сместиться, чтобы касание всё ещё считалось тапом. */
const TAP_SLOP = 10
/** Максимальный интервал между тапами, мс. */
const DOUBLE_TAP_MS = 300

interface Transform {
  scale: number
  x: number
  y: number
}

const IDENTITY: Transform = { scale: 1, x: 0, y: 0 }

interface ImageZoomProps {
  src: string
  alt: string
  open: boolean
  onClose: () => void
}

/**
 * Полноэкранный просмотр с зумом: колесо и двойной клик на десктопе, пинч и
 * двойной тап на телефоне. Жесты свои — тут нужен ровно pan/zoom, а не целая
 * библиотека.
 *
 * Обязательно диалог Radix, а не портал в body: пока открыта модалка гранаты,
 * Radix держит на body `pointer-events: none` и возвращает `auto` только
 * своему верхнему слою. Портал-сосед просто не получал бы событий.
 */
export function ImageZoom({ src, alt, open, onClose }: ImageZoomProps) {
  const [t, setT] = useState<Transform>(IDENTITY)
  const imgRef = useRef<HTMLImageElement>(null)
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const pinchStart = useRef<{ dist: number; scale: number } | null>(null)
  const tapStart = useRef<{ x: number; y: number } | null>(null)
  const lastTap = useRef(0)

  // Сброс при открытии и при смене картинки — иначе следующая откроется
  // приближённой к случайному месту от предыдущей. Правим в рендере, а не
  // эффектом: иначе первый кадр успевал бы отрисоваться со старым зумом.
  const view = `${open}|${src}`
  const [shownView, setShownView] = useState(view)
  if (view !== shownView) {
    setShownView(view)
    setT(IDENTITY)
  }

  // Esc и блокировку прокрутки берёт на себя Radix. Остаются стрелки: пока
  // разглядываешь пиксель, они не должны листать гранаты под зумом.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') e.stopPropagation()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [open])

  /** Держит картинку в пределах экрана: за край видно не больше половины. */
  const clamp = useCallback((next: Transform): Transform => {
    const img = imgRef.current
    if (!img) return next
    const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, next.scale))
    const maxX = Math.max(0, (img.offsetWidth * scale - img.offsetWidth) / 2)
    const maxY = Math.max(0, (img.offsetHeight * scale - img.offsetHeight) / 2)
    return {
      scale,
      x: Math.min(maxX, Math.max(-maxX, next.x)),
      y: Math.min(maxY, Math.max(-maxY, next.y)),
    }
  }, [])

  /** Меняет масштаб так, чтобы точка (px, py) осталась под пальцем/курсором. */
  const zoomAt = useCallback(
    (nextScale: number, px: number, py: number) => {
      setT((prev) => {
        const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, nextScale))
        if (scale === MIN_SCALE) return IDENTITY
        return clamp({
          scale,
          x: px - ((px - prev.x) * scale) / prev.scale,
          y: py - ((py - prev.y) * scale) / prev.scale,
        })
      })
    },
    [clamp],
  )

  const relative = (e: { clientX: number; clientY: number }) => {
    const img = imgRef.current
    if (!img) return { x: 0, y: 0 }
    const r = img.getBoundingClientRect()
    return { x: e.clientX - (r.left + r.width / 2), y: e.clientY - (r.top + r.height / 2) }
  }

  const onPointerDown = (e: React.PointerEvent) => {
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointers.current.size === 1) {
      tapStart.current = { x: e.clientX, y: e.clientY }
    } else if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()]
      pinchStart.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), scale: t.scale }
      // Начался пинч — одиночным касанием это уже не будет.
      tapStart.current = null
    }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId)
    if (!prev) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

    if (pointers.current.size === 2 && pinchStart.current) {
      const [a, b] = [...pointers.current.values()]
      const dist = Math.hypot(a.x - b.x, a.y - b.y)
      const mid = relative({ clientX: (a.x + b.x) / 2, clientY: (a.y + b.y) / 2 })
      zoomAt((pinchStart.current.scale * dist) / pinchStart.current.dist, mid.x, mid.y)
      return
    }

    if (pointers.current.size === 1 && t.scale > MIN_SCALE) {
      const dx = e.clientX - prev.x
      const dy = e.clientY - prev.y
      setT((cur) => clamp({ ...cur, x: cur.x + dx, y: cur.y + dy }))
    }
  }

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId)
    if (pointers.current.size < 2) pinchStart.current = null

    // Двойной тап: у touch нет dblclick, интервал считаем сами. Проверка живёт
    // во всплытии, а не в capture: в capture указатель ещё в карте, и условие
    // «все пальцы подняты» никогда не выполнялось бы.
    const start = tapStart.current
    tapStart.current = null
    if (e.pointerType === 'mouse' || pointers.current.size > 0 || !start) return
    // Смазанное касание — это был жест панорамы, а не тап.
    if (Math.hypot(e.clientX - start.x, e.clientY - start.y) > TAP_SLOP) return

    // Берём время из самого события, а не Date.now(): оно точнее для жестов
    // и не тянет за собой нечистый вызов в теле компонента.
    if (e.timeStamp - lastTap.current < DOUBLE_TAP_MS) {
      toggleZoom(e)
      lastTap.current = 0
    } else {
      lastTap.current = e.timeStamp
    }
  }

  const onWheel = (e: React.WheelEvent) => {
    const p = relative(e)
    zoomAt(t.scale * (e.deltaY < 0 ? 1.15 : 1 / 1.15), p.x, p.y)
  }

  const toggleZoom = (e: { clientX: number; clientY: number }) => {
    const p = relative(e)
    zoomAt(t.scale > MIN_SCALE ? MIN_SCALE : DOUBLE_TAP_SCALE, p.x, p.y)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        showCloseButton={false}
        // Клик мимо картинки закрывает просмотр. Сам DialogContent занимает весь
        // экран, поэтому «снаружи» для Radix тут нет — проверяем цель сами.
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
        className={cn(
          // Растягиваем на весь экран: у DialogContent по умолчанию центрирование
          // трансформом, ограничение ширины, скругление и отступы — всё лишнее.
          'inset-0 top-0 left-0 flex h-dvh w-screen max-w-none translate-x-0 translate-y-0',
          'items-center justify-center gap-0 rounded-none border-0 bg-black/95 p-0',
          'select-none sm:max-w-none',
        )}
      >
        <DialogTitle className="sr-only">{alt}</DialogTitle>

        <button
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute top-3 right-3 z-10 rounded-full bg-black/60 p-2 text-white/80 hover:bg-black/80 hover:text-white"
        >
          <X className="size-5" />
        </button>

        {t.scale === MIN_SCALE && (
          <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white/70">
            <ZoomIn className="size-3.5" />
            Двойной тап или колесо — приблизить
          </div>
        )}

        <img
          ref={imgRef}
          src={src}
          alt={alt}
          draggable={false}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onWheel={onWheel}
          onDoubleClick={toggleZoom}
          style={{
            transform: `translate3d(${t.x}px, ${t.y}px, 0) scale(${t.scale})`,
            touchAction: 'none',
            cursor: t.scale > MIN_SCALE ? 'grab' : 'zoom-in',
          }}
          className="max-h-full max-w-full object-contain"
        />
      </DialogContent>
    </Dialog>
  )
}

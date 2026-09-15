import { X, ZoomIn } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const MIN_SCALE = 1
const MAX_SCALE = 6
const DOUBLE_TAP_SCALE = 2.5

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
 * двойной тап на телефоне. Без внешних зависимостей — тут нужен ровно pan/zoom,
 * а не вся библиотека жестов.
 *
 * Это не Radix Dialog: зум открывается изнутри модалки гранаты, а вложенные
 * диалоги дерутся за фокус и за блокировку скролла.
 */
export function ImageZoom({ src, alt, open, onClose }: ImageZoomProps) {
  const [t, setT] = useState<Transform>(IDENTITY)
  const imgRef = useRef<HTMLImageElement>(null)
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const pinchStart = useRef<{ dist: number; scale: number } | null>(null)
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

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        // Пока разглядываешь пиксель, стрелки не должны листать гранаты под зумом.
        e.stopPropagation()
      }
    }
    // capture на window: срабатывает раньше всех — и Esc закрывает зум,
    // а не модалку гранаты под ним.
    window.addEventListener('keydown', onKey, true)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey, true)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

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
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()]
      pinchStart.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), scale: t.scale }
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
  }

  const onWheel = (e: React.WheelEvent) => {
    const p = relative(e)
    zoomAt(t.scale * (e.deltaY < 0 ? 1.15 : 1 / 1.15), p.x, p.y)
  }

  const toggleZoom = (e: { clientX: number; clientY: number }) => {
    const p = relative(e)
    zoomAt(t.scale > MIN_SCALE ? MIN_SCALE : DOUBLE_TAP_SCALE, p.x, p.y)
  }

  /** Двойной тап: у touch нет dblclick, приходится считать интервал руками. */
  const onPointerUpCapture = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' || pointers.current.size > 0) return
    const now = Date.now()
    if (now - lastTap.current < 300) {
      toggleZoom(e)
      lastTap.current = 0
    } else {
      lastTap.current = now
    }
  }

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 select-none"
      onPointerDown={(e) => {
        // Клик мимо картинки закрывает просмотр.
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <button
        onClick={onClose}
        aria-label="Закрыть"
        className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-2 text-white/80 hover:bg-black/80 hover:text-white"
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
        onPointerUpCapture={onPointerUpCapture}
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
    </div>,
    document.body,
  )
}

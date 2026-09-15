import { Check, CircleCheck } from 'lucide-react'

import { cn } from '@/lib/utils'

interface LearnedToggleProps {
  learned: boolean
  onToggle: () => void
  /** `icon` — компактная галочка для карточки в сетке. */
  variant?: 'full' | 'icon'
  className?: string
}

/**
 * Не чекбокс: отметка «выучено» — это действие, которое хочется нажимать
 * быстро и видеть результат цветом, а не квадратиком со стандартным состоянием.
 */
export function LearnedToggle({
  learned,
  onToggle,
  variant = 'full',
  className,
}: LearnedToggleProps) {
  const label = learned ? 'Выучена' : 'Отметить выученной'

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onToggle()
        }}
        aria-label={label}
        title={label}
        aria-pressed={learned}
        className={cn(
          'grid size-7 place-items-center rounded-full border backdrop-blur transition-colors',
          learned
            ? 'border-emerald-500/50 bg-emerald-500/90 text-white'
            : 'border-white/25 bg-black/50 text-white/60 hover:border-white/50 hover:text-white',
          className,
        )}
      >
        <Check className="size-4" strokeWidth={3} />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={learned}
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
        learned
          ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-500'
          : 'border-border text-muted-foreground hover:border-emerald-500/40 hover:text-emerald-500',
        className,
      )}
    >
      <CircleCheck className={cn('size-4', learned && 'fill-emerald-500/25')} />
      {learned ? 'Выучена' : 'Выучить'}
    </button>
  )
}

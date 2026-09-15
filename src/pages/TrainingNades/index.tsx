import { Check, RotateCcw, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { ConsoleCommand } from '@/components/ConsoleCommand'
import { NadeGallery } from '@/components/nades/NadeGallery'
import { NadeTypeBadge } from '@/components/nades/NadeTypeBadge'
import { Button } from '@/components/ui/button'
import { maps } from '@/data/maps'
import {
  type MapSlug,
  type Nade,
  NADE_TYPE_LABELS,
  NADE_TYPES,
  type NadeType,
} from '@/data/types'
import { toggleIn } from '@/features/nades/filters'
import { buildCommand, nadeTitle } from '@/features/nades/nade'
import {
  advance,
  createSession,
  DEFAULT_TRAINING_OPTIONS,
  isFinished,
  repeatLater,
  selectTrainingNades,
  TRAINING_COUNTS,
  TRAINING_POOL_LABELS,
  trainingCandidates,
  type TrainingCount,
  type TrainingOptions,
  type TrainingPool,
  type TrainingSession,
} from '@/features/nades/training'
import { useLearnedNades } from '@/features/nades/useLearnedNades'
import { copyToClipboard } from '@/lib/clipboard'
import { cn } from '@/lib/utils'
import { useLocalStorage } from '@/utils/useLocalStorage'

const SESSION_KEY = 'csguide.training.session'

const AVAILABLE_MAPS = Object.values(maps).filter((m) => m.nades.length > 0)

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full border px-3 py-1.5 text-sm transition-colors',
        active
          ? 'border-primary bg-primary/15 font-medium text-primary'
          : 'border-border text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground',
      )}
    >
      {children}
    </button>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

export function TrainingNades() {
  const { isLearned, markLearned } = useLearnedNades()
  const [options, setOptions] = useLocalStorage<TrainingOptions>(
    'csguide.training.options',
    DEFAULT_TRAINING_OPTIONS,
  )
  const [withSetang, setWithSetang] = useLocalStorage('csguide.nades.setang', true)
  const [copied, setCopied] = useState(false)

  // Сессия переживает F5 — alt-tab из игры и случайная перезагрузка не должны
  // обнулять прогресс. sessionStorage, а не localStorage: закрыл вкладку — забыли.
  const [session, setSession] = useState<TrainingSession | null>(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY)
      return raw ? (JSON.parse(raw) as TrainingSession) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    try {
      if (session) sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
      else sessionStorage.removeItem(SESSION_KEY)
    } catch {
      // Приватный режим — сессия просто не переживёт перезагрузку.
    }
  }, [session])

  const allNades = useMemo(() => AVAILABLE_MAPS.flatMap((m) => m.nades), [])
  const byId = useMemo(() => new Map(allNades.map((n) => [n.id, n])), [allNades])

  const candidates = useMemo(
    () => trainingCandidates(allNades, options, isLearned),
    [allNades, options, isLearned],
  )

  const current: Nade | null = session?.queue[0] ? (byId.get(session.queue[0]) ?? null) : null
  const command = current ? buildCommand(current, withSetang) : ''

  // Команда текущей гранаты всегда в буфере — в тренировке это основное действие.
  useEffect(() => {
    if (!command) return
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
  }, [command])

  const start = useCallback(() => {
    const picked = selectTrainingNades(allNades, options, isLearned)
    if (picked.length > 0) setSession(createSession(picked))
  }, [allNades, options, isLearned])

  const onLearned = useCallback(() => {
    if (!current) return
    markLearned(current.id)
    setSession((s) => (s ? advance(s, true) : s))
  }, [current, markLearned])

  const onDrop = useCallback(() => setSession((s) => (s ? advance(s, false) : s)), [])
  const onRepeat = useCallback(() => setSession((s) => (s ? repeatLater(s) : s)), [])

  const inSession = !!session && !isFinished(session)

  useEffect(() => {
    if (!inSession) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '1') onRepeat()
      else if (e.key === '2') onLearned()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [inSession, onRepeat, onLearned])

  // ── Настройка ───────────────────────────────────────────────────────────
  if (!session) {
    return (
      <div className="flex max-w-2xl flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Тренировка гранат</h1>
          <p className="mt-1 text-muted-foreground">
            Случайная выборка. Сначала показывается результат броска — вспомни, как
            он кидается, и листай дальше, чтобы проверить себя. Команда текущей
            гранаты всегда лежит в буфере.
          </p>
        </div>

        <Field label="Карты">
          {AVAILABLE_MAPS.map((m) => (
            <Chip
              key={m.slug}
              active={options.maps.includes(m.slug)}
              onClick={() =>
                setOptions((o) => ({ ...o, maps: toggleIn(o.maps, m.slug as MapSlug) }))
              }
            >
              {m.label}
            </Chip>
          ))}
        </Field>

        <Field label="Что тренируем">
          {(Object.keys(TRAINING_POOL_LABELS) as TrainingPool[]).map((pool) => (
            <Chip
              key={pool}
              active={options.pool === pool}
              onClick={() => setOptions((o) => ({ ...o, pool }))}
            >
              {TRAINING_POOL_LABELS[pool]}
            </Chip>
          ))}
        </Field>

        <Field label="Тип гранаты">
          {NADE_TYPES.map((type) => (
            <Chip
              key={type}
              active={options.types.includes(type)}
              onClick={() =>
                setOptions((o) => ({ ...o, types: toggleIn(o.types, type as NadeType) }))
              }
            >
              {NADE_TYPE_LABELS[type]}
            </Chip>
          ))}
        </Field>

        <Field label="Сколько">
          {TRAINING_COUNTS.map((count) => (
            <Chip
              key={String(count)}
              active={options.count === count}
              onClick={() => setOptions((o) => ({ ...o, count: count as TrainingCount }))}
            >
              {count === 'all' ? 'Все' : count}
            </Chip>
          ))}
        </Field>

        <div className="flex items-center gap-3">
          <Button size="lg" onClick={start} disabled={candidates.length === 0}>
            Начать
          </Button>
          <span className="text-sm text-muted-foreground">
            {candidates.length === 0
              ? 'Под эти настройки не подходит ни одна граната'
              : `доступно ${candidates.length}`}
          </span>
        </div>
      </div>
    )
  }

  // ── Итоги ───────────────────────────────────────────────────────────────
  if (isFinished(session)) {
    const learnedNow = session.learnedHere.map((id) => byId.get(id)).filter(Boolean) as Nade[]
    return (
      <div className="flex max-w-2xl flex-col gap-5">
        <h1 className="text-3xl font-bold tracking-tight">Подход пройден</h1>
        <p className="text-muted-foreground">
          Выучено:{' '}
          <span className="font-semibold text-foreground">{session.learnedHere.length}</span>{' '}
          из {session.total}
        </p>

        {learnedNow.length > 0 && (
          <ul className="flex flex-col gap-1.5">
            {learnedNow.map((nade) => (
              <li key={nade.id}>
                <Link
                  to={`/maps/${nade.map}/nades?nade=${nade.id}`}
                  className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors hover:border-muted-foreground/40"
                >
                  <Check className="size-4 shrink-0 text-emerald-500" />
                  <span className="truncate">{nadeTitle(nade)}</span>
                  <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                    {nade.from} → {nade.to}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap gap-2">
          <Button onClick={start}>Ещё подход</Button>
          <Button variant="outline" onClick={() => setSession(null)}>
            К настройкам
          </Button>
        </div>
      </div>
    )
  }

  // ── Сессия ──────────────────────────────────────────────────────────────
  const progress = session.total > 0 ? session.done.length / session.total : 0

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
          {session.done.length} / {session.total}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSession(null)}
          title="Завершить подход"
        >
          <X className="size-4" />
          <span className="sr-only">Завершить</span>
        </Button>
      </div>

      {current && (
        <>
          {/* Ширина от высоты экрана: картинка остаётся 16:9, а кнопки
              и комментарий помещаются без прокрутки. */}
          <NadeGallery
            nade={current}
            className="aspect-video w-full max-w-[calc(52dvh*16/9)] rounded-xl"
          />

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <NadeTypeBadge type={current.type} />
            <span className="font-semibold">{nadeTitle(current)}</span>
            <span className="text-sm text-muted-foreground">
              {current.from} → {current.to}
            </span>
            <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
              {current.throw}
            </span>
            {isLearned(current.id) && (
              <span className="rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-500">
                уже выучена
              </span>
            )}
          </div>

          {current.note && (
            <p className="max-w-3xl text-base leading-relaxed text-foreground/85">
              {current.note}
            </p>
          )}

          <div className="flex max-w-3xl items-stretch gap-2">
            <ConsoleCommand
              text={command}
              copied={copied}
              className="min-w-0 flex-1 p-3 pr-14 text-xs sm:text-sm"
            />
            <button
              type="button"
              onClick={() => setWithSetang((v) => !v)}
              aria-pressed={withSetang}
              title="Добавлять ли setang — команду, которая выставляет прицел"
              className={cn(
                'inline-flex shrink-0 items-center justify-center rounded-md border px-2.5',
                'font-mono text-xs transition-colors',
                withSetang
                  ? 'border-primary bg-primary/15 text-primary'
                  : 'border-border text-muted-foreground hover:text-foreground',
              )}
            >
              setang {withSetang ? 'вкл' : 'выкл'}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={onRepeat}
              disabled={session.queue.length < 2}
              title="Граната вернётся в конце подхода (1)"
            >
              <RotateCcw className="size-4" />
              Повторить позже
            </Button>
            <Button onClick={onLearned} title="Отметить выученной и убрать из подхода (2)">
              <Check className="size-4" />
              Выучил
            </Button>
            <Button
              variant="ghost"
              onClick={onDrop}
              className="text-muted-foreground"
              title="Убрать из подхода, не отмечая выученной"
            >
              Убрать
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            «Повторить позже» вернёт гранату в конец очереди — счётчик не сдвинется.
            «Выучил» и «Убрать» закрывают её и двигают прогресс.
          </p>
        </>
      )}
    </div>
  )
}

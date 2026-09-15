import type { MapSlug, Nade, NadeType } from '@/data/types'

export type TrainingPool = 'all' | 'learned' | 'unlearned'

export const TRAINING_POOL_LABELS: Record<TrainingPool, string> = {
  all: 'Все',
  learned: 'Выученные',
  unlearned: 'Невыученные',
}

export const TRAINING_COUNTS = [5, 10, 15, 'all'] as const
export type TrainingCount = (typeof TRAINING_COUNTS)[number]

export interface TrainingOptions {
  maps: MapSlug[]
  pool: TrainingPool
  types: NadeType[]
  count: TrainingCount
}

export const DEFAULT_TRAINING_OPTIONS: TrainingOptions = {
  maps: ['dust2'],
  pool: 'unlearned',
  types: [],
  count: 5,
}

/** Гранаты, подходящие под настройки, до ограничения по количеству. */
export function trainingCandidates(
  all: Nade[],
  opts: TrainingOptions,
  isLearned: (id: string) => boolean,
): Nade[] {
  return all.filter((n) => {
    if (opts.maps.length > 0 && !opts.maps.includes(n.map)) return false
    if (opts.types.length > 0 && !opts.types.includes(n.type)) return false
    if (opts.pool === 'learned' && !isLearned(n.id)) return false
    if (opts.pool === 'unlearned' && isLearned(n.id)) return false
    return true
  })
}

/** Fisher–Yates. `random` вынесен в аргумент, чтобы тесты были детерминированными. */
export function shuffle<T>(items: T[], random: () => number = Math.random): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export function selectTrainingNades(
  all: Nade[],
  opts: TrainingOptions,
  isLearned: (id: string) => boolean,
  random: () => number = Math.random,
): Nade[] {
  const pool = shuffle(trainingCandidates(all, opts, isLearned), random)
  return opts.count === 'all' ? pool : pool.slice(0, opts.count)
}

export interface TrainingSession {
  /** Ещё не пройденные id; первый — текущий. */
  queue: string[]
  /** Пройденные id в порядке прохождения. */
  done: string[]
  /** Отмеченные выученными именно в этой сессии. */
  learnedHere: string[]
  /** Сколько гранат было изначально — знаменатель прогресса. */
  total: number
}

export function createSession(nades: Nade[]): TrainingSession {
  return { queue: nades.map((n) => n.id), done: [], learnedHere: [], total: nades.length }
}

/** Завершить текущую гранату. `learned` — была ли отмечена выученной. */
export function advance(s: TrainingSession, learned: boolean): TrainingSession {
  const [current, ...rest] = s.queue
  if (!current) return s
  return {
    ...s,
    queue: rest,
    done: [...s.done, current],
    learnedHere: learned ? [...s.learnedHere, current] : s.learnedHere,
  }
}

/** Отложить текущую гранату в конец очереди — кнопка «Ещё раз». */
export function repeatLater(s: TrainingSession): TrainingSession {
  const [current, ...rest] = s.queue
  if (!current || rest.length === 0) return s
  return { ...s, queue: [...rest, current] }
}

export function isFinished(s: TrainingSession): boolean {
  return s.queue.length === 0
}

import { describe, expect, it } from 'vitest'

import { makeNade } from './testFixtures'
import {
  advance,
  createSession,
  DEFAULT_TRAINING_OPTIONS,
  isFinished,
  repeatLater,
  selectTrainingNades,
  shuffle,
  trainingCandidates,
  type TrainingOptions,
} from './training'

const nades = [
  makeNade({ id: 'a', map: 'dust2', type: 'smoke' }),
  makeNade({ id: 'b', map: 'dust2', type: 'flash' }),
  makeNade({ id: 'c', map: 'mirage', type: 'smoke' }),
  makeNade({ id: 'd', map: 'mirage', type: 'molotov' }),
]

const learnedSet = new Set(['a', 'c'])
const isLearned = (id: string) => learnedSet.has(id)

const opts = (patch: Partial<TrainingOptions> = {}): TrainingOptions => ({
  ...DEFAULT_TRAINING_OPTIONS,
  maps: ['dust2', 'mirage'],
  pool: 'all',
  types: [],
  count: 'all',
  ...patch,
})

describe('trainingCandidates', () => {
  it('берёт только выбранные карты', () => {
    expect(trainingCandidates(nades, opts({ maps: ['mirage'] }), isLearned).map((n) => n.id))
      .toEqual(['c', 'd'])
  })

  it('делит пул на выученные и невыученные', () => {
    expect(trainingCandidates(nades, opts({ pool: 'learned' }), isLearned).map((n) => n.id))
      .toEqual(['a', 'c'])
    expect(trainingCandidates(nades, opts({ pool: 'unlearned' }), isLearned).map((n) => n.id))
      .toEqual(['b', 'd'])
  })

  it('фильтрует по типу', () => {
    expect(trainingCandidates(nades, opts({ types: ['smoke'] }), isLearned).map((n) => n.id))
      .toEqual(['a', 'c'])
  })

  it('совмещает условия', () => {
    const got = trainingCandidates(
      nades,
      opts({ maps: ['dust2'], pool: 'unlearned', types: ['flash'] }),
      isLearned,
    )
    expect(got.map((n) => n.id)).toEqual(['b'])
  })
})

describe('selectTrainingNades', () => {
  it('ограничивает количество', () => {
    const many = Array.from({ length: 12 }, (_, i) => makeNade({ id: `n${i}` }))
    expect(selectTrainingNades(many, opts({ count: 5 }), isLearned, () => 0)).toHaveLength(5)
  })

  it('не падает, когда гранат меньше запрошенного', () => {
    const got = selectTrainingNades(nades, opts({ maps: ['dust2'], count: 10 }), isLearned, () => 0)
    expect(got).toHaveLength(2)
  })

  it('«Все» отдаёт весь пул', () => {
    expect(selectTrainingNades(nades, opts(), isLearned, () => 0)).toHaveLength(4)
  })
})

describe('shuffle', () => {
  it('сохраняет состав и не трогает исходный массив', () => {
    const input = [1, 2, 3, 4, 5]
    const out = shuffle(input, () => 0.5)
    expect([...out].sort()).toEqual(input)
    expect(input).toEqual([1, 2, 3, 4, 5])
  })
})

describe('сессия', () => {
  const session = createSession(nades.slice(0, 3))

  it('начинается с полной очереди', () => {
    expect(session.queue).toEqual(['a', 'b', 'c'])
    expect(session.total).toBe(3)
    expect(isFinished(session)).toBe(false)
  })

  it('«Выучил» переносит гранату в пройденные и запоминает её', () => {
    const next = advance(session, true)
    expect(next.queue).toEqual(['b', 'c'])
    expect(next.done).toEqual(['a'])
    expect(next.learnedHere).toEqual(['a'])
  })

  it('«Пропустить» не записывает гранату в выученные', () => {
    expect(advance(session, false).learnedHere).toEqual([])
  })

  it('«Ещё раз» отправляет гранату в конец очереди, не меняя прогресс', () => {
    const next = repeatLater(session)
    expect(next.queue).toEqual(['b', 'c', 'a'])
    expect(next.done).toEqual([])
  })

  it('«Ещё раз» на последней гранате ничего не меняет — иначе вечный цикл', () => {
    const last = { ...session, queue: ['c'] }
    expect(repeatLater(last)).toEqual(last)
  })

  it('заканчивается, когда очередь пуста', () => {
    const done = [true, true, true].reduce((s) => advance(s, true), session)
    expect(isFinished(done)).toBe(true)
    expect(done.done).toEqual(['a', 'b', 'c'])
  })
})

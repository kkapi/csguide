import type { Nade } from '@/data/types'

/** Минимальная граната для тестов: переопределяем только то, что проверяем. */
export function makeNade(patch: Partial<Nade> = {}): Nade {
  return {
    id: 'dd2-01',
    map: 'dust2',
    type: 'smoke',
    side: 't',
    from: 'суицид',
    to: 'мид двери',
    throw: 'LMB',
    setpos: 'setpos_exact -491.97 -228.04 0.44',
    setang: 'setang -25.76 86.79 0.00',
    zone: 'mid',
    purpose: ['default'],
    images: [],
    ...patch,
  }
}

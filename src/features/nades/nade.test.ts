import { describe, expect, it } from 'vitest'

import { buildCommand, nadeTitle } from './nade'
import { makeNade } from './testFixtures'

describe('buildCommand', () => {
  it('склеивает setpos и setang через точку с запятой', () => {
    expect(buildCommand(makeNade(), true)).toBe(
      'setpos_exact -491.97 -228.04 0.44;setang -25.76 86.79 0.00',
    )
  })

  it('без setang отдаёт только позицию — прицел остаётся как был', () => {
    expect(buildCommand(makeNade(), false)).toBe('setpos_exact -491.97 -228.04 0.44')
  })
})

describe('nadeTitle', () => {
  it('собирает заголовок из типа и точки прилёта', () => {
    expect(nadeTitle(makeNade())).toBe('Смок мид двери')
    expect(nadeTitle(makeNade({ type: 'molotov', to: 'шорт' }))).toBe('Молотов шорт')
  })

  it('свой заголовок имеет приоритет', () => {
    expect(nadeTitle(makeNade({ title: 'Смок окно инст' }))).toBe('Смок окно инст')
  })
})

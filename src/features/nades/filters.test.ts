import { describe, expect, it } from 'vitest'

import { countActiveFilters, EMPTY_FILTERS, matchesFilters, toggleIn } from './filters'
import { makeNade } from './testFixtures'

const never = () => false
const always = () => true

describe('matchesFilters', () => {
  const nade = makeNade({ type: 'flash', side: 'ct', zone: 'b', purpose: ['retake', 'paired'] })

  it('без фильтров пропускает всё', () => {
    expect(matchesFilters(nade, EMPTY_FILTERS, never)).toBe(true)
  })

  it('внутри типа работает ИЛИ', () => {
    const f = { ...EMPTY_FILTERS, types: ['flash' as const, 'he' as const] }
    expect(matchesFilters(nade, f, never)).toBe(true)
    expect(matchesFilters(makeNade({ type: 'smoke' }), f, never)).toBe(false)
  })

  it('фильтрует по стороне и зоне', () => {
    expect(matchesFilters(nade, { ...EMPTY_FILTERS, side: 'ct' }, never)).toBe(true)
    expect(matchesFilters(nade, { ...EMPTY_FILTERS, side: 't' }, never)).toBe(false)
    expect(matchesFilters(nade, { ...EMPTY_FILTERS, zones: ['b'] }, never)).toBe(true)
    expect(matchesFilters(nade, { ...EMPTY_FILTERS, zones: ['a', 'mid'] }, never)).toBe(false)
  })

  it('назначения требуются все сразу, а не любое из них', () => {
    const both = { ...EMPTY_FILTERS, purposes: ['retake' as const, 'paired' as const] }
    expect(matchesFilters(nade, both, never)).toBe(true)

    const onlyOne = makeNade({ purpose: ['retake'] })
    expect(matchesFilters(onlyOne, both, never)).toBe(false)
  })

  it('фильтрует по отметке «выучено»', () => {
    expect(matchesFilters(nade, { ...EMPTY_FILTERS, learned: 'yes' }, always)).toBe(true)
    expect(matchesFilters(nade, { ...EMPTY_FILTERS, learned: 'yes' }, never)).toBe(false)
    expect(matchesFilters(nade, { ...EMPTY_FILTERS, learned: 'no' }, never)).toBe(true)
    expect(matchesFilters(nade, { ...EMPTY_FILTERS, learned: 'no' }, always)).toBe(false)
  })

  it('поиск идёт по позициям, броску и комментарию без учёта регистра', () => {
    const n = makeNade({ from: 'темка', to: 'двери б', note: 'дочекать буст справа' })
    for (const q of ['ТЕМКА', 'двери', 'буст', 'LMB']) {
      expect(matchesFilters(n, { ...EMPTY_FILTERS, q }, never), q).toBe(true)
    }
    expect(matchesFilters(n, { ...EMPTY_FILTERS, q: 'титаник' }, never)).toBe(false)
  })

  it('пробелы в запросе не считаются фильтром', () => {
    expect(matchesFilters(nade, { ...EMPTY_FILTERS, q: '   ' }, never)).toBe(true)
  })
})

describe('countActiveFilters', () => {
  it('считает каждое выбранное значение', () => {
    expect(countActiveFilters(EMPTY_FILTERS)).toBe(0)
    expect(
      countActiveFilters({
        q: 'темка',
        types: ['smoke', 'flash'],
        side: 't',
        zones: ['b'],
        purposes: [],
        learned: 'no',
      }),
    ).toBe(6)
  })
})

describe('toggleIn', () => {
  it('добавляет и убирает значение', () => {
    expect(toggleIn(['a'], 'b')).toEqual(['a', 'b'])
    expect(toggleIn(['a', 'b'], 'a')).toEqual(['b'])
  })
})

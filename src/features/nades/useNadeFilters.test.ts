import { describe, expect, it } from 'vitest'

import { EMPTY_FILTERS, type NadeFilters } from './filters'
import { parseFilters, writeFilters } from './useNadeFilters'

const roundTrip = (f: NadeFilters) =>
  parseFilters(writeFilters(new URLSearchParams(), f))

describe('writeFilters', () => {
  it('не пишет пустые значения — чистая страница остаётся чистым URL', () => {
    expect(writeFilters(new URLSearchParams(), EMPTY_FILTERS).toString()).toBe('')
  })

  it('не трогает чужие параметры, в частности открытую гранату', () => {
    const sp = new URLSearchParams('nade=dd2-08')
    const out = writeFilters(sp, { ...EMPTY_FILTERS, side: 't' })
    expect(out.get('nade')).toBe('dd2-08')
    expect(out.get('side')).toBe('t')
  })

  it('убирает параметр, когда фильтр сняли', () => {
    const sp = new URLSearchParams('type=smoke&side=t')
    const out = writeFilters(sp, { ...EMPTY_FILTERS, side: 't' })
    expect(out.has('type')).toBe(false)
    expect(out.get('side')).toBe('t')
  })
})

describe('parseFilters', () => {
  it('переживает полный круг сериализации', () => {
    const filters: NadeFilters = {
      q: 'темка',
      types: ['smoke', 'flash'],
      side: 'ct',
      zones: ['b', 'mid'],
      purposes: ['retake', 'paired'],
      learned: 'no',
    }
    expect(roundTrip(filters)).toEqual(filters)
  })

  it('обрезает пробелы вокруг поискового запроса', () => {
    expect(roundTrip({ ...EMPTY_FILTERS, q: '  темка  ' }).q).toBe('темка')
  })

  it('игнорирует мусор в параметрах вместо того, чтобы падать', () => {
    const sp = new URLSearchParams('type=smoke,дичь&side=xx&learned=maybe&purpose=nope')
    expect(parseFilters(sp)).toEqual({
      q: '',
      types: ['smoke'],
      side: null,
      zones: [],
      purposes: [],
      learned: null,
    })
  })
})

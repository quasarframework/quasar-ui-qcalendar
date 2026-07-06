import { describe, expect, it } from 'vitest'

import { getColumnIndexes } from '../src/composables/useColumn'

describe('[QCALENDAR] column helpers', () => {
  it('creates split-column indexes from the configured start index', () => {
    expect(getColumnIndexes(3, 2)).toEqual([2, 3, 4])
    expect(getColumnIndexes('2', '5')).toEqual([5, 6])
  })

  it('returns an empty index list when split columns are disabled', () => {
    expect(getColumnIndexes(0, 4)).toEqual([])
    expect(getColumnIndexes('-1', 4)).toEqual([])
  })
})

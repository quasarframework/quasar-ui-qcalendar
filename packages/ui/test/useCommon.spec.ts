import { describe, expect, it } from 'vitest'

import { isFocusableType } from '../src/composables/useCommon'

describe('[QCALENDAR] common helpers', () => {
  it('detects enabled focus target types', () => {
    expect(isFocusableType({ focusable: true, focusType: ['day', 'weekday'] }, 'day')).toBe(true)
    expect(isFocusableType({ focusable: true, focusType: ['day', 'weekday'] }, 'date')).toBe(false)
  })

  it('requires focusable and the optional enabled guard', () => {
    expect(isFocusableType({ focusable: false, focusType: ['day'] }, 'day')).toBe(false)
    expect(isFocusableType({ focusable: true, focusType: ['day'] }, 'day', false)).toBe(false)
  })
})

import { describe, expect, it } from 'vitest'
import { shouldAdjustWeekEventHeight } from '../src/components/QCalendarMonth'

describe('[QCALENDAR MONTH] week event height adjustment', () => {
  it('does not resize the wrapper when the event content already fits', () => {
    expect(shouldAdjustWeekEventHeight(120, 80, 12)).toBe(false)
  })

  it('resizes the wrapper when the event content overflows', () => {
    expect(shouldAdjustWeekEventHeight(80, 90, 12)).toBe(true)
  })
})

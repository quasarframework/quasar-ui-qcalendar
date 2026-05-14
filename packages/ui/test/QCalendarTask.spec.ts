import { describe, expect, it } from 'vitest'
import { isTaskHeadDayDroppable } from '../src/components/QCalendarTask'
import { parsed } from '../src/utils/Timestamp'

describe('[QCALENDAR TASK] head day drag state', () => {
  it('returns a boolean based on comparison instead of mutating drag state', () => {
    const day = parsed('2025-01-15')!

    expect(isTaskHeadDayDroppable('', day)).toBe(false)
    expect(isTaskHeadDayDroppable('2025-01-15', day)).toBe(true)
  })
})

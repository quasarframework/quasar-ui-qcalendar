import { describe, expect, it } from 'vitest'
import QCalendarTask from '../src/components/QCalendarTask'
import { isTaskHeadDayDroppable } from '../src/components/QCalendarTask'
import { parsed } from '@timestamp-js/core'

describe('[QCALENDAR TASK] head day drag state', () => {
  it('returns a boolean based on comparison instead of mutating drag state', () => {
    const day = parsed('2025-01-15')!

    expect(isTaskHeadDayDroppable('', day)).toBe(false)
    expect(isTaskHeadDayDroppable('2025-01-15', day)).toBe(true)
  })
})

describe('[QCALENDAR TASK] events', () => {
  it('declares task row and task header mouse events', () => {
    const emits = QCalendarTask.emits as string[]

    expect(emits).toContain('click-task')
    expect(emits).toContain('contextmenu-task')
    expect(emits).toContain('touchend-task')
    expect(emits).toContain('click-head-tasks')
    expect(emits).toContain('contextmenu-head-tasks')
    expect(emits).toContain('touchend-head-tasks')
  })
})

import { ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { parsed, today, type Timestamp } from '@timestamp-js/core'

import useMove from '../src/composables/useMove'

describe('[QCALENDAR] useMove', () => {
  it('emits moved when moving to today', () => {
    const todayDate = today()
    const emit = vi.fn()
    const emittedValue = ref('2026-06-01')

    const { move } = useMove(
      { weekdays: [0, 1, 2, 3, 4, 5, 6] },
      {
        parsedView: ref('month'),
        parsedValue: ref(parsed('2026-06-01') as Timestamp),
        direction: ref('next'),
        maxDays: ref(1),
        times: { now: parsed(todayDate) as Timestamp },
        emittedValue,
        emit,
      },
    )

    move(0)

    expect(emittedValue.value).toBe(todayDate)
    expect(emit).toHaveBeenCalledWith('moved', expect.objectContaining({ date: todayDate }))
  })
})

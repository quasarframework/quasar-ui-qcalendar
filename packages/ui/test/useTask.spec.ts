import { describe, expect, it } from 'vitest'
import useTask from '../src/composables/useTask'
import { parsed } from '@timestamp-js/core'

describe('[QCALENDAR TASK] useTask', () => {
  it('computes the correct end date for a multi-month task view', () => {
    const { parsedEndDate, days } = useTask(
      {
        view: 'month',
        modelValue: '2025-01-15',
        viewCount: 2,
        weekdays: [0, 1, 2, 3, 4, 5, 6],
      },
      () => {},
      { times: { today: parsed('2025-01-15')! } },
    )

    expect(parsedEndDate.value?.date).toBe('2025-02-28')
    expect(days.value.at(0)?.date).toBe('2025-01-01')
    expect(days.value.at(-1)?.date).toBe('2025-02-28')
  })
})

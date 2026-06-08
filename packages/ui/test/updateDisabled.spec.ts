import { describe, it, expect } from 'vitest'
import * as timestamp from '@timestamp-js/core'

describe('[TIMESTAMP] updateDisabled', () => {
  const disabledDays = ['2020-01-01', '2020-01-02', '2020-01-03']
  it('Jan 2020 has 31 days', async () => {
    const ts = timestamp.parsed('2020-01-01')
    const tests = timestamp.updateDisabled(ts, undefined, undefined, undefined, disabledDays)
    expect(tests.disabled).toBe(true)
  })
})

describe('[TIMESTAMP] updateDisabled (range)', () => {
  const disabledDays = [['2020-01-01', '2020-01-03']]
  it('Jan 2020 has 31 days', async () => {
    const ts = timestamp.parsed('2020-01-01')
    const tests = timestamp.updateDisabled(ts, undefined, undefined, undefined, disabledDays)
    expect(tests.disabled).toBe(true)
  })
})

describe('[TIMESTAMP] updateDisabled (reservation metadata)', () => {
  it('applies metadata to a disabled date object', async () => {
    const ts = timestamp.parsed('2020-01-02')
    const tests = timestamp.updateDisabled(ts, undefined, undefined, undefined, [
      {
        date: '2020-01-02',
        color: '#ef5350',
        textColor: '#ffffff',
        label: 'Reserved',
      },
    ])

    expect(tests.disabled).toBe(true)
    expect(tests.disabledColor).toBe('#ef5350')
    expect(tests.disabledTextColor).toBe('#ffffff')
    expect(tests.disabledLabel).toBe('Reserved')
  })

  it('applies metadata to a disabled date range object', async () => {
    const ts = timestamp.parsed('2020-01-03')
    const tests = timestamp.updateDisabled(ts, undefined, undefined, undefined, [
      {
        from: '2020-01-01',
        to: '2020-01-05',
        color: '#ffb74d',
      },
    ])

    expect(tests.disabled).toBe(true)
    expect(tests.disabledColor).toBe('#ffb74d')
  })
})

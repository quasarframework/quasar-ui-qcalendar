// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/Timestamp.js')

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

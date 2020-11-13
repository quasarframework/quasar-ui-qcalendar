// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/Timestamp.js')

describe('[TIMESTAMP] updateDisabled', () => {
  const disabledBefore = '2020-01-01'
  const disabledAfter = '2019-12-31'
  const disabledWeekdays = [0,2,4,6]
  it('Jan 2020 has 31 days', async () => {
    const ts1 = timestamp.parsed('2020-01-01')
    const tests1 = timestamp.updateDisabled(ts1, disabledBefore, disabledAfter, undefined, undefined)

    const ts2 = timestamp.parsed('2020-01-01')
    const tests2 = timestamp.updateDisabled(ts2, undefined, disabledAfter, undefined, undefined)

    const ts3 = timestamp.parsed('2020-01-01')
    const tests3 = timestamp.updateDisabled(ts3, undefined, undefined, disabledWeekdays, undefined)

    expect(tests1.disabled).toBe(true)
    expect(tests2.disabled).toBe(true)
    expect(tests3.disabled).toBe(true)
  })
})

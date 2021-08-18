// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/Timestamp.js')

describe('[TIMESTAMP] daysInMonth', () => {
  it('Jan 2020 has 31 days', async () => {
    const tests = timestamp.daysInMonth(2020, 1)
    expect(tests).toBe(31)
  })

  it('daysInMonth Feb 2020 has 29 days (leap year)', async () => {
    const tests = timestamp.daysInMonth(2020, 2)
    expect(tests).toBe(29)
  })

  it('daysInMonth Feb 2019 has 28 days (not leap year)', async () => {
    const tests = timestamp.daysInMonth(2019, 2)
    expect(tests).toBe(28)
  })

  it('daysInMonth Jun 2020 has 30 days', async () => {
    const tests = timestamp.daysInMonth(2020, 6)
    expect(tests).toBe(30)
  })
})

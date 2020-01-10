// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/timestamp.js')

describe('[TIMESTAMP] createDayList', () => {

  it('createDayList', async () => {
    const start = timestamp.parseTimestamp('2020-01-01')
    const end = timestamp.parseTimestamp('2020-01-31')
    const now = timestamp.parseDate(new Date)
    const tests = timestamp.createDayList(start, end, now, timestamp.getWeekdaySkips([0,1,2,3,4,5,6]))
    expect(tests.length).toBe(31)
  })

  it('createDayList inverted', async () => {
    const start = timestamp.parseTimestamp('2020-01-01')
    const end = timestamp.parseTimestamp('2020-01-31')
    const now = timestamp.parseDate(new Date)
    const tests = timestamp.createDayList(end, start, now)
    expect(tests.length).toBe(0)
  })

  it('createDayList with restricted weekday skips', async () => {
    const start = timestamp.parseTimestamp('2020-01-01')
    const end = timestamp.parseTimestamp('2020-01-31')
    const now = timestamp.parseDate(new Date)
    const tests = timestamp.createDayList(start, end, now, timestamp.getWeekdaySkips([1,2,3,4,5]))
    expect(tests.length).toBe(23)
  })

})

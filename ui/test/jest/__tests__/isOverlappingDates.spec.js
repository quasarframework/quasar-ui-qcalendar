// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/timestamp.js')

describe('[TIMESTAMP] isOverlappingDates', () => {
  it('isOverlappingDates 2002-01-01/2020-01-10 and 2019-12-29/2020-01-04', async () => {
    const start = timestamp.parsed('2020-01-01')
    const end = timestamp.parsed('2020-01-10')
    const first = timestamp.parsed('2019-12-29') // start of week
    const last = timestamp.parsed('2020-01-04') // end of week
    const tests = timestamp.isOverlappingDates(start, end, first, last)
    expect(tests).toBe(true)
  })

  it('isOverlappingDates 2002-01-01/2020-01-10 and 2020-12-29/2020-01-04', async () => {
    const start = timestamp.parsed('2020-01-01')
    const end = timestamp.parsed('2020-01-10')
    const first = timestamp.parsed('2020-01-29') // start of week
    const last = timestamp.parsed('2020-01-30') // end of week
    const tests = timestamp.isOverlappingDates(start, end, first, last)
    expect(tests).toBe(false)
  })
})

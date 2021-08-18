// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/Timestamp.js')

describe('today', () => {
  it('today', async () => {
    const today = timestamp.today('2019-12-31')
    const d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    const now = [year, timestamp.padNumber(month, 2), timestamp.padNumber(day, 2)].join('-')
    expect(today).toBe(now)
  })
})

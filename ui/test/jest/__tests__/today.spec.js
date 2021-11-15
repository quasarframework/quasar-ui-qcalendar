// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/Timestamp.js')

describe('today', () => {
  it('today', async () => {
    const today = timestamp.today()
    const d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    const now = [ year, timestamp.padNumber(month, 2), timestamp.padNumber(day, 2) ].join('-')
    expect(today).toBe(now)
  })

  it('today 2', async () => {
    const today = timestamp.today()
    expect(timestamp.isToday(today)).toBe(true)
  })
})

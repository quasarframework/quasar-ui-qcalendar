// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/timestamp.js')

describe('[TIMESTAMP] createNativeLocaleFormatter', () => {

  it('monthFormatter', async () => {
    function monthFormatter () {
      const longOptions = { timeZone: 'UTC', month: 'long' }
      const shortOptions = { timeZone: 'UTC', month: 'short' }

      return timestamp.createNativeLocaleFormatter(
        'en-us',
        (_tms, short) => short ? shortOptions : longOptions
      )
    }

    const ts = timestamp.parseTimestamp('2020-01-01')
    let tests = monthFormatter()(ts, true)
    expect(tests).toBe('Jan')
    tests = monthFormatter()(ts, false)
    expect(tests).toBe('January')
  })

  it('weekdayFormatter', async () => {
    function weekdayFormatter () {
      const longOptions = { timeZone: 'UTC', weekday: 'long' }
      const shortOptions = { timeZone: 'UTC', weekday: 'short' }

      return timestamp.createNativeLocaleFormatter(
        'en-us',
        (_tms, short) => short ? shortOptions : longOptions
      )
    }

    const ts = timestamp.parseTimestamp('2020-01-01')
    let tests = weekdayFormatter()(ts, true)
    expect(tests).toBe('Wed')
    tests = weekdayFormatter()(ts, false)
    expect(tests).toBe('Wednesday')
  })

  it('dayFormatter', async () => {
    function dayFormatter () {
      const options = { timeZone: 'UTC', day: 'numeric' }

      return timestamp.createNativeLocaleFormatter(
        'en-us',
        (_tms, _short) => options
      )
    }

    const ts = timestamp.parseTimestamp('2020-01-01')
    const tests = dayFormatter()(ts, true)
    expect(tests).toBe('1')
  })

})

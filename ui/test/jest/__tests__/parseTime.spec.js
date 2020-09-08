// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/timestamp.js')

describe('[TIMESTAMP] parseTime', () => {
  it('parses time', async () => {
    const tests = timestamp.parseTime(141)
    expect(tests).toBe(141)
  })

  it('parses time as a number', async () => {
    const tests = timestamp.parseTime(144)
    expect(tests).toBe(144)
  })

  it('parses time as a string', async () => {
    const tests = timestamp.parseTime('2:24')
    expect(tests).toBe(144)
  })

  it('parses time as an object', async () => {
    const tests = timestamp.parseTime({ hour: 2, minute: 24 })
    expect(tests).toBe(144)
  })

  it('parses time invalid string', async () => {
    const tests = timestamp.parseTime('elephant')
    expect(tests).toBe(false)
  })

  it('parses time invalid object', async () => {
    const tests = timestamp.parseTime({ hour: 'elephant', minute: 'zebra' })
    expect(tests).toBe(false)
  })

  it('parses time invalid type (Date)', async () => {
    const tests = timestamp.parseTime(new Date())
    expect(tests).toBe(false)
  })

  it('parses time invalid type (Array)', async () => {
    const tests = timestamp.parseTime(['2:24'])
    expect(tests).toBe(false)
  })
})

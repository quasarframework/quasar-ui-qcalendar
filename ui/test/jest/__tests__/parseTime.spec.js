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

})

// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/Timestamp.js')
const { compareDateTime } = require('../../../src')

describe('[TIMESTAMP] makeDateTime', () => {
  it('makeDateTime', async () => {
    const ts = timestamp.parsed('2019-12-31 23:59')
    const tests = timestamp.makeDateTime(ts)
    expect(tests).toStrictEqual(new Date('2019-12-31T23:59:00.000Z'))
    expect(tests.getFullYear()).toBe(2019)
    expect(tests.getMonth()).toBe(11)
    expect(tests.getDate()).toBe(31)
  })

  it ('makeDateTime and parseDate', async () => {
    const a = new Date(2021, 11, 28, 10, 0)
    const b = timestamp.parseDate(a)
    const c = timestamp.makeDateTime(b)
    expect(timestamp.compareDateTime(c, c)).toBe(true)
  })
})

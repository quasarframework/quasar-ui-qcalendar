// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/timestamp.js')

describe('[TIMESTAMP] makeDateTime', () => {
  it('makeDateTime', async () => {
    const ts = timestamp.parsed('2019-12-31 23:59')
    const tests = timestamp.makeDateTime(ts)
    expect(tests).toStrictEqual(new Date('2019-12-31T23:59:00.000Z'))
    expect(tests.getFullYear()).toBe(2019)
    expect(tests.getMonth()).toBe(11)
    expect(tests.getDate()).toBe(31)
  })
})

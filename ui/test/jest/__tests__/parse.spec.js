// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/Timestamp.js')

describe('[TIMESTAMP] parse', () => {
  it('parse timestamp (dash date)', async () => {
    const tests = timestamp.parse('2020-01-01')
    expect(tests.year).toBe(2020)
    expect(tests.month).toBe(1)
    expect(tests.day).toBe(1)
    expect(tests.hasTime).toBe(false)
  })

  it('parse timestamp (forward slash date)', async () => {
    const tests = timestamp.parse('2020/01/01')
    expect(tests.year).toBe(2020)
    expect(tests.month).toBe(1)
    expect(tests.day).toBe(1)
    expect(tests.hasTime).toBe(false)
  })

  it('parse timestamp (dot date)', async () => {
    const tests = timestamp.parse('2020.01.01')
    expect(tests.year).toBe(2020)
    expect(tests.month).toBe(1)
    expect(tests.day).toBe(1)
    expect(tests.hasTime).toBe(false)
  })

  it('parse timestamp (dash date) - utc', async () => {
    const tests = timestamp.parse('2020-01-01', { utc: true })
    expect(tests.year).toBe(2019)
    expect(tests.month).toBe(12)
    expect(tests.day).toBe(31)
    expect(tests.hasTime).toBe(true)
  })

  it('parse timestamp (forward slash date) - utc', async () => {
    const tests = timestamp.parse('2020/01/01', { utc: true })
    expect(tests.year).toBe(2019)
    expect(tests.month).toBe(12)
    expect(tests.day).toBe(31)
    expect(tests.hasTime).toBe(true)
  })

  it('parse timestamp (dot date) - utc', async () => {
    const tests = timestamp.parse('2020.01.01', { utc: true })
    expect(tests.year).toBe(2019)
    expect(tests.month).toBe(12)
    expect(tests.day).toBe(31)
    expect(tests.hasTime).toBe(true)
  })

  it('parse date and time (dash)', async () => {
    const tests = timestamp.parse('2020-01-01 03:01')
    expect(tests.year).toBe(2020)
    expect(tests.month).toBe(1)
    expect(tests.day).toBe(1)
    expect(tests.hasTime).toBe(true)
    expect(tests.hour).toBe(3)
    expect(tests.minute).toBe(1)
  })

  it('parse date and time (forward slash)', async () => {
    const tests = timestamp.parse('2020/01/01 03:01')
    expect(tests.year).toBe(2020)
    expect(tests.month).toBe(1)
    expect(tests.day).toBe(1)
    expect(tests.hasTime).toBe(true)
    expect(tests.hour).toBe(3)
    expect(tests.minute).toBe(1)
  })

  it('parse date and time (dot)', async () => {
    const tests = timestamp.parse('2020.01.01 03:01')
    expect(tests.year).toBe(2020)
    expect(tests.month).toBe(1)
    expect(tests.day).toBe(1)
    expect(tests.hasTime).toBe(true)
    expect(tests.hour).toBe(3)
    expect(tests.minute).toBe(1)
  })

  it('parse date and time (dash) - utc', async () => {
    const tests = timestamp.parse('2020-01-01 03:01', { utc: true })
    expect(tests.year).toBe(2019)
    expect(tests.month).toBe(12)
    expect(tests.day).toBe(31)
    expect(tests.hasTime).toBe(true)
    expect(tests.hour).toBe(20)
    expect(tests.minute).toBe(1)
  })

  it('parse date and time (forward slash) - utc', async () => {
    const tests = timestamp.parse('2020/01/01 03:01', { utc: true })
    expect(tests.year).toBe(2019)
    expect(tests.month).toBe(12)
    expect(tests.day).toBe(31)
    expect(tests.hasTime).toBe(true)
    expect(tests.hour).toBe(20)
    expect(tests.minute).toBe(1)
  })

  it('parse date and time (dot) - utc', async () => {
    const tests = timestamp.parse('2020.01.01 03:01', { utc: true })
    expect(tests.year).toBe(2019)
    expect(tests.month).toBe(12)
    expect(tests.day).toBe(31)
    expect(tests.hasTime).toBe(true)
    expect(tests.hour).toBe(20)
    expect(tests.minute).toBe(1)
  })

  it('parse date and time (short/dash)', async () => {
    const tests = timestamp.parse('2020-1-1 3:01')
    expect(tests.year).toBe(2020)
    expect(tests.month).toBe(1)
    expect(tests.day).toBe(1)
    expect(tests.hasTime).toBe(true)
    expect(tests.hour).toBe(3)
    expect(tests.minute).toBe(1)
  })

  it('parse date and time (short/forward slash)', async () => {
    const tests = timestamp.parse('2020/1/1 3:01')
    expect(tests.year).toBe(2020)
    expect(tests.month).toBe(1)
    expect(tests.day).toBe(1)
    expect(tests.hasTime).toBe(true)
    expect(tests.hour).toBe(3)
    expect(tests.minute).toBe(1)
  })

  it('parse date and time (short/dot)', async () => {
    const tests = timestamp.parse('2020.1.1 3:01')
    expect(tests.year).toBe(2020)
    expect(tests.month).toBe(1)
    expect(tests.day).toBe(1)
    expect(tests.hasTime).toBe(true)
    expect(tests.hour).toBe(3)
    expect(tests.minute).toBe(1)
  })

  it('parse Date', async () => {
    const tests = timestamp.parse(new Date())
    const now = timestamp.parse(timestamp.today())
    expect(tests.year).toBe(now.year)
    expect(tests.month).toBe(now.month)
    expect(tests.day).toBe(now.day)
    expect(tests.hasTime).toBe(true)
  })

  it('parse Date (utc)', async () => {
    let d = new Date()
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
    const tests = timestamp.parseDate(d)
    const now = timestamp.parse(timestamp.today(true))
    expect(tests.year).toBe(now.year)
    expect(tests.month).toBe(now.month)
    expect(tests.day).toBe(now.day)
    expect(tests.hasTime).toBe(true)
  })

  it('parse valid date', async () => {
    const tests = timestamp.parse()
    expect(tests.date === timestamp.today()).toBe(true)
  })
})

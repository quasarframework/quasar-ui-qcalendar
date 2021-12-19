// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/Timestamp.js')

describe('[TIMESTAMP] getWeekdayFormatter', () => {
  it('getWeekdayFormatter (Sun)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Sun')
    expect(val).toBe('Sunday')
  })

  it('getWeekdayFormatter (Mon)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Mon')
    expect(val).toBe('Monday')
  })

  it('getWeekdayFormatter (Tue)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Tue')
    expect(val).toBe('Tuesday')
  })

  it('getWeekdayFormatter (Wed)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Wed')
    expect(val).toBe('Wednesday')
  })

  it('getWeekdayFormatter (Thu)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Thu')
    expect(val).toBe('Thursday')
  })

  it('getWeekdayFormatter (Fri)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Fri')
    expect(val).toBe('Friday')
  })

  it('getWeekdayFormatter (Sat)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Sat')
    expect(val).toBe('Saturday')
  })

  it('getWeekdayFormatter (Sun, short)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Sun', 'short')
    expect(val).toBe('Sun.')
  })

  it('getWeekdayFormatter (Mon, short)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Mon', 'short')
    expect(val).toBe('Mon.')
  })

  it('getWeekdayFormatter (Tue, short)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Tue', 'short')
    expect(val).toBe('Tue.')
  })

  it('getWeekdayFormatter (Wed, short)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Wed', 'short')
    expect(val).toBe('Wed.')
  })

  it('getWeekdayFormatter (Thu, short)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Thu', 'short')
    expect(val).toBe('Thu.')
  })

  it('getWeekdayFormatter (Fri, short)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Fri', 'short')
    expect(val).toBe('Fri.')
  })

  it('getWeekdayFormatter (Sat, short)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Sat', 'short')
    expect(val).toBe('Sat.')
  })

  it('getWeekdayFormatter (Sun, narrow)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Sun', 'narrow')
    expect(val).toBe('S')
  })

  it('getWeekdayFormatter (Mon, narrow)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Mon', 'narrow')
    expect(val).toBe('M')
  })

  it('getWeekdayFormatter (Tue, narrow)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Tue', 'narrow')
    expect(val).toBe('T')
  })

  it('getWeekdayFormatter (Wed, narrow)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Wed', 'narrow')
    expect(val).toBe('W')
  })

  it('getWeekdayFormatter (Thu, narrow)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Thu', 'narrow')
    expect(val).toBe('T')
  })

  it('getWeekdayFormatter (Fri, narrow)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Fri', 'narrow')
    expect(val).toBe('F')
  })

  it('getWeekdayFormatter (Sat, narrow)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Sat', 'narrow')
    expect(val).toBe('S')
  })

  //---

  it('getWeekdayFormatter (Sun, long, se)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Sun', 'long', 'se')
    expect(val).toBe('sotnabeaivi')
  })

  it('getWeekdayFormatter (Mon, long, se)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Mon', 'long', 'se')
    expect(val).toBe('vuossárga')
  })

  it('getWeekdayFormatter (Tue, long, se)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Tue', 'long', 'se')
    expect(val).toBe('maŋŋebárga')
  })

  it('getWeekdayFormatter (Wed, long, se)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Wed', 'long', 'se')
    expect(val).toBe('gaskavahkku')
  })

  it('getWeekdayFormatter (Thu, long, se)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Thu', 'long', 'se')
    expect(val).toBe('duorasdat')
  })

  it('getWeekdayFormatter (Fri, long, se)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Fri', 'long', 'se')
    expect(val).toBe('bearjadat')
  })

  it('getWeekdayFormatter (Sat, long, se)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Sat', 'long', 'se')
    expect(val).toBe('lávvardat')
  })

  it('getWeekdayFormatter (Sun, short, se)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Sun', 'short', 'se')
    expect(val).toBe('sotn')
  })

  it('getWeekdayFormatter (Mon, short, se)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Mon', 'short', 'se')
    expect(val).toBe('vuos')
  })

  it('getWeekdayFormatter (Tue, short, se)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Tue', 'short', 'se')
    expect(val).toBe('maŋ')
  })

  it('getWeekdayFormatter (Wed, short, se)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Wed', 'short', 'se')
    expect(val).toBe('gask')
  })

  it('getWeekdayFormatter (Thu, short, se)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Thu', 'short', 'se')
    expect(val).toBe('duor')
  })

  it('getWeekdayFormatter (Fri, short, se)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Fri', 'short', 'se')
    expect(val).toBe('bear')
  })

  it('getWeekdayFormatter (Sat, short, se)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Sat', 'short', 'se')
    expect(val).toBe('láv')
  })

  it('getWeekdayFormatter (Sun, narrow, se)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Sun', 'narrow', 'se')
    expect(val).toBe('S')
  })

  it('getWeekdayFormatter (Mon, narrow, se)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Mon', 'narrow', 'se')
    expect(val).toBe('V')
  })

  it('getWeekdayFormatter (Tue, narrow, se)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Tue', 'narrow', 'se')
    expect(val).toBe('M')
  })

  it('getWeekdayFormatter (Wed, narrow, se)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Wed', 'narrow', 'se')
    expect(val).toBe('G')
  })

  it('getWeekdayFormatter (Thu, narrow, se)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Thu', 'narrow', 'se')
    expect(val).toBe('D')
  })

  it('getWeekdayFormatter (Fri, narrow, se)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Fri', 'narrow', 'se')
    expect(val).toBe('B')
  })

  it('getWeekdayFormatter (Sat, narrow, se)', async () => {
    const weekdayFormatter = timestamp.getWeekdayFormatter()
    const val = weekdayFormatter('Sat', 'narrow', 'se')
    expect(val).toBe('L')
  })

})
// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/Timestamp.js')

describe('[TIMESTAMP] getWeekdayNames', () => {
  it('getWeekdayNames (long en-US)', async () => {
    const names = timestamp.getWeekdayNames('long', 'en-US')
    expect(names).toEqual([ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ])
  })

  it('getWeekdayNames (short en-US)', async () => {
    const names = timestamp.getWeekdayNames('short', 'en-US')
    expect(names).toEqual([ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ])
  })

  it('getWeekdayNames (narrow en-US)', async () => {
    const names = timestamp.getWeekdayNames('narrow', 'en-US')
    expect(names).toEqual([ 'S', 'M', 'T', 'W', 'T', 'F', 'S' ])
  })

  //---

  it('getWeekdayNames (long se)', async () => {
    const names = timestamp.getWeekdayNames('long', 'se')
    expect(names).toEqual([ 'sotnabeaivi', 'vuossárga', 'maŋŋebárga', 'gaskavahkku', 'duorasdat', 'bearjadat', 'lávvardat' ])
  })

  it('getWeekdayNames (short se)', async () => {
    const names = timestamp.getWeekdayNames('short', 'se')
    expect(names).toEqual([ 'sotn', 'vuos', 'maŋ', 'gask', 'duor', 'bear', 'láv' ])
  })

  it('getWeekdayNames (narrow se)', async () => {
    const names = timestamp.getWeekdayNames('narrow', 'se')
    expect(names).toEqual([ 'S', 'V', 'M', 'G', 'D', 'B', 'L' ])
  })
})

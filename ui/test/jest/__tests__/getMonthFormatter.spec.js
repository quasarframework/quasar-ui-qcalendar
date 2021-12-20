// eslint-disable-next-line node/no-missing-require
const timestamp = require('utils/Timestamp.js')

describe('[TIMESTAMP] getMonthFormatter', () => {
  it('getMonthFormatter (0)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(0)
    expect(val).toBe('January')
  })

  it('getMonthFormatter (1)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(1)
    expect(val).toBe('February')
  })

  it('getMonthFormatter (2)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(2)
    expect(val).toBe('March')
  })

  it('getMonthFormatter (3)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(3)
    expect(val).toBe('April')
  })

  it('getMonthFormatter (4)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(4)
    expect(val).toBe('May')
  })

  it('getMonthFormatter (5)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(5)
    expect(val).toBe('June')
  })

  it('getMonthFormatter (6)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(6)
    expect(val).toBe('July')
  })

  it('getMonthFormatter (7)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(7)
    expect(val).toBe('August')
  })

  it('getMonthFormatter (8)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(8)
    expect(val).toBe('September')
  })

  it('getMonthFormatter (9)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(9)
    expect(val).toBe('October')
  })

  it('getMonthFormatter (10)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(10)
    expect(val).toBe('November')
  })

  it('getMonthFormatter (11)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(11)
    expect(val).toBe('December')
  })

  it('getMonthFormatter (0 short en-US)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(0, 'short', 'en-US')
    expect(val).toBe('Jan')
  })

  it('getMonthFormatter (1 short en-US)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(1, 'short', 'en-US')
    expect(val).toBe('Feb')
  })

  it('getMonthFormatter (2 short en-US)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(2, 'short', 'en-US')
    expect(val).toBe('Mar')
  })

  it('getMonthFormatter (3 short en-US)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(3, 'short', 'en-US')
    expect(val).toBe('Apr')
  })

  it('getMonthFormatter (4 short en-US)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(4, 'short', 'en-US')
    expect(val).toBe('May')
  })

  it('getMonthFormatter (5 short en-US)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(5, 'short', 'en-US')
    expect(val).toBe('Jun')
  })

  it('getMonthFormatter (6 short en-US)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(6, 'short', 'en-US')
    expect(val).toBe('Jul')
  })

  it('getMonthFormatter (7 short en-US)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(7, 'short', 'en-US')
    expect(val).toBe('Aug')
  })

  it('getMonthFormatter (8 short en-US)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(8, 'short', 'en-US')
    expect(val).toBe('Sep')
  })

  it('getMonthFormatter (9 short en-US)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(9, 'short', 'en-US')
    expect(val).toBe('Oct')
  })

  it('getMonthFormatter (10 short en-US)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(10, 'short', 'en-US')
    expect(val).toBe('Nov')
  })

  it('getMonthFormatter (11 short en-US)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(11, 'short', 'en-US')
    expect(val).toBe('Dec')
  })

  it('getMonthFormatter (0 narrow en-US)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(0, 'narrow', 'en-US')
    expect(val).toBe('J')
  })

  it('getMonthFormatter (1 narrow en-US)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(1, 'narrow', 'en-US')
    expect(val).toBe('F')
  })

  it('getMonthFormatter (2 narrow en-US)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(2, 'narrow', 'en-US')
    expect(val).toBe('M')
  })

  it('getMonthFormatter (3 narrow en-US)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(3, 'narrow', 'en-US')
    expect(val).toBe('A')
  })

  it('getMonthFormatter (4 narrow en-US)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(4, 'narrow', 'en-US')
    expect(val).toBe('M')
  })

  it('getMonthFormatter (5 narrow en-US)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(5, 'narrow', 'en-US')
    expect(val).toBe('J')
  })

  it('getMonthFormatter (6 narrow en-US)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(6, 'narrow', 'en-US')
    expect(val).toBe('J')
  })

  it('getMonthFormatter (7 narrow en-US)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(7, 'narrow', 'en-US')
    expect(val).toBe('A')
  })

  it('getMonthFormatter (8 narrow en-US)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(8, 'narrow', 'en-US')
    expect(val).toBe('S')
  })

  it('getMonthFormatter (9 narrow en-US)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(9, 'narrow', 'en-US')
    expect(val).toBe('O')
  })

  it('getMonthFormatter (10 narrow en-US)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(10, 'narrow', 'en-US')
    expect(val).toBe('N')
  })

  it('getMonthFormatter (11 narrow en-US)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(11, 'narrow', 'en-US')
    expect(val).toBe('D')
  })

  //---

  it('getMonthFormatter (0 long se)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(0, 'long', 'se')
    expect(val).toBe('ođđajagemánnu')
  })

  it('getMonthFormatter (1 long se)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(1, 'long', 'se')
    expect(val).toBe('guovvamánnu')
  })

  it('getMonthFormatter (2 long se)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(2, 'long', 'se')
    expect(val).toBe('njukčamánnu')
  })

  it('getMonthFormatter (3 long se)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(3, 'long', 'se')
    expect(val).toBe('cuoŋománnu')
  })

  it('getMonthFormatter (4 long se)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(4, 'long', 'se')
    expect(val).toBe('miessemánnu')
  })

  it('getMonthFormatter (5 long se)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(5, 'long', 'se')
    expect(val).toBe('geassemánnu')
  })

  it('getMonthFormatter (6 long se)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(6, 'long', 'se')
    expect(val).toBe('suoidnemánnu')
  })

  it('getMonthFormatter (7 long se)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(7, 'long', 'se')
    expect(val).toBe('borgemánnu')
  })

  it('getMonthFormatter (8 long se)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(8, 'long', 'se')
    expect(val).toBe('čakčamánnu')
  })

  it('getMonthFormatter (9 long se)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(9, 'long', 'se')
    expect(val).toBe('golggotmánnu')
  })

  it('getMonthFormatter (10 long se)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(10, 'long', 'se')
    expect(val).toBe('skábmamánnu')
  })

  it('getMonthFormatter (11 long se)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(11, 'long', 'se')
    expect(val).toBe('juovlamánnu')
  })

  it('getMonthFormatter (0 short se)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(0, 'short', 'se')
    expect(val).toBe('ođđj')
  })

  it('getMonthFormatter (1 short se)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(1, 'short', 'se')
    expect(val).toBe('guov')
  })

  it('getMonthFormatter (2 short se)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(2, 'short', 'se')
    expect(val).toBe('njuk')
  })

  it('getMonthFormatter (3 short se)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(3, 'short', 'se')
    expect(val).toBe('cuo')
  })

  it('getMonthFormatter (4 short se)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(4, 'short', 'se')
    expect(val).toBe('mies')
  })

  it('getMonthFormatter (5 short se)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(5, 'short', 'se')
    expect(val).toBe('geas')
  })

  it('getMonthFormatter (6 short se)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(6, 'short', 'se')
    expect(val).toBe('suoi')
  })

  it('getMonthFormatter (7 short se)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(7, 'short', 'se')
    expect(val).toBe('borg')
  })

  it('getMonthFormatter (8 short se)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(8, 'short', 'se')
    expect(val).toBe('čakč')
  })

  it('getMonthFormatter (9 short se)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(9, 'short', 'se')
    expect(val).toBe('golg')
  })

  it('getMonthFormatter (10 short se)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(10, 'short', 'se')
    expect(val).toBe('skáb')
  })

  it('getMonthFormatter (11 short se)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(11, 'short', 'se')
    expect(val).toBe('juov')
  })

  it('getMonthFormatter (0 narrow se)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(0, 'narrow', 'se')
    expect(val).toBe('O')
  })

  it('getMonthFormatter (1 narrow se)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(1, 'narrow', 'se')
    expect(val).toBe('G')
  })

  it('getMonthFormatter (2 narrow se)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(2, 'narrow', 'se')
    expect(val).toBe('N')
  })

  it('getMonthFormatter (3 narrow se)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(3, 'narrow', 'se')
    expect(val).toBe('C')
  })

  it('getMonthFormatter (4 narrow se)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(4, 'narrow', 'se')
    expect(val).toBe('M')
  })

  it('getMonthFormatter (5 narrow se)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(5, 'narrow', 'se')
    expect(val).toBe('G')
  })

  it('getMonthFormatter (6 narrow se)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(6, 'narrow', 'se')
    expect(val).toBe('S')
  })

  it('getMonthFormatter (7 narrow se)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(7, 'narrow', 'se')
    expect(val).toBe('B')
  })

  it('getMonthFormatter (8 narrow se)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(8, 'narrow', 'se')
    expect(val).toBe('Č')
  })

  it('getMonthFormatter (9 narrow se)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(9, 'narrow', 'se')
    expect(val).toBe('G')
  })

  it('getMonthFormatter (10 narrow se)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(10, 'narrow', 'se')
    expect(val).toBe('S')
  })

  it('getMonthFormatter (11 narrow se)', async () => {
    const monthFormatter = timestamp.getMonthFormatter()
    const val = monthFormatter(11, 'narrow', 'se')
    expect(val).toBe('J')
  })

})
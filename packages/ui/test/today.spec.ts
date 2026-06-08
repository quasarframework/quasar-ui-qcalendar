import { describe, it, expect } from 'vitest'
import * as timestamp from '@timestamp-js/core'

describe('today', () => {
  it('today', async () => {
    const today = timestamp.today()
    const d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    const now = [
      year,
      timestamp.padNumber(Number(month), 2),
      timestamp.padNumber(Number(day), 2),
    ].join('-')
    expect(today).toBe(now)
  })
})

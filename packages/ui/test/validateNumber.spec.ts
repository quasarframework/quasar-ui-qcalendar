import { describe, it, expect } from 'vitest'
import * as timestamp from '../src/utils/Timestamp'

describe('[TIMESTAMP] validateNumber', () => {
  it('validateNumber true', async () => {
    const tests = timestamp.validateNumber(100)
    expect(tests).toBe(true)
  })

  // takes 2020
  it("validateNumber true ('2020-01-01')", async () => {
    const tests = timestamp.validateNumber('2020-01-01')
    expect(tests).toBe(false)
  })

  it("validateNumber true ('elephant')", async () => {
    const tests = timestamp.validateNumber('elephant')
    expect(tests).toBe(false)
  })
})

import { describe, expect, it } from 'vitest'

import {
  getResourceHeightStyle,
  parseResourceHeight,
  parseResourceMinHeight,
} from '../src/composables/useResourceDimensions'

describe('[QCALENDAR] resource dimensions', () => {
  it('parses a zero resource height as automatic height', () => {
    expect(parseResourceHeight(0)).toBe('auto')
    expect(parseResourceHeight('0')).toBe('auto')
    expect(parseResourceHeight('72')).toBe(72)
  })

  it('builds resource height styles with optional minimum height', () => {
    expect(getResourceHeightStyle('auto', 0)).toEqual({ height: 'auto' })
    expect(getResourceHeightStyle(72, 24)).toEqual({ height: '72px', minHeight: '24px' })
    expect(parseResourceMinHeight('36')).toBe(36)
  })

  it('lets a resource-specific height override the shared height', () => {
    expect(getResourceHeightStyle(72, 24, { height: '96' })).toEqual({
      height: '96px',
      minHeight: '24px',
    })
  })
})

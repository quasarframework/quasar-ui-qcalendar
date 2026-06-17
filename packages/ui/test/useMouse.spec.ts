import { computed } from 'vue'
import type { EmitFn } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { getMouseEventHandlers } from '../src/composables/useMouse'

describe('[QCALENDAR] mouse event handlers', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('coalesces mousemove emissions to the last target in the animation frame', () => {
    const frames: FrameRequestCallback[] = []
    const emit = vi.fn() as unknown as EmitFn
    const listeners = computed(() => ({ onMousemoveDay: true }))

    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => {
        frames.push(callback)
        return frames.length
      }),
    )

    const firstHandlers = getMouseEventHandlers(
      emit,
      listeners,
      { 'mousemove-day': { event: 'mousemove' } },
      () => ({ scope: { timestamp: { date: '2026-06-15' } } }),
    )
    const secondHandlers = getMouseEventHandlers(
      emit,
      listeners,
      { 'mousemove-day': { event: 'mousemove' } },
      () => ({ scope: { timestamp: { date: '2026-06-16' } } }),
    )

    ;(firstHandlers.onMousemove as Function)({ type: 'mousemove' } as MouseEvent)
    ;(secondHandlers.onMousemove as Function)({ type: 'mousemove' } as MouseEvent)

    expect(frames).toHaveLength(1)
    expect(emit).not.toHaveBeenCalled()

    frames[0]!(0)

    expect(emit).toHaveBeenCalledTimes(1)
    expect(emit).toHaveBeenCalledWith('mousemove-day', {
      scope: { timestamp: { date: '2026-06-16' } },
    })
  })
})

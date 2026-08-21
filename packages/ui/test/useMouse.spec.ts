import { computed } from 'vue'
import type { EmitFn } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { parseCalendarTimestamp, type Timestamp } from '@timestamp-js/core'

import { getMouseEventHandlers } from '../src/composables/useMouse'
import { getCalendarScopeData } from '../src/utils/calendarSystem'
import { calendarAdapterCases } from './fixtures/calendarAdapters'

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

  it('emits the configured scope and native event for immediate mouse events', () => {
    const emit = vi.fn() as unknown as EmitFn
    const listeners = computed(() => ({ onClickDay: true }))
    const nativeEvent = { type: 'click' } as MouseEvent
    const scope = { timestamp: { date: '2026-06-15' }, columnIndex: 2 }

    const handlers = getMouseEventHandlers(
      emit,
      listeners,
      { 'click-day': { event: 'click' } },
      (event) => ({ scope, event }),
    )

    ;(handlers.onClick as Function)(nativeEvent)

    expect(emit).toHaveBeenCalledTimes(1)
    expect(emit).toHaveBeenCalledWith('click-day', { scope, event: nativeEvent })
  })

  it('applies contextmenu prevent/default handling without changing the payload', () => {
    const emit = vi.fn() as unknown as EmitFn
    const preventDefault = vi.fn()
    const listeners = computed(() => ({ onContextmenuDay: true }))
    const nativeEvent = { type: 'contextmenu', preventDefault } as unknown as MouseEvent

    const handlers = getMouseEventHandlers(
      emit,
      listeners,
      { 'contextmenu-day': { event: 'contextmenu', prevent: true, result: false } },
      (event) => ({ scope: { type: 'day' }, event }),
    )

    const result = (handlers.onContextmenu as Function)(nativeEvent)

    expect(preventDefault).toHaveBeenCalledTimes(1)
    expect(result).toBe(false)
    expect(emit).toHaveBeenCalledWith('contextmenu-day', {
      scope: { type: 'day' },
      event: nativeEvent,
    })
  })

  it.each(calendarAdapterCases)(
    'preserves $name identity in mouse-event scopes',
    ({ calendar, nativeDate, gregorianDate, epochDay }) => {
      const emit = vi.fn() as unknown as EmitFn
      const listeners = computed(() => ({ onClickDay: true }))
      const nativeEvent = { type: 'click' } as MouseEvent
      const timestamp = parseCalendarTimestamp(nativeDate, calendar) as Timestamp
      const scope = {
        timestamp,
        ...getCalendarScopeData(timestamp, calendar),
      }
      const handlers = getMouseEventHandlers(
        emit,
        listeners,
        { 'click-day': { event: 'click' } },
        (event) => ({ scope, event }),
      )

      ;(handlers.onClick as Function)(nativeEvent)

      expect(emit).toHaveBeenCalledWith('click-day', {
        scope: expect.objectContaining({
          calendarIdentity: expect.objectContaining({
            calendarId: calendar.id,
            nativeDate,
            gregorianDate,
            epochDay,
          }),
          calendarSystem: calendar,
        }),
        event: nativeEvent,
      })
    },
  )
})

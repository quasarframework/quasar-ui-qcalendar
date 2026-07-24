import { computed, createSSRApp, defineComponent, h, ref, type EmitFn } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import QCalendarAgenda from '../src/components/QCalendarAgenda'
import QCalendarDay from '../src/components/QCalendarDay'
import QCalendarMonth from '../src/components/QCalendarMonth'
import QCalendarResource from '../src/components/QCalendarResource'
import QCalendarScheduler from '../src/components/QCalendarScheduler'
import QCalendarTask from '../src/components/QCalendarTask'
import useScrollEvents from '../src/composables/useScrollEvents'

const scrollableCalendars = [
  QCalendarAgenda,
  QCalendarDay,
  QCalendarResource,
  QCalendarScheduler,
  QCalendarTask,
]

describe('[USE SCROLL EVENTS]', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('declares scroll events only on calendars with an internal scroll area', () => {
    for (const calendar of scrollableCalendars) {
      const emits = calendar.emits as string[]

      expect(emits).toContain('scroll')
      expect(emits).toContain('scrollend')
    }

    const monthEmits = QCalendarMonth.emits as string[]

    expect(monthEmits).not.toContain('scroll')
    expect(monthEmits).not.toContain('scrollend')
  })

  it('emits current scroll details and debounces scroll-end with the latest event', async () => {
    const emit = vi.fn()
    const listeners = ref<Record<string, boolean>>({
      onScroll: true,
      onScrollend: true,
    })
    let onScroll: (_event: Event) => void = () => {}

    const app = createSSRApp(
      defineComponent({
        setup() {
          ;({ onScroll } = useScrollEvents(
            emit as unknown as EmitFn,
            computed(() => listeners.value),
          ))

          return () => h('div')
        },
      }),
    )

    await renderToString(app)

    const target = {
      scrollLeft: 25,
      scrollTop: 50,
      scrollWidth: 500,
      scrollHeight: 1000,
      clientWidth: 200,
      clientHeight: 300,
    } as HTMLElement
    const firstEvent = { currentTarget: target } as unknown as Event

    onScroll(firstEvent)

    expect(emit).toHaveBeenCalledTimes(1)
    expect(emit).toHaveBeenLastCalledWith('scroll', {
      event: firstEvent,
      target,
      scrollLeft: 25,
      scrollTop: 50,
      scrollWidth: 500,
      scrollHeight: 1000,
      clientWidth: 200,
      clientHeight: 300,
    })

    target.scrollTop = 75
    const lastEvent = { currentTarget: target } as unknown as Event
    onScroll(lastEvent)

    vi.advanceTimersByTime(119)
    expect(emit).toHaveBeenCalledTimes(2)

    vi.advanceTimersByTime(1)
    expect(emit).toHaveBeenCalledTimes(3)
    expect(emit).toHaveBeenLastCalledWith(
      'scrollend',
      expect.objectContaining({
        event: lastEvent,
        target,
        scrollTop: 75,
      }),
    )
  })

  it('does no scroll work when neither event has a listener', async () => {
    const emit = vi.fn()
    let onScroll: (_event: Event) => void = () => {}

    const app = createSSRApp(
      defineComponent({
        setup() {
          ;({ onScroll } = useScrollEvents(
            emit as unknown as EmitFn,
            computed(() => ({})),
          ))

          return () => h('div')
        },
      }),
    )

    await renderToString(app)

    onScroll({
      currentTarget: {},
    } as unknown as Event)
    vi.runAllTimers()

    expect(emit).not.toHaveBeenCalled()
  })
})

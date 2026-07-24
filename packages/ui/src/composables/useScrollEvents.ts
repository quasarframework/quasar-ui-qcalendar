import { onBeforeUnmount, type ComputedRef, type EmitFn } from 'vue'

const scrollEndDelay = 120

export const useScrollEmits = [
  /**
   * Emitted when the internal scroll area position changes.
   *
   * @param details Current scroll position and dimensions.
   * @param-type details Object
   * @param-tsType details CalendarScrollEvent
   */
  'scroll',
  /**
   * Emitted after the internal scroll area stops scrolling.
   *
   * @param details Final scroll position and dimensions.
   * @param-type details Object
   * @param-tsType details CalendarScrollEvent
   */
  'scrollend',
] as const

export interface CalendarScrollEvent {
  /** Native scroll event. */
  event: Event
  /** Calendar element that owns the scrollbar. */
  target: HTMLElement
  /** Horizontal scroll offset in pixels. */
  scrollLeft: number
  /** Vertical scroll offset in pixels. */
  scrollTop: number
  /** Total width of the scrollable content in pixels. */
  scrollWidth: number
  /** Total height of the scrollable content in pixels. */
  scrollHeight: number
  /** Visible width of the scroll area in pixels. */
  clientWidth: number
  /** Visible height of the scroll area in pixels. */
  clientHeight: number
}

interface UseScrollEventsReturn {
  onScroll: (_event: Event) => void
}

export default function useScrollEvents(
  emit: EmitFn,
  emitListeners: ComputedRef<Record<string, boolean>>,
): UseScrollEventsReturn {
  let scrollEndTimer: ReturnType<typeof setTimeout> | undefined
  let lastScrollEvent: CalendarScrollEvent | undefined

  function clearScrollEndTimer(): void {
    if (scrollEndTimer !== undefined) {
      clearTimeout(scrollEndTimer)
      scrollEndTimer = undefined
    }
  }

  function getScrollEvent(event: Event): CalendarScrollEvent {
    const target = (event.currentTarget ?? event.target) as HTMLElement

    return {
      event,
      target,
      scrollLeft: target.scrollLeft,
      scrollTop: target.scrollTop,
      scrollWidth: target.scrollWidth,
      scrollHeight: target.scrollHeight,
      clientWidth: target.clientWidth,
      clientHeight: target.clientHeight,
    }
  }

  function onScroll(event: Event): void {
    const emitScroll = emitListeners.value.onScroll === true
    const emitScrollEnd = emitListeners.value.onScrollend === true

    if (emitScroll === false && emitScrollEnd === false) return

    const scrollEvent = getScrollEvent(event)

    if (emitScroll === true) {
      emit('scroll', scrollEvent)
    }

    if (emitScrollEnd === true) {
      lastScrollEvent = scrollEvent
      clearScrollEndTimer()
      scrollEndTimer = setTimeout(() => {
        scrollEndTimer = undefined

        if (emitListeners.value.onScrollend === true && lastScrollEvent !== undefined) {
          emit('scrollend', lastScrollEvent)
        }
      }, scrollEndDelay)
    }
  }

  onBeforeUnmount(clearScrollEndTimer)

  return { onScroll }
}

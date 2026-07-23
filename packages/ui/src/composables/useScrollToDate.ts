import {
  nextTick,
  onBeforeUnmount,
  onBeforeUpdate,
  type ComponentPublicInstance,
  type Ref,
} from 'vue'
import { getCalendarDayIdentifier, type CalendarSystem, type Timestamp } from '@timestamp-js/core'

import { getCalendarDateIdentifier } from '../utils/calendarSystem'
import { animHorizontalScrollTo } from '../utils/scroll'

interface ScrollToDateProps {
  calendarSystem?: CalendarSystem
}

interface UseScrollToDateReturn {
  registerDate: (timestamp: Timestamp, el: Element | ComponentPublicInstance | null) => void
  scrollToDate: (date: string, duration?: number) => boolean
}

interface PendingScroll {
  identifier: number
  duration: number
}

export default function useScrollToDate(
  props: ScrollToDateProps,
  scrollArea: Ref<HTMLElement | null>,
  days: Ref<Timestamp[]>,
): UseScrollToDateReturn {
  const dateElements = new Map<number, HTMLElement>()
  let pendingScroll: PendingScroll | null = null
  let pendingFlushScheduled = false

  onBeforeUpdate(() => {
    dateElements.clear()
  })

  onBeforeUnmount(() => {
    pendingScroll = null
  })

  function registerDate(timestamp: Timestamp, el: Element | ComponentPublicInstance | null): void {
    if (el !== null) {
      // All registrations are native date-column elements. The wider input type
      // matches Vue's VNodeRef callback contract.
      const dateElement = el as HTMLElement
      const identifier = getCalendarDayIdentifier(timestamp, props.calendarSystem)

      if (dateElements.has(identifier) === false) {
        dateElements.set(identifier, dateElement)
      }
    }
  }

  function scrollToIdentifier(identifier: number, duration: number): boolean {
    const scrollTarget = scrollArea.value

    if (scrollTarget === null) {
      return false
    }

    const dateElement = dateElements.get(identifier)
    if (dateElement === undefined) {
      return false
    }

    const targetRect = dateElement.getBoundingClientRect()
    const scrollRect = scrollTarget.getBoundingClientRect()
    const offset = targetRect.left + targetRect.width / 2 - (scrollRect.left + scrollRect.width / 2)

    animHorizontalScrollTo(scrollTarget, scrollTarget.scrollLeft + offset, duration)

    return true
  }

  function flushPendingScroll(): void {
    const request = pendingScroll
    pendingScroll = null

    if (request !== null) {
      scrollToIdentifier(request.identifier, request.duration)
    }
  }

  function deferScroll(identifier: number, duration: number): void {
    pendingScroll = { identifier, duration }

    if (pendingFlushScheduled === false) {
      pendingFlushScheduled = true

      void nextTick(() => {
        pendingFlushScheduled = false
        flushPendingScroll()
      })
    }
  }

  function scrollToDate(date: string, duration = 0): boolean {
    const identifier = getCalendarDateIdentifier(date, props.calendarSystem)

    if (
      identifier === null ||
      days.value.some(
        (day) => getCalendarDayIdentifier(day, props.calendarSystem) === identifier,
      ) === false
    ) {
      pendingScroll = null
      return false
    }

    if (scrollToIdentifier(identifier, duration) === true) {
      pendingScroll = null
    } else {
      deferScroll(identifier, duration)
    }

    return true
  }

  return {
    registerDate,
    scrollToDate,
  }
}

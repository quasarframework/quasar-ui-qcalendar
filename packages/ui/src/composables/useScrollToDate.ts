import { onBeforeUpdate, type ComponentPublicInstance, type Ref } from 'vue'
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

export default function useScrollToDate(
  props: ScrollToDateProps,
  scrollArea: Ref<HTMLElement | null>,
): UseScrollToDateReturn {
  const dateElements = new Map<number, HTMLElement>()

  onBeforeUpdate(() => {
    dateElements.clear()
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

  function scrollToDate(date: string, duration = 0): boolean {
    const identifier = getCalendarDateIdentifier(date, props.calendarSystem)
    const scrollTarget = scrollArea.value

    if (identifier === null || scrollTarget === null) {
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

  return {
    registerDate,
    scrollToDate,
  }
}

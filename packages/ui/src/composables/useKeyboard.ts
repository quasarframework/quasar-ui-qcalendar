/* global document window */
import { onBeforeUnmount, watch, Ref } from 'vue'
import useEvents from './useEvents'
import {
  addToDate,
  copyTimestamp,
  getStartOfMonth,
  getEndOfMonth,
  getStartOfWeek,
  getEndOfWeek,
} from '../utils/Timestamp'
import type { Timestamp } from '../utils/Timestamp'
import { type IntervalProps } from './useInterval'

const { isKeyCode } = useEvents()

export const useNavigationProps = {
  useNavigation: Boolean,
}

export interface NavigationProps {
  useNavigation: boolean
  // intervalMinutes: number | string
  // weekdays?: number[]
}

interface NavigationContext {
  rootRef: Ref<HTMLElement | null>
  focusRef: Ref<string>
  focusValue: Ref<Timestamp>
  datesRef: Ref<Record<string, HTMLElement>>
  parsedView: Ref<string>
  emittedValue: Ref<string>
  direction: Ref<'next' | 'prev'>
  times: { today: Timestamp }
}

interface UseNavigationReturn {
  startNavigation: () => void
  endNavigation: () => void
  tryFocus: () => void
}

/**
 * Hook for handling keyboard navigation in calendar components.
 * @param props The props related to navigation.
 * @param context Various reactive references used for navigation.
 */
export default function useNavigation(
  props: NavigationProps & IntervalProps,
  {
    rootRef,
    focusRef,
    focusValue,
    datesRef,
    parsedView,
    emittedValue,
    direction,
    times,
  }: NavigationContext,
): UseNavigationReturn {
  let initialized = false

  onBeforeUnmount(() => {
    endNavigation()
  })

  watch(
    () => props.useNavigation,
    (val) => {
      if (val === true) {
        startNavigation()
      } else {
        endNavigation()
      }
    },
  )

  if (props.useNavigation === true) {
    startNavigation()
  }

  function startNavigation(): void {
    if (initialized) return
    if (document) {
      initialized = true
      document.addEventListener('keyup', onKeyUp)
      document.addEventListener('keydown', onKeyDown)
    }
  }

  function endNavigation(): void {
    if (document) {
      document.removeEventListener('keyup', onKeyUp)
      document.removeEventListener('keydown', onKeyDown)
      initialized = false
    }
  }

  function canNavigate(e?: Event): boolean {
    if (!e) return false
    if (document) {
      const el = document.activeElement as HTMLElement
      if (el !== document.body && rootRef.value?.contains(el)) {
        return true
      }
    }
    return false
  }

  function tryFocus(): void {
    let count = 0
    const interval = window.setInterval(() => {
      const focusElement = datesRef.value[focusRef.value]
      if (focusElement) {
        focusElement.focus()
        if (++count === 50 || document.activeElement === focusElement) {
          window.clearInterval(interval)
        }
      } else {
        window.clearInterval(interval)
      }
    }, 250)
  }

  function onKeyDown(e: KeyboardEvent): void {
    if (canNavigate(e) && isKeyCode(e, [33, 34, 35, 36, 37, 38, 39, 40])) {
      e.stopPropagation()
      e.preventDefault()
    }
  }

  function onKeyUp(e: KeyboardEvent): void {
    if (canNavigate(e) && isKeyCode(e, [33, 34, 35, 36, 37, 38, 39, 40])) {
      const keyActions: Record<number, () => void> = {
        33: onPgUp,
        34: onPgDown,
        35: onEnd,
        36: onHome,
        37: onLeftArrow,
        38: onUpArrow,
        39: onRightArrow,
        40: onDownArrow,
      }
      keyActions[e.keyCode]?.()
    }
  }

  function onUpArrow(): void {
    let tm = copyTimestamp(focusValue.value)
    if (parsedView.value === 'month') {
      tm = addToDate(tm, { day: -7 })
      if (focusValue.value.month !== tm.month) {
        direction.value = 'prev'
        emittedValue.value = tm.date
        return
      }
    } else {
      tm = addToDate(tm, { minute: Number(props.intervalMinutes) })
    }
    direction.value = 'prev'
    focusRef.value = tm.date
  }

  function onDownArrow(): void {
    let tm = copyTimestamp(focusValue.value)
    if (parsedView.value === 'month') {
      tm = addToDate(tm, { day: 7 })
      if (focusValue.value.month !== tm.month) {
        direction.value = 'next'
        emittedValue.value = tm.date
        return
      }
    } else {
      tm = addToDate(tm, { minute: Number(props.intervalMinutes) })
    }
    direction.value = 'next'
    focusRef.value = tm.date
  }

  function onLeftArrow(): void {
    let tm = copyTimestamp(focusValue.value)
    direction.value = 'prev'
    // Keep moving one day back until the day is allowed.
    do {
      tm = addToDate(tm, { day: -1 })
    } while (!props.weekdays.includes(Number(tm.weekday)))
    focusRef.value = tm.date
  }

  function onRightArrow(): void {
    let tm = copyTimestamp(focusValue.value)
    direction.value = 'next'
    // Keep moving one day forward until the day is allowed.
    do {
      tm = addToDate(tm, { day: 1 })
    } while (!props.weekdays.includes(Number(tm.weekday)))
    focusRef.value = tm.date
  }
  function onPgUp(): void {
    let tm = copyTimestamp(focusValue.value)
    tm = parsedView.value === 'month' ? addToDate(tm, { month: -1 }) : addToDate(tm, { day: -7 })
    direction.value = 'prev'
    focusRef.value = tm.date
  }

  function onPgDown(): void {
    let tm = copyTimestamp(focusValue.value)
    tm = parsedView.value === 'month' ? addToDate(tm, { month: 1 }) : addToDate(tm, { day: 7 })
    direction.value = 'next'
    focusRef.value = tm.date
  }

  function onHome(): void {
    let tm = copyTimestamp(focusValue.value)
    // For month view, start at the beginning of the month; for week view, get start of week.
    tm =
      parsedView.value === 'month'
        ? getStartOfMonth(tm)
        : getStartOfWeek(tm, props.weekdays || [], times.today)
    // If the computed start is not an allowed day, move backwards until you hit an allowed day.
    while (!props.weekdays.includes(Number(tm.weekday))) {
      tm = addToDate(tm, { day: -1 })
    }
    focusRef.value = tm.date
  }

  function onEnd(): void {
    let tm = copyTimestamp(focusValue.value)
    // For month view, get end of month; for week view, get end of week.
    tm =
      parsedView.value === 'month'
        ? getEndOfMonth(tm)
        : getEndOfWeek(tm, props.weekdays || [], times.today)
    // If the computed end is not an allowed day, move backwards until you hit an allowed day.
    while (!props.weekdays.includes(Number(tm.weekday))) {
      tm = addToDate(tm, { day: -1 })
    }
    focusRef.value = tm.date
  }
  return {
    startNavigation,
    endNavigation,
    tryFocus,
  }
}

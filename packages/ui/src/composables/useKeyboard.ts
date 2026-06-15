/* global document window */
import { nextTick, onBeforeUnmount, watch, Ref } from 'vue'
import useEvents from './useEvents'
import {
  addToDate,
  copyTimestamp,
  getStartOfMonth,
  getEndOfMonth,
  getStartOfWeek,
  getEndOfWeek,
} from '@timestamp-js/core'
import type { Timestamp } from '@timestamp-js/core'
import { type IntervalProps } from './useInterval'

const { isKeyCode } = useEvents()

interface NavigationInstance {
  rootRef: Ref<HTMLElement | null>
  keyboardActive?: Ref<boolean>
  onKeyDown: (_event: KeyboardEvent) => void
  onKeyUp: (_event: KeyboardEvent) => void
}

const navigationInstances = new Set<NavigationInstance>()
let activeNavigationInstance: NavigationInstance | null = null
let documentListenersAttached = false

function getDocument(): Document | undefined {
  return typeof document !== 'undefined' ? document : undefined
}

function getWindow(): Window | undefined {
  return typeof window !== 'undefined' ? window : undefined
}

function setActiveNavigationInstance(instance: NavigationInstance | null): void {
  if (activeNavigationInstance === instance) return

  if (activeNavigationInstance?.keyboardActive) {
    activeNavigationInstance.keyboardActive.value = false
  }

  activeNavigationInstance = instance

  if (activeNavigationInstance?.keyboardActive) {
    activeNavigationInstance.keyboardActive.value = true
  }
}

function findNavigationInstance(target: EventTarget | null): NavigationInstance | null {
  if (typeof Node !== 'undefined' && target instanceof Node) {
    for (const instance of navigationInstances) {
      if (instance.rootRef.value?.contains(target)) {
        return instance
      }
    }
  }

  return null
}

function refreshActiveNavigationInstance(): void {
  const documentRef = getDocument()
  setActiveNavigationInstance(findNavigationInstance(documentRef?.activeElement ?? null))
}

function onGlobalFocusIn(event: FocusEvent): void {
  setActiveNavigationInstance(findNavigationInstance(event.target))
}

function onGlobalKeyDown(event: KeyboardEvent): void {
  refreshActiveNavigationInstance()
  activeNavigationInstance?.onKeyDown(event)
}

function onGlobalKeyUp(event: KeyboardEvent): void {
  refreshActiveNavigationInstance()
  activeNavigationInstance?.onKeyUp(event)
}

function attachDocumentListeners(): void {
  const documentRef = getDocument()
  if (documentRef === undefined || documentListenersAttached === true) return

  documentRef.addEventListener('focusin', onGlobalFocusIn)
  documentRef.addEventListener('keydown', onGlobalKeyDown)
  documentRef.addEventListener('keyup', onGlobalKeyUp)
  documentListenersAttached = true
}

function detachDocumentListeners(): void {
  const documentRef = getDocument()
  if (documentRef === undefined || documentListenersAttached !== true) return

  documentRef.removeEventListener('focusin', onGlobalFocusIn)
  documentRef.removeEventListener('keydown', onGlobalKeyDown)
  documentRef.removeEventListener('keyup', onGlobalKeyUp)
  documentListenersAttached = false
}

function registerNavigationInstance(instance: NavigationInstance): void {
  navigationInstances.add(instance)
  attachDocumentListeners()
  refreshActiveNavigationInstance()
}

function unregisterNavigationInstance(instance: NavigationInstance): void {
  navigationInstances.delete(instance)

  if (activeNavigationInstance === instance) {
    setActiveNavigationInstance(null)
    refreshActiveNavigationInstance()
  } else if (instance.keyboardActive) {
    instance.keyboardActive.value = false
  }

  if (navigationInstances.size === 0) {
    detachDocumentListeners()
  }
}

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
  keyboardActive?: Ref<boolean>
  focusRef: Ref<string>
  focusValue: Ref<Timestamp>
  datesRef: Ref<Record<string, HTMLElement>>
  parsedView: Ref<string>
  emittedValue: Ref<string>
  direction: Ref<'next' | 'prev'>
  times: { today: Timestamp }
  [key: string]: unknown
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
    keyboardActive,
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
  let focusRetryHandle: number | null = null
  let focusRetryToken = 0

  const navigationInstance: NavigationInstance = {
    rootRef,
    keyboardActive,
    onKeyDown,
    onKeyUp,
  }

  onBeforeUnmount(() => {
    cancelFocusRetry()
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
    if (getDocument() !== undefined) {
      initialized = true
      registerNavigationInstance(navigationInstance)
    }
  }

  function endNavigation(): void {
    if (getDocument() !== undefined) {
      unregisterNavigationInstance(navigationInstance)
      initialized = false
    }
  }

  function canNavigate(e?: Event): boolean {
    if (!e) return false
    const documentRef = getDocument()
    if (documentRef) {
      const el = documentRef.activeElement as HTMLElement
      if (el !== documentRef.body && rootRef.value?.contains(el)) {
        return true
      }
    }
    return false
  }

  function tryFocus(): void {
    cancelFocusRetry()

    let count = 0
    const token = ++focusRetryToken
    const focus = (): void => {
      focusRetryHandle = null

      if (token !== focusRetryToken) return

      count += 1
      const focusElement = datesRef.value[focusRef.value]
      if (focusElement) {
        focusElement.focus()
        if (count === 50 || getDocument()?.activeElement === focusElement) {
          cancelFocusRetry()
          return
        }
      }

      if (count < 50) {
        scheduleFocusRetry(focus)
      }
    }

    void nextTick(focus)
  }

  function scheduleFocusRetry(callback: () => void): void {
    const windowRef = getWindow()
    focusRetryHandle =
      windowRef?.requestAnimationFrame !== undefined
        ? windowRef.requestAnimationFrame(callback)
        : Number(setTimeout(callback, 16))
  }

  function cancelFocusRetry(): void {
    focusRetryToken += 1

    if (focusRetryHandle === null) return

    const windowRef = getWindow()
    if (windowRef?.cancelAnimationFrame !== undefined) {
      windowRef.cancelAnimationFrame(focusRetryHandle)
    } else {
      clearTimeout(focusRetryHandle)
    }
    focusRetryHandle = null
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

/* global document window */
import { nextTick, onBeforeUnmount, watch, Ref } from 'vue'
import useEvents from './useEvents'
import {
  addToDate,
  copyTimestamp,
  parseTimestamp,
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

  function tryFocus(value = focusRef.value): void {
    cancelFocusRetry()

    let count = 0
    const token = ++focusRetryToken
    const focus = (): void => {
      focusRetryHandle = null

      if (token !== focusRetryToken) return

      count += 1
      const focusElement = getFocusElement(value)
      if (focusElement) {
        focusRef.value = value
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

  function getFocusDate(value: string): string | undefined {
    return value.match(/^\d{4}-\d{2}-\d{2}/)?.[0]
  }

  function getFocusTime(value: string): string | undefined {
    return value.match(/^\d{4}-\d{2}-\d{2} (\d{2}:\d{2})/)?.[1]
  }

  function applyFocusTime(timestamp: Timestamp, value: string): Timestamp {
    const time = getFocusTime(value)
    if (!time) {
      return timestamp
    }

    const [hour, minute] = time.split(':').map(Number)

    return {
      ...timestamp,
      time,
      hour,
      minute,
      hasTime: true,
    }
  }

  function getFocusElement(value = focusRef.value): HTMLElement | undefined {
    const directFocusElement = datesRef.value[value]
    if (directFocusElement) {
      return directFocusElement
    }

    const focusDate = getFocusDate(value)
    if (!focusDate) {
      return undefined
    }

    const hasTimeSuffix = value.slice(focusDate.length).startsWith(' ')
    const prefixes = hasTimeSuffix
      ? [`${focusDate} `, `${focusDate}-`]
      : [`${focusDate}-`, `${focusDate} `]

    for (const prefix of prefixes) {
      const key = Object.keys(datesRef.value).find((dateRef) => dateRef.startsWith(prefix))
      if (key) {
        return datesRef.value[key]
      }
    }

    return undefined
  }

  function getFocusableTimestamp(): Timestamp {
    const focusTimestamp = parseFocusTimestamp(focusRef.value)
    if (focusTimestamp) {
      return applyFocusTime(focusTimestamp, focusRef.value)
    }

    const refDate = getFocusDate(focusRef.value)
    if (refDate) {
      const timestamp = parseFocusTimestamp(refDate)
      if (timestamp) {
        return applyFocusTime(timestamp, focusRef.value)
      }
    }

    if (isValidTimestamp(focusValue.value)) {
      return copyTimestamp(focusValue.value)
    }

    return copyTimestamp(times.today)
  }

  function parseFocusTimestamp(value: string): Timestamp | null {
    const timestamp = parseTimestamp(value)
    return timestamp ? copyTimestamp(timestamp as Timestamp) : null
  }

  function isValidTimestamp(timestamp: Timestamp | null | undefined): timestamp is Timestamp {
    return (
      timestamp !== null &&
      timestamp !== undefined &&
      typeof timestamp.date === 'string' &&
      /^\d{4}-\d{2}-\d{2}$/.test(timestamp.date) &&
      Number.isFinite(timestamp.year) &&
      Number.isFinite(timestamp.month) &&
      Number.isFinite(timestamp.day)
    )
  }

  function getFocusKey(timestamp: Timestamp): string {
    const currentDate = getFocusDate(focusRef.value)
    const suffix = currentDate ? focusRef.value.slice(currentDate.length) : ''

    if (suffix.startsWith(' ') && timestamp.time) {
      return `${timestamp.date} ${timestamp.time}`
    }

    return suffix ? timestamp.date + suffix : timestamp.date
  }

  function setFocusTimestamp(timestamp: Timestamp): void {
    const candidate = getFocusKey(timestamp)

    const focusKey =
      datesRef.value[candidate] !== undefined || candidate.includes(' ')
        ? candidate
        : timestamp.date

    focusRef.value = focusKey

    void nextTick(() => {
      const focusElement = getFocusElement(focusKey)
      if (focusElement) {
        focusRef.value = focusKey
        focusElement.focus()
      } else {
        tryFocus(focusKey)
      }
    })
  }

  function isEnabledWeekday(timestamp: Timestamp): boolean {
    return props.weekdays.length === 0 || props.weekdays.includes(Number(timestamp.weekday))
  }

  function moveToEnabledWeekday(timestamp: Timestamp, amount: 1 | -1): Timestamp {
    let tm = timestamp

    for (let i = 0; i < 7 && !isEnabledWeekday(tm); i += 1) {
      tm = addToDate(tm, { day: amount })
    }

    return tm
  }

  function isWeekView(): boolean {
    return ['week', 'week-agenda', 'week-scheduler'].includes(parsedView.value)
  }

  function updateWeekBoundaryModelValue(from: Timestamp, to: Timestamp): void {
    if (!isWeekView()) return

    const start = getStartOfWeek(from, props.weekdays || [], times.today)
    const end = getEndOfWeek(from, props.weekdays || [], times.today)

    if (to.date < start.date || to.date > end.date) {
      emittedValue.value = to.date
    }
  }

  function updateModelValueWhenFocusIsOutsideRenderedDates(timestamp: Timestamp): void {
    if (getFocusElement(getFocusKey(timestamp)) === undefined) {
      emittedValue.value = timestamp.date
    }
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
    const current = getFocusableTimestamp()
    let tm = current
    if (parsedView.value === 'month') {
      const month = tm.month
      tm = addToDate(tm, { day: -7 })
      if (month !== tm.month) {
        direction.value = 'prev'
        emittedValue.value = tm.date
        setFocusTimestamp(tm)
        return
      }
    } else {
      tm = addToDate(tm, { minute: -Number(props.intervalMinutes) })
      if (tm.date !== current.date) {
        tm = moveToEnabledWeekday(tm, -1)
      }
    }
    direction.value = 'prev'
    updateWeekBoundaryModelValue(current, tm)
    updateModelValueWhenFocusIsOutsideRenderedDates(tm)
    setFocusTimestamp(tm)
  }

  function onDownArrow(): void {
    const current = getFocusableTimestamp()
    let tm = current
    if (parsedView.value === 'month') {
      const month = tm.month
      tm = addToDate(tm, { day: 7 })
      if (month !== tm.month) {
        direction.value = 'next'
        emittedValue.value = tm.date
        setFocusTimestamp(tm)
        return
      }
    } else {
      tm = addToDate(tm, { minute: Number(props.intervalMinutes) })
      if (tm.date !== current.date) {
        tm = moveToEnabledWeekday(tm, 1)
      }
    }
    direction.value = 'next'
    updateWeekBoundaryModelValue(current, tm)
    updateModelValueWhenFocusIsOutsideRenderedDates(tm)
    setFocusTimestamp(tm)
  }

  function onLeftArrow(): void {
    const current = getFocusableTimestamp()
    let tm = current
    direction.value = 'prev'
    tm = moveToEnabledWeekday(addToDate(tm, { day: -1 }), -1)
    updateWeekBoundaryModelValue(current, tm)
    updateModelValueWhenFocusIsOutsideRenderedDates(tm)
    setFocusTimestamp(tm)
  }

  function onRightArrow(): void {
    const current = getFocusableTimestamp()
    let tm = current
    direction.value = 'next'
    tm = moveToEnabledWeekday(addToDate(tm, { day: 1 }), 1)
    updateWeekBoundaryModelValue(current, tm)
    updateModelValueWhenFocusIsOutsideRenderedDates(tm)
    setFocusTimestamp(tm)
  }
  function onPgUp(): void {
    let tm = getFocusableTimestamp()
    tm = parsedView.value === 'month' ? addToDate(tm, { month: -1 }) : addToDate(tm, { day: -7 })
    direction.value = 'prev'
    setFocusTimestamp(tm)
  }

  function onPgDown(): void {
    let tm = getFocusableTimestamp()
    tm = parsedView.value === 'month' ? addToDate(tm, { month: 1 }) : addToDate(tm, { day: 7 })
    direction.value = 'next'
    setFocusTimestamp(tm)
  }

  function onHome(): void {
    let tm = getFocusableTimestamp()
    // For month view, start at the beginning of the month; for week view, get start of week.
    tm =
      parsedView.value === 'month'
        ? getStartOfMonth(tm)
        : getStartOfWeek(tm, props.weekdays || [], times.today)
    tm = moveToEnabledWeekday(tm, 1)
    setFocusTimestamp(tm)
  }

  function onEnd(): void {
    let tm = getFocusableTimestamp()
    // For month view, get end of month; for week view, get end of week.
    tm =
      parsedView.value === 'month'
        ? getEndOfMonth(tm)
        : getEndOfWeek(tm, props.weekdays || [], times.today)
    tm = moveToEnabledWeekday(tm, -1)
    setFocusTimestamp(tm)
  }
  return {
    startNavigation,
    endNavigation,
    tryFocus,
  }
}

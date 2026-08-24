/* global document window */
import { getCurrentInstance, nextTick, onBeforeUnmount, watch, Ref } from 'vue'
import useEvents from './useEvents'
import {
  addToDate,
  copyTimestamp,
  parseCalendarTimestamp,
  getStartOfMonth,
  getEndOfMonth,
  getStartOfWeek,
  getEndOfWeek,
  type CalendarSystem,
} from '@timestamp-js/core'
import type { Timestamp } from '@timestamp-js/core'
import { toCalendarTimestamp } from '../utils/calendarSystem'

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
  /**
   * Enables keyboard navigation for supported calendar cells.
   *
   * @category behavior
   */
  useNavigation: Boolean,
}

export interface NavigationProps {
  useNavigation: boolean
  weekdays: number[]
  intervalMinutes?: number | string
  calendarSystem: CalendarSystem
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
  scrollFocusedElementIntoView?: (element: HTMLElement) => void
  limitNavigationToRenderedIntervals?: boolean
  [key: string]: unknown
}

interface UseNavigationReturn {
  startNavigation: () => void
  endNavigation: () => void
  tryFocus: () => void
}

/**
 * Hook for handling keyboard navigation in calendar components.
 * @param props The props related to behavior.
 * @param context Various reactive references used for behavior.
 */
export default function useNavigation(
  props: NavigationProps,
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
    scrollFocusedElementIntoView,
    limitNavigationToRenderedIntervals,
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

  if (getCurrentInstance() !== null) {
    onBeforeUnmount(() => {
      cancelFocusRetry()
      endNavigation()
    })
  }

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

  watch(focusValue, () => {
    if (canRestoreFocus() !== true) return

    const focusElement = focusRef.value ? datesRef.value[focusRef.value] : undefined

    if (focusElement) {
      focusWithoutScrolling(focusElement)
    } else {
      tryFocus()
    }
  })

  watch(
    () => keyboardActive?.value,
    (active) => {
      if (active !== true) {
        cancelFocusRetry()
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

  function canRestoreFocus(): boolean {
    return props.useNavigation === true && keyboardActive?.value === true
  }

  function focusWithoutScrolling(element: HTMLElement): void {
    element.focus({ preventScroll: true })
    if (scrollFocusedElementIntoView) {
      scrollFocusedElementIntoView(element)
    } else {
      scrollFocusedElementIntoCalendarView(element)
    }
  }

  function scrollFocusedElementIntoCalendarView(element: HTMLElement): void {
    const area = element.closest<HTMLElement>('.q-calendar__scroll')
    if (!area || rootRef.value?.contains(area) !== true) return

    const areaRect = area.getBoundingClientRect()
    const elementRect = element.getBoundingClientRect()
    let visibleLeft = areaRect.left

    rootRef.value.querySelectorAll<HTMLElement>('.q-calendar__sticky').forEach((sticky) => {
      const stickyRect = sticky.getBoundingClientRect()
      const overlapsFocusedRow =
        stickyRect.top < elementRect.bottom && stickyRect.bottom > elementRect.top

      if (
        overlapsFocusedRow &&
        stickyRect.left <= areaRect.left + 1 &&
        stickyRect.right > visibleLeft &&
        stickyRect.right < areaRect.right
      ) {
        visibleLeft = stickyRect.right
      }
    })

    if (elementRect.left < visibleLeft) {
      area.scrollLeft += elementRect.left - visibleLeft
    } else if (elementRect.right > areaRect.right) {
      area.scrollLeft += elementRect.right - areaRect.right
    }
  }

  function tryFocus(value = focusRef.value): void {
    cancelFocusRetry()
    if (canRestoreFocus() !== true) return

    let count = 0
    const token = ++focusRetryToken
    const focus = (): void => {
      focusRetryHandle = null

      if (token !== focusRetryToken || canRestoreFocus() !== true) return

      count += 1
      const focusElement = getFocusElement(value)
      if (focusElement) {
        focusRef.value = value
        focusWithoutScrolling(focusElement)
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

    const [hour = timestamp.hour, minute = timestamp.minute] = time.split(':').map(Number)

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

    return copyTimestamp(toCalendarTimestamp(times.today, props.calendarSystem))
  }

  function parseFocusTimestamp(value: string): Timestamp | null {
    const timestamp = parseCalendarTimestamp(value, props.calendarSystem)
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
      const targetIdentity = suffix.slice(6)
      return `${timestamp.date} ${timestamp.time}${targetIdentity}`
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
      if (canRestoreFocus() !== true) return

      const focusElement = getFocusElement(focusKey)
      if (focusElement) {
        focusRef.value = focusKey
        focusWithoutScrolling(focusElement)
      } else {
        tryFocus(focusKey)
      }
    })
  }

  function resolveRenderedInterval(
    current: Timestamp,
    target: Timestamp,
    amount: 1 | -1,
  ): Timestamp | null {
    const focusTime = getFocusTime(focusRef.value)
    if (
      limitNavigationToRenderedIntervals !== true ||
      focusTime === undefined ||
      datesRef.value[getFocusKey(target)] !== undefined
    ) {
      return target
    }

    const currentDate = getFocusDate(focusRef.value)
    if (!currentDate) return null

    const targetIdentity = focusRef.value.slice(currentDate.length + 6)
    const renderedTimes = Object.keys(datesRef.value)
      .filter((key) => {
        const keyDate = getFocusDate(key)
        const keyTime = getFocusTime(key)
        return (
          keyDate === current.date &&
          keyTime !== undefined &&
          key.slice(keyDate.length + 6) === targetIdentity
        )
      })
      .map((key) => getFocusTime(key) as string)
      .sort()

    const boundaryTime = amount === 1 ? renderedTimes[0] : renderedTimes.at(-1)
    if (!boundaryTime) return null

    const boundaryDate = moveToEnabledWeekday(
      addToDate(current, { day: amount }, props.calendarSystem),
      amount,
    )
    return applyFocusTime(boundaryDate, `${boundaryDate.date} ${boundaryTime}`)
  }

  function isEnabledWeekday(timestamp: Timestamp): boolean {
    return props.weekdays.length === 0 || props.weekdays.includes(Number(timestamp.weekday))
  }

  function moveToEnabledWeekday(timestamp: Timestamp, amount: 1 | -1): Timestamp {
    let tm = timestamp

    for (let i = 0; i < 7 && !isEnabledWeekday(tm); i += 1) {
      tm = addToDate(tm, { day: amount }, props.calendarSystem)
    }

    return tm
  }

  function isWeekView(): boolean {
    return ['week', 'week-agenda', 'week-scheduler'].includes(parsedView.value)
  }

  function updateWeekBoundaryModelValue(from: Timestamp, to: Timestamp): void {
    if (!isWeekView()) return

    const calendarToday = toCalendarTimestamp(times.today, props.calendarSystem)
    const start = getStartOfWeek(from, props.weekdays || [], calendarToday, props.calendarSystem)
    const end = getEndOfWeek(from, props.weekdays || [], calendarToday, props.calendarSystem)

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
      tm = addToDate(tm, { day: -7 }, props.calendarSystem)
      if (month !== tm.month) {
        direction.value = 'prev'
        emittedValue.value = tm.date
        setFocusTimestamp(tm)
        return
      }
    } else {
      tm = addToDate(tm, { minute: -Number(props.intervalMinutes ?? 60) }, props.calendarSystem)
      if (tm.date !== current.date) {
        tm = moveToEnabledWeekday(tm, -1)
      }
    }
    const renderedTarget = resolveRenderedInterval(current, tm, -1)
    if (!renderedTarget) return
    tm = renderedTarget
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
      tm = addToDate(tm, { day: 7 }, props.calendarSystem)
      if (month !== tm.month) {
        direction.value = 'next'
        emittedValue.value = tm.date
        setFocusTimestamp(tm)
        return
      }
    } else {
      tm = addToDate(tm, { minute: Number(props.intervalMinutes ?? 60) }, props.calendarSystem)
      if (tm.date !== current.date) {
        tm = moveToEnabledWeekday(tm, 1)
      }
    }
    const renderedTarget = resolveRenderedInterval(current, tm, 1)
    if (!renderedTarget) return
    tm = renderedTarget
    direction.value = 'next'
    updateWeekBoundaryModelValue(current, tm)
    updateModelValueWhenFocusIsOutsideRenderedDates(tm)
    setFocusTimestamp(tm)
  }

  function onLeftArrow(): void {
    const current = getFocusableTimestamp()
    let tm = current
    direction.value = 'prev'
    tm = moveToEnabledWeekday(addToDate(tm, { day: -1 }, props.calendarSystem), -1)
    updateWeekBoundaryModelValue(current, tm)
    updateModelValueWhenFocusIsOutsideRenderedDates(tm)
    setFocusTimestamp(tm)
  }

  function onRightArrow(): void {
    const current = getFocusableTimestamp()
    let tm = current
    direction.value = 'next'
    tm = moveToEnabledWeekday(addToDate(tm, { day: 1 }, props.calendarSystem), 1)
    updateWeekBoundaryModelValue(current, tm)
    updateModelValueWhenFocusIsOutsideRenderedDates(tm)
    setFocusTimestamp(tm)
  }
  function onPgUp(): void {
    let tm = getFocusableTimestamp()
    tm =
      parsedView.value === 'month'
        ? addToDate(tm, { month: -1 }, props.calendarSystem)
        : addToDate(tm, { day: -7 }, props.calendarSystem)
    direction.value = 'prev'
    updateModelValueWhenFocusIsOutsideRenderedDates(tm)
    setFocusTimestamp(tm)
  }

  function onPgDown(): void {
    let tm = getFocusableTimestamp()
    tm =
      parsedView.value === 'month'
        ? addToDate(tm, { month: 1 }, props.calendarSystem)
        : addToDate(tm, { day: 7 }, props.calendarSystem)
    direction.value = 'next'
    updateModelValueWhenFocusIsOutsideRenderedDates(tm)
    setFocusTimestamp(tm)
  }

  function onHome(): void {
    let tm = getFocusableTimestamp()
    // For month display, start at the beginning of the month; for week display, get start of week.
    tm =
      parsedView.value === 'month'
        ? getStartOfMonth(tm, props.calendarSystem)
        : getStartOfWeek(
            tm,
            props.weekdays || [],
            toCalendarTimestamp(times.today, props.calendarSystem),
            props.calendarSystem,
          )
    tm = moveToEnabledWeekday(tm, 1)
    updateModelValueWhenFocusIsOutsideRenderedDates(tm)
    setFocusTimestamp(tm)
  }

  function onEnd(): void {
    let tm = getFocusableTimestamp()
    // For month display, get end of month; for week display, get end of week.
    tm =
      parsedView.value === 'month'
        ? getEndOfMonth(tm, props.calendarSystem)
        : getEndOfWeek(
            tm,
            props.weekdays || [],
            toCalendarTimestamp(times.today, props.calendarSystem),
            props.calendarSystem,
          )
    tm = moveToEnabledWeekday(tm, -1)
    updateModelValueWhenFocusIsOutsideRenderedDates(tm)
    setFocusTimestamp(tm)
  }
  return {
    startNavigation,
    endNavigation,
    tryFocus,
  }
}

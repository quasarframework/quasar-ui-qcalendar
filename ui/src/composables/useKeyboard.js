import {
  onBeforeUnmount,
  watch
} from 'vue'

import useEvents from './useEvents.js'
const { isKeyCode } = useEvents()

import {
  addToDate,
  copyTimestamp,
  // updateRelative,
  getStartOfMonth,
  getEndOfMonth,
  getStartOfWeek,
  getEndOfWeek
} from '../utils/Timestamp.js'

export const useNavigationProps = {
  useNavigation: Boolean
}

export default function (props, {
  rootRef,
  focusRef,
  focusValue,
  days,
  parsedView,
  parsedValue,
  emittedValue,
  weekdaySkips,
  direction,
  times
}) {
  // pgUp -> 33, pgDown -> 34, end -> 35, home -> 36
  // left -> 37, up -> 38, right -> 39, down -> 40
  // space -> 32, enter -> 13

  let initialized = false

  onBeforeUnmount(() => {
    endNavigation()
  })

  watch(() => props.useNavigation, val => {
    if (val === true) {
      startNavigation()
    }
    else {
      endNavigation()
    }
  })

  // check at start up what should be happening
  if (props.useNavigation === true) {
    startNavigation()
  }

  // start keyup/keydown listeners
  function startNavigation () {
    if (initialized === true) return
    if (document) {
      initialized = true
      document.addEventListener('keyup', onKeyUp)
      document.addEventListener('keydown', onKeyDown)
    }
  }

  // end keyup/keydown listeners
  function endNavigation () {
    if (document) {
      document.removeEventListener('keyup', onKeyUp)
      document.removeEventListener('keydown', onKeyDown)
      initialized = false
    }
  }

  function canNavigate (e) {
    if (e === void 0) {
      return false
    }

    // if (e.defaultPrevented === true) {
    //   return false
    // }

    if (document) {
      const el = document.activeElement
      if (el !== document.body
        && rootRef.value.contains(el) === true
        // required for iOS and desktop Safari
        // && el.contains(rootRef.value) === false
      ) {
        return true
      }
    }

    return false
  }

  function onKeyDown (e) {
    if (canNavigate(e) && isKeyCode(e, [ 33, 34, 35, 36, 37, 38, 39, 40 ])) {
      e.stopPropagation()
      e.preventDefault()
    }
  }

  function onKeyUp (e) {
    if (canNavigate(e) && isKeyCode(e, [ 33, 34, 35, 36, 37, 38, 39, 40 ])) {
      switch (e.keyCode) {
        case 33:
          onPgUp(e)
          break
        case 34:
          onPgDown(e)
          break
        case 35:
          onEnd(e)
          break
        case 36:
          onHome(e)
          break
        case 37:
          onLeftArrow(e)
          break
        case 38:
          onUpArrow(e)
          break
        case 39:
          onRightArrow(e)
          break
        case 40:
          onDownArrow(e)
          break
      }
    }
  }

  function onUpArrow (e) {
    let tm = copyTimestamp(focusValue.value)
    console.log(tm)

    if (parsedView.value === 'month') {
      tm = addToDate(tm, { day: -7 })
      if (focusValue.value.month !== tm.month) {
        direction.value = 'prev'
        emittedValue.value = tm.date
        return
      }
    }
    else if (parsedView.value === 'day'
      || parsedView.value === 'week'
      || parsedView.value === 'month-interval') {
      tm = addToDate(tm, { minute: parseInt(props.intervalMinutes) })
    }

    direction.value = 'prev'
    // emittedValue.value = tm.date
    focusRef.value = tm.date
  }

  function onDownArrow (e) {
    let tm = copyTimestamp(focusValue.value)
    console.log(tm)

    if (parsedView.value === 'month') {
      tm = addToDate(tm, { day: 7 })
      if (focusValue.value.month !== tm.month) {
        direction.value = 'next'
        emittedValue.value = tm.date
        return
      }
    }
    else if (parsedView.value === 'day'
      || parsedView.value === 'week'
      || parsedView.value === 'month-interval') {
      tm = addToDate(tm, { minute: parseInt(props.intervalMinutes) })
    }

    direction.value = 'next'
    // emittedValue.value = tm.date
    focusRef.value = tm.date
  }

  /**
   * Sets focus on previous day. Takes into account weekdaySkips. Applies to all calendars.
   * @param {KeyboardEvent} e
   */
  function onLeftArrow (e) {
    let tm = copyTimestamp(focusValue.value)
    direction.value = 'prev'

    do {
      tm = addToDate(tm, { day: -1 })
    } while (weekdaySkips.value[ tm.weekday ] === 0)

    if (parsedView.value === 'month'
      || parsedView.value === 'month-interval') {
      if (focusValue.value.month !== tm.month) {
        emittedValue.value = tm.date
        return
      }
    }
    else if (parsedView.value === 'week') {
      if (tm.weekday > focusValue.value.weekday) {
        emittedValue.value = tm.date
        return
      }
    }
    else if (parsedView.value === 'day') {
      emittedValue.value = tm.date
      return
    }

    focusRef.value = tm.date
  }

  /**
   * Sets focus on next day. Takes into account weekdaySkips. Applies to all calendars.
   * @param {KeyboardEvent} e
   */
  function onRightArrow (e) {
    let tm = copyTimestamp(focusValue.value)
    direction.value = 'next'

    do {
      tm = addToDate(tm, { day: 1 })
    } while (weekdaySkips.value[ tm.weekday ] === 0)

    if (parsedView.value === 'month'
      || parsedView.value === 'month-interval') {
      if (focusValue.value.month !== tm.month) {
        emittedValue.value = tm.date
        return
      }
    }
    else if (parsedView.value === 'week') {
      if (tm.weekday < focusValue.value.weekday) {
        emittedValue.value = tm.date
        return
      }
    }
    else if (parsedView.value === 'day') {
      emittedValue.value = tm.date
      return
    }

    focusRef.value = tm.date
  }

  function onPgUp (e) {
    let tm = copyTimestamp(focusValue.value)

    if (parsedView.value === 'month'
      || parsedView.value === 'month-interval') {
      tm = addToDate(tm, { month: -1 })
      const next = tm.day <= 15 ? 1 : -1
      while (weekdaySkips.value[ tm.weekday ] === 0) {
        tm = addToDate(tm, { day: next })
      }
    }
    else if (parsedView.value === 'day') {
      tm = addToDate(tm, { day: -1 })
    }
    else if (parsedView.value === 'week') {
      tm = addToDate(tm, { day: -7 })
    }

    direction.value = 'prev'
    // emittedValue.value = tm.date
    focusRef.value = tm.date
  }

  function onPgDown (e) {
    let tm = copyTimestamp(focusValue.value)

    if (parsedView.value === 'month'
      || parsedView.value === 'month-interval') {
      tm = addToDate(tm, { month: 1 })
      const next = tm.day <= 15 ? 1 : -1
      while (weekdaySkips.value[ tm.weekday ] === 0) {
        tm = addToDate(tm, { day: next })
      }
    }
    else if (parsedView.value === 'day') {
      tm = addToDate(tm, { day: 1 })
    }
    else if (parsedView.value === 'week') {
      tm = addToDate(tm, { day: 7 })
    }

    direction.value = 'next'
    // emittedValue.value = tm.date
    focusRef.value = tm.date
  }

  function onHome (e) {
    let tm = copyTimestamp(focusValue.value)

    if (parsedView.value === 'month'
      || parsedView.value === 'month-interval') {
      tm = getStartOfMonth(tm)
    }
    else if (parsedView.value === 'week') {
      tm = getStartOfWeek(tm, props.weekdays, times.today)
    }

    while (weekdaySkips.value[ tm.weekday ] === 0) {
      tm = addToDate(tm, { day: -1 })
    }

    // emittedValue.value = tm.date
    focusRef.value = tm.date
  }

  function onEnd (e) {
    let tm = copyTimestamp(focusValue.value)

    if (parsedView.value === 'month'
    || parsedView.value === 'month-interval') {
      tm = getEndOfMonth(tm)
    }
    else if (parsedView.value === 'week') {
      tm = getEndOfWeek(tm, props.weekdays, times.today)
    }

    while (weekdaySkips.value[ tm.weekday ] === 0) {
      tm = addToDate(tm, { day: -1 })
    }

    // emittedValue.value = tm.date
    focusRef.value = tm.date
  }

  return {
    startNavigation,
    endNavigation
  }
}

import {
  DAYS_IN_MONTH_MAX,
  DAY_MIN,
  addToDate,
  copyTimestamp,
  relativeDays,
  updateDayOfYear,
  updateFormatted,
  updateRelative,
  updateWeekday,
  nextDay,
  prevDay,
  today
} from '../utils/Timestamp'

export const useMoveEmits = [
  'moved'
]

/**
 * export of default funtion
 * @param {Object} props object passed to 'setup' function
 */

/**
 * export of default funtion
 * @param {Object} props object passed to 'setup' function
 * @param {Object} param object containing various needed values and functions
 * @param {String} param.view the calendar view
 * @param {import('vue').Ref} param.parsedValue computed value (YYYY-YY-MM)
 * @param {Array} param.weekdaySkips an array of 1's and 0's representing if a day is on/off
 * @param {Number} param.maxDays comes from props.maxDays, not applicable for week or month views
 * @param {import('vue').ReactiveEffect} param.times reactive object
 * @param {Timestamp} param.times.today
 * @param {Timestamp} param.times.now
 * @param {import('vue').Ref} param.emittedValue reactive sting that is emitted when changed (YYYY-MM-DD)
 * @param {Function} param.emit Vue emit function
 * @param param.parsedView
 * @param param.direction
 */
export default function (props, {
  parsedView,
  parsedValue,
  weekdaySkips,
  direction,
  maxDays,
  times,
  emittedValue,
  emit
}) {
  /**
   * Moves the calendar the desired amount. This is based on the 'view'.
   * A month calendar moves by prev/next month
   * A week calendar moves by prev/next week
   * Other considerations are the 'weekdaySkips'; if a day of the week shoud be displayed (ie: weekends turned off)
   * @param {Number} amount
   * @fires 'moved' with current Timestamp
   */
  function move (amount = 1) {
    if (amount === 0) {
      emittedValue.value = today()
      return
    }
    let moved = copyTimestamp(parsedValue.value)
    const forward = amount > 0
    const mover = forward ? nextDay : prevDay
    const limit = forward ? DAYS_IN_MONTH_MAX : DAY_MIN
    let count = forward ? amount : -amount
    direction.value = forward ? 'next' : 'prev'
    const dayCount = weekdaySkips.value.filter(x => x !== 0).length

    while (--count >= 0) {
      switch (parsedView.value) {
        case 'month':
          moved.day = limit
          mover(moved)
          updateWeekday(moved)
          while (weekdaySkips.value[ moved.weekday ] === 0) {
            moved = addToDate(moved, { day: forward === true ? 1 : -1 })
          }
          break
        case 'week':
        case 'week-agenda':
        case 'week-scheduler':
          relativeDays(moved, mover, dayCount, props.weekdays)
          break
        case 'day':
        case 'scheduler':
        case 'agenda':
          relativeDays(moved, mover, maxDays.value, props.weekdays)
          break
        case 'month-interval':
        case 'month-agenda':
        case 'month-scheduler':
          moved.day = limit
          mover(moved)
          break
        case 'resource':
          relativeDays(moved, mover, maxDays.value, props.weekdays)
          break
      }
    }

    updateWeekday(moved)
    updateFormatted(moved)
    updateDayOfYear(moved)
    updateRelative(moved, times.now)

    emittedValue.value = moved.date
    emit('moved', moved)
  }

  return {
    move
  }
}

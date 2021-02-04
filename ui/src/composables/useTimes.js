import { reactive, computed, watch } from 'vue'
import {
  validateTimestamp,
  parseTimestamp,
  parseDate
} from '../utils/Timestamp.js'

/**
 * export of useTimesProps
 * @returns 'now' property
 */
export const useTimesProps = {
  now: {
    type: String,
    validator: v => v === '' || validateTimestamp(v),
    default: ''
  }
}

/**
 * export of default funtion
 * @param {Object} props object passed to 'setup' function
 */
export default function (props) {
  /**
   * 'times' is a reactive object containing 'now' and 'today'
   */
  const times = reactive({
    now: parseTimestamp('0000-00-00 00:00'),
    today: parseTimestamp('0000-00-00')
  })

  /**
   * parsedNow is a computed property based on 'props.now' or current date
   */
  const parsedNow = computed(() => (props.now ? parseTimestamp(props.now) : getNow()))

  /**
   * watcher if parsedNow should change
   */
  watch(() => parsedNow, val => updateCurrent(val))

  /**
   * sets 'times.now' (relative) to 'times.today' (relative)
   */
  function setCurrent () {
    times.now.current = times.today.current = true
    times.now.past = times.today.past = false
    times.now.future = times.today.future = false
  }

  /**
   * updates current dates
   */
  function updateCurrent () {
    const now = parsedNow.value || getNow()
    updateDay(now, times.now)
    updateTime(now, times.now)
    updateDay(now, times.today)
  }

  /**
   * return 'Timestamp' with current date and time
   */
  function getNow () {
    return parseDate(new Date())
  }

  /**
   * Updates target timestamp date info with now timestamp date info
   * @param {Timestamp} now
   * @param {Timestamp} target
   */
  function updateDay (now, target) {
    if (now.date !== target.date) {
      target.year = now.year
      target.month = now.month
      target.day = now.day
      target.weekday = now.weekday
      target.date = now.date
    }
  }

  /**
   * Updates target timestamp times with now timestamp times
   * @param {Timestamp} now
   * @param {Timestamp} target
   */
  function updateTime (now, target) {
    if (now.time !== target.time) {
      target.hour = now.hour
      target.minute = now.minute
      target.time = now.time
    }
  }

  return {
    times,
    parsedNow,
    setCurrent,
    updateCurrent,
    getNow,
    updateDay,
    updateTime
  }
}

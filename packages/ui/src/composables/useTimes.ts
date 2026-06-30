import { reactive, computed, watch, ComputedRef, Reactive } from 'vue'
import {
  copyTimestamp,
  validateTimestamp,
  parseTimestamp,
  parseCalendarTimestamp,
  parseDate,
  type CalendarSystem,
  type Timestamp,
} from '@timestamp-js/core'

/**
 * export of useTimesProps
 */
export const useTimesProps = {
  /**
   * Current timestamp override used for deterministic current-time rendering.
   *
   * @category behavior
   */
  now: {
    type: String,
    validator: (v: string): boolean => v === '' || validateTimestamp(v),
    default: '',
  },
}

export interface TimesProps {
  now: string
  calendarSystem: CalendarSystem
}

interface UseTimesReturn {
  times: Reactive<{
    now: Timestamp
    today: Timestamp
  }>
  parsedNow: ComputedRef<Timestamp>
  setCurrent: () => void
  updateCurrent: () => void
  getNow: () => Timestamp
  updateDay: (_now: Timestamp, _target: Timestamp) => Timestamp
  updateTime: (_now: Timestamp, _target: Timestamp) => Timestamp
}

/**
 * Reactive timestamps & computed properties for time tracking
 */
export default function useTimes(props: {
  now: string
  calendarSystem?: CalendarSystem
}): UseTimesReturn {
  /**
   * 'times' is a reactive object containing 'now' and 'today'
   */
  const times = reactive({
    now: parseTimestamp('0000-00-00 00:00') as Timestamp,
    today: parseTimestamp('0000-00-00') as Timestamp,
  })

  /**
   * Parsed current timestamp
   */
  const parsedNow = computed(
    () =>
      (props.now ? parseCalendarTimestamp(props.now, props.calendarSystem) : getNow()) as Timestamp,
  )

  /**
   * Watch for changes in parsedNow
   */
  watch(parsedNow, () => updateCurrent())

  /**
   * Sets 'times.now' (relative) to 'times.today' (relative)
   */
  function setCurrent(): void {
    if (times.now && times.today) {
      times.now = copyTimestamp({
        ...times.now,
        current: true,
        past: false,
        future: false,
      })
      times.today = copyTimestamp({
        ...times.today,
        current: true,
        past: false,
        future: false,
      })
    }
  }

  /**
   * Updates current timestamps
   */
  function updateCurrent(): void {
    const now = parsedNow.value || getNow()
    times.now = updateTime(now, updateDay(now, times.now as Timestamp))
    times.today = updateDay(now, times.today as Timestamp)
  }

  /**
   * Get the current date as a Timestamp
   */
  function getNow(): Timestamp {
    return parseDate(new Date(), props.calendarSystem) as Timestamp
  }

  /**
   * Update date info of target timestamp
   */
  function updateDay(now: Timestamp, target: Timestamp): Timestamp {
    if (now.date !== target.date) {
      return copyTimestamp({
        ...target,
        year: now.year,
        month: now.month,
        day: now.day,
        calendarId: now.calendarId,
        weekday: now.weekday,
        date: now.date,
      })
    }

    return target
  }

  /**
   * Update time info of target timestamp
   */
  function updateTime(now: Timestamp, target: Timestamp): Timestamp {
    if (now.time !== target.time) {
      return copyTimestamp({
        ...target,
        hour: now.hour,
        minute: now.minute,
        second: now.second,
        millisecond: now.millisecond,
        time: now.time,
      })
    }

    return target
  }

  return {
    times,
    parsedNow,
    setCurrent,
    updateCurrent,
    getNow,
    updateDay,
    updateTime,
  }
}

import { reactive, computed, watch, ComputedRef, Reactive } from 'vue'
import { validateTimestamp, parseTimestamp, parseDate, Timestamp } from '../utils/Timestamp'

/**
 * export of useTimesProps
 */
export const useTimesProps = {
  now: {
    type: String,
    validator: (v: string): boolean => v === '' || validateTimestamp(v),
    default: '',
  },
}

export interface TimesProps {
  now: string
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
  updateDay: (_now: Timestamp, _target: Timestamp) => void
  updateTime: (_now: Timestamp, _target: Timestamp) => void
}

/**
 * Reactive timestamps & computed properties for time tracking
 */
export default function useTimes(props: { now: string }): UseTimesReturn {
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
  const parsedNow = computed(() => (props.now ? parseTimestamp(props.now) : getNow()) as Timestamp)

  /**
   * Watch for changes in parsedNow
   */
  watch(parsedNow, () => updateCurrent())

  /**
   * Sets 'times.now' (relative) to 'times.today' (relative)
   */
  function setCurrent(): void {
    if (times.now && times.today) {
      times.now.current = times.today.current = true
      times.now.past = times.today.past = false
      times.now.future = times.today.future = false
    }
  }

  /**
   * Updates current timestamps
   */
  function updateCurrent(): void {
    const now = parsedNow.value || getNow()
    updateDay(now, times.now as Timestamp)
    updateTime(now, times.now as Timestamp)
    updateDay(now, times.today as Timestamp)
  }

  /**
   * Get the current date as a Timestamp
   */
  function getNow(): Timestamp {
    return parseDate(new Date()) as Timestamp
  }

  /**
   * Update date info of target timestamp
   */
  function updateDay(now: Timestamp, target: Timestamp): void {
    if (now.date !== target.date) {
      target.year = now.year
      target.month = now.month
      target.day = now.day
      target.weekday = now.weekday as number
      target.date = now.date
    }
  }

  /**
   * Update time info of target timestamp
   */
  function updateTime(now: Timestamp, target: Timestamp): void {
    if (now.time !== target.time) {
      target.hour = now.hour
      target.minute = now.minute
      target.time = now.time as string
    }
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

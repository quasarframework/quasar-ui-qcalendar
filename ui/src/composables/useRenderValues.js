import { computed } from 'vue'
import {
  // DAYS_IN_MONTH_MAX,
  copyTimestamp,
  daysInMonth,
  getStartOfMonth,
  getEndOfMonth,
  getStartOfWeek,
  getEndOfWeek,
  moveRelativeDays,
  updateFormatted,
  nextDay
} from '../utils/Timestamp'

export default function (props, {
  parsedView,
  times,
  parsedValue
}) {
  const renderValues = computed(() => {
    const around = parsedValue.value
    let maxDays = props.maxDays
    let start = around
    let end = around
    switch (parsedView.value) {
      case 'month':
        start = getStartOfMonth(around)
        end = getEndOfMonth(around)
        maxDays = daysInMonth(start.year, start.month)
        break
      case 'week':
      case 'week-agenda':
      case 'week-scheduler':
        start = getStartOfWeek(around, props.weekdays, times.today)
        end = getEndOfWeek(start, props.weekdays, times.today)
        maxDays = props.weekdays.length
        break
      case 'day':
      case 'scheduler':
      case 'agenda':
        end = moveRelativeDays(copyTimestamp(end), nextDay, maxDays > 1 ? maxDays - 1 : maxDays, props.weekdays)
        updateFormatted(end)
        break
      case 'month-interval':
      case 'month-scheduler':
      case 'month-agenda':
        start = getStartOfMonth(around)
        end = getEndOfMonth(around)
        updateFormatted(end)
        maxDays = daysInMonth(start.year, start.month)
        break
      case 'resource':
        maxDays = 1
        end = moveRelativeDays(copyTimestamp(end), nextDay, maxDays, props.weekdays)
        updateFormatted(end)
        break
    }
    return { start, end, maxDays }
  })

  return {
    renderValues
  }
}

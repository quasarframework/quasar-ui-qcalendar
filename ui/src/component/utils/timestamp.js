import { date } from 'quasar'

export const PARSE_REGEX = /^(\d{4})-(\d{1,2})(-(\d{1,2}))?([^\d]+(\d{1,2}))?(:(\d{1,2}))?(:(\d{1,2}))?$/
export const PARSE_TIME = /(\d\d?)(:(\d\d?)|)(:(\d\d?)|)/

export const DAYS_IN_MONTH = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
export const DAYS_IN_MONTH_LEAP = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
export const DAYS_IN_MONTH_MIN = 28
export const DAYS_IN_MONTH_MAX = 31
export const MONTH_MAX = 12
export const MONTH_MIN = 1
export const DAY_MIN = 1
export const DAYS_IN_WEEK = 7
export const MINUTES_IN_HOUR = 60
export const HOURS_IN_DAY = 24
export const FIRST_HOUR = 0
export const MILLISECONDS_IN_DAY = 86400000
export const MILLISECONDS_IN_HOUR = 3600000
export const MILLISECONDS_IN_MINUTE = 60000

export const Timestamp = {
  date: '', // String
  time: '', // String
  year: 0, // Number
  month: 0, // Number
  day: 0, // Number
  weekday: 0, // Number
  hour: 0, // Number
  minute: 0, // Number
  doy: 0, // Number (day of year)
  workweek: 0, // Number
  hasDay: false, // Boolean
  hasTime: false, // Boolean
  past: false, // Boolean
  current: false, // Boolean
  future: false, // Boolean
  disabled: false // Boolean
}

export const TimeObject = {
  hour: 0, // Number
  minute: 0 // Number
}

export function getStartOfWeek (timestamp, weekdays, today) {
  const start = copyTimestamp(timestamp)
  findWeekday(start, weekdays[0], prevDay)
  updateFormatted(start)
  if (today) {
    updateRelative(start, today, start.hasTime)
  }
  return start
}

export function getEndOfWeek (timestamp, weekdays, today) {
  const end = copyTimestamp(timestamp)
  findWeekday(end, weekdays[weekdays.length - 1])
  updateFormatted(end)
  if (today) {
    updateRelative(end, today, end.hasTime)
  }
  return end
}

export function getStartOfMonth (timestamp) {
  const start = copyTimestamp(timestamp)
  start.day = DAY_MIN
  updateFormatted(start)
  return start
}

export function getEndOfMonth (timestamp) {
  const end = copyTimestamp(timestamp)
  end.day = daysInMonth(end.year, end.month)
  updateFormatted(end)
  return end
}

export function parseTime (input) {
  if (typeof input === 'number') {
    // when a number is given, it's minutes since 12:00am
    return input
  } else if (typeof input === 'string') {
    // when a string is given, it's a hh:mm:ss format where seconds are optional
    const parts = PARSE_TIME.exec(input)
    if (!parts) {
      return false
    }
    return parseInt(parts[1]) * 60 + parseInt(parts[3] || 0)
  } else if (typeof input === 'object') {
    // when an object is given, it must have hour and minute
    if (typeof input.hour !== 'number' || typeof input.minute !== 'number') {
      return false
    }
    return input.hour * 60 + input.minute
  } else {
    // unsupported type
    return false
  }
}

export function validateTimestamp (input) {
  return !!PARSE_REGEX.exec(input)
}

export function parsed (input) {
  // YYYY-MM-DD hh:mm:ss
  const parts = PARSE_REGEX.exec(input)

  if (!parts) return null

  return {
    date: input,
    time: '',
    year: parseInt(parts[1]),
    month: parseInt(parts[2]),
    day: parseInt(parts[4]) || 1,
    hour: parseInt(parts[6]) || 0,
    minute: parseInt(parts[8]) || 0,
    weekday: 0,
    doy: 0,
    workweek: 0,
    hasDay: !!parts[4],
    hasTime: !!(parts[6] && parts[8]),
    past: false,
    current: false,
    future: false,
    disabled: false
  }
}

export function parseTimestamp (input, now) {
  const timestamp = parsed(input)
  if (timestamp === null) return null

  updateFormatted(timestamp)

  if (now) {
    updateRelative(timestamp, now, timestamp.hasTime)
  }

  return timestamp
}

export function parseDate (date) {
  return updateFormatted({
    date: '',
    time: '',
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    weekday: date.getDay(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    doy: 0,
    workweek: 0,
    hasDay: true,
    hasTime: true,
    past: false,
    current: true,
    future: false,
    disabled: false
  })
}

export function getDayIdentifier (timestamp) {
  return timestamp.year * 10000 + timestamp.month * 100 + timestamp.day
}

export function getTimeIdentifier (timestamp) {
  return timestamp.hour * 100 + timestamp.minute
}

export function updateRelative (timestamp, now, time = false) {
  let a = getDayIdentifier(now)
  let b = getDayIdentifier(timestamp)
  let current = a === b

  if (timestamp.hasTime && time && current) {
    a = getTimeIdentifier(now)
    b = getTimeIdentifier(timestamp)
    current = a === b
  }

  timestamp.past = b < a
  timestamp.current = current
  timestamp.future = b > a

  return timestamp
}

export function updateMinutes (timestamp, minutes, now) {
  timestamp.hasTime = true
  timestamp.hour = Math.floor(minutes / MINUTES_IN_HOUR)
  timestamp.minute = minutes % MINUTES_IN_HOUR
  timestamp.time = getTime(timestamp)
  if (now) {
    updateRelative(timestamp, now, true)
  }

  return timestamp
}

export function updateWeekday (timestamp) {
  timestamp.weekday = getWeekday(timestamp)

  return timestamp
}

export function updateDayOfYear (timestamp) {
  timestamp.doy = getDayOfYear(timestamp)

  return timestamp
}

export function updateWorkWeek (timestamp) {
  timestamp.workweek = getWorkWeek(timestamp)

  return timestamp
}

export function updateDisabled (timestamp, disabledDays) {
  if (!Array.isArray(disabledDays) || disabledDays.length === 0) {
    return
  }
  const t = getDayIdentifier(timestamp)
  for (let day in disabledDays) {
    const d = getDayIdentifier(parseTimestamp(disabledDays[day] + ' 00:00'))
    if (d === t) {
      timestamp.disabled = true
      break
    }
  }
}

export function updateFormatted (timestamp) {
  timestamp.time = getTime(timestamp)
  timestamp.date = getDate(timestamp)
  timestamp.weekday = getWeekday(timestamp)
  timestamp.doy = getDayOfYear(timestamp)
  timestamp.workweek = getWorkWeek(timestamp)

  return timestamp
}

export function getDayOfYear (timestamp) {
  if (timestamp.year === 0) return
  const ts = new Date(Date.UTC(timestamp.year, timestamp.month - 1, timestamp.day, 0, 0))
  return date.getDayOfYear(ts)
}

export function getWorkWeek (timestamp) {
  if (timestamp.year === 0) return
  const ts = new Date(Date.UTC(timestamp.year, timestamp.month - 1, timestamp.day, 0, 0))
  return date.getWeekOfYear(ts)
}

export function getWeekday (timestamp) {
  // [bug] this code has issues. If 1st day of the month is 1 day of week
  // it comes back with day of week as 7.
  // if (timestamp.hasDay) {
  //   const ts = new Date(Date.UTC(timestamp.year, timestamp.month - 1, timestamp.day, 0, 0))
  //   return date.getDayOfWeek(ts)
  // }

  // return timestamp.weekday

  if (timestamp.hasDay) {
    const floor = Math.floor
    const day = timestamp.day
    const month = ((timestamp.month + 9) % MONTH_MAX) + 1
    const century = floor(timestamp.year / 100)
    const year = (timestamp.year % 100) - (timestamp.month <= 2 ? 1 : 0)

    return (((day + floor(2.6 * month - 0.2) - 2 * century + year + floor(year / 4) + floor(century / 4)) % 7) + 7) % 7
  }

  return timestamp.weekday
}

export function isLeapYear (year) {
  return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)
}

export function daysInMonth (year, month) {
  return isLeapYear(year) ? DAYS_IN_MONTH_LEAP[month] : DAYS_IN_MONTH[month]
}

export function copyTimestamp (timestamp) {
  return { ...timestamp }
}

export function padNumber (x, length) {
  let padded = String(x)
  while (padded.length < length) {
    padded = '0' + padded
  }

  return padded
}

export function getDate (timestamp) {
  let str = `${padNumber(timestamp.year, 4)}-${padNumber(timestamp.month, 2)}`

  if (timestamp.hasDay) str += `-${padNumber(timestamp.day, 2)}`

  return str
}

export function getTime (timestamp) {
  if (!timestamp.hasTime) {
    return ''
  }

  return `${padNumber(timestamp.hour, 2)}:${padNumber(timestamp.minute, 2)}`
}

export function nextMinutes (timestamp, minutes) {
  timestamp.minute += minutes
  while (timestamp.minute > MINUTES_IN_HOUR) {
    timestamp.minute -= MINUTES_IN_HOUR
    ++timestamp.hour
    if (timestamp.hour >= HOURS_IN_DAY) {
      nextDay(timestamp)
      timestamp.hour = FIRST_HOUR
    }
  }

  return timestamp
}

export function nextDay (timestamp) {
  ++timestamp.day
  timestamp.weekday = (timestamp.weekday + 1) % DAYS_IN_WEEK
  if (timestamp.day > DAYS_IN_MONTH_MIN && timestamp.day > daysInMonth(timestamp.year, timestamp.month)) {
    timestamp.day = DAY_MIN
    ++timestamp.month
    if (timestamp.month > MONTH_MAX) {
      timestamp.month = MONTH_MIN
      ++timestamp.year
    }
  }

  return timestamp
}

export function prevDay (timestamp) {
  timestamp.day--
  timestamp.weekday = (timestamp.weekday + 6) % DAYS_IN_WEEK
  if (timestamp.day < DAY_MIN) {
    timestamp.month--
    if (timestamp.month < MONTH_MIN) {
      timestamp.year--
      timestamp.month = MONTH_MAX
    }
    timestamp.day = daysInMonth(timestamp.year, timestamp.month)
  }

  return timestamp
}

export function relativeDays (timestamp, mover = nextDay, days = 1, allowedWeekdays = [0, 1, 2, 3, 4, 5, 6]) {
  while (--days >= 0) {
    mover(timestamp)
    if (allowedWeekdays.length < 7 && !allowedWeekdays.includes(timestamp.weekday)) {
      ++days
    }
  }

  return timestamp
}

export function findWeekday (timestamp, weekday, mover = nextDay, maxDays = 6) {
  while (timestamp.weekday !== weekday && --maxDays >= 0) mover(timestamp)

  return timestamp
}

export function getWeekdaySkips (weekdays) {
  const skips = [1, 1, 1, 1, 1, 1, 1]
  const filled = [0, 0, 0, 0, 0, 0, 0]
  for (let i = 0; i < weekdays.length; ++i) {
    filled[weekdays[i]] = 1
  }
  for (let k = 0; k < DAYS_IN_WEEK; ++k) {
    let skip = 1
    for (let j = 1; j < DAYS_IN_WEEK; ++j) {
      const next = (k + j) % DAYS_IN_WEEK
      if (filled[next]) {
        break
      }
      ++skip
    }
    skips[k] = filled[k] * skip
  }

  return skips
}

export function createDayList (start, end, now, weekdaySkips, disabledDays = [], max = 42, min = 0) {
  const stop = getDayIdentifier(end)
  const days = []
  let current = copyTimestamp(start)
  let currentIdentifier = 0
  let stopped = currentIdentifier === stop

  if (stop < getDayIdentifier(start)) {
    return days
  }

  while ((!stopped || days.length < min) && days.length < max) {
    currentIdentifier = getDayIdentifier(current)
    stopped = stopped || currentIdentifier > stop
    if (stopped) {
      break
    }
    if (weekdaySkips[current.weekday] === 0) {
      current = nextDay(current)
      continue
    }
    const day = copyTimestamp(current)
    updateFormatted(day)
    updateRelative(day, now)
    updateDisabled(day, disabledDays)
    days.push(day)
    // current = relativeDays(current, nextDay, weekdaySkips[current.weekday])
    current = relativeDays(current, nextDay)
  }

  return days
}

export function createIntervalList (timestamp, first, minutes, count, now) {
  const intervals = []

  for (let i = 0; i < count; ++i) {
    const mins = (first + i) * minutes
    const int = copyTimestamp(timestamp)
    intervals.push(updateMinutes(int, mins, now))
  }

  return intervals
}

export function createNativeLocaleFormatter (locale, getOptions) {
  const emptyFormatter = (_t, _s) => ''

  if (typeof Intl === 'undefined' || typeof Intl.DateTimeFormat === 'undefined') {
    return emptyFormatter
  }

  return (timestamp, short) => {
    try {
      const intlFormatter = new Intl.DateTimeFormat(locale || void 0, getOptions(timestamp, short))
      // const time = `${padNumber(timestamp.hour, 2)}:${padNumber(timestamp.minute, 2)}`
      // const date = timestamp.date
      // return intlFormatter.format(new Date(`${date}T${time}:00+00:00`))
      return intlFormatter.format(new Date(Date.UTC(timestamp.year, timestamp.month - 1, timestamp.day, timestamp.hour, timestamp.minute)))
    } catch (e) {
      return ''
    }
  }
}

export function validateNumber (input) {
  return isFinite(parseInt(input))
}

export const PARSE_REGEX = /^(\d{4})-(\d{1,2})(-(\d{1,2}))?([^\d]+(\d{1,2}))?(:(\d{1,2}))?(:(\d{1,2}))?(.(\d{1,3}))?$/
export const PARSE_DATE = /^(\d{4})-(\d{1,2})(-(\d{1,2}))/
export const PARSE_TIME = /(\d\d?)(:(\d\d?)|)(:(\d\d?)|)/

export const DAYS_IN_MONTH = [ 0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ]
export const DAYS_IN_MONTH_LEAP = [ 0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ]
export const DAYS_IN_MONTH_MIN = 28
export const DAYS_IN_MONTH_MAX = 31
export const MONTH_MAX = 12
export const MONTH_MIN = 1
export const DAY_MIN = 1
export const DAYS_IN_WEEK = 7
export const MINUTES_IN_HOUR = 60
export const HOURS_IN_DAY = 24
export const FIRST_HOUR = 0
export const MILLISECONDS_IN_MINUTE = 60000
export const MILLISECONDS_IN_HOUR = 3600000
export const MILLISECONDS_IN_DAY = 86400000
export const MILLISECONDS_IN_WEEK = 604800000

/* eslint-disable no-multi-spaces */
/**
 * @typedef {Object} Timestamp The Timestamp object
 * @property {string=} Timestamp.date Date string in format 'YYYY-MM-DD'
 * @property {string=} Timestamp.time Time string in format 'HH:MM'
 * @property {number} Timestamp.year The numeric year
 * @property {number} Timestamp.month The numeric month (Jan = 1, ...)
 * @property {number} Timestamp.day The numeric day
 * @property {number} Timestamp.weekday The numeric weekday (Sun = 0, ..., Sat = 6)
 * @property {number=} Timestamp.hour The numeric hour
 * @property {number} Timestamp.minute The numeric minute
 * @property {number=} Timestamp.doy The numeric day of the year (doy)
 * @property {number=} Timestamp.workweek The numeric workweek
 * @property {boolean} Timestamp.hasDay True if Timestamp.date is filled in and usable
 * @property {boolean} Timestamp.hasTime True if Timestamp.time is filled in and usable
 * @property {boolean=} Timestamp.past True if the Timestamp is in the past
 * @property {boolean=} Timestamp.current True if Timestamp is current day (now)
 * @property {boolean=} Timestamp.future True if Timestamp is in the future
 * @property {boolean=} Timestamp.disabled True if this is a disabled date
 */
export const Timestamp = {
  date: '',       // YYYY-MM-DD
  time: '',       // HH:MM (optional)
  year: 0,        // YYYY
  month: 0,       // MM (Jan = 1, etc)
  day: 0,         // day of the month
  weekday: 0,     // week day (0=Sunday...6=Saturday)
  hour: 0,        // 24-hr format
  minute: 0,      // mm
  doy: 0,         // day of year
  workweek: 0,    // workweek number
  hasDay: false,  // if this timestamp is supposed to have a date
  hasTime: false, // if this timestamp is supposed to have a time
  past: false,    // if timestamp is in the past (based on `now` property)
  current: false, // if timestamp is current date (based on `now` property)
  future: false,  // if timestamp is in the future (based on `now` property)
  disabled: false // if timestamp is disabled
}

export const TimeObject = {
  hour: 0,  // Number
  minute: 0 // Number
}
/* eslint-enable no-multi-spaces */

// returns YYYY-MM-dd format
/**
 * Returns today's date
 * @returns {string} Date string in the form 'YYYY-MM-DD'
 */
export function today () {
  const d = new Date(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear()

  return [ year, padNumber(month, 2), padNumber(day, 2) ].join('-')
}

/**
 * Takes a date string ('YYYY-MM-DD') and validates if it is today's date
 * @param {string} date Date string in the form 'YYYY-MM-DD'
 * @returns {boolean} True if the date is today's date
 */
export function isToday (date) {
  return date === today()
}

/**
 * Returns the start of the week give a {@link Timestamp} and weekdays (in which it finds the day representing the start of the week).
 * If today {@link Timestamp} is passed in then this is used to update relative information in the returned {@link Timestamp}.
 * @param {Timestamp} timestamp The {@link Timestamp} to use to find the start of the week
 * @param {number[]} weekdays The array is [0,1,2,3,4,5,6] where 0=Sunday and 6=Saturday
 * @param {Timestamp=} today If passed in then the {@link Timestamp} is updated with relative information
 * @returns {Timestamp} The {@link Timestamp} representing the start of the week
 */
export function getStartOfWeek (timestamp, weekdays, today) {
  let start = copyTimestamp(timestamp)
  if (start.day === 1 || start.weekday === 0) {
    while (!weekdays.includes(start.weekday)) {
      start = nextDay(start)
    }
  }
  start = findWeekday(start, weekdays[ 0 ], prevDay)
  start = updateFormatted(start)
  if (today) {
    start = updateRelative(start, today, start.hasTime)
  }
  return start
}

/**
 * Returns the end of the week give a {@link Timestamp} and weekdays (in which it finds the day representing the last of the week).
 * If today {@link Timestamp} is passed in then this is used to update relative information in the returned {@link Timestamp}.
 * @param {Timestamp} timestamp The {@link Timestamp} to use to find the end of the week
 * @param {number[]} weekdays The array is [0,1,2,3,4,5,6] where 0=Sunday and 6=Saturday
 * @param {Timestamp=} today If passed in then the {@link Timestamp} is updated with relative information
 * @returns {Timestamp} The {@link Timestamp} representing the end of the week
 */
export function getEndOfWeek (timestamp, weekdays, today) {
  let end = copyTimestamp(timestamp)
  // is last day of month?
  const lastDay = daysInMonth(end.year, end.month)
  if (lastDay === end.day || end.weekday === 6) {
    while (!weekdays.includes(end.weekday)) {
      end = prevDay(end)
    }
  }
  end = findWeekday(end, weekdays[ weekdays.length - 1 ], nextDay)
  end = updateFormatted(end)
  if (today) {
    end = updateRelative(end, today, end.hasTime)
  }
  return end
}

/**
 * Finds the start of the month based on the passed in {@link Timestamp}
 * @param {Timestamp} timestamp The {@link Timestamp} to use to find the start of the month
 * @returns {Timestamp} A {@link Timestamp} of the start of the month
 */
export function getStartOfMonth (timestamp) {
  const start = copyTimestamp(timestamp)
  start.day = DAY_MIN
  updateFormatted(start)
  return start
}

/**
 * Finds the end of the month based on the passed in {@link Timestamp}
 * @param {Timestamp} timestamp The {@link Timestamp} to use to find the end of the month
 * @returns {Timestamp} A {@link Timestamp} of the end of the month
 */
export function getEndOfMonth (timestamp) {
  const end = copyTimestamp(timestamp)
  end.day = daysInMonth(end.year, end.month)
  updateFormatted(end)
  return end
}

// returns minutes since midnight
export function parseTime (input) {
  const type = Object.prototype.toString.call(input)
  switch (type) {
    case '[object Number]':
      // when a number is given, it's minutes since 12:00am
      return input
    case '[object String]':
    {
      // when a string is given, it's a hh:mm:ss format where seconds are optional, but not used
      const parts = PARSE_TIME.exec(input)
      if (!parts) {
        return false
      }
      return parseInt(parts[ 1 ], 10) * 60 + parseInt(parts[ 3 ] || 0, 10)
    }
    case '[object Object]':
      // when an object is given, it must have hour and minute
      if (typeof input.hour !== 'number' || typeof input.minute !== 'number') {
        return false
      }
      return input.hour * 60 + input.minute
  }

  return false
}

/**
 * Validates the passed input ('YYY-MM-DD') as a date or ('YYY-MM-DD HH:MM') date time combination
 * @param {string} input A string in the form 'YYYY-MM-DD' or 'YYYY-MM-DD HH:MM'
 * @returns {boolean} True if parseable
 */
export function validateTimestamp (input) {
  return !!PARSE_REGEX.exec(input)
}

/**
 * Compares two {@link Timestamp}s for exactness
 * @param {Timestamp} ts1 The first {@link Timestamp}
 * @param {Timestamp} ts2 The second {@link Timestamp}
 * @returns {boolean} True if the two {@link Timestamp}s are an exact match
 */
export function compareTimestamps (ts1, ts2) {
  return JSON.stringify(ts1) === JSON.stringify(ts2)
}

/**
 * Compares the date of two {@link Timestamp}s that have been updated with relative data
 * @param {Timestamp} ts1 The first {@link Timestamp}
 * @param {Timestamp} ts2 The second {@link Timestamp}
 * @returns {boolean} True if the two dates are the same
 */
export function compareDate (ts1, ts2) {
  return getDate(ts1) === getDate(ts2)
}

/**
 * Compares the time of two {@link Timestamp}s that have been updated with relative data
 * @param {Timestamp} ts1 The first {@link Timestamp}
 * @param {Timestamp} ts2 The second {@link Timestamp}
 * @returns {boolean} True if the two times are an exact match
 */
export function compareTime (ts1, ts2) {
  return getTime(ts1) === getTime(ts2)
}

/**
 * Compares the date and time of two {@link Timestamp}s that have been updated with relative data
 * @param {Timestamp} ts1 The first {@link Timestamp}
 * @param {Timestamp} ts2 The second {@link Timestamp}
 * @returns {boolean} True id the dat and time are an exact match
 */
export function compareDateTime (ts1, ts2) {
  return getDateTime(ts1) === getDateTime(ts2)
}

/**
 * Fast low-level parser for a date string ('YYYY-MM-DD'). Does not update formatted or relative date.
 * Use 'parseTimestamp' for formatted and relative updates
 * @param {string} input In the form 'YYYY-MM-DD hh:mm:ss' (seconds are optional, but not used)
 * @returns {Timestamp} This {@link Timestamp} is minimally filled in. The {@link Timestamp.date} and {@link Timestamp.time} as well as relative data will not be filled in.
 */
export function parsed (input) {
  const parts = PARSE_REGEX.exec(input)

  if (!parts) return null

  return {
    date: input,
    time: padNumber(parseInt(parts[ 6 ], 10) || 0, 2) + ':' + padNumber(parseInt(parts[ 8 ], 10) || 0, 2),
    year: parseInt(parts[ 1 ], 10),
    month: parseInt(parts[ 2 ], 10),
    day: parseInt(parts[ 4 ], 10) || 1,
    hour: parseInt(parts[ 6 ], 10) || 0,
    minute: parseInt(parts[ 8 ], 10) || 0,
    weekday: 0,
    doy: 0,
    workweek: 0,
    hasDay: !!parts[ 4 ],
    hasTime: !!(parts[ 6 ] && parts[ 8 ]),
    past: false,
    current: false,
    future: false,
    disabled: false
  }
}

/**
 * High-level parser that converts the passed in string to {@link Timestamp} and uses 'now' to update relative information.
 * @param {string} input In the form 'YYYY-MM-DD hh:mm:ss' (seconds are optional, but not used)
 * @param {Timestamp} now A {@link Timestamp} to use for relative data updates
 * @returns {Timestamp} The {@link Timestamp.date} will be filled in as well as the {@link Timestamp.time} if a time is supplied and formatted fields (doy, weekday, workweek, etc). If 'now' is supplied, then relative data will also be updated.
 */
export function parseTimestamp (input, now) {
  let timestamp = parsed(input)
  if (timestamp === null) return null

  timestamp = updateFormatted(timestamp)

  if (now) {
    updateRelative(timestamp, now, timestamp.hasTime)
  }

  return timestamp
}

/**
 * Takes a JavaScript Date and returns a {@link Timestamp}. The {@link Timestamp} is not updated with relative information.
 * @param {date} date JavaScript Date
 * @returns {Timestamp} A minimal {@link Timestamp} without updated or relative updates.
 */
export function parseDate (date) {
  return updateFormatted({
    date: padNumber(date.getFullYear(), 4) + '-' + padNumber(date.getMonth() + 1, 2) + '-' + padNumber(date.getDate(), 2),
    time: padNumber(date.getHours() || 0, 2) + ':' + padNumber(date.getMinutes() || 0, 2),
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    weekday: 0,
    doy: 0,
    workweek: 0,
    hasDay: true,
    hasTime: !!(date.getHours() !== 0 && date.getMinutes() !== 0),
    past: false,
    current: false,
    future: false,
    disabled: false
  })
}

/**
 * Converts a {@link Timestamp} into a numeric date identifier based on the passed {@link Timestamp}'s date
 * @param {Timestamp} timestamp The {@link Timestamp} to use
 * @returns {number} The numeric date identifier
 */
export function getDayIdentifier (timestamp) {
  return timestamp.year * 100000000 + timestamp.month * 1000000 + timestamp.day * 10000
}

/**
 * Converts a {@link Timestamp} into a numeric time identifier based on the passed {@link Timestamp}'s time
 * @param {Timestamp} timestamp The {@link Timestamp} to use
 * @returns {number} The numeric time identifier
 */
export function getTimeIdentifier (timestamp) {
  return timestamp.hour * 100 + timestamp.minute
}

/**
 * Converts a {@link Timestamp} into a numeric date and time identifier based on the passed {@link Timestamp}'s date and time
 * @param {Timestamp} timestamp The {@link Timestamp} to use
 * @returns {number} The numeric date+time identifier
 */
export function getDayTimeIdentifier (timestamp) {
  return getDayIdentifier(timestamp) + getTimeIdentifier(timestamp)
}

/**
 * Returns the difference between two {@link Timestamp}s
 * @param {Timestamp} ts1 The first {@link Timestamp}
 * @param {Timestamp} ts2 The second {@link Timestamp}
 * @param {boolean=} strict Optional flag to not to return negative numbers
 * @returns {number} The difference
 */
export function diffTimestamp (ts1, ts2, strict) {
  const utc1 = Date.UTC(ts1.year, ts1.month - 1, ts1.day, ts1.hour, ts1.minute)
  const utc2 = Date.UTC(ts2.year, ts2.month - 1, ts2.day, ts2.hour, ts2.minute)
  if (strict === true && utc2 < utc1) {
    // Not negative number
    // utc2 - utc1 < 0  -> utc2 < utc1 ->   NO: utc1 >= utc2
    return 0
  }
  return utc2 - utc1
}

/**
 * Updates a {@link Timestamp} with relative data (past, current and future)
 * @param {Timestamp} timestamp The {@link Timestamp} that needs relative data updated
 * @param {Timestamp} now {@link Timestamp} that represents the current date (optional time)
 * @param {boolean=} time Optional flag to include time ('timestamp' and 'now' params should have time values)
 * @returns {Timestamp} The updated {@link Timestamp}
 */
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

/**
 * Sets a Timestamp{@link Timestamp} to number of minutes past midnight (modifies hour and minutes if needed)
 * @param {Timestamp} timestamp The {@link Timestamp} to modify
 * @param {number} minutes The number of minutes to set from midnight
 * @param {Timestamp=} now Optional {@link Timestamp} representing current date and time
 * @returns {Timestamp} The updated {@link Timestamp}
 */
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

/**
 * Updates the {@link Timestamp} with the weekday
 * @param {Timestamp} timestamp The {@link Timestamp} to modify
 * @returns The modified Timestamp
 */
export function updateWeekday (timestamp) {
  timestamp.weekday = getWeekday(timestamp)

  return timestamp
}

/**
 * Updates the {@link Timestamp} with the day of the year (doy)
 * @param {Timestamp} timestamp The {@link Timestamp} to modify
 * @returns The modified Timestamp
 */
export function updateDayOfYear (timestamp) {
  timestamp.doy = getDayOfYear(timestamp)

  return timestamp
}

/**
 * Updates the {@link Timestamp} with the workweek
 * @param {Timestamp} timestamp The {@link Timestamp} to modify
 * @returns The modified {@link Timestamp}
 */
export function updateWorkWeek (timestamp) {
  timestamp.workweek = getWorkWeek(timestamp)

  return timestamp
}

/**
 * Updates the passed {@link Timestamp} with disabled, if needed
 * @param {Timestamp} timestamp The {@link Timestamp} to modify
 * @param {string} [disabledBefore] In 'YYY-MM-DD' format
 * @param {string} [disabledAfter] In 'YYY-MM-DD' format
 * @param {number[]} [disabledWeekdays] An array of numbers representing weekdays [0 = Sun, ..., 6 = Sat]
 * @param {string[]} [disabledDays] An array of days in 'YYYY-MM-DD' format. If an array with a pair of dates is in first array, then this is treated as a range.
 * @returns The modified {@link Timestamp}
 */
export function updateDisabled (timestamp, disabledBefore, disabledAfter, disabledWeekdays, disabledDays) {
  const t = getDayIdentifier(timestamp)

  if (disabledBefore !== undefined) {
    const before = getDayIdentifier(parsed(disabledBefore))
    if (t <= before) {
      timestamp.disabled = true
    }
  }

  if (timestamp.disabled !== true && disabledAfter !== undefined) {
    const after = getDayIdentifier(parsed(disabledAfter))
    if (t >= after) {
      timestamp.disabled = true
    }
  }

  if (timestamp.disabled !== true && Array.isArray(disabledWeekdays) && disabledWeekdays.length > 0) {
    for (const weekday in disabledWeekdays) {
      if (disabledWeekdays[ weekday ] === timestamp.weekday) {
        timestamp.disabled = true
        break
      }
    }
  }

  if (timestamp.disabled !== true && Array.isArray(disabledDays) && disabledDays.length > 0) {
    for (const day in disabledDays) {
      if (Array.isArray(disabledDays[ day ]) && disabledDays[ day ].length === 2) {
        const start = parsed(disabledDays[ day ][ 0 ])
        const end = parsed(disabledDays[ day ][ 1 ])
        if (isBetweenDates(timestamp, start, end)) {
          timestamp.disabled = true
          break
        }
      }
      else {
        const d = getDayIdentifier(parseTimestamp(disabledDays[ day ] + ' 00:00'))
        if (d === t) {
          timestamp.disabled = true
          break
        }
      }
    }
  }

  return timestamp
}

/**
 * Updates the passed {@link Timestamp} with formatted data (time string, date string, weekday, day of year and workweek)
 * @param {Timestamp} timestamp The {@link Timestamp} to modify
 * @returns The modified {@link Timestamp}
 */
export function updateFormatted (timestamp) {
  timestamp.hasTime = !(timestamp.hour === 0 && timestamp.minute === 0)
  timestamp.time = getTime(timestamp)
  timestamp.date = getDate(timestamp)
  timestamp.weekday = getWeekday(timestamp)
  timestamp.doy = getDayOfYear(timestamp)
  timestamp.workweek = getWorkWeek(timestamp)

  return timestamp
}

/**
 * Returns day of the year (doy) for the passed in {@link Timestamp}
 * @param {Timestamp} timestamp The {@link Timestamp} to use
 * @returns {number} The day of the year
 */
export function getDayOfYear (timestamp) {
  if (timestamp.year === 0) return
  return (Date.UTC(timestamp.year, timestamp.month - 1, timestamp.day) - Date.UTC(timestamp.year, 0, 0)) / 24 / 60 / 60 / 1000
}

/**
 * Returns workweek for the passed in {@link Timestamp}
 * @param {Timestamp} timestamp The {@link Timestamp} to use
 * @returns {number} The work week
 */
export function getWorkWeek (timestamp) {
  let date
  if (timestamp.year === 0) {
    date = Date.UTC(new Date())
  }
  else {
    date = makeDate(timestamp)
  }

  if (isNaN(date)) return 0

  // Remove time components of date
  const weekday = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  // Change date to Thursday same week
  weekday.setDate(weekday.getDate() - ((weekday.getDay() + 6) % 7) + 3)

  // Take January 4th as it is always in week 1 (see ISO 8601)
  const firstThursday = new Date(weekday.getFullYear(), 0, 4)

  // Change date to Thursday same week
  firstThursday.setDate(firstThursday.getDate() - ((firstThursday.getDay() + 6) % 7) + 3)

  // Check if daylight-saving-time-switch occurred and correct for it
  const ds = weekday.getTimezoneOffset() - firstThursday.getTimezoneOffset()
  weekday.setHours(weekday.getHours() - ds)

  // Number of weeks between target Thursday and first Thursday
  const weekDiff = (weekday - firstThursday) / (MILLISECONDS_IN_WEEK)
  return 1 + Math.floor(weekDiff)
}

/**
 * Returns weekday for the passed in {@link Timestamp}
 * @param {Timestamp} timestamp The {@link Timestamp} to use
 * @returns {number} The weekday
 */
export function getWeekday (timestamp) {
  let weekday = timestamp.weekday
  if (timestamp.hasDay) {
    const floor = Math.floor
    const day = timestamp.day
    const month = ((timestamp.month + 9) % MONTH_MAX) + 1
    const century = floor(timestamp.year / 100)
    const year = (timestamp.year % 100) - (timestamp.month <= 2 ? 1 : 0)

    weekday = (((day + floor(2.6 * month - 0.2) - 2 * century + year + floor(year / 4) + floor(century / 4)) % 7) + 7) % 7
  }

  return weekday
}

/**
 * Returns if the passed year is a leap year
 * @param {number} year The year to check (ie: 1999, 2020)
 * @returns {boolean} True if the year is a leap year
 */
export function isLeapYear (year) {
  return ((year % 4 === 0) ^ (year % 100 === 0) ^ (year % 400 === 0)) === 1
}

/**
 * Returns the days of the specified month in a year
 * @param {number} year The year (ie: 1999, 2020)
 * @param {number} month The month (zero-based)
 * @returns {number} The number of days in the month (corrected for leap years)
 */
export function daysInMonth (year, month) {
  return isLeapYear(year) ? DAYS_IN_MONTH_LEAP[ month ] : DAYS_IN_MONTH[ month ]
}

/**
 * Makes a copy of the passed in {@link Timestamp}
 * @param {Timestamp} timestamp The original {@link Timestamp}
 * @returns {Timestamp} A copy of the original {@link Timestamp}
 */
export function copyTimestamp (timestamp) {
  return { ...timestamp }
}

/**
 * Padds a passed in number to length (converts to a string). Good for converting '5' as '05'.
 * @param {number} x The number to pad
 * @param {number} length The length of the required number as a string
 * @returns {string} The padded number (as a string). (ie: 5 = '05')
 */
export function padNumber (x, length) {
  let padded = String(x)
  while (padded.length < length) {
    padded = '0' + padded
  }

  return padded
}

/**
 * Used internally to convert {@link Timestamp} used with 'parsed' or 'parseDate' so the 'date' portion of the {@link Timestamp} is correct.
 * @param {Timestamp} timestamp The (raw) {@link Timestamp}
 * @returns {string} A formatted date ('YYYY-MM-DD')
 */
export function getDate (timestamp) {
  let str = `${ padNumber(timestamp.year, 4) }-${ padNumber(timestamp.month, 2) }`

  if (timestamp.hasDay) str += `-${ padNumber(timestamp.day, 2) }`

  return str
}

/**
 * Used intenally to convert {@link Timestamp} with 'parsed' or 'parseDate' so the 'time' portion of the {@link Timestamp} is correct.
 * @param {Timestamp} timestamp The (raw) {@link Timestamp}
 * @returns {string} A formatted time ('hh:mm')
 */
export function getTime (timestamp) {
  if (!timestamp.hasTime) {
    return ''
  }

  return `${ padNumber(timestamp.hour, 2) }:${ padNumber(timestamp.minute, 2) }`
}

/**
 * Returns a formatted string date and time ('YYYY-YY-MM hh:mm')
 * @param {Timestamp} timestamp The {@link Timestamp}
 * @returns {string} A formatted date time ('YYYY-MM-DD HH:mm')
 */
export function getDateTime (timestamp) {
  return getDate(timestamp) + ' ' + (timestamp.hasTime ? getTime(timestamp) : '00:00')
}

/**
 * Returns a {@link Timestamp} of next day from passed in {@link Timestamp}
 * @param {Timestamp} timestamp The {@link Timestamp} to use
 * @returns {Timestamp} The modified {@link Timestamp} as the next day
 */
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

/**
 * Returns a {@link Timestamp} of previous day from passed in {@link Timestamp}
 * @param {Timestamp} timestamp The {@link Timestamp} to use
 * @returns {Timestamp} The modified {@link Timestamp} as the previous day
 */
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

/**
 * An alias for {relativeDays}
 * @param {Timestamp} timestamp The {@link Timestamp} to modify
 * @param {function} [mover=nextDay] The mover function to use (ie: {nextDay} or {prevDay}).
 * @param {number} [days=1] The number of days to move.
 * @param {number[]} [allowedWeekdays=[ 0, 1, 2, 3, 4, 5, 6 ]] An array of numbers representing the weekdays. ie: [0 = Sun, ..., 6 = Sat].
 * @returns The modified {@link Timestamp}
 */
export function moveRelativeDays (timestamp, mover = nextDay, days = 1, allowedWeekdays = [ 0, 1, 2, 3, 4, 5, 6 ]) {
  return relativeDays(timestamp, mover, days, allowedWeekdays)
}

/**
 * Moves the {@link Timestamp} the number of relative days
 * @param {Timestamp} timestamp The {@link Timestamp} to modify
 * @param {function} [mover=nextDay] The mover function to use (ie: {nextDay} or {prevDay}).
 * @param {number} [days=1] The number of days to move.
 * @param {number[]} [allowedWeekdays=[ 0, 1, 2, 3, 4, 5, 6 ]] An array of numbers representing the weekdays. ie: [0 = Sun, ..., 6 = Sat].
 * @returns The modified {@link Timestamp}
 */
export function relativeDays (timestamp, mover = nextDay, days = 1, allowedWeekdays = [ 0, 1, 2, 3, 4, 5, 6 ]) {
  if (!allowedWeekdays.includes(timestamp.weekday) && timestamp.weekday === 0 && mover === nextDay) {
    ++days
  }
  while (--days >= 0) {
    timestamp = mover(timestamp)
    if (allowedWeekdays.length < 7 && !allowedWeekdays.includes(timestamp.weekday)) {
      ++days
    }
  }

  return timestamp
}

/**
 * Finds the specified weekday (forward or back) based on the {@link Timestamp}
 * @param {Timestamp} timestamp The {@link Timestamp} to modify
 * @param {number} weekday The weekday number (Sun = 0, ..., Sat = 6)
 * @param {function} [mover=nextDay] The function to use ({prevDay} or {nextDay}).
 * @param {number} [maxDays=6] The number of days to look forward or back.
 * @returns The modified {@link Timestamp}
 */
export function findWeekday (timestamp, weekday, mover = nextDay, maxDays = 6) {
  while (timestamp.weekday !== weekday && --maxDays >= 0) timestamp = mover(timestamp)
  return timestamp
}

/**
 * Returns an array of 0's and mostly 1's representing skipped days (used internally)
 * @param {number[]} weekdays An array of numbers representing the weekdays. ie: [0 = Sun, ..., 6 = Sat].
 * @returns {number[]} An array of 0's and mostly 1's (other numbers may occur previous to skipped days)
 */
export function getWeekdaySkips (weekdays) {
  const skips = [ 1, 1, 1, 1, 1, 1, 1 ]
  const filled = [ 0, 0, 0, 0, 0, 0, 0 ]
  for (let i = 0; i < weekdays.length; ++i) {
    filled[ weekdays[ i ] ] = 1
  }
  for (let k = 0; k < DAYS_IN_WEEK; ++k) {
    let skip = 1
    for (let j = 1; j < DAYS_IN_WEEK; ++j) {
      const next = (k + j) % DAYS_IN_WEEK
      if (filled[ next ]) {
        break
      }
      ++skip
    }
    skips[ k ] = filled[ k ] * skip
  }

  return skips
}

/**
 * Creates an array of {@link Timestamp}s based on start and end params
 * @param {Timestamp} start The starting {@link Timestamp}
 * @param {Timestamp} end The ending {@link Timestamp}
 * @param {Timestamp} now The relative day
 * @param {number[]} weekdaySkips An array representing available and skipped weekdays
 * @param {string} [disabledBefore] Days before this date are disabled (YYYY-MM-DD)
 * @param {string} [disabledAfter] Days after this date are disabled (YYYY-MM-DD)
 * @param {number[]} [disabledWeekdays] An array representing weekdays that are disabled [0 = Sun, ..., 6 = Sat]
 * @param {string[]} [disabledDays] An array of days in 'YYYY-MM-DD' format. If an array with a pair of dates is in first array, then this is treated as a range.
 * @param {number} [max=42] Max days to do
 * @param {number} [min=0]  Min days to do
 * @returns {Timestamp[]} The requested array of {@link Timestamp}s
 */
export function createDayList (start, end, now, weekdaySkips, disabledBefore, disabledAfter, disabledWeekdays = [], disabledDays = [], max = 42, min = 0) {
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
    stopped = stopped || (currentIdentifier > stop && days.length >= min)
    if (stopped) {
      break
    }
    if (weekdaySkips[ current.weekday ] === 0) {
      current = relativeDays(current, nextDay)
      continue
    }
    const day = copyTimestamp(current)
    updateFormatted(day)
    updateRelative(day, now)
    updateDisabled(day, disabledBefore, disabledAfter, disabledWeekdays, disabledDays)
    days.push(day)
    current = relativeDays(current, nextDay)
  }

  return days
}

/**
 * Creates an array of interval {@link Timestamp}s based on params
 * @param {Timestamp} timestamp The starting {@link Timestamp}
 * @param {number} first The starting interval time
 * @param {number} minutes How many minutes between intervals (ie: 60, 30, 15 would be common ones)
 * @param {number} count The number of intervals needed
 * @param {Timestamp} now A relative {@link Timestamp} with time
 * @returns {Timestamp[]} The requested array of interval {@link Timestamp}s
 */
export function createIntervalList (timestamp, first, minutes, count, now) {
  const intervals = []

  for (let i = 0; i < count; ++i) {
    const mins = (first + i) * minutes
    const ts = copyTimestamp(timestamp)
    intervals.push(updateMinutes(ts, mins, now))
  }

  return intervals
}

/**
 * @callback getOptions
 * @param {Timestamp} timestamp A {@link Timestamp} object
 * @param {boolean} short True if using short options
 * @returns {Object} An Intl object representing optioons to be used
 */

/**
 * @callback formatter
 * @param {Timestamp} timestamp The {@link Timestamp} being used
 * @param {boolean} short If short format is being requested
 * @returns {string} The localized string of the formatted {@link Timestamp}
 */

/**
 * Returns a function that uses Intl.DateTimeFormat formatting
 * @param {string} locale The locale to use (ie: en-us)
 * @param {getOptions} cb The function to call for options. This function should return an Intl formatted object. The function is passed (timestamp, short).
 * @returns {formatter} The function has params (timestamp, short). The short is to use the short options.
 */
export function createNativeLocaleFormatter (locale, cb) {
  const emptyFormatter = (_t, _s) => ''

  /* istanbul ignore next */
  if (typeof Intl === 'undefined' || typeof Intl.DateTimeFormat === 'undefined') {
    return emptyFormatter
  }

  return (timestamp, short) => {
    try {
      const intlFormatter = new Intl.DateTimeFormat(locale || undefined, cb(timestamp, short))
      return intlFormatter.format(makeDateTime(timestamp))
    }
    catch (e) /* istanbul ignore next */ {
      /* eslint-disable-next-line */
      console.error(`Intl.DateTimeFormat: ${e.message} -> ${getDateTime(timestamp)}`)
      return ''
    }
  }
}

/**
 * Makes a JavaScript Date from the passed {@link Timestamp}
 * @param {Timestamp} timestamp The {@link Timestamp} to use
 * @returns {date} A JavaScript Date
 */
export function makeDate (timestamp) {
  return new Date(Date.UTC(timestamp.year, timestamp.month - 1, timestamp.day, 0, 0))
}

/**
 * Makes a JavaScript Date from the passed {@link Timestamp} (with time)
 * @param {Timestamp} timestamp The {@link Timestamp} to use
 * @returns {date} A JavaScript Date
 */
export function makeDateTime (timestamp) {
  return new Date(Date.UTC(timestamp.year, timestamp.month - 1, timestamp.day, timestamp.hour, timestamp.minute))
}

// validate a number IS a number
/**
 * Teting is passed value is a number
 * @param {(string|number)} input The value to use
 * @returns {boolean} True if a number (not floating point)
 */
export function validateNumber (input) {
  return isFinite(parseInt(input, 10))
}

/**
 * Determines if the passed {@link Timestamp} is between (or equal) to two {@link Timestamp}s (range)
 * @param {Timestamp} timestamp The {@link Timestamp} for testing
 * @param {Timestamp} startTimestamp The starting {@link Timestamp}
 * @param {Timestamp} endTimestamp The ending {@link Timestamp}
 * @param {boolean=} useTime If true, use time from the {@link Timestamp}s
 * @returns {boolean} True if {@link Timestamp} is between (or equal) to two {@link Timestamp}s (range)
 */
export function isBetweenDates (timestamp, startTimestamp, endTimestamp, useTime /* = false */) {
  const cd = getDayIdentifier(timestamp) + (useTime === true ? getTimeIdentifier(timestamp) : 0)
  const sd = getDayIdentifier(startTimestamp) + (useTime === true ? getTimeIdentifier(startTimestamp) : 0)
  const ed = getDayIdentifier(endTimestamp) + (useTime === true ? getTimeIdentifier(endTimestamp) : 0)

  return cd >= sd && cd <= ed
}

/**
 * Determine if two ranges of {@link Timestamp}s overlap each other
 * @param {Timestamp} startTimestamp The starting {@link Timestamp} of first range
 * @param {Timestamp} endTimestamp The endinging {@link Timestamp} of first range
 * @param {Timestamp} firstTimestamp The starting {@link Timestamp} of second range
 * @param {Timestamp} lastTimestamp The ending {@link Timestamp} of second range
 * @returns {boolean} True if the two ranges overlap each other
 */
export function isOverlappingDates (startTimestamp, endTimestamp, firstTimestamp, lastTimestamp) {
  const start = getDayIdentifier(startTimestamp)
  const end = getDayIdentifier(endTimestamp)
  const first = getDayIdentifier(firstTimestamp)
  const last = getDayIdentifier(lastTimestamp)
  return (
    (start >= first && start <= last) // overlap left
    || (end >= first && end <= last) // overlap right
    || (first >= start && end >= last) // surrounding
  )
}

/**
 * Add or decrements years, months, days, hours or minutes to a timestamp
 * @param {Timestamp} timestamp The {@link Timestamp} object
 * @param {Object} options configuration data
 * @param {number=} options.year If positive, adds years. If negative, removes years.
 * @param {number=} options.month If positive, adds months. If negative, removes month.
 * @param {number=} options.day If positive, adds days. If negative, removes days.
 * @param {number=} options.hour If positive, adds hours. If negative, removes hours.
 * @param {number=} options.minute If positive, adds minutes. If negative, removes minutes.
 * @returns {Timestamp} A modified copy of the passed in {@link Timestamp}
 */
export function addToDate (timestamp, options) {
  const ts = copyTimestamp(timestamp)
  let minType
  __forEachObject(options, (value, key) => {
    if (ts[ key ] !== undefined) {
      ts[ key ] += parseInt(value, 10)
      const indexType = NORMALIZE_TYPES.indexOf(key)
      if (indexType !== -1) {
        if (minType === undefined) {
          minType = indexType
        }
        else {
          /* istanbul ignore next */
          minType = Math.min(indexType, minType)
        }
      }
    }
  })

  // normalize timestamp
  if (minType !== undefined) {
    __normalize(ts, NORMALIZE_TYPES[ minType ])
  }
  updateFormatted(ts)
  return ts
}

const NORMALIZE_TYPES = [ 'minute', 'hour', 'day', 'month' ]

// addToDate helper
function __forEachObject (obj, cb) {
  Object.keys(obj).forEach(k => cb(obj[ k ], k))
}

// normalize minutes
function __normalizeMinute (ts) {
  if (ts.minute >= MINUTES_IN_HOUR || ts.minute < 0) {
    const hours = Math.floor(ts.minute / MINUTES_IN_HOUR)
    ts.minute -= hours * MINUTES_IN_HOUR
    ts.hour += hours
    __normalizeHour(ts)
  }
  return ts
}

// normalize hours
function __normalizeHour (ts) {
  if (ts.hour >= HOURS_IN_DAY || ts.hour < 0) {
    const days = Math.floor(ts.hour / HOURS_IN_DAY)
    ts.hour -= days * HOURS_IN_DAY
    ts.day += days
    __normalizeDay(ts)
  }
  return ts
}

// normalize days
function __normalizeDay (ts) {
  __normalizeMonth(ts)
  let dim = daysInMonth(ts.year, ts.month)
  if (ts.day > dim) {
    ++ts.month
    if (ts.month > MONTH_MAX) {
      __normalizeMonth(ts)
    }
    let days = ts.day - dim
    dim = daysInMonth(ts.year, ts.month)
    do {
      if (days > dim) {
        ++ts.month
        if (ts.month > MONTH_MAX) {
          __normalizeMonth(ts)
        }
        days -= dim
        dim = daysInMonth(ts.year, ts.month)
      }
    } while (days > dim)
    ts.day = days
  }
  else if (ts.day <= 0) {
    let days = -1 * ts.day
    --ts.month
    if (ts.month <= 0) {
      __normalizeMonth(ts)
    }
    dim = daysInMonth(ts.year, ts.month)
    do {
      if (days > dim) /* istanbul ignore next */ {
        days -= dim
        --ts.month
        if (ts.month <= 0) {
          __normalizeMonth(ts)
        }
        dim = daysInMonth(ts.year, ts.month)
      }
    } while (days > dim)
    ts.day = dim - days
  }
  return ts
}

// normalize months
function __normalizeMonth (ts) {
  if (ts.month > MONTH_MAX) {
    const years = Math.floor(ts.month / MONTH_MAX)
    ts.month = ts.month % MONTH_MAX
    ts.year += years
  }
  else if (ts.month < MONTH_MIN) {
    ts.month += MONTH_MAX
    --ts.year
  }
  return ts
}

// normalize all
function __normalize (ts, type) {
  switch (type) {
    case 'minute':
      return __normalizeMinute(ts)
    case 'hour':
      return __normalizeHour(ts)
    case 'day':
      return __normalizeDay(ts)
    case 'month':
      return __normalizeMonth(ts)
  }
}

/**
 * Returns number of days between two {@link Timestamp}s
 * @param {Timestamp} ts1 The first {@link Timestamp}
 * @param {Timestamp} ts2 The second {@link Timestamp}
 * @returns Number of days
 */
export function daysBetween (ts1, ts2) {
  const diff = diffTimestamp(ts1, ts2, true)
  return Math.floor(diff / MILLISECONDS_IN_DAY)
}

/**
 * Returns number of weeks between two {@link Timestamp}s
 * @param {Timestamp} ts1 The first {@link Timestamp}
 * @param {Timestamp} ts2 The second {@link Timestamp}
 */
export function weeksBetween (ts1, ts2) {
  let t1 = copyTimestamp(ts1)
  let t2 = copyTimestamp(ts2)
  t1 = findWeekday(t1, 0)
  t2 = findWeekday(t2, 6)
  return Math.ceil(daysBetween(t1, t2) / DAYS_IN_WEEK)
}

// the exports...
export default {
  PARSE_REGEX,
  PARSE_DATE,
  PARSE_TIME,
  DAYS_IN_MONTH,
  DAYS_IN_MONTH_LEAP,
  DAYS_IN_MONTH_MIN,
  DAYS_IN_MONTH_MAX,
  MONTH_MAX,
  MONTH_MIN,
  DAY_MIN,
  DAYS_IN_WEEK,
  MINUTES_IN_HOUR,
  HOURS_IN_DAY,
  FIRST_HOUR,
  MILLISECONDS_IN_MINUTE,
  MILLISECONDS_IN_HOUR,
  MILLISECONDS_IN_DAY,
  MILLISECONDS_IN_WEEK,
  Timestamp,
  TimeObject,
  today,
  getStartOfWeek,
  getEndOfWeek,
  getStartOfMonth,
  getEndOfMonth,
  parseTime,
  validateTimestamp,
  parsed,
  parseTimestamp,
  parseDate,
  getDayIdentifier,
  getTimeIdentifier,
  getDayTimeIdentifier,
  diffTimestamp,
  updateRelative,
  updateMinutes,
  updateWeekday,
  updateDayOfYear,
  updateWorkWeek,
  updateDisabled,
  updateFormatted,
  getDayOfYear,
  getWorkWeek,
  getWeekday,
  isLeapYear,
  daysInMonth,
  copyTimestamp,
  padNumber,
  getDate,
  getTime,
  getDateTime,
  nextDay,
  prevDay,
  relativeDays,
  findWeekday,
  getWeekdaySkips,
  createDayList,
  createIntervalList,
  createNativeLocaleFormatter,
  makeDate,
  makeDateTime,
  validateNumber,
  isBetweenDates,
  isOverlappingDates,
  daysBetween,
  weeksBetween,
  addToDate,
  compareTimestamps,
  compareDate,
  compareTime,
  compareDateTime
}

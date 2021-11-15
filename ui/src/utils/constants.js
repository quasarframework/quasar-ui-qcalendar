export const PARSE_TIMESTAMP = /^(\d{4})[-\/.]?(\d{1,2})?[-\/.]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/
export const PARSE_FORMAT = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/

export const PARSE_DATE = /^(\d{4})[-\/.]?(\d{1,2})?[-\/.]?(\d{0,2})/
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

export const SECONDS_IN_MINUTE = 60
export const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60
export const SECONDS_IN_DAY = SECONDS_IN_HOUR * 24
export const SECONDS_IN_WEEK = SECONDS_IN_DAY * 7

export const MILLISECONDS_IN_SECOND = 1e3
export const MILLISECONDS_IN_MINUTE = SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND
export const MILLISECONDS_IN_HOUR = SECONDS_IN_HOUR * MILLISECONDS_IN_SECOND
export const MILLISECONDS_IN_DAY = SECONDS_IN_DAY * MILLISECONDS_IN_SECOND
export const MILLISECONDS_IN_WEEK = SECONDS_IN_WEEK * MILLISECONDS_IN_SECOND

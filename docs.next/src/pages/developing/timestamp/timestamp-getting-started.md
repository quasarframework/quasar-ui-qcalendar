---
title: Getting Started
desc: General use and common properties
keys: developing
related:
  - /developing/qcalendarday/day-getting-started
  - /developing/qcalendarmonth/month-getting-started
  - /developing/qcalendarmonth-minimode/minimode-getting-started
  - /developing/qcalendaragenda/agenda-getting-started
  - /developing/qcalendarresource/resource-getting-started
  - /developing/qcalendarscheduler/scheduler-getting-started
  - /developing/qcalendartask/task-getting-started
components:
  - apis/TimestampJsonApi
---

## Timestamp API

<timestamp-json-api />

## Timestamp

QCalendar comes with its own built-in `Timestamp` library that handles all of the needs and wants of each calendar type. In fact, you can use it too! Before including another date/time library, and possibly adding bloat to your app, verify the Timestamp library can handle what you need to do. If not, suggestions and PRs are welcomed.

The two most important things to know what's happening behind the scenes is Timestamp's format, which is `YYYY-MM-DD` and the actual `Timestamp` object. This object is used in many slots and events.

```js
export const Timestamp = {
  date: '',       // YYYY-MM-DD
  time: '',       // HH:MM (optional)
  year: 0,        // YYYY
  month: 0,       // MM (Jan = 1, etc)
  day: 0,         // day of the month
  weekday: 0,     // week day  (0=Sunday...6=Saturday)
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
```

If you need your own Timestamps, to be used with other exported functions, then the exported function `parseTimestamp` will fill in most of these fields, give a date in format of `YYYY-MM-DD HH:mm` with optional time. However, that can be expensive time-wise, so if you use this and need the minimal, then use the exported `parsed` function. If you have a JavaScript `Date`, then you can use the exported `parseDate` function to generate your Timestamp for you.

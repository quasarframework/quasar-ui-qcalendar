---
title: Timestamp Recipes
desc: Use @timestamp-js/core with QCalendar
keys: timestamp, ranges, duration, utc, intervals
examples: General
related:
  - /developing/calendar-adapters
  - /developing/qcalendar-month
  - /developing/qcalendar-day-intervals
  - /other/upgrade-guide
---

QCalendar emits and receives date-like strings, date-time strings, and `Timestamp` objects in slots and events. Use `@timestamp-js/core` when application logic needs deterministic range math, interval snapping, durations, or UTC storage boundaries.

The calendar stays focused on rendering and interaction. Timestamp owns the reusable date/time primitives.

## Range Windows And Disabled Days

Use Timestamp range helpers to normalize unavailable periods before passing them to `disabled-days`, `selected-start-end-dates`, or a `day-class` function.

<MarkdownExample title="Timestamp Calendar Recipes" file="TimestampRecipes"/>

The important pieces are:

```ts [twoslash]
import {
  createTimestampRange,
  findRangeGaps,
  isTimestampInRange,
  mergeRanges,
  parseTimestamp,
} from '@timestamp-js/core'

const windowStart = parseTimestamp('2036-06-01')!
const windowEnd = parseTimestamp('2036-06-30')!
const bookingWindow = createTimestampRange(windowStart, windowEnd)

const blocked = mergeRanges([
  createTimestampRange(parseTimestamp('2036-06-03')!, parseTimestamp('2036-06-05')!),
  createTimestampRange(parseTimestamp('2036-06-14')!, parseTimestamp('2036-06-18')!),
])

const available = findRangeGaps(bookingWindow, blocked)
const isAvailable = isTimestampInRange(parseTimestamp('2036-06-10')!, available[0]!)
```

## Snap Scheduler Intervals

Use `time-clicks-clamped` when you want QCalendar to return the interval the pointer is inside. Use Timestamp rounding helpers when the application needs a different snapping rule than the visible interval grid.

The same pattern works for drag and drop, scheduler resources, and appointment builders:

```ts [twoslash]
import {
  addDuration,
  createDuration,
  durationBetween,
  formatDuration,
  parseTimestamp,
  roundToInterval,
} from '@timestamp-js/core'

const clicked = parseTimestamp('2036-06-08 09:37')!
const start = roundToInterval(clicked, 30)
const end = addDuration(start, createDuration(90 * 60 * 1000))
const label = formatDuration(durationBetween(start, end))
```

## Store UTC, Render Local

For event systems and server APIs, store instants in UTC and convert at the application boundary. QCalendar can keep rendering local wall-clock values after the app parses and formats the values explicitly.

```ts [twoslash]
import {
  makeDateTime,
  parseTimestamp,
  toUnixMilliseconds,
  fromUnixMilliseconds,
} from '@timestamp-js/core'

const meeting = parseTimestamp('2036-06-08T16:30:00.000Z')!
const persisted = toUnixMilliseconds(meeting)

const restored = fromUnixMilliseconds(persisted)!
const localDate = makeDateTime(restored)
```

Use UTC helpers from Timestamp when server and client output must agree exactly. Use local helpers when the calendar should preserve the user's wall-clock date and time.

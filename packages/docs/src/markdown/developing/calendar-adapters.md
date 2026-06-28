---
title: Calendar Adapters
desc: Use Timestamp calendar adapters with QCalendar
keys: calendar,adapters,timestamp,hijri,islamic,saka,indian
related:
  - /developing/timestamp-recipes
  - /developing/qcalendar-month
  - /developing/qcalendar-agenda
---

QCalendar works with Gregorian `model-value` strings for browser and app compatibility. Timestamp calendar adapters let a view calculate native calendar boundaries while still emitting stable Gregorian dates to the rest of your app.

This is different from `locale`. Locale changes language and regional formatting. A calendar adapter changes the calendar math: year, month, day, month length, leap-year rules, and weekday calculation.

Calendar-specific examples live with the Timestamp adapter docs:

- [Islamic Civil (Hijri)](https://timestamp-js.netlify.app/developing/calendar-systems/islamic-civil) shows Hijri week and month ranges, RTL layout, localized weekday names, and selectable Hijri month names.
- [Indian National (Saka)](https://timestamp-js.netlify.app/developing/calendar-systems/saka) shows Saka week and month ranges, localized labels, and selectable Saka month names.

Use this page when you are ready to connect those adapters to QCalendar.

Install only the adapter packages your app needs beside `@timestamp-js/core`.
QCalendar does not install non-Gregorian adapters for you; the published
QCalendar package only depends on `@timestamp-js/core`.

```bash
pnpm add @timestamp-js/core @timestamp-js/calendar-islamic
```

Add additional adapters explicitly when your app uses them:

```bash
pnpm add @timestamp-js/calendar-saka
```

## Integration Boundary

There are two date systems in play:

- QCalendar receives, emits, and routes dates as Gregorian `YYYY-MM-DD` strings.
- A Timestamp calendar adapter owns native calendar math: month starts, month ends, month lengths, native day numbers, and native month names.

That means the app can keep storage, route params, API payloads, and event handlers Gregorian while the visible calendar behaves like the user-facing native calendar.

## QCalendar Contract

Pass `calendar-system` to QCalendar when a view should expose adapter-native date data. Pair it with the matching presentation choices for native users: `locale` for weekday labels, `weekdays` for the visible week order, and `dir` for RTL calendars.

```vue
<q-calendar-month
  v-model="selectedGregorianDate"
  :calendar-system="islamicCivilCalendar"
  locale="ar"
  :weekdays="[6, 0, 1, 2, 3, 4, 5]"
  dir="rtl"
>
  <template #day="{ scope }">
    <strong>{{ scope.calendarTimestamp.day }}</strong>
    <span>Gregorian {{ scope.timestamp.date }}</span>
  </template>
</q-calendar-month>
```

Date-bearing slot and mouse-event scopes include both date systems:

- `scope.timestamp` is the Gregorian QCalendar timestamp. Use it for `v-model`, routing, browser APIs, and persisted app data.
- `scope.calendarTimestamp` is the same day represented in the configured calendar system. Use it for native labels and native-keyed data.
- `scope.calendarSystem` is the adapter that created `calendarTimestamp`.

If you do not pass `calendar-system`, QCalendar uses the Gregorian calendar from
`@timestamp-js/core`. The adapter fields are still present, but
`scope.calendarTimestamp` represents the same Gregorian day as `scope.timestamp`.

The `change` event follows the same pattern. It includes `days` for the visible Gregorian range and `calendarDays` for the same visible dates represented in the configured calendar system.

```ts [twoslash]
import type { Timestamp } from '@timestamp-js/core'
import { islamicCivilCalendar } from '@timestamp-js/calendar-islamic'

interface QCalendarChangePayload {
  start: string
  end: string
  days: Timestamp[]
  calendarStart: string
  calendarEnd: string
  calendarDays: Timestamp[]
}

function onChange(payload: QCalendarChangePayload) {
  console.log(payload.start, payload.end)
  console.log(payload.calendarStart, payload.calendarEnd)
}

void islamicCivilCalendar
```

## Adapter Bridge

Use the epoch-day bridge only when you are outside a QCalendar slot or event, such as turning a stored Gregorian `v-model` value into a native timestamp for summary text:

```ts [twoslash]
import {
  createCalendarTimestampFromEpochDay,
  getEpochDay,
  parseTimestamp,
  type Timestamp,
} from '@timestamp-js/core'
import { islamicCivilCalendar } from '@timestamp-js/calendar-islamic'

function toHijri(timestamp: Timestamp) {
  return createCalendarTimestampFromEpochDay(getEpochDay(timestamp), islamicCivilCalendar)
}

const selectedGregorian = parseTimestamp('2024-03-25')!
const selectedHijri = toHijri(selectedGregorian)
```

Use the same bridge in the other direction when you need a Gregorian date for QCalendar from a native adapter timestamp:

```ts [twoslash]
import {
  createCalendarTimestampFromEpochDay,
  getEpochDay,
  type Timestamp,
} from '@timestamp-js/core'
import { islamicCivilCalendar } from '@timestamp-js/calendar-islamic'

function toGregorian(hijriTimestamp: Timestamp) {
  return createCalendarTimestampFromEpochDay(getEpochDay(hijriTimestamp, islamicCivilCalendar))
}
```

## Native Week Ranges

Week-style views still render a range of Gregorian timestamps. When a user
chooses a native calendar date, calculate the native week first, then convert
the boundaries back to Gregorian if you need to update `model-value`, query an
API, or compare against stored app data.

```ts [twoslash]
import {
  createCalendarTimestampFromEpochDay,
  getCalendarEndOfWeek,
  getCalendarStartOfWeek,
  getEpochDay,
  parseTimestamp,
  type Timestamp,
} from '@timestamp-js/core'
import { islamicCivilCalendar } from '@timestamp-js/calendar-islamic'

const hijriWeekdays = [6, 0, 1, 2, 3, 4, 5]

function toHijri(timestamp: Timestamp) {
  return createCalendarTimestampFromEpochDay(getEpochDay(timestamp), islamicCivilCalendar)
}

function toGregorian(hijriTimestamp: Timestamp) {
  return createCalendarTimestampFromEpochDay(getEpochDay(hijriTimestamp, islamicCivilCalendar))
}

const selectedGregorian = parseTimestamp('2024-03-25')!
const selectedHijri = toHijri(selectedGregorian)

const weekStartHijri = getCalendarStartOfWeek(selectedHijri, hijriWeekdays, islamicCivilCalendar)
const weekEndHijri = getCalendarEndOfWeek(selectedHijri, hijriWeekdays, islamicCivilCalendar)

const weekStartGregorian = toGregorian(weekStartHijri)
const weekEndGregorian = toGregorian(weekEndHijri)
```

Use the native range for native labels and native-keyed data. Use the converted
Gregorian range for QCalendar model values, routes, and persisted app data.

## Native Month Views

With `calendar-system`, QCalendar still emits Gregorian dates, but supported month-style views use native calendar math for:

- the first and last native day of the visible month
- the leading and trailing outside days
- `outside` slot state
- previous and next month navigation

This matters for native users. For example, Ramadan day `1` must appear in the first visible week of the Ramadan grid, even when that day is not the first day of the Gregorian month.

QCalendarMonth and mini-mode perform this range math internally when
`calendar-system` is supplied. If you are building a custom month surface,
preparing an API query, or showing summary text, calculate both the native month
boundaries and the visible grid boundaries:

```ts [twoslash]
import {
  createCalendarTimestampFromEpochDay,
  getCalendarEndOfMonth,
  getCalendarEndOfWeek,
  getCalendarStartOfMonth,
  getCalendarStartOfWeek,
  getEpochDay,
  parseTimestamp,
  type Timestamp,
} from '@timestamp-js/core'
import { islamicCivilCalendar } from '@timestamp-js/calendar-islamic'

const hijriWeekdays = [6, 0, 1, 2, 3, 4, 5]

function toHijri(timestamp: Timestamp) {
  return createCalendarTimestampFromEpochDay(getEpochDay(timestamp), islamicCivilCalendar)
}

function toGregorian(hijriTimestamp: Timestamp) {
  return createCalendarTimestampFromEpochDay(getEpochDay(hijriTimestamp, islamicCivilCalendar))
}

const selectedGregorian = parseTimestamp('2024-03-25')!
const selectedHijri = toHijri(selectedGregorian)

const monthStart = getCalendarStartOfMonth(selectedHijri, islamicCivilCalendar)
const monthEnd = getCalendarEndOfMonth(selectedHijri, islamicCivilCalendar)

const gridStart = getCalendarStartOfWeek(monthStart, hijriWeekdays, islamicCivilCalendar)
const gridEnd = getCalendarEndOfWeek(monthEnd, hijriWeekdays, islamicCivilCalendar)

const gridStartGregorian = toGregorian(gridStart)
const gridEndGregorian = toGregorian(gridEnd)
```

Use `monthStart` and `monthEnd` when you need native month labels or native
boundary badges. Use `gridStart` and `gridEnd` when you need the full visible
native calendar grid, including outside days. Convert those values back to
Gregorian before feeding ranges into QCalendar or a Gregorian-backed API.

## Labels And Data

Use `scope.calendarTimestamp` for native labels and native-keyed data:

```ts [twoslash]
import type { Timestamp } from '@timestamp-js/core'
import { indianNationalCalendar } from '@timestamp-js/calendar-saka'

const eventsBySakaDate = {
  '1946-01-01': ['New Saka year'],
}

function getSakaEvents(calendarTimestamp: Timestamp): string[] {
  return eventsBySakaDate[calendarTimestamp.date as keyof typeof eventsBySakaDate] ?? []
}

void indianNationalCalendar
```

## View Examples

Calendar adapter examples live on the view pages where users are already learning that calendar type:

- [QCalendar wrapper](/developing/qcalendar#calendar-adapters) shows how the wrapper forwards adapter-aware props to the selected view.
- [QCalendarDay](/developing/qcalendar-day#calendar-adapters) shows adapter labels in a single-day interval view.
- [QCalendarDay week view](/developing/qcalendar-day-week#calendar-adapters) shows adapter labels and native-keyed data across a visible week.
- [QCalendarDay intervals](/developing/qcalendar-day-intervals#calendar-adapters) shows native context in interval labels.
- [QCalendarMonth](/developing/qcalendar-month#calendar-adapters) shows a native month grid where the first native day appears in the first visible week, outside days follow the native month, and previous/next navigation moves by native months.
- [QCalendarMonth mini-mode](/developing/qcalendar-month-mini-mode#calendar-adapters) shows the same native month behavior in a compact picker.
- [QCalendarAgenda](/developing/qcalendar-agenda#calendar-adapters) shows adapter labels in a week-style planning view while QCalendar still owns the visible Gregorian week.
- [QCalendarResource](/developing/qcalendar-resource#calendar-adapters) shows adapter labels in a resource interval timeline.
- [QCalendarScheduler](/developing/qcalendar-scheduler#calendar-adapters) shows native labels and native-keyed data in resource/day cells.
- [QCalendarTask](/developing/qcalendar-task#calendar-adapters) shows native labels and native-keyed work items in task day cells.

Add future adapter examples to the specific view page that owns the behavior
rather than on this overview page.

## Native User Checklist

When you build a production non-Gregorian calendar view, check these pieces deliberately:

- Choose the adapter package for the actual calendar rule set, not just the display language.
- Choose a locale for labels and numbering.
- Choose the visible weekday order expected by the target calendar users.
- Set `dir="rtl"` for RTL calendar presentations such as Arabic Hijri views.
- Pass `calendar-system` to views that should expose `scope.calendarTimestamp`.
- Use `scope.calendarTimestamp` for native labels and native-keyed data.
- Keep QCalendar model values Gregorian unless the rest of your app has also moved to native adapter dates.
- Use the epoch-day bridge outside QCalendar slots/events when you need to convert stored app dates.
- Test the first and last day of the native month, especially when those days fall in the middle of a Gregorian month.
- Test previous and next month navigation against native month names, not Gregorian month names.

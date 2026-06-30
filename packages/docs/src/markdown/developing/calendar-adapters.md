---
title: Calendar Adapters
desc: Use Timestamp calendar adapters with QCalendar
keys: calendar,adapters,timestamp,hijri,islamic,saka,indian
related:
  - /developing/timestamp-recipes
  - /developing/qcalendar-month
  - /developing/qcalendar-agenda
---

QCalendar uses Gregorian dates by default. When you pass a Timestamp calendar adapter with
`calendar-system`, date-bearing component APIs use that adapter's native `YYYY-MM-DD` calendar
dates while QCalendar keeps Gregorian interop metadata available for storage, APIs, export,
analytics, and debugging.

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

There are two date identities in play:

- A Timestamp calendar adapter owns native calendar math: month starts, month ends, month lengths, native day numbers, and native month names.
- QCalendar parses and emits adapter-native `YYYY-MM-DD` values for model values, selections, disabled dates, slots, and events when `calendar-system` is active.
- QCalendar also exposes stable identity metadata for the same day, including a Gregorian date and an `epochDay` serial key.

That means native calendar views can feel native end to end. When an app still stores or exchanges
Gregorian dates, use the identity metadata from the slot or event scope as the bridge instead of
making the visible calendar state Gregorian.

## QCalendar Contract

Pass `calendar-system` to QCalendar when a view should expose adapter-native date data. QCalendar reads the adapter's default locale, text direction, and visible weekday order from Timestamp when those props are omitted. Pass `locale`, `dir`, or `weekdays` only when the app needs to override that presentation, such as rendering a five-day work week.

```vue
<script setup>
import { ref } from 'vue'
import { islamicCivilCalendar } from '@timestamp-js/calendar-islamic'

const selectedHijriDate = ref('1445-09-15')
</script>

<q-calendar-month v-model="selectedHijriDate" :calendar-system="islamicCivilCalendar">
  <template #day="{ scope }">
    <strong>{{ scope.calendarTimestamp.day }}</strong>
    <span>Gregorian {{ scope.calendarIdentity.gregorianDate }}</span>
  </template>
</q-calendar-month>
```

Date-bearing slot and mouse-event scopes include native values and interop identity metadata:

- `scope.timestamp` is the timestamp used by the active view. With `calendar-system`, it is adapter-native.
- `scope.calendarTimestamp` is the same day represented in the configured calendar system. With `calendar-system`, it matches the active native calendar.
- `scope.calendarIdentity` contains stable identity metadata, including `nativeDate`, `gregorianDate`, and `epochDay`.
- `scope.calendarSystem` is the adapter that created `calendarTimestamp`.

Use `scope.timestamp` or `scope.calendarTimestamp` for labels, selected dates, disabled dates, and
native-keyed app data. Use `scope.calendarIdentity.gregorianDate` only at integration boundaries
that still require Gregorian dates.

If you do not pass `calendar-system`, QCalendar uses the Gregorian calendar from
`@timestamp-js/core`. The adapter fields are still present, and both timestamp fields represent the
same Gregorian day.

If you do pass `calendar-system`, explicit presentation props still win. For example, a Saka or Hijri view can render a local five-day work week with `:weekdays="[1, 2, 3, 4, 5]"` while keeping adapter-native date math and model values.

## Adapter Presentation Defaults

Timestamp adapters can publish presentation defaults. QCalendar uses them only when the matching
prop is omitted:

| Timestamp adapter field | QCalendar prop | Used for                                  |
| ----------------------- | -------------- | ----------------------------------------- |
| `defaultLocale`         | `locale`       | Weekday, month, and date labels           |
| `defaultDirection`      | `dir`          | The rendered calendar root direction      |
| `defaultWeekdays`       | `weekdays`     | Visible weekday order and week navigation |

This keeps the common case small:

```vue
<q-calendar-month v-model="selectedHijriDate" :calendar-system="islamicCivilCalendar" />
```

And it keeps application-specific presentation explicit:

```vue
<q-calendar-month
  v-model="selectedHijriDate"
  :calendar-system="islamicCivilCalendar"
  :weekdays="[1, 2, 3, 4, 5]"
/>
```

The second example still uses Hijri date math and Hijri `YYYY-MM-DD` model values, but it displays a
five-day work week instead of the adapter's normal visible week.

The `change` event follows the same pattern. It includes `days` for the visible range and
`calendarDays` for the same visible dates represented in the configured calendar system.

```ts [twoslash]
import type { Timestamp } from '@timestamp-js/core'

interface QCalendarChangePayload {
  start: string
  end: string
  days: Timestamp[]
  calendarStart: string
  calendarEnd: string
  calendarDays: Timestamp[]
  calendarSystem: unknown
}

function onChange(payload: QCalendarChangePayload) {
  console.log(payload.start, payload.end)
  console.log(payload.calendarStart, payload.calendarEnd)
}
```

## Adapter Bridge

Use the epoch-day bridge only when you are outside a QCalendar slot or event, such as turning a stored Gregorian value into a native timestamp for summary text:

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

Use the same bridge in the other direction when you need a Gregorian date for an external system from a native adapter timestamp:

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

When a user chooses a native calendar date, calculate the native week with the
same adapter and weekday order that the view receives. Convert the boundaries
to Gregorian only when you need to query an API or compare against Gregorian
stored app data.

```ts [twoslash]
import {
  createCalendarTimestampFromEpochDay,
  getCalendarEndOfWeek,
  getCalendarWeekdays,
  getCalendarStartOfWeek,
  getEpochDay,
  parseTimestamp,
  type Timestamp,
} from '@timestamp-js/core'
import { islamicCivilCalendar } from '@timestamp-js/calendar-islamic'

// Use the same visible weekday order that the QCalendar view receives by default.
const hijriWeekdays = getCalendarWeekdays(islamicCivilCalendar)

function toHijri(timestamp: Timestamp) {
  // The epoch day lets the adapter describe the same absolute day in the
  // native calendar system.
  return createCalendarTimestampFromEpochDay(getEpochDay(timestamp), islamicCivilCalendar)
}

function toGregorian(hijriTimestamp: Timestamp) {
  // Convert native adapter boundaries before using them as Gregorian-backed
  // route params or API query boundaries.
  return createCalendarTimestampFromEpochDay(getEpochDay(hijriTimestamp, islamicCivilCalendar))
}

const selectedGregorian = parseTimestamp('2024-03-25')!
const selectedHijri = toHijri(selectedGregorian)

// Calculate week boundaries in the native calendar, not the Gregorian calendar.
const weekStartHijri = getCalendarStartOfWeek(selectedHijri, hijriWeekdays, islamicCivilCalendar)
const weekEndHijri = getCalendarEndOfWeek(selectedHijri, hijriWeekdays, islamicCivilCalendar)

const weekStartGregorian = toGregorian(weekStartHijri)
const weekEndGregorian = toGregorian(weekEndHijri)
```

Use the native range for QCalendar model values, native labels, and native-keyed
data. Use the converted Gregorian range for integrations that still expect
Gregorian dates.

## Native Month Views

With `calendar-system`, supported month-style views use native calendar math for:

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
  getCalendarWeekdays,
  getCalendarStartOfMonth,
  getCalendarStartOfWeek,
  getEpochDay,
  parseTimestamp,
  type Timestamp,
} from '@timestamp-js/core'
import { islamicCivilCalendar } from '@timestamp-js/calendar-islamic'

// Use the same visible weekday order that the QCalendar view receives by default.
const hijriWeekdays = getCalendarWeekdays(islamicCivilCalendar)

function toHijri(timestamp: Timestamp) {
  // Bridge from the stored Gregorian date to the same absolute day in Hijri.
  return createCalendarTimestampFromEpochDay(getEpochDay(timestamp), islamicCivilCalendar)
}

function toGregorian(hijriTimestamp: Timestamp) {
  // Bridge native adapter results for Gregorian-backed APIs.
  return createCalendarTimestampFromEpochDay(getEpochDay(hijriTimestamp, islamicCivilCalendar))
}

const selectedGregorian = parseTimestamp('2024-03-25')!
const selectedHijri = toHijri(selectedGregorian)

// These are the first and last days of the native month itself.
const monthStart = getCalendarStartOfMonth(selectedHijri, islamicCivilCalendar)
const monthEnd = getCalendarEndOfMonth(selectedHijri, islamicCivilCalendar)

// These include leading/trailing outside days needed by a full month grid.
const gridStart = getCalendarStartOfWeek(monthStart, hijriWeekdays, islamicCivilCalendar)
const gridEnd = getCalendarEndOfWeek(monthEnd, hijriWeekdays, islamicCivilCalendar)

// Use these Gregorian dates when querying Gregorian-backed integrations.
const gridStartGregorian = toGregorian(gridStart)
const gridEndGregorian = toGregorian(gridEnd)
```

Use `monthStart` and `monthEnd` when you need native month labels or native
boundary badges. Use `gridStart` and `gridEnd` when you need the full visible
native calendar grid, including outside days. Convert those values back to
Gregorian before feeding ranges into a Gregorian-backed API.

## Gregorian Interop

Use native adapter dates for user-facing calendar state. Keep Gregorian interop available for the
boundaries that still need it:

- Existing apps may store records keyed by Gregorian dates.
- APIs, databases, exports, and analytics often expect Gregorian ISO dates even when the UI is
  native Saka, Hijri, or another calendar.
- Cross-calendar comparisons need a neutral serial key. Use `scope.calendarIdentity.epochDay` rather
  than a Gregorian display string.
- Debugging and migration are easier when you can inspect
  `scope.calendarIdentity.gregorianDate` beside the native date.
- Integrations can move to native calendar UI without forcing every backend boundary to change at
  the same time.

In slots, prefer `scope.timestamp` or `scope.calendarTimestamp` for native UI and native-keyed data.
Use `scope.calendarIdentity.gregorianDate` only when an external boundary needs a Gregorian date.

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
- [QCalendarAgenda](/developing/qcalendar-agenda#calendar-adapters) shows adapter labels in a week-style planning view.
- [QCalendarResource](/developing/qcalendar-resource#calendar-adapters) shows adapter labels in a resource interval timeline.
- [QCalendarScheduler](/developing/qcalendar-scheduler#calendar-adapters) shows native labels and native-keyed data in resource/day cells.
- [QCalendarTask](/developing/qcalendar-task#calendar-adapters) shows native labels and native-keyed work items in task day cells.

Add future adapter examples to the specific view page that owns the behavior
rather than on this overview page.

## Native User Checklist

When you build a production non-Gregorian calendar view, check these pieces deliberately:

- Choose the adapter package for the actual calendar rule set, not just the display language.
- Let the adapter provide locale, text direction, and visible weekday defaults when they match the target users.
- Override `locale`, `dir`, or `weekdays` when the app needs a different presentation, such as a five-day work week.
- Pass `calendar-system` to views that should expose `scope.calendarTimestamp`.
- Use adapter-native `YYYY-MM-DD` strings for `v-model`, selected dates, disabled dates, native labels, and native-keyed data.
- Use `scope.calendarIdentity.gregorianDate` for external systems that still expect Gregorian dates.
- Use the epoch-day bridge outside QCalendar slots/events when you need to convert between stored Gregorian dates and native adapter dates.
- Test the first and last day of the native month, especially when those days fall in the middle of a Gregorian month.
- Test previous and next month navigation against native month names, not Gregorian month names.

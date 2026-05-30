---
title: Timestamp
desc: Developing with Timestamp
---

**Timestamp** is the low-level API that QCalendar uses internally to manipulate calendars. We have made it into its own package so you can use it if you wish.

## Importing Timestamp helpers

Use QCalendar's public `Timestamp` entrypoint when importing helpers in your application:

```ts
import {
  addToDate,
  parseDate,
  parsed,
  parseTimestamp,
  today,
  type Timestamp,
} from '@quasar/quasar-ui-qcalendar/Timestamp'
```

Avoid importing from `@quasar/quasar-ui-qcalendar/src/utils/Timestamp.js`. That path reaches into package internals and can break across builds, bundlers, or releases.

## Common usage

Most calendars store their model as a `YYYY-MM-DD` string. Convert that string to a `Timestamp` only when you need metadata such as `weekday`, `doy`, `workweek`, or relative state:

```ts [twoslash]
import { computed, ref } from 'vue'
import { parseTimestamp, today, type Timestamp } from '@quasar/quasar-ui-qcalendar/Timestamp'

const selectedDate = ref(today())

const selectedTimestamp = computed<Timestamp | null>(() => {
  return parseTimestamp(selectedDate.value)
})

selectedTimestamp.value?.weekday
//                       ^?
```

Use the parser that matches what you need:

| Helper | Use it when |
| ------ | ----------- |
| `today()` | You need today's date as a `YYYY-MM-DD` string for `v-model` or defaults. |
| `parseTimestamp(value)` | You need a complete `Timestamp` from a date or date-time string. |
| `parsed(value)` | You need a faster, minimal `Timestamp` and do not need relative fields. |
| `parseDate(date)` | You already have a JavaScript `Date` and want a `Timestamp`. |
| `addToDate(timestamp, options)` | You want a new `Timestamp` offset by days, months, years, hours, or minutes. |

## Advanced usage

### Compare and sort timestamps

Use `getDayIdentifier` when you need stable numeric comparisons for dates. Use `getDayTimeIdentifier` when the time portion matters too.

```ts [twoslash]
import {
  getDayIdentifier,
  getDayTimeIdentifier,
  parseTimestamp,
  type Timestamp,
} from '@quasar/quasar-ui-qcalendar/Timestamp'

const start = parseTimestamp('2026-05-30 08:30') as Timestamp
const end = parseTimestamp('2026-05-30 10:00') as Timestamp

const sameDay = getDayIdentifier(start) === getDayIdentifier(end)
const startsBeforeEnd = getDayTimeIdentifier(start) < getDayTimeIdentifier(end)

startsBeforeEnd
// ^?
```

### Work with relative state

`past`, `current`, and `future` are calculated against a `now` timestamp. If you build timestamps yourself, call `updateRelative` with your current reference point.

```ts [twoslash]
import {
  parseTimestamp,
  today,
  updateRelative,
  type Timestamp,
} from '@quasar/quasar-ui-qcalendar/Timestamp'

const now = parseTimestamp(today()) as Timestamp
const target = parseTimestamp('2026-05-30') as Timestamp

const relativeTarget = updateRelative(target, now)

relativeTarget.future
// ^?
```

### Date math without mutating the original

Timestamp helpers usually return a new object, but it is still a good habit to treat timestamps as data snapshots. Use `copyTimestamp` when you want to modify a timestamp manually, or `addToDate` for common date offsets.

```ts [twoslash]
import {
  addToDate,
  copyTimestamp,
  parseTimestamp,
  type Timestamp,
} from '@quasar/quasar-ui-qcalendar/Timestamp'

const original = parseTimestamp('2026-05-30') as Timestamp
const tomorrow = addToDate(original, { day: 1 })
const manualCopy = copyTimestamp(original)

manualCopy.day = 1

tomorrow.date
//      ^?
```

### Slot and event payloads

Many QCalendar slots and events already provide `Timestamp` objects in their `scope`. In those cases, you usually do not need to parse anything. You can use the timestamp directly:

```ts
import type { Timestamp } from '@quasar/quasar-ui-qcalendar/Timestamp'

function onClickDate ({ scope }: { scope: { timestamp: Timestamp } }) {
  console.log(scope.timestamp.date)
  console.log(scope.timestamp.weekday)
}
```

## API

<script import>
import TimestampApi from '@quasar/quasar-ui-qcalendar/dist/api/Timestamp.json'
</script>

<MarkdownApi :api="TimestampApi" name="Timestamp"/>

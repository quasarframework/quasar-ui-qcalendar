---
title: Getting Started
desc: General use and common properties
keys: developing
related:
  - /developing/qcalendarday
  - /developing/qcalendarmonth
  - /developing/qcalendarmonth-minimode
  - /developing/qcalendaragenda
  - /developing/qcalendarresource
  - /developing/qcalendarscheduler
  - /developing/qcalendartask
---

# Getting started

This section will highlight a number common properties and generalities amonst the various calendars. Other, more specific properties will be discussed in their respective sections.

## Timestamp

QCalendar comes with a built-in `Timestamp` library that handles all of the needs and wants of each calendar type. In fact, you can use it too! Before including another date/time library, and possibly adding bloat to your app, verify the Timestamp library can handle what you need to do. If not, suggestions and PRs are welcomed.

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

## Date format

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| model-value | String      | YYYY-DD-MM   |

## Now

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| now      | String         | YYYY-DD-MM   |

## Localization
### Locale

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| locale    | String         | en-US        |

## Dark and bordered

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| dark     | Boolean        |              |
| bordered | Boolean        |              |

## Weekdays

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| weekdays | Array          | [0,1,2,3,4,5,6] |

## Date type

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| date-type| String         | round        |

## Alignment

### Weekday

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| weekday-align | String    | left        |

### Date

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| date-align | String       | right        |

## Active date

### No active date

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| no-active-date | Boolean  |              |

## Disabling days

### Disabled days

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| disabled-days | Array     |              |

### Disabled before

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| disabled-before | String  | YYYY-MM-DD   |

### Disabled after

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| disabled-after | String   | YYYY-MM-DD   |

### Disabled weekdays

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| disabled-weekdays | Array | [0,6]        |

## No header

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| no-header | Boolean       |              |

## No scroll

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| no-scroll | Boolean       |              |

## Labels
### Short weekday label

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| short-weekday-label | Boolean       |              |

### Minimum label Length

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| min-label-length | Number \| String       |              |

### Label breakpoints

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| label-breakpoints | Array | [75,35]      |

## Transitions

### Animated

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| animated | Boolean        |              |

### Previous transition

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| transiton-prev | String   | slide-right  |

### Next transition

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| transiton-next | String   | slide-left   |

### Transitions types

roll-right
roll-left
roll-up
roll-down

slide-right
slide-left
slide-up
slide-down

jump-right
jump-left
jump-up
jump-down

fade
scale
rotate
spin
flip


## Hoverable and focusable

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| hoverable | Boolean       |              |
| focusable | Boolean       |              |

## Focus type

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| focus-type | Array        |              |


| Value    | Description    |
| -------  | -------------- |
| day      |                |
| date     |                |
| weekday  |                |
| interval |                |
| resource |                |

## Selection
### Selected dates

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| selected-dates | Array        |              |


### Selected start and end dates

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| selected-start-end-dates | Array        |              |

## Drag and drop

### Drag enter

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| drag-enter-func | Funtion       |              |

### Drag over

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| drag-over-func | Funtion       |              |

### Drag leave

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| drag-leave-func | Funtion       |              |

### Drop

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| drag-func | Funtion       |              |

## Slots and events

Slots and events look very similar to each other. Different slots have different data, but they all have the `scope` in common.

Your slotted data will look like this:

```js
{
  scope: { /* more data */ }
}
```

Where as an event will look like this:

```js
{
  scope: { /* more data */ },
  event: { /* the event data */ }
}
```

You can always destructure the `scope` from the slotted data:

```html
<q-calendar-day #day="{ scope }" />
```

If the scope has a timestamp within it and that's all you need, then you can destructure even further:

```html
<q-calendar-day #day="{ scope: { timestamp } }" />
```

The pattern here is to **always** be recognizable to the developer and to know what to expect.
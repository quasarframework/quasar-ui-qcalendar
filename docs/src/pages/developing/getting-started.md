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
---

This section will highlight a number common properties and generalities amongst the various calendars. Other, more specific properties, will be discussed in their respective calendar sections.

## Timestamp

QCalendar comes with a built-in `Timestamp` library that handles all of the needs and wants of each calendar type. In fact, you can use it too! Before including another date/time library, and possibly adding bloat to your app, verify the Timestamp library can handle what you need to do. If not, suggestions and PRs are welcomed.

The two most important things to know what's happening behind the scenes are Timestamp's format, which is `YYYY-MM-DD`, and the actual `Timestamp` object. This object is used in many slots and events.

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

If you need your own Timestamps, to be used with other exported functions, then the exported function `parseTimestamp` will fill in most of these fields, give a date in format of `YYYY-MM-DD HH:mm` with optional time. However, that can be expensive time-wise, so if you use this and need the minimal, then use the exported `parsed` function. If you have a JavaScript `Date` you can use the exported `parseDate` function to generate your Timestamp object for you.

## Date format

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| model-value | String      | YYYY-DD-MM   |

`model-value` is how the date is set in QCalendar and is the User selected date when there is an interactive calendar. This is the current date and can be used to move the calendar to a previous or next view (ie: day, week, month, etc). Typically, you set this with something like `v-model="selectedDate"`. If your `selectedDate` contains a `null`, then the current date (today's date) will be used. 

## Now

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| now      | String         | YYYY-DD-MM   |

If you do not set the `now` property, it will be set to the current date (today's date). This property represents **today**, but it doesn't have to be today.

## Localization

Internally, QCalendar uses the browser's `Intl.DateTimeFormat` for all localization. Therefore, QCalendar can only display the localization properly if it is supported by the User's browser. If for some reason, it is not supported, then the fallback is to use American English (`en-US`). If you wanted to display French Canadian, you would use `fr-CA`, or Brazilian Portuguese `pt-BR`.

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| locale    | String         | en-US        |

## Dark and bordered

If you want a calendar to display dark mode, then set the `dark` property. If you want a calendar to have a border, then set the `bordered` property.

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| dark     | Boolean        |              |
| bordered | Boolean        |              |

## Weekdays

`weekdays` is a property that allows you to adjust the order of the days of the week. It is an array of numbers from 0 (Sunday) to 6 (Saturday). The default is `[0,1,2,3,4,5,6]`. If you wanted to have a 5 day work week, you would remove the Sunday and Saturday representations like this: `[1,2,3,4,5]`. If you wanted a calendar where Monday was the first day of the week, you would move Sunday to the end, like this: `[1,2,3,4,5,6,0]`. Don't get too funky with this, as you may get unexpected results and handling.

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| weekdays | Array          | [0,1,2,3,4,5,6] |

## Date type

The only two values accepted for the `date-type` property are `round` (default), `rounded` and `square`.

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| date-type| String         | round        |

## Alignment

The calendars all support header alignment in one way or another. There is another property, not displayed here and for interval-based calendars only, called `date-header`, that gives more control. You will have to look at the respective calendars to read about this property.

### Weekday

The acceptable values are `left`, `center` (default) and `right`.

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| weekday-align | String    | left        |

### Date

The acceptable values are `left`, `center` (default) and `right`. 

::: warning
When using `QCalendarMonth`, the month name and day of the year values cannot be displayed if this alignment is set to `center`.
:::

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| date-align | String       | right        |

## Active date

The active date is changed when the user clicks on a date or navigates using previous or next. In some edge cases, it is preferable not to show the active date (like when making a calendar date range selection).

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| no-active-date | Boolean  |              |

## Disabling days

### Disabled days

This property is an Array of dates in the format `YYYY-MM-DD`.

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| disabled-days | Array     |              |

### Disabled before

This property is a date String in the format `YYYY-MM-DD`. Any date before this date, including the given date, will be disabled.

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| disabled-before | String  | YYYY-MM-DD   |

### Disabled after

This property is a date String in the format `YYYY-MM-DD`. Any date after this date, including the given date, will be disabled.

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| disabled-after | String   | YYYY-MM-DD   |

### Disabled weekdays

The `disabled-weekdays` property uses the same input as the `weekdays` property. Any value in the array will be disabled. Remember, 0=Sunday and 6=Saturday. So, to disable weekends, simply use `[0,6]`.

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| disabled-weekdays | Array | [0,6]        |

## No header

There may be some edge-cases where the header is not desirable. There is an example that shows how to build your own navigation with header information.

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| no-header | Boolean       |              |

## No scroll

All calendars try to take up 100% width and height. Either use styles to constrain a calendar or have a parent element (like a div) do it. In either case, the calendar will display it's own scrollbar. Mostly so that headers are still visible. If you have an edge-case where this is not desirable, you can turn it off with the `no-scroll` property.

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| no-scroll | Boolean       |              |

## Labels

All labels in the calendars are formatted with the browsers internal `Intl.DateTimeFormat` function. This function allows you to specify a short format. For instance, `Saturday` becomes `Sat`. All calendars can automatically shrink label values. Some may first get an ellipsis, then short format and even smaller, if needed.

### Short weekday label

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| short-weekday-label | Boolean       |              |

### Minimum label Length

As explained above, the calendars can format weekday labels smaller than the `Intl.DateTimeFormat` short format. The edge-case for this is to create a very small calendar picker. In this case, you could set the `min-weekday-length` to 1, in which case only the first character of the label will be used. This may not be desireable for some languages, as the weekdays may all have the same first character. In this case, set it to 2 or 3, whatever best suits the locale you are aiming for.

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| min-weekday-length | Number \| String       |              |

### Label breakpoints

The `weekday-breakpoints` property is an array of two numbers. The parent div that contains the label knows it's width. The array contains the values where you want label values to go from long format to short format automatically. The second value is when you want the values to start using extra short format based on the `min-weekday-length` property.

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| weekday-breakpoints | Array | [75,35]      |

## Transitions

Transitions are a way to make your calendar come alive to your end-user. When a calendar changes to a previous or next week/month, instead of just instantly displaying it, we can use the `animated` property to turn on transitions.

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| animated | Boolean        |              |

Then you can use the `transiton-prev` and `transiton-next` properties to change the default behavior, which is `slide-right` and `slide-left`, respectively.

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| transiton-prev | String   | slide-right  |
| transiton-next | String   | slide-left   |

See the [QCalendar Transitions](/developing/qcalendar-transitions) for more information.
## Hoverable and focusable

The `hoverable` property allows each cell in a calendar to display a hovering effect. Sometimes this can be beneficial for the user as well as giving your calendar a bit of pizzaz. It comes with overhead, so it is optional.

The `focusable` property allows various cells within the calendar to have focus. This allows end-users to tab or shift-tab with navigation.

The `focus-type` property works with the `focusable` property to determine what can have focus. This is an array of values. The values are: `day`, `date`, `weekday`, `interval`, and `resource`.

::: warning
Not all `focus-type` values can be used with all calendars. For instance, `interval` won't work with QCalendarMonth and `day` won't work for interval-based calendars.
:::

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| hoverable | Boolean       |              |
| focusable | Boolean       |              |
| focus-type | Array        | ['day','weekday']|


## Selection
### Selected dates

The `selected-dates` property is an array of dates in the form of `YYYY-MM-DD`.

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| selected-dates | Array    |              |


### Selected start and end dates

The property `selected-start-end-dates` takes an array of arrays. Each internal array contains a start and end date that is a selection. This allows you to have multiple selections if you wish.

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| selected-start-end-dates | Array        |              |

## Drag and drop

### Drag enter

::: warning
When the `drag-enter-func` property is called, which is pointing to your function, you must call within that function `e.preventDefault()`, otherwise Drag and Drop will not work.
:::

All functions receive a function signature of `(e, type, scope)`. `e` is the actual event, `type` is a string, denoting where it came from. For instance, `day`, `weekday`, `interval`, etc. And, `scope` will be the data associate with this particular cell.

For all functions, you can return `true` or `false`. If true, this tells the calendar to add additional `droppable` property into the `scope`. Then you can use `day-class`, `interval-class` or `weekday-class` to modify the CSS.

As an example:

```js
  onWeekdayClass ({ scope }) {
    return {
      droppable: scope.droppable === true
    }
  }
```
Then you can have CSS which defines your `droppable` class.

:::
The `day-class`, `interval-class` and `weekday-class` properties are explained in their respective calendars.
:::

::: tip
Don't forget to check out the Drag and Drop examples and look at their sources on GitHub.
:::

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| drag-enter-func | Funtion | :drag-enter-func="onDragEnter" |
| drag-over-func | Funtion  | :drag-over-func="onDragOver" |
| drag-leave-func | Funtion | :drag-leave-func="onDragLeave" |
| drop-func | Funtion       | :drop-func="onDrop" |

## Slots and events

Slots and events look very similar to each other. Different slots have different data, but they all have the `scope` key in common.

Your slotted data will look like this:

```js
{
  scope: { /* more data */ }
}
```

Where an event will look like this:

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
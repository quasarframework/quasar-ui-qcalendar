---
title: QCalendarDay
desc: Developing with QCalendarDay
examples: Day
---

<script import>
import QCalendarDayApi from '@quasar/quasar-ui-qcalendar/dist/api/QCalendarDay.json'
</script>

QCalendarDay renders one or more days as a vertical time-grid. It is the best
fit when users need to see how events line up against hours, intervals, and the
current time within a focused schedule.

Use this calendar for appointment books, daily planning, room bookings, service
dispatch boards, and any workflow where start time, duration, and overlap matter
more than a broad month overview.

<MarkdownApi :api="QCalendarDayApi" name="QCalendarDay"/>

## Date Type

Use `date-type` when the day calendar should interpret the model date in a
specific way. This is helpful when integrating with data sources that normalize
dates before passing them into the calendar.

<MarkdownExample title="Date Type" file="DayDateType"/>

## Dark

Use the Toggle Dark Mode control to compare the day calendar in light and dark
styling without changing the global site theme.

<MarkdownExample title="Dark" file="DayDark"/>

## 3 Day

With the QCalendarDay calendar using the `day` view, any number of days can be set with the `max-days` property.

::: tip
The first day displayed will always be today's date or the initial date of the `modelValue`.
:::

<MarkdownExample title="3 Day" file="Day3Day"/>

## Alignment

You can use the properties `date-header`, `date-align` and `weekday-align` to manipulate how the header area looks.

<MarkdownExample title="Alignment" file="DayAlignment"/>

## Cell Width

You can specify the `cell-width` property to make your calendar overrun it's horizontal boundaries.

The calendar goes into a special `sticky` mode when this happens so you can scroll vertically and/or horizontally.

This example also uses the `max-days` property.

<MarkdownExample title="Cell Width" file="DayCellWidth"/>

## Column Count

The `column-count` property allows for a single day to be displayed multiple times.

<MarkdownExample title="Column Count" file="DayColumnCount"/>

## Column Count Plus

You can customize the display further via the `head-day` slot.

<MarkdownExample title="Column Count Plus" file="DayColumnCountPlus"/>

## Disabled Before After

All days before and after the current day have been disabled with the properties `disabled-before` and `disabled-after`.

<MarkdownExample title="Disabled Before After" file="DayDisabledBeforeAfter"/>

## Disabled Days

The example anchors its date to a visible day and disables that visible date with the `disabled-days` property.

The first example uses an array of dates to disable each specific date.

The second example uses the object form with `from`, `to`, `color`, and `textColor` to create a reservation-style disabled range.

<MarkdownExample title="Disabled Days" file="DayDisabledDays"/>

## Disabled Weekdays

The weekends have been disabled with the `disabled-weekdays` property.

<MarkdownExample title="Disabled Weekdays" file="DayDisabledWeekdays"/>

## Hour 24 Format

Use `hour24-format` when interval labels should display with 24-hour time. This
is common for scheduling, operations, and internationalized apps.

<MarkdownExample title="Hour 24 Format" file="DayHour24Format"/>

## Locale

Locale controls generated date and weekday labels. Use it when the calendar
needs to follow the same language and regional formatting as the rest of the app.

<MarkdownExample title="Locale" file="DayLocale"/>

## Max Days

Use `max-days` to render multiple consecutive day columns from a single day-view
calendar. This is a good fit for compact multi-day schedules where a full week
would be too wide.

<MarkdownExample title="Max Days" file="DayMaxDays"/>

## Month

This example switches the day calendar into a month-like display through the
wrapper mode. It is useful when comparing behavior shared across calendar modes.

<MarkdownExample title="Month" file="DayMonth"/>

## Navigation

This example uses the `use-navigation` property along with the `focusable` and `focus-type` properties.

If the calendar has focus you can use the <kbd>&larr;</kbd> and <kbd>&rarr;</kbd> keys on your keyboard for navigation.

On the intervals, you can use <kbd>Tab</kbd> and <kbd>Shift</kbd>+<kbd>Tab</kbd> for navigation.

<MarkdownExample title="Navigation" file="DayNavigation"/>

## No Active Date

Use `no-active-date` when focus or selection should not visually mark the model
date. This keeps read-only schedules from looking like the user has chosen a day.

<MarkdownExample title="No Active Date" file="DayNoActiveDate"/>

## No Header

Use `no-header` when the surrounding UI already provides date context or custom
navigation. The calendar body still renders intervals, but the built-in header is
removed.

<MarkdownExample title="No Header" file="DayNoHeader"/>

## No Scroll

When the property `no-scroll` is used, you must provide an outter div that has `overflow: auto` to control the scrolling.

::: tip
Note that the date header now scrolls with the rest of the calendar.
:::

<MarkdownExample title="No Scroll" file="DayNoScroll"/>

## Now

The current date has been set to tomorrow via the `now` property.

<MarkdownExample title="Now" file="DayNow"/>

## Selection

The example below uses the `selected-start-end-dates` property in conjunction with mouse events to select interval ranges.

::: tip
Try toggling the `Mobile selection` to see how selection can be changed.
:::

<MarkdownExample title="Selection" file="DaySelection"/>

## Theme

The theme example shows how calendar CSS variables can be overridden to create a
custom look while keeping the same calendar markup and behavior.

<MarkdownExample title="Theme" file="DayTheme"/>

## Transitions

Transitions animate movement between day ranges. They are most helpful when
users need a visual cue that Prev and Next moved the calendar through time.

<MarkdownExample title="Transitions" file="DayTransitions"/>

## Intervals

### Interval Count

`interval-count` is the number of interval rows the calendar renders. It is not an
hour value by itself; it is counted in whatever unit `interval-minutes` defines.

With the default `interval-minutes` of `60`, each interval is one hour, so
`interval-count="4"` renders four one-hour rows. If `interval-minutes` is `30`, the
same count renders four half-hour rows, or two hours total.

Use this formula when planning the visible range:

`visible hours = interval-count * interval-minutes / 60`

<MarkdownExample title="Interval Count" file="DayIntervalCount"/>

### Interval Height

<MarkdownExample title="Interval Height" file="DayIntervalHeight"/>

### Interval Minutes (15)

<MarkdownExample title="Interval Minutes (15)" file="DayIntervalMinutes15"/>

### Interval Minutes (30)

<MarkdownExample title="Interval Minutes (30)" file="DayIntervalMinutes30"/>

### Interval Start

`interval-start` is the number of intervals to skip from midnight before rendering
the first row. It uses the same unit as `interval-minutes`.

In this example, `interval-minutes="30"` means each interval is 30 minutes.
`interval-start="18"` skips 18 half-hour intervals:

`18 * 30 minutes = 540 minutes = 9:00 AM`

`interval-count` still controls how many rows render after that start point. Here,
`interval-count="16"` renders 16 half-hour rows, so the visible range is 9:00 AM
through 5:00 PM.

<MarkdownExample title="Interval Start" file="DayIntervalStart"/>

### Modify Intervals

Using the properties `interval-minutes`, `interval-start` and `interval-count`, you can control how the calendar looks in terms of the range of intervals.

This has been a difficult concept for some to grasp.

Basically, think of a base interval as 1, which is 60 minutes. To display a full day, the interval count would be set to 24. Say you want the calendar to start at 06:00 in the morning, so you set interval start to 6. What happens now, is the intervals start at 6am, but the last 6 intervals got pushed into the next day. In this case, you must remove 6 from the count, thereby making interval count 18 (24 - 6).

Now, we change interval minutes to 15 (for 15 minute segmented intervals). That means, there are 4 times the number of intervals to deal with for each hour. A full day would then be 96 (24h x 4). Starting at 06:00 means interval start would be 24 (6h \* 4), which also means we need to remove that number off the end to prevent bleed-over onto the next day. The interval count then becomes 72 (96 - 24).

<MarkdownExample title="Modify Intervals" file="DayModifyIntervals"/>

### Selected Intervals

The example below uses the `selected-dates` property with mouse events to toggle
individual time intervals. Click an interval to select it, and click it again to
remove it from the selected list.

<MarkdownExample title="Selected Intervals" file="DaySelectedIntervals"/>

## Slots

### Column Header

<MarkdownExample title="Slot - Column Header" file="DaySlotColumnHeader"/>

### Day Body

This example uses both the `day-body` and `head-day-event` slots.

You can click the `head-day-event` badges which will call the calendar's `scrolltoTime` method.

<MarkdownExample title="Slot - Day Body" file="DaySlotDayBody"/>

### Day Container (Show Current Time)

The example below uses the `day-container` slot to show a current time indicator absolutely positioned.

::: tip
You might have to scroll down to the current time to see the example working.
:::

<MarkdownExample title="Slot - Day Container (Show Current Time)" file="DaySlotDayContainerShowCurrentTime"/>

### Head Day

<MarkdownExample title="Slot - Head Day" file="DaySlotHeadDay"/>

### Head Day (Event)

<MarkdownExample title="Slot - Head Day (Event)" file="DaySlotHeadDayEvent"/>

### Head Intervals

<MarkdownExample title="Slot - Head Intervals" file="DaySlotHeadIntervals"/>

## Recipes

### Custom Header

This example shows how you can build your own custom navigation bar.

<MarkdownExample title="CustomHeader" file="DayCustomHeader"/>

### Drag and Drop

Drag any items in the list to a calendar interval or the top header.

::: tip
Don't use css `border` to outline a cell. It won't look right because the calendar is already using the borders and some are explicitly turned off.

Instead use `box-shadow` to create an inset like this `box-shadow: inset 0 0 0 1px rgba(0,140,200,.8)`.
:::

<MarkdownExample title="Drag and Drop" file="DayDragAndDrop"/>

### Mouse Wheel Resize and Move

This example uses the `day-body` slot to render interval events, then adds wheel handlers to resize, move, and zoom the day view.

<MarkdownExample title="Mouse Wheel Resize and Move" file="DayMouseWheelEvents"/>

### Server Data

This recipe keeps the calendar empty until you click **Load visible range**. The
button simulates waiting for a server response, then fills the visible calendar
with data returned for the current range.

<MarkdownExample title="Server Data" file="DayServerData"/>

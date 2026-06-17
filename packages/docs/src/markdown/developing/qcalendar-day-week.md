---
title: QCalendarDay (Week)
desc: Developing with QCalendarDay (Week)
examples: Week
---

<script import>
import QCalendarDayApi from '@quasar/quasar-ui-qcalendar/dist/api/QCalendarDay.json'
</script>

QCalendarDay in week mode uses the day calendar's interval grid while showing an
entire week of columns. It gives users the detail of a timed schedule without
losing the context of adjacent days.

Use this view for weekly appointment schedules, staff calendars, class plans, and
drag-and-drop workflows where users need to move timed items across days as well
as up and down through the time grid.

<MarkdownApi :api="QCalendarDayApi" name="QCalendarDay"/>

## Date Type

Use `date-type` when the week view should interpret the model date in a specific
way. This helps keep week calculations aligned with the date format used by your
data source.

<MarkdownExample title="Date Type" file="WeekDateType"/>

## Dark

Use the Toggle Dark Mode control to compare the week calendar in light and dark
styling without changing the global site theme.

<MarkdownExample title="Dark" file="WeekDark"/>

## Alignment

You can use the properties `date-header`, `date-align` and `weekday-align` to manipulate how the header area looks.

<MarkdownExample title="Alignment" file="WeekAlignment"/>

## Cell Width

You can specify the `cell-width` property to make your calendar overrun it's horizontal boundaries.

The calendar goes into a special `sticky` mode when this happens so you can scroll vertically and/or horizontally.

<MarkdownExample title="Cell Width" file="WeekCellWidth"/>

## Disabled Before After

All days before and after the current day have been disabled with the properties `disabled-before` and `disabled-after`.

<MarkdownExample title="Disabled Before After" file="WeekDisabledBeforeAfter"/>

## Disabled Days

The example anchors its date to a visible week and disables a short run of visible days with the `disabled-days` property.

The first example uses an array of dates to disable each specific date.

The second example uses the object form with `from`, `to`, `color`, and `textColor` to create a reservation-style disabled range.

<MarkdownExample title="Disabled Days" file="WeekDisabledDays"/>

## Disabled Weekdays

The weekends have been disabled with the `disabled-weekdays` property.

<MarkdownExample title="Disabled Weekdays" file="WeekDisabledWeekdays"/>

## First Day Monday

Set `first-day-monday` when users expect the week to begin on Monday. The visible
week range and header labels shift together.

<MarkdownExample title="First Day Monday" file="WeekFirstDayMonday"/>

## Five Day Workweek

Use `weekdays` to limit the week view to the days that matter. This example shows
a Monday through Friday workweek without weekend columns.

<MarkdownExample title="Five Day Workweek" file="WeekFiveDayWorkweek"/>

## Focusable/Hoverable

::: tip
If the property `focus-type` contains `weekday`, you can also use the <kbd>Enter</kbd> or <kbd>Space</kbd> keys for date selection.
:::

<MarkdownExample title="Focusable/Hoverable" file="WeekFocusableHoverable"/>

## Hour 24 Format

Use `hour24-format` when interval labels should use 24-hour time. This is often
preferred in scheduling and operations-heavy interfaces.

<MarkdownExample title="24 Hour" file="Week24Hour"/>

## Locale

Locale controls generated date and weekday labels. Use it when the week calendar
needs to follow the language and regional formatting of your app.

<MarkdownExample title="Locale" file="WeekLocale"/>

## Navigation

This example uses the `use-navigation` property along with the `focusable` and `focus-type` properties.

If the calendar has focus you can use the <kbd>&larr;</kbd> and <kbd>&rarr;</kbd> keys on your keyboard for navigation.

If a page contains more than one calendar with `use-navigation`, keyboard events follow the calendar that contains focus. The active calendar root receives the `q-calendar--keyboard-active` class so you can style or debug the focused calendar.

On the intervals, you can use <kbd>Tab</kbd> and <kbd>Shift</kbd>+<kbd>Tab</kbd> for navigation.

<MarkdownExample title="Navigation" file="WeekNavigation"/>

## No Active Date

Use `no-active-date` when the model date should not be highlighted in the week
view. This avoids implying that a day is selected in read-only schedules.

<MarkdownExample title="No Active Date" file="WeekNoActiveDate"/>

## No Header

Use `no-header` when you want to provide date context or navigation outside of
the calendar. The week grid remains visible while the built-in header is removed.

<MarkdownExample title="No Header" file="WeekNoHeader"/>

## No Scroll

When the property `no-scroll` is used, you must provide an outter div that has `overflow: auto` to control the scrolling.

::: tip
Note that the date header now scrolls with the rest of the calendar.
:::

<MarkdownExample title="No Scroll" file="WeekNoScroll"/>

## Now

The current date has been set to tomorrow via the `now` property.

<MarkdownExample title="Now" file="WeekNow"/>

## Selection

The example below uses the `selected-start-end-dates` property in conjunction with mouse events to select interval ranges.

::: tip
Try toggling the `Mobile selection` to see how selection can be changed.
:::

<MarkdownExample title="Selection" file="WeekSelection"/>

## Theme

The theme example shows how calendar CSS variables can be overridden to style the
week view without changing the component structure.

<MarkdownExample title="Theme" file="WeekTheme"/>

## Transitions

Transitions animate movement between week ranges. They help users understand
that Prev and Next are moving the visible week through time.

<MarkdownExample title="Transitions" file="WeekTransitions"/>

## Intervals

### Interval Count

`interval-count` is the number of interval rows each day column renders. It is not
an hour value by itself; it is counted in whatever unit `interval-minutes` defines.

With the default `interval-minutes` of `60`, each interval is one hour, so
`interval-count="4"` renders four one-hour rows for each visible day. If
`interval-minutes` is `30`, the same count renders four half-hour rows, or two
hours total.

Use this formula when planning the visible range:

`visible hours = interval-count * interval-minutes / 60`

<MarkdownExample title="Interval Count" file="WeekIntervalCount"/>

### Interval Height

<MarkdownExample title="Interval Height" file="WeekIntervalHeight"/>

### Interval Minutes (15)

<MarkdownExample title="Interval Minutes (15)" file="WeekIntervalMinutes15"/>

### Interval Minutes (30)

<MarkdownExample title="Interval Minutes (30)" file="WeekIntervalMinutes30"/>

### Interval Start

`interval-start` is the number of intervals to skip from midnight before rendering
the first row. It uses the same unit as `interval-minutes`.

In this example, `interval-minutes="30"` means each interval is 30 minutes.
`interval-start="18"` skips 18 half-hour intervals:

`18 * 30 minutes = 540 minutes = 9:00 AM`

`interval-count` still controls how many rows render after that start point. Here,
`interval-count="16"` renders 16 half-hour rows, so each day column shows 9:00 AM
through 5:00 PM.

<MarkdownExample title="Interval Start" file="WeekIntervalStart"/>

### Modify Intervals

Using the properties `interval-minutes`, `interval-start` and `interval-count`, you can control how the calendar looks in terms of the range of intervals.

This has been a difficult concept for some to grasp.

Basically, think of a base interval as 1, which is 60 minutes. To display a full day, the interval count would be set to 24. Say you want the calendar to start at 06:00 in the morning, so you set interval start to 6. What happens now, is the intervals start at 6am, but the last 6 intervals got pushed into the next day. In this case, you must remove 6 from the count, thereby making interval count 18 (24 - 6).

Now, we change interval minutes to 15 (for 15 minute segmented intervals). That means, there are 4 times the number of intervals to deal with for each hour. A full day would then be 96 (24h x 4). Starting at 06:00 means interval start would be 24 (6h \* 4), which also means we need to remove that number off the end to prevent bleed-over onto the next day. The interval count then becomes 72 (96 - 24).

<MarkdownExample title="Modify Intervals" file="WeekModifyIntervals"/>

### Selected Intervals

<MarkdownExample title="Selected Intervals" file="WeekSelectedIntervals"/>

## Slots

### Column Header

<MarkdownExample title="Slot - Column Header" file="WeekSlotColumnHeader"/>

### Day Body

This example uses both the `day-body` and `head-day-event` slots.

You can click the `head-day-event` badges which will call the calendar's `scrolltoTime` method.

<MarkdownExample title="Slot - Day Body" file="WeekSlotDayBody"/>

### Day Container (Show Current Time)

<MarkdownExample title="Slot - Day Container (Show Current Time)" file="WeekSlotDayContainerShowCurrentTime"/>

### Day Interval

<MarkdownExample title="Slot - Day Interval" file="WeekSlotDayInterval"/>

### Head Day

<MarkdownExample title="Slot - Head Day" file="WeekSlotHeadDay"/>

### Head Day (Event)

<MarkdownExample title="Slot - Head Day (Event)" file="WeekSlotHeadDayEvent"/>

### Head Days Event Absolute

Use the `head-days-events` slot when all-day events need to span across multiple
day headers. This example positions event badges absolutely so a multi-day event
can stretch over the correct weekday columns.

<MarkdownExample title="Slot - Head Days Event Absolute" file="WeekSlotHeadDaysEventAbsolute"/>

### Head Intervals

<MarkdownExample title="Slot - Head Intervals" file="WeekSlotHeadIntervals"/>

## Recipes

### Drag and Drop

Drag any items in the list to a calendar interval or the top header.

::: tip
Don't use css `border` to outline a cell. It won't look right because the calendar is already using the borders and some are explicitly turned off.

Instead use `box-shadow` to create an inset like this `box-shadow: inset 0 0 0 1px rgba(0,140,200,.8)`.
:::

<MarkdownExample title="Drag and Drop" file="WeekDragAndDrop"/>

### Server Data

This recipe keeps the calendar empty until you click **Load visible range**. The
button simulates waiting for a server response, then fills the visible calendar
with data returned for the current range.

<MarkdownExample title="Server Data" file="WeekServerData"/>

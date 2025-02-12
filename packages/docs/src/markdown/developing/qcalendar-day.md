---
title: QCalendarDay
desc: Developing with QCalendarDay
examples: Day
---

<script import>
import QCalendarDayApi from '@quasar/quasar-ui-qcalendar/dist/api/QCalendarDay.json'
</script>

<MarkdownApi :api="QCalendarDayApi" name="QCalendarDay"/>

## Dark

This will only make sense if your browser is currently in light mode.

<MarkdownExample title="Dark" file="DayDark" no-github no-edit/>

## 3 Day

With the QCalendarDay calendar using the `day` view, any number of days can be set with the `max-days` property.

::: tip
The first day displayed will always be today's date or the initial date of the `modelValue`.
:::

<MarkdownExample title="3 Day" file="Day3Day" no-github no-edit/>

## Alignment

You can use the properties `date-header`, `date-align` and `weekday-align` to manipulate how the header area looks.

<MarkdownExample title="Alignment" file="DayAlignment" no-github no-edit/>

## Cell Width

You can specify the `cell-width` property to make your calendar overrun it's horizontal boundaries.

The calendar goes into a special `sticky` mode when this happens so you can scroll vertically and/or horizontally.

This example also uses the `max-days` property.

<MarkdownExample title="Cell Width" file="DayCellWidth" no-github no-edit/>

## Column Count

The `column-count` property allows for a single day to be displayed multiple times.

<MarkdownExample title="Column Count" file="DayColumnCount" no-github no-edit/>

## Column Count Plus

You can customize the display further via the `head-day` slot.

<MarkdownExample title="Column Count Plus" file="DayColumnCountPlus" no-github no-edit/>

## Custom Header

This example shows how you can build your own custom navigation bar.

<MarkdownExample title="CustomHeader" file="DayCustomHeader" no-github no-edit/>

## Date Type

<MarkdownExample title="Date Type" file="DayDateType" no-github no-edit/>

## Disabled Before After

All days before and after the current day have been disabled with the properties `disabled-before` and `disabled-after`.

<MarkdownExample title="Disabled Before After" file="DayDisabledBeforeAfter" no-github no-edit/>

## Disabled Days

The next 4 days after the current day have been disabled with the `disabled-days` property.

The first example uses an array of dates to disable each specific date.

The second example uses a range, which is an array within an array of start and end dates.

<MarkdownExample title="Disabled Days" file="DayDisabledDays" no-github no-edit/>

## Disabled Weekdays

The weekends have been disabled with the `disabled-weekdays` property.

<MarkdownExample title="Disabled Weekdays" file="DayDisabledWeekdays" no-github no-edit/>

## Drag and Drop

Drag any items in the list to a calendar interval or the top header.

::: tip
Don't use css `border` to outline a cell. It won't look right because the calendar is already using the borders and some are explicitly turned off.

Instead use `box-shadow` to create an inset like this `box-shadow: inset 0 0 0 1px rgba(0,140,200,.8)`.
:::

<MarkdownExample title="Drag and Drop" file="DayDragAndDrop" no-github no-edit/>

## Hour 12 Format

<MarkdownExample title="Hour 24 Format" file="DayHour24Format" no-github no-edit/>

## Interval Count

<MarkdownExample title="Interval Count" file="DayIntervalCount" no-github no-edit/>

## Interval Height

<MarkdownExample title="Interval Height" file="DayIntervalHeight" no-github no-edit/>

## Interval Minutes (15)

<MarkdownExample title="Interval Minutes (15)" file="DayIntervalMinutes15" no-github no-edit/>

## Interval Minutes (30)

<MarkdownExample title="Interval Minutes (30)" file="DayIntervalMinutes30" no-github no-edit/>

## Interval Start

<MarkdownExample title="Interval Start" file="DayIntervalStart" no-github no-edit/>

## Locale

<MarkdownExample title="Locale" file="DayLocale" no-github no-edit/>

## Max Days

<MarkdownExample title="Max Days" file="DayMaxDays" no-github no-edit/>

## Modify Intervals

Using the proerties `interval-minutes`, `interval-start` and `interval-count`, you can control how the calendar looks in terms of the range of intervals.

This has been a difficult concept for some to grasp.

Basically, think of a base interval as 1, which is 60 minutes. To display a full day, the interval count would be set to 24. Say you want the calendar to start at 06:00 in the morning, so you set interval start to 6. What happens now, is the intervals start at 6am, but the last 6 intervals got pushed into the next day. In this case, you must remove 6 from the count, thereby making interval count 18 (24 - 6).

Now, we change interval minutes to 15 (for 15 minute segmented intervals). That means, there are 4 times the number of intervals to deal with for each hour. A full day would then be 96 (24h x 4). Starting at 06:00 means interval start would be 24 (6h \* 4), which also means we need to remove that number off the end to prevent bleed-over onto the next day. The interval count then becomes 72 (96 - 24).

<MarkdownExample title="Modify Intervals" file="DayModifyIntervals" no-github no-edit/>

## Month

<MarkdownExample title="Month" file="DayMonth" no-github no-edit/>

## Navigation

This example uses the `use-navigation` property along with the `focusable` and `focus-type` properties.

If the calendar has focus you can use the <kbd>&larr;</kbd> and <kbd>&rarr;</kbd> keys on your keyboard for navigation.

On the intervals, you can use <kbd>Tab</kbd> and <kbd>Shift</kbd>+<kbd>Tab</kbd> for navigation.

<MarkdownExample title="Navigation" file="DayNavigation" no-github no-edit/>

## No Active Date

<MarkdownExample title="No Active Date" file="DayNoActiveDate" no-github no-edit/>

## No Header

<MarkdownExample title="No Header" file="DayNoHeader" no-github no-edit/>

## No Scroll

When the property `no-scroll` is used, you must provide an outter div that has `overflow: auto` to control the scrolling.

::: tip
Note that the date header now scrolls with the rest of the calendar.
:::

<MarkdownExample title="No Scroll" file="DayNoScroll" no-github no-edit/>

## Now

The current date has been set to tomorrow via the `now` property.

<MarkdownExample title="Now" file="DayNow" no-github no-edit/>

## Selected Intervals

The example below uses the `selected-dates` property in conjunction with mouse events to toggle selected intervals.

<MarkdownExample title="Selected Intervals" file="DaySelectedIntervals" no-github no-edit/>

## Selection

The example below uses the `selected-start-end-dates` property in conjunction with mouse events to select interval ranges.

::: tip
Try toggling the `Mobile selection` to see how selection can be changed.
:::

<MarkdownExample title="Selection" file="DaySelection" no-github no-edit/>

## Slot - Column Header

<MarkdownExample title="Slot - Column Header" file="DaySlotColumnHeader" no-github no-edit/>

## Slot - Day Body

This example uses both the `day-body` and `head-day-event` slots.

You can click the `head-day-event` badges which will call the calendar's `scrolltoTime` method.

<MarkdownExample title="Slot - Day Body" file="DaySlotDayBody" no-github no-edit/>

## Slot - Day Container (Show Current Time)

The example below uses the `day-container` slot to show a current time indicator absolutely positioned.

::: tip
You might have to scroll down to the current time to see the example working.
:::

<MarkdownExample title="Slot - Day Container (Show Current Time)" file="DaySlotDayContainerShowCurrentTime" no-github no-edit/>

## Slot - Head Day

<MarkdownExample title="Slot - Head Day" file="DaySlotHeadDay" no-github no-edit/>

## Slot - Head Day (Event)

<MarkdownExample title="Slot - Head Day (Event)" file="DaySlotHeadDayEvent" no-github no-edit/>

## Slot - Head Intervals

<MarkdownExample title="Slot - Head Intervals" file="DaySlotHeadIntervals" no-github no-edit/>

## Theme

<MarkdownExample title="Theme" file="DayTheme" no-github no-edit/>

## Transitions

<MarkdownExample title="Transitions" file="DayTransitions" no-github no-edit/>

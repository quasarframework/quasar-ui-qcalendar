---
title: QCalendarDay (Week)
desc: Developing with QCalendarDay (Week)
examples: Week
---

<script import>
import QCalendarDayApi from '@quasar/quasar-ui-qcalendar/dist/api/QCalendarDay.json'
</script>

<MarkdownApi :api="QCalendarDayApi" name="QCalendarDay"/>

## Dark

This will only make sense if your browser is currently in light mode.

<MarkdownExample title="Dark" file="WeekDark"/>

## Alignment

You can use the properties `date-header`, `date-align` and `weekday-align` to manipulate how the header area looks.

<MarkdownExample title="Alignment" file="WeekAlignment"/>

## Cell Width

You can specify the `cell-width` property to make your calendar overrun it's horizontal boundaries.

The calendar goes into a special `sticky` mode when this happens so you can scroll vertically and/or horizontally.

<MarkdownExample title="Cell Width" file="WeekCellWidth"/>

## Date Type

<MarkdownExample title="Date Type" file="WeekDateType"/>

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

## Drag and Drop

Drag any items in the list to a calendar interval or the top header.

::: tip
Don't use css `border` to outline a cell. It won't look right because the calendar is already using the borders and some are explicitly turned off.

Instead use `box-shadow` to create an inset like this `box-shadow: inset 0 0 0 1px rgba(0,140,200,.8)`.
:::

<MarkdownExample title="Drag and Drop" file="WeekDragAndDrop"/>

## First Day Monday

<MarkdownExample title="First Day Monday" file="WeekFirstDayMonday"/>

## Five Day Workweek

<MarkdownExample title="Five Day Workweek" file="WeekFiveDayWorkweek"/>

## Focusable/Hoverable

::: tip
If the property `focus-type` contains `weekday`, you can also use the <kbd>Enter</kbd> or <kbd>Space</kbd> keys for date selection.
:::

<MarkdownExample title="Focusable/Hoverable" file="WeekFocusableHoverable"/>

## Interval Count

<MarkdownExample title="Interval Count" file="WeekIntervalCount"/>

## Interval Height

<MarkdownExample title="Interval Height" file="WeekIntervalHeight"/>

## Interval Minutes (15)

<MarkdownExample title="Interval Minutes (15)" file="WeekIntervalMinutes15"/>

## Interval Minutes (30)

<MarkdownExample title="Interval Minutes (30)" file="WeekIntervalMinutes30"/>

## Interval Start

<MarkdownExample title="Interval Start" file="WeekIntervalStart"/>

## Locale

<MarkdownExample title="Locale" file="WeekLocale"/>

## Modify Intervals

Using the proerties `interval-minutes`, `interval-start` and `interval-count`, you can control how the calendar looks in terms of the range of intervals.

This has been a difficult concept for some to grasp.

Basically, think of a base interval as 1, which is 60 minutes. To display a full day, the interval count would be set to 24. Say you want the calendar to start at 06:00 in the morning, so you set interval start to 6. What happens now, is the intervals start at 6am, but the last 6 intervals got pushed into the next day. In this case, you must remove 6 from the count, thereby making interval count 18 (24 - 6).

Now, we change interval minutes to 15 (for 15 minute segmented intervals). That means, there are 4 times the number of intervals to deal with for each hour. A full day would then be 96 (24h x 4). Starting at 06:00 means interval start would be 24 (6h \* 4), which also means we need to remove that number off the end to prevent bleed-over onto the next day. The interval count then becomes 72 (96 - 24).

<MarkdownExample title="Modify Intervals" file="WeekModifyIntervals"/>

## Navigation

This example uses the `use-navigation` property along with the `focusable` and `focus-type` properties.

If the calendar has focus you can use the <kbd>&larr;</kbd> and <kbd>&rarr;</kbd> keys on your keyboard for navigation.

If a page contains more than one calendar with `use-navigation`, keyboard events follow the calendar that contains focus. The active calendar root receives the `q-calendar--keyboard-active` class so you can style or debug the focused calendar.

On the intervals, you can use <kbd>Tab</kbd> and <kbd>Shift</kbd>+<kbd>Tab</kbd> for navigation.

<MarkdownExample title="Navigation" file="WeekNavigation"/>

## No Active Date

<MarkdownExample title="No Active Date" file="WeekNoActiveDate"/>

## No Header

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

## Selected Intervals

<MarkdownExample title="Selected Intervals" file="WeekSelectedIntervals"/>

## Selection

The example below uses the `selected-start-end-dates` property in conjunction with mouse events to select interval ranges.

::: tip
Try toggling the `Mobile selection` to see how selection can be changed.
:::

<MarkdownExample title="Selection" file="WeekSelection"/>

## Slot - Column Header

<MarkdownExample title="Slot - Column Header" file="WeekSlotColumnHeader"/>

## Slot - Day Body

This example uses both the `day-body` and `head-day-event` slots.

You can click the `head-day-event` badges which will call the calendar's `scrolltoTime` method.

<MarkdownExample title="Slot - Day Body" file="WeekSlotDayBody"/>

## Slot - Day Container (Show Current Time)

<MarkdownExample title="Slot - Day Container (Show Current Time)" file="WeekSlotDayContainerShowCurrentTime"/>

<MarkdownExample title="Slot - Day Interval" file="WeekSlotDayInterval"/>

## Slot - Head Day

<MarkdownExample title="Slot - Head Day" file="WeekSlotHeadDay"/>

## Slot - Head Day (Event)

<MarkdownExample title="Slot - Head Day (Event)" file="WeekSlotHeadDayEvent"/>

## Slot - Head Intervals

<MarkdownExample title="Slot - Head Intervals" file="WeekSlotHeadIntervals"/>

## Theme

<MarkdownExample title="Theme" file="WeekTheme"/>

## Transitions

<MarkdownExample title="Transitions" file="WeekTransitions"/>

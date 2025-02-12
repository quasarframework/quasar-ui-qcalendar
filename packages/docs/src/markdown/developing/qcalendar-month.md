---
title: QCalendarMonth
desc: Developing with QCalendarMonth
examples: Month
---

<script import>
import QCalendarMonthApi from '@quasar/quasar-ui-qcalendar/dist/api/QCalendarMonth.json'
</script>

<MarkdownApi :api="QCalendarMonthApi" name="QCalendarMonth"/>

## Alignment

You can use the properties `date-align` and `weekday-align` to manipulate how the header area looks.

<MarkdownExample title="Alignment" file="MonthAlignment" no-github no-edit/>

## Dark

This will only make sense if your browser is currently in light mode.

<MarkdownExample title="Dark" file="MonthDark" no-github no-edit/>

## Date Type

<MarkdownExample title="Date Type" file="MonthDateType" no-github no-edit/>

## Day Height

When the `day-height` property is 0, then the height is set to `auto`, which will increase the row by the contained contents. If there is no content, then the row may look too small in height. In this case, use the `day-min-height` to specify a minimum height that should be used.

When both `day-height` and `day-min-height` are both set to 0, and the height of the calendar is more than the content, then the calendar will divide the weeks evenly to the bottom of the height.

::: tip
When both `day-height` and `day-min-height` are both set to 0, in this example, the height of the calendar will be set to 600px.
:::

<MarkdownExample title="Day Height" file="MonthDayHeight" no-github no-edit/>

## Day of Year

<MarkdownExample title="Day of Year" file="MonthDayOfYear" no-github no-edit/>

## Disabled Before After

All days before and after the current day have been disabled with the `disabled-before` and `disabled-after` properties.

<MarkdownExample title="Disabled Before After" file="MonthDisabledBeforeAfter" no-github no-edit/>

## Disabled Days

The next 4 days after the current day have been disabled with the `disabled-days` property.

The first example uses an array of dates to disable each specific date.

The second example uses a range, which is an array within an array of start and end dates.

<MarkdownExample title="Disabled Days" file="MonthDisabledDays" no-github no-edit/>

## Disabled Weekdays

The weekends have been disabled with the `disabled-weekdays` property.

<MarkdownExample title="Disabled Weekdays" file="MonthDisabledWeekdays" no-github no-edit/>

## Drag and Drop

Drag any items in the list to a calendar day.

::: tip
Don't use css `border` to outline a cell. It won't look right because the calendar is already using the borders and some are explicitly turned off.

Instead use `box-shadow` to create an inset like this `box-shadow: inset 0 0 0 1px rgba(0,140,200,.8)`.
:::

<MarkdownExample title="Drag and Drop" file="MonthDragAndDrop" no-github no-edit/>

## First Day Monday

<MarkdownExample title="First Day Monday" file="MonthFirstDayMonday" no-github no-edit/>

## Five Day Workweek

<MarkdownExample title="Five Day Workweek" file="MonthFiveDayWorkweek" no-github no-edit/>

## Focusable/Hoverable

<MarkdownExample title="Focusable/Hoverable" file="MonthFocusableHoverable" no-github no-edit/>

## Label Size

<MarkdownExample title="Label Size" file="MonthLabelSize" no-github no-edit/>

## Locale

<MarkdownExample title="Locale" file="MonthLocale" no-github no-edit/>

## Min Weeks

You can use the `min-weeks` property to keep a consistent height for your calendar (no shifting up and down of the bottom calendar for different months).

<MarkdownExample title="Min Weeks" file="MonthMinWeeks" no-github no-edit/>

## Navigation

For keyboard navigation use the `use-navigation` property along with the `focusable` and `focus-type` properties.

When the calendar has focus use the <kbd>Home</kbd>, <kbd>End</kbd>, <kbd>&larr;</kbd>, <kbd>&rarr;</kbd>, <kbd>&uarr;</kbd>, <kbd>&darr;</kbd>, <kbd>PgUp</kbd>, <kbd>PgDn</kbd>, <kbd>Home</kbd> and , <kbd>End</kbd>keys.

You can also use <kbd>Tab</kbd> and <kbd>Shift</kbd>+<kbd>Tab</kbd> for regular browser navigation.

<MarkdownExample title="Navigation" file="MonthNavigation" no-github no-edit/>

## No Active Date

<MarkdownExample title="No Active Date" file="MonthNoActiveDate" no-github no-edit/>

## No Outside Days

<MarkdownExample title="No Outside Days" file="MonthNoOutsideDays" no-github no-edit/>

## Now

The current date has been set to tomorrow via the `now` property.

<MarkdownExample title="Now" file="MonthNow" no-github no-edit/>

## Selected Dates

<MarkdownExample title="Selected Dates" file="MonthSelectedDates" no-github no-edit/>

## Selection Range

<MarkdownExample title="Selection Range" file="MonthSelection" no-github no-edit/>

## Slot - Day (Holidays)

<MarkdownExample title="Slot - Day (Holidays)" file="MonthSlotDayHolidays" no-github no-edit/>

## Slot - Day

<MarkdownExample title="Slot - Day" file="MonthSlotDay" no-github no-edit/>

## Slot - Week

<MarkdownExample title="Slot - Week" file="MonthSlotWeek" no-github no-edit/>

## Theme

<MarkdownExample title="Theme" file="MonthTheme" no-github no-edit/>

## Transitions

<MarkdownExample title="Transitions" file="MonthTransitions" no-github no-edit/>

## Workweeks

<MarkdownExample title="Workweeks" file="MonthWorkweeks" no-github no-edit/>

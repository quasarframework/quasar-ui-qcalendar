---
title: QCalendarMonth (Mini-Mode)
desc: Developing with QCalendarMonth {Mini-Mode)}
examples: MiniMode
---

<script import>
import QCalendarMonthApi from '@quasar/quasar-ui-qcalendar/dist/api/QCalendarMonth.json'
</script>

<MarkdownApi :api="QCalendarMonthApi" name="QCalendarMonth"/>

## Mini-Mode Breakpoint

This example tests the `mini-mode="auto"` with `breakpoint="sm"` properties, which changes the month calendar into mini-mode.

::: tip
You will have to open your dev tools and change the width of the web page to see this example in action.
:::

::: tip
The calendar will fire the event `@mini-mode` with `true` or `false`. This can be captured if needed. For instance, controlling the `day-height` property.

```js
:day-height="isMiniMode ? 0 : 50"
```

:::

<MarkdownExample title="Mini-Mode Breakpoint" file="MiniModeBreakpoint"/>

## Mini-Mode Dark

<MarkdownExample title="Mini-Mode Dark" file="MiniModeDark"/>

## Mini-Mode Date Type

<MarkdownExample title="Mini-Mode Date Type" file="MiniModeDateType"/>

## Mini-Mode Disabled Before After

All days before and after the current day have been disabled with the `disabled-before` and `disabled-after` properties.

<MarkdownExample title="Mini-Mode Disabled Before After" file="MiniModeDisabledBeforeAfter"/>

## Mini-Mode Disabled Days

The next 4 days after the current day have been disabled with the `disabled-days` property.

The first example uses an array of dates to disable each specific date.

The second example uses the object form with `from`, `to`, `color`, and `textColor` to create a reservation-style disabled range.

<MarkdownExample title="Mini-Mode Disabled Days" file="MiniModeDisabledDays"/>

## Mini-Mode Disabled Weekdays

The weekends have been disabled with the `disabled-weekdays` property.

<MarkdownExample title="Mini-Mode Disabled Weekdays" file="MiniModeDisabledWeekdays"/>

## Mini-Mode First Day Monday

<MarkdownExample title="Mini-Mode First Day Monday" file="MiniModeFirstDayMonday"/>

## Mini-Mode Five Day Workweek

<MarkdownExample title="Mini-Mode Five Day Workweek" file="MiniModeFiveDayWorkweek"/>

## Mini-Mode Locale

<MarkdownExample title="Mini-Mode Locale" file="MiniModeLocale"/>

## Mini-Mode Min Weekday Label

<MarkdownExample title="Mini-Mode Min Weekday Label" file="MiniModeMinWeekdayLabel"/>

## Mini-Mode Min Weeks

You can use the `min-weeks` property to keep a consistent height for your calendar (no shifting up and down).

<MarkdownExample title="Mini-Mode Min Weeks" file="MiniModeMinWeeks"/>

## Mini-Mode Multi Month Selection

<MarkdownExample title="Mini-Mode Multi Month Selection" file="MiniModeMultiMonthSelection"/>

## Mini-Mode Navigation

For keyboard navigation use the `use-navigation` property along with the `focusable` and `focus-type` properties.

When the calendar has focus use the <kbd>Home</kbd>, <kbd>End</kbd>, <kbd>&larr;</kbd>, <kbd>&rarr;</kbd>, <kbd>&uarr;</kbd>, <kbd>&darr;</kbd>, <kbd>PgUp</kbd>, <kbd>PgDn</kbd>, <kbd>Home</kbd> and , <kbd>End</kbd>keys.

You can also use <kbd>Tab</kbd> and <kbd>Shift</kbd>+<kbd>Tab</kbd> for regular browser navigation.

<MarkdownExample title="Mini-Mode Navigation" file="MiniModeNavigation"/>

## Mini-Mode No Active Date

<MarkdownExample title="Mini-Mode No Active Date" file="MiniModeNoActiveDate"/>

## Mini-Mode No Outside Days

<MarkdownExample title="Mini-Mode No Outside Days" file="MiniModeNoOutsideDays"/>

## Mini-Mode Now

The current date has been set to tomorrow via the `now` property.

<MarkdownExample title="Mini-Mode Now" file="MiniModeNow"/>

## Mini-Mode QInput

This example uses Quasar's `QInput` component with a mask and regex. The navigation buttons are embedded into the popup.

<MarkdownExample title="Mini-Mode QInput" file="MiniModeQInput"/>

## Mini-Mode Selected Dates

<MarkdownExample title="Mini-Mode Selected Dates" file="MiniModeSelectedDates"/>

## Mini-Mode Selection

<MarkdownExample title="Mini-Mode Selection" file="MiniModeSelection"/>

## Mini-Mode Theme

<MarkdownExample title="Mini-Mode Theme" file="MiniModeTheme"/>

## Mini-Mode Workweeks

<MarkdownExample title="Mini-Mode Workweeks" file="MiniModeWorkweeks"/>

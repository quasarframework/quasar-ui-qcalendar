---
title: QCalendarMonth (Mini-Mode)
desc: Developing with QCalendarMonth {Mini-Mode)}
examples: MiniMode
---

<script import>
import QCalendarMonthApi from '@quasar/quasar-ui-qcalendar/dist/api/QCalendarMonth.json'
</script>

QCalendarMonth mini-mode is a compact version of the month calendar. It keeps the
same date-grid model while reducing visual weight so the calendar can live
inside denser layouts.

Use mini-mode for date pickers, sidebars, filters, dashboards, and responsive
layouts where a full month calendar would take too much space. It is especially
useful when the calendar is a navigation or selection aid instead of the primary
workspace.

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

Use the dark example to confirm mini-mode follows the same dark styling behavior
as the full month calendar. Use the Toggle Dark Mode control to compare both
states without changing the global site theme.

<MarkdownExample title="Mini-Mode Dark" file="MiniModeDark"/>

## Mini-Mode Date Type

Use `date-type` when mini-mode should interpret the model date in a specific way.
This keeps compact date pickers aligned with the format your app stores.

<MarkdownExample title="Mini-Mode Date Type" file="MiniModeDateType"/>

## Mini-Mode Disabled Before After

All days before and after the current day have been disabled with the `disabled-before` and `disabled-after` properties.

<MarkdownExample title="Mini-Mode Disabled Before After" file="MiniModeDisabledBeforeAfter"/>

## Mini-Mode Disabled Days

The example anchors its date to a visible month and disables a short run of visible days with the `disabled-days` property.

The first example uses an array of dates to disable each specific date.

The second example uses the object form with `from`, `to`, `color`, and `textColor` to create a reservation-style disabled range.

<MarkdownExample title="Mini-Mode Disabled Days" file="MiniModeDisabledDays"/>

## Mini-Mode Disabled Weekdays

The weekends have been disabled with the `disabled-weekdays` property.

<MarkdownExample title="Mini-Mode Disabled Weekdays" file="MiniModeDisabledWeekdays"/>

## Mini-Mode First Day Monday

Set `first-day-monday` when the compact calendar should start weeks on Monday.
This mirrors the full month behavior in a smaller layout.

<MarkdownExample title="Mini-Mode First Day Monday" file="MiniModeFirstDayMonday"/>

## Mini-Mode Five Day Workweek

Use `weekdays` to show only workweek days in mini-mode. This is useful when the
compact calendar sits beside scheduling tools that ignore weekends.

<MarkdownExample title="Mini-Mode Five Day Workweek" file="MiniModeFiveDayWorkweek"/>

## Mini-Mode Locale

Locale controls generated labels in the compact calendar. Use it so mini-mode
matches the language and regional formatting of your app.

<MarkdownExample title="Mini-Mode Locale" file="MiniModeLocale"/>

## Mini-Mode Min Weekday Label

Use `min-weekday-label` to control how short the weekday labels become in tight
layouts. This helps mini-mode stay readable at small widths.

<MarkdownExample title="Mini-Mode Min Weekday Label" file="MiniModeMinWeekdayLabel"/>

## Mini-Mode Min Weeks

You can use the `min-weeks` property to keep a consistent height for your calendar (no shifting up and down).

<MarkdownExample title="Mini-Mode Min Weeks" file="MiniModeMinWeeks"/>

## Mini-Mode Multi Month Selection

Multi-month selection demonstrates how selected dates can remain visible while
users move across months. This is useful for compact range pickers and
availability tools.

<MarkdownExample title="Mini-Mode Multi Month Selection" file="MiniModeMultiMonthSelection"/>

## Mini-Mode Navigation

For keyboard navigation use the `use-navigation` property along with the `focusable` and `focus-type` properties.

When the calendar has focus use the <kbd>Home</kbd>, <kbd>End</kbd>, <kbd>&larr;</kbd>, <kbd>&rarr;</kbd>, <kbd>&uarr;</kbd>, <kbd>&darr;</kbd>, <kbd>PgUp</kbd>, <kbd>PgDn</kbd>, <kbd>Home</kbd> and , <kbd>End</kbd>keys.

You can also use <kbd>Tab</kbd> and <kbd>Shift</kbd>+<kbd>Tab</kbd> for regular browser navigation.

<MarkdownExample title="Mini-Mode Navigation" file="MiniModeNavigation"/>

## Mini-Mode No Active Date

Use `no-active-date` when mini-mode should not highlight the model date. This is
useful when the compact calendar is acting as a navigator rather than a selector.

<MarkdownExample title="Mini-Mode No Active Date" file="MiniModeNoActiveDate"/>

## Mini-Mode No Outside Days

Use `no-outside-days` to hide dates from adjacent months. In mini-mode, this can
make the compact grid feel less crowded.

<MarkdownExample title="Mini-Mode No Outside Days" file="MiniModeNoOutsideDays"/>

## Mini-Mode Now

The current date has been set to tomorrow via the `now` property.

<MarkdownExample title="Mini-Mode Now" file="MiniModeNow"/>

## Mini-Mode Selected Dates

Use `selected-dates` to mark important days in the compact month grid. This works
well for small availability, event, or reminder indicators.

<MarkdownExample title="Mini-Mode Selected Dates" file="MiniModeSelectedDates"/>

## Mini-Mode Selection

Selection shows how mini-mode can support picking a date or range from a compact
calendar surface.

<MarkdownExample title="Mini-Mode Selection" file="MiniModeSelection"/>

## Mini-Mode Theme

The theme example confirms mini-mode responds to the same calendar CSS variables
as the full month view.

<MarkdownExample title="Mini-Mode Theme" file="MiniModeTheme"/>

## Recipes

### QInput

This example uses Quasar's `QInput` component with a mask and regex. The navigation buttons are embedded into the popup.

<MarkdownExample title="Mini-Mode QInput" file="MiniModeQInput"/>

### Workweeks

<MarkdownExample title="Mini-Mode Workweeks" file="MiniModeWorkweeks"/>

### Server Data

This recipe keeps the calendar empty until you click **Load visible range**. The
button simulates waiting for a server response, then fills the visible calendar
with data returned for the current range.

<MarkdownExample title="Server Data" file="MiniModeServerData"/>

---
title: QCalendarMonth
desc: Developing with QCalendarMonth
examples: Month
---

<script import>
import QCalendarMonthApi from '@quasar/quasar-ui-qcalendar/dist/api/QCalendarMonth.json'
</script>

QCalendarMonth renders a classic month grid where each cell represents a date.
It is useful when users need broad calendar context, date selection, range
selection, holidays, availability, or day-level event summaries.

Use this calendar when the day is the primary unit of interaction and exact
event times are less important. Month views work well for booking windows,
content schedules, attendance calendars, and planning tools that start from a
big-picture overview.

<MarkdownApi :api="QCalendarMonthApi" name="QCalendarMonth"/>

## Date Type

Use `date-type` when the month calendar should interpret the model date in a
specific way. This keeps the rendered month aligned with the date format your app
stores.

<MarkdownExample title="Date Type" file="MonthDateType"/>

## Dark

Use the Toggle Dark Mode control to compare the month calendar in light and dark
styling without changing the global site theme.

<MarkdownExample title="Dark" file="MonthDark"/>

## Alignment

You can use the properties `date-align` and `weekday-align` to manipulate how the header area looks.

<MarkdownExample title="Alignment" file="MonthAlignment"/>

## Day Height

When the `day-height` property is 0, then the height is set to `auto`, which will increase the row by the contained contents. If there is no content, then the row may look too small in height. In this case, use the `day-min-height` to specify a minimum height that should be used.

When both `day-height` and `day-min-height` are both set to 0, and the height of the calendar is more than the content, then the calendar will divide the weeks evenly to the bottom of the height.

::: tip
When both `day-height` and `day-min-height` are both set to 0, in this example, the height of the calendar will be set to 600px.
:::

<MarkdownExample title="Day Height" file="MonthDayHeight"/>

## Day of Year

Use day-of-year display when users need to see the ordinal day number within the
year. This is useful for planning, manufacturing, logistics, and other calendar
systems that reference day numbers.

<MarkdownExample title="Day of Year" file="MonthDayOfYear"/>

## Disabled Before After

All days before and after the current day have been disabled with the `disabled-before` and `disabled-after` properties.

<MarkdownExample title="Disabled Before After" file="MonthDisabledBeforeAfter"/>

## Disabled Days

The example anchors its date to a visible month and disables a short run of visible days with the `disabled-days` property.

The first example uses an array of dates to disable each specific date.

The second example uses the object form with `from`, `to`, `color`, and `textColor` to create a reservation-style disabled range.

<MarkdownExample title="Disabled Days" file="MonthDisabledDays"/>

## Disabled Weekdays

The weekends have been disabled with the `disabled-weekdays` property.

<MarkdownExample title="Disabled Weekdays" file="MonthDisabledWeekdays"/>

## First Day Monday

Set `first-day-monday` when the month grid should start weeks on Monday instead
of Sunday. This changes both the header order and where dates land in the grid.

<MarkdownExample title="First Day Monday" file="MonthFirstDayMonday"/>

## Five Day Workweek

Use `weekdays` to render a workweek-style month grid. This is helpful when
weekends are irrelevant to the workflow and would only add visual noise.

<MarkdownExample title="Five Day Workweek" file="MonthFiveDayWorkweek"/>

## Focusable/Hoverable

Use `focusable` and `hoverable` when month cells should respond to keyboard focus
and pointer hover. These states are especially useful for selection flows and
accessible date pickers.

<MarkdownExample title="Focusable/Hoverable" file="MonthFocusableHoverable"/>

## Label Size

The `month-label-size` property changes the size of the inline month label text rendered inside month cells.

::: tip
This property only has a visible effect when the month label is actually shown. In `QCalendarMonth`, that typically means using `date-align="left"` or `date-align="right"`. With the default centered date alignment, the inline month label is not rendered.
:::

<MarkdownExample title="Label Size" file="MonthLabelSize"/>

## Locale

Locale controls generated month and weekday labels. Use it when the calendar
should match the language and regional formatting of your app.

<MarkdownExample title="Locale" file="MonthLocale"/>

## Min Weeks

You can use the `min-weeks` property to keep a consistent height for your calendar (no shifting up and down of the bottom calendar for different months).

<MarkdownExample title="Min Weeks" file="MonthMinWeeks"/>

## Navigation

For keyboard navigation use the `use-navigation` property along with the `focusable` and `focus-type` properties.

When the calendar has focus use the <kbd>Home</kbd>, <kbd>End</kbd>, <kbd>&larr;</kbd>, <kbd>&rarr;</kbd>, <kbd>&uarr;</kbd>, <kbd>&darr;</kbd>, <kbd>PgUp</kbd>, and <kbd>PgDn</kbd> keys.

If a page contains more than one calendar with `use-navigation`, keyboard events follow the calendar that contains focus. The active calendar root receives the `q-calendar--keyboard-active` class so you can style or debug the focused calendar.

You can also use <kbd>Tab</kbd> and <kbd>Shift</kbd>+<kbd>Tab</kbd> for regular browser navigation.

<MarkdownExample title="Navigation" file="MonthNavigation"/>

## No Active Date

Use `no-active-date` when the current model date should not be visually marked in
the month grid. This is useful for overview calendars where selection is handled
elsewhere.

<MarkdownExample title="No Active Date" file="MonthNoActiveDate"/>

## No Outside Days

Use `no-outside-days` to hide dates from the previous and next months. This keeps
the grid focused on the current month when outside dates would be distracting.

<MarkdownExample title="No Outside Days" file="MonthNoOutsideDays"/>

## Now

The current date has been set to tomorrow via the `now` property.

<MarkdownExample title="Now" file="MonthNow"/>

## Selected Dates

Use `selected-dates` to mark specific dates independently of the active model
date. This works well for availability, reservations, reminders, or marked
events.

<MarkdownExample title="Selected Dates" file="MonthSelectedDates"/>

## Selection Range

Selection ranges let users choose a start and end date across the month grid.
This pattern is useful for booking windows, reporting periods, and date-range
filters.

<MarkdownExample title="Selection Range" file="MonthSelection"/>

## Theme

The theme example shows how calendar CSS variables can be customized to create a
branded month view without changing component behavior.

<MarkdownExample title="Theme" file="MonthTheme"/>

## Transitions

Transitions animate movement between months. They help users understand that
navigation moved the grid to a previous or next date range.

<MarkdownExample title="Transitions" file="MonthTransitions"/>

## Slots

Slots let you replace or enrich specific parts of the month grid while the
calendar still handles date calculations, layout, and navigation.

### Day (Holidays)

<MarkdownExample title="Slot - Day (Holidays)" file="MonthSlotDayHolidays" no-edit/>

### Day

<MarkdownExample title="Slot - Day" file="MonthSlotDay"/>

### Week

<MarkdownExample title="Slot - Week" file="MonthSlotWeek" no-edit/>

## Recipes

### Drag and Drop

Drag any items in the list to a calendar day.

::: tip
Don't use css `border` to outline a cell. It won't look right because the calendar is already using the borders and some are explicitly turned off.

Instead use `box-shadow` to create an inset like this `box-shadow: inset 0 0 0 1px rgba(0,140,200,.8)`.
:::

<MarkdownExample title="Drag and Drop" file="MonthDragAndDrop"/>

### Sidebar Mini Calendar

Use a mini-mode `QCalendarMonth` beside a larger calendar when you want a navigation pattern similar to Google Calendar or Microsoft Outlook. Both calendars can share the same `v-model`, while the sidebar calendar acts as a compact date picker.

<MarkdownExample title="Sidebar Mini Calendar" file="MonthSidebarMiniCalendar"/>

### Workweeks

Use `show-work-weeks` to show the workweek column. The `head-workweek` slot replaces the header cell that defaults to `#`, and the `workweek` slot replaces each rendered workweek label. If the custom label is wider than the default, increase `--calendar-work-week-width`.

<MarkdownExample title="Workweeks" file="MonthWorkweeks"/>

### Server Data

This recipe keeps the calendar empty until you click **Load visible range**. The
button simulates waiting for a server response, then fills the visible calendar
with data returned for the current range.

<MarkdownExample title="Server Data" file="MonthServerData"/>

### Calendar Adapters

Use `calendar-system` when a month grid should follow a non-Gregorian calendar
system. With an adapter, model values and date-bearing slot data are native to
that calendar, and the native calendar adapter controls month boundaries,
outside-day state, and previous/next month navigation.

This example switches between Islamic Civil (Hijri) and Indian National (Saka)
calendar adapters. The first native day appears in the first visible week, and
outside days are disabled against the native month instead of the Gregorian
month.

<MarkdownExample title="Calendar Adapters" file="MonthCalendarAdapter"/>

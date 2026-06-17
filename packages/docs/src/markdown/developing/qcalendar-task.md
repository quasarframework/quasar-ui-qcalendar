---
title: QCalendarTask
desc: Developing with QCalendarTask
examples: Task
---

<script import>
import QCalendarTaskApi from '@quasar/quasar-ui-qcalendar/dist/api/QCalendarTask.json'
</script>

QCalendarTask renders task rows against a calendar timeline. The left side holds
task metadata and hierarchy, while the date cells show task activity, logged
time, or progress across the visible range.

Use this calendar for project planning, timesheets, roadmaps, work breakdowns,
and reporting views where users need to compare task rows against dates. It is
especially helpful when tasks have child rows, custom heights, or summary footer
rows.

<MarkdownApi :api="QCalendarTaskApi" name="QCalendarTask"/>

## Date Type

Use `date-type` when task calendar dates need to match the format used by your
task data. This keeps task ranges anchored to the intended date values.

<MarkdownExample title="Date Type" file="TaskDateType" no-edit/>

## Dark

Use the Toggle Dark Mode control to compare the task calendar in light and dark
styling without changing the global site theme.

<MarkdownExample title="Dark" file="TaskDark" no-edit/>

## Alignment

You can use the properties `date-header`, `date-align` and `weekday-align` to manipulate how the header area looks.

<MarkdownExample title="Alignment" file="TaskAlignment" no-edit/>

## Disabled Before After

All days before and after the current day have been disabled with the properties `disabled-before` and `disabled-after`.

<MarkdownExample title="Disabled Before After" file="TaskDisabledBeforeAfter" no-edit/>

## Disabled Days

The example anchors its date to a visible month and disables a short run of visible days with the `disabled-days` property.

The first example uses an array of dates to disable each specific date.

The second example uses the object form with `from`, `to`, `color`, and `textColor` to create a reservation-style disabled range.

<MarkdownExample title="Disabled Days" file="TaskDisabledDays" no-edit/>

## Disabled Weekdays

The weekends have been disabled with the `disabled-weekdays` property.

<MarkdownExample title="Disabled Weekdays" file="TaskDisabledWeekdays" no-edit/>

## Focusable Hoverable

::: tip
If the property `focus-type` contains `weekday`, you can also use the <kbd>Enter</kbd> or <kbd>Space</kbd> keys for date selection.
:::

<MarkdownExample title="Focusable Hoverable" file="TaskFocusableHoverable" no-edit/>

## Locale

Locale controls generated date and weekday labels. Use it when task timelines
should match the language and regional formatting of your app.

<MarkdownExample title="Locale" file="TaskLocale" no-edit/>

## Month

Month mode shows task progress across a month-oriented timeline. Use it when
users need a wider planning view than a single week.

<MarkdownExample title="Month" file="TaskMonth" no-edit/>

## No Active Date

Use `no-active-date` when the model date should not be highlighted in the task
calendar. This keeps timeline overviews from implying a selected day.

<MarkdownExample title="No Active Date" file="TaskNoActiveDate" no-edit/>

## No Weekends

Use `no-weekends` when task planning should focus on business days only. This
removes weekend columns from the visible timeline.

<MarkdownExample title="No Weekends" file="TaskNoWeekends" no-edit/>

## Now

The current date has been set to tomorrow via the `now` property.

<MarkdownExample title="Now" file="TaskNow" no-edit/>

## Theme

The theme example shows how task calendar CSS variables can be customized without
changing task layout or behavior.

<MarkdownExample title="Theme" file="TaskTheme" no-edit/>

## Week

Week mode focuses the task timeline on a shorter planning window. It is useful
when users need to review detailed work for the current week.

<MarkdownExample title="Week" file="TaskWeek" no-edit/>

## Recipes

### Children

<MarkdownExample title="Children" file="TaskChildren"/>

### Colored Weekends

<MarkdownExample title="Colored Weekends" file="TaskColoredWeekends" no-edit/>

### Custom Height

You can have each task row have it's own specific height by including a `height` key (as a number of pixels, without the **px**) in each task object. For example:

```js
;[
  {
    title: 'Task 2',
    key: 'TSK-592',
    height: 40,
    logged: [
      { date: '2021-03-06', logged: 3.5 },
      { date: '2021-03-08', logged: 4.0 },
    ],
  },
  {
    title: 'Task 3',
    key: 'TSK-593',
    logged: [
      { date: '2021-03-10', logged: 9 },
      { date: '2021-03-11', logged: 4.8 },
    ],
    expanded: false,
    children: [
      {
        title: 'Subtask 3.1',
        key: 'TSK-593.1',
        height: 40,
        logged: [
          { date: '2021-03-10', logged: 4.5 },
          { date: '2021-03-11', logged: 2.4 },
        ],
      },
      {
        title: 'Subtask 3.2',
        key: 'TSK-593.2',
        height: 40,
        logged: [
          { date: '2021-03-10', logged: 4.5 },
          { date: '2021-03-11', logged: 2.4 },
        ],
      },
    ],
  },
]
```

::: tip
If the `task-min-height` is more than your custom height, then you won't see the custom height work. Either set `task-min-height` to a lower value or to 0 (for auto).
:::

<MarkdownExample title="Custom Height" file="TaskCustomHeight"/>

### Multiple Footer Rows

Pass multiple items to `model-footer` when the summary area needs more than one
row. Each footer model item is rendered as its own row and is passed to the
`footer-task` and `footer-day` slots so the row can calculate a different value,
such as logged hours and entry counts.

<MarkdownExample title="Multiple Footer Rows" file="TaskMultipleFooterRows" no-edit/>

### Title Rows

<MarkdownExample title="Title Rows" file="TaskTitleRows" no-edit/>

### Timesheet

Use QCalendarTask as a dense timesheet when each row represents a work item and
each date cell stores the logged time for that item. This recipe combines task
slots, day slots, footer totals, fixed cell widths, weekend shading, and a
selected-day outline to create a month-period worklog view.

<MarkdownExample title="Timesheet" file="TaskTimesheet"/>

### Server Data

This recipe keeps the calendar empty until you click **Load visible range**. The
button simulates waiting for a server response, then fills the visible calendar
with data returned for the current range.

<MarkdownExample title="Server Data" file="TaskServerData"/>

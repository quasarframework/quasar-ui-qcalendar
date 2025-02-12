---
title: QCalendarTask
desc: Developing with QCalendarTask
examples: Task
---

<script import>
import QCalendarTaskApi from '@quasar/quasar-ui-qcalendar/dist/api/QCalendarTask.json'
</script>

<MarkdownApi :api="QCalendarTaskApi" name="QCalendarTask"/>

## Alignment

You can use the properties `date-header`, `date-align` and `weekday-align` to manipulate how the header area looks.

<MarkdownExample title="Alignment" file="TaskAlignment" no-github no-edit/>

## Children

<MarkdownExample title="Children" file="TaskChildren" no-github no-edit/>

## Colored Weekends

<MarkdownExample title="Colored Weekends" file="TaskColoredWeekends" no-github no-edit/>

## Custom Height

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

<MarkdownExample title="Custom Height" file="TaskCustomHeight" no-github no-edit/>

## Dark

This will only make sense if your browser is currently in light mode.

<MarkdownExample title="Dark" file="TaskDark" no-github no-edit/>

## Date Type

<MarkdownExample title="Date Type" file="TaskDateType" no-github no-edit/>

## Disabled Before After

All days before and after the current day have been disabled with the properties `disabled-before` and `disabled-after`.

<MarkdownExample title="Disabled Before After" file="TaskDisabledBeforeAfter" no-github no-edit/>

## Disabled Days

The next 4 days after the current day have been disabled with the `disabled-days` property.

The first example uses an array of dates to disable each specific date.

The second example uses a range, which is an array within an array of start and end dates.

<MarkdownExample title="Disabled Days" file="TaskDisabledDays" no-github no-edit/>

## Disabled Weekdays

The weekends have been disabled with the `disabled-weekdays` property.

<MarkdownExample title="Disabled Weekdays" file="TaskDisabledWeekdays" no-github no-edit/>

## Focusable Hoverable

::: tip
If the property `focus-type` contains `weekday`, you can also use the <kbd>Enter</kbd> or <kbd>Space</kbd> keys for date selection.
:::

<MarkdownExample title="Focusable Hoverable" file="TaskFocusableHoverable" no-github no-edit/>

## Locale

<MarkdownExample title="Locale" file="TaskLocale" no-github no-edit/>

## Month

<MarkdownExample title="Month" file="TaskMonth" no-github no-edit/>

## Multiple Footer Rows

<MarkdownExample title="Multiple Footer Rows" file="TaskMultipleFooterRows" no-github no-edit/>

## No Active Date

<MarkdownExample title="No Active Date" file="TaskNoActiveDate" no-github no-edit/>

## No Weekends

<MarkdownExample title="No Weekends" file="TaskNoWeekends" no-github no-edit/>

## Now

The current date has been set to tomorrow via the `now` property.

<MarkdownExample title="Now" file="TaskNow" no-github no-edit/>

## Theme

<MarkdownExample title="Theme" file="TaskTheme" no-github no-edit/>

## Title Rows

<MarkdownExample title="Title Rows" file="TaskTitleRows" no-github no-edit/>

## Week

<MarkdownExample title="Week" file="TaskWeek" no-github no-edit/>

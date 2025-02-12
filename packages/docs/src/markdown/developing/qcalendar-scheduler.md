---
title: QCalendarScheduler
desc: Developing with QCalendarScheduler
examples: Scheduler
---

<script import>
import QCalendarSchedulerApi from '@quasar/quasar-ui-qcalendar/dist/api/QCalendarScheduler.json'
</script>

<MarkdownApi :api="QCalendarSchedulerApi" name="QCalendarScheduler"/>

## Alignment

You can use the properties `date-header`, `date-align` and `weekday-align` to manipulate how the header area looks.

<MarkdownExample title="Alignment" file="SchedulerAlignment" no-github no-edit/>

## Cell Width

You can specify the `cell-width` property to make your calendar overrun it's horizontal boundaries.

The calendar goes into a special `sticky` mode when this happens so you can scroll vertically and/or horizontally.

<MarkdownExample title="Cell Width" file="SchedulerCellWidth" no-github no-edit/>

## Children

<MarkdownExample title="Children" file="SchedulerChildren" no-github no-edit/>

## Custom Height

You can have each resource row have it's own specific height by including a `height` key (as a number of pixels, without the **px**) in each resource object. For example:

```js
;[
  { id: '1', name: 'John', height: 20 },
  {
    id: '2',
    name: 'Board Room',
    height: 40,
    expanded: false,
    children: [
      { id: '2.1', name: 'Room-1', height: 20 },
      {
        id: '2.2',
        name: 'Room-2',
        height: 40,
        expanded: false,
        children: [
          { id: '2.2.1', name: 'Partition-A', height: 20 },
          { id: '2.2.2', name: 'Partition-B', height: 20 },
          { id: '2.2.2', name: 'Partition-C', height: 20 },
        ],
      },
    ],
  },
  { id: '3', name: 'Mary' },
  { id: '4', name: 'Susan' },
  { id: '5', name: 'Olivia' },
]
```

::: tip
If the `resource-min-height` is more than your custom height, then you won't see the custom height work. Either set `resource-min-height` to a lower value or to 0 (for auto).
:::

<MarkdownExample title="Custom Height" file="SchedulerCustomHeight" no-github no-edit/>

## Dark

This will only make sense if your browser is currently in light mode.

<MarkdownExample title="Dark" file="SchedulerDark" no-github no-edit/>

## Date Type

<MarkdownExample title="Date Type" file="SchedulerDateType" no-github no-edit/>

## Disabled Before After

All days before and after the current day have been disabled with the properties `disabled-before` and `disabled-after`.

<MarkdownExample title="Disabled Before After" file="SchedulerDisabledBeforeAfter" no-github no-edit/>

## Disabled Days

The next 4 days after the current day have been disabled with the `disabled-days` property.

The first example uses an array of dates to disable each specific date.

The second example uses a range, which is an array within an array of start and end dates.

<MarkdownExample title="Disabled Days" file="SchedulerDisabledDays" no-github no-edit/>

## Disabled Weekdays

The weekends have been disabled with the `disabled-weekdays` property.

<MarkdownExample title="Disabled Weekdays" file="SchedulerDisabledWeekdays" no-github no-edit/>

## Drag And Drop

Drag any items in the list to a calendar day or the top header.

::: tip
Don't use css `border` to outline a cell. It won't look right because the calendar is already using the borders and some are explicitly turned off.

Instead use `box-shadow` to create an inset like this `box-shadow: inset 0 0 0 1px rgba(0,140,200,.8)`.
:::

<MarkdownExample title="Drag And Drop" file="SchedulerDragAndDrop" no-github no-edit/>

## First Day Monday

<MarkdownExample title="First Day Monday" file="SchedulerFirstDayMonday" no-github no-edit/>

## Five Day Workweek

<MarkdownExample title="Five Day Workweek" file="SchedulerFiveDayWorkweek" no-github no-edit/>

## Focusable Hoverable

::: tip
If the property `focus-type` contains `weekday`, you can also use the <kbd>Enter</kbd> or <kbd>Space</kbd> keys for date selection.
:::

<MarkdownExample title="Focusable Hoverable" file="SchedulerFocusableHoverable" no-github no-edit/>

## Locale

<MarkdownExample title="Locale" file="SchedulerLocale" no-github no-edit/>

## No Active Date

<MarkdownExample title="No Active Date" file="SchedulerNoActiveDate" no-github no-edit/>

## Now

The current date has been set to tomorrow via the `now` property.

<MarkdownExample title="Now" file="SchedulerNow" no-github no-edit/>

## Slot - Head Resources

<MarkdownExample title="Slot - Head Resources" file="SchedulerSlotHeadResources" no-github no-edit/>

## Slot - Resource Days

<MarkdownExample title="Slot - Resource Days" file="SchedulerSlotResourceDays" no-github no-edit/>

## Slot - Resource Label

<MarkdownExample title="Slot - Resource Label" file="SchedulerSlotResourceLabel" no-github no-edit/>

## Theme

<MarkdownExample title="Theme" file="SchedulerTheme" no-github no-edit/>

## Width Height

<MarkdownExample title="Width Height" file="SchedulerWidthHeight" no-github no-edit/>

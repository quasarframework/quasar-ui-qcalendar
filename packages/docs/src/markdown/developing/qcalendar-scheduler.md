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

<MarkdownExample title="Alignment" file="SchedulerAlignment"/>

## Cell Width

You can specify the `cell-width` property to make your calendar overrun it's horizontal boundaries.

The calendar goes into a special `sticky` mode when this happens so you can scroll vertically and/or horizontally.

<MarkdownExample title="Cell Width" file="SchedulerCellWidth"/>

## Children

<MarkdownExample title="Children" file="SchedulerChildren"/>

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

<MarkdownExample title="Custom Height" file="SchedulerCustomHeight"/>

## Dark

This will only make sense if your browser is currently in light mode.

<MarkdownExample title="Dark" file="SchedulerDark"/>

## Date Type

<MarkdownExample title="Date Type" file="SchedulerDateType"/>

## Disabled Before After

All days before and after the current day have been disabled with the properties `disabled-before` and `disabled-after`.

<MarkdownExample title="Disabled Before After" file="SchedulerDisabledBeforeAfter"/>

## Disabled Days

The example anchors its date to a visible week and disables a short run of visible days with the `disabled-days` property.

The first example uses an array of dates to disable each specific date.

The second example uses the object form with `from`, `to`, `color`, and `textColor` to create a reservation-style disabled range.

<MarkdownExample title="Disabled Days" file="SchedulerDisabledDays"/>

## Disabled Weekdays

The weekends have been disabled with the `disabled-weekdays` property.

<MarkdownExample title="Disabled Weekdays" file="SchedulerDisabledWeekdays"/>

## Drag And Drop

Drag any items in the list to a calendar day or the top header.

::: tip
Don't use css `border` to outline a cell. It won't look right because the calendar is already using the borders and some are explicitly turned off.

Instead use `box-shadow` to create an inset like this `box-shadow: inset 0 0 0 1px rgba(0,140,200,.8)`.
:::

<MarkdownExample title="Drag And Drop" file="SchedulerDragAndDrop"/>

## First Day Monday

<MarkdownExample title="First Day Monday" file="SchedulerFirstDayMonday"/>

## Five Day Workweek

<MarkdownExample title="Five Day Workweek" file="SchedulerFiveDayWorkweek"/>

## Focusable Hoverable

::: tip
If the property `focus-type` contains `weekday`, you can also use the <kbd>Enter</kbd> or <kbd>Space</kbd> keys for date selection.
:::

<MarkdownExample title="Focusable Hoverable" file="SchedulerFocusableHoverable"/>

## Locale

<MarkdownExample title="Locale" file="SchedulerLocale"/>

## No Active Date

<MarkdownExample title="No Active Date" file="SchedulerNoActiveDate"/>

## Now

The current date has been set to tomorrow via the `now` property.

<MarkdownExample title="Now" file="SchedulerNow"/>

## Slot - Head Resources

<MarkdownExample title="Slot - Head Resources" file="SchedulerSlotHeadResources"/>

## Slot - Resource Days

<MarkdownExample title="Slot - Resource Days" file="SchedulerSlotResourceDays"/>

## Slot - Resource Label

<MarkdownExample title="Slot - Resource Label" file="SchedulerSlotResourceLabel"/>

## Theme

<MarkdownExample title="Theme" file="SchedulerTheme"/>

## Width Height

There is no dedicated `resource-width` prop on `QCalendarScheduler`.

To control the left resources pane width, set the css variable `--calendar-resources-width` on the calendar, for example through `:style` or a custom class.

The example below uses that css variable together with `resource-height`, `resource-min-height`, and `cell-width`.

<MarkdownExample title="Width Height" file="SchedulerWidthHeight"/>

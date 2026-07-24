---
title: QCalendarResource
desc: Developing with QCalendarResource
examples: Resource
---

<script import>
import QCalendarResourceApi from '@quasar/quasar-ui-qcalendar/dist/api/QCalendarResource.json'
</script>

QCalendarResource groups an interval timeline by resource. Each row represents a
person, room, machine, route, or other assignable item, and the columns represent
time intervals for the active date range.

Use this calendar when users need to compare availability or scheduled work
across resources. It is a good fit for room booking, staff assignment, service
dispatch, equipment planning, and any view where the resource is as important as
the time.

<MarkdownApi :api="QCalendarResourceApi" name="QCalendarResource"/>

## Scroll Events

Listen to `@scroll` for live updates from the internal scroll area and
`@scrollend` for one update after scrolling settles. Both events receive a
`CalendarScrollEvent` object with the native `event`, scrolling `target`,
`scrollLeft`, `scrollTop`, `scrollWidth`, `scrollHeight`, `clientWidth`, and
`clientHeight`.

## Dark

Use the Toggle Dark Mode control to compare the resource calendar in light and
dark styling without changing the global site theme.

<MarkdownExample title="Dark" file="ResourceDark"/>

## Disabled Days

The example anchors its date to a visible week. The first example disables individual days with date strings. The second example uses the object form with `from`, `to`, `color`, and `textColor` to create a reservation-style disabled range.

<MarkdownExample title="Disabled Days" file="ResourceDisabledDays"/>

## Focusable Hoverable

Use focusable and hoverable states when resource rows or intervals need visible
interaction feedback. This helps users understand which resource area is ready
for keyboard or pointer actions.

<MarkdownExample title="Focusable Hoverable" file="ResourceFocusableHoverable"/>

## Hour 24 Format

Use `hour24-format` when interval labels should display in 24-hour time. This is
common for resource booking and operations schedules.

<MarkdownExample title="Hour 24 Format" file="ResourceHour24Format"/>

## No Sticky

Use `no-sticky` when the resource labels and headers should scroll naturally with
the rest of the calendar instead of staying pinned.

<MarkdownExample title="No Sticky" file="ResourceNoSticky"/>

## Theme

The theme example shows how the resource calendar can be styled with CSS
variables while keeping the same layout and interactions.

<MarkdownExample title="Theme" file="ResourceTheme"/>

## Width Height

Width and height settings help tune resource timelines for dense data. Use this
example when labels, resource rows, or intervals need more room than the defaults
provide.

<MarkdownExample title="Width Height" file="ResourceWidthHeight"/>

## Intervals

### Modify Intervals

Using the properties `interval-minutes`, `interval-start` and `interval-count`, you can control how the calendar looks in terms of the range of intervals.

This has been a difficult concept for some to grasp.

`interval-minutes` defines the size of one interval, `interval-start` skips that
many intervals from midnight, and `interval-count` controls how many interval rows
render after the start point.

Use these formulas when planning the visible range:

`start hour = interval-start * interval-minutes / 60`

`visible hours = interval-count * interval-minutes / 60`

Basically, think of a base interval as 1, which is 60 minutes. To display a full day, the interval count would be set to 24. Say you want the calendar to start at 06:00 in the morning, so you set interval start to 6. What happens now, is the intervals start at 6am, but the last 6 intervals got pushed into the next day. In this case, you must remove 6 from the count, thereby making interval count 18 (24 - 6).

Now, we change interval minutes to 15 (for 15 minute segmented intervals). That means, there are 4 times the number of intervals to deal with for each hour. A full day would then be 96 (24h x 4). Starting at 06:00 means interval start would be 24 (6h \* 4), which also means we need to remove that number off the end to prevent bleed-over onto the next day. The interval count then becomes 72 (96 - 24).

<MarkdownExample title="Modify Intervals" file="ResourceModifyIntervals"/>

## Slots

Slots let you customize the resource labels, interval labels, and interval cells
while the calendar continues to manage scrolling, sizing, and date math.

### Head Resources

The resource header defaults to `Resources`. Use this slot to localize the label
or replace it with custom header content.

<MarkdownExample title="Slot - Head Resources" file="ResourceSlotHeadResources"/>

### Interval Label

<MarkdownExample title="Slot - Interval Label" file="ResourceSlotIntervalLabel"/>

### Resource Intervals

<MarkdownExample title="Slot - Resource Intervals" file="ResourceSlotResourceIntervals"/>

### Resource Label

<MarkdownExample title="Slot - Resource Label" file="ResourceSlotResourceLabel"/>

## Recipes

### Children

<MarkdownExample title="Children" file="ResourceChildren"/>

### Custom Height

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
If the `resource-min-height` is more than your custom height, then you won't see the custom height work. Either set `resource-min-height` to a lower value or to 0.
:::

<MarkdownExample title="Custom Height" file="ResourceCustomHeight"/>

### Server Data

This recipe keeps the calendar empty until you click **Load visible range**. The
button simulates waiting for a server response, then fills the visible calendar
with data returned for the current range.

<MarkdownExample title="Server Data" file="ResourceServerData"/>

### Calendar Adapters

Resource views are interval timelines for a selected date. Use calendar adapters
with the resource header, interval labels, and interval slots when the resource
plan needs native calendar context.

<MarkdownExample title="Calendar Adapters" file="ResourceCalendarAdapter"/>

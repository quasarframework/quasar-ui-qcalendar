---
title: QCalendarResource
desc: Developing with QCalendarResource
examples: Resource
---

<script import>
import QCalendarResourceApi from '@quasar/quasar-ui-qcalendar/dist/api/QCalendarResource.json'
</script>

<MarkdownApi :api="QCalendarResourceApi" name="QCalendarResource"/>

## Children

<MarkdownExample title="Children" file="ResourceChildren" no-github no-edit/>

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
If the `resource-min-height` is more than your custom height, then you won't see the custom height work. Either set `resource-min-height` to a lower value or to 0.
:::

<MarkdownExample title="Custom Height" file="ResourceCustomHeight" no-github no-edit/>

## Dark

This will only make sense if your browser is currently in light mode.

<MarkdownExample title="Dark" file="ResourceDark" no-github no-edit/>

## Focusable Hoverable

<MarkdownExample title="Focusable Hoverable" file="ResourceFocusableHoverable" no-github no-edit/>

## Hour 24 Format

<MarkdownExample title="Hour 24 Format" file="ResourceHour24Format" no-github no-edit/>

## Modify Intervals

Using the proerties `interval-minutes`, `interval-start` and `interval-count`, you can control how the calendar looks in terms of the range of intervals.

This has been a difficult concept for some to grasp.

Basically, think of a base interval as 1, which is 60 minutes. To display a full day, the interval count would be set to 24. Say you want the calendar to start at 06:00 in the morning, so you set interval start to 6. What happens now, is the intervals start at 6am, but the last 6 intervals got pushed into the next day. In this case, you must remove 6 from the count, thereby making interval count 18 (24 - 6).

Now, we change interval minutes to 15 (for 15 minute segmented intervals). That means, there are 4 times the number of intervals to deal with for each hour. A full day would then be 96 (24h x 4). Starting at 06:00 means interval start would be 24 (6h \* 4), which also means we need to remove that number off the end to prevent bleed-over onto the next day. The interval count then becomes 72 (96 - 24).

<MarkdownExample title="Modify Intervals" file="ResourceModifyIntervals" no-github no-edit/>

## No Sticky

<MarkdownExample title="No Sticky" file="ResourceNoSticky" no-github no-edit/>

## Slot - Head Resources

<MarkdownExample title="Slot - Head Resources" file="ResourceSlotHeadResources" no-github no-edit/>

## Slot - Interval Label

<MarkdownExample title="Slot - Interval Label" file="ResourceSlotIntervalLabel" no-github no-edit/>

## Slot - Resource Intervals

<MarkdownExample title="Slot - Resource Intervals" file="ResourceSlotResourceIntervals" no-github no-edit/>

## Slot - Resource Label

<MarkdownExample title="Slot - Resource Label" file="ResourceSlotResourceLabel" no-github no-edit/>

## Theme

<MarkdownExample title="Theme" file="ResourceTheme" no-github no-edit/>

## Width Height

<MarkdownExample title="Width Height" file="ResourceWidthHeight" no-github no-edit/>

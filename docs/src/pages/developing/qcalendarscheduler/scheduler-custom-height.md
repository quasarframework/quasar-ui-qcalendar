---
title: Scheduler - Custom Height
desc: QCalendarScheduler - Custom Height
keys: developing
---
## Customizing the resource height

You can have each resource row have it's own specific height by including a `height` key (as a number of pixels, without the **px**) in each resource object. For example:

```js
[
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
          { id: '2.2.2', name: 'Partition-C', height: 20 }
        ]
      }
    ]
  },
  { id: '3', name: 'Mary' },
  { id: '4', name: 'Susan' },
  { id: '5', name: 'Olivia' }
]
```

::: tip
If the `resource-min-height` is more than your custom height, then you won't see the custom height work. Either set `resource-min-height` to a lower value or to 0.
:::

<example-viewer
  title="Custom Height"
  file="SchedulerCustomHeight"
  codepen-title="QCalendarScheduler"
/>

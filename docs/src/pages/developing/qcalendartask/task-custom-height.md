---
title: Task - Custom Height
desc: QCalendarTask - Custom Height
keys: developing
related:
  - /developing/qcalendarresource/resource-custom-height
  - /developing/qcalendarscheduler/scheduler-custom-height
---
## Customizing the task height

You can have each task row have it's own specific height by including a `height` key (as a number of pixels, without the **px**) in each task object. For example:

```js
[
  {
    title: 'Task 2',
    key: 'TSK-592',
    height: 40,
    logged: [
      { date: '2021-03-06', logged: 3.5 },
      { date: '2021-03-08', logged: 4.0 }
    ]
  },
  {
    title: 'Task 3',
    key: 'TSK-593',
    logged: [
      { date: '2021-03-10', logged: 9 },
      { date: '2021-03-11', logged: 4.8 }
    ],
    expanded: false,
    children: [
      {
        title: 'Subtask 3.1',
        key: 'TSK-593.1',
        height: 40,
        logged: [
          { date: '2021-03-10', logged: 4.5 },
          { date: '2021-03-11', logged: 2.4 }
        ]
      },
      {
        title: 'Subtask 3.2',
        key: 'TSK-593.2',
        height: 40,
        logged: [
          { date: '2021-03-10', logged: 4.5 },
          { date: '2021-03-11', logged: 2.4 }
        ]
      },
    ]
  },
]
```

::: tip
If the `task-min-height` is more than your custom height, then you won't see the custom height work. Either set `task-min-height` to a lower value or to 0 (for auto).
:::

<example-viewer
  title="Custom Height"
  file="TaskCustomHeight"
  codepen-title="QCalendarTask"
/>

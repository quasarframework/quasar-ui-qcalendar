---
title: Day - Drag and Drop
desc: QCalendarDay - Drag and Drop
keys: developing
related:
  - /developing/qcalendarday-week/week-drag-and-drop
  - /developing/qcalendarmonth/month-drag-and-drop
  - /developing/qcalendarscheduler/scheduler-drag-and-drop
---
Drag any items in the list to a calendar interval or the top header.

::: tip
Don't use css `border` to outline a cell. It won't look right because the calendar is already using the borders and some are explicitly turned off.

Instead use `box-shadow` to create an inset like this `box-shadow: inset 0 0 0 1px rgba(0,140,200,.8)`.
:::

<example-viewer
  title="Drag and Drop"
  file="DayDragAndDrop"
  codepen-title="QCalendarDay"
/>

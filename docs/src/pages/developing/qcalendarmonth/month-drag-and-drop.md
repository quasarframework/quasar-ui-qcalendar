---
title: Month - Drag and Drop
desc: QCalendarMonth - Drag and Drop
keys: developing
---
Drag any items in the list to a calendar day.

::: tip
Don't use css `border` to outline a cell. It won't look right because the calendar is already using the borders and some are explicitly turned off.

Instead use `box-shadow` to create an inset like this `box-shadow: inset 0 0 0 1px rgba(0,140,200,.8)`.
:::

<example-viewer
  title="Drag and Drop"
  file="MonthDragAndDrop"
  codepen-title="QCalendarMonth"
/>

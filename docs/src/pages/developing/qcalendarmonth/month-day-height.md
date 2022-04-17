---
title: Month - Day Height
desc: QCalendarMonth - Day Height
keys: developing
---
When the `day-height` property is 0, then the height is set to `auto`, which will increase the row by the contained contents. If there is no content, then the row may look too small in height. In this case, use the `day-min-height` to specify a minimum height that should be used.

When both `day-height` and `day-min-height` are both set to 0, and the height of the calendar is more than the content, then the calendar will divide the weeks evenly to the bottom of the height.

::: tip
When both `day-height` and `day-min-height` are both set to 0, in this example, the height of the calendar will be set to 600px.
:::

<example-viewer
  title="Day Height"
  file="MonthDayHeight"
  codepen-title="QCalendarMonth"
/>

---
title: QCalendarDay (Intervals)
desc: Developing with QCalendarDay
examples: Intervals
---

<script import>
import QCalendarDayApi from '@quasar/quasar-ui-qcalendar/dist/api/QCalendarDay.json'
</script>

The intervals examples focus on the lower-level time-grid pieces used by
QCalendarDay. They show how interval sizing, navigation, and month-style helper
views can be combined when the default day or week examples are not quite
specific enough.

Use these recipes when you are building custom scheduling controls around the
interval grid, especially when the calendar needs to coordinate with an external
month selector or custom navigation UI.

<MarkdownApi :api="QCalendarDayApi" name="QCalendarDay"/>

## Recipes

### Month Cell Width

<MarkdownExample title="Month Cell Width" file="IntervalsMonthCellWidth"/>

### Month Navigation

<MarkdownExample title="Month Navigation" file="IntervalsMonthNavigation"/>

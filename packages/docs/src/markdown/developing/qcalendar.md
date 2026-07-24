---
title: QCalendar
desc: Developing with QCalendar
examples: General
---

The QCalendar component is a wrapper around all other calendar components. It can take the same properties and has all the same slots -- combined. There are some edge-cases where this would be useful, but in general, avoid using it. Because it wraps ALL calendars, you will get no tree-shaking benefits.

::: warning
Use the QCalendar (wrapper) only if necessary. By using this component, all calendar components will be loaded whether you use them or not.
:::

It has one additional property to specify what determines the calendar type to be displayed.

| Property | Type   | Example |
| -------- | ------ | ------- |
| mode     | String | day     |

Available values are: `day` (default), `month`, `agenda`, `resource`, `scheduler`, and `task`.

When using multi-calendars in this way, be sure to guard your slots to avoid errors and issues. For instance, the `footer-task` slot would get an error as an invalid slot for month mode. You can gaurd like this:

```html
<template v-if="selectedCalendar === 'task'" #footer-task="{ scope: { start, end, footer } }">
  <div class="summary ellipsis">
    <div class="title ellipsis" v-html="footer.title"></div>
    <div class="total" v-html="totals(start, end)"></div>
  </div>
</template>
```

<script import>
import QCalendarApi from '@quasar/quasar-ui-qcalendar/dist/api/QCalendar.json'
</script>

<MarkdownApi :api="QCalendarApi" name="QCalendar"/>

## Scroll Events

When the active `mode` has an internal scroll area (`day`, `agenda`,
`resource`, `scheduler`, or `task`), listen to `@scroll` for live updates and
`@scrollend` for one update after scrolling settles. Month mode does not have
an internal scroll area and does not emit these events.

Both events receive a `CalendarScrollEvent` object with the native `event`,
scrolling `target`, `scrollLeft`, `scrollTop`, `scrollWidth`, `scrollHeight`,
`clientWidth`, and `clientHeight`.

When `no-scroll` removes the active view's internal scroll area, listen for
scroll events on the external scrolling element instead.

## All

<MarkdownExample title="All" file="CalendarAll" no-edit/>

## Calendar Adapters

QCalendar forwards the adapter-aware props to the selected view. This is useful
when a wrapper is choosing the visible calendar type at runtime. With
`calendar-system`, date-bearing values are native to the active adapter, and
Gregorian interop is available through `calendarIdentity` in date-bearing slots.

<MarkdownExample title="Calendar Adapters" file="CalendarAdapterWrapper"/>

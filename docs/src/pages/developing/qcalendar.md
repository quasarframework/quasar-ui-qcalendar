---
title: QCalendar (wrapper)
desc: All calendars combined into one
keys: developing
---

The QCalendar component is a wrapper around all other calendar components. It can take the same properties and has all the same slots -- combined. There are some edge-cases where this would be useful, but in general, avoid using it. Because it wraps ALL calendars, you will get no tree-shaking benefits.

::: warning
Use the QCalendar (wrapper) only if necessary. By using this component, all calendar components will be loaded whether you use them or not.
:::

It has one additional property to specify that determines the calendar type to be displayed.

| Property | Type           | Example      |
| -------  | -------------- | -----------  |
| mode     | String         | day          |

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

<example-viewer
  title="QCalendar - All"
  file="CalendarAll"
  codepen-title="QCalendar"
/>

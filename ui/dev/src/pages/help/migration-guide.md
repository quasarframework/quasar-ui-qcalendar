---
title: Migration Guide
desc: Migrate from v3 to v4
keys: Help
---

The information below can help you migrate from QCalendar v3.x to QCalendar v4.0.0 (beta).

## QCalendar v4.0.0 Beta 1
Welcome to the QCalendar v4.0.0 Beta release.

With this update comes a lot of changes, with over 90% of QCalendar being rewritten. Please read below to understand these changes and how they will affect you for upgrading.

> Until the final stable version is released, some aspects of the calendar may change. We're not planning for additional breaking changes, but unforeseen reported issues may require us to do breaking changes (unlikely, but keep this in mind). So please make sure that you read each v4 beta version's release notes carefully before upgrading.

## QCalendar rewritten to use Vue v3 composition API
This means you get better in-editor auto-completion support amongst many other advantages.

## New Calendar
Just quickly, for information purposes, there is a new QCalendarTask component for writing timesheet and gantt-like calendars. This component is still actively being worked on (at the time this document was being written). So, just a heads up.

## Calendar Types
Previously, the actual QCalendar component was a wrapper around other calendar components. You could specify which component-type to use via the `view` property (ex: `month`, `week`, `agenda`, etc). There were a LOT of different views. These components have now been made available on an individual basis. This is better for tree-shaking.

However, there is still a QCalendar (wrapper) component and if you have an edge-case that needs the multi-component support the new proerty to use is `mode` because some calendar's still need the `view` property. The available values are: `day`, `month`, `agenda`, `resource`, `scheduler` and `task`.

If you want to take an advantage of a smaller foot-print then you have the option of importing each calendar type on an individual basis. For this, you will need to **NOT** be using the QCalendar app-extension, as this will import the QCalendar (wrapper). Instead, you will want to install the UI component directly into your package.json:

>  yarn add @quasar\quasar-ui-qcalendar

A caveat, QCalendar was made more modular. Even the SASS files were split up. These will need to be imported as well.

In a Vue (script section) or js file:

```js
import '@quasar/quasar-ui-qcalendar/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarTransitions.sass'
```

In your app.sass:

```js
@import '@quasar/quasar-ui-qcalendar/QCalendarVariables.sass'
@import '@quasar/quasar-ui-qcalendar/QCalendarTransitions.sass'
```

If you don't use the calendar transitions, it's likely you would need to import that file.

Once the package is installed into your node_modules, you can import the calendar-type you want to deal with:

**QCalendarDay:**
```js
import { QCalendarDay } from '@quasar/quasar-ui-qcalendar/QCalendarDay.js'
import '@quasar/quasar-ui-qcalendar/QCalendarDay.sass'
```

**QCalendarMonth:**
```js
import { QCalendarMonth } from '@quasar/quasar-ui-qcalendar/QCalendarMonth.js'
import '@quasar/quasar-ui-qcalendar/QCalendarMonth.sass'
```

**QCalendarAgenda:**
```js
import { QCalendarAgenda } from '@quasar/quasar-ui-qcalendar/QCalendarAgenda.js'
import '@quasar/quasar-ui-qcalendar/QCalendarAgenda.sass'
```

**QCalendarScheduler:**
```js
import { QCalendarScheduler } from '@quasar/quasar-ui-qcalendar/QCalendarScheduler.js'
import '@quasar/quasar-ui-qcalendar/QCalendarScheduler.sass'
```

**QCalendarResource:**
```js
import { QCalendarResource } from '@quasar/quasar-ui-qcalendar/QCalendarResource.js'
import '@quasar/quasar-ui-qcalendar/QCalendarResource.sass'
```

**QCalendarTask:**
```js
import { QCalendarTask } from '@quasar/quasar-ui-qcalendar/QCalendarTask.js'
import '@quasar/quasar-ui-qcalendar/QCalendarTask.sass'
```

If you want to use QCalendar (wrapper) then install the Qcalendar app-extension via the Quasar CLI:

> quasar ext add @quasar/qcalendar

or

```js
import { QCalendar } from '@quasar/quasar-ui-qcalendar/QCalendar.js'
import '@quasar/quasar-ui-qcalendar/QCalendar.sass'
```

### Boot file
If you want to create your own Quasar boot file and include a specific calendar that way, you can, but the import will be slightly different. We'll just use QCalendarDay as an example so you get the idea:

```js
import { boot } from 'quasar/wrappers'

import '@quasar/quasar-ui-qcalendar/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarDay.sass'

// CalendarPlugin can be called anything...it's just a 'default' export
import CalendarPlugin from '@quasar/quasar-ui-qcalendar/QCalendarDay.js'

export default boot(({ app }) => {
  app.use(CalendarPlugin)
})
```

If you need multiple calendars, just do them in the same file.

## Common changes

### Properties

### Slots


### Events

## QCalendar

## QCalendarDay

## QCalendarMonth

## QCalendarAgenda

## QCalendarScheduler

## QCalendarResource

TBD...

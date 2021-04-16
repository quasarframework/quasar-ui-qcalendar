---
title: Migration Guide
desc: Migrate from v3 to v4
keys: Help
---

The information below can help you migrate from QCalendar v3.x to QCalendar v4.0.0 (beta).

> QCalendar 4.x+ only works with a Vue 3 instance. If you are still using Vue 2, use the [QCalendar v3 branch]() (TODO: not created yet).

> The information below is by no means an exhaustive list of changes and new functionality. If you see something that has been missed, please PR or let us know.
## QCalendar v4.0.0 Beta 1
Welcome to the QCalendar v4.0.0 Beta release.

With this update comes a lot of changes, with over 90% of QCalendar being rewritten. Please read below to understand these changes and how they will affect you for upgrading.

> Until the final stable version is released, some aspects of the calendar may change. We're not planning for additional breaking changes, but unforeseen reported issues may require us to do breaking changes (unlikely, but keep this in mind). So please make sure that you read each v4 beta version's release notes carefully before upgrading.

## QCalendar Rewritten to use Vue v3 Composition API
This means you get better in-editor auto-completion support amongst many other advantages.

## New Calendar
Just quickly, for information purposes, there is a new QCalendarTask component for writing timesheet and gantt-like calendars. This component is still actively being worked on (at the time this document was being written). So, just a heads up.

## Calendar Types
Previously, the actual QCalendar component was a wrapper around other calendar components. You could specify which component-type to use via the `view` property (ex: `month`, `week`, `agenda`, etc). There were a LOT of different views. These components have now been made available on an individual basis. This is better for tree-shaking.

However, there is still a QCalendar (wrapper) component and if you have an edge-case that needs the multi-component support the new property to use is `mode` because some calendar's still need the `view` property. The available values are: `day`, `month`, `agenda`, `resource`, `scheduler` and `task`.

If you want to take an advantage of a smaller foot-print then you have the option of importing each calendar type on an individual basis. For this, you will need to **NOT** be using the QCalendar app-extension, as this will import the QCalendar (wrapper). Instead, you will want to install the UI component directly into your package.json:

>  yarn add @quasar\quasar-ui-qcalendar

A caveat, QCalendar was made more modular. Even the SASS files were split up. These will need to be imported as well.

In a Vue (script section) or js file:

```js
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
```

In your app.sass:

```js
@import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
@import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
```

If you don't use the calendar transitions, it's likely you would NOT need to import that file.

Once the package is installed into your node_modules, you can import the calendar-type you want to deal with:

**QCalendarDay:**
```js
import { QCalendarDay } from '@quasar/quasar-ui-qcalendar/src/QCalendarDay.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarDay.sass'
```

**QCalendarMonth:**
```js
import { QCalendarMonth } from '@quasar/quasar-ui-qcalendar/src/QCalendarMonth.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarMonth.sass'
```

**QCalendarAgenda:**
```js
import { QCalendarAgenda } from '@quasar/quasar-ui-qcalendar/src/QCalendarAgenda.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarAgenda.sass'
```

**QCalendarScheduler:**
```js
import { QCalendarScheduler } from '@quasar/quasar-ui-qcalendar/src/QCalendarScheduler.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarScheduler.sass'
```

**QCalendarResource:**
```js
import { QCalendarResource } from '@quasar/quasar-ui-qcalendar/src/QCalendarResource.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarResource.sass'
```

**QCalendarTask:**
```js
import { QCalendarTask } from '@quasar/quasar-ui-qcalendar/src/QCalendarTask.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTask.sass'
```

If you want to use QCalendar (wrapper) then install the QCalendar app-extension via the Quasar CLI:

> quasar ext add @quasar/qcalendar

or

```js
import { QCalendar } from '@quasar/quasar-ui-qcalendar/src/QCalendar.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendar.sass'
```

### Boot file
If you want to create your own Quasar boot file and include a specific calendar that way, you can, but the import will be slightly different. We'll just use QCalendarDay as an example so you get the idea:

```js
import { boot } from 'quasar/wrappers'

import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarDay.sass'

// CalendarPlugin can be called anything...it's just a 'default' export
import CalendarPlugin from '@quasar/quasar-ui-qcalendar/src/QCalendarDay.js'

export default boot(({ app }) => {
  app.use(CalendarPlugin)
})
```

If you need multiple calendars, just do them in the same file.

## Common changes

### Properties

- the model property `value` has been renamed to `modelValue` (Vue 3 convention). The default has been changed to the current date. You no longer need to pass an empty string (`''`) for the current date, just pass `null` or `undefined` or set to `parseDate(new Date()).date` or `today()` (you can import `parseDate` and `today` from `@quasar/quasar-ui-qcalendar`.

- the property `resources` has been changed to `modelResources`. You can now add your resources as `v-model:model-resources="resources"`.

| Name | Previously | Calendar |
| -------  | -------------- | -----------  |
| model-value | value | All |
| no-header | hide-header | All |
| no-outside-days | hide-outside-days | Month |
| column-header-before | removed | Day, Scheduler |
| column-header-after | removed | Day, Scheduler |
| model-resources | resources | Scheduler, Resource |
### Slots

Below is a list of all existing slots. Some are new, some have changed and some remain unchanged, but their slot data may or may not have changed, but documenting here for convenience's sake.

| Name | Previously | Scope | Calendar |
| -------  | -------------- | --------  | -----------  |
| head-intervals | intervals-header | `{ scope: { days: [] } }` | QCalendarDay |
| head-day | | | QCalendarDay |
| head-date | **new** | | QCalendarDay |
| head-weekday-label | day-header-label | | QCalendarDay |
| head-day-label | day-label | | QCalendarDay |
| head-day-button | day-btn | | QCalendarDay |
| head-day-button-value |  | | QCalendarDay |
| column-header-before | | | QCalendarDay |
| column-header-after | | | QCalendarDay |
| day-container | | | QCalendarDay |
| day-body | | `{ scope: { timestamp: {…}, timeStartPos: ƒ, timeDurationHeight: ƒ } }` | QCalendarDay |
| day-interval | interval | `{ scope: {timestamp: {…}, timeStartPos: ƒ, timeDurationHeight: ƒ} }` | QCalendarDay |
| interval-label | **new** | `{ scope: { timestamp: {…}, label: String } }` | QCalendarDay |
| head-day-event | day-header | `{ scope: { timestamp: {...}, timeStartPos: ƒ, timeDurationHeight: ƒ } }` | QCalendarDay |
| head-days-events | **new** | `{ scope: { days: [], ref: ref() }}` | QCalendarDay |
| day-button | day-btn |  | QCalendarMonth |
| day-label |  |  | QCalendarMonth |
| day-of-year |  |  | QCalendarMonth |
| month-label |  |  | QCalendarMonth |
| head-row-events | **new** |  | QCalendarMonth |
| head-workweek | workweek-header |  | QCalendarMonth |
| head-day |  |  | QCalendarMonth |
| head-day-event | **new** |  | QCalendarMonth |
| week |  |  | QCalendarMonth |
| workweek |  |  | QCalendarMonth |
| day |  |  | QCalendarMonth |
| head-resources | scheduler-resources-header | `{ scope: { days: [], resources: [] } }` | QCalendarScheduler |


### Events

#### Mouse Events
- all mouse events with a `2` on the end can have the `2` removed
- all mouse events using `:` separator should be changed to `-` (vue3 best practices)
- examples: `@click-date="onClickDate"`, `@click-time="onClickTime"`, `@click-interval="onClickInterval"`, ...

### Drag and Drop
- All drag and drop function signatures have changed. `timestamp` has been removed, but `scope` has been added which contains `timestamp`. Now, the signature looks like this: `dragDropFunc(e, type, scope)`, where dragDropFunc is one of `drag-enter-func`, `drag-leave-func`, `drag-over-func` or `drop-func`. These are properties to the calendar which take a function. The function must return true if you want `droppable` attribute in the scoped data. You can then use the `droppable` attribute with `day-style`, `day-class`, `interval-style`, or `interval-class` to change the styling of the cell to indicate a drop zone. The second parameter `type`, will be one of `day`, `head-day`, `interval`, or `resource` so you know where the drag and drop is being handled. When using this technique, avoid changing borders, otherwise the UX will not look nice. Instead, use a `box-shadow` effect (ie: `box-shadow: inset 0 0 0 1px blue`).
- Also be aware, that for drag and drop to work correctly, both `drag-enter-func` and `drag-over-func` need to call `preventDefault` on the passed in event to prevent default handling by the browser.
- css classes ending in `--droppable` have been removed.

### Other
- For QCalendarMonth there is no longer a set minimum height of 5.0em. Use the new property `day-min-height` to control the minimum height of a day cell. And, also remember that if `day-height` is set to `"0"` then the height will automatically grow according to the content, otherwise if `day-height` is set to anything other than `"0"` the height of a day cell will be fixed.

## New Functionality

### Properties
- `interval-style`, `day-style` and `day-class` all receive a scope object
- new (QCalendarDay) `interval-class` that will be called when drawing each interval to add extra css classes in object form.
- new `min-weekday-length` (default: `1`). This property is used for fluid text length. The browser supports `long` and `short` formats. This is an **extra short** format taken from the beginning characters of the browser's `short` format. There are some languages that begin with the same character, so having this set to 1 (one) may not work. In that case, depending on your locale, set it to two or more.
- new `weekday-breakpoints` (default: `[75, 35]`). This is the cell width breakpoint for the fluid text length. At the first breakpoint, this is where the calendar will use the `short` format, unless `short-weekday-label` or `short-month-label` are already being used. The second breakpoint is for the **extra short** format will be used. To not use a breakpoint, set it to 0.
- new `day-min-height` property is to set the min-height of a calendar cell. Use this instead of static `day-height` when you want calendar rows to automatically grow in height depending on content.
- new `date-type` (default: `round`), values `['round', 'square']`
- new `weekday-align` (default: `center`), values `['left', 'center', 'right']`
- new `date-align` (default: `center`), values `['left', 'center', 'right']`
- new (QCalendarDay) `date-header` (default: `stacked`), values `['stacked', 'inline', 'inverted']`. This allows you to have the date-header area displayed inline. When the `inline` value is used, the placement is controlled by the `weekday-align` and `date-align` properties. Using the `inverted` value is the exact opposite of `inline` display for right/left placement.
This image will explain the QCalendarDay alignment:
![image](https://user-images.githubusercontent.com/10262924/103442538-3eb46a00-4c14-11eb-9278-43e3aacc0e76.png)
- new `use-navigation` property turns on keyboard focus navigation. This takes into account weekday skips (ie: weekends not being displayed). **TIP**: use with `no-active-date` for better visual UX and `focusable` for visual acuity.
  1. QCalendarMonth: `left` navigates to previous day, `right` navigates to next day, `up` takes you to previous week, `down` navigates to next week, `home` navigates to start of month, `end` navigates to end of month, `pgUp` navigates to previous month and `pgDown` navigates to next month.
  2. QCalendarDay is a bit more complicated. There is both weekday navigation and interval navigation [wip]. When focused on a weekday:
      - view="day": `left` navigates to previous day and `right` navigates to next day. `home`, `end`, `pgUp` and `pgDown` have no meaning.
      - view="week": `left` navigates to previous day, `right` navigates to next day, `home` navigates to the beginning of the week and `end` navigates to the end of the week.
      - view="month-interval": `left` navigates to previous day, `right` navigates to next day, `home` navigates to the beginning of the month and `end` navigates to the end of the month.
- All calendars have additional drag and drop functionality (as props). They are: `drag-enter-func`, `drag-over-func`, `drag-leave-func` and `drop-func`. The arguments are specific for the drag and drop operations, so look them up in the API docs. Each function should return a boolean (true/false) as to whether the item (day, interval, etc) should receive a `droppable` flag in the scoped object. This is handy when using one of the styling classes (ie: `dayClass`) to visually modify the calendar cell when an item can be dropped.
- `month-label-size` in QCalendarMonth has additional values added: `xxs` and `xxl`. The values now are as follows: `xxs`='.4em', `xs`='.6em', `sm`='.8em', `md`='1.0em', `lg`='1.2em', `xl`='1.4em' and `xxl`='1.6em'. As well, you can pass in your own value (ex: '0.75em', '11px', etc)
- `breakpoint` property values are as follows: `xs`='300', `sm`='350', `md`='400', `lg`='450' and `xl`='500'. As well, you can pass in your own value as long as it is a number which will be used as pixels.
- property `min-weeks` now works as expected. This is useful when rendering month calendars so they have a fixed height from month-to-month. Most common would be `:min-weeks="6"`. Some months may show 4, 5 or 6 weeks, depending on which weekday the start of the month falls. **Hint**: Use `:min-weeks="6"` in `mini-mode` when using multi-month selection strategies.
- new `hoverable` property (all calendars). Turns on mouse hover effect.
- new `focusable` property (all calendars). Use in conjunction with the `use-navigation` property for visual acuity.
- new property `min-day-height` (QCalendarMonth) sets a `min-height` on a date cell.
- new property `focus-type` (QCalendarMonth) specifies the item that gets focused when property `focusable` is true. Options are `day` and `date`, `weekday` and `resource` (Default: `date`).
- Calendars with hierarchical children (ie: scheduler and resource) now have better animation when expanding a row.

### Events
- QCalendarMonth new event `mini-mode` emits true/false whenever it changes.
- The `change` event now has an array of associated `days`
- QCalendarScheduler new event `resource-expanded` emits an object containing `expanded` (Boolean) and `scope` (resource, days, resourceIndex, indentLevel, label). This is emitted on hierarchical parents when the side chevron is clicked.


### Other
- There is a new look for calendars that have scrollbars (not Firefox, it will still have default scrollbars).
- The top-level calendar `div` now gets the [`lang` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang) based on the passed in `locale` property (default: `en-US`). This allows all descendants to word-break appropriately, by the browser, based on the language.
- Functionality has been added for tab (tabindex) support. Users can now use `Tab` and `Shift+Tab` to navigate the calendar. Add the new `focusable` property to have this functionality.
- Allow calendar date selection via keyboard (Enter or Space keys) when `focusable` property is set.
- When using `max-days` property (for contiguous days displayed) and clicking on a date, the calendar no longer navigates to the selected date, which previously became first date in the visible days. ie: the calendar is static until a new date that is not visible is selected programmatically, by v-model or prev/next/move methods are used (`max-days` does not apply to constrained `week` and `month` views).
- QCalendarDay now has a slot for head days (`head-days-events`) that is a contiguous row for all displayed days. This allows for all-day events that are more than one day to be a singular item. Be sure to create a wrapper div absolute positioning OR relative positioning and add empty events that are transparent to the user to push visible events to their proper positioning. Because absolute positioned div's are outside of the browser's normal flow, you need to set an explicit height on your first child and use the passed in **ref** from the slot data (`<template #head-days-events="{ scope: { days, ref } }">`) and place the ref (`:ref="ref"`) properly for this to work. Also, you probably should not use the `head-days-events` in conjunction with the `head-day-event` slot. The `head-day-event` slot is regulated to that day only and potential overlap may occur that would not be a good UX.
- All calendars will automatically auto-switch the weekday length based on the width of the calendar cell.
- For calendars that show the month on the first day of the month, the text will automatically switch the month length based on width of the calendar cell.



QCalendar
===

[![npm](https://img.shields.io/npm/v/@quasar/quasar-ui-qcalendar.svg?label=@quasar/quasar-ui-qcalendar)](https://www.npmjs.com/package/@quasar/quasar-ui-qcalendar)
[![npm](https://img.shields.io/npm/dt/@quasar/quasar-ui-qcalendar.svg)](https://www.npmjs.com/package/@quasar/quasar-ui-qcalendar)

## Everything you need for a complete Calendar solution.

QCalendar is a powerful calendar that allows for viewing of **day** (1-6 days), **week**, **monthly**, **scheduler**, **agenda** and **task** views. Painstaking care has been given to make almost every aspect of QCalendar configurable and/or modifiable in some way and control given to the developer.

---

## Important Release Notes

This will act as an aggregation of updates for v4 until it is released...

# QCalendar v4.0.0 Beta 1
Welcome to the QCalendar v4.0.0 Beta 1 release

### QCalendar is now converted to use Vue v3
With this update comes a lot of changes, with over 90% of QCalendar being rewritten. Please read below to understand these changes and how they will affect you for upgrading.

> Until the final stable version is released, some aspects of the calendar may change. We're not planning for additional changes, but unforeseen reported issues may require us to do breaking changes (unlikely, but keep this in mind). So please make sure that you read each v4 beta version's release notes carefully before upgrading.

# Breaking Changes

QCalendar now only works with a Vue 3 instance. If you are still using Vue 2, use the [QCalendar v3 branch]() (TODO: (Jeff) not created yet).

All the calendar instances can now be accessed individually. This is helpful for full tree-shaking capabilities. The different calendar types are:
- QCalendarDay (view="day | week | month | month-interval")
- QCalendarMonth
- QCalendarResource
- QCalendarAgenda
- QCalendarScheduler

However, there is still a QCalendar wrapper component (TODO: Jeff) if you still wish to go that route. The use-case is to easily switch between calendars. For instance, showing a month calendar and when user selects a date, transitioning to a day or week view. But, be aware, your browser in-memory payload will be bigger.

## Properties
- the model value `value` has been renamed to `modelValue` (Vue 3 convention). The default has been changed to the current date. You no longer need to pass an empty string (`''`) for the current date, just pass `null` or `undefined` or set to `parseDate(new Date()).date` or `today()` (you can import `parseDate` and `today` from `@quasar/quasar-ui-qcalendar`.
- the property `resources` has been changed to `modelResources`. You can now add your resources as `v-model:modelResources="resources"`.

| Name | Previously | Calendar |
| -------  | -------------- | -----------  |
| no-header | hide-header | All |
| no-outside-days | hide-outside-days | Month |
| column-header-before | removed | Day, Scheduler |
| column-header-after | removed | Day, Scheduler |
| model-resources | resources | Scheduler, Resource |

## Slots

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
| head-resources | scheduler-resources-header | { scope: { days: [], resources: [] } } | QCalendarScheduler |

## Mouse Events
- all mouse events with a `2` on the end can have the `2` removed
- all mouse events using `:` separator should be changed to `-` (vue3 best practices)
- examples: `@click-date="onClickDate"`, `@click-time="onClickTime"`, `@click-interval="onClickInterval"`, ...

## Drag and Drop
- All drag and drop function signatures have changed. `timestamp` has been removed, but `scope` has been added which contains `timestamp`. Now, the signature looks like this: `dragDropFunc(e, type, scope)`, where dragDropFunc is one of `drag-enter-func`, `drag-leave-func`, `drag-over-func` or `drop-func`. These are properties to the calendar which take a function. The function must return true if you want `droppable` attribute in the scoped data. You can then use the `droppable` attribute with `day-style`, `day-class`, `interval-style`, or `interval-class` to change the styling of the cell to indicate a drop zone. The second parameter `type`, will be one of `day`, `head-day`, `interval`, or `resource` so you know where the drag and drop is being handled.When using this technique, avoid changing borders, otherwise the UX will not look nice. Instead, use a `box-shadow` effect (ie: `box-shadow: inset 0 0 0 1px blue`).
- Also be aware, that for drag and drop to work correctly, both `drag-enter-func` and `drag-over-func` need to call `preventDefault` on the passed in event to prevent default handling by the browser.
- css classes ending in `--droppable` have been removed.

## Other
- For QCalendarMonth there is no longer a set minimum height of 5.0em. Use the new property `day-min-height` to control the minimum height of a day cell. And, also remember that if `day-height` is set to `"0"` then the height will automatically grow according to the content, otherwise if `day-height` is set to anything other than `"0"` the the height of a day cell will be fixed.

# New Functionality

## Properties
- `interval-style`, `day-style` and `day-class` all receive a scope object
- new (QCalendarDay) `interval-class` that will be called when drawing each interval to add extra css classes in object form.
- new `min-label-length` (default: `1`). This property is used for fluid text length. The browser supports `long` and `short` formats. This is an **extra short** format taken from the beginning characters of the browser's `short` format. There are some languages that begin with the same character, so having this set to 1 (one) may not work. In that case, depending on your locale, set it to two or more.
- new `label-breakpoints` (default: `[75, 35]`). This is the cell width breakpoint for the fluid text length. At the first breakpoint, this is where the calendar will use the `short` format, unless `short-weekday-label` or `short-month-label` are already being used. The second breakpoint is for the **extra short** format will be used. To not use a breakpoint, set it to 0.
- new `day-min-height` property is to set the min-height of a calendar cell. Use this instead of static `day-height` when you want calendar rows to automatically grow in height depending on content.
- new `date-type` (default: `round`), values `['round', 'square']`
- new `weekday-align` (default: `center`), values `['left', 'center', 'right']`
- new `date-align` (default: `center`), values `['left', 'center', 'right']`
- new (QCalendarDay) `date-header` (default: `stacked`), values `['stacked', 'inline', 'inverted']`. This allows you to have the date-header area displayed inline. When the `inline` value is used, the placement is controlled by the `weekday-align` and `date-align` properties. Using the `inverted` value is the exact opposite of `inline` display for right/left placement.
This image will explain the QCalendarDay alignment:
![image](https://user-images.githubusercontent.com/10262924/103442538-3eb46a00-4c14-11eb-9278-43e3aacc0e76.png)
- new `use-navigation` property turns on keyboard focus navigation. This takes into account weekday skips (ie: weekends not being displayed). **TIP**: use with `no-active-date` for better visual UX and `focusable` for visual acuity.
  - QCalendarMonth: `left` navigates to previous day, `right` navigates to next day, `up` takes you to previous week, `down` navigates to next week, `home` navigates to start of month, `end` navigates to end of month, `pgUp` navigates to previous month and `pgDown` navigates to next month.
  - QCalendarDay is a bit more complicated. There is both weekday navigation and interval navigation [wip]. When focused on a weekday:
    - view="day": `left` navigates to previous day and `right` navigates to next day. `home`, `end`, `pgUp` and `pgDown` have no meaning.
    - view="week": `left' navigates to previous day, `right` navigates to next day, `home` navigates to the beginning of the week and `end` navigates to the end of the week.
    - view="month-interval": `left' navigates to previous day, `right` navigates to next day, `home` navigates to the beginning of the month and `end` navigates to the end of the month.
- All calendars have additional drag and drop functionality (as props). They are: `drag-enter-func`, `drag-over-func`, `drag-leave-func` and `drop-func`. The arguments are specific for the drag and drop operations, so look them up in the API docs. Each function should return a boolean (true/false) as to whether the item (day, interval, etc) should receive a `droppable` flag in the scoped object. This is handy when using one of the styling classes (ie: `dayClass`) to visually modify the calendar cell when an item can be dropped.
- `month-label-size` in QCalendarMonth has additional values added: `xxs` and `xxl`. The values now are as follows: `xxs`='.4em', `xs`='.6em', `sm`='.8em', `md`='1.0em', `lg`='1.2em', `xl`='1.4em' and `xxl`='1.6em'. As well, you can pass in your own value (ex: '0.75em', '11px', etc)
- `breakpoint` property values are as follows: `xs`='300', `sm`='350', `md`='400', `lg`='450' and `xl`='500'. As well, you can pass in your own value as long as it is a number which will be used as pixels.
- property `min-weeks` now works as expected. This is useful when rendering month calendars so they have a fixed height from month-to-month. Most common would be `:min-weeks="6"`. Some months may show 4, 5 or 6 weeks, depending on which weekday the start of the month falls. **Hint**: Use `:min-weeks="6"` in `mini-mode` when using multi-month selection strategies.
- new `hoverable` property (all calendars). Turns on mouse hover effect.
- new `focusable` property (all calendars). Use in conjunction with the `use-navigation` property for visual acuity.
- new property `min-day-height` (QCalendarMonth) sets a `min-height` on a date cell.
- new property `focus-type` (QCalendarMonth) specifies the item that gets focused when property `focusable` is true. Options are `day` and `date`, `weekday` and `resource` (Default: `date`).
- Calendars with hierarchical children (ie: scheduler and resource) now have slight animation when expanding a row.

## Events
- QCalendarMonth new event `mini-mode` emits true/false whenever it changes.
- The `change` event now has an array of associated `days`
- QCalendarScheduler new event `resource-expanded` emits an object containing `expanded` (Boolean) and `scope` (resource, days, resourceIndex, indentLevel, label). This is emitted on hierarchical parents when the side chevron is clicked.


## Other
- There is a new look for calendars that have scrollbars (not Firefox, it will still have default scrollbars).
- The top-level calendar `div` now gets the [`lang` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang) based on the passed in `locale` property (default: `en-US`). This allows all descendants to word-break appropriately, by the browser, based on the language.
- Functionality has been added for tab (tabindex) support. Users can now use `Tab` and `Shift+Tab` to navigate the calendar. Add the new `focusable` property to have this functionality.
- Allow calendar date selection via keyboard (Enter or Space keys) when `focusable` property is set.
- When using `max-days` property (for contiguous days display) and clicking on a date, the calendar no longer navigates to the selected date, which previously became first date in the visible days. ie: the calendar is static until a new date that is not visible is selected programmatically, by v-model or prev/next/move methods are used (`max-days` does not apply to constrained `week` and `month` views).
- QCalendarDay now has a slot for head days (`head-days-events`) that is a contiguous row for all displayed days. This allows for all-day events that are more than one day to be a singular item. Be sure to create a wrapper div absolute positioning OR relative positioning and add empty events that are transparent to the user to push visible events to their proper positioning. Because absolute positioned div's are outside of the browser's normal flow, you need to set an explicit height on your first child and use the passed in **ref** from the slot data (`<template #head-days-events="{ scope: { days, ref } }">`) and place the ref (`:ref="ref"`) properly for this to work. Also, you probably should not use the `head-days-events` in conjunction with the `head-day-event` slot. The `head-day-event` slot is regulated to that day only and potential overlap may occur that would not be a good UX.
- All calendars will automatically auto-switch the weekday length based on the width of the calendar cell.
- For calendars that show the month on the first day of the month, the text will automatically switch the month length based on width of the calendar cell.


## Known Issues

TODO: Jeff

# Donations

QCalendar is an open source MIT project that has been made possible due to the **generous contributions** by [sponsors and backers](https://github.com/sponsors/hawkeye64). If you are interested in supporting this project, please consider:
- [Becoming a sponsor on Github](https://github.com/users/hawkeye64/sponsorship)
- [One-off donation via PayPal](https://paypal.me/hawkeye64)

---

**v3.2.0**: New property for interval-based calendars: `time-clicks-clamped`. What this does, is instead of returning a timestamp with the exact time of the click position, it returns the timestamp of the interval. If normally, your timestamp would have a time of **13:20**, this property makes it return **13:00**. This is also based on your settings of `interval-minutes`. If your `interval-minutes` is set to **15**, then the same click above would return a timestamp with time set to **13:15**.

**Day** and **Week** calendars now have the ability to toggle selected intervals or a range of selected intervals (even across multiple days) with properties `selected-dates` and `selected-start-end-dates`. These properties not only need the date (like the month view uses), but also the time (use the Timestamp exported method `getDateTime`). See the examples to learn how to do this.

**Timestamp** has a new exported method: `getDateTimeIdentifier` which is a convenience method that combines `getDayIdentifier` and `getTimeIdentifier`.

You can find out more information [here](https://github.com/quasarframework/quasar-ui-qcalendar/releases/tag/v3.2.0).

**v3.0.0**: As QCalendar strives to be the most exstensible calendar available, to be consistent with this ideology, we had to make a LOT of changes.

Among other updates, several things have become "native" for QCalendar:
1. The largest overhaul was introducing css vars to allow users the ability to customize QCalendar
2. QCalendar was compared to dozens of other calendars and the look was optimized to be more modern
3. The original theming has been removed. The css vars are 25% faster than the previous theming code
4. You no longer need to provide a `.q-active-date` class of your own. You can now change the active date colors via css vars
5. You no longer need to hook into the styles properties (ie: interval-style) to change the way disabled days look. You can now change the disable date colors via css vars
6. 'activeDate' is now included in a lot of the scoped slots and events
7. On interval-based calendars, when using the property "interval-minutes", those parts of the calendar are now called "interval sections" and can be changed via css vars. The default is to now have a "dashed" look, while at the main interval time, the lines are solid. Again, all changeable via css vars
8. You no longer have to provide `.q-range-first`, `.q-range-last` and `.q-range` classes via `day-class` property for range selection. It's all built-in now.
9. All deprecated slots and events were removed

Also, check out the new [Theme Builder](https://quasarframework.github.io/quasar-ui-qcalendar/theme-builder) in the docs.

You can find out more information [here](https://github.com/quasarframework/quasar-ui-qcalendar/releases/tag/v3.0.0).

**v2.4.0**: New slots and events added. Current event system is deprecated, but still available until the next major version is released. To see the deprecated events in the **QCalendar API** (at bottom of the page [here](https://quasarframework.github.io/quasar-ui-qcalendar/docs)), select the hamburger menu, then select **Show deprecated**. You can find out more information [here](https://github.com/quasarframework/quasar-ui-qcalendar/releases/tag/v2.4.0).

**v2.2.0**: Please be aware of breaking changes in events and scoped slotted data. You can find out more information [here](https://github.com/quasarframework/quasar-ui-qcalendar/releases/tag/v2.2.0).

---

[Live Demo](https://quasarframework.github.io/quasar-ui-qcalendar/docs) - **live docs, demo and examples**

---

**Month view with events**

![QCalendar example month view](https://raw.githubusercontent.com/quasarframework/quasar-ui-qcalendar/dev/demo/public/qcalendar-month-view.png)

**Planner example**

![QCalendar example agenda view - planner](https://raw.githubusercontent.com/quasarframework/quasar-ui-qcalendar/dev/demo/public/qcalendar-agenda-view--planner.png)

**Monthly Mini-mode**

![QCalendar example mini-mode selection](https://raw.githubusercontent.com/quasarframework/quasar-ui-qcalendar/dev/demo/public/q-calendar-month-view-mini-mode-with-selection.png)

**Multi-month selector (mini-mode)**

![QCalendar example multi-month selection](https://raw.githubusercontent.com/quasarframework/quasar-ui-qcalendar/dev/demo/public/qcalendar-month-view-mini-mode-multi-month-selection.png)

**Agenda view with custom content**

![QCalendar example agenda view](https://raw.githubusercontent.com/quasarframework/quasar-ui-qcalendar/dev/demo/public/qcalendar-agenda-view.png)

**Day view with events**

![QCalendar example day view - events](https://raw.githubusercontent.com/quasarframework/quasar-ui-qcalendar/dev/demo/public/qcalendar-day-view.png)

**Resource view with events**

![QCalendar example resource view - events](https://raw.githubusercontent.com/quasarframework/quasar-ui-qcalendar/dev/demo/public/qcalendar-resource-view.png)

**Scheduler view**

![QCalendar example scheduler view](https://raw.githubusercontent.com/quasarframework/quasar-ui-qcalendar/dev/demo/public/qcalendar-scheduler-view.png)

Including support for locales, optional theming, 1st day Monday, 5-day work weeks, work week numbers, selected days, disabled days, day of year...

...and many more!

# Examples and Documentation
Can be found [here](https://quasarframework.github.io/quasar-ui-qcalendar)

# Usage

## Quasar CLI project

Install the [App Extension](../app-extension).

**OR**:

Create and register a boot file:

```js
import Vue from 'vue'
import Plugin from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/dist/index.css'

Vue.use(Plugin)
```

**OR**:

```html
<style src="@quasar/quasar-ui-qcalendar/dist/index.css"></style>

<script>
import { QCalendar } from '@quasar/quasar-ui-qcalendar'

export default {
  components: {
    QCalendar
  }
}
</script>
```

## Vue CLI project

```js
import Vue from 'vue'
import Plugin from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/dist/index.css'

Vue.use(Plugin)
```

**OR**:

```html
<style src="@quasar/quasar-ui-qcalendar/dist/index.css"></style>

<script>
import { QCalendar } from '@quasar/quasar-ui-qcalendar'

export default {
  components: {
    QCalendar
  }
}
</script>
```

## UMD variant

Exports `window.QCalendar`.

Add the following tag(s) after the Quasar ones:

```html
<head>
  <!-- AFTER the Quasar stylesheet tags: -->
  <link href="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qcalendar/dist/index.min.css" rel="stylesheet" type="text/css">
</head>
<body>
  <!-- at end of body, AFTER Quasar script(s): -->
  <script src="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qcalendar/dist/index.umd.min.js"></script>
</body>
```
If you need the RTL variant of the CSS, then go for the following (instead of the above stylesheet link):
```html
<link href="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qcalendar/dist/index.rtl.min.css" rel="stylesheet" type="text/css">
```

### UMD Example
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="format-detection" content="telephone=no">
    <meta name="msapplication-tap-highlight" content="no">
    <meta name="viewport" content="user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1,width=device-width">

    <title>UMD test</title>
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons" rel="stylesheet" type="text/css">
    <link href="https://cdn.jsdelivr.net/npm/quasar@^1.0.0/dist/quasar.min.css" rel="stylesheet" type="text/css">
    <link href="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qcalendar@^2.0.0/dist/index.css" rel="stylesheet" type="text/css">
  </head>
  <body>
    <div id="q-app">
      <q-layout view="lHh Lpr fff">
        <q-header class="glossy bg-primary">
          <q-toolbar>
            <q-toolbar-title shrink>
              QCalendar <span class="text-subtitle2">v{{ version }}</span>
            </q-toolbar-title>

            <q-separator vertical></q-separator>
            <q-btn stretch flat label="Prev" @click="calendarPrev"></q-btn>
            <q-separator vertical></q-separator>
            <q-btn stretch flat label="Next" @click="calendarNext"></q-btn>
            <q-separator vertical></q-separator>
            <q-space></q-space>

            <div>Quasar v{{ $q.version }}</div>
          </q-toolbar>
        </q-header>

        <q-page-container>
          <q-page>
            <q-calendar ref="calendar" v-model="date"></q-calendar>
          </q-page>
        </q-page-container>
      </q-layout>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/quasar@^1.0.0/dist/quasar.ie.polyfills.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vue@^2.0.0/dist/vue.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/quasar@^1.0.0/dist/quasar.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qcalendar@^2.0.0/dist/index.umd.js"></script>

    <script>
      new Vue({
        el: '#q-app',

        data: function () {
          return {
            date: '',
            version: QCalendar.version
          }
        },

        beforeMount () {
          const now = new Date()
          // set initially to today's date (YYYY-MM-DD)
          this.date = now.getFullYear() + '-' + (this.padNumber(now.getMonth() + 1, 2)) + '-' + this.padNumber(now.getDay(), 2)
        },

        methods: {
          calendarNext () {
            this.$refs.calendar.next()
          },

          calendarPrev () {
            this.$refs.calendar.prev()
          },

          padNumber (num, length) {
            let padded = String(num)
            while (padded.length < length) {
              padded = '0' + padded
            }
            return padded
          }
        }
      })
    </script>
  </body>
</html>
```

# Codepen

[UMD example on Codepen](https://codepen.io/Hawkeye64/pen/RwwwKQL)

# Building the Projects

## Setup

In both the `ui` and `ui/dev` folders:

```bash
$ yarn
```

## Developing

In the `ui` folder

```bash
# start dev in SPA mode
$ yarn dev

# start dev in UMD mode
$ yarn dev:umd

# start dev in SSR mode
$ yarn dev:ssr

# start dev in Cordova iOS mode
$ yarn dev:ios

# start dev in Cordova Android mode
$ yarn dev:android

# start dev in Electron mode
$ yarn dev:electron
```

## Building package

```bash
$ yarn build
```

# build just the JSON API
```bash
$ yarn build:api
```

# Donate

If you appreciate the work that went into this, please consider donating to [Quasar](https://donate.quasar.dev) or [Jeff](https://github.com/sponsors/hawkeye64).

# License
MIT (c) Jeff Galbraith <jeff@quasar.dev>

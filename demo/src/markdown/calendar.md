QCalendar
===

**QCalendar** is a powerful calendar component that plugs right into your Quasar application. It allows for viewing of **day** (1-6 days), **week**, **monthly** (including **mini-mode**), **scheduler** and **agenda** views. Painstaking care has been given to make almost every aspect of QCalendar configurable and/or modifiable in some way and control given to the developer.

QCalendar is a less-opinionated calendar component, as it does not keep track of things like events and reminders. This is in the hands of the developer, but QCalendar makes it easy via accessible events, slots and methods (see examples how to accomplish these endeavors).

The guiding philosophy has been to empower the developer and allow them to do what needs to be done without being overly opinionated. In order to do this, the following items are followed:

1. Separation of concerns
2. Minimalization
3. Closed to change, but open for extension

This is the true power of QCalendar.

# Features
- Show month, week, work-week, day, contiguous days (ex: 3 days at a time)
- Resource scheduler
- Agenda views
- Month view mini-mode
- Month view multi-day selection (separate and contiguous)
- Month view multi-month/multi-day selection when combining two or more calendars
- Optional drag and drop support (including mobile)
- Automatic localization / internationalization
- Responsive flex grid layout
- No external dependencies (momentjs, jQuery, etc), other than Quasar
- User events support (date, day, interval, time, resource)
- Define any day as beginning of week
- Show only certain days of the week (good for work week days)
- Workweek number support
- Day-of-the-year support
- Easy to theme using CSS overrides or using JSON theme object (see Themes below)
- Easy to customize with Vue slots

## QCalendar is not...
- An event management system. However, QCalendar supports everything you need to create an event/reminder management system using slots (check out the interactive demo).
- An interactive navigation provider (next, previous, today). However, you can easily do this in devland with QCalendar's methods.
- Only the Gregorian calendar is supported.

# Installation Types

## Quasar CLI

**App Extension**

:::
#### Install

To add as an App Extension to your Quasar application, run the following (in your Quasar app folder):
```
quasar ext add @quasar/qcalendar
```

#### Uninstall

To remove as an App Extension from your Quasar application, run the following (in your Quasar app folder):
```
quasar ext remove @quasar/qcalendar
```

#### Describe
When installed as an App Extension, you can use `quasar describe QCalendar`
:::

**OR**:

:::
Create and register a boot file:

```js
import Vue from 'vue'
import Plugin from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/dist/index.css'

Vue.use(Plugin)
```
:::

**OR**:

:::
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
:::

## Vue CLI project

:::
```js
import Vue from 'vue'
import Plugin from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/dist/index.css'

Vue.use(Plugin)
```
:::

**OR**:

:::
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
:::

## UMD variant

Exports `window.QCalendar`.

Add the following tag(s) after the Quasar ones:

:::
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
:::

## Testing on Codepen
[UMD Example on Codepen](https://codepen.io/Hawkeye64/pen/RwwwKQL)

# Docs
Can be found [here](https://quasarframework.github.io/quasar-ui-qcalendar).

# Examples
Can be found [here](https://quasarframework.github.io/quasar-ui-qcalendar/examples).

# Interactive Demo
Can be found [here](https://quasarframework.github.io/quasar-ui-qcalendar/demo).

# Demo (source) Project
Can be found [here](https://github.com/quasarframework/quasar-ui-qcalendar/tree/master/demo).

---

# Working with QCalendar

In order to get the best potential from QCalendar it is important to understand all aspects which will be described below.

First and foremost, the native date format used internally, and with the v-model, is `YYYY-mm-dd`. This is to avoid confusion with positioning of the day and month in other date formats as well as date separator. All incoming and outgoing dates will use this format.

The default locale of QCalendar is **en-us**. This can easily be changed via the `locale` property. Any area of QCalendar that displays text and numbers is locale-aware via the browser's Internationalization (Intl) API.

You will see a number of images below which have the QCalendar component, but the navigation bar above all images is not part of QCalendar. Navigation is something a developer would provide in devland with QCalendar methods. This gives you total control over look-and-feel of your own navigation bar.

![WeekView](statics/qcalendar-toolbar.png "Week View" =800x800)

You would need to build out your own way of allowing the User to interact with QCalendar (if that is what you wish). Or, keep a fixed calendar.

# QCalendar views

QCalendar is made from four distict components: **day**, **month**, **scheduler** and **agenda** views. All other views derive from these four views. For instance, the **week** view is really a 7-**day** view with contraints.

Not only all these, but the **month** view has a **mini-mode** behavior.

## Day view

![DayView](statics/qcalendar-day-view.png "Day View" =800x800)

The `day` view is for displaying time intervals on the left side and 1 or more days in a contiguous fashion on the right side.

When more than one day is displayed:

![WeekView](statics/qcalendar-week-view.png "Week View" =800x800)

## Custom Interval view

The `custom-interval` view allows you to display as many days as specified by the property `max-days`. This can get a bit busy if a large number of days are displayed and is only recommended for wide screens. The image below has `max-days` set to 14.

![CustomInterval](statics/qcalendar-custom-interval-view.png "Custom Interval" =800x800)

## Month Interval view

The `month-interval` view allows you to display all days in a month while in the interval mode. This can get a bit busy and is only recommended for wide screens. The difference between the `month-interval` view and the `custom-interval` view is that the `month-interval` view has special handling for month length and will only go as many days as there are in the displayed month.

![MonthInterval](statics/qcalendar-month-interval-view.png "Month Interval" =800x800)

## Month view

![MonthView](statics/qcalendar-month-view.png "Month View" =800x800)

The `month` view is for displaying a finite number of weeks according to the calendar time which is the currently displayed month.

> For time periods which fall outside of the current month, yet are still displayed (beginning and ending days of the month view), these are known as the `outside` days. The current date is known as the `current` day (obviously). Days leading up to the current date are known as `past` days and days that come after the current date are known as `future` days.

### Mini-Mode

![MonthViewMiniModeSelection](statics/q-calendar-month-view-mini-mode-with-selection.png "Month View Mini-Mode with Multi-Day Selection" =400x400)

The `month` view also has a `mini-mode` property with additional (if needed) `breakpoint` behavior.

And, the multi-day selection, when combined with two or mode calendars allows you to have multi-month range selection.

![MonthViewMiniModeMultiMonthSelection](statics/qcalendar-month-view-mini-mode-multi-month-selection.png "Month View Mini-Mode with Multi-Month Selection" =800x800)

## Scheduler view

![SchedulerView](statics/qcalendar-scheduler-view.png "Scheduler View" =800x800)

The `scheduler` view is for displaying days with resources on the left side. This allows you to present data for each resource. Where a resource could be a person, room, etc.

To use the scheduler, you need to use the `resources` property, which is an array of objects, containing a mandatory key `label`. To change the number of days displayed, use the `max-days` property. To change the distance between each resource, use the `resource-height` property.

## Agenda view

::: info
In **Agenda** view mode, the developer is free to add whatever content they want. The example below just shows one of many ways it could be done.
:::

![AgendaView](statics/qcalendar-agenda-view.png "Agenda View" =800x800)

The `agenda` view is basically a `day` view without the intervals. It is up to the developer to provide the content via the `day-body` slot.

While in **Agenda** view, you can define extra columns on the left-side or right-side of the calendar. This is perfect for creating Planners.

![PlannerExample](statics/qcalendar-agenda-view--planner.png "Planner Example" =800x800)

If this interests you, check out the [Planner Example](/demos/planner).

## View types

QCalendar has many `view` types available. They are:
1. `month`
2. `week`
3. `day`
4. `2day`
5. `3day`
6. `4day`
7. `5day`
8. `6day`
9. `month-scheduler`
10. `week-scheduler`
11. `custom-scheduler`
12. `scheduler`
13. `day-scheduler`
14. `2day-scheduler`
15. `3day-scheduler`
16. `4day-scheduler`
17. `5day-scheduler`
18. `6day-scheduler`
19. `month-agenda`
20. `week-agenda`
21. `custom-agenda`
22. `day-agenda`
23. `2day-agenda`
24. `3day-agenda`
25. `4day-agenda`
26. `5day-agenda`
27. `6day-agenda`
28. `month-interval`
29. `custom-interval`

It's important to know that all `view` types are linear in nature. For instance, `3day` will show three days and `next()` will show the next 3 days. A good idea could be to switch to a `view` type on a mobile based on the current width of the screen. For portrait mode, you could change the `view` type to `2day` and for landscape mode `4day`. When `next()` or `prev()` are called the next (or previous) 2 days (for protrait) or 4 days (for landscape) would be displayed. Also, it is important to understand, if using a 5-day work week, then use the `week` view for a nice consistent linear calendar. If you use a `5day` view with a 5-day workweek (`[1,2,3,4,5]`), then you can't expect the monday to be on the first day of the week.

Monthly views are also linear, but respect the number of days within the month that is to be displayed.

All views respect the number of days to be displayed as per the `weekdays` filter property.

## Weekday filtering

QCalendar supports weekday filtering using the `weekdays` property. This is an array of numbers representing the days of the week, where `0` is Sunday and `6` is Saturday. The default looks like this: `[0, 1, 2, 3, 4, 5, 6]`.

If the desire was to display only the work week (meaning Monday to Friday), the `weekdays` property would be set like this: `[1, 2, 3, 4, 5]`.

![Week5day](statics/qcalendar-week-view-5day.png "Week 5 day" =800x800)

![Month5day](statics/qcalendar-month-view-5day.png "Month 5 day" =800x800)

As well, if the goal was to display Monday as the first day of the week (as does the German, and other, calendars), the `weekdays` property would be set like this: `[1, 2, 3, 4, 5, 6, 0]`.

![WeekMondayFirstDay](statics/qcalendar-week-view-monday-first-day.png "Week - Monday First Day" =800x800)

![MonthMondayFirstDay](statics/qcalendar-month-view-monday-first-day.png "Month - Monday First Day" =800x800)

**Expected Results**
If you are trying to do a 5-day week always use the `week`, `month`, `month-interval`, `week-scheduler`, `month-scheduler` or `week-agenda` views to do the filtering (basically views that respect the length of a week or month). The `2day` to `6day` views as well as `custom-interval` and `scheduler` views are linear and won't give you the expected results.

This image has set up a 5-day work week (`[1, 2, 3, 4, 5]`) incorrectly using a `5day` filter.

![Incorrect5Day](statics/qcalendar-5day-done-incorrectly.png "5 Day - Set up incorrectly" =800x800)

## Workweek numbers
QCalendar supports workweek numbers (also known as [ISO week date](https://en.wikipedia.org/wiki/ISO_week_date)). That is, the numbered week from the start of the year. This is only available in `month` view by setting the `workweek` property to true.

![WorkWeek](statics/qcalendar-workweeks.png "Workweek or ISO Week Date" =800x800)

# Styling Active Date

QCalendar does not provide styling for the active date (v-model). This is in dev-land, but quite easy to do via css. You can add something similar to your sass file:

```css
.q-active-date
  color: blue
  background: #CCCCFF !important
```

Of course, change the color to anything you want. Alternatively, provide a bordered outline as well. The choice is yours.

::: info
Note that for the User selected date, we use the css class `.q-active-date` to avoid conflict with `.q-selected-date` which is used for multi-selected dates.
:::

# Navigation

Navigating QCalendar can be done in several ways:

1. Setting the `value` (v-model) property
2. Setting the `now` property
3. Calling `next()` and `prev()` functions
4. Calling the `move()` function
5. Calling the `updateCurrent()` function

Out of this, the most common would be to use the `value` (v-model) property and the `prev()` and `next()` functions.

```html
<q-calendar ref="calendar" ...
```

and then in JavaScript:

```js
  methods: {
    calendarNext () {
      this.$refs.calendar.next()
    },
    calendarPrev () {
      this.$refs.calendar.prev()
    },
```

## Swipe navigation

QCalendar does not provide swipe navigation out-of-the-box. The philosophy is to allow the developer to make navigation choices and availability. However, with **Quasar** it is quite easy to add swipe navigation to your calendar.

First, in your `quasar.conf.js` make sure to add `TouchSwipe` to your directives.

```js
directives: [
  'Ripple',
  'ClosePopup',
  'TouchSwipe'
],
```

Then on your `q-calendar` tag, add the following:

```html
<q-calendar
  ref="calendar"
  v-touch-swipe.mouse.left.right="handleSwipe"
  ...
```

And, finally, in your JavaScript, handle the `handleSwipe` function:

```js
handleSwipe ({ evt, ...info }) {
  if (this.dragging === false) {
    if (info.duration >= 30) {
      if (info.direction === 'right') {
        this.calendarPrev()
      } else if (info.direction === 'left') {
        this.calendarNext()
      }
    }
  }
  stopAndPrevent(evt)
}
```
See the Demo code for more information (link at top of page).

# Locale

QCalendar supports locales as defined within the browser and can be changed by setting the `locale` property. If an invalid locale is used, the fallback locale of **en-us** will be used.

If you are handling a toolbar with previous, next, today options and would also like to format the current month, you can do something like this to get the browser to do the translation for you.

```js
  beforeMount () {
    this.locale = this.$q.lang.getLocale() || 'en-us'
    this.updateFormatter()
  },
```
```js
  watch: {
    locale () {
      if (this.locale.length > 2) {
        this.updateFormatter()
      }
    },
    shortMonthLabel () {
      this.updateFormatter()
    }
  },
```
Then in `methods`:
```js
    updateFormatter () {
      try {
        this.titleFormatter = new Intl.DateTimeFormat(this.locale || void 0, {
          month: this.shortMonthLabel ? 'short' : 'long',
          year: 'numeric',
          timeZone: 'UTC'
        })
      } catch (e) {
        // console.error('Intl.DateTimeFormat not supported')
        this.titleFormatter = void 0
      }
    },
```
and then in `computed`:
```js
    title () {
      if (this.titleFormatter && this.locale && this.selectedDate) {
        const date = new Date(this.selectedDate)
        return this.titleFormatter.format(date)
      }
      return ''
    },
```
Now, you can use the computed variable `this.title`.

![Arabic](statics/qcalendar-locale-arabic.png "Locale - Arabic" =800x800)
![Chinese](statics/qcalendar-locale-chinese.png "Locale - Chinese" =800x800)
![French](statics/qcalendar-locale-french.png "Locale - French" =800x800)
![German](statics/qcalendar-locale-german.png "Locale - German" =800x800)
![Romanian](statics/qcalendar-locale-romanian.png "Locale - Romanian" =800x800)

# Themes

QCalendar has the ability to work with themes. It does not come with any itself, but you can download the ones that are used in the demo [here](statics/themes.js).

All colors in themes can be from the [Quasar Color Palette](https://quasar.dev/style/color-palette), CSS named color or a CSS color (#, rgb, rgba, hls, etc).

Download and look at the themes to see what is needed. If a property is missing from a theme, then the fallback of the default CSS will be used.

![ThemeDark](statics/qcalendar-theme-dark.png "Theme - Dark" =800x800)
![ThemeTeal](statics/qcalendar-theme-teal.png "Theme - Teal" =800x800)
![ThemeBrown](statics/qcalendar-theme-brown.png "Theme - Brown" =800x800)
![ThemeDeepPurple](statics/qcalendar-theme-deep-purple.png "Theme - Deep Purple" =800x800)
![ThemeIndigo](statics/qcalendar-theme-indigo.png "Theme - Indigo" =800x800)
![ThemeBlue](statics/qcalendar-theme-blue.png "Theme - Blue" =800x800)


# Animating

Animation is when QCalendar does a `prev` or `next` action. Setting the property `:animated="true"` turns on the animation. Two other properties, `transition-prev` and `transition-next` allows you to set the type of transition to use. The default is to use `transition-prev="slide-right"` and `transition-next="slide-left"`, but you can use any of the [Quasar transitions](https://quasar.dev/options/transitions), or build your own (see [Vue transitions](https://vuejs.org/v2/guide/transitions.html) for detailed information).

One important aspect of transitions is to avoid overflow. You can prevent this from happening by wrapping your QCalendar component with a `div` and then set `style="overflow: hidden;"`.

# Drag and Drop support
QCalendar supports HTML5 **drag and drop**. If you have components that need drag and drop support you can add the following (this example is using QBadge):

```html
<template #day="{ date }">
  <template v-for="(event, index) in getEvents(date)">
    <q-badge
      :key="index"
      style="width: 100%; cursor: pointer;"
      :class="badgeClasses(event, 'day')"
      :style="badgeStyles(event, 'day')"
      @click.stop.prevent="showEvent(event)"
      :draggable="true"
      @dragstart.native="(e) => onDragStart(e, event)"
      @dragend.native="(e) => onDragEnd(e, event)"
      @dragenter.native="(e) => onDragEnter(e, event)"
      @touchmove.native="(e) => {}"
    >
      <q-icon v-if="event.icon" :name="event.icon" class="q-mr-xs" /><span class="ellipsis">{{ event.title }}</span>
    </q-badge>
  </template>
</template>
```
Remember, to kick off a drag and drop, you must `preventDefault` during the `dragenter` event:

```js
onDragEnter (ev, event) {
  prevent(ev)
},
onDragStart (ev, event) {
  this.dragging = true
  this.draggedEvent = event
  stop(ev)
},
onDragEnd (ev, event) {
  stopAndPrevent(ev)
  this.resetDrag()
},
onDragOver (ev, day, type) {
  if (type === 'day') {
    stopAndPrevent(ev)
    return this.draggedEvent.date !== day.date
  } else if (type === 'interval') {
    stopAndPrevent(ev)
    return this.draggedEvent.date !== day.date && this.draggedEvent.time !== day.time
  }
},
onDrop (ev, day, type) {
  ev.preventDefault()
  ev.stopPropagation()
  if (type === 'day') {
    this.draggedEvent.date = day.date
    this.draggedEvent.side = void 0
  } else if (type === 'interval') {
    this.draggedEvent.date = day.date
    this.draggedEvent.time = day.time
    this.draggedEvent.side = void 0
  }
},
resetDrag () {
  this.draggedEvent = void 0
  this.dragging = false
  if (Platform.is.desktop) {
    this.ignoreNextSwipe = true
  }
}
```

## Mobile support
Drag and drop is typically not directly supported on mobile browsers. If you want support, add the package `drag-drop-touch` to your `package.json`. And then, just `import 'drag-drop-touch'` to get it to shim into your code. When using this shim, you need the `@touchmove.native="(e) => {}"` as noted above to prevent issues with iOS.

# Working with Slots
There is a lot of Scoped Slots support in QCalendar. Scoped Slots allows you to change the look of your calendar to suit your requirements. Almost all of the scoped slots work with the QCalendar `timestamp` (also known as `day`) object.

The `timestamp` object looks like this:
```js
{
  date: '',       // YYYY-mm-dd
  time: '',       // 00:00:00 (optional)
  year: 0,        // YYYY
  month: 0,       // mm (Jan = 1, etc)
  day: 0,         // day of the month
  weekday: 0,     // week day
  hour: 0,        // 24-hr
  minute: 0,      // mm
  doy: 0,         // day of year
  workweek: 0,    // workweek number
  hasDay: false,  // if this timestamp is supposed to have a date
  hasTime: false, // if this timestamp is supposed to have a time
  past: false,    // if timestamp is in the past (based on `now` property)
  current: false, // if timestamp is current date (based on `now` property)
  future: false,  // if timestamp is in the future (based on `now` property)
  disabled: false // if timestamp is disabled
}
```

# Working with Events

QCalendar has a lot of events. The normal events are:

`@input => function(value)`: This is the value used by `v-model` and in the form `YYYY-mm-dd`

`@change => function(start, end)`: Emitted when the calendar dates change. For instance, if in month view, the `start` contains the timestamp object for the 1st of the month, and `end` contains the timestamp object for the last day of the month. For `week` view it’s the first day of the displayed week and last day of the displayed week

`@moved => function (timestamp)`: The same as `input` above, except the passed argument is a `timestamp` object.

All other events are mouse/touch based. The base events are:
1. `click`
2. `contextmenu`
3. `mousedown`
4. `mousemove`
5. `mouseup`
6. `mouseenter`
7. `mouseleave`
8. `touchstart`
9. `touchmove`
10. `touchend`

These are appended with the type of event:
1. `:time`
2. `:day`
3. `:interval`
4. `resource`
5. `resource:day`
6. `column`

All mouse/touch events support the Vue [Event & Key Modifiers](https://vuejs.org/v2/guide/render-function.html#Event-amp-Key-Modifiers).

~~~

QCalendar
===

QCalendar is a [Quasar App Extension](https://quasar.dev/app-extensions/introduction). It is a powerful calendar component that plugs right into your Quasar application and allows for both day (1-7 days for a week), monthly and scheduler views. Painstaking care has been given to make almost every aspect of QCalendar configurable and/or modifiable in some way and control given to the developer.

QCalendar is a less-opinionated calendar component, as it does not keep track of things like events, reminders or even disabled days (if that's what you want). This is in the hands of the developer, but QCalendar makes it easy via accessible events, slots and methods.

The guiding philosophy has been to empower the developer and allow them to do what needs to be done without being overly opinionated. In order to do this, the following items are followed:

1. Separation of concerns
2. Minimalization
3. Closed to change, but open for extension

This is the true power of QCalendar.

# Features
- Show month, week, day, contiguous days (ex: 3 days at a time)
- Resource scheduler
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
- Currently there is no Agenda view, although it is up for consideration.
- Only the Gregorian calendar is supported.

This work is currently in `beta` and there are expected changes while things get worked out. Your help with testing is greatly appreciated.

# Install
To add this App Extension to your Quasar application, run the following (in your Quasar app folder):
```
quasar ext add @quasar/qcalendar
```

QCalendar has a dependency on the `@quasar/colorize` app extension and this will also need to be installed.
```
quasar ext add @quasar/colorize
```

::: tip
QCalendar will try to take up all available space that it is in. The parent should have a fixed height and have a css `position: relative`.
:::

# Uninstall
To remove this App Extension from your Quasar application, run the following (in your Quasar app folder):
```
quasar ext remove @quasar/qcalendar
```

# Describe
You can use `quasar describe QCalendar`

# Docs
Can be found [here](https://quasarframework.github.io/app-extension-qcalendar).

# Examples
Can be found [here](https://quasarframework.github.io/app-extension-qcalendar/examples).

# Interactive Demo
Can be found [here](https://quasarframework.github.io/app-extension-qcalendar/demo).

# Demo (source) Project
Can be found [here](https://github.com/quasarframework/app-extension-qcalendar/tree/master/demo).

# Working with QCalendar

In order to get the best potential from QCalendar it is important to understand all aspects which will be described below.

First and foremost, the native date format used internally, and with the v-model, is `YYYY-mm-dd`. This is to avoid confusion with positioning of the day and month in other date formats as well as date separator. All incoming and outgoing dates will use this format.

The default locale of QCalendar is **en-us**. This can easily be changed via the `locale` property. Any area of QCalendar that displays text and numbers is locale-aware.

You will see a number of images below which have the QCalendar component, but the navigation bar above all images is not part of QCalendar. Navigation is something a developer would provide in devland with QCalendar methods. This gives you total control over look-and-feel of your own navigation bar.

![WeekView](statics/qcalendar-toolbar.png "Week View" =800x800)

You would need to build out your own way of allowing the User to interact with QCalendar (if that is what you wish). Or, keep a fixed calendar.

# QCalendar views

QCalendar is made from three distict components: day, month and scheduler views. All other views derive from these three views.

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

## Scheduler view

![SchedulerView](statics/qcalendar-scheduler-view.png "Scheduler View" =800x800)

The `scheduler` view is for displaying days with resources on the left side. This allows you to present data for each resource. Where a resource could be a person, room, etc.

To use the scheduler, you need to use the `resources` property, which currently is an array of objects, containing a single key `label`. To change the number of days displayed, use the `max-days` property. To change the distance between each resource, use the `resource-height` property.


## View types

QCalendar has several `view` types available. They are:
1. `month`
2. `week`
3. `day`
4. `2day`
5. `3day`
6. `4day`
7. `5day`
8. `6day`
9. `custom-interval`
10. `month-interval`
11. `scheduler`
12. `week-scheduler`
13. `month-scheduler`

It's important to know that all `view` types are linear in nature. For instance, `3day` will show three days and `next()` will show the next 3 days. A good idea could be to switch to a `view` type on a mobile based on the current width of the screen. For portrait mode, you could change the `view` type to `2day` and for landscape mode `4day`. When `next()` or `prev()` are called the next (or previous) 2 days (for protrait) or 4 days (for landscape) would be displayed.

Monthly views are also linear, but respect the number of days within the month that is to be displayed.

## Weekday filtering

QCalendar supports weekday filtering using the `weekdays` property. This is an array of numbers representing the days of the week, where `0` is Sunday and `6` is Saturday. The default looks like this: `[0, 1, 2, 3, 4, 5, 6]`.

If the desire was to display only the work week (meaning Monday to Friday), the `weekdays` property would be set like this: `[1, 2, 3, 4, 5]`.

![Week5day](statics/qcalendar-week-view-5day.png "Week 5 day" =800x800)

![Month5day](statics/qcalendar-month-view-5day.png "Month 5 day" =800x800)

As well, if the goal was to display Monday as the first day of the week (as does the German, and other, calendars), the `weekdays` property would be set like this: `[1, 2, 3, 4, 5, 6, 0]`.

![WeekMondayFirstDay](statics/qcalendar-week-view-monday-first-day.png "Week - Monday First Day" =800x800)

![MonthMondayFirstDay](statics/qcalendar-month-view-monday-first-day.png "Month - Monday First Day" =800x800)

**Expected Results**
If you are trying to do a 5-day week always use the `week`, `month`, `month-interval`, `week-scheduler` or `month-scheduler` views to do the filtering (basically views that respect the length of a week or month). The `2day` to `5day` as well as `custom-interval` and `scheduler` views are linear and won't give you the expected results.

This image has set up a 5-day work week (`[1, 2, 3, 4, 5]`) incorrectly using a `5day` filter.

![Incorrect5Day](statics/qcalendar-5day-done-incorrectly.png "5 Day - Set up incorrectly" =800x800)

## Workweek numbers
QCalendar supports workweek numbers (also known as [ISO week date](https://en.wikipedia.org/wiki/ISO_week_date)). That is, the numbered week from the start of the year. This is only available in `month` view by setting the `workweek` property to true.

![WorkWeek](statics/qcalendar-workweeks.png "Workweek or ISO Week Date" =800x800)

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

Then on your `q-calendar` component, add the following:

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

![Arabic](statics/qcalendar-locale-arabic.png "Locale - Arabic" =800x800)
![Chinese](statics/qcalendar-locale-chinese.png "Locale - Chinese" =800x800)
![French](statics/qcalendar-locale-french.png "Locale - French" =800x800)
![German](statics/qcalendar-locale-german.png "Locale - German" =800x800)
![Romanian](statics/qcalendar-locale-romanian.png "Locale - Romanian" =800x800)

# Themes

QCalendar has the ability to work with themes. It does not come with any itself, but you can download the ones that are used in the demo [here](statics/themes.js).

All colors in themes can be from the [Quasar Color Pallete](https://quasar.dev/style/color-palette) or a CSS color (#, rgb, rgba, hls, etc).

Download and look at the themes to see what is needed. If a property is missing from a theme, then the fallback of the default CSS will be used.

![ThemeDark](statics/qcalendar-theme-dark.png "Theme - Dark" =800x800)
![ThemeTeal](statics/qcalendar-theme-teal.png "Theme - Teal" =800x800)
![ThemeBrown](statics/qcalendar-theme-brown.png "Theme - Brown" =800x800)
![ThemeDeepPurple](statics/qcalendar-theme-deep-purple.png "Theme - Deep Purple" =800x800)
![ThemeIndigo](statics/qcalendar-theme-indigo.png "Theme - Indigo" =800x800)
![ThemeBlue](statics/qcalendar-theme-blue.png "Theme - Blue" =800x800)


# Animating

Animation is when QCalendar does a `prev` or `next` action. Setting the property `:animated="true"` turns on the animation. Two other properties, `transition-prev` and `transition-next` allows you to set the type of transition to use. The default is to use `transition-prev="slide-right"` and `transition-next="slide-left"`, but you can use any of the [Quasar transitions](https://quasar.dev/options/transitions), or build your own (see [Vue transitions](https://vuejs.org/v2/guide/transitions.html) for detailed information).

# Drag and Drop support
QCalendar supports HTML5 **drag and drop**. If you have components that need drag and drop support you can add the following (this example is using QBadge):

```html
<template #day="{ date }">
  <template v-for="(event, index) in getEvents(date)">
    <q-badge
      :key="index"
      style="width: 100%; cursor: pointer;"
      class="ellipsis"
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
TODO

<template>
  <div>
    <q-markdown>
::: warning
Codepen uses the UMD version of QCalendar. As such, the examples below must be written in such a way that they also work on that platform. If you see code like `QCalendar.addToDate`, you can instead use `import { addToDate } from '@quasar/quasar-ui-qcalendar'` in your own non-UMD code to get the best tree-shaking effects.
:::
    </q-markdown>
    <example-title title="Mini-Mode" />
    <q-markdown>
Mini-Mode is a special behavior for QCalendar **month** view. The property is `mini-mode` and can be set to `true`, `false` (default) or `auto`. When set to `true` mini-mode is always on. When set to `auto`, mini-mode will use the `breakpoint` property to determine when to automatically go into mini-mode.

When `mini-mode="auto"`, this works for the width of the screen, not the width of QCalendar. If you need to control mini-mode dynamically, then you need to set `true` or `false` based on your own calculations, most likely using [QResizeObserver](https://quasar.dev/vue-components/resize-observer).

Not all Monthly view examples have been copied over to `mini-mode` examples. They still work, like **Prev/Next** and **Swipe**.

Also, when in `mini-mode` there are some things to be aware of:

1. The property `month-label-size` defaults to `sm`
2. The property `short-weekday-label` is always true
3. The property `show-day-of-year-label` has no effect
4. The month label on first available day of the month is not displayed

Also, regardless of `mini-mode` all slots associated with month view now have additional slotted data: `miniMode`, which is either set to `true` or `false`.
    </q-markdown>

    <example-viewer title="Basic" file="MiniModeBasic" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Bordered" file="MiniModeBordered" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Dark" file="MiniModeDark" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Short Weekday Label" file="MiniModeShortWeekdayLabel" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="5 Day Work Week" file="MiniModeFiveDayWorkWeek" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Work Week Numbers" file="MiniModeWorkWeekNumbers" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="First Day Monday" file="MiniModeFirstDayMonday" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Hide Header" file="MiniModeHideHeader" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-title title="Outside Days" />
    <q-markdown>
Outside days, in month view, are those days before and after the currently displayed month. By default, these days are disabled to avoid navigation issues when getting selected days from the User. Using the `enable-outside-days` property enables these days.
    </q-markdown>
    <example-viewer title="Enable Outside Days" file="MiniModeEnableOutsideDays" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Hide Outside Days" file="MiniModeHideOutsideDays" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-title title="Breakpoints" />
    <q-markdown>
The example below uses the `breakpoint` and `mini-mode="auto"` properties to automatically go into mini-mode. It uses the `breakpoint` value `sm` (599px) for the breakpoint.

Likely you will have to adjust your browser width to see this example work. For mobile, you might see this example only in mini-mode.
    </q-markdown>
    <example-viewer title="Breakpoint" file="MiniModeBreakpoint" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <q-markdown>
The example below uses QSplitter to adjust the width of the QCalendar and to **dynamically** switch to/from `mini-mode`. The breakpoint in this example is **less than 500px**.
    </q-markdown>
    <example-viewer title="Dynamic Breakpoint" file="MiniModeDynamicBreakpoint" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-title title="Disabled" />
    <q-markdown>
In the first calendar, all disabled days are set explicitly. In the second example, it shows how you can set a range to do the same thing.
    </q-markdown>
    <example-viewer title="Disabled Days" file="MiniModeDisabledDays" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <q-markdown>
In the this example the disabled days and a range of disabled days are combined. Ranges must be an array of dates within the main array. They contain a start and and end date.
    </q-markdown>
    <example-viewer title="Disabled Days (combined)" file="MiniModeDisabledDaysCombined" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <q-markdown>
In this next example, the `disabled-before` is set to the last day of the previous month and the `disabled-after` is set to the first day of the next month. Essentially, this disables all dates but the current month.
    </q-markdown>
    <example-viewer title="Disabled Before/After" file="MiniModeDisabledBeforeAfter" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Disabled Weekdays" file="MiniModeDisabledWeekdays" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-title title="Navigation" />
    <example-viewer title="Prev/Next" file="MiniModePrevNext" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-title title="Selection" />
    <q-markdown>
Click on dates to toggled selected on/off.
    </q-markdown>
    <example-viewer title="Selected Dates" file="MiniModeSelectedDates" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <q-markdown>
There are some considerations when using mini-mode selections. There are 3 special classes: `.q-range-first`, `.q-range` and `.q-range-last` in conjunction with the `day-class` property. These will help you create a selector compliant with [Material Design](https://material.io/components/pickers/#anatomy). See examples below for usage.

The examples below has a `touch` boolean. This does not change anything with QCalendar. What it does is change the devland logic. When **not** set, the mouse down, mouse move and mouse up control the selection. When set (checked), the first click sets the anchor point and the second click sets the second anchor point.
    </q-markdown>
    <example-viewer title="Selection" file="MiniModeSelection" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Selection Click" file="MiniModeSelectionClick" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <q-markdown>
::: tip
Using the property `short-weekday-label` while in `mini-mode` gives an even shorter weekday label than normal.
:::
    </q-markdown>
    <example-viewer title="Multi-Month Selection" file="MiniModeMultiMonthSelection" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <q-markdown>
Using the property `hover` with `selected-start-end-dates` while in `mini-mode` gives you a better interactive and visually appealing selection.
    </q-markdown>
    <example-viewer title="Multi-Month Selection with Hover Prop" file="MiniModeMultiMonthSelectionHover" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-viewer title="Selection (QInput)" file="MiniModeSelectionQInput" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Advanced Popup" file="MiniModePopup" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-title title="Events" />
    <q-markdown>
::: tip
The events below won't show up unless there is a listener for it. Therefore, if using `Vue Devtools`, you won't see it unless you add it.
:::

You can add a listener for the following events. An event is comprised of an `event + suffix`. By adding the event with the suffix, you get the completed listener name.

| Event       | `:day2`            | `:workweek2`        | `:workweek:header2` | `:day:header2`     | `:date2`           |
| ----------- | :----------------: | :----------------: | :-----------------: | :----------------: | :----------------: |
| click       | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:  | :heavy_check_mark: | :heavy_check_mark: |
| contextmenu | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:  | :heavy_check_mark: | :heavy_check_mark: |
| mousedown   | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:  | :heavy_check_mark: | :x:                |
| mousemove   | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:  | :heavy_check_mark: | :x:                |
| mouseup     | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:  | :heavy_check_mark: | :x:                |
| mouseenter  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:  | :heavy_check_mark: | :x:                |
| mouseleave  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:  | :heavy_check_mark: | :x:                |
| touchstart  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:  | :heavy_check_mark: | :x:                |
| touchmove   | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:  | :heavy_check_mark: | :x:                |
| touchend    | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:  | :heavy_check_mark: | :x:                |

::: warning
Do NOT combine suffixes. Only one suffix per event. A different suffix will give you a different event.
:::

| Suffix | Description | Data |
| ------ | ----------- | ---- |
| `:day2` | The day area | `{ scope: { timestamp: { "..." }, outside, miniMode }, event: { "..." } } |
| `:workweek2` | A workweek area | `{ scope: { workweekLabel, week: [ "..." ], miniMode }, event: { "..." } } |
| `:workweek:header2` | The area above the workweeks | `{ scope: { start: { "..." }, end: { "..." }, miniMode }, event: { "..." } } |
| `:day:header2` | The header area that includes weekday | `{ scope: { timestamp: { "..." }, index, miniMode }, event: { "..." } } |
| `:date2` | The date button | Date in format YYYY-MM-DD |

::: tip
`:workweek:header2` and  `:day:header2` are new since v2.4.0
:::

::: warning
The events `:day`, `:workweek` and `:date` still exist, but have been marked as deprecated starting with v2.4.0
:::

The example below is only showing `click` events as well as the `input` event.
    </q-markdown>
    <example-viewer title="Events" file="MiniModeEvents" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-title title="Slots" />
    <q-markdown>
The `#day` slot allows you to write anything into the body of the day. To avoid writing on top of the `day-label` add the css class `.q-event` to your item which adds a top margin (and also works for mini-mode).

For slots that return `day`, `interval` or `timestamp`, it looks like this:
```js
{
  date: '',       // YYYY-MM-DD
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
    </q-markdown>
    <example-viewer title="Slots (day)" file="MiniModeSlots" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-title title="Themes" />
    <q-markdown>
Look at the source below to see how you can create your own themes.
    </q-markdown>
    <example-viewer title="Theme" file="MiniModeTheme" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-title title="Locale Support" />
    <example-viewer title="Locale" file="MiniModeLocale" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

  </div>
</template>

<script>
import ExampleTitle from '../components/ExampleTitle'
import { slugify } from 'assets/page-utils'
import { version } from 'ui'

export default {
  name: 'MonthView',

  components: {
    ExampleTitle
  },

  data () {
    return {
      tempToc: [],
      locationUrl: 'https://github.com/quasarframework/quasar-ui-qcalendar/tree/dev/demo/src/examples/',
      jsPaths: [`https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qcalendar@${version}/dist/index.umd.min.js`],
      cssPaths: [
        `https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qcalendar@${version}/dist/index.min.css`,
        'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.12.0/css/all.css'
      ]
    }
  },

  mounted () {
    this.toc = []
    this.tempToc = []

    this.addToToc('Mini-Mode')
    this.addToToc('Basic', 2)
    this.addToToc('Bordered', 2)
    this.addToToc('Dark', 2)
    this.addToToc('Short Weekday Label', 2)
    this.addToToc('5 Day Work Week', 2)
    this.addToToc('Work Week Numbers', 2)
    this.addToToc('First Day Monday', 2)
    this.addToToc('Hide Header', 2)

    this.addToToc('Outside Days')
    this.addToToc('Enable Outside Days', 2)
    this.addToToc('Hide Outside Days', 2)

    this.addToToc('Breakpoints')
    this.addToToc('Breakpoint', 2)
    this.addToToc('Dynamic Breakpoint', 2)

    this.addToToc('Disabled')
    this.addToToc('Disabled Days', 2)
    this.addToToc('Disabled Days (combined)', 2)
    this.addToToc('Disabled Before/After', 2)
    this.addToToc('Disabled Weekdays', 2)

    this.addToToc('Navigation')
    this.addToToc('Prev/Next', 2)

    this.addToToc('Selection')
    this.addToToc('Selected Dates', 2)
    this.addToToc('Selection', 2)
    this.addToToc('Selection Click', 2)
    this.addToToc('Multi-Month Selection', 2)
    this.addToToc('Multi-Month Selection with Hover Prop', 2)
    this.addToToc('Selection (QInput)', 2)
    this.addToToc('Advanced Popup', 2)

    this.addToToc('Events')
    this.addToToc('Events', 2)

    this.addToToc('Slots')
    this.addToToc('Slots (day)', 2)

    this.addToToc('Themes')
    this.addToToc('Theme', 2)

    this.addToToc('Locale Support')
    this.addToToc('Locale', 2)

    this.toc = this.tempToc
  },

  computed: {
    toc:
    {
      get () {
        return this.$store.state.common.toc
      },
      set (toc) {
        this.$store.commit('common/toc', toc)
      }
    }
  },

  methods: {
    addToToc (name, level = 1) {
      let n = name
      if (level === 1) {
        n = 'title-' + n
      }
      else {
        n = 'example-' + n
      }
      const slug = slugify(n)
      this.tempToc.push({
        children: [],
        id: slug,
        label: name,
        level: level
      })
    }
  }
}
</script>

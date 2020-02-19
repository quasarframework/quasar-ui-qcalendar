<template>
  <div class="q-markdown">
    <q-markdown>
::: warning
The ability to use Codepen was recently added to the examples. There are differences in the UMD version of QCalendar, some examples won't work without a bit of manual intervention. Be patient while we get the kinks worked out and automate the necessary changes.
:::

    </q-markdown>
    <example-title title="Month View" />
    <example-viewer title="Basic" file="MonthViewBasic" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Color" file="MonthViewColor" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="First Day Monday" file="MonthViewMondayFirstDay" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="5 Day Work Week" file="MonthViewFiveDayWorkWeek" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Hide Header" file="MonthViewHideHeader" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Disabled Days" file="MonthViewDisabledDays" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths">
      <q-markdown>
When the property `disabled-days` has an array of disabled days, you can hook into the `day-style` property to change the background color of the disabled day.
      </q-markdown>
    </example-viewer>

    <example-viewer title="Now" file="MonthViewNow" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Work Weeks" file="MonthViewWorkWeekNumbers" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths">
      <q-markdown>
`show-work-weeks` is available only for month view.
      </q-markdown>
    </example-viewer>

    <example-viewer title="Short Weekday Label" file="MonthViewShortWeekdayLabel" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Short Month Label" file="MonthViewShortMonthLabel" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Show Day of Year Label" file="MonthViewShowDayOfYearLabel" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths">
      <q-markdown>
`show-day-of-year-label` is available only for month view.
      </q-markdown>
    </example-viewer>

    <example-viewer title="Day Height" file="MonthViewDayHeight" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths">
      <q-markdown>
`day-height` is available only for month view.
The example below is setting the `day-height` to `100`, the default is `0`, which tells the calendar component to figure out it's own height.
      </q-markdown>
    </example-viewer>

    <example-viewer title="Prev/Next" file="MonthViewPrevNext" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Swipe" file="MonthViewSwipe" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Selected Dates" file="MonthViewSelectedDates" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths">
      <q-markdown>
Click on dates to toggled selected on/off.
      </q-markdown>    </example-viewer>
    <example-viewer title="Multi-Day Selection (contiguous)" file="MonthViewSelection" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths">
      <q-markdown>
The example below shows how to use the QCalendar to create a multi-day selector. The critical aspect of this is the `selected-start-end-dates` property. This takes an array of two dates (the first should be less or equal to the last). This property really doesn't do much, except to keep the calendar reactive, so that the `day-style` property can be used to style the selected days.

For the example below, click a day, and while holding the mouse down, move to a different day. Keep in mind, this is just one way of handling multi-day selection. if you needed swipe navigation on a mobile, you could modify the code to have independent click on start and end days.

Keep in mind that the functionality below won't work with swipe actions.
      </q-markdown>
    </example-viewer>

    <example-viewer title="Slots (day)" file="MonthViewSlots" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths">
      <q-markdown>
The `#day` slot allows you to write anything into the body of the day. To avoid writing on top of the `day-label` add the css class `.q-event` to your item which adds a top margin (and also works for mini-mode).

For slots that return `day` or `timestamp`, it looks like this:
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
      </q-markdown>
    </example-viewer>
    <example-viewer title="Slots (week)" file="MonthViewWeekSlot" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths">
      <q-markdown>
The example below uses the **#week** slot (v1.3.2). It's a bit more difficult to work with than the **#day-body** slot, but allows you to have your devland events displayed in a contiguous manner. Check out the sources to see how it is accomplished.
::: warning
Do not mix #day-body and #week slots or you will have overlapping results.
:::
      </q-markdown>
    </example-viewer>
    <example-viewer title="Theme" file="MonthViewTheme" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-title title="Mini-Mode" />
    <q-markdown>
Mini-Mode is a special behavior for QCalendar **month** view. The property is `mini-mode` and can be set to `true` or `auto`. When set to `true` mini-mode is always on. When set to `auto`, mini-mode will use the `breakpoint` property to determine when to go into mini-mode.

When `mini-mode="auto"`, this works for the width of the screen, not the width of QCalendar. If you need to control mini-mode dynamically, then you need to set `true` or `false` based on your own calculations.

The examples below will be using QSplitter to adjust the width of the QCalendar and to dynamically switch to/from mini-mode. The breakpoint in the examples is **less than 500px**.

Not all examples have been copied over to `mini-mode` examples. They still work, like **Prev/Next** and **Swipe**.

Also, when in `mini-mode` there are some things to be aware of:

1. The property `month-label-size` defaults to `sm`
2. The property `short-weekday-label` is always true
3. The property `show-day-of-year-label` has no effect
4. The month label on first available day of the month is not displayed

Also, regardless of `mini-mode` all slots associated with month view now have additional slotted data: `miniMode`, which is either set to `true` or `false`.
    </q-markdown>

    <example-viewer title="Mini-Mode - Basic" file="MonthViewBasicMiniMode" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Mini-Mode - Disabled Days" file="MonthViewDisabledDaysMiniMode" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Mini-Mode - 5 Day Work Week" file="MonthViewFiveDayWorkWeekMiniMode" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Mini-Mode - Work Week Numbers" file="MonthViewWorkWeekNumbersMiniMode" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Mini-Mode - Selected Dates" file="MonthViewSelectedDatesMiniMode" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths">
      <q-markdown>
Click on dates to toggled selected on/off.
      </q-markdown>
    </example-viewer>
    <example-viewer title="Mini-Mode - Selection" file="MonthViewSelectionMiniMode" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths">
      <q-markdown>
There are some considerations when using mini-mode selections. There are 3 special classes: `.q-selected-day-first`, `.q-selected-day` and `.q-selected-day-last` in conjunction with the `day-class` property. These will help you create a selector compliant with [Material Design](https://material.io/components/pickers/#anatomy). See examples below for usage.
      </q-markdown>
    </example-viewer>
    <example-viewer title="Mini-Mode - Multi-Month Selection" file="MonthViewMultiMonthSelectionMiniMode" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths">
      <q-markdown>
Using the property `short-weekday-label` while in `mini-mode` gives an even shorter weekday label than normal.
      </q-markdown>
    </example-viewer>

    <example-viewer title="Mini-Mode - Selection (QInput)" file="MonthViewSelectionMiniModeQInput" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-viewer title="Mini-Mode - Slots (day)" file="MonthViewSlotsMiniMode" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Mini-Mode - Theme" file="MonthViewThemeMiniMode" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

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
    this.addToToc('Month View')
    this.addToToc('Basic', 2)
    this.addToToc('Color', 2)
    this.addToToc('First Day Monday', 2)
    this.addToToc('5 Day Work Week', 2)
    this.addToToc('Hide Header', 2)
    this.addToToc('Disabled Days', 2)
    this.addToToc('Now', 2)
    this.addToToc('Work Weeks', 2)
    this.addToToc('Short Weekday Label', 2)
    this.addToToc('Short Month Label', 2)
    this.addToToc('Show Day of Year Label', 2)
    this.addToToc('Day Height', 2)
    this.addToToc('Prev/Next', 2)
    this.addToToc('Swipe', 2)
    this.addToToc('Selected Dates', 2)
    this.addToToc('Multi-Day Selection', 2)
    this.addToToc('Slots (day)', 2)
    this.addToToc('Slots (week)', 2)
    this.addToToc('Theme', 2)

    this.addToToc('Mini-Mode')
    this.addToToc('Mini-Mode - Basic', 2)
    this.addToToc('Mini-Mode - Disabled Days', 2)
    this.addToToc('Mini-Mode - 5 Day Work Week', 2)
    this.addToToc('Mini-Mode - Work Week Numbers', 2)
    this.addToToc('Mini-Mode - Selected Dates', 2)
    this.addToToc('Mini-Mode - Selection', 2)
    this.addToToc('Mini-Mode - Multi-Month Selection', 2)
    this.addToToc('Mini-Mode - Selection (QInput)', 2)
    this.addToToc('Mini-Mode - Slots (day)', 2)
    this.addToToc('Mini-Mode - Theme', 2)

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
      if (level > 1) {
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

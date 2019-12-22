<template>
  <div class="q-markdown">
    <q-markdown>
::: warning
The ability to use Codepen was recently added to the examples. There are differences in the UMD version of QCalendar, some examples won't work without a bit of manual intervention. Be patient while we get the kinks worked out and automate the necessary changes.
:::
    </q-markdown>
    <example-title title="Week View" />
    <example-viewer title="Basic" file="WeekViewBasic" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="First Day Monday" file="WeekViewMondayFirstDay" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="5 Day Work Week" file="WeekViewFiveDayWorkWeek" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Disabled Days" file="WeekViewDisabledDays" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths">
      <q-markdown>
When the property `disabled-days` has an array of disabled days, you can hook into the `interval-style` property to change the background color of the disabled day.
      </q-markdown>
    </example-viewer>

    <example-viewer title="Now" file="WeekViewNow" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths">
      <q-markdown>
You can use the `now` property to set a fixed date, otherwise the current date will be used. If the `v-model` property is empty, then it will receive the `now` property's value.
      </q-markdown>
    </example-viewer>

    <example-viewer title="Short Weekday Label" file="WeekViewShortWeekdayLabel" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Hour24 Format" file="WeekViewHour24Format" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths">
      <q-markdown>
`hour24-format` is available only for one of the available `day` or `week` views.
      </q-markdown>
    </example-viewer>

    <example-viewer title="Short Interval Label" file="WeekViewShortIntervalLabel" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths">
      <q-markdown>
`short-interval-label` is available only for one of the available `day` or `week` views.
      </q-markdown>
    </example-viewer>

    <example-viewer title="Short Interval Label (Hour24Format)" file="WeekViewShortIntervalLabelHour24Format" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Prev/Next" file="WeekViewPrevNext" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Swipe" file="WeekViewSwipe" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Column Header" file="WeekViewColumnHeader" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Slots" file="WeekViewSlots" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths">
      <q-markdown>
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

You can use the slots `day-header` and `day-body` to control visual aspects of your event system.
The example below is using the `day-header` slot to indicate there are events on that day, in case it is not visible, indicating to the user they should scroll down to see the event.
The `day-body` slot is used to get information about the date and time of an event and then to calculate where the absolute position of the event based on passed in functions `timeStartPos` and `timeDurationHeight`.
      </q-markdown>
    </example-viewer>

    <example-title title="More Slots" />
    <example-viewer title="Week View (Current Time) - Slot (day-container)" file="WeekViewCurrentTime" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths">
      <q-markdown>
You can use the scopedSlot `day-container` to set an absolute position for a time tracking bar.
Scroll down if the current time is later for your location to see the example.
      </q-markdown>
    </example-viewer>

    <example-viewer title="Theme" file="WeekViewTheme" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

  </div>
</template>

<script>
import ExampleTitle from '../components/ExampleTitle'
import { slugify } from 'assets/page-utils'
import { version } from 'ui'

export default {
  name: 'WeekView',

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
    this.addToToc('Week View')
    this.addToToc('Basic', 2)
    this.addToToc('First Day Monday', 2)
    this.addToToc('5 Day Work Week', 2)
    this.addToToc('Disabled Days', 2)
    this.addToToc('Now', 2)
    this.addToToc('Short Weekday Label', 2)
    this.addToToc('Hour24 Format', 2)
    this.addToToc('Short Interval Label', 2)
    this.addToToc('Short Interval Label (Hour24Format)', 2)
    this.addToToc('Prev/Next', 2)
    this.addToToc('Swipe', 2)
    this.addToToc('Column Header', 2)
    this.addToToc('Slots', 2)
    this.addToToc('Week View (Current Time) - Slot (day-container)', 2)
    this.addToToc('Theme', 2)

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

<style lang="sass">
.example-page
  padding: 16px 46px
  font-weight: 300
  max-width: 900px
  margin-left: auto
  margin-right: auto
</style>

<template>
  <div class="q-markdown">
    <example-title title="Scheduler View" />
    <example-viewer title="Basic" file="SchedulerViewBasic" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Dark" file="SchedulerViewDark" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Disabled Days" file="SchedulerViewDisabledDays" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths">
      <q-markdown>
When the property `disabled-days` has an array of disabled days, you can hook into the `resource-style` property to change the background color of the disabled day.
      </q-markdown>
    </example-viewer>
    <example-viewer title="Disabled Before/After" file="SchedulerViewDisabledBeforeAfter" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths">
      <q-markdown>
In this example, the `disabled-before` is set to the monday of this week and the `disabled-after` is set to the friday of this week.
      </q-markdown>
    </example-viewer>
    <example-viewer title="Disabled Weekdays" file="SchedulerViewDisabledWeekdays" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths">
      <q-markdown>
In this example, the `disabled-weekdays` is set to disable the weekends.
      </q-markdown>
    </example-viewer>
    <example-viewer title="Prev/Next" file="SchedulerViewPrevNext" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Swipe" file="SchedulerViewSwipe" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Slots (scheduler-resources-header)" file="SchedulerViewSlotResourcesHeader" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths">
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

Below, the slot receives an array of `timestamp`s for the days that are being displayed.
      </q-markdown>
    </example-viewer>

    <example-viewer title="Slots (scheduler-day-header)" file="SchedulerViewSlotDayHeader" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths">
      <q-markdown>
Below, the slot receives the `timestamp` for the day being displayed.
      </q-markdown>
    </example-viewer>

    <example-viewer title="Slots (scheduler-resource-day)" file="SchedulerViewSlotResourceDay" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths">
      <q-markdown>
Below, the slot receives the `timestamp` for the day being displayed, an index, and the resource.
      </q-markdown>
    </example-viewer>

    <example-viewer title="Slots (scheduler-resource)" file="SchedulerViewSlotResource" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths">
      <q-markdown>
Below, the slot receives the `resource` to be displayed. In this case, an avatar (or icon) is being displayed along with the resource name.
      </q-markdown>
    </example-viewer>

    <example-viewer title="Theme" file="SchedulerViewTheme" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Locale" file="SchedulerViewLocale" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

  </div>
</template>

<script>
import ExampleTitle from '../components/ExampleTitle'
import { slugify } from 'assets/page-utils'
import { version } from 'ui'

export default {
  name: 'SchedulerView',

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
    this.addToToc('Scheduler View')
    this.addToToc('Basic', 2)
    this.addToToc('Dark', 2)
    this.addToToc('Disabled Days', 2)
    this.addToToc('Disabled Before/After', 2)
    this.addToToc('Disabled Weekdays', 2)
    this.addToToc('Prev/Next', 2)
    this.addToToc('Swipe', 2)
    this.addToToc('Slots (scheduler-resources-header)', 2)
    this.addToToc('Slots (scheduler-day-header)', 2)
    this.addToToc('Slots (scheduler-resource-day)', 2)
    this.addToToc('Slots (scheduler-resource)', 2)
    this.addToToc('Theme', 2)
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

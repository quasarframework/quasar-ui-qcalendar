<template>
  <div class="q-markdown">
    <example-title title="Agenda View" />
    <q-markdown>
The `agenda` views by themselves are rather boring. It's up to the developer to fill the content via the `day-body` slot (more about this below).
    </q-markdown>
    <example-viewer title="Basic" file="AgendaViewBasic" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Agenda View (week) - Basic" file="AgendaViewWeekBasic" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-viewer title="Slots" file="AgendaViewWeekSlots" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths">
      <q-markdown>
We are going to jump right into slot usage so that for the rest of the examples we have content that can be displayed.

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

    <example-viewer title="First Day Monday" file="AgendaViewWeekFirstDayMonday" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Five Day Workweek" file="AgendaViewWeekFiveDayWorkweek" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Theme" file="AgendaViewWeekTheme" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
  </div>
</template>

<script>
import ExampleTitle from '../components/ExampleTitle'
import { slugify } from 'assets/page-utils'
import { version } from 'ui'

export default {
  name: 'AgendaView',

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
    this.addToToc('Agenda View')
    this.addToToc('Basic', 2)
    this.addToToc('Agenda View (week) - Basic', 2)
    this.addToToc('Slots', 2)
    this.addToToc('First Day Monday', 2)
    this.addToToc('Five Day Workweek', 2)
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

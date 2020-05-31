<template>
  <div class="q-markdown">
    <example-title title="Agenda View" />
    <q-markdown>
The `agenda` views by themselves are rather boring. It's up to the developer to fill the content via the `day-body` slot (more about this below).

For another example on how to use the Agenda view, check out the [Planner example](/demos/planner).
    </q-markdown>
    <example-viewer title="Basic" file="AgendaViewBasic" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Agenda View (week) - Basic" file="AgendaViewWeekBasic" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-viewer title="Slots" file="AgendaViewWeekSlots" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths">
      <q-markdown>
We are going to jump right into slot usage so that for the rest of the examples we have content that can be displayed.

Remember, the data displayed below is slotted content, so you can be as creative as you need to be.

For slots that return `day`, `interval` or `timestamp`, it looks like this:
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

    <example-viewer title="Dark" file="AgendaViewWeekDark" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="First Day Monday" file="AgendaViewWeekFirstDayMonday" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Five Day Workweek" file="AgendaViewWeekFiveDayWorkweek" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Prev/Next" file="AgendaViewWeekPrevNext" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Swipe" file="AgendaViewWeekSwipe" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Column Options" file="AgendaViewWeekColumnOptions" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths">
      <q-markdown>
There are two properties: `left-column-options` and `right-column-options`, that allow you to define extra columns on the left and right of the `week-agenda` view. If you are using QCalendar to create a Planner, you will need this functionality.

These properties take an array of objects, like so:

(Template code)
```html
    :left-column-options="leftColumnOptions"
    :right-column-options="rightColumnOptions"
```

(JavaScript code)
```js
  data () {
    return {
      leftColumnOptions: [
        {
          id: 'over-due',
          label: 'Over Due'
        },
        {
          id: '90-days-overdue',
          label: '90 Days Over'
        }
      ],
      rightColumnOptions: [
        {
          id: 'summary'
          label: 'Summary'
        }
      ]
    }
  }
```
If you do not wish to have an `id` and `label` keys in your data (say, it came from a database), you can define which keys to use for this by using the `column-options-id` and `column-options-label` to define them.

```html
    column-options-id="column_id"
    column-options-label="name"
```

To manage data, use the `column-header` and `column-body` slots.
      </q-markdown>
    </example-viewer>
    <example-viewer title="No Scroll" file="AgendaViewNoScroll" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths">
      <q-markdown>
There may be circumstances where you wish to control the scrolling. In this case, use the `no-scroll` property and provide your own scroll wrapper.

:::
Note: The header area of the calendar will now scroll with the rest of the calendar
:::
      </q-markdown>
    </example-viewer>
    <example-viewer title="Theme" file="AgendaViewWeekTheme" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Locale" file="AgendaViewWeekLocale" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
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
    this.addToToc('Dark', 2)
    this.addToToc('First Day Monday', 2)
    this.addToToc('Five Day Workweek', 2)
    this.addToToc('Prev/Next', 2)
    this.addToToc('Swipe', 2)
    this.addToToc('No Scroll', 2)
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

<template>
  <div class="q-markdown">
    <q-markdown>
::: warning
The ability to use Codepen was recently added to the examples. There are differences in the UMD version of QCalendar, some examples won't work without a bit of manual intervention. Be patient while we get the kinks worked out and automate the necessary changes.
:::
    </q-markdown>
    <example-title title="Day View" />
    <example-viewer title="Basic" file="DayViewBasic" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Dark" file="DayViewDark" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="3Day" file="DayView3Day" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Hide Header" file="DayViewHideHeader" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <q-markdown>
There may be circumstances where you wish to control the scrolling. In this case, use the `no-scroll` property and provide your own scroll wrapper.

:::
Note: The header area of the calendar will now scroll with the rest of the calendar
:::
    </q-markdown>
    <example-viewer title="No Scroll" file="DayViewNoScroll" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-title title="Intervals" />
    <q-markdown>
`interval-height` is available only for one of the available `day` or `week` views.
The example below is setting the `interval-height` to `100`, the default is `40`.
    </q-markdown>
    <example-viewer title="Interval Height" file="DayViewIntervalHeight" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <q-markdown>
The example below is setting the `interval-count` to `4`, the default is `24`. This is the number of intervals to be displayed.
    </q-markdown>
    <example-viewer title="Interval Count" file="DayViewIntervalCount" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <q-markdown>
The example below is setting the `interval-minutes` to `30`, the default is `60`. This is the number of minutes in an interval. For this example, if you wanted the full 24 hours, you would also need to set `interval-count` to `48` (if you cut `interval-minutes` in half, then you need to double `interval-count`).
    </q-markdown>
    <example-viewer title="Interval Minutes (30)" file="DayViewIntervalMinutes30" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <q-markdown>
The example below is setting the `interval-minutes` to `15`, the default is `60`. This is the number of minutes in an interval. For this example, if you wanted the full 24 hours, you would also need to set `interval-count` to `96` (if you cut `interval-minutes` in quarter, then you need to quadruple `interval-count`).
    </q-markdown>
    <example-viewer title="Interval Minutes (15)" file="DayViewIntervalMinutes15" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <q-markdown>
The example below is setting the `interval-start` to `8`, the default is `0`. It is a good idea to also adjust the `interval-count` so that extra intervals are not displayed. In this example, the `interval-count` is set to `10`, so the intervals displayed are from 08:00-18:00.
    </q-markdown>
    <example-viewer title="Interval Start" file="DayViewIntervalStart" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-title title="Navigation" />
    <example-viewer title="Prev/Next" file="DayViewPrevNext" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Swipe" file="DayViewSwipe" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-title title="Header" />
    <example-viewer title="Custom Header" file="DayViewCustomHeader" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Custom Header with Custom Scroll" file="DayViewCustomHeaderWithCustomScroll" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <q-markdown>
Column Headers are scoped slots only. They are turned on with the `column-header-before` and `column-header-after` properties. Once each property is set to `true` the respective slot is availale.
Column Headers are only available for the `day` (includes 2day, 3day, etc), `week` and `scheduler` views.
The `timestamp` information is passed to the scoped slot.
    </q-markdown>
    <example-viewer title="Column Header" file="DayViewColumnHeader" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <q-markdown>
Column Count is only available for `day` view (no other views), with the property `column-count`.
Setting `column-count` to a value higher than 1 (default) will display the same day in that many columns.
    </q-markdown>
    <example-viewer title="Column Count" file="DayViewColumnCount" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <q-markdown>
If you combine `column-header-before` or `column-header-after` you can achieve a vertical schedule.
    </q-markdown>
    <example-viewer title="Column Header Count" file="DayViewColumnHeaderCount" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <q-markdown>
And finally, if you wanted the ability to page through a large number of resources, you can set the `column-index-start` to create a paging effect.
    </q-markdown>
    <example-viewer title="Column Header Count (Paged)" file="DayViewColumnHeaderCountPaging" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-title title="Events" />
    <q-markdown>
::: tip
The events below won't show up unless there is a listener for it. Therefore, if using `Vue Dev Tools`, you won't see it unless you add it.
:::

You can add a listener for the following events. An event is comprised of an `event + suffix`. By adding the event with the suffix, you get the completed listener name.

| Event       | `:day:header2`     | `:time2`            | `:interval2`       | `:interval:header2` | `:date2`           |
| ----------- | :----------------: | :----------------: | :----------------: | :-----------------: | :----------------: |
| click       | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:  | :heavy_check_mark: |
| contextmenu | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:  | :heavy_check_mark: |
| mousedown   | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:  | :x:                |
| mousemove   | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:  | :x:                |
| mouseup     | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:  | :x:                |
| mouseenter  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:  | :x:                |
| mouseleave  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:  | :x:                |
| touchstart  | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:  | :x:                |
| touchmove   | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:  | :x:                |
| touchend    | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:  | :x:                |

::: warning
Do NOT combine suffixes. Only one suffix per event. A different suffix will give you a different event.
:::

| Suffix | Description | Data |
| ------ | ----------- | ---- |
| `:day:header2` | The header area | `{ scope: { timestamp: { "..." }, index: 0 }, event: { "..." } } |
| `:time2` | The slotted area to side of intervals | `{ scope: { timestamp: { "..." }, index: 0 }, event: { "..." } } |
| `:interval2` | The interval area | `{ scope: { timestamp: { "..." } }, event: { "..." } } |
| `:intervals:header2` | The header area above the intervals| `{ scope: { days: [ "..." ] }, event: { "..." } } |
| `:date2` | The date button | Date in format YYYY-MM-DD |

::: tip
`:intervals:header2` is new since v2.4.0
:::

::: warning
The events `:day` (now `:day:header2`), `:time`, `:interval` and `:date` still exist, but have been marked as deprecated starting with v2.4.0
:::

The example below is only showing `click` events as well as the `input` event.
    </q-markdown>
    <example-viewer title="Events" file="DayViewEvents" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-title title="Slots" />
    <q-markdown>
For slots that return a `timestamp`, it looks like this:
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

You can use the slots `day-header` and `day-body` to control visual aspects of your event system.
The example below is using the `day-header` slot to indicate there are events on that day, in case it is not visible, indicating to the user they should scroll down to see the event.
The `day-body` slot is used to get information about the date and time of an event and then to calculate where the absolute position of the event based on passed in functions `timeStartPos` and `timeDurationHeight`.
    </q-markdown>
    <example-viewer title="day-header with day-body" file="DayViewSlots" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-viewer title="head-day" file="DayViewSlotHeadDay" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <q-markdown>
You can use the scopedSlot `day-container` to set an absolute position for a time tracking bar.
Scroll down if the current time is later for your location to see the example.
    </q-markdown>
    <example-viewer title="day-container: Show current time" file="DayViewCurrentTime" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-title title="Themes" />
    <example-viewer title="Theme" file="DayViewTheme" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-title title="Locale Support" />
    <example-viewer title="Locale" file="DayViewLocale" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

  </div>
</template>

<script>
import ExampleTitle from '../components/ExampleTitle'
import { slugify } from 'assets/page-utils'
import { version } from 'ui'

export default {
  name: 'DayView',

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
    this.addToToc('Day View')
    this.addToToc('Basic', 2)
    this.addToToc('Dark', 2)
    this.addToToc('3Day', 2)
    this.addToToc('Hide Header', 2)
    this.addToToc('No Scroll', 2)

    this.addToToc('Intervals')
    this.addToToc('Interval Height', 2)
    this.addToToc('Interval Count', 2)
    this.addToToc('Interval Minutes (30)', 2)
    this.addToToc('Interval Minutes (15)', 2)
    this.addToToc('Interval Start', 2)

    this.addToToc('Navigation')
    this.addToToc('Prev/Next', 2)
    this.addToToc('Swipe', 2)

    this.addToToc('Header')
    this.addToToc('Custom Header', 2)
    this.addToToc('Custom Header with Custom Scroll', 2)
    this.addToToc('Column Header', 2)
    this.addToToc('Column Count', 2)
    this.addToToc('Column Header Count', 2)
    this.addToToc('Column Header Count (Paged)', 2)

    this.addToToc('Events')
    this.addToToc('Events', 2)

    this.addToToc('Slots')
    this.addToToc('day-header with day-body', 2)
    this.addToToc('head-day', 2)
    this.addToToc('day-container: Show current time', 2)

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

<template>
  <div class="q-markdown">
    <example-title title="Resource View" />
    <example-viewer title="Basic" file="ResourceViewBasic" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <q-markdown>
You can set the `sticky` property to make the resource column and interval labels row **sticky** so they don't scroll.
::: warning
`sticky` will not work with IE/Edge.
:::
    </q-markdown>
    <example-viewer title="Sticky" file="ResourceViewSticky" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-viewer title="Bordered" file="ResourceViewBordered" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Dark" file="ResourceViewDark" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-title title="Navigation" />
    <example-viewer title="Prev/Next" file="ResourceViewPrevNext" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Swipe" file="ResourceViewSwipe" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-title title="Intervals" />
    <example-viewer title="Interval Header Width/Height" file="ResourceViewIntervalHeaderWidthHeight" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <q-markdown>
The example below is setting the `interval-count` to `4`, the default is `24`. This is the number of intervals to be displayed.
    </q-markdown>
    <example-viewer title="Interval Count" file="ResourceViewIntervalCount" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <q-markdown>
The example below is setting the `interval-minutes` to `30`, the default is `60`. This is the number of minutes in an interval. For this example, if you wanted the full 24 hours, you would also need to set `interval-count` to `48` (if you cut `interval-minutes` in half, then you need to double `interval-count`).
    </q-markdown>
    <example-viewer title="Interval Minutes (30)" file="ResourceViewIntervalMinutes30" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <q-markdown>
The example below is setting the `interval-minutes` to `15`, the default is `60`. This is the number of minutes in an interval. For this example, if you wanted the full 24 hours, you would also need to set `interval-count` to `96` (if you cut `interval-minutes` in quarter, then you need to quadruple `interval-count`).
    </q-markdown>
    <example-viewer title="Interval Minutes (15)" file="ResourceViewIntervalMinutes15" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <q-markdown>
The example below is setting the `interval-start` to `8`, the default is `0`. It is a good idea to also adjust the `interval-count` so that extra intervals are not displayed. In this example, the `interval-count` is set to `10`, so the intervals displayed are from 08:00-18:00.
    </q-markdown>
    <example-viewer title="Interval Start" file="ResourceViewIntervalStart" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-title title="Resource" />
    <example-viewer title="Resource Width/Height" file="ResourceViewResourceWidthHeight" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <q-markdown>
You can provide a custom height by providing a `height` key within your resource object. This is a number as `px` is assumed. If height is not given, then the property `resource-height` will be used. If you use this feature, you **cannot** set the property `resource-height` to 0, which gives `auto` height. _Added in v2.5.0_.
    </q-markdown>
    <example-viewer title="Custom Resource Height" file="ResourceViewCustomHeight" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-title title="Hierarchy" />
    <q-markdown>
The example below is uses keys `children` and `expanded`, in the `resources` object, to show a tree hierarchy.
    </q-markdown>
    <example-viewer title="Children" file="ResourceViewChildren" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-title title="Events" />
    <q-markdown>
::: tip
The events below won't show up unless there is a listener for it. Therefore, if using `Vue Devtools`, you won't see it unless you add it.
:::

You can add a listener for the following events. An event is comprised of an `event + suffix`. By adding the event with the suffix, you get the completed listener name.

| Event       | `:interval2`       | `:resource2`       | `:time2`             | `:resource:header2`| `:date2`           |
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
| `:interval2` | The time header area | `{ scope: { timestamp: { "..." } }, event: { "..." } } |
| `:resource2` | A resource | `{ scope: { resource: { "..."}, index, intervals: [ "..." ] }, event: { "..." } } |
| `:time2` | The time associated with a resource | `{ scope: { timestamp: { "..." }, index, resource: { "..."} }, event: { "..." } } |
| `:resource:header2` | The header area above the resources | `{ scope: { timestamp: { "..." }, resources: [ "..." ], intervals: [ "..." ] }, event: { "..." } } |
| `:date2` | The date button | Date in format YYYY-MM-DD |

::: tip
`:resource:header2` is new since v2.4.0
:::

::: warning
The events `:interval`, `:resource`, `:time` and `:date` still exist, but have been marked as deprecated starting with v2.4.0
:::

The example below is only showing `click` events as well as the `input` event.
    </q-markdown>
    <example-viewer title="Events" file="ResourceViewEvents" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-title title="Slots" />
    <q-markdown>
For slots that return `timestamp`, it looks like this:
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

You can use the slots `resource-intervals` and `resource-interval` to control visual aspects of your event system.

The example below is using the `resource-label` slot to indicate there are events in that time interval, in case it is not visible, indicating to the user they should scroll sideways to see the event.

The `resource-intervals` slot is used to get information about the date and time of an event and then to calculate where the absolute position of the event based on passed in functions `timeStartPosX` and `timeDurationWidth`.

Scroll until you see 10:00am to see example.
    </q-markdown>
    <example-viewer title="resource-interval Slot" file="ResourceViewSlots" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-viewer title="resource-header Slot" file="ResourceViewSlotResourceHeader" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <q-markdown>
Below, the slot receives the `resource` to be displayed. In this case, an avatar (or icon) is being displayed along with the resource name.
    </q-markdown>
    <example-viewer title="resource-label Slot" file="ResourceViewSlotResourceLabel" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-title title="Themes" />
    <example-viewer title="Theme" file="ResourceViewTheme" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-title title="Locale Support" />
    <example-viewer title="Locale" file="ResourceViewLocale" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

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
    this.addToToc('Resource View')
    this.addToToc('Basic', 2)
    this.addToToc('Sticky', 2)
    this.addToToc('Bordered', 2)
    this.addToToc('Dark', 2)

    this.addToToc('Navigation')
    this.addToToc('Prev/Next', 2)
    this.addToToc('Swipe', 2)

    this.addToToc('Intervals')
    this.addToToc('Interval Header Width/Height', 2)
    this.addToToc('Interval Count', 2)
    this.addToToc('Interval Minutes (30)', 2)
    this.addToToc('Interval Minutes (15)', 2)
    this.addToToc('Interval Start', 2)

    this.addToToc('Resource')
    this.addToToc('Resource Width/Height', 2)
    this.addToToc('Custom Resource Height', 2)

    this.addToToc('Hierarchy')
    this.addToToc('Children', 2)

    this.addToToc('Events')
    this.addToToc('Events', 2)

    this.addToToc('Slots')
    this.addToToc('resource-interval Slot', 2)
    this.addToToc('resource-header Slot', 2)
    this.addToToc('resource-label Slot', 2)

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

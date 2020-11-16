<template>
  <div>
    <q-markdown>
::: warning
Codepen uses the UMD version of QCalendar. As such, the examples below must be written in such a way that they also work on that platform. If you see code like `QCalendar.addToDate`, you can instead use `import { addToDate } from '@quasar/quasar-ui-qcalendar'` in your own non-UMD code to get the best tree-shaking effects.
:::
    </q-markdown>
    <q-markdown>
::: tip
To use the scheduler, you need to use the `resources` property, which is an array of objects, containing a key as defined by the `resource-key` (default `label`). It's this key that will be displayed in your scheduler.
```js
const rooms = [
  { id: 1, label: 'Room 1' /* any other keys you want associated with the data */ },
  { id: 2, label: 'Room 2' },
  { id: 3, label: 'Room 3' },
  ...
]
```
:::
    </q-markdown>

    <example-title title="Scheduler View" />
    <example-viewer title="Basic" file="SchedulerViewBasic" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Dark" file="SchedulerViewDark" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-title title="Navigation" />
    <example-viewer title="Prev/Next" file="SchedulerViewPrevNext" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <example-viewer title="Swipe" file="SchedulerViewSwipe" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-title title="Disabled" />
    <example-viewer title="Disabled Days" file="SchedulerViewDisabledDays" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <q-markdown>
In this example, the `disabled-before` is set to the monday of this week and the `disabled-after` is set to the friday of this week.
    </q-markdown>
    <example-viewer title="Disabled Before/After" file="SchedulerViewDisabledBeforeAfter" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <q-markdown>
In this example, the `disabled-weekdays` is set to disable the weekends.
    </q-markdown>
    <example-viewer title="Disabled Weekdays" file="SchedulerViewDisabledWeekdays" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-title title="Resource" />
    <example-viewer title="Resource Width/Height" file="SchedulerViewResourceWidthHeight" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />
    <q-markdown>
You can provide a custom height by providing a `height` key within your resource object. This is a number as `px` is assumed. If height is not given, then the property `resource-height` will be used. If you use this feature, you **cannot** set the property `resource-height` to 0, which gives `auto` height. _Added in v2.5.0_.
    </q-markdown>
    <example-viewer title="Custom Resource Height" file="SchedulerViewCustomHeight" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-title title="Hierarchy" />
    <q-markdown>
The example below uses the keys `children` and `expanded`, in the `resources` object, to show a tree hierarchy.
    </q-markdown>
    <example-viewer title="Children" file="SchedulerViewChildren" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-title title="Events" />
    <q-markdown>
::: tip
The events below won't show up unless there is a listener for it. Therefore, if using `Vue Devtools`, you won't see it unless you add it.
:::

You can add a listener for the following events. An event is comprised of an `event + suffix`. By adding the event with the suffix, you get the completed listener name.

| Event       | `:day:header2`     | `:resource2`       | `:resource:header2` | `resource:day2`    | `:date2`           |
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
| `:day:header2` | The header day area | `{ scope: { timestamp: { "..." } }, event: { "..." } } |
| `:resource2` | A resource | `{ scope: { resource: { "..."}, index, days: [ "..." ] }, event: { "..." } } |
| `:resource:day2` | The day associated with a resource | `{ scope: { timestamp: { "..." }, index, resource: { "..."} }, event: { "..." } } |
| `:resource:header2` | The header area above the resources | `{ scope: { days: [ "..." ] }, event: { "..." } } |
| `:date2` | The date button | Date in format YYYY-MM-DD |

::: tip
`:resource:header2` is new since v2.4.0
:::

::: warning
The events `:day` (now `:day:header2`), `:time`, `:interval` and `:date` have been removed in v3.0.0
:::

The example below is only showing `click` events as well as the `input` and 'expanded' events.
    </q-markdown>
    <example-viewer title="Events" file="SchedulerViewEvents" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

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

Below, the slot receives an array of `timestamp`s for the days that are being displayed.
    </q-markdown>
    <example-viewer title="Slot (scheduler-resources-header)" file="SchedulerViewSlotResourcesHeader" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-viewer title="Slot (head-day)" file="SchedulerViewSlotHeadDay" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <q-markdown>
Below, the slot receives the `timestamp` for the day being displayed.
    </q-markdown>
    <example-viewer title="Slot (scheduler-day-header)" file="SchedulerViewSlotDayHeader" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <q-markdown>
Below, the slot receives the `timestamp` for the day being displayed, an index, and the resource.
    </q-markdown>
    <example-viewer title="Slot (scheduler-resource-day)" file="SchedulerViewSlotResourceDay" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <q-markdown>
Below, the slot receives the `resource` to be displayed. In this case, an avatar (or icon) is being displayed along with the resource name.
    </q-markdown>
    <example-viewer title="Slot (scheduler-resource)" file="SchedulerViewSlotResource" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-title title="Customization" />
    <q-markdown>
You can create your own themes by overriding various css vars. You do not have to override all of them (as in the next example), just the ones you need. For building your own themes, head on over to the [Theme Builder](../../quasar-ui-qcalendar/theme-builder)
    </q-markdown>
    <example-viewer title="Colors" file="SchedulerViewColors" :location-url="locationUrl" :js-paths="jsPaths" :css-paths="cssPaths" />

    <example-title title="Locale Support" />
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

    this.addToToc('Navigation')
    this.addToToc('Prev/Next', 2)
    this.addToToc('Swipe', 2)

    this.addToToc('Disabled')
    this.addToToc('Disabled Days', 2)
    this.addToToc('Disabled Before/After', 2)
    this.addToToc('Disabled Weekdays', 2)

    this.addToToc('Resource')
    this.addToToc('Resource Width/Height', 2)
    this.addToToc('Custom Resource Height', 2)

    this.addToToc('Hierarchy')
    this.addToToc('Children', 2)

    this.addToToc('Events')
    this.addToToc('Events', 2)

    this.addToToc('Slots')
    this.addToToc('Slot (scheduler-resources-header)', 2)
    this.addToToc('Slot (head-day)', 2)
    this.addToToc('Slot (scheduler-day-header)', 2)
    this.addToToc('Slot (scheduler-resource-day)', 2)
    this.addToToc('Slot (scheduler-resource)', 2)

    this.addToToc('Customization')
    this.addToToc('Colors', 2)

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

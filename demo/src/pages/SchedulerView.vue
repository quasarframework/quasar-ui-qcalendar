<template>
  <div class="q-markdown">
    <example-title title="Scheduler View" />
    <example-card title="Basic" name="SchedulerViewBasic" :tag-parts="getTagParts(require('!!raw-loader!../examples/SchedulerViewBasic.vue').default)" />
    <example-card title="Disabled Days" name="SchedulerViewDisabledDays" :tag-parts="getTagParts(require('!!raw-loader!../examples/SchedulerViewDisabledDays.vue').default)">
      <q-markdown>
When the property `disabled-days` has an array of disabled days, you can hook into the `resource-style` property to change the background color of the disabled day.
      </q-markdown>
    </example-card>
    <example-card title="Prev/Next" name="SchedulerViewPrevNext" :tag-parts="getTagParts(require('!!raw-loader!../examples/SchedulerViewPrevNext.vue').default)" />
    <example-card title="Swipe" name="SchedulerViewSwipe" :tag-parts="getTagParts(require('!!raw-loader!../examples/SchedulerViewSwipe.vue').default)" />
    <example-card title="Slots (scheduler-resources-header)" name="SchedulerViewSlotResourcesHeader" :tag-parts="getTagParts(require('!!raw-loader!../examples/SchedulerViewSlotResourcesHeader.vue').default)">
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
  future: false   // if timestamp is in the future (based on `now` property)
}
```

Below, the slot receives an array of `timestamp`s for the days that are being displayed.
      </q-markdown>
    </example-card>

    <example-card title="Slots (scheduler-day-header)" name="SchedulerViewSlotDayHeader" :tag-parts="getTagParts(require('!!raw-loader!../examples/SchedulerViewSlotDayHeader.vue').default)">
      <q-markdown>
Below, the slot receives the `timestamp` for the day being displayed.
      </q-markdown>
    </example-card>

    <example-card title="Slots (scheduler-resource-day)" name="SchedulerViewSlotResourceDay" :tag-parts="getTagParts(require('!!raw-loader!../examples/SchedulerViewSlotResourceDay.vue').default)">
      <q-markdown>
Below, the slot receives the `timestamp` for the day being displayed, an index, and the resource.
      </q-markdown>
    </example-card>

    <example-card title="Slots (scheduler-resource)" name="SchedulerViewSlotResource" :tag-parts="getTagParts(require('!!raw-loader!../examples/SchedulerViewSlotResource.vue').default)">
      <q-markdown>
Below, the slot receives the `resource` to be displayed. In this case, an avatar (or icon) is being displayed along with the resource name.
      </q-markdown>
    </example-card>

    <example-card title="Theme" name="SchedulerViewTheme" :tag-parts="getTagParts(require('!!raw-loader!../examples/SchedulerViewTheme.vue').default)" />

  </div>
</template>

<script>
import ExampleTitle from '../components/ExampleTitle'
import ExampleCard from '../components/ExampleCard'
import { slugify } from 'assets/page-utils'
import { getTagParts } from '@quasar/quasar-ui-qmarkdown'

export default {
  name: 'SchedulerView',

  components: {
    ExampleTitle,
    ExampleCard
  },

  data () {
    return {
      tempToc: []
    }
  },

  mounted () {
    this.toc = []
    this.tempToc = []
    this.addToToc('Scheduler View')
    this.addToToc('Basic', 2)
    this.addToToc('Disabled Days', 2)
    this.addToToc('Prev/Next', 2)
    this.addToToc('Swipe', 2)
    this.addToToc('Slots (scheduler-resources-header)', 2)
    this.addToToc('Slots (scheduler-day-header)', 2)
    this.addToToc('Slots (scheduler-resource-day)', 2)
    this.addToToc('Slots (scheduler-resource)', 2)
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
    getTagParts,

    addToToc (name, level = 1) {
      const slug = slugify(name)
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

<style lang="stylus">
.example-page
  padding: 16px 46px;
  font-weight: 300;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
</style>

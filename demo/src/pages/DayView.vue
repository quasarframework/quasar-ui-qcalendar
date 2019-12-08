<template>
  <div class="q-markdown">
    <example-title title="Basic" />
    <example-card title="Day View - Basic" name="DayViewBasic" :tag-parts="getTagParts(require('!!raw-loader!../examples/DayViewBasic.vue').default)" />
    <example-card title="Day View - 3Day" name="DayView3Day" :tag-parts="getTagParts(require('!!raw-loader!../examples/DayView3Day.vue').default)" />

    <example-title title="Hide Header" />
    <example-card title="Day View - Hide Header" name="DayViewHideHeader" :tag-parts="getTagParts(require('!!raw-loader!../examples/DayViewHideHeader.vue').default)" />

    <example-title title="Interval Modifications" />
    <example-card title="Day View - Interval Height" name="DayViewIntervalHeight" :tag-parts="getTagParts(require('!!raw-loader!../examples/DayViewIntervalHeight.vue').default)">
      <q-markdown>
`interval-height` is available only for one of the available `day` or `week` views.
The example below is setting the `interval-height` to `100`, the default is `40`.
      </q-markdown>
    </example-card>

    <example-card title="Day View - Interval Count" name="DayViewIntervalCount" :tag-parts="getTagParts(require('!!raw-loader!../examples/DayViewIntervalCount.vue').default)">
      <q-markdown>
The example below is setting the `interval-count` to `4`, the default is `24`. This is the number of intervals to be displayed.
      </q-markdown>
    </example-card>

    <example-card title="Day View - Interval Minutes (30)" name="DayViewIntervalMinutes30" :tag-parts="getTagParts(require('!!raw-loader!../examples/DayViewIntervalMinutes30.vue').default)">
      <q-markdown>
The example below is setting the `interval-minutes` to `30`, the default is `60`. This is the number of minutes in an interval. For this example, if you wanted the full 24 hours, you would also need to set `interval-count` to `48` (if you cut `interval-minutes` in half, then you need to double `interval-count`).
      </q-markdown>
    </example-card>

    <example-card title="Day View - Interval Minutes (15)" name="DayViewIntervalMinutes15" :tag-parts="getTagParts(require('!!raw-loader!../examples/DayViewIntervalMinutes15.vue').default)">
      <q-markdown>
The example below is setting the `interval-minutes` to `15`, the default is `60`. This is the number of minutes in an interval. For this example, if you wanted the full 24 hours, you would also need to set `interval-count` to `96` (if you cut `interval-minutes` in quarter, then you need to quadruple `interval-count`).
      </q-markdown>
    </example-card>

    <example-card title="Day View - Interval Start" name="DayViewIntervalStart" :tag-parts="getTagParts(require('!!raw-loader!../examples/DayViewIntervalStart.vue').default)">
      <q-markdown>
The example below is setting the `interval-start` to `8`, the default is `0`. It is a good idea to also adjust the `interval-count` so that extra intervals are not displayed. In this example, the `interval-count` is set to `10`, so the intervals displayed are from 08:00-18:00.
      </q-markdown>
    </example-card>

    <example-title title="Previous/Next" />
    <example-card title="Day View - Prev/Next" name="DayViewPrevNext" :tag-parts="getTagParts(require('!!raw-loader!../examples/DayViewPrevNext.vue').default)" />

    <example-title title="Swipe Navigation" />
    <example-card title="Day View - Swipe" name="DayViewSwipe" :tag-parts="getTagParts(require('!!raw-loader!../examples/DayViewSwipe.vue').default)">
      <q-markdown>
For swipe support, don't forget to add the `TouchSwipe` directive to your `quasar.conf.js`.
      </q-markdown>
    </example-card>

    <example-title title="Column Header" />
    <example-card title="Day View - Column Header" name="DayViewColumnHeader" :tag-parts="getTagParts(require('!!raw-loader!../examples/DayViewColumnHeader.vue').default)">
      <q-markdown>
Column Headers are scoped slots only. They are turned on with the `column-header-before` and `column-header-after` properties. Once each property is set to `true` the respective slot is availale.
Column Headers are only available for the day (includes 2day, 3day, etc), `week` and `scheduler` views.
The `timestamp` information is passed to the scoped slot.
      </q-markdown>
    </example-card>

    <example-title title="Column Count" />
    <example-card title="Day View - Column Count" name="DayViewColumnCount" :tag-parts="getTagParts(require('!!raw-loader!../examples/DayViewColumnCount.vue').default)">
      <q-markdown>
Column Count is only available for `day` view (no other views), with the property `column-count`.
Setting `column-count` to a value higher than 1 (default) will display the same day in that many columns.
      </q-markdown>
    </example-card>

    <example-card title="Day View - Column Header Count" name="DayViewColumnHeaderCount" :tag-parts="getTagParts(require('!!raw-loader!../examples/DayViewColumnHeaderCount.vue').default)">
      <q-markdown>
If you combine `column-header-before` or `column-header-after` you can achieve a vertical schedule.
      </q-markdown>
    </example-card>

    <example-card title="Day View - Column Header Count (Paged)" name="DayViewColumnHeaderCountPaging" :tag-parts="getTagParts(require('!!raw-loader!../examples/DayViewColumnHeaderCountPaging.vue').default)">
      <q-markdown>
And finally, if you wanted the ability to page through a large number of resources, you can set the `column-index-start` to create a paging effect.
      </q-markdown>
    </example-card>

    <example-title title="Working with Slots" />
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
      </q-markdown>
    <example-card title="Day View - Slots" name="DayViewSlots" :tag-parts="getTagParts(require('!!raw-loader!../examples/DayViewSlots.vue').default)">
    <q-markdown>
You can use the slots `day-header` and `day-body` to control visual aspects of your event system.
The example below is using the `day-header` slot to indicate there are events on that day, in case it is not visible, indicating to the user they should scroll down to see the event.
The `day-body` slot is used to get information about the date and time of an event and then to calculate where the absolute position of the event based on passed in functions `timeStartPos` and `timeDurationHeight`.
    </q-markdown>
    </example-card>

    <example-title title="More Slots" />
    <example-card title="Day View (Current Time) - Slot (day-container)" name="DayViewCurrentTime" :tag-parts="getTagParts(require('!!raw-loader!../examples/DayViewCurrentTime.vue').default)">
      <q-markdown>
You can use the scopedSlot `day-container` to set an absolute position for a time tracking bar.
Scroll down if the current time is later for your location to see the example.
      </q-markdown>
    </example-card>

  </div>
</template>

<script>
import ExampleTitle from '../components/ExampleTitle'
import ExampleCard from '../components/ExampleCard'
import { slugify } from 'assets/page-utils'
import { getTagParts } from '@quasar/quasar-ui-qmarkdown'

export default {
  name: 'DayView',

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
    this.addToToc('Basic')
    this.addToToc('Day View - Basic', 2)
    this.addToToc('Day View - 3Day', 2)

    this.addToToc('Hide Header')
    this.addToToc('Day View - Hide Header', 2)

    this.addToToc('Interval Modifications')
    this.addToToc('Day View - Interval Height', 2)
    this.addToToc('Day View - Interval Count', 2)
    this.addToToc('Day View - Interval Minutes (30)', 2)
    this.addToToc('Day View - Interval Minutes (15)', 2)
    this.addToToc('Day View - Interval Start', 2)

    this.addToToc('Previous/Next')
    this.addToToc('Day View - Prev/Next', 2)

    this.addToToc('Swipe Navigation')
    this.addToToc('Day View - Swipe', 2)

    this.addToToc('Column Header')
    this.addToToc('Day View - Column Header', 2)

    this.addToToc('Column Count')
    this.addToToc('Day View - Column Count', 2)
    this.addToToc('Day View - Column Header Count', 2)
    this.addToToc('Day View - Column Header Count (Paged)', 2)

    this.addToToc('Working with Slots')
    this.addToToc('Day View - Slots', 2)

    this.addToToc('More Slots')
    this.addToToc('Day View (Current Time) - Slot (day-container)', 2)

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

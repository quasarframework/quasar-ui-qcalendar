<template>
  <div class="q-markdown">
    <example-title title="Basic" />
    <example-card title="Month View - Basic" name="MonthViewBasic" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewBasic.vue').default)" />

    <example-title title="First Day Monday" />
    <example-card title="Month View - First Day Monday" name="MonthViewFirstDayMonday" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewMondayFirstDay.vue').default)" />

    <example-title title="5 Day Work Week" />
    <example-card title="Month View - 5 Day Work Week" name="MonthViewFiveDayWorkWeek" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewFiveDayWorkWeek.vue').default)" />

    <example-title title="Hide Header" />
    <example-card title="Month View - Hide Header" name="MonthViewHideHeader" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewHideHeader.vue').default)" />

    <example-title title="Disabled Days" />
    <example-card title="Month View - Disabled Days" name="MonthViewDisabledDays" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewDisabledDays.vue').default)">
      <q-markdown>
When the property `disabled-days` has an array of disabled days, you can hook into the `day-style` property to change the background color of the disabled day.
      </q-markdown>
    </example-card>

    <example-title title="Now" />
    <example-card title="Month View - Now" name="MonthViewNow" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewNow.vue').default)" />

    <example-title title="Work Weeks" />
    <example-card title="Month View - Work Weeks" name="MonthViewWorkWeekNumbers" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewWorkWeekNumbers.vue').default)">
      <q-markdown>
`show-work-weeks` is available only for month view.
      </q-markdown>
    </example-card>

    <example-title title="Short Weekday Label" />
    <example-card title="Month View - Short Weekday Label" name="MonthViewShortWeekdayLabel" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewShortWeekdayLabel.vue').default)" />

    <example-title title="Short Month Label" />
    <example-card title="Month View - Short Month Label" name="MonthViewShortMonthLabel" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewShortMonthLabel.vue').default)" />

    <example-title title="Show Day of Year Label" />
    <example-card title="Month View - Show Day of Year Label" name="MonthViewShowDayOfYearLabel" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewShowDayOfYearLabel.vue').default)">
      <q-markdown>
`show-day-of-year-label` is available only for month view.
      </q-markdown>
    </example-card>

    <example-title title="Day Height" />
    <example-card title="Month View - Day Height" name="MonthViewDayHeight" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewDayHeight.vue').default)">
      <q-markdown>
`day-height` is available only for month view.
The example below is setting the `day-height` to `100`, the default is `0`, which tells the calendar component to figure out it's own height.
      </q-markdown>
    </example-card>

    <example-title title="Previous/Next" />
    <example-card title="Month View - Prev/Next" name="MonthViewPrevNext" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewPrevNext.vue').default)" />

    <example-title title="Swipe Navigation" />
    <example-card title="Month View - Swipe" name="MonthViewSwipe" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewSwipe.vue').default)" />

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
    <example-card title="Month View - Slots" name="MonthViewSlots" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewSlots.vue').default)" />

  </div>
</template>

<script>
import ExampleTitle from '../components/ExampleTitle'
import ExampleCard from '../components/ExampleCard'
import { slugify } from 'assets/page-utils'
import getTagParts from '@quasar/quasar-app-extension-qmarkdown/src/lib/getTagParts'

export default {
  name: 'MonthView',

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
    this.addToToc('Month View - Basic', 2)

    this.addToToc('First Day Monday')
    this.addToToc('Month View - First Day Monday', 2)

    this.addToToc('5 Day Work Week')
    this.addToToc('Month View - 5 Day Work Week', 2)

    this.addToToc('Hide Header')
    this.addToToc('Month View - Hide Header', 2)

    this.addToToc('Disabled Days')
    this.addToToc('Month View - Disabled Days', 2)

    this.addToToc('Now')
    this.addToToc('Month View - Now', 2)

    this.addToToc('Work Weeks')
    this.addToToc('Month View - Work Weeks', 2)

    this.addToToc('Short Weekday Label')
    this.addToToc('Month View - Short Weekday Label', 2)

    this.addToToc('Short Month Label')
    this.addToToc('Month View - Short Month Label', 2)

    this.addToToc('Show Day of Year Label')
    this.addToToc('Month View - Show Day of Year Label', 2)

    this.addToToc('Day Height')
    this.addToToc('Month View - Day Height', 2)

    this.addToToc('Previous/Next')
    this.addToToc('Month View - Prev/Next', 2)

    this.addToToc('Swipe Navigation')
    this.addToToc('Month View - Swipe', 2)

    this.addToToc('Working with Slots')
    this.addToToc('Month View - Slots', 2)

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

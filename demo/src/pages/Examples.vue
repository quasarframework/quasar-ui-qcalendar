<template>
  <hero>
    <div class="q-markdown">
      <example-title title="Basic" />
      <example-card title="Day View - Basic" name="DayViewBasic" :tag-parts="getTagParts(require('!!raw-loader!../examples/DayViewBasic.vue').default)" />
      <example-card title="Day View - 3Day" name="DayView3Day" :tag-parts="getTagParts(require('!!raw-loader!../examples/DayView3day.vue').default)" />
      <example-card title="Week View - Basic" name="WeekViewBasic" :tag-parts="getTagParts(require('!!raw-loader!../examples/WeekViewBasic.vue').default)" />
      <example-card title="Month View - Basic" name="MonthViewBasic" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewBasic.vue').default)" />
      <example-card title="Scheduler View - Basic" name="SchedulerViewBasic" :tag-parts="getTagParts(require('!!raw-loader!../examples/SchedulerViewBasic.vue').default)" />

      <example-title title="First Day Monday" />
      <example-card title="Week View - First Day Monday" name="WeekViewFirstDayMonday" :tag-parts="getTagParts(require('!!raw-loader!../examples/WeekViewMondayFirstDay.vue').default)" />
      <example-card title="Month View - First Day Monday" name="MonthViewFirstDayMonday" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewMondayFirstDay.vue').default)" />

      <example-title title="5 Day Work Week" />
      <example-card title="Week View - 5 Day Work Week" name="WeekViewFiveDayWorkWeek" :tag-parts="getTagParts(require('!!raw-loader!../examples/WeekViewFiveDayWorkWeek.vue').default)" />
      <example-card title="Month View - 5 Day Work Week" name="MonthViewFiveDayWorkWeek" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewFiveDayWorkWeek.vue').default)" />

      <example-title title="Hide Header" />
      <example-card title="Day View - Hide Header" name="DayViewHideHeader" :tag-parts="getTagParts(require('!!raw-loader!../examples/DayViewHideHeader.vue').default)" />
      <example-card title="Month View - Hide Header" name="MonthViewHideHeader" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewHideHeader.vue').default)" />

      <example-title title="Disabled Days" />
      <example-card title="Week View - Disabled Days" name="WeekViewDisabledDays" :tag-parts="getTagParts(require('!!raw-loader!../examples/WeekViewDisabledDays.vue').default)" />
      <example-card title="Month View - Disabled Days" name="MonthViewDisabledDays" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewDisabledDays.vue').default)" />
      <example-card title="Scheduler View - Disabled Days" name="SchedulerViewDisabledDays" :tag-parts="getTagParts(require('!!raw-loader!../examples/SchedulerViewDisabledDays.vue').default)" />

      <example-title title="Now" />
      <example-card title="Week View - Now" name="WeekViewNow" :tag-parts="getTagParts(require('!!raw-loader!../examples/WeekViewNow.vue').default)">
        <q-markdown>
You can use the `now` property to set a fixed date, otherwise the current date will be used. If the `v-model` property is empty, then it will receive the `now` property's value.
        </q-markdown>
      </example-card>
      <example-card title="Month View - Now" name="MonthViewNow" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewNow.vue').default)" />

      <example-title title="Work Weeks" />
      <example-card title="Month View - Work Weeks" name="MonthViewWorkWeekNumbers" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewWorkWeekNumbers.vue').default)">
        <q-markdown>
`show-work-weeks` is available only for month view.
        </q-markdown>
      </example-card>

      <example-title title="Short Weekday Label" />
      <example-card title="Week View - Short Weekday Label" name="WeekViewShortWeekdayLabel" :tag-parts="getTagParts(require('!!raw-loader!../examples/WeekViewShortWeekdayLabel.vue').default)" />
      <example-card title="Month View - Short Weekday Label" name="MonthViewShortWeekdayLabel" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewShortWeekdayLabel.vue').default)" />

      <example-title title="Short Month Label" />
      <example-card title="Month View - Short Month Label" name="MonthViewShortMonthLabel" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewShortMonthLabel.vue').default)">
        <q-markdown>
`short-month-label` is available only for month view.
        </q-markdown>
      </example-card>

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
The example below is setting the `day-height` to `100`, the default is `0`.
        </q-markdown>
      </example-card>

      <example-title title="Hour24 Format" />
      <example-card title="Week View - Hour24 Format" name="WeekViewHour24Format" :tag-parts="getTagParts(require('!!raw-loader!../examples/WeekViewHour24Format.vue').default)">
        <q-markdown>
`hour24-format` is available only for one of the available `day` or `week` views.
        </q-markdown>
      </example-card>

      <example-title title="Short Interval Label" />
      <example-card title="Week View - Short Interval Label" name="WeekViewShortIntervalLabel" :tag-parts="getTagParts(require('!!raw-loader!../examples/WeekViewShortIntervalLabel.vue').default)">
        <q-markdown>
`short-interval-label` is available only for one of the available `day` or `week` views.
        </q-markdown>
      </example-card>

      <example-card title="Week View - Short Interval Label (Hour24Format)" name="WeekViewShortIntervalLabelHour24Format" :tag-parts="getTagParts(require('!!raw-loader!../examples/WeekViewShortIntervalLabelHour24Format.vue').default)" />

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
      <example-card title="Week View - Prev/Next" name="WeekViewPrevNext" :tag-parts="getTagParts(require('!!raw-loader!../examples/WeekViewPrevNext.vue').default)" />
      <example-card title="Month View - Prev/Next" name="MonthViewPrevNext" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewPrevNext.vue').default)" />
      <example-card title="Scheduler View - Prev/Next" name="SchedulerViewPrevNext" :tag-parts="getTagParts(require('!!raw-loader!../examples/SchedulerViewPrevNext.vue').default)" />

      <example-title title="Swipe Navigation" />
      <example-card title="Day View - Swipe" name="DayViewSwipe" :tag-parts="getTagParts(require('!!raw-loader!../examples/DayViewSwipe.vue').default)">
        <q-markdown>
For swipe support, don't forget to add the `TouchSwipe` directive to your `quasar.conf.js`.
        </q-markdown>
      </example-card>

      <example-card title="Week View - Swipe" name="WeekViewSwipe" :tag-parts="getTagParts(require('!!raw-loader!../examples/WeekViewSwipe.vue').default)" />
      <example-card title="Month View - Swipe" name="MonthViewSwipe" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewSwipe.vue').default)" />

      <example-title title="Column Header" />
      <example-card title="Day View - Column Header" name="DayViewColumnHeader" :tag-parts="getTagParts(require('!!raw-loader!../examples/DayViewColumnHeader.vue').default)">
        <q-markdown>
Column Headers are scoped slots only. They are turned on with the `column-header-before` and `column-header-after` properties. Once each property is set to `true` the respective slot is availale.
Column Headers are only available for the day (includes 2day, 3day, etc), `week` and `scheduler` views.
The `timestamp` information is passed to the scoped slot.
        </q-markdown>
      </example-card>

      <example-card title="Week View - Column Header" name="WeekViewColumnHeader" :tag-parts="getTagParts(require('!!raw-loader!../examples/WeekViewColumnHeader.vue').default)" />

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
  date: '', // YYYY-mm-dd
  time: '', // 00:00:00 (optional)
  year: 0, // YYYY
  month: 0, // mm (Jan = 1, etc)
  day: 0, // day of the month
  weekday: 0, // week day
  hour: 0, // 24-hr
  minute: 0, // mm
  doy: 0, // day of year
  workweek: 0, // workwek number
  hasDay: false, // if this timestamp is supposed to have a date
  hasTime: false, // if this timestamp is supposed to have a time
  past: false, // if timestamp is in the past (based on `now` property)
  current: false, // if timestamp is current date (based on `now` property)
  future: false // if timestamp is in the future (based on `now` property)
}
```
      </q-markdown>
      <example-card title="Day View - Slots" name="DayViewSlots" :tag-parts="getTagParts(require('!!raw-loader!../examples/DayViewSlots.vue').default)" />
      <example-card title="Week View - Slots" name="WeekViewSlots" :tag-parts="getTagParts(require('!!raw-loader!../examples/WeekViewSlots.vue').default)" />
      <example-card title="Month View - Slots" name="MonthViewSlots" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewSlots.vue').default)" />
      <example-card title="Scheduler View - Slots (scheduler-resources-header)" name="SchedulerViewSlotResourcesHeader" :tag-parts="getTagParts(require('!!raw-loader!../examples/SchedulerViewSlotResourcesHeader.vue').default)">
        <q-markdown>
Below, the slot receives an array of `timestamp`s for the days that are being displayed.
        </q-markdown>
      </example-card>

      <example-card title="Scheduler View - Slots (scheduler-day-header)" name="SchedulerViewSlotDayHeader" :tag-parts="getTagParts(require('!!raw-loader!../examples/SchedulerViewSlotDayHeader.vue').default)">
        <q-markdown>
Below, the slot receives the `timestamp` for the day being displayed.
        </q-markdown>
      </example-card>

      <example-card title="Scheduler View - Slots (scheduler-resource-day)" name="SchedulerViewSlotResourceDay" :tag-parts="getTagParts(require('!!raw-loader!../examples/SchedulerViewSlotResourceDay.vue').default)">
        <q-markdown>
Below, the slot receives the `timestamp` for the day being displayed, an index, and the resource.
        </q-markdown>
      </example-card>

      <example-card title="Scheduler View - Slots (scheduler-resource)" name="SchedulerViewSlotResource" :tag-parts="getTagParts(require('!!raw-loader!../examples/SchedulerViewSlotResource.vue').default)">
        <q-markdown>
Below, the slot receives the `resource` to be displayed. In this case, an avatar (or icon) is being displayed along with the resource name.
        </q-markdown>
      </example-card>

      <example-title title="More Slots" />
      <example-card title="Day View (Current Time) - Slot (day-container)" name="DayViewCurrentTime" :tag-parts="getTagParts(require('!!raw-loader!../examples/DayViewCurrentTime.vue').default)">
        <q-markdown>
You can use the scopedSlot `day-container` to set an absolute position for a time tracking bar.
        </q-markdown>
      </example-card>
      <example-card title="Week View (Current Time) - Slot (day-container)" name="WeekViewCurrentTime" :tag-parts="getTagParts(require('!!raw-loader!../examples/WeekViewCurrentTime.vue').default)">
      </example-card>

    </div>
    <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
      <q-btn fab icon="keyboard_arrow_up" color="primary" />
    </q-page-scroller>
  </hero>
</template>

<script>
import Hero from '../components/Hero'
import ExampleTitle from '../components/ExampleTitle'
import ExampleCard from '../components/ExampleCard'
import { slugify } from 'assets/page-utils'
import getTagParts from '@quasar/quasar-app-extension-qmarkdown/src/lib/getTagParts'

export default {
  name: 'Examples',

  components: {
    Hero,
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
    this.addToToc('Week View - Basic', 2)
    this.addToToc('Month View - Basic', 2)
    this.addToToc('Scheduler View - Basic', 2)

    this.addToToc('First Day Monday')
    this.addToToc('Week View - First Day Monday', 2)
    this.addToToc('Month View - First Day Monday', 2)

    this.addToToc('5 Day Work Week')
    this.addToToc('Week View - 5 Day Work Week', 2)
    this.addToToc('Month View - 5 Day Work Week', 2)

    this.addToToc('Hide Header')
    this.addToToc('Day View - Hide Header', 2)
    this.addToToc('Month View - Hide Header', 2)

    this.addToToc('Disabled Days')
    this.addToToc('Week View - Disabled Days', 2)
    this.addToToc('Month View - Disabled Days', 2)
    this.addToToc('Scheduler View - Disabled Days', 2)

    this.addToToc('Now')
    this.addToToc('Week View - Now', 2)
    this.addToToc('Month View - Now', 2)

    this.addToToc('Work Weeks')
    this.addToToc('Month View - Work Weeks', 2)

    this.addToToc('Short Weekday Label')
    this.addToToc('Week View - Short Weekday Label', 2)
    this.addToToc('Month View - Short Weekday Label', 2)

    this.addToToc('Short Month Label')
    this.addToToc('Month View - Short Month Label', 2)

    this.addToToc('Show Day of Year Label')
    this.addToToc('Month View - Show Day of Year Label', 2)

    this.addToToc('Day Height')
    this.addToToc('Month View - Day Height', 2)

    this.addToToc('Hour24 Format')
    this.addToToc('Week View - Hour24 Format', 2)

    this.addToToc('Short Interval Label')
    this.addToToc('Week View - Short Interval Label', 2)
    this.addToToc('Week View - Short Interval Label (Hour24Format)', 2)

    this.addToToc('Interval Modifications')
    this.addToToc('Day View - Interval Height', 2)
    this.addToToc('Day View - Interval Count', 2)
    this.addToToc('Day View - Interval Minutes (30)', 2)
    this.addToToc('Day View - Interval Minutes (15)', 2)
    this.addToToc('Day View - Interval Start', 2)

    this.addToToc('Previous/Next')
    this.addToToc('Day View - Prev/Next', 2)
    this.addToToc('Week View - Prev/Next', 2)
    this.addToToc('Month View - Prev/Next', 2)
    this.addToToc('Scheduler View - Prev/Next', 2)

    this.addToToc('Swipe Navigation')
    this.addToToc('Day View - Swipe', 2)
    this.addToToc('Week View - Swipe', 2)
    this.addToToc('Month View - Swipe', 2)

    this.addToToc('Column Header')
    this.addToToc('Day View - Column Header', 2)
    this.addToToc('Week View - Column Header', 2)

    this.addToToc('Column Count')
    this.addToToc('Day View - Column Count', 2)
    this.addToToc('Day View - Column Header Count', 2)
    this.addToToc('Day View - Column Header Count (Paged)', 2)

    this.addToToc('Working with Slots')
    this.addToToc('Day View - Slots', 2)
    this.addToToc('Week View - Slots', 2)
    this.addToToc('Month View - Slots', 2)
    this.addToToc('Scheduler View - Slots (scheduler-resources-header)', 2)
    this.addToToc('Scheduler View - Slots (scheduler-day-header)', 2)
    this.addToToc('Scheduler View - Slots (scheduler-resource-day)', 2)
    this.addToToc('Scheduler View - Slots (scheduler-resource)', 2)

    this.addToToc('More Slots')
    this.addToToc('Day View (Current Time) - Slot (day-container)', 2)
    this.addToToc('Week View (Current Time) - Slot (day-container)', 2)

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

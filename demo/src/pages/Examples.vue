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

      <example-title title="Now" />
      <p>You can use the <code class="q-markdown--token">now</code> property to set a fixed date, otherwise the current date will be used. If the <code class="q-markdown--token">v-model</code> property is empty, then it will receive the <code class="q-markdown--token">now</code> property's value.</p>
      <example-card title="Week View - Now" name="WeekViewNow" :tag-parts="getTagParts(require('!!raw-loader!../examples/WeekViewNow.vue').default)" />
      <example-card title="Month View - Now" name="MonthViewNow" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewNow.vue').default)" />

      <example-title title="Work Weeks" />
      <p><code class="q-markdown--token">show-work-weeks</code> is available only for month view.</p>
      <example-card title="Month View - Work Weeks" name="MonthViewWorkWeekNumbers" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewWorkWeekNumbers.vue').default)" />

      <example-title title="Short Weekday Label" />
      <example-card title="Week View - Short Weekday Label" name="WeekViewShortWeekdayLabel" :tag-parts="getTagParts(require('!!raw-loader!../examples/WeekViewShortWeekdayLabel.vue').default)" />
      <example-card title="Month View - Short Weekday Label" name="MonthViewShortWeekdayLabel" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewShortWeekdayLabel.vue').default)" />

      <example-title title="Short Month Label" />
      <p><code class="q-markdown--token">short-month-label</code> is available only for month view.</p>
      <example-card title="Month View - Short Month Label" name="MonthViewShortMonthLabel" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewShortMonthLabel.vue').default)" />

      <example-title title="Show Day of Year Label" />
      <p><code class="q-markdown--token">show-day-of-year-label</code> is available only for month view.</p>
      <example-card title="Month View - Show Day of Year Label" name="MonthViewShowDayOfYearLabel" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewShowDayOfYearLabel.vue').default)" />

      <example-title title="Day Height" />
      <p><code class="q-markdown--token">day-height</code> is available only for month view.</p>
      <p>The example below is setting the <code class="q-markdown--token">day-height</code> to <code class="q-markdown--token">100</code>, the default is <code class="q-markdown--token">0</code>.</p>
      <example-card title="Month View - Day Height" name="MonthViewDayHeight" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewDayHeight.vue').default)" />

      <example-title title="Hour24 Format" />
      <p><code class="q-markdown--token">hour24-format</code> is available only for one of the available <code class="q-markdown--token">day</code> or <code class="q-markdown--token">week</code> views.</p>
      <example-card title="Week View - Hour24 Format" name="WeekViewHour24Format" :tag-parts="getTagParts(require('!!raw-loader!../examples/WeekViewHour24Format.vue').default)" />

      <example-title title="Short Interval Label" />
      <p><code class="q-markdown--token">short-interval-label</code> is available only for one of the available day or week views.</p>
      <example-card title="Week View - Short Interval Label" name="WeekViewShortIntervalLabel" :tag-parts="getTagParts(require('!!raw-loader!../examples/WeekViewShortIntervalLabel.vue').default)" />
      <example-card title="Week View - Short Interval Label (Hour24Format)" name="WeekViewShortIntervalLabelHour24Format" :tag-parts="getTagParts(require('!!raw-loader!../examples/WeekViewShortIntervalLabelHour24Format.vue').default)" />

      <example-title title="Interval Modifications" />
      <p><code class="q-markdown--token">interval-height</code> is available only for one of the available <code class="q-markdown--token">day</code> or <code class="q-markdown--token">week</code> views.</p>
      <p>The example below is setting the <code class="q-markdown--token">interval-height</code> to <code class="q-markdown--token">100</code>, the default is <code class="q-markdown--token">40</code>.</p>
      <example-card title="Day View - Interval Height" name="DayViewIntervalHeight" :tag-parts="getTagParts(require('!!raw-loader!../examples/DayViewIntervalHeight.vue').default)" />
      <p>The example below is setting the <code class="q-markdown--token">interval-count</code> to <code class="q-markdown--token">4</code>, the default is <code class="q-markdown--token">24</code>. This is the number of intervals to be displayed.</p>
      <example-card title="Day View - Interval Count" name="DayViewIntervalCount" :tag-parts="getTagParts(require('!!raw-loader!../examples/DayViewIntervalCount.vue').default)" />
      <p>The example below is setting the <code class="q-markdown--token">interval-minutes</code> to <code class="q-markdown--token">30</code>, the default is <code class="q-markdown--token">60</code>. This is the number of minutes in an interval. For this example, if you wanted the full 24 hours, you would also need to set <code class="q-markdown--token">interval-count</code> to <code class="q-markdown--token">48</code> (if you cut interval-minutes in half, then you need to double interval-count)</p>
      <example-card title="Day View - Interval Minutes (30)" name="DayViewIntervalMinutes30" :tag-parts="getTagParts(require('!!raw-loader!../examples/DayViewIntervalMinutes30.vue').default)" />
      <p>The example below is setting the <code class="q-markdown--token">interval-minutes</code> to <code class="q-markdown--token">15</code>, the default is <code class="q-markdown--token">60</code>. This is the number of minutes in an interval. For this example, if you wanted the full 24 hours, you would also need to set <code class="q-markdown--token">interval-count</code> to <code class="q-markdown--token">96</code> (if you cut interval-minutes in quarter, then you need to quadruple interval-count)</p>
      <example-card title="Day View - Interval Minutes (15)" name="DayViewIntervalMinutes15" :tag-parts="getTagParts(require('!!raw-loader!../examples/DayViewIntervalMinutes15.vue').default)" />
      <p>The example below is setting the <code class="q-markdown--token">interval-start</code> to <code class="q-markdown--token">8</code>, the default is <code class="q-markdown--token">0</code>. It is a good idea to also adjust the interval-count so that extra intervals are not displayed. In this case, the <code class="q-markdown--token">interval-count</code> is set to <code class="q-markdown--token">10</code> so the intervals displayed are from 08:00-18:00.</p>
      <example-card title="Day View - Interval Start" name="DayViewIntervalStart" :tag-parts="getTagParts(require('!!raw-loader!../examples/DayViewIntervalStart.vue').default)" />

      <example-title title="Previous/Next" />
      <example-card title="Day View - Prev/Next" name="DayViewPrevNext" :tag-parts="getTagParts(require('!!raw-loader!../examples/DayViewPrevNext.vue').default)" />
      <example-card title="Week View - Prev/Next" name="WeekViewPrevNext" :tag-parts="getTagParts(require('!!raw-loader!../examples/WeekViewPrevNext.vue').default)" />
      <example-card title="Month View - Prev/Next" name="MonthViewPrevNext" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewPrevNext.vue').default)" />
      <example-card title="Scheduler View - Prev/Next" name="SchedulerViewPrevNext" :tag-parts="getTagParts(require('!!raw-loader!../examples/SchedulerViewPrevNext.vue').default)" />

      <example-title title="Swipe Navigation" />
      <p>For swipe support, don't forget to add the <code class="q-markdown--token">TouchSwipe</code> directive to your <code class="q-markdown--token">quasar.conf.js</code>.</p>
      <example-card title="Day View - Swipe" name="DayViewSwipe" :tag-parts="getTagParts(require('!!raw-loader!../examples/DayViewSwipe.vue').default)" />
      <example-card title="Week View - Swipe" name="WeekViewSwipe" :tag-parts="getTagParts(require('!!raw-loader!../examples/WeekViewSwipe.vue').default)" />
      <example-card title="Month View - Swipe" name="MonthViewSwipe" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewSwipe.vue').default)" />

      <example-title title="Column Header" />
      <p>Column Headers are scoped slots only. They are turned on with the <code class="q-markdown--token">column-header-before</code> and <code class="q-markdown--token">column-header-after</code> properties. Once each property is set to <code class="q-markdown--token">true</code> the respective slot is availale.</p>
      <p>Column Headers are only available for the <code class="q-markdown--token">day</code> (includes 2day, 3day, etc), <code class="q-markdown--token">week</code> and <code class="q-markdown--token">scheduler</code> views.</p>
      <p>The <code class="q-markdown--token">day</code> information is passed to the scoped slot.</p>
      <example-card title="Day View - Column Header" name="DayViewColumnHeader" :tag-parts="getTagParts(require('!!raw-loader!../examples/DayViewColumnHeader.vue').default)" />
      <example-card title="Week View - Column Header" name="WeekViewColumnHeader" :tag-parts="getTagParts(require('!!raw-loader!../examples/WeekViewColumnHeader.vue').default)" />

      <example-title title="Column Count" />
      <p>Column Count is only available for <code class="q-markdown--token">day</code> view (no other views), with the property <code class="q-markdown--token">column-count</code>.</p>
      <p>Setting <code class="q-markdown--token">column-count</code> to a value higher than 1 (default) will display the same day in that many columns.</p>
      <example-card title="Day View - Column Count" name="DayViewColumnCount" :tag-parts="getTagParts(require('!!raw-loader!../examples/DayViewColumnCount.vue').default)" />
      <p>If you combine <code class="q-markdown--token">column-header-before</code> or <code class="q-markdown--token">column-header-after</code> you can achieve a schedule.</p>
      <example-card title="Day View - Column Header Count" name="DayViewColumnHeaderCount" :tag-parts="getTagParts(require('!!raw-loader!../examples/DayViewColumnHeaderCount.vue').default)" />
      <p>And finally, if you wanted the ability to page through a large number of resources, you can set the <code class="q-markdown--token">column-index-start</code> to create a paging effect.</p>
      <example-card title="Day View - Column Header Count (Paged)" name="DayViewColumnHeaderCountPaging" :tag-parts="getTagParts(require('!!raw-loader!../examples/DayViewColumnHeaderCountPaging.vue').default)" />

      <example-title title="Working with Slots" />
      <example-card title="Day View - Slots" name="DayViewSlots" :tag-parts="getTagParts(require('!!raw-loader!../examples/DayViewSlots.vue').default)" />
      <example-card title="Week View - Slots" name="WeekViewSlots" :tag-parts="getTagParts(require('!!raw-loader!../examples/WeekViewSlots.vue').default)" />
      <example-card title="Month View - Slots" name="MonthViewSlots" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewSlots.vue').default)" />
      <p>Below, the slot receives an array of timestamps for the days that are being displayed.</p>
      <example-card title="Scheduler View - Slots (scheduler-resources-header)" name="SchedulerViewSlotResourcesHeader" :tag-parts="getTagParts(require('!!raw-loader!../examples/SchedulerViewSlotResourcesHeader.vue').default)" />
      <p>Below, the slot receives the timestamp for the day being displayed.</p>
      <example-card title="Scheduler View - Slots (scheduler-day-header)" name="SchedulerViewSlotDayHeader" :tag-parts="getTagParts(require('!!raw-loader!../examples/SchedulerViewSlotDayHeader.vue').default)" />
      <p>Below, the slot receives the timestamp for the day being displayed, an index, and the resource.</p>
      <example-card title="Scheduler View - Slots (scheduler-resource-day)" name="SchedulerViewSlotResourceDay" :tag-parts="getTagParts(require('!!raw-loader!../examples/SchedulerViewSlotResourceDay.vue').default)" />
      <p>Below, the slot receives the resource to be displayed.</p>
      <example-card title="Scheduler View - Slots (scheduler-resource)" name="SchedulerViewSlotResource" :tag-parts="getTagParts(require('!!raw-loader!../examples/SchedulerViewSlotResource.vue').default)" />

    </div>
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

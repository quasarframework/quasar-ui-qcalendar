<template>
  <hero>
    <div class="q-markdown">
      <example-title title="Basic" />
      <example-card title="Day View - Basic" name="DayViewDefault" />
      <example-card title="Day View - 3Day" name="DayView3Day" />
      <example-card title="Week View - Basic" name="WeekViewDefault" />
      <example-card title="Month View - Basic" name="MonthViewDefault" />

      <example-title title="Hide Header" />
      <example-card title="Day View - Hide Header" name="DayViewHideHeader" />
      <example-card title="Month View - Hide Header" name="MonthViewHideHeader" />

      <example-title title="First Day Monday" />
      <example-card title="Week View - First Day Monday" name="WeekViewFirstDayMonday" />
      <example-card title="Month View - First Day Monday" name="MonthViewFirstDayMonday" />

      <example-title title="5 Day Work Week" />
      <example-card title="Week View - 5 Day Work Week" name="WeekViewFiveDayWorkWeek" />
      <example-card title="Month View - 5 Day Work Week" name="MonthViewFiveDayWorkWeek" />

      <example-title title="Now" />
      <p>If you provide an empty string for the <code class="q-markdown--token">v-model</code> then you can specify the <code class="q-markdown--token">now</code> property which will use the current date.</p>
      <example-card title="Week View - Now" name="WeekViewNow" />
      <example-card title="Month View - Now" name="MonthViewNow" />

      <example-title title="Work Weeks" />
      <p><code class="q-markdown--token">show-work-weeks</code> is available only for month view.</p>
      <example-card title="Month View - Work Weeks" name="MonthViewWorkWeeks" />

      <example-title title="Short Weekday Label" />
      <example-card title="Week View - Short Weekday Label" name="WeekViewShortWeekdayLabel" />
      <example-card title="Month View - Short Weekday Label" name="MonthViewShortWeekdayLabel" />

      <example-title title="Short Month Label" />
      <p><code class="q-markdown--token">short-month-label</code> is available only for month view.</p>
      <example-card title="Month View - Short Month Label" name="MonthViewShortMonthLabel" />

      <example-title title="Show Day of Year Label" />
      <p><code class="q-markdown--token">show-day-of-year-label</code> is available only for month view.</p>
      <example-card title="Month View - Show Day of Year Label" name="MonthViewShowDayOfYearLabel" />

      <example-title title="Day Height" />
      <p><code class="q-markdown--token">day-height</code> is available only for month view.</p>
      <p>The example below is setting the <code class="q-markdown--token">day-height</code> to <code class="q-markdown--token">100</code>, the default is <code class="q-markdown--token">0</code>.</p>
      <example-card title="Month View - Day Height" name="MonthViewDayHeight" />

      <example-title title="Hour24 Format" />
      <p><code class="q-markdown--token">hour24-format</code> is available only for one of the available day or week views.</p>
      <example-card title="Week View - Hour24 Format" name="WeekViewHour24Format" />

      <example-title title="Short Interval Label" />
      <p><code class="q-markdown--token">short-interval-label</code> is available only for one of the available day or week views.</p>
      <example-card title="Week View - Short Interval Label" name="WeekViewShortIntervalLabel" />
      <example-card title="Week View - Short Interval Label (Hour24Format)" name="WeekViewShortIntervalLabelHour24Format" />

      <example-title title="Interval Modifications" />
      <p><code class="q-markdown--token">interval-height</code> is available only for one of the available day or week views.</p>
      <p>The example below is setting the <code class="q-markdown--token">interval-height</code> to <code class="q-markdown--token">100</code>, the default is <code class="q-markdown--token">40</code>.</p>
      <example-card title="Day View - Interval Height" name="DayViewIntervalHeight" />
      <p>The example below is setting the <code class="q-markdown--token">interval-count</code> to <code class="q-markdown--token">4</code>, the default is <code class="q-markdown--token">24</code>. This is the number of intervals to be displayed.</p>
      <example-card title="Day View - Interval Count" name="DayViewIntervalCount" />
      <p>The example below is setting the <code class="q-markdown--token">interval-minutes</code> to <code class="q-markdown--token">30</code>, the default is <code class="q-markdown--token">60</code>. This is the number of minutes in an interval. For this example, if you wanted the full 24 hours, you would also need to set <code class="q-markdown--token">interval-count</code> to <code class="q-markdown--token">48</code> (if you cut interval-minutes in half, then you need to double interval-count)</p>
      <example-card title="Day View - Interval Minutes (30)" name="DayViewIntervalMinutes30" />
      <p>The example below is setting the <code class="q-markdown--token">interval-minutes</code> to <code class="q-markdown--token">15</code>, the default is <code class="q-markdown--token">60</code>. This is the number of minutes in an interval. For this example, if you wanted the full 24 hours, you would also need to set <code class="q-markdown--token">interval-count</code> to <code class="q-markdown--token">96</code> (if you cut interval-minutes in quarter, then you need to quadruple interval-count)</p>
      <example-card title="Day View - Interval Minutes (15)" name="DayViewIntervalMinutes15" />
      <p>The example below is setting the <code class="q-markdown--token">interval-start</code> to <code class="q-markdown--token">8</code>, the default is <code class="q-markdown--token">0</code>. It is a good idea to also adjust the interval-count so that extra intervals are not displayed. In this case, the <code class="q-markdown--token">interval-count</code> is set to <code class="q-markdown--token">10</code> so the intervals displayed are from 08:00-18:00.</p>
      <example-card title="Day View - Interval Start" name="DayViewIntervalStart" />

      <example-title title="Swipe Navigation" />
      <p>For swipe support, don't forget to add the <code class="q-markdown--token">TouchSwipe</code> directive to your <code class="q-markdown--token">quasar.conf.js</code>.</p>
      <example-card title="Day View - Swipe" name="DayViewSwipe" />
      <example-card title="Week View - Swipe" name="WeekViewSwipe" />
      <example-card title="Month View - Swipe" name="MonthViewSwipe" />

      <example-title title="Column Header" />
      <p>Column Headers are scoped slots only. They are turned on with the <code class="q-markdown--token">column-header-before</code> and <code class="q-markdown--token">column-header-after</code> properties. Once each property is set to <code class="q-markdown--token">true</code> the respective slot is availale.</p>
      <p>Column Headers are only available for the <code class="q-markdown--token">day</code> (includes 2day, 3day, etc) and <code class="q-markdown--token">week</code> views.</p>
      <p>The <code class="q-markdown--token">day</code> information is passed to the scoped slot.</p>
      <example-card title="Day View - Column Header" name="DayViewColumnHeader" />
      <example-card title="Week View - Column Header" name="WeekViewColumnHeader" />

      <example-title title="Column Count" />
      <p>Column Count is only available for <code class="q-markdown--token">day</code> view (no other views), with the property <code class="q-markdown--token">column-count</code>.</p>
      <p>Setting <code class="q-markdown--token">column-count</code> to a value higher than 1 (default) will display the same day in that many columns.</p>
      <example-card title="Day View - Column Count" name="DayViewColumnCount" />
      <p>If you combine <code class="q-markdown--token">column-header-before</code> or <code class="q-markdown--token">column-header-after</code> you can achieve a schedule.</p>
      <example-card title="Day View - Column Header Count" name="DayViewColumnHeaderCount" />
      <p>And finally, if you wanted the ability to page through a large number of resources, you can set the <code class="q-markdown--token">column-index-start</code> to create a paging effect.</p>
      <example-card title="Day View - Column Header Count (Paged)" name="DayViewColumnHeaderCountPaging" />
    </div>
  </hero>
</template>

<script>
import Hero from '../components/Hero'
import ExampleTitle from '../components/ExampleTitle'
import ExampleCard from '../components/ExampleCard'
import { slugify } from 'assets/page-utils'

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

    this.addToToc('Hide Header')
    this.addToToc('Day View - Hide Header', 2)
    this.addToToc('Month View - Hide Header', 2)

    this.addToToc('First Day Monday')
    this.addToToc('Week View - First Day Monday', 2)
    this.addToToc('Month View - First Day Monday', 2)

    this.addToToc('5 Day Work Week')
    this.addToToc('Week View - 5 Day Work Week', 2)
    this.addToToc('Month View - 5 Day Work Week', 2)

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

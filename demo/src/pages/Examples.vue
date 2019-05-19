<template>
  <hero>
    <div id="Basic" class="text-h4">Basic</div>
    <example-card title="Day View - Basic" name="DayViewDefault" />
    <example-card title="Day View - 3Day" name="DayView3Day" />
    <example-card title="Week View - Basic" name="WeekViewDefault" />
    <example-card title="Month View - Basic" name="MonthViewDefault" />

    <div id="First-Day-Monday" class="text-h4">First Day Monday</div>
    <example-card title="Week View - First Day Monday" name="WeekViewFirstDayMonday" />
    <example-card title="Month View - First Day Monday" name="MonthViewFirstDayMonday" />

    <div id="5-Day-Work-Week" class="text-h4">5 Day Work Week</div>
    <example-card title="Week View - 5 Day Work Week" name="WeekViewFiveDayWorkWeek" />
    <example-card title="Month View - 5 Day Work Week" name="MonthViewFiveDayWorkWeek" />

    <div id="Work-Weeks" class="text-h4">Work Weeks</div>
    <p><code class="q-markdown--token">workweeks</code> is available only for month view.</p>
    <example-card title="Month View - Work Weeks" name="MonthViewWorkWeeks" />

    <div id="Short-Weekday-Label" class="text-h4">Short Weekday Label</div>
    <example-card title="Week View - Short Weekday Label" name="WeekViewShortWeekdayLabel" />
    <example-card title="Month View - Short Weekday Label" name="MonthViewShortWeekdayLabel" />

    <div id="Short-Month-Label" class="text-h4">Short Month Label</div>
    <p><code class="q-markdown--token">short-month-label</code> is available only for month view.</p>
    <example-card title="Month View - Short Month Label" name="MonthViewShortMonthLabel" />

    <div id="Show-Day-of-Year-Label" class="text-h4">Show Day of Year Label</div>
    <p><code class="q-markdown--token">show-day-of-year-label</code> is available only for month view.</p>
    <example-card title="Month View - Show Day of Year Label" name="MonthViewShowDayOfYearLabel" />

    <div id="Hour24-Format" class="text-h4">Hour24 Format</div>
    <p><code class="q-markdown--token">hour24-format</code> is available only for one of the available day or week views.</p>

    <example-card title="Week View - Hour24 Format" name="WeekViewHour24Format" />
    <div id="Short-Interval-Label" class="text-h4">Short Interval Label</div>

    <p><code class="q-markdown--token">short-interval-label</code> is available only for one of the available day or week views.</p>
    <example-card title="Week View - Short Interval Label" name="WeekViewShortIntervalLabel" />
    <example-card title="Week View - Short Interval Label (Hour24Format)" name="WeekViewShortIntervalLabelHour24Format" />

    <div id="Interval-Modifications" class="text-h4">Interval Modifications</div>
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
  </hero>
</template>

<script>
import Hero from '../components/Hero'
import ExampleCard from '../components/ExampleCard'

export default {
  name: 'Examples',

  components: {
    Hero,
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

    this.addToToc('First Day Monday')
    this.addToToc('Week View - First Day Monday', 2)
    this.addToToc('Month View - First Day Monday', 2)

    this.addToToc('5 Day Work Week')
    this.addToToc('Week View - 5 Day Work Week', 2)
    this.addToToc('Month View - 5 Day Work Week', 2)

    this.addToToc('Work Weeks')
    this.addToToc('Month View - Work Weeks', 2)

    this.addToToc('Short Weekday Label')
    this.addToToc('Week View - Short Weekday Label', 2)
    this.addToToc('Month View - Short Weekday Label', 2)

    this.addToToc('Short Month Label')
    this.addToToc('Month View - Short Month Label', 2)

    this.addToToc('Show Day of Year Label')
    this.addToToc('Month View - Show Day of Year Label', 2)

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
      const slug = this.slugify(name)
      this.tempToc.push({
        children: [],
        id: slug,
        label: name,
        level: level
      })
    },

    slugify (str) {
      return encodeURIComponent(String(str).trim().replace(/\s+/g, '-'))
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

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
    <example-card title="Month View - Work Weeks" name="MonthViewWorkWeeks" />
    <div id="Short-Weekday-Label" class="text-h4">Short Weekday Label</div>
    <example-card title="Week View - Short Weekday Label" name="WeekViewShortWeekdayLabel" />
    <example-card title="Month View - Short Weekday Label" name="MonthViewShortWeekdayLabel" />
    <div id="Short-Month-Label" class="text-h4">Short Month Label</div>
    <example-card title="Month View - Short Month Label" name="MonthViewShortMonthLabel" />
    <div id="Hour24-Format" class="text-h4">Hour24 Format</div>
    <example-card title="Week View - Hour24 Format" name="WeekViewHour24Format" />
    <div id="Short-Interval-Label" class="text-h4">Short Interval Label</div>
    <example-card title="Week View - Short Interval Label" name="WeekViewShortIntervalLabel" />
    <example-card title="Week View - Short Interval Label (Hour24Format)" name="WeekViewShortIntervalLabelHour24Format" />
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
    this.addToToc('Hour24 Format')
    this.addToToc('Week View - Hour24 Format', 2)
    this.addToToc('Short Interval Label')
    this.addToToc('Week View - Short Interval Label', 2)
    this.addToToc('Week View - Short Interval Label (Hour24Format)', 2)

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

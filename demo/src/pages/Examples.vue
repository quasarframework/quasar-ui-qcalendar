<template>
  <q-page class="example-page">
    <example-card title="Day View - Basic" name="DayViewDefault" />
    <example-card title="Day View - 3Day" name="DayView3Day" />
    <example-card title="Week View - Basic" name="WeekViewDefault" />
    <example-card title="Month View - Basic" name="MonthViewDefault" />
    <example-card title="Week View - First Day Monday" name="WeekViewFirstDayMonday" />
    <example-card title="Month View - First Day Monday" name="MonthViewFirstDayMonday" />
    <example-card title="Week View - 5 Day Work Week" name="WeekViewFiveDayWorkWeek" />
    <example-card title="Month View - 5 Day Work Week" name="MonthViewFiveDayWorkWeek" />
  </q-page>
</template>

<script>
import ExampleCard from '../components/ExampleCard'

export default {
  name: 'Examples',

  components: {
    ExampleCard
  },

  data () {
    return {
    }
  },

  mounted () {
    this.toc = []
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

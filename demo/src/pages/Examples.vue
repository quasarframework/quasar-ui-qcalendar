<template>
  <div>
    <section class="page-header">
      <h1 class="project-name">QCalendar</h1>
      <h2 class="project-tagline"></h2>
      <q-btn type="a" href="https://github.com/quasarframework/app-extension-qcalendar" target="_blank" class="btn" label="View on GitHub" no-caps flat/>
      <q-btn to="/demo" class="btn" label="Demo" no-caps flat/>
      <q-btn to="/examples" class="btn" label="Examples" no-caps flat/>
    </section>
    <main class="flex flex-start justify-center inset-shadow">
      <div class="q-pa-md col-12-sm col-8-md col-6-lg inset-shadow" style="width: 100%; height: 3px;" />
      <div class="q-pa-md col-12-sm col-8-md col-6-lg bg-white shadow-1" style="max-width: 800px; width: 100%;">
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
      </div>
    </main>
  </div>
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

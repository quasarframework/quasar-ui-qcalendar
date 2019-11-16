<template>
  <hero>
    <div class="q-markdown">

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

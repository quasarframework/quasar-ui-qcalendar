<template>
  <div class="q-markdown">
    <example-title title="Agenda View" />
    <q-markdown>
The `agenda` views by themselves are rather boring. It's up to the developer to fill the content via the `day-body` slot (more about this below).
    </q-markdown>
    <example-card title="Basic" name="AgendaViewBasic" :tag-parts="getTagParts(require('!!raw-loader!../examples/AgendaViewBasic.vue').default)" />
    <example-card title="Agenda View (week) - Basic" name="AgendaViewWeekBasic" :tag-parts="getTagParts(require('!!raw-loader!../examples/AgendaViewWeekBasic.vue').default)" />

    <example-card title="Slots" name="AgendaViewWeekSlots" :tag-parts="getTagParts(require('!!raw-loader!../examples/AgendaViewWeekSlots.vue').default)" >
      <q-markdown>
We are going to jump right into slot usage so that for the rest of the examples we have content that can be displayed.

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
    </example-card>

    <example-card title="First Day Monday" name="AgendaViewWeekFirstDayMonday" :tag-parts="getTagParts(require('!!raw-loader!../examples/AgendaViewWeekFirstDayMonday.vue').default)" />
    <example-card title="Five Day Workweek" name="AgendaViewWeekFiveDayWorkweek" :tag-parts="getTagParts(require('!!raw-loader!../examples/AgendaViewWeekFiveDayWorkweek.vue').default)" />
    <example-card title="Theme" name="AgendaViewWeekTheme" :tag-parts="getTagParts(require('!!raw-loader!../examples/AgendaViewWeekTheme.vue').default)" />
  </div>
</template>

<script>
import ExampleTitle from '../components/ExampleTitle'
import ExampleCard from '../components/ExampleCard'
import { slugify } from 'assets/page-utils'
import { getTagParts } from '@quasar/quasar-ui-qmarkdown'

export default {
  name: 'AgendaView',

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
    this.addToToc('Agenda View')
    this.addToToc('Basic', 2)
    this.addToToc('Agenda View (week) - Basic', 2)
    this.addToToc('Slots', 2)
    this.addToToc('First Day Monday', 2)
    this.addToToc('Five Day Workweek', 2)
    this.addToToc('Theme', 2)

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

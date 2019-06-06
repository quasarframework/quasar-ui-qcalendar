<template>
  <section :id="slugifiedTitle" class="q-pa-md">
    <q-card flat bordered class="no-shadow">
      <q-toolbar>
        <q-ribbon
          position="left"
          color="rgba(0,0,0,.58)"
          background-color="#c0c0c0"
          leaf-color="#a0a0a0"
          leaf-position="bottom"
          decoration="rounded-out"
          class="fit"
        >
          <q-toolbar-title
          class="example-title"
          style="padding: 5px 20px;"
          @click="copyHeading(slugifiedTitle)">{{ title }}</q-toolbar-title>
        </q-ribbon>
      </q-toolbar>
      <q-separator />
      <component v-bind:is="name" />
    </q-card>
  </section>
</template>

<script>
import { copyHeading, slugify } from 'assets/page-utils'

export default {
  name: 'ExampleCard',

  components: {
    DayViewDefault: () => import('./examples/dayview/Default'),
    DayView3Day: () => import('./examples/dayview/Day3view'),
    WeekViewDefault: () => import('./examples/weekview/Default'),
    MonthViewDefault: () => import('./examples/monthview/Default'),
    WeekViewFirstDayMonday: () => import('./examples/weekview/MondayFirstDay'),
    MonthViewFirstDayMonday: () => import('./examples/monthview/MondayFirstDay'),
    WeekViewFiveDayWorkWeek: () => import('./examples/weekview/FiveDayWorkWeek'),
    MonthViewFiveDayWorkWeek: () => import('./examples/monthview/FiveDayWorkWeek'),
    WeekViewNow: () => import('./examples/weekview/Now'),
    MonthViewNow: () => import('./examples/monthview/Now'),
    MonthViewWorkWeeks: () => import('./examples/monthview/WorkWeekNumbers'),
    WeekViewShortWeekdayLabel: () => import('./examples/weekview/ShortWeekdayLabel'),
    MonthViewShortWeekdayLabel: () => import('./examples/monthview/ShortWeekdayLabel'),
    MonthViewShortMonthLabel: () => import('./examples/monthview/ShortMonthLabel'),
    MonthViewShowDayOfYearLabel: () => import('./examples/monthview/ShowDayOfYearLabel'),
    MonthViewDayHeight: () => import('./examples/monthview/DayHeight'),
    WeekViewHour24Format: () => import('./examples/weekview/Hour24Format'),
    WeekViewShortIntervalLabel: () => import('./examples/weekview/ShortIntervalLabel'),
    WeekViewShortIntervalLabelHour24Format: () => import('./examples/weekview/ShortIntervalLabelHour24Format'),
    DayViewIntervalHeight: () => import('./examples/dayview/IntervalHeight'),
    DayViewIntervalCount: () => import('./examples/dayview/IntervalCount'),
    DayViewIntervalMinutes30: () => import('./examples/dayview/IntervalMinutes30'),
    DayViewIntervalMinutes15: () => import('./examples/dayview/IntervalMinutes15'),
    DayViewIntervalStart: () => import('./examples/dayview/IntervalStart'),
    DayViewHideHeader: () => import('./examples/dayview/HideHeader'),
    MonthViewHideHeader: () => import('./examples/monthview/HideHeader'),
    DayViewColumnHeader: () => import('./examples/dayview/ColumnHeader'),
    WeekViewColumnHeader: () => import('./examples/weekview/ColumnHeader'),
    DayViewColumnCount: () => import('./examples/dayview/ColumnCount'),
    DayViewColumnHeaderCount: () => import('./examples/dayview/ColumnHeaderCount'),
    DayViewColumnHeaderCountPaging: () => import('./examples/dayview/ColumnHeaderCountPaging')
  },

  props: {
    title: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },

  computed: {
    slugifiedTitle () {
      return slugify(this.title)
    }
  },

  methods: {
    copyHeading
  }
}
</script>

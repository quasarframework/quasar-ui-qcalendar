<template>
  <section :id="slugifiedTitle" class="q-pa-md overflow-auto">
    <q-card flat bordered class="no-shadow">
      <q-toolbar>
        <q-ribbon
          position="left"
          color="rgba(0,0,0,.58)"
          background-color="#c0c0c0"
          leaf-color="#a0a0a0"
          leaf-position="bottom"
          decoration="rounded-out"
        >
          <q-toolbar-title
          class="example-title"
          style="padding: 5px 20px;"
          @click="copyHeading(slugifiedTitle)"><span class="ellipsis">{{ title }}</span></q-toolbar-title>
        </q-ribbon>
      </q-toolbar>
      <q-separator />
    <q-expansion-item
      group="someGroup"
      caption="Code"
    >
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="left"
          narrow-indicator
        >
          <q-tab name="template" v-if="parts.template" label="Template" />
          <q-tab name="script" v-if="parts.script" label="Script" />
          <q-tab name="style" v-if="parts.style" label="Style" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel v-if="parts.template" name="template">
            <q-markdown :src="parts.template" />
          </q-tab-panel>

          <q-tab-panel v-if="parts.script" name="script">
            <q-markdown :src="parts.script" />
          </q-tab-panel>

          <q-tab-panel v-if="parts.style" name="style">
            <q-markdown :src="parts.style" />
          </q-tab-panel>

        </q-tab-panels>
      </q-card>
    </q-expansion-item>
    <q-separator />

    <component v-bind:is="name" style="overflow: hidden;" />

    </q-card>
  </section>
</template>

<script>
import { copyHeading, slugify } from 'assets/page-utils'

export default {
  name: 'ExampleCard',

  components: {
    DayViewBasic: () => import('../examples/DayViewBasic'),
    DayView3Day: () => import('../examples/DayView3day'),
    WeekViewBasic: () => import('../examples/WeekViewBasic'),
    MonthViewBasic: () => import('../examples/MonthViewBasic'),
    SchedulerViewBasic: () => import('../examples/SchedulerViewBasic'),

    WeekViewFirstDayMonday: () => import('../examples/WeekViewMondayFirstDay'),
    MonthViewFirstDayMonday: () => import('../examples/MonthViewMondayFirstDay'),

    WeekViewFiveDayWorkWeek: () => import('../examples/WeekViewFiveDayWorkWeek'),
    MonthViewFiveDayWorkWeek: () => import('../examples/MonthViewFiveDayWorkWeek'),

    DayViewHideHeader: () => import('../examples/DayViewHideHeader'),
    MonthViewHideHeader: () => import('../examples/MonthViewHideHeader'),

    WeekViewNow: () => import('../examples/WeekViewNow'),
    MonthViewNow: () => import('../examples/MonthViewNow'),

    MonthViewWorkWeekNumbers: () => import('../examples/MonthViewWorkWeekNumbers'),

    WeekViewShortWeekdayLabel: () => import('../examples/WeekViewShortWeekdayLabel'),
    MonthViewShortWeekdayLabel: () => import('../examples/MonthViewShortWeekdayLabel'),

    MonthViewShortMonthLabel: () => import('../examples/MonthViewShortMonthLabel'),

    MonthViewShowDayOfYearLabel: () => import('../examples/MonthViewShowDayOfYearLabel'),

    MonthViewDayHeight: () => import('../examples/MonthViewDayHeight'),

    WeekViewHour24Format: () => import('../examples/WeekViewHour24Format'),

    WeekViewShortIntervalLabel: () => import('../examples/WeekViewShortIntervalLabel'),
    WeekViewShortIntervalLabelHour24Format: () => import('../examples/WeekViewShortIntervalLabelHour24Format'),

    DayViewIntervalHeight: () => import('../examples/DayViewIntervalHeight'),
    DayViewIntervalCount: () => import('../examples/DayViewIntervalCount'),
    DayViewIntervalMinutes30: () => import('../examples/DayViewIntervalMinutes30'),
    DayViewIntervalMinutes15: () => import('../examples/DayViewIntervalMinutes15'),
    DayViewIntervalStart: () => import('../examples/DayViewIntervalStart'),

    DayViewPrevNext: () => import('../examples/DayViewPrevNext'),
    WeekViewPrevNext: () => import('../examples/WeekViewPrevNext'),
    MonthViewPrevNext: () => import('../examples/MonthViewPrevNext'),
    SchedulerViewPrevNext: () => import('../examples/SchedulerViewPrevNext'),

    DayViewSwipe: () => import('../examples/DayViewSwipe'),
    WeekViewSwipe: () => import('../examples/WeekViewSwipe'),
    MonthViewSwipe: () => import('../examples/MonthViewSwipe'),

    DayViewColumnHeader: () => import('../examples/DayViewColumnHeader'),
    WeekViewColumnHeader: () => import('../examples/WeekViewColumnHeader'),
    DayViewColumnCount: () => import('../examples/DayViewColumnCount'),
    DayViewColumnHeaderCount: () => import('../examples/DayViewColumnHeaderCount'),
    DayViewColumnHeaderCountPaging: () => import('../examples/DayViewColumnHeaderCountPaging'),

    DayViewSlots: () => import('../examples/DayViewSlots'),
    WeekViewSlots: () => import('../examples/WeekViewSlots'),
    MonthViewSlots: () => import('../examples/MonthViewSlots'),
    SchedulerViewSlotResourcesHeader: () => import('../examples/SchedulerViewSlotResourcesHeader'),
    SchedulerViewSlotDayHeader: () => import('../examples/SchedulerViewSlotDayHeader'),
    SchedulerViewSlotResourceDay: () => import('../examples/SchedulerViewSlotResourceDay'),
    SchedulerViewSlotResource: () => import('../examples/SchedulerViewSlotResource')
  },

  props: {
    title: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    tagParts: {
      type: Object,
      default: () => {}
    }
  },

  data () {
    return {
      tab: 'template',
      parts: {}
    }
  },

  mounted () {
    this.updateParts()
  },

  computed: {
    slugifiedTitle () {
      return slugify(this.title)
    }
  },

  methods: {
    copyHeading,
    updateParts () {
      this.parts = {}
      for (let property in this.tagParts) {
        if (this.tagParts[property] !== '') {
          this.parts[property] = '```\n' + this.tagParts[property] + '\n```'
        }
      }
    }
  }
}
</script>

<style>
</style>

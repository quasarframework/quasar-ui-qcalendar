<template>
  <div class="q-pa-md">
    <q-card flat bordered class="no-shadow">
      <q-toolbar>
        <q-toolbar-title class="example-title">{{ title }}</q-toolbar-title>
      </q-toolbar>
      <q-separator />
      <component v-bind:is="name" />
    </q-card>
  </div>
</template>

<script>
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
    MonthViewFiveDayWorkWeek: () => import('./examples/monthview/FiveDayWorkWeek')
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
  }
}
</script>

<style lang="stylus">

.example-title
  color rgba(0, 0, 0, 0.45)

</style>

<template>
  <div style="max-width: 800px; width: 100%;">
    <q-calendar
      id="calendar"
      v-model="selectedDate"
      view="month"
      locale="en-us"
      class="calendar"
      :style="styles"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectedDate: ''
    }
  },
  computed: {
    styles () {
      return {
        // we need to set this to transparent so the style below is seen
        // '--calendar-active-date-background': 'transparent'
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.calendar ::v-deep .q-calendar-weekly__day .q-btn
  border-radius: 8px

.calendar ::v-deep .q-current-day .q-btn
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.12), 0 2px 4px 0 rgba(0,0,0,0.08)

.calendar ::v-deep .q-current-day .q-btn .q-btn__wrapper
  color: #027BE3

.calendar ::v-deep .q-current-day .q-btn .q-btn__wrapper:before
  background: #cce7ff

.calendar ::v-deep .q-active-date .q-btn
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.12), 0 2px 4px 0 rgba(0,0,0,0.08)

.calendar ::v-deep .q-active-date .q-btn .q-btn__wrapper
  color: #027BE3

.calendar ::v-deep .q-active-date .q-btn .q-btn__wrapper:before
  background: #cce7ff

</style>

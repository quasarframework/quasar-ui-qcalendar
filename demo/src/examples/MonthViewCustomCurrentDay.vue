<template>
  <div style="max-width: 800px; width: 100%;">
    <q-calendar
      v-model="selectedDate"
      view="month"
      locale="en-us"
      class="calendar"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectedDate: ''
    }
  }
}
</script>

<style lang="sass" scoped>
.calendar :deep .q-calendar-weekly__day .q-btn
  border-radius: 8px

.calendar :deep .q-current-day .q-btn
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.12), 0 2px 4px 0 rgba(0,0,0,0.08)

.calendar :deep .q-current-day .q-btn .q-btn__wrapper
  color: #027BE3

.calendar :deep .q-current-day .q-btn .q-btn__wrapper:before
  background: #cce7ff

.calendar :deep .q-active-date .q-btn
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.12), 0 2px 4px 0 rgba(0,0,0,0.08)

.calendar :deep .q-active-date .q-btn .q-btn__wrapper
  color: #027BE3

.calendar :deep .q-active-date .q-btn .q-btn__wrapper:before
  background: #cce7ff
</style>

<template>
  <div style="max-width: 800px; width: 100%; overflow: auto; ">
    <q-calendar
      v-model="selectedDate"
      view="month"
      :disabled-days="disabledDays"
      :day-style="modifiedStyle"
      locale="en-us"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectedDate: '2019-04-01',
      disabledDays: [
        '2019-04-02',
        '2019-04-03',
        '2019-04-04',
        '2019-04-05',
        ['2019-04-22', '2019-04-27'] // date range
      ]
    }
  },
  methods: {
    modifiedStyle (scope) {
      if (scope.disabled === true) {
        return {
          '--calendar-outside-label-background': 'auto',
          '--calendar-current-label-background': 'auto',
          '--calendar-outside-label-background-dark': 'auto',
          '--calendar-current-label-background-dark': 'auto',
          '--calendar-border-color-dark': (this.$q.dark.isActive ? 'black' : '#ffcb9c') + ' !important',
          cursor: 'not-allowed'
        }
      }
      return {}
    }
  }
}
</script>

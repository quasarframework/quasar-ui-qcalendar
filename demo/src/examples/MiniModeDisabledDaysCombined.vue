<template>
  <div class="row justify-center q-pa-md q-gutter-sm" style="max-width: 800px; width: 100%;">
    <q-calendar
      ref="calendar"
      v-model="selectedDate"
      view="month"
      bordered
      :disabled-days="disabledDays"
      mini-mode
      :day-style="modifiedStyle"
      locale="en-us"
      style="max-width: 300px; min-width: auto; overflow: hidden"
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
        ['2019-04-22', '2019-04-25'] // date range
      ]
    }
  },
  methods: {
    modifiedStyle (scope) {
      if (scope.disabled === true) {
        return {
          cursor: 'not-allowed'
        }
      }
      return {}
    }
  }
}
</script>

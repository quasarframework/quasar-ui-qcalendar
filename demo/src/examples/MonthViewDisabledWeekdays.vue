<template>
  <div style="max-width: 800px; width: 100%; overflow: auto; ">
    <q-calendar
      v-model="selectedDate"
      view="month"
      :disabled-weekdays="[1,5,6]"
      :day-style="modifiedStyle"
      locale="en-us"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectedDate: '2019-04-01'
    }
  },
  methods: {
    modifiedStyle (scope) {
      if (scope.disabled === true) {
        return {
          backgroundColor: '#ffcb9c!important',
          cursor: 'not-allowed'
        }
      }
      return {}
    }
  }
}
</script>

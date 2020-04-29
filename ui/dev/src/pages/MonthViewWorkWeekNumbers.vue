<template>
  <q-calendar
    v-model="selectedDate"
    show-work-weeks
    view="month"
    locale="en-us"
    @click:workweek="onClickWorkweek"
    style="height: 400px;"
  />
</template>

<script>
export default {
  data () {
    return {
      selectedDate: '2019-04-01'
    }
  },

  methods: {
    onClickWorkweek (data) {
      console.log(data)
    }
  }
}
</script>

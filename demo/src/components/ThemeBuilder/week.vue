<template>
  <div>
    <q-calendar
      v-model="selectedDate"
      view="week"
      bordered
      :interval-minutes="15"
      :interval-count="96"
      :disabled-weekdays="[0,6]"
      :interval-style="modifiedStyle"
      locale="en-us"
      style="height: 400px;"
      :style="styles"
    />
  </div>
</template>

<script>
export default {
  name: 'ThemeBuilderWeek',
  props: {
    value: String,
    styles: Object
  },
  data () {
    return {
      selectedDate: ''
    }
  },
  beforeMount () {
    this.selectedDate = this.value
  },
  watch: {
    value (val) {
      this.selectedDate = val
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

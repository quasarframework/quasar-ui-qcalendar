<template>
  <div>
    <q-calendar
      v-model="selectedDate"
      view="day"
      locale="en-us"
      bordered
      :interval-minutes="15"
      :interval-count="96"
      style="height: 400px;"
      :style="styles"
    />

  </div>
</template>

<script>
export default {
  name: 'ThemeBuilderDay',
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
  }
}
</script>

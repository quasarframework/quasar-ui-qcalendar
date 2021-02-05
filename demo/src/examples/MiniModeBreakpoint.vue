<template>
  <div
    class="row justify-center"
    style="max-width: 800px; width: 100%;"
  >
    <q-calendar
      ref="calendar"
      v-model="selectedDate"
      view="month"
      locale="en-us"
      mini-mode="auto"
      breakpoint="sm"
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

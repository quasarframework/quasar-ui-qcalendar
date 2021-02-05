<template>
  <div
    class="row justify-center q-pa-md"
    style="max-width: 800px; width: 100%;background: #121212;"
  >
    <q-calendar
      ref="calendar"
      v-model="selectedDate"
      view="month"
      locale="en-us"
      mini-mode
      dark
      style="max-width: 300px; min-width: auto; overflow: hidden"
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

<template>
  <div
    class="row justify-center q-pa-md"
    style="max-width: 800px; width: 100%;"
  >
    <q-calendar
      v-model="selectedDate"
      mini-mode
      hide-outside-days
      view="month"
      locale="en-us"
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

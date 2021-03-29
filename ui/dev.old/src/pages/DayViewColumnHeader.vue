<template>
  <div style="max-width: 800px; width: 100%;">
    <q-calendar
      v-model="selectedDate"
      :column-header-before="true"
      :column-header-after="true"
      view="day"
      locale="en-us"
      style="height: 400px;"
    >
      <template #column-header-before="{ /* timestamp, index */ }">
        <div class="q-ma-xs">
          column-header-before slot
        </div>
      </template>
      <template #column-header-after="{ /* timestamp, index */ }">
        <div class="q-ma-xs">
          column-header-after slot
        </div>
      </template>
    </q-calendar>
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

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
      <!-- eslint-disable vue/no-unused-vars -->
      <template #column-header-before="days">
        <div class="q-ma-xs">
          column-header-before slot
        </div>
      </template>
      <template #column-header-after="days">
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

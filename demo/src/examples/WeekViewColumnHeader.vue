<template>
  <q-calendar
    v-model="selectedDate"
    :column-header-before="true"
    :column-header-after="true"
    view="week"
    locale="en-us"
    style="height: 400px;"
  >
    <template #column-header-before="days">
      <div class="q-ma-xs">
        Before
      </div>
    </template>
    <template #column-header-after="days">
      <div class="q-ma-xs">
        After
      </div>
    </template>
  </q-calendar>
</template>

<script>
export default {
  data () {
    return {
      selectedDate: '2019-04-01'
    }
  }
}
</script>

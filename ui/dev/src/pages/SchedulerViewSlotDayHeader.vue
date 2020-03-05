<template>
  <q-calendar
    v-model="selectedDate"
    view="week-scheduler"
    :resources="resources"
    locale="en-us"
    style="height: 500px;"
  >
    <template #scheduler-day-header="{ day }">
      <div class="row justify-center items-center">
        <q-btn class="fit">Day: {{ day.day }}</q-btn>
      </div>
    </template>
  </q-calendar>
</template>

<script>
export default {
  data () {
    return {
      selectedDate: '2019-04-08',
      resources: [
        { label: 'John' },
        { label: 'Mary' },
        { label: 'Susan' },
        { label: 'Olivia' },
        { label: 'Board Room' },
        { label: 'Room-1' },
        { label: 'Room-2' }
      ]
    }
  }
}
</script>

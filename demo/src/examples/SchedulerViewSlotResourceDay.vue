<template>
  <div style="max-width: 800px; width: 100%;">
    <q-calendar
      v-model="selectedDate"
      view="week-scheduler"
      :resources="resources"
      locale="en-us"
      style="height: 500px;"
    >
      <template #scheduler-resource-day="{ timestamp, /* index, */ resource }">
        <q-btn
          flat
          class="fit"
        >
          <span
            class="ellipsis"
            style="font-size: 10px;"
          >{{ resource.label }}:{{ timestamp.day }}</span>
        </q-btn>
      </template>
    </q-calendar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectedDate: '',
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

<template>
  <div style="max-width: 800px; width: 100%;">
    <q-calendar
      v-model="selectedDate"
      view="scheduler"
      :resources="resources"
      locale="en-us"
      style="height: 500px;"
    >
      <!-- eslint-disable vue/no-unused-vars -->
      <template #scheduler-resources-header="days">
        <div class="full-height row justify-center items-center">
          <q-btn label="here" />
        </div>
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

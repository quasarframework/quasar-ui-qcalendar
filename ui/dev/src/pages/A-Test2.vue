<template>
  <div class="q-pa-md row justify-evenly q-gutter-sm">
    <q-card>
      <q-card-section class="text-caption text-uppercase">
        {{ title }}
      </q-card-section>
      <q-card-section>
        <q-calendar
          v-model="selectedDate"
          view="month"
          color="crimson"
          :mini-mode="true"
          locale="en-us"
          style="height: 300px;"
          v-close-popup
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Select Date'
    }
  },

  data () {
    return {
      selectedDate: '',
      showDatePicker: false
    }
  }
}
</script>

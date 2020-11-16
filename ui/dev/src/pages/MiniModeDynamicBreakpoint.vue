<template>
  <div style="max-width: 800px; width: 100%;">
    <q-splitter
      v-model="splitterModel"
      :limits="[30, 100]"
      emit-immediately
    >
      <template v-slot:before>
        <div style="overflow: hidden;">
          <q-calendar
            ref="calendar"
            v-model="selectedDate"
            view="month"
            locale="en-us"
            :mini-mode="miniMode"
            :short-weekday-label="shortWeekdayLabel"
          />
        </div>
      </template>
      <template v-slot:separator>
        <q-avatar color="primary" text-color="white" size="40px" icon="drag_indicator" />
      </template>
      <template v-slot:after>
        <div style="min-width: 20px"></div>
      </template>
    </q-splitter>
  </div>
</template>

<script>
export default {
  data () {
    return {
      splitterModel: 90,
      selectedDate: '',
      miniMode: false,
      shortWeekdayLabel: false
    }
  },
  watch: {
    splitterModel (val) {
      const rect = this.$refs.calendar.$el.getBoundingClientRect()
      this.miniMode = rect.width < 500
      this.shortWeekdayLabel = rect.width < 300
    }
  }
}
</script>

<template>
  <div style="max-width: 800px; width: 100%;">
    <q-toolbar>
      <q-btn stretch flat label="Prev" @click="calendarPrev" />
      <q-separator vertical />
      <q-btn stretch flat label="Next" @click="calendarNext" />
      <q-space />
    </q-toolbar>
    <q-separator />
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
          animated
          transition-prev="slide-right"
          transition-next="slide-left"
          :selected-dates="selectedDates"
          @click:day="onToggleDate"
          @click:date="onToggleDate"
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
      splitterModel: 90, // start at 90%
      miniMode: false,
      selectedDate: '',
      selectedDates: []
    }
  },

  watch: {
    splitterModel (val) {
      const rect = this.$refs.calendar.$el.getBoundingClientRect()
      this.miniMode = rect.width < 500
    }
  },

  methods: {
    calendarNext () {
      this.$refs.calendar.next()
    },

    calendarPrev () {
      this.$refs.calendar.prev()
    },

    classDay (timestamp) {
      if (this.anchorDayIdentifier !== false && this.otherDayIdentifier !== false) {
        return this.getBetween(timestamp)
      }
    },

    onToggleDate (timestamp) {
      if (this.selectedDates.includes(timestamp.date)) {
        // remove the date
        for (let i = 0; i < this.selectedDates.length; ++i) {
          if (timestamp.date === this.selectedDates[i]) {
            this.selectedDates.splice(i, 1)
            break
          }
        }
      } else {
        // add the date
        this.selectedDates.push(timestamp.date)
      }
    }
  }
}
</script>

<template>
  <div>
    <div class="row justify-center items-center">
      <q-btn flat label="Prev" @click="prev" />
      <q-separator vertical />
      <q-btn flat label="Next" @click="next" />
    </div>
    <q-separator />
    <div style="overflow: hidden;">
      <q-calendar
        ref="calendar"
        v-model="selectedDate"
        view="month"
        locale="en-us"
        animated
        no-active-date
        transition-prev="slide-right"
        transition-next="slide-left"
        :selected-dates="selectedDates"
        @click:day2="onToggleDay"
        @click:date2="onToggleDate"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectedDate: '',
      selectedDates: []
    }
  },

  methods: {
    next () {
      this.$refs.calendar.next()
    },

    prev () {
      this.$refs.calendar.prev()
    },

    onToggleDate ({ scope }) {
      if (scope !== undefined) {
        this.toggleDate(scope)
      }
    },

    onToggleDay ({ scope }) {
      if (scope !== undefined) {
        this.toggleDate(scope)
      }
    },

    toggleDate (scope) {
      const date = scope.timestamp.date
      if (this.selectedDates.includes(date)) {
        // remove the date
        for (let i = 0; i < this.selectedDates.length; ++i) {
          if (date === this.selectedDates[i]) {
            this.selectedDates.splice(i, 1)
            break
          }
        }
      }
      else {
        // add the date if not outside
        if (scope.outside !== true) {
          this.selectedDates.push(date)
        }
      }
    }
  },
  watch: {
    selectedDates (val) {
      /* eslint-disable-next-line */
      console.log('selected dates:', val)
    }
  }
}
</script>

<template>
  <div class="row justify-center" style="max-width: 800px; width: 100%; overflow: hidden;">
    <q-toolbar class="no-padding no-margin" style="height: 40px; min-height: auto;">
      <q-space />
      <q-btn flat label="Prev" @click="calendarPrev" />
      <q-separator vertical />
      <q-btn flat label="Next" @click="calendarNext" />
      <q-space />
    </q-toolbar>
    <q-separator class="full-width" />
    <div class="row justify-center" style="max-width: 800px; width: 100%; overflow: hidden;">
      <q-calendar
        ref="calendar"
        v-model="selectedDate"
        view="month"
        locale="en-us"
        mini-mode
        @click:date="handleClick"
        @mousemove:day="handleHoverStart"
        @mouseleave:day="handleHoverEnd"
        :day-class="classDay"
        style="max-width: 300px; min-width: auto; overflow: hidden"
      />
    </div>
  </div>
</template>

<script>
import { date } from 'quasar'

export default {
  data () {
    return {
      dates: [],
      hover: null,
      selectedDate: ''
    }
  },

  computed: {
    classDay () {
      return ({ date: d }) => {
        if (this.hover && this.dates.length === 1) {
          return {
            'q-selected-day-first': this.isHoveringFirst(d),
            'q-selected-day': this.isHovering(d),
            'q-selected-day-last': this.isHoveringLast(d)
          }
        }
        else if (this.dates.length === 2) {
          return {
            'q-selected-day-first': this.isSelectedFirst(d),
            'q-selected-day': this.isBetween(d),
            'q-selected-day-last': this.isSelectedLast(d)
          }
        }
      }
    },

    getMin () {
      if (this.dates.length === 2) {
        const [d1, d2] = this.dates
        return d1 > d2 ? d2 : d1
      } return null
    },
    getMax () {
      if (this.dates.length === 2) {
        const [d1, d2] = this.dates
        return d1 > d2 ? d1 : d2
      } return null
    },

    isSelected () {
      return d => this.dates.includes(d)
    },
    isSelectedFirst () {
      return d => this.getMin === d
    },
    isSelectedLast () {
      return d => this.getMax === d
    },
    isBetween () {
      return d => date.isBetweenDates(d, this.getMin, this.getMax, { inclusiveFrom: true, inclusiveTo: true })
    },

    isHovering () {
      return d => this.dates[0] > this.hover
        ? date.isBetweenDates(d, this.hover, this.dates[0], { inclusiveFrom: true, inclusiveTo: true })
        : date.isBetweenDates(d, this.dates[0], this.hover, { inclusiveFrom: true, inclusiveTo: true })
    },
    isHoveringFirst () {
      return d => this.dates[0] > this.hover
        ? this.hover === d
        : d === this.dates[0]
    },
    isHoveringLast () {
      return d => this.dates[0] < this.hover
        ? this.hover === d
        : d === this.dates[0]
    }
  },

  methods: {
    calendarNext () {
      this.$refs.calendar.next()
    },

    calendarPrev () {
      this.$refs.calendar.prev()
    },

    removeDate (d) {
      this.dates = this.dates.filter(v => v !== d)
    },

    handleClick ({ date: d }) {
      if (this.isSelected(d)) this.removeDate(d)
      else if (this.dates.length < 2) {
        this.dates.push(d)
      }
      else this.dates = [d]
    },

    handleHoverStart ({ scope: { date } }) {
      this.hover = date
    },
    handleHoverEnd ({ scope: { date } }) {
      this.hover = null
    }
  }
}
</script>

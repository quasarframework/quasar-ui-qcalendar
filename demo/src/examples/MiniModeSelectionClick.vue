<template>
  <div class="row justify-center" style="max-width: 800px; width: 100%;">
    <div class="row justify-center items-center">
      <q-btn flat dense label="Prev" @click="calendarPrev" />
      <q-separator vertical />
      <q-btn flat dense label="Next" @click="calendarNext" />
    </div>
    <q-separator />
    <div class="row justify-center" style="max-width: 800px; width: 100%; overflow: hidden;">
      <q-calendar
        ref="calendar"
        v-model="selectedDate"
        view="month"
        locale="en-us"
        mini-mode
        no-active-date
        @click:date2="handleClick"
        @mousemove:day2="handleHoverStart"
        @mouseleave:day2="handleHoverEnd"
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
            'q-range-first': this.isHoveringFirst(d),
            'q-range': this.isHovering(d),
            'q-range-last': this.isHoveringLast(d)
          }
        }
        else if (this.dates.length === 2) {
          return {
            'q-range-first': this.isSelectedFirst(d),
            'q-range': this.isBetween(d),
            'q-range-last': this.isSelectedLast(d)
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

    handleClick ({ scope: { timestamp: { date } } }) {
      if (this.isSelected(date)) this.removeDate(date)
      else if (this.dates.length < 2) {
        this.dates.push(date)
      }
      else this.dates = [date]
    },

    handleHoverStart ({ scope: { timestamp: { date } } }) {
      this.hover = date
    },

    handleHoverEnd ({ scope: { timestamp: { date } } }) {
      this.hover = null
    }
  }
}
</script>

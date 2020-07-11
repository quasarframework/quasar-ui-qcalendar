<template>
  <q-layout view="lHh Lpr fff">
    <q-header class="glossy bg-primary">
      <q-toolbar>
        <q-toolbar-title shrink>
          QCalendar <span class="text-subtitle2">v{{ version }}</span>
        </q-toolbar-title>

        <q-space></q-space>

        <q-separator vertical></q-separator>
        <q-btn stretch flat label="Prev" @click="calendarPrev"></q-btn>
        <q-separator vertical></q-separator>
        <q-btn stretch flat label="Next" @click="calendarNext"></q-btn>
        <q-separator vertical></q-separator>
        <q-btn stretch flat label="Scroll" @click="calendarScroll"></q-btn>
        <q-separator vertical></q-separator>
        <q-space></q-space>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-page>
      <q-calendar
        ref="calendar"
        v-model="date"
        view="month-interval"
        :weekdays="[1,2,3,4,5]"
        style="height: 600px;"
      >
      </q-calendar>
    </q-page>
  </q-layout>
</template>

<script>
export default {
  data () {
    return {
      date: '',
      version: '' // QCalendar.version
    }
  },
  beforeMount () {
    const now = new Date()
    // set initially to today's date (YYYY-MM-DD)
    this.date = now.getFullYear() + '-' + (this.padNumber(now.getMonth() + 1, 2)) + '-' + this.padNumber(now.getDay(), 2)
  },

  watch: {
    date (val) {
      console.log('Date: ', val)
    }
  },

  methods: {
    calendarNext () {
      this.$refs.calendar.next()
    },

    calendarPrev () {
      this.$refs.calendar.prev()
    },

    calendarScroll () {
      this.$refs.calendar.scrollToTime('16:00')
    },

    padNumber (num, length) {
      let padded = String(num)
      while (padded.length < length) {
        padded = '0' + padded
      }
      return padded
    }
  }
}
</script>

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
        <q-space></q-space>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-page>
      <q-calendar
        ref="calendar"
        v-model="date"
        view="day-agenda"
        :weekdays="[1,2,3,4,5]"
        style="height: 600px;"
      >
        <template #day-body="timestamp">
          <template v-for="(agenda) in getAgenda(timestamp)">
            <q-btn
              :key="timestamp.date + agenda.time"
              :label="agenda.time"
              class="agenda-item ellipsis justify-center q-ma-sm"
            >
            </q-btn>
          </template>
        </template>

      </q-calendar>
    </q-page>
  </q-layout>
</template>

<script>
import { version } from 'ui'

export default {
  data () {
    return {
      date: '',
      version: version, // QCalendar.version
      agenda: {
        1: [
          {
            time: '08:00'
          },
          {
            time: '08:30'
          },
          {
            time: '10:00'
          }
        ],
        2: [
          {
            time: '11:30'
          },
          {
            time: '17:00'
          }
        ],
        3: [
          {
            time: '08:00',
          },
          {
            time: '09:00',
          },
          {
            time: '10:00',
          },
          {
            time: '13:00',
          }
        ],
        4: [
          {
            time: '08:00',
          },
          {
            time: '09:00',
          },
          {
            time: '10:00',
          },
          {
            time: '13:00',
          }
        ],
        5: [
          {
            time: '08:00',
          },
          {
            time: '09:00',
          },
          {
            time: '09:30',
          },
          {
            time: '10:00',
          },
          {
            time: '11:30',
          },
          {
            time: '13:00',
          },
          {
            time: '13:30',
          },
          {
            time: '14:00',
          },
          {
            time: '14:30',
          },
          {
            time: '15:00',
          },
          {
            time: '15:30',
          },
          {
            time: '16:00',
          }
        ]
      }
    }
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

    getAgenda (timestamp) {
      return this.agenda[parseInt(timestamp.weekday, 10)]
    }
  }
}
</script>

<style lang="sass" scoped>
.agenda-item
  width: 90%
  border: black solid 1px
</style>
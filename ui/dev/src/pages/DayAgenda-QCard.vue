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
        view="week-agenda"
        :weekdays="[1,2,3,4,5]"
        style="height: 400px;"
      >
        <template #day-body="day">
          <template v-for="(agenda) in getAgenda(day)">
            <div
              :key="day.date + agenda.time"
              :label="agenda.time"
              class="justify-start q-ma-sm shadow-5 bg-grey-4"
            >
              <div v-if="agenda.avatar" class="row justify-center" style="margin-top: 30px; width: 100%;">
                <q-avatar style="margin-top: -25px; margin-bottom: 10px; font-size: 60px; max-height: 50px;">
                  <img :src="agenda.avatar" style="border: #e0e0e0 solid 5px;">
                </q-avatar>
              </div>
              <div class="col-12 q-px-sm q-mt-sm">
                {{ agenda.time }}
              </div>
              <div v-if="agenda.desc" class="col-12 q-px-sm q-pt-sm">
                {{ agenda.desc }}
              </div>
            </div>
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
      version: version,
      agenda: {
        // value represents day of the week
        1: [
          {
            time: '08:00',
            avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
            desc: 'Meeting with CEO'
          },
          {
            time: '08:30',
            avatar: 'https://cdn.quasar.dev/img/avatar.png',
            desc: 'Meeting with HR'
          },
          {
            time: '10:00',
            avatar: 'https://cdn.quasar.dev/img/avatar1.jpg',
            desc: 'Meeting with Karen'
          }
        ],
        2: [
          {
            time: '11:30',
            avatar: 'https://cdn.quasar.dev/img/avatar2.jpg',
            desc: 'Meeting with Alisha'
          },
          {
            time: '17:00',
            avatar: 'https://cdn.quasar.dev/img/avatar3.jpg',
            desc: 'Meeting with Sarah'
          }
        ],
        3: [
          {
            time: '08:00',
            desc: 'Stand-up SCRUM',
            avatar: 'https://cdn.quasar.dev/img/material.png'
          },
          {
            time: '09:00',
            avatar: 'https://cdn.quasar.dev/img/boy-avatar.png'
          },
          {
            time: '10:00',
            desc: 'Sprint planning',
            avatar: 'https://cdn.quasar.dev/img/material.png'
          },
          {
            time: '13:00',
            avatar: 'https://cdn.quasar.dev/img/avatar1.jpg'
          }
        ],
        4: [
          {
            time: '09:00',
            avatar: 'https://cdn.quasar.dev/img/avatar3.jpg'
          },
          {
            time: '10:00',
            avatar: 'https://cdn.quasar.dev/img/avatar2.jpg'
          },
          {
            time: '13:00',
            avatar: 'https://cdn.quasar.dev/img/material.png'
          }
        ],
        5: [
          {
            time: '08:00',
            avatar: 'https://cdn.quasar.dev/img/boy-avatar.png'
          },
          {
            time: '09:00',
            avatar: 'https://cdn.quasar.dev/img/avatar2.jpg'
          },
          {
            time: '09:30',
            avatar: 'https://cdn.quasar.dev/img/avatar4.jpg'
          },
          {
            time: '10:00',
            avatar: 'https://cdn.quasar.dev/img/avatar5.jpg'
          },
          {
            time: '11:30',
            avatar: 'https://cdn.quasar.dev/img/material.png'
          },
          {
            time: '13:00',
            avatar: 'https://cdn.quasar.dev/img/avatar6.jpg'
          },
          {
            time: '13:30',
            avatar: 'https://cdn.quasar.dev/img/avatar3.jpg'
          },
          {
            time: '14:00',
            avatar: 'https://cdn.quasar.dev/img/linux-avatar.png'
          },
          {
            time: '14:30',
            avatar: 'https://cdn.quasar.dev/img/avatar.png'
          },
          {
            time: '15:00',
            avatar: 'https://cdn.quasar.dev/img/boy-avatar.png'
          },
          {
            time: '15:30',
            avatar: 'https://cdn.quasar.dev/img/avatar2.jpg'
          },
          {
            time: '16:00',
            avatar: 'https://cdn.quasar.dev/img/avatar6.jpg'
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

    getAgenda (day) {
      return this.agenda[parseInt(day.weekday, 10)]
    }
  }
}
</script>

<style lang="sass" scoped>
.agenda-item
  width: 90%
  border: black solid 1px
</style>

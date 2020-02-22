<template>
  <q-page padding>
    <div class="col-12">This is a WIP. Anyone willing to take time to PR updates would be appreciated.</div>
    <q-btn flat dense label="Today" class="q-mx-md" @click="setToday"></q-btn>
    <q-btn flat dense round icon="keyboard_arrow_left" @click="onPrev"></q-btn>
    <q-btn flat dense round icon="keyboard_arrow_right" @click="onNext"></q-btn>
    <span class="q-mr-xl q-toolbar__title nowrap">{{ title }}</span>

    <q-calendar
      ref="calendar"
      v-model="selectedDate"
      view="week-agenda"
      :weekdays="[1,2,3,4,5]"
      :left-column-options="leftColumnOptions"
      :right-column-options="rightColumnOptions"
      bordered
      style="height: calc(100vh - 200px)"
    >
      <template #column-header-label="data">
        <template v-if="data.id === 'over-due'">
          <div class="row items-center no-wrap">
            <q-icon :name="overdueSelected ? 'check_box' : 'check_box_outline_blank'" :class="'cursor-pointer' + (overdueSelected ? ' text-red-8' : ' text-blue-8')" @click="overdueSelected = !overdueSelected" style="font-size: 24px;"/>
            <span class="ellipsis">{{ data.label }}</span>
          </div>
        </template>
        <template v-else>
          <div class="row items-center no-wrap">
            <span class="ellipsis">{{ data.label }}</span>
          </div>
        </template>
      </template>

      <template #day-header-label="day">
        <div class="row items-center no-wrap">
          <q-icon :name="selected[day.weekday] ? 'check_box' : 'check_box_outline_blank'" :class="'cursor-pointer' + (selected[day.weekday] ? ' text-red-8' : ' text-blue-8')" @click="selected[day.weekday] = !selected[day.weekday]" style="font-size: 24px;"/>
          <span class="ellipsis">{{ weekdayFormatter(day) }}</span>
        </div>
      </template>

      <template #column-body="data">
        <template v-if="data.id === 'over-due'">
          <q-card class="q-mr-xs q-mb-xs q-px-sm row justify-between">
            <div class="cursor-pointer"><q-icon name="add"/>Add Job</div>
            <div class="cursor-pointer"><q-icon name="note_add" />Add Note</div>
          </q-card>
          <template v-for="due in overdue">
            <q-card :key="due.id" class="q-mr-xs q-mb-xs q-px-sm">
              <div class="row items-center justify-start">
                <div class="col" style="max-width: 30px; width: 100%">
                  <q-icon :name="due.selected ? 'check_box' : 'check_box_outline_blank'" :class="'cursor-pointer' + (due.selected ? ' text-red-8' : ' text-blue-8')" @click="due.selected = !due.selected" />
                </div>
                <div :class="'ellipsis col-grow' + (due.selected ? ' text-red-8' : ' text-blue-8')">{{ due.name }}</div>
              </div>
              <div class="row items-center justify-start">
                <div class="col" style="max-width: 30px; width: 100%">
                  <q-icon name="location_on" />
                </div>
                <div class="ellipsis col-grow">{{ due.address }}</div>
              </div>
              <div class="row items-center justify-start">
                <div class="col" style="max-width: 30px; width: 100%">
                  <q-icon name="mail_outline" />
                </div>
                <div class="ellipsis col-grow">{{ due.email }}</div>
              </div>
              <div class="row items-center justify-start">
                <div class="col" style="max-width: 30px; width: 100%">
                  <q-icon name="call" />
                </div>
                <div class="ellipsis col-grow">{{ due.phone }}</div>
              </div>
              <div class="row items-center justify-start">
                <div class="col" style="max-width: 30px; width: 100%">
                  <q-icon name="work" />
                </div>
                <div class="ellipsis col-grow">{{ due.workDone }}</div>
              </div>
              <div class="row items-center justify-start">
                <div class="col" style="max-width: 30px; width: 100%">
                  <q-icon name="calendar_today" />
                </div>
                <div class="ellipsis col-grow">{{ due.workDate }}</div>
                <div>${{ due.amount }}</div>
              </div>
            </q-card>
          </template>
        </template>
      </template>

      <template #day-body="day">
        <q-card class="q-mr-xs q-mb-xs q-px-sm row justify-between">
          <div class="cursor-pointer"><q-icon name="add" />Add Job</div>
          <div class="cursor-pointer"><q-icon name="note_add" />Add Note</div>
        </q-card>
        <template v-for="(agenda) in getAgenda(day)">
          <div
            :key="day.date + agenda.time"
            :label="agenda.time"
            class="justify-start q-ma-sm shadow-5 bg-grey-6"
          >
            <div v-if="agenda.avatar" class="row justify-center" style="margin-top: 30px; width: 100%;">
              <q-avatar style="margin-top: -25px; margin-bottom: 10px; font-size: 60px; max-height: 50px;">
                <img :src="agenda.avatar" style="border: #9e9e9e solid 5px;">
              </q-avatar>
            </div>
            <div class="col-12 q-px-sm">
              <strong>{{ agenda.time }}</strong>
            </div>
            <div v-if="agenda.desc" class="col-12 q-px-sm" style="font-size: 10px;">
              {{ agenda.desc }}
            </div>
          </div>
        </template>
      </template>

    </q-calendar>
  </q-page>
</template>

<script>
import { getLocale } from '../util/getLocale'
import { padTime } from '../util/time'
import { createNativeLocaleFormatter } from 'ui' // ui is aliased from '@quasar/quasar-ui-qcalendar'

export default {
  name: 'Planner',

  data () {
    return {
      selectedDate: '',
      leftColumnOptions: [
        {
          id: 'over-due',
          label: 'Over Due'
        }
      ],
      rightColumnOptions: [
        {
          id: 'summary',
          label: 'Summary'
        }
      ],
      local: 'en-us',
      dateFormatter: void 0,
      titleFormatter: void 0,
      overdueSelected: false,
      selected: {
        1: false,
        2: false,
        3: false,
        4: false,
        5: false
      },
      overdue: [
        {
          selected: false,
          id: 1,
          address: '40 Portia Rd',
          name: 'Danielle Narbett',
          email: 'daniellenarbett@icloud.com',
          phone: '555-555-5555',
          amount: '45.00',
          workDate: '2019-08-01',
          workDone: 'Window cleaning'
        },
        {
          selected: false,
          id: 2,
          address: '40 Portia Rd',
          name: 'Danielle Narbett',
          email: 'daniellenarbett@icloud.com',
          phone: '555-555-5555',
          amount: '45.00',
          workDate: '2019-08-01',
          workDone: 'Window cleaning'
        },
        {
          selected: false,
          id: 3,
          address: '40 Portia Rd',
          name: 'Danielle Narbett',
          email: 'daniellenarbett@icloud.com',
          phone: '555-555-5555',
          amount: '45.00',
          workDate: '2019-08-01',
          workDone: 'Window cleaning'
        },
        {
          selected: false,
          id: 4,
          address: '40 Portia Rd',
          name: 'Danielle Narbett',
          email: 'daniellenarbett@icloud.com',
          phone: '555-555-5555',
          amount: '45.00',
          workDate: '2019-08-01',
          workDone: 'Window cleaning'
        },
        {
          selected: false,
          id: 5,
          address: '40 Portia Rd',
          name: 'Danielle Narbett',
          email: 'daniellenarbett@icloud.com',
          phone: '555-555-5555',
          amount: '45.00',
          workDate: '2019-08-01',
          workDone: 'Window cleaning'
        },
        {
          selected: false,
          id: 6,
          address: '40 Portia Rd',
          name: 'Danielle Narbett',
          email: 'daniellenarbett@icloud.com',
          phone: '555-555-5555',
          amount: '45.00',
          workDate: '2019-08-01',
          workDone: 'Window cleaning'
        },
        {
          selected: false,
          id: 7,
          address: '40 Portia Rd',
          name: 'Danielle Narbett',
          email: 'daniellenarbett@icloud.com',
          phone: '555-555-5555',
          amount: '45.00',
          workDate: '2019-08-01',
          workDone: 'Window cleaning'
        },
        {
          selected: false,
          id: 8,
          address: '40 Portia Rd',
          name: 'Danielle Narbett',
          email: 'daniellenarbett@icloud.com',
          phone: '555-555-5555',
          amount: '45.00',
          workDate: '2019-08-01',
          workDone: 'Window cleaning'
        },
        {
          selected: false,
          id: 9,
          address: '40 Portia Rd',
          name: 'Danielle Narbett',
          email: 'daniellenarbett@icloud.com',
          phone: '555-555-5555',
          amount: '45.00',
          workDate: '2019-08-01',
          workDone: 'Window cleaning'
        },
        {
          selected: false,
          id: 10,
          address: '40 Portia Rd',
          name: 'Danielle Narbett',
          email: 'daniellenarbett@icloud.com',
          phone: '555-555-5555',
          amount: '45.00',
          workDate: '2019-08-01',
          workDone: 'Window cleaning'
        },
        {
          selected: false,
          id: 11,
          address: '40 Portia Rd',
          name: 'Danielle Narbett',
          email: 'daniellenarbett@icloud.com',
          phone: '555-555-5555',
          amount: '45.00',
          workDate: '2019-08-01',
          workDone: 'Window cleaning'
        },
        {
          selected: false,
          id: 12,
          address: '40 Portia Rd',
          name: 'Danielle Narbett',
          email: 'daniellenarbett@icloud.com',
          phone: '555-555-5555',
          amount: '45.00',
          workDate: '2019-08-01',
          workDone: 'Window cleaning'
        },
        {
          selected: false,
          id: 13,
          address: '40 Portia Rd',
          name: 'Danielle Narbett',
          email: 'daniellenarbett@icloud.com',
          phone: '555-555-5555',
          amount: '45.00',
          workDate: '2019-08-01',
          workDone: 'Window cleaning'
        }
      ],
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

  beforeMount () {
    this.locale = getLocale()
    this.updateFormatters()
    this.setToday()
  },

  computed: {
    title () {
      if (this.titleFormatter && this.locale && this.selectedDate) {
        const date = new Date(this.selectedDate)
        return this.titleFormatter.format(date)
      }
      return ''
    },

    weekdayFormatter () {
      const longOptions = { timeZone: 'UTC', weekday: 'long' }
      const shortOptions = { timeZone: 'UTC', weekday: 'short' }

      return createNativeLocaleFormatter(
        this.locale,
        (_tms, short) => short ? shortOptions : longOptions
      )
    }
  },

  watch: {
    overdueSelected (val) {
      this.overdue.forEach(due => { due.selected = val })
    }
  },

  methods: {
    getAgenda (day) {
      return this.agenda[parseInt(day.weekday, 10)]
    },

    setToday () {
      this.selectedDate = this.formatDate()
    },

    onPrev () {
      this.$refs.calendar.prev()
    },

    onNext () {
      this.$refs.calendar.next()
    },

    formatDate (date) {
      const d = date !== void 0 ? new Date(date) : new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()

      return [year, padTime(month), padTime(day)].join('-')
    },

    updateFormatters () {
      try {
        this.dateFormatter = new Intl.DateTimeFormat(this.locale || void 0, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'UTC'
        })

        this.titleFormatter = new Intl.DateTimeFormat(this.locale || void 0, {
          month: this.shortMonthLabel ? 'short' : 'long',
          year: 'numeric',
          timeZone: 'UTC'
        })
      } catch (e) {
        // console.error('Intl.DateTimeFormat not supported')
        this.dateFormatter = void 0
        this.titleFormatter = void 0
      }
    }
  }
}
</script>

<style lang="sass" scoped>

</style>

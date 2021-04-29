<template>
  <div class="subcontent">

    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%; height: 400px;">
        <q-calendar-agenda
        ref="calendar"
          v-model="selectedDate"
          view="week"
          :left-column-options="leftColumnOptions"
          :right-column-options="rightColumnOptions"
          :weekdays="[1,2,3,4,5]"
          :day-min-height="200"
          bordered
          animated
          locale="en-US"
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-time="onClickTime"
          @click-interval="onClickInterval"
          @click-head-intervals="onClickHeadIntervals"
          @click-head-day="onClickHeadDay"
        >
          <template #day="{ scope: { timestamp } }">
            <template
              v-for="agenda in getAgenda(timestamp)"
              :key="timestamp.date + agenda.time"
            >
              <div
                :label="agenda.time"
                class="justify-start q-ma-sm shadow-5 bg-grey-6"
                style="margin-top: 25px;"
              >
                <div
                  v-if="agenda.avatar"
                  class="row justify-center"
                  style="margin-top: 30px; width: 100%;"
                >
                  <q-avatar style="margin-top: -50px; margin-bottom: 10px; font-size: 60px;">
                    <img
                      :src="agenda.avatar"
                      style="border: #9e9e9e solid 5px;"
                    >
                  </q-avatar>
                </div>
                <div class="col-12 q-px-sm">
                  <strong>{{ agenda.time }}</strong>
                </div>
                <div
                  v-if="agenda.desc"
                  class="col-12 q-px-sm"
                  style="font-size: 10px;"
                >
                  {{ agenda.desc }}
                </div>
              </div>
            </template>
          </template>
        </q-calendar-agenda>
      </div>
    </div>
  </div>
</template>

<script>
import { QCalendarAgenda, today } from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarAgenda.sass'

import { defineComponent } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'

export default defineComponent({
  components: {
    NavigationBar,
    QCalendarAgenda
  },
  data () {
    return {
      selectedDate: today(),
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
      },
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
      ]
    }
  },

  methods: {
    getAgenda (day) {
      return this.agenda[ parseInt(day.weekday, 10) ]
    },
    onToday () {
      this.$refs.calendar.moveToToday()
    },
    onPrev () {
      this.$refs.calendar.prev()
    },
    onNext () {
      this.$refs.calendar.next()
    },
    onMoved (data) {
      console.log('onMoved', data)
    },
    onChange (data) {
      console.log('onChange', data)
    },
    onClickDate (data) {
      console.log('onClickDate', data)
    },
    onClickTime (data) {
      console.log('onClickTime', data)
    },
    onClickInterval (data) {
      console.log('onClickInterval', data)
    },
    onClickHeadIntervals (data) {
      console.log('onClickHeadIntervals', data)
    },
    onClickHeadDay (data) {
      console.log('onClickHeadDay', data)
    }
  }
})
</script>

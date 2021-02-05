<template>
  <div
    class="row items-center"
    style="max-width: 800px; width: 100%; height: 421px;"
  >
    <div class="col-8 full-height">
      <div class="row justify-center items-center">
        <q-btn
          flat
          dense
          label="Prev"
          @click="calendarPrev"
        />
        <q-separator vertical />
        <q-btn
          flat
          dense
          label="Next"
          @click="calendarNext"
        />
      </div>
      <q-separator />
      <q-calendar
        ref="calendar"
        v-model="selectedDate"
        view="week-agenda"
        :weekdays="[1,2,3,4,5]"
        locale="en-us"
        animated
        :left-column-options="leftColumnOptions"
        :right-column-options="rightColumnOptions"
        style="height: 390px;"
        @input="onModelChanged"
        @click:date2="onClickDate2"
        @click:day:header2="onClickDayHeader2"
        @click:time2="onClickTime2"
        @click:column2="onClickColumn2"
        @click:column:header2="onClickColumnHeader2"
      >
        <template #day-body="{ timestamp }">
          <template
            v-for="(agenda) in getAgenda(timestamp)"
            :key="timestamp.date + agenda.time"
          >
            <div
              :label="agenda.time"
              class="justify-start q-ma-sm shadow-5 bg-grey-6"
            >
              <div
                v-if="agenda.avatar"
                class="row justify-center"
                style="margin-top: 30px; width: 100%;"
              >
                <q-avatar style="margin-top: -25px; margin-bottom: 10px; font-size: 60px; max-height: 50px;">
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
      </q-calendar>
    </div>
    <q-card class="events col-4 q-pa-xs full-height column justify-start items-start">
      <q-item-section class="full-width">
        <q-item-label>Events</q-item-label>
        <q-item-label class="my-text-caption">
          New data appended to top
        </q-item-label>
      </q-item-section>
      <q-separator />
      <div
        class="scroll overflow-auto"
        style="height: 360px; width: 100%;"
      >
        <div
          v-for="(event, index) in events"
          :key="index"
          class="col-12"
          style="font-size: 10px; line-height: 10px; max-height: 14px; min-height: 14px; padding: 2px 2px; white-space: nowrap;"
        >
          {{ event }}
        </div>
      </div>
    </q-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectedDate: '',
      events: [],
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
    calendarNext () {
      this.$refs.calendar.next()
    },
    calendarPrev () {
      this.$refs.calendar.prev()
    },
    onModelChanged (date) {
      this.events.unshift(`Model changed: ${ date }`)
    },
    onClickDate2 (data) {
      this.events.unshift(`click:date2: ${ JSON.stringify(data) }`)
    },
    onClickDayHeader2 (data) {
      this.events.unshift(`click:day:header2: ${ JSON.stringify(data) }`)
    },
    onClickTime2 (data) {
      this.events.unshift(`click:time2: ${ JSON.stringify(data) }`)
    },
    onClickColumn2 (data) {
      this.events.unshift(`click:column2: ${ JSON.stringify(data) }`)
    },
    onClickColumnHeader2 (data) {
      this.events.unshift(`click:column:header2: ${ JSON.stringify(data) }`)
    }
  }
}
</script>
<style lang="sass" scoped>
.my-text-caption
  font-size: 0.7rem
  font-weight: 400
  line-height: .75rem !important
  letter-spacing: 0.03333em
</style>

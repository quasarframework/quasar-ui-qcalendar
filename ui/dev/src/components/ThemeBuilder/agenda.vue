<template>
  <div>
    <div class="q-gutter-sm q-mb-sm">
      <q-checkbox
        v-model="noActiveDate"
        dense
        label="No active date"
      />
      <q-checkbox
        v-model="disabledDays"
        dense
        label="Disabled weekends"
      />
    </div>
    <q-calendar
      v-model="selectedDate"
      view="week-agenda"
      :disabled-weekdays="disabledWeekdays"
      :no-active-date="noActiveDate"
      bordered
      locale="en-us"
      style="height: 400px;"
      :style="styles"
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
</template>

<script>
export default {
  name: 'ThemeBuilderAgenda',
  props: {
    value: String,
    styles: Object
  },
  data () {
    return {
      selectedDate: '',
      noActiveDate: false,
      disabledDays: false,
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

  computed: {
    disabledWeekdays () {
      return this.disabledDays === true ? [ 0, 6 ] : []
    }
  },
  watch: {
    value (val) {
      this.selectedDate = val
    }
  },
  beforeMount () {
    this.selectedDate = this.value
  },
  methods: {
    getAgenda (day) {
      return this.agenda[ parseInt(day.weekday, 10) ]
    }
  }
}
</script>

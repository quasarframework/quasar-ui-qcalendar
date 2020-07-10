<template>
  <div style="max-width: 800px; width: 100%;">
    <div class="full-width">
      <q-select
        outlined
        dense
        emit-value
        map-options
        label="Change theme"
        v-model="theme"
        :options="themesList"
        class="col-12"
      ></q-select>
    </div>
    <q-separator></q-separator>
    <q-calendar
      v-model="selectedDate"
      view="week-agenda"
      enable-theme
      :theme="theme"
      locale="en-us"
      style="height: 400px;"
    >
      <template #day-body="{ timestamp }">
        <template v-for="(agenda) in getAgenda(timestamp)">
          <div
            :key="timestamp.date + agenda.time"
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectedDate: '',
      theme: {
        name: 'default'
      },
      themes: [
        {
          name: 'default'
        },
        {
          name: 'dark',
          // body
          colorBody: 'grey-2',
          backgroundBody: 'blue-grey-8',
          colorBodyOutside: 'grey-6',
          backgroundBodyOutside: 'blue-grey-9',
          colorBodyPast: 'grey-11',
          backgroundBodyPast: 'blue-grey-10',
          colorBodyCurrent: 'blue-grey-2',
          backgroundBodyCurrent: 'blue-grey-10',
          colorBodyFuture: 'blue-grey-2',
          backgroundBodyFuture: 'blue-grey-10',
          // header - weekly only
          colorHeader: 'blue-grey-2',
          backgroundHeader: 'blue-grey-10',
          colorHeaderOutside: 'blue-grey-2',
          backgroundHeaderOutside: 'blue-grey-10',
          // header - for daily only
          colorHeaderPast: 'grey-11',
          backgroundHeaderPast: 'blue-grey-10',
          colorHeaderCurrent: 'blue-grey-2',
          backgroundHeaderCurrent: 'blue-grey-10',
          colorHeaderFuture: 'blue-grey-2',
          backgroundHeaderFuture: 'blue-grey-10',
          // work week - monthly only
          colorWorkWeekPast: 'blue-grey-8',
          backgroundWorkWeekPast: 'blue-grey-6',
          colorWorkWeekCurrent: 'orange-4',
          backgroundWorkWeekCurrent: 'blue-grey-10',
          colorWorkWeekFuture: 'yellow-4',
          backgroundWorkWeekFuture: 'blue-grey-10',
          // label
          colorDayLabelOutside: 'blue-grey-2',
          backgroundDayLabelOutside: 'blue-grey-9',
          colorDayLabelPast: 'yellow-4',
          backgroundDayLabelPast: 'blue-grey-10',
          colorDayLabelCurrent: 'orange-4',
          backgroundDayLabelCurrent: 'blue-grey-10',
          colorDayLabelFuture: 'yellow-4',
          backgroundDayLabelFuture: 'blue-grey-10',
          // interval body
          colorIntervalHeader: 'grey-2',
          backgroundIntervalHeader: 'blue-grey-10',
          colorIntervalBody: 'grey-2',
          backgroundIntervalBody: 'blue-grey-10',
          colorIntervalText: 'grey-2',
          backgroundIntervalText: 'blue-grey-10',
          // scheduler body
          colorSchedulerHeader: 'grey-2',
          backgroundSchedulerHeader: 'blue-grey-10',
          colorSchedulerBody: 'grey-2',
          backgroundSchedulerBody: 'blue-grey-10',
          colorSchedulerText: 'grey-2',
          backgroundSchedulerText: 'blue-grey-10'
        },
        {
          name: 'teal',
          // body
          colorBody: 'grey-2',
          backgroundBody: 'teal-8',
          colorBodyOutside: 'grey-6',
          backgroundBodyOutside: 'teal-9',
          colorBodyPast: 'grey-11',
          backgroundBodyPast: 'teal-10',
          colorBodyCurrent: 'teal-2',
          backgroundBodyCurrent: 'teal-10',
          colorBodyFuture: 'teal-2',
          backgroundBodyFuture: 'teal-10',
          // header - weekly only
          colorHeader: 'teal-2',
          backgroundHeader: 'teal-10',
          colorHeaderOutside: 'teal-2',
          backgroundHeaderOutside: 'teal-10',
          // header - for daily only
          colorHeaderPast: 'grey-11',
          backgroundHeaderPast: 'teal-10',
          colorHeaderCurrent: 'teal-2',
          backgroundHeaderCurrent: 'teal-10',
          colorHeaderFuture: 'teal-2',
          backgroundHeaderFuture: 'teal-10',
          // work week - monthly only
          colorWorkWeekPast: 'teal-8',
          backgroundWorkWeekPast: 'teal-6',
          colorWorkWeekCurrent: 'orange-4',
          backgroundWorkWeekCurrent: 'teal-10',
          colorWorkWeekFuture: 'yellow-4',
          backgroundWorkWeekFuture: 'teal-10',
          // label
          colorDayLabelOutside: 'teal-2',
          backgroundDayLabelOutside: 'teal-9',
          colorDayLabelPast: 'yellow-4',
          backgroundDayLabelPast: 'teal-10',
          colorDayLabelCurrent: 'orange-4',
          backgroundDayLabelCurrent: 'teal-10',
          colorDayLabelFuture: 'yellow-4',
          backgroundDayLabelFuture: 'teal-10',
          // interval body
          colorIntervalHeader: 'grey-2',
          backgroundIntervalHeader: 'teal-10',
          colorIntervalBody: 'grey-2',
          backgroundIntervalBody: 'teal-10',
          colorIntervalText: 'grey-2',
          backgroundIntervalText: 'teal-10',
          // scheduler body
          colorSchedulerHeader: 'grey-2',
          backgroundSchedulerHeader: 'teal-10',
          colorSchedulerBody: 'grey-2',
          backgroundSchedulerBody: 'teal-10',
          colorSchedulerText: 'grey-2',
          backgroundSchedulerText: 'teal-10'
        },
        {
          name: 'brown',
          // body
          colorBody: 'brown-2',
          backgroundBody: 'brown-8',
          colorBodyOutside: 'grey-6',
          backgroundBodyOutside: 'brown-9',
          colorBodyPast: 'grey-11',
          backgroundBodyPast: 'brown-10',
          colorBodyCurrent: 'brown-2',
          backgroundBodyCurrent: 'brown-10',
          colorBodyFuture: 'brown-2',
          backgroundBodyFuture: 'brown-10',
          // header - weekly only
          colorHeader: 'brown-2',
          backgroundHeader: 'brown-10',
          colorHeaderOutside: 'brown-2',
          backgroundHeaderOutside: 'brown-10',
          // header - for daily only
          colorHeaderPast: 'grey-11',
          backgroundHeaderPast: 'brown-10',
          colorHeaderCurrent: 'brown-2',
          backgroundHeaderCurrent: 'brown-10',
          colorHeaderFuture: 'brown-2',
          backgroundHeaderFuture: 'brown-10',
          // work week - monthly only
          colorWorkWeekPast: 'brown-8',
          backgroundWorkWeekPast: 'brown-6',
          colorWorkWeekCurrent: 'orange-4',
          backgroundWorkWeekCurrent: 'brown-10',
          colorWorkWeekFuture: 'yellow-4',
          backgroundWorkWeekFuture: 'brown-10',
          // label
          colorDayLabelOutside: 'brown-2',
          backgroundDayLabelOutside: 'brown-9',
          colorDayLabelPast: 'yellow-4',
          backgroundDayLabelPast: 'brown-10',
          colorDayLabelCurrent: 'orange-4',
          backgroundDayLabelCurrent: 'brown-10',
          colorDayLabelFuture: 'yellow-4',
          backgroundDayLabelFuture: 'brown-10',
          // interval body
          colorIntervalHeader: 'grey-2',
          backgroundIntervalHeader: 'brown-10',
          colorIntervalBody: 'grey-2',
          backgroundIntervalBody: 'brown-10',
          colorIntervalText: 'grey-2',
          backgroundIntervalText: 'brown-10',
          // scheduler body
          colorSchedulerHeader: 'grey-2',
          backgroundSchedulerHeader: 'brown-10',
          colorSchedulerBody: 'grey-2',
          backgroundSchedulerBody: 'brown-10',
          colorSchedulerText: 'grey-2',
          backgroundSchedulerText: 'brown-10'
        },
        {
          name: 'deep purple',
          // body
          colorBody: 'grey-2',
          backgroundBody: 'deep-purple-8',
          colorBodyOutside: 'grey-6',
          backgroundBodyOutside: 'deep-purple-9',
          colorBodyPast: 'grey-11',
          backgroundBodyPast: 'deep-purple-10',
          colorBodyCurrent: 'deep-purple-2',
          backgroundBodyCurrent: 'deep-purple-10',
          colorBodyFuture: 'deep-purple-2',
          backgroundBodyFuture: 'deep-purple-10',
          // header - weekly only
          colorHeader: 'deep-purple-2',
          backgroundHeader: 'deep-purple-10',
          colorHeaderOutside: 'deep-purple-2',
          backgroundHeaderOutside: 'deep-purple-10',
          // header - for daily only
          colorHeaderPast: 'grey-11',
          backgroundHeaderPast: 'deep-purple-10',
          colorHeaderCurrent: 'deep-purple-2',
          backgroundHeaderCurrent: 'deep-purple-10',
          colorHeaderFuture: 'deep-purple-2',
          backgroundHeaderFuture: 'deep-purple-10',
          // work week - monthly only
          colorWorkWeekPast: 'deep-purple-8',
          backgroundWorkWeekPast: 'deep-purple-6',
          colorWorkWeekCurrent: 'orange-4',
          backgroundWorkWeekCurrent: 'deep-purple-10',
          colorWorkWeekFuture: 'yellow-4',
          backgroundWorkWeekFuture: 'deep-purple-10',
          // label
          colorDayLabelOutside: 'deep-purple-2',
          backgroundDayLabelOutside: 'deep-purple-9',
          colorDayLabelPast: 'yellow-4',
          backgroundDayLabelPast: 'deep-purple-10',
          colorDayLabelCurrent: 'orange-4',
          backgroundDayLabelCurrent: 'deep-purple-10',
          colorDayLabelFuture: 'yellow-4',
          backgroundDayLabelFuture: 'deep-purple-10',
          // interval body
          colorIntervalHeader: 'grey-2',
          backgroundIntervalHeader: 'deep-purple-10',
          colorIntervalBody: 'grey-2',
          backgroundIntervalBody: 'deep-purple-10',
          colorIntervalText: 'grey-2',
          backgroundIntervalText: 'deep-purple-10',
          // scheduler body
          colorSchedulerHeader: 'grey-2',
          backgroundSchedulerHeader: 'deep-purple-10',
          colorSchedulerBody: 'grey-2',
          backgroundSchedulerBody: 'deep-purple-10',
          colorSchedulerText: 'grey-2',
          backgroundSchedulerText: 'deep-purple-10'
        },
        {
          name: 'indigo',
          // body
          colorBody: 'grey-2',
          backgroundBody: 'indigo-8',
          colorBodyOutside: 'grey-6',
          backgroundBodyOutside: 'indigo-9',
          colorBodyPast: 'grey-11',
          backgroundBodyPast: 'indigo-10',
          colorBodyCurrent: 'indigo-2',
          backgroundBodyCurrent: 'indigo-10',
          colorBodyFuture: 'indigo-2',
          backgroundBodyFuture: 'indigo-10',
          // header - weekly only
          colorHeader: 'indigo-2',
          backgroundHeader: 'indigo-10',
          colorHeaderOutside: 'indigo-2',
          backgroundHeaderOutside: 'indigo-10',
          // header - for daily only
          colorHeaderPast: 'grey-11',
          backgroundHeaderPast: 'indigo-10',
          colorHeaderCurrent: 'indigo-2',
          backgroundHeaderCurrent: 'indigo-10',
          colorHeaderFuture: 'indigo-2',
          backgroundHeaderFuture: 'indigo-10',
          // work week - monthly only
          colorWorkWeekPast: 'indigo-8',
          backgroundWorkWeekPast: 'indigo-6',
          colorWorkWeekCurrent: 'orange-4',
          backgroundWorkWeekCurrent: 'indigo-10',
          colorWorkWeekFuture: 'yellow-4',
          backgroundWorkWeekFuture: 'indigo-10',
          // label
          colorDayLabelOutside: 'indigo-2',
          backgroundDayLabelOutside: 'indigo-9',
          colorDayLabelPast: 'yellow-4',
          backgroundDayLabelPast: 'indigo-10',
          colorDayLabelCurrent: 'orange-4',
          backgroundDayLabelCurrent: 'indigo-10',
          colorDayLabelFuture: 'yellow-4',
          backgroundDayLabelFuture: 'indigo-10',
          // interval body
          colorIntervalHeader: 'grey-2',
          backgroundIntervalHeader: 'indigo-10',
          colorIntervalBody: 'grey-2',
          backgroundIntervalBody: 'indigo-10',
          colorIntervalText: 'grey-2',
          backgroundIntervalText: 'indigo-10',
          // scheduler body
          colorSchedulerHeader: 'grey-2',
          backgroundSchedulerHeader: 'indigo-10',
          colorSchedulerBody: 'grey-2',
          backgroundSchedulerBody: 'indigo-10',
          colorSchedulerText: 'grey-2',
          backgroundSchedulerText: 'indigo-10'
        },
        {
          name: 'blue',
          // body
          colorBody: 'grey-2',
          backgroundBody: 'blue-8',
          colorBodyOutside: 'grey-6',
          backgroundBodyOutside: 'blue-9',
          colorBodyPast: 'grey-11',
          backgroundBodyPast: 'blue-10',
          colorBodyCurrent: 'blue-2',
          backgroundBodyCurrent: 'blue-10',
          colorBodyFuture: 'blue-2',
          backgroundBodyFuture: 'blue-10',
          // header - weekly only
          colorHeader: 'blue-2',
          backgroundHeader: 'blue-10',
          colorHeaderOutside: 'blue-2',
          backgroundHeaderOutside: 'blue-10',
          // header - for daily only
          colorHeaderPast: 'grey-11',
          backgroundHeaderPast: 'blue-10',
          colorHeaderCurrent: 'blue-2',
          backgroundHeaderCurrent: 'blue-10',
          colorHeaderFuture: 'blue-2',
          backgroundHeaderFuture: 'blue-10',
          // work week - monthly only
          colorWorkWeekPast: 'blue-8',
          backgroundWorkWeekPast: 'blue-6',
          colorWorkWeekCurrent: 'orange-4',
          backgroundWorkWeekCurrent: 'blue-10',
          colorWorkWeekFuture: 'yellow-4',
          backgroundWorkWeekFuture: 'blue-10',
          // label
          colorDayLabelOutside: 'blue-2',
          backgroundDayLabelOutside: 'blue-9',
          colorDayLabelPast: 'yellow-4',
          backgroundDayLabelPast: 'blue-10',
          colorDayLabelCurrent: 'orange-4',
          backgroundDayLabelCurrent: 'blue-10',
          colorDayLabelFuture: 'yellow-4',
          backgroundDayLabelFuture: 'blue-10',
          // interval body
          colorIntervalHeader: 'grey-2',
          backgroundIntervalHeader: 'blue-10',
          colorIntervalBody: 'grey-2',
          backgroundIntervalBody: 'blue-10',
          colorIntervalText: 'grey-2',
          backgroundIntervalText: 'blue-10',
          // scheduler body
          colorSchedulerHeader: 'grey-2',
          backgroundSchedulerHeader: 'blue-10',
          colorSchedulerBody: 'grey-2',
          backgroundSchedulerBody: 'blue-10',
          colorSchedulerText: 'grey-2',
          backgroundSchedulerText: 'blue-10'
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

  computed: {
    themesList () {
      const list = []
      this.themes.forEach((theme) => {
        list.push({
          label: theme.name,
          value: { ...theme }
        })
      })
      return list
    }
  },

  methods: {
    getAgenda (day) {
      return this.agenda[parseInt(day.weekday, 10)]
    }
  }
}
</script>

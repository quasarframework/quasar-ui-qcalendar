<template>
  <div class="row full-width q-pa-xs rounded-borders relative-position" style="border: 2px solid rgba(25,118,210,.65);">
    <q-scroll-area class="col" style="max-width: 180px; width: 100%; max-height: 300px;">
      <q-list dense>
        <q-item
          v-for="type in types"
          :key="type.name"
          clickable
          :active="selected.name === type.name"
          @click="updateSelection(type)"
        >
          <q-item-section>
            {{ type.name }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>

    <div class="col">
      <q-calendar-agenda
        id="calendar-agenda"
        ref="calendar"
        view="week"
        bordered
        style="height: 300px;"
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
</template>

<script>
import { defineComponent, ref, reactive, watch, onMounted } from 'vue'
import { QCalendarAgenda } from '@quasar/quasar-ui-qcalendar/src/QCalendarAgenda.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarAgenda.sass'

export default defineComponent({
  name: 'QCalendarAgendaAnatomy',
  components: {
    QCalendarAgenda
  },
  setup () {
    const calendar = ref(null)
    const types = reactive([
      {
        name: 'Head',
        class: 'q-calendar-agenda__head'
      },
      {
        name: 'Head Weekdays',
        class: 'q-calendar-agenda__head--days__weekdays'
      },
      {
        name: 'Head Day',
        class: 'q-calendar-agenda__head--day'
      },
      {
        name: 'Head Weekday',
        class: 'q-calendar-agenda__head--weekday'
      },
      {
        name: 'Head Date',
        class: 'q-calendar-agenda__head--date'
      },
      {
        name: 'Head Day Button',
        class: 'q-calendar-agenda__head--day__label'
      },
      {
        name: 'Head Days Event',
        class: 'q-calendar-agenda__head--days__event'
      },
      {
        name: 'Head Day Event',
        class: 'q-calendar-agenda__head--day__event'
      },
      {
        name: 'Body',
        class: 'q-calendar-agenda__body'
      },
      {
        name: 'Container',
        class: 'q-calendar-agenda__day-container'
      },
      {
        name: 'Day',
        class: 'q-calendar-agenda__day'
      }
    ])
    const selected = ref(types[ 0 ])
    const el = ref(null)
    const agenda = reactive({
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
      })


    watch(() => selected.value, (current, prev) => {
      removeClass(prev)
      addClass(current)
    })

    onMounted(() => {
      el.value = document.getElementById('calendar-agenda')
      setTimeout(() => {
        addClass(selected.value)
      }, 350)
    })

    function updateSelection (type) {
      selected.value = type
    }

    function addClass (type) {
      if (type.class !== undefined) {
        const els = el.value.querySelectorAll('.' + type.class)
        if (els && els.length > 0) {
          els.forEach(el => {
            el.classList.add('highlight')
          })
        }
      }
    }

    function removeClass (type) {
      const els = el.value.querySelectorAll('.highlight')
      if (els && els.length > 0) {
        els.forEach(el => {
          el.classList.remove('highlight')
        })
      }
    }

    function getAgenda (day) {
      return agenda[ parseInt(day.weekday, 10) ]
    }

    return {
      calendar,
      selected,
      types,
      updateSelection,
      getAgenda
    }
  }
})
</script>

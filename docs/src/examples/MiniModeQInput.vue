<template>
  <div class="subcontent">
    <div style="display: flex; justify-content: center; align-items: center; flex-wrap: nowrap;">
      <div
        class="q-pt-lg"
        style="display: flex; max-width: 280px; width: 100%;"
      >
        <q-input
          v-model="selectedDate"
          filled
          mask="####-##-##"
          :rules="[isoDateRe]"
        >
          <template #append>
            <q-icon
              name="event"
              class="cursor-pointer"
            >
              <q-popup-proxy
                ref="qDateProxy"
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <div class="column justify-center items-center">
                  <navigation-bar
                    @today="onToday"
                    @prev="onPrev"
                    @next="onNext"
                  />
                  {{ month }}
                  <q-calendar-month
                    ref="calendar"
                    v-model="selectedDate"
                    mini-mode
                    :min-weeks="6"
                    @change="onChange"
                    @moved="onMoved"
                    @click-date="onClickDate"
                    @click-day="onClickDay"
                    @click-workweek="onClickWorkweek"
                    @click-head-workweek="onClickHeadWorkweek"
                    @click-head-day="onClickHeadDay"
                  />

                  <q-btn
                    v-close-popup
                    label="close"
                    flat
                    class="self-end"
                  />
                </div>
                <!-- <q-date v-model="date">
                  <div class="row items-center justify-end">
                    <q-btn
                      v-close-popup
                      label="Close"
                      color="primary"
                      flat
                    />
                  </div>
                </q-date> -->
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>
  </div>
</template>

<script>
import { QCalendarMonth, today, getMonthFormatter } from '@quasar/quasar-ui-qcalendar/src/index.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarMonth.sass'

import { defineComponent } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'

const monthFormatter = getMonthFormatter()

export default defineComponent({
  name: 'MiniModeQInput',
  components: {
    NavigationBar,
    QCalendarMonth
  },
  data () {
    return {
      selectedDate: today(),
      isoDateRe: /\d{4}-[01]\d-[0-3]\d/,
      month: ''
    }
  },
  created () {
    const parts = this.selectedDate.split('-')
    this.month = monthFormatter(parseInt(parts[ 1 ], 10) - 1)
  },
  methods: {
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
      this.month = monthFormatter(data.days[ 8 ].month - 1)
    },
    onClickDate (data) {
      console.log('onClickDate', data)
    },
    onClickDay (data) {
      console.log('onClickDay', data)
    },
    onClickWorkweek (data) {
      console.log('onClickWorkweek', data)
    },
    onClickHeadDay (data) {
      console.log('onClickHeadDay', data)
    },
    onClickHeadWorkweek (data) {
      console.log('onClickHeadWorkweek', data)
    }
  }
})
</script>

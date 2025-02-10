<template>
  <div class="subcontent">
    <div style="display: flex; justify-content: center; align-items: center; flex-wrap: nowrap">
      <div class="q-pt-lg" style="display: flex; max-width: 280px; width: 100%">
        <q-input
          v-model="selectedDate"
          filled
          mask="####-##-##"
          :rules="[
            /// @ts-expect-error ignore for now
            isoDateRe,
          ]"
        >
          <template #append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                <div class="column justify-center items-center">
                  <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />
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

                  <q-btn v-close-popup label="close" flat class="self-end" />
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

<script setup lang="ts">
import { QCalendarMonth, today, getMonthFormatter, Timestamp } from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'

import { ref, onBeforeMount } from 'vue'
import NavigationBar from 'components/NavigationBar.vue'

const calendar = ref<QCalendarMonth>(),
  monthFormatter = getMonthFormatter(),
  selectedDate = ref(today()),
  isoDateRe = /\d{4}-[01]\d-[0-3]\d/,
  month = ref('')

onBeforeMount(() => {
  const parts = selectedDate.value.split('-')
  if (parts[1]) {
    /// @ts-expect-error ignore for now
    month.value = monthFormatter(parseInt(parts[1], 10) - 1)
  }
})

function onToday() {
  if (calendar.value) {
    calendar.value.moveToToday()
  }
}
function onPrev() {
  if (calendar.value) {
    calendar.value.prev()
  }
}
function onNext() {
  if (calendar.value) {
    calendar.value.next()
  }
}
function onMoved(data: Timestamp) {
  console.info('onMoved', data)
}
function onChange(data: { start: Timestamp; end: Timestamp; days: Timestamp[] }) {
  console.info('onChange', data)
  if (data.days[8]) {
    /// @ts-expect-error ignore for now
    month.value = monthFormatter(data.days[8].month - 1)
  }
}
function onClickDate(data: Timestamp) {
  console.info('onClickDate', data)
}
function onClickDay(data: Timestamp) {
  console.info('onClickDay', data)
}
function onClickWorkweek(data: Timestamp) {
  console.info('onClickWorkweek', data)
}
function onClickHeadDay(data: Timestamp) {
  console.info('onClickHeadDay', data)
}
function onClickHeadWorkweek(data: Timestamp) {
  console.info('onClickHeadWorkweek', data)
}
</script>

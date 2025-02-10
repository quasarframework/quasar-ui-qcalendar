<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="q-ma-sm row justify-center q-gutter-sm">
      <q-select
        v-model="locale"
        label="Choose a locale"
        outlined
        dense
        map-options
        emit-value
        options-dense
        :options="locales"
        style="min-width: 180px"
      />
    </div>

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%; height: 400px">
        <q-calendar-day
          ref="calendar"
          v-model="selectedDate"
          view="week"
          :locale="locale"
          bordered
          animated
          :interval-minutes="15"
          :interval-count="96"
          :interval-height="10"
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-time="onClickTime"
          @click-interval="onClickInterval"
          @click-head-intervals="onClickHeadIntervals"
          @click-head-day="onClickHeadDay"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QCalendarDay, today, Timestamp } from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'
import { ref } from 'vue'
import NavigationBar from 'components/NavigationBar.vue'

const calendar = ref<QCalendarDay>()
const selectedDate = ref(today())
const locale = ref('en-US')
const locales = ref([
  { value: 'ar', label: 'العربية' },
  { value: 'bg', label: 'български език' },
  { value: 'ca', label: 'Català' },
  { value: 'cs', label: 'Čeština' },
  { value: 'da', label: 'Dansk' },
  { value: 'de', label: 'Deutsch' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'en-US', label: 'English (US)' },
  { value: 'eo', label: 'Esperanto' },
  { value: 'es', label: 'Español' },
  { value: 'et', label: 'Estonian' },
  { value: 'fa-IR', label: 'فارسی' },
  { value: 'fi', label: 'Suomi' },
  { value: 'fr', label: 'Français' },
  { value: 'gn', label: "Avañe'ẽ" },
  { value: 'he', label: 'עברית' },
  { value: 'hr', label: 'Hrvatski jezik' },
  { value: 'hu', label: 'Magyar' },
  { value: 'id', label: 'Bahasa Indonesia' },
  { value: 'it', label: 'Italiano' },
  { value: 'ja', label: '日本語 (にほんご)' },
  { value: 'km', label: 'ខ្មែរ' },
  { value: 'ko-KR', label: '한국어' },
  { value: 'lu', label: 'Kiluba' },
  { value: 'lv', label: 'Latviešu valoda' },
  { value: 'ml', label: 'മലയാളം' },
  { value: 'ms', label: 'Bahasa Melayu' },
  { value: 'nb-NO', label: 'Norsk' },
  { value: 'nl', label: 'Nederlands' },
  { value: 'pl', label: 'Polski' },
  { value: 'pt-BR', label: 'Português (BR)' },
  { value: 'pt', label: 'Português' },
  { value: 'ro', label: 'Română' },
  { value: 'ru', label: 'русский' },
  { value: 'sk', label: 'Slovenčina' },
  { value: 'sl', label: 'Slovenski Jezik' },
  { value: 'sr', label: 'српски језик' },
  { value: 'sv', label: 'Svenska' },
  { value: 'ta', label: 'தமிழ்' },
  { value: 'th', label: 'ไทย' },
  { value: 'tr', label: 'Türkçe' },
  { value: 'uk', label: 'Українська' },
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'zh-HANS', label: '中文(简体)' },
  { value: 'zh-HANT', label: '中文(繁體)' },
])

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
}
function onClickDate(data: Timestamp) {
  console.info('onClickDate', data)
}
function onClickTime(data: Timestamp) {
  console.info('onClickTime', data)
}
function onClickInterval(data: Timestamp) {
  console.info('onClickInterval', data)
}
function onClickHeadIntervals(data: Timestamp) {
  console.info('onClickHeadIntervals', data)
}
function onClickHeadDay(data: Timestamp) {
  console.info('onClickHeadDay', data)
}
</script>

<template>
  <div class="select">
    <label for="locale">Choose a locale:&nbsp;</label>
    <select
      id="locale"
      v-model="locale"
      name="locale"
    >
      <option
        v-for="local in locales"
        :key="local.value"
        :value="local.value"
      >
        {{ local.label }}
      </option>
    </select>
  </div>

  <div style="margin: 12px;">
    <button
      class="button"
      style="margin: 2px;"
      @click="onToday"
    >
      Today
    </button>
    <button
      class="button"
      style="margin: 2px;"
      @click="onPrev"
    >
      &lt; Prev
    </button>
    <button
      class="button"
      style="margin: 2px;"
      @click="onNext"
    >
      Next &gt;
    </button>
  </div>

  <QCalendarScheduler
    ref="calendar"
    v-model="selectedDate"
    v-model:modelResources="resources"
    view="week"
    :locale="locale"
    animated
    bordered
    style="max-width: 800px; width: 100%; display: inline-flex;"
    @change="onChange"
    @moved="onMoved"
    @click-date="onClickDate"
    @click-day-resource="onClickDayResource"
    @click-resource="onClickResource"
    @click-head-resources="onClickHeadResources"
    @click-head-day="onClickHeadDay"
  />
</template>

<script>
import { QCalendarScheduler } from '@quasar/quasar-ui-qcalendar/QCalendarScheduler.js'
import { today } from '@quasar/quasar-ui-qcalendar/Timestamp.js'
import '@quasar/quasar-ui-qcalendar/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarScheduler.sass'

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SchedulerLocale',
  components: {
    QCalendarScheduler
  },
  data () {
    return {
      selectedDate: today(),
      locale: 'en-us',
      locales: [
        { value: 'ar', label: 'العربية' },
        { value: 'bg', label: 'български език' },
        { value: 'ca', label: 'Català' },
        { value: 'cs', label: 'Čeština' },
        { value: 'da', label: 'Dansk' },
        { value: 'de', label: 'Deutsch' },
        { value: 'en-gb', label: 'English (UK)' },
        { value: 'en-us', label: 'English (US)' },
        { value: 'eo', label: 'Esperanto' },
        { value: 'es', label: 'Español' },
        { value: 'fa-ir', label: 'فارسی' },
        { value: 'fi', label: 'Suomi' },
        { value: 'fr', label: 'Français' },
        { value: 'gn', label: 'Avañe\'ẽ' },
        { value: 'he', label: 'עברית' },
        { value: 'hr', label: 'Hrvatski jezik' },
        { value: 'hu', label: 'Magyar' },
        { value: 'id', label: 'Bahasa Indonesia' },
        { value: 'it', label: 'Italiano' },
        { value: 'ja', label: '日本語 (にほんご)' },
        { value: 'km', label: 'ខ្មែរ' },
        { value: 'ko-kr', label: '한국어' },
        { value: 'lu', label: 'Kiluba' },
        { value: 'lv', label: 'Latviešu valoda' },
        { value: 'ml', label: 'മലയാളം' },
        { value: 'ms', label: 'Bahasa Melayu' },
        { value: 'nb-no', label: 'Norsk' },
        { value: 'nl', label: 'Nederlands' },
        { value: 'pl', label: 'Polski' },
        { value: 'pt-br', label: 'Português (BR)' },
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
        { value: 'zh-hans', label: '中文(简体)' },
        { value: 'zh-hant', label: '中文(繁體)' }
      ],
      resources: [
        { id: 1, label: 'John' },
        { id: 2, label: 'Mary' },
        { id: 3, label: 'Susan' },
        { id: 4, label: 'Olivia' },
        { id: 5, label: 'Board Room' },
        { id: 6, label: 'Room-1' },
        { id: 7, label: 'Room-2' }
      ]
    }
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
    },
    onClickDate (data) {
      console.log('onClickDate', data)
    },
    onClickDayResource (data) {
      console.log('onClickDayResource', data)
    },
    onClickResource (data) {
      console.log('onClickResource', data)
    },
    onClickHeadResources (data) {
      console.log('onClickHeadResources', data)
    },
    onClickHeadDay (data) {
      console.log('onClickHeadDay', data)
    }
  }
})
</script>

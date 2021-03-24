<template>
  <div class="subcontent">
    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div style="display: flex; justify-content: center">
      <div style="display: flex; justify-content: center; align-items: center">
        <label for="locale">Choose a locale:&nbsp;</label>
        <select
          id="locale"
          v-model="locale"
          name="locale"
          class="button select"
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
    </div>

    <div style="display: flex; justify-content: center; align-items: center; flex-wrap: nowrap;">
      <div style="display: flex; max-width: 280px; width: 100%;">
        <q-calendar-month
          ref="calendar"
          v-model="selectedDate"
          mini-mode
          :locale="locale"
          animated
          bordered
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-day="onClickDay"
          @click-workweek="onClickWorkweek"
          @click-head-workweek="onClickHeadWorkweek"
          @click-head-day="onClickHeadDay"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { QCalendarMonth } from '@quasar/quasar-ui-qcalendar/QCalendarMonth.js'
import { today } from '@quasar/quasar-ui-qcalendar/Timestamp.js'
import '@quasar/quasar-ui-qcalendar/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarMonth.sass'

import { defineComponent } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'

export default defineComponent({
  name: 'MiniModeLocale',
  components: {
    NavigationBar,
    QCalendarMonth
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

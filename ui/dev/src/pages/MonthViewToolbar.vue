<template>
  <div style="max-width: 800px; width: 100%;">
    <q-toolbar class="text-primary row justify-between items-center">
      <q-btn-group flat class="col-3">
        <q-btn color="primary" flat label="Prev" @click="onPrev" />
        <q-btn color="primary" flat label="Next" @click="onNext" />
      </q-btn-group>

      <div class="col-4" style="text-align: center;">
      {{ title }}
      </div>

      <q-select
        outlined
        dense
        emit-value
        map-options
        label="Change locale"
        v-model="locale"
        :options="locales"
        class="col-4"
      ></q-select>

    </q-toolbar>
    <q-separator class="full-width" />
    <q-calendar
      ref="calendar"
      v-model="selectedDate"
      view="month"
      :locale="locale"
      :short-weekday-label="shortWeekdayLabel"
      :short-month-label="shortMonthLabel"
      @change="onChange"
    />
  </div>
</template>

<script>
import {
  makeDate
} from 'ui' // alias for '@quasar/quasar-ui-qcalendar'
export default {
  data () {
    return {
      selectedDate: '',
      title: '',
      shortWeekdayLabel: false,
      shortMonthLabel: false,
      dateFormatter: void 0,
      start: void 0,
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

  beforeMount () {
    this.updateFormatter()
  },

  watch: {
    locale () {
      this.updateFormatter()
      this.updateTitle()
    }
  },

  methods: {
    onChange ({ start }) {
      this.start = start
      this.updateTitle()
    },

    onPrev () {
      this.$refs.calendar.prev()
    },

    onNext () {
      this.$refs.calendar.next()
    },

    updateTitle () {
      const myDate = makeDate(this.start)
      if (this.dateFormatter !== void 0) {
        this.title = this.dateFormatter.format(myDate)
      }
    },

    updateFormatter () {
      try {
        this.dateFormatter = new Intl.DateTimeFormat(this.locale || void 0, {
          month: this.shortMonthLabel ? 'short' : 'long',
          year: 'numeric',
          timeZone: 'UTC'
        })
      } catch (e) {
        // console.error('Intl.DateTimeFormat not supported')
        this.dateFormatter = void 0
      }
    }
  }
}
</script>

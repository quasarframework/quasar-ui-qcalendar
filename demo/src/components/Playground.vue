<template>
  <div class="row justify-left" style="width: 100%;">
    <q-dialog v-model="displayLocale">
      <q-card style="min-width: 300px;">
        <q-toolbar class="bg-blue-8 text-grey-1">
          <q-toolbar-title>
            Current local: <strong>{{ displayedLocale }}</strong>
          </q-toolbar-title>
        </q-toolbar>
        <q-card-section class="text-caption">
          Enter a new locale:
        </q-card-section>
        <q-card-section>
          <q-input v-model="locale" autofocus label="Locale"></q-input>
        </q-card-section>
      </q-card>
    </q-dialog>
    <div class="col-12 q-px-md q-pb-sm">
      <q-btn
        dense
        label="Change locale"
        @click="displayLocale = true"
        class="full-width"
      ></q-btn>
      <div class="col-12 q-px-md q-pb-sm">
        <span class="text-body2" >Max days (custom, scheduler)</span>
        <q-slider
          v-model="maxDays"
          :min="1"
          :max="31"
          label
        />
      </div>
      <q-toggle
        class="col-12"
        v-model="fiveDayWorkWeek"
        label="5 day work week"
      ></q-toggle>
      <q-toggle
        class="col-12"
        v-model="firstDayMonday"
        label="Week starts on Monday"
      ></q-toggle>
      <q-toggle
        class="col-12"
        v-model="shortMonthLabel"
        label="Short month label"
      ></q-toggle>
      <q-toggle
        class="col-12"
        v-model="shortWeekdayLabel"
        label="Short weekday label"
      ></q-toggle>
      <q-toggle
        class="col-12"
        v-model="shortIntervalLabel"
        label="Short interval label"
      ></q-toggle>
      <q-toggle
        class="col-12"
        v-model="hour24Format"
        label="24hr interval labels"
      ></q-toggle>
      <q-toggle
        class="col-12"
        v-model="showWorkWeeks"
        label="Show work weeks"
      ></q-toggle>
      <q-toggle
        class="col-12"
        v-model="hideHeader"
        label="Hide header"
      ></q-toggle>
      <q-toggle
        class="col-12"
        v-model="noScroll"
        label="No scroll"
      ></q-toggle>
      <q-toggle
        class="col-12"
        v-model="showMonthLabel"
        label="Show month label"
      ></q-toggle>
      <q-toggle
        class="col-12"
        v-model="showDayOfYearLabel"
        label="Show Day of Year Label"
      ></q-toggle>
      <div class="col-12 q-px-md">
        <span class="text-body2" >Interval Range (daily)</span>
        <q-range
          v-model="intervalRange"
          :min="0"
          :max="24"
          :step="intervalRangeStep"
          label
          :left-label-value="leftLabelRange"
          :right-label-value="rightLabelRange"
        />
      </div>
      <div class="col-12 q-px-md q-pb-sm">
        <span class="text-body2" >Interval Step</span>
        <div class="q-gutter-sm">
          <q-radio v-model="intervalRangeStep" :val="1" label="60 min" />
          <q-radio v-model="intervalRangeStep" :val="0.5" label="30 min" />
          <q-radio v-model="intervalRangeStep" :val="0.25" label="15 min" />
        </div>
      </div>
      <div class="col-12 q-px-md q-pb-sm">
        <span class="text-body2" >Interval height (daily)</span>
        <q-slider
          v-model="intervalHeight"
          :min="20"
          :max="100"
          label
          :label-value="intervalHeight + 'px'"
        />
      </div>
      <div class="col-12 q-px-md q-pb-sm">
        <span class="text-body2" >Day height (monthly)</span>
        <q-slider
          v-model="dayHeight"
          :min="0"
          :max="200"
          label
          :label-value="dayHeight + 'px'"
        />
      </div>
      <div class="col-12 q-px-md q-pb-sm">
        <span class="text-body2" >Resource height (scheduler)</span>
        <q-slider
          v-model="resourceHeight"
          :min="20"
          :max="100"
          label
          :label-value="resourceHeight + 'px'"
        />
      </div>
      <div class="col-12 q-px-md q-pb-sm">
        <span class="text-body2" >Resource width (scheduler)</span>
        <q-slider
          v-model="resourceWidth"
          :min="50"
          :max="200"
          label
          :label-value="resourceWidth + 'px'"
        />
      </div>
      <q-toggle
        class="col-12"
        v-model="enableTheme"
        label="Enable themes"
      ></q-toggle>
      <q-select
        outlined
        dense
        emit-value
        map-options
        label="Change theme"
        v-model="theme"
        :options="themesList"
        :disable="enableTheme !== true"
        class="col-12"
      ></q-select>
    </div>
  </div>
</template>

<script>
import { Platform } from 'quasar'
import themes from '../util/themes'
export default {
  name: 'Playground',
  data () {
    return {
      displayLocale: false
    }
  },
  mounted () {
    if (Platform.is.mobile) {
      this.shortMonthLabel = true
      this.shortWeekdayLabel = true
      this.shortIntervalLabel = true
      this.hour24Format = true
    }
  },
  computed: {
    leftLabelRange () {
      const a = Math.floor(this.intervalRange.min)
      const b = Number((this.intervalRange.min % 1).toFixed(2))
      const c = 60 * b
      return a + ':' + (c < 10 ? c + '0' : c)
    },
    rightLabelRange () {
      const a = Math.floor(this.intervalRange.max)
      const b = Number((this.intervalRange.max % 1).toFixed(2))
      const c = 60 * b
      return a + ':' + (c < 10 ? c + '0' : c)
    },
    displayedLocale () {
      if (this.locale === void 0 || this.locale === '') {
        return 'en-US'
      }
      return this.locale
    },
    locale:
    {
      get () {
        return this.$store.state.calendar.locale
      },
      set (locale) {
        this.$store.commit('calendar/locale', locale)
      }
    },
    maxDays: {
      get () {
        return this.$store.state.calendar.maxDays
      },
      set (days) {
        this.$store.commit('calendar/maxDays', days)
      }
    },
    fiveDayWorkWeek: {
      get () {
        return this.$store.state.calendar.fiveDayWorkWeek
      },
      set (b) {
        this.$store.commit('calendar/fiveDayWorkWeek', b)
      }
    },
    firstDayMonday: {
      get () {
        return this.$store.state.calendar.firstDayMonday
      },
      set (b) {
        this.$store.commit('calendar/firstDayMonday', b)
      }
    },
    shortMonthLabel: {
      get () {
        return this.$store.state.calendar.shortMonthLabel
      },
      set (b) {
        this.$store.commit('calendar/shortMonthLabel', b)
      }
    },
    showDayOfYearLabel: {
      get () {
        return this.$store.state.calendar.showDayOfYearLabel
      },
      set (b) {
        this.$store.commit('calendar/showDayOfYearLabel', b)
      }
    },
    shortWeekdayLabel: {
      get () {
        return this.$store.state.calendar.shortWeekdayLabel
      },
      set (b) {
        this.$store.commit('calendar/shortWeekdayLabel', b)
      }
    },
    shortIntervalLabel: {
      get () {
        return this.$store.state.calendar.shortIntervalLabel
      },
      set (b) {
        this.$store.commit('calendar/shortIntervalLabel', b)
      }
    },
    hour24Format: {
      get () {
        return this.$store.state.calendar.hour24Format
      },
      set (b) {
        this.$store.commit('calendar/hour24Format', b)
      }
    },
    hideHeader: {
      get () {
        return this.$store.state.calendar.hideHeader
      },
      set (b) {
        this.$store.commit('calendar/hideHeader', b)
      }
    },
    noScroll: {
      get () {
        return this.$store.state.calendar.noScroll
      },
      set (b) {
        this.$store.commit('calendar/noScroll', b)
      }
    },
    showMonthLabel: {
      get () {
        return this.$store.state.calendar.showMonthLabel
      },
      set (b) {
        this.$store.commit('calendar/showMonthLabel', b)
      }
    },
    showWorkWeeks: {
      get () {
        return this.$store.state.calendar.showWorkWeeks
      },
      set (b) {
        this.$store.commit('calendar/showWorkWeeks', b)
      }
    },
    intervalRange: {
      get () {
        return this.$store.state.calendar.intervalRange
      },
      set (range) {
        this.$store.commit('calendar/intervalRange', range)
      }
    },
    intervalRangeStep: {
      get () {
        return this.$store.state.calendar.intervalRangeStep
      },
      set (step) {
        this.$store.commit('calendar/intervalRangeStep', step)
      }
    },
    intervalHeight: {
      get () {
        return this.$store.state.calendar.intervalHeight
      },
      set (height) {
        this.$store.commit('calendar/intervalHeight', height)
      }
    },
    resourceHeight: {
      get () {
        return this.$store.state.calendar.resourceHeight
      },
      set (height) {
        this.$store.commit('calendar/resourceHeight', height)
      }
    },
    resourceWidth: {
      get () {
        return this.$store.state.calendar.resourceWidth
      },
      set (height) {
        this.$store.commit('calendar/resourceWidth', height)
      }
    },
    dayHeight: {
      get () {
        return this.$store.state.calendar.dayHeight
      },
      set (height) {
        this.$store.commit('calendar/dayHeight', height)
      }
    },
    enableTheme: {
      get () {
        return this.$store.state.calendar.enableTheme
      },
      set (b) {
        this.$store.commit('calendar/enableTheme', b)
      }
    },
    themes: {
      get () {
        return themes
      }
    },
    theme:
    {
      get () {
        return this.$store.state.calendar.theme
      },
      set (theme) {
        this.$store.commit('calendar/theme', theme)
      }
    },
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

  watch: {
    intervalRangeStep (val) {
      // normalize min/max values according to the step value
      const calcMin = (range) => {
        const b = Number((range % 1).toFixed(2))
        const c = b % val
        if (c > 0) {
          return range + c
        }
        return range
      }
      const calcMax = (range) => {
        const b = Number((range % 1).toFixed(2))
        const c = b % val
        if (c > 0) {
          return range - c
        }
        return range
      }
      this.intervalRange.min = calcMin(this.intervalRange.min)
      this.intervalRange.max = calcMax(this.intervalRange.max)
    }
  }
}
</script>

<style>
</style>

<template>
  <div
    class="row justify-left"
    style="width: 100%;"
  >
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
          <q-input
            v-model="locale"
            autofocus
            label="Locale"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
    <div class="col-12 full-width q-px-md q-pb-sm">
      <q-btn
        dense
        label="Change locale"
        class="full-width"
        @click="displayLocale = true"
      />
      <div class="col-12 full-width q-px-md q-pb-sm">
        <span class="text-body2">Max days (custom, scheduler, agenda)</span>
        <q-slider
          v-model="maxDays"
          :min="1"
          :max="31"
          label
        />
      </div>
      <q-toggle
        v-model="bordered"
        class="col-12 full-width"
        label="bordered"
      />
      <q-toggle
        v-model="fiveDayWorkWeek"
        class="col-12 full-width"
        label="5 day work week"
      />
      <q-toggle
        v-model="firstDayMonday"
        class="col-12 full-width"
        label="Week starts on Monday"
      />
      <q-toggle
        v-model="shortMonthLabel"
        class="col-12 full-width"
        label="Short month label"
      />
      <q-toggle
        v-model="shortWeekdayLabel"
        class="col-12 full-width"
        label="Short weekday label"
      />
      <q-toggle
        v-model="shortIntervalLabel"
        class="col-12 full-width"
        label="Short interval label"
      />
      <q-toggle
        v-model="hour24Format"
        class="col-12 full-width"
        label="24hr interval labels"
      />
      <q-toggle
        v-model="showWorkWeeks"
        class="col-12 full-width"
        label="Show work weeks"
      />
      <q-toggle
        v-model="noDefaultHeaderBtn"
        class="col-12 full-width"
        label="No Default Header Button"
      />
      <q-toggle
        v-model="noDefaultHeaderText"
        class="col-12 full-width"
        label="No Default Header Text"
      />
      <q-toggle
        v-model="hideHeader"
        class="col-12 full-width"
        label="Hide header"
      />
      <q-toggle
        v-model="noScroll"
        class="col-12 full-width"
        label="No scroll"
      />
      <q-toggle
        v-model="showMonthLabel"
        class="col-12 full-width"
        label="Show month label"
      />
      <q-toggle
        v-model="showDayOfYearLabel"
        class="col-12 full-width"
        label="Show Day of Year Label"
      />
      <div class="col-12 full-width q-px-md">
        <span class="text-body2">Interval Range (daily)</span>
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
      <div class="col-12 full-width q-px-md q-pb-sm">
        <span class="text-body2">Interval Step</span>
        <div class="q-gutter-sm">
          <q-radio
            v-model="intervalRangeStep"
            :val="1"
            label="60 min"
          />
          <q-radio
            v-model="intervalRangeStep"
            :val="0.5"
            label="30 min"
          />
          <q-radio
            v-model="intervalRangeStep"
            :val="0.25"
            label="15 min"
          />
        </div>
      </div>
      <div class="col-12 full-width q-px-md q-pb-sm">
        <span class="text-body2">Interval height (daily)</span>
        <q-slider
          v-model="intervalHeight"
          :min="20"
          :max="100"
          label
          :label-value="intervalHeight + 'px'"
        />
      </div>
      <div class="col-12 full-width q-px-md q-pb-sm">
        <span class="text-body2">Day height (monthly)</span>
        <q-slider
          v-model="dayHeight"
          :min="0"
          :max="200"
          label
          :label-value="dayHeight + 'px'"
        />
      </div>
      <div class="col-12 full-width q-px-md q-pb-sm">
        <span class="text-body2">Resource height (scheduler)</span>
        <q-slider
          v-model="resourceHeight"
          :min="20"
          :max="100"
          label
          :label-value="resourceHeight + 'px'"
        />
      </div>
      <div class="col-12 full-width q-px-md q-pb-sm">
        <span class="text-body2">Resource width (scheduler)</span>
        <q-slider
          v-model="resourceWidth"
          :min="50"
          :max="200"
          label
          :label-value="resourceWidth + 'px'"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { Platform } from 'quasar'
export default {
  name: 'Playground',
  data () {
    return {
      displayLocale: false
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
      if (this.locale === undefined || this.locale === '') {
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
    bordered: {
      get () {
        return this.$store.state.calendar.bordered
      },
      set (b) {
        this.$store.commit('calendar/bordered', b)
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
    noDefaultHeaderBtn: {
      get () {
        return this.$store.state.calendar.noDefaultHeaderBtn
      },
      set (b) {
        this.$store.commit('calendar/noDefaultHeaderBtn', b)
      }
    },
    noDefaultHeaderText: {
      get () {
        return this.$store.state.calendar.noDefaultHeaderText
      },
      set (b) {
        this.$store.commit('calendar/noDefaultHeaderText', b)
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
  },
  mounted () {
    if (Platform.is.mobile) {
      this.shortMonthLabel = true
      this.shortWeekdayLabel = true
      this.shortIntervalLabel = true
      this.hour24Format = true
    }
  }
}
</script>

<style>
</style>

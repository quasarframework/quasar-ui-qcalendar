<template>
  <q-layout view="HHh LpR lFf">

    <q-header elevated>
      <q-resize-observer @resize="onTitlebarResized"></q-resize-observer>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu"></q-icon>
        </q-btn>

        <q-icon name="far fa-calendar-alt" class="q-ml-md" size="1.5rem"></q-icon>

        <q-toolbar-title>
          QCalendar <span class="text-subtitle2">v{{ version }}</span>
        </q-toolbar-title>

        <q-btn flat dense label="Today" class="q-mx-md" @click="setToday"></q-btn>
        <q-btn flat dense round icon="keyboard_arrow_left" @click="onPrev"></q-btn>
        <q-btn flat dense round icon="keyboard_arrow_right" @click="onNext"></q-btn>
        <span class="q-mr-xl q-toolbar__title nowrap">{{ title }}</span>
        <q-select
          v-model="calendarView"
          :options="viewOptions"
          outlined
          dark
          :options-dark="$q.dark.isActive"
          dense
          options-dense
          emit-value
          map-options
          :input-class="contentClass"
          :popup-content-class="contentClass"
          style="min-width: 120px; background: transparent; color: white"
        ></q-select>

        <q-space></q-space>

        <q-btn flat round @click="$q.dark.toggle()" :icon="$q.dark.isActive ? 'brightness_2' : 'brightness_5'" />
        <div v-if="$q.screen.width > 500">Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      aria-label="Menu"
      class="menu"
      :width="350"
    >
      <div class="row justify-around col-12">
        <q-date
          v-model="selectedDateForQDate"
          minimal
          class="fit"
          :first-day-of-week="firstDayMonday === true ? 1 : 0"
          :options="options"
        ></q-date>
      </div>
      <q-separator />
      <div class="col-12">
        <q-expansion-item
          expand-separator
          default-opened
          group="somegroup"
          icon="fas fa-cogs"
          label="Playground"
          caption="Play with properties"
        >
          <q-separator />
          <playground></playground>
        </q-expansion-item>
        <q-separator />
        <q-expansion-item
          expand-separator
          group="somegroup"
          icon="fas fa-link"
          label="Essential Links"
        >
          <q-separator />
          <essential-links />
        </q-expansion-item>
        <q-separator />
      </div>
    </q-drawer>

    <q-page-container>
      <router-view></router-view>
    </q-page-container>

  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import { getLocale } from '../util/getLocale'
import { padTime } from '../util/time'
import { version } from 'ui'

export default {
  name: 'CalendarLayout',
  components: {
    playground: () => import('../components/Playground'),
    'essential-links': () => import('../components/EssentialLinks')
  },
  data () {
    return {
      version: version,
      leftDrawerOpen: this.$q.platform.is.desktop,
      titleFormatter: null,
      dateFormatter: null,
      viewOptions: [
        { label: 'Day', value: 'day' },
        { label: 'Week', value: 'week' },
        { label: 'Month', value: 'month' },
        { label: 'Month Interval', value: 'month-interval' },
        { label: 'Custom Interval', value: 'custom-interval' },
        { label: 'Scheduler', value: 'scheduler' },
        { label: 'Week Scheduler', value: 'week-scheduler' },
        { label: 'Month Scheduler', value: 'month-scheduler' },
        { label: 'Resource', value: 'resource' },
        { label: 'Agenda', value: 'agenda' },
        { label: 'Week Agenda', value: 'week-agenda' },
        { label: 'Month Agenda', value: 'month-agenda' },
        { label: 'Custom Agenda', value: 'custom-agenda' }
      ]
    }
  },
  beforeMount () {
    this.locale = getLocale()
    this.updateFormatters()
  },
  computed: {
    ...mapGetters({
      bordered: 'calendar/bordered',
      fiveDayWorkWeek: 'calendar/fiveDayWorkWeek',
      firstDayMonday: 'calendar/firstDayMonday'
    }),
    contentClass () {
      if (this.$q.dark.isActive !== true) {
        return 'text-primary bg-white'
      }
      return ''
    },
    title () {
      if (this.titleFormatter && this.locale && this.selectedDate) {
        const date = new Date(this.selectedDate)
        return this.titleFormatter.format(date)
      }
      return ''
    },
    calendarView: {
      get () {
        return this.$store.state.calendar.calendarView
      },
      set (view) {
        this.$store.commit('calendar/calendarView', view)
      }
    },
    selectedDate: {
      get () {
        return this.$store.state.calendar.selectedDate
      },
      set (date) {
        this.$store.commit('calendar/selectedDate', date)
      }
    },
    selectedDateForQDate:
    {
      get () {
        if (this.$store.state.calendar.selectedDate) {
          return this.$store.state.calendar.selectedDate.replace(/-/g, '/')
        } else {
          return ''
        }
      },
      set (date) {
        this.$store.commit('calendar/selectedDate', date.replace(/\//g, '-'))
        this.selectedView = 'day'
      }
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
    titlebarHeight: {
      get () {
        return this.$store.state.common.titlebarHeight
      },
      set (height) {
        this.$store.commit('common/titlebarHeight', height)
      }
    },
    shortMonthLabel: {
      get () {
        return this.$store.state.calendar.shortMonthLabel
      },
      set (b) {
        this.$store.commit('calendar/shortMonthLabel', b)
      }
    }
  },
  watch: {
    locale () {
      if (this.locale.length > 2) {
        this.updateFormatters()
      }
    },
    shortMonthLabel () {
      this.updateFormatters()
    }
  },
  methods: {
    onPrev () {
      this.$root.$emit('calendar:prev')
    },
    onNext () {
      this.$root.$emit('calendar:next')
    },
    onTitlebarResized (size) {
      this.titlebarHeight = size.height
    },
    setToday () {
      this.$root.$emit('calendar:today', this.formatDate())
    },
    formatDate (date) {
      const d = date !== void 0 ? new Date(date) : new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()

      return [year, padTime(month), padTime(day)].join('-')
    },
    updateFormatters () {
      try {
        this.dateFormatter = new Intl.DateTimeFormat(this.locale || void 0, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'UTC'
        })
        this.titleFormatter = new Intl.DateTimeFormat(this.locale || void 0, {
          month: this.shortMonthLabel ? 'short' : 'long',
          year: 'numeric',
          timeZone: 'UTC'
        })
      } catch (e) {
        // console.error('Intl.DateTimeFormat not supported')
        this.dateFormatter = void 0
        this.titleFormatter = void 0
      }
    },
    options (date) {
      if (this.fiveDayWorkWeek) {
        // figure out if date is a weekend,
        const parts = date.split('/')
        // acount for months starting at 0
        const time = new Date(parts[0], parts[1] - 1, parts[2])
        return !!(time.getDay() % 6)
      }
      return true
    }
  }
}
</script>

<style>
.q-date {
    box-shadow: none!important;
    border-radius: 0!important;
}
.q-date__view {
    padding: 0!important;
}
.q-date--portrait-minimal {
    width: auto!important;
}
</style>

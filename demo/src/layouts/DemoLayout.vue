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
    >
      <div class="col-12">
        <q-expansion-item
          expand-separator
          default-opened
          group="somegroup"
          icon="fas fa-cogs"
          label="QCalendar"
          caption="QCalendar Examples"
          class="menu"
        >
          <q-separator />
          <q-list dense>

            <q-item
              to="/examples/day-view"
              clickable
            >
              <q-item-section avatar>
                <q-icon name="fas fa-calendar-day" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Day View</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              to="/examples/week-view"
              clickable
            >
              <q-item-section avatar>
                <q-icon name="fas fa-calendar-week" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Week View</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              to="/examples/month-view"
              clickable
            >
              <q-item-section avatar>
                <q-icon name="fas fa-calendar-alt" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Month View</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              to="/examples/scheduler-view"
              clickable
            >
              <q-item-section avatar>
                <q-icon name="fas fa-calendar" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Scheduler View</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              to="/examples/agenda-view"
              clickable
            >
              <q-item-section avatar>
                <q-icon name="view_agenda" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Agenda View</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              to="/demos/planner"
              clickable
            >
              <q-item-section avatar>
                <q-icon name="far fa-calendar-alt" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Planner</q-item-label>
              </q-item-section>
            </q-item>

            <!-- <q-item clickable to="/examples/customization">
              <q-item-section>
                <q-item-label>Customization</q-item-label>
              </q-item-section>
            </q-item> -->

          </q-list>
        </q-expansion-item>

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
import { getLocale } from '../util/getLocale'
import { padTime } from '../util/time'
import { version } from 'ui'

export default {
  name: 'CalendarLayout',
  components: {
    'essential-links': () => import('../components/EssentialLinks')
  },
  data () {
    return {
      version: version,
      leftDrawerOpen: this.$q.platform.is.desktop,
      titleFormatter: null,
      dateFormatter: null
    }
  },
  beforeMount () {
    this.locale = getLocale()
    this.updateFormatters()
  },
  computed: {
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

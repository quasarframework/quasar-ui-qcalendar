<template>
  <q-layout view="HHh Lpr lFf">

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

        <q-toolbar-title v-if="$q.screen.width > 500">
          Quasar Calendar
          <q-tooltip v-if="$q.screen.width < 1077">
            Quasar Calendar
          </q-tooltip>
        </q-toolbar-title>

        <q-btn flat dense label="Today" class="q-mx-md" @click="setToday"></q-btn>
        <q-btn flat dense round icon="keyboard_arrow_left" @click="onPrev"></q-btn>
        <q-btn flat dense round icon="keyboard_arrow_right" @click="onNext"></q-btn>
        <span class="q-mr-xl q-toolbar__title nowrap">{{ title }}</span>
        <q-select
          outlined
          dense
          dark
          v-model="calendarView"
          :options="viewOptions"
          emit-value
          map-options
          style="min-width: 120px;"
        ></q-select>
        <q-space></q-space>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      content-class="white"
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
      <div class="col-12">
        <q-expansion-item
          expand-separator
          default-opened
          group="somegroup"
          icon="fas fa-cogs"
          label="Playground"
          caption="Play with properties"
        >
          <playground></playground>
        </q-expansion-item>
        <q-expansion-item
          expand-separator
          group="somegroup"
          icon="fas fa-link"
          label="Essential Links"
        >
          <q-list>
            <q-item clickable tag="a" target="_blank" href="http://quasar.dev">
              <q-item-section avatar>
                <q-icon name="school"></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label>Docs</q-item-label>
                <q-item-label caption>quasar.dev</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable tag="a" target="_blank" href="https://github.com/quasarframework/">
              <q-item-section avatar>
                <q-icon name="code"></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label>Github</q-item-label>
                <q-item-label caption>github.com/quasarframework</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable tag="a" target="_blank" href="http://chat.quasar.dev">
              <q-item-section avatar>
                <q-icon name="chat"></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label>Discord Chat Channel</q-item-label>
                <q-item-label caption>chat.quasar.dev</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable tag="a" target="_blank" href="https://forum.quasar.dev">
              <q-item-section avatar>
                <q-icon name="record_voice_over"></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label>Forum</q-item-label>
                <q-item-label caption>forum.quasar.dev</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable tag="a" target="_blank" href="https://twitter.com/quasarframework">
              <q-item-section avatar>
                <q-icon name="rss_feed"></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label>Twitter</q-item-label>
                <q-item-label caption>@quasarframework</q-item-label>
              </q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable to="/docs">
              <q-item-section avatar>
                <q-icon name="calendar_today" />
              </q-item-section>
              <q-item-section>
                <q-item-label>QCalendar docs</q-item-label>
                <q-item-label caption>Documentation</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable to="/demo">
              <q-item-section avatar>
                <q-icon name="calendar_today" />
              </q-item-section>
              <q-item-section>
                <q-item-label>QCalendar demo</q-item-label>
                <q-item-label caption>Interactively play with properties</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable to="/examples">
              <q-item-section avatar>
                <q-icon name="calendar_today" />
              </q-item-section>
              <q-item-section>
                <q-item-label>QCalendar examples</q-item-label>
                <q-item-label caption>Examples of how to do it</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import { openURL } from 'quasar'
import { getLocale } from '../util/getLocale'
import { padTime } from '../util/time'

export default {
  name: 'CalendarLayout',
  components: {
    'playground': () => import('../components/Playground')
  },
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      titleFormatter: null,
      dateFormatter: null,
      viewOptions: [
        { label: 'View Day', value: 'day' },
        { label: 'View 5 Days', value: '5day' },
        { label: 'View Week', value: 'week' },
        { label: 'View Month', value: 'month' }
      ]
    }
  },
  beforeMount () {
    this.locale = getLocale()
    this.updateFormatters()
  },
  computed: {
    ...mapGetters({
      fiveDayWorkWeek: 'calendar/fiveDayWorkWeek',
      firstDayMonday: 'calendar/firstDayMonday'
    }),
    title () {
      if (this.titleFormatter && this.locale) {
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
        return this.$store.state.calendar.selectedDate.replace(/-/g, '/')
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
    openURL,
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
      let d = date !== void 0 ? new Date(date) : new Date(),
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
        console.error('Intl.DateTimeFormat not supported')
        this.dateFormatter = void 0
        this.titleFormatter = void 0
      }
    },
    options (date) {
      if (this.fiveDayWorkWeek) {
        // figure out if date is a weekend,
        let parts = date.split('/')
        // acount for months starting at 0
        let time = new Date(parts[0], parts[1] - 1, parts[2])
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
    background: #fff;
}
.q-date__view {
    padding: 0!important;
}
.q-date--portrait-minimal {
    width: auto!important;
}
</style>

<template>
  <q-page class="column" style="overflow: hidden">
    <!-- display an event -->
    <q-dialog v-model="displayEvent">
      <div>
        <q-card v-if="event">
          <q-toolbar :class="displayClasses(event)" :style="displayStyles(event)" style="min-width: 400px;">
            <q-toolbar-title>
              {{ event.title }}
            </q-toolbar-title>
            <q-btn flat round color="white" icon="delete" v-close-popup @click="deleteEvent(event)"></q-btn>
            <q-btn flat round color="white" icon="edit" v-close-popup @click="editEvent(event)"></q-btn>
            <q-btn flat round color="white" icon="cancel" v-close-popup></q-btn>
          </q-toolbar>
          <q-card-section class="inset-shadow">
            <div v-if="event.allDay" class="text-caption">{{ getEventDate(event) }}</div>
            {{ event.details }}
            <div v-if="event.time" class="text-caption">
              <div class="row full-width justify-start" style="padding-top: 12px;">
                <div class="col-12">
                  <div class="row full-width justify-start">
                    <div class="col-5" style="padding-left: 20px;">
                      <strong>Start Time:</strong>
                    </div>
                    <div class="col-7">
                      {{ event.time }}
                    </div>
                  </div>
                  <div class="row full-width justify-start">
                    <div class="col-5" style="padding-left: 20px;">
                      <strong>End Time:</strong>
                    </div>
                    <div class="col-7">
                      {{ getEndTime(event) }}
                    </div>
                  </div>
                  <div class="row full-width justify-start">
                    <div class="col-5" style="padding-left: 20px;">
                      <strong>Duration:</strong>
                    </div>
                    <div class="col-7">
                      {{ convertDurationTime(event.duration) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="OK" color="primary" v-close-popup></q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </q-dialog>
    <!-- add/edit an event -->
    <q-dialog v-model="addEvent" no-backdrop-dismiss>
      <div>
        <q-form
          v-if="contextDay"
          ref='event'
          @submit="onSubmit"
          @reset="onReset"
        >
          <q-card v-if="addEvent" style="width: 400px;">
            <q-toolbar class="bg-primary text-white">
              <q-toolbar-title>
                {{ addOrUpdateEvent }} Event
              </q-toolbar-title>
              <q-btn flat round color="white" icon="close" v-close-popup></q-btn>
            </q-toolbar>
            <q-card-section class="inset-shadow">
              <q-input
                v-model="eventForm.title"
                label="Title"
                :rules="[v => v && v.length > 0 || 'Field cannot be empty']"
                autofocus
              />
              <q-input
                v-model="eventForm.details"
                label="Details"
              />
              <q-field
                v-model="eventForm.allDay"
                style="padding-bottom: 20px;"
              >
                <q-checkbox
                  v-model="eventForm.allDay"
                  label="All-Day event?"
                />
              </q-field>

              <q-input
                v-if="eventForm.allDay"
                v-model="eventForm.dateTimeStart"
                label="Enter date"
                mask="####-##-##"
                color="blue-6"
                outlined
                style="padding-bottom: 20px;"
              >
                <template #append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy v-model="showDateScrollerAllDay">

                      <q-scroller
                        v-model="eventForm.dateTimeStart"
                        view="date"
                        :locale="locale"
                        :hour24-format="true"
                        :rounded-borders="true"
                        border-color="#2196f3"
                        bar-color="#2196f3"
                        text-color="white"
                        color="primary"
                        inner-text-color="primary"
                        inner-color="white"
                        :style="scrollerPopupStyle160"
                        @close="() => { showDateScrollerAllDay = false }"
                      />

                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <div v-else>
                <q-input
                  v-model="eventForm.dateTimeStart"
                  ref="dateTimeStart"
                  label="Event start date and time"
                  mask="####-##-## ##:##"
                  :rules="[val => checkDateTimeStart() || 'Start time cannot come after end time']"
                  outlined
                  color="blue-6"
                >
                  <template #append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy v-model="showDateTimeScrollerStart">

                        <q-scroller
                          v-model="eventForm.dateTimeStart"
                          view="date-time"
                          :locale="locale"
                          :hour24-format="true"
                          :rounded-borders="true"
                          border-color="#2196f3"
                          bar-color="#2196f3"
                          color="primary"
                          text-color="white"
                          inner-color="white"
                          inner-text-color="primary "
                          :style="scrollerPopupStyle280"
                          @close="() => { showDateTimeScrollerStart = false }"
                        />

                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>

                <q-input
                  v-model="eventForm.dateTimeEnd"
                  ref="dateTimeEnd"
                  label="Event end date and time"
                  mask="####-##-## ##:##"
                  :rules="[val => checkDateTimeEnd() || 'Start time cannot come after end time']"
                  color="blue-6"
                  outlined
                >
                  <template #append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy v-model="showDateTimeScrollerEnd">

                        <q-scroller
                          v-model="eventForm.dateTimeEnd"
                          view="date-time"
                          :locale="locale"
                          :hour24-format="true"
                          :rounded-borders="true"
                          border-color="#2196f3"
                          bar-color="#2196f3"
                          color="primary"
                          text-color="white"
                          inner-color="white"
                          inner-text-color="primary "
                          :style="scrollerPopupStyle280"
                          @close="() => { showDateTimeScrollerEnd = false }"
                        />

                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>

              <q-input
                v-model="eventForm.icon"
                label="Icon"
                outlined
                clearable
                style="padding-bottom: 20px;"
              >
                <template v-slot:append>
                  <q-icon name="extension" class="cursor-pointer">
                    <q-popup-proxy v-model="showIconPicker">

                      <q-icon-picker
                        v-model="eventForm.icon"
                        :filter="eventForm.icon"
                        icon-set="fontawesome-v5"
                        tooltips
                        :pagination.sync="pagination"
                        style="height: 300px; width: 300px; background-color: white;"
                      />

                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <q-input
                v-model="eventForm.bgcolor"
                label="Color"
                outlined
                clearable
              >
                <template #append>
                  <q-icon name="colorize" class="cursor-pointer">
                    <q-popup-proxy>
                      <q-color v-model="eventForm.bgcolor"></q-color>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="OK" type="submit" color="primary"></q-btn>
              <q-btn flat label="Cancel" type="reset" color="primary" v-close-popup></q-btn>
            </q-card-actions>
          </q-card>
        </q-form>
      </div>
    </q-dialog>

    <!-- the calendar -->
    <div
      class="calendar-container"
      :style="containerStyle"
    >
      <q-calendar
        ref="calendar"
        class="calendar"
        :key="keyValue"
        v-touch-swipe.mouse.left.right="handleSwipe"
        v-model="selectedDate"
        :locale="locale"
        :max-days="maxDays"
        :interval-style="modifiedStyle"
        :day-style="modifiedStyle"
        :resource-style="modifiedStyle"
        animated
        transition-prev="slide-right"
        transition-next="slide-left"
        :drag-over-func="onDragOver"
        :drop-func="onDrop"
        :theme="theme"
        :view="calendarView"
        :weekdays="weekdays"
        :interval-minutes="60 * intervalRangeStep"
        :interval-start="intervalStart"
        :interval-count="intervalCount"
        :hour24-format="hour24Format"
        :short-month-label="shortMonthLabel"
        :show-day-of-year-label="showDayOfYearLabel"
        :hide-header="hideHeader"
        :no-scroll="noScroll"
        :short-weekday-label="shortWeekdayLabel"
        :short-interval-label="shortIntervalLabel"
        :interval-height="intervalHeight"
        :resource-height="resourceHeight"
        :resource-width="resourceWidth"
        :day-height="dayHeight"
        :show-month-label="showMonthLabel"
        :show-work-weeks="showWorkWeeks"
        :no-default-header-btn="noDefaultHeaderBtn"
        :no-default-header-text="noDefaultHeaderText"
        :enable-theme="enableTheme === true"
        :resources="resources"
        @change="onChanged"
        @moved="onMoved"
        @click:date="onDateChanged"
        @click:interval="addEventMenu"
        @click:time="addEventMenu"
        @click:day="addEventMenu"
        @click:week="addEventMenu"
        @click:resource="resourceClicked"
        @click:resource:day="resourceDayClicked"
        dayPadding="35px 2px"
      >
        <template #day="{ date }">
          <template v-for="(event, index) in getEvents(date)">
            <q-badge
              :key="index"
              style="width: 100%; cursor: pointer; height: 14px; max-height: 14px"
              class="ellipsis"
              :class="badgeClasses(event, 'day')"
              :style="badgeStyles(event, 'day')"
              @click.stop.prevent="showEvent(event)"
              :draggable="true"
              @dragstart.native="(e) => onDragStart(e, event)"
              @dragend.native="(e) => onDragEnd(e, event)"
              @dragenter.native="(e) => onDragEnter(e, event)"
              @touchmove.native="(e) => {}"
            >
              <q-icon v-if="event.icon" :name="event.icon" class="q-mr-xs"></q-icon><span class="ellipsis">{{ event.title }}</span>
            </q-badge>
          </template>
        </template>
        <template #day-header="{ date }">
          <div class="row justify-center">
            <template v-for="(event, index) in eventsMap[date]">
              <q-badge
                v-if="!event.time"
                :key="index"
                style="width: 100%; cursor: pointer; height: 14px; max-height: 14px"
                class="ellipsis"
                :class="badgeClasses(event, 'header')"
                :style="badgeStyles(event, 'header')"
                @click.stop.prevent="showEvent(event)"
                :draggable="true"
                @dragstart.native="(e) => onDragStart(e, event)"
                @dragend.native="(e) => onDragEnd(e, event)"
                @dragenter.native="(e) => onDragEnter(e, event)"
                @touchmove.native="(e) => {}"
              >
                <q-icon v-if="event.icon" :name="event.icon" class="q-mr-xs"></q-icon><span class="ellipsis">{{ event.title }}</span>
              </q-badge>
              <q-badge
                v-else
                :key="index"
                class="q-ma-xs self-end"
                :class="badgeClasses(event, 'header')"
                :style="badgeStyles(event, 'header')"
                style="width: 10px; max-width: 10px; height: 10px; max-height: 10px"
              />
            </template>
          </div>
        </template>
        <template #day-body="{ date, timeStartPos, timeDurationHeight }">
          <template v-for="(event, index) in getEvents(date)">
            <q-badge
              v-if="event.time"
              :key="index"
              class="my-event justify-center ellipsis"
              :class="badgeClasses(event, 'body')"
              :style="badgeStyles(event, 'body', timeStartPos, timeDurationHeight)"
              @click.stop.prevent="showEvent(event)"
              :draggable="true"
              @dragstart.native="(e) => onDragStart(e, event)"
              @dragend.native="(e) => onDragEnd(e, event)"
              @dragenter.native="(e) => onDragEnter(e, event)"
              @touchmove.native="(e) => {}"
            >
              <q-icon v-if="event.icon" :name="event.icon" class="q-mr-xs"></q-icon><span class="ellipsis">{{ event.title }}</span>
            </q-badge>
          </template>
        </template>
        <template #intervals-header="days">
          <div class="fit flex justify-center items-end">
            <span class="q-calendar-daily__interval-text">{{ showOffset(days) }}</span>
          </div>
        </template>
      </q-calendar>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
import { mapGetters } from 'vuex'
import { isCssColor } from '../util/color'
import events from '../util/events'
import { padTime } from '../util/time'
import { date, colors, Platform } from 'quasar'
import { stop, prevent, stopAndPrevent } from 'quasar/src/utils/event'
import { parsed, getDayIdentifier, getTimeIdentifier } from 'calendar/component/utils/timestamp'

import 'drag-drop-touch'

const formDefault = {
  title: '',
  details: '',
  allDay: false,
  dateTimeStart: '',
  dateTimeEnd: '',
  icon: '',
  bgcolor: '#0000FF'
}

export default {
  name: 'PageIndex',

  data () {
    return {
      keyValue: 0,
      direction: 'forward',
      weekdays: [0, 1, 2, 3, 4, 5, 6],
      disabledDays: [
        '2019-04-02',
        '2019-04-03',
        '2019-04-04',
        '2019-04-05'
      ],
      addEvent: false,
      contextDay: null,
      eventForm: { ...formDefault },
      displayEvent: false,
      event: null,
      events: [],
      gmt: '',
      dragging: false,
      draggedEvent: null,
      ignoreNextSwipe: false,
      showDateScrollerAllDay: false,
      showDateTimeScrollerStart: false,
      showDateTimeScrollerEnd: false,
      resources: [
        {
          label: 'John'
        },
        {
          label: 'Mary'
        },
        {
          label: 'Susan'
        },
        {
          label: 'Olivia'
        },
        {
          label: 'Board Room'
        },
        {
          label: 'Room-1'
        },
        {
          label: 'Room-2'
        }
      ],
      // Icon picker
      showIconPicker: false,
      pagination: {
        itemsPerPage: 35,
        page: 0
      }
    }
  },
  mounted () {
    this.$root.$on('calendar:next', this.calendarNext)
    this.$root.$on('calendar:prev', this.calendarPrev)
    this.$root.$on('calendar:today', this.calendarToday)
    this.events = events
    this.updateFormatters()
  },
  beforeDestroy () {
    this.$root.$off('calendar:next', this.calendarNext)
    this.$root.$off('calendar:prev', this.calendarPrev)
    this.$root.$off('calendar:today', this.calendarToday)
  },
  computed: {
    ...mapGetters({
      locale: 'calendar/locale',
      titlebarHeight: 'common/titlebarHeight',
      maxDays: 'calendar/maxDays',
      fiveDayWorkWeek: 'calendar/fiveDayWorkWeek',
      firstDayMonday: 'calendar/firstDayMonday',
      shortMonthLabel: 'calendar/shortMonthLabel',
      showDayOfYearLabel: 'calendar/showDayOfYearLabel',
      shortWeekdayLabel: 'calendar/shortWeekdayLabel',
      shortIntervalLabel: 'calendar/shortIntervalLabel',
      hour24Format: 'calendar/hour24Format',
      hideHeader: 'calendar/hideHeader',
      noScroll: 'calendar/noScroll',
      showMonthLabel: 'calendar/showMonthLabel',
      showWorkWeeks: 'calendar/showWorkWeeks',
      noDefaultHeaderBtn: 'calendar/noDefaultHeaderBtn',
      noDefaultHeaderText: 'calendar/noDefaultHeaderText',
      intervalRange: 'calendar/intervalRange',
      intervalRangeStep: 'calendar/intervalRangeStep',
      intervalHeight: 'calendar/intervalHeight',
      resourceHeight: 'calendar/resourceHeight',
      resourceWidth: 'calendar/resourceWidth',
      dayHeight: 'calendar/dayHeight',
      enableTheme: 'calendar/enableTheme',
      theme: 'calendar/theme'
    }),
    intervalStart () {
      return this.intervalRange.min * (1 / this.intervalRangeStep)
    },
    intervalCount () {
      return (this.intervalRange.max - this.intervalRange.min) * (1 / this.intervalRangeStep)
    },
    selectedDate: {
      get () {
        return this.$store.state.calendar.selectedDate
      },
      set (date) {
        this.$store.commit('calendar/selectedDate', date)
      }
    },
    calendarView: {
      get () {
        return this.$store.state.calendar.calendarView
      },
      set (view) {
        this.$store.commit('calendar/calendarView', view)
      }
    },
    containerStyle () {
      let styles = {}
      if (this.calendarView !== 'month') {
        styles.height = `calc(100vh - ${this.titlebarHeight}px)`
      }
      return styles
    },
    // convert the events into a map of lists keyed by date
    eventsMap () {
      const map = {}
      this.events.forEach((event) => (map[event.date] = map[event.date] || []).push(event))
      return map
    },
    addOrUpdateEvent () {
      if (this.contextDay && this.contextDay.bgcolor) {
        return 'Update'
      }
      return 'Add'
    },
    scrollerPopupStyle160 () {
      if (this.$q.screen.lt.sm) {
        return {
          width: '100vw',
          height: '100vh'
        }
      } else {
        return {
          maxHeight: '400px',
          height: '400px',
          width: '160px'
        }
      }
    },
    scrollerPopupStyle280 () {
      if (this.$q.screen.lt.sm) {
        return {
          width: '100vw',
          height: '100vh'
        }
      } else {
        return {
          maxHeight: '400px',
          height: '400px',
          width: '280px'
        }
      }
    }
  },
  watch: {
    // selectedDate (val) {
    //   console.log('selectedDate: ', val)
    // },
    fiveDayWorkWeek () {
      if (this.fiveDayWorkWeek) {
        this.weekdays = [1, 2, 3, 4, 5]
        this.view = '5day'
      } else {
        if (this.view === '5day') {
          this.view = 'month'
        }
        if (this.firstDayMonday) {
          this.weekdays = [1, 2, 3, 4, 5, 6, 0]
        } else {
          this.weekdays = [0, 1, 2, 3, 4, 5, 6]
        }
      }
    },
    firstDayMonday () {
      if (this.fiveDayWorkWeek) {
        this.weekdays = [1, 2, 3, 4, 5]
        this.view = '5day'
      } else {
        if (this.view === '5day') {
          this.view = 'month'
        }
        if (this.firstDayMonday) {
          this.weekdays = [1, 2, 3, 4, 5, 6, 0]
        } else {
          this.weekdays = [0, 1, 2, 3, 4, 5, 6]
        }
      }
    },
    locale () {
      this.updateFormatters()
    }
  },
  methods: {
    calendarNext () {
      this.$refs.calendar.next()
    },
    calendarPrev () {
      this.$refs.calendar.prev()
    },
    calendarToday (today) {
      this.selectedDate = today
    },
    modifiedStyle (scope) {
      let date = scope
      if ('resource' in scope) {
        date = scope.day
      }
      if (date.disabled === true) {
        return {
          backgroundColor: '#efefef!important'
        }
      }
      return {}
    },
    onChanged (data) {
      // uncomment to see data in console
      // let { start, end } = data
      // console.log('onChanged:', start, end)
    },
    onMoved (moved) {
      // uncomment to see data in console
      // console.log('onMoved:', moved)
    },
    getEvents (dt) {
      let events = []
      for (let i = 0; i < this.events.length; ++i) {
        let added = false
        if (this.events[i].date === dt) {
          if (this.events[i].time) {
            if (events.length > 0) {
              // check for overlapping times
              let startTime = new Date(this.events[i].date + ' ' + this.events[i].time).getTime()
              let endTime = date.addToDate(startTime, { minutes: this.events[i].duration }).getTime()
              for (let j = 0; j < events.length; ++j) {
                let startTime2 = new Date(events[j].date + ' ' + events[j].time).getTime()
                let endTime2 = date.addToDate(startTime2, { minutes: events[j].duration }).getTime()
                if ((startTime >= startTime2 && startTime < endTime2) || (startTime2 >= startTime && startTime2 < endTime)) {
                  events[j].side = 'left'
                  this.events[i].side = 'right'
                  events.push(this.events[i])
                  added = true
                  break
                }
              }
            }
          }
          if (!added) {
            this.events[i].side = void 0
            events.push(this.events[i])
          }
        } else if (this.events[i].days) {
          // check for overlapping dates
          let startDate = new Date(this.events[i].date)
          let endDate = date.addToDate(startDate, { days: this.events[i].days })
          if (date.isBetweenDates(dt, startDate, endDate)) {
            events.push(this.events[i])
            added = true
          }
        }
      }
      return events
    },
    checkDateTimeStart (/* val */) {
      this.$refs.dateTimeEnd.resetValidation()
      if (this.eventForm.dateTimeStart && this.eventForm.dateTimeEnd) {
        const timestampStart = parsed(this.eventForm.dateTimeStart)
        const timestampEnd = parsed(this.eventForm.dateTimeEnd)
        const dayStart = getDayIdentifier(timestampStart)
        const dayEnd = getDayIdentifier(timestampEnd)
        if (dayStart < dayEnd) {
          return true
        } else if (dayStart > dayEnd) {
          return false
        } else {
          const timeStart = getTimeIdentifier(timestampStart)
          const timeEnd = getTimeIdentifier(timestampEnd)
          if (timeStart <= timeEnd) {
            return true
          } else {
            return false
          }
        }
      }
      return false
    },

    checkDateTimeEnd (val) {
      this.$refs.dateTimeStart.resetValidation()
      if (this.eventForm.dateTimeStart && this.eventForm.dateTimeEnd) {
        const timestampEnd = parsed(this.eventForm.dateTimeEnd)
        const timestampStart = parsed(this.eventForm.dateTimeStart)
        const dayEnd = getDayIdentifier(timestampEnd)
        const dayStart = getDayIdentifier(timestampStart)
        if (dayEnd > dayStart) {
          return true
        } else if (dayEnd < dayStart) {
          return false
        } else {
          const timeEnd = getTimeIdentifier(timestampEnd)
          const timeStart = getTimeIdentifier(timestampStart)
          if (timeEnd >= timeStart) {
            return true
          } else {
            return false
          }
        }
      }
      return false
    },

    resetForm () {
      this.$set(this, 'eventForm', { ...formDefault })
    },
    showEvent (event) {
      this.event = event
      this.displayEvent = true
    },
    getEndTime (event) {
      let endTime = new Date(event.date + ' ' + event.time + ':00')
      endTime = date.addToDate(endTime, { minutes: event.duration })
      endTime = date.formatDate(endTime, 'HH:mm')
      return endTime
    },
    getEventDate (event) {
      let parts = event.date.split('-')
      let date = new Date(parts[0], parts[1] - 1, parts[2])
      return this.dateFormatter.format(date)
    },
    badgeClasses (event, type) {
      const cssColor = isCssColor(event.bgcolor)
      const isHeader = type === 'header'
      return {
        [`text-white bg-${event.bgcolor}`]: !cssColor,
        'full-width': !isHeader && (!event.side || event.side === 'full'),
        'left-side': !isHeader && event.side === 'left',
        'right-side': !isHeader && event.side === 'right'
      }
    },
    badgeStyles (event, type, timeStartPos, timeDurationHeight) {
      let s = {}
      if (isCssColor(event.bgcolor)) {
        s['background-color'] = event.bgcolor
        s['color'] = colors.luminosity(event.bgcolor) > 0.5 ? 'black' : 'white'
      }
      if (timeStartPos) {
        s['top'] = timeStartPos(event.time) + 'px'
      }
      if (timeDurationHeight) {
        s['height'] = timeDurationHeight(event.duration) + 'px'
      }
      s['align-items'] = 'flex-start'
      return s
    },
    displayClasses (event) {
      return {
        [`bg-${event.bgcolor}`]: !isCssColor(event.bgcolor),
        'text-white': !isCssColor(event.bgcolor)
      }
    },
    displayStyles (event) {
      let s = {}
      if (isCssColor(event.bgcolor)) {
        s['background-color'] = event.bgcolor
        s['color'] = colors.luminosity(event.bgcolor) > 0.5 ? 'black' : 'white'
      }
      return s
    },
    onDateChanged ({ day }) {
      this.selectedDate = day.date
      if (this.calendarView === 'week-scheduler' || this.calendarView === 'month-scheduler') {
        this.calendarView = 'scheduler'
        return
      }
      // automatically change to the day selected
      this.calendarView = 'day'
    },
    resourceClicked (resource) {
      // console.log('resource clicked:', resource)
    },
    resourceDayClicked (resource) {
      // console.log('resource:day clicked:', resource)
    },
    addEventMenu (day, type) {
      if (day.disabled === true || this.calendarView === 'scheduler' || this.calendarView === 'week-scheduler' || this.calendarView === 'month-scheduler') {
        return
      }
      this.resetForm()
      this.contextDay = { ...day }
      let timestamp
      if (this.contextDay.hasTime === true) {
        timestamp = this.getTimestamp(this.adjustTimestamp(this.contextDay))
        let startTime = new Date(timestamp)
        let endTime = date.addToDate(startTime, { hours: 1 })
        this.eventForm.dateTimeEnd = this.formatDate(endTime) + ' ' + this.formatTime(endTime) // endTime.toString()
      } else {
        timestamp = this.contextDay.date + ' 00:00'
      }
      this.eventForm.dateTimeStart = timestamp
      this.eventForm.allDay = this.contextDay.hasTime === false
      this.eventForm.bgcolor = '#0000FF' // starting color
      this.addEvent = true // show dialog
    },
    editEvent (event) {
      this.resetForm()
      this.contextDay = { ...event }
      let timestamp
      if (event.time) {
        timestamp = event.date + ' ' + event.time
        let startTime = new Date(timestamp)
        let endTime = date.addToDate(startTime, { minutes: event.duration })
        this.eventForm.dateTimeStart = this.formatDate(startTime) + ' ' + this.formatTime(startTime) // endTime.toString()
        this.eventForm.dateTimeEnd = this.formatDate(endTime) + ' ' + this.formatTime(endTime) // endTime.toString()
      } else {
        timestamp = event.date
        this.eventForm.dateTimeStart = timestamp
      }
      this.eventForm.allDay = !event.time
      this.eventForm.bgcolor = event.bgcolor
      this.eventForm.icon = event.icon
      this.eventForm.title = event.title
      this.eventForm.details = event.details
      this.addEvent = true // show dialog
    },
    deleteEvent (event) {
      let index = this.findEventIndex(event)
      if (index >= 0) {
        this.events.splice(index, 1)
      }
    },
    findEventIndex (event) {
      for (let i = 0; i < this.events.length; ++i) {
        if (event.title === this.events[i].title &&
          event.details === this.events[i].details &&
          event.date === this.events[i].date) {
          return i
        }
      }
    },
    formatDate (date) {
      let d = date !== void 0 ? new Date(date) : new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()

      return [year, padTime(month), padTime(day)].join('-')
    },
    formatTime (date) {
      let d = date !== void 0 ? new Date(date) : new Date(),
        hours = '' + d.getHours(),
        minutes = '' + d.getMinutes()

      return [padTime(hours), padTime(minutes)].join(':')
    },
    getDuration (dateTimeStart, dateTimeEnd, unit) {
      let start = new Date(dateTimeStart)
      let end = new Date(dateTimeEnd)
      let diff = date.getDateDiff(end, start, unit)
      return diff
    },
    convertDurationTime (n) {
      const num = n
      const days = Math.floor(((num / 60) / 24))
      const hours = (num / 60)
      const rhours = Math.floor(hours)
      const rshours = Math.floor(hours - (days * 24))
      const minutes = (hours - rhours) * 60
      const rminutes = Math.round(minutes)
      return (days > 0 ? days + ' days and ' : '') + (rshours > 0 ? rshours + ' hour(s) and ' : '') + rminutes + ' minute(s).'
    },

    onSubmit () {
      this.saveEvent()
    },

    onReset () {

    },

    saveEvent () {
      let self = this
      this.$refs.event.validate().then((success) => {
        if (success) {
          // close the dialog
          self.addEvent = false
          let form = { ...self.eventForm }
          let update = false
          if (self.contextDay.bgcolor) {
            // an update
            update = true
          } else {
            // an add
          }
          let data = {
            title: form.title,
            details: form.details,
            icon: form.icon,
            bgcolor: form.bgcolor,
            date: String(form.dateTimeStart).slice(0, 10).replace(/\//g, '-')
          }
          if (form.allDay === false) {
            // get time into separate var
            data.time = String(form.dateTimeStart).slice(11, 16)
            data.duration = self.getDuration(form.dateTimeStart, form.dateTimeEnd, 'minutes')
          }
          if (update === true) {
            let index = self.findEventIndex(self.contextDay)
            if (index >= 0) {
              self.events.splice(index, 1, { ...data })
            }
          } else {
            // add to events array
            self.events.push(data)
          }

          self.contextDay = null
        }
      })
    },
    showOffset (days) {
      if (days.length === 0) return
      let val = padTime(new Date(this.getTimestamp(days[0])).getTimezoneOffset() / 60)
      if (isNaN(val)) return ''
      return 'GMT-' + val
    },
    adjustTimestamp (day) {
      day.minute = day.minute < 15 || day.minute >= 45 ? 0 : 30
      return day
    },
    getTimestamp (day) {
      return day.date + ' ' + padTime(day.hour) + ':' + padTime(day.minute) + ':00.000'
    },
    updateFormatters () {
      try {
        this.dateFormatter = new Intl.DateTimeFormat(this.locale || void 0, {
          weekday: this.shortWeekdayLabel ? 'short' : 'long',
          month: this.shortMonthLabel ? 'short' : 'long',
          day: 'numeric',
          year: 'numeric',
          timeZone: 'UTC'
        })
      } catch (e) {
        // console.error('Intl.DateTimeFormat not supported')
        this.dateFormatter = void 0
      }
    },
    handleSwipe ({ evt, ...info }) {
      if (this.dragging === false) {
        if (info.duration >= 30 && this.ignoreNextSwipe === false) {
          if (info.direction === 'right') {
            this.calendarPrev()
          } else if (info.direction === 'left') {
            this.calendarNext()
          }
        } else {
          this.ignoreNextSwipe = false
        }
      }
      stopAndPrevent(evt)
    },
    onDragEnter (ev, event) {
      prevent(ev)
    },
    onDragStart (ev, event) {
      this.dragging = true
      this.draggedEvent = event
      stop(ev)
    },
    onDragEnd (ev, event) {
      stopAndPrevent(ev)
      this.resetDrag()
    },
    onDragOver (ev, day, type) {
      if (type === 'day') {
        stopAndPrevent(ev)
        return this.draggedEvent.date !== day.date
      } else if (type === 'interval') {
        stopAndPrevent(ev)
        return this.draggedEvent.date !== day.date && this.draggedEvent.time !== day.time
      }
    },
    onDrop (ev, day, type) {
      ev.preventDefault()
      ev.stopPropagation()
      if (type === 'day') {
        this.draggedEvent.date = day.date
        this.draggedEvent.side = void 0
      } else if (type === 'interval') {
        this.draggedEvent.date = day.date
        this.draggedEvent.time = day.time
        this.draggedEvent.side = void 0
      }
    },
    resetDrag () {
      this.draggedEvent = void 0
      this.dragging = false
      if (Platform.is.desktop) {
        this.ignoreNextSwipe = true
      }
    }
  }
}
</script>

<style lang="stylus">
  // calendar overrides
  .q-calendar-daily__day-interval:hover
    background-color rgba(0,0,255,.1)

  .q-calendar-weekly__workweek:hover
    background-color rgba(0,0,255,.1)

  .q-calendar-weekly__day:hover
    background-color rgba(0,0,255,.1)

  .q-calendar-weekly__head-weekday:hover
    background-color rgba(0,0,255,.1)

  // this page
  .calendar-container
    position relative

  .my-event
    width 100%
    position absolute
    font-size 12px

  .full-width
    left 0
    width 100%

  .left-side
    left 0
    width 49.75%

  .right-side
    left 50.25%
    width 49.75%
  </style>

<template>
  <q-calendar
    v-model="selectedDate"
    view="month"
    locale="en-us"
    mini-mode="auto"
    breakpoint="sm"
  >
    <template #week="{ week, weekdays, miniMode }">
      <template v-if="miniMode">
        <div
          v-for="(computedEvent, index) in getWeekEventsMini(week, weekdays)"
          :key="index"
          class="q-event flex inline"
          :class="badgeClassesMini(computedEvent)"
          :style="badgeStyles(computedEvent, week.length)"
        ></div>
      </template>
      <template v-else>
        <q-badge
          v-for="(computedEvent, index) in getWeekEvents(week, weekdays)"
          :key="index"
          class="q-event"
          :class="badgeClasses(computedEvent)"
          :style="badgeStyles(computedEvent, week.length)"
        >
          <template v-if="computedEvent.event">
            <q-icon v-if="computedEvent.event.icon" :name="computedEvent.event.icon" class="q-mr-xs"></q-icon>
            <span class="ellipsis">{{ computedEvent.event.title }}</span>
          </template>
        </q-badge>
      </template>
      <template >

      </template>
    </template>
  </q-calendar>
</template>

<script>
import { date, colors } from 'quasar'
import {
  getDayIdentifier,
  parsed,
  MILLISECONDS_IN_DAY,
  parseDate
} from 'ui' // ui is aliased from '@quasar/quasar-ui-qcalendar'

const CURRENT_DAY = new Date()

function getCurrentDay (day) {
  const newDay = new Date(CURRENT_DAY)
  newDay.setDate(day)
  const tm = parseDate(newDay)
  return tm.date
}

// In ui/src/utils/timestamp.js
function diffTimestamp (ts1, ts2, strict) {
  const utc1 = Date.UTC(ts1.year, ts1.month - 1, ts1.day, ts1.hour, ts1.minute)
  const utc2 = Date.UTC(ts2.year, ts2.month - 1, ts2.day, ts2.hour, ts2.minute)
  if (strict === true && utc2 < utc1) {
    // Not negative number
    // utc2 - utc1 < 0  -> utc2 < utc1 ->   NO: utc1 >= utc2
    return 0
  }
  return Math.floor((utc2 - utc1) / MILLISECONDS_IN_DAY)
}

// In ui/src/utils/helpers.js
function indexOf (array, cb) {
  for (let i = 0; i < array.length; i++) {
    if (cb(array[i], i) === true) {
      return i
    }
  }
  return -1
}

export default {
  data () {
    return {
      selectedDate: '',
      events: [
        {
          title: '1st of the Month',
          color: 'orange',
          start: getCurrentDay(1),
          end: getCurrentDay(1),
        },
        {
          title: 'Sisters Birthday',
          color: 'green',
          start: getCurrentDay(4),
          end: getCurrentDay(4),
          icon: 'cake'
        },
        {
          title: 'Meeting',
          color: 'red',
          start: getCurrentDay(8),
          end: getCurrentDay(8),
          icon: 'group'
        },
        {
          title: 'Lunch',
          color: 'teal',
          start: getCurrentDay(8),
          end: getCurrentDay(8),
          icon: 'free_breakfast'
        },
        {
          title: 'Visit Mom',
          color: 'blue-grey',
          start: getCurrentDay(20),
          end: getCurrentDay(20),
          icon: 'card_giftcard'
        },
        {
          title: 'Conference',
          color: 'blue',
          start: getCurrentDay(22),
          end: getCurrentDay(22),
          icon: 'ondemand_video'
        },
        {
          title: 'Girlfriend',
          color: 'teal',
          start: getCurrentDay(22),
          end: getCurrentDay(22),
          icon: 'fastfood'
        },
        {
          title: 'Rowing',
          color: 'purple',
          start: getCurrentDay(27),
          end: getCurrentDay(28),
          icon: 'rowing'
        },
        {
          title: 'Vacation',
          color: 'purple',
          start: getCurrentDay(22),
          end: getCurrentDay(29),
          icon: "flight"
        }
      ]
    }
  },
  methods: {
    isCssColor (color) {
      return !!color && !!color.match(/^(#|(rgb|hsl)a?\()/)
    },

    badgeClasses (infoEvent) {
      const color = infoEvent.event !== void 0 ? infoEvent.event.color : 'transparent'

      return {
        [`text-white bg-${color}`]: true,
        'cursor-pointer': infoEvent.event !== void 0,
        'q-event-void': infoEvent.event === void 0
      }
    },

    badgeStyles (infoEvent, weekLength) {
      return {
        // 'background-color': infoEvent.event.color,
        // color: colors.luminosity(event.color) > 0.5 ? 'black' : 'white',
        width: ((100 / weekLength) * infoEvent.size) + '% !important'
      }
    },

    badgeClassesMini (infoEvent) {
      const hasEvents = infoEvent.events.length > 0

      return {
        'cursor-pointer': hasEvents === true,
        'q-event-void': hasEvents !== true
      }
    },

    getWeekEventsMini (week, weekdays) {
      const tsFirstDay = parsed(week[0].date + ' 00:00')
      const tsLastDay = parsed(week[week.length - 1].date + ' 23:59')
      const firstDay = getDayIdentifier(tsFirstDay)
      const lastDay = getDayIdentifier(tsLastDay)

      const events = []

      week.forEach(tsWeekDate => {
        const weekDate = getDayIdentifier(tsWeekDate)

        const eventsDay = []

        this.events.forEach(event => {
          const tsStartDate = parsed(event.start + ' 00:00')
          const tsEndDate = parsed(event.end + ' 23:59')
          const startDate = getDayIdentifier(tsStartDate)
          const endDate = getDayIdentifier(tsEndDate)

          if (this.isBetweenDates(weekDate, startDate, endDate) === true) {
            eventsDay.push(event)
          }
        })

        events.push({
          size: 1,
          events: eventsDay
        })
      })

      return events
    },

    getWeekEvents (week, weekdays) {
      const tsFirstDay = parsed(week[0].date + ' 00:00')
      const tsLastDay = parsed(week[week.length - 1].date + ' 23:59')
      const firstDay = getDayIdentifier(tsFirstDay)
      const lastDay = getDayIdentifier(tsLastDay)

      const eventsWeek = []
      this.events.forEach((event, id) => {
        const tsStartDate = parsed(event.start + ' 00:00')
        const tsEndDate = parsed(event.end + ' 23:59')
        const startDate = getDayIdentifier(tsStartDate)
        const endDate = getDayIdentifier(tsEndDate)

        if (this.isBetweenDatesWeek(startDate, endDate, firstDay, lastDay)) {
          const left = diffTimestamp(tsFirstDay, tsStartDate, true)
          const right = diffTimestamp(tsEndDate, tsLastDay, true)

          eventsWeek.push({
            id, // index event
            left, // Position initial day [0-6]
            right, // Number days available
            size: week.length - (left + right), // Size current event (in days)
            event // Info
          })
        }
      })

      const events = []
      if (eventsWeek.length > 0) {
        const infoWeek = eventsWeek.sort((a, b) => a.left - b.left)
        infoWeek.forEach((event, i) => {
          this.insertEvent(events, week.length, infoWeek, i, 0, 0)
        })
      }

      return events
    },

    insertEvent (events, weekLength, infoWeek, index, availableDays, level) {
      const iEvent = infoWeek[index]
      if (iEvent !== void 0 && iEvent.left >= availableDays) {
        // If you have space available, more events are placed
        if (iEvent.left - availableDays) {
          // It is filled with empty events
          events.push({ size: iEvent.left - availableDays })
        }
        // The event is built
        events.push({ size: iEvent.size, event: iEvent.event })

        if (level !== 0) {
          // If it goes into recursion, then the item is deleted
          infoWeek.splice(index, 1)
        }

        const currentAvailableDays = iEvent.left + iEvent.size

        if (currentAvailableDays < weekLength) {
          const indexNextEvent = indexOf(infoWeek, e => e.id !== iEvent.id && e.left >= currentAvailableDays)

          this.insertEvent(
            events,
            weekLength,
            infoWeek,
            indexNextEvent !== -1 ? indexNextEvent : index,
            currentAvailableDays,
            level + 1
          )
        } // else: There are no more days available, end of iteration

      } else {
        events.push({ size: weekLength - availableDays })
        // end of iteration
      }

    },

    isBetweenDates (date, start, end) {
      return date >= start && date <= end
    },

    isBetweenDatesWeek (dateStart, dateEnd, weekStart, weekEnd) {
      return (
          (dateEnd < weekEnd && dateEnd >= weekStart)
          || dateEnd === weekEnd
          || (dateEnd > weekEnd && dateStart <= weekEnd)
        )
    }
  }
}
</script>

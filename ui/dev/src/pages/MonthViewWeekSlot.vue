<template>
  <q-calendar
    v-model="selectedDate"
    view="month"
    locale="en-us"
    style="height: 500px;"
  >
    <template #week="{ week, weekdays }">
      <template v-for="(computedEvent, index) in getWeekEvents(week, weekdays)">
        <q-badge
          :key="index"
          class="ellipsis"
          :class="badgeClasses(computedEvent, 'day')"
          :style="badgeStyles(computedEvent, 'day', week.length)"
        >
          <template v-if="computedEvent.event">
            <q-icon :name="computedEvent.event.icon" class="q-mr-xs"></q-icon>
            <span class="ellipsis">{{ computedEvent.event.title }}</span>
          </template>
        </q-badge>
      </template>
    </template>
    <!-- <template #day="{ date }">
      <template v-for="(event, index) in getEvents(date)">
        <q-badge
          :key="index"
          style="width: 100%; cursor: pointer;"
          class="ellipsis"
          :class="badgeClasses(event, 'day')"
          :style="badgeStyles(event, 'day')"
        >
          <q-icon v-if="event.icon" :name="event.icon" class="q-mr-xs"></q-icon><span class="ellipsis">{{ event.title }}</span>
        </q-badge>
      </template>
    </template> -->
  </q-calendar>
</template>

<script>
import { date, colors } from 'quasar'
import {
  getDayIdentifier,
  parsed,
  MILLISECONDS_IN_DAY
} from '@quasar/quasar-ui-qcalendar/src/utils/timestamp'

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
      selectedDate: '2019-04-08',
      events: [
        {
          title: 'April Foold Day',
          color: 'orange',
          start: '2019-04-01',
          end: '2019-04-01'
        },
        {
          title: 'Sisters Birthday',
          color: 'green',
          start: '2019-04-04',
          end: '2019-04-04',
          icon: 'cake'
        },
        {
          title: 'Meeting',
          color: 'red',
          start: '2019-04-08',
          end: '2019-04-08',
          icon: 'group'
        },
        {
          title: 'Lunch',
          color: 'teal',
          start: '2019-04-08',
          end: '2019-04-08',
          icon: 'free_breakfast'
        },
        {
          title: 'Visit Mom',
          color: 'blue-grey',
          start: '2019-04-20',
          end: '2019-04-20',
          icon: 'card_giftcard'
        },
        {
          title: 'Conference',
          color: 'blue',
          start: '2019-04-22',
          end: '2019-04-22',
          icon: 'ondemand_video'
        },
        {
          title: 'Girlfriend',
          color: 'teal',
          start: '2019-04-22',
          end: '2019-04-22',
          icon: 'fastfood'
        },
        {
          title: 'Rowing',
          color: 'purple',
          start: '2019-04-27',
          end: '2019-04-28',
          icon: 'rowing'
        },
        {
          title: 'Vacation',
          color: 'purple',
          start: '2019-04-29',
          end: '2019-05-03',
          icon: "flight"
        }
      ]
    }
  },
  methods: {
    isCssColor (color) {
      return !!color && !!color.match(/^(#|(rgb|hsl)a?\()/)
    },

    badgeClasses (infoEvent, type) {
      const color = infoEvent.event !== void 0 ? infoEvent.event.color : 'transparent'
      const cssColor = this.isCssColor(color)
      const isHeader = type === 'header'

      return {
        [`text-white bg-${color}`]: !cssColor,
        'full-width': !isHeader && (!infoEvent.side || infoEvent.side === 'full'),
        'left-side': !isHeader && infoEvent.side === 'left',
        'right-side': !isHeader && infoEvent.side === 'right',
        'cursor-pointer': infoEvent.event !== void 0,
        'event-void': infoEvent.event === void 0 // height: 0, padding: 0
      }
    },

    badgeStyles (infoEvent, type, weekLength, timeStartPos, timeDurationHeight) {
      const s = {}
      /*if (this.isCssColor(infoEvent.color)) {
        s['background-color'] = event.color
        s.color = colors.luminosity(event.color) > 0.5 ? 'black' : 'white'
      }*/
      if (timeStartPos) {
        s.top = timeStartPos(infoEvent.event.time) + 'px'
      }
      if (timeDurationHeight) {
        s.height = timeDurationHeight(infoEvent.event.duration) + 'px'
      }
      if (infoEvent.size !== void 0) {
        s.width = ((100 / weekLength) * infoEvent.size) + '% !important'
      }
      // s['align-items'] = 'flex-start'
      return s
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

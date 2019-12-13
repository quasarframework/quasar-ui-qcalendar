<template>
  <q-calendar
    v-model="selectedDate"
    view="month"
    locale="en-us"
    style="height: 500px;"
  >
    <template #week="{ week, weekdays }">
      <template v-for="(event, index) in getWeekEvents(week, weekdays)">
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
  nextDay
} from '@quasar/quasar-ui-qcalendar/src/utils/timestamp'

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
          color: '#9c27b0',
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

    badgeClasses (event, type) {
      const cssColor = this.isCssColor(event.bgcolor)
      const isHeader = type === 'header'
      return {
        [`text-white bg-${event.bgcolor}`]: !cssColor,
        'full-width': !isHeader && (!event.side || event.side === 'full'),
        'left-side': !isHeader && event.side === 'left',
        'right-side': !isHeader && event.side === 'right'
      }
    },

    badgeStyles (event, type, timeStartPos, timeDurationHeight) {
      const s = {}
      if (this.isCssColor(event.bgcolor)) {
        s['background-color'] = event.bgcolor
        s.color = colors.luminosity(event.bgcolor) > 0.5 ? 'black' : 'white'
      }
      if (timeStartPos) {
        s.top = timeStartPos(event.time) + 'px'
      }
      if (timeDurationHeight) {
        s.height = timeDurationHeight(event.duration) + 'px'
      }
      if (event.meta !== void 0 && event.meta.width !== void 0) {
        s.width = event.meta.width + '!important'
      }
      // s['align-items'] = 'flex-start'
      return s
    },

    getEvents (dt) {
      const events = []
      for (let i = 0; i < this.events.length; ++i) {
        let added = false
        if (this.events[i].date === dt) {
          if (this.events[i].time) {
            if (events.length > 0) {
              // check for overlapping times
              const startTime = new Date(this.events[i].date + ' ' + this.events[i].time)
              const endTime = date.addToDate(startTime, { minutes: this.events[i].duration })
              for (let j = 0; j < events.length; ++j) {
                let startTime2 = new Date(events[j].date + ' ' + events[j].time)
                let endTime2 = date.addToDate(startTime2, { minutes: events[j].duration })
                if (date.isBetweenDates(startTime, startTime2, endTime2) || date.isBetweenDates(endTime, startTime2, endTime2)) {
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

    getWeekEvents (week, weekdays) {
      const firstDay = getDayIdentifier(parsed(week[0].date + ' 00:00'))
      const lastDay = getDayIdentifier(parsed(week[week.length - 1].date + ' 23:59'))

      const events = this.events.filter(event => {
        const startDate = getDayIdentifier(parsed(event.start + ' 00:00'))
        const endDate = getDayIdentifier(parsed(event.end + ' 23:59'))

        return this.isBetweenDatesWeek(startDate, endDate, firstDay, lastDay)
      })
      
      /*for (let i = 0; i < this.events.length; ++i) {
        

        if (this.isBetweenDates(sd, firstDay, lastDay)) {
          console.log('matched:', `${this.events[i].date}: ${this.events[i].title}`)
          events.push(this.events[i])
        }
        else if (this.events[i].end !== void 0 && this.containsDates(startDate, this.events[i].days, firstDay, lastDay)) {
          console.log('matched:', `${this.events[i].date}: ${this.events[i].title}`)
          events.push(this.events[i])
        }
      }*/
      console.log('events:', events)
      if (events.length > 0) {
        this.processEvents(events, week, weekdays)
      }
      return events
    },

    processEvents (events, week, weekdays) {
      for (const index in events) {
        const event = events[index]
        const timestamp = parsed(event.date  + ' 00:00')
        console.log('timestamp:', timestamp)
        event.meta = {}
        let days = event.days && event.days > 0 && this.daysInWeek(event, week) || 1
        event.meta.width = ((100 / week.length) * days) + '%'
      }
    },

    daysInWeek (event, week) {
      let count = 1
        // for (let i = 0; i < week.length; ++i) {
        //   const wk =
        // }
      return count
    },

    isBetweenDates (date, start, end) {
      return date >= start && date <= end
    },

    containsDates (date, count, start, end) {
      let pd = date
      for (let i = 0; i < count; ++i) {
        pd = nextDay(pd)
        if (this.isBetweenDates(getDayIdentifier(pd), start, end)) {
          return true
        }
      }
      return false
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

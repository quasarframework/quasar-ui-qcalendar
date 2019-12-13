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
          title: 'April Fools Day',
          details: 'Everything is funny as long as it is happening to someone else',
          date: '2019-04-01',
          bgcolor: 'orange'
        },
        {
          title: 'Sisters Birthday',
          details: 'Buy a nice present',
          date: '2019-04-04',
          bgcolor: 'green',
          icon: 'fas fa-birthday-cake'
        },
        {
          title: 'Meeting',
          details: 'Time to pitch my idea to the company',
          date: '2019-04-08',
          time: '10:00',
          duration: 120,
          bgcolor: 'red',
          icon: 'fas fa-handshake'
        },
        {
          title: 'Lunch',
          details: 'Company is paying!',
          date: '2019-04-08',
          time: '11:30',
          duration: 90,
          bgcolor: 'teal',
          icon: 'fas fa-hamburger'
        },
        {
          title: 'Visit mom',
          details: 'Always a nice chat with mom',
          date: '2019-04-20',
          time: '17:00',
          duration: 90,
          bgcolor: 'blue-grey',
          icon: 'fas fa-car'
        },
        {
          title: 'Conference',
          details: 'Teaching Javascript 101',
          date: '2019-04-22',
          time: '08:00',
          duration: 540,
          bgcolor: 'blue',
          icon: 'fas fa-chalkboard-teacher'
        },
        {
          title: 'Girlfriend',
          details: 'Meet GF for dinner at Swanky Restaurant',
          date: '2019-04-22',
          time: '19:00',
          duration: 180,
          bgcolor: 'teal',
          icon: 'fas fa-utensils'
        },
        {
          title: 'Fishing',
          details: 'Time for some weekend R&R',
          date: '2019-04-27',
          bgcolor: 'purple',
          icon: 'fas fa-fish',
          days: 2
        },
        {
          title: 'Vacation',
          details: 'Trails and hikes, going camping! Don\'t forget to bring bear spray!',
          date: '2019-04-29',
          endDate: '2019-05-03',
          bgcolor: 'purple',
          icon: 'fas fa-plane',
          days: 5
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
      console.log(`${week[0].date} - ${week[week.length - 1].date}`)

      const firstDay = getDayIdentifier(parsed(week[0].date + ' 00:00'))
      const lastDay = getDayIdentifier(parsed(week[week.length - 1].date + ' 23:59'))

      const events = []
      for (let i = 0; i < this.events.length; ++i) {
        const startDate = parsed(this.events[i].date + ' 00:00')
        const sd = getDayIdentifier(startDate)

        if (this.isBetweenDates(sd, firstDay, lastDay)) {
          console.log('matched:', `${this.events[i].date}: ${this.events[i].title}`)
          events.push(this.events[i])
        }
        else if (this.events[i].days !== void 0 && this.containsDates(startDate, this.events[i].days, firstDay, lastDay)) {
          console.log('matched:', `${this.events[i].date}: ${this.events[i].title}`)
          events.push(this.events[i])
        }
      }
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
    }
  }
}
</script>

<template>
  <div style="max-width: 800px; width: 100%;">
    <q-calendar
      v-model="selectedDate"
      view="day"
      locale="en-us"
      class="calendar-container"
      style="height: 400px;"
    >
      <template #day-header="{ timestamp }">
        <div class="row justify-center">
          <template v-for="(event, index) in eventsMap[timestamp.date]">
            <q-badge
              v-if="!event.time"
              :key="index + 'a'"
              style="width: 100%; cursor: pointer;"
              :class="badgeClasses(event, 'header')"
              :style="badgeStyles(event, 'header')"
            >
              <q-icon
                v-if="event.icon"
                :name="event.icon"
                class="q-mr-xs"
              /><span class="ellipsis">{{ event.title }}</span>
            </q-badge>
            <q-badge
              v-else
              :key="index + 'b'"
              class="q-ma-xs"
              :class="badgeClasses(event, 'header')"
              :style="badgeStyles(event, 'header')"
              style="width: 10px; max-width: 10px; height: 10px; max-height: 10px"
            />
          </template>
        </div>
      </template>

      <template #day-body="{ timestamp, timeStartPos, timeDurationHeight }">
        <template v-for="(event, index) in getEvents(timestamp.date)">
          <q-badge
            v-if="event.time"
            :key="index"
            class="my-event justify-center ellipsis"
            :class="badgeClasses(event, 'body')"
            :style="badgeStyles(event, 'body', timeStartPos, timeDurationHeight)"
          >
            <q-icon
              v-if="event.icon"
              :name="event.icon"
              class="q-mr-xs"
            /><span class="ellipsis">{{ event.title }}</span>
          </q-badge>
        </template>
      </template>
    </q-calendar>
  </div>
</template>

<script>
// normally you would not import "all" of QCalendar, but is needed for this example to work with UMD (codepen)
import QCalendar from 'ui' // ui is aliased from '@quasar/quasar-ui-qcalendar'

const CURRENT_DAY = new Date()

function getCurrentDay (day) {
  const newDay = new Date(CURRENT_DAY)
  newDay.setDate(day)
  const tm = QCalendar.parseDate(newDay)
  return tm.date
}

const reRGBA = /^\s*rgb(a)?\s*\((\s*(\d+)\s*,\s*?){2}(\d+)\s*,?\s*([01]?\.?\d*?)?\s*\)\s*$/

function textToRgb (color) {
  if (typeof color !== 'string') {
    throw new TypeError('Expected a string')
  }

  const m = reRGBA.exec(color)
  if (m) {
    const rgb = {
      r: Math.min(255, parseInt(m[ 2 ], 10)),
      g: Math.min(255, parseInt(m[ 3 ], 10)),
      b: Math.min(255, parseInt(m[ 4 ], 10))
    }
    if (m[ 1 ]) {
      rgb.a = Math.min(1, parseFloat(m[ 5 ]))
    }
    return rgb
  }
  return hexToRgb(color)
}

function hexToRgb (hex) {
  if (typeof hex !== 'string') {
    throw new TypeError('Expected a string')
  }

  hex = hex.replace(/^#/, '')

  if (hex.length === 3) {
    hex = hex[ 0 ] + hex[ 0 ] + hex[ 1 ] + hex[ 1 ] + hex[ 2 ] + hex[ 2 ]
  }
  else if (hex.length === 4) {
    hex = hex[ 0 ] + hex[ 0 ] + hex[ 1 ] + hex[ 1 ] + hex[ 2 ] + hex[ 2 ] + hex[ 3 ] + hex[ 3 ]
  }

  const num = parseInt(hex, 16)

  return hex.length > 6
    ? { r: num >> 24 & 255, g: num >> 16 & 255, b: num >> 8 & 255, a: Math.round((num & 255) / 2.55) }
    : { r: num >> 16, g: num >> 8 & 255, b: num & 255 }
}

function luminosity (color) {
  if (typeof color !== 'string' && (!color || color.r === undefined)) {
    throw new TypeError('Expected a string or a {r, g, b} object as color')
  }

  const
    rgb = typeof color === 'string' ? textToRgb(color) : color,
    r = rgb.r / 255,
    g = rgb.g / 255,
    b = rgb.b / 255,
    R = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4),
    G = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4),
    B = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4)
  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

export default {
  data () {
    return {
      selectedDate: '',
      events: [
        {
          title: '1st of the Month',
          details: 'Everything is funny as long as it is happening to someone else',
          date: getCurrentDay(1),
          bgcolor: 'orange'
        },
        {
          title: 'Sisters Birthday',
          details: 'Buy a nice present',
          date: getCurrentDay(4),
          bgcolor: 'green',
          icon: 'fas fa-birthday-cake'
        },
        {
          title: 'Meeting',
          details: 'Time to pitch my idea to the company',
          date: getCurrentDay(CURRENT_DAY.getDate()),
          time: '10:00',
          duration: 120,
          bgcolor: 'red',
          icon: 'fas fa-handshake'
        },
        {
          title: 'Lunch',
          details: 'Company is paying!',
          date: getCurrentDay(CURRENT_DAY.getDate()),
          time: '11:30',
          duration: 90,
          bgcolor: 'teal',
          icon: 'fas fa-hamburger'
        },
        {
          title: 'Visit mom',
          details: 'Always a nice chat with mom',
          date: getCurrentDay(20),
          time: '17:00',
          duration: 90,
          bgcolor: 'blue-grey',
          icon: 'fas fa-car'
        },
        {
          title: 'Conference',
          details: 'Teaching Javascript 101',
          date: getCurrentDay(22),
          time: '08:00',
          duration: 540,
          bgcolor: 'blue',
          icon: 'fas fa-chalkboard-teacher'
        },
        {
          title: 'Girlfriend',
          details: 'Meet GF for dinner at Swanky Restaurant',
          date: getCurrentDay(22),
          time: '19:00',
          duration: 180,
          bgcolor: 'teal',
          icon: 'fas fa-utensils'
        },
        {
          title: 'Fishing',
          details: 'Time for some weekend R&R',
          date: getCurrentDay(22),
          bgcolor: 'purple',
          icon: 'fas fa-fish',
          days: 2
        },
        {
          title: 'Vacation',
          details: 'Trails and hikes, going camping! Don\'t forget to bring bear spray!',
          date: getCurrentDay(29),
          bgcolor: 'purple',
          icon: 'fas fa-plane',
          days: 5
        }
      ]
    }
  },
  computed: {
    // convert the events into a map of lists keyed by date
    eventsMap () {
      const map = {}
      this.events.forEach((event) => (map[ event.date ] = map[ event.date ] || []).push(event))
      return map
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
        [ `text-white bg-${ event.bgcolor }` ]: !cssColor,
        'full-width': !isHeader && (!event.side || event.side === 'full'),
        'left-side': !isHeader && event.side === 'left',
        'right-side': !isHeader && event.side === 'right'
      }
    },

    badgeStyles (event, type, timeStartPos, timeDurationHeight) {
      const s = {}
      if (this.isCssColor(event.bgcolor)) {
        s[ 'background-color' ] = event.bgcolor
        s.color = luminosity(event.bgcolor) > 0.5 ? 'black' : 'white'
      }
      if (timeStartPos) {
        s.top = timeStartPos(event.time) + 'px'
      }
      if (timeDurationHeight) {
        s.height = timeDurationHeight(event.duration) + 'px'
      }
      s[ 'align-items' ] = 'flex-start'
      return s
    },

    getEvents (dt) {
      const currentDate = QCalendar.parsed(dt)
      const events = []
      for (let i = 0; i < this.events.length; ++i) {
        let added = false
        const event = this.events[ i ]
        if (event.date === dt) {
          if (event.time) {
            if (events.length > 0) {
              // check for overlapping times
              const startTime = QCalendar.parsed(event.date + ' ' + event.time)
              const endTime = QCalendar.addToDate(startTime, { minute: event.duration })
              for (let j = 0; j < events.length; ++j) {
                if (events[ j ].time) {
                  const startTime2 = QCalendar.parsed(events[ j ].date + ' ' + events[ j ].time)
                  const endTime2 = QCalendar.addToDate(startTime2, { minute: events[ j ].duration })
                  if (QCalendar.isBetweenDates(startTime, startTime2, endTime2) || QCalendar.isBetweenDates(endTime, startTime2, endTime2)) {
                    events[ j ].side = 'left'
                    event.side = 'right'
                    events.push(event)
                    added = true
                    break
                  }
                }
              }
            }
          }
          if (!added) {
            event.side = undefined
            events.push(event)
          }
        }
        else if (event.days) {
          // check for overlapping dates
          const startDate = QCalendar.parsed(event.date)
          const endDate = QCalendar.addToDate(startDate, { day: event.days })
          if (QCalendar.isBetweenDates(currentDate, startDate, endDate)) {
            events.push(event)
            added = true
          }
        }
      }
      return events
    }
  }
}
</script>

<style lang="sass">
.calendar-container
  position: relative

.my-event
  width: 100%
  position: absolute
  font-size: 12px

.full-width
  left: 0
  width: 100%

.left-side
  left: 0
  width: 49.75%

.right-side
  left: 50.25%
  width: 49.75%
  </style>

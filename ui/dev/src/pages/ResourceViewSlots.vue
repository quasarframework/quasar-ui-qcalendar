<template>
  <div style="max-width: 800px; width: 100%;">
    <q-calendar
      v-model="selectedDate"
      view="day-resource"
      bordered
      sticky
      :resources="resources"
      :resource-height="50"
      locale="en-us"
      class="calendar-container"
      style="height: 200px; max-width: 800px; width: 100%;"
    >
      <template #resource-intervals="scope">
        <template v-if="scope.resource.events && scope.resource.events.length > 0">
          <template v-for="(event, index) in scope.resource.events">
            <template v-if="event.date === scope.intervals[0][0].date">
              <q-badge
                v-if="event.time"
                :key="index"
                :class="badgeClasses(event, 'body')"
                :style="badgeStyles(event, 'body', scope.timeStartPosX, scope.timeDurationWidth)"
              >
                <q-icon v-if="event.icon" :name="event.icon" class="q-mr-xs" /><span class="ellipsis">{{ event.title }}</span>
              </q-badge>
            </template>
          </template>
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
      r: Math.min(255, parseInt(m[2], 10)),
      g: Math.min(255, parseInt(m[3], 10)),
      b: Math.min(255, parseInt(m[4], 10))
    }
    if (m[1]) {
      rgb.a = Math.min(1, parseFloat(m[5]))
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
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  } else if (hex.length === 4) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3]
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
      resources: [
        {
          label: 'John',
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
              time: '12:00',
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
        },
        { label: 'Mary' },
        { label: 'Susan' },
        { label: 'Olivia' },
        { label: 'Board Room' },
        { label: 'Room-1' },
        { label: 'Room-2' }
      ]
    }
  },
  computed: {
    // convert the events into a map of lists keyed by date
    eventsMap () {
      const map = {}
      this.events.forEach((event) => (map[event.date] = map[event.date] || []).push(event))
      return map
    }
  },

  methods: {
    isCssColor (color) {
      return !!color && !!color.match(/^(#|(rgb|hsl)a?\()/)
    },

    badgeClasses (event, type) {
      const cssColor = this.isCssColor(event.bgcolor)
      return {
        [`text-white bg-${event.bgcolor}`]: !cssColor
      }
    },

    badgeStyles (event, type, timeStartPosX, timeDurationWidth) {
      const s = {}
      s.position = 'absolute'
      if (this.isCssColor(event.bgcolor)) {
        s['background-color'] = event.bgcolor
        s.color = luminosity(event.bgcolor) > 0.5 ? 'black' : 'white'
      }
      if (timeStartPosX) {
        s.left = timeStartPosX(event.time) + 'px'
      }
      if (timeDurationWidth) {
        s.width = timeDurationWidth(event.duration) + 'px'
      }
      s['align-items'] = 'flex-start'
      return s
    }
  }
}
</script>

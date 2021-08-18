import {
  validateTimestamp,
  parseTimestamp,
  parseDate
} from '../utils/Timestamp.js'

export default {
  name: 'Times',

  props: {
    now: {
      type: String,
      validator: v => v === '' || validateTimestamp(v),
      default: ''
    }
  },

  data: () => ({
    times: {
      now: parseTimestamp('0000-00-00 00:00'),
      today: parseTimestamp('0000-00-00')
    }
  }),

  computed: {
    parsedNow () {
      return this.now ? parseTimestamp(this.now) : this.getNow()
    }
  },

  watch: {
    parsedNow: 'updateCurrent'
  },

  beforeMount () {
    this.updateCurrent()
    this.setCurrent()
  },

  methods: {
    setCurrent () {
      this.times.now.current = this.times.today.current = true
      this.times.now.past = this.times.today.past = false
      this.times.now.future = this.times.today.future = false
    },

    updateCurrent () {
      const now = this.parsedNow || this.getNow()
      this.updateDay(now, this.times.now)
      this.updateTime(now, this.times.now)
      this.updateDay(now, this.times.today)
    },

    getNow () {
      return parseDate(new Date())
    },

    updateDay (now, target) {
      if (now.date !== target.date) {
        target.year = now.year
        target.month = now.month
        target.day = now.day
        target.weekday = now.weekday
        target.date = now.date
      }
    },

    updateTime (now, target) {
      if (now.time !== target.time) {
        target.hour = now.hour
        target.minute = now.minute
        target.time = now.time
      }
    }
  }
}

<template>
  <div class="row full-width q-gutter-x-md" style="max-width: 400px; width: 100%;">
    <div class="row items-center q-pa-sm full-width">addToDate testing</div>
    <div class="row items-center q-mt-sm">{{ timestamp.year }}</div>
    <q-input-ts class="col" :value="timestamp.month" type="month" @increment="increment" @decrement="decrement"></q-input-ts>
    <q-input-ts class="col" :value="timestamp.day" type="day" @increment="increment" @decrement="decrement"></q-input-ts>
    <q-input-ts class="col" :value="timestamp.hour" type="hour" @increment="increment" @decrement="decrement"></q-input-ts>
    <q-input-ts class="col" :value="timestamp.minute" type="minute" @increment="increment" @decrement="decrement"></q-input-ts>
  </div>
</template>

<script>
import { addToDate } from '@quasar/quasar-ui-qcalendar'
import { QBtn } from 'quasar'

const QInputTs = {
  props: {
    value: Number,
    type: String
  },
  render (h) {
    return h('div', {
      staticClass: 'q-input-ts'
    }, [
      h('div', { staticClass: 'q-input-ts-label' }, [
        h('span', this.type)
      ]),
      h('div', {
        staticClass: 'row items-center'
      }, [
        h('span', { staticClass: 'col' }, this.value),
      h('span', { staticClass: 'column' }, [
        h(QBtn, {
          staticClass: 'q-btn-arrow',
          props: {
            dense: true,
            flat: true,
            icon: 'arrow_drop_up'
          },
          on: {
            click: e => this.$emit('increment', this.type)
          }
        }),
        h(QBtn, {
          staticClass: 'q-btn-arrow',
          props: {
            dense: true,
            flat: true,
            icon: 'arrow_drop_down'
          },
          on: {
            click: e => this.$emit('decrement', this.type)
          }
        })
      ])
      ])

    ])
  }
}

function forEachObject (obj, cb) {
  Object.keys(obj).forEach(k => cb(obj[k], k))
}

export default {
  components: {
    QInputTs
  },

  data () {
    return {
      timestamp: {
        date: '',       // YYYY-mm-dd
        time: '',       // 00:00:00 (optional)
        year: 2019,        // YYYY
        month: 1,       // mm (Jan = 1, etc)
        day: 1,         // day of the month
        hour: 0,        // 24-hr
        minute: 0,      // mm
        hasDay: false,  // if this timestamp is supposed to have a date
        hasTime: false, // if this timestamp is supposed to have a time
      }
    }
  },

  methods: {
    addToDate,
    increment (key) {
      this.addToDate(this.timestamp, { [key]: 1 })
    },
    decrement (key) {
      this.addToDate(this.timestamp, { [key]: -1 })
    }
  }
}
</script>

<style lang="sass">
.q-input-ts
  border: 1px solid black
  border-radius: 3px
  padding-left: 4px
  position: relative
  margin-top: 8px

  .q-input-ts-label
    font-size: 0.8em
    position: absolute
    top: -8px

    > span
      position: relative
      z-index: 2
      padding: 0 2px
      text-transform: capitalize

    &:before
      content: ''
      position: absolute
      width: 100%
      height: 2px
      background: white
      bottom: 50%
      z-index: 1

  .q-btn-arrow
    font-size: 9px
    border-radius: 0

    .q-btn__wrapper
      padding: 0
</style>
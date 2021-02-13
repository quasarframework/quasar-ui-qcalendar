<template>
  <div class="select">
    <label for="theme">Choose a theme:&nbsp;</label>
    <select
      id="theme"
      v-model="theme"
      name="theme"
    >
      <option
        v-for="t in themesList"
        :key="t.label"
        :value="t.value"
      >
        {{ t.label }}
      </option>
    </select>
  </div>

  <div style="margin: 12px;">
    <div style="width: 100%">
      <button
        class="button"
        style="margin: 2px;"
        @click="onToday"
      >
        Today
      </button>
      <button
        class="button"
        style="margin: 2px;"
        @click="onPrev"
      >
        &lt; Prev
      </button>
      <button
        class="button"
        style="margin: 2px;"
        @click="onNext"
      >
        Next &gt;
      </button>
    </div>
  </div>

  <div style="width: 100%; display: flex; justify-content: center">
    <QCalendarMonth
      ref="calendar"
      v-model="selectedDate"
      mini-mode
      :style="theme"
      bordered
      style="max-width: 280px; width: 100%;"
      @change="onChange"
      @moved="onMoved"
      @click-date="onClickDate"
      @click-day="onClickDay"
      @click-workweek="onClickWorkweek"
      @click-head-workweek="onClickHeadWorkweek"
      @click-head-day="onClickHeadDay"
    />
  </div>
</template>

<script>
import { QCalendarMonth } from '@quasar/quasar-ui-qcalendar/QCalendarMonth.js'
import { today } from '@quasar/quasar-ui-qcalendar/Timestamp.js'
import '@quasar/quasar-ui-qcalendar/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarMonth.sass'

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MiniModeTheme',
  components: {
    QCalendarMonth
  },
  data () {
    return {
      selectedDate: today(),
      theme: {
      },
      themes: {
        default: {
        },
        teal: {
          '--calendar-border': '#4db6ac 1px solid',
          '--calendar-border-dark': '#e0f2f1 1px solid',
          '--calendar-border-section': '#80cbc4 1px dashed',
          '--calendar-border-section-dark': '#80cbc4 1px dashed',
          '--calendar-border-current': '#4db6ac 2px solid',
          '--calendar-border-current-dark': '#1de9b6 2px solid',
          '--calendar-border-droppable': '#027BE3 1px dashed',
          '--calendar-border-droppable-dark': '#ffff66 1px dashed',
          '--calendar-mini-range-connector-hover-border': '#027BE3 1px dashed',
          '--calendar-mini-range-connector-hover-border-dark': '#ffff66 1px dashed',
          '--calendar-color': '#004d40',
          '--calendar-color-dark': '#e0f2f1',
          '--calendar-background': '#e0f2f1',
          '--calendar-background-dark': '#004d40',
          '--calendar-current-color': '#027BE3',
          '--calendar-current-color-dark': '#ffff66',
          '--calendar-current-background': '#00000000',
          '--calendar-current-background-dark': '#004d40',
          '--calendar-disabled-date-color': '#e0f2f1',
          '--calendar-disabled-date-color-dark': '#bebebe',
          '--calendar-disabled-date-background': '#80cbc4',
          '--calendar-disabled-date-background-dark': '#121212',
          '--calendar-active-date-color': '#000000',
          '--calendar-active-date-color-dark': '#ffff66',
          '--calendar-active-date-background': '#1de9b6',
          '--calendar-active-date-background-dark': '#4db6ac',
          '--calendar-outside-color': '#004d40',
          '--calendar-outside-color-dark': '#bebebe',
          '--calendar-outside-background': '#00000000',
          '--calendar-outside-background-dark': '#121212',
          '--calendar-selected-color': '#027BE3',
          '--calendar-selected-color-dark': '#027BE3',
          '--calendar-selected-background': '#cce7ff',
          '--calendar-selected-background-dark': '#cce7ff',
          '--calendar-mini-selected-color': 'unset',
          '--calendar-mini-selected-color-dark': '#027BE3',
          '--calendar-mini-selected-background': 'unset',
          '--calendar-mini-selected-background-dark': '#cce7ff',
          '--calendar-mini-selected-label-color': '#027BE3',
          '--calendar-mini-selected-label-color-dark': '#cce7ff',
          '--calendar-mini-selected-label-background': '#cce7ff',
          '--calendar-mini-selected-label-background-dark': '#027BE3',
          '--calendar-range-color': '#027BE3',
          '--calendar-range-color-dark': '#027BE3',
          '--calendar-range-background': '#cce7ff',
          '--calendar-range-background-dark': '#cce7ff',
          '--calendar-mini-range-color': '#cce7ff',
          '--calendar-mini-range-color-dark': '#027BE3',
          '--calendar-mini-range-background': 'unset',
          '--calendar-mini-range-background-dark': 'unset',
          '--calendar-mini-range-label-color': '#cce7ff',
          '--calendar-mini-range-label-color-dark': '#027BE3',
          '--calendar-mini-range-label-background': '#cce7ff',
          '--calendar-mini-range-label-background-dark': '#cce7ff',
          '--calendar-mini-range-connector-color': '#cce7ff',
          '--calendar-mini-range-connector-color-dark': '#ffff66',
          '--calendar-mini-range-hover-color': '#027BE3',
          '--calendar-mini-range-hover-color-dark': '#ffff66',
          '--calendar-mini-range-firstlast-color': '#cce7ff',
          '--calendar-mini-range-firstlast-color-dark': '#cce7ff',
          '--calendar-mini-range-firstlast-background': 'unset',
          '--calendar-mini-range-firstlast-background-dark': '#cce7ff',
          '--calendar-mini-range-firstlast-label-color': '#cce7ff',
          '--calendar-mini-range-firstlast-label-color-dark': '#cce7ff',
          '--calendar-mini-range-firstlast-label-background': '#027BE3',
          '--calendar-mini-range-firstlast-label-background-dark': '#ffff66',
          '--calendar-intervals-width': '56px',
          '--calendar-work-week-width': '30px',
          '--calendar-mini-work-week-width': '30px',
          '--calendar-work-week-font-size': '1.0em',
          '--calendar-head-font-weight': '600'
        },
        brown: {
          '--calendar-border': '#a1887f 1px solid',
          '--calendar-border-dark': '#efebe9 1px solid',
          '--calendar-border-section': '#bcaaa4 1px dashed',
          '--calendar-border-section-dark': '#bcaaa4 1px dashed',
          '--calendar-border-current': '#a1887f 2px solid',
          '--calendar-border-current-dark': '#8d6e63 2px solid',
          '--calendar-border-droppable': '#027BE3 1px dashed',
          '--calendar-border-droppable-dark': '#ffff66 1px dashed',
          '--calendar-mini-range-connector-hover-border': '#027BE3 1px dashed',
          '--calendar-mini-range-connector-hover-border-dark': '#ffff66 1px dashed',
          '--calendar-color': '#3e2723',
          '--calendar-color-dark': '#efebe9',
          '--calendar-background': '#efebe9',
          '--calendar-background-dark': '#3e2723',
          '--calendar-current-color': '#027BE3',
          '--calendar-current-color-dark': '#efebe9',
          '--calendar-current-background': '#00000000',
          '--calendar-current-background-dark': '#3e2723',
          '--calendar-disabled-date-color': '#efebe9',
          '--calendar-disabled-date-color-dark': '#bebebe',
          '--calendar-disabled-date-background': '#bcaaa4',
          '--calendar-disabled-date-background-dark': '#121212',
          '--calendar-active-date-color': '#efebe9',
          '--calendar-active-date-color-dark': '#ffff66',
          '--calendar-active-date-background': '#8d6e63',
          '--calendar-active-date-background-dark': '#a1887f',
          '--calendar-outside-color': '#3e2723',
          '--calendar-outside-color-dark': '#bebebe',
          '--calendar-outside-background': '#00000000',
          '--calendar-outside-background-dark': '#121212',
          '--calendar-selected-color': '#027BE3',
          '--calendar-selected-color-dark': '#027BE3',
          '--calendar-selected-background': '#cce7ff',
          '--calendar-selected-background-dark': '#cce7ff',
          '--calendar-mini-selected-color': 'unset',
          '--calendar-mini-selected-color-dark': '#027BE3',
          '--calendar-mini-selected-background': 'unset',
          '--calendar-mini-selected-background-dark': '#cce7ff',
          '--calendar-mini-selected-label-color': '#027BE3',
          '--calendar-mini-selected-label-color-dark': '#cce7ff',
          '--calendar-mini-selected-label-background': '#cce7ff',
          '--calendar-mini-selected-label-background-dark': '#027BE3',
          '--calendar-range-color': '#027BE3',
          '--calendar-range-color-dark': '#027BE3',
          '--calendar-range-background': '#cce7ff',
          '--calendar-range-background-dark': '#cce7ff',
          '--calendar-mini-range-color': '#cce7ff',
          '--calendar-mini-range-color-dark': '#027BE3',
          '--calendar-mini-range-background': 'unset',
          '--calendar-mini-range-background-dark': 'unset',
          '--calendar-mini-range-label-color': '#cce7ff',
          '--calendar-mini-range-label-color-dark': '#027BE3',
          '--calendar-mini-range-label-background': '#cce7ff',
          '--calendar-mini-range-label-background-dark': '#cce7ff',
          '--calendar-mini-range-connector-color': '#cce7ff',
          '--calendar-mini-range-connector-color-dark': '#ffff66',
          '--calendar-mini-range-hover-color': '#027BE3',
          '--calendar-mini-range-hover-color-dark': '#ffff66',
          '--calendar-mini-range-firstlast-color': '#cce7ff',
          '--calendar-mini-range-firstlast-color-dark': '#cce7ff',
          '--calendar-mini-range-firstlast-background': 'unset',
          '--calendar-mini-range-firstlast-background-dark': '#cce7ff',
          '--calendar-mini-range-firstlast-label-color': '#cce7ff',
          '--calendar-mini-range-firstlast-label-color-dark': '#cce7ff',
          '--calendar-mini-range-firstlast-label-background': '#027BE3',
          '--calendar-mini-range-firstlast-label-background-dark': '#ffff66',
          '--calendar-intervals-width': '56px',
          '--calendar-work-week-width': '30px',
          '--calendar-mini-work-week-width': '30px',
          '--calendar-work-week-font-size': '1.0em',
          '--calendar-head-font-weight': '600'
        },
        'deep purple': {
          '--calendar-border': '#9575cd 1px solid',
          '--calendar-border-dark': '#ede7f6 1px solid',
          '--calendar-border-section': '#b39ddb 1px dashed',
          '--calendar-border-section-dark': '#b39ddb 1px dashed',
          '--calendar-border-current': '#9575cd 2px solid',
          '--calendar-border-current-dark': '#651fff 2px solid',
          '--calendar-border-droppable': '#027BE3 1px dashed',
          '--calendar-border-droppable-dark': '#ffff66 1px dashed',
          '--calendar-mini-range-connector-hover-border': '#027BE3 1px dashed',
          '--calendar-mini-range-connector-hover-border-dark': '#ffff66 1px dashed',
          '--calendar-color': '#311b92',
          '--calendar-color-dark': '#ede7f6',
          '--calendar-background': '#ede7f6',
          '--calendar-background-dark': '#311b92',
          '--calendar-current-color': '#027BE3',
          '--calendar-current-color-dark': '#651fff',
          '--calendar-current-background': '#00000000',
          '--calendar-current-background-dark': '#311b92',
          '--calendar-disabled-date-color': '#ede7f6',
          '--calendar-disabled-date-color-dark': '#bebebe',
          '--calendar-disabled-date-background': '#b39ddb',
          '--calendar-disabled-date-background-dark': '#121212',
          '--calendar-active-date-color': '#ede7f6',
          '--calendar-active-date-color-dark': '#ffff66',
          '--calendar-active-date-background': '#651fff',
          '--calendar-active-date-background-dark': '#9575cd',
          '--calendar-outside-color': '#311b92',
          '--calendar-outside-color-dark': '#bebebe',
          '--calendar-outside-background': '#00000000',
          '--calendar-outside-background-dark': '#121212',
          '--calendar-selected-color': '#027BE3',
          '--calendar-selected-color-dark': '#027BE3',
          '--calendar-selected-background': '#cce7ff',
          '--calendar-selected-background-dark': '#cce7ff',
          '--calendar-mini-selected-color': 'unset',
          '--calendar-mini-selected-color-dark': '#027BE3',
          '--calendar-mini-selected-background': 'unset',
          '--calendar-mini-selected-background-dark': '#cce7ff',
          '--calendar-mini-selected-label-color': '#027BE3',
          '--calendar-mini-selected-label-color-dark': '#cce7ff',
          '--calendar-mini-selected-label-background': '#cce7ff',
          '--calendar-mini-selected-label-background-dark': '#027BE3',
          '--calendar-range-color': '#027BE3',
          '--calendar-range-color-dark': '#027BE3',
          '--calendar-range-background': '#cce7ff',
          '--calendar-range-background-dark': '#cce7ff',
          '--calendar-mini-range-color': '#cce7ff',
          '--calendar-mini-range-color-dark': '#027BE3',
          '--calendar-mini-range-background': 'unset',
          '--calendar-mini-range-background-dark': 'unset',
          '--calendar-mini-range-label-color': '#cce7ff',
          '--calendar-mini-range-label-color-dark': '#027BE3',
          '--calendar-mini-range-label-background': '#cce7ff',
          '--calendar-mini-range-label-background-dark': '#cce7ff',
          '--calendar-mini-range-connector-color': '#cce7ff',
          '--calendar-mini-range-connector-color-dark': '#ffff66',
          '--calendar-mini-range-hover-color': '#027BE3',
          '--calendar-mini-range-hover-color-dark': '#ffff66',
          '--calendar-mini-range-firstlast-color': '#cce7ff',
          '--calendar-mini-range-firstlast-color-dark': '#cce7ff',
          '--calendar-mini-range-firstlast-background': 'unset',
          '--calendar-mini-range-firstlast-background-dark': '#cce7ff',
          '--calendar-mini-range-firstlast-label-color': '#cce7ff',
          '--calendar-mini-range-firstlast-label-color-dark': '#cce7ff',
          '--calendar-mini-range-firstlast-label-background': '#027BE3',
          '--calendar-mini-range-firstlast-label-background-dark': '#ffff66',
          '--calendar-intervals-width': '56px',
          '--calendar-work-week-width': '30px',
          '--calendar-mini-work-week-width': '30px',
          '--calendar-work-week-font-size': '1.0em',
          '--calendar-head-font-weight': '600'
        },
        indigo: {
          '--calendar-border': '#7986cb 1px solid',
          '--calendar-border-dark': '#e8eaf6 1px solid',
          '--calendar-border-section': '#9fa8da 1px dashed',
          '--calendar-border-section-dark': '#9fa8da 1px dashed',
          '--calendar-border-current': '#7986cb 2px solid',
          '--calendar-border-current-dark': '#3d5afe 2px solid',
          '--calendar-border-droppable': '#027BE3 1px dashed',
          '--calendar-border-droppable-dark': '#ffff66 1px dashed',
          '--calendar-mini-range-connector-hover-border': '#027BE3 1px dashed',
          '--calendar-mini-range-connector-hover-border-dark': '#ffff66 1px dashed',
          '--calendar-color': '#1a237e',
          '--calendar-color-dark': '#e8eaf6',
          '--calendar-background': '#e8eaf6',
          '--calendar-background-dark': '#1a237e',
          '--calendar-current-color': '#027BE3',
          '--calendar-current-color-dark': '#3d5afe',
          '--calendar-current-background': '#00000000',
          '--calendar-current-background-dark': '#1a237e',
          '--calendar-disabled-date-color': '#e8eaf6',
          '--calendar-disabled-date-color-dark': '#bebebe',
          '--calendar-disabled-date-background': '#9fa8da',
          '--calendar-disabled-date-background-dark': '#121212',
          '--calendar-active-date-color': '#e8eaf6',
          '--calendar-active-date-color-dark': '#ffff66',
          '--calendar-active-date-background': '#3d5afe',
          '--calendar-active-date-background-dark': '#7986cb',
          '--calendar-outside-color': '#1a237e',
          '--calendar-outside-color-dark': '#bebebe',
          '--calendar-outside-background': '#00000000',
          '--calendar-outside-background-dark': '#121212',
          '--calendar-selected-color': '#027BE3',
          '--calendar-selected-color-dark': '#027BE3',
          '--calendar-selected-background': '#cce7ff',
          '--calendar-selected-background-dark': '#cce7ff',
          '--calendar-mini-selected-color': 'unset',
          '--calendar-mini-selected-color-dark': '#027BE3',
          '--calendar-mini-selected-background': 'unset',
          '--calendar-mini-selected-background-dark': '#cce7ff',
          '--calendar-mini-selected-label-color': '#027BE3',
          '--calendar-mini-selected-label-color-dark': '#cce7ff',
          '--calendar-mini-selected-label-background': '#cce7ff',
          '--calendar-mini-selected-label-background-dark': '#027BE3',
          '--calendar-range-color': '#027BE3',
          '--calendar-range-color-dark': '#027BE3',
          '--calendar-range-background': '#cce7ff',
          '--calendar-range-background-dark': '#cce7ff',
          '--calendar-mini-range-color': '#cce7ff',
          '--calendar-mini-range-color-dark': '#027BE3',
          '--calendar-mini-range-background': 'unset',
          '--calendar-mini-range-background-dark': 'unset',
          '--calendar-mini-range-label-color': '#cce7ff',
          '--calendar-mini-range-label-color-dark': '#027BE3',
          '--calendar-mini-range-label-background': '#cce7ff',
          '--calendar-mini-range-label-background-dark': '#cce7ff',
          '--calendar-mini-range-connector-color': '#cce7ff',
          '--calendar-mini-range-connector-color-dark': '#ffff66',
          '--calendar-mini-range-hover-color': '#027BE3',
          '--calendar-mini-range-hover-color-dark': '#ffff66',
          '--calendar-mini-range-firstlast-color': '#cce7ff',
          '--calendar-mini-range-firstlast-color-dark': '#cce7ff',
          '--calendar-mini-range-firstlast-background': 'unset',
          '--calendar-mini-range-firstlast-background-dark': '#cce7ff',
          '--calendar-mini-range-firstlast-label-color': '#cce7ff',
          '--calendar-mini-range-firstlast-label-color-dark': '#cce7ff',
          '--calendar-mini-range-firstlast-label-background': '#027BE3',
          '--calendar-mini-range-firstlast-label-background-dark': '#ffff66',
          '--calendar-intervals-width': '56px',
          '--calendar-work-week-width': '30px',
          '--calendar-mini-work-week-width': '30px',
          '--calendar-work-week-font-size': '1.0em',
          '--calendar-head-font-weight': '600'
        },
        blue: {
          '--calendar-border': '#64b5f6 1px solid',
          '--calendar-border-dark': '#e3f2fd 1px solid',
          '--calendar-border-section': '#90caf9 1px dashed',
          '--calendar-border-section-dark': '#90caf9 1px dashed',
          '--calendar-border-current': '#64b5f6 2px solid',
          '--calendar-border-current-dark': '#2979ff 2px solid',
          '--calendar-border-droppable': '#027BE3 1px dashed',
          '--calendar-border-droppable-dark': '#ffff66 1px dashed',
          '--calendar-mini-range-connector-hover-border': '#027BE3 1px dashed',
          '--calendar-mini-range-connector-hover-border-dark': '#ffff66 1px dashed',
          '--calendar-color': '#0d47a0',
          '--calendar-color-dark': '#e3f2fd',
          '--calendar-background': '#e3f2fd',
          '--calendar-background-dark': '#0d47a0',
          '--calendar-current-color': '#027BE3',
          '--calendar-current-color-dark': '#2979ff',
          '--calendar-current-background': '#00000000',
          '--calendar-current-background-dark': '#0d47a0',
          '--calendar-disabled-date-color': '#e3f2fd',
          '--calendar-disabled-date-color-dark': '#bebebe',
          '--calendar-disabled-date-background': '#90caf9',
          '--calendar-disabled-date-background-dark': '#121212',
          '--calendar-active-date-color': '#e3f2fd',
          '--calendar-active-date-color-dark': '#ffff66',
          '--calendar-active-date-background': '#2979ff',
          '--calendar-active-date-background-dark': '#64b5f6',
          '--calendar-outside-color': '#0d47a0',
          '--calendar-outside-color-dark': '#bebebe',
          '--calendar-outside-background': '#00000000',
          '--calendar-outside-background-dark': '#121212',
          '--calendar-selected-color': '#027BE3',
          '--calendar-selected-color-dark': '#027BE3',
          '--calendar-selected-background': '#cce7ff',
          '--calendar-selected-background-dark': '#cce7ff',
          '--calendar-mini-selected-color': 'unset',
          '--calendar-mini-selected-color-dark': '#027BE3',
          '--calendar-mini-selected-background': 'unset',
          '--calendar-mini-selected-background-dark': '#cce7ff',
          '--calendar-mini-selected-label-color': '#027BE3',
          '--calendar-mini-selected-label-color-dark': '#cce7ff',
          '--calendar-mini-selected-label-background': '#cce7ff',
          '--calendar-mini-selected-label-background-dark': '#027BE3',
          '--calendar-range-color': '#027BE3',
          '--calendar-range-color-dark': '#027BE3',
          '--calendar-range-background': '#cce7ff',
          '--calendar-range-background-dark': '#cce7ff',
          '--calendar-mini-range-color': '#cce7ff',
          '--calendar-mini-range-color-dark': '#027BE3',
          '--calendar-mini-range-background': 'unset',
          '--calendar-mini-range-background-dark': 'unset',
          '--calendar-mini-range-label-color': '#cce7ff',
          '--calendar-mini-range-label-color-dark': '#027BE3',
          '--calendar-mini-range-label-background': '#cce7ff',
          '--calendar-mini-range-label-background-dark': '#cce7ff',
          '--calendar-mini-range-connector-color': '#cce7ff',
          '--calendar-mini-range-connector-color-dark': '#ffff66',
          '--calendar-mini-range-hover-color': '#027BE3',
          '--calendar-mini-range-hover-color-dark': '#ffff66',
          '--calendar-mini-range-firstlast-color': '#cce7ff',
          '--calendar-mini-range-firstlast-color-dark': '#cce7ff',
          '--calendar-mini-range-firstlast-background': 'unset',
          '--calendar-mini-range-firstlast-background-dark': '#cce7ff',
          '--calendar-mini-range-firstlast-label-color': '#cce7ff',
          '--calendar-mini-range-firstlast-label-color-dark': '#cce7ff',
          '--calendar-mini-range-firstlast-label-background': '#027BE3',
          '--calendar-mini-range-firstlast-label-background-dark': '#ffff66',
          '--calendar-intervals-width': '56px',
          '--calendar-work-week-width': '30px',
          '--calendar-mini-work-week-width': '30px',
          '--calendar-work-week-font-size': '1.0em',
          '--calendar-head-font-weight': '600'
        }
      }
    }
  },
  computed: {
    themesList () {
      const list = []
      Object.keys(this.themes).forEach((theme) => {
        list.push({
          label: theme,
          value: { ...this.themes[ theme ] }
        })
      })
      return list
    }
  },
  methods: {
    onToday () {
      this.$refs.calendar.moveToToday()
    },
    onPrev () {
      this.$refs.calendar.prev()
    },
    onNext () {
      this.$refs.calendar.next()
    },
    onMoved (data) {
      console.log('onMoved', data)
    },
    onChange (data) {
      console.log('onChange', data)
    },
    onClickDate (data) {
      console.log('onClickDate', data)
    },
    onClickDay (data) {
      console.log('onClickDay', data)
    },
    onClickWorkweek (data) {
      console.log('onClickWorkweek', data)
    },
    onClickHeadDay (data) {
      console.log('onClickHeadDay', data)
    },
    onClickHeadWorkweek (data) {
      console.log('onClickHeadWorkweek', data)
    }
  }
})
</script>

<style lang="sass" scoped>
.select
  display: flex
  flex: 1 1 100%
  flex-direction: row
  justify-content: center
  margin: 4px

</style>

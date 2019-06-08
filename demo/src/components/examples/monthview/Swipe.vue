<template>
  <div>
    <q-expansion-item
      group="someGroup"
      caption="Code"
    >
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="left"
          narrow-indicator
        >
          <q-tab name="template" label="Template" />
          <q-tab name="script" label="Script" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="template">
            <q-markdown :src="template" />
          </q-tab-panel>

          <q-tab-panel name="script">
            <q-markdown :src="script" />
          </q-tab-panel>

        </q-tab-panels>
      </q-card>
    </q-expansion-item>
    <q-separator />
    <q-calendar
      ref="calendar"
      v-model="selectedDate"
      view="month"
      locale="en-us"
      v-touch-swipe.mouse.left.right="handleSwipe"
      :animated="true"
      transition-prev="slide-right"
      transition-next="slide-left"
      style="height: 400px;"
    />
  </div>
</template>

<script>
import template from '../../../markdown/examples/template/monthview/swipe.md'
import script from '../../../markdown/examples/script/monthview/swipe.md'
import { stopAndPrevent } from 'quasar/src/utils/event'

export default {
  name: 'WeekViewSwipe',

  data () {
    return {
      tab: 'template',
      selectedDate: '2019-04-01',
      dragging: false, // used for drag-and-drop
      ignoreNextSwipe: false, // used for drag-and-drop
      template: template,
      script: script
    }
  },

  methods: {
    calendarNext () {
      this.$refs.calendar.next()
    },
    calendarPrev () {
      this.$refs.calendar.prev()
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
    }
  }
}
</script>

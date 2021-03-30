<template>
  <div class="subcontent">
    <div class="line">The example below uses the <code class="example-token">day-container</code> slot to show a current time indicator absolutely positioned.</div>

    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div style="display: flex; justify-content: center; align-items: center; flex-wrap: nowrap;">
      <div style="display: flex; max-width: 800px; width: 100%; height: 400px;">
        <q-calendar-day
          ref="calendar"
          v-model="selectedDate"
          view="week"
          animated
          bordered
          :hour24-format="toggled"
          :interval-minutes="15"
          :interval-count="96"
          :interval-height="10"
          transition-next="slide-left"
          transition-prev="slide-right"
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-time="onClickTime"
          @click-interval="onClickInterval"
          @click-head-intervals="onClickHeadIntervals"
          @click-head-day="onClickHeadDay"
        >
          <template #day-container="{ scope: { days }}">
            <template v-if="hasDate(days)">
              <div
                class="day-view-current-time-indicator"
                :style="style"
              />
              <div
                class="day-view-current-time-line"
                :style="style"
              />
            </template>
          </template>
        </q-calendar-day>
      </div>
    </div>
  </div>
</template>

<script>
import { QCalendarDay } from '@quasar/quasar-ui-qcalendar/QCalendarDay.js'
import { today, parseDate } from '@quasar/quasar-ui-qcalendar/Timestamp.js'
import '@quasar/quasar-ui-qcalendar/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarDay.sass'

import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'

export default defineComponent({
  name: 'WeekSlotDayContainerShowCurrentTime',
  components: {
    NavigationBar,
    QCalendarDay
  },
  setup () {
    const selectedDate = ref(today()),
      calendar = ref(null),
      toggled = ref(false),
      currentDate = ref(null),
      currentTime = ref(null),
      timeStartPos = ref(0)
    let intervalId = null

    const style = computed(() => {
      return {
        top: timeStartPos.value + 'px'
      }
    })

    onMounted(() => {
      adjustCurrentTime()
      // now, adjust the time every minute
      intervalId = setInterval(() => {
        adjustCurrentTime()
      }, 60000)
    })

    onBeforeUnmount(() => {
      clearInterval(intervalId)
    })

    function hasDate (days) {
      return currentDate.value
        ? days.find(day => day.date === currentDate.value)
        : false
    }
    function onNext () {
      calendar.value.next()
    }
    function onPrev () {
      calendar.value.prev()
    }
    function onToggle () {
      toggled.value = !toggled.value
    }
    function onToday () {
      calendar.value.moveToToday()
    }
    function onMoved (data) {
      console.log('onMoved', data)
    }
    function onChange (data) {
      console.log('onChange', data)
    }
    function onClickDate (data) {
      console.log('onClickDate', data)
    }
    function onClickTime (data) {
      console.log('onClickTime', data)
    }
    function onClickInterval (data) {
      console.log('onClickInterval', data)
    }
    function onClickHeadIntervals (data) {
      console.log('onClickHeadIntervals', data)
    }
    function onClickHeadDay (data) {
      console.log('onClickHeadDay', data)
    }
    function adjustCurrentTime () {
      const now = parseDate(new Date())
      currentDate.value = now.date
      currentTime.value = now.time
      timeStartPos.value = calendar.value.timeStartPos(currentTime.value)
    }

    return {
      selectedDate,
      calendar,
      toggled,
      style,
      hasDate,
      onNext,
      onPrev,
      onToggle,
      onToday,
      onMoved,
      onChange,
      onClickDate,
      onClickTime,
      onClickInterval,
      onClickHeadIntervals,
      onClickHeadDay
    }
  }
})
</script>

<style lang="sass">
.day-view-current-time-indicator
  position: absolute
  left: -5px
  height: 10px
  width: 10px
  margin-top: -4px
  background-color: rgba(0, 0, 255, .5)
  border-radius: 50%

.day-view-current-time-line
  position: absolute
  left: 5px
  border-top: rgba(0, 0, 255, .5) 2px solid
  width: calc(100% - 5px)

.q-dark,
.body--dark,
.q-calendar--dark
  .day-view-current-time-indicator
    background-color: rgba(255, 255, 0, .85)

  .day-view-current-time-line
    border-top: rgba(255, 255, 0, .85) 2px solid

</style>

<template>
  <div class="row justify-center full-width q-pa-md">
    <div
      draggable
      style="cursor: pointer"
    >Drag me</div>
    <q-calendar
      v-model="selectedDate"
      view="day-resource"
      :resources="resources"
      :resource-height="100"
      locale="en-us"
      :drop-func="onDrop"
      :drag-over-func="onDragOver"
      hour24-format
      interval-minutes="30"
      interval-start="16"
      interval-count="30"
      interval-width="40"
      transition-prev="slide-right"
      transition-next="slide-left"
      style="height: 400px; max-width: 1300px; width: 100%;"
    >
      <template #resource-intervals="scope">
        <template v-for="(schedule, index) in events.filter(e => e.date === scope.intervals[0][0].date && e.resourceId == scope.resource.resourceId)">
          <q-badge
            :key="index"
            draggable
            @dragstart.stop="(event) => onDragStart(event, schedule)"
            @mousemove.stop="onMouseMove"
            class="q-pa-xs"
            :style="`position: absolute; top: ${index * 22}px;left: ${scope.timeStartPosX(schedule.start)}px; color: ${schedule.txtColor}; background-color: ${schedule.bgColor}; width: ${eventWidth(schedule, scope.timeDurationWidth)}`"
          >
            {{schedule.title}}
          </q-badge>
        </template>
      </template>
    </q-calendar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectedDate: '2020-09-21',
      movingCopy: null,
      resources: [
        { label: 'John', resourceId: 0 },
        { label: 'Mary', resourceId: 1 },
        { label: 'Susan', resourceId: 2 },
        { label: 'Susan', resourceId: 3 },
        { label: 'Olivia', resourceId: 4 },
        { label: 'Board Room', resourceId: 5 },
        { label: 'Room-1', resourceId: 6 },
        { label: 'Room-2', resourceId: 7 }
      ],
      events: [
        {
          eventId: '0',
          resourceId: 0,
          date: '2020-09-21',
          start: '08:30',
          end: '17:30',
          title: 'Something to do',
          bgColor: '#777',
          txtColor: '#fff'
        },
        {
          eventId: '1',
          resourceId: 2,
          date: '2020-09-21',
          start: '08:30',
          end: '17:30',
          title: 'Semthing to do',
          bgColor: '#707',
          txtColor: '#fff'
        },
        {
          eventId: '2',
          resourceId: 3,
          date: '2020-09-21',
          start: '08:30',
          end: '17:30',
          title: 'Something to do',
          bgColor: '#700',
          txtColor: '#fff'
        }
      ]
    }
  },

  methods: {
    getEventDurationMin (event) {
      const start = new Date(event.date + ' ' + event.start + '+0')
      const end = new Date(event.date + ' ' + event.end + '+0')
      const ms = end.getTime() - start.getTime()
      const mins = ms / (60 * 1000) // 1 min = 60s = (60 * 1000)ms
      return mins
    },

    onMouseMove (evt) {
      // console.log(`Mouse: (${evt.offsetX}, ${evt.offsetY}) => inside badge (${evt.target.offsetLeft + evt.offsetX}, ${evt.target.offsetTop + evt.offsetY})`)
    },

    eventWidth (event, timeDurationWidth) {
      return timeDurationWidth(this.getEventDurationMin(event)) + 'px'
    },

    onDragStart (event, schedule) {
      console.log(event.source)

      event.dataTransfer.setData('text/json', JSON.stringify(schedule))
      event.effectAllowed = 'copyMove'
      event.dataTransfer.setDragImage(event.target, 0, 0)
      // set badge position start to
    },

    onDrop (event, resource, type, interval) {
      console.log('Drop')
      console.log(event)
      console.log(resource)
      console.log(type)
      console.log(interval)
      const schedule = JSON.parse(event.dataTransfer.getData('text/json'))
      // calculate new end time
      const time = new Date(`${interval.date} ${interval.time}`)
      const durMins = this.getEventDurationMin(schedule)
      const timestamp = time.getTime() + durMins * 60 * 1000
      const newDate = new Date(timestamp)
      const newEndTime = `${newDate.getHours()}:${newDate.getMinutes()}`

      const sch2change = this.events.filter(e => e.eventId === schedule.eventId)[0]
      sch2change.start = interval.time
      sch2change.end = newEndTime
      sch2change.resourceId = resource.resourceId
      alert(`Drop on ${interval.time} => end at ${newEndTime}`)

      // if (this.movingCopy !== undefined) {
      //   document.body.removeChild(this.movingCopy)
      // }
    },

    onDragOver (e, day, type) {
      console.log('Drag over')
      e.preventDefault()
      console.log(type)
      console.log(day)
      console.log(e.y)
      if (type === 'interval') {
        console.log(day)
      }
    }
  }
}
</script>

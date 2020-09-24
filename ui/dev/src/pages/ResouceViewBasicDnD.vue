<template>
  <div class="row justify-center full-width q-pa-md">
    <q-calendar
      v-model="selectedDate"
      view="day-resource"
      :resources="resources"
      :resource-height="100"
      locale="en-us"
      :drop-func="onDrop"
      :drag-over-func="onDragOver"
      @mouseup:resource:interval="onMouseUp"
      @mouseup:resource:intervals="onMouseUp"
      @mousedown:resource:intervals="onMouseDown"
      @mousemove:resource:intervals="onMouseMove"
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
        <template v-for="(rEvent, index) in rEvents.filter(e => e.date === scope.intervals[0][0].date && e.resourceId == scope.resource.resourceId)">
          <q-badge
            :key="index"
            draggable
            @dragstart.stop="(event) => onDragStart(event, rEvent)"
            @mousemove.stop="onMouseMove"
            @mousedown.stop="(e) => onMouseDown(e, rEvent.eventId)"
            @mouseup.stop="dispatchEvent"
            class="q-pa-xs resizable"
            :style="`position: absolute; top: ${index * 22}px;left: ${scope.timeStartPosX(rEvent.start)}px; color: ${rEvent.txtColor}; background-color: ${rEvent.bgColor}; width: ${eventWidth(rEvent, scope.timeDurationWidth)}`"
          >
            {{rEvent.title}}
          </q-badge>
        </template>
      </template>
    </q-calendar>
  </div>
</template>

<style lang="sass">
.resizable
  padding: 3px 18px
  user-select: none
  border-radius: 10px

.resizable:before
  position: absolute
  left: 0
  cursor: w-resize
  width: 15px
  content: '<'
  padding: 3px
  border-radius: 50%
  background-color: black
  text-align: center

.resizable:after
  position: absolute
  right: 0px
  cursor: w-resize
  width: 15px
  border-radius: 50%
  content: '>'
  padding: 3px
  background-color: black
  text-align: center
</style>

<script>
export default {
  data () {
    return {
      selectedDate: '2020-09-21',
      movingCopy: null,
      dndHelper: {
        lastX: 0
      },
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
      rEvents: [ // to avoid ambiguos name with mouse/drag events
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
          title: 'Something to do',
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
    getEventDurationMin (rEvent) {
      const start = new Date(`${rEvent.date} ${rEvent.start}`)
      const end = new Date(`${rEvent.date} ${rEvent.end}`)
      const ms = end.getTime() - start.getTime() // duration in ms
      const mins = ms / (60 * 1000) // 1 min = 60s = (60 * 1000)ms
      return mins
    },

    dispatchEvent (e) {
      // trigger the onmouseup event on time container (resource-interval)
      document.elementsFromPoint(e.x, e.y)[1].dispatchEvent(new MouseEvent('mouseup', e))
    },

    updateEventTimeValue (key, value) {
      const plaEvent = this.rEvents.filter(e => e.eventId === this.dndHelper.eventId.toString())[0]
      if (plaEvent[key] === value) {
        this.revertToLatestState()
      } else {
        plaEvent[key] = value
      }
    },

    revertToLatestState () {
      this.dndHelper.target.style.left = this.dndHelper.leftCopy
      this.dndHelper.target.style.width = this.dndHelper.widthCopy
    },

    onMouseMove (evt) {
      // console.log(`Mouse: (${evt.offsetX}, ${evt.offsetY}) => inside badge (${evt.target.offsetLeft + evt.offsetX}, ${evt.target.offsetTop + evt.offsetY})`)
    },

    onMouseDown (e, eventId) {
      if (e.x === undefined) {
        return
      }
      this.dndHelper.lastX = e.x
      this.dndHelper.copyX = e.x
      this.dndHelper.eventId = eventId
      this.dndHelper.leftCopy = e.target.style.left
      this.dndHelper.widthCopy = e.target.style.width
      const ox = e.offsetX
      if (ox < 15) {
        this.dndHelper.start = 'before'
        this.dndHelper.isSizing = true
        e.target.setAttribute('draggable', false)
      } else if (ox > e.target.offsetWidth - 15 && ox < e.target.offsetWidth) {
        this.dndHelper.start = 'after'
        this.dndHelper.isSizing = true
        e.target.setAttribute('draggable', false)
      } else {
        this.dndHelper.start = ''
        if (e.target.tagName === 'SPAN') {
          e.target.parentElement.setAttribute('draggable', true)
        } else {
          e.target.setAttribute('draggable', true)
        }
        return
      }
      this.dndHelper.mode = 'resizing'
      this.dndHelper.target = e.target
      document.body.onmouseup = this.onMouseUp
      document.body.style.cursor = 'w-resize'
    },

    onMouseMove (event) {
      if (!this.dndHelper.isSizing) {
        return
      }

      // calculate the displacement of cursor (note: will be positive or negative according to direction)
      const e = event.event !== undefined ? event.event : event
      const delta = e.x - this.dndHelper.lastX
      this.dndHelper.copyX = this.dndHelper.lastX
      this.dndHelper.lastX = e.x
      // get style left integer
      if (this.dndHelper.start === 'before') {
        const l = this.dndHelper.target.style.left
        const w = this.dndHelper.target.style.width
        const left = parseInt(l.replace('px', ''))
        const width = parseInt(w.replace('px', ''))
        const newLeft = left + delta
        if (newLeft < left + width - 20 && newLeft >= 0) {
          const newWidth = width - delta
          this.dndHelper.target.style.left = `${newLeft}px`
          this.dndHelper.target.style.width = `${newWidth}px`
        } else {
          this.dndHelper.lastX = this.dndHelper.copyX
        }
      } else if (this.dndHelper.start === 'after') {
        const w = this.dndHelper.target.style.width
        const width = parseInt(w.replace('px', ''))
        const newWidth = width + delta
        if (newWidth > 10) {
          this.dndHelper.target.style.width = `${newWidth}px`
        } else {
          this.dndHelper.lastX = this.dndHelper.copyX
        }
      }
    },

    onMouseUp (event) {
      this.dndHelper.isSizing = false

      if (this.dndHelper.target === undefined) {
        return
      }

      const e = event.event
      const scope = event.scope

      if (scope !== undefined && scope.interval !== undefined) {
        // this is a dispatched event to get reource interval
        e.stopPropagation() // if it happend to be a resource:interval avoid propagation to parent
        if (this.dndHelper.start === 'before') {

          this.updateEventTimeValue('start', scope.interval.time)
        } else if (this.dndHelper.start === 'after') {
          this.updateEventTimeValue('end', scope.interval.time)
        } else {
          this.dndHelper.target.style.left = this.dndHelper.leftCopy
          this.dndHelper.target.style.width = this.dndHelper.widthCopy
        }
      } else if (this.dndHelper.start === 'before') {
        this.revertToLatestState()
      } else if (this.dndHelper.start === 'after') {
        this.revertToLatestState()
      }



      if (this.dndHelper.target !== undefined) {
        this.dndHelper.target.parentElement.onmousemove = () => { }
        this.dndHelper.target.parentElement.onmouseup = () => { }

      }

      this.dndHelper.target = undefined
      document.body.onmouseup = () => { }
      this.dndHelper.lastX = 0
      this.dndHelper.mode = ''
      document.body.style.cursor = ''
    },

    eventWidth (rEvent, timeDurationWidth) {
      return timeDurationWidth(this.getEventDurationMin(rEvent)) + 'px'
    },

    onDragStart (event, rEvent) {

      event.dataTransfer.setData('text/json', JSON.stringify(rEvent))
      event.effectAllowed = 'copyMove'
      // set badge position start to cursor position, will alway set the start time
      event.dataTransfer.setDragImage(event.target, 0, event.target.clientHeight / 2)
    },

    onDrop (event, resource, type, interval) {

      const rEvent = JSON.parse(event.dataTransfer.getData('text/json'))
      // calculate new end time
      const time = new Date(`${interval.date} ${interval.time}`)
      const durMins = this.getEventDurationMin(rEvent)
      const timestamp = time.getTime() + durMins * 60 * 1000
      const newDate = new Date(timestamp)
      const newEndTime = `${newDate.getHours()}:${newDate.getMinutes()}`

      const evt2change = this.rEvents.filter(e => e.eventId === rEvent.eventId)[0]
      evt2change.start = interval.time
      evt2change.end = newEndTime
      evt2change.resourceId = resource.resourceId
    },

    onDragOver (e, day, type) {
      e.preventDefault()
    }
  }
}
</script>

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
      :resource-height="50"
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
        <template v-for="(event, index) in events.filter(e => e.date === scope.intervals[0][0].date && e.resourceId == scope.resource.resourceId)">
          <q-badge
            :key="index"
            draggable
            class="q-pa-sm"
            :style="`position: absolute; left: ${scope.timeStartPosX(event.start)}px; color: ${event.txtColor}; background-color: ${event.bgColor}`"
          >
            {{event.title}}
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
          resourceId: 0,
          date: '2020-09-21',
          start: '08:30',
          end: '17:30',
          title: 'Something to do',
          bgColor: '#777',
          txtColor: '#fff'
        },
        {
          resourceId: 2,
          date: '2020-09-21',
          start: '08:30',
          end: '17:30',
          title: 'Semthing to do',
          bgColor: '#707',
          txtColor: '#fff'
        },
        {
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
    onDrop (event, resource, type, index) {
      console.log('Drop')
      console.log(event);
      console.log(resource)
      console.log(type)
      console.log(index)
      alert(`Drop on ${index.time}`)
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
    },
  }
}
</script>

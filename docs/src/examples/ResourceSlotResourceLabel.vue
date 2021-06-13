<template>
  <div class="subcontent">
    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%;">
        <q-calendar-resource
          ref="calendar"
          v-model="selectedDate"
          v-model:model-resources="resources"
          resource-key="id"
          resource-label="name"
          bordered
          @change="onChange"
          @moved="onMoved"
          @resource-expanded="onResourceExpanded"
          @click-date="onClickDate"
          @click-time="onClickTime"
          @click-resource="onClickResource"
          @click-head-resources="onClickHeadResources"
          @click-interval="onClickInterval"
          :style="styles"
        >
        <template #resource-label="{ scope: { resource } }">
          <div class="col-12">
            <q-chip>
              <q-avatar>
                <img v-if="resource.avatar" :src="resource.avatar">
                <q-icon v-if="resource.icon" :name="resource.icon"></q-icon>
              </q-avatar>
              {{ resource.name }}
            </q-chip>
          </div>
        </template>

        </q-calendar-resource>
      </div>
    </div>
  </div>
</template>

<script>
import { QCalendarResource } from '@quasar/quasar-ui-qcalendar/src/QCalendarResource.js'
import { today } from '@quasar/quasar-ui-qcalendar/src/Timestamp.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarResource.sass'

import { defineComponent } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'

export default defineComponent({
  name: 'ResourceSlotResourceLabel',
  components: {
    NavigationBar,
    QCalendarResource
  },
  data () {
    return {
      selectedDate: today(),
      resources: [
        { id: '1', name: 'John', avatar: 'https://cdn.quasar.dev/img/avatar4.jpg' },
        {
          id: '2',
          name: 'Board Room',
          icon: 'meeting_room',
          expanded: false,
          children: [
            { id: '2.1', name: 'Room-1', icon: 'meeting_room' },
            {
              id: '2.2',
              name: 'Room-2',
              icon: 'meeting_room',
              expanded: false,
              children: [
                { id: '2.2.1', name: 'Partition-A', icon: 'meeting_room' },
                { id: '2.2.2', name: 'Partition-B', icon: 'meeting_room' },
                { id: '2.2.2', name: 'Partition-C', icon: 'meeting_room' }
              ]
            }
          ]
        },
        { id: '3', name: 'Mary', avatar: 'https://cdn.quasar.dev/img/avatar2.jpg' },
        { id: '4', name: 'Susan', avatar: 'https://cdn.quasar.dev/img/avatar1.jpg' },
        { id: '5', name: 'Olivia', avatar: 'https://cdn.quasar.dev/img/avatar6.jpg' }
      ]
    }
  },
  computed: {
    styles () {
      return {
        '--calendar-resources-width': 150 + 'px'
      }
    }
  },
  methods: {
    getResourceImage (resource) {
      return (resource.icon !== undefined ? resource.icon : resource.avatar !== undefined ? 'img:' + resource.avatar : '')
    },
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
    onResourceExpanded (data) {
      console.log('onResourceExpanded', data)
    },
    onClickDate (data) {
      console.log('onClickDate', data)
    },
    onClickTime (data) {
      console.log('onClickTime', data)
    },
    onClickResource (data) {
      console.log('onClickResource', data)
    },
    onClickHeadResources (data) {
      console.log('onClickHeadResources', data)
    },
    onClickInterval (data) {
      console.log('onClickInterval', data)
    }
  }
})
</script>

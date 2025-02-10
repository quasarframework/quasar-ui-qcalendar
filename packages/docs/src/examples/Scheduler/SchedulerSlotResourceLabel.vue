<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%; height: 400px">
        <q-calendar-scheduler
          ref="calendar"
          v-model="selectedDate"
          v-model:model-resources="resources"
          view="week"
          resource-key="id"
          resource-label="name"
          animated
          bordered
          :style="styles"
          @change="onChange"
          @moved="onMoved"
          @resource-expanded="onResourceExpanded"
          @click-date="onClickDate"
          @click-day-resource="onClickDayResource"
          @click-resource="onClickResource"
          @click-head-resources="onClickHeadResources"
          @click-head-day="onClickHeadDay"
        >
          <template #resource-label="{ scope: { resource } }">
            <div class="col-12">
              <q-chip>
                <q-avatar>
                  <img v-if="resource.avatar" :src="resource.avatar" />
                  <q-icon v-if="resource.icon" :name="resource.icon" />
                </q-avatar>
                {{ resource.name }}
              </q-chip>
            </div>
          </template>
        </q-calendar-scheduler>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QCalendarScheduler, today, Timestamp } from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'

import { ref, computed } from 'vue'
import NavigationBar from 'components/NavigationBar.vue'

interface Resource {
  id: string | number
  name: string
  avatar?: string
  icon?: string
  height?: number
  expanded?: boolean
  children?: Resource[]
}

const calendar = ref<QCalendarScheduler>(),
  selectedDate = ref(today()),
  resources = ref<Resource[]>([
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
            { id: '2.2.2', name: 'Partition-C', icon: 'meeting_room' },
          ],
        },
      ],
    },
    { id: '3', name: 'Mary', avatar: 'https://cdn.quasar.dev/img/avatar2.jpg' },
    { id: '4', name: 'Susan', avatar: 'https://cdn.quasar.dev/img/avatar1.jpg' },
    { id: '5', name: 'Olivia', avatar: 'https://cdn.quasar.dev/img/avatar6.jpg' },
  ])

const styles = computed(() => {
  return {
    '--calendar-resources-width': 150 + 'px',
  }
})

function onToday() {
  if (calendar.value) {
    calendar.value.moveToToday()
  }
}
function onPrev() {
  if (calendar.value) {
    calendar.value.prev()
  }
}
function onNext() {
  if (calendar.value) {
    calendar.value.next()
  }
}
function onMoved(data: Timestamp) {
  console.info('onMoved', data)
}
function onChange(data: { start: Timestamp; end: Timestamp; days: Timestamp[] }) {
  console.info('onChange', data)
}
function onResourceExpanded(data: Timestamp) {
  console.info('onResourceExpanded', data)
}
function onClickDate(data: Timestamp) {
  console.info('onClickDate', data)
}
function onClickDayResource(data: Timestamp) {
  console.info('onClickDayResource', data)
}
function onClickResource(data: Timestamp) {
  console.info('onClickResource', data)
}
function onClickHeadResources(data: Timestamp) {
  console.info('onClickHeadResources', data)
}
function onClickHeadDay(data: Timestamp) {
  console.info('onClickHeadDay', data)
}
</script>

<style lang="scss" scoped>
.my-resource-header {
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  position: relative;
  font-size: 14px;
  font-weight: 700;
}
</style>

<template>
  <div class="subcontent">
    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%; height: 400px;">
        <q-calendar-resource
          ref="calendar"
          v-model="selectedDate"
          v-model:model-resources="resources"
          resource-key="id"
          resource-label="name"
          animated
          bordered
          @change="onChange"
          @moved="onMoved"
          @resource-expanded="onResourceExpanded"
          @click-date="onClickDate"
          @click-time="onClickTime"
          @click-resource="onClickResource"
          @click-head-resources="onClickHeadResources"
          @click-interval="onClickInterval"
        >
          <template #head-resources="{ scope }">
            <div class="my-resource-header">
              {{ showDate(scope) }}
            </div>
          </template>
        </q-calendar-resource>
      </div>
    </div>
  </div>
</template>

<script>
import { QCalendarResource, today } from '@quasar/quasar-ui-qcalendar/src/QCalendarResource.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarResource.sass'

import { defineComponent } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'

export default defineComponent({
  name: 'ResourceSlotHeadResource',
  components: {
    NavigationBar,
    QCalendarResource
  },
  data () {
    return {
      selectedDate: today(),
      locale: 'en-US',
      resources: [
        { id: '1', name: 'John' },
        {
          id: '2',
          name: 'Board Room',
          expanded: false,
          children: [
            { id: '2.1', name: 'Room-1' },
            {
              id: '2.2',
              name: 'Room-2',
              expanded: false,
              children: [
                { id: '2.2.1', name: 'Partition-A' },
                { id: '2.2.2', name: 'Partition-B' },
                { id: '2.2.3', name: 'Partition-C' }
              ]
            }
          ]
        },
        { id: '3', name: 'Mary' },
        { id: '4', name: 'Susan' },
        { id: '5', name: 'Olivia' }
      ]
    }
  },
  methods: {
    showDate (scope) {
      if (scope.date) {
        const date = new Date(scope.date)
        return this.monthFormatter().format(date)
      }
      return ''
    },

    monthFormatter () {
      try {
        return new Intl.DateTimeFormat(this.locale || undefined, {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          timeZone: 'UTC'
        })
      }
      catch (e) {
        //
      }
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

<style lang="sass" scoped>
.my-resource-header
  display: flex
  flex-direction: column
  flex: 1
  justify-content: center
  align-items: center
  position: relative
  font-size: 14px
  font-weight: 700
</style>

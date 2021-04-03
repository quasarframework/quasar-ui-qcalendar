<template>
  <div class="subcontent">
    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div
      class="button-bar"
      style="margin: 12px;"
    >
      <q-select
        v-model="selectedCalendar"
        v-model:modelResources="resources"
        label="Calendar Mode"
        outlined
        dense
        options-dense
        :options="[
          'day',
          'month',
          'agenda',
          'resource',
          'scheduler',
          'task'
        ]"
        class="button"
        style="min-width: 160px;"
      />
    </div>

    <div style="display: flex; justify-content: center; align-items: center; flex-wrap: nowrap;">
      <div style="display: flex; max-width: 800px; width: 100%; height: 400px;">
        <q-calendar
          ref="calendar"
          :mode="selectedCalendar"
          view="week"
          animated
          bordered
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue'
import { QCalendar } from '@quasar/quasar-ui-qcalendar/QCalendar.js'
import '@quasar/quasar-ui-qcalendar/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/QCalendar.sass'

import NavigationBar from '../components/NavigationBar.vue'

export default defineComponent({
  name: 'AllCalendar',
  components: {
    NavigationBar,
    QCalendar
  },
  setup () {
    const
      selectedCalendar = ref('day'),
      calendar = ref(null),
      resources = reactive([
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
                { id: '2.2.2', name: 'Partition-C' }
              ]
            }
          ]
        },
        { id: '3', name: 'Mary' },
        { id: '4', name: 'Susan' },
        { id: '5', name: 'Olivia' }
      ])

    function onToday () {
      calendar.value.moveToToday()
    }
    function onPrev () {
      calendar.value.prev()
    }
    function onNext () {
      calendar.value.next()
    }

    return {
      selectedCalendar,
      calendar,
      resources,
      onToday,
      onPrev,
      onNext
    }
  }
})
</script>

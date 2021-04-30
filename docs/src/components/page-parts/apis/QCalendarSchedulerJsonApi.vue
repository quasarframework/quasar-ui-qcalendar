<template>
  <json-api-viewer
    title="QCalendarScheduler API"
    :json="json"
    no-menu
  />
</template>

<script>
import { defineComponent } from 'vue'
import Api from '@quasar/quasar-ui-qcalendar/dist/api/QCalendarScheduler.json'

export default defineComponent({
  name: 'QCalendarSchedulerJsonApi',
  setup () {
    return {
      json: Api
    }
  }
})
</script>

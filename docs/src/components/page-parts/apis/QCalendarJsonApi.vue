<template>
  <json-api-viewer
    title="QCalendar API"
    :json="json"
    no-menu
  />
</template>

<script>
import { defineComponent } from 'vue'
import Api from '@quasar/quasar-ui-qcalendar/dist/api/QCalendar.json'

export default defineComponent({
  name: 'QCalendarJsonApi',
  setup () {
    return {
      json: Api
    }
  }
})
</script>

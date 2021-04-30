<template>
  <json-api-viewer
    title="QCalendarAgenda API"
    :json="json"
    no-menu
  />
</template>

<script>
import { defineComponent } from 'vue'
import Api from '@quasar/quasar-ui-qcalendar/dist/api/QCalendarAgenda.json'

export default defineComponent({
  name: 'QCalendarAgendaJsonApi',
  setup () {
    return {
      json: Api
    }
  }
})
</script>

<template>
  <json-api-viewer
    title="QCalendarTask API"
    :json="json"
    no-menu
  />
</template>

<script>
import { defineComponent } from 'vue'
import Api from '@quasar/quasar-ui-qcalendar/dist/api/QCalendarTask.json'

export default defineComponent({
  name: 'QCalendarTaskJsonApi',
  setup () {
    return {
      json: Api
    }
  }
})
</script>

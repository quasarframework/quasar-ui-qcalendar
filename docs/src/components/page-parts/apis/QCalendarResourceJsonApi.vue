<template>
  <json-api-viewer
    title="QCalendarResource API"
    :json="json"
    no-menu
  />
</template>

<script>
import { defineComponent } from 'vue'
import Api from '@quasar/quasar-ui-qcalendar/dist/api/QCalendarResource.json'

export default defineComponent({
  name: 'QCalendarResourceJsonApi',
  setup () {
    return {
      json: Api
    }
  }
})
</script>

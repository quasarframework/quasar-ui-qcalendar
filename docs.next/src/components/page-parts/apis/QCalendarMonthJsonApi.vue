<template>
  <json-api-viewer
    title="QCalendarMonth API"
    :json="json"
    no-menu
  />
</template>

<script>
import { defineComponent } from 'vue'
import Api from '@quasar/quasar-ui-qcalendar/dist/api/QCalendarMonth.json'

export default defineComponent({
  name: 'QCalendarMonthJsonApi',
  setup () {
    return {
      json: Api
    }
  }
})
</script>

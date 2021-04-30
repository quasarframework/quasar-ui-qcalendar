<template>
  <json-api-viewer
    title="QCalendarDay API"
    :json="json"
    no-menu
  />
</template>

<script>
import { defineComponent } from 'vue'
import Api from '@quasar/quasar-ui-qcalendar/dist/api/QCalendarDay.json'

export default defineComponent({
  name: 'QCalendarDayJsonApi',
  setup () {
    return {
      json: Api
    }
  }
})
</script>

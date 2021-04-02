<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue'
import { useMeta } from 'quasar'

import { provideMarkdownStore } from 'assets/markdown-store.js'
import { provideThemeBuilderStore } from 'assets/theme-builder-store.js'
import getMeta from 'assets/get-meta.js'

export default defineComponent({
  name: 'App',

  setup () {
    useMeta({
      title: 'Quasar Framework',
      titleTemplate: title => `${ title } | QCalendar`,

      meta: getMeta(
        'QCalendar - Day/Month/Week Calendars, Popups, Date Pickers, Schedules, Agendas, Planners and Tasks for your Vue Apps',
        'QCalendar is a powerful calendar that allows for viewing of day (1-6 days), week, monthly, scheduler, agenda and task views. Painstaking care has been given to make almost every aspect of QCalendar configurable and/or modifiable in some way and control given to the developer.'
      )
    })

    provideMarkdownStore()
    provideThemeBuilderStore()
  }
})
</script>

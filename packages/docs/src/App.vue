<template>
  <router-view />
</template>

<script setup lang="ts">
import { useMeta } from 'quasar'
import { useDark } from '@/.q-press/composables/dark'

import getMeta from '@/.q-press/assets/get-meta'

const { initDark } = useDark()
initDark()

useMeta({
  title: 'QCalendar for Vue and Quasar',
  titleTemplate: (title) => `${title} | QCalendar`,

  meta: getMeta(
    'QCalendar - Build Beautiful, Responsive Calendars for Vue and Quasar',
    'QCalendar is your all-in-one solution for creating stunning, responsive calendars for Vue and Quasar applications. With its intuitive API and customizable options, QCalendar empowers you to effortlessly integrate calendars into your projects. Whether you need a simple date picker or a feature-rich event calendar, QCalendar has you covered. Elevate your user experience with visually appealing and user-friendly calendars that seamlessly integrate into your Vue and Quasar applications.',
  ),
})
</script>

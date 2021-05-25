<template>
  <q-btn
    v-if="leftDrawerButton === true"
    flat
    dense
    round
    icon="menu"
    aria-label="Menu"
    @click="leftDrawerButtonFunc"
  />

  <q-btn
    flat
    no-caps
    to="/"
  >
  <div v-if="$q.screen.width > 500" class="text-weight-bold">
    <span style="font-size: 20px;">
      QCalendar &nbsp;
    </span>
    <span style="font-size: 12px;">
      v{{ version }}
    </span>
  </div>
  <div v-else>
    Home
  </div>
  </q-btn>

  <q-space />

  <q-btn
    aria-label="Dark theme toggle"
    flat
    round
    @click="$q.dark.toggle()" :icon="$q.dark.isActive ? 'brightness_2' : 'brightness_5'"
  />

  <div v-if="$q.screen.width > 500" class="text-weight-bold">Quasar <span style="font-size: 12px;">v{{ $q.version }}</span></div>

  <q-btn
    v-if="rightDrawerButton === true"
    flat
    dense
    round
    icon="menu"
    aria-label="Table of Contents"
    @click="rightDrawerButtonFunc"
  />
</template>

<script>
import { defineComponent } from 'vue'
import pkg from '@quasar/quasar-ui-qcalendar/package.json'
const { version } = pkg

export default defineComponent({
  name: 'ToolbarContents',
  props: {
    title: {
      type: String,
      default: 'Build Beautiful, Responsive Calendars'
    },
    leftDrawerButton: Boolean,
    rightDrawerButton: Boolean,
    leftDrawerButtonFunc: Function,
    rightDrawerButtonFunc: Function
  },
  setup () {
    return {
      version
    }
  }
})
</script>

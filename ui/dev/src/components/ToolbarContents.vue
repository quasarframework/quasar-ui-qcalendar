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

  <q-toolbar-title>
    <q-btn
      flat
      no-caps
      to="/"
      style="padding-left: 0"
    >
    <div>
      <span style="font-size: 20px;">QCalendar &nbsp; </span><span style="font-size: 12px;">v{{ version }}</span>
    </div>
    </q-btn>
  </q-toolbar-title>

  <q-toolbar-title v-if="$q.screen.width > 500">
    {{ title }}
  </q-toolbar-title>

  <q-btn flat round @click="$q.dark.toggle()" :icon="$q.dark.isActive ? 'brightness_2' : 'brightness_5'" />

  <div v-if="$q.screen.width > 500">Quasar <span style="font-size: 12px;">v{{ $q.version }}</span></div>

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
import { version } from '@quasar/quasar-ui-qcalendar'
export default {
  name: 'ToolbarContents',
  props: {
    title: {
      type: String,
      default: ''
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
}
</script>

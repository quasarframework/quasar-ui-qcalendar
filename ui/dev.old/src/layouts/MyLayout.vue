<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          to="/"
          icon="home"
        />

        <q-toolbar-title>
          QCalendar <span class="text-subtitle2">v{{ version }}</span>
        </q-toolbar-title>

        <q-btn flat round @click="$q.dark.toggle()" :icon="$q.dark.isActive ? 'brightness_2' : 'brightness_5'" />
        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { version } from 'ui' // "ui" is aliased in quasar.conf.js

export default {
  name: 'MyLayout',

  data () {
    return {
      version
    }
  }
}
</script>

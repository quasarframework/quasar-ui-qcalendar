<template>
  <q-layout view="hHh LpR fFf"> <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          round
          dense
          icon="menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        />

        <q-toolbar-title>
          QCalendar <span class="text-subtitle2">v{{ version }}</span>
        </q-toolbar-title>

        <div class="theme-builder-title">Theme Builder</div>
        <q-space />

        <q-btn flat round @click="$q.dark.toggle()" :icon="$q.dark.isActive ? 'brightness_2' : 'brightness_5'" />
        <div v-if="$q.screen.width > 500">Quasar v{{ $q.version }}</div>

        <q-btn
          flat
          dense
          round
          @click="rightDrawerOpen = !rightDrawerOpen"
          aria-label="Table of Contents"
        >
          <q-icon name="menu" />
        </q-btn>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      aria-label="Menu"
      class="menu"
    >
      <q-list>
        <q-item-label header>Essential Links</q-item-label>
        <q-separator />
      </q-list>
      <essential-links />
    </q-drawer>

    <q-drawer
      ref="drawer"
      v-model="rightDrawerOpen"
      show-if-above
      side="right"
      bordered
      aria-label="Styles"
      class="toc"
    >
      <q-scroll-area class="fit">
        <div class="row justify-center full-width q-ma-xs q-gutter-sm">
          <q-btn dense no-caps label="Copy Theme" @click="copyTheme" />
          <q-btn dense no-caps label="Import Theme..." @click="importTheme" />
        </div>
        <q-list dense>
          <q-item
            v-for="(value, name) in style"
            :key="name"
            clickable
            v-ripple
            dense
            :active="name === currentStyleName"
            @click="editStyle(name, value)"
          >
            <q-item-section style="max-width: 24px">
              <div v-if="showBox(name, value)" class="theme-builder-box" :style="getStyle(name, value)" />
              <div v-else class="small-text">{{ value }}</div>
            </q-item-section>
            <q-item-section class="small-text">{{ name }}</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <q-page>
        <theme-editor
          v-model="openThemeEditor"
          :item-name="currentName"
          :item-style="currentStyle"
          :style-object="style"
          @style="onStyleChange"
        />
        <div class="row justify-center no-wrap">
          <div class="col-shrink">
            <q-tabs
              v-model="calendar"
              vertical
            >
              <q-tab name="day" icon="fas fa-calendar-day" label="Day" />
              <q-tab name="week" icon="fas fa-calendar-week" label="Week" />
              <q-tab name="month" icon="fas fa-calendar-alt" label="Month" />
              <q-tab name="mini-mode" icon="far fa-calendar" label="Mini-Mode" />
              <q-tab name="scheduler" icon="fas fa-calendar" label="Scheduler" />
              <q-tab name="resource" icon="fas fa-grip-horizontal" label="Resource" />
              <q-tab name="agenda" icon="view_agenda" label="Agenda" />
            </q-tabs>
          </div>
          <div class="col">
            <q-tab-panels v-model="calendar" animated>
              <q-tab-panel name="day">
                <div class="text-h6">Day</div>
                  <theme-builder-day
                    v-model="selectedDate"
                    :styles="style"
                  />
              </q-tab-panel>

              <q-tab-panel name="week">
                <div class="text-h6">Week</div>
                  <theme-builder-week
                    v-model="selectedDate"
                    :styles="style"
                  />
              </q-tab-panel>

              <q-tab-panel name="month">
                <div class="text-h6">Month</div>
                  <theme-builder-month
                    v-model="selectedDate"
                    :styles="style"
                  />
              </q-tab-panel>

              <q-tab-panel name="mini-mode">
                <div class="text-h6">Mini-mode</div>
                  <theme-builder-minimode
                    v-model="selectedDate"
                    :styles="style"
                  />
              </q-tab-panel>

              <q-tab-panel name="scheduler">
                <div class="text-h6">Scheduler</div>
                  <theme-builder-scheduler
                    v-model="selectedDate"
                    :styles="style"
                  />
              </q-tab-panel>

              <q-tab-panel name="resource">
                <div class="text-h6">Resource</div>
                  <theme-builder-resource
                    v-model="selectedDate"
                    :styles="style"
                  />
              </q-tab-panel>

              <q-tab-panel name="agenda">
                <div class="text-h6">Agenda</div>
                  <theme-builder-agenda
                    v-model="selectedDate"
                    :styles="style"
                  />
              </q-tab-panel>

            </q-tab-panels>
          </div>
        </div>
      </q-page>

      <!-- This is where pages get injected -->
      <!-- <router-view /> -->
    </q-page-container>

  </q-layout>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import {
  version
} from 'ui'

export default {
  name: 'ThemeBuilderLayout',
  components: {
    'essential-links': () => import('../components/EssentialLinks.vue'),
    ThemeEditor: () => import('../components/ThemeEditor.vue'),
    ThemeBuilderDay: () => import('../components/ThemeBuilder/day'),
    ThemeBuilderWeek: () => import('../components/ThemeBuilder/week'),
    ThemeBuilderMonth: () => import('../components/ThemeBuilder/month'),
    ThemeBuilderMinimode: () => import('../components/ThemeBuilder/miniMode'),
    ThemeBuilderScheduler: () => import('../components/ThemeBuilder/scheduler'),
    ThemeBuilderResource: () => import('../components/ThemeBuilder/resource'),
    ThemeBuilderAgenda: () => import('../components/ThemeBuilder/agenda')
  },
  data () {
    return {
      version: version,
      leftDrawerOpen: this.$q.platform.is.desktop,
      rightDrawerOpen: this.$q.platform.is.desktop,
      calendar: 'day', // tab
      selectedDate: '',
      openThemeEditor: false,

      // current css var name and attached style
      currentName: '',
      currentStyle: '',

      defaultColor: '',
      currentColor: '',
      borderSize: '',
      borderColor: '',
      borderType: ''
    }
  },
  computed: {
    ...mapGetters({
      style: 'ThemeBuilder/style',
      currentStyleName: 'ThemeBuilder/currentStyleName'
    })
  },
  methods: {
    ...mapMutations('ThemeBuilder', [
      'setStyle',
      'setCurrentStyleName'
    ]),

    showBox (name, value) {
      return value.match(/^(#|(rgb|hsl)a?\()/) && (name.indexOf('color') > -1 || name.indexOf('background') > -1 || name.indexOf('border') > -1)
    },

    getStyle (name, value) {
      if (name.indexOf('border') > -1) {
        return { border: value }
      }
      return { background: value }
    },

    copyToClipboard (text) {
      const textArea = document.createElement('textarea')
      textArea.className = 'fixed-top'
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      document.execCommand('copy')
      document.body.removeChild(textArea)
    },

    copyTheme () {
      this.copyToClipboard(JSON.stringify(this.style))

      this.$q.notify({
        message: 'Theme has been copied to clipboard.',
        color: 'white',
        textColor: 'primary',
        icon: 'done',
        position: 'top',
        timeout: 2000
      })
    },

    importTheme () {
      //
    },

    editStyle (name, value) {
      this.setCurrentStyleName(name)
      this.currentName = name
      this.currentStyle = value
      this.openThemeEditor = true
    },

    onStyleChange (value) {
      this.currentStyle = value
      this.setStyle({ name: this.currentName, value: this.currentStyle })
    }
  }
}
</script>

<style lang="sass">
.theme-builder-title
  font-size: 20px
  font-weight: 600
  white-space: nowrap

.theme-builder-box
  width: 20px
  height: 20px
  border: #dedede 1px solid

.small-text
  font-size: 10px
</style>

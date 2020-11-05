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
            :active="false"
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
          :style-object="styleCopy"
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
                  <q-calendar
                    v-model="selectedDate"
                    view="day"
                    locale="en-us"
                    bordered
                    :interval-minutes="15"
                    :interval-count="96"
                    style="height: 400px;"
                    :style="style"
                  />
              </q-tab-panel>

              <q-tab-panel name="week">
                <div class="text-h6">Week</div>
                  <q-calendar
                    v-model="selectedDate"
                    view="week"
                    bordered
                    :interval-minutes="15"
                    :interval-count="96"
                    :disabled-weekdays="[0,6]"
                    :interval-style="modifiedStyle"
                    locale="en-us"
                    style="height: 400px;"
                    :style="style"
                  />
              </q-tab-panel>

              <q-tab-panel name="month">
                <div class="text-h6">Month</div>
                  <div class="q-gutter-sm">
                    <q-checkbox v-model="mobile" label="Use Touch (set if on mobile)" />
                  </div>
                  <div style="overflow: hidden;">
                    <q-calendar
                      ref="calendar"
                      v-model="selectedDate"
                      view="month"
                      locale="en-us"
                      bordered
                      no-active-date
                      :selected-start-end-dates="startEndDates"
                      @mousedown:day2="onMouseDownDay"
                      @mouseup:day2="onMouseUpDay"
                      @mousemove:day2="onMouseMoveDay"
                      :style="style"
                    />
                  </div>
              </q-tab-panel>

              <q-tab-panel name="mini-mode">
                <div class="text-h6">Mini-mode</div>
                  <div class="q-gutter-sm">
                    <q-checkbox v-model="mobile" label="Use Touch (set if on mobile)" />
                  </div>
                  <q-separator></q-separator>
                  <div style="overflow: hidden;">
                    <q-calendar
                      v-model="selectedDate"
                      view="month"
                      locale="en-us"
                      mini-mode
                      bordered
                      no-active-date
                      :hover="mouseDown"
                      short-weekday-label
                      animated
                      :selected-start-end-dates="startEndDates"
                      @mousedown:day2="onMouseDownDay"
                      @mouseup:day2="onMouseUpDay"
                      @mousemove:day2="onMouseMoveDay"
                      style="max-width: 300px; min-width: auto; overflow: hidden"
                      :style="style"
                    />
                  </div>
              </q-tab-panel>

              <q-tab-panel name="scheduler">
                <div class="text-h6">Scheduler</div>
                  <q-calendar
                    v-model="selectedDate"
                    view="week-scheduler"
                    bordered
                    :resources="resources"
                    resource-key="name"
                    :resource-height="50"
                    :resource-width="120"
                    locale="en-us"
                    style="height: 400px;"
                    :style="style"
                  />
              </q-tab-panel>

              <q-tab-panel name="resource">
                <div class="text-h6">Resource</div>
                  <q-calendar
                    v-model="selectedDate"
                    view="day-resource"
                    bordered
                    :resources="resources"
                    resource-key="name"
                    :resource-height="50"
                    :resource-width="120"
                    sticky
                    locale="en-us"
                    style="height: 400px;"
                    :style="style"
                  />
              </q-tab-panel>

              <q-tab-panel name="agenda">
                <div class="text-h6">Agenda</div>
                  <q-calendar
                    v-model="selectedDate"
                    view="week-agenda"
                    bordered
                    locale="en-us"
                    style="height: 400px;"
                    :style="style"
                  >
                    <template #day-body="{ timestamp }">
                      <template v-for="(agenda) in getAgenda(timestamp)">
                        <div
                          :key="timestamp.date + agenda.time"
                          :label="agenda.time"
                          class="justify-start q-ma-sm shadow-5 bg-grey-6"
                        >
                          <div v-if="agenda.avatar" class="row justify-center" style="margin-top: 30px; width: 100%;">
                            <q-avatar style="margin-top: -25px; margin-bottom: 10px; font-size: 60px; max-height: 50px;">
                              <img :src="agenda.avatar" style="border: #9e9e9e solid 5px;">
                            </q-avatar>
                          </div>
                          <div class="col-12 q-px-sm">
                            <strong>{{ agenda.time }}</strong>
                          </div>
                          <div v-if="agenda.desc" class="col-12 q-px-sm" style="font-size: 10px;">
                            {{ agenda.desc }}
                          </div>
                        </div>
                      </template>
                    </template>
                  </q-calendar>
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
  version,
  getDayIdentifier
} from 'ui'

function leftClick (e) {
  return e.button === 0
}

export default {
  name: 'ThemeBuilderLayout',
  components: {
    'essential-links': () => import('../components/EssentialLinks.vue'),
    ThemeEditor: () => import('../components/ThemeEditor.vue')
  },
  data () {
    return {
      version: version,
      leftDrawerOpen: this.$q.platform.is.desktop,
      rightDrawerOpen: this.$q.platform.is.desktop,
      calendar: 'day',
      selectedDate: '',
      anchorTimestamp: null,
      otherTimestamp: null,
      mouseDown: false,
      mobile: false,
      openColorPicker: false,
      openThemeEditor: false,

      currentName: '',
      currentStyle: '',

      styleCopy: {},

      defaultColor: '',
      currentColor: '',
      borderSize: '',
      borderColor: '',
      borderType: '',
      resources: [
        { name: 'John' },
        {
          name: 'Board Room',
          expanded: false,
          children: [
            { name: 'Room-1' },
            {
              name: 'Room-2',
              expanded: false,
              children: [
                { name: 'Partition-A' },
                { name: 'Partition-B' },
                { name: 'Partition-C' }
              ]
            }
          ]
        },
        { name: 'Mary' },
        { name: 'Susan' },
        { name: 'Olivia' }
      ],
      agenda: {
        // value represents day of the week
        1: [
          {
            time: '08:00',
            avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
            desc: 'Meeting with CEO'
          },
          {
            time: '08:30',
            avatar: 'https://cdn.quasar.dev/img/avatar.png',
            desc: 'Meeting with HR'
          },
          {
            time: '10:00',
            avatar: 'https://cdn.quasar.dev/img/avatar1.jpg',
            desc: 'Meeting with Karen'
          }
        ],
        2: [
          {
            time: '11:30',
            avatar: 'https://cdn.quasar.dev/img/avatar2.jpg',
            desc: 'Meeting with Alisha'
          },
          {
            time: '17:00',
            avatar: 'https://cdn.quasar.dev/img/avatar3.jpg',
            desc: 'Meeting with Sarah'
          }
        ],
        3: [
          {
            time: '08:00',
            desc: 'Stand-up SCRUM',
            avatar: 'https://cdn.quasar.dev/img/material.png'
          },
          {
            time: '09:00',
            avatar: 'https://cdn.quasar.dev/img/boy-avatar.png'
          },
          {
            time: '10:00',
            desc: 'Sprint planning',
            avatar: 'https://cdn.quasar.dev/img/material.png'
          },
          {
            time: '13:00',
            avatar: 'https://cdn.quasar.dev/img/avatar1.jpg'
          }
        ],
        4: [
          {
            time: '09:00',
            avatar: 'https://cdn.quasar.dev/img/avatar3.jpg'
          },
          {
            time: '10:00',
            avatar: 'https://cdn.quasar.dev/img/avatar2.jpg'
          },
          {
            time: '13:00',
            avatar: 'https://cdn.quasar.dev/img/material.png'
          }
        ],
        5: [
          {
            time: '08:00',
            avatar: 'https://cdn.quasar.dev/img/boy-avatar.png'
          },
          {
            time: '09:00',
            avatar: 'https://cdn.quasar.dev/img/avatar2.jpg'
          },
          {
            time: '09:30',
            avatar: 'https://cdn.quasar.dev/img/avatar4.jpg'
          },
          {
            time: '10:00',
            avatar: 'https://cdn.quasar.dev/img/avatar5.jpg'
          },
          {
            time: '11:30',
            avatar: 'https://cdn.quasar.dev/img/material.png'
          },
          {
            time: '13:00',
            avatar: 'https://cdn.quasar.dev/img/avatar6.jpg'
          },
          {
            time: '13:30',
            avatar: 'https://cdn.quasar.dev/img/avatar3.jpg'
          },
          {
            time: '14:00',
            avatar: 'https://cdn.quasar.dev/img/linux-avatar.png'
          },
          {
            time: '14:30',
            avatar: 'https://cdn.quasar.dev/img/avatar.png'
          },
          {
            time: '15:00',
            avatar: 'https://cdn.quasar.dev/img/boy-avatar.png'
          },
          {
            time: '15:30',
            avatar: 'https://cdn.quasar.dev/img/avatar2.jpg'
          },
          {
            time: '16:00',
            avatar: 'https://cdn.quasar.dev/img/avatar6.jpg'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters({
      style: 'ThemeBuilder/style'
    }),

    startEndDates () {
      const dates = []
      if (this.anchorDayIdentifier !== false && this.otherDayIdentifier !== false) {
        if (this.anchorDayIdentifier <= this.otherDayIdentifier) {
          dates.push(this.anchorTimestamp.date, this.otherTimestamp.date)
        }
        else {
          dates.push(this.otherTimestamp.date, this.anchorTimestamp.date)
        }
      }
      return dates
    },
    anchorDayIdentifier () {
      if (this.anchorTimestamp !== null) {
        return getDayIdentifier(this.anchorTimestamp)
      }
      return false
    },
    otherDayIdentifier () {
      if (this.otherTimestamp !== null) {
        return getDayIdentifier(this.otherTimestamp)
      }
      return false
    },
    lowIdentifier () {
      // returns lowest of the two values
      return Math.min(this.anchorDayIdentifier, this.otherDayIdentifier)
    },
    highIdentifier () {
      // returns highest of the two values
      return Math.max(this.anchorDayIdentifier, this.otherDayIdentifier)
    }

  },
  methods: {
    ...mapMutations('ThemeBuilder', ['setStyle']),

    showBox (name, value) {
      return value.match(/^(#|(rgb|hsl)a?\()/) && (name.indexOf('color') > -1 || name.indexOf('background') > -1 || name.indexOf('border') > -1)
    },
    getStyle (name, value) {
      if (name.indexOf('border') > -1) {
        return { border: value }
      }
      return { background: value }
    },

    onMouseDownDay ({ scope, event }) {
      if (leftClick(event)) {
        if (this.mobile === true &&
          this.anchorTimestamp !== null &&
          this.otherTimestamp !== null &&
          this.anchorTimestamp.date === this.otherTimestamp.date) {
          this.otherTimestamp = scope.timestamp
          this.mouseDown = false
          return
        }
        // mouse is down, start selection and capture current
        this.mouseDown = true
        this.anchorTimestamp = scope.timestamp
        this.otherTimestamp = scope.timestamp
      }
    },

    onMouseUpDay ({ scope, event }) {
      if (leftClick(event)) {
        // mouse is up, capture last and cancel selection
        this.otherTimestamp = scope.timestamp
        this.mouseDown = false
      }
    },

    onMouseMoveDay ({ scope, event }) {
      if (this.mouseDown === true) {
        this.otherTimestamp = scope.timestamp
      }
    },

    modifiedStyle (scope) {
      if (scope.disabled === true) {
        return {
          backgroundColor: '#ffcb9c !important',
          cursor: 'not-allowed'
        }
      }
      return {}
    },

    getAgenda (day) {
      return this.agenda[parseInt(day.weekday, 10)]
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
      this.currentName = name
      this.currentStyle = value
      // it's important we do this so that ThemeEditor
      // isn't always generating a color palette each
      // time something changes
      this.styleCopy = JSON.parse(JSON.stringify(this.style))
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

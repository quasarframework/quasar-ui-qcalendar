<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated>
      <q-toolbar>
        <toolbar-contents
          title="QCalendar » Theme Builder"
          left-drawer-button
          right-drawer-button
          :left-drawer-button-func="toggleLeftDrawer"
          :right-drawer-button-func="toggleRightDrawer"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      aria-label="Menu"
      class="menu"
    >
      <left-menu />
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
          <q-btn
            dense
            no-caps
            label="Copy Theme"
            @click="copyTheme"
          />
          <q-btn
            dense
            no-caps
            label="Import Theme..."
            @click="importTheme"
          />
        </div>
        <q-list dense>
          <template v-for="(value, name) in store.style">
            <q-item
              v-if="value !== 'unset'"
              :key="name"
              v-ripple
              clickable
              dense
              :active="name === store.currentStyleName"
              @click="editStyle(name, value)"
            >
              <q-item-section style="max-width: 24px">
                <div
                  v-if="showBox(name, value)"
                  class="theme-builder-box"
                  :style="getStyle(name, value)"
                />
                <div
                  v-else
                  class="small-text"
                >
                  {{ value }}
                </div>
              </q-item-section>
              <q-item-section class="small-text">
                {{ name }}
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <q-page>
        <theme-importer
          v-model="openThemeImporter"
        />
        <theme-editor
          v-model="openThemeEditor"
          :item-name="currentName"
          :item-style="currentStyle"
          :style-object="store.style"
          @style="onStyleChange"
        />
        <div class="row justify-center no-wrap">
          <div class="col-shrink">
            <q-tabs
              v-model="calendar"
              vertical
              dense
            >
              <q-tab
                name="day"
                icon="fas fa-calendar-day"
                label="Day"
              />
              <q-tab
                name="week"
                icon="fas fa-calendar-week"
                label="Week"
              />
              <q-tab
                name="month"
                icon="fas fa-calendar-alt"
                label="Month"
              />
              <q-tab
                name="mini-mode"
                icon="far fa-calendar"
                label="Mini-Mode"
              />
              <q-tab
                name="scheduler"
                icon="fas fa-calendar"
                label="Scheduler"
              />
              <q-tab
                name="resource"
                icon="fas fa-grip-horizontal"
                label="Resource"
              />
              <q-tab
                name="agenda"
                icon="view_agenda"
                label="Agenda"
              />
              <q-tab
                name="task"
                icon="view_task"
                label="Task"
              />
            </q-tabs>
          </div>
          <div class="col">
            <q-tab-panels
              v-model="calendar"
              animated
            >
              <q-tab-panel name="day">
                <div class="text-h6">
                  Day
                </div>
                <theme-builder-day
                  v-model="selectedDate"
                  :styles="store.style"
                />
              </q-tab-panel>

              <q-tab-panel name="week">
                <div class="text-h6">
                  Week
                </div>
                <theme-builder-week
                  v-model="selectedDate"
                  :styles="store.style"
                />
              </q-tab-panel>

              <q-tab-panel name="month">
                <div class="text-h6">
                  Month
                </div>
                <theme-builder-month
                  v-model="selectedDate"
                  :styles="store.style"
                />
              </q-tab-panel>

              <q-tab-panel name="mini-mode">
                <div class="text-h6">
                  Mini-mode
                </div>
                <theme-builder-minimode
                  v-model="selectedDate"
                  :styles="store.style"
                />
              </q-tab-panel>

              <q-tab-panel name="scheduler">
                <div class="text-h6">
                  Scheduler
                </div>
                <theme-builder-scheduler
                  v-model="selectedDate"
                  :styles="store.style"
                />
              </q-tab-panel>

              <q-tab-panel name="resource">
                <div class="text-h6">
                  Resource
                </div>
                <theme-builder-resource
                  v-model="selectedDate"
                  :styles="store.style"
                />
              </q-tab-panel>

              <q-tab-panel name="agenda">
                <div class="text-h6">
                  Agenda
                </div>
                <theme-builder-agenda
                  v-model="selectedDate"
                  :styles="store.style"
                />
              </q-tab-panel>

              <q-tab-panel name="task">
                <div class="text-h6">
                  Task
                </div>
                <theme-builder-task
                  v-model="selectedDate"
                  :styles="store.style"
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
import { defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useThemeBuilderStore } from 'assets/theme-builder-store.js'
import ToolbarContents from '../components/ToolbarContents.vue'
import { today } from '@quasar/quasar-ui-qcalendar/Timestamp.js'
import LeftMenu from '../components/LeftMenu.vue'
import ThemeEditor from '../components/ThemeEditor.vue'
import ThemeImporter from '../components/ThemeImporter'
import ThemeBuilderDay from '../components/ThemeBuilder/day'
import ThemeBuilderWeek from '../components/ThemeBuilder/week'
import ThemeBuilderMonth from '../components/ThemeBuilder/month'
import ThemeBuilderMinimode from '../components/ThemeBuilder/miniMode'
import ThemeBuilderScheduler from '../components/ThemeBuilder/scheduler'
import ThemeBuilderResource from '../components/ThemeBuilder/resource'
import ThemeBuilderAgenda from '../components/ThemeBuilder/agenda'
import ThemeBuilderTask from '../components/ThemeBuilder/task'

export default defineComponent({
  name: 'ThemeBuilderLayout',
  components: {
    ToolbarContents,
    LeftMenu,
    ThemeEditor,
    ThemeBuilderDay,
    ThemeBuilderWeek,
    ThemeBuilderMonth,
    ThemeBuilderMinimode,
    ThemeBuilderScheduler,
    ThemeBuilderResource,
    ThemeBuilderAgenda,
    ThemeBuilderTask,
    ThemeImporter
  },
  setup () {
    const
      store = useThemeBuilderStore(),
      $q = useQuasar(),
      leftDrawerOpen = ref(false),
      rightDrawerOpen = ref(false),
      calendar = ref('day'), // tab
      selectedDate = ref(today()),
      openThemeEditor = ref(false),
      openThemeImporter = ref(false),

      // current css var name and attached style
      currentName = ref(''),
      currentStyle = ref(''),

      defaultColor = ref(''),
      currentColor = ref(''),
      borderSize = ref(''),
      borderColor = ref(''),
      borderType = ref('')

    function showBox (name, value) {
      return value.match(/^(#|(rgb|hsl)a?\()/) && (name.indexOf('color') > -1 || name.indexOf('background') > -1 || name.indexOf('border') > -1)
    }

    function getStyle (name, value) {
      if (name.indexOf('border') > -1) {
        return { border: value }
      }
      return { background: value }
    }

    function copyToClipboard (text) {
      const textArea = document.createElement('textarea')
      textArea.className = 'fixed-top'
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      document.execCommand('copy')
      document.body.removeChild(textArea)
    }

    function copyTheme () {
      copyToClipboard(JSON.stringify(store.style))

      $q.notify({
        message: 'Theme has been copied to clipboard.',
        color: 'white',
        textColor: 'primary',
        icon: 'done',
        position: 'top',
        timeout: 2000
      })
    }

    function importTheme () {
      openThemeImporter.value = true
    }

    function editStyle (name, value) {
      setCurrentStyleName(name)
      currentName.value = name
      currentStyle.value = value
      openThemeEditor.value = true
    }

    function onStyleChange (value) {
      currentStyle.value = value
      setStyle({ name: currentName.value, style: currentStyle.value })
    }

    function setStyle ({ name, style }) {
      setCurrentStyleName(name)
      store.style[ name ] = style
    }

    function setCurrentStyleName (name) {
      store.currentStyleName = name
    }

    return {
      leftDrawerOpen,
      rightDrawerOpen,
      store,
      calendar,
      selectedDate,
      openThemeEditor,
      openThemeImporter,
      currentName,
      currentStyle,
      defaultColor,
      currentColor,
      borderSize,
      borderColor,
      borderType,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      toggleRightDrawer () {
        rightDrawerOpen.value = !rightDrawerOpen.value
      },
      showBox,
      getStyle,
      copyTheme,
      importTheme,
      editStyle,
      onStyleChange
    }
  }
})
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

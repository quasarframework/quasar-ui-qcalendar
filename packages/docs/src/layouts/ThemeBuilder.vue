<template>
  <q-layout view="hHh LpR fFf" class="markdown-layout markdown-technical">
    <MarkdownHeader />

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
                <div v-else class="small-text">
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
      <q-page padding>
        <ThemeImporter v-model="openThemeImporter" />
        <ThemeEditor
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
              :class="{ 'q-dark': $q.dark.isActive, 'bg-white text-primary': !$q.dark.isActive }"
            >
              <q-tab name="day" :icon="biCalendar2Date" label="Day" />
              <q-tab name="week" :icon="biCalendar2Week" label="Week" />
              <q-tab name="month" :icon="biCalendar2Month" label="Month" />
              <q-tab name="mini-mode" :icon="biCalendar3Range" label="Mini-Mode" />
              <q-tab name="scheduler" :icon="biCalendar2Plus" label="Scheduler" />
              <q-tab name="resource" :icon="biGrid3x2Gap" label="Resource" />
              <q-tab name="agenda" :icon="biColumnsGap" label="Agenda" />
              <q-tab name="task" :icon="biCalendar3" label="Task" />
            </q-tabs>
          </div>
          <div class="col">
            <q-tab-panels v-model="calendar" animated>
              <q-tab-panel name="day">
                <div class="text-h6">Day</div>
                <theme-builder-day v-model="selectedDate" :styles="store.style" />
              </q-tab-panel>

              <q-tab-panel name="week">
                <div class="text-h6">Week</div>
                <theme-builder-week v-model="selectedDate" :styles="store.style" />
              </q-tab-panel>

              <q-tab-panel name="month">
                <div class="text-h6">Month</div>
                <theme-builder-month v-model="selectedDate" :styles="store.style" />
              </q-tab-panel>

              <q-tab-panel name="mini-mode">
                <div class="text-h6">Mini-mode</div>
                <theme-builder-minimode v-model="selectedDate" :styles="store.style" />
              </q-tab-panel>

              <q-tab-panel name="scheduler">
                <div class="text-h6">Scheduler</div>
                <theme-builder-scheduler v-model="selectedDate" :styles="store.style" />
              </q-tab-panel>

              <q-tab-panel name="resource">
                <div class="text-h6">Resource</div>
                <theme-builder-resource v-model="selectedDate" :styles="store.style" />
              </q-tab-panel>

              <q-tab-panel name="agenda">
                <div class="text-h6">Agenda</div>
                <theme-builder-agenda v-model="selectedDate" :styles="store.style" />
              </q-tab-panel>

              <q-tab-panel name="task">
                <div class="text-h6">Task</div>
                <theme-builder-task v-model="selectedDate" :styles="store.style" />
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
      </q-page>

      <MarkdownPageFooter />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useThemeBuilderStore } from 'stores/ThemeBuilder'
import { today } from '@quasar/quasar-ui-qcalendar'
import MarkdownHeader from 'src/.q-press/layouts/MarkdownHeader.vue'
import MarkdownPageFooter from 'src/.q-press/layouts/MarkdownPageFooter.vue'
import ThemeEditor from 'components/ThemeEditor.vue'
import ThemeImporter from 'components/ThemeImporter.vue'
import ThemeBuilderDay from 'components/ThemeBuilder/DayThemeBuilder.vue'
import ThemeBuilderWeek from 'components/ThemeBuilder/WeekThemeBuilder.vue'
import ThemeBuilderMonth from 'components/ThemeBuilder/MonthThemeBuilder.vue'
import ThemeBuilderMinimode from 'components/ThemeBuilder/MiniModeThemeBuilder.vue'
import ThemeBuilderScheduler from 'components/ThemeBuilder/SchedulerThemeBuilder.vue'
import ThemeBuilderResource from 'components/ThemeBuilder/ResourceThemeBuilder.vue'
import ThemeBuilderAgenda from 'components/ThemeBuilder/AgendaThemeBuilder.vue'
import ThemeBuilderTask from 'components/ThemeBuilder/TaskThemeBuilder.vue'

import {
  biCalendar2Date,
  biCalendar2Week,
  biCalendar2Month,
  biCalendar2Plus,
  biColumnsGap,
  biGrid3x2Gap,
  biCalendar3,
  biCalendar3Range,
} from '@quasar/extras/bootstrap-icons'

const store = useThemeBuilderStore()
const $q = useQuasar()
// const leftDrawerOpen = ref(false)
const rightDrawerOpen = ref(false)
const calendar = ref('day') // tab
const selectedDate = ref(today())
const openThemeEditor = ref(false)
const openThemeImporter = ref(false)
// current css var name and attached style
const currentName = ref('')
const currentStyle = ref('')
// const defaultColor = ref('')
// const currentColor = ref('')
// const borderSize = ref('')
// const borderColor = ref('')
// const borderType = ref('')

function showBox(name: string, value: string) {
  return (
    value.match(/^(#|(rgb|hsl)a?\()/) &&
    (name.indexOf('color') > -1 ||
      name.indexOf('background') > -1 ||
      name.indexOf('border') > -1 ||
      name.indexOf('scrollbar') > -1)
  )
}

function getStyle(name: string, value: string) {
  if (name.indexOf('border') > -1) {
    return { border: value }
  }
  return { background: value }
}

function copyToClipboard(text: string) {
  const textArea = document.createElement('textarea')
  textArea.className = 'fixed-top'
  textArea.value = text
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  document.execCommand('copy')
  document.body.removeChild(textArea)
}

function copyTheme() {
  copyToClipboard(JSON.stringify(store.style))

  $q.notify({
    message: 'Theme has been copied to clipboard.',
    color: 'white',
    textColor: 'primary',
    icon: 'done',
    position: 'top',
    timeout: 2000,
  })
}

function importTheme() {
  openThemeImporter.value = true
}

function editStyle(name: string, value: string) {
  setCurrentStyleName(name)
  currentName.value = name
  currentStyle.value = value
  openThemeEditor.value = true
}

function onStyleChange(value: string) {
  currentStyle.value = value
  setStyle({ name: currentName.value, style: currentStyle.value })
}

function setStyle({ name, style }: { name: string; style: string }) {
  setCurrentStyleName(name)
  store.style[name] = style
}

function setCurrentStyleName(name: string) {
  store.currentStyleName = name
}

// function toggleLeftDrawer() {
//   leftDrawerOpen.value = !leftDrawerOpen.value
// }

// function toggleRightDrawer() {
//   rightDrawerOpen.value = !rightDrawerOpen.value
// }
</script>

<style lang="scss">
.theme-builder-title {
  font-size: 20px;
  font-weight: 600;
  white-space: nowrap;
}

.theme-builder-box {
  width: 20px;
  height: 20px;
  border: #dedede 1px solid;
}

.small-text {
  font-size: 10px;
}
</style>

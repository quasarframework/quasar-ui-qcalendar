<template>
  <div class="subcontent">
    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div class="row justify-center">
      <div style="display: flex; justify-content: center">
        <div style="display: flex; justify-content: center; align-items: center;">
          <q-select
            v-model="theme"
            label="Choose a theme"
            outlined
            dense
            map-options
            emit-value
            options-dense
            :options="themesList"
            class="button"
            style="min-width: 180px;"
          />
        </div>
      </div>

      <div style="display: flex; max-width: 800px; width: 100%;">
        <q-calendar-task
          ref="calendar"
          v-model="selectedDate"
          v-model:modelTasks="parsedTasks"
          v-model:modelFooter="footerTasks"
          view="month"
          :task-width="240"
          :min-weekday-length="2"
          :weekday-class="weekdayClass"
          :day-class="dayClass"
          :footer-day-class="footerDayClass"
          :focus-type="['weekday', 'date', 'task']"
          focusable
          hoverable
          animated
          bordered
          :style="theme"
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-day="onClickDay"
          @click-head-day="onClickHeadDay"
        >
          <template #head-task="{ /* scope */ }">
            <div class="header ellipsis" style="font-weight: 600">
              <div class="issue ellipsis">Issue</div>
              <div class="key">Key</div>
              <div class="logged">Logged</div>
            </div>
          </template>

          <template #task="{ scope }">
            <template v-for="task in getTasks(scope.start, scope.end, scope.task)" :key="task.key">
              <div class="header ellipsis">
                <div class="issue ellipsis">
                  <span v-if="scope.task.icon === 'done'" class="done"><Done /></span>
                  <span v-else-if="scope.task.icon === 'pending'" class="pending"><Pending /></span>
                  <span v-else-if="scope.task.icon === 'blocking'" class="blocking"><Blocking /></span>
                  {{ scope.task.title }}
                </div>
                <div class="key">{{ scope.task.key }}</div>
                <div class="logged">{{ sum(scope.start, scope.end, scope.task) }}</div>
              </div>
            </template>
          </template>

          <template #day="{ scope }">
            <template v-for="time in getLogged(scope.timestamp.date, scope.task.logged)" :key="time">
              <div class="logged-time">{{ time.logged }}</div>
            </template>
          </template>

          <template #footer-task="{ scope }">
            <div class="summary ellipsis">
              <div class="title ellipsis">{{ scope.footer.title }}</div>
              <div class="total">{{ totals(scope.start, scope.end) }}</div>
            </div>
          </template>

          <template #footer-day="{ scope }">
            <div class="logged-time">{{ getLoggedSummary(scope.timestamp.date) }}</div>
          </template>
        </q-calendar-task>
      </div>
    </div>
  </div>
</template>

<script>
import {
  QCalendarTask,
  today,
  isBetweenDates,
  parsed,
  padNumber
} from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTask.sass'

import { defineComponent } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'

import Done from '@carbon/icons-vue/es/checkmark--outline/16'
import Pending from '@carbon/icons-vue/es/pending/16'
import Blocking from '@carbon/icons-vue/es/undefined/16'

export default defineComponent({
  name: 'TaskTheme',
  components: {
    NavigationBar,
    QCalendarTask,
    Done,
    Pending,
    Blocking
  },
  data () {
    return {
      selectedDate: today(),
      startDate: today(),
      endDate: today(),
      theme: {
      },
      themes: {
        default: {
        },
        teal: {
          '--calendar-scrollbar-track': '#4db6ac',
          '--calendar-scrollbar-thumb': '#004d40',
          '--calendar-scrollbar-thumb-hover': '#00897b',
          '--calendar-scrollbar-track-dark': '#4db6ac',
          '--calendar-scrollbar-thumb-dark': '#004d40',
          '--calendar-scrollbar-thumb-hover-dark': '#00897b',
          '--calendar-border': '#4db6ac 1px solid',
          '--calendar-border-dark': '#e0f2f1 1px solid',
          '--calendar-border-section': '#80cbc4 1px dashed',
          '--calendar-border-section-dark': '#80cbc4 1px dashed',
          '--calendar-border-current': '#4db6ac 2px solid',
          '--calendar-border-current-dark': '#1de9b6 2px solid',
          '--calendar-mini-range-connector-hover-border': '#027BE3 1px dashed',
          '--calendar-mini-range-connector-hover-border-dark': '#ffff66 1px dashed',
          '--calendar-color': '#004d40',
          '--calendar-color-dark': '#e0f2f1',
          '--calendar-background': '#e0f2f1',
          '--calendar-background-dark': '#004d40',
          '--calendar-current-color': '#027BE3',
          '--calendar-current-color-dark': '#ffff66',
          '--calendar-current-background': '#00000000',
          '--calendar-current-background-dark': '#004d40',
          '--calendar-disabled-date-color': '#e0f2f1',
          '--calendar-disabled-date-color-dark': '#bebebe',
          '--calendar-disabled-date-background': '#80cbc4',
          '--calendar-disabled-date-background-dark': '#121212',
          '--calendar-active-date-color': '#000000',
          '--calendar-active-date-color-dark': '#ffff66',
          '--calendar-active-date-background': '#1de9b6',
          '--calendar-active-date-background-dark': '#4db6ac',
          '--calendar-outside-color': '#004d40',
          '--calendar-outside-color-dark': '#bebebe',
          '--calendar-outside-background': '#00000000',
          '--calendar-outside-background-dark': '#121212',
          '--calendar-selected-color': '#027BE3',
          '--calendar-selected-color-dark': '#027BE3',
          '--calendar-selected-background': '#cce7ff',
          '--calendar-selected-background-dark': '#cce7ff',
          '--calendar-mini-selected-color': 'unset',
          '--calendar-mini-selected-color-dark': '#027BE3',
          '--calendar-mini-selected-background': 'unset',
          '--calendar-mini-selected-background-dark': '#cce7ff',
          '--calendar-mini-selected-label-color': '#027BE3',
          '--calendar-mini-selected-label-color-dark': '#cce7ff',
          '--calendar-mini-selected-label-background': '#cce7ff',
          '--calendar-mini-selected-label-background-dark': '#027BE3',
          '--calendar-range-color': '#027BE3',
          '--calendar-range-color-dark': '#027BE3',
          '--calendar-range-background': '#cce7ff',
          '--calendar-range-background-dark': '#cce7ff',
          '--calendar-mini-range-color': '#cce7ff',
          '--calendar-mini-range-color-dark': '#027BE3',
          '--calendar-mini-range-background': 'unset',
          '--calendar-mini-range-background-dark': 'unset',
          '--calendar-mini-range-label-color': '#cce7ff',
          '--calendar-mini-range-label-color-dark': '#027BE3',
          '--calendar-mini-range-label-background': '#cce7ff',
          '--calendar-mini-range-label-background-dark': '#cce7ff',
          '--calendar-mini-range-connector-color': '#cce7ff',
          '--calendar-mini-range-connector-color-dark': '#ffff66',
          '--calendar-mini-range-hover-color': '#027BE3',
          '--calendar-mini-range-hover-color-dark': '#ffff66',
          '--calendar-mini-range-firstlast-color': '#cce7ff',
          '--calendar-mini-range-firstlast-color-dark': '#cce7ff',
          '--calendar-mini-range-firstlast-background': 'unset',
          '--calendar-mini-range-firstlast-background-dark': '#cce7ff',
          '--calendar-mini-range-firstlast-label-color': '#cce7ff',
          '--calendar-mini-range-firstlast-label-color-dark': '#cce7ff',
          '--calendar-mini-range-firstlast-label-background': '#027BE3',
          '--calendar-mini-range-firstlast-label-background-dark': '#ffff66',
          '--calendar-intervals-width': '56px',
          '--calendar-work-week-width': '30px',
          '--calendar-mini-work-week-width': '30px',
          '--calendar-work-week-font-size': '1.0em',
          '--calendar-head-font-weight': '600'
        },
        brown: {
          '--calendar-scrollbar-track': '#a1887f',
          '--calendar-scrollbar-thumb': '#3e2723',
          '--calendar-scrollbar-thumb-hover': '#6d4c41',
          '--calendar-scrollbar-track-dark': '#a1887f',
          '--calendar-scrollbar-thumb-dark': '#3e2723',
          '--calendar-scrollbar-thumb-hover-dark': '#6d4c41',
          '--calendar-border': '#a1887f 1px solid',
          '--calendar-border-dark': '#efebe9 1px solid',
          '--calendar-border-section': '#bcaaa4 1px dashed',
          '--calendar-border-section-dark': '#bcaaa4 1px dashed',
          '--calendar-border-current': '#a1887f 2px solid',
          '--calendar-border-current-dark': '#8d6e63 2px solid',
          '--calendar-mini-range-connector-hover-border': '#027BE3 1px dashed',
          '--calendar-mini-range-connector-hover-border-dark': '#ffff66 1px dashed',
          '--calendar-color': '#3e2723',
          '--calendar-color-dark': '#efebe9',
          '--calendar-background': '#efebe9',
          '--calendar-background-dark': '#3e2723',
          '--calendar-current-color': '#027BE3',
          '--calendar-current-color-dark': '#efebe9',
          '--calendar-current-background': '#00000000',
          '--calendar-current-background-dark': '#3e2723',
          '--calendar-disabled-date-color': '#efebe9',
          '--calendar-disabled-date-color-dark': '#bebebe',
          '--calendar-disabled-date-background': '#bcaaa4',
          '--calendar-disabled-date-background-dark': '#121212',
          '--calendar-active-date-color': '#efebe9',
          '--calendar-active-date-color-dark': '#ffff66',
          '--calendar-active-date-background': '#8d6e63',
          '--calendar-active-date-background-dark': '#a1887f',
          '--calendar-outside-color': '#3e2723',
          '--calendar-outside-color-dark': '#bebebe',
          '--calendar-outside-background': '#00000000',
          '--calendar-outside-background-dark': '#121212',
          '--calendar-selected-color': '#027BE3',
          '--calendar-selected-color-dark': '#027BE3',
          '--calendar-selected-background': '#cce7ff',
          '--calendar-selected-background-dark': '#cce7ff',
          '--calendar-mini-selected-color': 'unset',
          '--calendar-mini-selected-color-dark': '#027BE3',
          '--calendar-mini-selected-background': 'unset',
          '--calendar-mini-selected-background-dark': '#cce7ff',
          '--calendar-mini-selected-label-color': '#027BE3',
          '--calendar-mini-selected-label-color-dark': '#cce7ff',
          '--calendar-mini-selected-label-background': '#cce7ff',
          '--calendar-mini-selected-label-background-dark': '#027BE3',
          '--calendar-range-color': '#027BE3',
          '--calendar-range-color-dark': '#027BE3',
          '--calendar-range-background': '#cce7ff',
          '--calendar-range-background-dark': '#cce7ff',
          '--calendar-mini-range-color': '#cce7ff',
          '--calendar-mini-range-color-dark': '#027BE3',
          '--calendar-mini-range-background': 'unset',
          '--calendar-mini-range-background-dark': 'unset',
          '--calendar-mini-range-label-color': '#cce7ff',
          '--calendar-mini-range-label-color-dark': '#027BE3',
          '--calendar-mini-range-label-background': '#cce7ff',
          '--calendar-mini-range-label-background-dark': '#cce7ff',
          '--calendar-mini-range-connector-color': '#cce7ff',
          '--calendar-mini-range-connector-color-dark': '#ffff66',
          '--calendar-mini-range-hover-color': '#027BE3',
          '--calendar-mini-range-hover-color-dark': '#ffff66',
          '--calendar-mini-range-firstlast-color': '#cce7ff',
          '--calendar-mini-range-firstlast-color-dark': '#cce7ff',
          '--calendar-mini-range-firstlast-background': 'unset',
          '--calendar-mini-range-firstlast-background-dark': '#cce7ff',
          '--calendar-mini-range-firstlast-label-color': '#cce7ff',
          '--calendar-mini-range-firstlast-label-color-dark': '#cce7ff',
          '--calendar-mini-range-firstlast-label-background': '#027BE3',
          '--calendar-mini-range-firstlast-label-background-dark': '#ffff66',
          '--calendar-intervals-width': '56px',
          '--calendar-work-week-width': '30px',
          '--calendar-mini-work-week-width': '30px',
          '--calendar-work-week-font-size': '1.0em',
          '--calendar-head-font-weight': '600'
        },
        'deep purple': {
          '--calendar-scrollbar-track': '#9575cd',
          '--calendar-scrollbar-thumb': '#311b92',
          '--calendar-scrollbar-thumb-hover': '#5e35b1',
          '--calendar-scrollbar-track-dark': '#9575cd',
          '--calendar-scrollbar-thumb-dark': '#311b92',
          '--calendar-scrollbar-thumb-hover-dark': '#5e35b1',
          '--calendar-border': '#9575cd 1px solid',
          '--calendar-border-dark': '#ede7f6 1px solid',
          '--calendar-border-section': '#b39ddb 1px dashed',
          '--calendar-border-section-dark': '#b39ddb 1px dashed',
          '--calendar-border-current': '#9575cd 2px solid',
          '--calendar-border-current-dark': '#651fff 2px solid',
          '--calendar-mini-range-connector-hover-border': '#027BE3 1px dashed',
          '--calendar-mini-range-connector-hover-border-dark': '#ffff66 1px dashed',
          '--calendar-color': '#311b92',
          '--calendar-color-dark': '#ede7f6',
          '--calendar-background': '#ede7f6',
          '--calendar-background-dark': '#311b92',
          '--calendar-current-color': '#027BE3',
          '--calendar-current-color-dark': '#651fff',
          '--calendar-current-background': '#00000000',
          '--calendar-current-background-dark': '#311b92',
          '--calendar-disabled-date-color': '#ede7f6',
          '--calendar-disabled-date-color-dark': '#bebebe',
          '--calendar-disabled-date-background': '#b39ddb',
          '--calendar-disabled-date-background-dark': '#121212',
          '--calendar-active-date-color': '#ede7f6',
          '--calendar-active-date-color-dark': '#ffff66',
          '--calendar-active-date-background': '#651fff',
          '--calendar-active-date-background-dark': '#9575cd',
          '--calendar-outside-color': '#311b92',
          '--calendar-outside-color-dark': '#bebebe',
          '--calendar-outside-background': '#00000000',
          '--calendar-outside-background-dark': '#121212',
          '--calendar-selected-color': '#027BE3',
          '--calendar-selected-color-dark': '#027BE3',
          '--calendar-selected-background': '#cce7ff',
          '--calendar-selected-background-dark': '#cce7ff',
          '--calendar-mini-selected-color': 'unset',
          '--calendar-mini-selected-color-dark': '#027BE3',
          '--calendar-mini-selected-background': 'unset',
          '--calendar-mini-selected-background-dark': '#cce7ff',
          '--calendar-mini-selected-label-color': '#027BE3',
          '--calendar-mini-selected-label-color-dark': '#cce7ff',
          '--calendar-mini-selected-label-background': '#cce7ff',
          '--calendar-mini-selected-label-background-dark': '#027BE3',
          '--calendar-range-color': '#027BE3',
          '--calendar-range-color-dark': '#027BE3',
          '--calendar-range-background': '#cce7ff',
          '--calendar-range-background-dark': '#cce7ff',
          '--calendar-mini-range-color': '#cce7ff',
          '--calendar-mini-range-color-dark': '#027BE3',
          '--calendar-mini-range-background': 'unset',
          '--calendar-mini-range-background-dark': 'unset',
          '--calendar-mini-range-label-color': '#cce7ff',
          '--calendar-mini-range-label-color-dark': '#027BE3',
          '--calendar-mini-range-label-background': '#cce7ff',
          '--calendar-mini-range-label-background-dark': '#cce7ff',
          '--calendar-mini-range-connector-color': '#cce7ff',
          '--calendar-mini-range-connector-color-dark': '#ffff66',
          '--calendar-mini-range-hover-color': '#027BE3',
          '--calendar-mini-range-hover-color-dark': '#ffff66',
          '--calendar-mini-range-firstlast-color': '#cce7ff',
          '--calendar-mini-range-firstlast-color-dark': '#cce7ff',
          '--calendar-mini-range-firstlast-background': 'unset',
          '--calendar-mini-range-firstlast-background-dark': '#cce7ff',
          '--calendar-mini-range-firstlast-label-color': '#cce7ff',
          '--calendar-mini-range-firstlast-label-color-dark': '#cce7ff',
          '--calendar-mini-range-firstlast-label-background': '#027BE3',
          '--calendar-mini-range-firstlast-label-background-dark': '#ffff66',
          '--calendar-intervals-width': '56px',
          '--calendar-work-week-width': '30px',
          '--calendar-mini-work-week-width': '30px',
          '--calendar-work-week-font-size': '1.0em',
          '--calendar-head-font-weight': '600'
        },
        indigo: {
          '--calendar-scrollbar-track': '#7986cb',
          '--calendar-scrollbar-thumb': '#1a237e',
          '--calendar-scrollbar-thumb-hover': '#3949ab',
          '--calendar-scrollbar-track-dark': '#7986cb',
          '--calendar-scrollbar-thumb-dark': '#1a237e',
          '--calendar-scrollbar-thumb-hover-dark': '#3949ab',
          '--calendar-border': '#7986cb 1px solid',
          '--calendar-border-dark': '#e8eaf6 1px solid',
          '--calendar-border-section': '#9fa8da 1px dashed',
          '--calendar-border-section-dark': '#9fa8da 1px dashed',
          '--calendar-border-current': '#7986cb 2px solid',
          '--calendar-border-current-dark': '#3d5afe 2px solid',
          '--calendar-mini-range-connector-hover-border': '#027BE3 1px dashed',
          '--calendar-mini-range-connector-hover-border-dark': '#ffff66 1px dashed',
          '--calendar-color': '#1a237e',
          '--calendar-color-dark': '#e8eaf6',
          '--calendar-background': '#e8eaf6',
          '--calendar-background-dark': '#1a237e',
          '--calendar-current-color': '#027BE3',
          '--calendar-current-color-dark': '#3d5afe',
          '--calendar-current-background': '#00000000',
          '--calendar-current-background-dark': '#1a237e',
          '--calendar-disabled-date-color': '#e8eaf6',
          '--calendar-disabled-date-color-dark': '#bebebe',
          '--calendar-disabled-date-background': '#9fa8da',
          '--calendar-disabled-date-background-dark': '#121212',
          '--calendar-active-date-color': '#e8eaf6',
          '--calendar-active-date-color-dark': '#ffff66',
          '--calendar-active-date-background': '#3d5afe',
          '--calendar-active-date-background-dark': '#7986cb',
          '--calendar-outside-color': '#1a237e',
          '--calendar-outside-color-dark': '#bebebe',
          '--calendar-outside-background': '#00000000',
          '--calendar-outside-background-dark': '#121212',
          '--calendar-selected-color': '#027BE3',
          '--calendar-selected-color-dark': '#027BE3',
          '--calendar-selected-background': '#cce7ff',
          '--calendar-selected-background-dark': '#cce7ff',
          '--calendar-mini-selected-color': 'unset',
          '--calendar-mini-selected-color-dark': '#027BE3',
          '--calendar-mini-selected-background': 'unset',
          '--calendar-mini-selected-background-dark': '#cce7ff',
          '--calendar-mini-selected-label-color': '#027BE3',
          '--calendar-mini-selected-label-color-dark': '#cce7ff',
          '--calendar-mini-selected-label-background': '#cce7ff',
          '--calendar-mini-selected-label-background-dark': '#027BE3',
          '--calendar-range-color': '#027BE3',
          '--calendar-range-color-dark': '#027BE3',
          '--calendar-range-background': '#cce7ff',
          '--calendar-range-background-dark': '#cce7ff',
          '--calendar-mini-range-color': '#cce7ff',
          '--calendar-mini-range-color-dark': '#027BE3',
          '--calendar-mini-range-background': 'unset',
          '--calendar-mini-range-background-dark': 'unset',
          '--calendar-mini-range-label-color': '#cce7ff',
          '--calendar-mini-range-label-color-dark': '#027BE3',
          '--calendar-mini-range-label-background': '#cce7ff',
          '--calendar-mini-range-label-background-dark': '#cce7ff',
          '--calendar-mini-range-connector-color': '#cce7ff',
          '--calendar-mini-range-connector-color-dark': '#ffff66',
          '--calendar-mini-range-hover-color': '#027BE3',
          '--calendar-mini-range-hover-color-dark': '#ffff66',
          '--calendar-mini-range-firstlast-color': '#cce7ff',
          '--calendar-mini-range-firstlast-color-dark': '#cce7ff',
          '--calendar-mini-range-firstlast-background': 'unset',
          '--calendar-mini-range-firstlast-background-dark': '#cce7ff',
          '--calendar-mini-range-firstlast-label-color': '#cce7ff',
          '--calendar-mini-range-firstlast-label-color-dark': '#cce7ff',
          '--calendar-mini-range-firstlast-label-background': '#027BE3',
          '--calendar-mini-range-firstlast-label-background-dark': '#ffff66',
          '--calendar-intervals-width': '56px',
          '--calendar-work-week-width': '30px',
          '--calendar-mini-work-week-width': '30px',
          '--calendar-work-week-font-size': '1.0em',
          '--calendar-head-font-weight': '600'
        },
        blue: {
          '--calendar-scrollbar-track': '#64b5f6',
          '--calendar-scrollbar-thumb': '#0d47a0',
          '--calendar-scrollbar-thumb-hover': '#1e88e5',
          '--calendar-scrollbar-track-dark': '#64b5f6',
          '--calendar-scrollbar-thumb-dark': '#0d47a0',
          '--calendar-scrollbar-thumb-hover-dark': '#1e88e5',
          '--calendar-border': '#64b5f6 1px solid',
          '--calendar-border-dark': '#e3f2fd 1px solid',
          '--calendar-border-section': '#90caf9 1px dashed',
          '--calendar-border-section-dark': '#90caf9 1px dashed',
          '--calendar-border-current': '#64b5f6 2px solid',
          '--calendar-border-current-dark': '#2979ff 2px solid',
          '--calendar-mini-range-connector-hover-border': '#027BE3 1px dashed',
          '--calendar-mini-range-connector-hover-border-dark': '#ffff66 1px dashed',
          '--calendar-color': '#0d47a0',
          '--calendar-color-dark': '#e3f2fd',
          '--calendar-background': '#e3f2fd',
          '--calendar-background-dark': '#0d47a0',
          '--calendar-current-color': '#027BE3',
          '--calendar-current-color-dark': '#2979ff',
          '--calendar-current-background': '#00000000',
          '--calendar-current-background-dark': '#0d47a0',
          '--calendar-disabled-date-color': '#e3f2fd',
          '--calendar-disabled-date-color-dark': '#bebebe',
          '--calendar-disabled-date-background': '#90caf9',
          '--calendar-disabled-date-background-dark': '#121212',
          '--calendar-active-date-color': '#e3f2fd',
          '--calendar-active-date-color-dark': '#ffff66',
          '--calendar-active-date-background': '#2979ff',
          '--calendar-active-date-background-dark': '#64b5f6',
          '--calendar-outside-color': '#0d47a0',
          '--calendar-outside-color-dark': '#bebebe',
          '--calendar-outside-background': '#00000000',
          '--calendar-outside-background-dark': '#121212',
          '--calendar-selected-color': '#027BE3',
          '--calendar-selected-color-dark': '#027BE3',
          '--calendar-selected-background': '#cce7ff',
          '--calendar-selected-background-dark': '#cce7ff',
          '--calendar-mini-selected-color': 'unset',
          '--calendar-mini-selected-color-dark': '#027BE3',
          '--calendar-mini-selected-background': 'unset',
          '--calendar-mini-selected-background-dark': '#cce7ff',
          '--calendar-mini-selected-label-color': '#027BE3',
          '--calendar-mini-selected-label-color-dark': '#cce7ff',
          '--calendar-mini-selected-label-background': '#cce7ff',
          '--calendar-mini-selected-label-background-dark': '#027BE3',
          '--calendar-range-color': '#027BE3',
          '--calendar-range-color-dark': '#027BE3',
          '--calendar-range-background': '#cce7ff',
          '--calendar-range-background-dark': '#cce7ff',
          '--calendar-mini-range-color': '#cce7ff',
          '--calendar-mini-range-color-dark': '#027BE3',
          '--calendar-mini-range-background': 'unset',
          '--calendar-mini-range-background-dark': 'unset',
          '--calendar-mini-range-label-color': '#cce7ff',
          '--calendar-mini-range-label-color-dark': '#027BE3',
          '--calendar-mini-range-label-background': '#cce7ff',
          '--calendar-mini-range-label-background-dark': '#cce7ff',
          '--calendar-mini-range-connector-color': '#cce7ff',
          '--calendar-mini-range-connector-color-dark': '#ffff66',
          '--calendar-mini-range-hover-color': '#027BE3',
          '--calendar-mini-range-hover-color-dark': '#ffff66',
          '--calendar-mini-range-firstlast-color': '#cce7ff',
          '--calendar-mini-range-firstlast-color-dark': '#cce7ff',
          '--calendar-mini-range-firstlast-background': 'unset',
          '--calendar-mini-range-firstlast-background-dark': '#cce7ff',
          '--calendar-mini-range-firstlast-label-color': '#cce7ff',
          '--calendar-mini-range-firstlast-label-color-dark': '#cce7ff',
          '--calendar-mini-range-firstlast-label-background': '#027BE3',
          '--calendar-mini-range-firstlast-label-background-dark': '#ffff66',
          '--calendar-intervals-width': '56px',
          '--calendar-work-week-width': '30px',
          '--calendar-mini-work-week-width': '30px',
          '--calendar-work-week-font-size': '1.0em',
          '--calendar-head-font-weight': '600'
        }
      },
      tasks: [
        {
          icon: 'done',
          title: 'Task 1',
          key: 'TSK-584',
          logged: [
            { date: '2021-03-02', logged: 0.5 },
            { date: '2021-03-05', logged: 2.0 }
          ]
        },
        {
          icon: 'pending',
          title: 'Task 2',
          key: 'TSK-592',
          logged: [
            { date: '2021-03-06', logged: 3.5 },
            { date: '2021-03-08', logged: 4.0 }
          ]
        },
        {
          icon: 'pending',
          title: 'Task 3',
          key: 'TSK-593',
          logged: [
            { date: '2021-03-10', logged: 4.5 },
            { date: '2021-03-11', logged: 2.4 }
          ]
        },
        {
          icon: 'done',
          title: 'Task 4',
          key: 'TSK-594',
          logged: [
            { date: '2021-03-14', logged: 6.5 },
            { date: '2021-03-15', logged: 2.0 }
          ]
        },
        {
          icon: 'pending',
          title: 'Task 5',
          key: 'TSK-595',
          logged: [
            { date: '2021-03-12', logged: 1.5 },
            { date: '2021-03-18', logged: 2.0 }
          ]
        },
        {
          icon: 'blocking',
          title: 'Task 6',
          key: 'TSK-596',
          logged: [
            { date: '2021-03-13', logged: 1.5 },
            { date: '2021-03-23', logged: 3.5 }
          ]
        },
        {
          icon: 'pending',
          title: 'Task 7',
          key: 'TSK-597',
          logged: [
            { date: '2021-03-19', logged: 0.75 },
            { date: '2021-03-26', logged: 2.25 }
          ]
        },
        {
          icon: 'done',
          title: 'Task 8',
          key: 'TSK-598',
          logged: [
            { date: '2021-03-21', logged: 1.5 },
            { date: '2021-03-22', logged: 4.0 }
          ]
        },
        {
          icon: 'pending',
          title: 'Task 9',
          key: 'TSK-599',
          logged: [
            { date: '2021-03-26', logged: 6.5 },
            { date: '2021-03-27', logged: 3.5 }
          ]
        },
        {
          icon: 'blocking',
          title: 'Task 10',
          key: 'TSK-600',
          logged: [
            { date: '2021-03-12', logged: 0.5 },
            { date: '2021-03-14', logged: 2.0 },
            { date: '2021-03-28', logged: 4.5 },
            { date: '2021-03-30', logged: 1.0 }
          ]
        }
      ],
      footerTasks: [
        { title: 'TOTALS' }
      ]
    }
  },
  computed: {
    themesList () {
      const list = []
      Object.keys(this.themes).forEach((theme) => {
        list.push({
          label: theme,
          value: { ...this.themes[ theme ] }
        })
      })
      return list
    },

    /**
     * Returns tasks between startDate and endDate (captured via onChange event)
     */
    parsedTasks () {
      const start = parsed(this.startDate)
      const end = parsed(this.endDate)
      const tasks = []

      for (let i = 0; i < this.tasks.length; ++i) {
        const task = this.tasks[ i ]
        for (let j = 0; j < task.logged.length; ++j) {
          const loggedTimestamp = parsed(task.logged[ j ].date)
          if (isBetweenDates(loggedTimestamp, start, end)) {
            tasks.push(task)
            break
          }
        }
      }
      return tasks
    }
  },
  beforeMount () {
    // adjust all the dates for the current month
    const date = new Date()
    const year = date.getFullYear()
    const month = padNumber((date.getMonth() + 1), 2)
    this.tasks.forEach(task => {
      task.logged.forEach(logged => {
        // get last 2 digited from current date (day)
        const day = logged.date.slice(-2)
        logged.date = [ year, padNumber(month, 2), padNumber(day, 2) ].join('-')
      })
    })
  },
  methods: {
    getLogged (date, logged) {
      const val = []
      for (let index = 0; index < logged.length; ++index) {
        if (logged[ index ].date === date) {
          val.push({ logged: logged[ index ].logged })
          break
        }
      }
      return val
    },

    getLoggedSummary (date) {
      let total = 0

      const reducer = (accumulator, currentValue) => {
        if (date === currentValue.date) {
          return accumulator + currentValue.logged
        }
        return accumulator
      }

      for (const index in this.tasks) {
        const task = this.tasks[ index ]
        total += task.logged.reduce(reducer, 0)
      }

      return total
    },

    /**
     * Sums up the amount of time spent on a task
     * This only sums it up if the logged date falls
     * between the start and end times
     */
    sum (start, end, task) {
      const reducer = (accumulator, currentValue) => {
        const loggedTimestamp = parsed(currentValue.date)
        if (isBetweenDates(loggedTimestamp, start, end)) {
          return accumulator + currentValue.logged
        }
        return accumulator
      }
      return task.logged.reduce(reducer, 0)
    },

    /**
     * Determines if the passed in task has logged time
     * between the start and end times
     */
    getTasks (start, end, task) {
      const tasks = []

      for (let index = 0; index < task.logged.length; ++index) {
        const loggedTimestamp = parsed(task.logged[ index ].date)
        if (isBetweenDates(loggedTimestamp, start, end)) {
          tasks.push(task)
          break
        }
      }
      return tasks
    },

    weekdayClass (data) {
      return {
        'task__weekday--style': true
      }
    },

    dayClass (data) {
      return {
        'task__day--style': true
      }
    },

    footerDayClass (data) {
      return {
        'task__footer--day__style': true
      }
    },

    /**
     * Sums up the amount of time spent for all tasks
     * between the start and end dates
     */
    totals (start, end) {
      let total = 0
      const reducer = (accumulator, currentValue) => {
        const loggedTimestamp = parsed(currentValue.date)
        if (isBetweenDates(loggedTimestamp, start, end)) {
          return accumulator + currentValue.logged
        }
        return accumulator
      }

      for (const task in this.tasks) {
        total += this.tasks[ task ].logged.reduce(reducer, 0)
      }

      return total
    },

    onToday () {
      this.$refs.calendar.moveToToday()
    },
    onPrev () {
      this.$refs.calendar.prev()
    },
    onNext () {
      this.$refs.calendar.next()
    },
    onMoved (data) {
      console.log('onMoved', data)
    },
    onChange (data) {
      console.log('onChange', data)
      this.startDate = data.start
      this.endDate = data.end
    },
    onClickDate (data) {
      console.log('onClickDate', data)
    },
    onClickDay (data) {
      console.log('onClickDay', data)
    },
    onClickHeadDay (data) {
      console.log('onClickHeadDay', data)
    }
  }
})
</script>

<style lang="sass" scoped>
.header
  display: flex
  justify-content: space-between
  align-items: center
  width: 100%
  padding: 2px
  font-size: .9em
  .issue
    display: flex
    justify-content: flex-start
    align-items: center
    width: 80%
  .key
    display: flex
    justify-content: center
    width: 80px
  .logged
    display: flex
    justify-content: flex-end
    width: 80px
.summary
  display: flex
  justify-content: space-between
  align-items: center
  padding: 2px
  font-size: .9em
  font-weight: 700
  width: 100%
  .title
    display: flex
    justify-content: flex-start
  .total
    display: flex
    justify-content: flex-end
.done
  color: blue
.pending
  color: green
.blocking
  color: red
.logged-time
  display: flex
  justify-content: center
  align-items: center
  padding: 0
  margin: 0
  height: 100%
</style>

<style lang="sass">
.task__weekday--style
  font-size: 0.8em
  font-weight: 600
.task__day--style
  font-size: 0.8em
.task__footer--day__style
  font-size: 0.8em
  font-weight: 600
</style>

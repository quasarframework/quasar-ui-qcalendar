<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%">
        <q-calendar-agenda
          ref="calendar"
          v-model="selectedDate"
          view="week"
          :weekdays="[1, 2, 3, 4, 5]"
          :left-column-options="leftColumnOptions"
          column-options-id="id"
          column-options-label="label"
          :day-min-height="200"
          :locale="locale"
          animated
          bordered
          hoverable
          @change="onChange"
        >
          <template
            #head-column-label="{
              scope: {
                column: { id, label },
              },
            }"
          >
            <template v-if="id === 'overdue'">
              <div
                style="
                  display: flex;
                  justify-content: space-evenly;
                  align-items: center;
                  flex-wrap: nowrap;
                  height: 100%;
                  width: 100%;
                "
              >
                <CheckboxChecked v-if="overdueSelected" @click="overdueSelected = false" />
                <Checkbox v-else @click="overdueSelected = true" />
                <span class="ellipsis">{{ label }}</span>
              </div>
            </template>
            <template v-else>
              <div class="row items-center no-wrap">
                <span class="ellipsis">{{ label }}</span>
              </div>
            </template>
          </template>

          <template #head-day="{ scope: { timestamp } }">
            <div
              style="
                display: flex;
                justify-content: space-evenly;
                align-items: center;
                flex-wrap: nowrap;
                height: 100%;
                width: 100%;
              "
            >
              <CheckboxChecked
                v-if="selected[timestamp.weekday - 1]"
                style="cursor: pointer"
                @click="selected[timestamp.weekday - 1] = false"
              />
              <Checkbox
                v-else
                style="cursor: pointer"
                @click="selected[timestamp.weekday - 1] = true"
              />
              <span class="ellipsis"
                >{{ weekdayFormatter(timestamp, false) }} {{ timestamp.day }}</span
              >
            </div>
          </template>

          <template #column="{ scope: { column } }">
            <template v-if="column.id === 'overdue'">
              <div
                style="
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                  align-items: center;
                  flex-wrap: nowrap;
                  font-size: 12px;
                  padding: 2px;
                "
              >
                <div
                  class="cursor-pointer"
                  style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: nowrap;
                    font-size: 12px;
                    width: 100%;
                  "
                >
                  <div
                    class="cursor-pointer"
                    style="
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      flex-wrap: nowrap;
                      font-size: 12px;
                    "
                  >
                    <AddAlt />
                    Add Job
                  </div>
                  <div
                    class="cursor-pointer"
                    style="
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      flex-wrap: nowrap;
                      font-size: 12px;
                    "
                  >
                    <AddAlt />
                    Add Note
                  </div>
                </div>
              </div>
              <div
                class="planner-column"
                data-column="overdue"
                @dragover.stop="onDragOver"
                @drop.stop="onDrop"
              >
                <transition-group name="planner-item">
                  <template v-for="item in overdue" :key="item.id">
                    <planner-item
                      v-model="item.selected"
                      :data-id="item.id"
                      :name="item.name"
                      :address="item.address"
                      :email="item.email"
                      :phone="item.phone"
                      :work-done="item.workDone"
                      :work-date="item.workDate"
                      :amount="item.amount"
                      :days-over="item.daysOver"
                      :draggable="true"
                      @dragstart.stop="(e: DragEvent) => onDragStart(e, item)"
                      @dragend.stop="onDragEnd"
                      @dragenter.stop="onDragEnter"
                      @dragleave.stop="onDragLeave"
                      @dragover.stop="onDragOver"
                      @drop.stop="onDrop"
                      @touchmove.stop="(e: TouchEvent) => onTouchMove(e, item)"
                      @touchstart.stop="(/*e: TouchEvent*/) => onTouchStart(/*e, item*/)"
                      @touchend.stop="onTouchEnd"
                    />
                  </template>
                </transition-group>
              </div>
            </template>
          </template>

          <template #day="{ scope: { timestamp } }">
            <div
              style="
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                flex-wrap: nowrap;
                font-size: 12px;
                padding: 2px;
              "
            >
              <div
                class="cursor-pointer"
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  flex-wrap: nowrap;
                  font-size: 12px;
                  width: 100%;
                "
              >
                <div
                  class="cursor-pointer"
                  style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: nowrap;
                    font-size: 12px;
                  "
                >
                  <AddAlt />
                  Add Job
                </div>
                <div
                  class="cursor-pointer"
                  style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: nowrap;
                    font-size: 12px;
                  "
                >
                  <AddAlt />
                  Add Note
                </div>
              </div>
            </div>
            <div
              class="planner-column"
              :data-column="timestamp.weekday"
              @dragover.stop="onDragOver"
              @drop.stop="onDrop"
            >
              <transition-group name="planner-item">
                <template v-for="item in getAgenda(timestamp)" :key="item.id">
                  <planner-item
                    v-model="item.selected"
                    :data-id="item.id"
                    :name="item.name"
                    :address="item.address"
                    :email="item.email"
                    :phone="item.phone"
                    :work-done="item.workDone"
                    :work-date="item.workDate"
                    :amount="item.amount"
                    :days-over="item.daysOver"
                    :draggable="true"
                    @dragstart.stop="(e: DragEvent) => onDragStart(e, item)"
                    @dragend.stop="onDragEnd"
                    @dragenter.stop="onDragEnter"
                    @dragleave.stop="onDragLeave"
                    @dragover.stop="onDragOver"
                    @drop.stop="onDrop"
                    @touchmove.stop="(e: TouchEvent) => onTouchMove(e, item)"
                    @touchstart.stop="(/*e: TouchEvent*/) => onTouchStart(/*e, item*/)"
                    @touchend.stop="onTouchEnd"
                  />
                </template>
              </transition-group>
            </div>
          </template>
        </q-calendar-agenda>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  QCalendarAgenda,
  today,
  padNumber,
  parseTimestamp,
  updateFormatted,
  moveRelativeDays,
  prevDay,
  daysBetween,
  createNativeLocaleFormatter,
  Timestamp,
} from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/index.css'
import Checkbox from '@carbon/icons-vue/es/checkbox/24'
import CheckboxChecked from '@carbon/icons-vue/es/checkbox--checked/24'
import AddAlt from '@carbon/icons-vue/es/add--alt/16'

import { ref, reactive, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import NavigationBar from 'components/NavigationBar.vue'
import PlannerItem from 'components/PlannerItem.vue'
import { getLocale } from 'src/util/getLocale'

type AgendaItem = {
  id: number
  selected: boolean
  address: string
  name: string
  email: string
  phone: string
  workDone: string
  workDate: string
  amount: string
  daysOver: number
  curCol: number | string
}

const names = [
  'Ezekiel Stout',
  'Aurora Frank',
  'Ethan Buchanan',
  'Sam Parker',
  'Jonathan Hall',
  'Carl Flynn',
  'Raymond Ingram',
  'Abel Glover',
  'Margaret Medina',
  'Jalen Kane',
  'Monserrat Stein',
  'Andres Gentry',
]

const addresses = [
  '262 East Cypress Drive',
  '8719 Anderson Road',
  '242 W. Shady Road',
  '4 Lexington Avenue',
  '7940 Sunset Court',
  '9866 NE. Rockaway Ave.',
  '9 Santa Clara Drive',
  '774 Charles Road',
  '5 East Thomas St.',
  '7714 Lilac Rd.',
  '561 Bowman St.',
  '517 Brickell Ave.',
]

const emails = [
  'qmacro@me.com',
  'amimojo@gmail.com',
  'padme@mac.com',
  'flaviog@verizon.net',
  'srour@mac.com',
  'retoh@outlook.com',
  'pappp@me.com',
  'mcraigw@hotmail.com',
  'smcnabb@hotmail.com',
  'rnelson@att.net',
  'fwitness@live.com',
  'stomv@aol.com',
]

const phones = [
  '555-555-0000',
  '555-555-1111',
  '555-555-2222',
  '555-555-3333',
  '555-555-4444',
  '555-555-5555',
  '555-555-6666',
  '555-555-7777',
  '555-555-8888',
  '555-555-9999',
]

const workDone = [
  'Window cleaning',
  'Exterior cleaning',
  'Lawn maintenance',
  'Tree service',
  'Flower bed maintenance',
]

let itemId = 1
const calendar = ref<QCalendarAgenda>()
const selectedDate = ref(today())
const shortMonthLabel = ref(false)
const todayDate = ref(today())
const locale = ref('en-US')
const dateFormatter = ref<Intl.DateTimeFormat>()
const titleFormatter = ref<Intl.DateTimeFormat>()
const leftColumnOptions = reactive([{ id: 'overdue', label: 'Overdue' }])
const startTimestamp = reactive<Timestamp>({} as Timestamp)
const overdueSelected = ref(true)
const selected = reactive([false, false, false, false, false])
const overdue = reactive<AgendaItem[]>([])
const agenda = reactive<Record<number, AgendaItem[]>>({
  // number represents day of the week
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
})

let dragEl: HTMLElement | undefined
let curColEl: HTMLElement | undefined
let curChildEl: HTMLElement | undefined
let currentItem: AgendaItem | undefined
let copyElement: HTMLElement | undefined
let pageX = 0
let pageY = 0

const weekdayFormatter = computed(() => {
  const longOptions: Intl.DateTimeFormatOptions = { timeZone: 'UTC', weekday: 'long' }
  const shortOptions: Intl.DateTimeFormatOptions = { timeZone: 'UTC', weekday: 'short' }
  return createNativeLocaleFormatter(locale.value, (_tms, short) =>
    short ? shortOptions : longOptions,
  )
})

watch(overdueSelected, (val) => {
  overdue.forEach((item) => {
    item.selected = val ?? false
  })
})

selected.forEach((_, index) => {
  watch(
    () => selected[index],
    (val) => {
      agenda[index + 1]?.forEach((item) => {
        item.selected = val ?? false
      })
    },
  )
})

onMounted(() => {
  locale.value = getLocale()
  updateFormatters()
  onToday()
})

onUnmounted(cleanup)

function onToday() {
  calendar.value?.moveToToday()
  nextTick(generateLists)
}

function onPrev() {
  calendar.value?.prev()
  generateLists()
}

function onNext() {
  calendar.value?.next()
  generateLists()
}

function onChange({ start, end }: { start: string; end: string }) {
  console.info('onChange', start, end)
  Object.assign(startTimestamp, parseTimestamp(start))
}

function updateFormatters() {
  try {
    dateFormatter.value = new Intl.DateTimeFormat(locale.value, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    })
    titleFormatter.value = new Intl.DateTimeFormat(locale.value, {
      month: shortMonthLabel.value ? 'short' : 'long',
      year: 'numeric',
      timeZone: 'UTC',
    })
  } catch {
    dateFormatter.value = undefined
    titleFormatter.value = undefined
  }
}

function generateLists() {
  generateList(overdue, Math.floor(Math.random() * 10) + 3, startTimestamp, true, 0)
  for (let day = 1; day <= 5; day++) {
    if (!agenda[day]) {
      agenda[day] = []
    }
    generateList(agenda[day]!, Math.floor(Math.random() * 10) + 3, startTimestamp, false, day)
  }
  adjustSelected()
}

function generateList(
  list: AgendaItem[],
  count: number,
  timestamp: Timestamp,
  overdue: boolean,
  col: number,
) {
  const items: AgendaItem[] = Array.from({ length: count }).map(() => ({
    id: itemId++,
    selected: false,
    address: addresses[Math.floor(Math.random() * addresses.length)] || '',
    name: names[Math.floor(Math.random() * names.length)] || '',
    email: emails[Math.floor(Math.random() * emails.length)] || '',
    phone: phones[Math.floor(Math.random() * phones.length)] || '',
    workDone: workDone[Math.floor(Math.random() * workDone.length)] || '',
    workDate: overdue ? generateDate(timestamp) : timestamp.date,
    amount: generateAmount(),
    daysOver: overdue ? getDaysBetween(timestamp.date, todayDate.value) : 0,
    curCol: col,
  }))
  list.splice(0, list.length, ...items)
}

function generateDate(timestamp: Timestamp) {
  const days = Math.floor(Math.random() * 30) + 1
  let ts = moveRelativeDays(timestamp, prevDay, days)
  ts = updateFormatted(ts)
  return ts.date
}

function generateAmount(): string {
  const integer = padNumber(Math.floor(Math.random() * 100), 2)
  const fractional = padNumber(Math.floor(Math.random() * 100), 2)
  return `${integer}.${fractional}`
}

function getDaysBetween(startDate: string, endDate: string): number {
  const timestampStart = parseTimestamp(startDate) ?? ({} as Timestamp)
  const timestampEnd = parseTimestamp(endDate) ?? ({} as Timestamp)
  return daysBetween(timestampStart, timestampEnd)
}

function adjustSelected() {
  overdue.forEach((item) => {
    item.selected = overdueSelected.value
  })
  selected.forEach((sel, idx) => {
    agenda[idx + 1]?.forEach((item) => {
      item.selected = sel
    })
  })
}

function getAgenda(timestamp: Timestamp): AgendaItem[] {
  return agenda[Number(timestamp.weekday)] || []
}

function onDragStart(e: DragEvent, item: AgendaItem) {
  dragEl = e.target as HTMLElement
  currentItem = item

  if (e.dataTransfer) {
    e.dataTransfer.setData('text/html', (e.currentTarget as HTMLElement)?.innerHTML || '')
  }
  const child = getCorrectTarget(e.currentTarget as HTMLElement, 'planner-item')
  if (child) {
    child.style.opacity = '0'
    dragEl = child
  }
}

function onDragEnter(
  e: DragEvent,
  column?: HTMLElement | undefined,
  child?: HTMLElement | undefined,
) {
  column = column || getCorrectTarget(e.currentTarget as HTMLElement, 'planner-column')
  child = child || getCorrectTarget(e.currentTarget as HTMLElement, 'planner-item')

  if (curColEl !== column) {
    curColEl?.classList.remove('drag-over')
    curColEl = column
    curColEl?.classList.add('drag-over')
  }

  if (curChildEl !== child) {
    curChildEl?.classList.remove('drag-over-item')
    curChildEl = child
    if (curChildEl && dragEl !== child) {
      curChildEl.classList.add('drag-over-item')
    }
  }
}

function onDragEnd(e: DragEvent) {
  if (e.currentTarget) {
    ;(e.currentTarget as HTMLElement).style.opacity = '1.0'
  }

  curChildEl?.classList.remove('drag-over-item')
  curColEl?.classList.remove('drag-over')
}

function onDragLeave() {
  // No specific action needed for now
}

function onDragOver(e: DragEvent) {
  e.preventDefault() // Necessary. Allows us to drop.
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move'
  }
  onDragEnter(e)
  return false
}

function onDrop(e: DragEvent, column?: HTMLElement, child?: HTMLElement) {
  column = column || getCorrectTarget(e.currentTarget as HTMLElement, 'planner-column')
  child = child || getCorrectTarget(e.currentTarget as HTMLElement, 'planner-item')

  if (dragEl === child) {
    return false // no dropping on self
  }

  curChildEl?.classList.remove('drag-over-item')
  curColEl?.classList.remove('drag-over')

  if (column) {
    const targetColumn = getColumnFromTarget(column)
    if (targetColumn && currentItem) {
      removeFromColumn(
        getColumnFromTarget(dragEl as HTMLElement) || String(currentItem.curCol),
        currentItem.id,
      )
      addToColumn(targetColumn, getItemIdFromTarget(child), currentItem)
    }
  }

  cleanup()
  return false
}

function onTouchMove(e: TouchEvent, item: AgendaItem) {
  const touchLocation = e.targetTouches[0]
  if (touchLocation) {
    pageX = touchLocation.pageX
    pageY = touchLocation.pageY
  }

  const touchStart = copyElement === null

  const { column, child } = findTargets()
  if (column || child) {
    if (touchStart) {
      if (child) {
        onDragStart(e as unknown as DragEvent, item)
        copyElement = child.cloneNode(true) as HTMLElement
        copyElement.style.position = 'absolute'
        copyElement.style.opacity = '0.5'
        document.body.appendChild(copyElement)
      } else {
        cleanup()
        return
      }
    }

    if (copyElement) {
      const offsets = getTouchOffsets(copyElement, pageX, pageY)
      moveElement(copyElement, offsets.left, offsets.top)
    }
    onDragEnter(e as unknown as DragEvent, column, child)
  }
}

function onTouchStart() {
  // Intentionally left empty to allow initial touch registration
}

function onTouchEnd(e: TouchEvent) {
  if (copyElement) {
    document.body.removeChild(copyElement)
    const { column, child } = findTargets()
    if (column || child) {
      onDragEnd(e as unknown as DragEvent)

      if (dragEl === child) {
        if (dragEl) {
          dragEl.style.opacity = '1.0'
        }
        cleanup()
      } else {
        onDrop(e as unknown as DragEvent, column, child)
      }
    }
  }
}

function findTargets() {
  let column: HTMLElement | undefined
  let child: HTMLElement | undefined
  const elements = document.elementsFromPoint(pageX, pageY)

  elements.forEach((el) => {
    if (el.classList.contains('planner-item')) {
      child = el as HTMLElement
    } else if (el.classList.contains('planner-column')) {
      column = el as HTMLElement
    }
  })

  return { column, child }
}

function getTouchOffsets(el: HTMLElement, left: number, top: number) {
  const rect = el.getBoundingClientRect()
  return { left: left - rect.width / 2, top: top - rect.height / 2 }
}

function moveElement(el: HTMLElement, left: number, top: number) {
  el.style.left = `${left}px`
  el.style.top = `${top}px`
}

function cleanup() {
  dragEl = curColEl = curChildEl = currentItem = copyElement = undefined
}

function getCorrectTarget(el: HTMLElement, klass: string): HTMLElement | undefined {
  if (!el) return
  return el.classList.contains(klass)
    ? el
    : getCorrectTarget(el.parentElement as HTMLElement, klass)
}

function getColumnFromTarget(target: HTMLElement | undefined): string {
  return target?.dataset.column || ''
}

function getItemIdFromTarget(target: HTMLElement | undefined): number {
  return parseInt(target?.dataset.id || '0', 10)
}

function removeFromColumn(column: string, id: number) {
  const list = column === 'overdue' || column === '0' ? overdue : agenda[parseInt(column, 10)]
  if (list) {
    const index = list.findIndex((item) => item.id === id)
    if (index !== -1) {
      list.splice(index, 1)
    }
  }
}

function addToColumn(column: string, id: number, item: AgendaItem) {
  const list = column === 'overdue' || column === '0' ? overdue : agenda[parseInt(column, 10)]
  if (list) {
    if (id === 0) {
      list.push(item)
    } else {
      const index = list.findIndex((existingItem) => existingItem.id === id)
      if (index !== -1) {
        item.curCol = Number(column)
        list.splice(index, 0, item)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.planner-column {
  border: 1px solid transparent;
  height: 100%;
}

.planner-column.drag-over {
  border: 1px dashed red;
}

.planner-item.drag-over-item {
  background: rgba(0, 255, 0, 0.1);
}

.planner-item {
  transition: all 0.5s;
}

.planner-item-enter,
.planner-item-leave-to {
  opacity: 0;
  transform: scale(0);
}

.planner-item-enter-to {
  opacity: 1;
  transform: scale(1);
}

.planner-item-move {
  transition: transform 0.5s;
}
</style>

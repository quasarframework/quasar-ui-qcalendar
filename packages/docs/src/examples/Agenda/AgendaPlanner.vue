<template>
  <div class="subcontent">
    <p class="text-body2 text-center q-mb-md">
      This recipe builds a planner-style agenda with a side panel and calendar grid working
      together.
    </p>

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
                <q-icon
                  class="planner-select-icon"
                  :name="overdueSelected ? 'check_box' : 'check_box_outline_blank'"
                  @click="overdueSelected = !overdueSelected"
                />
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
              <q-icon
                class="planner-select-icon"
                :name="selected[timestamp.weekday - 1] ? 'check_box' : 'check_box_outline_blank'"
                style="cursor: pointer"
                @click="selected[timestamp.weekday - 1] = !selected[timestamp.weekday - 1]"
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
                    <q-icon name="add_circle_outline" />
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
                    <q-icon name="add_circle_outline" />
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
                    <div
                      class="q-mr-xs q-mb-xs q-px-sm planner-item"
                      :class="{
                        'planner-item--selected': item.selected,
                        'planner-item--overdue': item.daysOver > 0,
                      }"
                      :data-id="item.id"
                      :draggable="true"
                      @dragstart.stop="onDragStart($event, item)"
                      @dragend.stop="onDragEnd"
                      @dragenter.stop="onDragEnter"
                      @dragleave.stop="onDragLeave"
                      @dragover.stop="onDragOver"
                      @drop.stop="onDrop"
                      @touchmove.stop="onTouchMove($event, item)"
                      @touchstart.stop="onTouchStart"
                      @touchend.stop="onTouchEnd"
                    >
                      <div class="planner-item__row">
                        <div class="planner-item__icon">
                          <q-icon
                            class="planner-item__selectable"
                            :name="item.selected ? 'check_box' : 'check_box_outline_blank'"
                            @click.stop.prevent="toggleItem(item)"
                          />
                        </div>
                        <div
                          class="ellipsis planner-item__selectable"
                          @click.stop.prevent="toggleItem(item)"
                        >
                          {{ item.name }}
                        </div>
                      </div>

                      <div class="planner-item__row">
                        <q-icon class="planner-item__icon" name="place" />
                        <div class="ellipsis col">{{ item.address }}</div>
                      </div>

                      <div class="planner-item__row">
                        <q-icon class="planner-item__icon" name="mail" />
                        <div class="ellipsis col">{{ item.email }}</div>
                      </div>

                      <div class="planner-item__row">
                        <q-icon class="planner-item__icon" name="phone" />
                        <div class="ellipsis col">{{ item.phone }}</div>
                      </div>

                      <div class="planner-item__row">
                        <q-icon class="planner-item__icon" name="construction" />
                        <div class="ellipsis col">{{ item.workDone }}</div>
                      </div>

                      <div class="planner-item__row">
                        <q-icon class="planner-item__icon" name="event" />
                        <div class="ellipsis col">{{ item.workDate }}</div>
                      </div>

                      <div class="planner-item__row">
                        <q-icon class="planner-item__icon" name="attach_money" />
                        <div class="ellipsis col">{{ item.amount }}</div>
                      </div>

                      <div class="planner-item__row">
                        <q-icon class="planner-item__icon planner-item__overdue" name="alarm" />
                        <div class="ellipsis planner-item__overdue">
                          {{ item.daysOver }} days overdue
                        </div>
                      </div>
                    </div>
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
                  <q-icon name="add_circle_outline" />
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
                  <q-icon name="add_circle_outline" />
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
                  <div
                    class="q-mr-xs q-mb-xs q-px-sm planner-item"
                    :class="{
                      'planner-item--selected': item.selected,
                      'planner-item--overdue': item.daysOver > 0,
                    }"
                    :data-id="item.id"
                    :draggable="true"
                    @dragstart.stop="onDragStart($event, item)"
                    @dragend.stop="onDragEnd"
                    @dragenter.stop="onDragEnter"
                    @dragleave.stop="onDragLeave"
                    @dragover.stop="onDragOver"
                    @drop.stop="onDrop"
                    @touchmove.stop="onTouchMove($event, item)"
                    @touchstart.stop="onTouchStart"
                    @touchend.stop="onTouchEnd"
                  >
                    <div class="planner-item__row">
                      <div class="planner-item__icon">
                        <q-icon
                          class="planner-item__selectable"
                          :name="item.selected ? 'check_box' : 'check_box_outline_blank'"
                          @click.stop.prevent="toggleItem(item)"
                        />
                      </div>
                      <div
                        class="ellipsis planner-item__selectable"
                        @click.stop.prevent="toggleItem(item)"
                      >
                        {{ item.name }}
                      </div>
                    </div>

                    <div class="planner-item__row">
                      <q-icon class="planner-item__icon" name="place" />
                      <div class="ellipsis col">{{ item.address }}</div>
                    </div>

                    <div class="planner-item__row">
                      <q-icon class="planner-item__icon" name="mail" />
                      <div class="ellipsis col">{{ item.email }}</div>
                    </div>

                    <div class="planner-item__row">
                      <q-icon class="planner-item__icon" name="phone" />
                      <div class="ellipsis col">{{ item.phone }}</div>
                    </div>

                    <div class="planner-item__row">
                      <q-icon class="planner-item__icon" name="construction" />
                      <div class="ellipsis col">{{ item.workDone }}</div>
                    </div>

                    <div class="planner-item__row">
                      <q-icon class="planner-item__icon" name="event" />
                      <div class="ellipsis col">{{ item.workDate }}</div>
                    </div>

                    <div class="planner-item__row">
                      <q-icon class="planner-item__icon" name="attach_money" />
                      <div class="ellipsis col">{{ item.amount }}</div>
                    </div>

                    <div class="planner-item__row">
                      <q-icon class="planner-item__icon planner-item__overdue" name="alarm" />
                      <div class="ellipsis planner-item__overdue">
                        {{ item.daysOver }} days overdue
                      </div>
                    </div>
                  </div>
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
import { QCalendarAgenda } from '@quasar/quasar-ui-qcalendar'
import {
  today,
  padNumber,
  parseTimestamp,
  updateFormatted,
  moveRelativeDays,
  prevDay,
  daysBetween,
  createNativeLocaleFormatter,
} from '@timestamp-js/core'
import type { Timestamp } from '@timestamp-js/core'
import '@quasar/quasar-ui-qcalendar/index.css'

import { ref, reactive, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import NavigationBar from '@/components/NavigationBar.vue'

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
  return createNativeLocaleFormatter(locale.value, (_tms: unknown, short: boolean) =>
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
  locale.value = getBrowserLocale()
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

function onChange({ start }: { start: string }) {
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

function toggleItem(item: AgendaItem) {
  item.selected = !item.selected
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

  const touchStart = copyElement === undefined

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

function getBrowserLocale() {
  return Intl.DateTimeFormat().resolvedOptions().locale || 'en-US'
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
  border: 1px solid transparent;
  box-shadow:
    0 1px 5px rgb(0 0 0 / 20%),
    0 2px 2px rgb(0 0 0 / 14%),
    0 3px 1px -2px rgb(0 0 0 / 12%);
  border-radius: 4px;
  vertical-align: top;
  padding: 2px;
  margin: 2px;
  margin-bottom: 4px;
  font-size: 12px;
  transition: all 0.5s;

  &:hover {
    border: 1px solid rgba(0, 140, 200, 0.8);
  }
}

.planner-item__row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
}

.planner-item__icon {
  max-width: 25px;
  min-width: 25px;
}

.planner-select-icon,
.planner-item__selectable {
  color: blue;
  cursor: pointer;
}

.planner-item--selected {
  .planner-item__selectable {
    color: red;
  }
}

.planner-item--overdue {
  .planner-item__overdue {
    color: red;
  }
}

:global(body.body--dark) {
  .planner-item {
    box-shadow:
      0 1px 5px rgb(255 255 255 / 20%),
      0 2px 2px rgb(255 255 255 / 14%),
      0 3px 1px -2px rgb(255 255 255 / 12%);
  }

  .planner-select-icon,
  .planner-item__selectable {
    color: #82b1ff;
  }

  .planner-item--selected {
    .planner-item__selectable {
      color: #ff8a80;
    }
  }

  .planner-item--overdue {
    .planner-item__overdue {
      color: #ff8a80;
    }
  }
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

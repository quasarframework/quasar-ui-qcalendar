<template>
  <div class="subcontent">

    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%;">
        <q-calendar-agenda
          ref="calendar"
          v-model="selectedDate"
          view="week"
          :weekdays="[1,2,3,4,5]"
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
          <template #head-column-label="{ scope: { column: { id, label } } }">
            <template v-if="id === 'overdue'">
              <div style="display: flex; justify-content: space-evenly; align-items: center; flex-wrap: nowrap; height: 100%; width: 100%;">
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

          <template #head-day="{ scope: { timestamp }}">
            <div style="display: flex; justify-content: space-evenly; align-items: center; flex-wrap: nowrap; height: 100%; width: 100%;">
              <CheckboxChecked
                v-if="selected[timestamp.weekday - 1]"
                style="cursor: pointer;"
                @click="selected[ timestamp.weekday - 1 ] = false"
              />
              <Checkbox
                v-else
                style="cursor: pointer;"
                @click="selected[ timestamp.weekday - 1 ] = true"
              />
              <span class="ellipsis">{{ weekdayFormatter(timestamp, false) }} {{ timestamp.day }}</span>
            </div>
          </template>

        <template #column="{ scope: { column } }">
          <template v-if="column.id === 'overdue'">
            <div style="display: flex; flex-direction: column; justify-content: space-between; align-items: center; flex-wrap: nowrap; font-size: 12px; padding: 2px;">
              <div class="cursor-pointer" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: nowrap; font-size: 12px; width: 100%;">
                <div class="cursor-pointer" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: nowrap; font-size: 12px;">
                  <AddAlt />
                  Add Job
                </div>
                <div class="cursor-pointer" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: nowrap; font-size: 12px;">
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
                    :data-id="item.id"
                    v-model="item.selected"
                    :name="item.name"
                    :address="item.address"
                    :email="item.email"
                    :phone="item.phone"
                    :work-done="item.workDone"
                    :work-date="item.workDate"
                    :amount="item.amount"
                    :days-over="item.daysOver"
                    :draggable="true"
                    @dragstart.stop="(e) => onDragStart(e, item)"
                    @dragend.stop="onDragEnd"
                    @dragenter.stop="onDragEnter"
                    @dragleave.stop="onDragLeave"
                    @dragover.stop="onDragOver"
                    @drop.stop="onDrop"
                    @touchmove.stop="(e) => onTouchMove(e, item)"
                    @touchstart.stop="(e) => onTouchStart(e, item)"
                    @touchend.stop="onTouchEnd"
                  />
                </template>
              </transition-group>
            </div>
          </template>
        </template>

        <template #day="{ scope: { timestamp } }">
          <div style="display: flex; flex-direction: column; justify-content: space-between; align-items: center; flex-wrap: nowrap; font-size: 12px; padding: 2px;">
            <div class="cursor-pointer" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: nowrap; font-size: 12px; width: 100%;">
              <div class="cursor-pointer" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: nowrap; font-size: 12px;">
                <AddAlt />
                Add Job
              </div>
              <div class="cursor-pointer" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: nowrap; font-size: 12px;">
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
                  :data-id="item.id"
                  v-model="item.selected"
                  :name="item.name"
                  :address="item.address"
                  :email="item.email"
                  :phone="item.phone"
                  :work-done="item.workDone"
                  :work-date="item.workDate"
                  :amount="item.amount"
                  :days-over="item.daysOver"
                  :draggable="true"
                  @dragstart.stop="(e) => onDragStart(e, item)"
                  @dragend.stop="onDragEnd"
                  @dragenter.stop="onDragEnter"
                  @dragleave.stop="onDragLeave"
                  @dragover.stop="onDragOver"
                  @drop.stop="onDrop"
                  @touchmove.stop="(e) => onTouchMove(e, item)"
                  @touchstart.stop="(e) => onTouchStart(e, item)"
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

<script>
import {
  QCalendarAgenda,
  today,
  padNumber,
  parseTimestamp,
  updateFormatted,
  moveRelativeDays,
  prevDay,
  daysBetween,
  createNativeLocaleFormatter
} from '@quasar/quasar-ui-qcalendar/src/index.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarAgenda.sass'

import Checkbox from '@carbon/icons-vue/es/checkbox/24'
import CheckboxChecked from '@carbon/icons-vue/es/checkbox--checked/24'
import AddAlt from '@carbon/icons-vue/es/add--alt/16'

import {
  defineComponent,
  ref,
  reactive,
  computed,
  watch,
  onMounted,
  onUnmounted,
  nextTick
} from 'vue'
import NavigationBar from '../components/NavigationBar.vue'
import PlannerItem from '../components/PlannerItem.vue'
import { getLocale } from '../util/getLocale'

let itemId = 1

const names = [ 'Ezekiel Stout', 'Aurora Frank', 'Ethan Buchanan', 'Sam Parker', 'Jonathan Hall', 'Carl Flynn', 'Raymond Ingram', 'Abel Glover', 'Margaret Medina', 'Jalen Kane', 'Monserrat Stein', 'Andres Gentry' ]
const addresses = [ '262 East Cypress Drive', '8719 Anderson Road', '242 W. Shady Road', '4 Lexington Avenue', '7940 Sunset Court', '9866 NE. Rockaway Ave.', '9 Santa Clara Drive', '774 Charles Road', '5 East Thomas St.', '7714 Lilac Rd.', '561 Bowman St.', '517 Brickell Ave.' ]
const emails = [ 'qmacro@me.com', 'amimojo@gmail.com', 'padme@mac.com', 'flaviog@verizon.net', 'srour@mac.com', 'retoh@outlook.com', 'pappp@me.com', 'mcraigw@hotmail.com', 'smcnabb@hotmail.com', 'rnelson@att.net', 'fwitness@live.com', 'stomv@aol.com' ]
const phones = [ '555-555-0000', '555-555-1111', '555-555-2222', '555-555-3333', '555-555-4444', '555-555-5555', '555-555-6666', '555-555-7777', '555-555-8888', '555-555-9999' ]
const workDone = [ 'Window cleaning', 'Exterior cleaning', 'Lawn maintenance', 'Tree service', 'Flower bed maintenance' ]

export default defineComponent({
  name: 'AgendaPlanner',

  components: {
    NavigationBar,
    QCalendarAgenda,
    PlannerItem,
    Checkbox,
    CheckboxChecked,
    AddAlt
  },

  setup (props, { slots, emit }) {
    const calendar = ref(null),
      selectedDate = ref(today()),
      shortMonthLabel = ref(false),
      todayDate = ref(today()),
      todayTimestamp = reactive(parseTimestamp(todayDate.value)),
      locale = ref('en-US'),
      dateFormatter = ref(null),
      titleFormatter = ref(null),
      leftColumnOptions = reactive([
        {
          id: 'overdue',
          label: 'Overdue'
        }
      ]),
      startTimestamp = reactive({}),
      overdueSelected = ref(false),
      selected = reactive([
        false,
        false,
        false,
        false,
        false
      ]),
      overdue = reactive([]),
      agenda = reactive({
        // value represents day of the week
        1: [],
        2: [],
        3: [],
        4: [],
        5: []
      })

    let
      // getCurrentItemId = null,
      dragEl = null,
      curColEl = null,
      curChildEl = null,
      // currentColumn = null,
      // currentItemId = null,
      currentItem = null,
      // targetColumn = null,
      // targetItemId = null,
      copyElement = null,
      pageX = 0,
      pageY = 0

    const weekdayFormatter = computed(() => {
      const longOptions = { timeZone: 'UTC', weekday: 'long' }
      const shortOptions = { timeZone: 'UTC', weekday: 'short' }

      return createNativeLocaleFormatter(
        locale.value,
        (_tms, short) => (short ? shortOptions : longOptions)
      )
    })

    watch(overdueSelected, val => {
      overdue.forEach(due => {
        due.selected = val
      })
    })

    watch(() => selected[ 0 ], val => {
      agenda[ 1 ].forEach(ag => {
        ag.selected = val
      })
    })

    watch(() => selected[ 1 ], val => {
      agenda[ 2 ].forEach(ag => {
        ag.selected = val
      })
    })

    watch(() => selected[ 2 ], val => {
      agenda[ 3 ].forEach(ag => {
        ag.selected = val
      })
    })

    watch(() => selected[ 3 ], val => {
      agenda[ 4 ].forEach(ag => {
        ag.selected = val
      })
    })

    watch(() => selected[ 4 ], val => {
      agenda[ 5 ].forEach(ag => {
        ag.selected = val
      })
    })

    onMounted(() => {
      locale.value = getLocale()
      updateFormatters()
      // todayTimestamp = parseTimestamp(todayDate.value)
      onToday() // set calendar to today's date
    })

    onUnmounted(() => {
      // just to make sure there are no memory leaks
      cleanup()
    })

    function onToday () {
      calendar.value.moveToToday()
      // give time for calendar emits...
      nextTick(() => {
        generateLists()
      })
    }

    function onPrev () {
      calendar.value.prev()
      generateLists()
    }

    function onNext () {
      calendar.value.next()
      generateLists()
    }

    // this is called whenever the calendar start/end dates change
    function onChange ({ start, end }) {
      console.log('onChange', start, end)
      startTimestamp.value = parseTimestamp(start)
    }

    function updateFormatters () {
      try {
        dateFormatter.value = new Intl.DateTimeFormat(locale.value || undefined, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'UTC'
        })

        titleFormatter.value = new Intl.DateTimeFormat(locale.value || undefined, {
          month: shortMonthLabel.value ? 'short' : 'long',
          year: 'numeric',
          timeZone: 'UTC'
        })
      }
      catch (e) {
        // console.error('Intl.DateTimeFormat not supported')
        dateFormatter.value = null
        titleFormatter.value = null
      }
    }

    function generateLists () {
      generateList(overdue, Math.floor(Math.random() * 10) + 3, startTimestamp, true)
      generateList(agenda[ 1 ], Math.floor(Math.random() * 10) + 3, startTimestamp)
      generateList(agenda[ 2 ], Math.floor(Math.random() * 10) + 3, startTimestamp)
      generateList(agenda[ 3 ], Math.floor(Math.random() * 10) + 3, startTimestamp)
      generateList(agenda[ 4 ], Math.floor(Math.random() * 10) + 3, startTimestamp)
      generateList(agenda[ 5 ], Math.floor(Math.random() * 10) + 3, startTimestamp)
      adjustSelected()
    }

    function generateList (list, count, timestamp, overdue = false) {
      const items = []
      for (let i = 0; i < count; ++i) {
        items[ i ] = {}
        items[ i ].selected = false
        items[ i ].id = itemId++
        items[ i ].address = addresses[ Math.floor((Math.random() * 100) % addresses.length) ]
        items[ i ].name = names[ Math.floor((Math.random() * 100) % names.length) ]
        items[ i ].email = emails[ Math.floor((Math.random() * 100) % emails.length) ]
        items[ i ].phone = phones[ Math.floor((Math.random() * 100) % phones.length) ]
        items[ i ].amount = generateAmount()
        items[ i ].workDate = overdue === true ? generateDate(timestamp.value) : timestamp.value.date
        items[ i ].workDone = workDone[ Math.floor((Math.random() * 100) % workDone.length) ]
        items[ i ].daysOver = overdue === true ? getDaysBetween(items[ i ].workDate, todayDate.value) : 0
      }
      list.splice(0, list.length, ...items)
    }

    function generateDate (timestamp) {
      const days = Math.floor((Math.random() * 100) % 30) + 1
      let ts = moveRelativeDays(timestamp, prevDay, days)
      ts = updateFormatted(ts) // needed to update static values after date change
      return ts.date
    }

    function generateAmount () {
      const integer = padNumber(Math.floor(Math.random() * 100), 2)
      const fractional = padNumber(Math.floor(Math.random() * 100), 2)
      return integer + '.' + fractional
    }

    function getDaysBetween (startDate, endDate) {
      const timestampStart = parseTimestamp(startDate)
      const timestampEnd = parseTimestamp(endDate)
      return daysBetween(timestampStart, timestampEnd)
    }

    function adjustSelected () {
      overdue.forEach(due => {
        due.selected = overdueSelected.value
      })

      selected.forEach((sel, index) => {
        agenda[ index + 1 ].forEach(ag => {
          ag.selected = sel
        })
      })
    }

    function getAgenda (timestamp) {
      return agenda[ parseInt(timestamp.weekday, 10) ]
    }

    function onDragStart (e, item) {
      if (e.dataTransfer) {
        e.dataTransfer.setData('text/html', e.currentTarget.innerHTML)
      }
      const child = getCorrectTarget(e.currentTarget, 'planner-item')
      child.style.opacity = '0'
      dragEl = child
      // currentColumn = getColumnFromTarget(child)
      // getCurrentItemId = getItemIdFromTarget(child)
      currentItem = item
    }

    function onDragEnter (e, column, child) {
      if (!column && !child) {
        column = getCorrectTarget(e.currentTarget, 'planner-column')
        child = getCorrectTarget(e.currentTarget, 'planner-item')
      }

      // check column
      if (curColEl !== column) {
        if (curColEl) {
          curColEl.classList.remove('drag-over')
        }
        curColEl = column
        if (curColEl) {
          curColEl.classList.add('drag-over')
        }
      }

      // check item
      if (curChildEl !== child) {
        if (curChildEl) {
          curChildEl.classList.remove('drag-over-item')
        }
        curChildEl = child
        if (curChildEl && dragEl !== child) {
          curChildEl.classList.add('drag-over-item')
        }
      }
    }

    function onDragEnd (e) {
      e.currentTarget.style.opacity = '1.0'

      if (curChildEl) {
        curChildEl.classList.remove('drag-over-item')
      }

      if (curColEl) {
        curColEl.classList.remove('drag-over')
      }
    }

    function onDragLeave (e) {
      // nothing to do
    }

    function onDragOver (e) {
      if (e.preventDefault) {
        e.preventDefault() // Necessary. Allows us to drop.
      }

      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move'
      }

      onDragEnter(e)

      return false
    }

    function onDrop (e, column, child) {
      if (!column && !child) {
        column = getCorrectTarget(e.currentTarget, 'planner-column')
        child = getCorrectTarget(e.currentTarget, 'planner-item')
      }

      const targetColumn = getColumnFromTarget(column)
      const targetItemId = getItemIdFromTarget(child)

      if (dragEl === child) {
        // no dropping on self
        return false
      }

      if (curChildEl) {
        curChildEl.classList.remove('drag-over-item')
      }

      if (curColEl) {
        curColEl.classList.remove('drag-over')
      }

      if (targetColumn) {
        // get current item column
        const currentColumnEl = getCorrectTarget(dragEl, 'planner-column')
        if (currentColumnEl) {
          const currentColumn = getColumnFromTarget(currentColumnEl)

          // remove dragged item
          removeFromColumn(currentColumn, currentItem.id)

          // add dragged item to new location
          addToColumn(targetColumn, targetItemId, currentItem)

          // update selection status
          if (targetColumn === 'overdue') {
            overdue.forEach(due => {
              due.selected = overdueSelected.value
            })
          }
          else {
            agenda[ targetColumn ].forEach(ag => {
              ag.selected = selected[ targetColumn - 1 ]
            })
          }
        }
      }

      cleanup()

      return false
    }

    function cleanup () {
      // release the dom nodes
      // getCurrentItemId = null
      dragEl = null
      curColEl = null
      curChildEl = null
      // currentColumn = null
      // currentItemId = null
      currentItem = null
      // targetColumn = null
      // targetItemId = null
      copyElement = null
      pageX = 0
      pageY = 0
    }

    function moveElement (el, left, top) {
      el.style.left = left + 'px'
      el.style.top = top + 'px'
    }

    function getTouchOffsets (el, left, top) {
      const rect = el.getBoundingClientRect()
      return { left: left - rect.width / 2, top: top - rect.height / 2 }
    }

    function findTargets () {
      let column, child
      const els = document.elementsFromPoint(pageX, pageY)

      for (let i = 0; i < els.length; ++i) {
        const el = els[ i ]
        if (el.classList.contains('planner-item')) {
          child = el
        }
        else if (el.classList.contains('planner-column')) {
          column = el
        }
        if (column && child) break
      }

      return { column, child }
    }

    function onTouchMove (e, item) {
      const touchLocation = e.targetTouches[ 0 ]

      const touchStart = copyElement === null

      // assign box new coordinates based on the touch.
      pageX = touchLocation.pageX
      pageY = touchLocation.pageY

      const { column, child } = findTargets()
      if (column || child) {
        if (touchStart) {
          if (child) {
            onDragStart(e, item)
            copyElement = child.cloneNode(true)
            copyElement.style.position = 'absolute'
            copyElement.style.opacity = '0.5'
          }
          else {
            // fail - probably trying to drag a column
            cleanup()
            return
          }
        }

        const { left, top } = getTouchOffsets(copyElement, pageX, pageY)

        moveElement(copyElement, left, top)

        // add the copy to the body
        document.body.appendChild(copyElement)

        onDragEnter(e, column, child)
      }
    }

    function onTouchStart (e, item) {
      // we don't do anything here because we want the
      // system to register a move, before we start things
    }

    function onTouchEnd (e) {
      if (copyElement) {
        // remove the copy to the body
        document.body.removeChild(copyElement)

        const { column, child } = findTargets()
        if (column || child) {
          onDragEnd(e)

          if (dragEl === child) {
            // no dropping on self, restore it all
            dragEl.style.opacity = '1.0'
            cleanup()
          }
          else {
            onDrop(e, column, child)
          }
        }
      }
    }

    function getCorrectTarget (el, klass) {
      if (!el) {
        return null
      }
      if (el.classList.contains(klass)) {
        return el
      }
      return getCorrectTarget(el.parentElement, klass)
    }

    function getColumnFromTarget (target) {
      if (target) {
        return target.dataset.column
      }
    }

    function getItemIdFromTarget (target) {
      if (target) {
        return target.dataset.id
      }
    }

    function removeFromColumn (column, id) {
      let list
      if (column === 'overdue') {
        list = overdue
      }
      else {
        list = agenda[ parseInt(column, 10) ]
      }

      id = parseInt(id, 10)

      for (let index = 0; index < list.length; ++index) {
        if (list[ index ].id === id) {
          list.splice(index, 1)
          return
        }
      }
    }

    function addToColumn (column, id, item) {
      let list
      if (column === 'overdue') {
        list = overdue
      }
      else {
        list = agenda[ parseInt(column, 10) ]
      }

      // if no id, then add to end of list
      if (!id) {
        list.splice(list.length, 0, item)
        return
      }
      else {
        id = parseInt(id, 10)
      }

      for (let index = 0; index < list.length; ++index) {
        if (list[ index ].id === id) {
          list.splice(index, 0, item)
          return
        }
      }
    }

    return {
      calendar,
      selectedDate,
      shortMonthLabel,
      todayDate,
      todayTimestamp,
      locale,
      dateFormatter,
      titleFormatter,
      leftColumnOptions,
      startTimestamp,
      overdueSelected,
      selected,
      overdue,
      agenda,
      weekdayFormatter,
      // methods
      onToday,
      onPrev,
      onNext,
      onChange,
      getAgenda,
      onDragStart,
      onDragEnter,
      onDragEnd,
      onDragLeave,
      onDragOver,
      onDrop,
      onTouchMove,
      onTouchStart,
      onTouchEnd
    }
  }
})
</script>

<style lang="sass" scoped>
.planner-column
  border: 1px solid transparent
  height: 100%

.planner-column.drag-over
  border: 1px dashed red

.planner-item.drag-over-item
  background: rgba(0,255,0, .1)

.planner-item
  transition: all 0.5s

.planner-item-enter, .planner-item-leave-to
  opacity: 0
  transform: scale(0)

.planner-item-enter-to
  opacity: 1
  transform: scale(1)

.planner-item-move
  transition: transform .5s

</style>

// Vue
import {
  h,
  computed,
  defineComponent,
  getCurrentInstance,
  onBeforeUpdate,
  onMounted,
  nextTick,
  reactive,
  ref,
  Transition,
  watch,
  withDirectives
} from 'vue'

// Utility
import {
  getDayIdentifier,
  // isBetweenDates,
  parsed,
  parseTimestamp,
  today
} from '../utils/Timestamp.js'

import {
  convertToUnit,
  minCharWidth
} from '../utils/helpers.js'

// Composables
import useCalendar from '../composables/useCalendar.js'
import useCommon, { useCommonProps } from '../composables/useCommon.js'
import useInterval, { useAgendaProps } from '../composables/useInterval.js'
import { useColumnProps } from '../composables/useColumn.js'
import { useMaxDaysProps } from '../composables/useMaxDays.js'
import useTimes, { useTimesProps } from '../composables/useTimes.js'
import useRenderValues from '../composables/useRenderValues.js'
import useMouse, { getRawMouseEvents } from '../composables/useMouse.js'
import useMove, { useMoveEmits } from '../composables/useMove.js'
import useEmitListeners from '../composables/useEmitListeners.js'
import useButton from '../composables/useButton.js'
import useFocusHelper from '../composables/useFocusHelper.js'
import useCellWidth, { useCellWidthProps } from '../composables/useCellWidth.js'
import useCheckChange, { useCheckChangeEmits } from '../composables/useCheckChange.js'
import useEvents from '../composables/useEvents.js'
import useKeyboard, { useNavigationProps } from '../composables/useKeyboard.js'

// Directives
import ResizeObserver from '../directives/ResizeObserver.js'

export default defineComponent({
  name: 'QCalendarAgenda',

  directives: [ResizeObserver],

  props: {
    ...useCommonProps,
    ...useAgendaProps,
    ...useColumnProps,
    ...useMaxDaysProps,
    ...useTimesProps,
    ...useCellWidthProps,
    ...useNavigationProps
  },

  emits: [
    'update:model-value',
    ...useCheckChangeEmits,
    ...useMoveEmits,
    ...getRawMouseEvents('-date'),
    ...getRawMouseEvents('-head-day'),
    ...getRawMouseEvents('-time')
  ],

  setup (props, { slots, emit, expose }) {
    const
      scrollArea = ref(null),
      pane = ref(null),
      headerColumnRef = ref(null),
      focusRef = ref(null),
      focusValue = ref(null),
      datesRef = ref({}),
      headDayEventsParentRef = ref({}),
      headDayEventsChildRef = ref({}),
      direction = ref('next'),
      startDate = ref(today()),
      endDate = ref('0000-00-00'),
      maxDaysRendered = ref(0),
      emittedValue = ref(props.modelValue),
      size = reactive({ width: 0, height: 0 }),
      dragOverHeadDayRef = ref(false),
      // keep track of last seen start and end dates
      lastStart = ref(null),
      lastEnd = ref(null)

    watch(() => props.view, () => {
      // reset maxDaysRendered
      maxDaysRendered.value = 0
    })

    const parsedView = computed(() => {
      if (props.view === 'month') {
        return 'month-interval'
      }
      return props.view
    })

    const vm = getCurrentInstance()
    if (vm === null) {
      throw new Error('current instance is null')
    }

    const { emitListeners } = useEmitListeners(vm)

    const {
      isSticky
    } = useCellWidth(props)

    watch(isSticky, (val) => {
      // console.log('isSticky', isSticky.value)
    })

    const {
      times,
      setCurrent,
      updateCurrent
    } = useTimes(props)

    // update dates
    updateCurrent()
    setCurrent()

    const {
      // computed
      weekdaySkips,
      parsedStart,
      parsedEnd,
      dayFormatter,
      weekdayFormatter,
      ariaDateFormatter,
      // methods
      dayStyleDefault,
      getRelativeClasses
    } = useCommon(props, { startDate, endDate, times })

    const parsedValue = computed(() => {
      return parseTimestamp(props.modelValue, times.now)
        || parsedStart.value
        || times.today
    })

    focusValue.value = parsedValue.value
    focusRef.value = parsedValue.value.date

    // const canChangeDate = computed(() => {
    //   if (maxDaysRendered.value === 0) return true
    //   if (endDate.value === '0000-00-00') return true
    //   if (days.value === undefined || days.value.length === 0) return true
    //   const start = days.value[ 0 ]
    //   const end = days.value[ days.value.length - 1 ]
    //   return isBetweenDates(parsedValue.value, start, end) !== true
    // })

    const { renderValues } = useRenderValues(props, {
      parsedView,
      parsedValue,
      times
    })

    const {
      rootRef,
      scrollWidth,
      __initCalendar,
      __renderCalendar
    } = useCalendar(props, __renderAgenda, {
      scrollArea,
      pane
    })

    const {
      // computed
      days,
      // ariaDateTimeFormatter,
      parsedCellWidth,
      // methods
      // styleDefault,
      getScopeForSlot,
    } = useInterval(props, {
      weekdaySkips,
      times,
      scrollArea,
      parsedStart,
      parsedEnd,
      maxDays: maxDaysRendered,
      size,
      headerColumnRef
    })

    const { move } = useMove(props, {
      parsedView,
      parsedValue,
      weekdaySkips,
      direction,
      maxDays: maxDaysRendered,
      times,
      emittedValue,
      emit
    })

    const {
      getDefaultMouseEventHandlers
    } = useMouse(emit, emitListeners)

    const {
      checkChange
    } = useCheckChange(emit, { days, lastStart, lastEnd })

    const {
      isKeyCode
    } = useEvents()

    const { tryFocus } = useKeyboard(props, {
      rootRef,
      focusRef,
      focusValue,
      datesRef,
      days,
      parsedView,
      parsedValue,
      emittedValue,
      weekdaySkips,
      direction,
      times
    })

    const parsedColumnCount = computed(() => {
      return days.value.length
        + (isLeftColumnOptionsValid.value === true ? props.leftColumnOptions.length : 0)
        + (isRightColumnOptionsValid.value === true ? props.rightColumnOptions.length : 0)
        + days.value.length === 1 && parseInt(props.columnCount, 10) > 0 ? parseInt(props.columnCount, 10) : 0
    })

    const isLeftColumnOptionsValid = computed(() => {
      return props.leftColumnOptions !== undefined && Array.isArray(props.leftColumnOptions)
    })

    const isRightColumnOptionsValid = computed(() => {
      return props.rightColumnOptions !== undefined && Array.isArray(props.rightColumnOptions)
    })

    const computedWidth = computed(() => {
      if (rootRef.value) {
        const width = size.width || rootRef.value.getBoundingClientRect().width
        if (width && parsedColumnCount.value) {
          return (
            (width - scrollWidth.value) / parsedColumnCount.value
          ) + 'px'
        }
      }
      return (100 / parsedColumnCount.value) + '%'
    })

    watch([days], checkChange, { deep: true, immediate: true })

    watch(() => props.modelValue, (val, oldVal) => {
      if (emittedValue.value !== val) {
        if (props.animated === true) {
          const v1 = getDayIdentifier(parsed(val))
          const v2 = getDayIdentifier(parsed(oldVal))
          direction.value = v1 >= v2 ? 'next' : 'prev'
        }
        emittedValue.value = val
      }
      focusRef.value = val
    })

    watch(emittedValue, (val, oldVal) => {
      if (emittedValue.value !== props.modelValue) {
        if (props.animated === true) {
          const v1 = getDayIdentifier(parsed(val))
          const v2 = getDayIdentifier(parsed(oldVal))
          direction.value = v1 >= v2 ? 'next' : 'prev'
        }
        emit('update:model-value', val)
      }
    })

    watch(focusRef, val => {
      if (val) {
        focusValue.value = parseTimestamp(val)
      }
    })

    watch(focusValue, (val) => {
      if (datesRef.value[ focusRef.value ]) {
        datesRef.value[ focusRef.value ].focus()
      }
      else {
        // if focusRef is not in the list of current dates of dateRef,
        // then assume month is changing
        tryFocus()
      }
    })

    watch(() => props.maxDays, val => {
      maxDaysRendered.value = val
    })

    onBeforeUpdate(() => {
      datesRef.value = {}
    })

    onMounted(() => {
      __initCalendar()
    })

    // public functions

    function moveToToday () {
      emittedValue.value = today()
    }

    function next (amount = 1) {
      move(amount)
    }

    function prev (amount = 1) {
      move(-amount)
    }

    // private functions

    function __onResize ({ width, height }) {
      size.width = width
      size.height = height
    }

    function __isActiveDate (day) {
      return day.date === emittedValue.value
    }

    // Render functions

    function __renderHeadColumn (column, index) {
      const slot = slots[ 'head-column' ]
      const scope = { column, index, days: days.value }
      const width = isSticky.value === true ? props.cellWidth : computedWidth.value
      const isFocusable = props.focusable === true && props.focusType.includes('weekday')
      const id = (props.columnOptionsId !== undefined ? column[ props.columnOptionsId ] : undefined)

      const style = {
        maxWidth: width,
        width
      }

      return h('div', {
        key: id,
        tabindex: isFocusable === true ? 0 : -1,
        class: {
          'q-calendar-agenda__head--day': true,
          'q-column-day': true,
          'q-calendar__hoverable': props.hoverable === true,
          'q-calendar__focusable': isFocusable === true
        },
        style,
        onDragenter: (e) => {
          if (props.dragEnterFunc !== undefined && typeof props.dragEnterFunc === 'function') {
            props.dragEnterFunc(e, 'head-column', scope) === true
              ? dragOverHeadDayRef.value = id
              : dragOverHeadDayRef.value = ''
          }
        },
        onDragover: (e) => {
          if (props.dragOverFunc !== undefined && typeof props.dragOverFunc === 'function') {
            props.dragOverFunc(e, 'head-column', scope) === true
              ? dragOverHeadDayRef.value = id
              : dragOverHeadDayRef.value = ''
          }
        },
        onDragleave: (e) => {
          if (props.dragLeaveFunc !== undefined && typeof props.dragLeaveFunc === 'function') {
            props.dragLeaveFunc(e, 'head-column', scope) === true
              ? dragOverHeadDayRef.value = id
              : dragOverHeadDayRef.value = ''
          }
        },
        onDrop: (e) => {
          if (props.dropFunc !== undefined && typeof props.dropFunc === 'function') {
            props.dropFunc(e, 'head-column', scope) === true
              ? dragOverHeadDayRef.value = id
              : dragOverHeadDayRef.value = ''
          }
        },
        ...getDefaultMouseEventHandlers('-head-column', (event, eventName) => {
          return { scope: { column, index }, event }
        })
      }, [
        props.noDefaultHeaderText !== true && __renderHeadColumnLabel(column),
        slot && slot(scope),
        useFocusHelper()
      ])
    }

    function __renderHeadColumnLabel (column) {
      const slot = slots[ 'head-column-label' ]
      const scope = { column }
      const label = props.columnOptionsLabel !== undefined ? column[ props.columnOptionsLabel ] : column.label

      const vNode = h('div', {
        class: {
          'q-calendar-agenda__head--weekday': true,
          [ 'q-calendar__' + props.weekdayAlign ]: true,
          ellipsis: true
        },
        style: {
          alignSelf: 'center'
        }
      }, [
        slot && slot({ scope }),
        !slot && h('span', {
          class: 'ellipsis'
        }, label)
      ])

      return props.dateHeader === 'stacked'
        ? vNode
        : h('div', {
          class: 'q-calendar__header--inline',
          style: {
            height: '100%'
          }
        }, [
          vNode
        ])
    }

    // ---

    function __renderHead () {
      return h('div', {
        roll: 'presentation',
        class: {
          'q-calendar-agenda__head': true,
          'q-calendar__sticky': isSticky.value === true
        },
        style: {
          marginRight: scrollWidth.value + 'px'
        }
      }, [
        __renderHeadDaysColumn()
      ])
    }

    function __renderHeadDaysColumn () {
      return h('div', {
        ref: headerColumnRef,
        class: {
          'q-calendar-agenda__head--days__column': true
        }
      }, [
        __renderHeadDaysRow(),
        __renderHeadDaysEventsRow()
      ])
    }

    function __renderHeadDaysRow () {
      return h('div', {
        class: {
          'q-calendar-agenda__head--days__weekdays': true
        }
      }, [
        ...__renderHeadDays()
      ])
    }

    function __renderHeadDaysEventsRow () {
      const slot = slots[ 'head-days-events' ]

      nextTick(() => {
        if (headDayEventsChildRef.value && props.columnCount === 0 && window) {
          try {
            const styles = window.getComputedStyle(headDayEventsChildRef.value)
            headDayEventsParentRef.value.parentElement.style.height = styles.height
            headDayEventsParentRef.value.style.height = styles.height
          }
          catch (e) {}
        }
      })

      return h('div', {
        class: {
          'q-calendar-agenda__head--days__event': true
        }
      }, [
        slot && h('div', {
          // TODO: need a class
          ref: headDayEventsParentRef,
          style: {
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            overflow: 'hidden',
            zIndex: 1
          }
        }, [
          slot({ scope: { days: days.value, ref: headDayEventsChildRef } })
        ]),
        ...__renderHeadDaysEvents()
      ])
    }

    function __renderHeadDays () {
      if (days.value.length === 1 && parseInt(props.columnCount, 10) > 0) {
        return [
          isLeftColumnOptionsValid.value === true && props.leftColumnOptions.map((column, index) => __renderHeadColumn(column, index)),
          Array.apply(null, new Array(parseInt(props.columnCount, 10)))
            .map((_, i) => i + parseInt(props.columnIndexStart, 10))
            .map(columnIndex => __renderHeadDay(days.value[ 0 ], columnIndex)),
          isRightColumnOptionsValid.value === true && props.rightColumnOptions.map((column, index) => __renderHeadColumn(column, index))
        ]
      }
      else {
        return [
          isLeftColumnOptionsValid.value === true && props.leftColumnOptions.map((column, index) => __renderHeadColumn(column, index)),
          days.value.map(day => __renderHeadDay(day)),
          isRightColumnOptionsValid.value === true && props.rightColumnOptions.map((column, index) => __renderHeadColumn(column, index))
        ]
      }
    }

    function __renderHeadDaysEvents () {
      if (days.value.length === 1 && parseInt(props.columnCount, 10) > 0) {
        return [
          Array.apply(null, new Array(parseInt(props.columnCount, 10)))
            .map((_, i) => i + parseInt(props.columnIndexStart, 10))
            .map(columnIndex => __renderHeadDayEvent(days.value[ 0 ], columnIndex))
        ]
      }
      else {
        return days.value.map(day => __renderHeadDayEvent(day))
      }
    }

    function __renderHeadDay (day, columnIndex) {
      const headDaySlot = slots[ 'head-day' ]
      const headDateSlot = slots[ 'head-date' ]
      const activeDate = props.noActiveDate !== true && __isActiveDate(day)

      const scope = getScopeForSlot(day, columnIndex)
      scope.activeDate = activeDate
      scope.droppable = dragOverHeadDayRef.value === day.date
      scope.disabled = (props.disabledWeekdays ? props.disabledWeekdays.includes(day.weekday) : false)

      const width = isSticky.value === true ? props.cellWidth : computedWidth.value
      const styler = props.weekdayStyle || dayStyleDefault
      const style = {
        width,
        maxWidth: width,
        ...styler({ scope })
      }
      if (isSticky.value === true) {
        style.minWidth = width
      }
      const weekdayClass = typeof props.weekdayClass === 'function' ? props.weekdayClass({ scope }) : {}
      const isFocusable = props.focusable === true && props.focusType.includes('weekday')

      const data = {
        key: day.date + (columnIndex !== undefined ? '-' + columnIndex : ''),
        ref: (el) => { datesRef.value[ day.date ] = el },
        tabindex: isFocusable === true ? 0 : -1,
        class: {
          'q-calendar-agenda__head--day': true,
          ...weekdayClass,
          ...getRelativeClasses(day),
          'q-active-date': activeDate,
          'q-calendar__hoverable': props.hoverable === true,
          'q-calendar__focusable': isFocusable === true
        },
        style,
        onDragenter: (e) => {
          if (props.dragEnterFunc !== undefined && typeof props.dragEnterFunc === 'function') {
            props.dragEnterFunc(e, 'head-day', scope) === true
              ? dragOverHeadDayRef.value = day.date
              : dragOverHeadDayRef.value = ''
          }
        },
        onDragover: (e) => {
          if (props.dragOverFunc !== undefined && typeof props.dragOverFunc === 'function') {
            props.dragOverFunc(e, 'head-day', scope) === true
              ? dragOverHeadDayRef.value = day.date
              : dragOverHeadDayRef.value = ''
          }
        },
        onDragleave: (e) => {
          if (props.dragLeaveFunc !== undefined && typeof props.dragLeaveFunc === 'function') {
            props.dragLeaveFunc(e, 'head-day', scope) === true
              ? dragOverHeadDayRef.value = day.date
              : dragOverHeadDayRef.value = ''
          }
        },
        onDrop: (e) => {
          if (props.dropFunc !== undefined && typeof props.dropFunc === 'function') {
            props.dropFunc(e, 'head-day', scope) === true
              ? dragOverHeadDayRef.value = day.date
              : dragOverHeadDayRef.value = ''
          }
        },
        onFocus: (e) => {
          if (isFocusable === true) {
            focusRef.value = day.date
          }
        },
        ...getDefaultMouseEventHandlers('-head-day', event => {
          return { scope, event }
        })
      }

      return h('div', data, [
        // head-day slot replaces everything below it
        headDaySlot !== undefined && headDaySlot({ scope }),
        headDaySlot === undefined && __renderDateHeader(day),
        headDaySlot === undefined && headDateSlot && headDateSlot({ scope }),
        useFocusHelper()
      ])
    }

    function __renderDateHeader (day) {
      if (props.dateHeader === 'stacked') {
        return [
          props.noDefaultHeaderText !== true && __renderHeadWeekday(day),
          props.noDefaultHeaderBtn !== true && __renderHeadDayDate(day)
        ]
      }
      else if (props.dateHeader === 'inline') {
        if (props.weekdayAlign === 'left' && props.dateAlign === 'right') {
          return h('div', {
            class: 'q-calendar__header--inline'
          }, [
            props.noDefaultHeaderText !== true && __renderHeadWeekday(day),
            props.noDefaultHeaderBtn !== true && __renderHeadDayDate(day)
          ])
        }
        else if (props.weekdayAlign === 'right' && props.dateAlign === 'left') {
          return h('div', {
            class: 'q-calendar__header--inline'
          }, [
            props.noDefaultHeaderText !== true && __renderHeadWeekday(day),
            props.noDefaultHeaderBtn !== true && __renderHeadDayDate(day)
          ])
        }
        else {
          return h('div', {
            class: 'q-calendar__header--inline'
          }, [
            props.noDefaultHeaderText !== true && __renderHeadWeekday(day),
            props.noDefaultHeaderBtn !== true && __renderHeadDayDate(day)
          ])
        }
      }
      else if (props.dateHeader === 'inverted') {
        if (props.weekdayAlign === 'left' && props.dateAlign === 'right') {
          return h('div', {
            class: 'q-calendar__header--inline'
          }, [
            props.noDefaultHeaderBtn !== true && __renderHeadDayDate(day),
            props.noDefaultHeaderText !== true && __renderHeadWeekday(day)
          ])
        }
        else if (props.weekdayAlign === 'right' && props.dateAlign === 'left') {
          return h('div', {
            class: 'q-calendar__header--inline'
          }, [
            props.noDefaultHeaderBtn !== true && __renderHeadDayDate(day),
            props.noDefaultHeaderText !== true && __renderHeadWeekday(day)
          ])
        }
        else {
          return h('div', {
            class: 'q-calendar__header--inline'
          }, [
            props.noDefaultHeaderBtn !== true && __renderHeadDayDate(day),
            props.noDefaultHeaderText !== true && __renderHeadWeekday(day)
          ])
        }
      }
    }

    function __renderHeadDayEvent (day, columnIndex) {
      const headDayEventSlot = slots[ 'head-day-event' ]
      const activeDate = props.noActiveDate !== true && __isActiveDate(day)

      const scope = getScopeForSlot(day, columnIndex)
      scope.activeDate = activeDate
      scope.disabled = (props.disabledWeekdays ? props.disabledWeekdays.includes(day.weekday) : false)

      const width = isSticky.value === true ? props.cellWidth : computedWidth.value
      const style = {
        width,
        maxWidth: width
      }
      if (isSticky.value === true) {
        style.minWidth = width
      }

      return h('div', {
        key: 'event-' + day.date + (columnIndex !== undefined ? '-' + columnIndex : ''),
        class: {
          'q-calendar-agenda__head--day__event': true,
          ...getRelativeClasses(day),
          'q-active-date': activeDate
        },
        style
      }, [
        headDayEventSlot && headDayEventSlot({ scope })
      ])
    }

    function __renderHeadWeekday (day) {
      const slot = slots[ 'head-weekday-label' ]
      const scope = getScopeForSlot(day)
      scope.shortWeekdayLabel = props.shortWeekdayLabel

      const data = {
        class: {
          'q-calendar-agenda__head--weekday': true,
          [ 'q-calendar__' + props.weekdayAlign ]: true,
          'q-calendar__ellipsis': true
        }
      }

      return h('div', data, (slot && slot({ scope })) || __renderHeadWeekdayLabel(day, props.shortWeekdayLabel))
    }

    function __renderHeadWeekdayLabel (day, shortWeekdayLabel) {
      const weekdayLabel = weekdayFormatter.value(day, shortWeekdayLabel || (props.weekdayBreakpoints[ 0 ] > 0 && parsedCellWidth.value <= props.weekdayBreakpoints[ 0 ]))
      return h('span', {
        class: 'q-calendar__ellipsis'
      }, props.weekdayBreakpoints[ 1 ] > 0 && parsedCellWidth.value <= props.weekdayBreakpoints[ 1 ] ? minCharWidth(weekdayLabel, props.minWeekdayLabel) : weekdayLabel)
    }

    function __renderHeadDayDate (day) {
      const data = {
        class: {
          'q-calendar-agenda__head--date': true,
          [ 'q-calendar__' + props.dateAlign ]: true
        }
      }

      return h('div', data, __renderHeadDayBtn(day))
    }

    function __renderHeadDayBtn (day) {
      const activeDate = props.noActiveDate !== true && __isActiveDate(day)
      const dayLabel = dayFormatter.value(day, false)
      const headDayLabelSlot = slots[ 'head-day-label' ]
      const headDayButtonSlot = slots[ 'head-day-button' ]

      const scope = {
        dayLabel,
        timestamp: day,
        activeDate,
        disabled: (props.disabledWeekdays ? props.disabledWeekdays.includes(day.weekday) : false)
      }

      const data = {
        class: {
          'q-calendar-agenda__head--day__label': true,
          'q-calendar__button': true,
          'q-calendar__button--round': props.dateType === 'round',
          'q-calendar__button--rounded': props.dateType === 'rounded',
          'q-calendar__button--bordered': day.current === true,
          'q-calendar__focusable': true
        },
        disabled: day.disabled,
        onKeydown: (e) => {
          if (day.disabled !== true
            && isKeyCode(e, [ 13, 32 ])) {
            e.stopPropagation()
            e.preventDefault()
          }
        },
        onKeyup: (e) => {
          // allow selection of date via Enter or Space keys
          if (day.disabled !== true
            && isKeyCode(e, [ 13, 32 ])) {
            emittedValue.value = day.date
            if (emitListeners.value.onClickDate !== undefined) {
              // eslint-disable-next-line vue/require-explicit-emits
              emit('click-date', { scope })
            }
          }
        },
        ...getDefaultMouseEventHandlers('-date', (event, eventName) => {
          if (eventName === 'click-date' || eventName === 'contextmenu-date') {
            emittedValue.value = day.date
            if (eventName === 'click-date') {
              event.preventDefault()
            }
          }
          return { scope, event }
        })
      }

      if (props.noAria !== true) {
        data.ariaLabel = ariaDateFormatter.value(day)
      }

      return headDayButtonSlot
        ? headDayButtonSlot({ scope })
        : useButton(props, data, headDayLabelSlot ? headDayLabelSlot({ scope }) : dayLabel)
    }

    function __renderBody () {
      return h('div', {
        class: 'q-calendar-agenda__body'
      }, [
        __renderScrollArea()
      ])
    }

    function __renderScrollArea () {
      if (isSticky.value === true) {
        return h('div', {
          ref: scrollArea,
          class: {
            'q-calendar-agenda__scroll-area': true,
            'q-calendar__scroll': true
          }
        }, [
          __renderDayContainer()
        ])
      }
      else if (props.noScroll === true) {
        return __renderPane()
      }
      else {
        return h('div', {
          ref: scrollArea,
          class: {
            'q-calendar-agenda__scroll-area': true,
            'q-calendar__scroll': true
          }
        }, [
          __renderPane()
        ])
      }
    }

    function __renderPane () {
      return h('div', {
        ref: pane,
        class: 'q-calendar-agenda__pane'
      }, [
        __renderDayContainer()
      ])
    }

    function __renderDayContainer () {
      const slot = slots[ 'day-container' ]

      return h('div', {
        class: 'q-calendar-agenda__day-container'
      }, [
        isSticky.value === true && props.noHeader !== true && __renderHead(),
        h('div', {
          style: {
            display: 'flex',
            flexDirection: 'row',
            height: '100%'
          }
        }, [
          ...__renderDays()
        ]),
        slot && slot({ scope: { days: days.value } })
      ])
    }

    function __renderDays () {
      if (days.value.length === 1 && parseInt(props.columnCount, 10) > 0) {
        return [
          isLeftColumnOptionsValid.value === true && props.leftColumnOptions.map((column, index) => __renderColumn(column, index)),
          Array.apply(null, new Array(parseInt(props.columnCount, 10)))
            .map((_, i) => i + parseInt(props.columnIndexStart, 10))
            .map(i => __renderDay(days.value[ 0 ], 0, i)),
          isRightColumnOptionsValid.value === true && props.rightColumnOptions.map((column, index) => __renderColumn(column, index))
        ]
      }
      else {
        return [
          isLeftColumnOptionsValid.value === true && props.leftColumnOptions.map((column, index) => __renderColumn(column, index)),
          days.value.map((day, index) => __renderDay(day, index)),
          isRightColumnOptionsValid.value === true && props.rightColumnOptions.map((column, index) => __renderColumn(column, index))
        ]
      }
    }

    function __renderColumn (column, index) {
      const slot = slots.column
      const scope = { column, days: days.value, index }
      const width = isSticky.value === true ? props.cellWidth : computedWidth.value
      const isFocusable = props.focusable === true && props.focusType.includes('day')
      const id = (props.columnOptionsId !== undefined ? column[ props.columnOptionsId ] : undefined)

      return h('div', {
        key: id,
        tabindex: isFocusable === true ? 0 : -1,
        class: {
          'q-calendar-agenda__day': true,
          'q-column-day': true,
          'q-calendar__hoverable': props.hoverable === true,
          'q-calendar__focusable': isFocusable === true
        },
        style: {
          maxWidth: width,
          width
        },
        onDragenter: (e) => {
          if (props.dragEnterFunc !== undefined && typeof props.dragEnterFunc === 'function') {
            props.dragEnterFunc(e, 'column', scope) === true
              ? dragOverHeadDayRef.value = id
              : dragOverHeadDayRef.value = ''
          }
        },
        onDragover: (e) => {
          if (props.dragOverFunc !== undefined && typeof props.dragOverFunc === 'function') {
            props.dragOverFunc(e, 'column', scope) === true
              ? dragOverHeadDayRef.value = id
              : dragOverHeadDayRef.value = ''
          }
        },
        onDragleave: (e) => {
          if (props.dragLeaveFunc !== undefined && typeof props.dragLeaveFunc === 'function') {
            props.dragLeaveFunc(e, 'column', scope) === true
              ? dragOverHeadDayRef.value = id
              : dragOverHeadDayRef.value = ''
          }
        },
        onDrop: (e) => {
          if (props.dropFunc !== undefined && typeof props.dropFunc === 'function') {
            props.dropFunc(e, 'column', scope) === true
              ? dragOverHeadDayRef.value = id
              : dragOverHeadDayRef.value = ''
          }
        },
        ...getDefaultMouseEventHandlers('-column', (event, eventName) => {
          return { scope, event }
        })
      }, [
        slot && slot({ scope })
      ])
    }

    function __renderDay (day, dayIndex, columnIndex) {
      const slot = slots.day
      const scope = getScopeForSlot(day, columnIndex)
      const width = isSticky.value === true ? props.cellWidth : computedWidth.value
      const style = {
        width,
        maxWidth: width
      }
      if (isSticky.value === true) {
        style.minWidth = width
      }
      style.height = parseInt(props.dayHeight, 10) > 0 ? convertToUnit(parseInt(props.dayHeight, 10)) : 'auto'
      if (parseInt(props.dayMinHeight, 10) > 0) {
        style.minHeight = convertToUnit(parseInt(props.dayMinHeight, 10))
      }

      return h('div', {
        key: day.date + (columnIndex !== undefined ? ':' + columnIndex : ''),
        class: {
          'q-calendar-agenda__day': true,
          ...getRelativeClasses(day)
        },
        style
      }, [
        slot && slot({ scope })
      ])
    }

    function __renderAgenda () {
      const { start, end, maxDays } = renderValues.value
      if (startDate.value !== start.date || endDate.value !== end.date || maxDaysRendered.value !== maxDays) {
        startDate.value = start.date
        endDate.value = end.date
        maxDaysRendered.value = maxDays 
      }

      const hasWidth = size.width > 0

      const agenda = withDirectives(h('div', {
        class: 'q-calendar-agenda',
        key: startDate.value
      }, [
        hasWidth === true && isSticky.value !== true && props.noHeader !== true && __renderHead(),
        hasWidth === true && __renderBody()
      ]), [[
        ResizeObserver,
        __onResize
      ]])

      if (props.animated === true) {
        const transition = 'q-calendar--' + (direction.value === 'prev' ? props.transitionPrev : props.transitionNext)
        return h(Transition, {
          name: transition,
          appear: true
        }, () => agenda)
      }

      return agenda
    }

    // expose public methods
    expose({
      prev,
      next,
      move,
      moveToToday,
      updateCurrent,
    })

    // Object.assign(vm.proxy, {
    //   prev,
    //   next,
    //   move,
    //   moveToToday,
    //   updateCurrent,
    // })

    return () => __renderCalendar()
  }
})

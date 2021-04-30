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
  getDateTime,
  getDayIdentifier,
  getDayTimeIdentifier,
  isBetweenDates,
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
import useInterval, { useIntervalProps } from '../composables/useInterval.js'
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
  name: 'QCalendarDay',

  directives: [ResizeObserver],

  props: {
    ...useCommonProps,
    ...useIntervalProps,
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
    ...getRawMouseEvents('-interval'),
    ...getRawMouseEvents('-head-intervals'),
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
      // intervalsHeadRef = ref(null),
      // intervalsRef = ref({}),
      direction = ref('next'),
      startDate = ref(today()),
      endDate = ref('0000-00-00'),
      maxDaysRendered = ref(0),
      emittedValue = ref(props.modelValue),
      size = reactive({ width: 0, height: 0 }),
      dragOverHeadDayRef = ref(false),
      dragOverInterval = ref(false),
      // keep track of last seen start and end dates
      lastStart = ref(null),
      lastEnd = ref(null)

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
      console.log('isSticky', isSticky.value)
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

    const canChangeDate = computed(() => {
      if (maxDaysRendered.value === 0) return true
      if (endDate.value === '0000-00-00') return true
      if (days.value === undefined || days.value.length === 0) return true
      const start = days.value[ 0 ]
      const end = days.value[ days.value.length - 1 ]
      return isBetweenDates(parsedValue.value, start, end) !== true
    })

    const { renderValues } = useRenderValues(props, {
      parsedView,
      times,
      parsedValue
    })

    const {
      rootRef,
      scrollWidth,
      __initCalendar,
      __renderCalendar
    } = useCalendar(props, __renderDaily, {
      scrollArea,
      pane
    })

    const {
      // computed
      days,
      intervals,
      intervalFormatter,
      ariaDateTimeFormatter,
      parsedCellWidth,
      // methods
      getIntervalClasses,
      showIntervalLabelDefault,
      styleDefault,
      getTimestampAtEventInterval,
      getTimestampAtEvent,
      getScopeForSlot,
      scrollToTime,
      timeDurationHeight,
      timeStartPos
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
      if (props.view === 'day' && parseInt(props.columnCount, 10) > 0) {
        return parseInt(props.columnCount, 10)
      }
      else if (props.view === 'day' && props.maxDays && props.maxDays > 1) {
        return props.maxDays
      }
      return days.value.length
    })

    const intervalsWidth = computed(() => {
      if (rootRef.value) {
        return parseInt(getComputedStyle(rootRef.value).getPropertyValue('--calendar-intervals-width'), 10)
      }
      return 0
    })

    const borderWidth = computed(() => {
      if (rootRef.value) {
        const calendarBorderWidth = getComputedStyle(rootRef.value).getPropertyValue('--calendar-border')
        const parts = calendarBorderWidth.split(' ')
        const part = parts.filter(part => part.indexOf('px') > -1)
        return parseInt(part[ 0 ], 0)
      }
      return 0
    })

    const computedWidth = computed(() => {
      if (rootRef.value) {
        const width = size.width || rootRef.value.getBoundingClientRect().width
        if (width && intervalsWidth.value && parsedColumnCount.value) {
          return (
            (width - scrollWidth.value - intervalsWidth.value) / parsedColumnCount.value
          ) + 'px'
        }
      }
      return (100 / parsedColumnCount.value) + '%'
    })

    watch([days], checkChange, { deep: true, immediate: true })

    watch(() => props.modelValue, (val, oldVal) => {
      if (emittedValue.value !== props.modelValue) {
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
        // then assume list of days is changing
        tryFocus()
      }
    })

    watch(() => props.maxDays, val => {
      maxDaysRendered.value = val
    })

    onBeforeUpdate(() => {
      datesRef.value = {}
      headDayEventsParentRef.value = {}
      headDayEventsChildRef.value = {}
      // intervalsRef.value = {}
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

    // function __isActiveInterval (day) {
    //   return __isActiveDate(day)
    //     && day.hasTime
    //     && emittedValue.value.hasTime
    //     && day.time === emittedValue.value.time
    // }

    // Render functions

    function __renderHead () {
      return h('div', {
        roll: 'presentation',
        class: {
          'q-calendar-day__head': true,
          'q-calendar__sticky': isSticky.value === true
        },
        style: {
          marginRight: scrollWidth.value + 'px'
        }
      }, [
        __renderHeadIntervals(),
        __renderHeadDaysColumn()
      ])
    }

    /**
     * Outputs the header that is above the intervals
     * @slot head-intervals
     * @mouse '-head-intervals'
     * @scope { scope: { days: days.value }, event }
     */
    function __renderHeadIntervals () {
      const slot = slots[ 'head-intervals' ]

      return h('div', {
        class: {
          'q-calendar-day__head--intervals': true,
          'q-calendar__sticky': isSticky.value === true
        },
        ...getDefaultMouseEventHandlers('-head-intervals', event => {
          return { scope: { days: days.value }, event }
        })
      }, [
        slot && slot({ scope: { days: days.value } })
      ])
    }

    function __renderHeadDaysColumn () {
      return h('div', {
        ref: headerColumnRef,
        class: {
          'q-calendar-day__head--days__column': true
        }
      }, [
        __renderHeadDaysRow(),
        __renderHeadDaysEventsRow()
      ])
    }

    function __renderHeadDaysRow () {
      return h('div', {
        class: {
          'q-calendar-day__head--days__weekdays': true
        }
      }, [
        ...__renderHeadDays()
      ])
    }

    function __renderHeadDaysEventsRow () {
      const slot = slots[ 'head-days-events' ]

      nextTick(() => {
        if (headDayEventsChildRef.value && parseInt(props.columnCount, 10) === 0 && window) {
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
          'q-calendar-day__head--days__event': true
        }
      }, [
        slot && h('div', {
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
        return Array.apply(null, new Array(parseInt(props.columnCount, 10)))
          .map((_, i) => i + parseInt(props.columnIndexStart, 10))
          .map(columnIndex => __renderHeadDay(days.value[ 0 ], columnIndex))
      }
      else {
        return days.value.map(day => __renderHeadDay(day))
      }
    }

    function __renderHeadDaysEvents () {
      if (days.value.length === 1 && parseInt(props.columnCount, 10) > 0) {
        return Array.apply(null, new Array(parseInt(props.columnCount, 10)))
          .map((_, i) => i + parseInt(props.columnIndexStart, 10))
          .map(columnIndex => __renderHeadDayEvent(days.value[ 0 ], columnIndex))
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

      const width = isSticky.value === true ? props.cellWidth : computedWidth.value
      const styler = props.weekdayStyle || dayStyleDefault
      const style = {
        width,
        maxWidth: width,
        minWidth: width,
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
          'q-calendar-day__head--day': true,
          ...weekdayClass,
          ...getRelativeClasses(day),
          'q-active-date': activeDate,
          'q-calendar__hoverable': props.hoverable === true,
          'q-calendar__focusable': isFocusable === true
        },
        style,
        onDragenter: (e) => {
          if (props.dragEnterFunc !== undefined && typeof props.dragEnterFunc === 'function') {
            props.dragEnterFunc(e, 'head-day', scope)
              ? dragOverHeadDayRef.value = day.date
              : dragOverHeadDayRef.value = ''
          }
        },
        onDragover: (e) => {
          if (props.dragOverFunc !== undefined && typeof props.dragOverFunc === 'function') {
            props.dragOverFunc(e, 'head-day', scope)
              ? dragOverHeadDayRef.value = day.date
              : dragOverHeadDayRef.value = ''
          }
        },
        onDragleave: (e) => {
          if (props.dragLeaveFunc !== undefined && typeof props.dragLeaveFunc === 'function') {
            props.dragLeaveFunc(e, 'head-day', scope)
              ? dragOverHeadDayRef.value = day.date
              : dragOverHeadDayRef.value = ''
          }
        },
        onDrop: (e) => {
          if (props.dropFunc !== undefined && typeof props.dropFunc === 'function') {
            props.dropFunc(e, 'head-day', scope)
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
        headDaySlot === undefined && __renderColumnHeaderBefore(day, columnIndex),
        headDaySlot === undefined && __renderDateHeader(day),
        headDaySlot === undefined && headDateSlot && headDateSlot({ scope }),
        headDaySlot === undefined && __renderColumnHeaderAfter(day, columnIndex),
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
      const width = isSticky.value === true ? props.cellWidth : computedWidth.value
      const style = {
        width,
        maxWidth: width,
        minWidth: width
      }
      if (isSticky.value === true) {
        style.minWidth = width
      }

      return h('div', {
        key: 'event-' + day.date + (columnIndex !== undefined ? '-' + columnIndex : ''),
        class: {
          'q-calendar-day__head--day__event': true,
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
          'q-calendar-day__head--weekday': true,
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
          'q-calendar-day__head--date': true,
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
      const scope = { dayLabel, timestamp: day, activeDate }

      const data = {
        class: {
          'q-calendar-day__head--day__label': true,
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

    function __renderColumnHeaderBefore (day, columnIndex) {
      const slot = slots[ 'column-header-before' ]
      if (slot) {
        const scope = { timestamp: day, columnIndex }
        return h('div', {
          class: 'q-calendar-day__column-header--before'
        }, [
          slot({ scope })
        ])
      }
    }

    function __renderColumnHeaderAfter (day, columnIndex) {
      const slot = slots[ 'column-header-after' ]
      if (slot) {
        const scope = { timestamp: day, columnIndex }
        return h('div', {
          class: 'q-calendar-day__column-header--after'
        }, [
          slot({ scope })
        ])
      }
    }

    function __renderBody () {
      return h('div', {
        class: 'q-calendar-day__body'
      }, [
        __renderScrollArea()
      ])
    }

    function __renderScrollArea () {
      if (isSticky.value === true) {
        return h('div', {
          ref: scrollArea,
          class: {
            'q-calendar-day__scroll-area': true,
            'q-calendar__scroll': true
          }
        }, [
          isSticky.value !== true && __renderBodyIntervals(),
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
            'q-calendar-day__scroll-area': true,
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
        class: 'q-calendar-day__pane'
      }, [
        __renderBodyIntervals(),
        __renderDayContainer()
      ])
    }

    function __renderDayContainer () {
      const slot = slots[ 'day-container' ]

      return h('div', {
        class: 'q-calendar-day__day-container'
      }, [
        isSticky.value === true && props.noHeader !== true && __renderHead(),
        h('div', {
          style: {
            display: 'flex',
            flexDirection: 'row'
          }
        }, [
          isSticky.value === true && __renderBodyIntervals(),
          ...__renderDays()
        ]),
        slot && slot({ scope: { days: days.value } })
      ])
    }

    function __renderDays () {
      if (days.value.length === 1 && parseInt(props.columnCount, 10) > 0) {
        return Array.apply(null, new Array(parseInt(props.columnCount, 10)))
          .map((_, i) => i + parseInt(props.columnIndexStart, 10))
          .map(i => __renderDay(days.value[ 0 ], 0, i))
      }
      else {
        return days.value.map((day, index) => __renderDay(day, index))
      }
    }

    function __renderDay (day, dayIndex, columnIndex) {
      const slot = slots[ 'day-body' ]
      const scope = getScopeForSlot(day, columnIndex)
      const width = isSticky.value === true ? props.cellWidth : computedWidth.value
      const style = {
        width,
        maxWidth: width,
        minWidth: width
      }
      if (isSticky.value === true) {
        style.minWidth = width
      }

      return h('div', {
        key: day.date + (columnIndex !== undefined ? ':' + columnIndex : ''),
        class: {
          'q-calendar-day__day': true,
          ...getRelativeClasses(day)
        },
        style
      }, [
        ...__renderDayIntervals(dayIndex, columnIndex),
        slot && slot({ scope })
      ])
    }

    function __renderDayIntervals (index, columnIndex) {
      return intervals.value[ index ].map((interval) => __renderDayInterval(interval, columnIndex))
    }

    function __renderDayInterval (interval, columnIndex) {
      // const activeInterval = __isActiveInterval(interval)
      const height = convertToUnit(props.intervalHeight)
      const styler = props.intervalStyle || styleDefault
      const slotDayInterval = slots[ 'day-interval' ]

      const scope = getScopeForSlot(interval, columnIndex)
      scope.droppable = dragOverInterval.value === getDayTimeIdentifier(interval)

      const intervalClass = typeof props.intervalClass === 'function' ? props.intervalClass({ scope }) : {}
      const isFocusable = props.focusable === true && props.focusType.includes('interval')
      const dateTime = getDateTime(interval)

      const data = {
        key: dateTime,
        // ref: (el) => { intervalsRef.value[ dateTime ] = el },
        tabindex: isFocusable === true ? 0 : -1,
        class: {
          'q-calendar-day__day-interval': interval.minute === 0,
          'q-calendar-day__day-interval--section': interval.minute !== 0,
          ...intervalClass,
          ...getIntervalClasses(interval, props.selectedDates, props.selectedStartEndDates),
          'q-calendar__hoverable': props.hoverable === true,
          'q-calendar__focusable': isFocusable === true
        },
        style: {
          height,
          ...styler({ scope })
        },
        onDragenter: (e) => {
          if (props.dragEnterFunc !== undefined && typeof props.dragEnterFunc === 'function') {
            props.dragEnterFunc(e, 'interval', scope)
              ? dragOverInterval.value = getDayTimeIdentifier(interval)
              : dragOverInterval.value = ''
          }
        },
        onDragover: (e) => {
          if (props.dragOverFunc !== undefined && typeof props.dragOverFunc === 'function') {
            props.dragOverFunc(e, 'interval', scope)
              ? dragOverInterval.value = getDayTimeIdentifier(interval)
              : dragOverInterval.value = ''
          }
        },
        onDragleave: (e) => {
          if (props.dragLeaveFunc !== undefined && typeof props.dragLeaveFunc === 'function') {
            props.dragLeaveFunc(e, 'interval', scope)
              ? dragOverInterval.value = getDayTimeIdentifier(interval)
              : dragOverInterval.value = ''
          }
        },
        onDrop: (e) => {
          if (props.dropFunc !== undefined && typeof props.dropFunc === 'function') {
            props.dropFunc(e, 'interval', scope)
              ? dragOverInterval.value = getDayTimeIdentifier(interval)
              : dragOverInterval.value = ''
          }
        },
        onKeydown: (event) => {
          if (isKeyCode(event, [ 13, 32 ])) {
            event.stopPropagation()
            event.preventDefault()
          }
        },
        onKeyup: (event) => {
          // allow selection of date via Enter or Space keys
          if (isKeyCode(event, [ 13, 32 ])) {
            const scope = getScopeForSlot(interval, columnIndex)
            emittedValue.value = scope.timestamp.date
            if (emitListeners.value.onClickTime !== undefined) {
              // eslint-disable-next-line vue/require-explicit-emits
              emit('click-time', { scope, event })
            }
          }
        },
        ...getDefaultMouseEventHandlers('-time', event => {
          const scope = getScopeForSlot(getTimestampAtEventInterval(event, interval, props.timeClicksClamped, times.now), columnIndex)
          return { scope, event }
        })
      }

      if (props.noAria !== true) {
        data.ariaLabel = ariaDateTimeFormatter.value(interval)
      }

      const children = slotDayInterval ? slotDayInterval({ scope }) : undefined

      return h('div', data, [ children, useFocusHelper() ])
    }

    function __renderBodyIntervals () {
      const data = {
        ariaHidden: 'true',
        class: {
          'q-calendar-day__intervals-column': true,
          'q-calendar__ellipsis': true,
          'q-calendar__sticky': isSticky.value === true
        },
        ...getDefaultMouseEventHandlers('-interval', event => {
          const timestamp = getTimestampAtEvent(event, parsedStart.value, props.timeClicksClamped, times.now)
          return { scope: { timestamp }, event }
        })
      }

      return h('div', data, __renderIntervalLabels())
    }

    function __renderIntervalLabels () {
      return intervals.value[ 0 ].map((interval) => __renderIntervalLabel(interval))
    }

    function __renderIntervalLabel (interval) {
      const slotIntervalLabel = slots[ 'interval-label' ]
      const height = convertToUnit(props.intervalHeight)
      const short = props.shortIntervalLabel
      const shower = props.showIntervalLabel || showIntervalLabelDefault
      const show = shower(interval)
      const label = show ? intervalFormatter.value(interval, short) : undefined

      return h('div', {
        key: interval.time,
        class: 'q-calendar-day__interval',
        style: {
          height
        }
      }, [
        h('div', {
          class: 'q-calendar-day__interval--text q-calendar__overflow-wrap'
        }, [
          slotIntervalLabel ? slotIntervalLabel({ scope: { timestamp: interval, label } }) : label
        ])
      ])
    }

    function __renderDaily () {
      if (canChangeDate.value) {
        const { start, end, maxDays } = renderValues.value
        startDate.value = start.date
        endDate.value = end.date
        maxDaysRendered.value = maxDays
      }

      const hasWidth = size.width > 0

      const daily = withDirectives(h('div', {
        key: startDate.value,
        class: 'q-calendar-day'
      }, [
        hasWidth === true && isSticky.value !== true && props.noHeader !== true && __renderHead(),
        hasWidth && __renderBody()
      ]), [[
        ResizeObserver,
        __onResize
      ]])

      if (props.animated === true) {
        const transition = 'q-calendar--' + (direction.value === 'prev' ? props.transitionPrev : props.transitionNext)
        return h(Transition, {
          name: transition,
          appear: true
        }, () => daily)
      }

      return daily
    }

    // expose public methods
    expose({
      prev,
      next,
      move,
      moveToToday,
      updateCurrent,
      timeStartPos,
      timeDurationHeight,
      scrollToTime
    })

    // Object.assign(vm.proxy, {
    //   prev,
    //   next,
    //   move,
    //   moveToToday,
    //   updateCurrent,
    //   timeStartPos,
    //   timeDurationHeight,
    //   scrollToTime
    // })

    return () => __renderCalendar()
  }
})

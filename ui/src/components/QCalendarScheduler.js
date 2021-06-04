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
import useInterval, { useSchedulerProps } from '../composables/useInterval.js'
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
  name: 'QCalendarScheduler',

  directives: [ResizeObserver],

  props: {
    ...useCommonProps,
    ...useSchedulerProps,
    ...useColumnProps,
    ...useMaxDaysProps,
    ...useTimesProps,
    ...useCellWidthProps,
    ...useNavigationProps
  },

  emits: [
    'update:model-value',
    'update:model-resources',
    'resource-expanded',
    ...useCheckChangeEmits,
    ...useMoveEmits,
    ...getRawMouseEvents('-date'),
    ...getRawMouseEvents('-day-resource'),
    ...getRawMouseEvents('-head-resources'),
    ...getRawMouseEvents('-head-day'),
    ...getRawMouseEvents('-resource')
  ],

  setup (props, { slots, emit, expose }) {
    const
      scrollArea = ref(null),
      pane = ref(null),
      headerColumnRef = ref(null),
      focusRef = ref(null),
      focusValue = ref(null),
      datesRef = ref({}),
      resourcesRef = ref({}),
      headDayEventsParentRef = ref({}),
      headDayEventsChildRef = ref({}),
      // resourceFocusRef = ref(null),
      // resourceFocusValue = ref(null),
      // resourcesHeadRef = ref(null),
      direction = ref('next'),
      startDate = ref(props.modelValue || today()),
      endDate = ref('0000-00-00'),
      maxDaysRendered = ref(0),
      emittedValue = ref(props.modelValue),
      size = reactive({ width: 0, height: 0 }),
      dragOverHeadDayRef = ref(false),
      dragOverResource = ref(false),
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
    } = useCalendar(props, __renderScheduler, {
      scrollArea,
      pane
    })

    const {
      // computed
      days,
      // intervals,
      // intervalFormatter,
      // ariaDateTimeFormatter,
      parsedCellWidth,
      // methods
      // getResourceClasses,
      // showResourceLabelDefault,
      styleDefault,
      // getTimestampAtEventInterval,
      // getTimestampAtEvent,
      // getScopeForSlot
      // scrollToTime,
      // timeDurationHeight,
      // timeStartPos
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
      if (props.view === 'day' && parseInt(props.columnCount, 10) > 1) {
        return parseInt(props.columnCount, 10)
      }
      else if (props.view === 'day' && props.maxDays && props.maxDays > 1) {
        return props.maxDays
      }
      return days.value.length
    })

    const resourcesWidth = computed(() => {
      if (rootRef.value) {
        return parseInt(getComputedStyle(rootRef.value).getPropertyValue('--calendar-resources-width'), 10)
      }
      return 0
    })

    const parsedResourceHeight = computed(() => {
      const height = parseInt(props.resourceHeight, 10)
      if (height === 0) {
        return 'auto'
      }
      return height
    })

    const parsedResourceMinHeight = computed(() => {
      return parseInt(props.resourceMinHeight, 10)
    })

    const computedWidth = computed(() => {
      if (rootRef.value) {
        const width = size.width || rootRef.value.getBoundingClientRect().width
        if (width && resourcesWidth.value && parsedColumnCount.value) {
          return (
            (width - scrollWidth.value - resourcesWidth.value) / parsedColumnCount.value
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
      resourcesRef.value = {}
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

    // function __isActiveResource (day) {
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
          'q-calendar-scheduler__head': true,
          'q-calendar__sticky': isSticky.value === true
        },
        style: {
          marginRight: scrollWidth.value + 'px'
        }
      }, [
        __renderHeadResources(),
        __renderHeadDaysColumn()
      ])
    }

    /*
     * Outputs the header that is above the resources
     */
    function __renderHeadResources () {
      const slot = slots[ 'head-resources' ]

      const scope = {
        days: days.value,
        date: props.modelValue,
        resources: props.modelResources
      }

      return h('div', {
        class: {
          'q-calendar-scheduler__head--resources': true,
          'q-calendar__sticky': isSticky.value === true
        },
        ...getDefaultMouseEventHandlers('-head-resources', event => {
          return { scope, event }
        })
      }, [
        slot && slot({ scope })
      ])
    }

    function __renderHeadDaysColumn () {
      return h('div', {
        ref: headerColumnRef,
        class: {
          'q-calendar-scheduler__head--days__column': true
        }
      }, [
        __renderHeadDaysRow(),
        __renderHeadDaysEventsRow()
      ])
    }

    function __renderHeadDaysRow () {
      return h('div', {
        class: {
          'q-calendar-scheduler__head--days__weekdays': true
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
          'q-calendar-scheduler__head--days__event': true
        }
      }, [
        slot && h('div', {
          ref: headDayEventsParentRef,
          // TODO: this needs to be in a class
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

      const scope = {
        timestamp: day,
        activeDate,
        droppable: dragOverHeadDayRef.value === day.date
      }
      if (columnIndex !== undefined) {
        scope.columnIndex = columnIndex
      }

      const width = isSticky.value === true ? convertToUnit(parsedCellWidth.value) : computedWidth.value
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
      const key = day.date + (columnIndex !== undefined ? '-' + columnIndex : '')

      const data = {
        key,
        ref: (el) => { datesRef.value[ key ] = el },
        tabindex: isFocusable === true ? 0 : -1,
        class: {
          'q-calendar-scheduler__head--day': true,
          ...weekdayClass,
          ...getRelativeClasses(day),
          'q-active-date': activeDate,
          'q-calendar__hoverable': props.hoverable === true,
          'q-calendar__focusable': isFocusable === true
        },
        style,
        onFocus: (e) => {
          if (isFocusable === true) {
            focusRef.value = key
          }
        },
        ...getDefaultMouseEventHandlers('-head-day', event => {
          return { scope, event }
        }),
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
        }
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

      const scope = {
        timestamp: day,
        activeDate,
        droppable: dragOverHeadDayRef.value === day.date
      }
      if (columnIndex !== undefined) {
        scope.columnIndex = columnIndex
      }

      const width = isSticky.value === true ? convertToUnit(parsedCellWidth.value) : computedWidth.value
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
          'q-calendar-scheduler__head--day__event': true,
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
      const shortWeekdayLabel = props.shortWeekdayLabel === true
      // const divisor = props.dateHeader === 'inline' || props.dateHeader === 'inverted' ? 0.5 : 1
      // const shortCellWidth = props.weekdayBreakpoints[ 1 ] > 0 && (parsedCellWidth.value * divisor) <= props.weekdayBreakpoints[ 1 ]
      const scope = { timestamp: day, shortWeekdayLabel }

      const data = {
        class: {
          'q-calendar-scheduler__head--weekday': true,
          [ 'q-calendar__' + props.weekdayAlign ]: true,
          'q-calendar__ellipsis': true
        }
      }

      return h('div', data, (slot && slot({ scope })) || __renderHeadWeekdayLabel(day, shortWeekdayLabel))
    }

    function __renderHeadWeekdayLabel (day, shortWeekdayLabel) {
      const weekdayLabel = weekdayFormatter.value(day, shortWeekdayLabel || (props.weekdayBreakpoints[ 0 ] > 0 && parsedCellWidth.value <= props.weekdayBreakpoints[ 0 ]))
      return h('span', {
        class: 'q-calendar-scheduler__head--weekday-label q-calendar__ellipsis'
      }, props.weekdayBreakpoints[ 1 ] > 0 && parsedCellWidth.value <= props.weekdayBreakpoints[ 1 ] ? minCharWidth(weekdayLabel, props.minWeekdayLabel) : weekdayLabel)
    }

    function __renderHeadDayDate (day) {
      const data = {
        class: {
          'q-calendar-scheduler__head--date': true,
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
          'q-calendar-scheduler__head--day__label': true,
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

    function __renderColumnHeaderBefore (day, columnIndex) {
      const slot = slots[ 'column-header-before' ]
      if (slot) {
        const scope = { timestamp: day, columnIndex }
        return h('div', {
          class: 'q-calendar-scheduler__column-header--before'
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
          class: 'q-calendar-scheduler__column-header--after'
        }, [
          slot({ scope })
        ])
      }
    }

    function __renderBody () {
      return h('div', {
        class: 'q-calendar-scheduler__body'
      }, [
        __renderScrollArea()
      ])
    }

    function __renderScrollArea () {
      if (isSticky.value === true) {
        return h('div', {
          ref: scrollArea,
          class: {
            'q-calendar-scheduler__scroll-area': true,
            'q-calendar__scroll': true
          }
        }, [
          isSticky.value !== true && __renderDayResources(),
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
            'q-calendar-scheduler__scroll-area': true,
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
        class: 'q-calendar-scheduler__pane'
      }, [
        __renderDayContainer()
      ])
    }

    function __renderDayContainer () {
      return h('div', {
        class: 'q-calendar-scheduler__day--container'
      }, [
        isSticky.value === true && props.noHeader !== true && __renderHead(),
        __renderResources()
      ])
    }

    function __renderResources (resources = undefined, indentLevel = 0, expanded = true) {
      if (resources === undefined) {
        resources = props.modelResources
      }
      return resources.map((resource, resourceIndex) => {
        return __renderResourceRow(resource, resourceIndex, indentLevel, resource.children !== undefined ? resource.expanded : expanded)
      })
    }

    function __renderResourceRow (resource, resourceIndex, indentLevel = 0, expanded = true) {
      const style = {
      }
      style.height = resource.height !== void 0
        ? convertToUnit(resource.height)
        : parsedResourceHeight.value
          ? convertToUnit(parsedResourceHeight.value)
          : 'auto'
      if (parsedResourceMinHeight.value > 0) {
        style.minHeight = convertToUnit(parsedResourceMinHeight.value)
      }
    
      const resourceRow = h('div', {
        key: resource[ props.resourceKey ] + '-' + resourceIndex,
        class: {
          'q-calendar-scheduler__resource--row': true
        },
        style
      }, [
        __renderResource(resource, resourceIndex, indentLevel, expanded),
        __renderDayResources(resource, resourceIndex, indentLevel, expanded)
      ])

      if (resource.children !== undefined) {
        return [
          resourceRow,
          h('div', {
            class: {
              'q-calendar__child': true,
              'q-calendar__child--expanded': expanded === true,
              'q-calendar__child--collapsed': expanded !== true
            }
          }, [
            __renderResources(resource.children, indentLevel + 1, (expanded === false ? expanded : resource.expanded))
          ])
        ]
      }

      return [resourceRow]
    }

    function __renderResource (resource, resourceIndex, indentLevel = 0, expanded = true) {
      const slotResourceLabel = slots[ 'resource-label' ]

      const style = {
      }
      style.height = resource.height !== void 0
        ? convertToUnit(resource.height)
        : parsedResourceHeight.value
          ? convertToUnit(parsedResourceHeight.value)
          : 'auto'
      if (parseInt(props.resourceMinHeight, 10) > 0) {
        style.minHeight = convertToUnit(parseInt(props.resourceMinHeight, 10))
      }
      const styler = props.resourceStyle || styleDefault
      const label = resource[ props.resourceLabel ]

      const isFocusable = props.focusable === true && props.focusType.includes('resource') && expanded === true
      const scope = {
        resource,
        days: days.value,
        resourceIndex,
        indentLevel,
        label
      }
      const dragValue = resource[ props.resourceKey ]
      scope.droppable = dragOverResource.value === dragValue
      const resourceClass = typeof props.resourceClass === 'function' ? props.resourceClass({ scope }) : {}

      return h('div', {
        key: resource[ props.resourceKey ] + '-' + resourceIndex,
        ref: (el) => { resourcesRef.value[ resource[ props.resourceKey ] ] = el },
        tabindex: isFocusable === true ? 0 : -1,
        class: {
          'q-calendar-scheduler__resource': indentLevel === 0,
          'q-calendar-scheduler__resource--section': indentLevel !== 0,
          ...resourceClass,
          'q-calendar__sticky': isSticky.value === true,
          'q-calendar__hoverable': props.hoverable === true,
          'q-calendar__focusable': isFocusable === true
        },
        style: {
          ...style,
          ...styler({ scope })
        },
        onDragenter: (e) => {
          if (props.dragEnterFunc !== undefined && typeof props.dragEnterFunc === 'function') {
            props.dragEnterFunc(e, 'resource', scope) === true
              ? dragOverResource.value = dragValue
              : dragOverResource.value = ''
          }
        },
        onDragover: (e) => {
          if (props.dragOverFunc !== undefined && typeof props.dragOverFunc === 'function') {
            props.dragOverFunc(e, 'resource', scope) === true
              ? dragOverResource.value = dragValue
              : dragOverResource.value = ''
          }
        },
        onDragleave: (e) => {
          if (props.dragLeaveFunc !== undefined && typeof props.dragLeaveFunc === 'function') {
            props.dragLeaveFunc(e, 'resource', scope) === true
              ? dragOverResource.value = dragValue
              : dragOverResource.value = ''
          }
        },
        onDrop: (e) => {
          if (props.dropFunc !== undefined && typeof props.dropFunc === 'function') {
            props.dropFunc(e, 'resource', scope) === true
              ? dragOverResource.value = dragValue
              : dragOverResource.value = ''
          }
        },
        onKeydown: (event) => {
          if (isKeyCode(event, [ 13, 32 ])) {
            event.stopPropagation()
            event.preventDefault()
          }
        },
        onKeyup: (event) => {
          // allow selection of resource via Enter or Space keys
          if (isKeyCode(event, [ 13, 32 ])) {
            if (emitListeners.value.onClickResource !== undefined) {
              // eslint-disable-next-line vue/require-explicit-emits
              emit('click-resource', { scope, event })
            }
          }
        },
        ...getDefaultMouseEventHandlers('-resource', event => {
          return { scope, event }
        })
      }, [
          [
              h('div', {
                class: {
                  'q-calendar__parent': resource.children !== undefined,
                  'q-calendar__parent--expanded': resource.children !== undefined && resource.expanded === true,
                  'q-calendar__parent--collapsed': resource.children !== undefined && resource.expanded !== true
                },
                onClick: (e) => {
                  e.stopPropagation()
                  resource.expanded = !resource.expanded
                  emit('update:model-resources', props.modelResources)
                  emit('resource-expanded', { expanded: resource.expanded, scope })
                }
              }),
              h('div', {
                class: {
                  'q-calendar-scheduler__resource--text': true,
                  'q-calendar__ellipsis': true
                },
                style: {
                  paddingLeft: (10 * indentLevel + 2) + 'px'
                }
              }, [
                slotResourceLabel ? slotResourceLabel({ scope }) : label
              ]),
              useFocusHelper()
            ]
      ])
    }

    function __renderDayResources (resource, resourceIndex, indentLevel = 0, expanded = true) {
      const slot = slots[ 'resource-days' ]

      const width = isSticky.value === true ? convertToUnit(parsedCellWidth.value) : computedWidth.value

      const scope = {
        resource,
        resourceIndex,
        indentLevel,
        expanded,
        cellWidth: width,
        days: days.value
      }

      const style = {}
      style.height = parseInt(props.resourceHeight, 10) > 0 ? convertToUnit(parseInt(props.resourceHeight, 10)) : 'auto'
      if (parseInt(props.resourceMinHeight, 10) > 0) {
        style.minHeight = convertToUnit(parseInt(props.resourceMinHeight, 10))
      }

      const data = {
        class: 'q-calendar-scheduler__resource--days',
        style
      }

      return h('div', data,
        [
          ...__renderDays(resource, resourceIndex, indentLevel, expanded),
          slot && slot({ scope })
        ])
    }

    function __renderDays (resource, resourceIndex, indentLevel = 0, expanded = true) {
      if (days.value.length === 1 && parseInt(props.columnCount, 10) > 0) {
        return Array.apply(null, new Array(parseInt(props.columnCount, 10)))
          .map((_, i) => i + parseInt(props.columnIndexStart, 10))
          .map(columnIndex => __renderDay(days.value[ 0 ], columnIndex, resource, resourceIndex, indentLevel, expanded))
      }
      else {
        return days.value.map(day => __renderDay(day, undefined, resource, resourceIndex, indentLevel, expanded))
      }
    }

    function __renderDay (day, columnIndex, resource, resourceIndex, indentLevel = 0, expanded = true) {
      const slot = slots.day

      const styler = props.dayStyle || dayStyleDefault
      const activeDate = props.noActiveDate !== true && parsedValue.value.date === day.date
      const dragValue = day.date + ':' + resource[ props.resourceKey ] + (columnIndex !== undefined ? ':' + columnIndex : '')
      const droppable = dragOverResource.value === dragValue
      const scope = { timestamp: day, columnIndex, resource, resourceIndex, indentLevel, activeDate, droppable }

      const width = isSticky.value === true ? convertToUnit(parsedCellWidth.value) : computedWidth.value
      const style = {
        width,
        maxWidth: width,
        ...styler({ scope })
      }
      style.height = parseInt(props.resourceHeight, 10) > 0 ? convertToUnit(parseInt(props.resourceHeight, 10)) : 'auto'
      if (parseInt(props.resourceMinHeight, 10) > 0) {
        style.minHeight = convertToUnit(parseInt(props.resourceMinHeight, 10))
      }
      const dayClass = typeof props.dayClass === 'function' ? props.dayClass({ scope }) : {}
      const isFocusable = props.focusable === true && props.focusType.includes('day') && expanded === true

      return h('div', {
        key: day.date + (columnIndex !== undefined ? ':' + columnIndex : ''),
        tabindex: isFocusable === true ? 0 : -1,
        class: {
          'q-calendar-scheduler__day': indentLevel === 0,
          'q-calendar-scheduler__day--section': indentLevel !== 0,
          ...dayClass,
          ...getRelativeClasses(day),
          'q-calendar__hoverable': props.hoverable === true,
          'q-calendar__focusable': isFocusable === true
        },
        style,
        onDragenter: (e) => {
          if (props.dragEnterFunc !== undefined && typeof props.dragEnterFunc === 'function') {
            props.dragEnterFunc(e, 'day', scope) === true
              ? dragOverResource.value = dragValue
              : dragOverResource.value = ''
          }
        },
        onDragover: (e) => {
          if (props.dragOverFunc !== undefined && typeof props.dragOverFunc === 'function') {
            props.dragOverFunc(e, 'day', scope) === true
              ? dragOverResource.value = dragValue
              : dragOverResource.value = ''
          }
        },
        onDragleave: (e) => {
          if (props.dragLeaveFunc !== undefined && typeof props.dragLeaveFunc === 'function') {
            props.dragLeaveFunc(e, 'day', scope) === true
              ? dragOverResource.value = dragValue
              : dragOverResource.value = ''
          }
        },
        onDrop: (e) => {
          if (props.dropFunc !== undefined && typeof props.dropFunc === 'function') {
            props.dropFunc(e, 'day', scope) === true
              ? dragOverResource.value = dragValue
              : dragOverResource.value = ''
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
            emittedValue.value = scope.timestamp.date
            if (emitListeners.value.onClickResource !== undefined) {
              // eslint-disable-next-line vue/require-explicit-emits
              emit('click-resource', { scope, event })
            }
          }
        },
        ...getDefaultMouseEventHandlers('-day-resource', event => {
          return { scope, event }
        })

      }, [
        slot && slot({ scope }),
        useFocusHelper()
      ])
    }

    function __renderResourcesError () {
      return h('div', {}, 'No resources have been defined')
    }

    function __renderScheduler () {
      if (canChangeDate.value) {
        const { start, end, maxDays } = renderValues.value
        startDate.value = start.date
        endDate.value = end.date
        maxDaysRendered.value = maxDays
      }

      const hasWidth = size.width > 0
      const hasResources = props.modelResources && props.modelResources.length > 0

      const scheduler = withDirectives(h('div', {
        key: startDate.value,
        class: 'q-calendar-scheduler'
      }, [
        hasWidth === true && hasResources === true && isSticky.value !== true && props.noHeader !== true && __renderHead(),
        hasWidth === true && hasResources === true && __renderBody(),
        hasResources === false && __renderResourcesError()
      ]), [[
        ResizeObserver,
        __onResize
      ]])

      if (props.animated === true) {
        const transition = 'q-calendar--' + (direction.value === 'prev' ? props.transitionPrev : props.transitionNext)
        return h(Transition, {
          name: transition,
          appear: true
        }, () => scheduler)
      }

      return scheduler
    }

    // expose public methods
    expose({
      prev,
      next,
      move,
      moveToToday,
      updateCurrent
    })
    // Object.assign(vm.proxy, {
    //   prev,
    //   next,
    //   move,
    //   moveToToday,
    //   updateCurrent
    // })

    return () => __renderCalendar()
  }
})

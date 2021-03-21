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
  parsed,
  parseTimestamp,
  today
} from '../utils/Timestamp.js'

import {
  convertToUnit,
  minCharWidth
} from '../utils/helpers.js'

import useMouse, { getRawMouseEvents } from '../composables/useMouse.js'

import useCalendar from '../composables/useCalendar.js'
import useCommon, { useCommonProps } from '../composables/useCommon.js'
import useMonth, { useMonthProps } from '../composables/useMonth.js'
// import { useMaxDaysProps } from '../composables/useMaxDays.js'
import useTimes, { useTimesProps } from '../composables/useTimes.js'
import useRenderValues from '../composables/useRenderValues.js'
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
  name: 'QCalendarMonth',

  directives: [ResizeObserver],

  props: {
    ...useCommonProps,
    ...useMonthProps,
    ...useTimesProps,
    ...useCellWidthProps,
    ...useNavigationProps
  },

  emits: [
    'update:modelValue',
    ...useCheckChangeEmits,
    ...useMoveEmits,
    'mini-mode',
    ...getRawMouseEvents('-date'),
    ...getRawMouseEvents('-day'),
    ...getRawMouseEvents('-head-workweek'),
    ...getRawMouseEvents('-head-day'),
    ...getRawMouseEvents('-workweek')
  ],

  setup (props, { slots, emit, expose }) {
    const
      scrollArea = ref(null),
      pane = ref(null),
      direction = ref('next'),
      startDate = ref(props.modelValue || today()),
      endDate = ref('0000-00-00'),
      maxDaysRendered = ref(0), // always 0
      emittedValue = ref(props.modelValue),
      focusRef = ref(null),
      focusValue = ref(null),
      datesRef = ref({}),
      weekEventRef = ref([]),
      weekRef = ref([]),
      headerColumnRef = ref(null),
      size = reactive({ width: 0, height: 0 }),
      dragOverHeadDayRef = ref(false),
      dragOverDayRef = ref(false),
      // keep track of last seen start and end dates
      lastStart = ref(null),
      lastEnd = ref(null)

    const parsedView = computed(() => {
      return props.view
    })

    const vm = getCurrentInstance()
    if (vm === null) {
      throw new Error('current instance is null')
    }

    // initialize emit listeners
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

    const computedStyles = computed(() => {
      const style = {}
      if (props.dayPadding !== undefined) {
        style.padding = props.dayPadding
      }
      style.minWidth = computedWidth.value
      style.maxWidth = computedWidth.value
      style.width = computedWidth.value
      return style
    })

    const { renderValues } = useRenderValues(props, {
      parsedView,
      times,
      parsedValue
    })

    const {
      rootRef,
      __initCalendar,
      __renderCalendar
    } = useCalendar(props, __renderMonth, {
      scrollArea,
      pane
    })

    const {
      // computed
      days,
      todayWeek,
      isMiniMode,
      parsedCellWidth,
      parsedMonthLabelSize,
      // methods
      isOutside,
      monthFormatter
    } = useMonth(props, emit, {
      weekdaySkips,
      times,
      parsedStart,
      parsedEnd,
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

    const workweekWidth = computed(() => {
      if (rootRef.value) {
        return props.showWorkWeeks === true ? parseInt(getComputedStyle(rootRef.value).getPropertyValue(isMiniMode.value === true ? '--calendar-mini-work-week-width' : '--calendar-work-week-width'), 10) : 0
      }
      return 0
    })

    const parsedColumnCount = computed(() => {
      return props.weekdays.length
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
        if (width && borderWidth.value && parsedColumnCount.value) {
          return ((width - workweekWidth.value - (borderWidth.value * parsedColumnCount.value)) / parsedColumnCount.value) + 'px'
        }
      }
      return (100 / parsedColumnCount.value) + '%'
    })

    const isDayFocusable = computed(() => {
      return props.focusable === true && props.focusType.includes('day') && isMiniMode.value !== true
    })

    const isDateFocusable = computed(() => {
      return props.focusable === true && props.focusType.includes('date') && isDayFocusable.value !== true
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
        emit('update:modelValue', val)
      }
    })

    watch(focusRef, val => {
      if (val) {
        focusValue.value = parseTimestamp(val)
        if (emittedValue.value !== val) {
          emittedValue.value = val
        }
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

    onBeforeUpdate(() => {
      datesRef.value = {}
      weekEventRef.value = []
      weekRef.value = []
      nextTick(() => {
        __adjustForWeekEvents()
      })
    })

    onMounted(() => {
      __initCalendar()
      __adjustForWeekEvents()
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

    function __onResize ({ width, height }) {
      size.width = width
      size.height = height
    }

    function __isActiveDate (day) {
      return day.date === emittedValue.value
    }

    function isCurrentWeek (week) {
      for (let i = 0; i < week.length; ++i) {
        if (week[ i ].current === true) {
          return { timestamp: week[ i ] }
        }
      }
      return { timestamp: false }
    }

    function __adjustForWeekEvents () {
      if (isMiniMode.value === true) return
      if (props.dayHeight !== 0) return
      const slotWeek = slots.week
      if (slotWeek === void 0) return

      if (window) {
        for (const row in weekEventRef.value) {
          const weekEvent = weekEventRef.value[ row ]
          if (weekEvent === void 0) continue
          const wrapper = weekRef.value[ row ]
          if (wrapper === void 0) continue
          // this sucks to have to do it this way
          const styles = window.getComputedStyle(weekEvent)
          const margin = parseFloat(styles.marginTop, 10) + parseFloat(styles.marginBottom, 10)
          if (weekEvent.clientHeight + margin > wrapper.clientHeight) {
            wrapper.style.height = weekEvent.clientHeight + margin + 'px'
          }
        }
      }
    }

    // Render functions

    function __renderBody () {
      return h('div', {
        class: 'q-calendar-month__body'
      }, [
        ...__renderWeeks()
      ])
    }

    function __renderHead () {
      return h('div', {
        role: 'presentation',
        class: 'q-calendar-month__head'
      }, [
        props.showWorkWeeks === true && __renderWorkWeekHead(),
        h('div', {
          class: 'q-calendar-month__head--wrapper'
        }, [
          __renderHeadDaysRow()
        ])
      ])
    }

    function __renderHeadDaysRow () {
      return h('div', {
        ref: headerColumnRef,
        class: {
          'q-calendar-month__head--weekdays': true
        }
      }, [
        ...__renderHeadDays()
      ])
    }

    function __renderWorkWeekHead () {
      const slot = slots[ 'head-workweek' ]
      const scope = {
        start: parsedStart.value,
        end: parsedEnd.value,
        miniMode: isMiniMode.value
      }

      return h('div', {
        class: 'q-calendar-month__head--workweek',
        ...getDefaultMouseEventHandlers('-head-workweek', event => {
          return { scope, event }
        })
      }, (slot ? slot({ scope }) : '#'))
    }

    function __renderHeadDays () {
      return todayWeek.value.map((day, index) => __renderHeadDay(day, index))
    }

    function __renderHeadDay (day, index) {
      const headDaySlot = slots[ 'head-day' ]

      const filteredDays = days.value.filter(day2 => day2.weekday === day.weekday)
      const weekday = filteredDays[ 0 ].weekday
      const scope = { weekday, timestamp: day, days: filteredDays, index, miniMode: isMiniMode.value }
      scope.droppable = dragOverHeadDayRef.value === day.weekday

      const disabled = (props.disabledWeekdays ? props.disabledWeekdays.includes(day.weekday) : false)
      const ariaLabel = weekdayFormatter.value(day, false)

      const weekdayClass = typeof props.weekdayClass === 'function' ? props.weekdayClass({ scope }) : {}
      const isFocusable = props.focusable === true && props.focusType.includes('weekday')

      const width = computedWidth.value
      const styler = props.weekdayStyle || dayStyleDefault
      const style = {
        width,
        maxWidth: width,
        minWidth: width,
        ...styler({ scope })
      }

      return h('div', {
        ariaLabel,
        key: day.date + (index !== undefined ? '-' + index : ''),
        tabindex: isFocusable === true ? 0 : -1,
        class: {
          'q-calendar-month__head--weekday': true,
          ...weekdayClass,
          'q-disabled-day disabled': disabled === true,
          [ 'q-calendar__' + props.weekdayAlign ]: true,
          'q-calendar__ellipsis': true,
          'q-calendar__focusable': isFocusable === true
        },
        style,
        onDragenter: (e) => {
          if (props.dragEnterFunc !== undefined && typeof props.dragEnterFunc === 'function') {
            props.dragEnterFunc(e, 'head-day', scope)
              ? dragOverHeadDayRef.value = day.weekday
              : dragOverHeadDayRef.value = ''
          }
        },
        onDragover: (e) => {
          if (props.dragOverFunc !== undefined && typeof props.dragOverFunc === 'function') {
            props.dragOverFunc(e, 'head-day', scope)
              ? dragOverHeadDayRef.value = day.weekday
              : dragOverHeadDayRef.value = ''
          }
        },
        onDragleave: (e) => {
          if (props.dragLeaveFunc !== undefined && typeof props.dragLeaveFunc === 'function') {
            props.dragLeaveFunc(e, 'head-day', scope)
              ? dragOverHeadDayRef.value = day.weekday
              : dragOverHeadDayRef.value = ''
          }
        },
        onDrop: (e) => {
          if (props.dropFunc !== undefined && typeof props.dropFunc === 'function') {
            props.dropFunc(e, 'head-day', scope)
              ? dragOverHeadDayRef.value = day.weekday
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
      }, [
        headDaySlot === undefined && __renderHeadWeekdayLabel(day, props.shortWeekdayLabel || isMiniMode.value),
        headDaySlot !== undefined && headDaySlot({ scope }),
        __renderHeadDayEvent(day, index),
        isFocusable === true && useFocusHelper()
      ])
    }

    function __renderHeadDayEvent (day, index) {
      const headDayEventSlot = slots[ 'head-day-event' ]
      const activeDate = props.noActiveDate !== true && __isActiveDate(day)
      const disabled = (props.disabledWeekdays ? props.disabledWeekdays.includes(day.weekday) : false)
      const filteredDays = days.value.filter(day2 => day2.weekday === day.weekday)
      const weekday = filteredDays[ 0 ].weekday
      const scope = { weekday, timestamp: day, days: filteredDays, index, miniMode: isMiniMode.value, activeDate, disabled }

      const width = computedWidth.value
      const styler = props.weekdayStyle || dayStyleDefault
      const style = {
        width,
        maxWidth: width,
        minWidth: width,
        ...styler({ scope })
      }

      return h('div', {
        key: 'event-' + day.date + (index !== undefined ? '-' + index : ''),
        class: {
          'q-calendar-month__head--event': true
        },
        style
      }, [
        headDayEventSlot !== undefined && headDayEventSlot({ scope })
      ])
    }

    function __renderHeadWeekdayLabel (day, shortWeekdayLabel) {
      const weekdayLabel = weekdayFormatter.value(day, shortWeekdayLabel || (props.labelBreakpoints[ 0 ] > 0 && parsedCellWidth.value <= props.labelBreakpoints[ 0 ]))
      return h('span', {
        class: 'q-calendar__ellipsis'
      }, (isMiniMode.value === true && props.shortWeekdayLabel === true) || (props.labelBreakpoints[ 1 ] > 0 && parsedCellWidth.value <= props.labelBreakpoints[ 1 ]) ? minCharWidth(weekdayLabel, props.minLabelLength) : weekdayLabel)
    }

    function __renderWeeks () {
      const weekDays = props.weekdays.length
      const weeks = []
      for (let i = 0; i < days.value.length; i += weekDays) {
        weeks.push(__renderWeek(days.value.slice(i, i + weekDays), i / weekDays))
      }

      return weeks
    }

    function __renderWeek (week, weekNum) {
      const slotWeek = slots.week
      const weekdays = props.weekdays
      const scope = { week, weekdays, miniMode: isMiniMode.value }
      const style = {}

      // this applies height properly, even if workweeks are displaying
      style.height = props.dayHeight > 0 && isMiniMode.value !== true ? convertToUnit(parseInt(props.dayHeight, 10)) : 'auto'
      if (props.dayMinHeight > 0 && isMiniMode.value !== true) {
        style.minHeight = convertToUnit(parseInt(props.dayMinHeight, 10))
      }

      return h('div', {
        key: week[ 0 ].date,
        ref: (el) => { weekRef.value[ weekNum ] = el },
        class: 'q-calendar-month__week--wrapper',
        style
      }, [
        props.showWorkWeeks === true ? __renderWorkWeekGutter(week) : undefined,
        h('div', {
          class: 'q-calendar-month__week'
        }, [
          h('div', {
            class: 'q-calendar-month__week--days'
          }, week.map((day, index) => __renderDay(day))),
          isMiniMode.value !== true && slotWeek !== undefined
            ? h('div', {
              ref: (el) => { weekEventRef.value[ weekNum ] = el },
              class: 'q-calendar-month__week--events'
            }, slotWeek({ scope }))
            : undefined
        ])
      ])
    }

    function __renderWorkWeekGutter (week) {
      const slot = slots.workweek
      // adjust day to account for Sunday/Monday start of week calendars
      const day = week.length > 2 ? week[ 2 ] : week[ 0 ]
      const { timestamp } = isCurrentWeek(week)
      const workweekLabel = Number(day.workweek).toLocaleString(props.locale)
      const scope = { workweekLabel, week, miniMode: isMiniMode.value }

      return h('div', {
        key: day.workweek,
        class: {
          'q-calendar-month__workweek': true,
          ...getRelativeClasses(timestamp !== false ? timestamp : day, false)
        },
        ...getDefaultMouseEventHandlers('-workweek', event => {
          return { scope, event }
        })
      }, slot ? slot({ scope }) : workweekLabel)
    }

    function __renderDay (day) {
      const slot = slots.day
      const styler = props.dayStyle || dayStyleDefault
      const outside = isOutside(day)
      const activeDate = props.noActiveDate !== true && parsedValue.value.date === day.date
      const hasMonth = (outside === false && props.showMonthLabel === true && days.value.find(d => d.month === day.month).day === day.day)
      const scope = { outside, timestamp: day, miniMode: isMiniMode.value, activeDate, hasMonth, droppable: dragOverDayRef.value === day.date }

      const style = Object.assign({ ...computedStyles.value }, styler({ scope }))
      const dayClass = typeof props.dayClass === 'function' ? props.dayClass({ scope }) : {}
      const ariaLabel = ariaDateFormatter.value(day)

      const data = {
        ariaLabel,
        key: day.date,
        ref: (el) => {
          if (isDayFocusable.value === true) {
            datesRef.value[ day.date ] = el
          }
        },
        tabindex: isDayFocusable.value === true ? 0 : -1,
        class: {
          'q-calendar-month__day': true,
          ...dayClass,
          ...getRelativeClasses(day, outside, props.selectedDates, props.selectedStartEndDates, props.hover),
          'q-active-date': activeDate === true,
          disabled: props.enableOutsideDays !== true && outside === true,
          'q-calendar__hoverable': props.hoverable === true,
          'q-calendar__focusable': isDayFocusable.value === true,
          'q-calendar-month__day--droppable': scope.droppable === true && outside !== true
        },
        style,
        onFocus: (e) => {
          if (isDayFocusable.value === true) {
            focusRef.value = day.date
          }
        },
        onKeydown: (e) => {
          if (outside !== true
            && day.disabled !== true
            && isKeyCode(e, [ 13, 32 ])) {
            e.stopPropagation()
            e.preventDefault()
          }
        },
        onKeyup: (event) => {
          // allow selection of date via Enter or Space keys
          if (outside !== true
            && day.disabled !== true
            && isKeyCode(event, [ 13, 32 ])) {
            event.stopPropagation()
            event.preventDefault()
            // emit only if there is a listener
            if (emitListeners.value.onClickDay !== undefined && isMiniMode.value !== true) {
              // eslint-disable-next-line vue/require-explicit-emits
              emit('click-day', { scope, event })
            }
          }
        },
        ...getDefaultMouseEventHandlers('-day', event => {
          return { scope, event }
        })
      }

      const dragAndDrop = {
        onDragenter: (e) => {
          if (props.dragEnterFunc !== undefined && typeof props.dragEnterFunc === 'function') {
            props.dragEnterFunc(e, 'day', scope)
              ? dragOverDayRef.value = day.date
              : dragOverDayRef.value = ''
          }
        },
        onDragover: (e) => {
          if (props.dragOverFunc !== undefined && typeof props.dragOverFunc === 'function') {
            props.dragOverFunc(e, 'day', scope)
              ? dragOverDayRef.value = day.date
              : dragOverDayRef.value = ''
          }
        },
        onDragleave: (e) => {
          if (props.dragLeaveFunc !== undefined && typeof props.dragLeaveFunc === 'function') {
            props.dragLeaveFunc(e, 'day', scope)
              ? dragOverDayRef.value = day.date
              : dragOverDayRef.value = ''
          }
        },
        onDrop: (e) => {
          if (props.dropFunc !== undefined && typeof props.dropFunc === 'function') {
            props.dropFunc(e, 'day', scope)
              ? dragOverDayRef.value = day.date
              : dragOverDayRef.value = ''
          }
        }
      }

      if (outside !== true) {
        Object.assign(data, dragAndDrop)
      }

      return h('div', data, [
        __renderDayLabelContainer(day, outside, hasMonth),
        h('div', {
          class: {
            'q-calendar-month__day--content': true
          }
        }, slot ? slot({ scope }) : undefined),
        isDayFocusable.value === true && useFocusHelper()
      ])
    }

    function __renderDayLabelContainer (day, outside, hasMonth) {
      let dayOfYearLabel, monthLabel
      const children = [__renderDayLabel(day, outside)]

      if (isMiniMode.value !== true && hasMonth === true && size.width > 340) {
        monthLabel = __renderDayMonth(day, outside)
      }

      if (isMiniMode.value !== true && props.showDayOfYearLabel === true && monthLabel === undefined && size.width > 300) {
        dayOfYearLabel = __renderDayOfYearLabel(day, outside)
      }

      if (props.dateAlign === 'left') {
        dayOfYearLabel !== undefined && children.push(dayOfYearLabel)
        monthLabel !== undefined && children.push(monthLabel)
      }
      else if (props.dateAlign === 'right') {
        dayOfYearLabel !== undefined && children.unshift(dayOfYearLabel)
        monthLabel !== undefined && children.unshift(monthLabel)
      }
      else { // center
        // no day of year or month labels
        dayOfYearLabel = undefined
        monthLabel = undefined
      }

      // TODO: if miniMode just return children?

      const data = {
        class: {
          'q-calendar-month__day--label__wrapper': true,
          'q-calendar__ellipsis': true,
          [ 'q-calendar__' + props.dateAlign ]: (dayOfYearLabel === undefined && monthLabel === undefined),
          'q-calendar__justify': (dayOfYearLabel !== undefined || monthLabel !== undefined)
        }
      }

      return h('div', data, children)
    }

    function __renderDayLabel (day, outside) {
      // return if outside days are hidden
      if (outside === true && props.noOutsideDays === true) {
        return
      }

      const dayLabel = dayFormatter.value(day, false)
      const dayLabelSlot = slots[ 'day-label' ]
      const dayBtnSlot = slots[ 'day-button' ]

      const selectedDate = (
        props.selectedDates
          && props.selectedDates.length > 0
          && props.selectedDates.includes(day.date)
      )

      const activeDate = props.noActiveDate !== true && __isActiveDate(day)
      const scope = { dayLabel, timestamp: day, outside, activeDate, selectedDate, miniMode: isMiniMode.value }
      const ariaLabel = ariaDateFormatter.value(day)

      // const size = isMiniMode.value ? 'sm' : props.monthLabelSize

      const data = {
        ariaLabel,
        key: day.date,
        ref: (el) => {
          if (isDateFocusable.value === true) {
            datesRef.value[ day.date ] = el
          }
        },
        tabindex: isDateFocusable.value === true ? 0 : -1,
        class: {
          'q-calendar-month__day--label': true,
          'q-calendar__button': true,
          'q-calendar__button--round': props.dateType === 'round',
          'q-calendar__button--bordered': day.current === true,
          'q-calendar__hoverable': props.hoverable === true,
          'q-calendar__focusable': isDateFocusable.value === true
        },
        // style: {
        //   lineHeight: isMiniMode.value ? 'unset' : '1.715em'
        // },
        disabled: day.disabled === true || (props.enableOutsideDays !== true && outside === true),
        onFocus: (e) => {
          if (isDateFocusable.value === true) {
            focusRef.value = day.date
          }
        },
        onKeydown: (e) => {
          if (outside !== true
            && day.disabled !== true
            && isKeyCode(e, [ 13, 32 ])) {
            e.stopPropagation()
            e.preventDefault()
          }
        },
        onKeyup: (event) => {
          // allow selection of date via Enter or Space keys
          if (isDateFocusable.value === true
            && outside !== true
            && day.disabled !== true
            && isKeyCode(event, [ 13, 32 ])) {
            event.stopPropagation()
            event.preventDefault()
            emittedValue.value = day.date
            if (emitListeners.value.onClickDate !== undefined) {
              // eslint-disable-next-line vue/require-explicit-emits
              emit('click-date', { scope, event })
            }
          }
        },
        ...getDefaultMouseEventHandlers('-date', (event, eventName) => {
          // don't allow date clicks to propagate to day mouse handlers
          event.stopPropagation()
          if (eventName === 'click-date' || eventName === 'contextmenu-date') {
            emittedValue.value = day.date
          }
          return { scope, event }
        })
      }

      return [
        dayBtnSlot
          ? dayBtnSlot({ scope })
          : useButton(props, data, dayLabelSlot ? dayLabelSlot({ scope }) : dayLabel),
        isDateFocusable.value === true && useFocusHelper()
      ]
    }

    function __renderDayOfYearLabel (day, outside) {
      // return if outside days are hidden
      if (outside === true && props.noOutsideDays === true) {
        return
      }

      const slot = slots[ 'day-of-year' ]
      const scope = { timestamp: day }

      return h('span', {
        class: {
          'q-calendar-month__day--day-of-year': true,
          'q-calendar__ellipsis': true
        }
      }, slot ? slot({ scope }) : day.doy)
    }

    function __renderDayMonth (day, outside) {
      // return if outside days are hidden
      if (outside === true && props.noOutsideDays === true) {
        return
      }

      const slot = slots[ 'month-label' ]
      const monthLabel = monthFormatter.value(day, props.shortMonthLabel || size.width < 500)
      const scope = { monthLabel, timestamp: day, miniMode: isMiniMode.value }

      const style = {}
      if (isMiniMode.value !== true && parsedMonthLabelSize.value !== undefined) {
        style.fontSize = parsedMonthLabelSize.value
      }

      return h('span', {
        class: 'q-calendar-month__day--month q-calendar__ellipsis',
        style
      }, [
        slot ? slot({ scope }) : isMiniMode.value !== true ? monthLabel : undefined
      ])
    }

    function __renderMonth () {
      const { start, end } = renderValues.value
      startDate.value = start.date
      endDate.value = end.date

      const hasWidth = size.width > 0

      const weekly = withDirectives(h('div', {
        class: {
          'q-calendar-mini': isMiniMode.value === true,
          'q-calendar-month': true
        },
        key: startDate.value
      }, [
        hasWidth === true && props.noHeader !== true && __renderHead(),
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
        }, () => weekly)
      }

      return weekly
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

import {
  h,
  computed,
  defineComponent,
  getCurrentInstance,
  onBeforeUpdate,
  onMounted,
  // nextTick,
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
import useCommon from '../composables/useCommon.js'
import useTask, { useTaskProps } from '../composables/useTask.js'
import useTimes, { useTimesProps } from '../composables/useTimes.js'
import useRenderValues from '../composables/useRenderValues.js'
import useMove, { useMoveEmits } from '../composables/useMove.js'
import useEmitListeners from '../composables/useEmitListeners.js'
import useButton from '../composables/useButton.js'
import useFocusHelper from '../composables/useFocusHelper.js'
import useCheckChange, { useCheckChangeEmits } from '../composables/useCheckChange.js'
import useEvents from '../composables/useEvents.js'
import useKeyboard, { useNavigationProps } from '../composables/useKeyboard.js'

// Directives
import ResizeObserver from '../directives/ResizeObserver.js'

export default defineComponent({
  name: 'QCalendarTask',

  directives: [ResizeObserver],

  props: {
    ...useTimesProps,
    ...useNavigationProps,
    ...useTaskProps // last for any overrides
  },

  emits: [
    'update:model-value',
    'update:model-tasks',
    'update:model-title',
    'update:model-footer',
    ...useCheckChangeEmits,
    ...useMoveEmits,
    ...getRawMouseEvents('-date'),
    ...getRawMouseEvents('-day'),
    ...getRawMouseEvents('-head-day')
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
      // taskRef = ref(null),
      // weekEventRef = ref([]),
      // weekRef = ref([]),
      // headerColumnRef = ref(null),
      size = reactive({ width: 0, height: 0 }),
      dragOverHeadDayRef = ref(false),
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
      // parsedEnd,
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

    // const computedStyles = computed(() => {
    //   const style = {}
    //   style.minWidth = computedWidth.value
    //   style.maxWidth = computedWidth.value
    //   style.width = computedWidth.value
    //   return style
    // })

    const { renderValues } = useRenderValues(props, {
      parsedView,
      times,
      parsedValue
    })

    const {
      rootRef,
      __initCalendar,
      __renderCalendar
    } = useCalendar(props, __renderTask, {
      scrollArea,
      pane
    })

    const {
      // computed
      days,
      parsedStartDate,
      parsedEndDate
      // methods
    } = useTask(props, emit, {
      weekdaySkips,
      times
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

    // const parsedColumnCount = computed(() => {
    //   return days.value.length
    // })

    // const borderWidth = computed(() => {
    //   if (rootRef.value) {
    //     const calendarBorderWidth = getComputedStyle(rootRef.value).getPropertyValue('--calendar-border')
    //     const parts = calendarBorderWidth.split(' ')
    //     const part = parts.filter(part => part.indexOf('px') > -1)
    //     return parseInt(part[ 0 ], 0)
    //   }
    //   return 0
    // })

    const isSticky = true
    const parsedCellWidth = computed(() => {
      if (props.cellWidth !== undefined) {
        return parseInt(props.cellWidth, 10)
      }
      return 150
    })

    // const computedWidth = computed(() => {
    //   if (rootRef.value) {
    //     const width = size.width || rootRef.value.getBoundingClientRect().width
    //     if (width && parsedColumnCount.value) {
    //       return (width / parsedColumnCount.value) + 'px'
    //     }
    //   }
    //   return (100 / parsedColumnCount.value) + '%'
    // })

    const isDayFocusable = computed(() => {
      return props.focusable === true && props.focusType.includes('day') && isMiniMode.value !== true
    })

    const isDateFocusable = computed(() => {
      return props.focusable === true && props.focusType.includes('date') && isDayFocusable.value !== true
    })

    const isWeekdayFocusable = computed(() => {
      return props.focusable === true && props.focusType.includes('weekday')
    })

    const parsedHeight = computed(() => {
      return parseInt(props.dayHeight, 10)
    })

    const parsedMinHeight = computed(() => {
      return parseInt(props.dayMinHeight, 10)
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

    onBeforeUpdate(() => {
      datesRef.value = {}
      // weekEventRef.value = []
      // weekRef.value = []
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

    /**
     * Renders the given day with the associated task
     * @param {Timestamp} day Timestamp representing the day
     * @param {any} task The Task
     * @param {number} index The task index
     * @returns VNode
     */
    function __renderTaskDay (day, task, index) {
      const slot = slots.day
      const styler = props.dayStyle || dayStyleDefault
      const activeDate = props.noActiveDate !== true && parsedValue.value.date === day.date

      const scope = {
        timestamp: day,
        task,
        index,
        activeDate
      }
      const width = convertToUnit(parsedCellWidth.value)
      const style = {
        width,
        minWidth: width,
        maxWidth: width,
        ...styler({ scope })
      }

      const dayClass = typeof props.dayClass === 'function' ? props.dayClass({ scope }) : {}
      // const key = day.date + '-' + task.id

      return h('div', {
        class: {
          'q-calendar-task__task--day': true,
          ...dayClass,
          ...getRelativeClasses(day),
          'q-active-date': activeDate === true,
          'q-calendar__hoverable': props.hoverable === true,
          'q-calendar__focusable': isDayFocusable.value === true
        },
        style,
        onFocus: (e) => {
          if (isDayFocusable.value === true) {
            // focusRef.value = key
          }
        },
        ...getDefaultMouseEventHandlers('-day', event => {
          return { scope, event }
        }),
        onDragenter: (e) => {
          if (props.dragEnterFunc !== undefined && typeof props.dragEnterFunc === 'function') {
            props.dragEnterFunc(e, 'day', scope)
              ? dragOverResource.value = dragValue
              : dragOverResource.value = ''
          }
        },
        onDragover: (e) => {
          if (props.dragOverFunc !== undefined && typeof props.dragOverFunc === 'function') {
            props.dragOverFunc(e, 'day', scope)
              ? dragOverResource.value = dragValue
              : dragOverResource.value = ''
          }
        },
        onDragleave: (e) => {
          if (props.dragLeaveFunc !== undefined && typeof props.dragLeaveFunc === 'function') {
            props.dragLeaveFunc(e, 'day', scope)
              ? dragOverResource.value = dragValue
              : dragOverResource.value = ''
          }
        },
        onDrop: (e) => {
          if (props.dropFunc !== undefined && typeof props.dropFunc === 'function') {
            props.dropFunc(e, 'day', scope)
              ? dragOverResource.value = dragValue
              : dragOverResource.value = ''
          }
        }
      }, [
        slot && slot({ scope }),
        useFocusHelper()
      ])
    }

    function __renderTaskDays (task, index) {
      return days.value.map(day => __renderTaskDay(day, task, index))
    }

    function __renderTaskDaysRow (task, index) {
      const slot = slots.days
      const scope = {
        days: days.value,
        task,
        index,
        width: parsedCellWidth.value
      }

      return h('div', {
        class: 'q-calendar-task__task--days-row'
      }, [
        __renderTaskDays(task, index),
        slot && slot({ scope }),
      ])
    }

    function __renderTaskItem (task, index) {
      const slot = slots.task
      const scope = {
        start: parsedStartDate.value,
        end: parsedEndDate.value,
        task,
        index
      }
      const width = convertToUnit(props.taskWidth)
      const style = {
        width,
        minWidth: width,
        maxWidth: width
      }

      return h('div', {
        class: {
          'q-calendar-task__task--item': true,
          'q-calendar__sticky': isSticky === true
        },
        style
      }, [
        slot && slot({ scope })
      ])
    }

    function __renderTaskRow (task, index) {
      const height = parsedHeight.value > 0 ? convertToUnit(parsedHeight.value) : 'auto'
      const minHeight = parsedMinHeight.value > 0 ? convertToUnit(parsedMinHeight.value) : void 0
      const style = {
        height
      }
      if (minHeight !== void 0) {
        style.minHeight = minHeight
      }
      const isFocusable = props.focusable === true && props.focusType.includes('task')

      return h('div', {
        class: {
          'q-calendar-task__task': true,
          'q-calendar__hoverable': props.hoverable === true,
          'q-calendar__focusable': isFocusable === true
        },
        style
      }, [
        __renderTaskItem(task, index),
        __renderTaskDaysRow(task, index),
        useFocusHelper()
      ])
    }

    function __renderTasks () {
      return props.modelTasks.map((task, index) => __renderTaskRow(task, index))
    }

    function __renderTasksContainer () {
      return h('div', {
        class: {
          'q-calendar-task__task--container': true,
          'q-calendar__sticky': isSticky === true
        }
      }, [
        __renderTasks()
      ])
    }

    function __renderFooterTask (task, index) {
      const slot = slots[ 'footer-task' ]
      const scope = {
        start: parsedStartDate.value,
        end: parsedEndDate.value,
        footer: task,
        index
      }
      const width = convertToUnit(props.taskWidth)
      const style = {
        width,
        minWidth: width,
        maxWidth: width
      }

      return h('div', {
        class: {
          'q-calendar-task__footer--task': true,
          'q-calendar__sticky': isSticky === true
        },
        style
      }, [
        slot && slot({ scope })
      ])
    }

    function __renderFooterDay (day, task, index) {
      const slot = slots[ 'footer-day' ]
      const scope = {
        timestamp: day,
        footer: task,
        index
      }
      const width = convertToUnit(parsedCellWidth.value)
      const style = {
        width,
        minWidth: width,
        maxWidth: width
      }

      const footerDayClass = typeof props.footerDayClass === 'function' ? props.footerDayClass({ scope }) : {}

      return h('div', {
        class: {
          'q-calendar-task__footer--day': true,
          ...footerDayClass,
          ...getRelativeClasses(day),
          'q-calendar__hoverable': props.hoverable === true,
          'q-calendar__focusable': isDayFocusable.value === true
        },
        style,
        // onFocus: (e) => {
        //   if (isDayFocusable.value === true) {
        //     focusRef.value = day.date
        //   }
        // }
      }, [
        slot && slot({ scope })
      ])
    }

    function __renderFooterDays (task, index) {
      return h('div', {
        class: 'q-calendar-task__footer--day-wrapper'
      }, [
        days.value.map(day => __renderFooterDay(day, task, index))
      ])
    }

    function __renderFooterRows () {
      const isFocusable = props.focusable === true && props.focusType.includes('task')

      return props.modelFooter.map((task, index) => {
        return h('div', {
          class: {
            'q-calendar-task__footer--wrapper': true,
            'q-calendar__hoverable': props.hoverable === true,
            'q-calendar__focusable': isFocusable === true
          }
        }, {
          default: () => [
            __renderFooterTask(task, index),
            __renderFooterDays(task, index)
          ]}
        )
      })
    }

    function __renderFooter () {
      return h('div', {
        class: {
          'q-calendar-task__footer': true,
          'q-calendar__sticky': isSticky === true
        }
      }, __renderFooterRows())
    }

    function __renderBody () {
      return h('div', {
        class: {
          'q-calendar-task__body': true
        }
      }, [
        props.noHeader !== true && __renderHead(),
        __renderTasksContainer(),
        __renderFooter()
      ])
    }

    function __renderHeadTask () {
      const slot = slots[ 'head-task' ]
      const scope = {
        start: parsedStartDate.value,
        end: parsedEndDate.value
      }
      const width = convertToUnit(props.taskWidth)
      const style = {
        width,
        minWidth: width,
        maxWidth: width
      }

      return h('div', {
        class: {
          'q-calendar-task__head--task': true,
          'q-calendar__sticky': isSticky === true
        },
        style
      }, [
        slot && slot({ scope })
      ])
    }

    function __renderTitleTask (title, index) {
      const slot = slots[ 'title-task' ]

      const width = convertToUnit(props.taskWidth)
      const style = {
        width,
        minWidth: width,
        maxWidth: width
      }

      const scope = {
        start: parsedStartDate.value,
        end: parsedEndDate.value,
        width,
        title,
        index
      }

      return h('div', {
        class: {
          'q-calendar-task__title--task': true,
          'q-calendar__sticky': isSticky === true
        },
        style
      }, [
        slot && slot({ scope })
      ])
    }

    function __renderHeadWeekday (day) {
      const slot = slots[ 'head-weekday-label' ]
      const scope = {
        timestamp: day
      }

      const data = {
        class: {
          'q-calendar-task__head--weekday': true,
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
          'q-calendar-task__head--date': true,
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
          'q-calendar-task__head--day__label': true,
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

    /**
     * Renders the given day with the associated task
     * @param {Timestamp} day Timestamp representing the day
     * @param {any} task The Task
     * @param {number} index The task index
     * @returns VNode
     */
        function __renderTitleDay (day, title, index) {
        const slot = slots['title-day']

        const width = convertToUnit(parsedCellWidth.value)
        const style = {
          width,
          minWidth: width,
          maxWidth: width
        }

        const scope = {
          timestamp: day,
          title,
          index,
          width
        }
  
        const dayClass = typeof props.dayClass === 'function' ? props.dayClass({ scope }) : {}
        const isFocusable = props.focusable === true && props.focusType.includes('day')
  
        return h('div', {
          class: {
            'q-calendar-task__title--day': true,
            ...dayClass,
            ...getRelativeClasses(day),
            'q-calendar__hoverable': props.hoverable === true,
            'q-calendar__focusable': isFocusable === true
          },
          style
        }, [
          slot && slot({ scope }),
          useFocusHelper()
        ])
      }

    function __renderHeadDay (day) {
      const headDaySlot = slots[ 'head-day' ]
      const headDateSlot = slots[ 'head-date' ]
      const activeDate = props.noActiveDate !== true && __isActiveDate(day)

      const scope = {
        timestamp: day,
        activeDate
      }

      const styler = props.weekdayStyle || dayStyleDefault
      const weekdayClass = typeof props.weekdayClass === 'function' ? props.weekdayClass({ scope }) : {}

      const width = convertToUnit(parsedCellWidth.value)
      const style = {
        width,
        minWidth: width,
        maxWidth: width,
        ...styler({ scope })
      }

      const key = day.date

      const data = {
        key,
        ref: (el) => { datesRef.value[ key ] = el },
        tabindex: isWeekdayFocusable.value === true ? 0 : -1,
        class: {
          'q-calendar-task__head--day': true,
          ...weekdayClass,
          ...getRelativeClasses(day),
          'q-active-date': activeDate,
          'q-calendar__hoverable': props.hoverable === true,
          'q-calendar__focusable': isWeekdayFocusable.value === true
        },
        style,
        onFocus: (e) => {
          if (isWeekdayFocusable.value === true) {
            focusRef.value = key
          }
        },
        ...getDefaultMouseEventHandlers('-head-day', event => {
          return { scope, event }
        }),
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
        }
      }

      return h('div', data, [
        // head-day slot replaces everything below it
        headDaySlot !== undefined && headDaySlot({ scope }),
        headDaySlot === undefined && __renderDateHeader(day),
        headDaySlot === undefined && headDateSlot && headDateSlot({ scope }),
        useFocusHelper()
      ])
    }

    function __renderHeadDays () {
      return days.value.map(day => __renderHeadDay(day))
    }

    function __renderTitleDays (title, index) {
      return days.value.map(day => __renderTitleDay(day, title, index))
    }

    function __renderHeadDaysRow () {
      return h('div', {
        class: {
          'q-calendar-task__head--days': true
        }
      }, [
        ...__renderHeadDays()
      ])
    }

    function __renderTitleDaysRow (title, index) {
      return h('div', {
        class: {
          'q-calendar-task__title--days': true
        }
      }, [
        ...__renderTitleDays(title, index)
      ])
    }

    // ----

    function __renderHead () {
      return h('div', {
        roll: 'presentation',
        class: {
          'q-calendar-task__head': true,
          'q-calendar__sticky': isSticky === true
        },
        style: {
        }
      }, [
        h('div', {
          style: {
            position: 'relative',
            display: 'flex'
          }
        }, [
          __renderHeadTask(),
          __renderHeadDaysRow()
        ]),
        props.modelTitle.map((title, index) => h('div', {
          class: 'q-calendar-task__title',
          style: {
            position: 'relative',
            display: 'flex'
          }
        }, [
          __renderTitleTask(title, index),
          __renderTitleDaysRow(title, index)
        ]))
      ])
    }

    function __renderContainer () {
      return h('div', {
        class: 'q-calendar-task__container'
      }, [
        __renderScrollArea()
      ])
    }

    function __renderScrollArea () {
      return h('div', {
        ref: scrollArea,
        class: {
          'q-calendar-task__scroll-area': true,
          'q-calendar__scroll': true
        }
      }, [
        __renderBody()
      ])
    }

    function __renderTask () {
      const { start, end } = renderValues.value
      startDate.value = start.date
      endDate.value = end.date

      const hasWidth = size.width > 0

      const weekly = withDirectives(h('div', {
        key: startDate.value,
        class: 'q-calendar-task'
      }, [
        hasWidth === true && __renderContainer()
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
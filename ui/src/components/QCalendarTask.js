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
import useCommon, { useCommonProps } from '../composables/useCommon.js'
import useTask, { useTaskProps } from '../composables/useTask.js'
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
  name: 'QCalendarTask',

  directives: [ResizeObserver],

  props: {
    ...useTaskProps,
    ...useTimesProps,
    ...useNavigationProps
  },

  emits: [
    'update:modelValue',
    ...useCheckChangeEmits,
    ...useMoveEmits
    // ...getRawMouseEvents('-date'),
    // ...getRawMouseEvents('-day'),
    // ...getRawMouseEvents('-head-day')
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
      // dragOverDayRef = ref(false),
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
      // dayFormatter,
      weekdayFormatter
      // ariaDateFormatter,
      // methods
      // dayStyleDefault,
      // getRelativeClasses
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
      parsedStartDate,
      parsedEndDate,
      days
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

    useKeyboard(props, {
      rootRef,
      focusRef,
      focusValue,
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

    const parsedCellWidth = computed(() => {
      return props.cellWidth[ props.view ]
    })

    // const computedWidth = computed(() => {
    //   if (rootRef.value) {
    //     const width = size.width || rootRef.value.getBoundingClientRect().width
    //     if (width && borderWidth.value && parsedColumnCount.value) {
    //       return ((width - (borderWidth.value * parsedColumnCount.value)) / parsedColumnCount.value) + 'px'
    //     }
    //   }
    //   return (100 / parsedColumnCount.value) + '%'
    // })

    function __isCheckChange () {
      if (checkChange() === true
      && props.useNavigation === true
      && datesRef.value
      && focusRef.value) {
        if (document && document.activeElement !== datesRef.value[ focusRef.value ]) {
          let count = 0
          const interval = setInterval(() => {
            if (datesRef.value[ focusRef.value ]) {
              datesRef.value[ focusRef.value ].focus()
              if (++count === 10 || document.activeElement === datesRef.value[ focusRef.value ]) {
                clearInterval(interval)
              }
            }
            else {
              clearInterval(interval)
            }
          }, 250)
        }
      }
    }

    watch([days], __isCheckChange, { deep: true })

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
      }
    })

    watch(focusValue, (val) => {
      if (datesRef.value[ focusRef.value ]) {
        datesRef.value[ focusRef.value ].focus()
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

    // function __isActiveDate (day) {
    //   return day.date === emittedValue.value
    // }

    function __renderTaskDay (day, task, index) {
      const slot = slots.day
      const scope = {
        day,
        task,
        index
      }
      const width = convertToUnit(parsedCellWidth.value)
      const style = {
        width,
        minWidth: width,
        maxWidth: width
      }

      const dayClass = typeof props.dayClass === 'function' ? props.dayClass({ scope }) : {}

      return h('div', {
        class: {
          'q-calendar-task__task--day': true,
          ...dayClass
        },
        style
      }, [
        slot && slot({ scope })
      ])
    }

    function __renderTaskDays (task, index) {
      return days.value.map(day => __renderTaskDay(day, task, index))
    }

    function __renderTaskDaysWrapper (task, index) {
      return h('div', {
        style: {
          display: 'flex',
          flex: 'none'
        }
      }, [
        __renderTaskDays(task, index)
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
          'q-calendar__sticky': true
        },
        style
      }, [
        slot && slot({ scope })
      ])
    }

    function __renderTaskRow (task, index) {
      return h('div', {
        class: 'q-calendar-task__task'
      }, [
        __renderTaskItem(task, index),
        __renderTaskDaysWrapper(task, index)
      ])
    }

    function __renderTasks () {
      return props.tasks.map((task, index) => __renderTaskRow(task, index))
    }

    function __renderFooterTask () {
      const slot = slots[ 'footer-task' ]
      const scope = {
        start: parsedStartDate.value,
        end: parsedEndDate.value,
        tasks: props.tasks
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
          'q-calendar__sticky': true
        },
        style
      }, [
        slot && slot({ scope })
      ])
    }

    function __renderFooterDay (day) {
      const slot = slots[ 'footer-day' ]
      const scope = {
        day,
        tasks: props.tasks
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
          ...footerDayClass
        },
        style
      }, [
        slot && slot({ scope })
      ])
    }

    function __renderFooterDays () {
      return h('div', {
        class: 'q-calendar-task__footer--day-wrapper'
      }, [
        days.value.map(day => __renderFooterDay(day))
      ])
    }

    function __renderFooter () {
      return h('div', {
        class: {
          'q-calendar-task__footer': true,
          'q-calendar__sticky': true
        }
      }, [
        __renderFooterTask(),
        __renderFooterDays()
      ])
    }

    function __renderBody () {
      return h('div', {
        class: {
          'q-calendar-task__body': true
        }
      }, [
        props.noHeader !== true && __renderHead(),
        __renderTasks(),
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
          'q-calendar__sticky': true
        },
        style
      }, [
        slot && slot({ scope })
      ])
    }

    function __renderHeadWeekday (day) {
      const weekdayLabel = minCharWidth(weekdayFormatter.value(day, true), props.minLabelLength)
      return h('div', {}, weekdayLabel)
    }

    function __renderHeadDate (day) {
      return h('div', {}, day.day)
    }

    function __renderHeadDay (day) {
      const width = convertToUnit(parsedCellWidth.value)
      const style = {
        width,
        minWidth: width,
        maxWidth: width
      }
      const scope = {
        timestamp: day
      }

      const weekdayClass = typeof props.weekdayClass === 'function' ? props.weekdayClass({ scope }) : {}

      return h('div', {
        class: {
          'q-calendar-task__head--day': true,
          ...weekdayClass
        },
        style
      }, [
        __renderHeadDate(day),
        __renderHeadWeekday(day)
      ])
    }

    function __renderHeadDays () {
      return days.value.map(day => __renderHeadDay(day))
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

    // ----

    function __renderHead () {
      return h('div', {
        roll: 'presentation',
        class: {
          'q-calendar-task__head': true,
          'q-calendar__sticky': true
        },
        style: {
        }
      }, [
        __renderHeadTask(),
        __renderHeadDaysRow()
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

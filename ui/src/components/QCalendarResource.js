// Vue
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
  // getDateTime,
  getDayIdentifier,
  // getDayTimeIdentifier,
  isBetweenDates,
  parsed,
  parseTimestamp,
  today
} from '../utils/Timestamp.js'

import {
  convertToUnit
} from '../utils/helpers.js'

// Composables
import useCalendar from '../composables/useCalendar.js'
import useCommon, { useCommonProps } from '../composables/useCommon.js'
import useInterval, { useIntervalProps, useResourceProps } from '../composables/useInterval.js'
import { useColumnProps } from '../composables/useColumn.js'
import { useMaxDaysProps } from '../composables/useMaxDays.js'
import useTimes, { useTimesProps } from '../composables/useTimes.js'
import useRenderValues from '../composables/useRenderValues.js'
import useMouse, { getRawMouseEvents } from '../composables/useMouse.js'
import useMove, { useMoveEmits } from '../composables/useMove.js'
import useEmitListeners from '../composables/useEmitListeners.js'
// import useButton from '../composables/useButton.js'
import useFocusHelper from '../composables/useFocusHelper.js'
// import useCellWidth, { useCellWidthProps } from '../composables/useCellWidth.js'
import useCheckChange, { useCheckChangeEmits } from '../composables/useCheckChange.js'
import useEvents from '../composables/useEvents.js'
import useKeyboard, { useNavigationProps } from '../composables/useKeyboard.js'

// Directives
import ResizeObserver from '../directives/ResizeObserver.js'

// Icons
// const mdiMenuRight = 'M10,17L15,12L10,7V17Z'
// const mdiMenuUp = 'M7,15L12,10L17,15H7Z'

export default defineComponent({
  name: 'QCalendarResource',

  props: {
    ...useCommonProps,
    ...useResourceProps,
    ...useIntervalProps,
    ...useColumnProps,
    ...useMaxDaysProps,
    ...useTimesProps,
    // ...useCellWidthProps,
    ...useNavigationProps
  },

  emits: [
    'update:modelValue',
    'update:modelResources',
    'resource-expanded',
    ...useCheckChangeEmits,
    ...useMoveEmits,
    ...getRawMouseEvents('-date'),
    ...getRawMouseEvents('-interval'),
    ...getRawMouseEvents('-head-day'),
    ...getRawMouseEvents('-time'),
    ...getRawMouseEvents('-head-resources'),
    ...getRawMouseEvents('-resource')
  ],

  setup (props, { slots, emit, expose }) {
    const
      scrollArea = ref(null),
      pane = ref(null),
      headerRef = ref(null),
      headerColumnRef = ref(null),
      focusRef = ref(null),
      focusValue = ref(null),
      // resourceFocusRef = ref(null),
      // resourceFocusValue = ref(null),
      datesRef = ref({}),
      resourcesRef = ref({}),
      // headDayEventsParentRef = ref({}),
      // headDayEventsChildRef = ref({}),
      // resourcesHeadRef = ref(null),
      direction = ref('next'),
      startDate = ref(today()),
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
      return 'day'
    })

    const vm = getCurrentInstance()
    if (vm === null) {
      throw new Error('current instance is null')
    }

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
      parsedEnd,
      // dayFormatter,
      // weekdayFormatter,
      // ariaDateFormatter,
      // methods
      dayStyleDefault
      // getRelativeClasses
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
      // scrollWidth,
      __initCalendar,
      __renderCalendar
    } = useCalendar(props, __renderResource, {
      scrollArea,
      pane
    })

    const {
      // computed
      days,
      intervals,
      // ariaDateTimeFormatter,
      // parsedCellWidth,
      // parsedIntervalStart,
      // parsedIntervalMinutes,
      // parsedIntervalCount,
      // parsedIntervalHeight,
      intervalFormatter,
      // parsedStartMinute,
      // bodyHeight,
      // bodyWidth,
      // methods
      styleDefault,
      scrollToTimeX,
      timeDurationWidth,
      timeStartPosX
      // getTimestampAtEventX
      // getTimestampAtEventIntervalX
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
      days,
      parsedView,
      parsedValue,
      emittedValue,
      weekdaySkips,
      direction,
      times
    })

    const parsedResourceHeight = computed(() => {
      const height = parsedResourceHeight.value
      if (height === 0) {
        return 'auto'
      }
      return height
    })

    const parsedResourceMinHeight = computed(() => {
      return parseInt(props.resourceMinHeight, 10)
    })

    const parsedResourceWidth = computed(() => {
      if (rootRef.value) {
        return parseInt(getComputedStyle(rootRef.value).getPropertyValue('--calendar-resources-width'), 10)
      }
      return 0
    })

    const parsedIntervalHeaderWidth = computed(() => {
      return parseInt(props.intervalHeaderWidth, 10)
    })

    const parsedIntervalHeaderHeight = computed(() => {
      return parseInt(props.intervalHeaderHeight, 10)
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

    // Render functions

    function __renderHead () {
      const style = {
        height: convertToUnit(parsedIntervalHeaderHeight.value)
      }

      return h('div', {
        ref: headerRef,
        roll: 'presentation',
        class: {
          'q-calendar-resource__head': true,
          'q-calendar__sticky': props.noSticky !== true
        },
        style
      }, [
        __renderHeadResource(),
        __renderHeadIntervals()
      ])
    }

    function __renderHeadResource () {
      const slot = slots[ 'head-resources' ]

      const width = convertToUnit(parsedResourceWidth.value)
      const height = convertToUnit(parsedIntervalHeaderHeight.value)

      const scope = {
        timestamp: props.modelValue,
        resources: props.modelResources,
        intervals: intervals[ 0 ]
      }

      return h('div', {
        class: {
          'q-calendar-resource__head--resources': true,
          'q-calendar__sticky': props.noSticky !== true
        },
        style: {
          minWidth: width,
          maxWidth: width,
          width,
          height
        },
        ...getDefaultMouseEventHandlers('-head-resources', event => {
          return { scope, event }
        })
      }, [
        slot && slot({ scope })
      ])
    }

    function __renderHeadIntervals () {
      return h('div', {
        class: {
          'q-calendar-resource__head--intervals': true
        }
      }, [
        intervals.value.map(intervals => intervals.map((interval, index) => __renderHeadInterval(interval, index)))
      ])
    }

    function __renderHeadInterval (interval, index) {
      const slot = slots[ 'interval-label' ]
      const activeDate = props.noActiveDate !== true && __isActiveDate(interval)

      const width = convertToUnit(parsedIntervalHeaderWidth.value)
      const height = convertToUnit(parsedIntervalHeaderHeight.value)

      const short = props.shortIntervalLabel
      const label = intervalFormatter.value(interval, short)

      const scope = {
        interval,
        index,
        label
      }
      scope.droppable = dragOverHeadDayRef.value === interval.time

      const styler = props.intervalStyle || dayStyleDefault
      const style = {
        width,
        maxWidth: width,
        minWidth: width,
        height,
        ...styler({ scope })
      }

      const intervalClass = typeof props.intervalClass === 'function' ? props.intervalClass({ scope }) : {}
      const isFocusable = props.focusable === true && props.focusType.includes('day')

      return slot ? slot(scope) : h('div', {
        class: {
          'q-calendar-resource__head--interval': true,
          ...intervalClass,
          'q-active-date': activeDate,
          'q-calendar__hoverable': props.hoverable === true,
          'q-calendar__focusable': isFocusable === true
        },
        style,
        onDragenter: (e) => {
          if (props.dragEnterFunc !== undefined && typeof props.dragEnterFunc === 'function') {
            props.dragEnterFunc(e, 'interval', scope)
              ? dragOverHeadDayRef.value = interval.date
              : dragOverHeadDayRef.value = ''
          }
        },
        onDragover: (e) => {
          if (props.dragOverFunc !== undefined && typeof props.dragOverFunc === 'function') {
            props.dragOverFunc(e, 'interval', scope)
              ? dragOverHeadDayRef.value = interval.date
              : dragOverHeadDayRef.value = ''
          }
        },
        onDragleave: (e) => {
          if (props.dragLeaveFunc !== undefined && typeof props.dragLeaveFunc === 'function') {
            props.dragLeaveFunc(e, 'interval', scope)
              ? dragOverHeadDayRef.value = interval.date
              : dragOverHeadDayRef.value = ''
          }
        },
        onDrop: (e) => {
          if (props.dropFunc !== undefined && typeof props.dropFunc === 'function') {
            props.dropFunc(e, 'interval', scope)
              ? dragOverHeadDayRef.value = interval.date
              : dragOverHeadDayRef.value = ''
          }
        },
        onFocus: (e) => {
          if (isFocusable === true) {
            focusRef.value = interval.date
          }
        },
        ...getDefaultMouseEventHandlers('-interval', event => {
          return { scope, event }
        })
      }, label)
    }

    function __renderBody () {
      return h('div', {
        class: 'q-calendar-resource__body'
      }, [
        __renderScrollArea()
      ])
    }

    function __renderScrollArea () {
      return h('div', {
        ref: scrollArea,
        class: {
          'q-calendar-resource__scroll-area': true,
          'q-calendar__scroll': true
        }
      }, [
        __renderDayContainer()
      ])
    }

    function __renderResourcesError () {
      return h('div', {}, 'No resources have been defined')
    }

    function __renderDayContainer () {
      return h('div', {
        class: 'q-calendar-resource__day--container'
      }, [
        __renderHead(),
        props.modelResources === undefined && __renderResourcesError(),
        props.modelResources !== undefined && __renderBodyResources()
      ])
    }

    function __renderBodyResources () {
      const data = {
        class: 'q-calendar-resource__resources--body'
      }

      return h('div', data, __renderResources())
    }

    function __renderResources (resources = undefined, indentLevel = 0, expanded = true) {
      if (resources === undefined) {
        resources = props.modelResources // start
      }
      return resources.map((resource, resourceIndex) => {
        return __renderResourceRow(resource, resourceIndex, indentLevel, resource.children !== undefined ? resource.expanded : expanded)
      })
    }

    function __renderResourceRow (resource, resourceIndex, indentLevel = 0, expanded = true) {
      const height = resource.height !== void 0 ? convertToUnit(resource.height) : 'auto'
      const style = {
        height
      }

      const resourceRow = h('div', {
        key: resource[ props.resourceKey ] + '-' + resourceIndex,
        class: {
          'q-calendar-resource__resource--row': true
        },
        style
      }, [
        __renderResourceLabel(resource, resourceIndex, indentLevel, expanded),
        __renderResourceIntervals(resource, resourceIndex)
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

    function __renderResourceLabel (resource, resourceIndex, indentLevel = 0, expanded = true) {
      const slotResourceLabel = slots[ 'resource-label' ]

      const width = convertToUnit(parsedResourceWidth.value)
      const style = {
        minWidth: width,
        maxWidth: width,
        width
      }
      style.height = resource.height !== void 0
        ? convertToUnit(resource.height)
        : parsedResourceHeight.value > 0
          ? convertToUnit(parsedResourceHeight.value)
          : 'auto'
      if (parsedResourceMinHeight.value > 0) {
        style.minHeight = convertToUnit(parsedResourceMinHeight.value)
      }
      const styler = props.resourceStyle || styleDefault
      const label = resource[ props.resourceLabel ]

      const isFocusable = props.focusable === true && props.focusType.includes('resource') && expanded === true
      const scope = {
        resource,
        intervals,
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
          'q-calendar-resource__resource': indentLevel === 0,
          'q-calendar-resource__resource--section': indentLevel !== 0,
          ...resourceClass,
          'q-calendar__sticky': props.noSticky !== true,
          'q-calendar__hoverable': props.hoverable === true,
          'q-calendar__focusable': isFocusable === true
        },
        style: {
          ...style,
          ...styler({ scope })
        },
        onDragenter: (e) => {
          if (props.dragEnterFunc !== undefined && typeof props.dragEnterFunc === 'function') {
            props.dragEnterFunc(e, 'resource', scope)
              ? dragOverResource.value = dragValue
              : dragOverResource.value = ''
          }
        },
        onDragover: (e) => {
          if (props.dragOverFunc !== undefined && typeof props.dragOverFunc === 'function') {
            props.dragOverFunc(e, 'resource', scope)
              ? dragOverResource.value = dragValue
              : dragOverResource.value = ''
          }
        },
        onDragleave: (e) => {
          if (props.dragLeaveFunc !== undefined && typeof props.dragLeaveFunc === 'function') {
            props.dragLeaveFunc(e, 'resource', scope)
              ? dragOverResource.value = dragValue
              : dragOverResource.value = ''
          }
        },
        onDrop: (e) => {
          if (props.dropFunc !== undefined && typeof props.dropFunc === 'function') {
            props.dropFunc(e, 'resource', scope)
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
        // ---
      }, [
        slotResourceLabel
          ? slotResourceLabel({ scope })
          : [
              h('div', {
                class: {
                  'q-calendar__parent': resource.children !== undefined,
                  'q-calendar__parent--expanded': resource.children !== undefined && resource.expanded === true,
                  'q-calendar__parent--collapsed': resource.children !== undefined && resource.expanded !== true
                },
                onClick: (e) => {
                  e.stopPropagation()
                  resource.expanded = !resource.expanded
                  emit('update:modelResources', props.modelResources)
                  emit('resource-expanded', { expanded: resource.expanded, scope })
                  if (resourcesRef.value[ resource[ props.resourceKey ] ]) {
                    const el = resourcesRef.value[ resource[ props.resourceKey ] ]
                    const parent = el.parentNode
                    const child = parent.nextSibling
                    const scrollHeight = child.scrollHeight
                    let p = parent
                    do {
                      p = p.parentNode.closest('.q-calendar__child')
                      if (p) {
                        const mh = parseInt(p.style.maxHeight)
                        p.style.maxHeight = mh + scrollHeight + 'px'
                      }
                    } while (p)
                    child.style.maxHeight = scrollHeight + 'px'
                  }
                }
              }),
              h('div', {
                class: {
                  'q-calendar-resource__resource--text': true,
                  'q-calendar__overflow-wrap': true
                },
                style: {
                  paddingLeft: (10 * indentLevel + 2) + 'px'
                }
              }, [
                label
              ]),
              useFocusHelper()
            ]
      ])
    }

    function __renderResourceIntervals (resource, idx) {
      const slot = slots[ 'resource-intervals' ]

      const scope = {
        resource,
        intervals,
        timeStartPosX,
        timeDurationWidth
      }

      return h('div', {
        class: 'q-calendar-resource__resource--intervals'
      }, [
        intervals.value.map(intervals => intervals.map(interval => __renderResourceInterval(resource, interval, idx))),
        slot && slot({ scope })
      ])
    }

    // interval related to resource
    function __renderResourceInterval (resource, interval, idx) {
      // called for each interval
      const slot = slots[ 'resource-interval' ]
      const scope = {
        resource,
        interval
      }
      const width = convertToUnit(parsedIntervalHeaderWidth.value)
      const height = resource.height !== void 0 ? convertToUnit(resource.height) : convertToUnit(parsedResourceHeight.value)

      const isFocusable = props.focusable === true && props.focusType.includes('interval')

      const style = {
        maxWidth: width,
        minWidth: width,
        height
      }

      return h('div', {
        class: {
          'q-calendar-resource__resource--interval': true,
          'q-calendar__hoverable': props.hoverable === true,
          'q-calendar__focusable': isFocusable === true

        },
        style,
        onDragenter: (e) => {
          if (props.dragEnterFunc !== undefined && typeof props.dragEnterFunc === 'function') {
            props.dragEnterFunc(e, 'resource', scope)
              ? dragOverHeadDayRef.value = interval.date
              : dragOverHeadDayRef.value = ''
          }
        },
        onDragover: (e) => {
          if (props.dragOverFunc !== undefined && typeof props.dragOverFunc === 'function') {
            props.dragOverFunc(e, 'resource', scope)
              ? dragOverHeadDayRef.value = interval.date
              : dragOverHeadDayRef.value = ''
          }
        },
        onDragleave: (e) => {
          if (props.dragLeaveFunc !== undefined && typeof props.dragLeaveFunc === 'function') {
            props.dragLeaveFunc(e, 'resource', scope)
              ? dragOverHeadDayRef.value = interval.date
              : dragOverHeadDayRef.value = ''
          }
        },
        onDrop: (e) => {
          if (props.dropFunc !== undefined && typeof props.dropFunc === 'function') {
            props.dropFunc(e, 'resource', scope)
              ? dragOverHeadDayRef.value = interval.date
              : dragOverHeadDayRef.value = ''
          }
        },
        onFocus: (e) => {
          if (isFocusable === true) {
            focusRef.value = interval.date
          }
        },
        ...getDefaultMouseEventHandlers('-time', event => {
          return { scope, event }
        })

        // // :time DEPRECATED in v2.4.0
        // on: this.getDefaultMouseEventHandlers2(':time', ':time2', (event, eventName) => {
        //   const scope = this.getScopeForSlotX(this.getTimestampAtEventX(event, interval))
        //   if (eventName.indexOf('2') > -1) {
        //     scope.resource = resource
        //     scope.index = idx
        //     return { scope, event }
        //   }
        //   else {
        //     return { scope, resource, event }
        //   }
        // })
        // ---
      }, [
        slot && slot({ scope })
      ])
    }

    function __renderResource () {
      if (canChangeDate.value) {
        const { start, end, maxDays } = renderValues.value
        startDate.value = start.date
        endDate.value = end.date
        maxDaysRendered.value = maxDays
      }

      const hasWidth = size.width > 0

      const resource = withDirectives(h('div', {
        class: 'q-calendar-resource',
        key: startDate.value
      }, [
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
        }, () => resource)
      }

      return resource
    }

    // expose public methods
    expose({
      prev,
      next,
      move,
      moveToToday,
      updateCurrent,
      timeStartPosX,
      timeDurationWidth,
      scrollToTimeX
    })

    // Object.assign(vm.proxy, {
    //   prev,
    //   next,
    //   move,
    //   moveToToday,
    //   updateCurrent,
    //   timeStartPosX,
    //   timeDurationWidth,
    //   scrollToTimeX
    // })

    return () => __renderCalendar()
  }
})

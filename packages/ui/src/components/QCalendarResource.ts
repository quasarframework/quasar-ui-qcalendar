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
  withDirectives,
  CSSProperties,
  SetupContext,
  VNode,
} from 'vue'

// Utility
import { getDayIdentifier, parsed, parseTimestamp, today, Timestamp } from '../utils/Timestamp'

import { convertToUnit } from '../utils/helpers'

// Composables
import useCalendar from '../composables/useCalendar'
import useCommon, { useCommonProps } from '../composables/useCommon'
import useInterval, {
  useIntervalProps,
  useResourceProps,
  type Resource,
} from '../composables/useInterval'
import { useColumnProps } from '../composables/useColumn'
import { useMaxDaysProps } from '../composables/useMaxDays'
import useTimes, { useTimesProps } from '../composables/useTimes'
import useRenderValues from '../composables/useRenderValues'
import useMouse, { getRawMouseEvents } from '../composables/useMouse'
import useMove, { useMoveEmits } from '../composables/useMove'
import useEmitListeners from '../composables/useEmitListeners'
// import useButton from '../composables/useButton'
import useFocusHelper from '../composables/useFocusHelper'
// import useCellWidth, { useCellWidthProps } from '../composables/useCellWidth'
import useCheckChange, { useCheckChangeEmits } from '../composables/useCheckChange'
import useEvents from '../composables/useEvents'
import useKeyboard, { useNavigationProps } from '../composables/useKeyboard'

// Directives
import ResizeObserver from '../directives/ResizeObserver'

interface Size {
  width: number
  height: number
}

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
    ...useNavigationProps,
  },

  emits: [
    'update:model-value',
    'update:model-resources',
    'resource-expanded',
    ...useCheckChangeEmits,
    ...useMoveEmits,
    ...getRawMouseEvents('-date'),
    ...getRawMouseEvents('-interval'),
    ...getRawMouseEvents('-head-day'),
    ...getRawMouseEvents('-time'),
    ...getRawMouseEvents('-head-resources'),
    ...getRawMouseEvents('-resource'),
  ],

  setup(props, { slots, emit, expose }: SetupContext) {
    const scrollArea = ref(null),
      pane = ref(null),
      headerRef = ref(null),
      headerColumnRef = ref(null),
      focusRef = ref<string>(props.modelValue || today()),
      focusValue = ref<Timestamp>(parsed(props.modelValue || today()) as Timestamp),
      // resourceFocusRef = ref(null),
      // resourceFocusValue = ref(null),
      datesRef = ref<Record<string, HTMLElement>>({}),
      resourcesRef = ref<Record<string, HTMLElement>>({}),
      // headDayEventsParentRef = ref({}),
      // headDayEventsChildRef = ref({}),
      // resourcesHeadRef = ref(null),
      direction = ref<'next' | 'prev'>('next'),
      startDate = ref(props.modelValue || today()),
      endDate = ref('0000-00-00'),
      maxDaysRendered = ref(0),
      emittedValue = ref(props.modelValue),
      size = reactive<Size>({ width: 0, height: 0 }),
      dragOverHeadDayRef = ref(''),
      dragOverResource = ref(''),
      dragOverResourceInterval = ref(''),
      // keep track of last seen start and end dates
      lastStart = ref(null),
      lastEnd = ref(null)

    watch(
      () => props.view,
      () => {
        // reset maxDaysRendered
        maxDaysRendered.value = 0
      },
    )

    const parsedView = computed(() => {
      if (props.view === 'month') {
        return 'month-interval'
      }
      return props.view
    })

    const parsedCellWidth = computed(() => {
      return parseInt(String(props.cellWidth), 10)
    })

    const vm = getCurrentInstance()
    if (vm === null) {
      throw new Error('current instance is null')
    }

    const { emitListeners } = useEmitListeners(vm)

    const { times, setCurrent, updateCurrent } = useTimes(props)

    // update dates
    updateCurrent()
    setCurrent()

    const {
      // computed
      parsedStart,
      parsedEnd,
      // dayFormatter,
      // weekdayFormatter,
      // ariaDateFormatter,
      // methods
      dayStyleDefault,
      // getRelativeClasses
    } = useCommon(props, { startDate, endDate, times })

    const parsedValue = computed(() => {
      return parseTimestamp(props.modelValue, times.now) || parsedStart.value || times.today
    })

    focusValue.value = parsedValue.value
    focusRef.value = parsedValue.value.date

    const { renderValues } = useRenderValues(props, {
      parsedView,
      times,
      parsedValue,
    })

    const {
      rootRef,
      // scrollWidth,
      __initCalendar,
      __renderCalendar,
    } = useCalendar(props, __renderResource, {
      scrollArea,
      pane,
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
      timeStartPosX,
      widthToMinutes,
      // getTimestampAtEventX
      // getTimestampAtEventIntervalX
      /// @ts-expect-error fix later
    } = useInterval(props, {
      times,
      scrollArea,
      parsedStart,
      parsedEnd,
      maxDays: maxDaysRendered,
      size,
      headerColumnRef,
    })

    const { move } = useMove(props, {
      parsedView,
      parsedValue,
      direction,
      maxDays: maxDaysRendered,
      times,
      emittedValue,
      emit,
    })

    const { getDefaultMouseEventHandlers } = useMouse(emit, emitListeners)

    const { checkChange } = useCheckChange(emit, { days, lastStart, lastEnd })

    const { isKeyCode } = useEvents()

    const { tryFocus } = useKeyboard(props, {
      rootRef,
      focusRef,
      focusValue,
      datesRef,
      parsedView,
      emittedValue,
      direction,
      times,
    })

    const parsedResourceHeight = computed(() => {
      const height = parseInt(String(props.resourceHeight), 10)
      if (height === 0) {
        return 'auto'
      }
      return height
    })

    const parsedResourceMinHeight = computed(() => {
      return parseInt(String(props.resourceMinHeight), 10)
    })

    const parsedIntervalHeaderHeight = computed(() => {
      return parseInt(String(props.intervalHeaderHeight), 10)
    })

    watch([days], checkChange, { deep: true, immediate: true })

    watch(
      () => props.modelValue,
      (val, oldVal) => {
        if (emittedValue.value !== val) {
          if (props.animated === true) {
            const v1 = getDayIdentifier(parsed(val) as Timestamp)
            const v2 = getDayIdentifier(parsed(oldVal) as Timestamp)
            direction.value = v1 >= v2 ? 'next' : 'prev'
          }
          emittedValue.value = val
        }
        focusRef.value = val
      },
    )

    watch(emittedValue, (val, oldVal) => {
      if (emittedValue.value !== props.modelValue) {
        if (props.animated === true) {
          const v1 = getDayIdentifier(parsed(val) as Timestamp)
          const v2 = getDayIdentifier(parsed(oldVal) as Timestamp)
          direction.value = v1 >= v2 ? 'next' : 'prev'
        }
        emit('update:model-value', val)
      }
    })

    watch(focusRef, (val) => {
      if (val) {
        focusValue.value = parseTimestamp(val) as Timestamp
      }
    })

    watch(focusValue, () => {
      if (datesRef.value[focusRef.value]) {
        datesRef.value[focusRef.value].focus()
      } else {
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

    function moveToToday(): void {
      emittedValue.value = today()
    }

    function next(amount = 1): void {
      move(amount)
    }

    function prev(amount = 1): void {
      move(-amount)
    }

    // private functions

    function __onResize({ width, height }: Size): void {
      size.width = width
      size.height = height
    }

    function __isActiveDate(day: Timestamp): boolean {
      return day.date === emittedValue.value
    }

    // Render functions

    function __renderHead(): VNode {
      const style: CSSProperties = {
        height: convertToUnit(parsedIntervalHeaderHeight.value),
      }

      return h(
        'div',
        {
          ref: headerRef,
          roll: 'presentation',
          class: {
            'q-calendar-resource__head': true,
            'q-calendar__sticky': props.noSticky !== true,
          },
          style,
        },
        [__renderHeadResource(), __renderHeadIntervals()],
      )
    }

    function __renderHeadResource(): VNode {
      const slot = slots['head-resources']

      const height = convertToUnit(parsedIntervalHeaderHeight.value)

      const scope = {
        timestamps: intervals,
        date: props.modelValue,
        resources: props.modelResources,
      }

      return h(
        'div',
        {
          class: {
            'q-calendar-resource__head--resources': true,
            'q-calendar__sticky': props.noSticky !== true,
          },
          style: {
            height,
          },
          ...getDefaultMouseEventHandlers('-head-resources', (event) => {
            return { scope, event }
          }),
        },
        [slot && slot({ scope })],
      )
    }

    function __renderHeadIntervals(): VNode {
      return h(
        'div',
        {
          ref: headerColumnRef,
          class: {
            'q-calendar-resource__head--intervals': true,
          },
        },
        [
          intervals.value.map((intervals) =>
            intervals.map((interval, index) => __renderHeadInterval(interval, index)),
          ),
        ],
      )
    }

    function __renderHeadInterval(interval: Timestamp, index: number): VNode {
      const slot = slots['interval-label']
      const activeDate = props.noActiveDate !== true && __isActiveDate(interval)

      const width = convertToUnit(parsedCellWidth.value)
      const height = convertToUnit(parsedIntervalHeaderHeight.value)

      const short = props.shortIntervalLabel
      const label = intervalFormatter.value(interval, short)

      const scope = {
        timestamp: interval,
        index,
        label,
        droppable: dragOverHeadDayRef.value === label,
      }

      const styler = props.intervalStyle || dayStyleDefault
      const style: CSSProperties = {
        width,
        maxWidth: width,
        minWidth: width,
        height,
        ...styler({ scope }),
      }

      const intervalClass =
        typeof props.intervalClass === 'function' ? props.intervalClass({ scope }) : {}
      const isFocusable = props.focusable === true && props.focusType.includes('interval')

      return h(
        'div',
        {
          key: label,
          tabindex: isFocusable === true ? 0 : -1,
          class: {
            'q-calendar-resource__head--interval': true,
            ...intervalClass,
            'q-active-date': activeDate,
            'q-calendar__hoverable': props.hoverable === true,
            'q-calendar__focusable': isFocusable === true,
          },
          style,
          onDragenter: (e: DragEvent) => {
            if (props.dragEnterFunc !== undefined && typeof props.dragEnterFunc === 'function') {
              props.dragEnterFunc(e, 'interval', { scope }) === true
                ? (dragOverHeadDayRef.value = label)
                : (dragOverHeadDayRef.value = '')
            }
          },
          onDragover: (e: DragEvent) => {
            if (props.dragOverFunc !== undefined && typeof props.dragOverFunc === 'function') {
              props.dragOverFunc(e, 'interval', { scope }) === true
                ? (dragOverHeadDayRef.value = label)
                : (dragOverHeadDayRef.value = '')
            }
          },
          onDragleave: (e: DragEvent) => {
            if (props.dragLeaveFunc !== undefined && typeof props.dragLeaveFunc === 'function') {
              props.dragLeaveFunc(e, 'interval', { scope }) === true
                ? (dragOverHeadDayRef.value = label)
                : (dragOverHeadDayRef.value = '')
            }
          },
          onDrop: (e: DragEvent) => {
            if (props.dropFunc !== undefined && typeof props.dropFunc === 'function') {
              props.dropFunc(e, 'interval', { scope }) === true
                ? (dragOverHeadDayRef.value = label)
                : (dragOverHeadDayRef.value = '')
            }
          },
          onFocus: () => {
            if (isFocusable === true) {
              focusRef.value = label
            }
          },
          ...getDefaultMouseEventHandlers('-interval', (event) => {
            return { scope, event }
          }),
        },
        [slot ? slot({ scope }) : label, useFocusHelper()],
      )
    }

    function __renderBody(): VNode {
      return h(
        'div',
        {
          class: 'q-calendar-resource__body',
        },
        [__renderScrollArea()],
      )
    }

    function __renderScrollArea(): VNode {
      return h(
        'div',
        {
          ref: scrollArea,
          class: {
            'q-calendar-resource__scroll-area': true,
            'q-calendar__scroll': true,
          },
        },
        [__renderDayContainer()],
      )
    }

    function __renderResourcesError(): VNode {
      return h('div', {}, 'No resources have been defined')
    }

    function __renderDayContainer(): VNode {
      return h(
        'div',
        {
          class: 'q-calendar-resource__day--container',
        },
        [
          __renderHead(),
          props.modelResources === undefined && __renderResourcesError(),
          props.modelResources !== undefined && __renderBodyResources(),
        ],
      )
    }

    function __renderBodyResources(): VNode {
      const data: Record<string, any> = {
        class: 'q-calendar-resource__resources--body',
      }

      return h('div', data, __renderResources())
    }

    function __renderResources(
      resources: Resource[] | void = undefined,
      indentLevel = 0,
      expanded = true,
    ): VNode | VNode[] {
      if (resources === undefined) {
        resources = props.modelResources // start
      }
      return (resources as Resource[])
        .map((resource: Resource, resourceIndex: number) => {
          return __renderResourceRow(
            resource,
            resourceIndex,
            indentLevel,
            resource.children !== undefined ? resource.expanded : expanded,
          )
        })
        .filter((v): v is VNode => !!v)
    }

    function __renderResourceRow(
      resource: Resource,
      resourceIndex: number,
      indentLevel = 0,
      expanded = true,
    ): VNode | VNode[] {
      const slotResourceRow = slots['resource-row']
      const style: CSSProperties = {}
      style.height =
        parsedResourceHeight.value === 'auto'
          ? parsedResourceHeight.value
          : convertToUnit(parsedResourceHeight.value)
      if (parsedResourceMinHeight.value > 0) {
        style.minHeight = convertToUnit(parsedResourceMinHeight.value)
      }

      const scope = { resource, resourceIndex, indentLevel, expanded }

      const resourceRow = h(
        'div',
        {
          key: resource[props.resourceKey] + '-' + resourceIndex,
          class: {
            'q-calendar-resource__resource--row': true,
          },
          style,
        },
        [
          __renderResourceLabel(resource, resourceIndex, indentLevel, expanded),
          __renderResourceIntervals(resource, resourceIndex),
        ],
      )

      if (resource.children !== undefined) {
        return [
          resourceRow,
          h(
            'div',
            {
              class: {
                'q-calendar__child': true,
                'q-calendar__child--expanded': expanded === true,
                'q-calendar__child--collapsed': expanded !== true,
              },
            },
            [
              __renderResources(
                resource.children,
                indentLevel + 1,
                expanded === false ? expanded : resource.expanded,
              ),
            ],
          ),
        ]
      }

      return slotResourceRow ? slotResourceRow({ scope }).flat() : [resourceRow]
    }

    function __renderResourceLabel(
      resource: Resource,
      resourceIndex: number,
      indentLevel = 0,
      expanded = true,
    ): VNode {
      const slotResourceLabel = slots['resource-label']

      const style: CSSProperties = {}
      style.height =
        resource.height !== void 0
          ? convertToUnit(parseInt(resource.height, 10))
          : parsedResourceHeight.value
            ? convertToUnit(parsedResourceHeight.value)
            : 'auto'
      if (parsedResourceMinHeight.value > 0) {
        style.minHeight = convertToUnit(parsedResourceMinHeight.value)
      }
      const styler = props.resourceStyle || styleDefault
      const label = resource[props.resourceLabel]

      const isFocusable =
        props.focusable === true && props.focusType.includes('resource') && expanded === true
      const dragValue = resource[props.resourceKey]

      const scope = {
        resource,
        timestamps: intervals,
        resourceIndex,
        indentLevel,
        label,
        droppable: dragOverResource.value === dragValue,
      }

      const resourceClass =
        typeof props.resourceClass === 'function' ? props.resourceClass({ scope }) : {}

      return h(
        'div',
        {
          key: resource[props.resourceKey] + '-' + resourceIndex,
          ref: (el) => {
            if (el instanceof HTMLElement) {
              resourcesRef.value[resource[props.resourceKey]] = el
            }
          },
          tabindex: isFocusable === true ? 0 : -1,
          class: {
            'q-calendar-resource__resource': indentLevel === 0,
            'q-calendar-resource__resource--section': indentLevel !== 0,
            ...resourceClass,
            'q-calendar__sticky': props.noSticky !== true,
            'q-calendar__hoverable': props.hoverable === true,
            'q-calendar__focusable': isFocusable === true,
          },
          style: {
            ...style,
            ...styler({ scope }),
          },
          onDragenter: (e: DragEvent) => {
            if (props.dragEnterFunc !== undefined && typeof props.dragEnterFunc === 'function') {
              props.dragEnterFunc(e, 'resource', { scope }) === true
                ? (dragOverResource.value = dragValue)
                : (dragOverResource.value = '')
            }
          },
          onDragover: (e: DragEvent) => {
            if (props.dragOverFunc !== undefined && typeof props.dragOverFunc === 'function') {
              props.dragOverFunc(e, 'resource', { scope }) === true
                ? (dragOverResource.value = dragValue)
                : (dragOverResource.value = '')
            }
          },
          onDragleave: (e: DragEvent) => {
            if (props.dragLeaveFunc !== undefined && typeof props.dragLeaveFunc === 'function') {
              props.dragLeaveFunc(e, 'resource', { scope }) === true
                ? (dragOverResource.value = dragValue)
                : (dragOverResource.value = '')
            }
          },
          onDrop: (e: DragEvent) => {
            if (props.dropFunc !== undefined && typeof props.dropFunc === 'function') {
              props.dropFunc(e, 'resource', { scope }) === true
                ? (dragOverResource.value = dragValue)
                : (dragOverResource.value = '')
            }
          },
          onKeydown: (event) => {
            if (isKeyCode(event, [13, 32])) {
              event.stopPropagation()
              event.preventDefault()
            }
          },
          onKeyup: (e: KeyboardEvent) => {
            // allow selection of resource via Enter or Space keys
            if (isKeyCode(e, [13, 32])) {
              if (emitListeners.value.onClickResource !== undefined) {
                emit('click-resource', { scope, event: e })
              }
            }
          },
          ...getDefaultMouseEventHandlers('-resource', (event) => {
            return { scope, event }
          }),
          // ---
        },
        [
          [
            h('div', {
              class: {
                'q-calendar__parent': resource.children !== undefined,
                'q-calendar__parent--expanded':
                  resource.children !== undefined && resource.expanded === true,
                'q-calendar__parent--collapsed':
                  resource.children !== undefined && resource.expanded !== true,
              },
              onClick: (e) => {
                e.stopPropagation()
                resource.expanded = !resource.expanded
                // emit('update:model-resources', props.modelResources)
                emit('resource-expanded', { expanded: resource.expanded, scope })
              },
            }),
            h(
              'div',
              {
                class: {
                  'q-calendar-resource__resource--text': true,
                  'q-calendar__ellipsis': true,
                },
                style: {
                  paddingLeft: 10 * indentLevel + 2 + 'px',
                },
              },
              [slotResourceLabel ? slotResourceLabel({ scope }) : label],
            ),
            useFocusHelper(),
          ],
        ],
      )
    }

    function __renderResourceIntervals(resource: Resource, resourceIndex: number): VNode {
      const slot = slots['resource-intervals']

      const scope = {
        resource,
        timestamps: intervals,
        resourceIndex,
        timeStartPosX,
        timeDurationWidth,
      }

      return h(
        'div',
        {
          class: 'q-calendar-resource__resource--intervals',
        },
        [
          intervals.value.map((intervals) =>
            intervals.map((interval) =>
              __renderResourceInterval(resource, interval, resourceIndex),
            ),
          ),
          slot && slot({ scope }),
        ],
      )
    }

    // interval related to resource
    function __renderResourceInterval(
      resource: Resource,
      interval: Timestamp,
      resourceIndex: number,
    ): VNode {
      // called for each interval
      const slot = slots['resource-interval']
      const activeDate = props.noActiveDate !== true && __isActiveDate(interval)
      const resourceKey = resource[props.resourceKey]
      const dragValue = interval.time + '-' + resourceKey
      const isFocusable = props.focusable === true && props.focusType.includes('time')

      const scope = {
        activeDate,
        resource,
        timestamp: interval,
        resourceIndex,
        droppable: dragOverResourceInterval.value === dragValue,
      }

      const styler = props.intervalStyle || dayStyleDefault
      const width = convertToUnit(parsedCellWidth.value)
      const style: CSSProperties = {
        width,
        maxWidth: width,
        minWidth: width,
        ...styler({ scope }),
      }
      style.height =
        resource.height !== void 0
          ? convertToUnit(parseInt(resource.height, 10))
          : parsedResourceHeight.value === 'auto'
            ? parsedResourceHeight.value
            : convertToUnit(parsedResourceHeight.value)
      if (parsedResourceMinHeight.value > 0) {
        style.minHeight = convertToUnit(parsedResourceMinHeight.value)
      }

      return h(
        'div',
        {
          key: dragValue,
          ref: (el) => {
            if (el instanceof HTMLElement) {
              datesRef.value[resource[props.resourceKey]] = el
            }
          },
          tabindex: isFocusable === true ? 0 : -1,
          class: {
            'q-calendar-resource__resource--interval': true,
            'q-active-date': activeDate,
            'q-calendar__hoverable': props.hoverable === true,
            'q-calendar__focusable': isFocusable === true,
          },
          style,
          onDragenter: (e: DragEvent) => {
            if (props.dragEnterFunc !== undefined && typeof props.dragEnterFunc === 'function') {
              props.dragEnterFunc(e, 'time', { scope }) === true
                ? (dragOverResourceInterval.value = dragValue)
                : (dragOverResourceInterval.value = '')
            }
          },
          onDragover: (e: DragEvent) => {
            if (props.dragOverFunc !== undefined && typeof props.dragOverFunc === 'function') {
              props.dragOverFunc(e, 'time', { scope }) === true
                ? (dragOverResourceInterval.value = dragValue)
                : (dragOverResourceInterval.value = '')
            }
          },
          onDragleave: (e: DragEvent) => {
            if (props.dragLeaveFunc !== undefined && typeof props.dragLeaveFunc === 'function') {
              props.dragLeaveFunc(e, 'time', { scope }) === true
                ? (dragOverResourceInterval.value = dragValue)
                : (dragOverResourceInterval.value = '')
            }
          },
          onDrop: (e: DragEvent) => {
            if (props.dropFunc !== undefined && typeof props.dropFunc === 'function') {
              props.dropFunc(e, 'time', { scope }) === true
                ? (dragOverResourceInterval.value = dragValue)
                : (dragOverResourceInterval.value = '')
            }
          },
          onFocus: () => {
            if (isFocusable === true) {
              focusRef.value = dragValue
            }
          },
          ...getDefaultMouseEventHandlers('-time', (event) => {
            return { scope, event }
          }),
        },
        [slot && slot({ scope }), useFocusHelper()],
      )
    }

    function __renderResource(): VNode {
      const { start, end, maxDays } = renderValues.value
      if (
        startDate.value !== start.date ||
        endDate.value !== end.date ||
        maxDaysRendered.value !== maxDays
      ) {
        startDate.value = start.date
        endDate.value = end.date
        maxDaysRendered.value = maxDays
      }

      const hasWidth = size.width > 0

      const resource = withDirectives(
        h(
          'div',
          {
            class: 'q-calendar-resource',
            key: startDate.value,
          },
          [hasWidth === true && __renderBody()],
        ),
        [[ResizeObserver, __onResize]],
      )

      if (props.animated === true) {
        const transition =
          'q-calendar--' +
          (direction.value === 'prev' ? props.transitionPrev : props.transitionNext)
        return h(
          Transition,
          {
            name: transition,
            appear: true,
          },
          () => resource,
        )
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
      widthToMinutes,
      scrollToTimeX,
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

    return (): VNode => __renderCalendar()
  },
})

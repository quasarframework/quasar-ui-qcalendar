/* global window */
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
  withDirectives,
  CSSProperties,
  type SlotsType,
  VNode,
} from 'vue'

// Utility
import {
  gregorianCalendar,
  parseCalendarTimestamp,
  today,
  type Timestamp,
} from '@timestamp-js/core'

import { convertToUnit, getResponsiveWeekdayLabel } from '../utils/helpers'
import {
  getCalendarDateIdentifier,
  getCalendarScopeData,
  parseCalendarTimestampSafe,
} from '../utils/calendarSystem'

// Composables
import useCalendar from '../composables/useCalendar'
import useCommon, { isFocusableType, useCommonProps } from '../composables/useCommon'
import { useSchedulerProps, type Resource } from '../composables/useInterval'
import useCalendarDays from '../composables/useCalendarDays'
import { getColumnIndexes, useColumnProps } from '../composables/useColumn'
import { useMaxDaysProps } from '../composables/useMaxDays'
import useTimes, { useTimesProps } from '../composables/useTimes'
import useRenderValues from '../composables/useRenderValues'
import useMouse, { getRawMouseEvents } from '../composables/useMouse'
import useMove, { useMoveEmits } from '../composables/useMove'
import useEmitListeners from '../composables/useEmitListeners'
import useButton from '../composables/useButton'
import useFocusHelper from '../composables/useFocusHelper'
import useCellWidth, { useCellWidthProps } from '../composables/useCellWidth'
import useCheckChange, { useCheckChangeEmits } from '../composables/useCheckChange'
import useScrollToDate from '../composables/useScrollToDate'
import useEvents from '../composables/useEvents'
import useKeyboard, { useNavigationProps } from '../composables/useKeyboard'
import { getDragEventHandlers } from '../composables/useDragAndDrop'
import useResourceDimensions from '../composables/useResourceDimensions'
import type {
  HeadDayButtonSlotScope,
  QCalendarSchedulerSlots,
  ResourceHeadSlotScope,
  ResourceLabelSlotScope,
  SchedulerDaySlotScope,
  SchedulerHeadDaySlotScope,
  SchedulerHeadWeekdaySlotScope,
} from '../slots'

// Directives
import ResizeObserver from '../directives/ResizeObserver'

interface Size {
  width: number
  height: number
}

const { renderButton } = useButton()

export default defineComponent({
  name: 'QCalendarScheduler',

  directives: { ResizeObserver },

  slots: Object as SlotsType<QCalendarSchedulerSlots>,

  props: {
    ...useCommonProps,
    ...useSchedulerProps,
    ...useColumnProps,
    ...useMaxDaysProps,
    ...useTimesProps,
    ...useCellWidthProps,
    ...useNavigationProps,
  },

  emits: [
    /**
     * Emitted when the model value changes.
     *
     * @param value New model value.
     * @param-type value String
     * @param-tsType value string
     */
    'update:model-value',
    /**
     * Emitted when the resources model changes.
     *
     * @param value New resources array.
     * @param-type value Array
     * @param-tsType value Resource[]
     */
    'update:model-resources',
    /**
     * Emitted when a resource is expanded or collapsed.
     *
     * @param expanded Whether the resource is expanded.
     * @param-type expanded Boolean
     * @param-tsType expanded boolean
     * @param scope Resource scope.
     * @param-type scope Object
     * @param-tsType scope ResourceLabelSlotScope
     */
    'resource-expanded',
    ...useCheckChangeEmits,
    ...useMoveEmits,
    /**
     * Interact with a scheduler date button.
     *
     * @api-follow getRawMouseEvents
     * @api-scope HeadDayButtonSlotScope
     * @param scope Scheduler date button scope.
     * @param event Native mouse or touch event.
     */
    ...getRawMouseEvents('-date'),
    /**
     * Interact with a scheduler resource day cell.
     *
     * @api-follow getRawMouseEvents
     * @api-scope SchedulerDaySlotScope
     * @param scope Scheduler resource day scope.
     * @param event Native mouse or touch event.
     */
    ...getRawMouseEvents('-day-resource'),
    /**
     * Interact with the scheduler resource header.
     *
     * @api-follow getRawMouseEvents
     * @api-scope ResourceHeadSlotScope
     * @param scope Scheduler resource header scope.
     * @param event Native mouse or touch event.
     */
    ...getRawMouseEvents('-head-resources'),
    /**
     * Interact with a scheduler header day.
     *
     * @api-follow getRawMouseEvents
     * @api-scope SchedulerHeadDaySlotScope
     * @param scope Scheduler header day scope.
     * @param event Native mouse or touch event.
     */
    ...getRawMouseEvents('-head-day'),
    /**
     * Interact with a scheduler resource label.
     *
     * @api-follow getRawMouseEvents
     * @api-scope ResourceLabelSlotScope
     * @param scope Scheduler resource label scope.
     * @param event Native mouse or touch event.
     */
    ...getRawMouseEvents('-resource'),
  ],

  setup(props, { slots, emit, expose }) {
    const initialDate = props.modelValue || today(props.calendarSystem)
    const scrollArea = ref<HTMLElement | null>(null),
      pane = ref(null),
      headerColumnRef = ref(null),
      focusRef = ref<string>(initialDate),
      focusValue = ref<Timestamp>(
        parseCalendarTimestamp(initialDate, props.calendarSystem) as Timestamp,
      ),
      datesRef = ref<Record<string, HTMLElement>>({}),
      keyboardActive = ref(false),
      resourcesRef = ref<Record<string, HTMLElement>>({}),
      headDayEventsParentRef = ref<HTMLElement>(),
      headDayEventsChildRef = ref<HTMLElement>(),
      // resourceFocusRef = ref(null),
      // resourceFocusValue = ref(null),
      // resourcesHeadRef = ref(null),
      direction = ref<'next' | 'prev'>('next'),
      startDate = ref(initialDate),
      endDate = ref('0000-00-00'),
      maxDaysRendered = ref(0),
      emittedValue = ref(props.modelValue),
      size = reactive<Size>({ width: 0, height: 0 }),
      dragOverHeadDayRef = ref(''),
      dragOverResource = ref(''),
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

    const vm = getCurrentInstance()
    if (vm === null) {
      throw new Error('current instance is null')
    }

    const { emitListeners } = useEmitListeners(vm)

    const { isSticky } = useCellWidth(props)

    const { times, setCurrent, updateCurrent: updateCurrentTimes } = useTimes(props)

    // update dates
    updateCurrentTimes()
    setCurrent()

    const {
      // computed
      parsedStart,
      parsedEnd,
      dayFormatter,
      weekdayFormatter,
      ariaDateFormatter,
      // methods
      dayStyleDefault,
      getDisabledStyle,
      getRelativeClasses,
    } = useCommon(props, { startDate, endDate, times })

    const parsedValue = computed(() => {
      return (
        parseCalendarTimestampSafe(props.modelValue, props.calendarSystem, parsedStart.value) ||
        parsedStart.value ||
        times.today
      )
    })

    focusValue.value = parsedValue.value
    focusRef.value = parsedValue.value.date

    const { renderValues } = useRenderValues(props, {
      parsedView,
      parsedValue,
      times,
    })

    const { rootRef, scrollWidth, __initCalendar, __renderCalendar } = useCalendar(
      props,
      __renderScheduler,
      {
        scrollArea,
        pane,
        keyboardActive,
      },
    )

    const {
      // computed
      days,
      // intervals,
      // intervalFormatter,
      // ariaDateTimeFormatter,
      parsedCellWidth,
      getScopeForSlot,
      // methods
      // getResourceClasses,
      // showResourceLabelDefault,
      styleDefault,
      // getTimestampAtEventInterval,
      // getTimestampAtEvent,
      // scrollToTime,
      // timeDurationHeight,
      // timeStartPos
    } = useCalendarDays(props, {
      times,
      parsedStart,
      parsedEnd,
      activeDate: parsedValue,
      maxDays: maxDaysRendered,
      size,
      headerColumnRef,
    })

    const { move: moveCalendar } = useMove(props, {
      parsedView,
      parsedValue,
      direction,
      maxDays: maxDaysRendered,
      times,
      emittedValue,
      emit,
    })

    const { getDefaultMouseEventHandlers } = useMouse(emit, emitListeners)

    const { registerDate, scrollToDate: scrollToDateCalendar } = useScrollToDate(props, scrollArea)

    const { checkChange } = useCheckChange(emit, {
      days,
      lastStart,
      lastEnd,
      calendarSystem: () => props.calendarSystem,
    })

    const { isKeyCode } = useEvents()

    useKeyboard(props, {
      rootRef,
      keyboardActive,
      focusRef,
      focusValue,
      datesRef,
      days,
      parsedView,
      parsedValue,
      emittedValue,
      direction,
      times,
    })

    const parsedColumnCount = computed(() => {
      const columnCount = parseInt(String(props.columnCount), 10)

      if (parsedView.value === 'day' && columnCount > 1) {
        return columnCount
      } else if (parsedView.value === 'day' && props.maxDays && props.maxDays > 1) {
        return props.maxDays
      }
      return days.value.length
    })

    const resourcesWidth = computed(() => {
      if (rootRef.value) {
        return parseInt(
          window.getComputedStyle(rootRef.value).getPropertyValue('--calendar-resources-width'),
          10,
        )
      }
      return 0
    })

    const { getResourceHeightStyle } = useResourceDimensions(props)

    const computedWidth = computed(() => {
      if (rootRef.value) {
        const width = size.width || rootRef.value.getBoundingClientRect().width
        if (width && resourcesWidth.value && parsedColumnCount.value) {
          return (width - scrollWidth.value - resourcesWidth.value) / parsedColumnCount.value + 'px'
        }
      }
      return 100 / parsedColumnCount.value + '%'
    })
    watch([days], checkChange, { deep: true, immediate: true })

    watch(
      () => props.modelValue,
      (val, oldVal) => {
        if (emittedValue.value !== props.modelValue) {
          if (props.animated === true) {
            const v1 = getCalendarDateIdentifier(val, props.calendarSystem)
            const v2 = getCalendarDateIdentifier(oldVal, props.calendarSystem)
            if (v1 !== null && v2 !== null) {
              direction.value = v1 >= v2 ? 'next' : 'prev'
            }
          }
          emittedValue.value = val
        }
        focusRef.value = val
      },
    )

    watch(emittedValue, (val, oldVal) => {
      if (emittedValue.value !== props.modelValue) {
        if (props.animated === true) {
          const v1 = getCalendarDateIdentifier(val, props.calendarSystem)
          const v2 = getCalendarDateIdentifier(oldVal, props.calendarSystem)
          if (v1 !== null && v2 !== null) {
            direction.value = v1 >= v2 ? 'next' : 'prev'
          }
        }
        emit('update:model-value', val)
      }
    })

    watch(focusRef, (val) => {
      if (val) {
        const timestamp = parseCalendarTimestampSafe(val, props.calendarSystem)
        if (timestamp === null) {
          return
        }

        focusValue.value = timestamp
      }
    })

    watch(
      () => props.maxDays,
      (val) => {
        maxDaysRendered.value = val
      },
    )

    onBeforeUpdate(() => {
      datesRef.value = {}
      headDayEventsParentRef.value = undefined
      headDayEventsChildRef.value = undefined
      resourcesRef.value = {}
    })

    onMounted(() => {
      __initCalendar()
    })

    // public functions

    /**
     * Moves the scheduler view by a relative amount.
     *
     * @param amount Number of view units to move. Negative values move backward.
     * @param-example amount -1
     */
    function move(amount: number = 1): void {
      moveCalendar(amount)
    }

    /**
     * Moves the scheduler view to today.
     */
    function moveToToday(): void {
      move(0)
    }

    /**
     * Scrolls horizontally to a rendered date.
     *
     * @param date Date in the active calendar system's format.
     * @param duration Animation duration in milliseconds.
     * @param-example date '2026-08-15'
     * @param-example duration 200
     * @returns Whether the requested date is rendered and can be scrolled to.
     */
    function scrollToDate(date: string, duration: number = 0): boolean {
      return scrollToDateCalendar(date, duration)
    }

    /**
     * Moves the scheduler view forward.
     *
     * @param amount Number of view units to move forward.
     * @param-example amount 1
     */
    function next(amount: number = 1): void {
      move(amount)
    }

    /**
     * Moves the scheduler view backward.
     *
     * @param amount Number of view units to move backward.
     * @param-example amount 1
     */
    function prev(amount: number = 1): void {
      move(-amount)
    }

    /**
     * Refreshes the scheduler view's current date/time state.
     */
    function updateCurrent(): void {
      updateCurrentTimes()
    }

    // private functions

    function __onResize({ width, height }: Size): void {
      size.width = width
      size.height = height
    }

    function __isActiveDate(day: Timestamp): boolean {
      return day.date === emittedValue.value
    }

    // function __isActiveResource (day) {
    //   return __isActiveDate(day)
    //     && day.hasTime
    //     && emittedValue.value.hasTime
    //     && day.time === emittedValue.value.time
    // }

    // Render functions

    function __renderHead(): VNode {
      const children = [__renderHeadResources(), __renderHeadDaysColumn()]

      if (scrollWidth.value > 0) {
        children.push(__renderHeadScrollbarSpace())
      }

      return h(
        'div',
        {
          roll: 'presentation',
          class: {
            'q-calendar-scheduler__head': true,
            'q-calendar__sticky': isSticky.value === true,
          },
        },
        children,
      )
    }

    function __renderHeadScrollbarSpace(): VNode {
      return h('div', {
        class: 'q-calendar-scheduler__head--scrollbar-space',
        style: {
          flex: 'none',
          width: scrollWidth.value + 'px',
        },
      })
    }

    /*
     * Outputs the header that is above the resources
     */
    function __renderHeadResources(): VNode {
      const slot = slots['head-resources']

      const scope: ResourceHeadSlotScope = {
        days: days.value, // deprecated
        timestamps: days.value,
        date: props.modelValue,
        resources: props.modelResources,
      }

      return h(
        'div',
        {
          class: {
            'q-calendar-scheduler__head--resources': true,
            'q-calendar__sticky': isSticky.value === true,
          },
          ...getDefaultMouseEventHandlers('-head-resources', (event) => {
            return { scope, event }
          }),
        },
        slot ? slot({ scope }) : 'Resources',
      )
    }

    function __renderHeadDaysColumn(): VNode {
      return h(
        'div',
        {
          ref: headerColumnRef,
          class: {
            'q-calendar-scheduler__head--days__column': true,
          },
        },
        [__renderHeadDaysRow(), __renderHeadDaysEventsRow()],
      )
    }

    function __renderHeadDaysRow(): VNode {
      return h(
        'div',
        {
          class: {
            'q-calendar-scheduler__head--days__weekdays': true,
          },
        },
        [...__renderHeadDays()],
      )
    }

    function __renderHeadDaysEventsRow(): VNode {
      const slot = slots['head-days-events']

      nextTick(() => {
        if (
          headDayEventsChildRef.value &&
          parseInt(String(props.columnCount), 10) === 0 &&
          window
        ) {
          try {
            const styles = window.getComputedStyle(headDayEventsChildRef.value)
            if (headDayEventsParentRef.value && headDayEventsParentRef.value.parentElement) {
              headDayEventsParentRef.value.parentElement.style.height = styles.height
              headDayEventsParentRef.value.style.height = styles.height
            }
          } catch {
            //
          }
        }
      })

      return h(
        'div',
        {
          class: {
            'q-calendar-scheduler__head--days__event': true,
          },
        },
        [
          slot &&
            h(
              'div',
              {
                ref: headDayEventsParentRef,
                class: 'q-calendar__head-days-event-slot',
              },
              [
                slot({
                  scope: {
                    timestamps: days.value,
                    days: days.value, // deprecated
                    ref: headDayEventsChildRef,
                  },
                }),
              ],
            ),
          ...__renderHeadDaysEvents(),
        ],
      )
    }

    function __renderHeadDays(): VNode[] {
      const columnCount = parseInt(String(props.columnCount), 10)

      if (days.value.length === 1 && columnCount > 0) {
        const day = days.value[0]!

        return getColumnIndexes(columnCount, props.columnIndexStart).map((columnIndex) =>
          __renderHeadDay(day, columnIndex),
        )
      } else {
        return days.value.map((day) => __renderHeadDay(day, 0))
      }
    }

    function __renderHeadDaysEvents(): VNode[] {
      const columnCount = parseInt(String(props.columnCount), 10)

      if (days.value.length === 1 && columnCount > 0) {
        const day = days.value[0]!

        return getColumnIndexes(columnCount, props.columnIndexStart).map((columnIndex) =>
          __renderHeadDayEvent(day, columnIndex),
        )
      } else {
        return days.value.map((day) => __renderHeadDayEvent(day, 0))
      }
    }

    function __renderHeadDay(day: Timestamp, columnIndex: number): VNode {
      const headDaySlot = slots['head-day']
      const headDateSlot = slots['head-date']
      const activeDate = props.noActiveDate !== true && __isActiveDate(day)

      const scope = getScopeForSlot(day, columnIndex ?? 0) as SchedulerHeadDaySlotScope
      scope.activeDate = activeDate
      scope.droppable = dragOverHeadDayRef.value === day.date
      scope.disabled =
        scope.disabled === true ||
        (props.disabledWeekdays ? props.disabledWeekdays.includes(Number(day.weekday)) : false)

      const width =
        isSticky.value === true ? convertToUnit(parsedCellWidth.value) : computedWidth.value
      const styler = props.weekdayStyle || dayStyleDefault
      const style: CSSProperties = {
        width,
        maxWidth: width,
        minWidth: width,
        ...styler({ scope }),
        ...getDisabledStyle(day),
      }
      if (isSticky.value === true) {
        style.minWidth = width
      }
      const weekdayClass =
        typeof props.weekdayClass === 'function' ? props.weekdayClass({ scope }) : {}
      const isFocusable = isFocusableType(props, 'weekday')
      const key = day.date + (columnIndex !== undefined ? '-' + columnIndex : '')

      const data: Record<string, any> = {
        key,
        ref: (el: HTMLElement | null) => {
          if (el !== null) {
            datesRef.value[key] = el
          }
          registerDate(day, el)
        },
        tabindex: isFocusable === true ? 0 : -1,
        class: {
          'q-calendar-scheduler__head--day': true,
          ...weekdayClass,
          ...getRelativeClasses(day, scope.outside),
          'q-active-date': activeDate,
          disabled: scope.disabled === true,
          'q-disabled-day': scope.disabled === true,
          'q-calendar__hoverable': props.hoverable === true,
          'q-calendar__focusable': isFocusable === true,
        },
        style,
        onFocus: () => {
          if (isFocusable === true) {
            focusRef.value = key
          }
        },
        onKeydown: (e: KeyboardEvent) => {
          if (scope.disabled !== true && isKeyCode(e, [13, 32])) {
            e.stopPropagation()
            e.preventDefault()
          }
        },
        onKeyup: (e: KeyboardEvent) => {
          // allow selection of date via Enter or Space keys
          if (scope.disabled !== true && isKeyCode(e, [13, 32])) {
            emittedValue.value = day.date
          }
        },
        ...getDefaultMouseEventHandlers('-head-day', (event) => {
          return { scope, event }
        }),
        ...getDragEventHandlers(props, {
          targetRef: dragOverHeadDayRef,
          value: day.date,
          resetValue: '',
          type: 'head-day',
          scope,
        }),
      }

      return h('div', data, [
        // head-day slot replaces everything below it
        headDaySlot !== undefined && headDaySlot({ scope }),
        headDaySlot === undefined && __renderColumnHeaderBefore(day, columnIndex),
        headDaySlot === undefined && __renderDateHeader(day),
        headDaySlot === undefined && headDateSlot && headDateSlot({ scope }),
        headDaySlot === undefined && __renderColumnHeaderAfter(day, columnIndex),
        useFocusHelper(),
      ])
    }

    function __renderDateHeader(day: Timestamp): VNode | VNode[] | void {
      if (props.dateHeader === 'stacked') {
        return [
          props.noDefaultHeaderText !== true ? __renderHeadWeekday(day) : [],
          props.noDefaultHeaderBtn !== true ? __renderHeadDayDate(day) : [],
        ].flat()
      } else if (props.dateHeader === 'inline') {
        if (props.weekdayAlign === 'left' && props.dateAlign === 'right') {
          return h(
            'div',
            {
              class: 'q-calendar__header--inline',
            },
            [
              props.noDefaultHeaderText !== true && __renderHeadWeekday(day),
              props.noDefaultHeaderBtn !== true && __renderHeadDayDate(day),
            ],
          )
        } else if (props.weekdayAlign === 'right' && props.dateAlign === 'left') {
          return h(
            'div',
            {
              class: 'q-calendar__header--inline',
            },
            [
              props.noDefaultHeaderText !== true && __renderHeadWeekday(day),
              props.noDefaultHeaderBtn !== true && __renderHeadDayDate(day),
            ],
          )
        } else {
          return h(
            'div',
            {
              class: 'q-calendar__header--inline',
            },
            [
              props.noDefaultHeaderText !== true && __renderHeadWeekday(day),
              props.noDefaultHeaderBtn !== true && __renderHeadDayDate(day),
            ],
          )
        }
      } else if (props.dateHeader === 'inverted') {
        if (props.weekdayAlign === 'left' && props.dateAlign === 'right') {
          return h(
            'div',
            {
              class: 'q-calendar__header--inline',
            },
            [
              props.noDefaultHeaderBtn !== true && __renderHeadDayDate(day),
              props.noDefaultHeaderText !== true && __renderHeadWeekday(day),
            ],
          )
        } else if (props.weekdayAlign === 'right' && props.dateAlign === 'left') {
          return h(
            'div',
            {
              class: 'q-calendar__header--inline',
            },
            [
              props.noDefaultHeaderBtn !== true && __renderHeadDayDate(day),
              props.noDefaultHeaderText !== true && __renderHeadWeekday(day),
            ],
          )
        } else {
          return h(
            'div',
            {
              class: 'q-calendar__header--inline',
            },
            [
              props.noDefaultHeaderBtn !== true && __renderHeadDayDate(day),
              props.noDefaultHeaderText !== true && __renderHeadWeekday(day),
            ],
          )
        }
      }
    }

    function __renderHeadDayEvent(day: Timestamp, columnIndex: number): VNode {
      const headDayEventSlot = slots['head-day-event']
      const activeDate = props.noActiveDate !== true && __isActiveDate(day)

      const scope = getScopeForSlot(day, columnIndex ?? 0) as SchedulerHeadDaySlotScope
      scope.activeDate = activeDate
      scope.droppable = dragOverHeadDayRef.value === day.date
      scope.disabled =
        scope.disabled === true ||
        (props.disabledWeekdays ? props.disabledWeekdays.includes(Number(day.weekday)) : false)

      const width =
        isSticky.value === true ? convertToUnit(parsedCellWidth.value) : computedWidth.value
      const style: CSSProperties = {
        width,
        maxWidth: width,
        minWidth: width,
        ...getDisabledStyle(day),
      }
      if (isSticky.value === true) {
        style.minWidth = width
      }

      return h(
        'div',
        {
          key: 'event-' + day.date + (columnIndex !== undefined ? '-' + columnIndex : ''),
          class: {
            'q-calendar-scheduler__head--day__event': true,
            ...getRelativeClasses(day, scope.outside),
            'q-active-date': activeDate,
            disabled: scope.disabled === true,
            'q-disabled-day': scope.disabled === true,
          },
          style,
        },
        [headDayEventSlot && headDayEventSlot({ scope })],
      )
    }

    function __renderHeadWeekday(day: Timestamp): VNode {
      const slot = slots['head-weekday-label']
      const shortWeekdayLabel = props.shortWeekdayLabel === true
      // const divisor = props.dateHeader === 'inline' || props.dateHeader === 'inverted' ? 0.5 : 1
      // const shortCellWidth = props.weekdayBreakpoints[ 1 ] > 0 && (parsedCellWidth.value * divisor) <= props.weekdayBreakpoints[ 1 ]
      const scope = getScopeForSlot(day, 0) as unknown as SchedulerHeadWeekdaySlotScope
      scope.shortWeekdayLabel = shortWeekdayLabel
      scope.disabled =
        scope.disabled === true ||
        (props.disabledWeekdays ? props.disabledWeekdays.includes(Number(day.weekday)) : false)

      const data: Record<string, any> = {
        class: {
          'q-calendar-scheduler__head--weekday': true,
          ['q-calendar__' + props.weekdayAlign]: true,
          'q-calendar__ellipsis': true,
        },
      }

      return h(
        'div',
        data,
        (slot && slot({ scope })) || __renderHeadWeekdayLabel(day, shortWeekdayLabel),
      )
    }

    function __renderHeadWeekdayLabel(day: Timestamp, shortWeekdayLabel: boolean): VNode {
      const weekdayLabel = getResponsiveWeekdayLabel({
        day,
        formatter: weekdayFormatter.value,
        shortWeekdayLabel,
        cellWidth: parsedCellWidth.value,
        breakpoints: props.weekdayBreakpoints,
        minWeekdayLabel: props.minWeekdayLabel,
      })
      return h(
        'span',
        {
          class: 'q-calendar-scheduler__head--weekday-label q-calendar__ellipsis',
        },
        weekdayLabel,
      )
    }

    function __renderHeadDayDate(day: Timestamp): VNode {
      const data: Record<string, any> = {
        class: {
          'q-calendar-scheduler__head--date': true,
          ['q-calendar__' + props.dateAlign]: true,
        },
      }

      return h('div', data, __renderHeadDayBtn(day))
    }

    function __renderHeadDayBtn(day: Timestamp): VNode {
      const activeDate = props.noActiveDate !== true && __isActiveDate(day)
      const dayLabel = dayFormatter.value(day, false)
      const headDayLabelSlot = slots['head-day-label']
      const headDayButtonSlot = slots['head-day-button']
      const intervalScope = getScopeForSlot(day, 0)

      const scope: HeadDayButtonSlotScope = {
        dayLabel,
        timestamp: day,
        calendarTimestamp: intervalScope.calendarTimestamp,
        calendarIdentity: intervalScope.calendarIdentity,
        calendarSystem: intervalScope.calendarSystem,
        outside: intervalScope.outside,
        activeDate,
        disabled: intervalScope.disabled === true,
      }

      const data: Record<string, any> = {
        class: {
          'q-calendar-scheduler__head--day__label': true,
          'q-calendar__button': true,
          'q-calendar__button--round': props.dateType === 'round',
          'q-calendar__button--rounded': props.dateType === 'rounded',
          'q-calendar__button--bordered': day.current === true,
          'q-calendar__focusable': true,
        },
        disabled: scope.disabled === true,
        onKeydown: (e: KeyboardEvent) => {
          if (scope.disabled !== true && isKeyCode(e, [13, 32])) {
            e.stopPropagation()
            e.preventDefault()
          }
        },
        onKeyup: (e: KeyboardEvent) => {
          // allow selection of date via Enter or Space keys
          if (scope.disabled !== true && isKeyCode(e, [13, 32])) {
            emittedValue.value = day.date
            if (emitListeners.value.onClickDate !== undefined) {
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
        }),
      }

      if (props.noAria !== true) {
        data.ariaLabel = ariaDateFormatter.value(day, false)
      }

      return headDayButtonSlot
        ? h('div', [headDayButtonSlot({ scope })])
        : renderButton(props, data, headDayLabelSlot ? headDayLabelSlot({ scope }) : dayLabel)
    }

    function __renderColumnHeaderBefore(day: Timestamp, columnIndex: number): VNode | void {
      const slot = slots['column-header-before']
      if (slot) {
        const scope = {
          timestamp: day,
          ...getCalendarScopeData(day, props.calendarSystem),
          columnIndex,
        }
        return h(
          'div',
          {
            class: 'q-calendar-scheduler__column-header--before',
          },
          [slot({ scope })],
        )
      }
    }

    function __renderColumnHeaderAfter(day: Timestamp, columnIndex: number): VNode | void {
      const slot = slots['column-header-after']
      if (slot) {
        const scope = {
          timestamp: day,
          ...getCalendarScopeData(day, props.calendarSystem),
          columnIndex,
        }
        return h(
          'div',
          {
            class: 'q-calendar-scheduler__column-header--after',
          },
          [slot({ scope })],
        )
      }
    }

    function __renderBody(): VNode {
      return h(
        'div',
        {
          class: 'q-calendar-scheduler__body',
        },
        [__renderScrollArea()],
      )
    }

    function __renderScrollArea(): VNode {
      if (isSticky.value === true) {
        return h(
          'div',
          {
            ref: scrollArea,
            class: {
              'q-calendar-scheduler__scroll-area': true,
              'q-calendar__scroll': true,
            },
          },
          [__renderDayContainer()],
        )
      } else if (props.noScroll === true) {
        return __renderPane()
      } else {
        return h(
          'div',
          {
            ref: scrollArea,
            class: {
              'q-calendar-scheduler__scroll-area': true,
              'q-calendar__scroll': true,
            },
          },
          [__renderPane()],
        )
      }
    }

    function __renderPane(): VNode {
      return h(
        'div',
        {
          ref: pane,
          class: 'q-calendar-scheduler__pane',
        },
        [__renderDayContainer()],
      )
    }

    function __renderDayContainer(): VNode {
      return h(
        'div',
        {
          class: 'q-calendar-scheduler__day--container',
        },
        [isSticky.value === true && props.noHeader !== true && __renderHead(), __renderResources()],
      )
    }

    function __renderResources(
      resources: Resource[] | undefined = undefined,
      indentLevel = 0,
      expanded = true,
    ): VNode[] {
      if (resources === undefined) {
        resources = props.modelResources
      }
      return (resources as Resource[])
        .map((resource, resourceIndex) => {
          return __renderResourceRow(
            resource,
            resourceIndex,
            indentLevel,
            resource.children !== undefined ? resource.expanded : expanded,
          )
        })
        .flat()
    }

    function __renderResourceRow(
      resource: Resource,
      resourceIndex: number,
      indentLevel = 0,
      expanded = true,
    ): VNode[] {
      const slotResourceRow = slots['resource-row']
      const style = getResourceHeightStyle(resource)

      const scope = { resource, resourceIndex, indentLevel, expanded }

      const resourceRow = h(
        'div',
        {
          key: resource[props.resourceKey] + '-' + resourceIndex,
          class: {
            'q-calendar-scheduler__resource--row': true,
          },
          style,
        },
        [
          __renderResource(resource, resourceIndex, indentLevel, expanded),
          __renderDayResources(resource, resourceIndex, indentLevel, expanded),
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

    function __renderResource(
      resource: Resource,
      resourceIndex: number,
      indentLevel = 0,
      expanded = true,
    ): VNode {
      const slotResourceLabel = slots['resource-label']
      const style = getResourceHeightStyle(resource)
      const styler = props.resourceStyle || styleDefault
      const label = resource[props.resourceLabel]

      const isFocusable = isFocusableType(props, 'resource', expanded)
      const dragValue = resource[props.resourceKey]

      const scope: ResourceLabelSlotScope = {
        resource,
        timestamps: days.value,
        days: days.value, // deprecated
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
            'q-calendar-scheduler__resource': indentLevel === 0,
            'q-calendar-scheduler__resource--section': indentLevel !== 0,
            ...resourceClass,
            'q-calendar__sticky': isSticky.value === true,
            'q-calendar__hoverable': props.hoverable === true,
            'q-calendar__focusable': isFocusable === true,
          },
          style: {
            ...style,
            ...styler({ scope }),
          },
          ...getDragEventHandlers(props, {
            targetRef: dragOverResource,
            value: dragValue,
            resetValue: '',
            type: 'resource',
            scope,
          }),
          onKeydown: (event: KeyboardEvent) => {
            if (isKeyCode(event, [13, 32])) {
              event.stopPropagation()
              event.preventDefault()
            }
          },
          onKeyup: (event: KeyboardEvent) => {
            // allow selection of resource via Enter or Space keys
            if (isKeyCode(event, [13, 32])) {
              if (emitListeners.value.onClickResource !== undefined) {
                emit('click-resource', { scope, event })
              }
            }
          },
          ...getDefaultMouseEventHandlers('-resource', (event) => {
            return { scope, event }
          }),
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
                  'q-calendar-scheduler__resource--text': true,
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

    function __renderDayResources(
      resource: Resource,
      resourceIndex: number,
      indentLevel = 0,
      expanded = true,
    ): VNode {
      const slot = slots['resource-days']

      const width =
        isSticky.value === true ? convertToUnit(parsedCellWidth.value) : computedWidth.value

      const scope = {
        resource,
        resourceIndex,
        indentLevel,
        expanded,
        cellWidth: width,
        timestamps: days.value,
        days: days.value, // deprecated
      }

      const style = getResourceHeightStyle()

      const data: Record<string, any> = {
        class: 'q-calendar-scheduler__resource--days',
        style,
      }

      return h('div', data, [
        ...__renderDays(resource, resourceIndex, indentLevel, expanded),
        slot && slot({ scope }),
      ])
    }

    function __renderDays(
      resource: Resource,
      resourceIndex: number,
      indentLevel = 0,
      expanded = true,
    ): VNode[] {
      if (days.value.length === 1 && parseInt(String(props.columnCount), 10) > 0) {
        const day = days.value[0]!

        return getColumnIndexes(props.columnCount, props.columnIndexStart).map((columnIndex) =>
          __renderDay(day, columnIndex, resource, resourceIndex, indentLevel, expanded),
        )
      } else {
        return days.value.map((day) =>
          __renderDay(day, 0, resource, resourceIndex, indentLevel, expanded),
        )
      }
    }

    function __renderDay(
      day: Timestamp,
      columnIndex: number,
      resource: Resource,
      resourceIndex: number,
      indentLevel = 0,
      expanded = true,
    ): VNode {
      const slot = slots.day

      const styler = props.dayStyle || dayStyleDefault
      const activeDate = props.noActiveDate !== true && parsedValue.value.date === day.date
      const dragValue =
        day.date +
        ':' +
        resource[props.resourceKey] +
        (columnIndex !== undefined ? ':' + columnIndex : '')
      const droppable = dragOverResource.value === dragValue

      const scope = getScopeForSlot(day, columnIndex) as unknown as SchedulerDaySlotScope
      scope.resource = resource
      scope.resourceIndex = resourceIndex
      scope.indentLevel = indentLevel
      scope.activeDate = activeDate
      scope.droppable = droppable

      const width =
        isSticky.value === true ? convertToUnit(parsedCellWidth.value) : computedWidth.value
      const style: CSSProperties = {
        width,
        maxWidth: width,
        ...styler({ scope }),
        ...getDisabledStyle(day),
      }
      Object.assign(style, getResourceHeightStyle())
      const dayClass = typeof props.dayClass === 'function' ? props.dayClass({ scope }) : {}
      const isFocusable = isFocusableType(props, 'day', expanded)

      return h(
        'div',
        {
          key: day.date + (columnIndex !== undefined ? ':' + columnIndex : ''),
          ref: (el) => registerDate(day, el),
          tabindex: isFocusable === true ? 0 : -1,
          class: {
            'q-calendar-scheduler__day': indentLevel === 0,
            'q-calendar-scheduler__day--section': indentLevel !== 0,
            ...dayClass,
            ...getRelativeClasses(day, scope.outside),
            disabled: scope.disabled === true,
            'q-disabled-day': scope.disabled === true,
            'q-calendar__hoverable': props.hoverable === true,
            'q-calendar__focusable': isFocusable === true,
          },
          style,
          ...getDragEventHandlers(props, {
            targetRef: dragOverResource,
            value: dragValue,
            resetValue: '',
            type: 'day',
            scope,
          }),
          onKeydown: (event: KeyboardEvent) => {
            if (scope.disabled !== true && isKeyCode(event, [13, 32])) {
              event.stopPropagation()
              event.preventDefault()
            }
          },
          onKeyup: (event: KeyboardEvent) => {
            // allow selection of date via Enter or Space keys
            if (scope.disabled !== true && isKeyCode(event, [13, 32])) {
              emittedValue.value = scope.timestamp.date
              if (emitListeners.value.onClickResource !== undefined) {
                emit('click-resource', { scope, event })
              }
            }
          },
          ...getDefaultMouseEventHandlers('-day-resource', (event) => {
            return { scope, event }
          }),
        },
        [slot && slot({ scope }), useFocusHelper()],
      )
    }

    function __renderResourcesError(): VNode {
      return h('div', {}, 'No resources have been defined')
    }

    function __renderScheduler(): VNode {
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
      const hasResources = props.modelResources && props.modelResources.length > 0
      const calendarKey = props.calendarSystem?.id ?? gregorianCalendar.id

      const scheduler = withDirectives(
        h(
          'div',
          {
            key: `${calendarKey}:${startDate.value}`,
            class: 'q-calendar-scheduler',
          },
          [
            hasWidth === true &&
              hasResources === true &&
              isSticky.value !== true &&
              props.noHeader !== true &&
              __renderHead(),
            hasWidth === true && hasResources === true && __renderBody(),
            hasResources === false && __renderResourcesError(),
          ],
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
          () => scheduler,
        )
      }

      return scheduler
    }

    // expose public methods
    expose({
      prev,
      next,
      /**
       * Moves the scheduler view by a relative amount.
       */
      move,
      moveToToday,
      /**
       * Refreshes the scheduler view's current date/time state.
       */
      updateCurrent,
      scrollToDate,
    })
    // Object.assign(vm.proxy, {
    //   prev,
    //   next,
    //   move,
    //   moveToToday,
    //   updateCurrent
    // })

    return (): VNode => __renderCalendar()
  },
})

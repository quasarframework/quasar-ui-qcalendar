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
import { getCalendarDateIdentifier, parseCalendarTimestampSafe } from '../utils/calendarSystem'
// Composables
import useCalendar from '../composables/useCalendar'
import useCommon, {
  isFocusableType,
  useCommonProps,
  type CommonProps,
} from '../composables/useCommon'
import { useAgendaProps, type AgendaProps } from '../composables/useInterval'
import useCalendarDays from '../composables/useCalendarDays'
import {
  getColumnIndexes,
  useColumnProps,
  type ColumnObject,
  type ColumnProps,
} from '../composables/useColumn'
import { useMaxDaysProps, type MaxDaysProps } from '../composables/useMaxDays'
import useTimes, { useTimesProps, type TimesProps } from '../composables/useTimes'
import useRenderValues from '../composables/useRenderValues'
import useMouse, { getRawMouseEvents } from '../composables/useMouse'
import useMove, { useMoveEmits } from '../composables/useMove'
import useEmitListeners from '../composables/useEmitListeners'
import useScrollEvents, { useScrollEmits } from '../composables/useScrollEvents'
import useButton from '../composables/useButton'
import useFocusHelper from '../composables/useFocusHelper'
import useCellWidth, { useCellWidthProps, type CellWidthProps } from '../composables/useCellWidth'
import useCheckChange, { useCheckChangeEmits } from '../composables/useCheckChange'
import useScrollToDate from '../composables/useScrollToDate'
import useEvents from '../composables/useEvents'
import useKeyboard, { useNavigationProps, type NavigationProps } from '../composables/useKeyboard'
import { getDragEventHandlers } from '../composables/useDragAndDrop'
import type {
  AgendaColumnSlotScope,
  AgendaHeadColumnSlotScope,
  HeadDayButtonSlotScope,
  IntervalSlotScope,
  QCalendarAgendaSlots,
} from '../slots'

// Directives
import ResizeObserver from '../directives/ResizeObserver'

// Define the Size type
type Size = {
  width: number
  height: number
}

type AgendaSetupProps = CommonProps &
  AgendaProps &
  ColumnProps &
  MaxDaysProps &
  TimesProps &
  CellWidthProps &
  NavigationProps

const { renderButton } = useButton()

export default defineComponent({
  name: 'QCalendarAgenda',

  directives: { ResizeObserver },

  slots: Object as SlotsType<QCalendarAgendaSlots>,

  props: {
    ...useCommonProps,
    ...useAgendaProps,
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
    ...useCheckChangeEmits,
    ...useMoveEmits,
    ...useScrollEmits,
    /**
     * Interact with an agenda date button.
     *
     * @api-follow getRawMouseEvents
     * @api-scope HeadDayButtonSlotScope
     * @param scope Agenda date button scope.
     * @param event Native mouse or touch event.
     */
    ...getRawMouseEvents('-date'),
    /**
     * Interact with an agenda header day.
     *
     * @api-follow getRawMouseEvents
     * @api-scope IntervalSlotScope
     * @param scope Agenda header day scope.
     * @param event Native mouse or touch event.
     */
    ...getRawMouseEvents('-head-day'),
    /**
     * Interact with an agenda time interval.
     *
     * @api-follow getRawMouseEvents
     * @api-scope IntervalSlotScope
     * @param scope Agenda time interval scope.
     * @param event Native mouse or touch event.
     */
    ...getRawMouseEvents('-time'),
    /**
     * Interact with an agenda column header.
     *
     * @api-follow getRawMouseEvents
     * @api-scope AgendaHeadColumnSlotScope
     * @param scope Agenda column header scope.
     * @param event Native mouse or touch event.
     */
    ...getRawMouseEvents('-head-column'),
    /**
     * Interact with an agenda body column.
     *
     * @api-follow getRawMouseEvents
     * @api-scope AgendaColumnSlotScope
     * @param scope Agenda column scope.
     * @param event Native mouse or touch event.
     */
    ...getRawMouseEvents('-column'),
  ],

  setup(props: AgendaSetupProps, { slots, emit, expose }) {
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
      headDayEventsParentRef = ref<HTMLElement>(),
      headDayEventsChildRef = ref<HTMLElement>(),
      direction = ref<'next' | 'prev'>('next'),
      startDate = ref(initialDate),
      endDate = ref('0000-00-00'),
      maxDaysRendered = ref(0),
      emittedValue = ref(props.modelValue),
      size = reactive({ width: 0, height: 0 }),
      dragOverHeadDayRef = ref(''),
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
    const { onScroll } = useScrollEvents(emit, emitListeners)

    const { isSticky } = useCellWidth(props)

    watch(isSticky, () => {
      // console.info('isSticky', isSticky.value)
    })

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
      __renderAgenda,
      {
        scrollArea,
        pane,
        keyboardActive,
      },
    )

    const {
      // computed
      days,
      // ariaDateTimeFormatter,
      parsedCellWidth,
      // methods
      // styleDefault,
      getScopeForSlot,
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

    const { registerDate, scrollToDate: scrollToDateCalendar } = useScrollToDate(
      props,
      scrollArea,
      days,
    )

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
      parsedView,
      emittedValue,
      direction,
      times,
    })

    const parsedColumnCount = computed(() => {
      const columnCount = parseInt(String(props.columnCount), 10)
      const visibleDayCount =
        days.value.length === 1 && columnCount > 0 ? columnCount : days.value.length
      const leftColumnCount =
        isLeftColumnOptionsValid.value === true ? props.leftColumnOptions!.length : 0
      const rightColumnCount =
        isRightColumnOptionsValid.value === true ? props.rightColumnOptions!.length : 0

      return Math.max(visibleDayCount + leftColumnCount + rightColumnCount, 1)
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
          return (width - scrollWidth.value) / parsedColumnCount.value + 'px'
        }
      }
      return 100 / parsedColumnCount.value + '%'
    })
    watch([days], checkChange, { deep: true, immediate: true })

    watch(
      () => props.modelValue,
      (val, oldVal) => {
        if (emittedValue.value !== val) {
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
    })

    onMounted(() => {
      __initCalendar()
    })

    // public functions

    /**
     * Moves the agenda view by a relative amount.
     *
     * @param amount Number of view units to move. Negative values move backward.
     * @param-example amount -1
     */
    function move(amount: number = 1): void {
      moveCalendar(amount)
    }

    /**
     * Moves the agenda view to today.
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
     * @returns Whether the requested date is rendered and the scroll was applied or queued.
     */
    function scrollToDate(date: string, duration: number = 0): boolean {
      return scrollToDateCalendar(date, duration)
    }

    /**
     * Moves the agenda view forward.
     *
     * @param amount Number of view units to move forward.
     * @param-example amount 1
     */
    function next(amount: number = 1): void {
      move(amount)
    }

    /**
     * Moves the agenda view backward.
     *
     * @param amount Number of view units to move backward.
     * @param-example amount 1
     */
    function prev(amount: number = 1): void {
      move(-amount)
    }

    /**
     * Refreshes the agenda view's current date/time state.
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

    // Render functions

    function __renderHeadColumn(column: ColumnObject, index: number): VNode {
      const slot = slots['head-column']
      const scope: AgendaHeadColumnSlotScope = { column, index, days: days.value }
      const width = isSticky.value === true ? props.cellWidth : computedWidth.value
      const isFocusable = isFocusableType(props, 'weekday')
      const id =
        props.columnOptionsId !== undefined
          ? (column[props.columnOptionsId as keyof ColumnObject] as string)
          : 'id'

      const style: CSSProperties = {
        maxWidth: width,
        width,
      }

      return h(
        'div',
        {
          key: id,
          tabindex: isFocusable === true ? 0 : -1,
          class: {
            'q-calendar-agenda__head--day': true,
            'q-column-day': true,
            'q-calendar__hoverable': props.hoverable === true,
            'q-calendar__focusable': isFocusable === true,
          },
          style,
          ...getDragEventHandlers(props, {
            targetRef: dragOverHeadDayRef,
            value: id,
            resetValue: '',
            type: 'head-column',
            scope,
          }),
          ...getDefaultMouseEventHandlers('-head-column', (event) => {
            return { scope, event }
          }),
        },
        [
          props.noDefaultHeaderText !== true && __renderHeadColumnLabel(column),
          slot && slot({ scope }),
          useFocusHelper(),
        ],
      )
    }

    function __renderHeadColumnLabel(column: ColumnObject): VNode {
      const slot = slots['head-column-label']
      const scope = { column }
      const label =
        props.columnOptionsLabel !== undefined ? column[props.columnOptionsLabel] : column.label

      const vNode = h(
        'div',
        {
          class: {
            'q-calendar-agenda__head--weekday': true,
            ['q-calendar__' + props.weekdayAlign]: true,
            ellipsis: true,
          },
          style: {
            alignSelf: 'center',
          },
        },
        [
          slot && slot({ scope }),
          !slot &&
            h(
              'span',
              {
                class: 'ellipsis',
              },
              label,
            ),
        ],
      )

      return props.dateHeader === 'stacked'
        ? vNode
        : h(
            'div',
            {
              class: 'q-calendar__header--inline',
              style: {
                height: '100%',
              },
            },
            [vNode],
          )
    }

    // ---

    function __renderHead(): VNode {
      const children = [__renderHeadDaysColumn()]

      return h(
        'div',
        {
          roll: 'presentation',
          class: {
            'q-calendar-agenda__head': true,
            'q-calendar__sticky': isSticky.value === true,
          },
        },
        children,
      )
    }

    function __renderHeadDaysColumn(): VNode {
      return h(
        'div',
        {
          ref: headerColumnRef,
          class: {
            'q-calendar-agenda__head--days__column': true,
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
            'q-calendar-agenda__head--days__weekdays': true,
          },
        },
        __renderHeadDays(),
      )
    }

    function __renderHeadDaysEventsRow(): VNode {
      const slot = slots['head-days-events']

      nextTick(() => {
        if (headDayEventsChildRef.value && props.columnCount === 0 && window) {
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
            'q-calendar-agenda__head--days__event': true,
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
              [slot({ scope: { days: days.value, ref: headDayEventsChildRef } })],
            ),
          ...__renderHeadDaysEvents(),
        ],
      )
    }

    function __renderHeadDays(): VNode | VNode[] {
      const columnCount = parseInt(String(props.columnCount), 10)

      if (days.value.length === 1 && columnCount > 0) {
        const day = days.value[0]!

        return [
          isLeftColumnOptionsValid.value === true
            ? props.leftColumnOptions!.map((column: ColumnObject, index: number) =>
                __renderHeadColumn(column, index),
              )
            : [],

          ...getColumnIndexes(columnCount, props.columnIndexStart).map((columnIndex) =>
            __renderHeadDay(day, columnIndex),
          ),

          isRightColumnOptionsValid.value === true
            ? props.rightColumnOptions!.map((column: ColumnObject, index: number) =>
                __renderHeadColumn(column, index),
              )
            : [],
        ].flat() // filter empty arrays
      } else {
        return [
          isLeftColumnOptionsValid.value === true
            ? props.leftColumnOptions!.map((column: ColumnObject, index: number) =>
                __renderHeadColumn(column, index),
              )
            : [],

          ...days.value.map((day) => __renderHeadDay(day)),

          isRightColumnOptionsValid.value === true
            ? props.rightColumnOptions!.map((column: ColumnObject, index: number) =>
                __renderHeadColumn(column, index),
              )
            : [],
        ].flat() // filter empty arrays
      }
    }

    function __renderHeadDaysEvents(): VNode[] {
      const columnCount = parseInt(String(props.columnCount), 10)
      if (days.value.length === 1 && columnCount > 0) {
        const day = days.value[0]!

        return [
          ...getColumnIndexes(columnCount, props.columnIndexStart).map((columnIndex) =>
            __renderHeadDayEvent(day, columnIndex),
          ),
        ]
      } else {
        return days.value.map((day) => __renderHeadDayEvent(day, 0))
      }
    }

    function __renderHeadDay(day: Timestamp, columnIndex?: number): VNode {
      const headDaySlot = slots['head-day']
      const headDateSlot = slots['head-date']
      const activeDate = props.noActiveDate !== true && __isActiveDate(day)

      const scope: IntervalSlotScope = getScopeForSlot(day, columnIndex ?? 0)
      scope.activeDate = activeDate
      scope.droppable = dragOverHeadDayRef.value === day.date
      scope.disabled =
        scope.disabled === true ||
        (props.disabledWeekdays ? props.disabledWeekdays.includes(Number(day.weekday)) : false)

      const width = isSticky.value === true ? props.cellWidth : computedWidth.value
      const styler = props.weekdayStyle || dayStyleDefault
      const style: CSSProperties = {
        width,
        maxWidth: width,
        ...styler({ scope }),
        ...getDisabledStyle(day),
      }
      if (isSticky.value === true) {
        style.minWidth = width
      }
      const weekdayClass =
        typeof props.weekdayClass === 'function' ? props.weekdayClass({ scope }) : {}
      const isFocusable = isFocusableType(props, 'weekday')

      const data: Record<string, any> = {
        key: day.date + (columnIndex !== undefined ? '-' + columnIndex : ''),
        ref: (el: HTMLElement | null) => {
          if (el !== null) {
            datesRef.value[day.date] = el
          }
          registerDate(day, el)
        },
        tabindex: isFocusable === true ? 0 : -1,
        class: {
          'q-calendar-agenda__head--day': true,
          ...weekdayClass,
          ...getRelativeClasses(day, scope.outside),
          'q-active-date': activeDate,
          disabled: scope.disabled === true,
          'q-disabled-day': scope.disabled === true,
          'q-calendar__hoverable': props.hoverable === true,
          'q-calendar__focusable': isFocusable === true,
        },
        style,
        ...getDragEventHandlers(props, {
          targetRef: dragOverHeadDayRef,
          value: day.date,
          resetValue: '',
          type: 'head-day',
          scope,
        }),
        onFocus: () => {
          if (isFocusable === true) {
            focusRef.value = day.date
          }
        },
        ...getDefaultMouseEventHandlers('-head-day', (event) => {
          return { scope, event }
        }),
      }

      return h('div', data, [
        // head-day slot replaces everything below it
        headDaySlot !== undefined && headDaySlot({ scope }),
        headDaySlot === undefined && __renderDateHeader(day),
        headDaySlot === undefined && headDateSlot && headDateSlot({ scope }),
        useFocusHelper(),
      ])
    }

    function __renderDateHeader(day: Timestamp): VNode[] | VNode | void {
      if (props.dateHeader === 'stacked') {
        return [
          props.noDefaultHeaderText !== true && __renderHeadWeekday(day),
          props.noDefaultHeaderBtn !== true && __renderHeadDayDate(day),
        ].filter((v): v is VNode => v !== false)
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

      const scope: IntervalSlotScope = getScopeForSlot(day, columnIndex)
      scope.activeDate = activeDate
      scope.disabled =
        scope.disabled === true ||
        (props.disabledWeekdays ? props.disabledWeekdays.includes(Number(day.weekday)) : false)

      const width = isSticky.value === true ? props.cellWidth : computedWidth.value
      const style: CSSProperties = {
        width,
        maxWidth: width,
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
            'q-calendar-agenda__head--day__event': true,
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
      const scope: IntervalSlotScope = getScopeForSlot(day, 0)
      scope.shortWeekdayLabel = props.shortWeekdayLabel

      const data: Record<string, any> = {
        class: {
          'q-calendar-agenda__head--weekday': true,
          ['q-calendar__' + props.weekdayAlign]: true,
          'q-calendar__ellipsis': true,
        },
      }

      return h(
        'div',
        data,
        (slot && slot({ scope })) || __renderHeadWeekdayLabel(day, props.shortWeekdayLabel),
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
          class: 'q-calendar__ellipsis',
        },
        weekdayLabel,
      )
    }

    function __renderHeadDayDate(day: Timestamp): VNode {
      const data: Record<string, any> = {
        class: {
          'q-calendar-agenda__head--date': true,
          ['q-calendar__' + props.dateAlign]: true,
        },
      }

      return h('div', data, __renderHeadDayBtn(day))
    }

    function __renderHeadDayBtn(day: Timestamp): VNode[] | VNode {
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
          'q-calendar-agenda__head--day__label': true,
          'q-calendar__button': true,
          'q-calendar__button--round': props.dateType === 'round',
          'q-calendar__button--rounded': props.dateType === 'rounded',
          'q-calendar__button--bordered': day.current === true,
          'q-calendar__focusable': true,
        },
        disabled: scope.disabled === true,
        onKeydown: (e: KeyboardEvent): void => {
          if (scope.disabled !== true && isKeyCode(e, [13, 32])) {
            e.stopPropagation()
            e.preventDefault()
          }
        },
        onKeyup: (e: KeyboardEvent): void => {
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
        ? headDayButtonSlot({ scope })
        : renderButton(props, data, headDayLabelSlot ? headDayLabelSlot({ scope }) : dayLabel)
    }

    function __renderBody(): VNode {
      return h(
        'div',
        {
          class: 'q-calendar-agenda__body',
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
              'q-calendar-agenda__scroll-area': true,
              'q-calendar__scroll': true,
            },
            onScroll,
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
              'q-calendar-agenda__scroll-area': true,
              'q-calendar__scroll': true,
            },
            onScroll,
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
          class: 'q-calendar-agenda__pane',
        },
        [__renderDayContainer()],
      )
    }

    function __renderDayContainer(): VNode {
      const slot = slots['day-container']

      return h(
        'div',
        {
          class: 'q-calendar-agenda__day-container',
        },
        [
          isSticky.value === true && props.noHeader !== true && __renderHead(),
          h(
            'div',
            {
              style: {
                display: 'flex',
                flexDirection: 'row',
                height: '100%',
              },
            },
            [...(__renderDays() || [])].flat(),
          ),
          slot && slot({ scope: { days: days.value } }),
        ],
      )
    }

    function __renderDays(): VNode[] | undefined {
      const columnCount = parseInt(String(props.columnCount), 10)

      if (days.value.length === 1 && columnCount > 0) {
        const day = days.value[0]!

        return [
          isLeftColumnOptionsValid.value === true
            ? props.leftColumnOptions!.map((column: ColumnObject, index: number) =>
                __renderColumn(column, index),
              )
            : [],

          ...getColumnIndexes(columnCount, props.columnIndexStart).map((columnIndex) =>
            __renderDay(day, 0, columnIndex),
          ),

          isRightColumnOptionsValid.value === true
            ? props.rightColumnOptions!.map((column: ColumnObject, index: number) =>
                __renderColumn(column, index),
              )
            : [],
        ].flat() // filter empty arrays
      } else {
        return [
          isLeftColumnOptionsValid.value === true
            ? props.leftColumnOptions!.map((column: ColumnObject, index: number) =>
                __renderColumn(column, index),
              )
            : [],

          ...days.value.map((day, index) => __renderDay(day, index, 0)),

          isRightColumnOptionsValid.value === true
            ? props.rightColumnOptions!.map((column: ColumnObject, index: number) =>
                __renderColumn(column, index),
              )
            : [],
        ].flat() // filter empty arrays
      }
    }

    function __renderColumn(column: ColumnObject, index: number): VNode {
      const slot = slots.column
      const scope: AgendaColumnSlotScope = { column, days: days.value, index }
      const width = isSticky.value === true ? props.cellWidth : computedWidth.value
      const isFocusable = isFocusableType(props, 'day')
      const id = props.columnOptionsId !== undefined ? column[props.columnOptionsId] : undefined

      return h(
        'div',
        {
          key: id,
          tabindex: isFocusable === true ? 0 : -1,
          class: {
            'q-calendar-agenda__day': true,
            'q-column-day': true,
            'q-calendar__hoverable': props.hoverable === true,
            'q-calendar__focusable': isFocusable === true,
          },
          style: {
            maxWidth: width,
            width,
          },
          ...getDragEventHandlers(props, {
            targetRef: dragOverHeadDayRef,
            value: id,
            resetValue: '',
            type: 'column',
            scope,
          }),
          ...getDefaultMouseEventHandlers('-column', (event) => {
            return { scope, event }
          }),
        },
        [slot && slot({ scope })],
      )
    }

    function __renderDay(day: Timestamp, _dayIndex: number, columnIndex: number): VNode {
      const dayHeight = parseInt(String(props.dayHeight), 10)
      const dayMinHeight = parseInt(String(props.dayMinHeight), 10)
      const slot = slots.day
      const scope: IntervalSlotScope = getScopeForSlot(day, columnIndex)
      const width = isSticky.value === true ? props.cellWidth : computedWidth.value
      const styler = props.dayStyle || dayStyleDefault
      const dayClass = typeof props.dayClass === 'function' ? props.dayClass({ scope }) : {}
      const style: CSSProperties = {
        width,
        maxWidth: width,
        ...styler({ scope }),
        ...getDisabledStyle(day),
      }
      if (isSticky.value === true) {
        style.minWidth = width
      }
      style.height = dayHeight > 0 ? convertToUnit(dayHeight) : 'auto'
      if (dayMinHeight > 0) {
        style.minHeight = convertToUnit(dayMinHeight)
      }

      return h(
        'div',
        {
          key: day.date + (columnIndex !== undefined ? ':' + columnIndex : ''),
          ref: (el) => registerDate(day, el),
          class: {
            'q-calendar-agenda__day': true,
            ...dayClass,
            ...getRelativeClasses(day, scope.outside),
            disabled: scope.disabled === true,
            'q-disabled-day': scope.disabled === true,
          },
          style,
        },
        [slot && slot({ scope })],
      )
    }

    function __renderAgenda(): VNode {
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
      const calendarKey = props.calendarSystem?.id ?? gregorianCalendar.id

      const agenda = withDirectives(
        h(
          'div',
          {
            class: 'q-calendar-agenda',
            key: `${calendarKey}:${startDate.value}`,
          },
          [
            hasWidth === true &&
              isSticky.value !== true &&
              props.noHeader !== true &&
              __renderHead(),
            hasWidth === true && __renderBody(),
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
          () => agenda,
        )
      }

      return agenda
    }

    // expose public methods
    expose({
      prev,
      next,
      /**
       * Moves the agenda view by a relative amount.
       */
      move,
      moveToToday,
      /**
       * Refreshes the agenda view's current date/time state.
       */
      updateCurrent,
      scrollToDate,
    })

    // Object.assign(vm.proxy, {
    //   prev,
    //   next,
    //   move,
    //   moveToToday,
    //   updateCurrent,
    // })

    return (): VNode => __renderCalendar()
  },
})

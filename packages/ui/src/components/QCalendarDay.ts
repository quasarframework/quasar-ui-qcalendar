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
  SetupContext,
  VNode,
} from 'vue'

// Utility
import {
  getDateTime,
  getDayIdentifier,
  getDayTimeIdentifier,
  parsed,
  parseTimestamp,
  today,
  Timestamp,
} from '../utils/Timestamp'

import { convertToUnit, minCharWidth } from '../utils/helpers'

// Composables
import useCalendar from '../composables/useCalendar'
import useCommon, { useCommonProps } from '../composables/useCommon'
import useInterval, { useIntervalProps, IntervalProps } from '../composables/useInterval'
import { useColumnProps } from '../composables/useColumn'
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
import useEvents from '../composables/useEvents'
import useKeyboard, { useNavigationProps } from '../composables/useKeyboard'

// Directives
import ResizeObserver from '../directives/ResizeObserver'

// Define the Size type
type Size = {
  width: number
  height: number
}

const { renderButton } = useButton()

export default defineComponent({
  name: 'QCalendarDay',

  directives: { ResizeObserver },

  props: {
    ...useCommonProps,
    ...useIntervalProps,
    ...useColumnProps,
    ...useMaxDaysProps,
    ...useTimesProps,
    ...useCellWidthProps,
    ...useNavigationProps,
  },

  emits: [
    'update:model-value',
    ...useCheckChangeEmits,
    ...useMoveEmits,
    ...getRawMouseEvents('-date'),
    ...getRawMouseEvents('-interval'),
    ...getRawMouseEvents('-head-intervals'),
    ...getRawMouseEvents('-head-day'),
    ...getRawMouseEvents('-time'),
  ],

  setup(props: IntervalProps, { slots, emit, expose }: SetupContext) {
    const scrollArea = ref(null),
      pane = ref(null),
      headerColumnRef = ref(null),
      focusRef = ref<string>(props.modelValue || today()),
      focusValue = ref<Timestamp>(parsed(props.modelValue || today()) as Timestamp),
      datesRef = ref<Record<string, HTMLElement>>({}),
      headDayEventsParentRef = ref<HTMLElement>(),
      headDayEventsChildRef = ref<HTMLElement>(),
      // intervalsHeadRef = ref(null),
      // intervalsRef = ref({}),
      direction = ref<'next' | 'prev'>('next'),
      startDate = ref(props.modelValue || today()),
      endDate = ref('0000-00-00'),
      maxDaysRendered = ref(0),
      emittedValue = ref(props.modelValue || today()),
      size = reactive({ width: 0, height: 0 }),
      dragOverHeadDayRef = ref(''),
      dragOverInterval = ref(0),
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

    const { times, setCurrent, updateCurrent } = useTimes(props)

    // update dates
    updateCurrent()
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
      getRelativeClasses,
    } = useCommon(props, { startDate, endDate, times })

    const parsedValue = computed(() => {
      return parseTimestamp(props.modelValue, times.now) || parsedStart.value || times.today
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
      __renderDaily,
      {
        scrollArea,
        pane,
      },
    )

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
      heightToMinutes,
      timeDurationHeight,
      timeStartPos,
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

    const parsedColumnCount = computed(() => {
      const columnCount = parseInt(String(props.columnCount), 10)
      if (parsedView.value === 'day' && columnCount > 1) {
        return columnCount
      } else if (parsedView.value === 'day' && props.maxDays && props.maxDays > 1) {
        return props.maxDays
      }
      return days.value.length
    })

    const intervalsWidth = computed(() => {
      if (rootRef.value) {
        return parseInt(
          window.getComputedStyle(rootRef.value).getPropertyValue('--calendar-intervals-width'),
          10,
        )
      }
      return 0
    })

    const computedWidth = computed(() => {
      if (rootRef.value) {
        const width = size.width || rootRef.value.getBoundingClientRect().width
        if (width && intervalsWidth.value && parsedColumnCount.value) {
          return (width - scrollWidth.value - intervalsWidth.value) / parsedColumnCount.value + 'px'
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
      if (focusRef.value && datesRef.value[focusRef.value]) {
        datesRef.value[focusRef.value]!.focus()
      } else {
        // if focusRef is not in the list of current dates of dateRef,
        // then assume month is changing
        tryFocus()
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
      // intervalsRef.value = {}
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

    // function __isActiveInterval (day) {
    //   return __isActiveDate(day)
    //     && day.hasTime
    //     && emittedValue.value.hasTime
    //     && day.time === emittedValue.value.time
    // }

    // Render functions

    function __renderHead(): VNode {
      return h(
        'div',
        {
          roll: 'presentation',
          class: {
            'q-calendar-day__head': true,
            'q-calendar__sticky': isSticky.value === true,
          },
          style: {
            marginRight: scrollWidth.value + 'px',
          },
        },
        [__renderHeadIntervals(), __renderHeadDaysColumn()],
      )
    }

    /*
     * Outputs the header that is above the intervals
     */
    function __renderHeadIntervals(): VNode {
      const slot = slots['head-intervals']

      const scope = {
        timestamps: days.value,
        days: days.value, // deprecated
        date: props.modelValue,
      }

      return h(
        'div',
        {
          class: {
            'q-calendar-day__head--intervals': true,
            'q-calendar__sticky': isSticky.value === true,
          },
          ...getDefaultMouseEventHandlers('-head-intervals', (event) => {
            return { scope, event }
          }),
        },
        [slot && slot({ scope })],
      )
    }

    function __renderHeadDaysColumn(): VNode {
      return h(
        'div',
        {
          ref: headerColumnRef,
          class: {
            'q-calendar-day__head--days__column': true,
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
            'q-calendar-day__head--days__weekdays': true,
          },
        },
        [...__renderHeadDays()],
      )
    }

    function __renderHeadDaysEventsRow(): VNode {
      const slot = slots['head-days-events']
      const columnCount = parseInt(String(props.columnCount), 10)

      nextTick(() => {
        if (headDayEventsChildRef.value && columnCount === 0 && window) {
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
            'q-calendar-day__head--days__event': true,
          },
        },
        [
          slot &&
            h(
              'div',
              {
                ref: headDayEventsParentRef,
                // TODO: this needs to be a class
                style: {
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  right: 0,
                  overflow: 'hidden',
                  zIndex: 1,
                },
              },
              [slot({ scope: { days: days.value, ref: headDayEventsChildRef } })],
            ),
          ...__renderHeadDaysEvents(),
        ],
      )
    }

    function __renderHeadDays(): VNode[] {
      const columnCount = parseInt(String(props.columnCount), 10)
      const columnIndexStart = parseInt(String(props.columnIndexStart), 10)

      if (days.value.length === 1 && columnCount > 0) {
        return Array.apply(null, new Array(columnCount))
          .map((_, i) => i + columnIndexStart)
          .map((columnIndex) => __renderHeadDay(days.value[0], columnIndex))
      } else {
        return days.value.map((day) => __renderHeadDay(day, 0))
      }
    }

    function __renderHeadDaysEvents(): VNode[] {
      const columnCount = parseInt(String(props.columnCount), 10)
      const columnIndexStart = parseInt(String(props.columnIndexStart), 10)

      if (days.value.length === 1 && columnCount > 0) {
        return Array.apply(null, new Array(columnCount))
          .map((_, i) => i + columnIndexStart)
          .map((columnIndex) => __renderHeadDayEvent(days.value[0], columnIndex))
          .filter((node): node is VNode => node !== undefined)
      } else {
        return days.value
          .map((day) => __renderHeadDayEvent(day, 0))
          .filter((node): node is VNode => node !== undefined)
      }
    }
    function __renderHeadDay(day: Timestamp, columnIndex: number): VNode {
      const headDaySlot = slots['head-day']
      const headDateSlot = slots['head-date']
      const activeDate = props.noActiveDate !== true && __isActiveDate(day)

      const scope = getScopeForSlot(day, columnIndex)
      scope.activeDate = activeDate
      scope.droppable = dragOverHeadDayRef.value === day.date
      scope.disabled = props.disabledWeekdays
        ? props.disabledWeekdays.includes(Number(day.weekday))
        : false

      const width = isSticky.value === true ? props.cellWidth : computedWidth.value
      const styler = props.weekdayStyle || dayStyleDefault
      const style: CSSProperties = {
        width,
        maxWidth: width,
        minWidth: width,
        ...styler({ scope }),
      }
      if (isSticky.value === true) {
        style.minWidth = width
      }
      const weekdayClass =
        typeof props.weekdayClass === 'function' ? props.weekdayClass({ scope }) : {}
      const isFocusable = props.focusable === true && props.focusType.includes('weekday')
      const key = day.date + (columnIndex !== undefined ? '-' + columnIndex : '')

      const data: Record<string, any> = {
        key,
        ref: (el: HTMLElement) => {
          datesRef.value[key] = el
        },
        tabindex: isFocusable === true ? 0 : -1,
        class: {
          'q-calendar-day__head--day': true,
          ...weekdayClass,
          ...getRelativeClasses(day),
          'q-active-date': activeDate,
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
          if (day.disabled !== true && isKeyCode(e, [13, 32])) {
            e.stopPropagation()
            e.preventDefault()
          }
        },
        onKeyup: (e: KeyboardEvent) => {
          // allow selection of date via Enter or Space keys
          if (day.disabled !== true && isKeyCode(e, [13, 32])) {
            emittedValue.value = day.date
          }
        },
        ...getDefaultMouseEventHandlers('-head-day', (event) => {
          return { scope, event }
        }),
        onDragenter: (e: DragEvent) => {
          if (props.dragEnterFunc !== undefined && typeof props.dragEnterFunc === 'function') {
            props.dragEnterFunc(e, 'head-day', { scope }) === true
              ? (dragOverHeadDayRef.value = day.date)
              : (dragOverHeadDayRef.value = '')
          }
        },
        onDragover: (e: DragEvent) => {
          if (props.dragOverFunc !== undefined && typeof props.dragOverFunc === 'function') {
            props.dragOverFunc(e, 'head-day', { scope }) === true
              ? (dragOverHeadDayRef.value = day.date)
              : (dragOverHeadDayRef.value = '')
          }
        },
        onDragleave: (e: DragEvent) => {
          if (props.dragLeaveFunc !== undefined && typeof props.dragLeaveFunc === 'function') {
            props.dragLeaveFunc(e, 'head-day', { scope }) === true
              ? (dragOverHeadDayRef.value = day.date)
              : (dragOverHeadDayRef.value = '')
          }
        },
        onDrop: (e: DragEvent) => {
          if (props.dropFunc !== undefined && typeof props.dropFunc === 'function') {
            props.dropFunc(e, 'head-day', { scope }) === true
              ? (dragOverHeadDayRef.value = day.date)
              : (dragOverHeadDayRef.value = '')
          }
        },
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
        ].filter((node): node is VNode => node !== undefined)
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

    function __renderHeadDayEvent(day: Timestamp, columnIndex: number): VNode | VNode[] | void {
      const headDayEventSlot = slots['head-day-event']
      const activeDate = props.noActiveDate !== true && __isActiveDate(day)

      const scope = getScopeForSlot(day, columnIndex)
      scope.activeDate = activeDate
      scope.disabled = props.disabledWeekdays
        ? props.disabledWeekdays.includes(Number(day.weekday))
        : false

      const width =
        isSticky.value === true ? convertToUnit(parsedCellWidth.value) : computedWidth.value
      const style: CSSProperties = {
        width,
        maxWidth: width,
        minWidth: width,
      }
      if (isSticky.value === true) {
        style.minWidth = width
      }

      return h(
        'div',
        {
          key: 'event-' + day.date + (columnIndex !== undefined ? '-' + columnIndex : ''),
          class: {
            'q-calendar-day__head--day__event': true,
            ...getRelativeClasses(day),
            'q-active-date': activeDate,
          },
          style,
        },
        [headDayEventSlot && headDayEventSlot({ scope })],
      )
    }

    function __renderHeadWeekday(day: Timestamp): VNode | VNode[] | void {
      const slot = slots['head-weekday-label']
      const shortWeekdayLabel = props.shortWeekdayLabel === true

      const scope = getScopeForSlot(day, 0)
      scope.shortWeekdayLabel = props.shortWeekdayLabel
      scope.disabled = props.disabledWeekdays
        ? props.disabledWeekdays.includes(Number(day.weekday))
        : false

      const data: Record<string, any> = {
        class: {
          'q-calendar-day__head--weekday': true,
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
      const weekdayLabel = weekdayFormatter.value(
        day,
        shortWeekdayLabel ||
          (props.weekdayBreakpoints[0] > 0 && parsedCellWidth.value <= props.weekdayBreakpoints[0]),
      )
      return h(
        'span',
        {
          class: 'q-calendar-day__head--weekday-label q-calendar__ellipsis',
        },
        props.weekdayBreakpoints[1] > 0 && parsedCellWidth.value <= props.weekdayBreakpoints[1]
          ? minCharWidth(weekdayLabel, Number(props.minWeekdayLabel))
          : weekdayLabel,
      )
    }

    function __renderHeadDayDate(day: Timestamp): VNode {
      const data: Record<string, any> = {
        class: {
          'q-calendar-day__head--date': true,
          ['q-calendar__' + props.dateAlign]: true,
        },
      }

      return h('div', data, __renderHeadDayBtn(day))
    }

    function __renderHeadDayBtn(day: Timestamp): VNode | VNode[] {
      const activeDate = props.noActiveDate !== true && __isActiveDate(day)
      const dayLabel = dayFormatter.value(day, false)
      const headDayLabelSlot = slots['head-day-label']
      const headDayButtonSlot = slots['head-day-button']

      const scope = {
        dayLabel,
        timestamp: day,
        activeDate,
        disabled: props.disabledWeekdays
          ? props.disabledWeekdays.includes(Number(day.weekday))
          : false,
      }

      const data: Record<string, any> = {
        class: {
          'q-calendar-day__head--day__label': true,
          'q-calendar__button': true,
          'q-calendar__button--round': props.dateType === 'round',
          'q-calendar__button--rounded': props.dateType === 'rounded',
          'q-calendar__button--bordered': day.current === true,
          'q-calendar__focusable': true,
        },
        disabled: day.disabled,
        onKeydown: (e: KeyboardEvent) => {
          if (day.disabled !== true && isKeyCode(e, [13, 32])) {
            e.stopPropagation()
            e.preventDefault()
          }
        },
        onKeyup: (e: KeyboardEvent) => {
          // allow selection of date via Enter or Space keys
          if (day.disabled !== true && isKeyCode(e, [13, 32])) {
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

    function __renderColumnHeaderBefore(day: Timestamp, columnIndex: number): VNode | void {
      const slot = slots['column-header-before']
      if (slot) {
        const scope = { timestamp: day, columnIndex }
        return h(
          'div',
          {
            class: 'q-calendar-day__column-header--before',
          },
          [slot({ scope })],
        )
      }
    }

    function __renderColumnHeaderAfter(day: Timestamp, columnIndex: number): VNode | void {
      const slot = slots['column-header-after']
      if (slot) {
        const scope = { timestamp: day, columnIndex }
        return h(
          'div',
          {
            class: 'q-calendar-day__column-header--after',
          },
          [slot({ scope })],
        )
      }
    }

    function __renderBody(): VNode {
      return h(
        'div',
        {
          class: 'q-calendar-day__body',
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
              'q-calendar-day__scroll-area': true,
              'q-calendar__scroll': true,
            },
          },
          [isSticky.value !== true && __renderBodyIntervals(), __renderDayContainer()],
        )
      } else if (props.noScroll === true) {
        return __renderPane()
      } else {
        return h(
          'div',
          {
            ref: scrollArea,
            class: {
              'q-calendar-day__scroll-area': true,
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
          class: 'q-calendar-day__pane',
        },
        [__renderBodyIntervals(), __renderDayContainer()],
      )
    }

    function __renderDayContainer(): VNode {
      const slot = slots['day-container']

      return h(
        'div',
        {
          class: 'q-calendar-day__day-container',
        },
        [
          isSticky.value === true && props.noHeader !== true && __renderHead(),
          h(
            'div',
            {
              style: {
                display: 'flex',
                flexDirection: 'row',
              },
            },
            [isSticky.value === true && __renderBodyIntervals(), ...__renderDays()],
          ),
          slot && slot({ scope: { days: days.value } }),
        ],
      )
    }

    function __renderDays(): VNode[] {
      const columnCount = parseInt(String(props.columnCount), 10)
      const columnIndexStart = parseInt(String(props.columnIndexStart), 10)

      if (days.value.length === 1 && columnCount > 0) {
        return Array.apply(null, new Array(columnCount))
          .map((_, i) => i + columnIndexStart)
          .map((i) => __renderDay(days.value[0], 0, i))
      } else {
        return days.value.map((day, index) => __renderDay(day, index, 0))
      }
    }

    function __renderDay(day: Timestamp, dayIndex: number, columnIndex: number): VNode {
      const slot = slots['day-body']
      const scope = getScopeForSlot(day, columnIndex)
      const width = isSticky.value === true ? props.cellWidth : computedWidth.value
      const style: CSSProperties = {
        width,
        maxWidth: width,
        minWidth: width,
      }
      if (isSticky.value === true) {
        style.minWidth = width
      }

      return h(
        'div',
        {
          key: day.date + (columnIndex !== undefined ? ':' + columnIndex : ''),
          class: {
            'q-calendar-day__day': true,
            ...getRelativeClasses(day),
          },
          style,
        },
        [...__renderDayIntervals(dayIndex, columnIndex), slot && slot({ scope })],
      )
    }

    function __renderDayIntervals(index: number, columnIndex: number): VNode[] {
      return intervals.value[index].map((interval) => __renderDayInterval(interval, columnIndex))
    }

    function __renderDayInterval(interval: Timestamp, columnIndex: number): VNode {
      // const activeInterval = __isActiveInterval(interval)
      const height = convertToUnit(props.intervalHeight)
      const styler = props.intervalStyle || styleDefault
      const slotDayInterval = slots['day-interval']

      const scope = getScopeForSlot(interval, columnIndex)
      scope.droppable = dragOverInterval.value === getDayTimeIdentifier(interval)

      const intervalClass =
        typeof props.intervalClass === 'function' ? props.intervalClass({ scope }) : {}
      const isFocusable = props.focusable === true && props.focusType.includes('interval')
      const dateTime = getDateTime(interval)

      const style: CSSProperties = {
        height,
        ...styler({ scope }),
      }

      const data: Record<string, any> = {
        key: dateTime,
        // ref: (el) => { intervalsRef.value[ dateTime ] = el },
        tabindex: isFocusable === true ? 0 : -1,
        class: {
          'q-calendar-day__day-interval': interval.minute === 0,
          'q-calendar-day__day-interval--section': interval.minute !== 0,
          ...intervalClass,
          ...getIntervalClasses(
            interval,
            Array.from(props.selectedDates),
            props.selectedStartEndDates,
          ),
          'q-calendar__hoverable': props.hoverable === true,
          'q-calendar__focusable': isFocusable === true,
        },
        style,
        onDragenter: (e: DragEvent) => {
          if (props.dragEnterFunc !== undefined && typeof props.dragEnterFunc === 'function') {
            props.dragEnterFunc(e, 'interval', { scope }) === true
              ? (dragOverInterval.value = getDayTimeIdentifier(interval))
              : (dragOverInterval.value = 0)
          }
        },
        onDragover: (e: DragEvent) => {
          if (props.dragOverFunc !== undefined && typeof props.dragOverFunc === 'function') {
            props.dragOverFunc(e, 'interval', { scope }) === true
              ? (dragOverInterval.value = getDayTimeIdentifier(interval))
              : (dragOverInterval.value = 0)
          }
        },
        onDragleave: (e: DragEvent) => {
          if (props.dragLeaveFunc !== undefined && typeof props.dragLeaveFunc === 'function') {
            props.dragLeaveFunc(e, 'interval', { scope }) === true
              ? (dragOverInterval.value = getDayTimeIdentifier(interval))
              : (dragOverInterval.value = 0)
          }
        },
        onDrop: (e: DragEvent) => {
          if (props.dropFunc !== undefined && typeof props.dropFunc === 'function') {
            props.dropFunc(e, 'interval', { scope }) === true
              ? (dragOverInterval.value = getDayTimeIdentifier(interval))
              : (dragOverInterval.value = 0)
          }
        },
        onKeydown: (event: KeyboardEvent) => {
          if (isKeyCode(event, [13, 32])) {
            event.stopPropagation()
            event.preventDefault()
          }
        },
        onKeyup: (event: KeyboardEvent) => {
          // allow selection of date via Enter or Space keys
          if (isKeyCode(event, [13, 32])) {
            const scope = getScopeForSlot(interval, columnIndex)
            emittedValue.value = scope.timestamp.date
            if (emitListeners.value.onClickTime !== undefined) {
              emit('click-time', { scope, event })
            }
          }
        },
        ...getDefaultMouseEventHandlers('-time', (event: MouseEvent | TouchEvent) => {
          const scope = getScopeForSlot(
            getTimestampAtEventInterval(
              event as MouseEvent & TouchEvent,
              interval,
              props.timeClicksClamped,
              times.now,
            ),
            columnIndex,
          )
          return { scope, event }
        }),
      }

      if (props.noAria !== true) {
        data.ariaLabel = ariaDateTimeFormatter.value(interval, false)
      }

      const children = slotDayInterval ? slotDayInterval({ scope }) : undefined

      return h('div', data, [children, useFocusHelper()])
    }

    function __renderBodyIntervals(): VNode {
      const data: Record<string, any> = {
        ariaHidden: 'true',
        class: {
          'q-calendar-day__intervals-column': true,
          'q-calendar__ellipsis': true,
          'q-calendar__sticky': isSticky.value === true,
        },
        ...getDefaultMouseEventHandlers('-interval', (event) => {
          const timestamp = getTimestampAtEvent(
            event as MouseEvent & TouchEvent,
            parsedStart.value,
            props.timeClicksClamped,
            times.now,
          )
          return { scope: { timestamp }, event }
        }),
      }

      return h('div', data, __renderIntervalLabels())
    }

    function __renderIntervalLabels(): VNode[] {
      return intervals.value[0].map((interval) => __renderIntervalLabel(interval))
    }

    function __renderIntervalLabel(interval: Timestamp): VNode {
      const slotIntervalLabel = slots['interval-label']
      const height = convertToUnit(props.intervalHeight)
      const short = props.shortIntervalLabel ?? false
      const shower = props.showIntervalLabel || showIntervalLabelDefault
      const show = shower(interval)
      const label = show ? intervalFormatter.value(interval, short) : undefined

      return h(
        'div',
        {
          key: interval.time,
          class: {
            'q-calendar-day__interval': interval.minute === 0,
            'q-calendar-day__interval--section': interval.minute !== 0,
          },
          style: {
            height,
          },
        },
        [
          h(
            'div',
            {
              class: 'q-calendar-day__interval--text q-calendar__overflow-wrap',
            },
            [
              slotIntervalLabel
                ? slotIntervalLabel({ scope: { timestamp: interval, label } })
                : label,
            ],
          ),
        ],
      )
    }

    function __renderDaily(): VNode {
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

      const daily = withDirectives(
        h(
          'div',
          {
            key: startDate.value,
            class: 'q-calendar-day',
          },
          [
            hasWidth === true &&
              isSticky.value !== true &&
              props.noHeader !== true &&
              __renderHead(),
            hasWidth && __renderBody(),
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
          () => daily,
        )
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
      heightToMinutes,
      scrollToTime,
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

    return (): VNode => __renderCalendar()
  },
})

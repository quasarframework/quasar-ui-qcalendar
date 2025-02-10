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
  SetupContext,
  CSSProperties,
  VNode,
} from 'vue'

// Utility
import { getDayIdentifier, parsed, parseTimestamp, today, Timestamp } from '../utils/Timestamp'

import { convertToUnit, minCharWidth } from '../utils/helpers'

// Composables
import useCalendar from '../composables/useCalendar'
import useCommon, { useCommonProps } from '../composables/useCommon'
import useInterval, {
  useAgendaProps,
  type AgendaProps,
  type SchedulerProps,
  type ResourceProps,
} from '../composables/useInterval'
import { useColumnProps, type ColumnObject } from '../composables/useColumn'
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
  name: 'QCalendarAgenda',

  directives: { ResizeObserver },

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
    'update:model-value',
    ...useCheckChangeEmits,
    ...useMoveEmits,
    ...getRawMouseEvents('-date'),
    ...getRawMouseEvents('-head-day'),
    ...getRawMouseEvents('-time'),
  ],

  setup(
    props: AgendaProps & SchedulerProps & ResourceProps,
    { slots, emit, expose }: SetupContext,
  ) {
    const scrollArea = ref(null),
      pane = ref(null),
      headerColumnRef = ref(null),
      focusRef = ref<string>(props.modelValue || today()),
      focusValue = ref<Timestamp>(parsed(props.modelValue || today()) as Timestamp),
      datesRef = ref<Record<string, HTMLElement>>({}),
      headDayEventsParentRef = ref<HTMLElement>(),
      headDayEventsChildRef = ref<HTMLElement>(),
      direction = ref<'next' | 'prev'>('next'),
      startDate = ref(props.modelValue || today()),
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

    const { isSticky } = useCellWidth(props)

    watch(isSticky, () => {
      // console.info('isSticky', isSticky.value)
    })

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
      __renderAgenda,
      {
        scrollArea,
        pane,
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
      return days.value.length +
        (isLeftColumnOptionsValid.value === true ? props.leftColumnOptions!.length : 0) +
        (isRightColumnOptionsValid.value === true ? props.rightColumnOptions!.length : 0) +
        days.value.length ===
        1 && parseInt(String(props.columnCount), 10) > 0
        ? parseInt(String(props.columnCount), 10)
        : 0
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

    function __renderHeadColumn(column: ColumnObject, index: number): VNode {
      const slot = slots['head-column']
      const scope = { column, index, days: days.value }
      const width = isSticky.value === true ? props.cellWidth : computedWidth.value
      const isFocusable = props.focusable === true && props.focusType.includes('weekday')
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
          onDragenter: (e: DragEvent) => {
            if (props.dragEnterFunc !== undefined && typeof props.dragEnterFunc === 'function') {
              props.dragEnterFunc(e, 'head-column', { scope }) === true
                ? (dragOverHeadDayRef.value = id)
                : (dragOverHeadDayRef.value = '')
            }
          },
          onDragover: (e: DragEvent) => {
            if (props.dragOverFunc !== undefined && typeof props.dragOverFunc === 'function') {
              props.dragOverFunc(e, 'head-column', { scope }) === true
                ? (dragOverHeadDayRef.value = id)
                : (dragOverHeadDayRef.value = '')
            }
          },
          onDragleave: (e: DragEvent) => {
            if (props.dragLeaveFunc !== undefined && typeof props.dragLeaveFunc === 'function') {
              props.dragLeaveFunc(e, 'head-column', { scope }) === true
                ? (dragOverHeadDayRef.value = id)
                : (dragOverHeadDayRef.value = '')
            }
          },
          onDrop: (e: DragEvent) => {
            if (props.dropFunc !== undefined && typeof props.dropFunc === 'function') {
              props.dropFunc(e, 'head-column', { scope }) === true
                ? (dragOverHeadDayRef.value = id)
                : (dragOverHeadDayRef.value = '')
            }
          },
          ...getDefaultMouseEventHandlers('-head-column', (event /*, eventName*/) => {
            return { scope: { column, index }, event }
          }),
        },
        [
          props.noDefaultHeaderText !== true && __renderHeadColumnLabel(column),
          slot && slot(scope),
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
      return h(
        'div',
        {
          roll: 'presentation',
          class: {
            'q-calendar-agenda__head': true,
            'q-calendar__sticky': isSticky.value === true,
          },
          style: {
            marginRight: scrollWidth.value + 'px',
          },
        },
        [__renderHeadDaysColumn()],
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
                // TODO: need a class
                ref: headDayEventsParentRef,
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

    function __renderHeadDays(): VNode | VNode[] {
      const columnCount = parseInt(String(props.columnCount), 10)
      const columnIndexStart = parseInt(String(props.columnIndexStart), 10)

      if (days.value.length === 1 && columnCount > 0) {
        return [
          isLeftColumnOptionsValid.value === true
            ? props.leftColumnOptions!.map((column: ColumnObject, index: number) =>
                __renderHeadColumn(column, index),
              )
            : [],

          ...Array.apply(null, new Array(columnCount))
            .map((_, i) => i + columnIndexStart)
            .map((columnIndex) => __renderHeadDay(days.value[0], columnIndex)),

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
        return [
          ...Array.apply(null, new Array(parseInt(String(props.columnCount), 10)))
            .map((_, i) => i + columnCount)
            .map((columnIndex) => __renderHeadDayEvent(days.value[0], columnIndex)),
        ]
      } else {
        return days.value.map((day) => __renderHeadDayEvent(day, 0))
      }
    }

    function __renderHeadDay(day: Timestamp, columnIndex?: number): VNode {
      const headDaySlot = slots['head-day']
      const headDateSlot = slots['head-date']
      const activeDate = props.noActiveDate !== true && __isActiveDate(day)

      const scope = getScopeForSlot(day, columnIndex ?? 0)
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
        ...styler({ scope }),
      }
      if (isSticky.value === true) {
        style.minWidth = width
      }
      const weekdayClass =
        typeof props.weekdayClass === 'function' ? props.weekdayClass({ scope }) : {}
      const isFocusable = props.focusable === true && props.focusType.includes('weekday')

      const data: Record<string, any> = {
        key: day.date + (columnIndex !== undefined ? '-' + columnIndex : ''),
        ref: (el: HTMLElement) => {
          datesRef.value[day.date] = el
        },
        tabindex: isFocusable === true ? 0 : -1,
        class: {
          'q-calendar-agenda__head--day': true,
          ...weekdayClass,
          ...getRelativeClasses(day),
          'q-active-date': activeDate,
          'q-calendar__hoverable': props.hoverable === true,
          'q-calendar__focusable': isFocusable === true,
        },
        style,
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

      const scope = getScopeForSlot(day, columnIndex)
      scope.activeDate = activeDate
      scope.disabled = props.disabledWeekdays
        ? props.disabledWeekdays.includes(Number(day.weekday))
        : false

      const width = isSticky.value === true ? props.cellWidth : computedWidth.value
      const style: CSSProperties = {
        width,
        maxWidth: width,
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
            ...getRelativeClasses(day),
            'q-active-date': activeDate,
          },
          style,
        },
        [headDayEventSlot && headDayEventSlot({ scope })],
      )
    }

    function __renderHeadWeekday(day: Timestamp): VNode {
      const slot = slots['head-weekday-label']
      const scope = getScopeForSlot(day, 0)
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
      const weekdayLabel = weekdayFormatter.value(
        day,
        shortWeekdayLabel ||
          (props.weekdayBreakpoints[0] > 0 && parsedCellWidth.value <= props.weekdayBreakpoints[0]),
      )
      return h(
        'span',
        {
          class: 'q-calendar__ellipsis',
        },
        props.weekdayBreakpoints[1] > 0 && parsedCellWidth.value <= props.weekdayBreakpoints[1]
          ? minCharWidth(weekdayLabel, Number(props.minWeekdayLabel))
          : weekdayLabel,
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
          'q-calendar-agenda__head--day__label': true,
          'q-calendar__button': true,
          'q-calendar__button--round': props.dateType === 'round',
          'q-calendar__button--rounded': props.dateType === 'rounded',
          'q-calendar__button--bordered': day.current === true,
          'q-calendar__focusable': true,
        },
        disabled: day.disabled,
        onKeydown: (e: KeyboardEvent): void => {
          if (day.disabled !== true && isKeyCode(e, [13, 32])) {
            e.stopPropagation()
            e.preventDefault()
          }
        },
        onKeyup: (e: KeyboardEvent): void => {
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
      const columnIndexStart = parseInt(String(props.columnIndexStart), 10)

      if (days.value.length === 1 && columnCount > 0) {
        return [
          isLeftColumnOptionsValid.value === true
            ? props.leftColumnOptions!.map((column: ColumnObject, index: number) =>
                __renderColumn(column, index),
              )
            : [],

          ...Array.apply(null, new Array(columnCount))
            .map((_, i) => i + columnIndexStart)
            .map((i) => __renderDay(days.value[0], 0, i)),

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
      const scope = { column, days: days.value, index }
      const width = isSticky.value === true ? props.cellWidth : computedWidth.value
      const isFocusable = props.focusable === true && props.focusType.includes('day')
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
          onDragenter: (e: DragEvent) => {
            if (props.dragEnterFunc !== undefined && typeof props.dragEnterFunc === 'function') {
              props.dragEnterFunc(e, 'column', { scope }) === true
                ? (dragOverHeadDayRef.value = id)
                : (dragOverHeadDayRef.value = '')
            }
          },
          onDragover: (e: DragEvent) => {
            if (props.dragOverFunc !== undefined && typeof props.dragOverFunc === 'function') {
              props.dragOverFunc(e, 'column', { scope }) === true
                ? (dragOverHeadDayRef.value = id)
                : (dragOverHeadDayRef.value = '')
            }
          },
          onDragleave: (e: DragEvent) => {
            if (props.dragLeaveFunc !== undefined && typeof props.dragLeaveFunc === 'function') {
              props.dragLeaveFunc(e, 'column', { scope }) === true
                ? (dragOverHeadDayRef.value = id)
                : (dragOverHeadDayRef.value = '')
            }
          },
          onDrop: (e: DragEvent) => {
            if (props.dropFunc !== undefined && typeof props.dropFunc === 'function') {
              props.dropFunc(e, 'column', { scope }) === true
                ? (dragOverHeadDayRef.value = id)
                : (dragOverHeadDayRef.value = '')
            }
          },
          ...getDefaultMouseEventHandlers('-column', (event /*, eventName*/) => {
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
      const scope = getScopeForSlot(day, columnIndex)
      const width = isSticky.value === true ? props.cellWidth : computedWidth.value
      const style: CSSProperties = {
        width,
        maxWidth: width,
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
          class: {
            'q-calendar-agenda__day': true,
            ...getRelativeClasses(day),
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

      const agenda = withDirectives(
        h(
          'div',
          {
            class: 'q-calendar-agenda',
            key: startDate.value,
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
      move,
      moveToToday,
      updateCurrent,
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

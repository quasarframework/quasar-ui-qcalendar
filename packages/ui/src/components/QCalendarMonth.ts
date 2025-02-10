/* global window */
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
import { getDayIdentifier, parsed, parseTimestamp, today, type Timestamp } from '../utils/Timestamp'

import { convertToUnit, minCharWidth } from '../utils/helpers'

import useMouse, { getRawMouseEvents } from '../composables/useMouse'

import useCalendar from '../composables/useCalendar'
import useCommon, { useCommonProps } from '../composables/useCommon'
import useMonth, { useMonthProps } from '../composables/useMonth'
// import { useMaxDaysProps } from '../composables/useMaxDays'
import useTimes, { useTimesProps } from '../composables/useTimes'
import useRenderValues from '../composables/useRenderValues'
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

interface Size {
  width: number
  height: number
}

const { renderButton } = useButton()

export default defineComponent({
  name: 'QCalendarMonth',

  directives: { ResizeObserver },

  props: {
    ...useCommonProps,
    ...useMonthProps,
    ...useTimesProps,
    ...useCellWidthProps,
    ...useNavigationProps,
  },

  emits: [
    'update:model-value',
    ...useCheckChangeEmits,
    ...useMoveEmits,
    'mini-mode',
    ...getRawMouseEvents('-date'),
    ...getRawMouseEvents('-day'),
    ...getRawMouseEvents('-head-workweek'),
    ...getRawMouseEvents('-head-day'),
    ...getRawMouseEvents('-workweek'),
  ],

  setup(props, { slots, emit, expose }: SetupContext) {
    const scrollArea = ref(null),
      pane = ref(null),
      headerColumnRef = ref(null),
      focusRef = ref<string>(props.modelValue || today()),
      focusValue = ref<Timestamp>(parsed(props.modelValue || today()) as Timestamp),
      datesRef = ref<Record<string, HTMLElement>>({}),
      weekEventRef = ref<(Element | null)[]>([]),
      weekRef = ref<(Element | null)[]>([]),
      direction = ref<'next' | 'prev'>('next'),
      startDate = ref(props.modelValue || today()),
      endDate = ref('0000-00-00'),
      maxDaysRendered = ref(0), // always 0
      emittedValue = ref(props.modelValue),
      size = reactive({ width: 0, height: 0 }),
      dragOverHeadDayRef = ref(),
      dragOverDayRef = ref(''),
      // keep track of last seen start and end dates
      lastStart = ref(null),
      lastEnd = ref(null)

    const parsedView = computed(() => {
      return 'month'
    })

    const vm = getCurrentInstance()
    if (vm === null) {
      throw new Error('current instance is null')
    }

    // initialize emit listeners
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

    const computedStyles = computed(() => {
      const style: CSSProperties = {}
      if (props.dayPadding !== undefined) {
        style.padding = props.dayPadding
      }
      style.minWidth = computedWidth.value
      style.maxWidth = computedWidth.value
      style.width = computedWidth.value
      return style
    })

    /// @ts-expect-error fix later
    const { renderValues } = useRenderValues(props, {
      parsedView,
      times,
      parsedValue,
    })

    const { rootRef, __initCalendar, __renderCalendar } = useCalendar(props, __renderMonth, {
      scrollArea,
      pane,
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
      monthFormatter,
      /// @ts-expect-error fix later
    } = useMonth(props, emit, {
      times,
      parsedStart,
      parsedEnd,
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

    /// @ts-expect-error fix later
    const { tryFocus } = useKeyboard(props, {
      rootRef,
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

    const workweekWidth = computed(() => {
      if (rootRef.value) {
        return props.showWorkWeeks === true
          ? parseInt(
              window
                .getComputedStyle(rootRef.value)
                .getPropertyValue(
                  isMiniMode.value === true
                    ? '--calendar-mini-work-week-width'
                    : '--calendar-work-week-width',
                ),
              10,
            )
          : 0
      }
      return 0
    })

    const parsedColumnCount = computed(() => {
      return props.weekdays.length
    })

    const computedWidth = computed(() => {
      if (rootRef.value) {
        const width = size.width || rootRef.value.getBoundingClientRect().width
        if (width && parsedColumnCount.value) {
          return (width - workweekWidth.value) / parsedColumnCount.value + 'px'
        }
      }
      return 100 / parsedColumnCount.value + '%'
    })

    const isDayFocusable = computed(() => {
      return (
        props.focusable === true && props.focusType.includes('day') && isMiniMode.value !== true
      )
    })

    const isDateFocusable = computed(() => {
      return (
        props.focusable === true &&
        props.focusType.includes('date') &&
        isDayFocusable.value !== true
      )
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
        if (emittedValue.value !== val) {
          emittedValue.value = val
        }
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

    function moveToToday(): void {
      emittedValue.value = today()
    }

    function next(amount = 1): void {
      move(amount)
    }

    function prev(amount = 1): void {
      move(-amount)
    }

    function __onResize({ width, height }: Size): void {
      size.width = width
      size.height = height
    }

    function __isActiveDate(day: Timestamp): boolean {
      return day.date === emittedValue.value
    }

    function isCurrentWeek(week: Timestamp[]): { timestamp: Timestamp | false } {
      for (let i = 0; i < week.length; ++i) {
        if (week[i].current === true) {
          return { timestamp: week[i] }
        }
      }
      return { timestamp: false }
    }

    function __adjustForWeekEvents(): void {
      if (isMiniMode.value === true) return
      if (props.dayHeight !== 0) return
      const slotWeek = slots.week
      if (slotWeek === void 0) return

      if (window) {
        for (const row in weekEventRef.value) {
          const weekEvent = weekEventRef.value[row]
          if (weekEvent === void 0) continue
          const wrapper = weekRef.value[row]
          if (wrapper === void 0) continue
          // this sucks to have to do it this way
          const styles = window.getComputedStyle(weekEvent as Element)
          const margin = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom)
          if ((wrapper as Element).clientHeight + margin > (wrapper as Element).clientHeight) {
            ;(wrapper as HTMLElement).style.height =
              (weekEvent as Element).clientHeight + margin + 'px'
          }
        }
      }
    }

    // Render functions

    function __renderBody(): ReturnType<typeof h> {
      return h(
        'div',
        {
          class: 'q-calendar-month__body',
        },
        [...__renderWeeks()],
      )
    }

    function __renderHead(): VNode {
      return h(
        'div',
        {
          role: 'presentation',
          class: 'q-calendar-month__head',
        },
        [
          props.showWorkWeeks === true && __renderWorkWeekHead(),
          h(
            'div',
            {
              class: 'q-calendar-month__head--wrapper',
            },
            [__renderHeadDaysRow()],
          ),
        ],
      )
    }

    function __renderHeadDaysRow(): VNode {
      return h(
        'div',
        {
          ref: headerColumnRef,
          class: {
            'q-calendar-month__head--weekdays': true,
          },
        },
        [...__renderHeadDays()],
      )
    }

    function __renderWorkWeekHead(): VNode {
      const slot = slots['head-workweek']
      const scope = {
        start: parsedStart.value,
        end: parsedEnd.value,
        miniMode: isMiniMode.value,
      }

      return h(
        'div',
        {
          class: 'q-calendar-month__head--workweek',
          ...getDefaultMouseEventHandlers('-head-workweek', (event) => {
            return { scope, event }
          }),
        },
        slot ? slot({ scope }) : '#',
      )
    }

    function __renderHeadDays(): VNode[] {
      return todayWeek.value.map((day, index) => __renderHeadDay(day, index))
    }

    function __renderHeadDay(day: Timestamp, index: number): VNode {
      const headDaySlot = slots['head-day']

      const filteredDays = days.value.filter((day2) => day2.weekday === day.weekday)
      const weekday = filteredDays[0].weekday
      const activeDate = props.noActiveDate !== true && __isActiveDate(day)

      const scope = {
        activeDate,
        weekday,
        timestamp: day,
        days: filteredDays,
        index,
        miniMode: isMiniMode.value,
        droppable: dragOverHeadDayRef.value === Number(day.weekday),
        disabled: props.disabledWeekdays
          ? props.disabledWeekdays.includes(Number(day.weekday))
          : false,
      }

      const weekdayClass =
        typeof props.weekdayClass === 'function' ? props.weekdayClass({ scope }) : {}
      const isFocusable = props.focusable === true && props.focusType.includes('weekday')

      const width = computedWidth.value
      const styler = props.weekdayStyle || dayStyleDefault
      const style: CSSProperties = {
        width,
        maxWidth: width,
        minWidth: width,
        ...styler({ scope }),
      }

      const data: Record<string, any> = {
        key: day.date + (index !== undefined ? '-' + index : ''),
        tabindex: isFocusable === true ? 0 : -1,
        class: {
          'q-calendar-month__head--weekday': true,
          ...weekdayClass,
          'q-disabled-day disabled': scope.disabled === true,
          ['q-calendar__' + props.weekdayAlign]: true,
          'q-calendar__ellipsis': true,
          'q-calendar__focusable': isFocusable === true,
        },
        style,
        onDragenter: (e: DragEvent) => {
          if (props.dragEnterFunc !== undefined && typeof props.dragEnterFunc === 'function') {
            props.dragEnterFunc(e, 'head-day', { scope }) === true
              ? (dragOverHeadDayRef.value = Number(day.weekday))
              : (dragOverHeadDayRef.value = -1)
          }
        },
        onDragover: (e: DragEvent) => {
          if (props.dragOverFunc !== undefined && typeof props.dragOverFunc === 'function') {
            props.dragOverFunc(e, 'head-day', { scope }) === true
              ? (dragOverHeadDayRef.value = Number(day.weekday))
              : (dragOverHeadDayRef.value = -1)
          }
        },
        onDragleave: (e: DragEvent) => {
          if (props.dragLeaveFunc !== undefined && typeof props.dragLeaveFunc === 'function') {
            props.dragLeaveFunc(e, 'head-day', { scope }) === true
              ? (dragOverHeadDayRef.value = Number(day.weekday))
              : (dragOverHeadDayRef.value = -1)
          }
        },
        onDrop: (e: DragEvent) => {
          if (props.dropFunc !== undefined && typeof props.dropFunc === 'function') {
            props.dropFunc(e, 'head-day', { scope }) === true
              ? (dragOverHeadDayRef.value = Number(day.weekday))
              : (dragOverHeadDayRef.value = -1)
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

      if (props.noAria !== true) {
        data.ariaLabel = weekdayFormatter.value(day, false)
      }

      return h('div', data, [
        headDaySlot === undefined &&
          __renderHeadWeekdayLabel(day, props.shortWeekdayLabel || isMiniMode.value),
        headDaySlot !== undefined && headDaySlot({ scope }),
        __renderHeadDayEvent(day, index),
        isFocusable === true && useFocusHelper(),
      ])
    }

    function __renderHeadDayEvent(day: Timestamp, index: number): VNode {
      const headDayEventSlot = slots['head-day-event']
      const activeDate = props.noActiveDate !== true && __isActiveDate(day)
      const filteredDays = days.value.filter((day2) => day2.weekday === day.weekday)
      const weekday = filteredDays[0].weekday

      const scope = {
        weekday,
        timestamp: day,
        days: filteredDays,
        index,
        miniMode: isMiniMode.value,
        activeDate,
        disabled: props.disabledWeekdays
          ? props.disabledWeekdays.includes(Number(day.weekday))
          : false,
      }

      const width = computedWidth.value
      const styler = props.weekdayStyle || dayStyleDefault
      const style: CSSProperties = {
        width,
        maxWidth: width,
        minWidth: width,
        ...styler({ scope }),
      }

      return h(
        'div',
        {
          key: 'event-' + day.date + (index !== undefined ? '-' + index : ''),
          class: {
            'q-calendar-month__head--event': true,
          },
          style,
        },
        [headDayEventSlot !== undefined && headDayEventSlot({ scope })],
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
        (isMiniMode.value === true && props.shortWeekdayLabel === true) ||
          (props.weekdayBreakpoints[1] > 0 && parsedCellWidth.value <= props.weekdayBreakpoints[1])
          ? minCharWidth(weekdayLabel, Number(props.minWeekdayLabel))
          : weekdayLabel,
      )
    }

    function __renderWeeks(): VNode[] {
      const weekDays = props.weekdays.length
      const weeks = []
      for (let i = 0; i < days.value.length; i += weekDays) {
        weeks.push(__renderWeek(days.value.slice(i, i + weekDays), i / weekDays))
      }

      return weeks
    }

    function __renderWeek(week: Timestamp[], weekNum: number): VNode {
      const slotWeek = slots.week
      const weekdays = props.weekdays
      const scope = { week, weekdays, miniMode: isMiniMode.value }
      const style: CSSProperties = {}

      // this applies height properly, even if workweeks are displaying
      const dayHeight = parseInt(String(props.dayHeight), 10)
      const dayMinHeight = parseInt(String(props.dayMinHeight), 10)

      style.height = dayHeight > 0 && isMiniMode.value !== true ? convertToUnit(dayHeight) : 'auto'
      if (dayMinHeight > 0 && isMiniMode.value !== true) {
        style.minHeight = convertToUnit(dayMinHeight)
      }
      const useAutoHeight = dayHeight === 0 && dayMinHeight === 0

      return h(
        'div',
        {
          key: week[0].date,
          ref: (el) => {
            weekRef.value[weekNum] = el as Element | null
          },
          class: {
            'q-calendar-month__week--wrapper': true,
            'q-calendar-month__week--auto-height': useAutoHeight,
          },
          style,
        },
        [
          props.showWorkWeeks === true ? __renderWorkWeekGutter(week) : undefined,
          h(
            'div',
            {
              class: 'q-calendar-month__week',
            },
            [
              h(
                'div',
                {
                  class: 'q-calendar-month__week--days',
                },
                week.map((day) => __renderDay(day)),
              ),
              isMiniMode.value !== true && slotWeek !== undefined
                ? h(
                    'div',
                    {
                      ref: (el) => {
                        weekEventRef.value[weekNum] = el as Element | null
                      },
                      class: 'q-calendar-month__week--events',
                    },
                    slotWeek({ scope }),
                  )
                : undefined,
            ],
          ),
        ],
      )
    }

    function __renderWorkWeekGutter(week: Timestamp[]): VNode {
      const slot = slots.workweek
      // adjust day to account for Sunday/Monday start of week calendars
      const day = week.length > 2 ? week[2] : week[0]
      const { timestamp } = isCurrentWeek(week)
      const workweekLabel = Number(day.workweek).toLocaleString(props.locale)
      const scope = { workweekLabel, week, miniMode: isMiniMode.value }

      return h(
        'div',
        {
          key: day.workweek,
          class: {
            'q-calendar-month__workweek': true,
            ...getRelativeClasses(timestamp !== false ? timestamp : day, false),
          },
          ...getDefaultMouseEventHandlers('-workweek', (event) => {
            return { scope, event }
          }),
        },
        slot ? slot({ scope }) : workweekLabel,
      )
    }

    function __renderDay(day: Timestamp): VNode {
      const slot = slots.day
      const styler = props.dayStyle || dayStyleDefault
      const outside = isOutside(day)
      const activeDate = props.noActiveDate !== true && parsedValue.value.date === day.date
      const hasMonth =
        outside === false &&
        props.showMonthLabel === true &&
        days.value.find((d) => d.month === day.month)?.day === day.day

      const scope = {
        outside,
        timestamp: day,
        miniMode: isMiniMode.value,
        activeDate,
        hasMonth,
        droppable: dragOverDayRef.value === day.date,
        disabled: props.disabledWeekdays
          ? props.disabledWeekdays.includes(Number(day.weekday))
          : false,
      }

      const style: CSSProperties = Object.assign({ ...computedStyles.value }, styler({ scope }))
      const dayClass = typeof props.dayClass === 'function' ? props.dayClass({ scope }) : {}

      const data: Record<string, any> = {
        key: day.date,
        ref: (el: HTMLElement) => {
          if (isDayFocusable.value === true) {
            datesRef.value[day.date] = el
          }
        },
        tabindex: isDayFocusable.value === true ? 0 : -1,
        class: {
          'q-calendar-month__day': true,
          ...dayClass,
          ...getRelativeClasses(
            day,
            outside,
            Array.from(props.selectedDates),
            props.selectedStartEndDates,
            props.hover,
          ),
          'q-active-date': activeDate === true,
          disabled: props.enableOutsideDays !== true && outside === true,
          'q-calendar__hoverable': props.hoverable === true,
          'q-calendar__focusable': isDayFocusable.value === true,
        },
        style,
        onFocus: () => {
          if (isDayFocusable.value === true) {
            focusRef.value = day.date
          }
        },
        onKeydown: (e: KeyboardEvent) => {
          if (outside !== true && day.disabled !== true && isKeyCode(e, [13, 32])) {
            e.stopPropagation()
            e.preventDefault()
          }
        },
        onKeyup: (e: KeyboardEvent) => {
          // allow selection of date via Enter or Space keys
          if (outside !== true && day.disabled !== true && isKeyCode(e, [13, 32])) {
            e.stopPropagation()
            e.preventDefault()
            // emit only if there is a listener
            if (emitListeners.value.onClickDay !== undefined && isMiniMode.value !== true) {
              emit('click-day', { scope, e })
            }
          }
        },
        ...getDefaultMouseEventHandlers('-day', (event) => {
          return { scope, event }
        }),
      }

      const dragAndDrop = {
        onDragenter: (e: DragEvent): void => {
          if (props.dragEnterFunc !== undefined && typeof props.dragEnterFunc === 'function') {
            props.dragEnterFunc(e, 'day', { scope }) === true
              ? (dragOverDayRef.value = day.date)
              : (dragOverDayRef.value = '')
          }
        },
        onDragover: (e: DragEvent): void => {
          if (props.dragOverFunc !== undefined && typeof props.dragOverFunc === 'function') {
            props.dragOverFunc(e, 'day', { scope }) === true
              ? (dragOverDayRef.value = day.date)
              : (dragOverDayRef.value = '')
          }
        },
        onDragleave: (e: DragEvent): void => {
          if (props.dragLeaveFunc !== undefined && typeof props.dragLeaveFunc === 'function') {
            props.dragLeaveFunc(e, 'day', { scope }) === true
              ? (dragOverDayRef.value = day.date)
              : (dragOverDayRef.value = '')
          }
        },
        onDrop: (e: DragEvent): void => {
          if (props.dropFunc !== undefined && typeof props.dropFunc === 'function') {
            props.dropFunc(e, 'day', { scope }) === true
              ? (dragOverDayRef.value = day.date)
              : (dragOverDayRef.value = '')
          }
        },
      }

      if (outside !== true) {
        Object.assign(data, dragAndDrop)
      }

      if (props.noAria !== true) {
        data.ariaLabel = ariaDateFormatter.value(day, false)
      }

      return h('div', data, [
        __renderDayLabelContainer(day, outside, hasMonth),
        h(
          'div',
          {
            class: {
              'q-calendar-month__day--content': true,
            },
          },
          slot ? slot({ scope }) : undefined,
        ),
        isDayFocusable.value === true && useFocusHelper(),
      ])
    }

    function __renderDayLabelContainer(
      day: Timestamp,
      outside: boolean,
      hasMonth: boolean,
    ): VNode[] | VNode {
      let dayOfYearLabel, monthLabel
      const children = [__renderDayLabel(day, outside)]

      if (isMiniMode.value !== true && hasMonth === true && size.width > 340) {
        monthLabel = __renderDayMonth(day, outside)
      }

      if (
        isMiniMode.value !== true &&
        props.showDayOfYearLabel === true &&
        monthLabel === undefined &&
        size.width > 300
      ) {
        dayOfYearLabel = __renderDayOfYearLabel(day, outside)
      }

      if (props.dateAlign === 'left') {
        dayOfYearLabel !== undefined && children.push(dayOfYearLabel)
        monthLabel !== undefined && children.push(monthLabel)
      } else if (props.dateAlign === 'right') {
        dayOfYearLabel !== undefined && children.unshift(dayOfYearLabel)
        monthLabel !== undefined && children.unshift(monthLabel)
      } else {
        // center
        // no day of year or month labels
        dayOfYearLabel = undefined
        monthLabel = undefined
      }

      // TODO: if miniMode just return children?

      const data: Record<string, any> = {
        class: {
          'q-calendar-month__day--label__wrapper': true,
          'q-calendar__ellipsis': true,
          ['q-calendar__' + props.dateAlign]:
            dayOfYearLabel === undefined && monthLabel === undefined,
          'q-calendar__justify': dayOfYearLabel !== undefined || monthLabel !== undefined,
        },
      }

      return h('div', data, children)
    }

    function __renderDayLabel(day: Timestamp, outside: boolean): VNode | VNode[] | void {
      // return if outside days are hidden
      if (outside === true && props.noOutsideDays === true) {
        return
      }

      const dayLabel = dayFormatter.value(day, false)
      const dayLabelSlot = slots['head-day-label']
      const dayBtnSlot = slots['head-day-button']

      const selectedDate =
        props.selectedDates &&
        Array.from(props.selectedDates).length > 0 &&
        Array.from(props.selectedDates).includes(day.date)

      const activeDate = props.noActiveDate !== true && __isActiveDate(day)

      const scope = {
        dayLabel,
        timestamp: day,
        outside,
        activeDate,
        selectedDate,
        miniMode: isMiniMode.value,
        disabled: props.disabledWeekdays
          ? props.disabledWeekdays.includes(Number(day.weekday))
          : false,
      }

      // const size = isMiniMode.value ? 'sm' : props.monthLabelSize

      const data: Record<string, any> = {
        key: day.date,
        ref: (el: HTMLElement) => {
          if (isDateFocusable.value === true) {
            datesRef.value[day.date] = el
          }
        },
        tabindex: isDateFocusable.value === true ? 0 : -1,
        class: {
          'q-calendar-month__day--label': true,
          'q-calendar__button': true,
          'q-calendar__button--round': props.dateType === 'round',
          'q-calendar__button--rounded': props.dateType === 'rounded',
          'q-calendar__button--bordered': day.current === true,
          'q-calendar__hoverable': props.hoverable === true,
          'q-calendar__focusable': isDateFocusable.value === true,
        },
        // style: {
        //   lineHeight: isMiniMode.value ? 'unset' : '1.715em'
        // },
        disabled: day.disabled === true || (props.enableOutsideDays !== true && outside === true),
        onFocus: () => {
          if (isDateFocusable.value === true) {
            focusRef.value = day.date
          }
        },
        onKeydown: (e: KeyboardEvent) => {
          if (outside !== true && day.disabled !== true && isKeyCode(e, [13, 32])) {
            e.stopPropagation()
            e.preventDefault()
          }
        },
        onKeyup: (e: KeyboardEvent) => {
          // allow selection of date via Enter or Space keys
          if (
            isDateFocusable.value === true &&
            outside !== true &&
            day.disabled !== true &&
            isKeyCode(e, [13, 32])
          ) {
            e.stopPropagation()
            e.preventDefault()
            emittedValue.value = day.date
            if (emitListeners.value.onClickDate !== undefined) {
              emit('click-date', { scope, event: e })
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
        }),
      }

      if (props.noAria !== true) {
        data.ariaLabel = ariaDateFormatter.value(day, false)
      }

      return [
        dayBtnSlot
          ? dayBtnSlot({ scope })
          : renderButton(props, data, dayLabelSlot ? dayLabelSlot({ scope }) : dayLabel),
        isDateFocusable.value === true && useFocusHelper(),
      ].filter((v): v is VNode => v !== false)
    }

    function __renderDayOfYearLabel(day: Timestamp, outside: boolean): VNode | void {
      // return if outside days are hidden
      if (outside === true && props.noOutsideDays === true) {
        return
      }

      const slot = slots['day-of-year']
      const scope = { timestamp: day }

      return h(
        'span',
        {
          class: {
            'q-calendar-month__day--day-of-year': true,
            'q-calendar__ellipsis': true,
          },
        },
        slot ? slot({ scope }) : day.doy,
      )
    }

    function __renderDayMonth(day: Timestamp, outside: boolean): VNode | void {
      // return if outside days are hidden
      if (outside === true && props.noOutsideDays === true) {
        return
      }

      const slot = slots['month-label']
      const monthLabel = monthFormatter.value(day, props.shortMonthLabel || size.width < 500)
      const scope = { monthLabel, timestamp: day, miniMode: isMiniMode.value }

      const style: CSSProperties = {}
      if (isMiniMode.value !== true && parsedMonthLabelSize.value !== undefined) {
        style.fontSize = parsedMonthLabelSize.value
      }

      return h(
        'span',
        {
          class: 'q-calendar-month__day--month q-calendar__ellipsis',
          style,
        },
        [slot ? slot({ scope }) : isMiniMode.value !== true ? monthLabel : undefined],
      )
    }

    function __renderMonth(): VNode {
      const { start, end } = renderValues.value
      startDate.value = start.date
      endDate.value = end.date

      const hasWidth = size.width > 0

      const weekly = withDirectives(
        h(
          'div',
          {
            class: {
              'q-calendar-mini': isMiniMode.value === true,
              'q-calendar-month': true,
            },
            key: startDate.value,
          },
          [
            hasWidth === true && props.noHeader !== true && __renderHead(),
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
          () => weekly,
        )
      }

      return weekly
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
    //   updateCurrent
    // })

    return (): VNode => __renderCalendar()
  },
})

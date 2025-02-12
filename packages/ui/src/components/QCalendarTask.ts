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
import { getDayIdentifier, parsed, parseTimestamp, type Timestamp, today } from '../utils/Timestamp'

import { convertToUnit, minCharWidth } from '../utils/helpers'

import useMouse, { getRawMouseEvents } from '../composables/useMouse'

import useCalendar from '../composables/useCalendar'
import useCommon, { useCommonProps, CommonProps } from '../composables/useCommon'
import useTask, { useTaskProps, type Task } from '../composables/useTask'
import { useMaxDaysProps } from '../composables/useMaxDays'
import useTimes, { useTimesProps } from '../composables/useTimes'
import useRenderValues from '../composables/useRenderValues'
import useMove, { useMoveEmits } from '../composables/useMove'
import useEmitListeners from '../composables/useEmitListeners'
import useButton from '../composables/useButton'
import useFocusHelper from '../composables/useFocusHelper'
import useCheckChange, { useCheckChangeEmits } from '../composables/useCheckChange'
import useEvents from '../composables/useEvents'
import useKeyboard, { useNavigationProps } from '../composables/useKeyboard'
import { /*useCellWidth,*/ useCellWidthProps } from '../composables/useCellWidth'

// Directives
import ResizeObserver from '../directives/ResizeObserver'

interface Size {
  width: number
  height: number
}

const { renderButton } = useButton()

export default defineComponent({
  name: 'QCalendarTask',

  directives: { ResizeObserver },

  props: {
    ...useTimesProps,
    ...useNavigationProps,
    ...useCellWidthProps,
    ...useMaxDaysProps,
    ...useCommonProps,
    ...useTaskProps, // last for any overrides
  },

  emits: [
    'update:model-value',
    'update:model-tasks',
    'update:model-title',
    'update:model-footer',
    'task-expanded',
    ...useCheckChangeEmits,
    ...useMoveEmits,
    ...getRawMouseEvents('-date'),
    ...getRawMouseEvents('-day'),
    ...getRawMouseEvents('-head-day'),
  ],

  setup(props, { slots, emit, expose }: SetupContext) {
    const scrollArea = ref(null),
      pane = ref(null),
      direction = ref<'next' | 'prev'>('next'),
      startDate = ref(props.modelValue || today()),
      endDate = ref('0000-00-00'),
      maxDaysRendered = ref(0), // always 0
      emittedValue = ref(props.modelValue),
      focusRef = ref<string>(props.modelValue || today()),
      focusValue = ref<Timestamp>(parsed(props.modelValue || today()) as Timestamp),
      datesRef = ref<Record<string, HTMLElement>>({}),
      // taskRef = ref(null),
      // weekEventRef = ref([]),
      // weekRef = ref([]),
      // headerColumnRef = ref(null),
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
      return props.view as string
    })

    const vm = getCurrentInstance()
    if (vm === null) {
      throw new Error('current instance is null')
    }

    // initialize emit listeners
    const { emitListeners } = useEmitListeners(vm)

    const { times, setCurrent, updateCurrent } = useTimes(props)

    // update dates
    updateCurrent()
    setCurrent()

    const {
      // computed
      parsedStart,
      // parsedEnd,
      dayFormatter,
      weekdayFormatter,
      ariaDateFormatter,
      // methods
      dayStyleDefault,
      getRelativeClasses,
    } = useCommon(props as CommonProps, { startDate, endDate, times })

    // const { isSticky } = useCellWidth(props)

    const parsedValue = computed(() => {
      return parseTimestamp(props.modelValue, times.now) || parsedStart.value || times.today
    })

    focusValue.value = parsedValue.value
    focusRef.value = parsedValue.value.date

    // const computedStyles = computed(() => {
    //   const style: CSSProperties = {}
    //   style.minWidth = computedWidth.value
    //   style.maxWidth = computedWidth.value
    //   style.width = computedWidth.value
    //   return style
    // })

    const { renderValues } = useRenderValues(props, {
      parsedView,
      times,
      parsedValue,
    })

    const { rootRef, __initCalendar, __renderCalendar } = useCalendar(props, __renderTask, {
      scrollArea,
      pane,
    })

    const {
      // computed
      days,
      parsedStartDate,
      parsedEndDate,
      // methods
      /// @ts-expect-error fix later
    } = useTask(props, emit, {
      times,
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

    const isSticky = ref(true)
    const parsedCellWidth = computed(() => {
      if (props.cellWidth !== undefined) {
        return parseInt(String(props.cellWidth), 10)
      }
      return 150 // default when not specified
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
      return props.focusable === true && props.focusType.includes('day')
    })

    const isDateFocusable = computed(() => {
      return (
        props.focusable === true &&
        props.focusType.includes('date') &&
        isDayFocusable.value !== true
      )
    })

    const isWeekdayFocusable = computed(() => {
      return props.focusable === true && props.focusType.includes('weekday')
    })

    const parsedHeight = computed(() => {
      return parseInt(String(props.dayHeight), 10)
    })

    const parsedMinHeight = computed(() => {
      return parseInt(String(props.dayMinHeight), 10)
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
      if (focusRef.value && datesRef.value && datesRef.value[focusRef.value]) {
        datesRef.value[focusRef.value]!.focus()
      } else {
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

    /**
     * Renders the given day with the associated task
     * @param {Timestamp} day Timestamp representing the day
     * @param {any} task The Task
     * @param {number} taskIndex The task index
     * @returns VNode
     */
    function __renderTaskDay(day: Timestamp, task: Task, taskIndex: number): VNode {
      const slot = slots.day
      const styler = props.dayStyle || dayStyleDefault
      const activeDate = props.noActiveDate !== true && parsedValue.value.date === day.date
      const dragValue = task[props.taskKey]

      const scope = {
        timestamp: day,
        task,
        taskIndex,
        activeDate,
        droppable: dragOverResource.value === dragValue,
      }

      const width = convertToUnit(parsedCellWidth.value)
      const style: CSSProperties = {
        width,
        minWidth: width,
        maxWidth: width,
        ...styler({ scope }),
      }
      const dayClass = typeof props.dayClass === 'function' ? props.dayClass({ scope }) : {}
      // const key = day.date + '-' + task.id

      return h(
        'div',
        {
          // key,
          // ref: (el) => {
          //   if (isDayFocusable.value === true) {
          //     datesRef.value[ key ] = el
          //   }
          // },
          tabindex: isDayFocusable.value === true ? 0 : -1,
          class: {
            'q-calendar-task__task--day': true,
            ...dayClass,
            ...getRelativeClasses(day),
            'q-active-date': activeDate === true,
            'q-calendar__hoverable': props.hoverable === true,
            'q-calendar__focusable': isDayFocusable.value === true,
          },
          style,
          onFocus: () => {
            if (isDayFocusable.value === true) {
              // focusRef.value = key
            }
          },
          ...getDefaultMouseEventHandlers('-day', (event) => {
            return { scope, event }
          }),
          onDragenter: (e: DragEvent) => {
            if (props.dragEnterFunc !== undefined && typeof props.dragEnterFunc === 'function') {
              props.dragEnterFunc(e, 'day', { scope }) === true
                ? (dragOverResource.value = dragValue)
                : (dragOverResource.value = '')
            }
          },
          onDragover: (e: DragEvent) => {
            if (props.dragOverFunc !== undefined && typeof props.dragOverFunc === 'function') {
              props.dragOverFunc(e, 'day', { scope }) === true
                ? (dragOverResource.value = dragValue)
                : (dragOverResource.value = '')
            }
          },
          onDragleave: (e: DragEvent) => {
            if (props.dragLeaveFunc !== undefined && typeof props.dragLeaveFunc === 'function') {
              props.dragLeaveFunc(e, 'day', { scope }) === true
                ? (dragOverResource.value = dragValue)
                : (dragOverResource.value = '')
            }
          },
          onDrop: (e: DragEvent) => {
            if (props.dropFunc !== undefined && typeof props.dropFunc === 'function') {
              props.dropFunc(e, 'day', { scope }) === true
                ? (dragOverResource.value = dragValue)
                : (dragOverResource.value = '')
            }
          },
        },
        [slot && slot({ scope }), useFocusHelper()],
      )
    }

    function __renderTaskDays(task: Task, taskIndex: number): VNode[] {
      return days.value.map((day) => __renderTaskDay(day, task, taskIndex))
    }

    function __renderTaskDaysRow(task: Task, taskIndex: number): VNode {
      const slot = slots.days
      const scope = {
        timestamps: days.value,
        days: days.value, // deprecated
        task,
        taskIndex,
        cellWidth: parsedCellWidth.value,
      }

      return h(
        'div',
        {
          class: 'q-calendar-task__task--days-row',
        },
        [__renderTaskDays(task, taskIndex), slot && slot({ scope })],
      )
    }

    function __renderTaskItem(
      task: Task,
      taskIndex: number,
      indentLevel = 0,
      expanded = true,
    ): VNode {
      const slot = indentLevel === 0 ? slots.task : slots.subtask
      const scope = {
        start: parsedStartDate.value,
        end: parsedEndDate.value,
        task,
        taskIndex,
        expanded,
      }
      const width = convertToUnit(props.taskWidth)
      const style: CSSProperties = {
        width,
        minWidth: width,
        maxWidth: width,
      }

      const isFocusable = props.focusable === true && props.focusType.includes('task')

      return h(
        'div',
        {
          class: {
            'q-calendar-task__task--item': true,
            'q-calendar__sticky': isSticky.value === true,
            'q-calendar__hoverable': props.hoverable === true,
            'q-calendar__focusable': isFocusable === true,
          },
          style,
        },
        [
          h(
            'div',
            {
              style: {
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: 10 + 10 * indentLevel + 'px',
              },
            },
            [
              h('div', {
                class: {
                  'q-calendar__parent': task.children !== undefined,
                  'q-calendar__parent--expanded':
                    task.children !== undefined && task.expanded === true,
                  'q-calendar__parent--collapsed':
                    task.children !== undefined && task.expanded !== true,
                },
                onClick: (e) => {
                  e.stopPropagation()
                  task.expanded = !task.expanded
                  // emit('update:model-tasks', props.modelTasks)
                  emit('task-expanded', { expanded: task.expanded, scope })
                },
              }),
            ],
          ),
          slot && slot({ scope }),
          useFocusHelper(),
        ],
      )
    }

    function __renderTaskRow(
      task: Task,
      taskIndex: number,
      indentLevel = 0,
      expanded = true,
    ): VNode[] {
      const height =
        task.height !== void 0
          ? convertToUnit(parseInt(task.height, 10))
          : parsedHeight.value > 0
            ? convertToUnit(parsedHeight.value)
            : 'auto'
      const minHeight = parsedMinHeight.value > 0 ? convertToUnit(parsedMinHeight.value) : void 0

      const style: CSSProperties = {
        height,
      }
      if (minHeight !== void 0) {
        style.minHeight = minHeight
      }

      const taskRow = h(
        'div',
        {
          key: task[props.taskKey] + '-' + taskIndex,
          class: {
            'q-calendar-task__task': indentLevel === 0,
            'q-calendar-task__task--section': indentLevel !== 0,
          },
          style,
        },
        [
          __renderTaskItem(task, taskIndex, indentLevel, expanded),
          __renderTaskDaysRow(task, taskIndex),
        ],
      )

      if (task.children !== undefined) {
        return [
          taskRow,
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
              __renderTasks(
                task.children,
                indentLevel + 1,
                expanded === false ? expanded : task.expanded,
              ),
            ],
          ),
        ]
      }

      return [taskRow]
    }

    function __renderTasks(
      tasks: Task[] | void = undefined,
      indentLevel = 0,
      expanded = true,
    ): VNode[] {
      if (tasks === undefined) {
        tasks = props.modelTasks
      }
      return (tasks as Array<Task>)
        .map((task, taskIndex) => {
          return __renderTaskRow(
            task,
            taskIndex,
            indentLevel,
            task.children !== undefined ? task.expanded : expanded,
          )
        })
        .flat()
    }

    function __renderTasksContainer(): VNode {
      return h(
        'div',
        {
          class: {
            'q-calendar-task__task--container': true,
            'q-calendar__sticky': isSticky.value === true,
          },
        },
        [__renderTasks()],
      )
    }

    function __renderFooterTask(task: Task, index: number): VNode {
      const slot = slots['footer-task']
      const scope = {
        start: parsedStartDate.value,
        end: parsedEndDate.value,
        footer: task,
        index,
      }
      const width = convertToUnit(props.taskWidth)
      const style: CSSProperties = {
        width,
        minWidth: width,
        maxWidth: width,
      }

      return h(
        'div',
        {
          class: {
            'q-calendar-task__footer--task': true,
            'q-calendar__sticky': isSticky.value === true,
          },
          style,
        },
        [slot && slot({ scope })],
      )
    }

    function __renderFooterDay(day: Timestamp, task: Task, index: number): VNode {
      const slot = slots['footer-day']
      const scope = {
        timestamp: day,
        footer: task,
        index,
      }
      const width = convertToUnit(parsedCellWidth.value)
      const style: CSSProperties = {
        width,
        minWidth: width,
        maxWidth: width,
      }

      const footerDayClass =
        typeof props.footerDayClass === 'function' ? props.footerDayClass({ scope }) : {}

      return h(
        'div',
        {
          class: {
            'q-calendar-task__footer--day': true,
            ...footerDayClass,
            ...getRelativeClasses(day),
            'q-calendar__hoverable': props.hoverable === true,
            'q-calendar__focusable': isDayFocusable.value === true,
          },
          style,
          // onFocus: (e) => {
          //   if (isDayFocusable.value === true) {
          //     focusRef.value = day.date
          //   }
          // }
        },
        [slot && slot({ scope })],
      )
    }

    function __renderFooterDays(task: Task, index: number): VNode {
      return h(
        'div',
        {
          class: 'q-calendar-task__footer--day-wrapper',
        },
        [days.value.map((day) => __renderFooterDay(day, task, index))],
      )
    }

    function __renderFooterRows(): VNode[] {
      const isFocusable = props.focusable === true && props.focusType.includes('task')

      return props.modelFooter.map((task, index) => {
        return h(
          'div',
          {
            class: {
              'q-calendar-task__footer--wrapper': true,
              'q-calendar__hoverable': props.hoverable === true,
              'q-calendar__focusable': isFocusable === true,
            },
          },
          {
            default: () => [__renderFooterTask(task, index), __renderFooterDays(task, index)],
          },
        )
      })
    }

    function __renderFooter(): VNode {
      return h(
        'div',
        {
          class: {
            'q-calendar-task__footer': true,
            'q-calendar__sticky': isSticky.value === true,
          },
        },
        __renderFooterRows(),
      )
    }

    function __renderContainer(): VNode {
      return h(
        'div',
        {
          class: {
            'q-calendar-task__container': true,
          },
        },
        [props.noHeader !== true && __renderHead(), __renderTasksContainer(), __renderFooter()],
      )
    }

    function __renderHeadTask(): VNode {
      const slot = slots['head-tasks']
      const scope = {
        start: parsedStartDate.value,
        end: parsedEndDate.value,
      }
      const width = convertToUnit(parseInt(String(props.taskWidth), 10))
      const style: CSSProperties = {
        width,
        minWidth: width,
        maxWidth: width,
      }

      return h(
        'div',
        {
          class: {
            'q-calendar-task__head--tasks': true,
            'q-calendar__sticky': isSticky.value === true,
          },
          style,
        },
        [slot && slot({ scope })],
      )
    }

    function __renderTitleTask(title: string, index: number): VNode {
      const slot = slots['title-task']

      const width = convertToUnit(parseInt(String(props.taskWidth), 10))
      const style: CSSProperties = {
        width,
        minWidth: width,
        maxWidth: width,
      }

      const scope = {
        start: parsedStartDate.value,
        end: parsedEndDate.value,
        cellWidth: width,
        title,
        index,
      }

      return h(
        'div',
        {
          class: {
            'q-calendar-task__title--task': true,
            'q-calendar__sticky': isSticky.value === true,
          },
          style,
        },
        [slot && slot({ scope })],
      )
    }

    function __renderHeadWeekday(day: Timestamp): VNode {
      const slot = slots['head-weekday-label']
      const activeDate = props.noActiveDate !== true && __isActiveDate(day)

      const scope = {
        activeDate,
        timestamp: day,
        disabled: props.disabledWeekdays
          ? props.disabledWeekdays.includes(Number(day.weekday))
          : false,
      }

      const data: Record<string, any> = {
        class: {
          'q-calendar-task__head--weekday': true,
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
          (props.weekdayBreakpoints[0]! > 0 &&
            parsedCellWidth.value <= props.weekdayBreakpoints[0]!),
      )
      return h(
        'span',
        {
          class: 'q-calendar__ellipsis',
        },
        props.weekdayBreakpoints &&
          Array.isArray(props.weekdayBreakpoints) &&
          props.weekdayBreakpoints.length > 1 &&
          props.weekdayBreakpoints[1] &&
          props.weekdayBreakpoints[1] > 0 &&
          parsedCellWidth.value <= props.weekdayBreakpoints[1]
          ? minCharWidth(weekdayLabel, Number(props.minWeekdayLabel))
          : weekdayLabel,
      )
    }

    function __renderHeadDayDate(day: Timestamp): VNode {
      const data: Record<string, any> = {
        class: {
          'q-calendar-task__head--date': true,
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
      const scope = { dayLabel, timestamp: day, activeDate }

      const key = day.date

      const data: Record<string, any> = {
        key,
        tabindex: isDateFocusable.value === true ? 0 : -1,
        class: {
          'q-calendar-task__head--day__label': true,
          'q-calendar__button': true,
          'q-calendar__button--round': props.dateType === 'round',
          'q-calendar__button--rounded': props.dateType === 'rounded',
          'q-calendar__button--bordered': day.current === true,
          'q-calendar__hoverable': props.hoverable === true,
          'q-calendar__focusable': isDateFocusable.value === true,
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

    function __renderDateHeader(day: Timestamp): VNode | VNode[] | void {
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

    /**
     * Renders the given day with the associated task
     * @param {Timestamp} day Timestamp representing the day
     * @param {sting} title The Title
     * @param {number} index The task index
     * @returns VNode
     */
    function __renderTitleDay(day: Timestamp, title: string, index: number): VNode {
      const slot = slots['title-day']

      const width = convertToUnit(parsedCellWidth.value)
      const style: CSSProperties = {
        width,
        minWidth: width,
        maxWidth: width,
      }

      const scope = {
        timestamp: day,
        title,
        index,
        cellWidth: parsedCellWidth.value,
      }

      const dayClass = typeof props.dayClass === 'function' ? props.dayClass({ scope }) : {}
      const isFocusable = props.focusable === true && props.focusType.includes('day')

      return h(
        'div',
        {
          class: {
            'q-calendar-task__title--day': true,
            ...dayClass,
            ...getRelativeClasses(day),
            'q-calendar__hoverable': props.hoverable === true,
            'q-calendar__focusable': isFocusable === true,
          },
          style,
        },
        [slot && slot({ scope }), useFocusHelper()],
      )
    }

    function __renderHeadDay(day: Timestamp): VNode {
      const headDaySlot = slots['head-day']
      const headDateSlot = slots['head-date']
      const activeDate = props.noActiveDate !== true && __isActiveDate(day)

      const scope = {
        timestamp: day,
        activeDate,
        droppable: (dragOverHeadDayRef.value = day.date),
        disabled: props.disabledWeekdays
          ? props.disabledWeekdays.includes(Number(day.weekday))
          : false,
      }

      const styler = props.weekdayStyle || dayStyleDefault
      const weekdayClass =
        typeof props.weekdayClass === 'function' ? props.weekdayClass({ scope }) : {}

      const width = convertToUnit(parsedCellWidth.value)
      const style: CSSProperties = {
        width,
        minWidth: width,
        maxWidth: width,
        ...styler({ scope }),
      }

      const key = day.date

      const data: Record<string, any> = {
        key,
        ref: (el: HTMLElement) => {
          datesRef.value[key] = el
        },
        tabindex: isWeekdayFocusable.value === true ? 0 : -1,
        class: {
          'q-calendar-task__head--day': true,
          ...weekdayClass,
          ...getRelativeClasses(day),
          'q-active-date': activeDate,
          'q-calendar__hoverable': props.hoverable === true,
          'q-calendar__focusable': isWeekdayFocusable.value === true,
        },
        style,
        onFocus: () => {
          if (isWeekdayFocusable.value === true) {
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
        headDaySlot === undefined && __renderDateHeader(day),
        headDaySlot === undefined && headDateSlot && headDateSlot({ scope }),
        useFocusHelper(),
      ])
    }

    function __renderHeadDays(): VNode[] {
      return days.value.map((day) => __renderHeadDay(day))
    }

    function __renderTitleDays(title: string, index: number): VNode[] {
      return days.value.map((day) => __renderTitleDay(day, title, index))
    }

    function __renderHeadDaysRow(): VNode {
      return h(
        'div',
        {
          class: {
            'q-calendar-task__head--days': true,
          },
        },
        [...__renderHeadDays()],
      )
    }

    function __renderTitleDaysRow(title: string, index: number): VNode {
      return h(
        'div',
        {
          class: {
            'q-calendar-task__title--days': true,
          },
        },
        [...__renderTitleDays(title, index)],
      )
    }

    // ----

    function __renderHead(): VNode {
      return h(
        'div',
        {
          roll: 'presentation',
          class: {
            'q-calendar-task__head': true,
            'q-calendar__sticky': isSticky.value === true,
          },
          style: {},
        },
        [
          h(
            'div',
            {
              style: {
                position: 'relative',
                display: 'flex',
              },
            },
            [__renderHeadTask(), __renderHeadDaysRow()],
          ),
          props.modelTitle.map((title, index) =>
            h(
              'div',
              {
                class: 'q-calendar-task__title',
                style: {
                  position: 'relative',
                  display: 'flex',
                },
              },
              [__renderTitleTask(title, index), __renderTitleDaysRow(title, index)],
            ),
          ),
        ],
      )
    }

    function __renderBody(): VNode {
      return h(
        'div',
        {
          class: 'q-calendar-task__body',
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
            'q-calendar-task__scroll-area': true,
            'q-calendar__scroll': true,
          },
        },
        [__renderContainer()],
      )
    }

    function __renderTask(): VNode {
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

      // startDate.value = start.date
      // endDate.value = end.date

      const hasWidth = size.width > 0

      const weekly = withDirectives(
        h(
          'div',
          {
            key: startDate.value,
            class: 'q-calendar-task',
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

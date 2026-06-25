import {
  h,
  computed,
  defineComponent,
  getCurrentInstance,
  onBeforeUpdate,
  onMounted,
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
import { getDayIdentifier, parsed, parseTimestamp, type Timestamp, today } from '@timestamp-js/core'

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
import { getDragEventHandlers } from '../composables/useDragAndDrop'
import { useCellWidthProps } from '../composables/useCellWidth'
import type {
  QCalendarTaskSlots,
  TaskDaySlotScope,
  TaskDaysSlotScope,
  TaskHeadDayLabelSlotScope,
  TaskHeadDaySlotScope,
  TaskHeadSlotScope,
  TaskItemSlotScope,
  TaskTitleDaySlotScope,
} from '../slots'

// Directives
import ResizeObserver from '../directives/ResizeObserver'

interface Size {
  width: number
  height: number
}

export function isTaskHeadDayDroppable(dragOverHeadDay: string, day: Timestamp): boolean {
  return dragOverHeadDay === day.date
}

const { renderButton } = useButton()

export default defineComponent({
  name: 'QCalendarTask',

  directives: { ResizeObserver },

  slots: Object as SlotsType<QCalendarTaskSlots>,

  props: {
    ...useTimesProps,
    ...useNavigationProps,
    ...useCellWidthProps,
    ...useMaxDaysProps,
    ...useCommonProps,
    ...useTaskProps, // last for any overrides
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
     * Emitted when the tasks model changes.
     *
     * @param value New tasks array.
     * @param-type value Array
     * @param-tsType value Task[]
     */
    'update:model-tasks',
    /**
     * Emitted when the title model changes.
     *
     * @param value New title rows array.
     * @param-type value Array
     * @param-tsType value any[]
     */
    'update:model-title',
    /**
     * Emitted when the footer model changes.
     *
     * @param value New footer rows array.
     * @param-type value Array
     * @param-tsType value Task[]
     */
    'update:model-footer',
    /**
     * Emitted when a task is expanded or collapsed.
     *
     * @param expanded Whether the task is expanded.
     * @param-type expanded Boolean
     * @param-tsType expanded boolean
     * @param scope Task scope.
     * @param-type scope Object
     * @param-tsType scope TaskItemSlotScope
     */
    'task-expanded',
    ...useCheckChangeEmits,
    ...useMoveEmits,
    /**
     * Interact with the task header.
     *
     * @api-follow getRawMouseEvents
     * @api-scope TaskHeadSlotScope
     * @param scope Task header scope.
     * @param event Native mouse or touch event.
     */
    ...getRawMouseEvents('-head-tasks'),
    /**
     * Interact with a task row.
     *
     * @api-follow getRawMouseEvents
     * @api-scope TaskItemSlotScope
     * @param scope Task row scope.
     * @param event Native mouse or touch event.
     */
    ...getRawMouseEvents('-task'),
    /**
     * Interact with a task date button.
     *
     * @api-follow getRawMouseEvents
     * @api-scope TaskHeadDayLabelSlotScope
     * @param scope Task date button scope.
     * @param event Native mouse or touch event.
     */
    ...getRawMouseEvents('-date'),
    /**
     * Interact with a task day cell.
     *
     * @api-follow getRawMouseEvents
     * @api-scope TaskDaySlotScope
     * @param scope Task day cell scope.
     * @param event Native mouse or touch event.
     */
    ...getRawMouseEvents('-day'),
    /**
     * Interact with a task header day.
     *
     * @api-follow getRawMouseEvents
     * @api-scope TaskHeadDaySlotScope
     * @param scope Task header day scope.
     * @param event Native mouse or touch event.
     */
    ...getRawMouseEvents('-head-day'),
  ],

  setup(props, { slots, emit, expose }) {
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
      keyboardActive = ref(false),
      size = reactive<Size>({ width: 0, height: 0 }),
      dragOverHeadDayRef = ref(''),
      dragOverTask = ref(''),
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

    const { times, setCurrent, updateCurrent: updateCurrentTimes } = useTimes(props)

    // update dates
    updateCurrentTimes()
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
      getDisabledStyle,
      getRelativeClasses,
    } = useCommon(props as CommonProps, { startDate, endDate, times })

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

    const { rootRef, __initCalendar, __renderCalendar } = useCalendar(props, __renderTask, {
      scrollArea,
      pane,
      keyboardActive,
    })

    const {
      // computed
      days,
      parsedStartDate,
      parsedEndDate,
      // methods
    } = useTask(props, emit, {
      times,
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

    const { checkChange } = useCheckChange(emit, { days, lastStart, lastEnd })

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

    const isSticky = ref(true)
    const parsedCellWidth = computed(() => {
      if (props.cellWidth !== undefined) {
        return parseInt(String(props.cellWidth), 10)
      }
      return 150 // default when not specified
    })

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

    onBeforeUpdate(() => {
      datesRef.value = {}
      // weekEventRef.value = []
      // weekRef.value = []
    })

    onMounted(() => {
      __initCalendar()
    })

    // public functions

    /**
     * Moves the task view by a relative amount.
     *
     * @param amount Number of view units to move. Negative values move backward.
     * @param-example amount -1
     */
    function move(amount: number = 1): void {
      moveCalendar(amount)
    }

    /**
     * Moves the task view to today.
     */
    function moveToToday(): void {
      move(0)
    }

    /**
     * Moves the task view forward.
     *
     * @param amount Number of view units to move forward.
     * @param-example amount 1
     */
    function next(amount: number = 1): void {
      move(amount)
    }

    /**
     * Moves the task view backward.
     *
     * @param amount Number of view units to move backward.
     * @param-example amount 1
     */
    function prev(amount: number = 1): void {
      move(-amount)
    }

    /**
     * Refreshes the task view's current date/time state.
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

      const scope: TaskDaySlotScope = {
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
        ...getDisabledStyle(day),
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
          ...getDragEventHandlers(props, {
            targetRef: dragOverResource,
            value: dragValue,
            resetValue: '',
            type: 'day',
            scope,
          }),
        },
        [slot && slot({ scope }), useFocusHelper()],
      )
    }

    function __renderTaskDays(task: Task, taskIndex: number): VNode[] {
      return days.value.map((day) => __renderTaskDay(day, task, taskIndex))
    }

    function __renderTaskDaysRow(task: Task, taskIndex: number): VNode {
      const slot = slots.days
      const scope: TaskDaysSlotScope = {
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
      const scope: TaskItemSlotScope = {
        start: parsedStartDate.value,
        end: parsedEndDate.value,
        task,
        taskIndex,
        indentLevel,
        expanded,
        droppable: dragOverTask.value === task[props.taskKey],
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
          tabindex: isFocusable === true ? 0 : -1,
          class: {
            'q-calendar-task__task--item': true,
            'q-calendar__sticky': isSticky.value === true,
            'q-calendar__hoverable': props.hoverable === true,
            'q-calendar__focusable': isFocusable === true,
          },
          style,
          ...getDragEventHandlers(props, {
            targetRef: dragOverTask,
            value: task[props.taskKey],
            resetValue: '',
            type: 'task',
            scope,
          }),
          onKeydown: (event: KeyboardEvent) => {
            if (isKeyCode(event, [13, 32])) {
              event.stopPropagation()
              event.preventDefault()
            }
          },
          onKeyup: (event: KeyboardEvent) => {
            if (isKeyCode(event, [13, 32]) && emitListeners.value.onClickTask !== undefined) {
              emit('click-task', { scope, event })
            }
          },
          ...getDefaultMouseEventHandlers('-task', (event) => {
            return { scope, event }
          }),
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
      const scope: TaskHeadSlotScope = {
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
          ...getDefaultMouseEventHandlers('-head-tasks', (event) => {
            return { scope, event }
          }),
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
      const scope: TaskHeadDayLabelSlotScope = { dayLabel, timestamp: day, activeDate }

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

      const scope: TaskTitleDaySlotScope = {
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

      const scope: TaskHeadDaySlotScope = {
        timestamp: day,
        activeDate,
        droppable: isTaskHeadDayDroppable(dragOverHeadDayRef.value, day),
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
        ...getDisabledStyle(day),
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
      /**
       * Moves the task view by a relative amount.
       */
      move,
      moveToToday,
      /**
       * Refreshes the task view's current date/time state.
       */
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

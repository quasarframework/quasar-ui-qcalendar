import type { ComponentPublicInstance, ComponentOptions } from 'vue'

export interface QCalendar extends ComponentPublicInstance {
  /**
   * v-model; When set as `YYYY-MM-DD`, the calendar will display the current view on this date. If empty, then it will be changed to the current date which will be emitted
   */
  modelValue: string
  /**
   * Tells QCalendar (wrapper) which calendar component to use
   */
  mode: 'day' | 'month' | 'agenda' | 'resource' | 'scheduler' | 'task'
  /**
   * The type of calendar view to be displayed
   */
  view?:
    | 'month'
    | 'month-interval'
    | 'week'
    | 'day'
    | 'month-scheduler'
    | 'week-scheduler'
    | 'day-scheduler'
    | 'month-agenda'
    | 'week-agenda'
    | 'day-agenda'
    | 'month-resource'
    | 'week-resource'
    | 'day-resource'
  /**
   * Places a calendar in dark mode
   */
  dark?: boolean
  /**
   * Places a border around the calendar
   */
  bordered?: boolean
  /**
   * This is the currently displayed date (highlighted). If not set, then the current date is used
   */
  now?: string
  /**
   * The normal weekdays array looks like this `[0,1,2,3,4,5,6]` where 0=Sunday, 1=Monday, etc. A week that starts on Monday, would look like this: `[1,2,3,4,5,6,0]` and a 5-day workweek would look like this: `[1,2,3,4,5]`
   */
  weekdays?: NumberArray
  /**
   * Turns off automatical generation of aria labels for timestamps
   */
  noAria?: boolean
  /**
   * This controls whether the `q-active-date` css class is set when a user clicks on a date label (button)
   */
  noActiveDate?: boolean
  /**
   * An array of string dates in the form `YYYY-MM-DD` that will be disabled. If an array is contained within the array with a start and end date, it will be treated as a range
   */
  disabledDays?: StringArray
  /**
   * A date in the form `YYYY-MM-DD` where all dates before, and including, will be disabled
   */
  disabledBefore?: string
  /**
   * A date in the form `YYYY-MM-DD` where all dates after, and including, will be disabled
   */
  disabledAfter?: string
  /**
   * Used to change the locale of the calendar
   */
  locale?: string
  /**
   * The number of days to be displayed. Applicable only for custom-interval, scheduler and agenda views. Do not use with `week` or `month` views (set to 0 if setting the view dynamically)
   */
  maxDays?: string
  /**
   * Hide the calendar header.
   */
  hideHeader?: boolean
  /**
   * Displays the weekday label in short format. For instance, 'Monday' would become 'Mon'
   */
  shortWeekdayLabel?: boolean
  /**
   * Turns on animation
   */
  animated?: boolean
  /**
   * Turns on sticky resources and intervals
   */
  sticky?: boolean
  /**
   * Sets day cell width and turns on sticky mode. Width must be css measurement
   */
  cellWidth?: string
  /**
   * When animated property is true, transition to use for previous calendar view
   */
  transitionPrev?: string
  /**
   * When animated property is true, transition to use for next calendar view
   */
  transitionNext?: string
  /**
   * Causes the returning timestamp time to be clamped to the interval it is in
   */
  timeClicksClamped?: boolean
  /**
   * The function to handle dragover events
   */
  dragOverFunc?: Function
  /**
   * The function to handle drop events
   */
  dropFunc?: Function
  /**
   * Turns off the internal scrollbar. Useful if you want to handle your own scrolling
   */
  noScroll?: boolean
  /**
   * Turns on the column-header-before scoped slot
   */
  columnHeaderBefore?: boolean
  /**
   * Turns on the column-header-after scoped slot
   */
  columnHeaderAfter?: boolean
  /**
   * Applicable only for day view. Show the same day x number of times in columns. Scoped slots get this data as index in passed object
   */
  columnCount?: number | string
  /**
   * Applicable only for day view. This is the starting index. This allows you to create a paging system (next/prev) when using column-count property
   */
  columnIndexStart?: number | string
  /**
   * Makes interval labels short
   */
  shortIntervalLabel?: boolean
  /**
   * The maximum height in pixels for the interval height
   */
  intervalHeight?: number | string
  /**
   * The maximum width in pixels for the interval width
   */
  intervalWidth?: number | string
  /**
   * Gets called to provide custom styling of an interval
   */
  intervalStyle?: Function
  /**
   * The number of minutes in an interval
   */
  intervalMinutes?: number | string
  /**
   * The number intervals to use. If interval-minutes is set to 30 then you would set interval count to 48 – double that of regular
   */
  intervalCount?: number | string
  /**
   * The starting interval
   */
  intervalStart?: number | string
  /**
   * Show intervals in 24 hour format
   */
  hour24Format?: boolean
  /**
   * The maximum height in pixels for the day height. Using 0 will make the rows variable height based on content.
   */
  dayHeight?: number | string
  /**
   * Overrides the padding to be used for a day element. You can use any CSS padding format
   */
  dayPadding?: string
  /**
   * Gets called to provide custom styling of a day
   */
  dayStyle?: Function
  /**
   * Gets called to provide custom styling (via classes) of a day
   */
  dayClass?: Function
  /**
   * The minimum number of weeks to be displayed
   */
  minWeeks?: number | string
  /**
   * Makes the month label short. January becomes Jan...
   */
  shortMonthLabel?: boolean
  /**
   * Show work weeks
   */
  showWorkWeeks?: boolean
  /**
   * Do not display the day button in the header
   */
  noDefaultHeaderBtn?: boolean
  /**
   * Do not display the day text in the header
   */
  noDefaultHeaderText?: boolean
  /**
   * Shows the month label - this occurs on the 1st of the month
   */
  showMonthLabel?: boolean
  /**
   * Show the day of the year - this occurs in the top right of each day element. If show-month-label is true, then that day is skipped
   */
  showDayOfYearLabel?: boolean
  /**
   * By default, outside days are disabled in month view. Use the property to enable them.
   */
  enableOutsideDays?: boolean
  /**
   * Do not display the labels of outside days
   */
  noOutsideDays?: boolean
  /**
   * An array of objects with a single key of label. You can add other keys if you like, which will be passed back on the appropriate scoped slots
   */
  resources: ResourceObjectArray
  /**
   * The key from the `resources` object that will be displayed
   */
  resourceKey?: string
  /**
   * The maximum height in pixels for the resource height
   */
  resourceHeight?: number | string
  /**
   * Gets called to provide custom styling of a resource
   */
  resourceStyle?: Function
  /**
   * An array of two dates in format `YYYY-MM-DD` for selection purposes. Interval-based calendars use `YYYY-MM-DD HH:mm`
   */
  selectedStartEndDates?: StringArray
  /**
   * Changes the style `selected-start-end-dates` selection when in `mini-mode`. Typically, set this to `true` on `mousedown` and `false` on `mouseup`
   */
  hover?: boolean
  /**
   * An array of string dates in the form `YYYY-MM-DD` that will be selected. Interval-based calendars use `YYYY-MM-DD HH:mm`
   */
  selectedDates?: StringArray
  /**
   * When `true` puts the calendar into mini-mode. When `auto`, then the property `breakpoint` is used to determine when the calendar will be put into mini-mode
   */
  miniMode?: boolean | 'auto'
  /**
   * This property is used when `mini-mode` is set with `auto`
   */
  breakpoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /**
   * This property is used change the size of the month label button. This property is ignored when `mini-mode` is set to true
   */
  monthLabelSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /**
   * An array of objects used to add columns to the left side of the agenda. Each object must have an id and label key or define the id object key using the `column-options-id` and the label using the `column-options-label` properties. The value of the id should be unique for each object. The object is passed to slots
   */
  leftColumnOptions?: ColumnObjectArray
  /**
   * An array of objects used to add columns to the right side of the agenda. Each object must have an id and label key or define the id object key using the `column-options-id` and the label using the `column-options-label` properties. The value of the id should be unique for each object. The object is passed to slots
   */
  rightColumnOptions?: ColumnObjectArray
  /**
   * The key in the object to use for `left-column-options` or `right-column-options` properties to define the id, otherwise `id` will be used
   */
  columnOptionsId?: string
  /**
   * The key in the object to use for `left-column-options` or `right-column-options` properties to define the label, otherwise `label` will be used
   */
  columnOptionsLabel?: string
  /**
   * Triggers component to display previous (ex: day, week, month)
   */
  prev(): void
  /**
   * Triggers component to display next (ex: day, week, month)
   */
  next(): void
  /**
   * Triggers component to move for count iterations, depending on positive (forwards) or negative (backwards) value
   * @param count The amount of iterations to move (negative for backwards, positive for forwards). If value is 0, emits `today's date` to v-model
   */
  move(count?: number): void
  /**
   * Emits `today's date` to v-model
   */
  moveToToday(): void
  /**
   * Update various values to be consistent with current date
   */
  updateCurrent(): void
  /**
   * Calculates the starting y position of the passed in time
   * @param time The time for which a position is needed in 24-hour format (HH:mm)
   * @param clamp Clamp negative values to 0
   * @returns The absolute y starting position, but `false` on invalid time parameter
   */
  timeStartPos(time?: string, clamp?: boolean): number
  /**
   * Calculates the starting x position of the passed in time
   * @param time The time for which a position is needed in 24-hour format (HH:mm)
   * @returns The absolute x starting position
   */
  timeStartPosX(time?: string): number
  /**
   * Given a duration (in minutes), will return the css height value
   * @param duration The number of minutes for the event to calculate it's height
   * @returns The height (in pixels) to be used for the event
   */
  timeDurationHeight(duration?: number | string): number
  /**
   * Given a duration (in minutes), will return the css width value
   * @param duration The number of minutes for the event to calculate it's width
   * @returns The height (in pixels) to be used for the event
   */
  timeDurationWidth(duration?: number | string): number
  /**
   * Given a height (in pixels) return the duration (in minutes)
   * @param height The number of pixels for the event to calculate it's duration
   * @returns The duration (in minutes) to be used for the event
   */
  heightToMinutes(height?: number | string): number
  /**
   * Given a width (in pixels) return the duration (in minutes)
   * @param duration The number of pixels for the event to calculate it's duration
   * @returns The duration (in minutes) to be used for the event
   */
  widthToMinutes(duration?: number | string): number
  /**
   * When on an interval view, scroll to the passed in time (y position)
   * @param time The time in which to scoll to. If the time is already visible on the viewport, this function will have no affect.
   * @param duration The amount of time in milliseconds to do the scroll
   */
  scrollToTime(time: string, duration?: number): void
  /**
   * When on an resource interval view, scroll to the passed in time (x position)
   * @param time The time in which to scoll to. If the time is already visible on the viewport, this function will have no affect.
   * @param duration The amount of time in milliseconds to do the scroll
   */
  scrollToTimeX(time: string, duration?: number): void
}

export interface QCalendarAgenda extends ComponentPublicInstance {
  /**
   * When set as `YYYY-MM-DD`, the calendar will display the current view on this date. If empty, then it will be changed to the current date which will be emitted. Either use this property (along with a listener for 'update:model-value' event) OR use v-model directive
   */
  modelValue: string
  /**
   * The type of calendar view to be displayed
   */
  view?: StringArray
  /**
   * This is the currently displayed date (highlighted). If not set, then the current date is used
   */
  now?: string
  /**
   * The normal weekdays array looks like this `[0,1,2,3,4,5,6]` where 0=Sunday, 1=Monday, etc. A week that starts on Monday, would look like this: `[1,2,3,4,5,6,0]` and a 5-day workweek would look like this: `[1,2,3,4,5]`
   */
  weekdays?: NumberArray
  /**
   * Shows the current date button as either a circle, rounded or a square
   */
  dateType?: 'round' | 'rounded' | 'square'
  /**
   * Determines the weekday (ie: Sunday, Monday, etc) alignment
   */
  weekdayAlign?: 'left' | 'center' | 'right'
  /**
   * Determines the date (ie: 2, 3, etc) alignment
   */
  dateAlign?: 'left' | 'center' | 'right'
  /**
   * Determines how the date header will be displayed
   */
  dateHeader?: 'stacked' | 'inline' | 'inverted'
  /**
   * Places a border around the calendar
   */
  bordered?: boolean
  /**
   * Places the calendar into dark mode
   */
  dark?: boolean
  /**
   * Turns off aria strings in the calendar
   */
  noAria?: boolean
  /**
   * This controls whether the `q-active-date` css class is set when a user clicks on a date label (button)
   */
  noActiveDate?: boolean
  /**
   * Displays the weekday label in short format. For instance, 'Monday' would become 'Mon'
   */
  shortWeekdayLabel?: boolean
  /**
   * Do not display the weekday text in the header
   */
  noDefaultHeaderText?: boolean
  /**
   * Do not display the date button in the header
   */
  noDefaultHeaderBtn?: boolean
  /**
   * The minimal number of weekday characters when truncation occurs
   */
  minWeekdayLength?: number | string
  /**
   * The breakpoint widths where weekday truncation occurs (needs 2 values)
   */
  weekdayBreakpoints?: NumberArray
  /**
   * Used to change the locale of the calendar. Any acceptable locale can be used that is recognized by the browser. If the locale fails, then 'en-US' is the fallback
   */
  locale?: string
  /**
   * Turns on animated transitions
   */
  animated?: boolean
  /**
   * When animated property is true, transition to use for previous calendar display
   */
  transitionPrev?: string
  /**
   * When animated property is true, transition to use for next calendar display
   */
  transitionNext?: string
  /**
   * The function to handle dragenter events
   */
  dragEnterFunc?: Function
  /**
   * The function to handle dragover events. You must call in your `e.preventDefault()` for Drag and Drop to work properly
   */
  dragOverFunc?: Function
  /**
   * The function to handle dragleave events
   */
  dragLeaveFunc?: Function
  /**
   * The function to handle drop events
   */
  dropFunc?: Function
  /**
   * An array of string dates in the form `YYYY-MM-DD` that will be selected. Interval-based calendars use `YYYY-MM-DD HH:mm`
   */
  selectedDates?: StringArray
  /**
   * An array of two dates in format `YYYY-MM-DD` for selection purposes. Interval-based calendars use `YYYY-MM-DD HH:mm`
   */
  selectedStartEndDates?: StringArray
  /**
   * Allows certain cells within the calendar to be hovered
   */
  hoverable?: boolean
  /**
   * Allows certain cells within the calendar to receive focus
   */
  focusable?: boolean
  /**
   * Describes what can become focusable
   */
  focusType?: StringArray
  /**
   * Gets called to provide custom styling of a weekday
   */
  weekdayStyle?: Function
  /**
   * Gets called to provide custom styling (via classes) of a weekday
   */
  weekdayClass?: Function
  /**
   * The maximum height in pixels for the day height. Using 0 will make the rows variable height based on content.
   */
  dayHeight?: number | string
  /**
   * The minimum height to be used
   */
  dayMinHeight?: number | string
  /**
   * The number of days to be displayed. Do not use with `week` or `month` views (set to 0 if setting the view dynamically)
   */
  maxDays?: string | number
  /**
   * Sets day cell width and turns on sticky mode. Width must be css measurement
   */
  cellWidth?: string
  /**
   * Allows keyboard navigation
   */
  useNavigation?: boolean
  /**
   * Triggers the calendar to show the previous view
   */
  prev(): void
  /**
   * Triggers the calendar to show the next view
   */
  next(): void
  /**
   * Triggers component to move for count iterations, depending on positive (forwards) or negative (backwards) value
   */
  move(): void
  /**
   * Emits `today's date` to v-model
   */
  moveToToday(): void
  /**
   * Update various values to be consistent with current date
   */
  updateCurrent(): void
  /**
   * Calculates the starting y position of the passed in time
   * @param time The time for which a position is needed in 24-hour format (HH:mm)
   * @param clamp Clamp negative values to 0
   * @returns The absolute y starting position, but `false` on invalid time parameter
   */
  timeStartPos(time?: string, clamp?: boolean): number
  /**
   * Given a duration (in minutes), will return the css height value
   * @param duration The number of minutes for the event to calculate it's height
   * @returns The height (in pixels) to be used for the event
   */
  timeDurationHeight(duration?: number | string): number
  /**
   * When on an interval view, scroll to the passed in time (y position)
   * @param time The time in which to scoll to. If the time is already visible on the viewport, this function will have no affect.
   * @param duration The amount of time in milliseconds to do the scroll
   */
  scrollToTime(time: string, duration?: number): void
}

export interface QCalendarDay extends ComponentPublicInstance {
  /**
   * When set as `YYYY-MM-DD`, the calendar will display the current view on this date. If empty, then it will be changed to the current date which will be emitted. Either use this property (along with a listener for 'update:model-value' event) OR use v-model directive
   */
  modelValue: string
  /**
   * The type of calendar view to be displayed
   */
  view?: StringArray
  /**
   * This is the currently displayed date (highlighted). If not set, then the current date is used
   */
  now?: string
  /**
   * The normal weekdays array looks like this `[0,1,2,3,4,5,6]` where 0=Sunday, 1=Monday, etc. A week that starts on Monday, would look like this: `[1,2,3,4,5,6,0]` and a 5-day workweek would look like this: `[1,2,3,4,5]`
   */
  weekdays?: NumberArray
  /**
   * Shows the current date button as either a circle, rounded or a square
   */
  dateType?: 'round' | 'rounded' | 'square'
  /**
   * Determines the weekday (ie: Sunday, Monday, etc) alignment
   */
  weekdayAlign?: 'left' | 'center' | 'right'
  /**
   * Determines the date (ie: 2, 3, etc) alignment
   */
  dateAlign?: 'left' | 'center' | 'right'
  /**
   * Determines how the date header will be displayed
   */
  dateHeader?: 'stacked' | 'inline' | 'inverted'
  /**
   * Places a border around the calendar
   */
  bordered?: boolean
  /**
   * Places the calendar into dark mode
   */
  dark?: boolean
  /**
   * Turns off aria strings in the calendar
   */
  noAria?: boolean
  /**
   * This controls whether the `q-active-date` css class is set when a user clicks on a date label (button)
   */
  noActiveDate?: boolean
  /**
   * Displays the weekday label in short format. For instance, 'Monday' would become 'Mon'
   */
  shortWeekdayLabel?: boolean
  /**
   * Do not display the weekday text in the header
   */
  noDefaultHeaderText?: boolean
  /**
   * Do not display the date button in the header
   */
  noDefaultHeaderBtn?: boolean
  /**
   * The minimal number of weekday characters when truncation occurs
   */
  minWeekdayLength?: number | string
  /**
   * The breakpoint widths where weekday truncation occurs (needs 2 values)
   */
  weekdayBreakpoints?: NumberArray
  /**
   * Used to change the locale of the calendar. Any acceptable locale can be used that is recognized by the browser. If the locale fails, then 'en-US' is the fallback
   */
  locale?: string
  /**
   * Turns on animated transitions
   */
  animated?: boolean
  /**
   * When animated property is true, transition to use for previous calendar display
   */
  transitionPrev?: string
  /**
   * When animated property is true, transition to use for next calendar display
   */
  transitionNext?: string
  /**
   * The function to handle dragenter events
   */
  dragEnterFunc?: Function
  /**
   * The function to handle dragover events. You must call in your `e.preventDefault()` for Drag and Drop to work properly
   */
  dragOverFunc?: Function
  /**
   * The function to handle dragleave events
   */
  dragLeaveFunc?: Function
  /**
   * The function to handle drop events
   */
  dropFunc?: Function
  /**
   * An array, or Set, of string dates in the form `YYYY-MM-DD` that will be selected. Interval-based calendars use `YYYY-MM-DD HH:mm`
   */
  selectedDates?: StringArray
  /**
   * An array of two dates in format `YYYY-MM-DD` for selection purposes. Interval-based calendars use `YYYY-MM-DD HH:mm`
   */
  selectedStartEndDates?: StringArray
  /**
   * Allows certain cells within the calendar to be hovered
   */
  hoverable?: boolean
  /**
   * Allows certain cells within the calendar to receive focus
   */
  focusable?: boolean
  /**
   * Describes what can become focusable
   */
  focusType?: StringArray
  /**
   * Gets called to provide custom styling of a weekday
   */
  weekdayStyle?: Function
  /**
   * Gets called to provide custom styling (via classes) of a weekday
   */
  weekdayClass?: Function
  /**
   * The maximum height in pixels for the day height. Using 0 will make the rows variable height based on content.
   */
  dayHeight?: number | string
  /**
   * The minimum height to be used
   */
  dayMinHeight?: number | string
  /**
   * The number of days to be displayed. Do not use with `week` or `month` views (set to 0 if setting the view dynamically)
   */
  maxDays?: string | number
  /**
   * Sets day cell width and turns on sticky mode. Width must be css measurement
   */
  cellWidth?: string
  /**
   * Allows keyboard navigation
   */
  useNavigation?: boolean
  /**
   * Triggers the calendar to show the previous view
   */
  prev(): void
  /**
   * Triggers the calendar to show the next view
   */
  next(): void
  /**
   * Triggers component to move for count iterations, depending on positive (forwards) or negative (backwards) value
   */
  move(): void
  /**
   * Emits `today's date` to v-model
   */
  moveToToday(): void
  /**
   * Update various values to be consistent with current date
   */
  updateCurrent(): void
  /**
   * Calculates the starting y position of the passed in time
   * @param time The time for which a position is needed in 24-hour format (HH:mm)
   * @param clamp Clamp negative values to 0
   * @returns The absolute y starting position, but `false` on invalid time parameter
   */
  timeStartPos(time?: string, clamp?: boolean): number
  /**
   * Given a duration (in minutes), will return the css height value
   * @param duration The number of minutes for the event to calculate it's height
   * @returns The height (in pixels) to be used for the event
   */
  timeDurationHeight(duration?: number | string): number
  /**
   * When on an interval view, scroll to the passed in time (y position)
   * @param time The time in which to scoll to. If the time is already visible on the viewport, this function will have no affect.
   * @param duration The amount of time in milliseconds to do the scroll
   */
  scrollToTime(time: string, duration?: number): void
}

export interface QCalendarMonth extends ComponentPublicInstance {
  /**
   * When set as `YYYY-MM-DD`, the calendar will display the current view on this date. If empty, then it will be changed to the current date which will be emitted. Either use this property (along with a listener for 'update:model-value' event) OR use v-model directive
   */
  modelValue: string
  /**
   * This is the currently displayed date (highlighted). If not set, then the current date is used
   */
  now?: string
  /**
   * The normal weekdays array looks like this `[0,1,2,3,4,5,6]` where 0=Sunday, 1=Monday, etc. A week that starts on Monday, would look like this: `[1,2,3,4,5,6,0]` and a 5-day workweek would look like this: `[1,2,3,4,5]`
   */
  weekdays?: NumberArray
  /**
   * Shows the current date button as either a circle, rounded or a square
   */
  dateType?: 'round' | 'rounded' | 'square'
  /**
   * Determines the weekday (ie: Sunday, Monday, etc) alignment
   */
  weekdayAlign?: 'left' | 'center' | 'right'
  /**
   * Determines the date (ie: 2, 3, etc) alignment
   */
  dateAlign?: 'left' | 'center' | 'right'
  /**
   * Determines how the date header will be displayed
   */
  dateHeader?: 'stacked' | 'inline' | 'inverted'
  /**
   * Places a border around the calendar
   */
  bordered?: boolean
  /**
   * Places the calendar into dark mode
   */
  dark?: boolean
  /**
   * Turns off aria strings in the calendar
   */
  noAria?: boolean
  /**
   * This controls whether the `q-active-date` css class is set when a user clicks on a date label (button)
   */
  noActiveDate?: boolean
  /**
   * Displays the weekday label in short format. For instance, 'Monday' would become 'Mon'
   */
  shortWeekdayLabel?: boolean
  /**
   * Do not display the weekday text in the header
   */
  noDefaultHeaderText?: boolean
  /**
   * Do not display the date button in the header
   */
  noDefaultHeaderBtn?: boolean
  /**
   * The minimal number of weekday characters when truncation occurs
   */
  minWeekdayLength?: number | string
  /**
   * The breakpoint widths where weekday truncation occurs (needs 2 values)
   */
  weekdayBreakpoints?: NumberArray
  /**
   * Used to change the locale of the calendar. Any acceptable locale can be used that is recognized by the browser. If the locale fails, then 'en-US' is the fallback
   */
  locale?: string
  /**
   * Turns on animated transitions
   */
  animated?: boolean
  /**
   * When animated property is true, transition to use for previous calendar display
   */
  transitionPrev?: string
  /**
   * When animated property is true, transition to use for next calendar display
   */
  transitionNext?: string
  /**
   * The function to handle dragenter events
   */
  dragEnterFunc?: Function
  /**
   * The function to handle dragover events. You must call in your `e.preventDefault()` for Drag and Drop to work properly
   */
  dragOverFunc?: Function
  /**
   * The function to handle dragleave events
   */
  dragLeaveFunc?: Function
  /**
   * The function to handle drop events
   */
  dropFunc?: Function
  /**
   * An array, or Set, of string dates in the form `YYYY-MM-DD` that will be selected. Interval-based calendars use `YYYY-MM-DD HH:mm`
   */
  selectedDates?: StringArray
  /**
   * An array of two dates in format `YYYY-MM-DD` for selection purposes. Interval-based calendars use `YYYY-MM-DD HH:mm`
   */
  selectedStartEndDates?: StringArray
  /**
   * Allows certain cells within the calendar to be hovered
   */
  hoverable?: boolean
  /**
   * Allows certain cells within the calendar to receive focus
   */
  focusable?: boolean
  /**
   * Describes what can become focusable
   */
  focusType?: StringArray
  /**
   * Gets called to provide custom styling of a weekday
   */
  weekdayStyle?: Function
  /**
   * Gets called to provide custom styling (via classes) of a weekday
   */
  weekdayClass?: Function
  /**
   * The maximum height in pixels for the day height. Using 0 will make the rows variable height based on content.
   */
  dayHeight?: number | string
  /**
   * The minimum height to be used
   */
  dayMinHeight?: number | string
  /**
   * The number of days to be displayed
   */
  maxDays?: string | number
  /**
   * Sets day cell width and turns on sticky mode. Width must be css measurement
   */
  cellWidth?: string
  /**
   * Allows keyboard navigation
   */
  useNavigation?: boolean
  /**
   * Triggers the calendar to show the previous view
   */
  prev(): void
  /**
   * Triggers the calendar to show the next view
   */
  next(): void
  /**
   * Triggers component to move for count iterations, depending on positive (forwards) or negative (backwards) value
   */
  move(): void
  /**
   * Emits `today's date` to v-model
   */
  moveToToday(): void
  /**
   * Update various values to be consistent with current date
   */
  updateCurrent(): void
  /**
   * Calculates the starting y position of the passed in time
   * @param time The time for which a position is needed in 24-hour format (HH:mm)
   * @param clamp Clamp negative values to 0
   * @returns The absolute y starting position, but `false` on invalid time parameter
   */
  timeStartPos(time?: string, clamp?: boolean): number
  /**
   * Given a duration (in minutes), will return the css height value
   * @param duration The number of minutes for the event to calculate it's height
   * @returns The height (in pixels) to be used for the event
   */
  timeDurationHeight(duration?: number | string): number
  /**
   * When on an interval view, scroll to the passed in time (y position)
   * @param time The time in which to scoll to. If the time is already visible on the viewport, this function will have no affect.
   * @param duration The amount of time in milliseconds to do the scroll
   */
  scrollToTime(time: string, duration?: number): void
}

export interface QCalendarResource extends ComponentPublicInstance {
  /**
   * When set as `YYYY-MM-DD`, the calendar will display the current view on this date. If empty, then it will be changed to the current date which will be emitted. Either use this property (along with a listener for 'update:model-value' event) OR use v-model directive
   */
  modelValue: string
  /**
   * This is the currently displayed date (highlighted). If not set, then the current date is used
   */
  now?: string
  /**
   * The normal weekdays array looks like this `[0,1,2,3,4,5,6]` where 0=Sunday, 1=Monday, etc. A week that starts on Monday, would look like this: `[1,2,3,4,5,6,0]` and a 5-day workweek would look like this: `[1,2,3,4,5]`
   */
  weekdays?: NumberArray
  /**
   * Shows the current date button as either a circle, rounded or a square
   */
  dateType?: 'round' | 'rounded' | 'square'
  /**
   * Determines the weekday (ie: Sunday, Monday, etc) alignment
   */
  weekdayAlign?: 'left' | 'center' | 'right'
  /**
   * Determines the date (ie: 2, 3, etc) alignment
   */
  dateAlign?: 'left' | 'center' | 'right'
  /**
   * Determines how the date header will be displayed
   */
  dateHeader?: 'stacked' | 'inline' | 'inverted'
  /**
   * Places a border around the calendar
   */
  bordered?: boolean
  /**
   * Places the calendar into dark mode
   */
  dark?: boolean
  /**
   * Turns off aria strings in the calendar
   */
  noAria?: boolean
  /**
   * This controls whether the `q-active-date` css class is set when a user clicks on a date label (button)
   */
  noActiveDate?: boolean
  /**
   * Displays the weekday label in short format. For instance, 'Monday' would become 'Mon'
   */
  shortWeekdayLabel?: boolean
  /**
   * Do not display the weekday text in the header
   */
  noDefaultHeaderText?: boolean
  /**
   * Do not display the date button in the header
   */
  noDefaultHeaderBtn?: boolean
  /**
   * The minimal number of weekday characters when truncation occurs
   */
  minWeekdayLength?: number | string
  /**
   * The breakpoint widths where weekday truncation occurs (needs 2 values)
   */
  weekdayBreakpoints?: NumberArray
  /**
   * Used to change the locale of the calendar. Any acceptable locale can be used that is recognized by the browser. If the locale fails, then 'en-US' is the fallback
   */
  locale?: string
  /**
   * Turns on animated transitions
   */
  animated?: boolean
  /**
   * When animated property is true, transition to use for previous calendar display
   */
  transitionPrev?: string
  /**
   * When animated property is true, transition to use for next calendar display
   */
  transitionNext?: string
  /**
   * The function to handle dragenter events
   */
  dragEnterFunc?: Function
  /**
   * The function to handle dragover events. You must call in your `e.preventDefault()` for Drag and Drop to work properly
   */
  dragOverFunc?: Function
  /**
   * The function to handle dragleave events
   */
  dragLeaveFunc?: Function
  /**
   * The function to handle drop events
   */
  dropFunc?: Function
  /**
   * An array of string dates in the form `YYYY-MM-DD` that will be selected. Interval-based calendars use `YYYY-MM-DD HH:mm`
   */
  selectedDates?: StringArray
  /**
   * An array of two dates in format `YYYY-MM-DD` for selection purposes. Interval-based calendars use `YYYY-MM-DD HH:mm`
   */
  selectedStartEndDates?: StringArray
  /**
   * Allows certain cells within the calendar to be hovered
   */
  hoverable?: boolean
  /**
   * Allows certain cells within the calendar to receive focus
   */
  focusable?: boolean
  /**
   * Describes what can become focusable
   */
  focusType?: StringArray
  /**
   * Gets called to provide custom styling of a weekday
   */
  weekdayStyle?: Function
  /**
   * Gets called to provide custom styling (via classes) of a weekday
   */
  weekdayClass?: Function
  /**
   * The maximum height in pixels for the day height. Using 0 will make the rows variable height based on content.
   */
  dayHeight?: number | string
  /**
   * The minimum height to be used
   */
  dayMinHeight?: number | string
  /**
   * The number of days to be displayed
   */
  maxDays?: string | number
  /**
   * Sets day cell width and turns on sticky mode. Width must be css measurement
   */
  cellWidth?: string
  /**
   * Allows keyboard navigation
   */
  useNavigation?: boolean
  /**
   * Triggers the calendar to show the previous view
   */
  prev(): void
  /**
   * Triggers the calendar to show the next view
   */
  next(): void
  /**
   * Triggers component to move for count iterations, depending on positive (forwards) or negative (backwards) value
   */
  move(): void
  /**
   * Emits `today's date` to v-model
   */
  moveToToday(): void
  /**
   * Update various values to be consistent with current date
   */
  updateCurrent(): void
  /**
   * Calculates the starting y position of the passed in time
   * @param time The time for which a position is needed in 24-hour format (HH:mm)
   * @param clamp Clamp negative values to 0
   * @returns The absolute y starting position, but `false` on invalid time parameter
   */
  timeStartPos(time?: string, clamp?: boolean): number
  /**
   * Given a duration (in minutes), will return the css height value
   * @param duration The number of minutes for the event to calculate it's height
   * @returns The height (in pixels) to be used for the event
   */
  timeDurationHeight(duration?: number | string): number
  /**
   * When on an interval view, scroll to the passed in time (y position)
   * @param time The time in which to scoll to. If the time is already visible on the viewport, this function will have no affect.
   * @param duration The amount of time in milliseconds to do the scroll
   */
  scrollToTime(time: string, duration?: number): void
}

export interface QCalendarScheduler extends ComponentPublicInstance {
  /**
   * When set as `YYYY-MM-DD`, the calendar will display the current view on this date. If empty, then it will be changed to the current date which will be emitted. Either use this property (along with a listener for 'update:model-value' event) OR use v-model directive
   */
  modelValue: string
  /**
   * This is the currently displayed date (highlighted). If not set, then the current date is used
   */
  now?: string
  /**
   * The normal weekdays array looks like this `[0,1,2,3,4,5,6]` where 0=Sunday, 1=Monday, etc. A week that starts on Monday, would look like this: `[1,2,3,4,5,6,0]` and a 5-day workweek would look like this: `[1,2,3,4,5]`
   */
  weekdays?: NumberArray
  /**
   * Shows the current date button as either a circle, rounded or a square
   */
  dateType?: 'round' | 'rounded' | 'square'
  /**
   * Determines the weekday (ie: Sunday, Monday, etc) alignment
   */
  weekdayAlign?: 'left' | 'center' | 'right'
  /**
   * Determines the date (ie: 2, 3, etc) alignment
   */
  dateAlign?: 'left' | 'center' | 'right'
  /**
   * Determines how the date header will be displayed
   */
  dateHeader?: 'stacked' | 'inline' | 'inverted'
  /**
   * Places a border around the calendar
   */
  bordered?: boolean
  /**
   * Places the calendar into dark mode
   */
  dark?: boolean
  /**
   * Turns off aria strings in the calendar
   */
  noAria?: boolean
  /**
   * This controls whether the `q-active-date` css class is set when a user clicks on a date label (button)
   */
  noActiveDate?: boolean
  /**
   * Displays the weekday label in short format. For instance, 'Monday' would become 'Mon'
   */
  shortWeekdayLabel?: boolean
  /**
   * Do not display the weekday text in the header
   */
  noDefaultHeaderText?: boolean
  /**
   * Do not display the date button in the header
   */
  noDefaultHeaderBtn?: boolean
  /**
   * The minimal number of weekday characters when truncation occurs
   */
  minWeekdayLength?: number | string
  /**
   * The breakpoint widths where weekday truncation occurs (needs 2 values)
   */
  weekdayBreakpoints?: NumberArray
  /**
   * Used to change the locale of the calendar. Any acceptable locale can be used that is recognized by the browser. If the locale fails, then 'en-US' is the fallback
   */
  locale?: string
  /**
   * Turns on animated transitions
   */
  animated?: boolean
  /**
   * When animated property is true, transition to use for previous calendar display
   */
  transitionPrev?: string
  /**
   * When animated property is true, transition to use for next calendar display
   */
  transitionNext?: string
  /**
   * The function to handle dragenter events
   */
  dragEnterFunc?: Function
  /**
   * The function to handle dragover events. You must call in your `e.preventDefault()` for Drag and Drop to work properly
   */
  dragOverFunc?: Function
  /**
   * The function to handle dragleave events
   */
  dragLeaveFunc?: Function
  /**
   * The function to handle drop events
   */
  dropFunc?: Function
  /**
   * An array of string dates in the form `YYYY-MM-DD` that will be selected. Interval-based calendars use `YYYY-MM-DD HH:mm`
   */
  selectedDates?: StringArray
  /**
   * An array of two dates in format `YYYY-MM-DD` for selection purposes. Interval-based calendars use `YYYY-MM-DD HH:mm`
   */
  selectedStartEndDates?: StringArray
  /**
   * Allows certain cells within the calendar to be hovered
   */
  hoverable?: boolean
  /**
   * Allows certain cells within the calendar to receive focus
   */
  focusable?: boolean
  /**
   * Describes what can become focusable
   */
  focusType?: StringArray
  /**
   * Gets called to provide custom styling of a weekday
   */
  weekdayStyle?: Function
  /**
   * Gets called to provide custom styling (via classes) of a weekday
   */
  weekdayClass?: Function
  /**
   * The maximum height in pixels for the day height. Using 0 will make the rows variable height based on content.
   */
  dayHeight?: number | string
  /**
   * The minimum height to be used
   */
  dayMinHeight?: number | string
  /**
   * The number of days to be displayed. Do not use with `week` or `month` views (set to 0 if setting the view dynamically)
   */
  maxDays?: string | number
  /**
   * Sets day cell width and turns on sticky mode. Width must be css measurement
   */
  cellWidth?: string
  /**
   * Allows keyboard navigation
   */
  useNavigation?: boolean
  /**
   * Triggers the calendar to show the previous view
   */
  prev(): void
  /**
   * Triggers the calendar to show the next view
   */
  next(): void
  /**
   * Triggers component to move for count iterations, depending on positive (forwards) or negative (backwards) value
   */
  move(): void
  /**
   * Emits `today's date` to v-model
   */
  moveToToday(): void
  /**
   * Update various values to be consistent with current date
   */
  updateCurrent(): void
  /**
   * Calculates the starting y position of the passed in time
   * @param time The time for which a position is needed in 24-hour format (HH:mm)
   * @param clamp Clamp negative values to 0
   * @returns The absolute y starting position, but `false` on invalid time parameter
   */
  timeStartPos(time?: string, clamp?: boolean): number
  /**
   * Given a duration (in minutes), will return the css height value
   * @param duration The number of minutes for the event to calculate it's height
   * @returns The height (in pixels) to be used for the event
   */
  timeDurationHeight(duration?: number | string): number
  /**
   * When on an interval view, scroll to the passed in time (y position)
   * @param time The time in which to scoll to. If the time is already visible on the viewport, this function will have no affect.
   * @param duration The amount of time in milliseconds to do the scroll
   */
  scrollToTime(time: string, duration?: number): void
}

export interface QCalendarTask extends ComponentPublicInstance {
  /**
   * When set as `YYYY-MM-DD`, the calendar will display the current view on this date. If empty, then it will be changed to the current date which will be emitted. Either use this property (along with a listener for 'update:model-value' event) OR use v-model directive
   */
  modelValue: string
  /**
   * An array of Tasks that will be displayed
   */
  modelTasks: TaskObjectArray
  /**
   * An array of title items, each will be displayed via a slot in the title area
   */
  modelTitle?: TitleObjectArray
  /**
   * An array of footer items, each will be displayed via a slot in the footer (summary) area
   */
  modelFooter?: FooterObjectArray
  /**
   * The key in an object to use as the ID (must be unique)
   */
  taskKey?: number | string
  /**
   * Tells the calendar how to display the data
   */
  view: 'day' | 'week' | 'month'
  /**
   * The number of views to show. For instance, if the property `view` was `week`, then setting this property to 2 would show 2 weeks.
   */
  viewCount?: number
  /**
   * The number of pixels needed for the tasks column
   */
  taskWidth?: number
  /**
   * This is the currently displayed date (highlighted). If not set, then the current date is used
   */
  now?: string
  /**
   * The normal weekdays array looks like this `[0,1,2,3,4,5,6]` where 0=Sunday, 1=Monday, etc. A week that starts on Monday, would look like this: `[1,2,3,4,5,6,0]` and a 5-day workweek would look like this: `[1,2,3,4,5]`
   */
  weekdays?: NumberArray
  /**
   * Shows the current date button as either a circle, rounded or a square
   */
  dateType?: 'round' | 'rounded' | 'square'
  /**
   * Determines the weekday (ie: Sunday, Monday, etc) alignment
   */
  weekdayAlign?: 'left' | 'center' | 'right'
  /**
   * Determines the date (ie: 2, 3, etc) alignment
   */
  dateAlign?: 'left' | 'center' | 'right'
  /**
   * Determines how the date header will be displayed
   */
  dateHeader?: 'stacked' | 'inline' | 'inverted'
  /**
   * Places a border around the calendar
   */
  bordered?: boolean
  /**
   * Places the calendar into dark mode
   */
  dark?: boolean
  /**
   * Turns off automatical generation of aria labels for timestamps
   */
  noAria?: boolean
  /**
   * This controls whether the `q-active-date` css class is set when a user clicks on a date label (button)
   */
  noActiveDate?: boolean
  /**
   * Displays the weekday label in short format. For instance, 'Monday' would become 'Mon'
   */
  shortWeekdayLabel?: boolean
  /**
   * Do not display the weekday text in the header
   */
  noDefaultHeaderText?: boolean
  /**
   * Do not display the date button in the header
   */
  noDefaultHeaderBtn?: boolean
  /**
   * The minimal number of weekday characters when truncation occurs
   */
  minWeekdayLabel?: number | string
  /**
   * The breakpoint widths where weekday truncation occurs (needs 2 values)
   */
  weekdayBreakpoints?: NumberArray
  /**
   * Used to change the locale of the calendar. Any acceptable locale can be used that is recognized by the browser. If the locale fails, then 'en-US' is the fallback
   */
  locale?: string
  /**
   * Turns on animated transitions
   */
  animated?: boolean
  /**
   * When animated property is true, transition to use for previous calendar display
   */
  transitionPrev?: string
  /**
   * When animated property is true, transition to use for next calendar display
   */
  transitionNext?: string
  /**
   * An array of string dates in the form `YYYY-MM-DD` that will be disabled. If an array is contained within the array with a start and end date, it will be treated as a range
   */
  disabledDays?: StringArray
  /**
   * A date in the form `YYYY-MM-DD` where all dates before, and including, will be disabled
   */
  disabledBefore?: string
  /**
   * A date in the form `YYYY-MM-DD` where all dates after, and including, will be disabled
   */
  disabledAfter?: string
  /**
   * Similar to `weekdays` property, except values included in this array are automatically made disabled
   */
  disabledWeekdays?: NumberArray
  /**
   * The function to handle dragenter events
   */
  dragEnterFunc?: Function
  /**
   * The function to handle dragover events. You must call in your `e.preventDefault()` for Drag and Drop to work properly
   */
  dragOverFunc?: Function
  /**
   * The function to handle dragleave events
   */
  dragLeaveFunc?: Function
  /**
   * The function to handle drop events
   */
  dropFunc?: Function
  /**
   * An array of string dates in the form `YYYY-MM-DD` that will be selected. Interval-based calendars use `YYYY-MM-DD HH:mm`
   */
  selectedDates?: StringArray
  /**
   * An array of two dates in format `YYYY-MM-DD` for selection purposes. Interval-based calendars use `YYYY-MM-DD HH:mm`
   */
  selectedStartEndDates?: StringArray
  /**
   * Allows certain cells within the calendar to be hovered
   */
  hoverable?: boolean
  /**
   * Allows certain cells within the calendar to receive focus
   */
  focusable?: boolean
  /**
   * Describes what can become focusable
   */
  focusType?: StringArray
  /**
   * Gets called to provide custom styling of a weekday
   */
  weekdayStyle?: Function
  /**
   * Gets called to provide custom styling (via classes) of a weekday
   */
  weekdayClass?: Function
  /**
   * The maximum height in pixels for the day height. Using 0 will make the rows variable height based on content.
   */
  dayHeight?: number | string
  /**
   * The minimum height to be used
   */
  dayMinHeight?: number | string
  /**
   * The number of days to be displayed. Do not use with `week` or `month` views (set to 0 if setting the view dynamically)
   */
  maxDays?: string | number
  /**
   * Sets day cell width and turns on sticky mode. Width is assumed to be in pixels
   */
  cellWidth?: string | number
  /**
   * Allows keyboard navigation
   */
  useNavigation?: boolean
  /**
   * Triggers the calendar to show the previous view
   */
  prev(): void
  /**
   * Triggers the calendar to show the next view
   */
  next(): void
  /**
   * Triggers component to move for count iterations, depending on positive (forward) or negative (backward) value
   */
  move(): void
  /**
   * Emits today's date to v-model
   */
  moveToToday(): void
  /**
   * Update various values to be consistent with current date
   */
  updateCurrent(): void
}

/**
 * Returns today's date in YYYY-MM-DD format
 * @returns Returns today's date in YYYY-MM-DD format
 */
export function today(): string
/**
 * Returns the start of the week based on the passed in arguments
 * @param timestamp A timestamp object
 * @param weekdays The normal weekdays array looks like this `[0,1,2,3,4,5,6]` where 0=Sunday, 1=Monday, etc. A week that starts on Monday, would look like this: `[1,2,3,4,5,6,0]` and a 5-day workweek would look like this: `[1,2,3,4,5]`
 * @param today A timestamp object that represents 'today' or a specified point in time. If passed in, then the relative information to the start-of-week timestamp object will be updated
 * @returns A timestamp object representing the start of the week
 */
export function getStartOfWeek(
  timestamp: Timestamp,
  weekdays: NumberArray,
  today?: Timestamp,
): Timestamp
/**
 * Returns the end of the week based on the passed in arguments
 * @param timestamp A timestamp object
 * @param weekdays The normal weekdays array looks like this `[0,1,2,3,4,5,6]` where 0=Sunday, 1=Monday, etc. A week that starts on Monday, would look like this: `[1,2,3,4,5,6,0]` and a 5-day workweek would look like this: `[1,2,3,4,5]`
 * @param today A timestamp object that represent 'today' or a specified point in time. If passed in, then the relative information to the end-of-week timestamp object will be updated
 * @returns A timestamp object representing the end of the week
 */
export function getEndOfWeek(
  timestamp: Timestamp,
  weekdays: NumberArray,
  today?: Timestamp,
): Timestamp
/**
 * Returns the start of the month based on the passed in timestamp object
 * @param timestamp A timestamp object
 * @returns A timestamp object representing the start of the month
 */
export function getStartOfMonth(timestamp: Timestamp): Timestamp
/**
 * Returns the end of the month based on the passed in timestamp object
 * @param timestamp A timestamp object
 * @returns A timestamp object representing the end of the month
 */
export function getEndOfMonth(timestamp: Timestamp): Timestamp
/**
 * Parses the passed in value and returns the number of minutes since midnight
 * @param input Value may be a Number (minutes since midnight) or String (hh:mm:ss where seconds are optional) or Object (must have keys **hour** and **minute**)
 * @returns The number of minutes since midnight
 */
export function parseTime(input: TimeObjectOrNumberOrString): number
/**
 * Validates the passed in date/time string (YYYY-MM-DD hh:mm:ss)
 * @param input A date/time string in the form `YYYY-MM-DD hh:mm:ss` (seconds are optional)
 * @returns True if the passed in date/time string is of correct form
 */
export function validateTimestamp(input: string): boolean
/**
 * Parses a date/time string to a simple timestamp object. For a more complete timestamp, use parseTimestamp
 * @param input A date/time string in the form `YYYY-MM-DD hh:mm:ss` (seconds are optional)
 * @returns A timestamp object based on the passed in argument. Returns 'null' on error
 */
export function parsed(input: string): TimestampOrNull
/**
 * Parses a date/time string to the timestamp object. Very similar to the `parsed` method, except also updates timestamp with formatted and relative information
 * @param input A date/time string in the form `YYYY-MM-DD hh:mm:ss` (seconds are optional)
 * @param now [Optional] A Timestamp object. If provided, the returning Timestamp will have formatted and relative information included
 * @returns A timestamp object based on the passed in argument. Returns 'null' on error
 */
export function parseTimestamp(input: string, now?: TimestampOrNull): TimestampOrNull
/**
 * Parses a JavaScript Date object to the timestamp object
 * @param input A JavaScript Date object
 * @returns A formatted timestamp object based on the passed in argument (see updateFormatted)
 */
export function parseDate(input: Date): TimestampOrNull
/**
 * Takes a timestamp and returns a JavaScript Date with time set to 00:00
 * @param timestamp A timestamp object
 * @returns The returned value is a JavaScript Date
 */
export function makeDate(timestamp: Timestamp): Date
/**
 * Takes a timestamp and returns a JavaScript Date
 * @param timestamp A timestamp object
 * @returns The returned value is a JavaScript Date
 */
export function makeDateTime(timestamp: Timestamp): Date
/**
 * Turns passed in timestamp object to a day identifier
 * @param timestamp A timestamp object
 * @returns The returned number is in a number representing `YYYYMMdd`
 */
export function getDayIdentifier(timestamp: Timestamp): number
/**
 * Turns passed in timestamp object to a time identifier
 * @param timestamp A timestamp object
 * @returns The returned number is in a number representing `hhmm`
 */
export function getTimeIdentifier(timestamp: Timestamp): number
/**
 * Turns passed in timestamp object to a date/time identifier
 * @param timestamp A timestamp object
 * @returns The returned number is in a number representing `YYYYMMddhhmm`
 */
export function getDayTimeIdentifier(timestamp: Timestamp): number
/**
 * Returns the number of milliseconds between the two days
 * @param timestamp1 A timestamp object
 * @param timestamp2 A timestamp object
 * @param strict If true, then negative values are not allowed
 * @returns The number of milliseconds between the two timestamp objects. 0 if **strict** is true and the value would be negative
 */
export function diffTimestamp(timestamp1: Timestamp, timestamp2: Timestamp, strict: boolean): number
/**
 * Updates the relative information in the timestamp object. The relative information includes, compared to the **now** object, `past`, `current` and `future` booleans
 * @param timestamp A timestamp object
 * @param now A timestamp object representing a **now** time (fixed point in time -- usually **today**)
 * @param time If true, also uses time to adjust the relative information
 * @returns A timestamp object
 */
export function updateRelative(timestamp: Timestamp, now: Timestamp, time?: boolean): Timestamp
/**
 * Updates the timestamp object with the passed in minutes
 * @param timestamp A timestamp object
 * @param minutes The number of minutes since midnight
 * @param now A timestamp object, if set, used to adjust the relative information
 * @returns A timestamp object
 */
export function updateMinutes(timestamp: Timestamp, minutes: number, now?: Timestamp): Timestamp
/**
 * Updates the timestamp object with the weekday information
 * @param timestamp A timestamp object
 * @returns A timestamp object
 */
export function updateWeekday(timestamp: Timestamp): Timestamp
/**
 * Updates the timestamp object with the doy (day of year) information
 * @param timestamp A timestamp object
 * @returns A timestamp object
 */
export function updateDayOfYear(timestamp: Timestamp): Timestamp
/**
 * Updates the timestamp object with the workweek (work week) information
 * @param timestamp A timestamp object
 * @returns A timestamp object
 */
export function updateWorkWeek(timestamp: Timestamp): Timestamp
/**
 * Updates the timestamp object to be disabled if it matches one of the items from `disabledDays`
 * @param timestamp A timestamp object
 * @param disabledBefore A date in the form `YYYY-MM-DD` where all dates before, and including, will be disabled
 * @param disabledAfter A date in the form `YYYY-MM-DD` where all dates after, and including, will be disabled
 * @param disabledWeekdays An array of numbers representing the weekdays, where 0=Sunday to 6=Saturday
 * @param disabledDays An array of disabled days. If an array is contained within the array with a start and end date, it will be treated as a range
 * @returns A timestamp object with `timestamp.disabled` true if a match was found
 */
export function updateDisabled(
  timestamp: Timestamp,
  disabledBefore?: string,
  disabledAfter?: string,
  disabledWeekdays?: NumberArray,
  disabledDays?: StringArray,
): Timestamp
/**
 * Updates the timestamp object with formatted information (`time`, `date`, `weekday`, `doy` and `workweek`)
 * @param timestamp A timestamp object
 * @returns A timestamp object
 */
export function updateFormatted(timestamp: Timestamp): Timestamp
/**
 * Returns the doy (day of year) for an unformatted timestamp
 * @param timestamp A timestamp object
 * @returns The day of the year
 */
export function getDayOfYear(timestamp: Timestamp): number
/**
 * Returns the workweek (work week number) for an unformatted timestamp
 * @param timestamp A timestamp object. If no timestamp is passed, then uses current date
 * @returns The work week number of the year. If passed an invalid date, the return value is always 0
 */
export function getWorkWeek(timestamp?: Timestamp): number
/**
 * Returns the weekday (day of the week) for an unformatted timestamp
 * @param timestamp A timestamp object
 * @returns The week day number (0=Sunday, 1=Monday, etc)
 */
export function getWeekday(timestamp: Timestamp): number
/**
 * Returns true if the passed in year is a leap year
 * @param year A number representing the year in YYYY format
 * @returns Returns true if the passed in year is a leap year
 */
export function isLeapYear(year: number): boolean
/**
 * Returns number of days in the spefified month for the specified year (takes into account leap years)
 * @param year A number representing the year in YYYY format
 * @param month A number representing the month from 0 (January) to 11 (December). For performance reasons, no checking is done to validate this value is in range. An exception will occur if it is not
 * @returns Returns true if the passed in year is a leap year
 */
export function daysInMonth(year: number, month: number): number
/**
 * Makes a copy of the passed Timestamp
 * @param timestamp A timestamp object
 * @returns A copy of the passed in timestamp object
 */
export function copyTimestamp(timestamp: Timestamp): Timestamp
/**
 * Compares two timestamps
 * @param timestamp1 A timestamp object
 * @param timestamp2 A timestamp object
 * @returns true if timestamps are the same, otherwise false
 */
export function compareTimestamps(timestamp1: Timestamp, timestamp2: Timestamp): boolean
/**
 * Compares two timestamps if the dates are the same
 * @param timestamp1 A timestamp object
 * @param timestamp2 A timestamp object
 * @returns true if timestamps dates are the same, otherwise false
 */
export function compareDate(timestamp1: Timestamp, timestamp2: Timestamp): boolean
/**
 * Compares two timestamps if the times are the same
 * @param timestamp1 A timestamp object
 * @param timestamp2 A timestamp object
 * @returns true if timestamps times are the same, otherwise false
 */
export function compareTime(timestamp1: Timestamp, timestamp2: Timestamp): boolean
/**
 * Compares two timestamps if the dates and times are the same
 * @param timestamp1 A timestamp object
 * @param timestamp2 A timestamp object
 * @returns true if timestamps dates and times are the same, otherwise false
 */
export function compareDateTime(timestamp1: Timestamp, timestamp2: Timestamp): boolean
/**
 * Pads the passed in number to the specfied length. Passing in `(2,2)` returns `02`
 * @param x The number to pad
 * @param length The length of the paddedIng
 * @returns A padded value
 */
export function padNumber(x: number, length: number): string
/**
 * Returns the timestamp as a padded date
 * @param timestamp A timestamp object
 * @returns A date as a padded value in the form `YYYY-MM-DD`. Instead of `2020-1-2`, this function formats it as `2020-01-02`
 */
export function getDate(timestamp: Timestamp): string
/**
 * Returns the timestamp as a padded time
 * @param timestamp A timestamp object
 * @returns A time as a padded value in the form `hh:mm`. Instead of `2:3`, this function formats it as `02:03`
 */
export function getTime(timestamp: Timestamp): string
/**
 * Returns the timestamp as a padded date and time. If time is not available, then only the date will be used
 * @param timestamp A timestamp object
 * @returns A date and time as a padded value in the form `YYYY-MM-DD hh:mm`. Instead of `2020-1-2 1:20`, this function formats it as `2020-01-02 01:20`
 */
export function getDateTime(timestamp: Timestamp): string
/**
 * Returns the timestamp set to the next day, updating month and year if needed
 * @param timestamp A timestamp object
 * @returns A timestamp object incremented to the next day
 */
export function nextDay(timestamp: Timestamp): Timestamp
/**
 * Returns the timestamp set to the previous day, updating month and year if needed
 * @param timestamp A timestamp object
 * @returns A timestamp object decremented to the next day
 */
export function prevDay(timestamp: Timestamp): Timestamp
/**
 * Returns the timestamp set to the relative day
 * @param timestamp A timestamp object
 * @param mover A reference that points to a function that handles the relative movement from one date to another. If moving backwards, specify `prevDay`
 * @param days The number of days to move
 * @param allowedWeekdays The allow weekdays to use. The method uses this information for allowed days
 * @returns A timestamp object moved to the relatively specified days against the `allowedWeekdays`
 */
export function relativeDays(
  timestamp: Timestamp,
  mover?: TimestampMoveOperation,
  days?: number,
  allowedWeekdays?: NumberArray,
): Timestamp
/**
 * Returns the timestamp set to the relative day, takes into account allowed weekdays
 * @param timestamp A timestamp object
 * @param mover A reference that points to a function that handles the relative movement from one date to another. If moving backwards, specify `prevDay`
 * @param days The number of days to move
 * @param allowedWeekdays The allow weekdays to use. The method uses this information for allowed days
 * @returns A timestamp object moved to the relatively specified days against the `allowedWeekdays`
 */
export function moveRelativeDays(
  timestamp: Timestamp,
  mover?: TimestampMoveOperation,
  days?: number,
  allowedWeekdays?: NumberArray,
): Timestamp
/**
 * Returns the timestamp associated to the specified weekday. Use `parseTimestamp`, not `parsed` (or manually call `updateFormatted` before calling this method), so associated fields are updated correctly, otherwise this function will not work as expected.
 * @param timestamp A timestamp object
 * @param mover A reference that points to a function that handles the relative movement from one date to another. If moving backwards, specify `prevDay`
 * @param maxDays The maxiumum number of days to move
 * @returns A timestamp object moved to the specified days relatively against the `maxDays`
 */
export function findWeekday(
  timestamp: Timestamp,
  mover?: TimestampMoveOperation,
  maxDays?: number,
): Timestamp
/**
 * Returns the weekday skips in an array of 0's (off) and 1's (on). Basically, can convert `[1,2,3,4,5]` to `[0,1,1,1,1,1,0]`
 * @param weekdays The normal weekdays array looks like this `[0,1,2,3,4,5,6]` where 0=Sunday, 1=Monday, etc. A week that starts on Monday, would look like this: `[1,2,3,4,5,6,0]` and a 5-day workweek would look like this: `[1,2,3,4,5]`
 * @returns An array of 7 (representing a week) of 0's (hidden) and 1's (displayed)
 */
export function getWeekdaySkips(weekdays: NumberArray): NumberArray
/**
 * Returns an array of timestamps
 * @param start A timestamp object
 * @param end A timestamp object
 * @param now A timestamp object
 * @param weekdays An array of numbers (representing days of the week) that are 0 (=Sunday) to 6 (=Saturday)
 * @param disabledBefore A date in the form `YYYY-MM-DD` where all dates before, and including, will be disabled
 * @param disabledAfter A date in the form `YYYY-MM-DD` where all dates after, and including, will be disabled
 * @param disabledWeekdays An array of numbers representing the weekdays, where 0=Sunday to 6=Saturday
 * @param disabledDays An array of string dates in the form `YYYY-MM-DD` that representing disabled days
 * @param max Maximum days required. 42 is the maxiumum number of days in a full calendar month (6 rows) with `outside` days
 * @param min Minimum days required
 * @returns An array of timestamp objects for all days that meet the criteria
 */
export function createDayList(
  start: Timestamp,
  end: Timestamp,
  now: Timestamp,
  weekdays: NumberArray,
  disabledBefore?: string,
  disabledAfter?: string,
  disabledWeekdays?: NumberArray,
  disabledDays?: StringArray,
  max?: number,
  min?: number,
): TimestampArray
/**
 * Returns an array of intervals
 * @param timestamp A timestamp object representing the day for the intervals
 * @param first The first interval
 * @param minutes The number of minutes in an interval
 * @param count The count of intervals requested
 * @param now A timestamp object that represents 'today' or a specified point in time
 * @returns A array of interval objects (timestamps with time) that meet the criteria
 */
export function createIntervalList(
  timestamp: Timestamp,
  first: number,
  minutes: number,
  count: number,
  now: Timestamp,
): TimestampArray
/**
 * Returns a function to be used for international date formatting purposes
 * @param local A string representing the locale to use (ie: en-US for America)
 * @param getOptions A function that passes the timestamp and a boolean, and returns an Intl.DateTimeFormatter
 * @returns A function that takes a timestamp and a boolean and returns a formatted string.
 */
export function createNativeLocaleFormatter(
  local: string,
  getOptions: TimestampFormatOptions,
): TimestampFormatter
/**
 * Validates that input is a number
 * @param input A numeric value
 * @returns true if a number, otherwise false
 */
export function validateNumber(input: number | string): boolean
/**
 * Given an array of Timestamps, returns the highest one
 * @param timestamps An array of timestamp objects
 * @param useTime [Optional] Use time in the comparison
 * @returns The highest valued Timestamp
 */
export function maxTimestamp(timestamps: TimestampArray, useTime?: boolean): Timestamp
/**
 * Given an array of Timestamps, returns the lowest one
 * @param timestamps An array of timestamp objects
 * @param useTime [Optional] Use time in the comparison
 * @returns The highest valued Timestamp
 */
export function minTimestamp(timestamps: TimestampArray, useTime?: boolean): Timestamp
/**
 * Checks passed timestamp is between start and end timestamps
 * @param timestamp A timestamp object
 * @param startTimestamp The starting timestamp object to use for the comparison
 * @param endTimestamp The ending timestamp object to use for the comparison
 * @param useTime [Optional] Use time in the comparison
 * @returns true if a date is between the start and end dates
 */
export function isBetweenDates(
  timestamp: Timestamp,
  startTimestamp: Timestamp,
  endTimestamp: Timestamp,
  useTime?: boolean,
): boolean
/**
 * Checks passed start and end timestamps overlap the first and last timestamps. This method can be used to find if an event, with start and end dates overlap a range, like a week
 * @param startTimestamp The starting timestamp object to use for the comparison
 * @param endTimestamp The ending timestamp object to use for the comparison
 * @param firstTimestamp The first timestamp object to use for the comparison (typically the first day in a week)
 * @param lastTimestamp The last timestamp object to use for the comparison (typically the last day in a week)
 * @returns true if the start and end timestamps overlap the first and last timestamps
 */
export function isOverlappingDates(
  startTimestamp: Timestamp,
  endTimestamp: Timestamp,
  firstTimestamp: Timestamp,
  lastTimestamp: Timestamp,
): boolean
/**
 * Returns the number days between two timestamps
 * @param startTimestamp The starting timestamp object to use for the comparison
 * @param endTimestamp The ending timestamp object to use for the comparison
 * @returns The number of days beween the two timestamps
 */
export function daysBetween(startTimestamp: Timestamp, endTimestamp: Timestamp): number
/**
 * Returns the number weeks between two timestamps
 * @param startTimestamp The starting timestamp object to use for the comparison
 * @param endTimestamp The ending timestamp object to use for the comparison
 * @returns The number of weeks beween the two timestamps
 */
export function weeksBetween(startTimestamp: Timestamp, endTimestamp: Timestamp): number
/**
 * Takes a timestamp and increments/decrements based on options
 * @param timestamp A timestamp object
 * @param options The options passed to the method. All items are optional and can be positive or negative
 * @returns A copy of the modified timestamp object with the applied options
 */
export function addToDate(timestamp: Timestamp, options: AddToDateOptions): Timestamp
/**
 * Returns a function to be used for international formatting purposes for the weekday
 * @returns This uses the Intl.DateTimeFormat function of the browser
 */
export function getWeekdayFormatter(): WeekdayFormatter
/**
 * Returns an array of localized weekday names in either 'long', 'short', or 'narrow' format
 * @param type The values represent how the day of the week will be displayed
 * @param locale Any locale accepted by the browser can be used
 * @returns An array of localized weekday names
 */
export function getWeekdayNames(type?: 'long' | 'short' | 'narrow', locale?: string): StringArray
/**
 * Returns a function to be used for international formatting purposes for the month
 * @returns This uses the Intl.DateTimeFormat function of the browser
 */
export function getMonthFormatter(): MonthFormatter
/**
 * Returns an array of localized month names in either 'long', 'short', or 'narrow' format
 * @param type The values represent how the day of the month will be displayed
 * @param locale Any locale accepted by the browser can be used
 * @returns An array of localized month names
 */
export function getMonthNames(type?: 'long' | 'short' | 'narrow', locale?: string): StringArray

export interface AddToDateOptions {
  /**
   * [Optional] The amount to increment/decrement the year
   */
  year?: number | string
  /**
   * [Optional] The amount to increment/decrement the month
   */
  month?: number | string
  /**
   * [Optional] The amount to increment/decrement the day
   */
  day?: number | string
  /**
   * [Optional] The amount to increment/decrement the hour
   */
  hour?: number | string
  /**
   * [Optional] The amount to increment/decrement the minute
   */
  minute?: number | string
}

import {
  Timestamp,
  NumberArray,
  StringArray,
  ResourceObjectArray,
  ColumnObjectArray,
  TaskObjectArray,
  TitleObjectArray,
  FooterObjectArray,
  TimeObjectOrNumberOrString,
  TimestampOrNull,
  TimestampMoveOperation,
  TimestampArray,
  TimestampFormatOptions,
  TimestampFormatter,
  WeekdayFormatter,
  MonthFormatter,
} from './types'

declare module 'vue' {
  interface ComponentCustomProperties {}
}
export * from './types'
export as namespace QCalendar
export as namespace QCalendarAgenda
export as namespace QCalendarDay
export as namespace QCalendarMonth
export as namespace QCalendarResource
export as namespace QCalendarScheduler
export as namespace QCalendarTask
export const QCalendar: ComponentOptions
export const QCalendarAgenda: ComponentOptions
export const QCalendarDay: ComponentOptions
export const QCalendarMonth: ComponentOptions
export const QCalendarResource: ComponentOptions
export const QCalendarScheduler: ComponentOptions
export const QCalendarTask: ComponentOptions

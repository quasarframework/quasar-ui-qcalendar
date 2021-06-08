const biTwitter = 'M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z|0 0 16 16'
const biGithub = 'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z|0 0 16 16'
// const biHeartFill = 'M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z@@fill-rule:evenodd;|0 0 16 16'
const mdiCharity = 'M12.75,3.94C13.75,3.22 14.91,2.86 16.22,2.86C16.94,2.86 17.73,3.05 18.59,3.45C19.45,3.84 20.13,4.3 20.63,4.83C21.66,6.11 22.09,7.6 21.94,9.3C21.78,11 21.22,12.33 20.25,13.27L12.66,20.86C12.47,21.05 12.23,21.14 11.95,21.14C11.67,21.14 11.44,21.05 11.25,20.86C11.06,20.67 10.97,20.44 10.97,20.16C10.97,19.88 11.06,19.64 11.25,19.45L15.84,14.86C16.09,14.64 16.09,14.41 15.84,14.16C15.59,13.91 15.36,13.91 15.14,14.16L10.55,18.75C10.36,18.94 10.13,19.03 9.84,19.03C9.56,19.03 9.33,18.94 9.14,18.75C8.95,18.56 8.86,18.33 8.86,18.05C8.86,17.77 8.95,17.53 9.14,17.34L13.73,12.75C14,12.5 14,12.25 13.73,12C13.5,11.75 13.28,11.75 13.03,12L8.44,16.64C8.25,16.83 8,16.92 7.73,16.92C7.45,16.92 7.21,16.83 7,16.64C6.8,16.45 6.7,16.22 6.7,15.94C6.7,15.66 6.81,15.41 7.03,15.19L11.63,10.59C11.88,10.34 11.88,10.11 11.63,9.89C11.38,9.67 11.14,9.67 10.92,9.89L6.28,14.5C6.06,14.7 5.83,14.81 5.58,14.81C5.3,14.81 5.06,14.71 4.88,14.5C4.69,14.3 4.59,14.06 4.59,13.78C4.59,13.5 4.69,13.27 4.88,13.08C7.94,10 9.83,8.14 10.55,7.45L14.11,10.97C14.5,11.34 14.95,11.53 15.5,11.53C16.2,11.53 16.75,11.25 17.16,10.69C17.44,10.28 17.54,9.83 17.46,9.33C17.38,8.83 17.17,8.41 16.83,8.06L12.75,3.94M14.81,10.27L10.55,6L3.47,13.08C2.63,12.23 2.15,10.93 2.04,9.16C1.93,7.4 2.41,5.87 3.47,4.59C4.66,3.41 6.08,2.81 7.73,2.81C9.39,2.81 10.8,3.41 11.95,4.59L16.22,8.86C16.41,9.05 16.5,9.28 16.5,9.56C16.5,9.84 16.41,10.08 16.22,10.27C16.03,10.45 15.8,10.55 15.5,10.55C15.23,10.55 15,10.45 14.81,10.27V10.27Z'

const menu = [
  {
    name: 'All about QCalendar',
    path: 'all-about-qcalendar',
    expanded: false,
    children: [
      {
        name: 'What is QCalendar',
        path: 'what-is-qcalendar'
      },
      {
        name: 'Installation types',
        path: 'installation-types'
      },
      {
        name: 'Anatomy of a calendar',
        path: 'anatomy-of-a-calendar'
      }
    ]
  },
  {
    name: 'Developing',
    path: 'developing',
    expanded: false,
    children: [
      {
        name: 'Getting started',
        path: 'getting-started'
      },
      {
        name: 'QCalendar transitions',
        path: 'qcalendar-transitions'
      },
      {
        name: 'QCalendar (wrapper)',
        path: 'qcalendar'
      },
      {
        name: 'QCalendarDay',
        path: 'qcalendarday',
        children: [
          {
            name: 'Day - Getting started',
            path: 'day-getting-started'
          },
          {
            name: 'Day - Alignment',
            path: 'day-alignment'
          },
          {
            name: 'Day - Date type',
            path: 'day-date-type'
          },
          {
            name: 'Day - Dark',
            path: 'day-dark'
          },
          {
            name: 'Day - Column count',
            path: 'day-column-count'
          },
          {
            name: 'Day - 3 Day',
            path: 'day-3day'
          },
          {
            name: 'Day - Max days',
            path: 'day-max-days'
          },
          {
            name: 'Day - Month',
            path: 'day-month'
          },
          {
            name: 'Day - No active date',
            path: 'day-no-active-date'
          },
          {
            name: 'Day - Now',
            path: 'day-now'
          },
          {
            name: 'Day - 24-hour format',
            path: 'day-24-hour'
          },
          {
            name: 'Day - No header',
            path: 'day-no-header'
          },
          {
            name: 'Day - Custom header',
            path: 'day-custom-header'
          },
          {
            name: 'Day - No scroll',
            path: 'day-no-scroll'
          },
          {
            name: 'Day - Disabled days',
            path: 'day-disabled-days'
          },
          {
            name: 'Day - Disabled before/after',
            path: 'day-disabled-before-after'
          },
          {
            name: 'Day - Disabled weekdays',
            path: 'day-disabled-weekdays'
          },
          {
            name: 'Day - Cell width',
            path: 'day-cell-width'
          },
          {
            name: 'Day - Interval count',
            path: 'day-interval-count'
          },
          {
            name: 'Day - Interval height',
            path: 'day-interval-height'
          },
          {
            name: 'Day - Interval minutes (15)',
            path: 'day-interval-minutes-15'
          },
          {
            name: 'Day - Interval minutes (30)',
            path: 'day-interval-minutes-30'
          },
          {
            name: 'Day - Interval start',
            path: 'day-interval-start'
          },
          {
            name: 'Day - Modify Intervals',
            path: 'day-modify-intervals'
          },
          {
            name: 'Day - Selected intervals',
            path: 'day-selected-intervals'
          },
          {
            name: 'Day - Range selection',
            path: 'day-range-selection'
          },
          {
            name: 'Day - Drag and drop',
            path: 'day-drag-and-drop'
          },
          {
            name: 'Day - Locale',
            path: 'day-locale'
          },
          {
            name: 'Day - Navigation',
            path: 'day-navigation'
          },
          {
            name: 'Day - Theme',
            path: 'day-theme'
          },
          {
            name: 'Day - (Slot) column header',
            path: 'day-slot-column-header'
          },
          {
            name: 'Day - (Slot) head day',
            path: 'day-slot-head-day'
          },
          {
            name: 'Day - (Slot) head day event',
            path: 'day-slot-head-day-event'
          },
          {
            name: 'Day - (Slot) head intervals',
            path: 'day-slot-head-intervals'
          },
          {
            name: 'Day - (Slot) day body',
            path: 'day-slot-day-body'
          },
          {
            name: 'Day - (Slot) show current time',
            path: 'day-slot-show-current-time'
          }
        ]
      },
      {
        name: 'QCalendarDay (week)',
        path: 'qcalendarday-week',
        children: [
          {
            name: 'Week - Getting started',
            path: 'week-getting-started'
          },
          {
            name: 'Week - Alignment',
            path: 'week-alignment'
          },
          {
            name: 'Week - Date type',
            path: 'week-date-type'
          },
          {
            name: 'Week - Dark',
            path: 'week-dark'
          },
          {
            name: 'Week - No active date',
            path: 'week-no-active-date'
          },
          {
            name: 'Week - Now',
            path: 'week-now'
          },
          {
            name: 'Week - 24-hour format',
            path: 'week-24-hour'
          },
          {
            name: 'Week - First day monday',
            path: 'week-first-day-monday'
          },
          {
            name: 'Week - Five day workweek',
            path: 'week-five-day-workweek'
          },
          {
            name: 'Week - No header',
            path: 'week-no-header'
          },
          {
            name: 'Week - No scroll',
            path: 'week-no-scroll'
          },
          {
            name: 'Week - Disabled days',
            path: 'week-disabled-days'
          },
          {
            name: 'Week - Disabled before/after',
            path: 'week-disabled-before-after'
          },
          {
            name: 'Week - Disabled weekdays',
            path: 'week-disabled-weekdays'
          },
          {
            name: 'Week - Cell width',
            path: 'week-cell-width'
          },
          {
            name: 'Week - Focusable/hoverable',
            path: 'week-focusable-hoverable'
          },
          {
            name: 'Week - Interval count',
            path: 'week-interval-count'
          },
          {
            name: 'Week - Interval height',
            path: 'week-interval-height'
          },
          {
            name: 'Week - Interval minutes (15)',
            path: 'week-interval-minutes-15'
          },
          {
            name: 'Week - Interval minutes (30)',
            path: 'week-interval-minutes-30'
          },
          {
            name: 'Week - Interval start',
            path: 'week-interval-start'
          },
          {
            name: 'Week - Modify Intervals',
            path: 'week-modify-intervals'
          },
          {
            name: 'Week - Selected intervals',
            path: 'week-selected-intervals'
          },
          {
            name: 'Week - Range selection',
            path: 'week-range-selection'
          },
          {
            name: 'Week - Drag and drop',
            path: 'week-drag-and-drop'
          },
          {
            name: 'Week - Locale',
            path: 'week-locale'
          },
          {
            name: 'Week - Navigation',
            path: 'week-navigation'
          },
          {
            name: 'Week - Theme',
            path: 'week-theme'
          },
          {
            name: 'Week - (Slot) column header',
            path: 'week-slot-column-header'
          },
          {
            name: 'Week - (Slot) day body',
            path: 'week-slot-day-body'
          },
          {
            name: 'Week - (Slot) head day',
            path: 'week-slot-head-day'
          },
          {
            name: 'Week - (Slot) head day event',
            path: 'week-slot-head-day-event'
          },
          {
            name: 'Week - (Slot) head days event absolute',
            path: 'week-slot-head-days-event-absolute'
          },
          {
            name: 'Week - (Slot) head intervals',
            path: 'week-slot-head-intervals'
          },
          {
            name: 'Week - (Slot) show current time',
            path: 'week-slot-show-current-time'
          }
        ]
      },
      {
        name: 'QCalendarMonth',
        path: 'qcalendarmonth',
        children: [
          {
            name: 'Month - Getting started',
            path: 'month-getting-started'
          },
          {
            name: 'Month - Date type',
            path: 'month-date-type'
          },
          {
            name: 'Month - Alignment',
            path: 'month-alignment'
          },
          {
            name: 'Month - Dark',
            path: 'month-dark'
          },
          {
            name: 'Month - Min weeks',
            path: 'month-min-weeks'
          },
          {
            name: 'Month - First day monday',
            path: 'month-first-day-monday'
          },
          {
            name: 'Month - five day workweek',
            path: 'month-five-day-workweek'
          },
          {
            name: 'Month - Day of year',
            path: 'month-day-of-year'
          },
          {
            name: 'Month - Workweeks',
            path: 'month-workweeks'
          },
          {
            name: 'Month - Day height',
            path: 'month-day-height'
          },
          {
            name: 'Month - No active date',
            path: 'month-no-active-date'
          },
          {
            name: 'Month - Now',
            path: 'month-now'
          },
          {
            name: 'Month - No outside days',
            path: 'month-no-outside-days'
          },
          {
            name: 'Month - Label size',
            path: 'month-label-size'
          },
          {
            name: 'Month - Focusable/hoverable',
            path: 'month-focusable-hoverable'
          },
          {
            name: 'Month - Navigation',
            path: 'month-navigation'
          },
          {
            name: 'Month - Disabled days',
            path: 'month-disabled-days'
          },
          {
            name: 'Month - Disabled before/after',
            path: 'month-disabled-before-after'
          },
          {
            name: 'Month - Disabled weekdays',
            path: 'month-disabled-weekdays'
          },
          {
            name: 'Month - Selected dates',
            path: 'month-selected-dates'
          },
          {
            name: 'Month - Range selection',
            path: 'month-range-selection'
          },
          {
            name: 'Month - Drag and drop',
            path: 'month-drag-and-drop'
          },
          {
            name: 'Month - Locale',
            path: 'month-locale'
          },
          {
            name: 'Month - Theme',
            path: 'month-theme'
          },
          {
            name: 'Month - (Slot) day',
            path: 'month-slot-day'
          },
          {
            name: 'Month - (Slot) week',
            path: 'month-slot-week'
          },
          {
            name: 'Month - (Slot) day (holidays)',
            path: 'month-slot-day-holidays'
          }
        ]
      },
      {
        name: 'QCalendarMonth (mini-mode)',
        path: 'qcalendarmonth-minimode',
        children: [
          {
            name: 'Mini-mode - Getting started',
            path: 'minimode-getting-started'
          },
          {
            name: 'Mini-mode - Date type',
            path: 'minimode-date-type'
          },
          {
            name: 'Mini-mode - Dark',
            path: 'minimode-dark'
          },
          {
            name: 'Mini-mode - Min. weekday label',
            path: 'minimode-min-weekday-label'
          },
          {
            name: 'Mini-mode - Min weeks',
            path: 'minimode-min-weeks'
          },
          {
            name: 'Mini-mode - First day monday',
            path: 'minimode-first-day-monday'
          },
          {
            name: 'Mini-mode - five day workweek',
            path: 'minimode-five-day-workweek'
          },
          {
            name: 'Mini-mode - No active date',
            path: 'minimode-no-active-date'
          },
          {
            name: 'Mini-mode - Now',
            path: 'minimode-now'
          },
          {
            name: 'Mini-mode - No outside days',
            path: 'minimode-no-outside-days'
          },
          {
            name: 'Mini-mode - Workweeks',
            path: 'minimode-workweeks'
          },
          {
            name: 'Mini-mode - Breakpoint',
            path: 'minimode-breakpoint'
          },
          {
            name: 'Mini-mode - Disabled days',
            path: 'minimode-disabled-days'
          },
          {
            name: 'Mini-mode - Disabled before/after',
            path: 'minimode-disabled-before-after'
          },
          {
            name: 'Mini-mode - Disabled weekdays',
            path: 'minimode-disabled-weekdays'
          },
          {
            name: 'Mini-mode - Navigation',
            path: 'minimode-navigation'
          },
          {
            name: 'Mini-mode - Selected dates',
            path: 'minimode-selected-dates'
          },
          {
            name: 'Mini-mode - Range selection',
            path: 'minimode-selection'
          },
          {
            name: 'Mini-mode - Multi-month range selection',
            path: 'minimode-multi-month-selection'
          },
          {
            name: 'Mini-mode - Locale',
            path: 'minimode-locale'
          },
          {
            name: 'Mini-mode - Theme',
            path: 'minimode-theme'
          }
        ]
      },
      {
        name: 'QCalendarAgenda',
        path: 'qcalendaragenda',
        children: [
          {
            name: 'Agenda - Getting started',
            path: 'agenda-getting-started'
          },
          {
            name: 'Agenda - Column count',
            path: 'agenda-column-count'
          },
          {
            name: 'Agenda - Column options',
            path: 'agenda-column-options'
          },
          {
            name: 'Agenda - Alignment',
            path: 'agenda-alignment'
          },
          {
            name: 'Agenda - Date type',
            path: 'agenda-date-type'
          },
          {
            name: 'Agenda - Dark',
            path: 'agenda-dark'
          },
          {
            name: 'Agenda - First Day Monday',
            path: 'agenda-first-day-monday'
          },
          {
            name: 'Agenda - Five Day Workweek',
            path: 'agenda-five-day-workweek'
          },
          {
            name: 'Agenda - No active date',
            path: 'agenda-no-active-date'
          },
          {
            name: 'Agenda - Now',
            path: 'agenda-now'
          },
          {
            name: 'Agenda - Disabled days',
            path: 'agenda-disabled-days'
          },
          {
            name: 'Agenda - Disabled before/after',
            path: 'agenda-disabled-before-after'
          },
          {
            name: 'Agenda - Disabled weekdays',
            path: 'agenda-disabled-weekdays'
          },
          {
            name: 'Agenda - Cell width',
            path: 'agenda-cell-width'
          },
          {
            name: 'Agenda - Locale',
            path: 'agenda-locale'
          },
          {
            name: 'Agenda - Theme',
            path: 'agenda-theme'
          },
          {
            name: 'Agenda - Planner (example)',
            path: 'agenda-planner'
          }
        ]
      },
      {
        name: 'QCalendarResource',
        path: 'qcalendarresource',
        children: [
          {
            name: 'Resource - Getting started',
            path: 'resource-getting-started'
          },
          {
            name: 'Resource - Dark',
            path: 'resource-dark'
          },
          {
            name: 'Resource - Hour24 format',
            path: 'resource-hour24-format'
          },
          {
            name: 'Resource - No sticky',
            path: 'resource-no-sticky'
          },
          {
            name: 'Resource - Focusable/hoverable',
            path: 'resource-focusable-hoverable'
          },
          {
            name: 'Resource - Modify intervals',
            path: 'resource-modify-intervals'
          },
          {
            name: 'Resource - Children',
            path: 'resource-children'
          },
          {
            name: 'Resource - Width/height',
            path: 'resource-width-height'
          },
          {
            name: 'Resource - Custom height',
            path: 'resource-custom-height'
          },
          {
            name: 'Resource - Theme',
            path: 'resource-theme'
          },
          {
            name: 'Resource - (Slot) resource label',
            path: 'resource-slot-resource-label'
          },
          {
            name: 'Resource - (Slot) head resources',
            path: 'resource-slot-head-resources'
          },
          {
            name: 'Resource - (Slot) interval label',
            path: 'resource-slot-interval-label'
          },
          {
            name: 'Resource - (Slot) resource intervals',
            path: 'resource-slot-resource-intervals'
          }
        ]
      },
      {
        name: 'QCalendarScheduler',
        path: 'qcalendarscheduler',
        // fasCalendar
        children: [
          {
            name: 'Scheduler - Getting started',
            path: 'scheduler-getting-started'
          },
          {
            name: 'Scheduler - Dark',
            path: 'scheduler-dark'
          },
          {
            name: 'Scheduler - Alignment',
            path: 'scheduler-alignment'
          },
          {
            name: 'Scheduler - Date type',
            path: 'scheduler-date-type'
          },
          {
            name: 'Scheduler - First day monday',
            path: 'scheduler-first-day-monday'
          },
          {
            name: 'Scheduler - Five day workweek',
            path: 'scheduler-five-day-workweek'
          },
          {
            name: 'Scheduler - No active date',
            path: 'scheduler-no-active-date'
          },
          {
            name: 'Scheduler - Now',
            path: 'scheduler-now'
          },
          {
            name: 'Scheduler - Disabled days',
            path: 'scheduler-disabled-days'
          },
          {
            name: 'Scheduler - Disabled before/after',
            path: 'scheduler-disabled-before-after'
          },
          {
            name: 'Scheduler - Disabled weekdays',
            path: 'scheduler-disabled-weekdays'
          },
          {
            name: 'Scheduler - Focusable/hoverable',
            path: 'scheduler-focusable-hoverable'
          },
          {
            name: 'Scheduler - Children',
            path: 'scheduler-children'
          },
          {
            name: 'Scheduler - Cell width',
            path: 'scheduler-cell-width'
          },
          {
            name: 'Scheduler - Width/height',
            path: 'scheduler-width-height'
          },
          {
            name: 'Scheduler - Custom height',
            path: 'scheduler-custom-height'
          },
          {
            name: 'Scheduler - Drag and drop',
            path: 'scheduler-drag-and-drop'
          },
          {
            name: 'Scheduler - Locale',
            path: 'scheduler-locale'
          },
          {
            name: 'Scheduler - Theme',
            path: 'scheduler-theme'
          },
          {
            name: 'Scheduler - (Slot) head resources',
            path: 'scheduler-slot-head-resources'
          },
          {
            name: 'Scheduler - (Slot) resource label',
            path: 'scheduler-slot-resource-label'
          },
          {
            name: 'Scheduler - (Slot) resource days',
            path: 'scheduler-slot-resource-days'
          }
        ]
      },
      {
        name: 'QCalendarTask',
        path: 'qcalendartask',
        children: [
          {
            name: 'Task - Getting started',
            path: 'task-getting-started'
          },
          {
            name: 'Task - week',
            path: 'task-week'
          },
          {
            name: 'Task - month',
            path: 'task-month'
          },
          {
            name: 'Task - Alignment',
            path: 'task-alignment'
          },
          {
            name: 'Task - Colored weekends',
            path: 'task-colored-weekends'
          },
          {
            name: 'Task - No weekends',
            path: 'task-no-weekends'
          },
          {
            name: 'Task - Dark',
            path: 'task-dark'
          },
          {
            name: 'Task - Date type',
            path: 'task-date-type'
          },
          {
            name: 'Task - No active date',
            path: 'task-no-active-date'
          },
          {
            name: 'Task - Now',
            path: 'task-now'
          },
          {
            name: 'Task - Disabled days',
            path: 'task-disabled-days'
          },
          {
            name: 'Task - Disabled before/after',
            path: 'task-disabled-before-after'
          },
          {
            name: 'Task - Disabled weekdays',
            path: 'task-disabled-weekdays'
          },
          {
            name: 'Task - Focusable/hoverable',
            path: 'task-focusable-hoverable'
          },
          {
            name: 'Task - Title rows',
            path: 'task-title-rows'
          },
          {
            name: 'Task - Multiple footer rows',
            path: 'task-multiple-footer-rows'
          },
          {
            name: 'Task - Locale',
            path: 'task-locale'
          },
          {
            name: 'Task - Theme',
            path: 'task-theme'
          }
        ]
      },
      {
        name: 'Timestamp',
        path: 'timestamp',
        children: [
          {
            name: 'Timestamp - Getting started',
            path: 'timestamp-getting-started'
          }
        ]
      }
    ]
  },
  {
    name: 'Designing with QCalendar',
    path: 'designing-with-qcalendar',
    expanded: false,
    children: [
      {
        name: 'Getting Started',
        path: 'getting-started'
      },
      {
        name: 'Themes',
        path: 'themes'
      },
      {
        name: 'QCalendar CSS Variables',
        path: 'qcalendar-css-variables'
      },
      {
        name: 'Theme builder',
        path: '/theme-builder',
        internal: true
      }
    ]
  },
  {
    name: 'Contributing',
    path: 'contributing',
    expanded: false,
    children: [
      {
        name: 'Overview',
        path: 'overview'
      },
      {
        name: 'Call to action',
        path: 'call-to-action'
      },
      {
        name: 'Bugs and feature requests',
        path: 'bugs-and-feature-requests'
      },
      {
        name: 'Documentation',
        path: 'documentation'
      },
      {
        name: 'Components',
        path: 'components'
      },
      {
        name: 'Sponsor',
        path: 'sponsor',
        rightIcon: mdiCharity,
        rightIconColor: 'red-8'
      }
    ]
  },
  {
    name: 'Latest news',
    path: 'latest-news',
    expanded: false,
    children: [
      {
        name: 'Changelog',
        path: 'changelog'
      },
      {
        name: 'Roadmap',
        path: 'roadmap'
      },
      {
        name: 'News, articles and tutorials',
        path: 'news-and-articles'
      }
    ]
  },
  {
    name: 'Help',
    path: 'help',
    expanded: false,
    children: [
      {
        name: 'GitHub',
        external: true,
        path: 'https://github.com/quasarframework/quasar-ui-qcalendar',
        rightIcon: biGithub
      },
      {
        name: 'Twitter',
        external: true,
        path: 'https://twitter.com/jgalbraith64',
        rightIcon: biTwitter
      },
      {
        name: 'FAQ',
        path: 'faq'
      },
      {
        name: 'Migration guide',
        path: 'migration-guide'
      },
      {
        name: 'Contact us',
        path: 'contact-us'
      }
    ]
  }
]

// export default menu
module.exports = menu
module.exports.default = menu

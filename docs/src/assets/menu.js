const biTwitter = 'M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z|0 0 16 16'
const biGithub = 'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z|0 0 16 16'

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
            name: 'Day - Disabled before/after',
            path: 'day-disabled-before-after'
          },
          {
            name: 'Day - Disabled days',
            path: 'day-disabled-days'
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
            name: 'Day - (Slot) Column header',
            path: 'day-slot-column-header'
          },
          {
            name: 'Day - (Slot) Head day',
            path: 'day-slot-head-day'
          },
          {
            name: 'Day - (Slot) Head day event',
            path: 'day-slot-head-day-event'
          },
          {
            name: 'Day - (Slot) Head intervals',
            path: 'day-slot-head-intervals'
          },
          {
            name: 'Day - (Slot) Show current time',
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
            name: 'Week - No weekends',
            path: 'week-no-weekends'
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
            name: 'Week - Disabled before/after',
            path: 'week-disabled-before-after'
          },
          {
            name: 'Week - Disabled days',
            path: 'week-disabled-days'
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
            name: 'Week - (Slot) Column header',
            path: 'week-slot-column-header'
          },
          {
            name: 'Week - (Slot) Day body',
            path: 'week-slot-day-body'
          },
          {
            name: 'Week - (Slot) Head day',
            path: 'week-slot-head-day'
          },
          {
            name: 'Week - (Slot) Head day event',
            path: 'week-slot-head-day-event'
          },
          {
            name: 'Week - (Slot) Head days event absolute',
            path: 'week-slot-head-days-event-absolute'
          },
          {
            name: 'Week - (Slot) Head intervals',
            path: 'week-slot-head-intervals'
          },
          {
            name: 'Week - (Slot) Show current time',
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
            name: 'Month - (Slot) Day',
            path: 'month-slot-day'
          },
          {
            name: 'Month - (Slot) Week',
            path: 'month-slot-week'
          },
          {
            name: 'Month - (Slot) Day (holidays)',
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
            name: 'Mini-mode - 1st day monday',
            path: 'minimode-first-day-monday'
          },
          {
            name: 'Mini-mode - 5 day workweek',
            path: 'minimode-5-day-workweek'
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
            name: 'Mini-mode - Disabled weekdays',
            path: 'minimode-disabled-weekdays'
          },
          {
            name: 'Mini-mode - Disabled before/after',
            path: 'minimode-disabled-before-after'
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
            name: 'Agenda - Dark',
            path: 'agenda-dark'
          },
          {
            name: 'Agenda - Cell width',
            path: 'agenda-cell-width'
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
            name: 'Resource - No sticky',
            path: 'resource-no-sticky'
          },
          {
            name: 'Resource - Children',
            path: 'resource-children'
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
            name: 'Scheduler - Alignment',
            path: 'scheduler-alignment'
          },
          {
            name: 'Scheduler - Dark',
            path: 'scheduler-dark'
          },
          {
            name: 'Scheduler - Date type',
            path: 'scheduler-date-type'
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
      },
      {
        name: 'Tutorials',
        path: 'tutorials'
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
        path: 'sponsor'
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
        name: 'News and articles',
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

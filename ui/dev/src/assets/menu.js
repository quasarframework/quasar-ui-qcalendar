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
        name: 'Installation Types',
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
        name: 'QCalendar Transitions',
        path: 'qcalendar-transitions'
      },
      {
        name: 'QCalendar (wrapper)',
        path: 'qcalendar'
      },
      {
        name: 'QCalendarDay',
        path: 'qcalendarday'
      },
      {
        name: 'QCalendarDay (week)',
        path: 'qcalendarday-week'
      },
      {
        name: 'QCalendarDay (month)',
        path: 'qcalendarday-month'
      },
      {
        name: 'QCalendarDay (interval)',
        path: 'qcalendarday-interval'
      },
      {
        name: 'QCalendarMonth',
        path: 'qcalendarmonth'
      },
      {
        name: 'QCalendarMonth (mini-mode)',
        path: 'qcalendarmonth-minimode'
      },
      {
        name: 'QCalendarAgenda',
        path: 'qcalendaragenda'
      },
      {
        name: 'QCalendarResource',
        path: 'qcalendarresource'
      },
      {
        name: 'QCalendarScheduler',
        path: 'qcalendarscheduler'
      },
      {
        name: 'QCalendarTask',
        path: 'qcalendartask'
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
        name: 'QCalendar SASS Variables',
        path: 'qcalendar-sass-variables'
      },
      {
        name: 'Theme builder',
        path: '/theme-builder',
        external: true
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
        name: 'Github',
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

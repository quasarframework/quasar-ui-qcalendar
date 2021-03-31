const menu = [
  {
    name: 'All about QCalendar',
    path: 'all-about-qcalendar',
    expanded: false,
    children: [
      {
        name: 'What is QCalendar',
        path: 'all-about-qcalendar/what-is-qcalendar',
        component: () => import('../pages/all-about-qcalendar/what-is-qcalendar.md')
      },
      {
        name: 'Installation Types',
        path: 'all-about-qcalendar/installation-types',
        component: () => import('../pages/all-about-qcalendar/installation-types.md')
      },
      {
        name: 'Anatomy of a calendar',
        path: 'all-about-qcalendar/anatomy-of-a-calendar',
        component: () => import('../pages/all-about-qcalendar/anatomy-of-a-calendar.md')
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
        path: 'developing/getting-started',
        component: () => import('../pages/developing/getting-started.md')
      },
      {
        name: 'QCalendarDay',
        path: 'developing/qcalendarday',
        component: () => import('../pages/developing/qcalendarday.md')
      },
      {
        name: 'QCalendarMonth',
        path: 'developing/qcalendarmonth',
        component: () => import('../pages/developing/qcalendarmonth.md')
      },
      {
        name: 'QCalendarMonth (minimode)',
        path: 'developing/qcalendarmonth-minimode',
        component: () => import('../pages/developing/qcalendarmonth-minimode.md')
      },
      {
        name: 'QCalendarAgenda',
        path: 'developing/qcalendaragenda',
        component: () => import('../pages/developing/qcalendaragenda.md')
      },
      {
        name: 'QCalendarResource',
        path: 'developing/qcalendarresource',
        component: () => import('../pages/developing/qcalendarresource.md')
      },
      {
        name: 'QCalendarScheduler',
        path: 'developing/qcalendarscheduler',
        component: () => import('../pages/developing/qcalendarscheduler.md')
      },
      {
        name: 'QCalendarTask',
        path: 'developing/qcalendartask',
        component: () => import('../pages/developing/qcalendartask.md')
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
        path: 'designing-with-qcalendar/getting-started',
        component: () => import('../pages/designing-with-qcalendar/getting-started.md')
      },
      {
        name: 'Themes',
        path: 'designing-with-qcalendar/themes',
        component: () => import('../pages/designing-with-qcalendar/themes.md')
      },
      {
        name: 'Theme builder',
        path: 'designing-with-qcalendar/theme-builder',
        component: () => import('../pages/designing-with-qcalendar/ThemeBuilder.vue')
      },
      {
        name: 'Tutorials',
        path: 'designing-with-qcalendar/tutorials',
        component: () => import('../pages/designing-with-qcalendar/tutorials.md')
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
        path: 'contributing/overview',
        component: () => import('../pages/contributing/overview.md')
      },
      {
        name: 'Bugs and feature requests',
        path: 'contributing/bugs-and-feature-requests',
        component: () => import('../pages/contributing/bugs-and-feature-requests.md')
      },
      {
        name: 'Documentation',
        path: 'contributing/documentation',
        component: () => import('../pages/contributing/documentation.md')
      },
      {
        name: 'Components',
        path: 'contributing/components',
        component: () => import('../pages/contributing/components.md')
      },
      {
        name: 'Sponsor',
        path: 'contributing/sponsor',
        component: () => import('../pages/contributing/sponsor.md')
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
        path: 'latest-news/changelog',
        component: () => import('../pages/latest-news/changelog.md')
      },
      {
        name: 'Roadmap',
        path: 'latest-news/roadmap',
        component: () => import('../pages/latest-news/roadmap.md')
      },
      {
        name: 'News and articles',
        path: 'latest-news/news-and-articles',
        component: () => import('../pages/latest-news/news-and-articles.md')
      }
    ]
  },
  {
    name: 'Components (examples)',
    path: 'components',
    expanded: false,
    children: [
      {
        name: 'Overview',
        path: 'components/overview'
      },
      {
        name: 'QCalendarDay',
        path: ''
      },
      {
        name: 'QCalendarDay (week)',
        path: ''
      },
      {
        name: 'QCalendarDay (month)',
        path: ''
      },
      {
        name: 'QCalendarDay (interval)',
        path: ''
      },
      {
        name: 'QCalendarMonth',
        path: ''
      },
      {
        name: 'QCalendarMonth (minimode)',
        path: ''
      },
      {
        name: 'QCalendarAgenda',
        path: ''
      },
      {
        name: 'QCalendarResource',
        path: ''
      },
      {
        name: 'QCalendarScheduler',
        path: ''
      },
      {
        name: 'QCalendarTask',
        path: ''
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
        link: 'https://github.com/quasarframework/quasar-ui-qcalendar'
      },
      {
        name: 'Twitter',
        link: 'https://twitter.com/jgalbraith64'
      },
      {
        name: 'FAQ',
        path: 'help/faq',
        component: () => import('../pages/help/faq.md')
      },
      {
        name: 'Migration guide',
        path: 'help/migration-guide',
        component: () => import('../pages/help/migration-guide.md')
      },
      {
        name: 'Contact us',
        path: 'help/contact-us',
        component: () => import('../pages/help/contact-us.md')
      }
    ]
  }
]

export default menu

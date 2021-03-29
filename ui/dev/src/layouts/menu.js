const menu = [
  {
    name: 'All about QCalendar',
    expanded: false,
    children: [
      {
        name: 'What is QCalendar',
        path: 'what-is-qcalendar',
        component: () => import('../pages/all-about-qcalendar/what--is--q-calendar.md')
      },
      {
        name: 'Installation Types',
        path: 'installation--types',
        component: () => import('../pages/all-about-qcalendar/installation--types.md')
      },
      {
        name: 'Anatomy of a calendar',
        path: 'anatomy-of-a-calendar',
        component: () => import('../pages/all-about-qcalendar/anatomy--of--a--calendar.md')
      }
    ]
  },
  {
    name: 'Designing with QCalendar',
    expanded: false,
    children: [
      {
        name: 'Themes',
        path: 'themes',
        component: () => import('../pages/designing-with-qcalendar/Themes.vue')
      },
      {
        name: 'Theme builder',
        path: 'theme-builder',
        component: () => import('../pages/designing-with-qcalendar/ThemeBuilder.vue')
      }
    ]
  },
  {
    name: 'Developing',
    expanded: false,
    children: [
      {
        name: 'Getting started',
        path: 'getting-started',
        component: () => import('../pages/developing/GettingStarted.vue')
      },
      {
        name: 'QCalendarDay',
        path: 'qcalendarday',
        component: () => import('../pages/developing/QCalendarDay.vue')
      },
      {
        name: 'QCalendarMonth',
        path: 'qcalendarmonth',
        component: () => import('../pages/developing/QCalendarMonth.vue')
      },
      {
        name: 'QCalendarMonth (mini-mode)',
        path: 'qcalendarmonth-mini-mode',
        component: () => import('../pages/developing/QCalendarMonth-MiniMode.vue')
      },
      {
        name: 'QCalendarAgenda',
        path: 'qcalendaragenda',
        component: () => import('../pages/developing/QCalendarAgenda.vue')
      },
      {
        name: 'QCalendarResource',
        path: 'qcalendarresource',
        component: () => import('../pages/developing/QCalendarResource.vue')
      },
      {
        name: 'QCalendarScheduler',
        path: 'qcalendarscheduler',
        component: () => import('../pages/developing/QCalendarScheduler.vue')
      },
      {
        name: 'QCalendarTask',
        path: 'qcalendartask',
        component: () => import('../pages/developing/QCalendarTask.vue')
      }
    ]
  },
  {
    name: 'Contributing',
    expanded: false,
    children: [
      {
        name: 'Overview',
        path: 'contributing-overview',
        component: () => import('../pages/contributing/Overview.vue')
      },
      {
        name: 'Bugs and feature requests',
        path: 'bugs-and-feature-requests',
        component: () => import('../pages/contributing/BugsAndFeatureRequests.vue')
      },
      {
        name: 'Documentation',
        path: 'contributing-documentation',
        component: () => import('../pages/contributing/Documentation.vue')
      },
      {
        name: 'Components',
        path: 'contributing-components',
        component: () => import('../pages/contributing/Components.vue')
      }
    ]
  },
  {
    name: 'Latest news',
    expanded: false,
    children: [
      {
        name: 'Changelog',
        path: 'changelog',
        component: () => import('../pages/latest-news/Changelog.vue')
      },
      {
        name: 'Roadmap',
        path: 'roadmap',
        component: () => import('../pages/latest-news/Roadmap.vue')
      },
      {
        name: 'News and articles',
        path: 'news-and-articles',
        component: () => import('../pages/latest-news/NewsAndArticles.vue')
      }
    ]
  },
  {
    name: 'Components (examples)',
    expanded: false,
    children: [
      {
        name: 'Overview',
        path: ''
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
        name: 'QCalendarMonth (mini-mode)',
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
    expanded: false,
    children: [
      {
        name: 'Github',
        link: ''
      },
      {
        name: 'Twitter',
        link: ''
      },
      {
        name: 'FAQ',
        path: 'faq',
        component: () => import('../pages/help/FAQ.vue')
      },
      {
        name: 'Migration guide',
        path: 'migration-guide',
        component: () => import('../pages/help/MigrationGuide.vue')
      },
      {
        name: 'Contact us',
        path: 'contact-us',
        component: () => import('../pages/help/ContactUs.vue')
      }
    ]
  }
]

export default menu

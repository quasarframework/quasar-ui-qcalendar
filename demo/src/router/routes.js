
const routes = [
  {
    path: '/',
    redirect: '/docs'
  },
  {
    path: '/docs',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ]
  },
  {
    path: '/examples',
    component: () => import('layouts/Examples.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Examples.vue'),
        children: [
          {
            path: '',
            redirect: '/examples/day-view'
          },
          {
            path: 'day-view',
            component: () => import('pages/DayView.vue')
          },
          {
            path: 'week-view',
            component: () => import('pages/WeekView.vue')
          },
          {
            path: 'month-view',
            component: () => import('pages/MonthView.vue')
          },
          {
            path: 'month-view-mini-mode',
            component: () => import('pages/MonthViewMiniMode.vue')
          },
          {
            path: 'scheduler-view',
            component: () => import('pages/SchedulerView.vue')
          },
          {
            path: 'resource-view',
            component: () => import('pages/ResourceView.vue')
          },
          {
            path: 'agenda-view',
            component: () => import('pages/AgendaView.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/theme-builder',
    component: () => import('layouts/ThemeBuilder.vue')
  },
  {
    path: '/demo',
    component: () => import('layouts/CalendarLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Calendar.vue') }
    ]
  },
  {
    path: '/demos',
    component: () => import('layouts/DemoLayout.vue'),
    children: [
      { path: 'planner', component: () => import('pages/Planner.vue') }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes

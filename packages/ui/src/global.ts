declare module 'vue' {
  export interface GlobalComponents {
    QCalendar: typeof import('./components/QCalendar.js').default
    QCalendarAgenda: typeof import('./components/QCalendarAgenda.js').default
    QCalendarDay: typeof import('./components/QCalendarDay.js').default
    QCalendarMonth: typeof import('./components/QCalendarMonth.js').default
    QCalendarResource: typeof import('./components/QCalendarResource.js').default
    QCalendarScheduler: typeof import('./components/QCalendarScheduler.js').default
    QCalendarTask: typeof import('./components/QCalendarTask.js').default
  }
}

export {}

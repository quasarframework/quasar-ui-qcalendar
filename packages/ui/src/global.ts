declare module 'vue' {
  export interface GlobalComponents {
    QCalendar: typeof import('./index.js').QCalendar
    QCalendarAgenda: typeof import('./index.js').QCalendarAgenda
    QCalendarDay: typeof import('./index.js').QCalendarDay
    QCalendarMonth: typeof import('./index.js').QCalendarMonth
    QCalendarResource: typeof import('./index.js').QCalendarResource
    QCalendarScheduler: typeof import('./index.js').QCalendarScheduler
    QCalendarTask: typeof import('./index.js').QCalendarTask
  }
}

export {}

import './global.js'
import QCalendarComponent from './components/QCalendar.js'
import QCalendarAgendaComponent from './components/QCalendarAgenda.js'
import QCalendarDayComponent from './components/QCalendarDay.js'
import QCalendarMonthComponent from './components/QCalendarMonth.js'
import QCalendarResourceComponent from './components/QCalendarResource.js'
import QCalendarSchedulerComponent from './components/QCalendarScheduler.js'
import QCalendarTaskComponent from './components/QCalendarTask.js'
import type useInterval from './composables/useInterval.js'

import { version } from './version.js'

// Explicitly export individual named properties
export * from './utils/helpers.js'
export type { CalendarScrollEvent } from './composables/useScrollEvents.js'
export { default } from './plugin.js'

type CalendarNavigationInstance = {
  prev: (_amount?: number) => void
  next: (_amount?: number) => void
  move: (_amount?: number) => void
  moveToToday: () => void
  updateCurrent: () => void
}

type CalendarIntervalInstance = CalendarNavigationInstance &
  Pick<
    ReturnType<typeof useInterval>,
    'timeStartPos' | 'timeDurationHeight' | 'heightToMinutes' | 'scrollToTime'
  >

type CalendarResourceInstance = CalendarNavigationInstance &
  Pick<
    ReturnType<typeof useInterval>,
    'timeStartPosX' | 'timeDurationWidth' | 'widthToMinutes' | 'scrollToTimeX'
  >

type CalendarDateScrollInstance = {
  scrollToDate: (_date: string, _duration?: number) => boolean
}

// Preserve Vue's inferred props, emits and slots when adding methods exposed by setup().
type RootCalendarComponent<Component extends new () => object, Exposed> = Component & {
  new (): InstanceType<Component> & Exposed
}

type QCalendarInstance = CalendarNavigationInstance &
  CalendarDateScrollInstance & {
    timeStartPos: (_time: string, _clamp?: boolean) => number | false | void
    timeStartPosX: (_time: string, _clamp?: boolean) => number | false | void
    timeDurationHeight: (_minutes: number | string) => number | void
    timeDurationWidth: (_minutes: number | string) => number | void
    heightToMinutes: (_height: number | string) => number | void
    widthToMinutes: (_width: number | string) => number | void
    scrollToTime: (_time: string, _duration?: number) => void
    scrollToTimeX: (_time: string, _duration?: number) => void
  }
type QCalendarAgendaInstance = CalendarNavigationInstance & CalendarDateScrollInstance
type QCalendarDayInstance = CalendarIntervalInstance & CalendarDateScrollInstance
type QCalendarMonthInstance = CalendarNavigationInstance
type QCalendarResourceInstance = CalendarResourceInstance
type QCalendarSchedulerInstance = CalendarNavigationInstance & CalendarDateScrollInstance
type QCalendarTaskInstance = CalendarNavigationInstance & CalendarDateScrollInstance

const QCalendar = QCalendarComponent as RootCalendarComponent<
  typeof QCalendarComponent,
  QCalendarInstance
>
const QCalendarAgenda = QCalendarAgendaComponent as RootCalendarComponent<
  typeof QCalendarAgendaComponent,
  QCalendarAgendaInstance
>
const QCalendarDay = QCalendarDayComponent as RootCalendarComponent<
  typeof QCalendarDayComponent,
  QCalendarDayInstance
>
const QCalendarMonth = QCalendarMonthComponent as RootCalendarComponent<
  typeof QCalendarMonthComponent,
  QCalendarMonthInstance
>
const QCalendarResource = QCalendarResourceComponent as RootCalendarComponent<
  typeof QCalendarResourceComponent,
  QCalendarResourceInstance
>
const QCalendarScheduler = QCalendarSchedulerComponent as RootCalendarComponent<
  typeof QCalendarSchedulerComponent,
  QCalendarSchedulerInstance
>
const QCalendarTask = QCalendarTaskComponent as RootCalendarComponent<
  typeof QCalendarTaskComponent,
  QCalendarTaskInstance
>

export type QCalendar = QCalendarInstance
export type QCalendarAgenda = QCalendarAgendaInstance
export type QCalendarDay = QCalendarDayInstance
export type QCalendarMonth = QCalendarMonthInstance
export type QCalendarResource = QCalendarResourceInstance
export type QCalendarScheduler = QCalendarSchedulerInstance
export type QCalendarTask = QCalendarTaskInstance

export {
  version,
  QCalendar,
  QCalendarAgenda,
  QCalendarDay,
  QCalendarMonth,
  QCalendarResource,
  QCalendarScheduler,
  QCalendarTask,
}

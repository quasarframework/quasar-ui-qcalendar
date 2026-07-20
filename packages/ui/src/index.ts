import { App as Application, type DefineComponent, type SlotsType } from 'vue'
import './global.js'
import QCalendarComponent from './components/QCalendar.js'
import QCalendarAgendaComponent from './components/QCalendarAgenda.js'
import QCalendarDayComponent from './components/QCalendarDay.js'
import QCalendarMonthComponent from './components/QCalendarMonth.js'
import QCalendarResourceComponent from './components/QCalendarResource.js'
import QCalendarSchedulerComponent from './components/QCalendarScheduler.js'
import QCalendarTaskComponent from './components/QCalendarTask.js'
import type {
  QCalendarAgendaSlots,
  QCalendarDaySlots,
  QCalendarMonthSlots,
  QCalendarResourceSlots,
  QCalendarSchedulerSlots,
  QCalendarTaskSlots,
} from './slots.js'

import { version } from './version.js'

import * as helpers from './utils/helpers.js'

// Explicitly export individual named properties
export * from './utils/helpers.js'

type CalendarNavigationInstance = {
  prev: (_amount?: number) => void
  next: (_amount?: number) => void
  move: (_amount?: number) => void
  moveToToday: () => void
  updateCurrent: () => void
}

type CalendarIntervalInstance = CalendarNavigationInstance & {
  timeStartPos: (_time: string, _clamp?: boolean) => number
  timeDurationHeight: (_minutes: number) => number
  heightToMinutes: (_height: number) => number
  scrollToTime: (_time: string, _duration?: number) => void
}

type CalendarResourceInstance = CalendarNavigationInstance & {
  timeStartPosX: (_time: string, _clamp?: boolean) => number
  timeDurationWidth: (_minutes: number) => number
  widthToMinutes: (_width: number) => number
  scrollToTimeX: (_time: string, _duration?: number) => void
}

type CalendarDateScrollInstance = {
  scrollToDate: (_date: string, _duration?: number) => boolean
}

type RootCalendarComponent<Instance, Slots extends Record<string, any> = {}> = DefineComponent<
  Record<string, any>,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  SlotsType<Slots>
> & {
  new (): Instance
}

type QCalendarInstance = CalendarIntervalInstance &
  CalendarResourceInstance &
  CalendarDateScrollInstance & {
    widthToMinutes: (_width: number) => number
  }
type QCalendarAgendaInstance = CalendarNavigationInstance & CalendarDateScrollInstance
type QCalendarDayInstance = CalendarIntervalInstance & CalendarDateScrollInstance
type QCalendarMonthInstance = CalendarNavigationInstance
type QCalendarResourceInstance = CalendarResourceInstance
type QCalendarSchedulerInstance = CalendarNavigationInstance & CalendarDateScrollInstance
type QCalendarTaskInstance = CalendarNavigationInstance & CalendarDateScrollInstance

const QCalendar = QCalendarComponent as RootCalendarComponent<QCalendarInstance>
const QCalendarAgenda = QCalendarAgendaComponent as RootCalendarComponent<
  QCalendarAgendaInstance,
  QCalendarAgendaSlots
>
const QCalendarDay = QCalendarDayComponent as RootCalendarComponent<
  QCalendarDayInstance,
  QCalendarDaySlots
>
const QCalendarMonth = QCalendarMonthComponent as RootCalendarComponent<
  QCalendarMonthInstance,
  QCalendarMonthSlots
>
const QCalendarResource = QCalendarResourceComponent as RootCalendarComponent<
  QCalendarResourceInstance,
  QCalendarResourceSlots
>
const QCalendarScheduler = QCalendarSchedulerComponent as RootCalendarComponent<
  QCalendarSchedulerInstance,
  QCalendarSchedulerSlots
>
const QCalendarTask = QCalendarTaskComponent as RootCalendarComponent<
  QCalendarTaskInstance,
  QCalendarTaskSlots
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

export default {
  version,
  QCalendar,
  QCalendarAgenda,
  QCalendarDay,
  QCalendarMonth,
  QCalendarResource,
  QCalendarScheduler,
  QCalendarTask,
  ...helpers,

  // Vue plugin
  install(app: Application): void {
    app.component(String(QCalendarComponent.name), QCalendarComponent)
    app.component(String(QCalendarAgendaComponent.name), QCalendarAgendaComponent)
    app.component(String(QCalendarDayComponent.name), QCalendarDayComponent)
    app.component(String(QCalendarMonthComponent.name), QCalendarMonthComponent)
    app.component(String(QCalendarResourceComponent.name), QCalendarResourceComponent)
    app.component(String(QCalendarSchedulerComponent.name), QCalendarSchedulerComponent)
    app.component(String(QCalendarTaskComponent.name), QCalendarTaskComponent)
  },
}

import { boot } from 'quasar/wrappers'
import {
    QCalendar,
    QCalendarAgenda,
    QCalendarDay,
    QCalendarMonth,
    QCalendarResource,
    QCalendarScheduler,
    QCalendarTask
} from '@quasar/quasar-ui-qcalendar'

export default boot(({ app }) => {
    app.component(QCalendar.name, QCalendar)
    app.component(QCalendarAgenda.name, QCalendarAgenda)
    app.component(QCalendarDay.name, QCalendarDay)
    app.component(QCalendarMonth.name, QCalendarMonth)
    app.component(QCalendarResource.name, QCalendarResource)
    app.component(QCalendarScheduler.name, QCalendarScheduler)
    app.component(QCalendarTask.name, QCalendarTask)
})

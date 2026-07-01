import { defineIndexScript } from '#q-app'

/**
 * Quasar App Extension index/runner script
 * (runs on each dev/build)
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/index-api
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/IndexAPI.js
 */

export default defineIndexScript((api) => {
  // Quasar compatibility check; you may need
  // hard dependencies, as in a minimum version of the "quasar"
  // package or a minimum version of "@quasar/app" CLI
  api.compatibleWith('quasar', '^2.16.0')
  api.compatibleWith('@quasar/app-vite', '>=3.0.0-rc.5')

  api.registerDescribeApi('QCalendar', '~@quasar/quasar-ui-qcalendar/dist/api/QCalendar.json')
  api.registerDescribeApi(
    'QCalendarAgenda',
    '~@quasar/quasar-ui-qcalendar/dist/api/QCalendarAgenda.json',
  )
  api.registerDescribeApi('QCalendarDay', '~@quasar/quasar-ui-qcalendar/dist/api/QCalendarDay.json')
  api.registerDescribeApi(
    'QCalendarMonth',
    '~@quasar/quasar-ui-qcalendar/dist/api/QCalendarMonth.json',
  )
  api.registerDescribeApi(
    'QCalendarResource',
    '~@quasar/quasar-ui-qcalendar/dist/api/QCalendarResource.json',
  )
  api.registerDescribeApi(
    'QCalendarScheduler',
    '~@quasar/quasar-ui-qcalendar/dist/api/QCalendarScheduler.json',
  )
  api.registerDescribeApi(
    'QCalendarTask',
    '~@quasar/quasar-ui-qcalendar/dist/api/QCalendarTask.json',
  )

  // We extend /quasar.conf.js
  api.extendQuasarConf(() => ({
    boot: ['~@quasar/quasar-app-extension-qcalendar/dist/boot/vite-register.js'],
    css: ['~@quasar/quasar-ui-qcalendar/src/index.scss'],
  }))
})

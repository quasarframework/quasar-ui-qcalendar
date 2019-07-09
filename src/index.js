/**
 * Quasar App Extension index/runner script
 * (runs on each dev/build)
 *
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/IndexAPI.js
 */

const extendQuasarConf = function (conf) {
  // make sure qcalendar boot file is registered
  conf.boot.push('~@quasar/quasar-app-extension-qcalendar/src/boot/qcalendar.js')
  console.log(` App Extension (qcalendar) Info: 'Adding qcalendar boot reference to your quasar.conf.js'`)

  // make sure boot file transpiles
  conf.build.transpileDependencies.push(/quasar-app-extension-qcalendar[\\/]src/)

  // make sure qcalendar css goes through webpack to avoid ssr issues
  conf.css.push('~@quasar/quasar-app-extension-qcalendar/src/component/calendar-variables.styl')
  console.log(` App Extension (qcalendar) Info: 'Adding calendar-variables.styl css reference to your quasar.conf.js'`)

  conf.css.push('~@quasar/quasar-app-extension-qcalendar/src/component/calendar-daily.styl')
  console.log(` App Extension (qcalendar) Info: 'Adding calendar-daily.styl css reference to your quasar.conf.js'`)

  conf.css.push('~@quasar/quasar-app-extension-qcalendar/src/component/calendar-weekly.styl')
  console.log(` App Extension (qcalendar) Info: 'Adding calendar-weekly.styl css reference to your quasar.conf.js'`)

  conf.css.push('~@quasar/quasar-app-extension-qcalendar/src/component/calendar-scheduler.styl')
  console.log(` App Extension (qcalendar) Info: 'Adding calendar-scheduler.styl css reference to your quasar.conf.js'`)
}

module.exports = function (api) {
  // quasar compatibility check
  api.compatibleWith('@quasar/app', '^1.0.0')

  // register JSON api
  api.registerDescribeApi('QCalendar', './component/QCalendar.json')

  // extend quasar.conf
  api.extendQuasarConf(extendQuasarConf)
}

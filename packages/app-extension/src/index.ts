import { defineIndexScript } from '@quasar/app-vite'

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
  api.compatibleWith('@quasar/app-vite', '>=3.0.0-beta.18')

  // Uncomment the line below if you provide a JSON API for your component
  api.registerDescribeApi('QCalendar', '~@quasar/quasar-ui-qcalendar/dist/api/QCalendar.json')

  // We extend /quasar.conf.js
  api.extendQuasarConf((conf) => {
    conf.boot ??= []
    conf.css ??= []

    // Register the Vite boot file and stylesheet.
    conf.boot.push('~@quasar/quasar-app-extension-qcalendar/src/boot/vite-register.ts')
    conf.css.push('~@quasar/quasar-ui-qcalendar/src/index.scss')
  })
})

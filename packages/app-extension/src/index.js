/**
 * Quasar App Extension index/runner script
 * (runs on each dev/build)
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/index-api
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/IndexAPI.js
 */

function extendConf(conf, api) {
  if (api.hasVite) {
    // register the boot file
    conf.boot.push('~@quasar/quasar-app-extension-qcalendar/src/boot/vite-register.js')
  } else {
    // register the boot file
    conf.boot.push('~@quasar/quasar-app-extension-qcalendar/src/boot/webpack-register.js')
    // make sure app extension files & ui packages get transpiled
    conf.build.transpile = true
    conf.build.webpackTranspileDependencies = conf.build.webpackTranspileDependencies || []
    conf.build.webpackTranspileDependencies.push(/quasar-app-extension-qcalendar[\\/]src/)
    conf.build.webpackTranspileDependencies.push(/quasar-ui-qcalendar[\\/]src/)
  }

  // make sure the stylesheet goes through webpack to avoid SSR issues
  conf.css.push('~@quasar/quasar-ui-qcalendar/src/index.scss')
}

export default function (api) {
  // Quasar compatibility check; you may need
  // hard dependencies, as in a minimum version of the "quasar"
  // package or a minimum version of "@quasar/app" CLI
  api.compatibleWith('quasar', '^2.0.0')

  if (api.hasVite === true) {
    api.compatibleWith('@quasar/app-vite', '^2.0.0')
  } else {
    api.compatibleWith('@quasar/app-webpack', '^4.0.0')
  }

  // Uncomment the line below if you provide a JSON API for your component
  api.registerDescribeApi('QCalendar', '~@quasar/quasar-ui-qcalendar/dist/api/QCalendar.json')

  // We extend /quasar.conf.js
  api.extendQuasarConf(extendConf)
}

// Configuration for your app
// const CopyWebpackPlugin = require('copy-webpack-plugin')

const path = require('path')

module.exports = function (ctx) {
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    boot: [
      'qcalendar'
    ],

    css: [
      'app.sass'
    ],

    extras: [
      // 'ionicons-v4',
      // 'mdi-v3',
      'fontawesome-v5',
      // 'eva-icons',
      // 'themify',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font',
      'material-icons' // optional, you are not bound to it
    ],

    framework: {
      config: {
        dark: 'auto'
      },

      // iconSet: 'ionicons-v4',
      // lang: 'de', // Quasar language

      all: true, // --- includes everything; for dev only!

      // components: [
      //   'QAvatar',
      //   'QBadge',
      //   'QBanner',
      //   'QBtn',
      //   'QCard',
      //   'QCardActions',
      //   'QCardSection',
      //   'QCheckbox',
      //   'QColor',
      //   'QDate',
      //   'QDialog',
      //   'QDrawer',
      //   'QExpansionItem',
      //   'QField',
      //   'QForm',
      //   'QHeader',
      //   'QIcon',
      //   'QInput',
      //   'QItem',
      //   'QItemLabel',
      //   'QItemSection',
      //   'QLayout',
      //   'QList',
      //   'QMenu',
      //   'QPage',
      //   'QPageContainer',
      //   'QPageScroller',
      //   'QPopupProxy',
      //   'QRadio',
      //   'QRange',
      //   'QResizeObserver',
      //   'QRouteTab',
      //   'QScrollArea',
      //   'QSelect',
      //   'QSeparator',
      //   'QSlider',
      //   'QSpace',
      //   'QSplitter',
      //   'QTab',
      //   'QTabPanel',
      //   'QTabPanels',
      //   'QTabs',
      //   'QToggle',
      //   'QToolbar',
      //   'QToolbarTitle',
      //   'QTooltip'
      // ],

      directives: [
        'ClosePopup',
        'Ripple',
        'Scroll',
        'TouchSwipe'
      ],

      // Quasar plugins
      plugins: [
        'Dark',
        'Dialog',
        'Meta',
        'Notify',
        'Platform',
        'Screen'
      ]
    },

    supportIE: true,

    build: {
      scopeHoisting: true,
      vueRouterMode: 'history',
      publicPath: 'quasar-ui-qcalendar',
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
          options: {
            formatter: require('eslint').CLIEngine.getFormatter('stylish')
          }
        })
      },

      chainWebpack (chain) {
        chain.resolve.alias.merge({
          'ui': path.resolve(__dirname, '../ui/src/index.js'),
          '@quasar/quasar-ui-qcalendar': path.resolve(__dirname, '../ui'),
          'sass': path.resolve(__dirname, '../ui/src/index.sass'),
          'examples': path.resolve(__dirname, './src/examples')
        })
      }
    },

    devServer: {
      // https: true,
      // port: 8080,
      open: true, // opens browser window automatically
      watchOptions: {
        ignored: [
          'node_modules',
          '!node_modules/@quasar/quasar-app-extension-qcalendar',
          '!node_modules/@quasar/quasar-ui-qcalendar'
        ]
      }
    },

    // animations: 'all', // --- includes all animations
    animations: [],

    ssr: {
      pwa: false
    },

    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {},
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },

    cordova: {
      // id: 'org.cordova.quasar.app'
    },

    electron: {
      // bundler: 'builder', // or 'packager'

      extendWebpack (cfg) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      },

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        // appId: 'quasar-app'
      }
    }
  }
}

const path = require('path')
global.rootDir = path.resolve(__dirname, '..')
global.distDir = path.resolve(__dirname, '../dist')

require('quasar-json-api')({
  buildVetur: false,
  buildTypes: true,
  forcedTypes: ['Timestamp'],
})

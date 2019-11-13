const path = require('path')
const rollup = require('rollup')
const uglify = require('uglify-es')
const buble = require('rollup-plugin-buble')
const json = require('rollup-plugin-json')
const nodeResolve = require('rollup-plugin-node-resolve')

const buildConf = require('./config')
const buildUtils = require('./utils')

const bubleConfig = {
  objectAssign: 'Object.assign'
}

const rollupPlugins = [
  nodeResolve({
    extensions: ['.js'],
    preferBuiltins: false
  }),
  json(),
  buble(bubleConfig)
]

const builds = [
  {
    rollup: {
      input: {
        input: resolve(`entry/index.esm.js`)
      },
      output: {
        file: resolve(`../dist/index.esm.js`),
        format: 'es'
      }
    },
    build: {
      // unminified: true,
      minified: true
    }
  },
  {
    rollup: {
      input: {
        input: resolve(`entry/index.common.js`)
      },
      output: {
        file: resolve(`../dist/index.common.js`),
        format: 'cjs'
      }
    },
    build: {
      // unminified: true,
      minified: true
    }
  },
  {
    rollup: {
      input: {
        input: resolve(`entry/index.umd.js`)
      },
      output: {
        name: 'QCalendar',
        file: resolve(`../dist/index.umd.js`),
        format: 'umd'
      }
    },
    build: {
      unminified: true,
      minified: true,
      minExt: true
    }
  }
]

build(builds)
  .then(() => {
    require('./build.api')
  })

/**
 * Helpers
 */

function resolve (_path) {
  return path.resolve(__dirname, _path)
}

function build (builds) {
  return Promise
    .all(builds.map(genConfig).map(buildEntry))
    .catch(buildUtils.logError)
}

function genConfig (opts) {
  Object.assign(opts.rollup.input, {
    plugins: rollupPlugins,
    external: [ 'vue', 'quasar' ]
  })

  Object.assign(opts.rollup.output, {
    banner: buildConf.banner,
    globals: { vue: 'Vue', quasar: 'Quasar' }
  })

  return opts
}

function addExtension (filename, ext = 'min') {
  const insertionPoint = filename.lastIndexOf('.')
  return `${filename.slice(0, insertionPoint)}.${ext}${filename.slice(insertionPoint)}`
}

function buildEntry (config) {
  return rollup
    .rollup(config.rollup.input)
    .then(bundle => bundle.generate(config.rollup.output))
    .then(({ output }) => {
      const code = config.rollup.output.format === 'umd'
        ? injectVueRequirement(output[0].code)
        : output[0].code

      return config.build.unminified
        ? buildUtils.writeFile(config.rollup.output.file, code)
        : code
    })
    .then(code => {
      if (!config.build.minified) {
        return code
      }

      const minified = uglify.minify(code, {
        compress: {
          pure_funcs: ['makeMap']
        }
      })

      if (minified.error) {
        return Promise.reject(minified.error)
      }

      return buildUtils.writeFile(
        config.build.minExt === true
          ? addExtension(config.rollup.output.file)
          : config.rollup.output.file,
        buildConf.banner + minified.code,
        true
      )
    })
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
}

function injectVueRequirement (code) {
  const index = code.indexOf(`Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue`)

  if (index === -1) {
    return code
  }

  const checkMe = ` if (Vue === void 0) {
    console.error('[ Quasar ] Vue is required to run. Please add a script tag for it before loading Quasar.')
    return
  }
  `

  return code.substring(0, index - 1) +
    checkMe +
    code.substring(index)
}

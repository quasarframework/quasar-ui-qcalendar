/*global console process */
process.env.BABEL_ENV = 'production'

import path from 'node:path'
import { URL } from 'node:url'
import * as rollup from 'rollup'
import * as ts from 'typescript'
import uglify from 'uglify-js'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
// import babel from '@rollup/plugin-babel'
// import { dts } from 'rollup-plugin-dts'

import buildConf from './config'
import * as buildUtils from './build.utils'

function pathResolve(relativePath: string): string {
  return path.resolve(path.dirname(new URL(import.meta.url).pathname), relativePath)
}

const rollupPlugins: rollup.Plugin[] = [
  resolveTypeScriptSources(),
  transpileTypeScript(),
  nodeResolve({ extensions: ['.mjs', '.js', '.json', '.node', '.ts'] }),
  json(),
]

const uglifyOptions = {
  compress: {
    // Optimized compression settings
    arrows: false,
    collapse_vars: false,
    comparisons: false,
    hoist_funs: false,
    hoist_props: false,
    inline: false,
    loops: false,
    negate_iife: false,
    properties: false,
    reduce_funcs: false,
    reduce_vars: false,
    switches: false,
    toplevel: false,
    typeofs: false,
    // Essential features
    booleans: true,
    if_return: true,
    sequences: true,
    unused: true,
    conditionals: true,
    dead_code: true,
    evaluate: true,
  },
}

const buildEntries = [
  'index',
  'QCalendar',
  'QCalendarAgenda',
  'QCalendarDay',
  'QCalendarMonth',
  'QCalendarResource',
  'QCalendarScheduler',
  'QCalendarTask',
  'Timestamp',
]

const builds = buildEntries.flatMap((entry) =>
  ['esm', 'cjs', 'umd'].map((format) => ({
    rollup: {
      input: {
        input: pathResolve(`entry/${entry}.${format}.js`),
        plugins: rollupPlugins,
        external: ['vue'],
      },
      output: {
        // sourcemap: true,
        file: pathResolve(`../dist/${entry}.${format}.js`),
        format,
        name: format === 'umd' ? entry : undefined,
        exports: 'auto' as 'auto',
        banner: buildConf.banner,
        globals: { vue: 'Vue' },
      },
    },
    build: {
      unminified: true,
      minified: true,
      minExt: true,
    },
  })),
)

build(builds as any)

function resolveTypeScriptSources(): rollup.Plugin {
  return {
    name: 'resolve-typescript-sources',
    resolveId(source, importer) {
      if (importer === undefined || source.startsWith('.') === false) {
        return null
      }

      const sourcePath = path.resolve(path.dirname(importer), source)
      const candidates = source.endsWith('.js')
        ? [sourcePath.replace(/\.js$/, '.ts')]
        : [sourcePath, `${sourcePath}.ts`]

      return candidates.find((candidate) => buildUtils.fileExists(candidate)) ?? null
    },
  }
}

function transpileTypeScript(): rollup.Plugin {
  return {
    name: 'transpile-typescript',
    transform(code, id) {
      if (id.endsWith('.ts') === false) {
        return null
      }

      const result = ts.transpileModule(code, {
        fileName: id,
        compilerOptions: {
          esModuleInterop: true,
          module: ts.ModuleKind.ESNext,
          moduleResolution: ts.ModuleResolutionKind.Bundler,
          target: ts.ScriptTarget.ES2020,
        },
      })

      return {
        code: result.outputText,
        map: null,
      }
    },
  }
}

/**
 * Main Build Process
 */
interface RollupConfig {
  input: rollup.InputOptions
  output: rollup.OutputOptions
}

interface BuildConfig {
  rollup: RollupConfig
  build: {
    unminified: boolean
    minified: boolean
    minExt: boolean
  }
}

async function build(builds: BuildConfig[]): Promise<void> {
  try {
    for (const config of builds) {
      await buildEntry(config)
    }
  } catch (error: Error | any) {
    buildUtils.logError(error)
    process.exit(1)
  }
}

/**
 * Generates the build output for a single entry.
 */
interface Output {
  code: string
}

async function buildEntry(config: BuildConfig): Promise<void> {
  try {
    const bundle = await rollup.rollup(config.rollup.input)
    const { output } = await bundle.generate(config.rollup.output)
    const code =
      config.rollup.output.format === 'umd'
        ? injectVueRequirement((output[0] as Output).code)
        : (output[0] as Output).code

    if (config.build.unminified && config.rollup.output.file) {
      await buildUtils.writeFile(config.rollup.output.file, code)
    }

    if (config.build.minified) {
      const minified = uglify.minify(code, uglifyOptions)

      if (minified.error) {
        throw minified.error
      }

      const minifiedFile = config.build.minExt
        ? addFileExtension(config.rollup.output.file as string, 'min')
        : config.rollup.output.file

      await buildUtils.writeFile(minifiedFile as string, buildConf.banner + minified.code, true)
    }
  } catch (error) {
    console.error(`Error building ${config.rollup.output.file}:`, error)
    process.exit(1)
  }
}

/**
 * Adds or replaces an extension in a file path.
 */
function addFileExtension(filename: string, ext = 'min'): string {
  const index = filename.lastIndexOf('.')
  return `${filename.slice(0, index)}.${ext}${filename.slice(index)}`
}

/**
 * Injects a Vue dependency check into UMD builds.
 */
function injectVueRequirement(code: string): string {
  const dependencyCheck = `if (Vue === void 0) {
    console.error('[ QCalendar ] Vue is required to run. Please add a script tag for it before loading QCalendar.');
    return;
  }`

  const vueCheckIndex = code.indexOf(
    `Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue`,
  )

  return vueCheckIndex !== -1
    ? code.slice(0, vueCheckIndex - 1) + dependencyCheck + code.slice(vueCheckIndex)
    : code
}

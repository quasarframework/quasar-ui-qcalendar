/*global console process */
import { execFileSync } from 'node:child_process'
import { cpus } from 'node:os'
import { createFolder } from './build.utils'
import { green, blue } from 'kolorist'
import { fileURLToPath } from 'node:url'
import path from 'path'
import { createRequire } from 'node:module'
import { runBuildPipeline } from './build.orchestration'
const require = createRequire(import.meta.url)
const { version } = require('../package.json')

process.env.NODE_ENV = 'production'

const parallel = cpus().length > 1
// const runJob = parallel ? require('child_process').fork : require

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log()

function buildTypes() {
  console.log('Generating types...')
  execFileSync('pnpm', ['exec', 'tsc', '--project', 'tsconfig.json'], {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'inherit',
  })
}

await runBuildPipeline({
  syncAppExtension: () => import('./script.app-ext').then(({ syncAppExt }) => syncAppExt()),
  clean: () => import('./script.clean.js').then(() => undefined),
  prepareFolders: () => {
    console.log(
      ` 📦 Building QCalendar ${green('v' + version)} with ${blue('Rolldown')}...${parallel ? blue(' [multi-threaded]') : ''}\n`,
    )

    createFolder('dist')
    createFolder('dist/transforms')
    createFolder('dist/types')
    createFolder('dist/api')
    createFolder('dist/web-types')
  },
  buildTypes,
  writeVersion: () => import('./script.version').then(() => undefined),
  buildApi: () => import('./build.api.js').then(({ generate }) => generate({ compact: true })),
  buildWebTypes: (api) =>
    import('./build.web-types.js').then(({ generate }) => generate({ api, compact: true })),
  buildJavaScript: () => import('./script.javascript').then(() => undefined),
  buildCss: () => import('./script.css').then(() => undefined),
})

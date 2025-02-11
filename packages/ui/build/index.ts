/*global console process */
import { cpus } from 'node:os'
import { createFolder, copyFolder } from './build.utils'
import { green, blue } from 'kolorist'
import { fileURLToPath } from 'node:url'
import path from 'path'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { version } = require('../package.json')

process.env.NODE_ENV = 'production'

const parallel = cpus().length > 1
// const runJob = parallel ? require('child_process').fork : require

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log()

async function buildApi() {
  // const api = await import('./build.api').then(({ generate }) => generate({ compact: true }))
  // console.log('API generation completed successfully.', api)
  import('./build.api').then(({ generate }) => generate())
}

async function copyTypesToDist() {
  console.log('Copying types...')
  const srcDir = path.resolve(__dirname, '../types')
  const destDir = path.resolve(__dirname, '../dist/types')
  await copyFolder(srcDir, destDir)
}

// Dynamic imports to maintain order
import('./script.app-ext').then(async ({ syncAppExt }) => {
  await syncAppExt()
})

await import('./script.clean.js')

console.log(
  ` 📦 Building QCalendar ${green('v' + version)}...${parallel ? blue(' [multi-threaded]') : ''}\n`,
)

createFolder('dist')
createFolder('dist/transforms')
createFolder('dist/types')
createFolder('dist/api')
createFolder('dist/web-types')

await copyTypesToDist()
await import('./script.version')
const api = await import('./build.api.js').then(({ generate }) => generate({ compact: true }))
import('./build.web-types.js').then(({ generate }) => generate({ api, compact: true }))
import('./script.javascript')
import('./script.css')

// runJob(join(__dirname, './script.javascript'))
// runJob(join(__dirname, './script.css'))

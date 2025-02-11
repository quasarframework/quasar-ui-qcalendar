/*global console */
import fs from 'node:fs'
import path from 'node:path'
import { blue } from 'kolorist'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '../..')
const resolvePath = (file: string) => path.resolve(root, file)

interface PackageJson {
  name: string
  version: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

const writeJson = (file: string, json: PackageJson) => {
  fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n', 'utf-8')
}

/**
 * Read JSON from file
 */
function readJson(file: string) {
  return JSON.parse(fs.readFileSync(file, 'utf-8'))
}

/**
 * Update a dependency to the correct version if it exists.
 */
interface Dependencies {
  [key: string]: string
}

function updateDependency(
  dependencies: Dependencies | undefined,
  name: string,
  version: string,
): boolean {
  if (dependencies?.[name]) {
    dependencies[name] = `^${version}`
    return true
  }
  return false
}

export async function syncAppExt(syncVersion = true): Promise<void> {
  const appExtDir = resolvePath('app-extension')
  const uiDir = resolvePath('ui')

  // Ensure required directories exist
  if (!fs.existsSync(appExtDir) || !fs.existsSync(uiDir)) {
    console.warn('Required directories not found. Skipping sync.')
    return
  }

  // Load UI project metadata
  const uiPackagePath = resolvePath('ui/package.json')
  const { name, version } = readJson(uiPackagePath)

  // Load App Extension metadata
  const appExtPackagePath = resolvePath('app-extension/package.json')
  const appExtJson = readJson(appExtPackagePath)

  // Sync version and dependencies
  let updated = false

  if (syncVersion) {
    appExtJson.version = version
    updated = true
  }

  const depUpdate =
    updateDependency(appExtJson.dependencies, name, version) ||
    updateDependency(appExtJson.devDependencies, name, version)

  if (updated && depUpdate) {
    writeJson(appExtPackagePath, appExtJson)
    console.log(` ⭐️ App Extension version ${blue(appExtJson.name)} synced with UI version.\n`)
  } else {
    console.error('   App Extension version and dependency NOT synced.\n')
  }
}

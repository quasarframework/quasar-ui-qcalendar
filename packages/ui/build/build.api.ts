import { existsSync } from 'node:fs'
import { basename, extname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import fse from 'fs-extra'
import { readJsonFile, resolveToRoot, writeFile } from './build.utils.js'

type QPressApiEntry = {
  input: string
  output: string
  type?: string
}

type QPressConfig = {
  api?: {
    entries?: QPressApiEntry[]
  }
}

type QPressApiModule = {
  generateQPressApi: (options: {
    cwd: string
    entries: QPressApiEntry[]
    generatedSuffix?: string
    writeOutput?: boolean
  }) => Promise<unknown>
}

type BuiltApiEntry = {
  api: any
  name: string
}

type BuiltApi = {
  components: BuiltApiEntry[]
  directives: BuiltApiEntry[]
  plugins: BuiltApiEntry[]
  utils: BuiltApiEntry[]
}

const repoRoot = resolve(resolveToRoot(), '../..')
const qpressConfigPath = resolve(repoRoot, 'qpress.config.json')
const apiDest = resolveToRoot('dist/api')
const apiListDest = resolveToRoot('dist/transforms/api-list.json')

function encodeJson(value: unknown, compact: boolean): string {
  return compact === true ? JSON.stringify(value) : JSON.stringify(value, null, 2)
}

function resolveModuleSpecifier(specifier: string): string {
  if (specifier.startsWith('.') || specifier.startsWith('/')) {
    return pathToFileURL(resolve(process.cwd(), specifier)).href
  }

  return specifier
}

async function loadQPressApiModule(): Promise<QPressApiModule> {
  const specifier =
    process.env.QPRESS_API_MODULE ??
    '@md-plugins/quasar-app-extension-q-press/dist/api/qpress-api.js'

  return import(resolveModuleSpecifier(specifier)) as Promise<QPressApiModule>
}

function getQPressEntries(): QPressApiEntry[] {
  if (!existsSync(qpressConfigPath)) {
    throw new Error(`Missing Q-Press config: ${qpressConfigPath}`)
  }

  const config = readJsonFile(qpressConfigPath) as QPressConfig
  const entries = config.api?.entries ?? []

  if (entries.length === 0) {
    throw new Error('No Q-Press API entries configured.')
  }

  return entries
}

function getApiName(outputPath: string): string {
  const fileName = basename(outputPath)
  const extension = extname(fileName)

  return extension === '' ? fileName : fileName.slice(0, -extension.length)
}

function readBuiltComponents(entries: QPressApiEntry[]): BuiltApiEntry[] {
  return entries.map((entry) => {
    const outputPath = resolve(repoRoot, entry.output)

    return {
      api: readJsonFile(outputPath),
      name: getApiName(entry.output),
    }
  })
}

async function writeApiIndex(entries: BuiltApiEntry[], compact: boolean): Promise<void> {
  await writeFile(
    apiListDest,
    encodeJson(
      entries
        .map((entry) => entry.name)
        .sort((left, right) => left.localeCompare(right)),
      compact,
    ),
  )
}

export async function generate({ compact = false } = {}): Promise<BuiltApi> {
  const entries = getQPressEntries()
  const qpressApi = await loadQPressApiModule()

  fse.emptyDirSync(apiDest)

  await qpressApi.generateQPressApi({
    cwd: repoRoot,
    entries,
    generatedSuffix: '',
    writeOutput: true,
  })

  const components = readBuiltComponents(entries)

  await writeApiIndex(components, compact)

  return {
    components,
    directives: [],
    plugins: [],
    utils: [],
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  generate().catch((err: unknown) => {
    console.error(err)
    process.exitCode = 1
  })
}

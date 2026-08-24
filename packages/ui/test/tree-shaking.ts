import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { rolldown } from 'rolldown'

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const rootMonthBundleBudget = 55_000

async function bundleImport(source: string): Promise<string> {
  const entryId = '\0tree-shaking-consumer'
  const bundle = await rolldown({
    input: entryId,
    external: ['vue'],
    treeshake: { moduleSideEffects: false },
    plugins: [
      {
        name: 'tree-shaking-consumer',
        resolveId(id) {
          return id === entryId ? entryId : null
        },
        load(id) {
          return id === entryId ? source : null
        },
      },
    ],
  })
  const { output } = await bundle.generate({ format: 'esm', minify: true })
  await bundle.close()

  return output
    .filter((item) => item.type === 'chunk')
    .map((item) => item.code)
    .join('\n')
}

async function registeredComponents(entry: string): Promise<string[]> {
  const { default: plugin } = (await import(pathToFileURL(entry).href)) as {
    default: {
      install(app: { component: (name: string, component: unknown) => void }): void
    }
  }
  const registrations: string[] = []

  plugin.install({
    component(name) {
      registrations.push(name)
    },
  })

  return registrations
}

const rootEntry = path.join(packageRoot, 'dist/index.esm.js')
const wrapperEntry = path.join(packageRoot, 'dist/QCalendar.esm.js')
const monthEntry = path.join(packageRoot, 'dist/QCalendarMonth.esm.js')
const rootMonthBundle = await bundleImport(
  `export { QCalendarMonth } from ${JSON.stringify(rootEntry)}`,
)
const directMonthBundle = await bundleImport(
  `export { QCalendarMonth } from ${JSON.stringify(monthEntry)}`,
)
const rootPluginBundle = await bundleImport(`export { default } from ${JSON.stringify(rootEntry)}`)
const wrapperBundle = await bundleImport(`export { QCalendar } from ${JSON.stringify(rootEntry)}`)
const compatibilityWrapperBundle = await bundleImport(
  `export { default } from ${JSON.stringify(wrapperEntry)}`,
)

assert.doesNotMatch(
  rootMonthBundle,
  /name:\s*["'`]QCalendar(?:Agenda|Day|Resource|Scheduler|Task)["'`]/,
)
assert.ok(
  rootMonthBundle.length <= directMonthBundle.length * 1.1,
  `named root Month bundle (${rootMonthBundle.length} bytes) exceeds direct Month bundle (${directMonthBundle.length} bytes) by more than 10%`,
)
assert.ok(
  rootMonthBundle.length <= rootMonthBundleBudget,
  `named root Month bundle (${rootMonthBundle.length} bytes) exceeds its ${rootMonthBundleBudget}-byte budget`,
)
for (const component of [
  'QCalendarAgenda',
  'QCalendarDay',
  'QCalendarMonth',
  'QCalendarResource',
  'QCalendarScheduler',
  'QCalendarTask',
]) {
  const componentName = new RegExp(`name:\\s*["'\`]${component}["'\`]`)
  assert.match(rootPluginBundle, componentName)
  assert.match(wrapperBundle, componentName)
  assert.match(compatibilityWrapperBundle, componentName)
}

assert.deepEqual(await registeredComponents(rootEntry), [
  'QCalendar',
  'QCalendarAgenda',
  'QCalendarDay',
  'QCalendarMonth',
  'QCalendarResource',
  'QCalendarScheduler',
  'QCalendarTask',
])
assert.deepEqual(await registeredComponents(wrapperEntry), ['QCalendar'])

const packageJson = JSON.parse(await readFile(path.join(packageRoot, 'package.json'), 'utf8')) as {
  sideEffects?: string[]
}
assert.deepEqual(packageJson.sideEffects, ['**/*.css', '**/*.scss'])

process.stdout.write(
  `Tree-shaking check passed: root Month ${rootMonthBundle.length} bytes; direct Month ${directMonthBundle.length} bytes.\n`,
)

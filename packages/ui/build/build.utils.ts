/* global process console */
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import fse from 'fs-extra'
import zlib from 'zlib'
import { red, yellow, green, blue, magenta, gray, underline } from 'kolorist'
import { table } from 'table'
import config from './config'

const jsRE = /\.c?js$/
const cssRE = /\.(css|sass|scss)$/
const tsRE = /\.ts$/
const jsonRE = /\.json$/

interface TableDataEntry {
  0: string
  1: string
  2: string
  3: string
}

const tableData: TableDataEntry[] = []

export function plural(num: number) {
  return num === 1 ? '' : 's'
}

const camelCaseRE = /((-|\.)\w)/g
const camelCaseInnerRE = /-|\./
export function camelCase(str: string) {
  // assumes kebab case "str"
  return str.replace(camelCaseRE, (text) => text.replace(camelCaseInnerRE, '').toUpperCase())
}

const kebabRE = /([a-zA-Z])([A-Z])/g
export function kebabCase(str: string) {
  // assumes pascal case "str"
  return str.replace(kebabRE, '$1-$2').toLowerCase()
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const rootFolder = fileURLToPath(new URL('..', import.meta.url))

export function resolveToRoot(...pathList: string[]): string {
  return path.resolve(rootFolder, ...pathList)
}

export function relativeToRoot(...pathList: string[]): string {
  /// @ts-expect-error fix later
  return path.relative(rootFolder, ...pathList)
}

export const { version, ProductName } = readJsonFile(new URL('../package.json', import.meta.url))
export const banner = config.banner

process.on('exit', (code) => {
  if (code === 0 && tableData.length > 0) {
    tableData.sort((a, b) => {
      return a[0] === b[0] ? (a[1] < b[1] ? -1 : 1) : a[0] < b[0] ? -1 : 1
    })

    tableData.unshift([
      underline('Type'),
      underline('Filename'),
      underline('Size'),
      underline('Gzipped'),
    ])

    const output = table(tableData as unknown as ReadonlyArray<readonly unknown[]>, {
      columns: {
        0: { alignment: 'right' },
        1: { alignment: 'left' },
        2: { alignment: 'right' },
        3: { alignment: 'right' },
      },
    })

    console.log()
    console.log(` Summary of ${ProductName} v${version}:`)
    console.log(output)
  }
})

function getSize(code: string): string {
  return (code.length / 1024).toFixed(2) + 'kb'
}

export function createFolder(folder: string) {
  const dir = path.join(rootFolder, folder)
  fse.ensureDirSync(dir)
}

function getDestinationInfo(dest: string): {
  banner: string
  tableEntryType: string
  toTable: boolean
} {
  if (jsonRE.test(dest)) {
    return {
      banner: gray('[json]'),
      tableEntryType: gray('json'),
      toTable: false,
    }
  }

  if (jsRE.test(dest)) {
    return {
      banner: green('[js]  '),
      tableEntryType: green('js'),
      toTable: dest.indexOf('dist/quasar') !== -1,
    }
  }

  if (cssRE.test(dest)) {
    return {
      banner: blue('[css] '),
      tableEntryType: blue('css'),
      toTable: true,
    }
  }

  if (tsRE.test(dest)) {
    return {
      banner: magenta('[ts]  '),
      tableEntryType: magenta('ts'),
      toTable: false,
    }
  }

  logError(`Unknown file type using buildUtils.writeFile: ${dest}`)
  process.exit(1)
}

export function writeFile(dest: string, code: string, zip = false): Promise<string> {
  const { banner, tableEntryType, toTable } = getDestinationInfo(dest)

  const fileSize = getSize(code)
  const filePath = path.relative(process.cwd(), dest)

  return new Promise((resolve, reject) => {
    function report(gzippedString?: string, gzippedSize?: string) {
      if (gzippedString) {
        console.log(
          `${banner} ${filePath.padEnd(49)} ${fileSize.padStart(8)}${gzippedString || ''}`,
        )

        if (toTable) {
          tableData.push([tableEntryType, filePath, fileSize, gzippedSize || '-'])
        }
      }

      resolve(code)
    }

    fse.writeFile(dest, code, (err) => {
      if (err) return reject(err)
      if (zip) {
        zlib.gzip(code, (err, zipped: Buffer<ArrayBufferLike>) => {
          if (err) return reject(err)
          const size = getSize(zipped as unknown as string)
          report(` (gzipped: ${size.padStart(8)})`, size)
        })
      } else {
        report()
      }
    })
  })
}

export function readFile(file: string) {
  return fse.readFileSync(file, 'utf-8')
}

export function readJsonFile(file: string | URL): Record<string, unknown> {
  return JSON.parse(fse.readFileSync(file, 'utf-8'))
}

export function writeFileIfChanged(
  dest: string,
  newContent: string,
  zip: boolean,
): Promise<string | void> {
  let currentContent = ''
  try {
    currentContent = fse.readFileSync(dest, 'utf-8')
  } catch {
    //
  }

  return newContent.split(/[\n\r]+/).join('\n') !== currentContent.split(/[\n\r]+/).join('\n')
    ? writeFile(dest, newContent, zip)
    : Promise.resolve()
}

export function logError(err: string | Error) {
  console.error('\n' + red('[Error]'), err)
  console.log()
}

export function logWarning(err: string | Error) {
  console.error('\n' + yellow('[Warning]'), err)
  console.log()
}

export function clone(data: string) {
  const str = JSON.stringify(data)

  if (str) {
    return JSON.parse(str)
  }
}

const privateFileRE = /test|private/

export function filterOutPrivateFiles(file: string) {
  return privateFileRE.test(file) === false
}

export function copyFolder(srcDir: string, destDir: string) {
  return fse
    .copy(srcDir, destDir)
    .then(() => {
      console.log(`Copied from ${srcDir} to ${destDir}`)
    })
    .catch((err) => {
      console.error('\n' + red('[Error]'), err)
      console.log()
    })
}

export function removeDuplicates<T>(array: T[]): T[] {
  return Array.from(new Set(array))
}

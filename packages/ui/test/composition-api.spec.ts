import { describe, expect, it } from 'vitest'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'

const repoRoot = process.cwd()
const packageDirs = ['packages/ui/src', 'packages/docs/src']
const ignoredDirs = new Set(['node_modules', 'dist', '.quasar'])

function walkFiles(dir: string, extensions: string[], files: string[] = []): string[] {
  if (existsSync(dir) !== true) {
    return files
  }

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) {
      continue
    }

    const path = join(dir, entry.name)

    if (entry.isDirectory()) {
      walkFiles(path, extensions, files)
    } else if (entry.isFile() && extensions.some((extension) => path.endsWith(extension))) {
      files.push(path)
    }
  }

  return files
}

function getVueScriptBlocks(content: string): { attrs: string; body: string }[] {
  return [...content.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)].map((match) => ({
    attrs: match[1] ?? '',
    body: match[2] ?? '',
  }))
}

function relativeFiles(files: string[]): string[] {
  return files.map((file) => relative(repoRoot, file)).sort()
}

describe('[QCALENDAR] Composition API coverage', () => {
  it('keeps Vue SFCs on script setup', () => {
    const vueFiles = packageDirs.flatMap((dir) => walkFiles(join(repoRoot, dir), ['.vue']))
    const nonSetupScripts = vueFiles.filter((file) => {
      return getVueScriptBlocks(readFileSync(file, 'utf8')).some(
        ({ attrs }) => /\bsetup\b/.test(attrs) !== true,
      )
    })

    expect(relativeFiles(nonSetupScripts)).toEqual([])
  })

  it('does not reintroduce Options API state blocks in UI render components', () => {
    const componentFiles = walkFiles(join(repoRoot, 'packages/ui/src/components'), ['.ts'])
    const optionsApiPattern =
      /defineComponent\s*\(\s*\{[\s\S]*?(?:\bdata\s*\(|\bcomputed\s*:\s*\{|\bmethods\s*:\s*\{|\bwatch\s*:\s*\{|\bcreated\s*\(|\bmounted\s*\(|\bbeforeUnmount\s*\()/

    const optionsApiComponents = componentFiles.filter((file) =>
      optionsApiPattern.test(readFileSync(file, 'utf8')),
    )

    expect(relativeFiles(optionsApiComponents)).toEqual([])
  })
})

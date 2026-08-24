import { describe, expect, it, vi } from 'vitest'

import { runBuildPipeline, type BuildPipeline } from '../build/build.orchestration'

function deferred(): {
  promise: Promise<void>
  resolve: () => void
  reject: (_error: Error) => void
} {
  let resolve!: () => void
  let reject!: (_error: Error) => void
  const promise = new Promise<void>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })

  return { promise, resolve, reject }
}

describe('[QCALENDAR] UI build orchestration', () => {
  it('awaits prerequisites in order and all parallel artifact builds', async () => {
    const calls: string[] = []
    const javascript = deferred()
    const css = deferred()
    const api = { components: [] }
    const pipeline: BuildPipeline<typeof api> = {
      syncAppExtension: vi.fn(async () => {
        calls.push('sync')
      }),
      clean: vi.fn(async () => {
        calls.push('clean')
      }),
      prepareFolders: vi.fn(() => {
        calls.push('folders')
      }),
      buildTypes: vi.fn(() => {
        calls.push('types')
      }),
      writeVersion: vi.fn(async () => {
        calls.push('version')
      }),
      buildApi: vi.fn(async () => {
        calls.push('api')
        return api
      }),
      buildWebTypes: vi.fn(async (generatedApi) => {
        expect(generatedApi).toBe(api)
        calls.push('web-types')
      }),
      buildJavaScript: vi.fn(() => {
        calls.push('javascript')
        return javascript.promise
      }),
      buildCss: vi.fn(() => {
        calls.push('css')
        return css.promise
      }),
    }

    let completed = false
    const build = runBuildPipeline(pipeline).then(() => {
      completed = true
    })

    await vi.waitFor(() => {
      expect(calls).toEqual([
        'sync',
        'clean',
        'folders',
        'types',
        'version',
        'api',
        'web-types',
        'javascript',
        'css',
      ])
    })
    expect(completed).toBe(false)

    javascript.resolve()
    await Promise.resolve()
    expect(completed).toBe(false)

    css.resolve()
    await build
    expect(completed).toBe(true)
  })

  it('rejects when a parallel artifact build fails', async () => {
    const error = new Error('CSS build failed')
    const pipeline: BuildPipeline<null> = {
      syncAppExtension: async () => {},
      clean: async () => {},
      prepareFolders: () => {},
      buildTypes: () => {},
      writeVersion: async () => {},
      buildApi: async () => null,
      buildWebTypes: async () => {},
      buildJavaScript: async () => {},
      buildCss: async () => {
        throw error
      },
    }

    await expect(runBuildPipeline(pipeline)).rejects.toBe(error)
  })
})

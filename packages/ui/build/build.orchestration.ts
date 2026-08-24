export interface BuildPipeline<Api> {
  syncAppExtension: () => Promise<void>
  clean: () => Promise<void>
  prepareFolders: () => void
  buildTypes: () => void
  writeVersion: () => Promise<void>
  buildApi: () => Promise<Api>
  buildWebTypes: (_api: Api) => Promise<void> | void
  buildJavaScript: () => Promise<void>
  buildCss: () => Promise<void>
}

export async function runBuildPipeline<Api>(pipeline: BuildPipeline<Api>): Promise<void> {
  await pipeline.syncAppExtension()
  await pipeline.clean()
  pipeline.prepareFolders()
  pipeline.buildTypes()
  await pipeline.writeVersion()

  const api = await pipeline.buildApi()
  await pipeline.buildWebTypes(api)

  await Promise.all([pipeline.buildJavaScript(), pipeline.buildCss()])
}

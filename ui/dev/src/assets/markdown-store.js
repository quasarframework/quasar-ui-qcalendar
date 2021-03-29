import { inject, provide, reactive } from 'vue'
import { markdownStoreKey } from './symbols.js'

export function useMarkdownStore () {
  return inject(markdownStoreKey)
}

export function provideMarkdownStore () {
  const store = {
    toc: []
  }

  provide(
    markdownStoreKey,
    process.env.SERVER === true ? store : reactive(store)
  )
}

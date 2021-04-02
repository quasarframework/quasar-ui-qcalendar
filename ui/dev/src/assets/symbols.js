const hasSymbol = typeof Symbol === 'function'
  && typeof Symbol.toStringTag === 'symbol'

export const markdownStoreKey = hasSymbol === true
  ? Symbol('_markdown_store_')
  : '_markdown_store_'

export const themeBuilderStoreKey = hasSymbol === true
  ? Symbol('_theme-builder_store_')
  : '_theme-builder_store_'

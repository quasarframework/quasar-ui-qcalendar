const hasSymbol = typeof Symbol === 'function'
  && typeof Symbol.toStringTag === 'symbol'

export const markdownStoreKey = hasSymbol === true
  ? Symbol('_markdown_store_')
  : '_markdown_store_'

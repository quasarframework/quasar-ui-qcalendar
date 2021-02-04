export default {
  name: 'ResizeObserver',

  mounted (el, { modifiers, value }) {
    if (!value) return // callback

    const opts = {}
    opts.callback = value
    opts.size = { width: 0, height: 0 }

    opts.observer = new ResizeObserver(entries => {
      const rect = entries[ 0 ].contentRect
      if (rect.width !== opts.size.width || rect.height !== opts.size.height) {
        opts.size.width = rect.width
        opts.size.height = rect.height
        opts.callback(opts.size)
      }
    })

    // start the observing
    opts.observer.observe(el)

    // save to element
    el.__onResizeObserver = opts
  },

  beforeUnmount (el) {
    if (!el.__onResizeObserver) return
    const { observer } = el.__onResizeObserver
    observer.unobserve(el)
    delete el.__onResizeObserver
  }
}

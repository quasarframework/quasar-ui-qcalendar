/* global window */
import { Directive, DirectiveBinding } from 'vue'

interface ResizeData {
  callback: () => void
  // `options` can be either a boolean or an object implementing AddEventListenerOptions.
  options: boolean | AddEventListenerOptions
}

// Extend HTMLElement to include our custom property.
interface HTMLElementWithResize extends HTMLElement {
  _onResize?: ResizeData
}

const ResizeDirective: Directive = {
  mounted(el: HTMLElementWithResize, binding: DirectiveBinding) {
    const { modifiers, value } = binding
    if (!value) return

    const callback = value as () => void
    // If modifiers are provided and not empty, use them as options; otherwise, default to { passive: true }.
    const options =
      Object.keys(modifiers).length > 0
        ? (modifiers as unknown as AddEventListenerOptions)
        : { passive: true }

    window.addEventListener('resize', callback, options)
    el._onResize = {
      callback,
      options,
    }

    // If the "quiet" modifier is not set, call the callback immediately.
    if (!modifiers.quiet) {
      callback()
    }
  },

  beforeUnmount(el: HTMLElementWithResize) {
    if (!el._onResize) return

    const { callback, options } = el._onResize
    window.removeEventListener('resize', callback, options)
    delete el._onResize
  },
}

export default ResizeDirective

import { Directive, DirectiveBinding } from 'vue'

export interface Size {
  width: number
  height: number
}

interface ResizeObserverData {
  callback: (_size: Size) => void
  size: Size
  observer: ResizeObserver
  debounceTimeout?: ReturnType<typeof setTimeout>
}

// Extend HTMLElement to include our custom property.
interface HTMLElementWithResizeObserver extends HTMLElement {
  __onResizeObserver?: ResizeObserverData
}

const ResizeObserverDirective: Directive = {
  mounted(el: HTMLElementWithResizeObserver, binding: DirectiveBinding) {
    // Ensure a callback is provided.
    if (typeof binding.value !== 'function') return

    const callback = binding.value as (_size: Size) => void

    const data: ResizeObserverData = {
      callback,
      size: { width: 0, height: 0 },
      observer: new ResizeObserver((entries) => {
        if (entries && Array.isArray(entries) && entries.length > 0) {
          const rect = entries[0]!.contentRect
          // Check if the dimensions have changed.
          if (rect.width !== data.size.width || rect.height !== data.size.height) {
            data.size.width = rect.width
            data.size.height = rect.height

            // Clear any pending debounce timeout.
            if (data.debounceTimeout) {
              clearTimeout(data.debounceTimeout)
            }
            // Set up a new debounce timeout.
            data.debounceTimeout = setTimeout(() => {
              data.callback(data.size)
              clearTimeout(data.debounceTimeout)
            }, 100) // Adjust the debounce delay (in ms) as needed.
          }
        }
      }),
    }

    // Start observing the element.
    data.observer.observe(el)

    // Store the data on the element.
    el.__onResizeObserver = data
  },

  beforeUnmount(el: HTMLElementWithResizeObserver) {
    if (!el.__onResizeObserver) return

    const { observer, debounceTimeout } = el.__onResizeObserver
    // Clear any pending debounce.
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }
    // Stop observing the element.
    observer.unobserve(el)
    // Clean up the property.
    delete el.__onResizeObserver
  },
}

export default ResizeObserverDirective

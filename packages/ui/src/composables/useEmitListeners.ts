import { computed, getCurrentInstance, ComponentInternalInstance, ComputedRef } from 'vue'

/**
 * Regular expression to match event listeners starting with 'on'.
 */
const listenerRE = /^on[A-Z]/

export type EmitListeners = ComputedRef<Record<string, boolean>>

/**
 * Provides computed event listeners from the component instance.
 * @param {ComponentInternalInstance | null} vm - Vue's component instance (defaults to `getCurrentInstance()`).
 * @returns {{ emitListeners: EmitListeners }} - Computed map of event listeners.
 */
export default function useEmitListeners(
  vm: ComponentInternalInstance | null = getCurrentInstance(),
): { emitListeners: EmitListeners } {
  return {
    emitListeners: computed(() => {
      const listeners: Record<string, boolean> = {}

      // Ensure vm and vm.vnode are defined before accessing props
      if (vm?.vnode?.props) {
        Object.keys(vm.vnode.props).forEach((key) => {
          if (listenerRE.test(key)) {
            listeners[key] = true
          }
        })
      }

      return listeners
    }),
  }
}

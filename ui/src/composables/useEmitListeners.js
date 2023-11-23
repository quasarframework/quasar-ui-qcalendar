import { computed, getCurrentInstance } from 'vue'

// look for events starting with 'on'
const listenerRE = /^on[A-Z]/

/**
 * Returns computed listeners on the current component instance.
 * @param {Vue.getCurrentInstance} [vm]
 * @returns {Object} Computed listeners on the instance.
 */
export default function (vm = getCurrentInstance()) {
  return {
    emitListeners: computed(() => {
      const listeners = {}

      // Ensure vm.vnode is defined and has props before iterating
      if (vm.vnode && vm.vnode.props) {
        Object.keys(vm.vnode.props).forEach((key) => {
          if (listenerRE.test(key)) {
            listeners[ key ] = true
          }
        })
      }

      return listeners
    }),
  }
}

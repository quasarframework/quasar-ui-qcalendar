import { computed, getCurrentInstance } from 'vue'

const listenerRE = /^on[A-Z]/

/**
 * export of default funtion
 * @param {Vue.getCurrentInstance} [vm]
 * @returns {Array} computed listeners on the instance
 */
export default function (vm = getCurrentInstance()) {
  return {
    emitListeners: computed(() => {
      const acc = {}

      if (vm.vnode !== void 0 && vm.vnode !== null && vm.vnode.props !== null) {
        Object.keys(vm.vnode.props).forEach(key => {
          if (listenerRE.test(key) === true) {
            acc[ key ] = true
          }
        })
      }

      return acc
    })
  }
}

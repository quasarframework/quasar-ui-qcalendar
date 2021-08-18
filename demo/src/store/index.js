import Vue from 'vue'
import Vuex from 'vuex'

import calendar from './calendar'
import common from './common'
import ThemeBuilder from './ThemeBuilder'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      calendar,
      common,
      ThemeBuilder
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING
  })

  return Store
}

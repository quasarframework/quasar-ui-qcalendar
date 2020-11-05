import Vue from 'vue'

export function setStyle (state, { name, value }) {
  // state.style[name] = value
  Vue.set(state.style, name, value)
}

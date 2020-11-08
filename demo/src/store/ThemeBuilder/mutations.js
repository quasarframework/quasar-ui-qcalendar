import Vue from 'vue'

export function setCurrentStyleName (state, name) {
  state.currentStyleName = name
}
export function setStyle (state, { name, value }) {
  Vue.set(state.style, name, value)
}

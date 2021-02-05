export function setCurrentStyleName (state, name) {
  state.currentStyleName = name
}
export function setStyle (state, { name, styles }) {
  state.style.splice(0, state.toc.length, ...styles)
}

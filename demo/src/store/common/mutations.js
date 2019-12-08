export const titlebarHeight = (state, height) => {
  state.titlebarHeight = height
}
export const toc = (state, toc) => {
  state.toc.splice(0, state.toc.length, ...toc)
}

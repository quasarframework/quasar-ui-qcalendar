export default ({ Vue }) => {
  const examples = require('../assets/examples').default
  for (const index in examples) {
    import(
      /* webpackChunkName: "examples" */
      /* webpackMode: "lazy-once" */
      `../examples/${examples[index].file}.vue`
    ).then(comp => {
      Vue.component(examples[index].file, comp.default)
    })
  }
}

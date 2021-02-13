// eslint-disable-next-line @typescript-eslint/no-var-requires
const fg = require('fast-glob')
const projects = fg.sync('./*', {
  onlyDirectories: true,
  cwd: __dirname
})

/** @type {import('vls').VeturConfig} */
module.exports = {
  // **optional** default: `{}`
  // override vscode settings
  // Notice: It only affects the settings used by Vetur.
  settings: {
    'vetur.useWorkspaceDependencies': true,
    'vetur.validation.template': false,
    'vetur.experimental.templateInterpolationService': true
  },
  // support monorepos
  projects
}

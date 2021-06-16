// Vetur mono-repo support

/** @type {import('vls').VeturConfig} */
module.exports = {
  // **optional** default: `{}`
  // override vscode settings
  // Notice: It only affects the settings used by Vetur.
  settings: {
    'vetur.useWorkspaceDependencies': false,
    'vetur.validation.template': false,
    'vetur.experimental.templateInterpolationService': false
  },
  // support monorepos
  projects: [
    './docs',
    './ui',
    'app-extension'
  ]

}

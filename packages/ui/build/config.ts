import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { name, author, version } = require('../package.json')
const year = new Date().getFullYear()

// oxfmt-ignore
export default {
  name,
  version,
  banner:
    '/*!\n'
    + ' * ' + name + ' v' + version + '\n'
    + ' * (c) ' + year + ' ' + author + '\n'
    + ' * Released under the MIT License.\n'
    + ' */\n'
}

import { version } from './version.js'

import * as Timestamp from './utils/Timestamp'
import * as helpers from './utils/helpers'

// Explicitly export individual named properties
export * from './utils/Timestamp'
export * from './utils/helpers'

export { version }

export default {
  version,
  ...Timestamp,
  ...helpers,
}

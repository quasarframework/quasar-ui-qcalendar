import { config } from '@vue/test-utils'
import { Quasar } from 'quasar'

import 'quasar/src/css/index.sass'
import '../../src/index.scss'

config.global.plugins.push(Quasar)

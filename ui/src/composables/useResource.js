// resource composables
import { validateNumber } from '../utils/Timestamp.js'

export const useResourceProps = {
  resources: Array,
  resourceKey: {
    type: String,
    default: 'label'
  },
  resourceHeight: {
    type: [ Number, String ],
    default: 70,
    validator: validateNumber
  },
  resourceWidth: {
    type: [ Number, String ],
    default: 100,
    validator: v => v === undefined || validateNumber(v)
  },
  resourceStyle: {
    type: Function,
    default: null
  }
}

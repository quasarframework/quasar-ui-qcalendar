// interval-header composables
import { validateNumber } from '../utils/Timestamp.js'

export const useIntervalHeaderProps = {
  intervalHeaderWidth: {
    type: [ Number, String ],
    default: 100,
    validator: validateNumber
  },
  intervalHeaderHeight: {
    type: [ Number, String ],
    default: 20,
    validator: validateNumber
  }
}

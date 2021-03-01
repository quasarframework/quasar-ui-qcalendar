// column composables
import { validateNumber } from '../utils/Timestamp.js'

export const useColumnProps = {
  columnCount: {
    type: [ Number, String ],
    default: 0,
    validator: validateNumber
  },
  columnIndexStart: {
    type: [ Number, String ],
    default: 0,
    validator: validateNumber
  }
}

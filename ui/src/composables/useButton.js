import { h } from 'vue'
import useFocusHelper from './useFocusHelper'

export default function (props, data, slotData) {
  const isFocusable = props.focusable === true && props.focusType.includes('date') === true
  data.tabindex = isFocusable === true ? 0 : -1
  return h('button', data, [
    slotData,
    isFocusable === true && useFocusHelper()
  ])
}

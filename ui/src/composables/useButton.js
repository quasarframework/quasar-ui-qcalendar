import { h } from 'vue'
import useFocusHelper from './useFocusHelper.js'

export default function ({ focusable, focusType }, data, slotData) {
  // Ensure the button is focusable based on props
  const isFocusable = focusable && focusType.includes('date')
  return h('button', { ...data, tabindex: isFocusable ? 0 : -1 }, [ slotData, isFocusable && useFocusHelper() ])
}

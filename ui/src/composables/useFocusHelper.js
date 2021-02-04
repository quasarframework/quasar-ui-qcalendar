import { h } from 'vue'

export default function () {
  return [
    h('span', {
      ariaHidden: 'true',
      class: 'q-calendar__focus-helper'
    })
  ]
}

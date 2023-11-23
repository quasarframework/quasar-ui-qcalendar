import { h } from 'vue'

export default function () {
  const spanProps = {
    'aria-hidden': 'true',
    class: 'q-calendar__focus-helper',
  }

  return [h('span', spanProps)]
}

import { h, VNode } from 'vue'

/**
 * Creates an accessible focus helper span element.
 * @returns {VNode[]} An array containing a single span VNode.
 */
export default function useFocusHelper(): VNode[] {
  const spanProps = {
    'aria-hidden': 'true',
    class: 'q-calendar__focus-helper',
  }

  return [h('span', spanProps)]
}

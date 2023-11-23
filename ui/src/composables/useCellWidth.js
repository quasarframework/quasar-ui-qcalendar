// cellWidth composables
import { computed } from 'vue'

export const useCellWidthProps = {
  cellWidth: [ Number, String ],
}

/**
 * Determines whether the cell width is defined.
 * @param {Object} props - The component props.
 * @returns {Object} - The `isSticky` computed property.
 */
export default function (props) {
  const isSticky = computed(() => props.cellWidth !== undefined)

  return {
    isSticky,
  }
}

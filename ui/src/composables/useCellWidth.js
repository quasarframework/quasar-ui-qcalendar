// cellWidth composables
import { computed } from 'vue'

/**
 * export of useStickyProps
 * @returns 'cellWidth' property
 */

export const useCellWidthProps = {
  cellWidth: String
}

export default function (props) {
  const isSticky = computed(() => props.cellWidth !== undefined)

  return {
    isSticky
  }
}

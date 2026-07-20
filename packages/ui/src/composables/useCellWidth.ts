// cellWidth composables
import { computed, ComputedRef } from 'vue'

import { convertToUnit } from '../utils/helpers'

export const useCellWidthProps = {
  /**
   * Fixed cell width used by sticky or horizontally scrolling displays.
   *
   * @category layout
   */
  cellWidth: [Number, String],
}

/**
 * Determines whether the cell width is defined.
 * @param {Object} props - The component props.
 * @returns {Object} - The `isSticky` computed property.
 */
/**
 * Determines whether the cell width is defined.
 * @param {Object} props - The component props.
 * @returns {Object} - The `isSticky` computed property.
 */
/**
 * @param {Object} props - The component props.
 * @returns {Object} - An object containing the `isSticky` computed property.
 */
export interface CellWidthProps {
  cellWidth?: number | string
}

interface UseCellWidthReturn {
  isSticky: ComputedRef<boolean>
  cellWidthStyle: ComputedRef<string | undefined>
}

export default function useCellWidth(props: CellWidthProps): UseCellWidthReturn {
  const isSticky = computed(() => props.cellWidth !== undefined)
  const cellWidthStyle = computed(() => convertToUnit(props.cellWidth))

  return {
    isSticky,
    cellWidthStyle,
  }
}

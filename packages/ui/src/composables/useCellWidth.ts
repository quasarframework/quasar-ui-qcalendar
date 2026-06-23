// cellWidth composables
import { computed, ComputedRef } from 'vue'

export const useCellWidthProps = {
  /** Fixed cell width used by sticky or horizontally scrolling views. */
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
}

export default function useCellWidth(props: CellWidthProps): UseCellWidthReturn {
  const isSticky = computed(() => props.cellWidth !== undefined)

  return {
    isSticky,
  }
}

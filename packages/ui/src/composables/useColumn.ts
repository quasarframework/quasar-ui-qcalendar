import { PropType } from 'vue'
import { validateNumber } from '@timestamp-js/core'

export interface ColumnObject {
  [key: string]: any
}

export type ColumnObjectArray = ColumnObject[]

export interface ColumnProps {
  columnCount: number | string
  columnIndexStart: number | string
}

export function getColumnIndexes(
  columnCount: number | string,
  columnIndexStart: number | string = 0,
): number[] {
  const count = parseInt(String(columnCount), 10)
  const start = parseInt(String(columnIndexStart), 10)

  if (count <= 0 || Number.isNaN(count)) {
    return []
  }

  return Array.from({ length: count }, (_, index) => index + (Number.isNaN(start) ? 0 : start))
}

export const useColumnProps = {
  /**
   * Number of columns rendered when a single day is split into columns.
   *
   * @category layout
   */
  columnCount: {
    type: [Number, String] as PropType<ColumnProps['columnCount']>,
    default: 0,
    validator: validateNumber,
  },
  /**
   * Starting column index used when rendering split day columns.
   *
   * @category layout
   */
  columnIndexStart: {
    type: [Number, String] as PropType<ColumnProps['columnIndexStart']>,
    default: 0,
    validator: validateNumber,
  },
} as const

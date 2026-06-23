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

export const useColumnProps = {
  /** Number of columns rendered when a single day is split into columns. */
  columnCount: {
    type: [Number, String] as PropType<ColumnProps['columnCount']>,
    default: 0,
    validator: validateNumber,
  },
  /** Starting column index used when rendering split day columns. */
  columnIndexStart: {
    type: [Number, String] as PropType<ColumnProps['columnIndexStart']>,
    default: 0,
    validator: validateNumber,
  },
} as const

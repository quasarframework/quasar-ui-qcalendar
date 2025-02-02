import { PropType } from 'vue'
import { validateNumber } from '../utils/Timestamp'

export interface ColumnObject {
  [key: string]: any
}

export type ColumnObjectArray = ColumnObject[]

export interface ColumnProps {
  columnCount: number | string
  columnIndexStart: number | string
}

export const useColumnProps = {
  columnCount: {
    type: [Number, String] as PropType<ColumnProps['columnCount']>,
    default: 0,
    validator: validateNumber,
  },
  columnIndexStart: {
    type: [Number, String] as PropType<ColumnProps['columnIndexStart']>,
    default: 0,
    validator: validateNumber,
  },
} as const

import { PropType } from 'vue'

/**
 * Interface for maxDays prop.
 */
export interface MaxDaysProps {
  maxDays: number
}

/**
 * Defines the maxDays prop for components.
 */
export const useMaxDaysProps = {
  /** Maximum number of days rendered by day-like views. */
  maxDays: {
    type: Number as PropType<MaxDaysProps['maxDays']>,
    default: 1,
  },
} as const

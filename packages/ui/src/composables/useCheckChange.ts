import { Ref } from 'vue'
import { Timestamp } from '../utils/Timestamp'

export const useCheckChangeEmits = ['change'] as const

export interface CheckChangeProps {
  days: Ref<Timestamp[]>
  lastStart: Ref<string | null>
  lastEnd: Ref<string | null>
}

export interface CheckChangeEvent {
  start: string
  end: string
  days: Timestamp[]
}

interface CheckChangeReturn {
  checkChange: () => boolean
}

export default function useCheckChange(
  emit: (_event: 'change', _payload: CheckChangeEvent) => void,
  { days, lastStart, lastEnd }: CheckChangeProps,
): CheckChangeReturn {
  function checkChange(): boolean {
    const dayList = days.value
    if (dayList.length === 0) return false

    const start = dayList[0]!.date
    const end = dayList[dayList.length - 1]!.date

    if (!lastStart.value || !lastEnd.value || start !== lastStart.value || end !== lastEnd.value) {
      lastStart.value = start
      lastEnd.value = end
      emit('change', { start, end, days: dayList })
      return true
    }

    return false
  }

  return { checkChange }
}

export const useCheckChangeEmits = [
  'change'
]

export default function (emit, {
  days,
  lastStart,
  lastEnd
}) {
  function checkChange () {
    if (days.value && days.value.length > 0) {
      const start = days.value[ 0 ].date
      const end = days.value[ days.value.length - 1 ].date
      if (lastStart.value === null
        || lastEnd.value === null
        || start !== lastStart.value
        || end !== lastEnd.value
      ) {
        lastStart.value = start
        lastEnd.value = end
        emit('change', { start, end, days: days.value })
        return true
      }
    }
    return false
  }

  return {
    checkChange
  }
}

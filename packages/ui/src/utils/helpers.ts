export function convertToUnit(input: any, unit = 'px'): string | undefined {
  if (!input) {
    return undefined
  } else if (isNaN(input)) {
    return String(input)
  } else if (input === 'auto') {
    return input
  } else {
    return `${Number(input)}${unit}`
  }
}

export function resolveCssLength(
  value: number | string,
  referenceElement?: HTMLElement | null,
): number {
  if (typeof value === 'number') {
    return value
  }

  const normalizedValue = value.trim()
  if (/^-?(?:\d+|\d*\.\d+)(?:px)?$/i.test(normalizedValue)) {
    return parseFloat(normalizedValue)
  }

  if (referenceElement !== undefined && referenceElement !== null) {
    const probe = document.createElement('div')
    probe.style.position = 'absolute'
    probe.style.visibility = 'hidden'
    probe.style.pointerEvents = 'none'
    probe.style.width = normalizedValue
    referenceElement.appendChild(probe)
    const width = probe.getBoundingClientRect().width
    probe.remove()

    if (width > 0) {
      return width
    }
  }

  // SSR cannot measure relative CSS units. This value is replaced with the
  // measured width after mounting; rendered styles retain the original unit.
  return parseFloat(normalizedValue)
}

export function indexOf(array: any[], cb: (_element: any, _index: number) => boolean): number {
  for (let i = 0; i < array.length; i++) {
    if (cb(array[i], i) === true) {
      return i
    }
  }
  return -1
}

export function minCharWidth(str: string, count: number): string {
  if (count === 0) return str
  return str.slice(0, count)
}

export function getResponsiveWeekdayLabel<TTimestamp>({
  day,
  formatter,
  shortWeekdayLabel,
  cellWidth,
  breakpoints,
  minWeekdayLabel,
  forceMinWidth = false,
}: {
  day: TTimestamp
  formatter: (_day: TTimestamp, _short: boolean) => string
  shortWeekdayLabel: boolean
  cellWidth: number
  breakpoints: readonly number[]
  minWeekdayLabel: number | string
  forceMinWidth?: boolean
}): string {
  const [wideBreakpoint = 0, narrowBreakpoint = 0] = breakpoints
  const weekdayLabel = formatter(
    day,
    shortWeekdayLabel || (wideBreakpoint > 0 && cellWidth <= wideBreakpoint),
  )

  return forceMinWidth || (narrowBreakpoint > 0 && cellWidth <= narrowBreakpoint)
    ? minCharWidth(weekdayLabel, Number(minWeekdayLabel))
    : weekdayLabel
}

export default {
  convertToUnit,
  resolveCssLength,
  getResponsiveWeekdayLabel,
  indexOf,
  minCharWidth,
}

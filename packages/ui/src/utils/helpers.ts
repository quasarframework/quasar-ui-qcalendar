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

export default {
  convertToUnit,
  indexOf,
  minCharWidth,
}

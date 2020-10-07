export function convertToUnit (input, unit = 'px') {
  if (input == null || input === '') {
    return undefined
  }
  else if (isNaN(input)) {
    return String(input)
  }
  else if (input === 'auto') {
    return input
  }
  else {
    return `${Number(input)}${unit}`
  }
}

export function indexOf (array, cb) {
  for (let i = 0; i < array.length; i++) {
    if (cb(array[i], i) === true) {
      return i
    }
  }
  return -1
}

export default {
  convertToUnit,
  indexOf
}

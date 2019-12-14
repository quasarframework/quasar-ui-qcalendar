export function convertToUnit (str, unit = 'px') {
  if (str == null || str === '') {
    return void 0
  } else if (isNaN(str)) {
    return String(str)
  } else {
    return `${Number(str)}${unit}`
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

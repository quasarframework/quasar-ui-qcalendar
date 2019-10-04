export function convertToUnit (str, unit = 'px') {
  if (str == null || str === '') {
    return void 0
  } else if (isNaN(str)) {
    return String(str)
  } else {
    return `${Number(str)}${unit}`
  }
}

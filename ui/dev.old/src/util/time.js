export const padTime = (val) => {
  val = Math.floor(val)
  if (val < 10) {
    return '0' + val
  }
  return val + ''
}

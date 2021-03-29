export const isCssColor = (color) => {
  return !!color && !!color.match(/^(#|(rgb|hsl)a?\()/)
}

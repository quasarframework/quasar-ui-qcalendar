/*
 * Export files list for /pages folder
 */

function kebabCase (str) {
  return str.replace(
    /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g,
    match => '-' + match.toLowerCase()
  ).substring(1)
}

function slugify (str) {
  return encodeURIComponent(String(str).trim().replace(/\s+/g, '-'))
}

export default require.context('../pages', true, /^\.\/.*\.vue$/)
  .keys()
  .map(page => page.slice(2).replace('.vue', ''))
  .filter(page => page !== "Index")
  .map(page => ({
    file: page,
    title: page + '.vue',
    path: slugify(kebabCase(page))
  }))

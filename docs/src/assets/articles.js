const toKebabCase = (str) => {
  return str
    .split('')
    .map((letter, index) => {
      if (/[A-Z]/.test(letter)) {
        return ` ${ letter.toLowerCase() }`
      }
      return letter
    })
    .join('')
    .trim()
    .replace(/[_\s]+/g, '-')
}

const toTitleCase = (str) => {
  return toKebabCase(str)
    .split('-')
    .map(word => {
      return word.slice(0, 1).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

const todayDate = new Date()

export default require.context('../pages/latest-news/articles', true, /^\.\/.*\.md$/)
  .keys()
  .map(page => page.slice(2).replace('.md', ''))
  .filter(page => {
    const [publishWhen] = page.split('_')
    const publishDate = new Date(publishWhen)
    return todayDate >= publishDate
  })
  .sort((a, b) => {
    const [publishWhenA] = a.split('_')
    const [publishWhenB] = b.split('_')
    const dateA = new Date(publishWhenA), dateB = new Date(publishWhenB)
    return dateB.valueOf - dateA.valueOf
  })
  .map(page => {
    const [ publishWhen, articleName ] = page.split('_')
    return {
      component: () => import(`pages/latest-news/articles/${ page }.md`),
      name: page,
      title: toTitleCase(articleName),
      path: `/latest-news/articles/${ page }`,
      publish: publishWhen
    }
  })

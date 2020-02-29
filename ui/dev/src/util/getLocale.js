export const getLocale = () => {
  if (navigator.languages && navigator.languages.length > 0) {
    return navigator.languages[0]
  } else {
    return navigator.userLanguages || navigator.language || navigator.browserLanguages || 'en-us'
  }
}

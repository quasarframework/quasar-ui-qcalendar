const Prism = require('prismjs')

module.exports = function (str, lang) {
  if (lang === '') {
    lang = 'js'
  } else if (lang === 'vue' || lang === 'html') {
    lang = 'html'
  }

  if (Prism.languages[lang] !== void 0) {
    const code = Prism.highlight(str, Prism.languages[lang], lang)

    return `<pre class="q-markdown--code">` +
      `<code class="q-markdown--code__inner language-${lang}">${code}</code>` +
      `</pre>`
  }

  return ''
}

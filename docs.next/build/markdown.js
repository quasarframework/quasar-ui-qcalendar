const markdownIt = require('markdown-it')
const Prism = require('prismjs')
const container = require('markdown-it-container')
const emoji = require('markdown-it-emoji')
const subscript = require('markdown-it-sub')
const superscript = require('markdown-it-sup')
const footnote = require('markdown-it-footnote')
const deflist = require('markdown-it-deflist')
const abbreviation = require('markdown-it-abbr')
const insert = require('markdown-it-ins')
const mark = require('markdown-it-mark')
const taskLists = require('markdown-it-task-lists')
const imsize = require('markdown-it-imsize')

// const fm = require('front-matter')

// function removeFrontMatter (source) {
//   return source.replace(/^---(.|\n)*?---\n/, '')
// }

// function replaceFrontMatter (source, content) {
//   return String(source).replace('frontMatter: {}', `frontMatter: ${JSON.stringify(content)}`)
// }

// function replaceToc (source, tocData) {
//   return String(source).replace('tocData: []', `tocData: ${JSON.stringify(tocData)}`)
// }

function slugify (str) {
  return encodeURIComponent(String(str).trim().replace(/\s+/g, '-'))
}

function highlight (str, lang) {
  if (lang === '') {
    lang = 'js'
  }
  else if (lang === 'vue' || lang === 'html') {
    lang = 'html'
  }

  if (Prism.languages[ lang ] !== undefined) {
    const code = Prism.highlight(str, Prism.languages[ lang ], lang)

    return '<pre class="q-markdown--code">'
      + `<code class="q-markdown--code__inner language-${ lang }">${ code }</code></pre>\n`
  }

  return ''
}

function extendToken (md) {
  const defaultRender = md.renderer.rules.code_inline

  md.renderer.rules.code_inline = (tokens, idx, options, env, self) => {
    const token = tokens[ idx ]

    token.attrSet('class', 'q-markdown--token')
    return defaultRender(tokens, idx, options, env, self)
  }
}

function extendTable (md) {
  md.renderer.rules.table_open = (tokens, idx, options, env, self) => {
    const token = tokens[ idx ]

    token.attrSet('class', 'q-markdown--table')

    return self.renderToken(tokens, idx, options)
  }
}

function extendLink (md) {
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    // const token = tokens[ idx ]

    // const hrefIndex = token.attrIndex('href')

    // if (token.attrs[ hrefIndex ][ 1 ][ 0 ] === '#') {
    //   if (location) {
    //     token.attrs[ hrefIndex ][ 1 ] = location.pathname + token.attrs[ hrefIndex ][ 1 ]
    //   }
    // }

    // if (token.attrs[ hrefIndex ][ 1 ] === '') {
    //   token.attrSet('class', 'q-markdown--link q-markdown--link-local')
    //   if (tokens[ idx + 1 ] && tokens[ idx + 1 ].type === 'text' && tokens[ idx + 1 ].content) {
    //     token.attrSet('id', slugify(tokens[ idx + 1 ].content))
    //   }
    // }
    // else if (token.attrs[ hrefIndex ][ 1 ][ 0 ] === '/'
    //   || token.attrs[ hrefIndex ][ 1 ].startsWith('..')) {
    //   token.attrSet('class', 'q-markdown--link q-markdown--link-local')
    // }
    // else {
    //   token.attrSet('class', 'q-markdown--link q-markdown--link-external')
    //   token.attrSet('target', '_blank')
    //   token.attrSet('rel', 'noopener')
    // }

    // return self.renderToken(tokens, idx, options)

    const token = tokens[ idx ]

    const hrefIndex = token.attrIndex('href')

    if (hrefIndex >= 0) {
      const link = token.attrs[ hrefIndex ]

      link[ 0 ] = 'to'
      link[ 1 ] = decodeURI(link[ 1 ])

      token.tag = 'markdown-link'
    }

    return self.renderToken(tokens, idx, options)
  }

  md.renderer.rules.link_close = (tokens, idx, options, env, self) => {
    const token = tokens[ idx ]

    token.tag = 'markdown-link'
    return self.renderToken(tokens, idx, options)
  }
}

function extendImage (md) {
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[ idx ]

    token.attrSet('class', 'q-markdown--image')
    return self.renderToken(tokens, idx, options)
  }
}

function extendHeading (md, tocData = [], toc = false, tocStart = 2, tocEnd = 3) {
  md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
    const token = tokens[ idx ]

    const label = tokens[ idx + 1 ]
      .children
      .reduce((acc, t) => acc + t.content, '')

    let classes = `q-markdown--heading q-markdown--heading-${ token.tag }`

    if (token.markup === '=') {
      classes += ' q-markdown--title-heavy'
    }
    else if (token.markup === '-') {
      classes += ' q-markdown--title-light'
    }

    const id = slugify(label)
    token.attrSet('id', id)
    token.attrSet('name', id)
    token.attrSet('class', classes)
    token.attrSet('@click', `copyHeading(\`${ id }\`)`)

    if (toc) {
      const tokenNumber = parseInt(token.tag[ 1 ])

      if (tocStart && tocEnd && tocStart < tocEnd && tokenNumber >= tocStart && tokenNumber <= tocEnd) {
        tocData.push({ id: id, label: label, level: tokenNumber, children: [] })
        // console.log(tocData)
      }
    }

    return self.renderToken(tokens, idx, options)
  }
}

function createContainer (className, defaultTitle) {
  return [
    container,
    className,
    {
      render (tokens, idx) {
        const token = tokens[ idx ]
        const info = token.info.trim().slice(className.length).trim()
        if (token.nesting === 1) {
          return `<div class="q-markdown--note q-markdown--note--${ className }"><p class="q-markdown--note-title">${ info || defaultTitle }</p>\n`
        }
        else {
          return '</div>\n'
        }
      }
    }
  ]
}

function extendContainers (md) {
  md.use(...createContainer('info', 'INFO'))
  md.use(...createContainer('tip', 'TIP'))
  md.use(...createContainer('warning', 'WARNING'))
  md.use(...createContainer('danger', 'IMPORTANT'))
  md.use(...createContainer('', ''))

  // explicitly escape Vue syntax
  md.use(container, 'v-pre', {
    render: (tokens, idx) => (tokens[ idx ].nesting === 1
      ? '<div v-pre>\n'
      : '</div>\n')
  })
}

function extendBlockQuote (md) {
  md.renderer.rules.blockquote_open = (tokens, idx, options, env, self) => {
    const token = tokens[ idx ]

    token.attrSet('class', 'q-markdown--note')
    return self.renderToken(tokens, idx, options)
  }
}

// function extendFenceLineNumbers (md) {
//   const fence = md.renderer.rules.fence
//   md.renderer.rules.fence = (...args) => {
//     const rawCode = fence(...args)
//     const code = rawCode.slice(
//       rawCode.indexOf('<code>') + 6,
//       rawCode.indexOf('</code>')
//     )

//     const lines = code.trim().split('\n')
//     if (lines.length < 3) {
//       return rawCode
//     }

//     const lineNumbersCode = [...Array(lines.length)]
//       .map((line, index) => `<span class="q-markup--line-number">${index + 1}</span><br>`).join('')

//     const lineNumbersWrapperCode =
//       `<div class="q-markdown--line-numbers non-selectable">${lineNumbersCode}</div><div class="q-markdown--code-wrapper">${rawCode}</div>`

//     const finalCode =
//       `<div class="q-markdown--line-numbers-wrapper">${lineNumbersWrapperCode}</div>`

//     return finalCode
//   }
// }

const opts = {
  html: true,
  linkify: true,
  typographer: false,
  breaks: true,
  highlight
}

const md = markdownIt(opts)
md.use(subscript)
md.use(superscript)
md.use(footnote)
md.use(deflist)
md.use(abbreviation)
md.use(insert)
md.use(mark)
md.use(emoji)
md.use(imsize)
md.use(taskLists, { enabled: true, label: true, labelAfter: true })

function render (source) {
  const tocData = []
  extendHeading(md, tocData, true)
  extendBlockQuote(md)
  extendImage(md)
  extendLink(md)
  extendTable(md)
  extendToken(md)
  extendContainers(md)
  // bug: this is causing numbers to show up twice
  // extendFenceLineNumbers(md)

  // const content = fm(source)
  // source = removeFrontMatter(source)
  const rendered = md.render(source)
  // rendered = replaceFrontMatter(rendered, content.attributes)
  // rendered = replaceToc(rendered, tocData)

  return { rendered, tocData }
}

module.exports = {
  render
}

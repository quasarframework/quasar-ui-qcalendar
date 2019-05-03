'use strict'

const
  highlight = require('./highlight'),
  MarkdownIt = require('markdown-it'),
  emoji = require('markdown-it-emoji'),
  subscript = require('markdown-it-sub'),
  superscript = require('markdown-it-sup'),
  footnote = require('markdown-it-footnote'),
  deflist = require('markdown-it-deflist'),
  abbreviation = require('markdown-it-abbr'),
  insert = require('markdown-it-ins'),
  mark = require('markdown-it-mark'),
  container = require('markdown-it-container'),
  taskLists = require('markdown-it-task-lists'),
  imsize = require('markdown-it-imsize')

// const loaderUtils = require("loader-utils")

// function slugify (str) {
//   return encodeURIComponent(String(str).trim().replace(/\s+/g, '-'))
// }

function extendBlockQuote (md) {
  md.renderer.rules.blockquote_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx]

    token.attrSet('class', 'q-markdown--note')
    return self.renderToken(tokens, idx, options)
  }
}

function extendHeading (md /* , tocData */) {
  md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx]

    const title = tokens[idx + 1]
      .children
      .reduce((acc, t) => acc + t.content, '')

    let classes = `q-markdown--heading-${token.tag}`

    if (token.markup === '=') {
      classes += ' q-markdown--title-heavy'
    } else if (token.markup === '-') {
      classes += ' q-markdown--title-light'
    }

    const id = this.__slugify(title)
    token.attrSet('id', id)
    token.attrSet('class', classes)

    // if (this.toc) {
    //   const tokenNumber = parseInt(token.tag[1])
    //   tocData.push({ id: id, title: title, level: tokenNumber })
    // }

    return self.renderToken(tokens, idx, options)
  }
}

function extendImage (md) {
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx]

    token.attrSet('class', 'q-markdown--image')
    return self.renderToken(tokens, idx, options)
  }
}

function extendTable (md) {
  md.renderer.rules.table_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx]

    token.attrSet('class', 'q-markdown--table')

    return self.renderToken(tokens, idx, options)
  }
}

function extendLink (md) {
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx]

    const hrefIndex = token.attrIndex('href')
    if (token.attrs[hrefIndex][1][0] === '/') {
      token.attrSet('class', 'q-markdown--link q-markdown--link-local')
    } else {
      token.attrSet('class', 'q-markdown--link q-markdown--link-external')
      token.attrSet('target', '_blank')
    }

    return self.renderToken(tokens, idx, options)
  }
}

function extendToken (md) {
  const defaultRender = md.renderer.rules.code_inline

  md.renderer.rules.code_inline = (tokens, idx, options, env, self) => {
    const token = tokens[idx]

    token.attrSet('class', 'q-markdown--token')
    return defaultRender(tokens, idx, options, env, self)
  }
}

function createContainer (className, defaultTitle) {
  return [
    container,
    className,
    {
      render (tokens, idx) {
        const token = tokens[idx]
        const info = token.info.trim().slice(className.length).trim()
        if (token.nesting === 1) {
          return `<div class="q-markdown--note q-markdown--note--${className}"><p class="q-markdown--note-title">${info || defaultTitle}</p>\n`
        } else {
          return `</div>\n`
        }
      }
    }
  ]
}

function extendContainers (md) {
  md
    .use(...createContainer('info', 'INFO'))
    .use(...createContainer('tip', 'TIP'))
    .use(...createContainer('warning', 'WARNING'))
    .use(...createContainer('danger', 'IMPORTANT'))
    .use(...createContainer('', ''))

    // explicitly escape Vue syntax
    .use(container, 'v-pre', {
      render: (tokens, idx) => tokens[idx].nesting === 1
        ? `<div v-pre>\n`
        : `</div>\n`
    })
}

module.exports = function (markdown) {
  console.log('md-loader called:', markdown)
  // merge params and default config
  // const options = loaderUtils.getOptions(this)

  const opts = {
    html: true,
    linkify: true,
    typographer: true,
    breaks: true,
    highlight
  }

  const md = MarkdownIt(opts)
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

  extendBlockQuote(md)
  extendHeading(md)
  extendImage(md)
  extendLink(md)
  extendTable(md)
  extendToken(md)
  extendContainers(md)

  this.cacheable()

  const output = md.render(markdown)
  let result = '<template><div>' + output + '</div></template>\n'
  console.log(result)
  return result
}

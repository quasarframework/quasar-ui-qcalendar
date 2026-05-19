/**
 * Sanitizer which filters a set of whitelisted tags, attributes and css.
 * For now, the whitelist is small but can be easily extended.
 */
function HtmlWhitelistedSanitizer(escape, tags, css, urls) {
  this.escape = escape
  this.allowedTags = tags
  this.allowedCss = css
  this.doc = document.implementation.createHTMLDocument()

  if (urls === undefined) {
    urls = ['http://', 'https://']
  }

  if (this.allowedTags === undefined) {
    const unconstrained = function (value) {
      return value
    }
    const globalAttributes = {
      dir: unconstrained,
      lang: unconstrained,
      title: unconstrained,
    }
    const urlSanitizer = HtmlWhitelistedSanitizer.makeUrlSanitizer(urls)
    this.allowedTags = {
      a: HtmlWhitelistedSanitizer.mergeMap(globalAttributes, {
        download: unconstrained,
        href: urlSanitizer,
        hreflang: unconstrained,
        ping: urlSanitizer,
        rel: unconstrained,
        target: unconstrained,
        type: unconstrained,
      }),
      img: HtmlWhitelistedSanitizer.mergeMap(globalAttributes, {
        alt: unconstrained,
        height: unconstrained,
        src: urlSanitizer,
        width: unconstrained,
      }),
      p: globalAttributes,
      div: globalAttributes,
      span: globalAttributes,
      br: globalAttributes,
      b: globalAttributes,
      i: globalAttributes,
      u: globalAttributes,
    }
  }

  if (this.allowedCss === undefined) {
    this.allowedCss = ['border', 'margin', 'padding']
  }
}

HtmlWhitelistedSanitizer.makeUrlSanitizer = function (allowedUrls) {
  return function (str) {
    if (!str) {
      return ''
    }

    for (const url of allowedUrls) {
      if (str.startsWith(url)) {
        return str
      }
    }

    return ''
  }
}

HtmlWhitelistedSanitizer.mergeMap = function (...maps) {
  const result = {}

  for (const map of maps) {
    Object.assign(result, map)
  }

  return result
}

HtmlWhitelistedSanitizer.prototype.sanitizeString = function (input) {
  const div = this.doc.createElement('div')
  div.innerHTML = input

  return this.sanitizeNode(div).innerHTML
}

HtmlWhitelistedSanitizer.prototype.sanitizeNode = function (node) {
  const nodeName = node.nodeName.toLowerCase()

  if (nodeName === '#text') {
    return node
  }

  if (nodeName === '#comment') {
    return this.doc.createTextNode('')
  }

  if (this.allowedTags[nodeName] === undefined) {
    return this.escape ? this.doc.createTextNode(node.outerHTML) : this.doc.createTextNode('')
  }

  const copy = this.doc.createElement(nodeName)

  for (let nAttr = 0; nAttr < node.attributes.length; nAttr++) {
    const attr = node.attributes.item(nAttr).name

    if (this.allowedTags[nodeName][attr] !== undefined) {
      const sanitizer = this.allowedTags[nodeName][attr]
      copy.setAttribute(attr, sanitizer(node.getAttribute(attr)))
    }
  }

  for (const css of this.allowedCss) {
    copy.style[css] = node.style[css]
  }

  while (node.childNodes.length > 0) {
    const child = node.removeChild(node.childNodes[0])
    copy.appendChild(this.sanitizeNode(child))
  }

  return copy
}

export default function runSanitizer(html) {
  const parser = new HtmlWhitelistedSanitizer(true)

  return parser.sanitizeString(html)
}

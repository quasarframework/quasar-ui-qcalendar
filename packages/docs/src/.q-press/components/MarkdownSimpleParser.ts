export interface MarkdownSimpleParserClasses {
  blockquote: string
  codeBlock: string
  container: string
  containerTitle: string
  heading: string
  inlineCode: string
  link: string
  list: string
  nestedListItem: string
  rule: string
  table: string
}

export interface MarkdownSimpleParserOptions {
  classes?: Partial<MarkdownSimpleParserClasses>
  highlightClass?: string
  issueUrl?: string | ((issueNumber: string) => string)
  sanitize?: (value: string) => string
  search?: string
}

const defaultClasses: MarkdownSimpleParserClasses = {
  blockquote: 'markdown-simple__blockquote',
  codeBlock: 'markdown-code markdown-simple__code',
  container: 'markdown-simple__container',
  containerTitle: 'markdown-simple__container-title',
  heading: 'markdown-simple__heading',
  inlineCode: 'markdown-token',
  link: 'markdown-link',
  list: 'markdown-simple__list',
  nestedListItem: 'q-pl-md',
  rule: 'markdown-simple__rule',
  table:
    'q-markup-table q-table__container q-table__card ' +
    'q-table--horizontal-separator q-table--flat q-table--bordered ' +
    'q-table--no-wrap q-table--dense',
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function escapeHtmlAttribute(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

function splitTableRow(row: string): string[] {
  return row
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((col) => col.trim())
}

function isTableSeparator(row: string): boolean {
  const columns = splitTableRow(row)

  return columns.length > 0 && columns.every((col) => /^:?-{3,}:?$/.test(col))
}

export class MarkdownSimpleParser {
  private readonly classes: MarkdownSimpleParserClasses

  constructor(private readonly options: MarkdownSimpleParserOptions = {}) {
    this.classes = {
      ...defaultClasses,
      ...options.classes,
    }
  }

  parse(body: string): string {
    let content = `${this.options.sanitize?.(body) ?? body}\n`
    const codeBlocks: string[] = []

    content = this.stashCodeBlocks(content, codeBlocks)
    content = this.parseContainerBlocks(content)

    if (this.options.search !== undefined && this.options.search !== '') {
      content = content.replace(
        new RegExp(`(${escapeRegExp(this.options.search)})`, 'gi'),
        `<span class="${this.options.highlightClass ?? 'bg-accent text-white'}">$1</span>`,
      )
    }

    content = content
      .replace(/^### ([^\n]+)/gm, `<div class="${this.classes.heading} text-h6">$1</div>`)
      .replace(/^## ([^\n]+)/gm, `<div class="${this.classes.heading} text-h5">$1</div>`)
      .replace(/^# ([^\n]+)/gm, `<div class="${this.classes.heading} text-h4">$1</div>`)
      .replace(/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/gm, `<hr class="${this.classes.rule}">`)
      .replace(/\*\*([\S ]*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([\S ]*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, `<code class="${this.classes.inlineCode}">$1</code>`)
      .replace(/#([\d]+)/g, (_match, issueNumber: string) => {
        const href = this.getIssueUrl(issueNumber)
        return href !== undefined ? this.createExternalLink(href, `#${issueNumber}`) : `#${issueNumber}`
      })
      .replace(/^&gt; ([\S ]+)$/gm, `<div class="${this.classes.blockquote}">$1</div>`)
      .replace(/\[([\S ]*?)\]\((\S*?)\)/g, (_match, label: string, href: string) =>
        this.createExternalLink(href, label),
      )

    content = this.parseTableBlocks(content)

    content = content
      .replace(
        /^ {2}[-*] ([^\n]+)$/gm,
        `<li class="${this.classes.nestedListItem}">$1</li>`,
      )
      .replace(/^[-*] ([^\n]+)$/gm, '<li>$1</li>')
      .replace(/<\/li>[\s\n\r]*<li/g, '</li><li')
      .replace(/(<li(?: class="[^"]*")?>.*?<\/li>)+/g, `<ul class="${this.classes.list}">$&</ul>`)
      .replace(/\n/g, '<br>')

    content = this.restoreCodeBlocks(content, codeBlocks)
    content = this.trimStructuralBreaks(content)
    content = this.autoLinkBareUrls(content)

    return content
  }

  private autoLinkBareUrls(content: string): string {
    return content
      .split(/(<a\b[^>]*>.*?<\/a>|<pre\b[^>]*>.*?<\/pre>|<code\b[^>]*>.*?<\/code>)/gis)
      .map((part) => {
        if (/^<(?:a|pre|code)\b/i.test(part)) {
          return part
        }

        return part.replace(
          /(^|[\s>])((?:https?:\/\/)[^\s<]+?)([),.;:!?]*)(?=$|\s|<)/g,
          (_match, prefix: string, url: string, trailing: string) =>
            `${prefix}${this.createExternalLink(url, url)}${trailing}`,
        )
      })
      .join('')
  }

  private createExternalLink(href: string, label: string): string {
    if (!/^https?:\/\//.test(href)) {
      return label
    }

    return `<a class="${this.classes.link}" href="${escapeHtmlAttribute(
      href,
    )}" target="_blank" rel="noopener noreferrer">${label}</a>`
  }

  private getIssueUrl(issueNumber: string): string | undefined {
    if (this.options.issueUrl === undefined) {
      return undefined
    }

    return typeof this.options.issueUrl === 'function'
      ? this.options.issueUrl(issueNumber)
      : `${this.options.issueUrl.replace(/\/$/, '')}/issues/${issueNumber}`
  }

  private getTable(rows: string[]): string {
    const header = splitTableRow(rows[0] ?? '')
      .map((col) => `<th class="text-left">${col}</th>`)
      .join('')

    const body = rows
      .slice(2)
      .map(
        (row) =>
          '<tr>' +
          splitTableRow(row)
            .map((col) => `<td>${col}</td>`)
            .join('') +
          '</tr>',
      )
      .join('')

    return (
      `<div class="${this.classes.table}">` +
      `<table class="q-table"><thead>${header}</thead>` +
      `<tbody>${body}</tbody></table></div>`
    )
  }

  private parseContainerBlocks(content: string): string {
    return content
      .replace(
        /^:{3,}\s+([A-Za-z][\w-]*)(?:\s+([^\n]+))?$/gm,
        (_match, type: string, title: string | undefined) => {
          const normalizedType = type.toLowerCase()
          const containerTitle =
            title !== undefined && title.trim() !== ''
              ? `<div class="${this.classes.containerTitle}">${title.trim()}</div>`
              : ''

          return `<div class="${this.classes.container} ${this.classes.container}--${normalizedType}">${containerTitle}`
        },
      )
      .replace(/^:{3,}\s*$/gm, '</div>')
  }

  private parseTableBlocks(content: string): string {
    return content.replace(/((?:^[^\n|]*\|[^\n]*$\n?){2,})/gm, (block: string) => {
      const rows = block.trimEnd().split('\n')

      if (rows.length < 2 || isTableSeparator(rows[1] ?? '') === false) {
        return block
      }

      return `${this.getTable(rows)}\n`
    })
  }

  private restoreCodeBlocks(content: string, codeBlocks: string[]): string {
    return content.replace(/@@Q_PRESS_SIMPLE_CODE_BLOCK_(\d+)@@/g, (_match, index: string) => {
      return codeBlocks[Number(index)] ?? ''
    })
  }

  private stashCodeBlocks(content: string, codeBlocks: string[]): string {
    return content.replace(/```[^\n]*\n([\s\S]*?)```/g, (_match, code: string) => {
      const index = codeBlocks.length

      codeBlocks.push(`<pre class="${this.classes.codeBlock}"><code>${code.trimEnd()}</code></pre>`)

      return `@@Q_PRESS_SIMPLE_CODE_BLOCK_${index}@@`
    })
  }

  private trimStructuralBreaks(content: string): string {
    const blockStartPattern = [
      `<div class="${this.classes.heading}`,
      `<div class="${this.classes.blockquote}`,
      `<div class="${this.classes.container}`,
      `<ul class="${this.classes.list}"`,
      `<pre class="${this.classes.codeBlock}"`,
      `<hr class="${this.classes.rule}">`,
      `<div class="${this.classes.table}`,
    ]
      .map(escapeRegExp)
      .join('|')

    return content
      .replace(new RegExp(`(?:<br>)+(?=${blockStartPattern})`, 'g'), '')
      .replace(
        new RegExp(
          `(<\\/(?:div|ul|pre)>|<hr class="${escapeRegExp(this.classes.rule)}">)(?:<br>)+`,
          'g',
        ),
        '$1',
      )
      .replace(/(?:<br>)+(<\/div>)/g, '$1')
      .replace(/(?:<br>\s*){2,}/g, '<br>')
      .replace(/(?:<br>)+$/g, '')
  }
}

export function parseMarkdownSimple(body: string, options?: MarkdownSimpleParserOptions): string {
  return new MarkdownSimpleParser(options).parse(body)
}

import { createHighlighterCoreSync } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import htmlLang from 'shiki/langs/html.mjs'
import javascriptLang from 'shiki/langs/javascript.mjs'
import vueLang from 'shiki/langs/vue.mjs'
import githubDark from 'shiki/themes/github-dark.mjs'
import githubLight from 'shiki/themes/github-light.mjs'

interface HighlightedBlock {
  /**
   * CSS classes copied from the highlighted Shiki pre element.
   */
  className: string

  /**
   * Highlighted HTML code content inside the pre/code wrapper.
   */
  code: string

  /**
   * Inline style copied from the highlighted Shiki pre element.
   */
  style: string
}

// Shiki highlighters are expensive and should be shared across all MarkdownCode instances.
const highlighter = createHighlighterCoreSync({
  engine: createJavaScriptRegexEngine(),
  themes: [githubLight, githubDark],
  langs: [htmlLang, javascriptLang, vueLang].flat(),
  langAlias: {
    bash: 'javascript',
    css: 'html',
    js: 'javascript',
    markup: 'vue',
    sass: 'html',
    scss: 'html',
    sh: 'javascript',
    shell: 'javascript',
    ts: 'javascript',
  },
})

/**
 * Highlights a fenced code block with the shared Shiki highlighter.
 *
 * @param code - Source code to highlight.
 * @param lang - Requested Markdown fence language.
 * @returns Highlighted HTML with light and dark theme tokens.
 */
export function highlightCode(code: string, lang: string): string {
  const options = {
    lang: normalizeLang(lang),
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
    defaultColor: false,
  } as const

  try {
    return highlighter.codeToHtml(code, options)
  } catch {
    return highlighter.codeToHtml(code, {
      ...options,
      lang: 'text',
    })
  }
}

/**
 * Extracts reusable render details from Shiki's pre/code HTML wrapper.
 *
 * @param html - Highlighted HTML returned by Shiki.
 * @returns Parsed classes, inline style, and highlighted code content.
 */
export function parseHighlightedBlock(html: string): HighlightedBlock {
  const match = html.match(/^<pre(?<attrs>[^>]*)><code>(?<code>[\s\S]*)<\/code><\/pre>$/)
  const attrs = match?.groups?.attrs ?? ''

  return {
    className: attrs.match(/class="(?<value>[^"]*)"/)?.groups?.value ?? 'shiki',
    code: match?.groups?.code ?? '',
    style: attrs.match(/style="(?<value>[^"]*)"/)?.groups?.value ?? '',
  }
}

/**
 * Normalizes Markdown fence language aliases for Shiki.
 *
 * @param lang - Markdown fence language.
 * @returns Shiki language identifier.
 */
function normalizeLang(lang: string): string {
  return (
    {
      js: 'javascript',
      markup: 'html',
      ts: 'typescript',
    }[lang] ?? lang
  )
}

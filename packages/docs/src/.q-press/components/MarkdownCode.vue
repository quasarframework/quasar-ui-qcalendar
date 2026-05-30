<template>
  <div class="relative-position markdown-copybtn-hover">
    <pre class="markdown-code" :class="block.className" :style="[style, block.style]"><code v-html="block.code"></code></pre>
    <MarkdownCopyButton />
  </div>
</template>

<script setup lang="ts">
import { createHighlighterCoreSync } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import htmlLang from 'shiki/langs/html.mjs'
import javascriptLang from 'shiki/langs/javascript.mjs'
import vueLang from 'shiki/langs/vue.mjs'
import githubDark from 'shiki/themes/github-dark.mjs'
import githubLight from 'shiki/themes/github-light.mjs'
import { computed } from 'vue'

import MarkdownCopyButton from './MarkdownCopyButton.vue'

const props = defineProps({
  code: {
    type: String,
    required: true,
  },
  maxHeight: {
    type: String,
    default: void 0,
  },

  lang: {
    type: String,
    default: 'js',
  },
})

const style = computed(() => (props.maxHeight !== void 0 ? { maxHeight: props.maxHeight } : null))

const block = computed(() => {
  return parseHighlightedBlock(highlightCode(props.code, props.lang))
})

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

function highlightCode(code: string, lang: string): string {
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

function normalizeLang(lang: string): string {
  return (
    {
      js: 'javascript',
      markup: 'html',
      ts: 'typescript',
    }[lang] ?? lang
  )
}

function parseHighlightedBlock(html: string): { className: string; code: string; style: string } {
  const match = html.match(/^<pre(?<attrs>[^>]*)><code>(?<code>[\s\S]*)<\/code><\/pre>$/)
  const attrs = match?.groups?.attrs ?? ''

  return {
    className: attrs.match(/class="(?<value>[^"]*)"/)?.groups?.value ?? 'shiki',
    code: match?.groups?.code ?? '',
    style: attrs.match(/style="(?<value>[^"]*)"/)?.groups?.value ?? '',
  }
}
</script>

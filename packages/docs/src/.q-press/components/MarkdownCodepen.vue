<template>
  <form
    ref="formRef"
    method="post"
    action="https://codepen.io/pen/define/"
    target="_blank"
    rel="noopener"
    class="hidden"
  >
    <input v-if="active" type="hidden" name="data" :value="options" />
  </form>
</template>

<script setup lang="ts">
import { Quasar } from 'quasar'
import { ref, reactive, computed, nextTick } from 'vue'

import siteConfig from '../../siteConfig'
import { slugify } from './markdown-utils'

type CodepenParts = {
  Template?: string
  Script?: string
  Style?: string
  [key: string]: string | undefined
}

type CodepenGlobalPackage = {
  packageName: string
  globalName: string
}

type CodepenModulePackage = {
  packageName: string
  importUrl: string
}

const defaultCssResources = [
  'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons',
  `https://cdn.jsdelivr.net/npm/quasar@${Quasar.version}/dist/quasar.min.css`,
]

const defaultJsResources = [
  'https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js',
  `https://cdn.jsdelivr.net/npm/quasar@${Quasar.version}/dist/quasar.umd.prod.js`,
]

function getAbsolutePublicUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return typeof location === 'undefined' ? normalizedPath : `${location.origin}${normalizedPath}`
}

function rewriteRootRelativeUrls(content: string) {
  return content
    .replace(
      /\b(src|href|poster)=("|')\/(?!\/)([^"']*)\2/g,
      (_match: string, attr: string, quote: string, path: string) =>
        `${attr}=${quote}${getAbsolutePublicUrl(path)}${quote}`,
    )
    .replace(
      /url\(\s*(["']?)\/(?!\/)([^"')]+)\1\s*\)/g,
      (_match: string, quote: string, path: string) =>
        `url(${quote}${getAbsolutePublicUrl(path)}${quote})`,
    )
}

function indent(code: string, spaces = 2) {
  const padding = ' '.repeat(spaces)
  let isInsideTemplateLiteral = false

  return code
    .split('\n')
    .map((line) => {
      const shouldIndent = line.trim().length > 0 && isInsideTemplateLiteral === false

      for (let index = 0; index < line.length; index++) {
        if (line[index] !== '`') {
          continue
        }

        let escapeCount = 0

        for (let escapeIndex = index - 1; escapeIndex >= 0 && line[escapeIndex] === '\\'; escapeIndex--) {
          escapeCount++
        }

        if (escapeCount % 2 === 0) {
          isInsideTemplateLiteral = !isInsideTemplateLiteral
        }
      }

      return shouldIndent ? padding + line : line
    })
    .join('\n')
}

function getImportParts(content: string, packageName: string) {
  const parts: { importName: string; bindingName: string }[] = []
  const escapedPackageName = packageName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const importRe = new RegExp(
    `import\\s+(?!type\\b){([^}]*)}\\s+from\\s+['"]${escapedPackageName}['"];?`,
    'g',
  )
  let match: RegExpExecArray | null

  while ((match = importRe.exec(content)) !== null) {
    for (const part of (match[1] ?? '').split(',')) {
      const rawName = part.trim()

      if (rawName.length === 0 || rawName.startsWith('type ')) {
        continue
      }

      const [importName, bindingName = importName] = rawName.split(/\s+as\s+/)

      if (importName !== undefined && importName.length > 0) {
        parts.push({
          importName,
          bindingName,
        })
      }
    }
  }

  return parts
}

function getImportNames(content: string, packageName: string) {
  return [
    ...new Set(
      getImportParts(content, packageName).map(({ importName, bindingName }) =>
        importName === bindingName ? importName : `${importName}: ${bindingName}`,
      ),
    ),
  ]
}

function getImportBindingNames(content: string, packageName: string) {
  return [...new Set(getImportParts(content, packageName).map(({ bindingName }) => bindingName))]
}

function getGlobalPackageImportLines(content: string) {
  return (siteConfig.codepen?.globalPackages ?? [])
    .map(({ packageName, globalName }: CodepenGlobalPackage) => {
      const imports = getImportNames(content, packageName)

      return imports.length > 0 ? `const { ${imports.join(', ')} } = ${globalName}` : ''
    })
    .filter((line) => line.length > 0)
}

function getGlobalImportLines(content: string) {
  const vueImports = getImportNames(content, 'vue')
  const quasarImports = getImportNames(content, 'quasar')

  return [
    vueImports.length > 0 ? `const { ${vueImports.join(', ')} } = Vue` : '',
    quasarImports.length > 0 ? `const { ${quasarImports.join(', ')} } = Quasar` : '',
    ...getGlobalPackageImportLines(content),
  ].filter((line) => line.length > 0)
}

function getGlobalImportBindingNames(content: string) {
  return [
    ...getImportBindingNames(content, 'vue'),
    ...getImportBindingNames(content, 'quasar'),
    ...(siteConfig.codepen?.globalPackages ?? []).flatMap(({ packageName }: CodepenGlobalPackage) =>
      getImportBindingNames(content, packageName),
    ),
  ]
}

function getModulePackageImportLines(content: string) {
  return (siteConfig.codepen?.modulePackages ?? [])
    .flatMap(({ packageName, importUrl }: CodepenModulePackage) => {
      const escapedPackageName = packageName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const importRe = new RegExp(
        `^\\s*import\\s+([\\s\\S]*?\\s+from\\s+)['"]${escapedPackageName}['"];?\\s*$`,
        'gm',
      )
      const imports: string[] = []
      let match: RegExpExecArray | null

      while ((match = importRe.exec(content)) !== null) {
        imports.push(`import ${match[1]}'${importUrl}'`)
      }

      return imports
    })
    .filter((line) => line.length > 0)
}

function stripImports(content: string) {
  return content
    .replace(/^\s*import\s+type\s+[\s\S]*?\s+from\s+['"][^'"]+['"];?\s*$/gm, '')
    .replace(/^\s*import\s+[\s\S]*?\s+from\s+['"][^'"]+['"];?\s*$/gm, '')
    .replace(/^\s*import\s+['"][^'"]+['"];?\s*$/gm, '')
    .trim()
}

function stripCompilerMacros(content: string) {
  return content
    .replace(/^\s*defineOptions\(\s*\{[\s\S]*?\}\s*\)\s*;?\s*$/gm, '')
    .replace(/^\s*defineExpose\(\s*\{[\s\S]*?\}\s*\)\s*;?\s*$/gm, '')
    .trim()
}

function stripTemplateTypeScriptAssertions(content: string) {
  return content.replace(/(\]|\)|[\w$])!(?=\.|\[|\()/g, '$1')
}

function getScriptBlock(script: string, setup: boolean) {
  const re = setup
    ? /<script\s+setup([^>]*)>([\s\S]*?)<\/script>/
    : /<script(?!\s+setup)([^>]*)>([\s\S]*?)<\/script>/
  const match = re.exec(script)

  return {
    attrs: match?.[1] ?? '',
    content: match?.[2] ?? '',
  }
}

function getSetupReturnNames(content: string) {
  const names = new Set<string>()
  const topLevelContent = getTopLevelContent(content)
  const declarationRe =
    /(?:^|\n)\s*(?:const|let|var)\s+([\s\S]*?)(?=\n\s*(?:const|let|var|function|interface|type|class)\s+|\s*$)/g
  const variableNameRe = /(?:^|\n)\s*([A-Za-z_$][\w$]*)\s*(?:[:=,]|$)/g
  const functionRe = /(?:^|\n)\s*(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/g
  let match: RegExpExecArray | null

  while ((match = declarationRe.exec(topLevelContent)) !== null) {
    let variableMatch: RegExpExecArray | null

    while ((variableMatch = variableNameRe.exec(match[1] ?? '')) !== null) {
      if (variableMatch[1] !== undefined) {
        names.add(variableMatch[1])
      }
    }
  }

  while ((match = functionRe.exec(topLevelContent)) !== null) {
    if (match[1] !== undefined) {
      names.add(match[1])
    }
  }

  return [...names]
}

function getTopLevelContent(content: string) {
  let depth = 0
  let output = ''
  let quote: "'" | '"' | '`' | null = null
  let escaped = false
  let comment: 'line' | 'block' | null = null

  for (let index = 0; index < content.length; index++) {
    const char = content[index] ?? ''
    const next = content[index + 1]

    if (comment === 'line') {
      if (char === '\n') {
        output += char
        comment = null
      } else {
        output += ' '
      }
      continue
    }

    if (comment === 'block') {
      if (char === '\n') {
        output += char
      } else {
        output += ' '
      }

      if (char === '*' && next === '/') {
        output += ' '
        index++
        comment = null
      }
      continue
    }

    if (quote !== null) {
      output += char === '\n' ? char : ' '

      if (escaped === true) {
        escaped = false
        continue
      }

      if (char === '\\') {
        escaped = true
      } else if (char === quote) {
        quote = null
      }
      continue
    }

    if (char === '/' && next === '/') {
      output += '  '
      index++
      comment = 'line'
      continue
    }

    if (char === '/' && next === '*') {
      output += '  '
      index++
      comment = 'block'
      continue
    }

    if (char === "'" || char === '"' || char === '`') {
      output += ' '
      quote = char
      escaped = false
      continue
    }

    if (depth === 0 || char === '\n') {
      output += char
    } else {
      output += ' '
    }

    if (char === '{') {
      depth++
    } else if (char === '}') {
      depth = Math.max(0, depth - 1)
    }
  }

  return output
}

function getAppSetup() {
  return ['app.use(Quasar, { config: {} })', siteConfig.codepen?.jsSetup ?? '']
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n')
}

function createSetupScript(script: string) {
  const { content } = getScriptBlock(script, true)
  const moduleImports = getModulePackageImportLines(content)
  const globalImports = getGlobalImportLines(content)
  const setupContent = stripCompilerMacros(stripImports(content))
  const returnNames = [
    ...new Set([...getGlobalImportBindingNames(content), ...getSetupReturnNames(setupContent)]),
  ]
  const setupBody = [
    setupContent.length > 0 ? indent(setupContent, 4) : '',
    returnNames.length > 0 ? `    return { ${returnNames.join(', ')} }` : '',
  ]
    .filter((line) => line.length > 0)
    .join('\n\n')

  return [
    ...moduleImports,
    ...globalImports,
    `const app = Vue.createApp({
  setup () {
${setupBody}
  }
})`,
    getAppSetup(),
    "app.mount('#q-app')",
  ].join('\n\n')
}

function createOptionsScript(script: string) {
  const { content } = getScriptBlock(script, false)
  const moduleImports = getModulePackageImportLines(content)
  const globalImports = getGlobalImportLines(content)
  const match = /export\s+default\s+{([\s\S]*)}/.exec(content)
  const beforeDefault = match === null ? stripImports(content) : stripImports(content.slice(0, match.index))
  let component = match?.[1]?.trim() ?? ''

  if (component.length > 0) {
    component = '\n  ' + component + '\n'
  }

  return [
    ...moduleImports,
    ...globalImports,
    beforeDefault,
    `const app = Vue.createApp({${component}})`,
    getAppSetup(),
    "app.mount('#q-app')",
  ]
    .filter((line) => line.length > 0)
    .join('\n\n')
}

const props = defineProps({ title: { type: String, required: true } })

const active = ref(false)
const formRef = ref<HTMLFormElement | null>(null)
const def = reactive<{ parts: CodepenParts }>({ parts: {} })

const cssResources = computed(() => {
  return [...defaultCssResources, ...(siteConfig.codepen?.cssExternal ?? [])].join(';')
})

const jsResources = computed(() => {
  return [...defaultJsResources, ...(siteConfig.codepen?.jsExternal ?? [])].join(';')
})

const css = computed(() => {
  return rewriteRootRelativeUrls((def.parts.Style || '').replace(/(<style.*?>|<\/style>)/g, '').trim())
})

const cssPreprocessor = computed(() => {
  const lang = /<style.*lang=["'](.*)["'].*>/.exec(def.parts.Style || '')

  return lang ? lang[1] : 'none'
})

const js = computed(() => {
  const script = def.parts.Script ?? ''

  return script.includes('<script setup') === true
    ? createSetupScript(script)
    : createOptionsScript(script)
})

const jsPreProcessor = computed(() => {
  const setupBlock = getScriptBlock(def.parts.Script ?? '', true)
  const optionsBlock = getScriptBlock(def.parts.Script ?? '', false)
  const attrs = setupBlock.content.length > 0 ? setupBlock.attrs : optionsBlock.attrs

  return siteConfig.codepen?.jsPreProcessor ?? (/lang=["']ts["']/.test(attrs) ? 'typescript' : 'babel')
})

const jsModule = computed(() => {
  return /^\s*import\s/m.test(js.value)
})

const html = computed(() => {
  const content = (def.parts.Template || '')
    .replace(/(<template>|<\/template>$)/g, '')
    .replace(/\n/g, '\n  ')
    .replace(/([\w]+=")([^"]*?)(")/g, function (match, p1, p2, p3) {
      return p1 + p2.replace(/>/g, '___TEMP_REPLACEMENT___') + p3
    })
    .replace(
      /<([A-Z][\w-]*|[a-z][\w]*-[\w-]+|div)([^>]*?)\s*?([\n\r][\t ]+)?\/>/gs,
      '<$1$2$3></$1>',
    )
    .replace(
      /(<template[^>]*>)(\s*?(?:[\n\r][\t ]+)?)<(thead|tbody|tfoot)/gs,
      '$1$2<___PREVENT_TEMPLATE___$3',
    )
    .replace(/<(thead|tbody|tfoot)(.*?)[\n\r]?(\s*)<\/\1>/gs, function (match, p1, p2, p3) {
      return (
        '<template>\n' +
        p3 +
        '  <' +
        p1 +
        p2.split(/[\n\r]+/g).join('\n  ') +
        '\n' +
        p3 +
        '  </' +
        p1 +
        '>\n' +
        p3 +
        '</template>'
      )
    })
    .replace(/___PREVENT_TEMPLATE___/g, '')
    .replace(/___TEMP_REPLACEMENT___/g, '>')
    .replace(/^\s{2}/gm, '')
    .trim()

  return rewriteRootRelativeUrls(stripTemplateTypeScriptAssertions(content))
})

const editors = computed(() => {
  const flag =
    (html.value.length > 0 ? 0b100 : 0) |
    (css.value.length > 0 ? 0b010 : 0) |
    (js.value.length > 0 ? 0b001 : 0)
  return flag.toString(2)
})

const computedTitle = computed(() => {
  const titleSuffix = siteConfig.codepen?.titleSuffix ?? `Quasar v${Quasar.version}`

  return (
    (typeof document !== 'undefined' ? document.title.split(' | ')[0] + ': ' : '') +
    (props.title ? props.title + ' - ' : '') +
    titleSuffix
  )
})

const slugifiedTitle = computed(() => {
  return slugify('example-' + props.title)
})

/**
 * Computed property that returns the options for the component.
 * This property is reactive and will update whenever its dependencies change.
 *
 * @returns {Object} The options object for the component.
 */
const options = computed(() => {
  const data = {
    title: computedTitle.value,
    html: `<!--
Forked from:
${location.origin + location.pathname}#${slugifiedTitle.value}
-->
<div id="q-app" style="min-height: 100vh;">
${html.value}
</div>`,
    html_pre_processor: 'none',
    css: css.value,
    css_pre_processor: cssPreprocessor.value,
    css_external: cssResources.value,
    js: js.value,
    js_pre_processor: jsPreProcessor.value,
    ...(jsModule.value ? { js_module: true } : {}),
    js_external: jsResources.value,
    head: siteConfig.codepen?.head ?? '',
    editors: editors.value,
  }
  return JSON.stringify(data)
})

/**
 * Opens a specific part of the application.
 *
 * @param {string} whichParts - The parts of the application to open.
 */
function open(whichParts: CodepenParts) {
  def.parts = whichParts

  if (active.value) {
    formRef.value?.submit()
    return
  }

  active.value = true

  nextTick(() => {
    formRef.value?.submit()
  })
}

defineExpose({ open })
</script>

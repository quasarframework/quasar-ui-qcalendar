---
title: Frequently Asked Questions
desc: Common questions and answers about Markdown Plugins.
---

## General Questions

:::details Q. What are Markdown Plugins?

Markdown Plugins are tools that extend the functionality of Markdown, allowing you to add custom syntax, enhanced components, and custom styling to your Markdown documents. They help improve the accessibility, styling, and interactivity of your content.

:::

:::details Q. How do I install Markdown Plugins?

You can install Markdown Plugins using pnpm, yarn, npm, or bun:

```tabs
<<| bash pnpm |>>
pnpm add @md-plugins/vite-md-plugin
<<| bash Bun |>>
bun add @md-plugins/vite-md-plugin
<<| bash Yarn |>>
yarn add @md-plugins/vite-md-plugin
<<| bash npm |>>
npm install @md-plugins/vite-md-plugin
```

Refer to the **Installation** section of each plugin's documentation for detailed instructions.

:::

:::details Q. How do I configure Markdown Plugins?

Configuration varies depending on the plugin. Generally, you will need to import the plugin and use it with your Markdown processor (e.g., MarkdownIt). Refer to the **Configuration** section of each plugin's documentation for detailed instructions.

:::

## Plugin-Specific Questions

:::details Q. How do I add custom classes to images?

You can use the `image` plugin to add custom classes to images. Here is an example configuration:

```typescript
import MarkdownIt from 'markdown-it'
import { imagePlugin } from '@md-plugins/md-plugin-image'

const md = new MarkdownIt()

md.use(imagePlugin, {
  imageClass: 'custom-image-class',
})
```

:::

:::details Q. How do I extract and process frontmatter content?

You can use the `frontmatter` plugin to extract and process frontmatter content from your Markdown files. Here is an example configuration:

```typescript
import MarkdownIt from 'markdown-it'
import { frontmatterPlugin } from '@md-plugins/md-plugin-frontmatter'

const md = new MarkdownIt()

md.use(frontmatterPlugin, {
  grayMatterOptions: {
    excerpt: true,
    excerpt_separator: '<!-- more -->',
  },
  renderExcerpt: true,
})

const env: MarkdownItEnv = {}
const html = md.render(code, env)

console.info(env.frontmatter)
```

:::

:::details Q. How do I enhance code block rendering?

You can use the `codeblocks` plugin to enhance code block rendering with syntax highlighting, tabs, and more. Here is an example configuration:

```typescript
import MarkdownIt from 'markdown-it'
import { codeblocksPlugin } from '@md-plugins/md-plugin-codeblocks'

const md = new MarkdownIt()

md.use(codeblocksPlugin, {
  defaultLang: 'javascript',
  containerComponent: 'MarkdownPrerender',
  copyButtonComponent: 'MarkdownCopyButton',
})
```

:::

:::details Q. How do I convert Markdown links into Vue components?

You can use the `link` plugin to convert Markdown links into Vue components for SPA-friendly routing. Here is an example configuration:

```typescript
import MarkdownIt from 'markdown-it'
import { linkPlugin } from '@md-plugins/md-plugin-link'

const md = new MarkdownIt()

md.use(linkPlugin, {
  linkTag: 'RouterLink', // or 'router-link'
  linkToKeyword: 'to',
  pageScript: 'import { RouterLink } from "vue-router"',
})
```

:::

## Troubleshooting

:::details Q. My Markdown content is not rendering correctly. What should I do?

Ensure that you have correctly installed and configured the plugins. Check the console for any error messages and refer to the documentation for troubleshooting tips. If the issue persists, reach out to our support team for assistance.

:::

:::details Q. How do I report a bug or request a feature?

You can report bugs or request features by opening an issue on the GitHub repository of the respective plugin. Provide as much detail as possible to help us understand and address your request.

:::

## Support

If you have any other questions or need further assistance, please refer to the Support page or contact our support team.

Happy coding!

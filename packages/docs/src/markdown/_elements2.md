---
title: Design Elements
desc: The elements for markdown design.
---

Lorem ipsum dolor sit amet, **consectetur adipiscing** elit, sed do _eiusmod_ tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu `fugiat nulla` pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa [qui officia](/vue-components/badge) deserunt mollit anim id est laborum.

## Heading H2

Lorem ipsum dolor sit amet, **consectetur adipiscing** elit, sed do _eiusmod_ tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu `fugiat nulla` pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa [qui officia](/vue-components/badge) deserunt mollit anim id est laborum.

### Heading H3

Lorem ipsum dolor sit amet, **consectetur adipiscing** elit, sed do _eiusmod_ tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu `fugiat nulla` pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa [qui officia](/vue-components/badge) deserunt mollit anim id est laborum.

#### Heading H4

Lorem ipsum dolor sit amet, **consectetur adipiscing** elit, sed do _eiusmod_ tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu `fugiat nulla` pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa [qui officia](/vue-components/badge) deserunt mollit anim id est laborum.

##### Heading H5

Lorem ipsum dolor sit amet, **consectetur adipiscing** elit, sed do _eiusmod_ tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu `fugiat nulla` pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa [qui officia](/vue-components/badge) deserunt mollit anim id est laborum.

###### Heading H6

Lorem ipsum dolor sit amet, **consectetur adipiscing** elit, sed do _eiusmod_ tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu `fugiat nulla` pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa [qui officia](/vue-components/badge) deserunt mollit anim id est laborum.

### Heading with badge <q-badge label="badge" />

Lorem ipsum dolor sit amet, **consectetur adipiscing** elit, sed do _eiusmod_ tempor incididunt ut labore et dolore magna aliqua.

## Containers

> Block container
> <br><br>
>
> This Website collects some `Personal Data` from its Users.

::: tip Tip container title
This Website collects some `Personal Data` from its Users.
:::

::: warning Warning container title
This Website collects some `Personal Data` from its Users.
:::

::: danger Danger container title
This Website collects some `Personal Data` from its Users.
:::

::: details Details container title
This Website collects some `Personal Data` from its Users.
:::

## Keyboard tokens

- macOS: <kbd>Cmd</kbd> <kbd>Alt</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Linux: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Windows: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>

## Code containers

### Plain (internal highlight on `prod:`)

```js
export default function (ctx) { // can be async too
  console.info(ctx)

  // Example output on console:
  {
    dev: true,
    prod: false [[! highlight]]
  }

  const { FOO } = process.env // ❌ It doesn't allow destructuring or similar
  process.env.FOO             // ✅ It can only replace direct usage like this

  // context gets generated based on the parameters
  // with which you run "quasar dev" or "quasar build"
}
```

### Highlight [2,5]

```js [highlight=2,5]
export default function (ctx) { // can be async too
  console.info(ctx)

  // Example output on console:
  {
    dev: true,
    prod: false
  }

  const { FOO } = process.env // ❌ It doesn't allow destructuring or similar
  process.env.FOO             // ✅ It can only replace direct usage like this

  // context gets generated based on the parameters
  // with which you run "quasar dev" or "quasar build"
}
```

### Highlight [2,5,9,10] add [3,6-7] rem [15] with numbered lines

```js [highlight=2,5,9,10 numbered add=3,6-7 rem=15]
export default function (ctx) { // can be async too
  console.info(ctx)

  // Example output on console:
  {
    dev: true,
    prod: false
  }

  const { FOO } = process.env // ❌ It doesn't allow destructuring or similar
  process.env.FOO             // ✅ It can only replace direct usage like this

  // context gets generated based on the parameters
  // with which you run "quasar dev" or "quasar build"
  // Additionally, ...
}
```

### Titled code

```js Titled code
export default function (ctx) { // can be async too
  console.info(ctx)

  // Example output on console:
  {
    dev: true,
    prod: false
  }

  const { FOO } = process.env // ❌ It doesn't allow destructuring or similar
  process.env.FOO             // ✅ It can only replace direct usage like this

  // context gets generated based on the parameters
  // with which you run "quasar dev" or "quasar build"
}
```

### bash

```bash
sudo apt update
sudo apt upgrade
sudo apt autoremove
```

### bash numbered

```bash [numbered]
sudo apt update
sudo apt upgrade
sudo apt autoremove
```

### CSS

```css
.my-class {
  color: red;
  background-color: blue;
}
```

### CSS numbered

```css [numbered]
.my-class {
  color: red;
  background-color: blue;
}
```

### JSON

```json
{
  "min": 0,
  "super": false,
  "max": 100
}
```

### JSON (internal rem/add)

```json [rem=1]
{
  "min": 0,
  "super": false, [[! rem]]
  "super": true, [[! add]]
  "max": 100
}
```

### JSON (internal rem/add and numbered)

```json [numbered]
{
  "min": 0,
  "super": false, [[! rem]]
  "super": true, [[! add]]
  "max": 100
}
```

### JSON (numbered/highlight)

```json [numbered]
{
  "min": 0,
  "super": false, [[! highlight]]
  "max": 100
}
```

### diff

```diff
@@ -13,6 +13,8 @@ const langList = [
   { name: 'xml' },
   { name: 'nginx' },
   { name: 'html' },
+
+  // special grammars:
   { name: 'diff' }
 ]

@@ -20,6 +22,12 @@ loadLanguages(langList.map(l => l.name))

 const langMatch = langList.map(l => l.aliases || l.name).join('|')

+/**
+ * lang -> one of the supported languages (langList)
+ * attrs -> optional attributes:
+ *    * numbered - lines are numbered
+ * title -> optional card title
+ */
 const definitionLineRE = new RegExp(
   '^' +
   `(?<lang>(tabs|${ langMatch }))` + // then a language name
@@ -28,6 +36,10 @@ const definitionLineRE = new RegExp(
   '$'
 )

+/**
+ * <<| lang [attrs] [title] |>>
+ * ...content...
+ */
 const tabsLineRE = new RegExp(
   '^<<\\|\\s+' + // starts with "<<|" + at least one space char
   `(?<lang>${ langMatch })` + // then a language name
@@ -72,29 +84,65 @@ function extractTabs (content) {
       const props = tabMap[ tabName ]
       return (
         `<q-tab-panel class="q-pa-none" name="${ tabName }">` +
-        `<pre v-pre class="markdown-code">${ highlight(props.content.join('\n'), props.attrs) }</pre>` +
-        '<copy-button />' +
+        highlight(props.content.join('\n'), props.attrs) +
         '</q-tab-panel>'
       )
     }).join('\n')
   }
 }

-function highlight (content, attrs) {
-  const { lang, numbered } = attrs
-  const highlightedText = prism.highlight(content, prism.languages[ lang ], lang)
+const magicCommentRE = / *\/\/\[! (?<klass>[\w-]+)\] */
+const magicCommentGlobalRE = new RegExp(magicCommentRE, 'g')

-  if (numbered === true) {
-    const lines = highlightedText.split('\n')
-    const lineCount = ('' + highlightedText.length).length
+function getLineClasses (content, highlightedLines) {
+  const lines = content.split('\n')
```

### Tabs

```tabs
<<| js [numbered] Config file |>>
export default function (ctx) { // can be async too
  console.info(ctx)

  // Example output on console:
  {
    dev: true,
    prod: false
  }

  const { FOO } = process.env // ❌ It doesn't allow destructuring or similar
  process.env.FOO             // ✅ It can only replace direct usage like this

  // context gets generated based on the parameters
  // with which you run "quasar dev" or "quasar build"
}
<<| js Other file |>>
const x = {
  dev: true,
  prod: false
}
```

### Tabs (3)

```tabs quasar.config file
<<| js One |>>
export default function (ctx) { // can be async too
  console.info(ctx)

  // Example output on console:
  {
    dev: true,
    prod: false [[! highlight]]
  }

  const { FOO } = process.env // ❌ It doesn't allow destructuring or similar
  process.env.FOO             // ✅ It can only replace direct usage like this

  // context gets generated based on the parameters
  // with which you run "quasar dev" or "quasar build"
}
<<| js [numbered] Two (numbered) |>>
const x = {
  dev: true,
  prod: false
}
<<| diff Three (with diff) |>>
{
  min: 0
- super: false
+ super: true
  max: 100
}
```

<script import>
import AvatarApi from 'quasar/dist/api/QAvatar.json'
</script>

<MarkdownApi :api="AvatarApi" name="QAvatar"/>

<script import>
import MarkdownExampleApi from 'src/.q-press/api/components/MarkdownExample.json'
import MarkdownPageApi from 'src/.q-press/api/components/MarkdownPage.json'
</script>

<MarkdownApi :api="MarkdownExampleApi" name="MarkdownExample"/>
<MarkdownApi :api="MarkdownPageApi" name="MarkdownPage"/>

<MarkdownExample title="Title for example card" file="BasicExample" />

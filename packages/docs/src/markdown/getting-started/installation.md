---
title: Installation Types
desc: How to install QCalendar
keys: All about QCalendar
---

First off, it's important to know that QCalendar has many modular components that make up it's entirety. Installing as QCalendar **will install all these components**. However, you may want to install them individually.

The components are:

1. QCalendar (wrapper)
2. QCalendarDay
3. QCalendarMonth
4. QCalendarAgenda
5. QCalendarResource
6. QCalendarScheduler
7. QCalendarTask
8. Timestamp (dedicated code for creating calendars)

These are also many ways to add the calendar components to your project. You can install as a Quasar CLI app-extension. You might want to write your own boot file (for targeting one or more calendar components). You might want to use pre-compiled sources in dist or directly from the src folder (src folder access means your project needs to transpile QCalendar sources). Or, you may want to use a UMD variant.

## Quasar CLI

### App Extension

::: warning
By using the app extension, you will get **all** QCalendar components installed and registered within your application.
:::

::: tip
QCalendar v5's app extension targets Quasar CLI Vite projects using `@quasar/app-vite` `>=3.0.0-beta.42`. For non-Quasar Vue/Vite apps, install the UI package directly and skip the app extension.
:::

#### Install

To add as an App Extension to your Quasar application, run the following (in your Quasar app folder):

```
$ quasar ext add @quasar/qcalendar@beta
```

While QCalendar v5 is in beta, use the beta dist tag:

```bash
$ quasar ext add @quasar/qcalendar@beta
```

#### Uninstall

To remove as an App Extension from your Quasar application, run the following (in your Quasar app folder):

```
$ quasar ext remove @quasar/qcalendar
```

#### Describe

When installed as an App Extension, you can use `quasar describe QCalendar`. You can replace `QCalendar` with any of the calendar types (ex: `quasar describe QCalendarDay`).

### Or Create and register a boot file

::: tip
This is the preferred way if you are targeting one or more calendar components.
:::

::: warning
If you plan on importing from `src/` directly, please read the [Upgrade Guide](/other/upgrade-guide) on additional steps that may be needed.
:::

```tabs
<<| bash pnpm |>>
pnpm add @quasar/quasar-ui-qcalendar@beta
<<| bash bun |>>
bun add @quasar/quasar-ui-qcalendar@beta
<<| bash yarn |>>
yarn add @quasar/quasar-ui-qcalendar@beta
<<| bash npm |>>
npm install @quasar/quasar-ui-qcalendar@beta
```

When QCalendar v5 is released as stable, remove the `@beta` tag from those commands.

Now, you can access the compiled portions or access the sources directly. Choose which you want to use.

```tabs
<<| ts Compiled |>>
import { defineBoot } from '#q-app'
import VuePlugin from '@quasar/quasar-ui-qcalendar/QCalendarDay'
import '@quasar/quasar-ui-qcalendar/QCalendarDay.css'

export default defineBoot(({ app }) => {
  app.use(VuePlugin)
})
<<| ts Source (direct) |>>
import { defineBoot } from '#q-app'
import VuePlugin from '@quasar/quasar-ui-qcalendar/src/QCalendarDay' // notice the `src` folder
import '@quasar/quasar-ui-qcalendar/src/css/calendar-day.scss' // notice the path to raw scss file

export default defineBoot(({ app }) => {
  app.use(VuePlugin)
})
```

Additionally, if you are accessing sources directly there are a few more items you can do. Instead of adding the css/scss (from above) into a boot file, you can add it into your `quasar.config` file like so:

```ts
// Note: using ~ tells Quasar the file resides in node_modules
css: [
  'app.scss',
  '~quasar-ui-qcalendar/src/css/calendar-day.scss' // <---
],
```

There are no extra steps to be taken with Quasar CLI Vite 3, as it will automatically transpile your dependencies.

#### Minified

Additionally, all compiled CSS has a minified version, so if you want `QCalendarDay.css` you could instead target `QCalendarDay.min.css`. This applies to all components.

### Or target as a component import

::: tip
Each calendar component ships modern ESM entrypoints for bundlers and UMD bundles for browser-global usage. Compiled CSS is available in regular, minified, RTL, and RTL-minified variants.
:::

```tabs
<<| html Composition API |>>
<!-- Add to your index.html -->
<style src="@quasar/quasar-ui-qcalendar/QCalendarDay.min.css"></style>

<!-- Add to your SFC -->
<script setup>
  import { QCalendarDay } from '@quasar/quasar-ui-qcalendar/QCalendarDay'
</script>
<<| html Options API|>>
<!-- Add to your index.html -->
<style src="@quasar/quasar-ui-qcalendar/QCalendarDay.min.css"></style>

<!-- Add to your SFC -->
<script>
  import { QCalendarDay } from '@quasar/quasar-ui-qcalendar/QCalendarDay'

  // add this if not using <script setup>
  export default {
    components: {
      QCalendarDay,
    },
  }
</script>
```

## Vue CLI or Vite

```tabs
<<| js Vue project from src |>>
import Plugin from '@quasar/quasar-ui-qcalendar/src/QCalendarDay'
import '@quasar/quasar-ui-qcalendar/src/css/calendar-day.scss'
import App from './App.vue'

const app = createApp(App).use(Plugin)
<<| js Vue project from dist |>>
import Plugin from '@quasar/quasar-ui-qcalendar/QCalendarDay'
import '@quasar/quasar-ui-qcalendar/QCalendarDay.min.css'
import App from './App.vue'

const app = createApp(App).use(Plugin)
<<| html Component import |>>
<style src="@quasar/quasar-ui-qcalendar/QCalendarDay.min.css"></style>

<script>
  import { QCalendarDay } from '@quasar/quasar-ui-qcalendar/QCalendarDay'

  // add this if not using <script setup>
  export default {
    components: {
      QCalendarDay,
    },
  }
</script>
```

## UMD variant

Exports `window.QCalendarDay`.

> Substitute `QCalendarDay` with any of the calendar types (ex: `QCalendarMonth`).

### Quasar install

Add the following tag(s) after the Quasar ones:

```html
<head>
  <!-- AFTER the Quasar stylesheet tags: -->
  <link
    href="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qcalendar/dist/QCalendarMonth.min.css"
    rel="stylesheet"
    type="text/css"
  />
</head>
<body>
  <!-- at end of body, AFTER Quasar script(s): -->
  <script src="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qcalendar/dist/QCalendarMonth.umd.min.js"></script>

  <!-- If you need Timestamp functions: -->
  <script src="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qcalendar/dist/Timestamp.umd.min.js"></script>
</body>
```

If you need the RTL variant of the CSS, then go for the following (instead of the above stylesheet link):

```html
<link
  href="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qcalendar/dist/QCalendarMonth.rtl.min.css"
  rel="stylesheet"
  type="text/css"
/>
```

### Vue install

```html
<head>
  <link
    href="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qcalendar/dist/QCalendarMonth.min.css"
    rel="stylesheet"
    type="text/css"
  />
</head>
<body>
  <!-- at end of body: -->
  <script src="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qcalendar/dist/QCalendarMonth.umd.min.js"></script>

  <!-- If you need Timestamp functions: -->
  <script src="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qcalendar/dist/Timestamp.umd.min.js"></script>
</body>
```

If you need the RTL variant of the CSS, then go for the following (instead of the above stylesheet link):

```html
<link
  href="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qcalendar/dist/QCalendarMonth.rtl.min.css"
  rel="stylesheet"
  type="text/css"
/>
```

Your Vue source:

```js
const app = Vue.createApp({
  setup() {
    // ...your set up methods
  },
})

app.component('QCalendarDay', QCalendarDay.QCalendarDay)
app.mount('#app')
```

## Testing on CodePen

Most documentation examples include a CodePen action in the example toolbar. Use it to open the current example in CodePen with the matching QCalendar version and dependencies.

# Project source

Can be found [here](https://github.com/quasarframework/quasar-ui-qcalendar/tree/v5-beta).

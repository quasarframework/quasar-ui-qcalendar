---
title: Installation Types
desc: How to install QCalendar
keys: All about QCalendar
related:
  - /all-about-qcalendar/what-is-qcalendar
  - /contributing/bugs-and-feature-requests
  - /contributing/sponsor
---
First off, it's important to know that QCalendar has many modular components that make up it's entirety. Installing as QCalendar __will install all these components__. However, you may want to install them individually.

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

#### Install

To add as an App Extension to your Quasar application, run the following (in your Quasar app folder):
```
$ quasar ext add @quasar/qcalendar@next
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

```
$ yarn add @quasar/quasar-ui-qcalendar@next
# or
$ npm install @quasar/quasar-ui-qcalendar@next
```

Then

```js
import { boot } from 'quasar/wrappers'
import Plugin from '@quasar/quasar-ui-qcalendar/src/QCalendarDay.js'
import '@quasar/quasar-ui-qcalendar/src/css/calendar-day.sass'

export default boot(({ app }) => {
  app.use(Plugin)
})
```
Additionally, because you are accessing the sources this way, you will need to make sure your project will transpile the code.

In `quasar.conf.js` update the following:
```js
// Note: using ~ tells Quasar the file resides in node_modules
css: [
  'app.sass',
  '~quasar-ui-qcalendar/src/css/calendar-day.sass'
],

build: {
  transpile: true,
  transpileDependencies: [
    /quasar-ui-qcalendar[\\/]src/
  ]
}
```

### Or target as a component import

::: tip
There are several variants for each calendar component, including common, es (modern), and UMD as well as minified versions of each of those. The same goes for the css, including min and rtl.
:::

:::
```html
<style src="@quasar/quasar-ui-qcalendar/dist/QCalendarDay.min.css"></style>

<script>
import { QCalendar } from '@quasar/quasar-ui-qcalendar/dist/QCalendarDay.esm.js'

export default {
  components: {
    QCalendar
  }
}
</script>
```
:::

## Vue CLI or Vite

### Vue project from src

:::
```js
import Plugin from '@quasar/quasar-ui-qcalendar/src/QCalendarDay.js'
import '@quasar/quasar-ui-qcalendar/src/css/calendar-day.sass'
import App from './App.vue'

const app = createApp(App)
  .use(Plugin)
```
:::

### Vue project from dist

:::
```js
import Plugin from '@quasar/quasar-ui-qcalendar/dist/QCalendarDay.esm.js'
import '@quasar/quasar-ui-qcalendar/dist/QCalendarDay.min.css'
import App from './App.vue'

const app = createApp(App)
  .use(Plugin)
```
:::

### Or component import

:::
```html
<style src="@quasar/quasar-ui-qcalendar/dist/QCalendarDay.min.css"></style>

<script>
import { QCalendarDay } from '@quasar/quasar-ui-qcalendar/dist/QCalendarDay.esm.js'

export default {
  components: {
    QCalendarDay
  }
}
</script>
```
:::

## UMD variant

Exports `window.QCalendarDay`.

### Quasar install

Add the following tag(s) after the Quasar ones:

```html
<head>
  <!-- AFTER the Quasar stylesheet tags: -->
  <link href="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qcalendar@next/dist/QCalendarMonth.min.css" rel="stylesheet" type="text/css">
</head>
<body>
  <!-- at end of body, AFTER Quasar script(s): -->
  <script src="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qcalendar@next/dist/QCalendarMonth.umd.min.js"></script>

  <!-- If you need Timestamp functions: -->
  <script src="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qcalendar@next/dist/Timestamp.umd.min.js"></script>
</body>
```

If you need the RTL variant of the CSS, then go for the following (instead of the above stylesheet link):

```html
<link href="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qcalendar@next/dist/QCalendarMonth.rtl.min.css" rel="stylesheet" type="text/css">
```

### Vue install

```html
<head>
  <link href="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qcalendar@next/dist/QCalendarMonth.min.css" rel="stylesheet" type="text/css">
</head>
<body>
  <!-- at end of body: -->
  <script src="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qcalendar@next/dist/QCalendarMonth.umd.min.js"></script>

  <!-- If you need Timestamp functions: -->
  <script src="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qcalendar@next/dist/Timestamp.umd.min.js"></script>
</body>
```

If you need the RTL variant of the CSS, then go for the following (instead of the above stylesheet link):

```html
<link href="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qcalendar@next/dist/QCalendarMonth.rtl.min.css" rel="stylesheet" type="text/css">
```

Your Vue source:

```js
const app = Vue.createApp({
  setup() {
    // ...your set up methods
  }
});

app.component("QCalendarDay", QCalendarDay.QCalendarDay);
app.mount("#app");
```


## Testing on Codepen

[QCalendar v4 Collection](https://codepen.io/collection/qOBOEG)

or

[QCalendarDay UMD Example on Codepen](https://codepen.io/Hawkeye64/pen/ZEemBjm)

[QCalendarDay (week) UMD Example on Codepen](https://codepen.io/Hawkeye64/pen/YzZRpdW)

[QCalendarMonth UMD Example on Codepen](https://codepen.io/Hawkeye64/pen/dyvpYwW)

[QCalendarMonth (minimode) UMD Example on Codepen](https://codepen.io/Hawkeye64/pen/VwpVmNj)

[QCalendarAgenda UMD Example on Codepen](https://codepen.io/Hawkeye64/pen/MWpzbRZ)

[QCalendarResource UMD Example on Codepen](https://codepen.io/Hawkeye64/pen/xxqQgbG)

[QCalendarScheduler UMD Example on Codepen](https://codepen.io/Hawkeye64/pen/oNZQBLz)

[QCalendarTask UMD Example on Codepen](https://codepen.io/Hawkeye64/pen/RwwwKQL)


# Project source
Can be found [here](https://github.com/quasarframework/quasar-ui-qcalendar/tree/next).

QCalendar
===

[![npm](https://img.shields.io/npm/v/@quasar/quasar-ui-qcalendar.svg?label=@quasar/qcalendar)](https://www.npmjs.com/package/@quasar/quasar-ui-qcalendar)
[![npm](https://img.shields.io/npm/dt/@quasar/quasar-ui-qcalendar.svg)](https://www.npmjs.com/package/@quasar/quasar-ui-qcalendar)

QCalendar is a [Quasar](https://quasar.dev) component. It is a powerful calendar that plugs right into your Quasar application and allows for viewing of day (1-7 days for a week), monthly and scheduler views. Painstaking care has been given to make almost every aspect of QCalendar configurable and/or modifiable in some way and control given to the developer.

![QCalendar example month view](https://raw.githubusercontent.com/quasarframework/quasar-ui-qcalendar/dev/demo/src/statics/qcalendar-month-view.png)

# Examples and Documentation
Can be found [here](https://quasarframework.github.io/quasar-ui-qcalendar)

# Usage

## Quasar CLI project

Install the [App Extension](../app-extension).

**OR**:

Create and register a boot file:

```js
import Vue from 'vue'
import Plugin from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/dist/index.css'

Vue.use(Plugin)
```

**OR**:

```html
<style src="@quasar/quasar-ui-qcalendar/dist/index.css"></style>

<script>
import { Component as QCalendar } from '@quasar/quasar-ui-qcalendar'

export default {
  components: {
    QCalendar
  }
}
</script>
```

## Vue CLI project

```js
import Vue from 'vue'
import Plugin from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/dist/index.css'

Vue.use(Plugin)
```

**OR**:

```html
<style src="@quasar/quasar-ui-qcalendar/dist/index.css"></style>

<script>
import { Component as QCalendar } from '@quasar/quasar-ui-qcalendar'

export default {
  components: {
    QCalendar
  }
}
</script>
```

## UMD variant

Exports `window.QCalendar`.

Add the following tag(s) after the Quasar ones:

```html
<head>
  <!-- AFTER the Quasar stylesheet tags: -->
  <link href="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qcalendar/dist/index.min.css" rel="stylesheet" type="text/css">
</head>
<body>
  <!-- at end of body, AFTER Quasar script(s): -->
  <script src="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qcalendar/dist/index.umd.min.js"></script>
</body>
```
If you need the RTL variant of the CSS, then go for the following (instead of the above stylesheet link):
```html
<link href="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qcalendar/dist/index.rtl.min.css" rel="stylesheet" type="text/css">
```

### UMD Example
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="format-detection" content="telephone=no">
    <meta name="msapplication-tap-highlight" content="no">
    <meta name="viewport" content="user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1,width=device-width">

    <title>UMD test</title>
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons" rel="stylesheet" type="text/css">
    <link href="https://cdn.jsdelivr.net/npm/quasar@^1.0.0/dist/quasar.min.css" rel="stylesheet" type="text/css">
    <link href="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qcalendar@^1.0.0/dist/index.css" rel="stylesheet" type="text/css">
  </head>
  <body>
    <div id="q-app">
      <q-layout view="lHh Lpr fff">
        <q-header class="glossy bg-primary">
          <q-toolbar>
            <q-toolbar-title shrink>
              QCalendar <span class="text-subtitle2">v{{ version }}</span>
            </q-toolbar-title>

            <q-separator vertical></q-separator>
            <q-btn stretch flat label="Prev" @click="calendarPrev"></q-btn>
            <q-separator vertical></q-separator>
            <q-btn stretch flat label="Next" @click="calendarNext"></q-btn>
            <q-separator vertical></q-separator>
            <q-space></q-space>

            <div>Quasar v{{ $q.version }}</div>
          </q-toolbar>
        </q-header>

        <q-page-container>
          <q-page>
            <q-calendar ref="calendar" v-model="date"></q-calendar>
          </q-page>
        </q-page-container>
      </q-layout>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/quasar@^1.0.0/dist/quasar.ie.polyfills.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vue@^2.0.0/dist/vue.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/quasar@^1.0.0/dist/quasar.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qcalendar@^1.0.0/dist/index.umd.js"></script>

    <script>
      new Vue({
        el: '#q-app',

        data: function () {
          return {
            date: '',
            version: QCalendar.version
          }
        },

        beforeMount () {
          const now = new Date()
          // set initially to today's date (YYYY-mm-dd)
          this.date = now.getFullYear() + '-' + (this.padNumber(now.getMonth() + 1, 2)) + '-' + this.padNumber(now.getDay(), 2)
        },

        methods: {
          calendarNext () {
            this.$refs.calendar.next()
          },

          calendarPrev () {
            this.$refs.calendar.prev()
          },

          padNumber (num, length) {
            let padded = String(num)
            while (padded.length < length) {
              padded = '0' + padded
            }
            return padded
          }
        }
      })
    </script>
  </body>
</html>
```

[UMD example on Codepen](https://codepen.io/Hawkeye64/pen/RwwwKQL)

# Building the Projects

## Setup

In both the `ui` and `ui/dev` folders:

```bash
$ yarn
```

## Developing

In the `ui` folder

```bash
# start dev in SPA mode
$ yarn dev

# start dev in UMD mode
$ yarn dev:umd

# start dev in SSR mode
$ yarn dev:ssr

# start dev in Cordova iOS mode
$ yarn dev:ios

# start dev in Cordova Android mode
$ yarn dev:android

# start dev in Electron mode
$ yarn dev:electron
```

## Building package
```bash
$ yarn build
```

# Donate
If you appreciate the work that went into this, please consider donating to [Quasar](https://donate.quasar.dev) or [Jeff](https://github.com/sponsors/hawkeye64).

# License
MIT (c) Jeff Galbraith <jeff@quasar.dev>

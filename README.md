QCalendar (Vue Plugin, UMD and Quasar App Extension)
===

![@quasar/quasar-ui-qcalendar](https://img.shields.io/npm/v/@quasar/quasar-ui-qcalendar.svg?label=@quasar/quasar-ui-qcalendar)
![@quasar/quasar-app-extension-qcalendar](https://img.shields.io/npm/v/@quasar/quasar-app-extension-qcalendar.svg?label=@quasar/quasar-app-extension-qcalendar)
[![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/quasarframework/quasar-ui-qcalendar.svg)]()
[![GitHub repo size in bytes](https://img.shields.io/github/repo-size/quasarframework/quasar-ui-qcalendar.svg)]()

## Everything you need for a complete Calendar solution.

QCalendar is a [Quasar](https://quasar.dev) component. It is a powerful calendar that plugs right into your Quasar application and allows for viewing of **day** (1-7 days for a week), **monthly**, **scheduler** and **agenda** views. Painstaking care has been given to make almost every aspect of QCalendar configurable and/or modifiable in some way and control given to the developer.

**Month view with events**

![QCalendar example month view](https://raw.githubusercontent.com/quasarframework/quasar-ui-qcalendar/dev/demo/src/public/qcalendar-month-view.png)

**Planner example**

![QCalendar example planner](https://raw.githubusercontent.com/quasarframework/quasar-ui-qcalendar/dev/demo/src/public/qcalendar-agenda-view--planner.png)

**Monthly Mini-mode**

![QCalendar example planner](https://raw.githubusercontent.com/quasarframework/quasar-ui-qcalendar/dev/demo/src/public/q-calendar-month-view-mini-mode-with-selection.png)

# Structure

* [/ui](ui) - standalone npm package (go here for more information)
* [/app-extension](app-extension) - Quasar app extension
* [/demo](demo) - docs, demo and examples project
* [live demo](https://quasarframework.github.io/quasar-ui-qcalendar/docs) - live docs, demo and examples

# Demo Workflow
If you fork or download this project, make sure you have the Quasar CLI globally installed:

```
$ npm i -g @quasar/cli
```

The workflow to build the demo, on a fresh project, is as follows:
```
$ cd ui
$ yarn
$ yarn build
$ cd ../demo
$ yarn
$ quasar dev
```

# Codepen
[UMD example on Codepen](https://codepen.io/Hawkeye64/pen/RwwwKQL)

# Donate
If you appreciate the work that went into this, please consider donating to [Quasar](https://donate.quasar.dev) or [Jeff](https://github.com/sponsors/hawkeye64).

# License
MIT (c) Jeff Galbraith <jeff@quasar.dev>

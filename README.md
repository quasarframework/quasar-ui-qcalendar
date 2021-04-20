QCalendar (Vue Plugin, UMD and Quasar App Extension)
===

![@quasar/quasar-ui-qcalendar](https://img.shields.io/npm/v/@quasar/quasar-ui-qcalendar.svg?label=@quasar/quasar-ui-qcalendar)
![@quasar/quasar-app-extension-qcalendar](https://img.shields.io/npm/v/@quasar/quasar-app-extension-qcalendar.svg?label=@quasar/quasar-app-extension-qcalendar)
[![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/quasarframework/quasar-ui-qcalendar.svg)]()
[![GitHub repo size in bytes](https://img.shields.io/github/repo-size/quasarframework/quasar-ui-qcalendar.svg)]()

## Everything you need for a complete Calendar solution.

QCalendar allows for viewing of **day** (1-6 days), **week**, **monthly**, **scheduler**, **agenda**, **resource** and **task** views. Painstaking care has been given to make almost every aspect of QCalendar configurable and/or modifiable in some way and control given to the developer.

---

## Important Release Notes

v4.0.0
- QCalendar v4.x lives in the **next** branch. This may change at some point in the future before the next major release.
- Be sure to read the [documentation](https://qcalendar.netlify.app/)
---

[Live Demo](https://qcalendar.netlify.app/) - **live docs, demo and examples**

---

**Month view with events**

![QCalendar example month view](https://raw.githubusercontent.com/quasarframework/quasar-ui-qcalendar/dev/demo/public/qcalendar-month-view.png)

**Planner example**

![QCalendar example agenda view - planner](https://raw.githubusercontent.com/quasarframework/quasar-ui-qcalendar/dev/demo/public/qcalendar-agenda-view--planner.png)

**Monthly Mini-mode**

![QCalendar example mini-mode selection](https://raw.githubusercontent.com/quasarframework/quasar-ui-qcalendar/dev/demo/public/q-calendar-month-view-mini-mode-with-selection.png)

**Multi-month selector (mini-mode)**

![QCalendar example multi-month selection](https://raw.githubusercontent.com/quasarframework/quasar-ui-qcalendar/dev/demo/public/qcalendar-month-view-mini-mode-multi-month-selection.png)

**Agenda view with custom content**

![QCalendar example agenda view](https://raw.githubusercontent.com/quasarframework/quasar-ui-qcalendar/dev/demo/public/qcalendar-agenda-view.png)

**Day view with events**

![QCalendar example day view - events](https://raw.githubusercontent.com/quasarframework/quasar-ui-qcalendar/dev/demo/public/qcalendar-day-view.png)

**Resource view with events**

![QCalendar example resource view - events](https://raw.githubusercontent.com/quasarframework/quasar-ui-qcalendar/dev/demo/public/qcalendar-resource-view.png)

**Scheduler view**

![QCalendar example scheduler view](https://raw.githubusercontent.com/quasarframework/quasar-ui-qcalendar/dev/demo/public/qcalendar-scheduler-view.png)

Including support for locales, optional theming, 1st day Monday, 5-day work weeks, work week numbers, selected days, disabled days, day of year...

...and many more!

# Structure

* [/ui](ui) - standalone npm package (go here for more information)
* [/app-extension](app-extension) - Quasar app extension
* [/demo](demo) - sources for docs, demo and examples project
* [live demo](https://qcalendar.netlify.app/) - **live docs, demo and examples**

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

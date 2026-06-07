# Quasar App Extension QCalendar

The **QCalendar App Extension** allows you to seamlessly add the [QCalendar](../ui) component into your Quasar application. It manages the boot file file and all other configuration for you.

[![npm](https://img.shields.io/npm/v/@quasar/quasar-app-extension-qcalendar/beta?label=@quasar/quasar-app-extension-qcalendar)](https://www.npmjs.com/package/@quasar/quasar-app-extension-qcalendar)
[![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/quasarframework/quasar-ui-qcalendar)]()
[![GitHub repo size in bytes](https://img.shields.io/github/repo-size/quasarframework/quasar-ui-qcalendar)]()
[![npm](https://img.shields.io/npm/dt/@quasar/quasar-app-extension-qcalendar)](https://www.npmjs.com/package/@quasar/quasar-app-extension-qcalendar)
![@quasar/quasar-app-extension-qcalendar](https://img.shields.io/npm/dm/@quasar/quasar-app-extension-qcalendar)

[![Discord](https://img.shields.io/badge/discord-join%20server-738ADB?style=for-the-badge&logo=discord&logoColor=738ADB)](https://chat.quasar.dev)
[![Discord](https://img.shields.io/badge/follow-@jgalbraith64-1DA1F2?style=for-the-badge&logo=twitter&logoColor=1DA1F2)](https://twitter.com/jgalbraith64)

## Everything you need for a complete Calendar solution.

QCalendar is a [Quasar](https://quasar.dev) component. It is a powerful calendar that plugs right into your Quasar application and allows for viewing of **day** (1-7 days for a week), **monthly**, **scheduler**, **agenda**, **resource** and **task** views. Painstaking care has been given to make almost every aspect of QCalendar configurable and/or modifiable in some way and control given to the developer.

# QCalendar v5.0.0-beta.8

Welcome to the QCalendar v5.0.0-beta.8 release.

### QCalendar App Extension is now Vite-only

QCalendar v5 prepares the app extension for Quasar CLI Vite 3. The app extension requires `@quasar/app-vite` >=3.0.0-beta.39 and no longer supports webpack-based Quasar apps. If your application is still using `@quasar/app-webpack`, migrate the application to Quasar CLI Vite before installing QCalendar v5.

## Requirements

- Quasar v2.
- `@quasar/app-vite` >=3.0.0-beta.39.

# Documentation

Go to Netlify which is hosting the QCalendar docs https://qcalendar.netlify.app/.

---

## Examples

**Month view with events**

![QCalendar example month view](https://raw.githubusercontent.com/quasarframework/quasar-ui-qcalendar/packages/docs/public/qcalendar-month-view.png)

**Planner example**

![QCalendar example agenda view - planner](https://raw.githubusercontent.com/quasarframework/quasar-ui-qcalendar/packages/docs/public/qcalendaragenda-planner.png)

**Monthly Mini-mode**

![QCalendar example mini-mode selection](https://raw.githubusercontent.com/quasarframework/quasar-ui-qcalendar/packages/docs/public/qcalendarmonth-minimode-range-selection.png)

**Multi-month selector (mini-mode)**

![QCalendar example multi-month selection](https://raw.githubusercontent.com/quasarframework/quasar-ui-qcalendar/packages/docs/public/qcalendar-month-view-mini-mode-multi-month-selection.png)

**Agenda view with custom content**

![QCalendar example agenda view](https://raw.githubusercontent.com/quasarframework/quasar-ui-qcalendar/packages/docs/public/qcalendar-agenda-view.png)

**Day view with events**

![QCalendar example day view - events](https://raw.githubusercontent.com/quasarframework/quasar-ui-qcalendar/packages/docs/public/qcalendar-day-view.png)

**Resource view with events**

![QCalendar example resource view - events](https://raw.githubusercontent.com/quasarframework/quasar-ui-qcalendar/packages/docs/public/qcalendar-resource-view.png)

**Scheduler view**

![QCalendar example scheduler view](https://raw.githubusercontent.com/quasarframework/quasar-ui-qcalendar/packages/docs/public/qcalendar-scheduler-view.png)

**Task view**

![QCalendar task view](https://raw.githubusercontent.com/quasarframework/quasar-ui-qcalendar/packages/docs/public/QCalendarTask.png)

Including support for locales, optional theming, 1st day Monday, 5-day work weeks, work week numbers, selected days, disabled days, day of year...

...and many more!

# Install

```bash
quasar ext add @quasar/qcalendar@beta
```

Quasar CLI will retrieve it from NPM and install the extension.

While QCalendar v5 is in beta, install with:

```bash
quasar ext add @quasar/qcalendar@beta
```

# Uninstall

```bash
quasar ext remove @quasar/qcalendar
```

# Support

If QCalendar is useful in your workflow and you want to support ongoing maintenance:

GitHub Sponsors: https://github.com/sponsors/hawkeye64
PayPal: https://paypal.me/hawkeye64

# License

MIT (c) Jeff Galbraith <jeff@quasar.dev>

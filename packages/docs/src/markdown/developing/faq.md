---
title: FAQ
desc: Knowledge is Power
examples: Faq
---

Here you will find useful bespoke information on how to use the calendars. These mainly come as a result from question in the issues.

:::details Q. Do I need to import QCalendar CSS myself?

The App Extension adds the stylesheet for you.

If you install the UI package directly, import the matching stylesheet in your boot file or app entry:

```ts
import '@quasar/quasar-ui-qcalendar/QCalendarDay.css'
```

Quasar CLI projects can also centralize the stylesheet in `quasar.config.ts`:

```ts
// Note: using ~ tells Quasar the file resides in node_modules
css: [
  "app.scss",
  "~@quasar/quasar-ui-qcalendar/QCalendarDay.css",
],
```

Use `@quasar/quasar-ui-qcalendar/index.css` when registering the full plugin, or replace `QCalendarDay.css` with the component stylesheet you import.

:::

:::details Q. How do I type an App Extension-registered QCalendar template ref?

Keep runtime component registration in the App Extension and import only the concrete calendar instance type in `<script setup>`:

```ts
import { useTemplateRef } from 'vue'
import type { QCalendarDay } from '@quasar/quasar-ui-qcalendar'

const calendarRef = useTemplateRef<QCalendarDay>('calendar')
```

Use the type that matches your component, such as `QCalendarMonth`, `QCalendarScheduler`, or `QCalendar`. A normal value import creates a local component binding in `<script setup>` and takes precedence over the globally registered component. Use a normal import only when you intend to use the UI component directly, and follow the manual boot file installation path instead of registering it through both paths.

Because application source imports the type, add the UI package as a direct application dependency:

```bash
pnpm add @quasar/quasar-ui-qcalendar
```

Applications that only use globally registered calendar components in templates do not need this extra direct dependency.

:::

:::details Q. Can I use QCalendar without Quasar?

Yes, but use the UI package directly instead of the Quasar App Extension.

QCalendar components are Vue components, so they can be used in Vue/Vite applications that are not Quasar CLI projects. Install `@quasar/quasar-ui-qcalendar`, import the component and its stylesheet, and register the component in your app as you would with other Vue libraries.

The Quasar App Extension is only the convenience layer for Quasar CLI projects. It wires up boot files, CSS, and Quasar-specific integration for you, but it is not required when you want direct component usage.

:::

:::details Q. Can I inspect the component API from the Quasar CLI?

Yes. After the App Extension is installed, run `quasar describe` for the component you want to inspect:

```bash
quasar describe QCalendar
quasar describe QCalendarMonth
quasar describe QCalendarDay
```

The same generated API is shown on the component API pages, such as [QCalendar API](/developing/qcalendar), [QCalendarMonth API](/developing/qcalendar-month), and [QCalendarDay API](/developing/qcalendar-day).

:::

:::details Q. Month (Sticky Header)

In this example, check out the custom `.my-sticky` css class. This works in conjunction with a parent whose height is horter than the height needed to display the calendar and setting it's style to `overflow: auto`.

<MarkdownExample title="Month (Sticky Header)" file="MonthSticky"/>

:::

:::details Q. Month (Show Month)

In this example, it shows how you can display the currently displayed month and year. It uses the browser's `Intl.DateTimeFormat` to do the formatting.

<MarkdownExample title="Month (Show Month)" file="MonthDate"/>

:::

:::details Q. Month (Min. Weeks)

In this example, it shows how you can display the minimum number of weeks displayed in a month. The reason form doing this is to make sure the calendar is always the same height.

<MarkdownExample title="Month (Min. Weeks)" file="MonthMinWeeks"/>
:::

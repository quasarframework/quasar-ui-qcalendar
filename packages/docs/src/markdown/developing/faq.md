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
import "@quasar/quasar-ui-qcalendar/QCalendarDay.css";
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

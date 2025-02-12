---
title: FAQ
desc: Knowledge is Power
examples: Faq
---

Here you will find useful bespoke information on how to use the calendars. These mainly come as a result from question in the issues.

## Month (Sticky Header)

In this example, check out the custom `.my-sticky` css class. This works in conjunction with a parent whose height is horter than the height needed to display the calendar and setting it's style to `overflow: auto`.

<MarkdownExample title="Month (Sticky Header)" file="MonthSticky" no-github no-edit/>

## Month (Show Month)

In this example, it shows how you can display the currently displayed month and year. It uses the browser's `Intl.DateTimeFormat` to do the formatting.

<MarkdownExample title="Month (Show Month)" file="MonthDate" no-github no-edit/>

## Month (Min. Weeks)

In this example, it shows how you can display the minimum number of weeks displayed in a month. The reason form doing this is to make sure the calendar is always the same height.

<MarkdownExample title="Month (Min. Weeks)" file="MonthMinWeeks" no-github no-edit/>

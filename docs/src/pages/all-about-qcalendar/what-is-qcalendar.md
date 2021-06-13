---
title: What is QCalendar
desc: Everything you need for a complete Calendar solution
keys: All about QCalendar
related:
  - /contributing/bugs-and-feature-requests
  - /contributing/components
  - /contributing/documentation
  - /contributing/sponsor
---

::: warning
Please note that the codepen links, in the documentation examples, do not work at this time.

And, if you're looking to help out, check out our [Call to action](/contributing/call-to-action) in the **Contributing** section.
:::

> If you are looking for a **Migration Guide** from v3 to v4, go [here](/help/migration-guide) in the **Help** section.
## Everything you need for a complete Calendar solution

QCalendar allows for viewing of **day** (1-6 days), **week**, **monthly**, **scheduler**, **agenda**, **resource** and **task** views. Painstaking care has been given to make almost every aspect of QCalendar configurable and/or modifiable in some way and control given to the developer.

QCalendar is a less-opinionated calendar component, as it does not keep track of things like events and reminders. This is in the hands of the developer, but QCalendar makes it easy via events, slots and methods (see examples how to accomplish these endeavors).

The guiding philosophy has been to empower the developer and allow them to do what needs to be done without being overly opinionated. 

QCalendar is actually an accumulation of several other dedicated components and exported methods:

1. QCalendarDay
2. QCalendarMonth
3. QCalendarAgenda
4. QCalendarResource
5. QCalendarScheduler
6. QCalendarTask
7. Timestamp (dedicated code for creating calendars)


## Features

1. Show month, week, work-week, day, contiguous days (ex: 3 days at a time)
2. Scheduler view (optional hierarchical trees)
3. Resource view (optional hierarchical trees)
4. Agenda view (with optional Planner modes)
5. Task view (timesheets, Gantt charts)
6. Month view mini-mode (picker)
7. Month view multi-day selection (toggle and range)
8. Month view multi-month/multi-day range selection when combining two or more calendars
10. Optional drag and drop support (including mobile)
11. Automatic localization / internationalization
12. Responsive flex grid layout
13. No external dependencies (momentjs, jQuery, etc) other than Vue
14. User events support (date, day, interval, time, resource, etc)
15. Define any day as beginning of week
16. Show only certain days of the week (good for work week days)
17. Disable days or weekdays
18. Workweek number support
19. Day-of-the-year support
20. Easy to theme using CSS vars and Theme Builder
21. Easy to customize with Vue slots
22. Support for Dark mode
23. Rich support of date functions that are also exported for making your own calendars
24. Toggled date, range and interval selection

## QCalendar is not…

- An event management system. However, QCalendar supports everything you need to create an event/reminder management system using slots.
- An interactive navigation provider (next, previous, today). However, you can easily do this in devland with QCalendar’s methods (see examples).
- Only the Gregorian calendar is supported (at this time).
---
title: QCalendarAgenda
desc: Developing with QCalendarAgenda
examples: Agenda
---

<script import>
import QCalendarAgendaApi from '@quasar/quasar-ui-qcalendar/dist/api/QCalendarAgenda.json'
</script>

<MarkdownApi :api="QCalendarAgendaApi" name="QCalendarAgenda"/>

## Dark

This will only make sense if your browser is currently in light mode.

<MarkdownExample title="Dark" file="AgendaDark"/>

## Alignment

You can use the properties `date-header`, `date-align` and `weekday-align` to manipulate how the header area looks.

<MarkdownExample title="Alignment" file="AgendaAlignment"/>

## Cell Width

You can specify the `cell-width` property to make your calendar overrun it's horizontal boundaries.

The calendar goes into a special `sticky` mode when this happens so you can scroll vertically and/or horizontally.

This example also uses the `max-days` property.

<MarkdownExample title="Cell Width" file="AgendaCellWidth"/>

## Column Count

The `column-count` property allows for a single day to be displayed multiple times.

<MarkdownExample title="Column Count" file="AgendaColumnCount"/>

## Column Options

The `column-options` property allows you to define additional left or right columns.

<MarkdownExample title="Column Options" file="AgendaColumnOptions"/>

## Date Type

<MarkdownExample title="Date Type" file="AgendaDateType"/>

## Day Week - Max. Days

<MarkdownExample title="Day Week - Max Days" file="AgendaDayWeekMaxDays"/>

## Disabled Before After

All days before and after the current day have been disabled with the properties `disabled-before` and `disabled-after`.

<MarkdownExample title="Disabled Before After" file="AgendaDisabledBeforeAfter"/>

## Disabled Days

The next 4 days after the current day have been disabled with the `disabled-days` property.

The first example uses an array of dates to disable each specific date.

The second example uses a range, which is an array within an array of start and end dates.

<MarkdownExample title="Disabled Days" file="AgendaDisabledDays"/>

## Disabled Weekdays

The weekends have been disabled with the `disabled-weekdays` property.

<MarkdownExample title="Disabled Weekdays" file="AgendaDisabledWeekdays"/>

## First Day Monday

<MarkdownExample title="First Day Monday" file="AgendaFirstDayMonday"/>

## Five Day Workweek

<MarkdownExample title="Five Day Workweek" file="AgendaFiveDayWorkweek"/>

## Locale

<MarkdownExample title="Locale" file="AgendaLocale"/>

## No Active Date

<MarkdownExample title="No Active Date" file="AgendaNoActiveDate"/>

## Now

The current date has been set to tomorrow via the `now` property.

<MarkdownExample title="Now" file="AgendaNow"/>

## Theme

<MarkdownExample title="Theme" file="AgendaTheme"/>

## Transitions

<MarkdownExample title="Transitions" file="AgendaTransitions"/>

## Planner

This is a rudimentary Planner using QCalendarAgenda.

::: tip
On this example, you can try out the <em>Drag &amp; Drop</em>.
:::

<MarkdownExample title="Planner" file="AgendaPlanner" no-edit />

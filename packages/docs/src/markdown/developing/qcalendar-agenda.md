---
title: QCalendarAgenda
desc: Developing with QCalendarAgenda
examples: Agenda
---

<script import>
import QCalendarAgendaApi from '@quasar/quasar-ui-qcalendar/dist/api/QCalendarAgenda.json'
</script>

QCalendarAgenda presents days as compact columns or agenda lanes instead of a
time-grid. It is useful when users need to scan a range of dates, compare day
content, or review lightweight planning data without the vertical interval
structure of a day calendar.

Use this calendar when the date itself is the main grouping and exact start/end
times are secondary. Agenda views work well for planners, availability summaries,
simple booking overviews, and dashboards where several days should stay visible
at once.

<MarkdownApi :api="QCalendarAgendaApi" name="QCalendarAgenda"/>

## Date Type

Use `date-type` when the agenda should work from a specific anchor date instead
of relying on the default date handling. This is useful when your app stores
dates in a normalized format and passes them into the calendar.

<MarkdownExample title="Date Type" file="AgendaDateType"/>

## Dark

Use the Toggle Dark Mode control to compare the agenda calendar in light and dark
styling without changing the global site theme.

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

## Day Week - Max. Days

Use `max-days` to limit how many days render in a day/week style agenda. This
keeps dense agenda layouts readable when the surrounding page has limited
horizontal space.

<MarkdownExample title="Day Week - Max Days" file="AgendaDayWeekMaxDays"/>

## Disabled Before After

All days before and after the current day have been disabled with the properties `disabled-before` and `disabled-after`.

<MarkdownExample title="Disabled Before After" file="AgendaDisabledBeforeAfter"/>

## Disabled Days

The example anchors its date to a visible week and disables a short run of visible days with the `disabled-days` property.

The first example uses an array of dates to disable each specific date.

The second example uses the object form with `from`, `to`, `color`, and `textColor` to create a reservation-style disabled range.

<MarkdownExample title="Disabled Days" file="AgendaDisabledDays"/>

## Disabled Weekdays

The weekends have been disabled with the `disabled-weekdays` property.

<MarkdownExample title="Disabled Weekdays" file="AgendaDisabledWeekdays"/>

## First Day Monday

Set `first-day-monday` when users expect weeks to start on Monday instead of
Sunday. The weekday headers and rendered date range shift together.

<MarkdownExample title="First Day Monday" file="AgendaFirstDayMonday"/>

## Five Day Workweek

Use `weekdays` to render only the days that matter for the agenda. This example
shows a Monday through Friday calendar without weekend columns.

<MarkdownExample title="Five Day Workweek" file="AgendaFiveDayWorkweek"/>

## Locale

Locale affects the generated weekday and date labels. Use it when the calendar
should follow the same language and regional formatting as your app.

<MarkdownExample title="Locale" file="AgendaLocale"/>

## No Active Date

Use `no-active-date` when the agenda should avoid highlighting the model date as
the active day. This is useful for read-only or summary views where selection
state would be misleading.

<MarkdownExample title="No Active Date" file="AgendaNoActiveDate"/>

## Now

The current date has been set to tomorrow via the `now` property.

<MarkdownExample title="Now" file="AgendaNow"/>

## Theme

The theme example shows how calendar CSS variables can be changed together to
create a branded visual style without rewriting component internals.

<MarkdownExample title="Theme" file="AgendaTheme"/>

## Transitions

Transitions animate the agenda content when moving between date ranges. Use them
when navigation should feel spatial instead of abruptly swapping the visible
days.

<MarkdownExample title="Transitions" file="AgendaTransitions"/>

## Recipes

### Planner

This is a rudimentary Planner using QCalendarAgenda.

::: tip
On this example, you can try out the <em>Drag &amp; Drop</em>.
:::

<MarkdownExample title="Planner" file="AgendaPlanner" />

### Server Data

This recipe keeps the calendar empty until you click **Load visible range**. The
button simulates waiting for a server response, then fills the visible calendar
with data returned for the current range.

<MarkdownExample title="Server Data" file="AgendaServerData"/>

### Calendar Adapters

Agenda views can use Timestamp adapters for native labels and native-keyed data
while keeping the same adapter-native date contract as the rest of QCalendar.

This example renders Islamic Civil (Hijri) or Indian National (Saka) labels
inside the header and day slots. It is useful for planning views where users
need native calendar context, while Gregorian interop remains available through
slot identity metadata.

<MarkdownExample title="Calendar Adapters" file="AgendaCalendarAdapter"/>

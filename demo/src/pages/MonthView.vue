<template>
  <div class="q-markdown">
    <example-title title="Month View" />
    <example-card title="Basic" name="MonthViewBasic" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewBasic.vue').default)" />
    <example-card title="Color" name="MonthViewColor" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewColor.vue').default)" />
    <example-card title="First Day Monday" name="MonthViewMondayFirstDay" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewMondayFirstDay.vue').default)" />
    <example-card title="5 Day Work Week" name="MonthViewFiveDayWorkWeek" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewFiveDayWorkWeek.vue').default)" />
    <example-card title="Hide Header" name="MonthViewHideHeader" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewHideHeader.vue').default)" />
    <example-card title="Disabled Days" name="MonthViewDisabledDays" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewDisabledDays.vue').default)">
      <q-markdown>
When the property `disabled-days` has an array of disabled days, you can hook into the `day-style` property to change the background color of the disabled day.
      </q-markdown>
    </example-card>

    <example-card title="Now" name="MonthViewNow" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewNow.vue').default)" />
    <example-card title="Work Weeks" name="MonthViewWorkWeekNumbers" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewWorkWeekNumbers.vue').default)">
      <q-markdown>
`show-work-weeks` is available only for month view.
      </q-markdown>
    </example-card>

    <example-card title="Short Weekday Label" name="MonthViewShortWeekdayLabel" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewShortWeekdayLabel.vue').default)" />
    <example-card title="Short Month Label" name="MonthViewShortMonthLabel" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewShortMonthLabel.vue').default)" />
    <example-card title="Show Day of Year Label" name="MonthViewShowDayOfYearLabel" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewShowDayOfYearLabel.vue').default)">
      <q-markdown>
`show-day-of-year-label` is available only for month view.
      </q-markdown>
    </example-card>

    <example-card title="Day Height" name="MonthViewDayHeight" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewDayHeight.vue').default)">
      <q-markdown>
`day-height` is available only for month view.
The example below is setting the `day-height` to `100`, the default is `0`, which tells the calendar component to figure out it's own height.
      </q-markdown>
    </example-card>

    <example-card title="Prev/Next" name="MonthViewPrevNext" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewPrevNext.vue').default)" />
    <example-card title="Swipe" name="MonthViewSwipe" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewSwipe.vue').default)" />
    <example-card title="Multi-Day Selection" name="MonthViewSelection" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewSelection.vue').default)">
      <q-markdown>
The example below shows how to use the QCalendar to create a multi-day selector. The critical aspect of this is the `selected-start-end-dates` property. This takes an array of two dates (the first should be less or equal to the last). This property really doesn't do much, except to keep the calendar reactive, so that the `day-style` property can be used to style the selected days.

For the example below, click a day, and while holding the mouse down, move to a different day. Keep in mind, this is just one way of handling multi-day selection. if you needed swipe navigation on a mobile, you could modify the code to have independent click on start and end days.

Keep in mind that the functionality below won't work with swipe actions.
      </q-markdown>
    </example-card>

    <example-card title="Slots (day-header and day-body)" name="MonthViewSlots" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewSlots.vue').default)">
      <q-markdown>
For slots that return `day` or `timestamp`, it looks like this:
```js
{
  date: '',       // YYYY-mm-dd
  time: '',       // 00:00:00 (optional)
  year: 0,        // YYYY
  month: 0,       // mm (Jan = 1, etc)
  day: 0,         // day of the month
  weekday: 0,     // week day
  hour: 0,        // 24-hr
  minute: 0,      // mm
  doy: 0,         // day of year
  workweek: 0,    // workweek number
  hasDay: false,  // if this timestamp is supposed to have a date
  hasTime: false, // if this timestamp is supposed to have a time
  past: false,    // if timestamp is in the past (based on `now` property)
  current: false, // if timestamp is current date (based on `now` property)
  future: false,  // if timestamp is in the future (based on `now` property)
  disabled: false // if timestamp is disabled
}
```
      </q-markdown>
    </example-card>
    <example-card title="Slots (week)" name="MonthViewWeekSlot" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewWeekSlot.vue').default)">
      <q-markdown>
The example below uses the **#week** slot (v1.3.2). It's a bit more difficult to work with than the **#day-body** slot, but allows you to have your devland events displayed in a contiguous manner. Check out the sources to see how it is accomplished.
::: warning
Do not mix #day-body and #week slots or you will have overlapping results.
:::
      </q-markdown>
    </example-card>
    <example-card title="Theme" name="MonthViewTheme" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewTheme.vue').default)" />

    <example-title title="Mini-Mode" />
    <q-markdown>
Mini-Mode is a special behavior for QCalendar month view. The property is `mini-mode` and can be set to `true` or `auto`. When set to `true` mini-mode is always on. When set to `auto`, mini-mode will use the `breakpoint` property to determine when to go into mini-mode.

When `mini-mode="auto"`, this works for the width of the screen, not the width of QCalendar. If you need to control mini-mode dynamically, then you need to set `true` or `false` based on your own calculations.

The examples below will be using QSplitter to adjust the width of the QCalendar and to dynamically switch to/from mini-mode. The breakpoint in the examples is **less than 500px**.

Not all examples have been copied over to `mini-mode` examples. They still work, like **Prev/Next** and **Swipe**.

Also, when in `mini-mode` there are some things to be aware of:

1. The property `month-label-size` defaults to `sm`
2. The property `short-weekday-label` is always true
3. The property `show-day-of-year-label` has no effect
4. The month label on first available day of the month is not displayed

Also, regardless of `mini-mode` all slots associated with month view now have additional slotted data: `miniMode`, which is either set to `true` or `false`.
    </q-markdown>

    <example-card title="Mini-Mode - Basic" name="MonthViewBasicMiniMode" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewBasicMiniMode.vue').default)" />
    <example-card title="Mini-Mode - Disabled Days" name="MonthViewDisabledDaysMiniMode" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewDisabledDaysMiniMode.vue').default)" />
    <example-card title="Mini-Mode - 5 Day Work Week" name="MonthViewFiveDayWorkWeekMiniMode" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewFiveDayWorkWeekMiniMode.vue').default)" />
    <example-card title="Mini-Mode - Work Week Numbers" name="MonthViewWorkWeekNumbersMiniMode" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewWorkWeekNumbersMiniMode.vue').default)" />
    <example-card title="Mini-Mode - Selection" name="MonthViewSelectionMiniMode" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewSelectionMiniMode.vue').default)">
      <q-markdown>
There are some considerations when using mini-mode selections. There are 3 special classes: `.q-selected-day-first`, `.q-selected-day` and `.q-selected-day-last` in conjunction with the `day-class` property. These will help you create a selector compliant with [Material Design](https://material.io/components/pickers/#anatomy). See examples below for usage.
      </q-markdown>
    </example-card>
    <example-card title="Mini-Mode - Multi-Month Selection" name="MonthViewMultiMonthSelectionMiniMode" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewMultiMonthSelectionMiniMode.vue').default)">
      <q-markdown>
Using the property `short-weekday-label` while in `mini-mode` gives an even shorter weekday label than normal.
      </q-markdown>
    </example-card>

    <example-card title="Mini-Mode - Slots" name="MonthViewSlotsMiniMode" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewSlotsMiniMode.vue').default)" />
    <example-card title="Mini-Mode - Theme" name="MonthViewThemeMiniMode" :tag-parts="getTagParts(require('!!raw-loader!../examples/MonthViewThemeMiniMode.vue').default)" />

  </div>
</template>

<script>
import ExampleTitle from '../components/ExampleTitle'
import ExampleCard from '../components/ExampleCard'
import { slugify } from 'assets/page-utils'
import { getTagParts } from '@quasar/quasar-ui-qmarkdown'

export default {
  name: 'MonthView',

  components: {
    ExampleTitle,
    ExampleCard
  },

  data () {
    return {
      tempToc: []
    }
  },

  mounted () {
    this.toc = []
    this.tempToc = []
    this.addToToc('Month View')
    this.addToToc('Basic', 2)
    this.addToToc('Color', 2)
    this.addToToc('First Day Monday', 2)
    this.addToToc('5 Day Work Week', 2)
    this.addToToc('Hide Header', 2)
    this.addToToc('Disabled Days', 2)
    this.addToToc('Now', 2)
    this.addToToc('Work Weeks', 2)
    this.addToToc('Short Weekday Label', 2)
    this.addToToc('Short Month Label', 2)
    this.addToToc('Show Day of Year Label', 2)
    this.addToToc('Day Height', 2)
    this.addToToc('Prev/Next', 2)
    this.addToToc('Swipe', 2)
    this.addToToc('Multi-Day Selection', 2)
    this.addToToc('Slots (day-header and day-body)', 2)
    this.addToToc('Slots (week)', 2)
    this.addToToc('Theme', 2)

    this.addToToc('Mini-Mode')
    this.addToToc('Mini-Mode - Basic', 2)
    this.addToToc('Mini-Mode - Disabled Days', 2)
    this.addToToc('Mini-Mode - 5 Day Work Week', 2)
    this.addToToc('Mini-Mode - Work Week Numbers', 2)
    this.addToToc('Mini-Mode - Selection', 2)
    this.addToToc('Mini-Mode - Multi-Month Selection', 2)
    this.addToToc('Mini-Mode - Slots', 2)
    this.addToToc('Mini-Mode - Theme', 2)

    this.toc = this.tempToc
  },

  computed: {
    toc:
    {
      get () {
        return this.$store.state.common.toc
      },
      set (toc) {
        this.$store.commit('common/toc', toc)
      }
    }
  },

  methods: {
    getTagParts,

    addToToc (name, level = 1) {
      const slug = slugify(name)
      this.tempToc.push({
        children: [],
        id: slug,
        label: name,
        level: level
      })
    }
  }
}
</script>

<style lang="sass">
.example-page
  padding: 16px 46px
  font-weight: 300
  max-width: 900px
  margin-left: auto
  margin-right: auto
</style>

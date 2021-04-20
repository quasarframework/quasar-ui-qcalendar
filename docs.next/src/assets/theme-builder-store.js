import { inject, provide, reactive } from 'vue'
import { themeBuilderStoreKey } from './symbols.js'

export function useThemeBuilderStore () {
  return inject(themeBuilderStoreKey)
}

export function provideThemeBuilderStore () {
  const store = {
    currentStyleName: '',
    // TODO: make css vars consistent with actual
    style: {
      '--calendar-border': '#e0e0e0 1px solid',
      '--calendar-border-dark': '#71755d 1px solid',
      '--calendar-border-section': '#e0e0e0 1px dashed',
      '--calendar-border-section-dark': '#71755d 1px dashed',

      '--calendar-border-current': '#027BE3 2px solid',
      '--calendar-border-current-dark': '#ffff66 2px solid',

      '--calendar-mini-range-connector-hover-border': '#027BE3 1px dashed',
      '--calendar-mini-range-connector-hover-border-dark': '#ffff66 1px dashed',

      '--calendar-color': '#606c71',
      '--calendar-color-dark': '#fafafa',
      '--calendar-background': '#ffffff',
      '--calendar-background-dark': '#121212',

      '--calendar-current-color': '#027BE3',
      '--calendar-current-color-dark': '#ffff66',
      '--calendar-current-background': '#00000000',
      '--calendar-current-background-dark': '#121212',

      '--calendar-disabled-date-color': '#a1a1a1',
      '--calendar-disabled-date-color-dark': '#bebebe',
      '--calendar-disabled-date-background': '#ffffff',
      '--calendar-disabled-date-background-dark': '#121212',

      '--calendar-active-date-color': '#027BE3',
      '--calendar-active-date-color-dark': '#ffff66',
      '--calendar-active-date-background': '#ddccf7',
      '--calendar-active-date-background-dark': '#8f44ff',

      '--calendar-outside-color': '#606c71',
      '--calendar-outside-color-dark': '#bebebe',
      '--calendar-outside-background': '#00000000',
      '--calendar-outside-background-dark': '#121212',

      '--calendar-selected-color': '#027BE3',
      '--calendar-selected-color-dark': '#027BE3',
      '--calendar-selected-background': '#cce7ff',
      '--calendar-selected-background-dark': '#cce7ff',

      '--calendar-mini-selected-color': '#027BE3',
      '--calendar-mini-selected-color-dark': '#027BE3',
      '--calendar-mini-selected-background': '#00000000',
      '--calendar-mini-selected-background-dark': '#00000000',
      '--calendar-mini-selected-label-color': '#027BE3',
      '--calendar-mini-selected-label-color-dark': '#cce7ff',
      '--calendar-mini-selected-label-background': '#cce7ff',
      '--calendar-mini-selected-label-background-dark': '#027BE3',

      '--calendar-range-color': '#027BE3',
      '--calendar-range-color-dark': '#027BE3',
      '--calendar-range-background': '#cce7ff',
      '--calendar-range-background-dark': '#cce7ff',

      '--calendar-mini-range-color': '#cce7ff',
      '--calendar-mini-range-color-dark': '#027BE3',
      '--calendar-mini-range-background': '#00000000',
      '--calendar-mini-range-background-dark': '#00000000',
      '--calendar-mini-range-label-color': '#cce7ff',
      '--calendar-mini-range-label-color-dark': '#027BE3',
      '--calendar-mini-range-label-background': '#cce7ff',
      '--calendar-mini-range-label-background-dark': '#cce7ff',
      '--calendar-mini-range-connector-color': '#cce7ff',
      '--calendar-mini-range-connector-color-dark': '#ffff66',
      '--calendar-mini-range-hover-color': '#027BE3',
      '--calendar-mini-range-hover-color-dark': '#ffff66',

      '--calendar-mini-range-firstlast-color': '#cce7ff',
      '--calendar-mini-range-firstlast-color-dark': '#cce7ff',
      '--calendar-mini-range-firstlast-background': '#00000000',
      '--calendar-mini-range-firstlast-background-dark': '#cce7ff',
      '--calendar-mini-range-firstlast-label-color': '#cce7ff',
      '--calendar-mini-range-firstlast-label-color-dark': '#cce7ff',
      '--calendar-mini-range-firstlast-label-background': '#027BE3',
      '--calendar-mini-range-firstlast-label-background-dark': '#ffff66',

      '--calendar-scrollbar-track': '#eeeeee',
      '--calendar-scrollbar-thumb': '#888888',
      '--calendar-scrollbar-thumb-hover': '#555555',
      '--calendar-scrollbar-track-dark': '#eeeeee',
      '--calendar-scrollbar-thumb-dark': '#888888',
      '--calendar-scrollbar-thumb-hover-dark': '#555555',

      '--calendar-intervals-width': '56px',
      '--calendar-work-week-width': '30px',
      '--calendar-mini-work-week-width': '30px',
      '--calendar-work-week-font-size': '1.0em',
      '--calendar-head-font-weight': '600'
    },
    hints: {
      '--calendar-border': 'The regular borders',
      '--calendar-border-dark': '[DARK] The regular borders',
      '--calendar-border-section': 'Interval borders (borders between regular borders for interval-based calendars)',
      '--calendar-border-section-dark': '[DARK] Interval borders (borders between regular borders for interval-based calendars)',

      '--calendar-border-current': 'The border used for `current day`',
      '--calendar-border-current-dark': '[DARK] The border used for `current day`',

      '--calendar-mini-range-connector-hover-border': 'The border to use beween the two selection days when `hover` property is used. Applicable for `month` calendar with property `mini-mode`',
      '--calendar-mini-range-connector-hover-border-dark': '[DARK] The border to use beween the two selection days when `hover` property is used. Applicable for `month` calendar with property `mini-mode`',

      '--calendar-color': 'The text color of the calendar',
      '--calendar-color-dark': '[DARK] The text color of the calendar',
      '--calendar-background': 'The background of the calendar',
      '--calendar-background-dark': '[DARK] The background of the calendar',

      '--calendar-current-color': 'The text color of the `current` date',
      '--calendar-current-color-dark': '[DARK] The text color of the `current` date',
      '--calendar-current-background': 'The background color of the `current` date',
      '--calendar-current-background-dark': '[DARK] The background color of the `current` date',

      '--calendar-disabled-date-color': 'The text color of the `disabled` date',
      '--calendar-disabled-date-color-dark': '[DARK] The text color of the `disabled` date',
      '--calendar-disabled-date-background': 'The background color of the `disabled` date',
      '--calendar-disabled-date-background-dark': '[DARK] The background color of the `disabled` date',

      '--calendar-active-date-color': 'The text color of the `active` date',
      '--calendar-active-date-color-dark': '[DARK] The text color of the `active` date',
      '--calendar-active-date-background': 'The background color of the `active` date',
      '--calendar-active-date-background-dark': '[DARK] The background color of the `active` date',

      '--calendar-outside-color': 'The text color of an `outside` date',
      '--calendar-outside-color-dark': '[DARK] The text color of an `outside` date',
      '--calendar-outside-background': 'The background color of an `outside` date',
      '--calendar-outside-background-dark': '[DARK] The background color of an `outside` date',

      '--calendar-selected-color': 'The text color of a `selected` **date**',
      '--calendar-selected-color-dark': '[DARK] The text color of a `selected` **date**',
      '--calendar-selected-background': 'The background color of a `selected` **date**',
      '--calendar-selected-background-dark': '[DARK] The background color of a `selected` **date**',

      '--calendar-mini-selected-color': 'The text color of a `selected` **date** for `monthly mini-mode`',
      '--calendar-mini-selected-color-dark': '[DARK] The text color of a `selected` **date** for `monthly mini-mode`',
      '--calendar-mini-selected-background': 'The background color of a `selected` **date** for `monthly mini-mode`',
      '--calendar-mini-selected-background-dark': '[DARK] The background color of a `selected` **date** for `monthly mini-mode`',
      '--calendar-mini-selected-label-color': 'The label text color of a `selected` **date** for `monthly mini-mode`',
      '--calendar-mini-selected-label-color-dark': '[DARK] The label text color of a `selected` **date** for `monthly mini-mode`',
      '--calendar-mini-selected-label-background': 'The label background color of a `selected` **date** for `monthly mini-mode`',
      '--calendar-mini-selected-label-background-dark': '[DARK] The label background color of a `selected` **date** for `monthly mini-mode`',

      '--calendar-range-color': 'The text color of a `selected` **day**',
      '--calendar-range-color-dark': '[DARK] The text color of a `selected` **day**',
      '--calendar-range-background': 'The background color of a `selected` **day**',
      '--calendar-range-background-dark': '[DARK] The background color of a `selected` **day**',

      '--calendar-mini-range-color': 'The text color of a `selected` **day** for `monthly mini-mode`',
      '--calendar-mini-range-color-dark': '[DARK] The text color of a `selected` **day** for `monthly mini-mode`',
      '--calendar-mini-range-background': 'The background color of a `selected` **day** for `monthly mini-mode`',
      '--calendar-mini-range-background-dark': '[DARK] The background color of a `selected` **day** for `monthly mini-mode`',
      '--calendar-mini-range-label-color': 'The label text color of a `selected` **day** for `monthly mini-mode`',
      '--calendar-mini-range-label-color-dark': '[DARK] The label text color of a `selected` **day** for `monthly mini-mode`',
      '--calendar-mini-range-label-background': 'The label background color of a `selected` **day** for `monthly mini-mode`',
      '--calendar-mini-range-label-background-dark': '[DARK] The label background color of a `selected` **day** for `monthly mini-mode`',
      '--calendar-mini-range-connector-color': 'The connector color of a `selected` **day** for `monthly mini-mode`',
      '--calendar-mini-range-connector-color-dark': '[DARK] The connector color of a `selected` **day** for `monthly mini-mode`',
      '--calendar-mini-range-hover-color': 'The hover color of a `selected` **day** for `monthly mini-mode` when `hover` property is set',
      '--calendar-mini-range-hover-color-dark': '[DARK] The hover color of a `selected` **day** for `monthly mini-mode` when `hover` property is set',

      '--calendar-mini-range-firstlast-color': 'The text color of the first and last selected days for `monthly mini-mode`',
      '--calendar-mini-range-firstlast-color-dark': '[DARK] The text color of the first and last selected days for `monthly mini-mode`',
      '--calendar-mini-range-firstlast-background': 'The background color of the first and last selected days for `monthly mini-mode`',
      '--calendar-mini-range-firstlast-background-dark': '[DARK] The background color of the first and last selected days for `monthly mini-mode`',
      '--calendar-mini-range-firstlast-label-color': 'The label text color of the first and last selected days for `monthly mini-mode`',
      '--calendar-mini-range-firstlast-label-color-dark': '[DARK] The label text color of the first and last selected days for `monthly mini-mode`',
      '--calendar-mini-range-firstlast-label-background': 'The label background color of the first and last selected days for `monthly mini-mode`',
      '--calendar-mini-range-firstlast-label-background-dark': '[DARK] The label background color of the first and last selected days for `monthly mini-mode`',

      '--calendar-scrollbar-track': 'The color of the scroll track',
      '--calendar-scrollbar-thumb': 'The color of the scroll thumb',
      '--calendar-scrollbar-thumb-hover': 'The color of the scroll thumb when hovering',
      '--calendar-scrollbar-track-dark': '[DARK] The color of the scroll track',
      '--calendar-scrollbar-thumb-dark': '[DARK] The color of the scroll thumb',
      '--calendar-scrollbar-thumb-hover-dark': '[DARK] The color of the scroll thumb when hovering',

      '--calendar-intervals-width': 'The intervals width. Use only `px` unit',
      '--calendar-work-week-width': 'The work week width. Use only `px` unit',
      '--calendar-mini-work-week-width': 'The work week width for `month mini-mode`. Use only `px` unit',
      '--calendar-work-week-font-size': 'The work week font size',
      '--calendar-head-font-weight': 'The header font weight'
    }
  }

  provide(
    themeBuilderStoreKey,
    process.env.SERVER === true ? store : reactive(store)
  )
}

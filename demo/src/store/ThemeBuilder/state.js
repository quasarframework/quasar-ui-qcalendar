export default function () {
  return {
    style: {
      '--calendar-border': '#e0e0e0 1px solid',
      '--calendar-border-dark': '#71755d 1px solid',
      '--calendar-border-section': '#e0e0e0 1px dashed',
      '--calendar-border-section-dark': '#71755d 1px dashed',

      '--calendar-border-current': '#027BE3 2px solid',
      '--calendar-border-current-dark': '#ffff66 2px solid',
      '--calendar-border-droppable': '#027BE3 1px dashed',
      '--calendar-border-droppable-dark': '#ffff66 1px dashed',

      '--calendar-mini-selected-day-connector-hover-border': '#027BE3 1px dashed',
      '--calendar-mini-selected-day-connector-hover-border-dark': '#ffff66 1px dashed',

      '--calendar-color': '#606c71',
      '--calendar-color-dark': '#fafafa',
      '--calendar-background': '#ffffff',
      '--calendar-background-dark': '#121212',

      '--calendar-current-color': '#027BE3',
      '--calendar-current-color-dark': '#ffff66',
      '--calendar-current-background': '#ffffff',
      '--calendar-current-background-dark': '#121212',

      '--calendar-active-date-color': '#027BE3',
      '--calendar-active-date-color-dark': '#ffff66',
      '--calendar-active-date-background': '#ddccf7',
      '--calendar-active-date-background-dark': '#8f44ff',

      '--calendar-outside-color': '#a1a1a1',
      '--calendar-outside-color-dark': '#bebebe',
      '--calendar-outside-background': '#eeeeee',
      '--calendar-outside-background-dark': '#121212',

      '--calendar-selected-date-color': '#027BE3',
      '--calendar-selected-date-color-dark': '#027BE3',
      '--calendar-selected-date-background': '#cce7ff',
      '--calendar-selected-date-background-dark': '#cce7ff',

      '--calendar-mini-selected-date-color': 'unset',
      '--calendar-mini-selected-date-color-dark': '#027BE3',
      '--calendar-mini-selected-date-background': 'unset',
      '--calendar-mini-selected-date-background-dark': '#cce7ff',
      '--calendar-mini-selected-date-label-color': '#027BE3',
      '--calendar-mini-selected-date-label-color-dark': '#cce7ff',
      '--calendar-mini-selected-date-label-background': '#cce7ff',
      '--calendar-mini-selected-date-label-background-dark': '#027BE3',

      '--calendar-selected-day-color': '#027BE3',
      '--calendar-selected-day-color-dark': '#027BE3',
      '--calendar-selected-day-background': '#cce7ff',
      '--calendar-selected-day-background-dark': '#cce7ff',

      '--calendar-mini-selected-day-color': '#cce7ff',
      '--calendar-mini-selected-day-color-dark': '#027BE3',
      '--calendar-mini-selected-day-background': 'unset',
      '--calendar-mini-selected-day-background-dark': 'unset',
      '--calendar-mini-selected-day-label-color': '#cce7ff',
      '--calendar-mini-selected-day-label-color-dark': '#027BE3',
      '--calendar-mini-selected-day-label-background': '#cce7ff',
      '--calendar-mini-selected-day-label-background-dark': '#cce7ff',
      '--calendar-mini-selected-day-connector-color': '#cce7ff',
      '--calendar-mini-selected-day-connector-color-dark': '#ffff66',
      '--calendar-mini-selected-day-hover-color': '#027BE3',
      '--calendar-mini-selected-day-hover-color-dark': '#ffff66',

      '--calendar-mini-selected-day-firstlast-color': '#cce7ff',
      '--calendar-mini-selected-day-firstlast-color-dark': '#cce7ff',
      '--calendar-mini-selected-day-firstlast-background': 'unset',
      '--calendar-mini-selected-day-firstlast-background-dark': '#cce7ff',
      '--calendar-mini-selected-day-firstlast-label-color': '#cce7ff',
      '--calendar-mini-selected-day-firstlast-label-color-dark': '#cce7ff',
      '--calendar-mini-selected-day-firstlast-label-background': '#027BE3',
      '--calendar-mini-selected-day-firstlast-label-background-dark': '#ffff66',

      '--calendar-intervals-width': '56px',
      '--calendar-work-week-width': '30px',
      '--calendar-mini-work-week-width': '30',
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
      '--calendar-border-droppable': 'The border to be used for a `drop event`',
      '--calendar-border-droppable-dark': '[DARK] The border to be used for a `drop event`',

      '--calendar-mini-selected-day-connector-hover-border': 'The border to use beween the two selection days when `hover` property is used. Applicable for `month` calendar with property `mini-mode`',
      '--calendar-mini-selected-day-connector-hover-border-dark': '[DARK] The border to use beween the two selection days when `hover` property is used. Applicable for `month` calendar with property `mini-mode`',

      '--calendar-color': 'The text color of the calendar',
      '--calendar-color-dark': '[DARK] The text color of the calendar',
      '--calendar-background': 'The background of the calendar',
      '--calendar-background-dark': '[DARK] The background of the calendar',

      '--calendar-current-color': 'The text color of the `current` date',
      '--calendar-current-color-dark': '[DARK] The text color of the `current` date',
      '--calendar-current-background': 'The background color of the `current` date',
      '--calendar-current-background-dark': '[DARK] The background color of the `current` date',

      '--calendar-active-date-color': 'The text color of the `active` date',
      '--calendar-active-date-color-dark': '[DARK] The text color of the `active` date',
      '--calendar-active-date-background': 'The background color of the `active` date',
      '--calendar-active-date-background-dark': '[DARK] The background color of the `active` date',

      '--calendar-outside-color': 'The text color of an `outside` date',
      '--calendar-outside-color-dark': '[DARK] The text color of an `outside` date',
      '--calendar-outside-background': 'The background color of an `outside` date',
      '--calendar-outside-background-dark': '[DARK] The background color of an `outside` date',

      '--calendar-selected-date-color': 'The text color of a `selected` **date**',
      '--calendar-selected-date-color-dark': '[DARK] The text color of a `selected` **date**',
      '--calendar-selected-date-background': 'The background color of a `selected` **date**',
      '--calendar-selected-date-background-dark': '[DARK] The background color of a `selected` **date**',

      '--calendar-mini-selected-date-color': 'The text color of a `selected` **date** for `monthly mini-mode`',
      '--calendar-mini-selected-date-color-dark': '[DARK] The text color of a `selected` **date** for `monthly mini-mode`',
      '--calendar-mini-selected-date-background': 'The background color of a `selected` **date** for `monthly mini-mode`',
      '--calendar-mini-selected-date-background-dark': '[DARK] The background color of a `selected` **date** for `monthly mini-mode`',
      '--calendar-mini-selected-date-label-color': 'The label text color of a `selected` **date** for `monthly mini-mode`',
      '--calendar-mini-selected-date-label-color-dark': '[DARK] The label text color of a `selected` **date** for `monthly mini-mode`',
      '--calendar-mini-selected-date-label-background': 'The label background color of a `selected` **date** for `monthly mini-mode`',
      '--calendar-mini-selected-date-label-background-dark': '[DARK] The label background color of a `selected` **date** for `monthly mini-mode`',

      '--calendar-selected-day-color': 'The text color of a `selected` **day**',
      '--calendar-selected-day-color-dark': '[DARK] The text color of a `selected` **day**',
      '--calendar-selected-day-background': 'The background color of a `selected` **day**',
      '--calendar-selected-day-background-dark': '[DARK] The background color of a `selected` **day**',

      '--calendar-mini-selected-day-color': 'The text color of a `selected` **day** for `monthly mini-mode`',
      '--calendar-mini-selected-day-color-dark': '[DARK] The text color of a `selected` **day** for `monthly mini-mode`',
      '--calendar-mini-selected-day-background': 'The background color of a `selected` **day** for `monthly mini-mode`',
      '--calendar-mini-selected-day-background-dark': '[DARK] The background color of a `selected` **day** for `monthly mini-mode`',
      '--calendar-mini-selected-day-label-color': 'The label text color of a `selected` **day** for `monthly mini-mode`',
      '--calendar-mini-selected-day-label-color-dark': '[DARK] The label text color of a `selected` **day** for `monthly mini-mode`',
      '--calendar-mini-selected-day-label-background': 'The label background color of a `selected` **day** for `monthly mini-mode`',
      '--calendar-mini-selected-day-label-background-dark': '[DARK] The label background color of a `selected` **day** for `monthly mini-mode`',
      '--calendar-mini-selected-day-connector-color': 'The connector color of a `selected` **day** for `monthly mini-mode`',
      '--calendar-mini-selected-day-connector-color-dark': '[DARK] The connector color of a `selected` **day** for `monthly mini-mode`',
      '--calendar-mini-selected-day-hover-color': 'The hover color of a `selected` **day** for `monthly mini-mode` when `hover` property is set',
      '--calendar-mini-selected-day-hover-color-dark': '[DARK] The hover color of a `selected` **day** for `monthly mini-mode` when `hover` property is set',

      '--calendar-mini-selected-day-firstlast-color': 'The text color of the first and last selected days for `monthly mini-mode`',
      '--calendar-mini-selected-day-firstlast-color-dark': '[DARK] The text color of the first and last selected days for `monthly mini-mode`',
      '--calendar-mini-selected-day-firstlast-background': 'The background color of the first and last selected days for `monthly mini-mode`',
      '--calendar-mini-selected-day-firstlast-background-dark': '[DARK] The background color of the first and last selected days for `monthly mini-mode`',
      '--calendar-mini-selected-day-firstlast-label-color': 'The label text color of the first and last selected days for `monthly mini-mode`',
      '--calendar-mini-selected-day-firstlast-label-color-dark': '[DARK] The label text color of the first and last selected days for `monthly mini-mode`',
      '--calendar-mini-selected-day-firstlast-label-background': 'The label background color of the first and last selected days for `monthly mini-mode`',
      '--calendar-mini-selected-day-firstlast-label-background-dark': '[DARK] The label background color of the first and last selected days for `monthly mini-mode`',

      '--calendar-intervals-width': 'The intervals width',
      '--calendar-work-week-width': 'The work week width',
      '--calendar-mini-work-week-width': 'The work week width for `month mini-mode`',
      '--calendar-work-week-font-size': 'The work week font size',
      '--calendar-head-font-weight': 'The header font weight'
    }
  }
}

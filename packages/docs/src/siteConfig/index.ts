import { fabGithub, fabXTwitter } from '@quasar/extras/fontawesome-v6'
import { slugify } from '@md-plugins/shared'
import { version, productName } from '../../../ui/package.json'

export interface SocialLink {
  name: string
  icon: string
  path: string
  external?: boolean
}

export interface SiteMenuItem extends MenuItem {
  about?: string
  expanded?: boolean
  external?: boolean
  children?: SiteMenuItem[]
  separator?: boolean
  header?: string
  mq?: number
  extract?: string
  image?: string
  maxWidth?: string
}

export interface LinksConfig {
  primaryHeaderLinks: SiteMenuItem[]
  secondaryHeaderLinks: SiteMenuItem[]
  moreLinks: SiteMenuItem[]
  footerLinks: SiteMenuItem[]
  socialLinks: SocialLink[]
  ecoSystemLinks?: SiteMenuItem[]
}

export interface LogoConfig {
  showLogo: boolean
  logoLight: string
  logoDark: string
  logoAlt: string
}

export interface versionConfig {
  showTitle: boolean
  showVersion: boolean
  showOnHeader: boolean
  showOnSidebar: boolean
}

export interface UIConfig {
  usePrimaryHeader: boolean // typically 72px
  useSecondaryHeader: boolean // typically 55px
  headerHeightHint: number // typically 128 for both headers
  useMoreLinks: boolean
  useFooter: boolean
  useSidebar: boolean
  useToc: boolean
}

export interface CopyrightConfig {
  line1: string
  line2: string
}

export interface LicenseConfig {
  label: string
  link: string
}

export interface PrivacyConfig {
  label: string
  link: string
}

export interface SiteConfig {
  lang: string
  title: string
  description: string
  theme: string
  version: string
  copyright: CopyrightConfig
  githubEditRootSrc: string
  license: LicenseConfig
  privacy: PrivacyConfig
  logoConfig: LogoConfig
  versionConfig: versionConfig
  config: UIConfig
  links: LinksConfig
  sidebar: MenuItem[]
}

function processMenuItem(item: MenuItem): MenuItem {
  return {
    name: item.name,
    path: slugify(item.name),
    expanded: item.expanded ?? false,
    children: item.children ? item.children.map(processMenuItem) : undefined,
  }
}

const socialLinks = {
  name: 'Social',
  mq: 1400, // media query breakpoint
  children: [
    {
      name: 'GitHub',
      icon: fabGithub,
      path: 'https://github.com/quasarframework/quasar-ui-qcalendar/tree/dev',
      external: true,
    },
    {
      name: 'X (Twitter)',
      icon: fabXTwitter,
      path: 'https://twitter.com/jgalbraith64',
      external: true,
    },
  ],
}

const netlifyLink = {
  path: 'https://www.netlify.com',
  external: true,
  image: 'https://www.netlify.com/img/global/badges/netlify-color-accent.svg',
  name: 'Deploys by Netlify',
  maxWidth: '120px',
}

const SponsorsLinks = {
  name: 'Sponsors',
  children: [
    {
      name: netlifyLink.name,
      path: netlifyLink.path,
      external: netlifyLink.external,
      image: netlifyLink.image,
    },
  ],
}

const footerLinks = [
  {
    name: SponsorsLinks.name,
    children: [...SponsorsLinks.children],
  },
  {
    name: socialLinks.name,
    children: [...socialLinks.children],
  },
]

const gettingStartedMenu: SiteMenuItem = {
  name: 'Getting Started',
  mq: 470, // media query breakpoint
  children: [
    { name: 'Introduction', path: '/getting-started/introduction' },
    { name: 'Installation', path: '/getting-started/installation' },
    { name: 'Quick Start', path: '/getting-started/quick-start' },
    { name: 'Anatomy of a Calendar', path: '/getting-started/anatomy-of-a-calendar' },
    { name: 'Transitions', path: '/getting-started/transitions' },
    { name: 'Themes', path: '/getting-started/themes' },
  ],
}

const developingMenu = {
  name: 'Developing',
  mq: 600, // media query breakpoint
  children: [
    { name: 'QCalendar', path: '/developing/qcalendar' },
    { name: 'QCalendarAgenda', path: '/developing/qcalendar-agenda' },
    { name: 'QCalendarDay', path: '/developing/qcalendar-day' },
    { name: 'QCalendarDay (Week)', path: '/developing/qcalendar-day-week' },
    { name: 'QCalendarDay (Intervals)', path: '/developing/qcalendar-day-intervals' },
    { name: 'QCalendarMonth', path: '/developing/qcalendar-month' },
    { name: 'QCalendarMonth (mini-mode)', path: '/developing/qcalendar-month-mini-mode' },
    { name: 'QCalendarResource', path: '/developing/qcalendar-resource' },
    { name: 'QCalendarScheduler', path: '/developing/qcalendar-scheduler' },
    { name: 'QCalendarTask', path: '/developing/qcalendar-task' },
    { name: 'Timestamp', path: '/developing/timestamp' },
    { name: 'FAQ', path: '/developing/faq' },
  ],
}

const examplesMenu = {
  name: 'Examples',
  mq: 750, // media query breakpoint
  children: [
    {
      name: 'Agenda',
      children: [
        { name: 'Alignment', path: '/examples/agenda/alignment' },
        { name: 'Cell Width', path: '/examples/agenda/cell-width' },
        { name: 'Column Count', path: '/examples/agenda/column-count' },
        { name: 'Column Options', path: '/examples/agenda/column-options' },
        { name: 'Dark', path: '/examples/agenda/dark' },
        { name: 'Date Type', path: '/examples/agenda/date-type' },
        { name: 'Day Week Max Days', path: '/examples/agenda/day-week-max-days' },
        { name: 'Disabled Before After', path: '/examples/agenda/disabled-before-after' },
        { name: 'Disabled Days', path: '/examples/agenda/disabled-days' },
        { name: 'Disabled Weekdays', path: '/examples/agenda/disabled-weekdays' },
        { name: 'First Day Monday', path: '/examples/agenda/first-day-monday' },
        { name: 'Five Day Workweek', path: '/examples/agenda/five-day-workweek' },
        { name: 'Locale', path: '/examples/agenda/locale' },
        { name: 'No Active Date', path: '/examples/agenda/no-active-date' },
        { name: 'Now', path: '/examples/agenda/now' },
        { name: 'Planner', path: '/examples/agenda/planner' },
        { name: 'Theme', path: '/examples/agenda/theme' },
        { name: 'Transitions', path: '/examples/agenda/transitions' },
      ],
    },
    {
      name: 'Day',
      children: [
        { name: '3 Day', path: '/examples/day/_3-day' },
        { name: 'Alignment', path: '/examples/day/alignment' },
        { name: 'Cell Width', path: '/examples/day/cell-width' },
        { name: 'Column Count', path: '/examples/day/column-count' },
        { name: 'Column Count Plus', path: '/examples/day/column-count-plus' },
        { name: 'Custom Header', path: '/examples/day/custom-header' },
        { name: 'Dark', path: '/examples/day/dark' },
        { name: 'Date Type', path: '/examples/day/date-type' },
        { name: 'Disabled Before After', path: '/examples/day/disabled-before-after' },
        { name: 'Disabled Days', path: '/examples/day/disabled-days' },
        { name: 'Disabled Weekdays', path: '/examples/day/disabled-weekdays' },
        { name: 'Drag And Drop', path: '/examples/day/drag-and-drop' },
        { name: 'Hour 24 Format', path: '/examples/day/hour-24-format' },
        { name: 'Interval Count', path: '/examples/day/interval-count' },
        { name: 'Interval Height', path: '/examples/day/interval-height' },
        { name: 'Interval Minutes 15', path: '/examples/day/interval-minutes-15' },
        { name: 'Interval Minutes 30', path: '/examples/day/interval-minutes-30' },
        { name: 'Interval Start', path: '/examples/day/interval-start' },
        { name: 'Locale', path: '/examples/day/locale' },
        { name: 'Max Days', path: '/examples/day/max-days' },
        { name: 'Modify Intervals', path: '/examples/day/modify-intervals' },
        { name: 'Month', path: '/examples/day/month' },
        { name: 'Navigation', path: '/examples/day/navigation' },
        { name: 'No Active Date', path: '/examples/day/no-active-date' },
        { name: 'No Header', path: '/examples/day/no-header' },
        { name: 'No Scroll', path: '/examples/day/no-scroll' },
        { name: 'Now', path: '/examples/day/now' },
        { name: 'Selected Intervals', path: '/examples/day/selected-intervals' },
        { name: 'Selection', path: '/examples/day/selection' },
        { name: 'Slot Column Header', path: '/examples/day/slot-column-header' },
        { name: 'Slot Day Body', path: '/examples/day/slot-day-body' },
        {
          name: 'Slot Day Container Show Current Time',
          path: '/examples/day/slot-day-container-show-current-time',
        },
        { name: 'Slot Head Day', path: '/examples/day/slot-head-day' },
        { name: 'Slot Head Day Event', path: '/examples/day/slot-head-day-event' },
        { name: 'Slot Head Intervals', path: '/examples/day/slot-head-intervals' },
        { name: 'Theme', path: '/examples/day/theme' },
        { name: 'Transitions', path: '/examples/day/transitions' },
      ],
    },
    {
      name: 'General',
      children: [{ name: 'Calendar All', path: '/examples/general/calendar-all' }],
    },
    {
      name: 'Intervals',
      children: [
        { name: 'Month Cell Width', path: '/examples/intervals/month-cell-width' },
        { name: 'Month Navigation', path: '/examples/intervals/month-navigation' },
      ],
    },
    {
      name: 'Mini Mode',
      children: [
        { name: 'Breakpoint', path: '/examples/minimode/breakpoint' },
        { name: 'Dark', path: '/examples/minimode/dark' },
        { name: 'Date Type', path: '/examples/minimode/date-type' },
        { name: 'Disabled Before After', path: '/examples/minimode/disabled-before-after' },
        { name: 'Disabled Days', path: '/examples/minimode/disabled-days' },
        { name: 'Disabled Weekdays', path: '/examples/minimode/disabled-weekdays' },
        { name: 'First Day Monday', path: '/examples/minimode/first-day-monday' },
        { name: 'Five Day Workweek', path: '/examples/minimode/five-day-workweek' },
        { name: 'Locale', path: '/examples/minimode/locale' },
        { name: 'Min Weekday Label', path: '/examples/minimode/min-weekday-label' },
        { name: 'Min Weeks', path: '/examples/minimode/min-weeks' },
        { name: 'Multi Month Selection', path: '/examples/minimode/multi-month-selection' },
        { name: 'Navigation', path: '/examples/minimode/navigation' },
        { name: 'No Active Date', path: '/examples/minimode/no-active-date' },
        { name: 'No Outside Days', path: '/examples/minimode/no-outside-days' },
        { name: 'Now', path: '/examples/minimode/now' },
        { name: 'QInput', path: '/examples/minimode/qinput' },
        { name: 'Selected Dates', path: '/examples/minimode/selected-dates' },
        { name: 'Selection', path: '/examples/minimode/selection' },
        { name: 'Theme', path: '/examples/minimode/theme' },
        { name: 'Workweeks', path: '/examples/minimode/workweeks' },
      ],
    },
    {
      name: 'Month',
      children: [
        { name: 'Alignment', path: '/examples/month/alignment' },
        { name: 'Dark', path: '/examples/month/dark' },
        { name: 'Date Type', path: '/examples/month/date-type' },
        { name: 'Day Height', path: '/examples/month/day-height' },
        { name: 'Day Of Year', path: '/examples/month/day-of-year' },
        { name: 'Disabled Before After', path: '/examples/month/disabled-before-after' },
        { name: 'Disabled Days', path: '/examples/month/disabled-days' },
        { name: 'Disabled Weekdays', path: '/examples/month/disabled-weekdays' },
        { name: 'Drag And Drop', path: '/examples/month/drag-and-drop' },
        { name: 'First Day Monday', path: '/examples/month/first-day-monday' },
        { name: 'Five Day Workweek', path: '/examples/month/five-day-workweek' },
        { name: 'Focusable Hoverable', path: '/examples/month/focusable-hoverable' },
        { name: 'Label Size', path: '/examples/month/label-size' },
        { name: 'Locale', path: '/examples/month/locale' },
        { name: 'Min Weeks', path: '/examples/month/min-weeks' },
        { name: 'Navigation', path: '/examples/month/navigation' },
        { name: 'No Active Date', path: '/examples/month/no-active-date' },
        { name: 'No Outside Days', path: '/examples/month/no-outside-days' },
        { name: 'Now', path: '/examples/month/now' },
        { name: 'Selected Dates', path: '/examples/month/selected-dates' },
        { name: 'Selection', path: '/examples/month/selection' },
        { name: 'Slot Day', path: '/examples/month/slot-day' },
        { name: 'Slot Day Holidays', path: '/examples/month/slot-day-holidays' },
        { name: 'Slot Week', path: '/examples/month/slot-week' },
        { name: 'Theme', path: '/examples/month/theme' },
        { name: 'Transitions', path: '/examples/month/transitions' },
        { name: 'Workweeks', path: '/examples/month/workweeks' },
      ],
    },
    {
      name: 'Resource',
      children: [
        { name: 'Children', path: '/examples/resource/children' },
        { name: 'Custom Height', path: '/examples/resource/custom-height' },
        { name: 'Dark', path: '/examples/resource/dark' },
        { name: 'Focusable Hoverable', path: '/examples/resource/focusable-hoverable' },
        { name: 'Hour 24 Format', path: '/examples/resource/hour-24-format' },
        { name: 'Modify Intervals', path: '/examples/resource/modify-intervals' },
        { name: 'No Sticky', path: '/examples/resource/no-sticky' },
        { name: 'Slot Head Resources', path: '/examples/resource/slot-head-resources' },
        { name: 'Slot Interval Label', path: '/examples/resource/slot-interval-label' },
        { name: 'Slot Resource Intervals', path: '/examples/resource/slot-resource-intervals' },
        { name: 'Slot Resource Label', path: '/examples/resource/slot-resource-label' },
        { name: 'Theme', path: '/examples/resource/theme' },
        { name: 'Width Height', path: '/examples/resource/width-height' },
      ],
    },
    {
      name: 'Scheduler',
      children: [
        { name: 'Alignment', path: '/examples/scheduler/alignment' },
        { name: 'Cell Width', path: '/examples/scheduler/cell-width' },
        { name: 'Children', path: '/examples/scheduler/children' },
        { name: 'Custom Height', path: '/examples/scheduler/custom-height' },
        { name: 'Dark', path: '/examples/scheduler/dark' },
        { name: 'Date Type', path: '/examples/scheduler/date-type' },
        { name: 'Disabled Before After', path: '/examples/scheduler/disabled-before-after' },
        { name: 'Disabled Days', path: '/examples/scheduler/disabled-days' },
        { name: 'Disabled Weekdays', path: '/examples/scheduler/disabled-weekdays' },
        { name: 'Drag And Drop', path: '/examples/scheduler/drag-and-drop' },
        { name: 'First Day Monday', path: '/examples/scheduler/first-day-monday' },
        { name: 'Five Day Workweek', path: '/examples/scheduler/five-day-workweek' },
        { name: 'Focusable Hoverable', path: '/examples/scheduler/focusable-hoverable' },
        { name: 'Locale', path: '/examples/scheduler/locale' },
        { name: 'No Active Date', path: '/examples/scheduler/no-active-date' },
        { name: 'Now', path: '/examples/scheduler/now' },
        { name: 'Slot Head Resources', path: '/examples/scheduler/slot-head-resources' },
        { name: 'Slot Resource Days', path: '/examples/scheduler/slot-resource-days' },
        { name: 'Slot Resource Label', path: '/examples/scheduler/slot-resource-label' },
        { name: 'Theme', path: '/examples/scheduler/theme' },
        { name: 'Width Height', path: '/examples/scheduler/width-height' },
      ],
    },
    {
      name: 'Task',
      children: [
        { name: 'Alignment', path: '/examples/task/alignment' },
        { name: 'Children', path: '/examples/task/children' },
        { name: 'Colored Weekends', path: '/examples/task/colored-weekends' },
        { name: 'Custom Height', path: '/examples/task/custom-height' },
        { name: 'Dark', path: '/examples/task/dark' },
        { name: 'Date Type', path: '/examples/task/date-type' },
        { name: 'Disabled Before After', path: '/examples/task/disabled-before-after' },
        { name: 'Disabled Days', path: '/examples/task/disabled-days' },
        { name: 'Disabled Weekdays', path: '/examples/task/disabled-weekdays' },
        { name: 'Focusable Hoverable', path: '/examples/task/focusable-hoverable' },
        { name: 'Locale', path: '/examples/task/locale' },
        { name: 'Month', path: '/examples/task/month' },
        { name: 'Multiple Footer Rows', path: '/examples/task/multiple-footer-rows' },
        { name: 'No Active Date', path: '/examples/task/no-active-date' },
        { name: 'No Weekends', path: '/examples/task/no-weekends' },
        { name: 'Now', path: '/examples/task/now' },
        { name: 'Theme', path: '/examples/task/theme' },
        { name: 'Title Rows', path: '/examples/task/title-rows' },
        { name: 'Week', path: '/examples/task/week' },
      ],
    },
    {
      name: 'Week',
      children: [
        { name: '24 Hour', path: '/examples/week/24-hour' },
        { name: 'Alignment', path: '/examples/week/alignment' },
        { name: 'Cell Width', path: '/examples/week/cell-width' },
        { name: 'Dark', path: '/examples/week/dark' },
        { name: 'Date Type', path: '/examples/week/date-type' },
        { name: 'Disabled Before After', path: '/examples/week/disabled-before-after' },
        { name: 'Disabled Days', path: '/examples/week/disabled-days' },
        { name: 'Disabled Weekdays', path: '/examples/week/disabled-weekdays' },
        { name: 'Drag And Drop', path: '/examples/week/drag-and-drop' },
        { name: 'First Day Monday', path: '/examples/week/first-day-monday' },
        { name: 'Five Day Workweek', path: '/examples/week/five-day-workweek' },
        { name: 'Focusable Hoverable', path: '/examples/week/focusable-hoverable' },
        { name: 'Interval Count', path: '/examples/week/interval-count' },
        { name: 'Interval Height', path: '/examples/week/interval-height' },
        { name: 'Interval Minutes 15', path: '/examples/week/interval-minutes-15' },
        { name: 'Interval Minutes 30', path: '/examples/week/interval-minutes-30' },
        { name: 'Interval Start', path: '/examples/week/interval-start' },
        { name: 'Locale', path: '/examples/week/locale' },
        { name: 'Modify Intervals', path: '/examples/week/modify-intervals' },
        { name: 'Navigation', path: '/examples/week/navigation' },
        { name: 'No Active Date', path: '/examples/week/no-active-date' },
        { name: 'No Header', path: '/examples/week/no-header' },
        { name: 'No Scroll', path: '/examples/week/no-scroll' },
        { name: 'Now', path: '/examples/week/now' },
        { name: 'Selected Intervals', path: '/examples/week/selected-intervals' },
        { name: 'Selection', path: '/examples/week/selection' },
        { name: 'Slot Column Header', path: '/examples/week/slot-column-header' },
        { name: 'Slot Day Body', path: '/examples/week/slot-day-body' },
        {
          name: 'Slot Day Container Show Current Time',
          path: '/examples/week/slot-day-container-show-current-time',
        },
        { name: 'Slot Day Interval', path: '/examples/week/slot-day-interval' },
        { name: 'Slot Head Day', path: '/examples/week/slot-head-day' },
        { name: 'Slot Head Day Event', path: '/examples/week/slot-head-day-event' },
        {
          name: 'Slot Head Days Event Absolute',
          path: '/examples/week/slot-head-days-event-absolute',
        },
        { name: 'Slot Head Intervals', path: '/examples/week/slot-head-intervals' },
        { name: 'Theme', path: '/examples/week/theme' },
      ],
    },
  ],
}

// const guidesMenu: SiteMenuItem = {
//   name: 'Guides',
//   mq: 1100, // media query breakpoint
//   children: [
//     {
//       name: 'FAQ',
//       path: '/guides/faq',
//     },
//     {
//       name: 'Contributing',
//       path: '/guides/contributing',
//     },
//   ],
// }

const otherMenu: SiteMenuItem = {
  name: 'Other',
  mq: 1190, // media query breakpoint
  children: [
    {
      name: 'Releases',
      path: '/other/release-notes',
    },
    {
      name: 'Migration Guide',
      path: '/other/migration-guide',
    },
    {
      name: 'Contact',
      path: '/other/contact',
    },
    // { separator: true },
    {
      name: 'Contributing',
      children: [
        {
          name: 'Overview',
          path: '/other/contributing/overview',
        },
        {
          name: 'Bugs and Feature Requests',
          path: '/other/contributing/bugs-and-feature-requests',
        },
        {
          name: 'Components',
          path: '/other/contributing/components',
        },
        {
          name: 'Documentation',
          path: '/other/contributing/documentation',
        },
        {
          name: 'Call to Action',
          path: '/other/contributing/call-to-action',
        },
        {
          name: 'Sponsor',
          path: '/other/contributing/sponsor',
        },
      ],
    },
  ],
}

const processedDevelopingMenu = {
  name: developingMenu.name,
  path: slugify(developingMenu.name),
  expanded: false,
  children: developingMenu.children ? developingMenu.children.map(processMenuItem) : [],
}

const processedExamplesMenu = {
  name: examplesMenu.name,
  path: slugify(examplesMenu.name),
  expanded: false,
  children: examplesMenu.children ? examplesMenu.children.map(processMenuItem) : [],
}

// const processedGuidesMenu = {
//   name: guidesMenu.name,
//   path: slugify(guidesMenu.name),
//   expanded: false,
//   children: guidesMenu.children ? guidesMenu.children.map(processMenuItem) : [],
// }

const secondaryToolbarLinks = [
  gettingStartedMenu,
  developingMenu,
  examplesMenu,
  // guidesMenu,
  otherMenu,
]

export const moreLinks: SiteMenuItem[] = [
  {
    name: 'More',
    // children: [...primaryToolbarLinks, { separator: true }, ...secondaryToolbarLinks, socialLinks],
    children: [...secondaryToolbarLinks, socialLinks],
  },
]

export const sidebar = [
  {
    name: gettingStartedMenu.name,
    path: slugify(gettingStartedMenu.name),
    expanded: false,
    children: gettingStartedMenu.children
      ? gettingStartedMenu.children.map((item) => ({
          name: item.name,
          path: slugify(item.name),
        }))
      : [],
  },
  processedDevelopingMenu,
  processedExamplesMenu,
  // {
  //   name: examplesMenu.name,
  //   path: '',
  //   expanded: false,
  //   children: examplesMenu.children,
  // },

  // processedGuidesMenu,
]

const config = {
  lang: 'en-US',
  title: productName,
  description: 'Build Beautiful, Responsive Calendars for Vue and Quasar',
  theme: 'doc',
  version: version,
  copyright: {
    line1: `Copyright © 2018-${new Date().getFullYear()} Jeff Galbraith`,
    line2: '',
  } as CopyrightConfig,
  githubEditRootSrc:
    'https://github.com/quasarframework/quasar-ui-qcalendar/edit/dev/packages/docs/src',
  license: {
    label: 'MIT License',
    link: 'https://github.com/quasarframework/quasar-ui-qcalendar/blob/next/LICENSE.md',
  } as LicenseConfig,
  privacy: {
    label: 'Privacy Policy',
    link: '/privacy-policy',
  } as PrivacyConfig,
  logoConfig: {
    showLogo: true,
    logoLight: '/qcalendar-logo.png',
    logoDark: '/qcalendar-logo.png',
    logoAlt: 'QCalendar Logo',
  } as LogoConfig,
  versionConfig: {
    showTitle: true,
    showVersion: true,
    showOnHeader: false,
    showOnSidebar: true,
  } as versionConfig,
  config: {
    usePrimaryHeader: false,
    useSecondaryHeader: true,
    headerHeightHint: 55,
    useMoreLinks: true,
    useFooter: true,
    // useFooterLinks: true,
    useSidebar: true,
    useSidebarVersion: true,
    useToc: true,
  } as UIConfig,
  links: {
    primaryHeaderLinks: [] as SiteMenuItem[], // [...primaryToolbarLinks],
    secondaryHeaderLinks: [...secondaryToolbarLinks] as SiteMenuItem[],
    moreLinks,
    footerLinks: [...footerLinks] as SiteMenuItem[],
    socialLinks: [...socialLinks.children] as SocialLink[],
  },
  sidebar,
} as SiteConfig

export { sidebar as menu }
export default config

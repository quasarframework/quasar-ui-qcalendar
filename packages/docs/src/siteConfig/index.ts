import { fabGithub, fabXTwitter } from '@quasar/extras/fontawesome-v7'
import { version, productName } from '../../../ui/package.json'
import { slugify } from '../.q-press/components/markdown-utils'

const repoBranch = 'v5-beta'
const codepenPackageVersion = version.includes('-beta.') ? 'beta' : version

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

export interface CodepenGlobalPackage {
  packageName: string
  globalName: string
}

export interface CodepenModulePackage {
  packageName: string
  importUrl: string
}

export interface CodepenConfig {
  cssExternal?: string[]
  jsExternal?: string[]
  jsPreProcessor?: string
  titleSuffix?: string
  jsSetup?: string
  head?: string
  globalPackages?: CodepenGlobalPackage[]
  modulePackages?: CodepenModulePackage[]
}

export interface SiteConfig {
  lang: string
  title: string
  description: string
  theme: string
  version: string
  copyright: CopyrightConfig
  githubEditRootSrc: string
  githubSourceRootSrc?: string
  codepen?: CodepenConfig
  license: LicenseConfig
  privacy: PrivacyConfig
  logoConfig: LogoConfig
  versionConfig: versionConfig
  config: UIConfig
  links: LinksConfig
  sidebar: MenuItem[]
}

function getSidebarPath(item: MenuItem): string {
  if (item.external === true) {
    return item.path ?? slugify(item.name)
  }

  const path = item.path?.replace(/^\/+/, '').split('/').filter(Boolean).pop()
  return path ?? slugify(item.name)
}

function processMenuItem(item: MenuItem): MenuItem {
  return {
    name: item.name,
    path: getSidebarPath(item),
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
      path: `https://github.com/quasarframework/quasar-ui-qcalendar/tree/${repoBranch}`,
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
  image: 'https://www.netlify.com/assets/badges/netlify-badge-color-accent.svg',
  name: 'Deploys by Netlify',
  maxWidth: '120px',
}

const sponsorLink = {
  path: 'https://github.com/sponsors/hawkeye64',
  external: true,
  image: 'https://github.com/hawkeye64.png?size=96',
  name: 'Sponsor Jeff',
  maxWidth: '24px',
}
const SponsorsLinks = {
  name: 'Sponsors',
  children: [
    {
      name: netlifyLink.name,
      path: netlifyLink.path,
      external: netlifyLink.external,
      image: netlifyLink.image,
      maxWidth: netlifyLink.maxWidth,
    },
    {
      name: sponsorLink.name,
      path: sponsorLink.path,
      external: sponsorLink.external,
      image: sponsorLink.image,
      maxWidth: sponsorLink.maxWidth,
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
    { name: 'Theme Builder', path: '/theme-builder' },
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
    { name: 'Timestamp Recipes', path: '/developing/timestamp-recipes' },
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
        { name: 'Date Type', path: '/examples/agenda/date-type' },
        { name: 'Dark', path: '/examples/agenda/dark' },
        { name: 'Alignment', path: '/examples/agenda/alignment' },
        { name: 'Cell Width', path: '/examples/agenda/cell-width' },
        { name: 'Column Count', path: '/examples/agenda/column-count' },
        { name: 'Column Options', path: '/examples/agenda/column-options' },
        { name: 'Day Week Max Days', path: '/examples/agenda/day-week-max-days' },
        { name: 'Disabled Before After', path: '/examples/agenda/disabled-before-after' },
        { name: 'Disabled Days', path: '/examples/agenda/disabled-days' },
        { name: 'Disabled Weekdays', path: '/examples/agenda/disabled-weekdays' },
        { name: 'First Day Monday', path: '/examples/agenda/first-day-monday' },
        { name: 'Five Day Workweek', path: '/examples/agenda/five-day-workweek' },
        { name: 'Locale', path: '/examples/agenda/locale' },
        { name: 'No Active Date', path: '/examples/agenda/no-active-date' },
        { name: 'Now', path: '/examples/agenda/now' },
        { name: 'Theme', path: '/examples/agenda/theme' },
        { name: 'Transitions', path: '/examples/agenda/transitions' },
        {
          name: 'Recipes',
          children: [
            { name: 'Planner', path: '/examples/agenda/planner' },
            { name: 'Server Data', path: '/examples/agenda/server-data' },
          ],
        },
      ],
    },
    {
      name: 'Day',
      children: [
        { name: 'Date Type', path: '/examples/day/date-type' },
        { name: 'Dark', path: '/examples/day/dark' },
        { name: '3 Day', path: '/examples/day/_3-day' },
        { name: 'Alignment', path: '/examples/day/alignment' },
        { name: 'Cell Width', path: '/examples/day/cell-width' },
        { name: 'Column Count', path: '/examples/day/column-count' },
        { name: 'Column Count Plus', path: '/examples/day/column-count-plus' },
        { name: 'Disabled Before After', path: '/examples/day/disabled-before-after' },
        { name: 'Disabled Days', path: '/examples/day/disabled-days' },
        { name: 'Disabled Weekdays', path: '/examples/day/disabled-weekdays' },
        { name: 'Hour 24 Format', path: '/examples/day/hour-24-format' },
        { name: 'Locale', path: '/examples/day/locale' },
        { name: 'Max Days', path: '/examples/day/max-days' },
        { name: 'Month', path: '/examples/day/month' },
        { name: 'Navigation', path: '/examples/day/navigation' },
        { name: 'No Active Date', path: '/examples/day/no-active-date' },
        { name: 'No Header', path: '/examples/day/no-header' },
        { name: 'No Scroll', path: '/examples/day/no-scroll' },
        { name: 'Now', path: '/examples/day/now' },
        { name: 'Selection', path: '/examples/day/selection' },
        { name: 'Theme', path: '/examples/day/theme' },
        { name: 'Transitions', path: '/examples/day/transitions' },
        {
          name: 'Intervals',
          children: [
            { name: 'Interval Count', path: '/examples/day/interval-count' },
            { name: 'Interval Height', path: '/examples/day/interval-height' },
            { name: 'Interval Minutes 15', path: '/examples/day/interval-minutes-15' },
            { name: 'Interval Minutes 30', path: '/examples/day/interval-minutes-30' },
            { name: 'Interval Start', path: '/examples/day/interval-start' },
            { name: 'Modify Intervals', path: '/examples/day/modify-intervals' },
            { name: 'Selected Intervals', path: '/examples/day/selected-intervals' },
          ],
        },
        {
          name: 'Slots',
          children: [
            { name: 'Column Header', path: '/examples/day/slot-column-header' },
            { name: 'Day Body', path: '/examples/day/slot-day-body' },
            {
              name: 'Day Container Show Current Time',
              path: '/examples/day/slot-day-container-show-current-time',
            },
            { name: 'Head Day', path: '/examples/day/slot-head-day' },
            { name: 'Head Day Event', path: '/examples/day/slot-head-day-event' },
            { name: 'Head Intervals', path: '/examples/day/slot-head-intervals' },
          ],
        },
        {
          name: 'Recipes',
          children: [
            { name: 'Custom Header', path: '/examples/day/custom-header' },
            { name: 'Drag And Drop', path: '/examples/day/drag-and-drop' },
            { name: 'Mouse Wheel Resize and Move', path: '/examples/day/mouse-wheel-events' },
            { name: 'Server Data', path: '/examples/day/server-data' },
          ],
        },
      ],
    },
    {
      name: 'General',
      children: [{ name: 'Calendar All', path: '/examples/general/calendar-all' }],
    },
    {
      name: 'Intervals',
      children: [
        {
          name: 'Recipes',
          children: [
            { name: 'Month Cell Width', path: '/examples/intervals/month-cell-width' },
            { name: 'Month Navigation', path: '/examples/intervals/month-navigation' },
          ],
        },
      ],
    },
    {
      name: 'Mini Mode',
      children: [
        { name: 'Breakpoint', path: '/examples/mini-mode/breakpoint' },
        { name: 'Dark', path: '/examples/mini-mode/dark' },
        { name: 'Date Type', path: '/examples/mini-mode/date-type' },
        { name: 'Disabled Before After', path: '/examples/mini-mode/disabled-before-after' },
        { name: 'Disabled Days', path: '/examples/mini-mode/disabled-days' },
        { name: 'Disabled Weekdays', path: '/examples/mini-mode/disabled-weekdays' },
        { name: 'First Day Monday', path: '/examples/mini-mode/first-day-monday' },
        { name: 'Five Day Workweek', path: '/examples/mini-mode/five-day-workweek' },
        { name: 'Locale', path: '/examples/mini-mode/locale' },
        { name: 'Min Weekday Label', path: '/examples/mini-mode/min-weekday-label' },
        { name: 'Min Weeks', path: '/examples/mini-mode/min-weeks' },
        { name: 'Multi Month Selection', path: '/examples/mini-mode/multi-month-selection' },
        { name: 'Navigation', path: '/examples/mini-mode/navigation' },
        { name: 'No Active Date', path: '/examples/mini-mode/no-active-date' },
        { name: 'No Outside Days', path: '/examples/mini-mode/no-outside-days' },
        { name: 'Now', path: '/examples/mini-mode/now' },
        { name: 'Selected Dates', path: '/examples/mini-mode/selected-dates' },
        { name: 'Selection', path: '/examples/mini-mode/selection' },
        { name: 'Theme', path: '/examples/mini-mode/theme' },
        {
          name: 'Recipes',
          children: [
            { name: 'QInput', path: '/examples/mini-mode/qinput' },
            { name: 'Workweeks', path: '/examples/mini-mode/workweeks' },
            { name: 'Server Data', path: '/examples/mini-mode/server-data' },
          ],
        },
      ],
    },
    {
      name: 'Month',
      children: [
        { name: 'Date Type', path: '/examples/month/date-type' },
        { name: 'Dark', path: '/examples/month/dark' },
        { name: 'Alignment', path: '/examples/month/alignment' },
        { name: 'Day Height', path: '/examples/month/day-height' },
        { name: 'Day Of Year', path: '/examples/month/day-of-year' },
        { name: 'Disabled Before After', path: '/examples/month/disabled-before-after' },
        { name: 'Disabled Days', path: '/examples/month/disabled-days' },
        { name: 'Disabled Weekdays', path: '/examples/month/disabled-weekdays' },
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
        { name: 'Theme', path: '/examples/month/theme' },
        { name: 'Transitions', path: '/examples/month/transitions' },
        {
          name: 'Slots',
          children: [
            { name: 'Day', path: '/examples/month/slot-day' },
            { name: 'Day Holidays', path: '/examples/month/slot-day-holidays' },
            { name: 'Week', path: '/examples/month/slot-week' },
          ],
        },
        {
          name: 'Recipes',
          children: [
            { name: 'Drag And Drop', path: '/examples/month/drag-and-drop' },
            { name: 'Sidebar Mini Calendar', path: '/examples/month/sidebar-mini-calendar' },
            { name: 'Workweeks', path: '/examples/month/workweeks' },
            { name: 'Server Data', path: '/examples/month/server-data' },
          ],
        },
      ],
    },
    {
      name: 'Resource',
      children: [
        { name: 'Dark', path: '/examples/resource/dark' },
        { name: 'Disabled Days', path: '/examples/resource/disabled-days' },
        { name: 'Focusable Hoverable', path: '/examples/resource/focusable-hoverable' },
        { name: 'Hour 24 Format', path: '/examples/resource/hour-24-format' },
        { name: 'No Sticky', path: '/examples/resource/no-sticky' },
        { name: 'Theme', path: '/examples/resource/theme' },
        { name: 'Width Height', path: '/examples/resource/width-height' },
        {
          name: 'Intervals',
          children: [{ name: 'Modify Intervals', path: '/examples/resource/modify-intervals' }],
        },
        {
          name: 'Slots',
          children: [
            { name: 'Head Resources', path: '/examples/resource/slot-head-resources' },
            { name: 'Interval Label', path: '/examples/resource/slot-interval-label' },
            { name: 'Resource Intervals', path: '/examples/resource/slot-resource-intervals' },
            { name: 'Resource Label', path: '/examples/resource/slot-resource-label' },
          ],
        },
        {
          name: 'Recipes',
          children: [
            { name: 'Children', path: '/examples/resource/children' },
            { name: 'Custom Height', path: '/examples/resource/custom-height' },
            { name: 'Server Data', path: '/examples/resource/server-data' },
          ],
        },
      ],
    },
    {
      name: 'Scheduler',
      children: [
        { name: 'Date Type', path: '/examples/scheduler/date-type' },
        { name: 'Dark', path: '/examples/scheduler/dark' },
        { name: 'Alignment', path: '/examples/scheduler/alignment' },
        { name: 'Cell Width', path: '/examples/scheduler/cell-width' },
        { name: 'Disabled Before After', path: '/examples/scheduler/disabled-before-after' },
        { name: 'Disabled Days', path: '/examples/scheduler/disabled-days' },
        { name: 'Disabled Weekdays', path: '/examples/scheduler/disabled-weekdays' },
        { name: 'First Day Monday', path: '/examples/scheduler/first-day-monday' },
        { name: 'Five Day Workweek', path: '/examples/scheduler/five-day-workweek' },
        { name: 'Focusable Hoverable', path: '/examples/scheduler/focusable-hoverable' },
        { name: 'Locale', path: '/examples/scheduler/locale' },
        { name: 'No Active Date', path: '/examples/scheduler/no-active-date' },
        { name: 'Now', path: '/examples/scheduler/now' },
        { name: 'Theme', path: '/examples/scheduler/theme' },
        { name: 'Width Height', path: '/examples/scheduler/width-height' },
        {
          name: 'Slots',
          children: [
            { name: 'Head Resources', path: '/examples/scheduler/slot-head-resources' },
            { name: 'Resource Days', path: '/examples/scheduler/slot-resource-days' },
            { name: 'Resource Label', path: '/examples/scheduler/slot-resource-label' },
          ],
        },
        {
          name: 'Recipes',
          children: [
            { name: 'Children', path: '/examples/scheduler/children' },
            { name: 'Custom Height', path: '/examples/scheduler/custom-height' },
            { name: 'Drag And Drop', path: '/examples/scheduler/drag-and-drop' },
            { name: 'Server Data', path: '/examples/scheduler/server-data' },
          ],
        },
      ],
    },
    {
      name: 'Task',
      children: [
        { name: 'Date Type', path: '/examples/task/date-type' },
        { name: 'Dark', path: '/examples/task/dark' },
        { name: 'Alignment', path: '/examples/task/alignment' },
        { name: 'Disabled Before After', path: '/examples/task/disabled-before-after' },
        { name: 'Disabled Days', path: '/examples/task/disabled-days' },
        { name: 'Disabled Weekdays', path: '/examples/task/disabled-weekdays' },
        { name: 'Focusable Hoverable', path: '/examples/task/focusable-hoverable' },
        { name: 'Locale', path: '/examples/task/locale' },
        { name: 'Month', path: '/examples/task/month' },
        { name: 'No Active Date', path: '/examples/task/no-active-date' },
        { name: 'No Weekends', path: '/examples/task/no-weekends' },
        { name: 'Now', path: '/examples/task/now' },
        { name: 'Theme', path: '/examples/task/theme' },
        { name: 'Week', path: '/examples/task/week' },
        {
          name: 'Recipes',
          children: [
            { name: 'Children', path: '/examples/task/children' },
            { name: 'Colored Weekends', path: '/examples/task/colored-weekends' },
            { name: 'Custom Height', path: '/examples/task/custom-height' },
            { name: 'Multiple Footer Rows', path: '/examples/task/multiple-footer-rows' },
            { name: 'Title Rows', path: '/examples/task/title-rows' },
            { name: 'Timesheet', path: '/examples/task/timesheet' },
            { name: 'Server Data', path: '/examples/task/server-data' },
          ],
        },
      ],
    },
    {
      name: 'Week',
      children: [
        { name: 'Date Type', path: '/examples/week/date-type' },
        { name: 'Dark', path: '/examples/week/dark' },
        { name: 'Alignment', path: '/examples/week/alignment' },
        { name: 'Cell Width', path: '/examples/week/cell-width' },
        { name: 'Disabled Before After', path: '/examples/week/disabled-before-after' },
        { name: 'Disabled Days', path: '/examples/week/disabled-days' },
        { name: 'Disabled Weekdays', path: '/examples/week/disabled-weekdays' },
        { name: 'First Day Monday', path: '/examples/week/first-day-monday' },
        { name: 'Five Day Workweek', path: '/examples/week/five-day-workweek' },
        { name: 'Focusable Hoverable', path: '/examples/week/focusable-hoverable' },
        { name: 'Hour 24 Format', path: '/examples/week/_24-hour' },
        { name: 'Locale', path: '/examples/week/locale' },
        { name: 'Navigation', path: '/examples/week/navigation' },
        { name: 'No Active Date', path: '/examples/week/no-active-date' },
        { name: 'No Header', path: '/examples/week/no-header' },
        { name: 'No Scroll', path: '/examples/week/no-scroll' },
        { name: 'Now', path: '/examples/week/now' },
        { name: 'Selection', path: '/examples/week/selection' },
        { name: 'Theme', path: '/examples/week/theme' },
        { name: 'Transitions', path: '/examples/week/transitions' },
        {
          name: 'Intervals',
          children: [
            { name: 'Interval Count', path: '/examples/week/interval-count' },
            { name: 'Interval Height', path: '/examples/week/interval-height' },
            { name: 'Interval Minutes 15', path: '/examples/week/interval-minutes-15' },
            { name: 'Interval Minutes 30', path: '/examples/week/interval-minutes-30' },
            { name: 'Interval Start', path: '/examples/week/interval-start' },
            { name: 'Modify Intervals', path: '/examples/week/modify-intervals' },
            { name: 'Selected Intervals', path: '/examples/week/selected-intervals' },
          ],
        },
        {
          name: 'Slots',
          children: [
            { name: 'Column Header', path: '/examples/week/slot-column-header' },
            { name: 'Day Body', path: '/examples/week/slot-day-body' },
            {
              name: 'Day Container Show Current Time',
              path: '/examples/week/slot-day-container-show-current-time',
            },
            { name: 'Day Interval', path: '/examples/week/slot-day-interval' },
            { name: 'Head Day', path: '/examples/week/slot-head-day' },
            { name: 'Head Day Event', path: '/examples/week/slot-head-day-event' },
            {
              name: 'Head Days Event Absolute',
              path: '/examples/week/slot-head-days-event-absolute',
            },
            { name: 'Head Intervals', path: '/examples/week/slot-head-intervals' },
          ],
        },
        {
          name: 'Recipes',
          children: [
            { name: 'Drag And Drop', path: '/examples/week/drag-and-drop' },
            { name: 'Server Data', path: '/examples/week/server-data' },
          ],
        },
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
      path: '/other/releases',
    },
    {
      name: 'Upgrade Guide',
      path: '/other/upgrade-guide',
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

const processedGettingStartedMenu = {
  name: gettingStartedMenu.name,
  path: slugify(gettingStartedMenu.name),
  expanded: false,
  children: gettingStartedMenu.children ? gettingStartedMenu.children.map(processMenuItem) : [],
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

const processedOtherMenu = {
  name: otherMenu.name,
  path: slugify(otherMenu.name),
  expanded: false,
  children: otherMenu.children ? otherMenu.children.map(processMenuItem) : [],
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
  processedGettingStartedMenu,
  processedDevelopingMenu,
  processedExamplesMenu,
  processedOtherMenu,
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
  githubEditRootSrc: `https://github.com/quasarframework/quasar-ui-qcalendar/edit/${repoBranch}/packages/docs/src`,
  githubSourceRootSrc: `https://github.com/quasarframework/quasar-ui-qcalendar/tree/${repoBranch}/packages/docs/src`,
  codepen: {
    jsPreProcessor: 'typescript',
    titleSuffix: `QCalendar v${version}`,
    cssExternal: [
      `https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qcalendar@${codepenPackageVersion}/dist/index.min.css`,
    ],
    jsExternal: [
      `https://cdn.jsdelivr.net/npm/@quasar/quasar-ui-qcalendar@${codepenPackageVersion}/dist/index.umd.min.js`,
    ],
    globalPackages: [
      {
        packageName: '@quasar/quasar-ui-qcalendar',
        globalName: '(globalThis as any).QCalendarPlugin || (globalThis as any).index',
      },
    ],
    modulePackages: [
      {
        packageName: '@timestamp-js/core',
        importUrl: 'https://esm.sh/@timestamp-js/core@0.1.0-rc.0',
      },
    ],
    jsSetup: [
      'const QCalendarPlugin = (globalThis as any).QCalendarPlugin || (globalThis as any).index',
      'app.use(QCalendarPlugin)',
      `app.component('NavigationBar', {
  emits: ['today', 'prev', 'next'],
  template: '<div class="row justify-center"><div class="q-pa-md q-gutter-lg row"><q-btn no-caps dense @click="$emit(\\'today\\')">Today</q-btn><q-btn no-caps dense @click="$emit(\\'prev\\')">&lt; Prev</q-btn><q-btn no-caps dense @click="$emit(\\'next\\')">Next &gt;</q-btn></div></div>',
})`,
    ].join('\n'),
  },
  license: {
    label: 'MIT License',
    link: `https://github.com/quasarframework/quasar-ui-qcalendar/blob/${repoBranch}/LICENSE.md`,
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

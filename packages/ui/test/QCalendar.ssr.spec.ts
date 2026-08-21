import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'

import { QCalendar, QCalendarDay, QCalendarMonth } from '../src'
import { calendarAdapterCases } from './fixtures/calendarAdapters'

const views = [
  ['agenda', {}],
  ['day', {}],
  ['month', {}],
  ['resource', {}],
  ['scheduler', {}],
  ['task', { view: 'week' }],
] as const

const deferredAdapterViews = [
  ['agenda', {}],
  ['resource', {}],
  ['scheduler', {}],
  ['task', { view: 'week' }],
] as const

describe('[QCALENDAR] SSR rendering', () => {
  it.each(views)('renders the %s view without browser-only APIs', async (mode, extraProps) => {
    const app = createSSRApp({
      render: () =>
        h(QCalendar, {
          mode,
          modelValue: '2026-07-21',
          'aria-label': `${mode} calendar`,
          ...extraProps,
        }),
    })

    const html = await renderToString(app)

    expect(html).toContain('class="q-calendar"')
    expect(html).toContain(`q-calendar-${mode}`)
    expect(html).toContain(`aria-label="${mode} calendar"`)
    expect(html).toContain('role="complementary"')
    expect(html).not.toMatch(/\s(?:arialabel|ariahidden|roll)=/)
  })

  describe('QCalendarMonth adapters', () => {
    it.each(calendarAdapterCases)(
      'renders the $name shell with adapter defaults',
      async ({ calendar, nativeDate, locale, direction }) => {
        const app = createSSRApp({
          render: () =>
            h(QCalendarMonth, {
              modelValue: nativeDate,
              calendarSystem: calendar,
            }),
        })

        const html = await renderToString(app)

        expect(html).toContain(`lang="${locale}"`)
        expect(html).toContain(`dir="${direction}"`)
        expect(html).toContain('class="q-calendar-month"')
      },
    )
  })

  describe('QCalendarDay adapters', () => {
    it.each(calendarAdapterCases)(
      'renders the $name shell with adapter defaults',
      async ({ calendar, nativeDate, locale, direction }) => {
        const app = createSSRApp({
          render: () =>
            h(QCalendarDay, {
              modelValue: nativeDate,
              calendarSystem: calendar,
              maxDays: 1,
            }),
        })

        const html = await renderToString(app)

        expect(html).toContain(`lang="${locale}"`)
        expect(html).toContain(`dir="${direction}"`)
        expect(html).toContain('class="q-calendar-day"')
      },
    )
  })

  describe('QCalendar wrapper adapters', () => {
    it.each(
      calendarAdapterCases.flatMap((adapterCase) => [
        { ...adapterCase, mode: 'month', slot: 'day' },
        { ...adapterCase, mode: 'day', slot: 'day-body' },
      ]),
    )(
      'forwards $name defaults to $mode mode',
      async ({ calendar, nativeDate, locale, direction, mode }) => {
        const app = createSSRApp({
          render: () =>
            h(QCalendar, {
              mode,
              modelValue: nativeDate,
              calendarSystem: calendar,
              maxDays: 1,
            }),
        })

        const html = await renderToString(app)

        expect(html).toContain(`lang="${locale}"`)
        expect(html).toContain(`dir="${direction}"`)
        expect(html).toContain(`class="q-calendar-${mode}"`)
      },
    )
  })

  describe('deferred view adapters', () => {
    it.each(
      calendarAdapterCases.flatMap((adapterCase) =>
        deferredAdapterViews.map(([mode, extraProps]) => ({
          ...adapterCase,
          mode,
          extraProps,
        })),
      ),
    )(
      'forwards $name defaults to $mode mode',
      async ({ calendar, nativeDate, locale, direction, mode, extraProps }) => {
        const app = createSSRApp({
          render: () =>
            h(QCalendar, {
              mode,
              modelValue: nativeDate,
              calendarSystem: calendar,
              maxDays: 1,
              ...extraProps,
            }),
        })

        const html = await renderToString(app)

        expect(html).toContain(`lang="${locale}"`)
        expect(html).toContain(`dir="${direction}"`)
        expect(html).toContain(`class="q-calendar-${mode}"`)
      },
    )
  })
})

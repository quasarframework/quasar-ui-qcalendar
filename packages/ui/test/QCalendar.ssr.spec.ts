import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'

import { QCalendar, QCalendarMonth } from '../src'

describe('[QCALENDAR] SSR rendering', () => {
  it('renders the root calendar without touching browser-only APIs', async () => {
    const app = createSSRApp({
      render: () =>
        h(QCalendar, {
          mode: 'month',
          modelValue: '2026-05-28',
        }),
    })

    const html = await renderToString(app)

    expect(html).toContain('q-calendar')
    expect(html).toContain('q-calendar-month')
  })

  it('renders the month component directly during SSR', async () => {
    const app = createSSRApp({
      render: () =>
        h(QCalendarMonth, {
          modelValue: '2026-05-28',
        }),
    })

    const html = await renderToString(app)

    expect(html).toContain('q-calendar')
    expect(html).toContain('q-calendar-month')
  })
})

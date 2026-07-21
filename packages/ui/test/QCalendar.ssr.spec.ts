import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'

import { QCalendar } from '../src'

const views = [
  ['agenda', {}],
  ['day', {}],
  ['month', {}],
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
          ...extraProps,
        }),
    })

    const html = await renderToString(app)

    expect(html).toContain('class="q-calendar"')
    expect(html).toContain(`q-calendar-${mode}`)
  })
})

import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'

import {
  ariaHiddenAttrs,
  getAriaLabelAttrs,
  presentationRoleAttrs,
  setAriaLabel,
} from '../src/utils/aria'

describe('[ARIA] render attributes', () => {
  it('renders valid hyphenated ARIA attributes and roles', async () => {
    const app = createSSRApp({
      render: () =>
        h('div', {
          ...getAriaLabelAttrs('Tuesday, August 11'),
          ...ariaHiddenAttrs,
          ...presentationRoleAttrs,
        }),
    })

    const html = await renderToString(app)

    expect(html).toContain('aria-label="Tuesday, August 11"')
    expect(html).toContain('aria-hidden="true"')
    expect(html).toContain('role="presentation"')
    expect(html).not.toMatch(/\s(?:arialabel|ariahidden|roll)=/)
  })

  it('suppresses generated labels when ARIA output is disabled', () => {
    const attrs: Record<string, unknown> = {}

    setAriaLabel(attrs, 'Tuesday, August 11', false)

    expect(attrs).not.toHaveProperty('aria-label')
  })
})

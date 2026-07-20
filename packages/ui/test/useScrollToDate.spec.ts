import { createSSRApp, defineComponent, h, ref } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { parsed } from '@timestamp-js/core'
import { describe, expect, it } from 'vitest'

import useScrollToDate from '../src/composables/useScrollToDate'

describe('[USE SCROLL TO DATE]', () => {
  it('centers a rendered date and reports dates outside the rendered range', async () => {
    const scrollArea = {
      scrollLeft: 10,
      getBoundingClientRect: () => ({ left: 0, width: 200 }),
    } as HTMLElement
    const dateElement = {
      getBoundingClientRect: () => ({ left: 310, width: 100 }),
    } as HTMLElement

    let scrollToDate: (date: string, duration?: number) => boolean = () => false

    const app = createSSRApp(
      defineComponent({
        setup() {
          const controls = useScrollToDate({}, ref(scrollArea))
          const timestamp = parsed('2026-07-20')!

          controls.registerDate(timestamp, dateElement)
          scrollToDate = controls.scrollToDate

          return () => h('div')
        },
      }),
    )

    await renderToString(app)

    expect(scrollToDate('not-a-date')).toBe(false)
    expect(scrollToDate('2026-07-21')).toBe(false)
    expect(scrollToDate('2026-07-20')).toBe(true)
    expect(scrollArea.scrollLeft).toBe(270)
  })
})

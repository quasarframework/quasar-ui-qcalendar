import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'

import QCalendarMonth from '../../src/components/QCalendarMonth'

describe('[QCALENDAR] rendered month keyboard navigation', () => {
  it('moves focus to the next rendered day with ArrowRight', async () => {
    const wrapper = mount(QCalendarMonth, {
      attachTo: document.body,
      attrs: {
        style: 'width: 800px; height: 600px',
      },
      props: {
        modelValue: '2026-08-21',
        focusable: true,
        focusType: ['day'],
        useNavigation: true,
      },
    })

    await expect.poll(() => wrapper.findAll('.q-calendar-month__day').length).toBeGreaterThan(0)

    const activeDay = wrapper.get('.q-calendar-month__day.q-active-date')
    const nextDay = wrapper
      .findAll('.q-calendar-month__day')
      .find((day) => day.attributes('aria-label')?.includes('August 22'))

    expect(nextDay).toBeDefined()

    activeDay.element.focus()
    await activeDay.trigger('keydown', { key: 'ArrowRight', keyCode: 39 })
    await activeDay.trigger('keyup', { key: 'ArrowRight', keyCode: 39 })
    await nextTick()

    expect(document.activeElement).toBe(nextDay!.element)

    wrapper.unmount()
  })
})

describe('[QCALENDAR] rendered month sizing', () => {
  it('stretches minimum-height weeks to the bottom of a fixed-height calendar', async () => {
    const wrapper = mount(QCalendarMonth, {
      attachTo: document.body,
      attrs: {
        style: 'width: 800px; height: 500px',
      },
      props: {
        modelValue: '2026-06-02',
        bordered: true,
        dayHeight: 0,
        dayMinHeight: 84,
      },
    })

    await expect
      .poll(() => wrapper.findAll('.q-calendar-month__week--wrapper').length)
      .toBeGreaterThan(0)

    const body = wrapper.get('.q-calendar-month__body').element
    const weeks = wrapper.findAll('.q-calendar-month__week--wrapper')
    const lastWeek = weeks.at(-1)!.element

    expect(
      Math.abs(body.getBoundingClientRect().bottom - lastWeek.getBoundingClientRect().bottom),
    ).toBeLessThanOrEqual(1)

    wrapper.unmount()
  })
})

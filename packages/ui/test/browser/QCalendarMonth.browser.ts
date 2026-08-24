import { mount, type VueWrapper } from '@vue/test-utils'
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

  it('restores focus after navigation renders the next month', async () => {
    let wrapper: VueWrapper
    wrapper = mount(QCalendarMonth, {
      attachTo: document.body,
      attrs: {
        style: 'width: 800px; height: 600px',
      },
      props: {
        modelValue: '2026-08-31',
        focusable: true,
        focusType: ['day'],
        useNavigation: true,
        'onUpdate:modelValue': (value: string) => {
          if (value === '2026-09-06') {
            void wrapper.setProps({ modelValue: value })
          }
        },
      },
    })

    await expect.poll(() => wrapper.findAll('.q-calendar-month__day').length).toBeGreaterThan(0)

    const renderedDays = wrapper.findAll('.q-calendar-month__day')
    const lastDay = renderedDays.at(-1)!
    lastDay.element.focus()
    expect(document.activeElement).toBe(lastDay.element)
    await lastDay.trigger('keydown', { key: 'ArrowRight', keyCode: 39 })
    await lastDay.trigger('keyup', { key: 'ArrowRight', keyCode: 39 })
    expect(wrapper.emitted('update:model-value')?.some(([value]) => value === '2026-09-06')).toBe(
      true,
    )

    await expect
      .poll(() => ({
        activeClass: document.activeElement?.className,
        keyboardActive: wrapper.classes().includes('q-calendar--keyboard-active'),
        targetExists: wrapper
          .findAll('.q-calendar-month__day')
          .some((day) => day.attributes('aria-label')?.includes('September 6')),
      }))
      .toEqual({
        activeClass: expect.stringContaining('q-calendar-month__day'),
        keyboardActive: true,
        targetExists: true,
      })
    expect(document.activeElement?.getAttribute('aria-label')).toContain('September 6')

    wrapper.unmount()
  })

  it('routes keyboard navigation to the calendar that owns focus', async () => {
    const first = mount(QCalendarMonth, {
      attachTo: document.body,
      attrs: { style: 'width: 800px; height: 600px' },
      props: {
        modelValue: '2026-08-10',
        focusable: true,
        focusType: ['day'],
        useNavigation: true,
      },
    })
    const second = mount(QCalendarMonth, {
      attachTo: document.body,
      attrs: { style: 'width: 800px; height: 600px' },
      props: {
        modelValue: '2026-09-10',
        focusable: true,
        focusType: ['day'],
        useNavigation: true,
      },
    })

    await expect.poll(() => first.findAll('.q-calendar-month__day').length).toBeGreaterThan(0)
    await expect.poll(() => second.findAll('.q-calendar-month__day').length).toBeGreaterThan(0)

    const firstActive = first.get('.q-calendar-month__day.q-active-date')
    const secondActive = second.get('.q-calendar-month__day.q-active-date')

    firstActive.element.focus()
    await firstActive.trigger('keyup', { key: 'ArrowRight', keyCode: 39 })
    await nextTick()
    expect(document.activeElement?.getAttribute('aria-label')).toContain('August 11')

    secondActive.element.focus()
    await secondActive.trigger('keyup', { key: 'ArrowRight', keyCode: 39 })
    await nextTick()
    expect(document.activeElement?.getAttribute('aria-label')).toContain('September 11')

    first.unmount()
    second.unmount()
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

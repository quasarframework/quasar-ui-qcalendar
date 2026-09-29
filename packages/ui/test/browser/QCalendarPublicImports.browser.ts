import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'

import {
  QCalendar,
  QCalendarDay,
  QCalendarResource,
  QCalendarTask,
} from '@quasar/quasar-ui-qcalendar'
import { QCalendarDay as SubpathDay } from '@quasar/quasar-ui-qcalendar/QCalendarDay'
import { QCalendarResource as SubpathResource } from '@quasar/quasar-ui-qcalendar/QCalendarResource'

describe('[QCALENDAR] public entrypoint contracts', () => {
  it.each([
    ['root', QCalendarDay],
    ['subpath', SubpathDay],
  ] as const)('exposes day helper results through the %s import', (_name, component) => {
    const wrapper = mount(component, { props: { modelValue: '2026-09-29' } })
    try {
      expect(wrapper.vm.timeStartPos('invalid')).toBe(false)
      expect(wrapper.vm.timeStartPos('00:00')).toBe(0)
      expect(wrapper.vm.scrollToTime('invalid')).toBe(false)
      expect(wrapper.vm.timeDurationHeight(60)).toBeGreaterThan(0)
    } finally {
      wrapper.unmount()
    }
  })

  it.each([
    ['root', QCalendarResource],
    ['subpath', SubpathResource],
  ] as const)('exposes resource helper results through the %s import', (_name, component) => {
    const wrapper = mount(component, { props: { modelValue: '2026-09-29' } })
    try {
      expect(wrapper.vm.timeStartPosX('invalid')).toBe(false)
      expect(wrapper.vm.timeStartPosX('00:00')).toBe(0)
      expect(wrapper.vm.scrollToTimeX('invalid')).toBe(false)
      expect(wrapper.vm.timeDurationWidth(60)).toBeGreaterThan(0)
    } finally {
      wrapper.unmount()
    }
  })

  it('preserves the wrapper helper return values', () => {
    const wrapper = mount(QCalendar, { props: { modelValue: '2026-09-29', mode: 'day' } })
    try {
      expect(wrapper.vm.timeStartPos('invalid')).toBe(false)
      expect(wrapper.vm.scrollToTime('invalid')).toBeUndefined()
    } finally {
      wrapper.unmount()
    }
  })

  it('passes both string and object title rows to task slots', async () => {
    const titles = ['Planning', { label: 'Delivery' }]
    const wrapper = mount(QCalendarTask, {
      attachTo: document.body,
      attrs: { style: 'width: 800px; height: 300px' },
      props: { modelValue: '2026-09-29', view: 'day', modelTitle: titles },
      slots: {
        'title-task': ({ scope }) =>
          h(
            'span',
            { 'data-title': true },
            typeof scope.title === 'string' ? scope.title : scope.title.label,
          ),
      },
    })
    try {
      await expect
        .poll(() => wrapper.findAll('[data-title]').map((node) => node.text()))
        .toEqual(titles.map((title) => (typeof title === 'string' ? title : title.label)))
    } finally {
      wrapper.unmount()
    }
  })
})

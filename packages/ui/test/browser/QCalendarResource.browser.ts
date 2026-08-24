import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import { describe, expect, it } from 'vitest'

import QCalendarResource from '../../src/components/QCalendarResource'

describe('[QCALENDAR] resource keyboard navigation', () => {
  it('moves through one resource row without losing its identity', async () => {
    const wrapper = mount(QCalendarResource, {
      attachTo: document.body,
      attrs: { style: 'width: 800px; height: 500px' },
      props: {
        modelValue: '2026-08-21',
        modelResources: [{ id: 'resource-1', label: 'Room 1' }],
        focusable: true,
        focusType: ['time'],
        intervalCount: 3,
        intervalStart: 8,
        resourceKey: 'id',
        resourceLabel: 'label',
        useNavigation: true,
      },
    })

    const selector = '.q-calendar-resource__resource--interval'
    await expect.poll(() => wrapper.findAll(selector).length).toBe(3)

    const intervals = wrapper.findAll(selector)
    ;(intervals[0]!.element as HTMLElement).focus()
    await intervals[0]!.trigger('keyup', { key: 'ArrowDown', keyCode: 40 })
    await nextTick()

    expect(document.activeElement).toBe(intervals[1]!.element)

    wrapper.unmount()
  })

  it('preserves the time and resource after a controlled date update', async () => {
    const Host = defineComponent({
      setup() {
        const modelValue = ref('2026-08-21')
        return () =>
          h(QCalendarResource, {
            modelValue: modelValue.value,
            'onUpdate:modelValue': (value: string) => {
              modelValue.value = value
            },
            modelResources: [{ id: 'resource-1', label: 'Room 1' }],
            focusable: true,
            focusType: ['time'],
            intervalCount: 3,
            intervalStart: 8,
            resourceKey: 'id',
            resourceLabel: 'label',
            useNavigation: true,
          })
      },
    })
    const wrapper = mount(Host, {
      attachTo: document.body,
      attrs: { style: 'width: 800px; height: 500px' },
    })

    const selector = '.q-calendar-resource__resource--interval'
    await expect.poll(() => wrapper.findAll(selector).length).toBe(3)

    const firstInterval = wrapper.findAll(selector)[0]!
    ;(firstInterval.element as HTMLElement).focus()
    await firstInterval.trigger('keyup', { key: 'ArrowRight', keyCode: 39 })
    await nextTick()
    await nextTick()

    expect(document.activeElement).toBe(wrapper.findAll(selector)[0]!.element)

    wrapper.unmount()
  })

  it('scrolls its own viewport to keep the focused interval visible', async () => {
    const wrapper = mount(QCalendarResource, {
      attachTo: document.body,
      attrs: { style: 'width: 400px; height: 300px' },
      props: {
        modelValue: '2026-08-21',
        modelResources: [{ id: 'resource-1', label: 'Room 1' }],
        focusable: true,
        focusType: ['time'],
        intervalCount: 10,
        intervalStart: 8,
        resourceKey: 'id',
        resourceLabel: 'label',
        useNavigation: true,
      },
    })

    const selector = '.q-calendar-resource__resource--interval'
    await expect.poll(() => wrapper.findAll(selector).length).toBe(10)

    const firstInterval = wrapper.findAll(selector)[0]!
    ;(firstInterval.element as HTMLElement).focus()
    for (let index = 0; index < 8; index += 1) {
      await firstInterval.trigger('keyup', { key: 'ArrowDown', keyCode: 40 })
      await nextTick()
    }

    const scrollArea = wrapper.get('.q-calendar-resource__scroll-area').element
    expect(scrollArea.scrollLeft).toBeGreaterThan(0)
    expect(document.activeElement).toBe(wrapper.findAll(selector)[8]!.element)

    for (let index = 0; index < 8; index += 1) {
      await firstInterval.trigger('keyup', { key: 'ArrowUp', keyCode: 38 })
      await nextTick()
    }

    expect(scrollArea.scrollLeft).toBe(0)
    expect(document.activeElement).toBe(wrapper.findAll(selector)[0]!.element)

    wrapper.unmount()
  })

  it('wraps between rendered interval boundaries on enabled dates', async () => {
    const modelValue = ref('2026-08-21')
    const Host = defineComponent({
      setup() {
        return () =>
          h(QCalendarResource, {
            modelValue: modelValue.value,
            'onUpdate:modelValue': (value: string) => {
              modelValue.value = value
            },
            modelResources: [{ id: 'resource-1', label: 'Room 1' }],
            focusable: true,
            focusType: ['time'],
            intervalCount: 10,
            intervalStart: 8,
            resourceKey: 'id',
            resourceLabel: 'label',
            useNavigation: true,
            weekdays: [1, 2, 3, 4, 5],
          })
      },
    })
    const wrapper = mount(Host, {
      attachTo: document.body,
      attrs: { style: 'width: 800px; height: 500px' },
    })

    const selector = '.q-calendar-resource__resource--interval'
    await expect.poll(() => wrapper.findAll(selector).length).toBe(10)

    const lastInterval = wrapper.findAll(selector)[9]!
    ;(lastInterval.element as HTMLElement).focus()
    await lastInterval.trigger('keyup', { key: 'ArrowDown', keyCode: 40 })
    await nextTick()
    await nextTick()

    expect(modelValue.value).toBe('2026-08-24')
    expect(document.activeElement).toBe(wrapper.findAll(selector)[0]!.element)

    const firstInterval = wrapper.findAll(selector)[0]!
    await firstInterval.trigger('keyup', { key: 'ArrowUp', keyCode: 38 })
    await nextTick()
    await nextTick()

    expect(modelValue.value).toBe('2026-08-21')
    expect(document.activeElement).toBe(wrapper.findAll(selector)[9]!.element)

    wrapper.unmount()
  })
})

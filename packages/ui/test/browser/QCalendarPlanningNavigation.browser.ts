import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import { describe, expect, it } from 'vitest'

import QCalendarScheduler from '../../src/components/QCalendarScheduler'
import QCalendarTask from '../../src/components/QCalendarTask'

describe('[QCALENDAR] planning view keyboard navigation', () => {
  it('advances the controlled task view with Page Down', async () => {
    const Host = defineComponent({
      setup() {
        const modelValue = ref('2026-08-24')
        return () =>
          h(QCalendarTask, {
            modelValue: modelValue.value,
            'onUpdate:modelValue': (value: string) => {
              modelValue.value = value
            },
            modelTasks: [{ key: 'task-1', title: 'Task 1' }],
            taskKey: 'key',
            view: 'week',
            focusable: true,
            focusType: ['weekday'],
            useNavigation: true,
          })
      },
    })
    const wrapper = mount(Host, {
      attachTo: document.body,
      attrs: { style: 'width: 800px' },
    })

    const selector = '.q-calendar-task__head--day'
    await expect.poll(() => wrapper.findAll(selector).length).toBe(7)

    const monday = wrapper.findAll(selector)[1]!
    ;(monday.element as HTMLElement).focus()
    await monday.trigger('keyup', { key: 'PageDown', keyCode: 34 })
    await nextTick()
    await nextTick()

    expect(document.activeElement?.textContent).toContain('31')

    wrapper.unmount()
  })

  it('scrolls the task viewport to keep the focused weekday visible', async () => {
    const wrapper = mount(QCalendarTask, {
      attachTo: document.body,
      attrs: { style: 'width: 400px' },
      props: {
        modelValue: '2026-08-24',
        modelTasks: [{ key: 'task-1', title: 'Task 1' }],
        taskKey: 'key',
        view: 'week',
        focusable: true,
        focusType: ['weekday'],
        useNavigation: true,
      },
    })

    const selector = '.q-calendar-task__head--day'
    await expect.poll(() => wrapper.findAll(selector).length).toBe(7)

    const firstDay = wrapper.findAll(selector)[0]!
    ;(firstDay.element as HTMLElement).focus()
    for (let index = 0; index < 6; index += 1) {
      await firstDay.trigger('keyup', { key: 'ArrowRight', keyCode: 39 })
      await nextTick()
    }

    const scrollArea = wrapper.get('.q-calendar-task__scroll-area').element
    expect(scrollArea.scrollLeft).toBeGreaterThan(0)
    expect(document.activeElement).toBe(wrapper.findAll(selector)[6]!.element)

    for (let index = 0; index < 6; index += 1) {
      await firstDay.trigger('keyup', { key: 'ArrowLeft', keyCode: 37 })
      await nextTick()
    }

    expect(scrollArea.scrollLeft).toBe(0)
    expect(document.activeElement).toBe(wrapper.findAll(selector)[0]!.element)

    wrapper.unmount()
  })

  it('advances the controlled scheduler view with Page Down', async () => {
    const Host = defineComponent({
      setup() {
        const modelValue = ref('2026-08-24')
        return () =>
          h(QCalendarScheduler, {
            modelValue: modelValue.value,
            'onUpdate:modelValue': (value: string) => {
              modelValue.value = value
            },
            modelResources: [{ id: 'resource-1', label: 'Room 1' }],
            resourceKey: 'id',
            resourceLabel: 'label',
            view: 'week',
            focusable: true,
            focusType: ['weekday'],
            useNavigation: true,
          })
      },
    })
    const wrapper = mount(Host, {
      attachTo: document.body,
      attrs: { style: 'width: 800px' },
    })

    const selector = '.q-calendar-scheduler__head--day'
    await expect.poll(() => wrapper.findAll(selector).length).toBe(7)

    const monday = wrapper.findAll(selector)[1]!
    ;(monday.element as HTMLElement).focus()
    await monday.trigger('keyup', { key: 'PageDown', keyCode: 34 })
    await nextTick()
    await nextTick()

    expect(document.activeElement?.textContent).toContain('31')

    wrapper.unmount()
  })
})

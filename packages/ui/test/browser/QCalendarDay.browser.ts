import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'

import QCalendarDay from '../../src/components/QCalendarDay'
import type { IntervalSlotScope } from '../../src/slots'

describe('[QCALENDAR] rendered interval interactions', () => {
  it('moves focus by one configured interval with ArrowDown', async () => {
    const wrapper = mount(QCalendarDay, {
      attachTo: document.body,
      attrs: { style: 'width: 800px; height: 500px' },
      props: {
        modelValue: '2026-08-21',
        focusable: true,
        focusType: ['interval'],
        intervalCount: 4,
        intervalMinutes: 30,
        useNavigation: true,
      },
    })

    const intervalSelector = '.q-calendar-day__day-interval, .q-calendar-day__day-interval--section'
    await expect.poll(() => wrapper.findAll(intervalSelector).length).toBe(4)

    const intervals = wrapper.findAll(intervalSelector)
    ;(intervals[0]!.element as HTMLElement).focus()
    await intervals[0]!.trigger('keyup', { key: 'ArrowDown', keyCode: 40 })
    await nextTick()

    expect(document.activeElement).toBe(intervals[1]!.element)

    wrapper.unmount()
  })

  it('renders each configured column with its public scope index', async () => {
    const wrapper = mount(QCalendarDay, {
      attachTo: document.body,
      attrs: { style: 'width: 800px; height: 500px' },
      props: {
        modelValue: '2026-08-21',
        columnCount: 3,
        columnIndexStart: 2,
        intervalCount: 2,
      },
      slots: {
        'day-body': ({ scope }: { scope: IntervalSlotScope }) =>
          h('span', { 'data-column-index': scope.columnIndex }),
      },
    })

    await expect.poll(() => wrapper.findAll('[data-column-index]').length).toBe(3)

    expect(
      wrapper.findAll('[data-column-index]').map((node) => node.attributes('data-column-index')),
    ).toEqual(['2', '3', '4'])
    expect(wrapper.findAll('.q-calendar-day__day')).toHaveLength(3)

    wrapper.unmount()
  })
})

describe('[QCALENDAR] rendered drag and drop', () => {
  it('updates day drop feedback and forwards the rendered scope', async () => {
    const dragEnterFunc = vi.fn(
      (_event: Event, _type: string, _scope: { scope: IntervalSlotScope }) => true,
    )
    const dragLeaveFunc = vi.fn(
      (_event: Event, _type: string, _scope: { scope: IntervalSlotScope }) => false,
    )
    const dropFunc = vi.fn(
      (_event: Event, _type: string, _scope: { scope: IntervalSlotScope }) => false,
    )
    const wrapper = mount(QCalendarDay, {
      attachTo: document.body,
      attrs: { style: 'width: 800px; height: 500px' },
      props: {
        modelValue: '2026-08-21',
        intervalCount: 2,
        dragEnterFunc,
        dragLeaveFunc,
        dropFunc,
      },
    })

    const intervalSelector = '.q-calendar-day__day-interval, .q-calendar-day__day-interval--section'
    await expect.poll(() => wrapper.findAll(intervalSelector).length).toBe(2)

    const interval = wrapper.findAll(intervalSelector)[0]!
    await interval.trigger('dragenter')
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
    await nextTick()

    expect(dragEnterFunc).toHaveBeenCalledOnce()
    expect(dragEnterFunc.mock.calls[0]![1]).toBe('interval')
    expect(dragEnterFunc.mock.calls[0]![2].scope.timestamp.date).toBe('2026-08-21')
    expect(dragEnterFunc.mock.calls[0]![2].scope.droppable).toBe(false)

    await interval.trigger('dragleave')
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
    await interval.trigger('drop')

    expect(dragLeaveFunc).toHaveBeenCalledOnce()
    expect(dropFunc).toHaveBeenCalledOnce()

    wrapper.unmount()
  })
})

import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import QCalendar from '../../src/components/QCalendar'
import type { IntervalSlotScope } from '../../src/slots'

describe('[QCALENDAR] disabled interval interactions', () => {
  it.each(['day', 'week', 'month', 'resource'] as const)(
    'disables only requested cells in %s mode',
    async (mode) => {
      const onClickTime = vi.fn()
      const onClickInterval = vi.fn()
      const onClick = vi.fn()
      const dropFunc = vi.fn(() => true)
      const wrapper = mount(QCalendar, {
        attachTo: document.body,
        attrs: { style: 'width: 900px; height: 500px', onClick },
        props: {
          mode: mode === 'resource' ? 'resource' : 'day',
          view: mode === 'resource' ? 'day' : mode,
          modelValue: '2026-11-02',
          modelResources: [
            { id: 'one', label: 'Room 1' },
            { id: 'two', label: 'Room 2' },
          ],
          resourceKey: 'id',
          resourceLabel: 'label',
          weekdays: [1, 2, 3, 4, 5],
          intervalStart: 8,
          intervalCount: 5,
          focusable: true,
          focusType: ['interval', 'time'],
          useNavigation: true,
          disabledIntervals: [
            { from: '2026-11-02', to: '2026-11-03', start: '09:00', end: '10:00' },
            '2026-11-02 11:15',
          ],
          onClickTime,
          onClickInterval,
          dropFunc,
        },
        slots: {
          [mode === 'resource' ? 'resource-interval' : 'day-interval']: ({
            scope,
          }: {
            scope: IntervalSlotScope
          }) =>
            h(
              'span',
              {
                'data-disabled': String(scope.disabled === true),
                'data-timestamp-disabled': String(scope.timestamp.disabled === true),
              },
              scope.timestamp.time,
            ),
        },
      })
      try {
        const selector =
          mode === 'resource'
            ? '.q-calendar-resource__resource--interval'
            : '.q-calendar-day__day-interval, .q-calendar-day__day-interval--section'
        await expect
          .poll(() => wrapper.findAll(selector).length)
          .toBe(mode === 'month' ? 105 : mode === 'week' ? 25 : mode === 'resource' ? 10 : 5)
        const cells = wrapper.findAll(selector)
        expect(cells.filter((cell) => cell.classes().includes('q-disabled-interval'))).toHaveLength(
          mode === 'week' || mode === 'month' ? 3 : mode === 'resource' ? 4 : 2,
        )
        if (mode === 'week' || mode === 'month') {
          expect(cells[6]!.classes()).toContain('q-disabled-interval')
          expect(cells[11]!.classes()).not.toContain('q-disabled-interval')
        }
        const blocked = cells[1]!
        expect(blocked.attributes('aria-disabled')).toBe('true')
        expect(blocked.attributes('tabindex')).toBe('-1')
        const rect = blocked.element.getBoundingClientRect()
        const hit = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)!
        expect(getComputedStyle(hit).cursor).toBe('not-allowed')
        expect(blocked.get('span').attributes('data-disabled')).toBe('true')
        expect(blocked.get('span').attributes('data-timestamp-disabled')).toBe('true')
        await blocked.trigger('click')
        await blocked.trigger('keyup', { key: 'Enter', keyCode: 13 })
        await blocked.trigger('drop')
        expect(onClickTime).not.toHaveBeenCalled()
        expect(dropFunc).not.toHaveBeenCalled()
        expect(onClick).not.toHaveBeenCalled()
        if (mode === 'resource') {
          await wrapper.findAll('.q-calendar-resource__head--interval')[1]!.trigger('click')
          expect(onClickInterval).not.toHaveBeenCalled()
        }
        await cells[2]!.trigger('click')
        expect(onClickTime).toHaveBeenCalledTimes(1)
        ;(cells[0]!.element as HTMLElement).focus()
        await cells[0]!.trigger('keyup', { key: 'ArrowDown', keyCode: 40 })
        await nextTick()
        expect(document.activeElement).toBe(cells[2]!.element)

        await wrapper.setProps({ disabledIntervals: [] })
        expect(blocked.classes()).not.toContain('q-disabled-interval')
        expect(blocked.attributes('aria-disabled')).toBeUndefined()
        expect(blocked.get('span').attributes('data-disabled')).toBe('false')
        await blocked.trigger('click')
        expect(onClickTime).toHaveBeenCalledTimes(2)
        await wrapper.setProps({ disabledWeekdays: [1] })
        expect(
          wrapper
            .findAll(selector)
            .slice(0, 5)
            .every((cell) => cell.classes().includes('disabled')),
        ).toBe(true)
      } finally {
        wrapper.unmount()
      }
    },
  )
})

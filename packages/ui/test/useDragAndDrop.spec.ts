import { ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'

import { getDragEventHandlers } from '../src/composables/useDragAndDrop'

describe('[QCALENDAR] drag and drop handlers', () => {
  it('sets the active drag target when the user callback accepts the drop zone', () => {
    const targetRef = ref('')
    const event = { type: 'dragenter' } as DragEvent
    const dragEnterFunc = vi.fn(() => true)

    getDragEventHandlers(
      { dragEnterFunc },
      {
        targetRef,
        value: '2026-06-15',
        resetValue: '',
        type: 'day',
        scope: { timestamp: { date: '2026-06-15' } },
      },
    ).onDragenter(event)

    expect(dragEnterFunc).toHaveBeenCalledWith(event, 'day', {
      scope: { timestamp: { date: '2026-06-15' } },
    })
    expect(targetRef.value).toBe('2026-06-15')
  })

  it('resets the active drag target when the user callback rejects the drop zone', () => {
    const targetRef = ref('2026-06-15')
    const dragOverFunc = vi.fn(() => false)

    getDragEventHandlers(
      { dragOverFunc },
      {
        targetRef,
        value: '2026-06-15',
        resetValue: '',
        type: 'day',
        scope: { timestamp: { date: '2026-06-15' } },
      },
    ).onDragover({ type: 'dragover' } as DragEvent)

    expect(targetRef.value).toBe('')
  })
})

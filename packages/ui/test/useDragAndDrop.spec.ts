import { ref } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { getDragEventHandlers } from '../src/composables/useDragAndDrop'

describe('[QCALENDAR] drag and drop handlers', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

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

  it('resets the active drag target when the dragged item leaves an accepted drop zone', () => {
    const targetRef = ref('2026-06-15')
    const event = { type: 'dragleave' } as DragEvent
    const dragLeaveFunc = vi.fn(() => false)

    getDragEventHandlers(
      { dragLeaveFunc },
      {
        targetRef,
        value: '2026-06-15',
        resetValue: '',
        type: 'day',
        scope: { timestamp: { date: '2026-06-15' } },
      },
    ).onDragleave(event)

    expect(dragLeaveFunc).toHaveBeenCalledWith(event, 'day', {
      scope: { timestamp: { date: '2026-06-15' } },
    })
    expect(targetRef.value).toBe('')
  })

  it('sets the active drag target immediately when the user callback accepts a drop', () => {
    const targetRef = ref('')
    const event = { type: 'drop' } as DragEvent
    const dropFunc = vi.fn(() => true)

    getDragEventHandlers(
      { dropFunc },
      {
        targetRef,
        value: '2026-06-15',
        resetValue: '',
        type: 'day',
        scope: { timestamp: { date: '2026-06-15' } },
      },
    ).onDrop(event)

    expect(dropFunc).toHaveBeenCalledWith(event, 'day', {
      scope: { timestamp: { date: '2026-06-15' } },
    })
    expect(targetRef.value).toBe('2026-06-15')
  })

  it('coalesces drag target updates to the last target in the animation frame', () => {
    const frames: FrameRequestCallback[] = []
    const targetRef = ref('')
    const dragOverFunc = vi.fn(() => true)

    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => {
        frames.push(callback)
        return frames.length
      }),
    )
    vi.stubGlobal('cancelAnimationFrame', vi.fn())

    getDragEventHandlers(
      { dragOverFunc },
      {
        targetRef,
        value: '2026-06-15 10:00',
        resetValue: '',
        type: 'interval',
        scope: { timestamp: { date: '2026-06-15', time: '10:00' } },
      },
    ).onDragover({ type: 'dragover' } as DragEvent)

    getDragEventHandlers(
      { dragOverFunc },
      {
        targetRef,
        value: '2026-06-15 10:30',
        resetValue: '',
        type: 'interval',
        scope: { timestamp: { date: '2026-06-15', time: '10:30' } },
      },
    ).onDragover({ type: 'dragover' } as DragEvent)

    expect(frames).toHaveLength(1)
    expect(targetRef.value).toBe('')

    frames[0]!(0)

    expect(targetRef.value).toBe('2026-06-15 10:30')
  })

  it('cancels queued drag target updates when a drop arrives first', () => {
    const frames: FrameRequestCallback[] = []
    const targetRef = ref('')
    const dragOverFunc = vi.fn(() => true)
    const cancelAnimationFrame = vi.fn()

    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => {
        frames.push(callback)
        return frames.length
      }),
    )
    vi.stubGlobal('cancelAnimationFrame', cancelAnimationFrame)

    const handlers = getDragEventHandlers(
      { dragOverFunc },
      {
        targetRef,
        value: '2026-06-15 10:00',
        resetValue: '',
        type: 'interval',
        scope: { timestamp: { date: '2026-06-15', time: '10:00' } },
      },
    )

    handlers.onDragover({ type: 'dragover' } as DragEvent)
    handlers.onDrop({ type: 'drop' } as DragEvent)
    frames[0]!(0)

    expect(cancelAnimationFrame).toHaveBeenCalledWith(1)
    expect(targetRef.value).toBe('')
  })
})

import type { Ref } from 'vue'
import type { CommonProps } from './useCommon'

type DragAndDropProps = Pick<
  CommonProps,
  'dragEnterFunc' | 'dragOverFunc' | 'dragLeaveFunc' | 'dropFunc'
>

interface DragAndDropOptions<T> {
  targetRef: Ref<T>
  value: T
  resetValue: T
  type: string
  scope: any
}

interface QueuedDragTarget<T> {
  frame: number
  value: T
}

const queuedDragTargets = new WeakMap<Ref<unknown>, QueuedDragTarget<unknown>>()

function requestFrame(callback: FrameRequestCallback): number | undefined {
  return typeof globalThis.requestAnimationFrame === 'function'
    ? globalThis.requestAnimationFrame(callback)
    : undefined
}

function cancelFrame(frame: number): void {
  if (typeof globalThis.cancelAnimationFrame === 'function') {
    globalThis.cancelAnimationFrame(frame)
  }
}

function updateDragTarget<T>(targetRef: Ref<T>, value: T): void {
  if (!Object.is(targetRef.value, value)) {
    targetRef.value = value
  }
}

function cancelQueuedDragTarget<T>(targetRef: Ref<T>): void {
  const queued = queuedDragTargets.get(targetRef as Ref<unknown>)

  if (queued !== undefined) {
    cancelFrame(queued.frame)
    queuedDragTargets.delete(targetRef as Ref<unknown>)
  }
}

function queueDragTargetUpdate<T>(targetRef: Ref<T>, value: T): void {
  const queued = queuedDragTargets.get(targetRef as Ref<unknown>) as QueuedDragTarget<T> | undefined

  if (queued !== undefined) {
    queued.value = value
    return
  }

  const frame = requestFrame(() => {
    const queued = queuedDragTargets.get(targetRef as Ref<unknown>) as
      | QueuedDragTarget<T>
      | undefined

    if (queued !== undefined) {
      queuedDragTargets.delete(targetRef as Ref<unknown>)
      updateDragTarget(targetRef, queued.value)
    }
  })

  if (frame === undefined) {
    updateDragTarget(targetRef, value)
    return
  }

  queuedDragTargets.set(targetRef as Ref<unknown>, { frame, value })
}

function runDragCallback<T>(
  callback: ((_event: Event, _type: string, _scope: any) => boolean) | undefined,
  event: DragEvent,
  { targetRef, value, resetValue, type, scope }: DragAndDropOptions<T>,
  immediate = false,
): void {
  if (immediate === true) {
    cancelQueuedDragTarget(targetRef)
  }

  if (typeof callback !== 'function') return

  const nextValue = callback(event, type, { scope }) === true ? value : resetValue

  if (immediate === true) {
    updateDragTarget(targetRef, nextValue)
  } else {
    queueDragTargetUpdate(targetRef, nextValue)
  }
}

export function getDragEventHandlers<T>(
  props: DragAndDropProps,
  options: DragAndDropOptions<T>,
): Record<string, (_event: DragEvent) => void> {
  return {
    onDragenter: (event: DragEvent): void => {
      runDragCallback(props.dragEnterFunc, event, options)
    },
    onDragover: (event: DragEvent): void => {
      runDragCallback(props.dragOverFunc, event, options)
    },
    onDragleave: (event: DragEvent): void => {
      runDragCallback(props.dragLeaveFunc, event, options)
    },
    onDrop: (event: DragEvent): void => {
      runDragCallback(props.dropFunc, event, options, true)
    },
  }
}

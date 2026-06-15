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

function updateDragTarget<T>(targetRef: Ref<T>, value: T): void {
  if (!Object.is(targetRef.value, value)) {
    targetRef.value = value
  }
}

function runDragCallback<T>(
  callback: ((_event: Event, _type: string, _scope: any) => boolean) | undefined,
  event: DragEvent,
  { targetRef, value, resetValue, type, scope }: DragAndDropOptions<T>,
): void {
  if (typeof callback !== 'function') return

  updateDragTarget(targetRef, callback(event, type, { scope }) === true ? value : resetValue)
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
      runDragCallback(props.dropFunc, event, options)
    },
  }
}

import { nextTick, reactive, ref, type Ref } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { parsed, type Timestamp } from '@timestamp-js/core'

import useKeyboard from '../src/composables/useKeyboard'

type ListenerMap = Partial<Record<'focusin' | 'keydown' | 'keyup', EventListener>>

class TestNode {
  children = new Set<TestNode>()
  focus = vi.fn()

  constructor(private listeners?: ListenerMap) {}

  contains(target: EventTarget | null): boolean {
    return target === this || (target instanceof TestNode && this.children.has(target))
  }

  add(child: TestNode): TestNode {
    this.children.add(child)
    return child
  }

  focusElement(documentRef: { activeElement: TestNode }): void {
    this.focus()
    documentRef.activeElement = this
    this.listeners?.focusin?.({ target: this } as unknown as FocusEvent)
  }
}

function createKeyboardHarness(): {
  listeners: ListenerMap
  documentRef: { body: TestNode; activeElement: TestNode }
  root: TestNode
  today: Timestamp
  focusRef: Ref<string>
  focusValue: Ref<Timestamp>
  emittedValue: Ref<string>
  direction: Ref<'next' | 'prev'>
  datesRef: Ref<Record<string, HTMLElement>>
  keyboardActive: Ref<boolean>
  stopNavigation: () => void
} {
  const listeners: ListenerMap = {}
  const documentRef = {
    body: new TestNode(listeners),
    activeElement: undefined as unknown as TestNode,
  }
  documentRef.activeElement = documentRef.body

  const root = new TestNode(listeners)
  const firstDay = root.add(new TestNode(listeners))
  const secondDay = root.add(new TestNode(listeners))

  vi.stubGlobal('Node', TestNode)
  vi.stubGlobal('document', {
    body: documentRef.body,
    get activeElement() {
      return documentRef.activeElement
    },
    set activeElement(value: TestNode) {
      documentRef.activeElement = value
    },
    addEventListener: vi.fn((type: keyof ListenerMap, listener: EventListener) => {
      listeners[type] = listener
    }),
    removeEventListener: vi.fn((type: keyof ListenerMap) => {
      delete listeners[type]
    }),
  })
  vi.stubGlobal('window', {
    requestAnimationFrame: vi.fn((callback: FrameRequestCallback) => {
      callback(0)
      return 1
    }),
    cancelAnimationFrame: vi.fn(),
  })

  const today = parsed('2026-06-15') as Timestamp
  const focusRef = ref('2026-06-15')
  const focusValue = ref(today)
  const emittedValue = ref('2026-06-15')
  const direction = ref<'next' | 'prev'>('next')
  const keyboardActive = ref(false)

  const navigation = useKeyboard(
    reactive({
      useNavigation: true,
      weekdays: [0, 1, 2, 3, 4, 5, 6],
      intervalMinutes: 60,
    }),
    {
      rootRef: ref(root as unknown as HTMLElement),
      keyboardActive,
      focusRef,
      focusValue,
      datesRef: ref({
        '2026-06-15': firstDay as unknown as HTMLElement,
        '2026-06-16': secondDay as unknown as HTMLElement,
      }),
      parsedView: ref('week'),
      emittedValue,
      direction,
      times: { today },
    },
  )

  firstDay.focusElement(documentRef)

  return {
    listeners,
    documentRef,
    root,
    today,
    focusRef,
    focusValue,
    emittedValue,
    direction,
    datesRef: ref({
      '2026-06-15': firstDay as unknown as HTMLElement,
      '2026-06-16': secondDay as unknown as HTMLElement,
    }),
    keyboardActive,
    stopNavigation: navigation.endNavigation,
  }
}

describe('[QCALENDAR] keyboard navigation', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('owns keyboard events only while focus is inside the calendar root', async () => {
    const { listeners, focusRef, keyboardActive, direction, stopNavigation } =
      createKeyboardHarness()
    const keydown = {
      keyCode: 39,
      stopPropagation: vi.fn(),
      preventDefault: vi.fn(),
    } as unknown as KeyboardEvent
    const keyup = {
      keyCode: 39,
      stopPropagation: vi.fn(),
      preventDefault: vi.fn(),
    } as unknown as KeyboardEvent

    expect(keyboardActive.value).toBe(true)

    listeners.keydown?.(keydown)
    listeners.keyup?.(keyup)
    await nextTick()

    expect(keydown.stopPropagation).toHaveBeenCalledTimes(1)
    expect(keydown.preventDefault).toHaveBeenCalledTimes(1)
    expect(focusRef.value).toBe('2026-06-16')
    expect(direction.value).toBe('next')

    stopNavigation()
    expect(keyboardActive.value).toBe(false)
  })
})

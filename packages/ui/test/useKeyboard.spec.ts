import { nextTick, reactive, ref, shallowRef, type Ref } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { parsed, type Timestamp } from '@timestamp-js/core'

import useKeyboard from '../src/composables/useKeyboard'

type ListenerMap = Partial<Record<'focusin' | 'keydown' | 'keyup', EventListener>>

class TestNode {
  children = new Set<TestNode>()
  focus = vi.fn(() => {
    this.onFocus?.(this)
  })

  constructor(private onFocus?: (_node: TestNode) => void) {}

  contains(target: EventTarget | null): boolean {
    return target === this || (target instanceof TestNode && this.children.has(target))
  }

  add(child: TestNode): TestNode {
    this.children.add(child)
    return child
  }

  focusElement(): void {
    this.focus()
  }
}

function createKeyboardHarness({
  useNavigation = true,
  focusInside = true,
  targetKey = '2026-07-15-0',
}: {
  useNavigation?: boolean
  focusInside?: boolean
  targetKey?: string
} = {}): {
  listeners: ListenerMap
  documentRef: { body: TestNode; activeElement: TestNode }
  root: TestNode
  firstDay: TestNode
  secondDay: TestNode
  nextMonthDay: TestNode
  today: Timestamp
  focusRef: Ref<string>
  focusValue: Ref<Timestamp>
  emittedValue: Ref<string>
  direction: Ref<'next' | 'prev'>
  parsedView: Ref<string>
  datesRef: Ref<Record<string, HTMLElement>>
  keyboardActive: Ref<boolean>
  targetKey: string
  flushFrame: () => boolean
  pendingFrameCount: () => number
  stopNavigation: () => void
} {
  const listeners: ListenerMap = {}
  const animationFrames = new Map<number, FrameRequestCallback>()
  let nextFrameHandle = 1
  let documentRef: { body: TestNode; activeElement: TestNode }
  const activate = (node: TestNode): void => {
    documentRef.activeElement = node
    listeners.focusin?.({ target: node } as unknown as FocusEvent)
  }
  const body = new TestNode(activate)

  documentRef = {
    body,
    activeElement: body,
  }

  const root = new TestNode(activate)
  const firstDay = root.add(new TestNode(activate))
  const secondDay = root.add(new TestNode(activate))
  const nextMonthDay = root.add(new TestNode(activate))

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
      const handle = nextFrameHandle++
      animationFrames.set(handle, callback)
      return handle
    }),
    cancelAnimationFrame: vi.fn((handle: number) => {
      animationFrames.delete(handle)
    }),
  })

  const today = parsed('2026-06-15') as Timestamp
  const focusRef = ref('2026-06-15')
  const focusValue = ref(today)
  const emittedValue = ref('2026-06-15')
  const direction = ref<'next' | 'prev'>('next')
  const parsedView = ref('week')
  const keyboardActive = ref(false)
  const datesRef = shallowRef<Record<string, HTMLElement>>({
    '2026-06-15': firstDay as unknown as HTMLElement,
    '2026-06-16': secondDay as unknown as HTMLElement,
    [targetKey]: nextMonthDay as unknown as HTMLElement,
  })

  const navigation = useKeyboard(
    reactive({
      useNavigation,
      weekdays: [0, 1, 2, 3, 4, 5, 6],
      intervalMinutes: 60,
    }),
    {
      rootRef: ref(root as unknown as HTMLElement),
      keyboardActive,
      focusRef,
      focusValue,
      datesRef,
      parsedView,
      emittedValue,
      direction,
      times: { today },
    },
  )

  if (focusInside === true) {
    firstDay.focusElement()
  }

  return {
    listeners,
    documentRef,
    root,
    firstDay,
    secondDay,
    nextMonthDay,
    today,
    focusRef,
    focusValue,
    emittedValue,
    direction,
    parsedView,
    datesRef,
    keyboardActive,
    targetKey,
    flushFrame: () => {
      const frame = animationFrames.entries().next().value
      if (frame === undefined) return false

      const [handle, callback] = frame
      animationFrames.delete(handle)
      callback(0)
      return true
    },
    pendingFrameCount: () => animationFrames.size,
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

  it.each([
    ['an exact date target', '2026-07-15'],
    ['a suffixed day target', '2026-07-15-0'],
    ['a timed interval target', '2026-07-15 00:00'],
  ])('does not focus %s when keyboard navigation is disabled', async (_label, targetKey) => {
    const { focusRef, focusValue, nextMonthDay, pendingFrameCount, stopNavigation } =
      createKeyboardHarness({
        useNavigation: false,
        targetKey,
      })

    focusRef.value = '2026-07-15'
    focusValue.value = parsed('2026-07-15') as Timestamp
    await nextTick()
    await nextTick()

    expect(nextMonthDay.focus).not.toHaveBeenCalled()
    expect(pendingFrameCount()).toBe(0)
    stopNavigation()
  })

  it('does not steal focus from controls outside the calendar', async () => {
    const { documentRef, focusRef, focusValue, keyboardActive, nextMonthDay, stopNavigation } =
      createKeyboardHarness()

    expect(keyboardActive.value).toBe(true)
    documentRef.body.focusElement()

    expect(keyboardActive.value).toBe(false)
    expect(documentRef.activeElement).toBe(documentRef.body)

    focusRef.value = '2026-07-15'
    focusValue.value = parsed('2026-07-15') as Timestamp
    await nextTick()
    await nextTick()

    expect(nextMonthDay.focus).not.toHaveBeenCalled()
    expect(documentRef.activeElement).toBe(documentRef.body)
    stopNavigation()
  })

  it('restores focus when the calendar owns keyboard navigation', async () => {
    const { documentRef, focusRef, focusValue, keyboardActive, nextMonthDay, stopNavigation } =
      createKeyboardHarness()

    expect(keyboardActive.value).toBe(true)

    focusRef.value = '2026-07-15'
    focusValue.value = parsed('2026-07-15') as Timestamp
    await nextTick()
    await nextTick()

    expect(nextMonthDay.focus).toHaveBeenCalledOnce()
    expect(documentRef.activeElement).toBe(nextMonthDay)
    stopNavigation()
  })

  it('restores focus after keyboard navigation crosses a month boundary', async () => {
    const {
      listeners,
      documentRef,
      firstDay,
      nextMonthDay,
      focusRef,
      focusValue,
      emittedValue,
      direction,
      parsedView,
      datesRef,
      keyboardActive,
      stopNavigation,
    } = createKeyboardHarness()
    const keydown = {
      keyCode: 40,
      stopPropagation: vi.fn(),
      preventDefault: vi.fn(),
    } as unknown as KeyboardEvent
    const keyup = {
      keyCode: 40,
      stopPropagation: vi.fn(),
      preventDefault: vi.fn(),
    } as unknown as KeyboardEvent

    parsedView.value = 'month'
    focusRef.value = '2026-06-29-0'
    focusValue.value = parsed('2026-06-29') as Timestamp
    emittedValue.value = '2026-06-29'
    datesRef.value = { '2026-06-29-0': firstDay as unknown as HTMLElement }
    await nextTick()
    firstDay.focus.mockClear()

    listeners.keydown?.(keydown)
    listeners.keyup?.(keyup)

    expect(emittedValue.value).toBe('2026-07-06')
    expect(direction.value).toBe('next')
    expect(keyboardActive.value).toBe(true)

    documentRef.activeElement = documentRef.body
    datesRef.value = { '2026-07-06-0': nextMonthDay as unknown as HTMLElement }
    await nextTick()
    await nextTick()

    expect(nextMonthDay.focus).toHaveBeenCalled()
    expect(documentRef.activeElement).toBe(nextMonthDay)
    stopNavigation()
  })

  it('abandons a pending focus retry when keyboard ownership is lost', async () => {
    const {
      documentRef,
      nextMonthDay,
      focusRef,
      focusValue,
      datesRef,
      keyboardActive,
      targetKey,
      flushFrame,
      pendingFrameCount,
      stopNavigation,
    } = createKeyboardHarness()

    datesRef.value = {}
    focusRef.value = '2026-07-15'
    focusValue.value = parsed('2026-07-15') as Timestamp
    await nextTick()
    await nextTick()

    expect(pendingFrameCount()).toBe(1)

    documentRef.body.focusElement()
    expect(keyboardActive.value).toBe(false)
    datesRef.value = { [targetKey]: nextMonthDay as unknown as HTMLElement }

    expect(flushFrame()).toBe(true)
    expect(nextMonthDay.focus).not.toHaveBeenCalled()

    await nextTick()
    expect(pendingFrameCount()).toBe(0)
    stopNavigation()
  })
})

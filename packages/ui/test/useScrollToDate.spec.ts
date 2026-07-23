import {
  createRenderer,
  createSSRApp,
  defineComponent,
  h,
  nextTick,
  onBeforeUpdate,
  onMounted,
  ref,
} from 'vue'
import { renderToString } from '@vue/server-renderer'
import { parsed } from '@timestamp-js/core'
import { describe, expect, it } from 'vitest'

import useScrollToDate from '../src/composables/useScrollToDate'

interface HostNode {
  type: string
  parent: HostNode | null
  children: HostNode[]
  text: string
  rect: { left: number; width: number }
  getBoundingClientRect: () => DOMRect
}

function createHostNode(type: string, text = ''): HostNode {
  const node: HostNode = {
    type,
    parent: null,
    children: [],
    text,
    rect: { left: 0, width: 0 },
    getBoundingClientRect: () => ({ ...node.rect }) as DOMRect,
  }

  return node
}

function insertNode(child: HostNode, parent: HostNode, anchor: HostNode | null): void {
  child.parent = parent

  if (anchor === null) {
    parent.children.push(child)
  } else {
    parent.children.splice(parent.children.indexOf(anchor), 0, child)
  }
}

const renderer = createRenderer<HostNode, HostNode>({
  patchProp(node, key, _previousValue, value) {
    if (key === 'data-left') {
      node.rect.left = Number(value)
    } else if (key === 'data-width') {
      node.rect.width = Number(value)
    }
  },
  insert: insertNode,
  remove(node) {
    if (node.parent !== null) {
      const index = node.parent.children.indexOf(node)
      if (index !== -1) {
        node.parent.children.splice(index, 1)
      }
      node.parent = null
    }
  },
  createElement: (type) => createHostNode(type),
  createText: (text) => createHostNode('text', text),
  createComment: (text) => createHostNode('comment', text),
  setText(node, text) {
    node.text = text
  },
  setElementText(node, text) {
    node.text = text
    node.children = []
  },
  parentNode: (node) => node.parent,
  nextSibling(node) {
    if (node.parent === null) return null

    const index = node.parent.children.indexOf(node)
    return node.parent.children[index + 1] ?? null
  },
  querySelector: () => null,
  setScopeId: () => {},
  insertStaticContent(content, parent, anchor) {
    const node = createHostNode('static', content)
    insertNode(node, parent, anchor)
    return [node, node]
  },
})

function createScrollArea(): HTMLElement {
  return {
    scrollLeft: 10,
    getBoundingClientRect: () => ({ left: 0, width: 200 }),
  } as HTMLElement
}

function createDateElement(left: number): HTMLElement {
  return {
    getBoundingClientRect: () => ({ left, width: 100 }),
  } as HTMLElement
}

describe('[USE SCROLL TO DATE]', () => {
  it('centers a rendered date and reports dates outside the rendered range', async () => {
    const scrollArea = {
      scrollLeft: 10,
      getBoundingClientRect: () => ({ left: 0, width: 200 }),
    } as HTMLElement
    const dateElement = {
      getBoundingClientRect: () => ({ left: 310, width: 100 }),
    } as HTMLElement
    const timestamp = parsed('2026-07-20')!

    let scrollToDate: (date: string, duration?: number) => boolean = () => false

    const app = createSSRApp(
      defineComponent({
        setup() {
          const controls = useScrollToDate({}, ref(scrollArea), ref([timestamp]))

          controls.registerDate(timestamp, dateElement)
          scrollToDate = controls.scrollToDate

          return () => h('div')
        },
      }),
    )

    await renderToString(app)

    expect(scrollToDate('not-a-date')).toBe(false)
    expect(scrollToDate('2026-07-21')).toBe(false)
    expect(scrollToDate('2026-07-20')).toBe(true)
    expect(scrollArea.scrollLeft).toBe(270)
  })

  it('defers a mount-time request until rendered date refs are registered', async () => {
    const timestamp = parsed('2026-07-20')!
    const scrollArea = createScrollArea()
    let scrollToDate: (date: string, duration?: number) => boolean = () => false
    let accepted = false

    const Calendar = defineComponent({
      setup() {
        const showDate = ref(false)
        const controls = useScrollToDate({}, ref(scrollArea), ref([timestamp]))
        scrollToDate = controls.scrollToDate

        onMounted(() => {
          showDate.value = true
        })

        return () =>
          h(
            'calendar',
            null,
            showDate.value === true
              ? [
                  h('date', {
                    'data-left': 310,
                    'data-width': 100,
                    ref: (el) => controls.registerDate(timestamp, el),
                  }),
                ]
              : [],
          )
      },
    })

    const Parent = defineComponent({
      setup() {
        onMounted(() => {
          accepted = scrollToDate(timestamp.date)
        })

        return () => h(Calendar)
      },
    })

    const app = renderer.createApp(Parent)
    app.mount(createHostNode('root'))

    expect(accepted).toBe(true)
    await nextTick()
    expect(scrollArea.scrollLeft).toBe(270)

    app.unmount()
  })

  it('defers a request made while a rerender is replacing date refs', async () => {
    const timestamp = parsed('2026-07-20')!
    const scrollArea = createScrollArea()
    let requestDuringUpdate = false
    let accepted = false
    let rerender = () => {}

    const Calendar = defineComponent({
      setup() {
        const renderVersion = ref(0)
        const controls = useScrollToDate({}, ref(scrollArea), ref([timestamp]))

        rerender = () => {
          requestDuringUpdate = true
          renderVersion.value++
        }

        onBeforeUpdate(() => {
          if (requestDuringUpdate === true) {
            requestDuringUpdate = false
            accepted = controls.scrollToDate(timestamp.date)
          }
        })

        return () =>
          h('calendar', null, [
            h('date', {
              'data-left': 310,
              'data-width': 100,
              key: renderVersion.value,
              ref: (el) => controls.registerDate(timestamp, el),
            }),
          ])
      },
    })

    const app = renderer.createApp(Calendar)
    app.mount(createHostNode('root'))

    rerender()
    await nextTick()
    await nextTick()

    expect(accepted).toBe(true)
    expect(scrollArea.scrollLeft).toBe(270)

    app.unmount()
  })

  it('keeps only the latest request pending for the current render flush', async () => {
    const firstDate = parsed('2026-07-20')!
    const lastDate = parsed('2026-07-21')!
    const scrollArea = createScrollArea()
    let scrollToDate: (date: string, duration?: number) => boolean = () => false
    let registerDate: ReturnType<typeof useScrollToDate>['registerDate'] = () => {}

    const app = createSSRApp(
      defineComponent({
        setup() {
          const controls = useScrollToDate({}, ref(scrollArea), ref([firstDate, lastDate]))
          scrollToDate = controls.scrollToDate
          registerDate = controls.registerDate

          return () => h('div')
        },
      }),
    )

    await renderToString(app)

    expect(scrollToDate(firstDate.date)).toBe(true)
    expect(scrollToDate(lastDate.date)).toBe(true)

    registerDate(firstDate, createDateElement(110))
    registerDate(lastDate, createDateElement(410))
    await nextTick()

    expect(scrollArea.scrollLeft).toBe(370)
  })

  it('does not retain requests beyond the current render flush', async () => {
    const timestamp = parsed('2026-07-20')!
    const scrollArea = createScrollArea()
    let scrollToDate: (date: string, duration?: number) => boolean = () => false
    let registerDate: ReturnType<typeof useScrollToDate>['registerDate'] = () => {}

    const app = createSSRApp(
      defineComponent({
        setup() {
          const controls = useScrollToDate({}, ref(scrollArea), ref([timestamp]))
          scrollToDate = controls.scrollToDate
          registerDate = controls.registerDate

          return () => h('div')
        },
      }),
    )

    await renderToString(app)

    expect(scrollToDate(timestamp.date)).toBe(true)
    await nextTick()

    registerDate(timestamp, createDateElement(310))
    await nextTick()

    expect(scrollArea.scrollLeft).toBe(10)
  })

  it('does not retain an out-of-range request for a later range', async () => {
    const renderedDate = parsed('2026-07-20')!
    const laterDate = parsed('2026-07-21')!
    const renderedDays = ref([renderedDate])
    const scrollArea = createScrollArea()
    let scrollToDate: (date: string, duration?: number) => boolean = () => false
    let registerDate: ReturnType<typeof useScrollToDate>['registerDate'] = () => {}

    const app = createSSRApp(
      defineComponent({
        setup() {
          const controls = useScrollToDate({}, ref(scrollArea), renderedDays)
          scrollToDate = controls.scrollToDate
          registerDate = controls.registerDate

          return () => h('div')
        },
      }),
    )

    await renderToString(app)

    expect(scrollToDate(laterDate.date)).toBe(false)

    renderedDays.value = [laterDate]
    registerDate(laterDate, createDateElement(310))
    await nextTick()

    expect(scrollArea.scrollLeft).toBe(10)
  })

  it('discards a pending request when the calendar unmounts', async () => {
    const timestamp = parsed('2026-07-20')!
    const scrollArea = createScrollArea()
    let scrollToDate: (date: string, duration?: number) => boolean = () => false
    let registerDate: ReturnType<typeof useScrollToDate>['registerDate'] = () => {}

    const Calendar = defineComponent({
      setup() {
        const controls = useScrollToDate({}, ref(scrollArea), ref([timestamp]))
        scrollToDate = controls.scrollToDate
        registerDate = controls.registerDate

        return () => h('calendar')
      },
    })

    const app = renderer.createApp(Calendar)
    app.mount(createHostNode('root'))

    expect(scrollToDate(timestamp.date)).toBe(true)
    app.unmount()

    registerDate(timestamp, createDateElement(310))
    await nextTick()

    expect(scrollArea.scrollLeft).toBe(10)
  })
})

/**
 * The main QCalendar wrapper
 * All others are a child to this one
 */

// Vue
import { computed, h, ref, reactive, withDirectives, VNode, Ref, ComputedRef } from 'vue'

// Directives
import ResizeObserver from '../directives/ResizeObserver'

interface CalendarProps {
  noScroll?: boolean
  locale: string
  dark?: boolean
  bordered?: boolean
}

interface RenderFunc {
  (): VNode
}

interface ScrollArea {
  value: HTMLElement | null
}

interface Pane {
  value: HTMLElement | null
}

interface ResizeObserverEntry {
  width: number
  height: number
}

interface CalendarReturn {
  scrollWidth: ComputedRef<number>
  rootRef: Ref<HTMLElement | null>
  __initCalendar: () => void
  __renderCalendar: () => VNode
}

export default function useCalendar(
  props: CalendarProps,
  renderFunc: RenderFunc,
  { scrollArea, pane }: { scrollArea: ScrollArea; pane: Pane },
): CalendarReturn {
  if (!renderFunc) {
    const msg = '[error: renderCalendar] no renderFunc has been supplied to useCalendar'
    console.error(msg)
    throw new Error(msg)
  }

  const size = reactive({ width: 0, height: 0 }),
    rootRef = ref<HTMLElement | null>(null)

  function __onResize({ width, height }: ResizeObserverEntry): void {
    size.width = width
    size.height = height
  }

  const scrollWidth = computed(() => {
    return props.noScroll !== true
      ? scrollArea.value && pane.value && size.height // force recalc with height change
        ? scrollArea.value.offsetWidth - pane.value.offsetWidth
        : 0
      : 0
  })

  function __initCalendar(): void {
    // required
  }

  function __renderCalendar(): VNode {
    const data: Record<string, any> = {
      ref: rootRef,
      role: 'complementary',
      lang: props.locale,
      class: `q-calendar ${props.dark ? 'q-calendar--dark' : ''} ${props.bordered ? 'q-calendar__bordered' : ''}`,
    }

    return withDirectives(h('div', { ...data }, [renderFunc()]), [[ResizeObserver, __onResize]])
  }

  return {
    rootRef,
    scrollWidth,
    __initCalendar,
    __renderCalendar,
  }
}

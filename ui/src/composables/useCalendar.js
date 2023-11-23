/**
 * The main QCalendar wrapper
 * All others are a child to this one
 */

// Vue
import { computed, h, ref, reactive, withDirectives } from 'vue'

// Directives
import ResizeObserver from '../directives/ResizeObserver.js'

export default function (props, renderFunc, { scrollArea, pane }) {
  if (!renderFunc) {
    const msg = '[error: renderCalendar] no renderFunc has been supplied to useCalendar'
    console.error(msg)
    throw new Error(msg)
  }

  const size = reactive({ width: 0, height: 0 }),
    rootRef = ref(null)

  function __onResize({ width, height }) {
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

  // function __initCalendar() {
  //   //
  // }

  function __renderCalendar() {
    const data = {
      ref: rootRef,
      role: 'complementary',
      lang: props.locale,
      class: `q-calendar ${ props.dark ? 'q-calendar--dark' : '' } ${ props.bordered ? 'q-calendar__bordered' : '' }`,
    }

    return withDirectives(h('div', { ...data }, [renderFunc()]), [[ ResizeObserver, __onResize ]])
  }

  return {
    rootRef,
    scrollWidth,
    __initCalendar,
    __renderCalendar,
  }
}

// Vue
import {
  h,
  nextTick,
  ref,
  watch,
  withDirectives
} from 'vue'

// Directives
import Resize from '../directives/Resize.js'

export default function (props, renderFunc, {
  scrollArea,
  pane
}) {
  if (!renderFunc) {
    const msg = '[error: renderCalendar] no renderFunc has been supplied to useCalendar'
    console.error(msg)
    throw new Error(msg)
  }

  const rootRef = ref(null)
  const scrollWidth = ref(15) // default

  function __initCalendar () {
    nextTick(__onResize)
  }

  function __onResize () {
    scrollWidth.value = __getScrollWidth()
  }

  function __getScrollWidth () {
    return scrollArea.value && pane.value ? (scrollArea.value.offsetWidth - pane.value.offsetWidth) : 0
  }

  function __updateScrollbar () {
    __onResize()
  }

  // watch for toggle of noScroll
  watch(() => props.noScroll, val => {
    if (val === true) {
      scrollWidth.value = 0
    }
    else {
      nextTick(__onResize)
    }
  })

  function __renderCalendar () {
    const data = {
      ref: rootRef,
      role: 'complementary',
      lang: props.locale,
      class: {
        'q-calendar--dark': props.dark === true,
        'q-calendar': true,
        'q-calendar__bordered': props.bordered === true
      }
    }

    return withDirectives(
      h('div', data, [
        renderFunc()
      ]),
      [[
        Resize,
        __onResize,
        undefined,
        {
          quiet: true, // no initial event fired
          passive: true
        }
      ]]
    )
  }

  return {
    rootRef,
    scrollWidth,
    __updateScrollbar,
    __initCalendar,
    __renderCalendar
  }
}

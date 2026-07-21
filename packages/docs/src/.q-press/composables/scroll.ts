import { scroll } from 'quasar'
import { watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMarkdownStore } from '../stores/markdown'
const { setVerticalScrollPosition, getVerticalScrollPosition } = scroll

/**
 * Provides anchor scrolling and active table-of-contents tracking for Q-Press pages.
 *
 * @returns An object containing functions to manage scroll behavior.
 */
export function useScroll() {
  let scrollTimer: ReturnType<typeof setTimeout> | undefined
  let anchorStabilizationTimer: ReturnType<typeof setTimeout> | undefined
  let anchorResizeObserver: ResizeObserver | undefined
  let anchorFrame: number | undefined
  let stabilizedAnchor: HTMLElement | null = null
  let stabilizedHash = ''
  const scrollDuration = 500
  const anchorOffset = 166 // TODO: dynamic header offset
  const anchorStabilizationDuration = 10_000
  const route = useRoute()
  const router = useRouter()
  const markdownStore = useMarkdownStore()

  let preventTocUpdate = route.hash.length > 1

  // Watch for route changes
  watch(
    () => route.fullPath,
    (newRoute, oldRoute) => {
      setTimeout(() => {
        scrollToCurrentAnchor(newRoute !== oldRoute)
      })
    },
  )

  /**
   * Changes the router's hash to the specified value. If the current hash is different from the provided hash,
   * it replaces the current hash with the new one. If the hash is the same, it scrolls to the current anchor.
   *
   * @param hash - The new hash value to set in the router.
   */
  function changeRouterHash(hash: string) {
    if (route.hash !== hash) {
      router.replace({ hash }).catch(() => {})
    } else {
      scrollToCurrentAnchor()
    }
  }

  /**
   * Scrolls the page to the specified HTML element with a given delay.
   *
   * @param el - The HTML element to scroll to.
   * @param delay - The delay in milliseconds for the scroll animation.
   */
  function scrollPage(el: HTMLElement, delay: number) {
    const { top } = el.getBoundingClientRect()
    const offset = Math.max(0, top + getVerticalScrollPosition(window) - anchorOffset)

    clearTimeout(scrollTimer)

    preventTocUpdate = true
    setVerticalScrollPosition(window, offset, delay)

    scrollTimer = setTimeout(() => {
      preventTocUpdate = false
    }, delay + 10)
  }

  /**
   * Stops correcting an anchor after the initial page layout has settled or the user starts interacting.
   */
  function stopAnchorStabilization() {
    clearTimeout(anchorStabilizationTimer)
    anchorResizeObserver?.disconnect()

    if (anchorFrame !== undefined) {
      window.cancelAnimationFrame(anchorFrame)
    }

    window.removeEventListener('keydown', stopAnchorStabilization)
    window.removeEventListener('pointerdown', stopAnchorStabilization)
    window.removeEventListener('touchstart', stopAnchorStabilization)
    window.removeEventListener('wheel', stopAnchorStabilization)

    anchorResizeObserver = undefined
    anchorFrame = undefined
    stabilizedAnchor = null
    stabilizedHash = ''
  }

  /**
   * Keeps a linked heading at the header offset while asynchronous examples and media above it expand.
   */
  function stabilizeCurrentAnchor(el: HTMLElement) {
    stopAnchorStabilization()

    if (typeof ResizeObserver !== 'function') {
      return
    }

    stabilizedAnchor = el
    stabilizedHash = location.hash

    const alignAnchor = () => {
      anchorFrame = undefined

      if (
        stabilizedAnchor === null ||
        stabilizedAnchor.isConnected === false ||
        location.hash !== stabilizedHash
      ) {
        stopAnchorStabilization()
        return
      }

      const { top } = stabilizedAnchor.getBoundingClientRect()

      if (Math.abs(top - anchorOffset) > 1) {
        const offset = Math.max(0, top + getVerticalScrollPosition(window) - anchorOffset)
        setVerticalScrollPosition(window, offset, 0)
      }
    }

    const scheduleAnchorAlignment = () => {
      if (anchorFrame !== undefined) {
        window.cancelAnimationFrame(anchorFrame)
      }

      anchorFrame = window.requestAnimationFrame(alignAnchor)
    }

    const contentEl =
      el.closest<HTMLElement>('.markdown-page__content') ??
      el.closest<HTMLElement>('.q-page') ??
      document.documentElement

    anchorResizeObserver = new ResizeObserver(scheduleAnchorAlignment)
    anchorResizeObserver.observe(contentEl)

    window.addEventListener('keydown', stopAnchorStabilization)
    window.addEventListener('pointerdown', stopAnchorStabilization)
    window.addEventListener('touchstart', stopAnchorStabilization, { passive: true })
    window.addEventListener('wheel', stopAnchorStabilization, { passive: true })

    anchorStabilizationTimer = setTimeout(stopAnchorStabilization, anchorStabilizationDuration)
    scheduleAnchorAlignment()
  }

  /**
   * Scrolls the page to the HTML element with the specified ID, updates the router's hash, and sets the active TOC (table of contents) item.
   *
   * @param id - The ID of the HTML element to scroll to.
   */
  function scrollTo(id: string) {
    clearTimeout(scrollTimer)
    changeRouterHash('#' + id)

    setTimeout(() => {
      markdownStore.setActiveToc(getVerticalScrollPosition(window))
    }, scrollDuration + 50)
  }

  /**
   * Handles the page scroll event and updates the active TOC (table of contents) item, unless the TOC update is prevented.
   *
   * @param position - The current vertical scroll position of the page.
   */
  function onPageScroll({ position }: { position: number }) {
    // @ts-expect-error Jeff - fix later when I can figure this one out
    if (preventTocUpdate !== true && document.qScrollPrevented !== true) {
      markdownStore.setActiveToc(position)
    }
  }

  /**
   * Scrolls the page to the current anchor element, optionally with an immediate scroll.
   *
   * @param immediate - If true, the scroll will be immediate without any animation.
   */
  function scrollToCurrentAnchor(immediate?: boolean) {
    const hash = location.hash
    const el = hash.length > 1 ? document.getElementById(hash.substring(1)) : null

    if (el !== null) {
      if (immediate === true) {
        let anchorEl: HTMLElement | null = el
        while (
          anchorEl?.parentElement !== null &&
          !anchorEl.parentElement.classList.contains('q-page')
        ) {
          anchorEl = anchorEl.parentElement
        }

        if (anchorEl) {
          document.body.classList.add('q-scroll--lock')
          anchorEl.classList.add('q-scroll--anchor')

          setTimeout(() => {
            document.body.classList.remove('q-scroll--lock')
            if (anchorEl) {
              anchorEl.classList.remove('q-scroll--anchor')
            }
          }, 2000)
        }
      }

      scrollPage(el, immediate === true ? 0 : scrollDuration)
      stabilizeCurrentAnchor(el)
    } else {
      stopAnchorStabilization()
      preventTocUpdate = false
      markdownStore.setActiveToc()
    }
  }

  onMounted(() => {
    setTimeout(() => {
      scrollToCurrentAnchor(true)
    })
  })

  onBeforeUnmount(() => {
    clearTimeout(scrollTimer)
    stopAnchorStabilization()
  })

  return {
    scrollTo,
    onPageScroll,
  }
}

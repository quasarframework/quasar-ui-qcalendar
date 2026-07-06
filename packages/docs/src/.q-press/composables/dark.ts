import { useQuasar } from 'quasar'
import { useMarkdownStore } from '../stores/markdown'
import { computed, watch, type ComputedRef } from 'vue'

export type UseDarkReturn = {
  /**
   * Computed reference to the current Q-Press dark-mode state.
   */
  isDark: ComputedRef<boolean>

  /**
   * Initializes dark mode from the saved theme cookie.
   */
  initDark: () => void

  /**
   * Toggles dark mode and persists the chosen theme.
   */
  toggleDark: () => void
}

/**
 * Provides Q-Press dark-mode state, cookie persistence, and Quasar Dark sync.
 *
 * @returns Dark-mode state and helpers for Q-Press layouts.
 */
export function useDark(): UseDarkReturn {
  const $q = useQuasar()
  const markdownStore = useMarkdownStore()

  const isDark = computed(() => markdownStore.dark)

  /**
   * Initializes dark mode from the saved theme cookie.
   */
  function initDark() {
    markdownStore.dark = $q.cookies.get('theme') !== 'light'
    $q.dark.set(markdownStore.dark)
  }

  /**
   * Toggles dark mode and persists the chosen theme.
   */
  function toggleDark() {
    $q.dark.toggle()
    markdownStore.dark = $q.dark.isActive

    $q.cookies.set('theme', markdownStore.dark ? 'dark' : 'light', {
      path: '/',
      sameSite: 'Strict',
      expires: 400,
    })
  }

  watch(
    () => markdownStore.dark,
    (val) => {
      $q.dark.set(val)
    },
  )

  return {
    isDark,
    initDark,
    toggleDark,
  }
}

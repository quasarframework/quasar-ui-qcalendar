import { useQuasar } from 'quasar'
import { useMarkdownStore } from '../stores/markdown'
import { computed, watch } from 'vue'

/**
 * Provides Q-Press dark-mode state, cookie persistence, and Quasar Dark sync.
 */
export function useDark() {
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

import { defineStore, acceptHMRUpdate } from 'pinia'
import { useRoute } from 'vue-router'
import { useScroll } from '../composables/scroll'

export const useMarkdownStore = defineStore('markdown-store', {
  state: () => ({
    title: '',
    toc: [] as TocMenuItem[],
    activeToc: null as string | null,
    menuDrawer: false,
    tocDrawer: false,
    dark: false,
  }),
  getters: {
    isDark: (state) => state.dark === true,
    isMenuDrawerOpen: (state) => state.menuDrawer,
    isTocDrawerOpen: (state) => state.tocDrawer,
    activeTocIndex: (state) => state.toc.findIndex((section) => section.id === state.activeToc),
  },
  actions: {
    toggleMenuDrawer() {
      this.menuDrawer = this.menuDrawer === false
    },
    toggleTocDrawer() {
      this.tocDrawer = this.tocDrawer === false
    },

    updateActiveToc(position?: number): void {
      if (!position) {
        position = document.documentElement.scrollTop || document.body.scrollTop
      }

      let last

      for (const section of this.toc) {
        const item = document.getElementById(section.id)

        if (!item) {
          continue
        }

        const offset =
          section.deep === true
            ? item.offsetTop + (item.offsetParent as HTMLElement).offsetTop
            : item.offsetTop

        if (offset >= position + 155) {
          if (last === void 0) {
            last = section.id
          }
          break
        } else {
          last = section.id
        }
      }

      if (last !== void 0) {
        this.activeToc = last
      }
    },

    setToc(toc: TocMenuItem[]) {
      const { scrollTo } = useScroll()
      this.toc =
        toc !== void 0
          ? ([
              {
                id: 'introduction',
                title: '1. Introduction',
                level: 0,
                sub: false,
                onClick: () => scrollTo('introduction'),
              },
              ...toc.map((entry) => ({
                ...entry,
                onClick: () => {
                  this.tocDrawer = false
                  scrollTo(entry.id)
                },
              })),
            ] as TocMenuItem[])
          : []

      if (this.toc.length <= 1) {
        this.tocDrawer = false
      }
    },

    injectToc() {
      const route = useRoute()

      this.toc = []
      this.tocDrawer = false
      this.activeToc = route.hash.length > 1 ? route.hash.substring(1) : null
    },

    setActiveToc(pos?: number): void {
      this.updateActiveToc(pos)
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMarkdownStore, import.meta.hot))
}

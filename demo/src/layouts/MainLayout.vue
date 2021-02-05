<template>
  <q-layout
    view="HHh LpR fFf"
    @scroll="onScroll"
  >
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          QCalendar <span class="text-subtitle2">v{{ version }}</span>
        </q-toolbar-title>

        <q-btn
          flat
          round
          :icon="$q.dark.isActive ? 'brightness_2' : 'brightness_5'"
          @click="$q.dark.toggle()"
        />
        <div v-if="$q.screen.width > 500">
          Quasar v{{ $q.version }}
        </div>

        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Table of Contents"
          @click="rightDrawerOpen = !rightDrawerOpen"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      aria-label="Menu"
      class="menu"
    >
      <q-list>
        <q-item-label header>
          <q-icon
            name="fas fa-link"
            size="1.5em"
            class="q-mr-md"
          /><span style="font-size: 1.5em">Essential Links</span>
        </q-item-label>
        <q-separator />
      </q-list>
      <essential-links />
    </q-drawer>

    <q-drawer
      ref="drawer"
      v-model="rightDrawerOpen"
      show-if-above
      side="right"
      bordered
      aria-label="Table of Contents"
      class="toc"
    >
      <q-scroll-area class="fit">
        <q-list dense>
          <q-item
            v-for="item in toc"
            :key="item.id"
            v-ripple
            clickable
            dense
            :active="activeToc === item.id"
            @click="scrollTo(item.id)"
          >
            <q-item-section
              v-if="item.level > 1"
              side
            >
              •
            </q-item-section>
            <q-item-section
              :class="`toc-item toc-level-${item.level}`"
            >
              {{ item.label }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <transition name="fade">
        <router-view />
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import { scroll } from 'quasar'
const { setScrollPosition } = scroll
import { version } from 'ui'

export default {
  name: 'MainLayout',
  components: {
    'essential-links': () => import('../components/EssentialLinks')
  },
  data () {
    return {
      version,
      leftDrawerOpen: this.$q.platform.is.desktop,
      rightDrawerOpen: this.$q.platform.is.desktop,
      activeToc: 0
    }
  },
  computed: {
    ...mapGetters({
      toc: 'common/toc'
    })
  },
  mounted () {
    // code to handle anchor link on refresh/new page, etc
    if (location.hash !== '') {
      const id = location.hash.substring(1, location.hash.length)
      setTimeout(() => {
        this.scrollTo(id)
      }, 200)
    }
  },
  methods: {
    scrollTo (id) {
      this.activeToc = id
      const el = document.getElementById(id)

      if (el) {
        setTimeout(() => {
          this.scrollPage(el)
        }, 200)
      }
    },
    scrollPage (el) {
      // const target = getScrollTarget(el)
      const offset = el.offsetTop - 50
      // setScrollPosition(target, offset, 500)
      setScrollPosition(window, offset, 500)
    },
    onScroll ({ position }) {
      if (this.scrollingPage !== true) {
        this.updateActiveToc(position)
      }
    },
    updateActiveToc (position) {
      const toc = this.toc
      let last

      for (const i in toc) {
        const section = toc[ i ]
        const item = document.getElementById(section.id)

        if (item === null) {
          continue
        }

        if (item.offsetTop >= position + 50) {
          if (last === undefined) {
            last = section.id
          }
          break
        }
      }

      if (last !== undefined) {
        this.activeToc = last
      }
    }
  }
}
</script>

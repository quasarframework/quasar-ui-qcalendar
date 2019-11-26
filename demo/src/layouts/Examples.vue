<template>
  <q-layout view="HHh LpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          QCalendar <span class="text-subtitle2">v{{ version }}</span>
        </q-toolbar-title>

        <q-space />

        <q-btn flat round @click="$q.dark.toggle()" :icon="$q.dark.isActive ? 'brightness_2' : 'brightness_5'" />
        <div v-if="$q.screen.width > 500">Quasar v{{ $q.version }}</div>

        <q-btn
          flat
          dense
          round
          @click="rightDrawerOpen = !rightDrawerOpen"
          aria-label="Table of Contents"
        >
          <q-icon name="menu" />
        </q-btn>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
    >
      <div class="col-12">
        <q-expansion-item
          expand-separator
          default-opened
          group="somegroup"
          icon="fas fa-cogs"
          label="QCalendar"
          caption="QCalendar Examples"
        >
          <q-separator />
          <q-list dense>

            <q-item clickable to="/examples/day-view">
              <q-item-section avatar>
                <q-icon name="fas fa-calendar-day" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Day View</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable to="/examples/week-view">
              <q-item-section avatar>
                <q-icon name="fas fa-calendar-week" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Week View</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable to="/examples/month-view">
              <q-item-section avatar>
                <q-icon name="fas fa-calendar-alt" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Month View</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable to="/examples/scheduler-view">
              <q-item-section avatar>
                <q-icon name="fas fa-calendar" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Scheduler View</q-item-label>
              </q-item-section>
            </q-item>

            <!-- <q-item clickable to="/examples/customization">
              <q-item-section>
                <q-item-label>Customization</q-item-label>
              </q-item-section>
            </q-item> -->

          </q-list>
        </q-expansion-item>

        <q-expansion-item
          expand-separator
          group="somegroup"
          icon="fas fa-link"
          label="Essential Links"
        >
          <q-separator />
          <essential-links />
        </q-expansion-item>
        <q-separator />
      </div>
    </q-drawer>

    <q-drawer
      ref="drawer"
      v-model="rightDrawerOpen"
      side="right"
      bordered
    >
      <q-scroll-area class="fit">
        <q-list dense>
          <q-item
            v-for="item in toc"
            :key="item.id"
            clickable
            v-ripple
            dense
            @click="scrollTo(item.id)"
            :active="activeToc === item.id"
          >
          <q-item-section v-if="item.level > 1" side> • </q-item-section>
            <q-item-section
              :class="`toc-item toc-level-${item.level}`"
            >{{ item.label }}</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
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
      version: version,
      leftDrawerOpen: this.$q.platform.is.desktop,
      rightDrawerOpen: this.$q.platform.is.desktop,
      activeToc: 0
    }
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
  computed: {
    ...mapGetters({
      toc: 'common/toc'
    })
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
    }
  }
}
</script>

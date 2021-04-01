<template>
  <q-layout view="HHh LpR fFf" @scroll="onScroll">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <q-btn
            flat
            no-caps
            type="a"
            href="\"
          >
          <div>
            <span style="font-size: 20px;">QCalendar &nbsp; </span><span style="font-size: 12px;">v{{ version }}</span>
          </div>
          </q-btn>
        </q-toolbar-title>

        <q-space />

        <q-btn flat round @click="$q.dark.toggle()" :icon="$q.dark.isActive ? 'brightness_2' : 'brightness_5'" />

        <div v-if="$q.screen.width > 500">Quasar <span style="font-size: 12px;">v{{ $q.version }}</span></div>

        <q-btn
          v-if="isExample === true || store.toc.length > 0"
          flat
          dense
          round
          icon="menu"
          aria-label="Table of Contents"
          @click="toggleRightDrawer"
        />

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      class="menu markdown__scroll"
    >
      <q-list dense>
        <q-expansion-item
          v-for="parent in menu"
          :key="parent.name"
          group="menu"
          dense
          dense-toggle
          :label="parent.name"
        >
          <template
            v-for="child in parent.children"
            :key="child.name"
          >
            <q-item
              v-if="child.path"
              clickable
              v-ripple
              dense
              @click="onChildClick(child.path)"
              :active="child.name !== undefined && child.name === $route.name"
              class="menu ellipsis"
            >
              <q-item-section side></q-item-section>
              <q-item-section>{{ child.name }}</q-item-section>
            </q-item>

            <q-item
              v-if="child.link"
              tag="a"
              :href="child.link"
              target="_blank"
              dense
              :label="child.name"
              class="menu ellipsis"
            >
              <q-item-section side></q-item-section>
              <q-item-section>{{ child.name }}</q-item-section>
              <q-item-section side><q-icon :name="getMenuIcon(child)" /></q-item-section>
            </q-item>

          </template>
        </q-expansion-item>

        <q-item-label
          header
        >
          <div>Found: {{ filteredPages.length }} examples</div>
          <q-input
            v-model="filter"
            dense
            clearable
            label="Search"
          />
        </q-item-label>

        <q-item
          v-for="page in filteredPages"
          :key="page.path"
          clickable
          v-ripple
          dense
          @click="onExampleClick(page.path)"
          :active="page.name !== undefined && page.name === $route.name"
          class="menu ellipsis"
        >
          <q-item-section>{{ page.name }}</q-item-section>
       </q-item>

      </q-list>
    </q-drawer>

    <q-drawer
      v-if="isExample === true || store.toc.length > 0"
      ref="drawer"
      v-model="rightDrawerOpen"
      show-if-above
      side="right"
      aria-label="Table of Contents"
      class="toc markdown__scroll"
    >
      <q-scroll-area class="fit">
        <q-list dense>
          <q-item
            v-for="item in store.toc"
            :key="item.id"
            clickable
            v-ripple
            dense
            @click="scrollTo(item.id)"
            :active="activeToc === item.id"
            class="toc"
          >
            <q-item-section
              v-if="item.level > 2"
              side> » </q-item-section>
            <q-item-section>{{ item.label }}</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>

      <div class="fit q-pa-sm">
        <div
          v-if="isExample === true"
          style="width: 100%; text-align: left; margin: 8px;"
        >
          <div style="width: 100%; display: flex; justify-content: center;">
            <div style="font-size: 24px; font-weight: 500;">{{ name }}</div>
          </div>
          <div style="width: 100%; display: flex; justify-content: center;">
            <a
              v-if="path !== null"
              :href="path"
              target="_blank"
              class="button link"
            >View Source on Github
            </a>
          </div>
        </div>

        <div :class="'flex ' + (isExample === true ? 'flex-center' : 'flex-start')">
          <div style="max-width: 800px; width: 100%;">
            <router-view />
          </div>
        </div>
      </div>

    </q-page-container>
  </q-layout>
</template>

<script>

import { defineComponent, ref, reactive, computed, onBeforeMount, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { version } from '@quasar/quasar-ui-qcalendar'

import { scroll } from 'quasar'
const { setVerticalScrollPosition } = scroll

import children from '../router/children.js'
import menuItems from './menu.js'
import { useMarkdownStore } from 'assets/markdown-store.js'

import {
  biLink,
  biTwitter,
  biGithub
} from '@quasar/extras/bootstrap-icons'

export default defineComponent({
  name: 'MainLayout',

  components: {
  },

  setup () {
    const path = ref(null),
      basePath = 'https://github.com/quasarframework/quasar-ui-qcalendar/tree/next/ui/dev/src/examples/',
      name = ref(null),
      store = useMarkdownStore(),
      $route = useRoute(),
      $router = useRouter(),
      leftDrawerOpen = ref(false),
      rightDrawerOpen = ref(false),
      filter = ref(''),
      menu = reactive(menuItems),
      activeToc = ref(0)

    const isExample = computed(() => $route.path.startsWith('/examples'))

    const filteredPages = computed(() => {
      if (filter.value) {
        const filtered = filter.value.toLowerCase()
        return children.filter(val =>
          val.name.toLowerCase().indexOf(filtered) > -1)
      }
      return children
    })

    onBeforeMount(() => {
      const val = localStorage.getItem('filter')
      if (val) {
        filter.value = val
      }
    })

    onMounted(() => {
      handleRouteChange()
    })

    watch(filter, (val) => {
      localStorage.setItem('filter', val)
    })

    function onClearFilter () {
      filter.value = ''
    }

    watch(() => $route.fullPath, () => {
      handleRouteChange()
    })

    function handleRouteChange () {
      if ($route.fullPath === '/' || $route.name === undefined) {
        path.value = null
        name.value = null
      }
      else {
        path.value = basePath + $route.name + '.vue'
        name.value = $route.name
      }
    }

    function onToggleMenuItem (item) {
      let doExpand = true
      if (item !== undefined && item.expanded === true) doExpand = false
      menu.forEach(itm => { itm.expanded = false })
      if (item !== undefined && doExpand === true) item.expanded = true
    }

    function onChildClick (path) {
      $router.push('/' + path)
    }

    function onExampleClick (path) {
      store.toc = [] // remove toc
      onToggleMenuItem() // close accordian menu
      $router.push('/examples/' + path)
    }

    function klasses (item) {
      return {
        menu: true,
        active: item.name !== undefined && item.name === $route.name,
        ellipsis: true
      }
    }

    function parentClasses (parent) {
      return {
        parent: true,
        parent__expanded: parent.expanded === true,
        parent__collapsed: parent.expanded === false
      }
    }

    function childClasses (parent) {
      return {
        child: true,
        child__expanded: parent.expanded === true,
        child__collapsed: parent.expanded === false
      }
    }

    function scrollTo (id) {
      activeToc.value = id
      const el = document.getElementById(id)

      if (el) {
        scrollPage(el)
      }
    }

    function scrollPage (el) {
      const rect = el.getBoundingClientRect(),
        scrollTop = window.pageYOffset || document.documentElement.scrollTop,
        offset = rect.top + scrollTop - 50

      setVerticalScrollPosition(window, offset, 500)
    }

    function onScroll ({ position }) {
      updateActiveToc(position)
      // if (scrollingPage !== true) {
      //   updateActiveToc(position)
      // }
    }

    function updateActiveToc (position) {
      const toc = store.toc
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
        activeToc.value = last
      }
    }

    function getMenuIcon (child) {
      switch (child.name) {
        case 'Github': return biGithub
        case 'Twitter': return biTwitter
        default: return biLink
      }
    }

    return {
      version,
      isExample,
      store,
      menu,
      path,
      name,
      filter,
      filteredPages,
      onClearFilter,
      onChildClick,
      onExampleClick,
      klasses,
      parentClasses,
      childClasses,
      onToggleMenuItem,
      activeToc,
      leftDrawerOpen,
      rightDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      toggleRightDrawer () {
        rightDrawerOpen.value = !rightDrawerOpen.value
      },
      onScroll,
      scrollTo,
      getMenuIcon,
      biLink,
      biTwitter,
      biGithub
    }
  }
})
</script>

<style lang="sass" scoped>
.header
  width: 100vw
  height: 60px
  min-height: 60px
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)
  border: none
  display: flex
  flex-direction: row
  justify-content: space-evenly
  align-items: center
  background: rgba(0,200,200,.20)
  color: rgba(0,140,200,.8)

.header-left,
.header-right,
.header-middle
  display: flex
  flex: 1 0 0
  flex-direction: row
  justify-content: space-evenly
  align-items: center

.header-left
  justify-content: flex-start
  margin-left: 20px

.header-middle
  justify-content: center
  align-items: baseline

.header-right
  justify-content: flex-end
  margin-right: 20px

.header-text1
  font-size: 26px
  white-space: nowrap

.header-text2
  font-size: 14px

.parent
  position: relative
  transition: transform .3s

  &__expanded
    transform: rotate(-180deg)

  &__collapsed
    transform: rotate(0deg)

.child
  overflow: hidden
  color: var(--text-color)
  background: var(--background-color)
  border-left: 1px solid var(--border-color)
  border-right: 1px solid var(--border-color)
  border-bottom: 1px solid var(--border-color)
  max-width: calc(100% - 10px)
  border-bottom-right-radius: 5px
  border-bottom-left-radius: 5px
  align-self: center
  margin-top: -2px
  font-size: 0.8em
  display: flex
  flex-direction: column
  align-items: flex-start
  will-change: max-height, border
  transition: max-height 0.3s cubic-bezier(0.215, 0.61, 0.355, 1), border 0.2s cubic-bezier(0.215, 0.61, 0.355, 1)

  &__expanded
    max-height: 1000px

  &__collapsed
    max-height: 0 !important
    border-left: 1px solid var(--background-color)
    border-right: 1px solid var(--background-color)
    border-bottom: 1px solid var(--background-color)

  &__item
    display: flex
    flex-direction: row
    flex: 1 0 auto
    cursor: pointer
    padding: 2px 15px
    width: 100%
    outline: 0
    border-top-left-radius: 5px
    border-bottom-left-radius: 5px
    text-decoration: none
    color: inherit
    border: 1px solid var(--background-color)
    transition: background 0.3 cubic-bezier(0.215, 0.61, 0.355, 1), color 0.3 cubic-bezier(0.215, 0.61, 0.355, 1), border 0.3 cubic-bezier(0.215, 0.61, 0.355, 1)

    &:hover,
    &:active
      background: var(--background-color-hover)
      color: var(--text-color-hover)
      border: 1px solid var(--background-color-hover)

    &:focus,
    &.active
      background: var(--background-color-hover)
      color: var(--text-color-hover)
      border: 1px solid var(--background-color-hover)
</style>

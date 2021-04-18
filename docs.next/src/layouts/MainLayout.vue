<template>
  <q-layout view="HHh LpR fFf" @scroll="onScroll">
    <q-header elevated>
      <q-toolbar>
        <toolbar-contents
          :title="title"
          left-drawer-button
          :right-drawer-button="store.toc.length > 0"
          :left-drawer-button-func="toggleLeftDrawer"
          :right-drawer-button-func="toggleRightDrawer"
        />
      </q-toolbar>
    </q-header>

    <q-footer elevated>
      <q-toolbar>
        <div class="full-width text-center">This documentation site for QCalendar is a work in progress. If you see something missing or inaccurate, please create a PR on the <markdown-link to="https://github.com/quasarframework/quasar-ui-qcalendar/tree/next" style="color: white;">Github repo</markdown-link>.</div>
      </q-toolbar>
    </q-footer>

    <q-drawer
      v-model="leftDrawerOpen"
      :show-if-above="$route.path !== '/'"
      class="menu markdown__scroll"
    >
      <left-menu />
    </q-drawer>

    <q-drawer
      v-if="store.toc.length > 0"
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

      <div class="fit full-width">
        <div
          v-if="isExample === true"
          class="full-width"
        >
          <div style="width: 100%; display: flex; justify-content: center;">
            <div style="font-size: 24px; font-weight: 500;">{{ name }}</div>
          </div>
          <div style="width: 100%; display: flex; justify-content: center;">
            <q-btn
              v-if="path !== null"
              no-caps
              type="a"
              :icon="biGithub"
              :href="path"
              target="_blank"
              rel="noopener"
              class="button link"
            >View Source on Github
            </q-btn>
          </div>
        </div>

        <div class="flex flex-center">
          <div :style="'max-width: ' + ($route.path === '/' ? '100%' : '1000px') + '; width: 100%;'">
            <router-view />
          </div>
        </div>
      </div>

    </q-page-container>

    <q-page-scroller
      position="bottom-right"
      :scroll-offset="150"
      :offset="[18, 18]"
    >
      <q-fab
        padding="sm"
        icon="keyboard_arrow_up"
        :class="{ 'text-black bg-grey-4': $q.dark.isActive, 'text-white bg-primary': !$q.dark.isActive }"
      />
    </q-page-scroller>

  </q-layout>
</template>

<script>

import { defineComponent, ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

import { scroll } from 'quasar'
const { setVerticalScrollPosition } = scroll

import { useMarkdownStore } from 'assets/markdown-store.js'

import {
  biGithub
} from '@quasar/extras/bootstrap-icons'
import LeftMenu from '../components/LeftMenu.vue'
import ToolbarContents from '../components/ToolbarContents.vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
    LeftMenu,
    ToolbarContents
  },

  setup () {
    const path = ref(null),
      basePath = 'https://github.com/quasarframework/quasar-ui-qcalendar/tree/next/docs.next/src/examples/',
      name = ref(null),
      store = useMarkdownStore(),
      $route = useRoute(),
      leftDrawerOpen = ref(false),
      rightDrawerOpen = ref(false),
      activeToc = ref(0),
      title = ref(undefined)

    const isExample = computed(() => $route.path.startsWith('/examples'))

    onMounted(() => {
      handleRouteChange()
    })

    watch(() => $route.fullPath, () => {
      handleRouteChange()
    })

    watch(() => store.title, val => {
      title.value = val
    })

    function handleRouteChange () {
      if ($route.fullPath === '/' || $route.name === undefined) {
        path.value = null
        name.value = null
      }
      else {
        path.value = basePath + $route.name + '.vue'
        name.value = $route.name
        // auto-open left menu
        leftDrawerOpen.value = true
      }
    }

    function klasses (item) {
      return {
        menu: true,
        active: item.name !== undefined && item.name === $route.name,
        ellipsis: true
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

    return {
      isExample,
      store,
      path,
      name,
      klasses,
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
      biGithub,
      title
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

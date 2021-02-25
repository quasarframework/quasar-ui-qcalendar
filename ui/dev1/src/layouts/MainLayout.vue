<template>
  <q-layout view="lHh Lpr lFf">
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
          Quasar App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          <div>Found: {{ filteredPages.length }} examples</div>
          <div style="display: flex; justify-content: center; items-align: center; margin-bottom: 10px; width: 100%">
            <div
              class="button"
              style="width: 100%; margin: 8px 0;"
            >
              <input
                v-model="filter"
                class="select"
              >
              <div
                v-if="filter.length > 0"
                style="margin: 2px; font-weight: 700; cursor: pointer;"
                @click="onClearFilter"
              >
                X
              </div>
            </div>
          </div>
        </q-item-label>

        <div class="list">
          <div
            v-for="page in filteredPages"
            :key="page.name"
            class="button list-item"
          >
            <router-link
              :to="'/' + page.path"
              style="width: 100%"
            >
              {{ page.file }}
            </router-link>
          </div>
        </div>

      </q-list>
    </q-drawer>

    <q-page-container>
      <div class="fit q-pa-sm">
        <div
          v-if="$route.path !== '/'"
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

        <div class="flex flex-center">
          <div style="max-width: 800px; width: 100%;">
            <router-view />
          </div>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>

import { defineComponent, ref, computed, onBeforeMount, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import pages from '../router/pages'

export default defineComponent({
  name: 'MainLayout',

  components: {
  },

  setup () {
    const path = ref(null),
      basePath = 'https://github.com/quasarframework/quasar-ui-qcalendar/tree/next/ui/dev1/src/pages/',
      name = ref(null),
      $router = useRouter(),
      $route = useRoute(),
      leftDrawerOpen = ref(false),
      filter = ref('')

    onMounted(() => {
      handleRouteChange()
    })

    const filteredPages = computed(() => {
      if (filter.value) {
        const filtered = filter.value.toLowerCase()
        return pages.filter(val =>
          val.file.toLowerCase().indexOf(filtered) > -1)
      }
      return pages
    })

    watch(filter, val => {
      localStorage.setItem('filter', val)
    })

    onBeforeMount(() => {
      const val = localStorage.getItem('filter')
      if (val) {
        filter.value = val
      }
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

    return {
      filter,
      pages,
      filteredPages,
      onClearFilter,
      path,
      name,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      onHome () {
        $router.go(-1)
      }
    }
  }
})
</script>

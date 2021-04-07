<template>
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
        label="Search examples"
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
</template>

<script>
import { defineComponent, ref, reactive, computed, onBeforeMount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LocalStorage } from 'quasar'
import {
  biLink,
  biTwitter,
  biGithub
} from '@quasar/extras/bootstrap-icons'
import { useMarkdownStore } from 'assets/markdown-store.js'
import menuItems from '../router/menu.js'
import children from '../router/children.js'

export default defineComponent({
  name: 'LeftMenu',
  setup () {
    const menu = reactive(menuItems),
      store = useMarkdownStore(),
      filter = ref(''),
      $route = useRoute(),
      $router = useRouter()

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
      const val = LocalStorage.getItem('filter')
      filter.value = val || ''
    })

    watch(filter, val => {
      if (val || val === '') {
        LocalStorage.set('filter', val)
      }
    })

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

    function getMenuIcon (child) {
      switch (child.name) {
        case 'Github': return biGithub
        case 'Twitter': return biTwitter
        default: return biLink
      }
    }

    return {
      menu,
      isExample,
      filter,
      filteredPages,
      onChildClick,
      onExampleClick,
      klasses,
      parentClasses,
      childClasses,
      onToggleMenuItem,
      getMenuIcon
    }
  }
})
</script>

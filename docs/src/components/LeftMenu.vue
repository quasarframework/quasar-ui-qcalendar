<template>
  <div>
    <docs-menu />

    <q-list dense>
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
  </div>
</template>

<script>
import { defineComponent, ref, reactive, computed, onBeforeMount, watch, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useMarkdownStore } from 'assets/markdown-store.js'
import menuItems from '../assets/menu.js'
import examples from '../assets/examples.js'
import DocsMenu from './DocsMenu.js'

export default defineComponent({
  name: 'LeftMenu',
  components: {
    DocsMenu
  },
  setup () {
    const menu = reactive(menuItems),
      store = useMarkdownStore(),
      vm = getCurrentInstance(),
      $q = useQuasar() || vm.proxy.$q || vm.ctx.$q,
      filter = ref(null),
      $route = useRoute(),
      $router = useRouter()

    const isExample = computed(() => $route.path.startsWith('/examples'))

    const filteredPages = computed(() => {
      if (filter.value) {
        const filtered = filter.value.toLowerCase()
        return examples.filter(val =>
          val.name.toLowerCase().indexOf(filtered) > -1)
      }
      return examples
    })

    onBeforeMount(() => {
      let val = $q.localStorage.getItem('filter')
      if (val === 'null') val = null
      filter.value = val
    })

    watch(filter, val => {
      $q.localStorage.set('filter', val)
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
      onToggleMenuItem
    }
  }
})
</script>

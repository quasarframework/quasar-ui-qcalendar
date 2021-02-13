<template>
  <q-page padding class="row justify-center">
    <div style="display: flex; flex-direction: column; flex: 0 1 0;">
      <div style="display: flex; justify-content: center;">Found: {{ filteredPages.length }} examples</div>
      <div style="display: flex; justify-content: center; items-align: center; margin-bottom: 10px;">
        <div style="display: flex; justify-content: center; align-items: center; border: 2px rgba(0,0,255, .22) solid; border-radius: 4px;">
          <input
            v-model="filter"
            style="margin: 8px 0 8px 0; border: transparent; outline: 0"
          >
          <div
            v-if="filter.length > 0"
            style="margin: 2px; font-weight: 700; cursor: pointer;"
            @click="onClearFilter">X</div>
        </div>
      </div>

      <q-list dense class="list">
        <div class="text-h4 q-mb-md">Test pages</div>
        <q-item
          v-for="page in filteredPages"
          :key="page.path"
          :to="page.path"
        >
          <q-item-section avatar>
            <q-icon name="pages" />
          </q-item-section>
          <q-item-section>
            {{ page.title }}
          </q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script>
import pages from '../router/pages'
console.log(pages)

import { defineComponent, ref, computed, watch, onBeforeMount } from 'vue'

export default defineComponent({
  name: 'PageIndex',

  setup () {
    const filter = ref('')

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

    return {
      filter,
      pages,
      filteredPages,
      onClearFilter
    }
  }
})
</script>

<style lang="sass" scoped>
.list
  width: 700px
  max-width: 100%
</style>

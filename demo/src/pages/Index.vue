<template>
  <hero>
    <q-markdown
      :src="markdown"
      toc
      @data="onToc"
    />
    <json-api-viewer
      title="QCalendar API"
      :json="json"
    />
    <json-api-viewer
      title="QCalendar Exports"
      :json="json2"
      type="Exports"
      starting-tab="methods"
    />
    <q-markdown>
      # Donate
      If you appreciate the work that went into this, please consider donating to [Quasar](https://donate.quasar.dev) or [Jeff](https://github.com/sponsors/hawkeye64).

      ---

      This page created with [QMarkdown](https://quasarframework.github.io/quasar-ui-qmarkdown), another great Quasar App Extension.
    </q-markdown>
    <q-page-scroller
      position="bottom-right"
      :scroll-offset="150"
      :offset="[18, 18]"
    >
      <q-btn
        fab
        icon="keyboard_arrow_up"
        :class="{ 'text-black bg-grey-4': $q.dark.isActive, 'text-white bg-primary': !$q.dark.isActive }"
      />
    </q-page-scroller>
  </hero>
</template>

<script>
import { defineComponent } from 'vue'
import Hero from '../components/Hero'
import markdown from '../markdown/calendar.md'
import Api from '@quasar/quasar-ui-qcalendar/dist/api/QCalendar.json'
import Api2 from '@quasar/quasar-ui-qcalendar/dist/api/Timestamp.json'

export default defineComponent({
  name: 'PageIndex',

  components: {
    Hero
  },

  data () {
    return {
      markdown: markdown,
      json: Api,
      json2: Api2
    }
  },

  computed: {
    toc:
    {
      get () {
        return this.$store.state.common.toc
      },
      set (toc) {
        this.$store.commit('common/toc', toc)
      }
    }
  },

  methods: {
    onToc (toc) {
      // add the manual ones
      toc.push({ id: 'QCalendar-API', label: 'QCalendar API', level: 1, children: Array(0) })
      toc.push({ id: 'QCalendar-Exports', label: 'QCalendar Exports', level: 1, children: Array(0) })
      toc.push({ id: 'Donate', label: 'Donate', level: 1, children: Array(0) })

      this.toc = toc
    }
  }
})
</script>

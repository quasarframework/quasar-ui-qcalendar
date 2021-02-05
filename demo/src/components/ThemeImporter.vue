<template>
  <q-dialog
    v-model="openImporter"
  >
    <div
      :class="classes"
      style="max-width: 380px; width: 100%"
    >
      <div class="text-title">
        Theme Importer
      </div>
      <q-separator class="q-mb-md" />
      <q-input
        v-model="editorValue"
        type="textarea"
        label="Paste your theme here..."
        class="full-width"
      />
      <div class="row justify-center full-width q-mt-sm q-gutter-sm">
        <q-btn
          label="Import"
          @click="onImport"
        />
        <q-btn
          label="Revert"
          :disable="stylesCopy === void 0"
          @click="onRevert"
        />
      </div>
    </div>
  </q-dialog>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'ThemeImporter',

  props: {
    value: Boolean
  },

  emits: [
    'input'
  ],

  data () {
    return {
      openImporter: false,
      editorValue: '',
      stylesCopy: void 0
    }
  },

  computed: {
    ...mapGetters({
      style: 'ThemeBuilder/style'
    }),

    classes () {
      return {
        'column items-center q-pa-md': true,
        'bg-grey-11': this.$q.dark.isActive === false,
        'bg-grey-9': this.$q.dark.isActive === true
      }
    }
  },
  watch: {
    value (val) {
      this.openImporter = this.value
      // clear anything existing
      this.editorValue = ''
      this.stylesCopy = void 0
    },

    openImporter (val) {
      this.$emit('input', val)
    }
  },

  beforeMount () {
    this.openImporter = this.value
  },

  methods: {
    ...mapMutations('ThemeBuilder', [
      'setStyle'
    ]),

    onImport () {
      // make a copy
      this.stylesCopy = JSON.parse(JSON.stringify(this.style))

      let newStyles

      try {
        newStyles = JSON.parse(this.editorValue)
      }
      catch (e) {
        /* eslint-disable no-console */
        console.error(e.message)
        return
      }

      if (newStyles) {
        Object.keys(newStyles).forEach(name => {
          // make sure there is a corresponding name in styles
          // and if a match, only then import
          if (this.style[ name ] !== void 0) {
            this.setStyle({ name, value: newStyles[ name ] })
          }
        })
      }
    },

    onRevert () {
      if (this.stylesCopy !== void 0) {
        Object.keys(this.stylesCopy).forEach(name => {
          this.setStyle({ name, value: this.stylesCopy[ name ] })
        })
      }
    }
  }
}
</script>

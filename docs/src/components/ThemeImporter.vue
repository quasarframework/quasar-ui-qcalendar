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
import { useThemeBuilderStore } from 'assets/theme-builder-store.js'

export default {
  name: 'ThemeImporter',

  props: {
    modelValue: Boolean
  },

  emits: [
    'update:model-value'
  ],

  data () {
    return {
      openImporter: false,
      editorValue: '',
      stylesCopy: void 0,
      store: useThemeBuilderStore()
    }
  },

  computed: {
    classes () {
      return {
        'column items-center q-pa-md': true,
        'bg-grey-11': this.$q.dark.isActive === false,
        'bg-grey-9': this.$q.dark.isActive === true
      }
    }
  },

  watch: {
    modelValue (val) {
      this.openImporter = this.modelValue
      // clear anything existing
      this.editorValue = ''
      this.stylesCopy = void 0
    },

    openImporter (val) {
      this.$emit('update:model-value', val)
    },

    setStyle ({ name, styles }) {
      this.setCurrentStyleName(name)
      Object(this.store.style).splice(0, Object.keys(this.store.style).length, ...styles)
    },

    setCurrentStyleName (name) {
      this.store.currentStyleName = name
    }

  },

  beforeMount () {
    this.openImporter = this.modelValue
  },

  methods: {

    onImport () {
      // make a copy
      this.stylesCopy = JSON.parse(JSON.stringify(this.store.style))

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
          if (this.store.style[ name ] !== void 0) {
            this.setStyle({ name, styles: newStyles[ name ] })
          }
        })
      }
    },

    onRevert () {
      if (this.stylesCopy !== void 0) {
        Object.keys(this.stylesCopy).forEach(name => {
          this.setStyle({ name, styles: this.stylesCopy[ name ] })
        })
      }
    }
  }
}
</script>

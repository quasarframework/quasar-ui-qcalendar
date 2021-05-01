<template>
  <q-dialog
    ref="borderEditor"
    v-model="openEditor"
    position="right"
  >
    <div
      :class="classes"
      style="max-width: 360px"
    >
      <div class="text-title">
        Theme Styles Picker
      </div>
      <q-separator class="q-mb-md full-width" />

      <div
        v-if="currentBorderSize !== void 0"
        class="full-width"
      >
        <div class="full-width text-caption q-pb-lg">
          <strong>Border Width</strong>
        </div>
        <q-slider
          :modelValue="editorSize"
          :min="1"
          :max="5"
          label
          label-always
          class="fill-width"
          @change="val => { editorSize = val }"
        />
        <q-separator class="q-mb-sm" />
      </div>

      <div
        v-if="currentBorderType !== void 0"
        class="full-width row justify-center"
      >
        <div class="full-width text-caption">
          <strong>Border Style</strong>
        </div>
        <q-radio
          :model-value="editorType"
          val="solid"
          label="Solid"
          @update:model-value="val => { editorType = val }"
        />
        <q-radio
          :model-value="editorType"
          val="dashed"
          label="Dashed"
          @update:model-value="val => { editorType = val }"
        />
        <q-radio
          :model-value="editorType"
          val="dotted"
          label="Dotted"
          @update:model-value="val => { editorType = val }"
        />
        <q-separator class="q-mb-sm full-width" />
      </div>

      <div
        v-if="currentColor !== void 0"
        class="row justify-center"
      >
        <div class="full-width text-caption">
          <strong>Color</strong>
        </div>

        <q-color
          default-view="palette"
          :modelValue="editorColor"
          :palette="colorPalette"
          format-model="hexa"
          style="max-width: 200px"
          @change="val => { editorColor = val }"
        />
        <p>Hint: current color schema is on the Palette tab</p>
        <q-separator class="q-mb-sm full-width" />
      </div>

      <div class="row justify-center">
        <q-input
          v-if="isValue === true"
          v-model="editorValue"
          label="Edit css value"
        />
      </div>

      <div class="row justify-center">
        <q-btn
          label="Revert change"
          dense
          :disabled="itemStyleOrig === itemStyle"
          class="q-ma-md"
          @click="onRevert"
        />
      </div>
      <q-separator />
      <div class="full-width q-mt-sm">
        <div class="text-title2">
          {{ itemName }}
        </div>
        {{ hint }}
        <!-- <q-markdown :src="hint" /> -->
      </div>
    </div>
  </q-dialog>
</template>

<script>
import { colors } from 'quasar'
const { brightness } = colors
import { useThemeBuilderStore } from 'assets/theme-builder-store.js'

export default {
  name: 'ThemeEditor',
  props: {
    modelValue: Boolean,
    itemName: String,
    itemStyle: String,
    styleObject: Object
  },

  emits: [
    'update:modelValue',
    'style'
  ],

  data () {
    return {
      openEditor: false,
      editorSize: void 0,
      editorType: void 0,
      editorColor: void 0,
      editorValue: void 0,
      itemNameOrig: '',
      itemStyleOrig: '',
      styleCopy: {},
      store: useThemeBuilderStore()
    }
  },

  computed: {
    hints () {
      return this.store.hints
    },

    hint () {
      if (this.itemName) {
        return this.hints[ this.itemName ]
      }
      return ''
    },

    classes () {
      return {
        'column items-center q-pa-md': true,
        'bg-grey-11': this.$q.dark.isActive === false,
        'bg-grey-9': this.$q.dark.isActive === true
      }
    },

    currentStyle () {
      let style = ''
      if (this.editorValue !== void 0) {
        style += this.editorValue
      }
      else {
        if (this.editorColor !== void 0) {
          style += this.editorColor
        }
        if (this.editorSize !== void 0 && isNaN(this.editorSize) === false) {
          style += ' ' + this.editorSize + 'px'
        }
        if (this.editorType !== void 0) {
          style += ' ' + this.editorType
        }
      }
      return style
    },

    hasBorder () {
      return this.itemName && this.currentBorderType !== void 0
    },

    hasColor () {
      return this.itemName && this.currentColor !== void 0
    },

    hasUnset () {
      return this.itemName && this.itemStyle === 'unset'
    },

    isValue () {
      return this.itemName
        && this.hasBorder !== true
        && this.hasColor !== true
        && this.hasUnset !== true
    },

    currentColor () {
      if (!this.itemName) return
      let color
      if (this.itemStyle) {
        const parts = this.itemStyle.split(' ')
        parts.forEach(part => {
          if (part.match(/^(#|(rgb|hsl)a?\()/)) {
            color = part
          }
        })
      }

      return color
    },

    currentBorderType () {
      if (!this.itemName) return
      let type
      if (this.itemStyle) {
        const parts = this.itemStyle.split(' ')
        parts.forEach(part => {
          if (part === 'solid' || part === 'dashed' || part === 'dotted') {
            type = part
          }
        })
      }
      return type
    },

    currentBorderSize () {
      if (!this.itemName) return
      let size
      if (this.itemStyle && this.itemName && this.itemName.indexOf('border') > -1) {
        const parts = this.itemStyle.split(' ')
        parts.forEach(part => {
          if (!part.match(/^(#|(rgb|hsl)a?\()/) && part !== 'solid' && part !== 'dashed' && part !== 'dotted') {
            size = parseInt(part, 10)
          }
        })
      }
      return size
    },

    currentValue () {
      if (!this.itemName) return
      let value
      if (this.itemStyle && this.itemName && (this.itemName.indexOf('width') > -1 || this.itemName.indexOf('font') > -1)) {
        value = this.itemStyle
      }
      return value
    },

    // creates a palette of unique colors for user selection
    // note: all colors need to be lowercase to prevent dupes
    colorPalette () {
      let colors = new Set()
      Object.keys(this.styleCopy).forEach(name => {
        const value = this.styleCopy[ name ]
        // has color
        if (
          value !== 'unset' && (
            value.match(/^(#|(rgb|hsl)a?\()/)
            || name.indexOf('color') > -1
            || name.indexOf('background') > -1
            || name.indexOf('border') > -1)
        ) {
          if (name.indexOf('border') > -1) {
            const parts = value.split(' ')
            parts.forEach(part => {
              if (part.match(/^(#|(rgb|hsl)a?\()/)) {
                colors.add(part.toLowerCase())
              }
            })
          }
          else {
            colors.add(value.toLowerCase())
          }
        }
      })

      // create normal js array from Set
      colors = Array.from(colors)

      colors.sort((a, b) => {
        const a1 = brightness(a)
        const b1 = brightness(b)
        // reverse sort (looks better visually)
        if (a1 < b1) return 1
        if (a1 > b1) return -1
        return 0
      })

      return colors
    }
  },

  watch: {
    modelValue (val) {
      this.openEditor = this.modelValue
    },
    openEditor (val) {
      this.$emit('update:modelValue', val)
    },
    itemStyle (val) {
      this.updateEditor()
    },
    currentStyle (val) {
      this.$emit('style', val)
    }
  },

  beforeMount () {
    this.openEditor = this.modelValue
    this.updateEditor()
  },

  methods: {
    updateEditor () {
      this.editorSize = this.currentBorderSize
      this.editorType = this.currentBorderType
      this.editorColor = this.currentColor
      this.editorValue = this.currentValue

      if (this.itemNameOrig !== this.itemName) {
        this.itemNameOrig = this.itemName
        this.itemStyleOrig = this.itemStyle
        // it's important we do this so that ThemeEditor
        // isn't always generating a color palette each
        // time something changes. Only when the name changes
        this.styleCopy = JSON.parse(JSON.stringify(this.styleObject))
      }
    },
    onValueChanged () {
    },
    onRevert () {
      this.$emit('style', this.itemStyleOrig)
    },
    onUnset () {
      //
    }
  }
}
</script>

<style lang="sass" scoped>
.text-title
  font-size: 0.875rem
  font-weight: 600
  line-height: 1.375rem
  letter-spacing: 0.00714em

.text-title2
  font-size: 0.775rem
  font-weight: 600
  line-height: 1.375rem
  letter-spacing: 0.00714em
</style>

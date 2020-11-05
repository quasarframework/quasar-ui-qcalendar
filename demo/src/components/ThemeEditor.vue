<template>
  <q-dialog
    ref="borderEditor"
    v-model="openEditor"
  >
    <div :class="classes" style="max-width: 280px">
      <div class="text-title">Theme Styles Picker</div>
      <q-separator />
      <div v-if="currentBorderSize !== void 0" class="full-width">
        <div class="full-width text-caption q-pb-lg">Border Width</div>
        <q-slider
          :value="editorSize"
          :min="1"
          :max="5"
          label
          label-always
          @change="val => { editorSize = val }"
          class="fill-width"
        />
      </div>
      <div v-if="currentBorderType !== void 0" class="full-width row justify-center">
        <div class="full-width text-caption">Border Style</div>
        <q-radio
          :value="editorType"
          val="solid"
          label="Solid"
          @input="val => { editorType = val }"
        />
        <q-radio
          :value="editorType"
          val="dashed"
          label="Dashed"
          @input="val => { editorType = val }"
        />
      </div>
      <q-color
        v-if="currentColor !== void 0"
        default-view="palette"
        :value="editorColor"
        :palette="colorPalette"
        style="max-width: 200px"
        @change="val => { editorColor = val }"
      />
      <br>
      <q-separator />
      Hint: current color schema is on the Palette tab
    </div>
  </q-dialog>
</template>

<script>
export default {
  name: 'ThemeEditor',
  props: {
    value: Boolean,
    itemName: String,
    itemStyle: String,
    styleObject: Object
  },

  data () {
    return {
      openEditor: false,
      editorSize: void 0,
      editorType: void 0,
      editorColor: void 0
    }
  },

  beforeMount () {
    this.openEditor = this.value
    this.updateEditor()
  },

  computed: {
    classes () {
      return {
        'column items-center q-pa-md': true,
        'bg-grey-11': this.$q.dark.isActive === false,
        'bg-grey-9': this.$q.dark.isActive === true
      }
    },
    currentStyle () {
      return (this.editorColor && this.editorColor) + (this.editorSize && ' ' + this.editorSize + 'px') + (this.editorType && ' ' + this.editorType)
    },
    isBorder () {
      return this.currentBorderType !== void 0
    },
    isColor () {
      return this.currentColor !== void 0
    },
    isValue () {
      return this.isBorder !== true && this.isColor !== true
    },
    currentColor () {
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
      let type
      if (this.itemStyle) {
        const parts = this.itemStyle.split(' ')
        parts.forEach(part => {
          if (part === 'solid' || part === 'dashed') {
            type = part
          }
        })
      }
      return type
    },
    currentBorderSize () {
      let size
      if (this.itemStyle) {
        const parts = this.itemStyle.split(' ')
        parts.forEach(part => {
          if (!part.match(/^(#|(rgb|hsl)a?\()/) && part !== 'solid' && part !== 'dashed') {
            size = parseInt(part, 10)
          }
        })
      }
      return size
    },
    colorPalette () {
      let colors = new Set()
      Object.keys(this.styleObject).forEach(name => {
        const value = this.styleObject[name]
        // has color
        if (value !== 'unset') {
          if (value.match(/^(#|(rgb|hsl)a?\()/) || name.indexOf('color') > -1 || name.indexOf('background') > -1 || name.indexOf('border') > -1) {
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
        }
      })

      colors = Array.from(colors)
      colors.reverse()
      console.log(colors)
      return colors
    }
  },

  watch: {
    value (val) {
      this.openEditor = this.value
    },
    openEditor (val) {
      this.$emit('input', val)
    },
    itemStyle (val) {
      this.updateEditor()
    },
    currentStyle (val) {
      console.log('currentStyle:', val)
      this.$emit('style', val)
    },
    colorPalette (val) {
      console.log('colorPalette has changed!')
    }
  },

  methods: {
    updateEditor () {
      this.editorSize = this.currentBorderSize
      this.editorType = this.currentBorderType
      this.editorColor = this.currentColor
    },
    onValueChanged () {
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
</style>

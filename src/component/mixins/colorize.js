import Vue from 'vue'

function isCssColor (color) {
  return !!color && !!color.match(/^(#|(rgb|hsl)a?\()/)
}

export default Vue.extend({
  name: 'colorize',

  props: {
    color: String,
    theme: {
      type: Object,
      default: () => {}
    },
    enableThemes: Boolean
  },

  methods: {
    // this function exists for performance reasons. If you do not
    // desire the performance hit of theming, be sure to set
    // the property 'default-theme-only' to true (default).
    useDefaultTheme (color, bgColor, data = {}) {
      return data
    },

    setBothColors (color, bgColor, data = {}) {
      return this.setTextColor(color, this.setBackgroundColor(bgColor, data))
    },

    setBackgroundColor (color, data = {}) {
      if (isCssColor(color)) {
        data.style = {
          ...data.style,
          'background-color': `${color}`,
          'border-color': `${color}`
        }
      } else if (color) {
        const colorName = color.toString().trim()
        data.class = {
          ...data.class,
          ['bg-' + colorName]: true
        }
      }

      return data
    },

    setTextColor (color, data = {}) {
      if (isCssColor(color)) {
        data.style = {
          ...data.style,
          'color': `${color}`,
          'caret-color': `${color}`
        }
      } else if (color) {
        const colorName = color.toString().trim()
        data.class = {
          ...data.class,
          ['text-' + colorName]: true
        }
      }
      return data
    },

    getThemeColors (keys = []) {
      const colors = new Map()
      if (this.theme !== void 0) {
        keys.forEach((key) => {
          colors.set(key, this.theme[key])
        })
      }
      return colors
    }
  }
})

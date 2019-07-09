import Vue from 'vue'

export default Vue.extend({
  name: 'theme',

  props: {
    theme: {
      type: Object,
      default: () => {}
    },
    enableThemes: Boolean
  },

  methods: {
    // this function exists for performance reasons. If you do not
    // desire the performance hit of theming, be sure to set
    // the property 'enable-themes' to false (default).
    useDefaultTheme (color, bgColor, data = {}) {
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

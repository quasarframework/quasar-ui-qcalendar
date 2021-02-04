import { h, defineComponent } from 'vue'

import { useCommonProps } from '../composables/useCommon'
import { useResourceProps } from '../composables/useResource'
import { useIntervalHeaderProps } from '../composables/useIntervalHeader'

export default defineComponent({
  name: 'QCalendarResource',

  props: {
    ...useCommonProps,
    ...useResourceProps,
    ...useIntervalHeaderProps
  },

  // emits: [],

  setup (props, { slots, emit }) {
    return h('div')
  }

})

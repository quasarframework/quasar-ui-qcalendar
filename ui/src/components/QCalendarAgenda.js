import { h, defineComponent } from 'vue'

import { useCommonProps } from '../composables/useCommon'
import { useAgendaProps } from '../composables/useAgenda'
import { useColumnProps } from '../composables/useColumn'

export default defineComponent({
  name: 'QCalendarAgenda',

  props: {
    ...useCommonProps,
    ...useAgendaProps,
    ...useColumnProps
  },

  // emits: [],

  setup (props, { slots, emit }) {
    return () => h('div')
  }

})

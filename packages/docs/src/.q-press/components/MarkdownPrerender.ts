import { h, ref, computed, defineComponent, type PropType } from 'vue'
import { QCard, QTabs, QTab, QTabPanels, QSeparator } from 'quasar'

export default defineComponent({
  name: 'MarkdownPrerender',

  props: {
    title: {
      type: String as PropType<string>,
      required: false,
      default: undefined,
    },
    tabs: {
      type: Array as PropType<string[]>,
      required: false,
      default: undefined,
    },
  },

  setup(props, { slots }) {
    const currentTab = ref(props.tabs !== undefined ? props.tabs[0] : null)

    const hasHeader = computed(() => props.title !== undefined || props.tabs !== undefined)

    /**
     * Generates an array of VNode elements based on the provided props and slots.
     *
     * This function constructs a list of VNode elements to be rendered, including
     * a title, tabs, a separator, and the main content. The content is conditionally
     * wrapped in QTabPanels or a div based on the presence of tabs.
     *
     * @returns {ReturnType<typeof h>[]} An array of VNode elements to be rendered.
     */
    function getContent() {
      const acc: ReturnType<typeof h>[] = []

      if (props.title !== undefined) {
        acc.push(
          h('div', { class: 'header-toolbar row items-center' }, [
            h('div', { class: 'markdown-card-title q-my-xs q-mr-sm' }, props.title),
          ]),
        )
      }

      if (props.tabs !== undefined) {
        acc.push(
          h(
            QTabs,
            {
              class: 'header-tabs',
              align: 'left',
              activeColor: 'brand-primary',
              indicatorColor: 'brand-primary',
              dense: true,
              breakpoint: 0,
              shrink: true,
              modelValue: currentTab.value,
              'onUpdate:modelValue': (v: string) => {
                currentTab.value = v
              },
            },
            () =>
              props.tabs!.map((tab) =>
                h(QTab, { name: tab, class: 'header-btn', noCaps: true }, () => tab),
              ),
          ),
        )
      }

      if (hasHeader.value) {
        acc.push(h(QSeparator))
      }

      acc.push(
        props.tabs !== undefined
          ? h(
              QTabPanels,
              {
                class: 'markdown-copybtn-hover',
                animated: true,
                modelValue: currentTab.value,
              },
              slots.default,
            )
          : h('div', { class: 'markdown-copybtn-hover relative-position' }, slots.default?.()),
      )

      return acc
    }

    return () => h(QCard, { flat: true, bordered: true }, getContent)
  },
})

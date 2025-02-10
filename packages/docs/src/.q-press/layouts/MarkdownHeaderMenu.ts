import {
  QMenu,
  QIcon,
  QAvatar,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QSeparator,
  Screen,
} from 'quasar'
import { h } from 'vue'
import { mdiMenuRight } from '@quasar/extras/mdi-v7'

interface MenuElement {
  header?: string
  separator?: boolean
  path?: string
  external?: boolean
  icon?: string
  name?: string
  mq?: string
  color?: string
  image?: boolean
  children?: MenuElement[]
}

interface Props {
  elements: MenuElement[]
  mqPrefix: string
}

const offset = [0, 4]

export default {
  props: {
    elements: Array,
    mqPrefix: String,
  },

  setup(props: Props) {
    function getChildren(list: MenuElement[]) {
      return h(QList, { dense: true, padding: true }, () =>
        list.map((entry) => {
          if (entry.header !== void 0) {
            return h(QItemLabel, { header: true }, () => entry.header)
          }
          if (entry.separator === true) {
            return h(QSeparator, { spaced: true })
          }
          if (!entry.name) {
            return null
          }

          return h(
            QItem,
            {
              class: `${props.mqPrefix}-${entry.mq || 'none'}`,
              clickable: true,
              to: entry.path,
              href: entry.external ? entry.path : void 0,
              target: entry.external ? '_blank' : void 0,
            },
            () => {
              const acc: any[] = []

              const iconOrImage = !entry.image
                ? h(QIcon, { name: entry.icon, color: entry.color ? entry.color : void 0 })
                : h(QAvatar, { size: '28px' }, () => h('img', { src: entry.icon }))

              if (entry.icon !== void 0) {
                acc.push(h(QItemSection, { side: true }, () => iconOrImage))
              }

              acc.push(h(QItemSection, { class: 'text-no-wrap' }, () => entry.name))

              if (entry.children !== void 0) {
                acc.push(
                  h(QItemSection, { side: true, class: 'markdown-header-menu__arrow' }, () =>
                    h(QIcon, { name: mdiMenuRight }),
                  ),
                  h(
                    QMenu,
                    {
                      anchor: 'top right',
                      self: 'top left',
                      class: 'markdown-header-menu markdown-technical',
                      cover: Screen.lt.sm,
                    },
                    () => getChildren(entry.children!),
                  ),
                )
              }

              return acc
            },
          )
        }),
      )
    }

    function getMenu() {
      return getChildren(props.elements)
    }

    return () =>
      h(QMenu, { fit: true, class: 'markdown-header-menu markdown-technical', offset }, getMenu)
  },
}

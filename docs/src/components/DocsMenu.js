import {
  QExpansionItem,
  QList,
  QItem,
  QItemSection,
  QIcon,
  QBadge,
  Ripple
} from 'quasar'

import { biCaretDown, biCaretDownFill } from '@quasar/extras/bootstrap-icons'
import { h, ref, watch, onMounted, onBeforeUpdate, withDirectives } from 'vue'
import { useRoute } from 'vue-router'

import Menu from 'assets/menu.js'
import './DocsMenu.sass'

function getParentVm (vm) {
  if (vm.$parent !== void 0 && vm.$parent !== null) {
    return vm.$parent
  }

  vm = vm.$.parent

  while (vm !== void 0 && vm !== null) {
    if (vm.proxy !== void 0 && vm.proxy !== null) {
      return vm.proxy
    }

    vm = vm.parent
  }
}

export default {
  name: 'AppMenu',

  setup () {
    const $route = useRoute()
    const routePath = $route.path

    const rootRef = ref(null)

    watch(() => $route.path, val => {
      showMenu(childRefs[ val ])
    })

    onMounted(() => {
      // needed if using different layouts or
      // User navigated here via an external link (ie: Discord)
      showMenu(childRefs[ $route.path ])
    })

    let childRefs = []

    onBeforeUpdate(() => {
      childRefs = []
    })

    /**
     * Recursive method to find the QExpansionItem parent
     * @param {any} vm The Vue node
     */
    function showMenu (vm) {
      if (vm !== void 0 && vm !== rootRef.value) {
        if (vm.show === void 0 && vm.$parent !== void 0) {
          const parent = getParentVm(vm)
          if (parent !== void 0) {
            showMenu(parent)
            return
          }
        }
        // eslint-disable-next-line no-unused-expressions
        vm.show !== void 0 && vm.show()
      }
    }

    function getDrawerMenu (menu, path, level) {
      if (menu.children !== void 0) {
        return h(
          QExpansionItem,
          {
            class: 'non-selectable',
            ref: vm => { if (vm) { childRefs[ path ] = vm } },
            key: `${ menu.name }-${ path }`,
            label: menu.name,
            dense: true,
            icon: menu.icon,
            contentInsetLevel: level > 0 ? 0.5 : 0.25,
            expandIcon: level > 0 ? biCaretDownFill : biCaretDown,
            defaultOpened: menu.expanded || routePath.startsWith(path + '/'),
            expandSeparator: true,
            denseToggle: level > 0
          },
          () => menu.children.map(item => getDrawerMenu(
            item,
            item.path !== void 0
              ? item.path.charAt(0) === '/'
                ? item.path
                : path + '/' + item.path
              : '',
            level + 1
          ))
        )
      }

      const props = {
        ref: vm => { if (vm) { childRefs[ path ] = vm } },
        key: path,
        class: 'non-selectable',
        to: path,
        dense: level > 0
        // insetLevel: level > 1 ? 0 : level / 2.5
        // insetLevel: level > 1 ? 0.8 : level
      }

      // eslint-disable-next-line no-unused-expressions
      menu.external === true && Object.assign(props, {
        to: void 0,
        clickable: true,
        tag: 'a',
        href: menu.path,
        target: '_blank',
        rel: 'noopener'
      })

      const child = []

      // eslint-disable-next-line no-unused-expressions
      menu.icon !== void 0 && child.push(
        h(QItemSection, {
          avatar: true
        }, () => h(QIcon, { name: menu.icon, color: (menu.iconColor ? menu.iconColor : undefined) }))
      )

      child.push(
        h(QItemSection, () => menu.name)
      )

      // eslint-disable-next-line no-unused-expressions
      menu.rightIcon !== void 0 && child.push(
        h(QItemSection, {
          avatar: true
        }, () => h(QIcon, { name: menu.rightIcon, color: (menu.rightIconColor ? menu.rightIconColor : undefined) }))
      )

      // eslint-disable-next-line no-unused-expressions
      menu.badge !== void 0 && menu.rightIcon === void 0 && child.push(
        h(QItemSection, {
          side: true
        }, () => h(QBadge, { label: menu.badge, color: (menu.badgeColor ? menu.badgeColor : undefined) }))
      )

      return withDirectives(
        h(QItem, props, () => child),
        [[Ripple]]
      )
    }

    return () => h(QList, { ref: rootRef, class: 'app-menu', dense: true }, () => Menu.map(
      item => getDrawerMenu(item, '/' + item.path, 0)
    ))
  }
}

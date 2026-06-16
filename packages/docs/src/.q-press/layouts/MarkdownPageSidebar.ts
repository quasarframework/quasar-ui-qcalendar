import { QExpansionItem, QList, QItem, QItemSection, QIcon, QBadge, Ripple } from 'quasar'

import { mdiMenuDown } from '@quasar/extras/mdi-v7'
import { h, ref, watch, onBeforeUpdate, withDirectives, type VNode } from 'vue'
import { useRoute } from 'vue-router'

import siteConfig from '../../siteConfig'

import './MarkdownPageSidebar.scss'

interface ComponentProxy {
  $parent?: ComponentProxy
  $: {
    parent?: {
      proxy?: ComponentProxy
      parent?: ComponentProxy
    }
  }
  show?: () => void
}

/**
 * Finds the Vue parent component proxy for nested Quasar expansion items.
 */
function getParentProxy(proxy: ComponentProxy): ComponentProxy | undefined {
  if (Object(proxy.$parent) === proxy.$parent) {
    return proxy.$parent
  }

  let parent = proxy.$?.parent

  if (parent) {
    while (Object(parent) === parent) {
      if (Object(parent.proxy) === parent.proxy) {
        return parent.proxy
      }

      parent = parent.parent as { proxy?: ComponentProxy; parent?: ComponentProxy } | undefined
      if (!parent) {
        break
      }
    }
  }

  return undefined
}

export default {
  setup() {
    const $route = useRoute()
    const routePath = $route.path

    const rootRef = ref(null)

    watch(
      () => $route.path,
      (val: string) => {
        showMenu(childRefs[val] as ComponentProxy | null)
      },
    )

    let childRefs: { [key: string]: ComponentProxy } = {}

    onBeforeUpdate(() => {
      childRefs = {}
    })

    /**
     * Opens the active drawer item and all parent expansion items.
     */
    function showMenu(proxy: ComponentProxy | null): void {
      if (proxy !== undefined && proxy !== rootRef.value) {
        if (proxy.show !== undefined) proxy.show()
        const parent = getParentProxy(proxy)
        if (parent !== undefined) {
          showMenu(parent)
        }
      }
    }

    /**
     * Resolves a child drawer route path against its parent route path.
     */
    function resolveDrawerPath(parentPath: string, childPath?: string): string {
      if (childPath === void 0) {
        return parentPath
      }

      return childPath.startsWith('/')
        ? childPath
        : (parentPath + '/' + childPath).replace(/\/{2,}/g, '/')
    }

    /**
     * Recursively renders sidebar menu items and nested expansion groups.
     */
    function getDrawerMenu(menu: MenuItem, path: string, level: number): VNode {
      if (menu.children !== void 0) {
        return h(
          QExpansionItem,
          {
            class:
              'markdown-layout__item non-selectable' +
              (level !== 0 ? ' markdown-page-menu__deep-expansion' : ''),
            ref: (vm: any) => {
              if (vm) {
                childRefs[path] = vm
              }
            },
            key: `${menu.name}-${path}`,
            label: menu.name,
            icon: menu.icon,
            expandIcon: mdiMenuDown,
            defaultOpened: menu.expanded || routePath.startsWith(path),
            switchToggleSide: level !== 0,
            denseToggle: level !== 0,
            activeClass: 'markdown-layout__item--active',
          },
          () =>
            menu.children?.map(
              (item: MenuItem) =>
                item.name &&
                getDrawerMenu(item, resolveDrawerPath(path, item.path), level / 2 + 0.1),
            ),
        )
      }

      const props: any = {
        ref: (vm: any) => {
          if (vm) {
            childRefs[path] = vm
          }
        },
        key: path,
        class: 'markdown-layout__item non-selectable',
        to: path,
        activeClass: 'markdown-layout__item--active',
      }

      if (level !== 0) {
        props.insetLevel = Math.min(level, 1)
      }

      if (menu.external === true) {
        Object.assign(props, {
          to: void 0,
          clickable: true,
          tag: 'a',
          href: menu.path,
          target: '_blank',
        })
      }

      const child: any[] = []

      if (menu.icon !== void 0) {
        child.push(
          h(
            QItemSection,
            {
              avatar: true,
            },
            () => h(QIcon, { name: menu.icon, color: menu.iconColor ? menu.iconColor : undefined }),
          ),
        )
      }

      child.push(h(QItemSection, () => menu.name))

      if (menu.rightIcon !== void 0) {
        child.push(
          h(
            QItemSection,
            {
              avatar: true,
            },
            () =>
              h(QIcon, {
                name: menu.rightIcon,
                color: menu.rightIconColor ? menu.rightIconColor : undefined,
              }),
          ),
        )
      }

      if (menu.badge !== void 0) {
        child.push(
          h(
            QItemSection,
            {
              side: true,
            },
            () => h(QBadge, { label: menu.badge, class: 'header-badge' }),
          ),
        )
      }

      return withDirectives(
        h(QItem, props, () => child),
        [[Ripple]],
      )
    }

    function showDrawerVersion(): VNode | undefined {
      if (
        siteConfig.versionConfig.showOnSidebar === true &&
        (siteConfig.versionConfig.showVersion === true ||
          siteConfig.versionConfig.showTitle === true)
      ) {
        return h(QItem, { class: 'markdown-layout__item non-selectable' }, () => [
          siteConfig.versionConfig.showTitle &&
            h(QItemSection, { class: 'text-right' }, () => siteConfig.title),
          siteConfig.versionConfig.showVersion &&
            h(QItemSection, { class: 'text-left' }, () => 'v' + siteConfig.version),
        ])
      }
    }

    function showDrawerMenu(): VNode {
      return h(QList, { ref: rootRef, class: 'markdown-page-menu', dense: true }, () => [
        siteConfig.sidebar.map((item) => getDrawerMenu(item, '/' + item.path, 0)),
      ])
    }

    return () => {
      if (
        siteConfig.config.useSidebar === true &&
        siteConfig.sidebar &&
        Array.isArray(siteConfig.sidebar) &&
        siteConfig.sidebar.length > 0
      ) {
        return h('div', { class: 'markdown-layout' }, [showDrawerVersion(), showDrawerMenu()])
      }
    }
  },
}

import menuItems from '../assets/menu.js'
import examples from '../assets/examples.js'
import getCategoryIndex from 'src/components/getCategoryIndex.js'

const menuRoutes = [
  {
    name: 'Landing Page',
    path: '',
    component: () => import('../pages/landing-page.md')
  }
]

function parseMenuNode (node, __path) {
  const prefix = __path + (node.path !== void 0 ? '/' + node.path : '')

  if (node.children !== void 0) {
    // eslint-disable-next-line no-unused-expressions
    prefix !== '/start' && menuRoutes.push({
      path: prefix,
      component: getCategoryIndex(
        node.name,
        node.children.map(node => {
          const to = node.external === true
            ? node.path
            : (
                prefix + (
                  node.path !== void 0
                    ? '/' + node.path
                    : (node.listPath !== void 0 ? '/' + node.listPath : '')
                )
              )

          if (node.external !== true && node.listPath !== void 0) {
            menuRoutes.push({
              path: to,
              component: getCategoryIndex(
                node.name,
                node.children.map(node => ({
                  title: node.name,
                  name: node.name,
                  to: node.internal === true ? node.path : prefix + (node.path !== void 0 ? '/' + node.path : ''),
                  page: true
                }))
              )
            })
          }

          return {
            title: node.name,
            name: node.name,
            to,
            page: node.children === void 0
          }
        })
      )
    })

    node.children.forEach(node => parseMenuNode(node, prefix))
  }
  else if (node.external !== true && node.internal !== true) {
    menuRoutes.push({
      path: prefix,
      name: node.name,
      component: () => import('pages/' + prefix.substring(1) + '.md')
    })
  }
}

menuItems.forEach(node => {
  parseMenuNode(node, '')
})

const routes = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: menuRoutes
  },

  {
    path: '/examples',
    component: () => import('../layouts/MainLayout.vue'),
    children: [].concat(examples)
  },

  {
    path: '/theme-builder',
    component: () => import('layouts/ThemeBuilder.vue')
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes

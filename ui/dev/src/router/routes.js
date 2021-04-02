import menuItems from './menu.js'
import children from './children.js'

const menuRoutes = []

// extract the child routes
for (const parent of menuItems) {
  if (parent.children !== undefined) {
    for (const child of parent.children) {
      if (child.path && child.component) {
        menuRoutes.push(child)
      }
    }
  }
}

const routes = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        name: 'Landing Page',
        path: '',
        component: () => import('../pages/landing-page.md')
      }
    ].concat(menuRoutes)
  },
  {
    path: '/examples',
    component: () => import('../layouts/MainLayout.vue'),
    children: [].concat(children)
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

  // {
  //   path: '/',
  //   component: () => import('layouts/MainLayout.vue'),
  //   children: [
  //     { path: '', component: () => import('pages/Index.vue') }
  //   ].concat(children)
  // },

  // // Always leave this as last one,
  // // but you can also remove it
  // {
  //   path: '/:catchAll(.*)*',
  //   component: () => import('pages/Error404.vue')
  // }
]

export default routes

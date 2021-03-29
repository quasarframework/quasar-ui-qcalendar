import menuItems from '../layouts/menu.js'
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

// const children = pages.map(page => {
//   return {
//     name: page.file,
//     path: page.path,
//     component: () => import('examples/' + page.file + '.vue')
//   }
// })

const routes = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [].concat(menuRoutes)
  },
  {
    path: '/examples',
    component: () => import('../layouts/MainLayout.vue'),
    children: [].concat(children)
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

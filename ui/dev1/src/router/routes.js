import pages from './pages'

const children = pages.map(page => {
  return {
    name: page.file,
    path: page.path,
    component: () => import('pages/' + page.file + '.vue')
  }
})

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ].concat(children)
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes

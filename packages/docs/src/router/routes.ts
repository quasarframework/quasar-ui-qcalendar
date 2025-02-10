import mdPageList from 'src/markdown/listing'
import examplesPageList from 'src/examples/listing'
import { slugify } from '@md-plugins/shared'

const routes = [
  {
    path: '/theme-builder',
    component: () => import('layouts/ThemeBuilder.vue'),
  },
  {
    path: '/',
    component: () => import('src/.q-press/layouts/MarkdownLayout.vue'),
    children: [
      // Include the Landing Page route first
      ...Object.entries(mdPageList)
        .filter(([key]) => key.includes('landing-page.md'))
        .map(([_key, component]) => ({
          path: '',
          name: 'Landing Page',
          component,
          meta: { fullscreen: true, dark: true },
        })),

      // Now include all other routes, excluding the landing-page
      ...Object.keys(mdPageList)
        .filter((key) => !key.includes('landing-page.md')) // Exclude duplicates
        .map((key) => {
          const acc = {
            path: '',
            component: mdPageList[key],
          }

          if (acc.path === '') {
            // Remove '.md' from the end of the filename
            const parts = key.substring(1, key.length - 3).split('/')
            const len = parts.length
            const path = parts[len - 2] === parts[len - 1] ? parts.slice(0, len - 1) : parts

            if (len > 2) {
              path[2] = slugify(path[2] as string)
              path[1] = slugify(path[1] as string)
            }

            acc.path = path.join('/')
          }

          // console.info('path:', acc.path)
          return acc
        }),

      ...Object.entries(examplesPageList).map(([key, _component]) => {
        const acc = {
          path: '',
          component: examplesPageList[key],
        }

        if (acc.path === '') {
          // Remove '.vue' from the end of the filename
          const parts = key.substring(1, key.length - 4).split('/')
          const len = parts.length
          const path = parts[len - 2] === parts[len - 1] ? parts.slice(0, len - 1) : parts

          path[0] = '/examples'

          // Remove the second part from the third part of the path and convert to kebab-case
          if ((path[2] as string).startsWith(path[1] as string)) {
            path[2] = slugify((path[2] as string).replace(path[1] as string, ''))
          } else {
            path[2] = slugify(path[2] as string)
          }
          path[1] = slugify(path[1] as string)

          acc.path = path.join('/').replace(/\/{2,}/g, '/')
        }

        // console.info('path:', acc.path)
        return acc
      }),
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes

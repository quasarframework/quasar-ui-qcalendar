import type { Router, RouteRecordRaw } from 'vue-router'
import type { QPressRouteManifestEntry } from './manifest'

export const qpressRouteParentName = 'qpress'

export function createQPressLayoutRoute(): RouteRecordRaw {
  return {
    path: '/',
    name: qpressRouteParentName,
    component: () => import('@/.q-press/layouts/MarkdownLayout.vue'),
  }
}

export function createQPressNotFoundRoute(): RouteRecordRaw {
  return {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue'),
  }
}

export function createQPressMarkdownRoute(
  entry: QPressRouteManifestEntry,
): RouteRecordRaw {
  return {
    path: entry.path,
    name: entry.name,
    component: entry.component,
    meta: {
      qpress: true,
      file: entry.file,
      route: entry.route,
      ...entry.meta,
    },
  }
}

/**
 * Registers manifest-backed Markdown routes under the generated Q-Press layout.
 */
export function installQPressRoutes(
  router: Router,
  manifest: QPressRouteManifestEntry[],
  parentName = qpressRouteParentName,
): void {
  for (const entry of manifest) {
    if (router.hasRoute(entry.name)) {
      router.removeRoute(entry.name)
    }

    router.addRoute(parentName, createQPressMarkdownRoute(entry))
  }
}

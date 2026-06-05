import { Cookies, Dark, Meta, Notify, Quasar } from 'quasar'
import { createSSRApp, markRaw, unref } from 'vue'
import type { Pinia } from 'pinia'
import type { Router } from 'vue-router'
import type {
  MaybePromise,
  SsgRoute,
  SsgRouteRenderContext,
  VueSsgAppFactoryResult,
} from '@md-plugins/vite-ssg-plugin'

import App from '@/App.vue'
import createRouter from '@/router'
import createStore from '@/stores'

type QPressSsgContext = Record<string, unknown> & {
  url: string
  _meta: Record<string, unknown>
  onRendered: (callback: () => unknown) => void
  req: {
    url: string
    headers: Record<string, string>
  }
  state?: unknown
}

type QPressQuasarOptions = {
  config?: Record<string, unknown>
  plugins?: Record<string, unknown>
}

export interface QPressSsgAppOptions {
  quasarOptions?: QPressQuasarOptions
  routeLocation?: unknown
  ssrContext?: Record<string, unknown>
}

export type QPressSsgAppOptionsResolver = (
  route: SsgRoute,
  context: SsgRouteRenderContext,
) => MaybePromise<QPressSsgAppOptions | undefined>

type QPressSsgAppFactoryOptions = QPressSsgAppOptions | QPressSsgAppOptionsResolver

type StoreFactoryArgs = {
  ssrContext: QPressSsgContext
}

type RouterFactoryArgs = StoreFactoryArgs & {
  store: Pinia
}

const defaultQuasarOptions: QPressQuasarOptions = {
  plugins: {
    Cookies,
    Dark,
    Meta,
    Notify,
  },
}

function mergeQuasarOptions(options: QPressQuasarOptions | undefined): QPressQuasarOptions {
  return {
    ...defaultQuasarOptions,
    ...options,
    config: {
      ...defaultQuasarOptions.config,
      ...options?.config,
    },
    plugins: {
      ...defaultQuasarOptions.plugins,
      ...options?.plugins,
    },
  }
}

function createSsrContext(
  route: SsgRoute,
  options: QPressSsgAppOptions,
  onRenderedList: Array<() => unknown>,
): QPressSsgContext {
  return {
    url: route.path,
    _meta: {},
    onRendered(callback) {
      onRenderedList.push(callback)
    },
    req: {
      url: route.path,
      headers: {},
    },
    ...options.ssrContext,
  }
}

async function resolveStore(args: StoreFactoryArgs): Promise<Pinia> {
  return typeof createStore === 'function' ? await createStore(args) : createStore
}

async function resolveRouter(args: RouterFactoryArgs): Promise<Router> {
  return markRaw(typeof createRouter === 'function' ? await createRouter(args) : createRouter)
}

async function resolveOptions(
  options: QPressSsgAppFactoryOptions | undefined,
  route: SsgRoute,
  context: SsgRouteRenderContext,
): Promise<QPressSsgAppOptions> {
  if (typeof options === 'function') {
    return (await options(route, context)) ?? {}
  }

  return options ?? {}
}

function exposeRouterToStores(store: Pinia, router: Router): void {
  store.use(({ store }) => {
    const typedStore = store as typeof store & { router?: Router }
    typedStore.router = router
  })
}

export async function createQPressSsgApp(
  route: SsgRoute,
  context: SsgRouteRenderContext,
  options?: QPressSsgAppFactoryOptions,
): Promise<VueSsgAppFactoryResult> {
  const resolvedOptions = await resolveOptions(options, route, context)
  const onRenderedList: Array<() => unknown> = []
  const ssrContext = createSsrContext(route, resolvedOptions, onRenderedList)
  const app = createSSRApp(App)
  const store = await resolveStore({ ssrContext })
  const router = await resolveRouter({ ssrContext, store })

  app.use(Quasar, mergeQuasarOptions(resolvedOptions.quasarOptions), ssrContext)
  app.use(store)
  exposeRouterToStores(store, router)
  app.use(router)
  ssrContext.state = unref(store.state)

  return {
    app,
    router,
    ssrContext,
    routeLocation: resolvedOptions.routeLocation ?? route.path,
    onRendered() {
      onRenderedList.forEach((callback) => {
        callback()
      })
    },
  }
}

export function createQPressSsgAppFactory(
  options?: QPressSsgAppFactoryOptions,
): (
  route: SsgRoute,
  context: SsgRouteRenderContext,
) => Promise<VueSsgAppFactoryResult> {
  return (route, context) => createQPressSsgApp(route, context, options)
}

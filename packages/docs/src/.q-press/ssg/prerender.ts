import { prerenderVueSsgRoutes } from '@md-plugins/vite-ssg-plugin'
import type {
  PrerenderSsgRoutesResult,
  PrerenderVueSsgRoutesOptions,
} from '@md-plugins/vite-ssg-plugin'
import { createQPressSsgApp, type QPressSsgAppOptionsResolver } from './create-app'

export interface PrerenderQPressSsgRoutesOptions
  extends Omit<PrerenderVueSsgRoutesOptions, 'createApp'> {
  createAppOptions?: Parameters<typeof createQPressSsgApp>[2] | QPressSsgAppOptionsResolver
}

/**
 * Prerenders Q-Press routes with the generated Q-Press Vue/Quasar app factory.
 */
export async function prerenderQPressSsgRoutes({
  createAppOptions,
  ...options
}: PrerenderQPressSsgRoutesOptions): Promise<PrerenderSsgRoutesResult> {
  return prerenderVueSsgRoutes({
    ...options,
    createApp: (route, context) => createQPressSsgApp(route, context, createAppOptions),
  })
}

import type { Component } from 'vue'

export type QPressMarkdownComponent = Component | (() => Promise<unknown>)

export type QPressMarkdownGlob = Record<string, QPressMarkdownComponent>

export type QPressRouteManifestEntry = {
  component: QPressMarkdownComponent
  file: string
  name: string
  path: string
  route: string
  meta?: Record<string, unknown>
}

const markdownExtensionRegex = /\.md$/i

function normalizeFileRoute(file: string): string {
  const normalizedFile = file.replace(/^\.\//, '').replace(markdownExtensionRegex, '')

  if (normalizedFile === 'landing-page') {
    return '/'
  }

  const routeParts = normalizedFile.split('/')
  const lastPart = routeParts.at(-1)
  const parentPart = routeParts.at(-2)

  if (routeParts.length > 1 && lastPart === parentPart) {
    routeParts.pop()
  }

  return `/${routeParts.join('/')}`
}

function createRouteName(route: string): string {
  return route === '/'
    ? 'qpress:landing-page'
    : `qpress:${route.replace(/^\/+/, '').replace(/[^\w-]+/g, ':')}`
}

/**
 * Converts the Markdown import map into the Q-Press route manifest used by Vue Router,
 * SSG, route checks, and future manifest-backed docs features.
 */
export function createQPressRouteManifest(
  pages: QPressMarkdownGlob,
): QPressRouteManifestEntry[] {
  return Object.entries(pages)
    .map(([file, component]) => {
      const route = normalizeFileRoute(file)

      return {
        component,
        file,
        name: createRouteName(route),
        path: route === '/' ? '' : route.slice(1),
        route,
        ...(route === '/'
          ? {
              meta: {
                dark: true,
                fullscreen: true,
              },
            }
          : {}),
      }
    })
    .sort((left, right) => {
      if (left.route === '/') return -1
      if (right.route === '/') return 1

      return left.route.localeCompare(right.route)
    })
}

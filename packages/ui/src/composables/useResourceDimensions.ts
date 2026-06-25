import { computed, type CSSProperties, type ComputedRef } from 'vue'
import { convertToUnit } from '../utils/helpers'
import type { Resource } from './useInterval'

export type ParsedResourceHeight = number | 'auto'

interface ResourceDimensionProps {
  resourceHeight: number | string
  resourceMinHeight: number | string
}

export function parseResourceHeight(resourceHeight: number | string): ParsedResourceHeight {
  const height = parseInt(String(resourceHeight), 10)
  return height === 0 ? 'auto' : height
}

export function parseResourceMinHeight(resourceMinHeight: number | string): number {
  return parseInt(String(resourceMinHeight), 10)
}

export function getResourceHeightStyle(
  parsedResourceHeight: ParsedResourceHeight,
  parsedResourceMinHeight: number,
  resource?: Resource,
): CSSProperties {
  const style: CSSProperties = {}
  const height =
    resource?.height !== undefined ? parseInt(String(resource.height), 10) : parsedResourceHeight

  style.height = height === 'auto' ? height : convertToUnit(height)

  if (parsedResourceMinHeight > 0) {
    style.minHeight = convertToUnit(parsedResourceMinHeight)
  }

  return style
}

export default function useResourceDimensions(props: ResourceDimensionProps): {
  parsedResourceHeight: ComputedRef<ParsedResourceHeight>
  parsedResourceMinHeight: ComputedRef<number>
  getResourceHeightStyle: (_resource?: Resource) => CSSProperties
} {
  const parsedResourceHeight = computed(() => parseResourceHeight(props.resourceHeight))
  const parsedResourceMinHeight = computed(() => parseResourceMinHeight(props.resourceMinHeight))

  return {
    parsedResourceHeight,
    parsedResourceMinHeight,
    getResourceHeightStyle: (resource?: Resource) =>
      getResourceHeightStyle(parsedResourceHeight.value, parsedResourceMinHeight.value, resource),
  }
}

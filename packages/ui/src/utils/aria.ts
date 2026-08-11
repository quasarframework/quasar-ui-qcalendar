import type { AriaAttributes, HTMLAttributes } from 'vue'

type AriaLabelAttrs = Required<Pick<AriaAttributes, 'aria-label'>>

export const ariaHiddenAttrs = {
  'aria-hidden': 'true',
} satisfies Pick<AriaAttributes, 'aria-hidden'>

export const presentationRoleAttrs = {
  role: 'presentation',
} satisfies Pick<HTMLAttributes, 'role'>

export function getAriaLabelAttrs(label: string): AriaLabelAttrs {
  return { 'aria-label': label }
}

export function setAriaLabel(
  attrs: Record<string, unknown>,
  label: string,
  enabled: boolean,
): void {
  if (enabled === true) {
    Object.assign(attrs, getAriaLabelAttrs(label))
  }
}

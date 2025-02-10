declare module '*.md'

// Define types for headers
interface TocMenuItem {
  id: string
  level: number
  title: string
  link?: string
  deep?: boolean
  sub?: boolean
  onClick?: () => void
  children?: TocMenuItem[]
}

// Define types for Markdown modules
interface MarkdownModule {
  title?: string
  headers?: TocMenuItem[]
  frontmatter?: Record<string, unknown>
  filename?: string
  render: (..._args: unknown[]) => unknown
}

// Define types for menu items
interface MenuItem {
  name: string
  path?: string
  icon?: string
  iconColor?: string
  rightIcon?: string
  rightIconColor?: string
  badge?: string
  children?: MenuItem[] | undefined
  external?: boolean
  expanded?: boolean
}

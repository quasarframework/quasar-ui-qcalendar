type QPressMetaTags = {
  /**
   * Standard browser title metadata.
   */
  title: {
    name: string
    content: string
  }

  /**
   * Open Graph title metadata for link previews.
   */
  ogTitle: {
    name: string
    content: string
  }

  /**
   * Twitter card title metadata for link previews.
   */
  twitterTitle: {
    name: string
    content: string
  }

  /**
   * Standard description metadata for search snippets.
   */
  description: {
    name: string
    content: string
  }

  /**
   * Open Graph description metadata for link previews.
   */
  ogDesc: {
    name: string
    content: string
  }

  /**
   * Twitter card description metadata for link previews.
   */
  twitterDesc: {
    name: string
    content: string
  }
}

/**
 * Creates the standard Q-Press page metadata entries for a title and description.
 *
 * @param title - Page title used for browser, Open Graph, and Twitter metadata.
 * @param desc - Page description used for search, Open Graph, and Twitter metadata.
 * @returns Metadata entries consumed by Quasar's meta plugin.
 */
export default function getMeta(title: string, desc: string): QPressMetaTags {
  return {
    title: {
      name: 'title',
      content: title,
    },
    ogTitle: {
      name: 'og:title',
      content: title,
    },
    twitterTitle: {
      name: 'twitter:title',
      content: title,
    },

    description: {
      name: 'description',
      content: desc,
    },
    ogDesc: {
      name: 'og:description',
      content: desc,
    },
    twitterDesc: {
      name: 'twitter:description',
      content: desc,
    },
  }
}

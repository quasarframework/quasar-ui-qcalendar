<template>
  <div class="markdown-page__content">
    <div v-if="!isFullscreen && props.overline" class="markdown-page__overline text-brand-primary">
      {{ props.overline }}
    </div>

    <div v-if="!isFullscreen && props.title" id="introduction" class="markdown-heading markdown-h1">
      <div class="row items-center q-gutter-sm">
        <div>{{ props.title }}</div>
        <q-badge v-if="props.badge" :label="props.badge" />
      </div>

      <q-space />

      <q-btn
        v-if="props.editLink"
        class="self-start q-ml-sm"
        :href="editHref"
        target="_blank"
        rel="noopener noreferrer"
        flat
        round
        color="brand-primary"
        :icon="mdiPencil"
      >
        <q-tooltip class="row no-wrap items-center">
          <span>Caught a mistake? Edit this page in browser</span>
          <q-icon class="q-ml-xs" :name="mdiFlash" size="2em" />
        </q-tooltip>
      </q-btn>
    </div>

    <div v-if="props.related" class="markdown-page__nav">
      <div class="q-gutter-sm flex">
        <router-link
          v-for="link in props.related"
          :key="link.category + link.path"
          class="q-link markdown-page__related rounded-borders cursor-pointer column justify-center"
          :to="link.path"
        >
          <div class="markdown-page__nav-categ">{{ link.category || 'Docs' }}</div>
          <div class="markdown-page__nav-name text-weight-bold row items-center no-wrap">
            <div class="q-mr-xs">{{ link.name }}</div>
            <q-icon :name="mdiLaunch" />
          </div>
        </router-link>
      </div>
    </div>

    <slot />

    <div v-if="props.nav" class="markdown-page__nav markdown-page__nav--footer">
      <div class="text-h6 q-pb-md markdown-heading">Ready for more?</div>
      <div class="q-gutter-sm flex">
        <router-link
          v-for="link in props.nav"
          :key="link.category + link.path"
          :to="link.path"
          class="q-link markdown-page__related rounded-borders cursor-pointer column justify-center"
          :class="link.classes"
        >
          <div class="markdown-page__nav-categ">{{ link.category || 'Docs' }}</div>
          <div class="markdown-page__nav-name text-weight-bold">{{ link.name }}</div>
        </router-link>
      </div>
    </div>

    <div v-if="props.editLink" class="markdown-page__content-footer">
      <q-separator class="q-mb-sm" />

      <div class="q-mb-md">
        <span>Caught a mistake?</span>
        <MarkdownLink class="q-ml-xs" :to="editHref">Edit this page in browser</MarkdownLink>
      </div>
    </div>
  </div>

  <div
    v-if="hasToc"
    class="markdown-page__toc-container col-grow row justify-center gt-sm"
    :class="tocClass"
  >
    <q-scroll-area class="markdown-page__toc-area">
      <MarkdownPageToc />
    </q-scroll-area>
  </div>
</template>

<script setup lang="ts">
import { useMeta } from 'quasar'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { mdiPencil, mdiFlash, mdiLaunch } from '@quasar/extras/mdi-v7'

import type { NavItem, RelatedItem } from '@md-plugins/vite-md-plugin'
import type { TocItem } from '@md-plugins/md-plugin-headers'
import MarkdownLink from '../components/MarkdownLink.vue'
import MarkdownPageToc from './MarkdownPageToc.vue'

import getMeta from '../assets/get-meta'
import { useMarkdownStore } from '../stores/markdown'
import siteConfig from '../../siteConfig'

const props = defineProps({
  title: {
    type: String,
    default: null,
  },
  desc: {
    type: String,
    default: null,
  },
  overline: {
    type: String,
    default: null,
  },
  badge: {
    type: String,
    default: null,
  },

  fullscreen: Boolean,

  heading: Boolean,
  editLink: {
    type: String,
    default: null,
  },

  toc: {
    type: Array<TocItem>,
    default: () => [],
  },
  related: {
    type: Array<RelatedItem>,
    default: () => [],
  },
  nav: {
    type: Array<NavItem>,
    default: () => [],
  },
})

useMeta(
  props.desc !== void 0
    ? {
        title: props.title ?? '',
        meta: getMeta(`${props.title ?? ''} || ${siteConfig.title ?? ''}`, props.desc),
      }
    : { title: props.title ?? '' },
)

const route = useRoute()
const markdownStore = useMarkdownStore()

// console.log('toc', props.toc)

if (props.toc !== void 0) {
  markdownStore.setToc(props.toc)
}

const editHref = computed(() => `${siteConfig.githubEditRootSrc}/markdown/${props.editLink}.md`)

const isFullscreen = computed(() => route.meta.fullscreen === true || props.fullscreen)

const hasToc = computed(
  () =>
    route.meta.fullwidth !== true &&
    route.meta.fullscreen !== true &&
    props.fullscreen !== true &&
    siteConfig.config.useToc &&
    markdownStore.toc.length !== 0,
)

const tocClass = computed(
  () => `markdown-page__toc-container--${props.toc !== void 0 ? 'fixed' : 'flowing'}`,
)

console.log('MarkdownPage props', props)
</script>

<style lang="scss">
.markdown-page {
  &__content {
    padding: 80px 42px;
    line-height: 1.5em;

    @media (max-width: 1300px) {
      padding: 32px;
    }

    @media (max-width: 850px) {
      padding: 32px 16px;
    }

    > .q-btn {
      background: $brand-accent;
      color: #fff;
      font-weight: 700;
      font-size: $font-size;
      letter-spacing: $letter-spacing-brand;
      padding: 8px 16px;
      text-transform: none;

      .on-right {
        margin-left: 8px;
      }

      .on-left {
        margin-right: 8px;
      }
    }
  }

  &__toc-container {
    position: sticky;
    top: $header-height;
    height: calc(100vh - #{$header-height});
    min-width: 300px !important;

    &--fixed {
      .markdown-page__toc {
        padding: 32px 16px 32px 0; // page top padding
      }
    }
  }

  &__toc-area {
    width: 300px;
  }

  &__toc {
    font-size: ($font-size - 2px);
  }

  &__content-footer {
    margin-top: 64px;
  }

  &__overline {
    letter-spacing: $letter-spacing-brand;
    margin-bottom: 0 !important;

    & + .markdown-h1 {
      margin-top: 0 !important;
      padding-top: 0 !important;
    }
  }

  &__related {
    transition: color $header-transition;
    word-break: break-word;
    line-height: 1.4em;
    padding: 16px 20px;

    &:hover {
      color: $brand-primary !important;
    }

    &--left {
      justify-content: flex-start;
      text-align: left;

      .markdown-page__nav-name:before {
        content: '« ';
        font-size: 1.2em;
      }
    }

    &--right {
      justify-content: flex-end;
      text-align: right;

      .markdown-page__nav-name:after {
        content: ' »';
        font-size: 1.2em;
      }
    }
  }

  &__nav {
    color: $brand-light-text;

    &--footer {
      margin: 68px 0 0;
      margin-bottom: 0 !important;
    }

    & + & {
      margin-top: 0;
    }

    &-categ {
      font-size: 0.9em;
    }

    &-name {
      letter-spacing: $letter-spacing-brand;
    }
  }
}

body.body--light .markdown-page {
  &__related {
    color: $light-text;
    background: $brand-light;
    border: 1px solid $light-text; // match dark to avoid page reflow
  }

  &__toc-container .q-item {
    color: $header-btn-color--light;
  }
}

body.body--dark .markdown-page {
  &__related {
    color: $dark-text;
    background: $brand-dark;
    border: 1px solid $dark-text;
  }

  &__nav-name {
    color: $brand-dark-text;
  }

  &__toc-container .q-item {
    color: $header-btn-color--dark;
  }
}
</style>

<template>
  <q-layout class="markdown-layout markdown-technical" view="hHh LpR fff" @scroll="onPageScroll">
    <MarkdownHeader />

    <q-page-container>
      <q-page key="q-page" :class="pageClass">
        <router-view v-if="isFullscreen" key="page-fullscreen" />
        <div v-else key="page-standard" :class="pageContentClass">
          <div
            v-if="siteConfig.config.useSidebar === true"
            class="markdown-layout__menu-container row justify-center"
          >
            <q-scroll-area class="markdown-layout__menu q-ml-md">
              <MarkdownPageSidebar />
            </q-scroll-area>
          </div>
          <router-view />
        </div>
      </q-page>
      <MarkdownPageFooter :fullscreen="isFullscreen" />
    </q-page-container>

    <q-page-scroller>
      <q-btn fab-mini color="brand-accent" :icon="mdiArrowUp" aria-label="Back to top">
        <q-tooltip>Back to top</q-tooltip>
      </q-btn>
    </q-page-scroller>

    <q-no-ssr>
      <MarkdownDrawerSidebar v-if="siteConfig.config.useSidebar === true" />
      <MarkdownDrawerToc v-if="siteConfig.config.useToc === true" />
    </q-no-ssr>
  </q-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { mdiArrowUp } from '@quasar/extras/mdi-v7'

// import { useMarkdownStore } from 'src/.q-press/stores/doc'
import { useScroll } from '../composables/scroll'

import MarkdownHeader from './MarkdownHeader.vue'
import MarkdownDrawerSidebar from './MarkdownDrawerSidebar.vue'
import MarkdownDrawerToc from './MarkdownDrawerToc.vue'
import MarkdownPageSidebar from './MarkdownPageSidebar'
import MarkdownPageFooter from './MarkdownPageFooter.vue'

import siteConfig from '../../siteConfig'

const { onPageScroll } = useScroll()

const route = useRoute()
// const markdownStore = useMarkdownStore()

const isFullscreen = computed(() => route.meta.fullscreen === true)
const pageClass = computed(
  () => `markdown-layout__page--${isFullscreen.value === true ? 'fullscreen' : 'standard'}`,
)
const pageContentClass = computed(
  () =>
    'markdown-layout__page row no-wrap justify-start ' +
    `markdown-layout__page--${route.meta.fullwidth === true ? 'fullwidth' : 'standard'}`,
)
</script>

<style lang="scss">
.markdown-layout {
  .q-page-container :target {
    scroll-margin-top: $header-height;
  }

  // keep the button on top of sticky in examples
  .q-page-scroller > .q-page-sticky {
    z-index: 1;
  }

  &__page {
    width: 100%;

    &--standard {
      /**
        16px  - left menu margin
        + 330px - left menu
        + 1200px - page content
        + 300px - toc menu
       */
      max-width: 2500px;

      .markdown-page__content {
        width: auto;
        min-width: 0;
        flex: 10000 1 0%;
        max-width: 1200px;

        > div,
        > pre {
          margin-bottom: 22px;
        }
      }

      @media (max-width: 1845px) {
        justify-content: start;

        .markdown-page__toc-container--flowing {
          display: none;
        }
      }

      @media (min-width: 1846px) {
        .markdown-layout__menu-container {
          flex: 1 0 auto;
          width: auto;
          min-width: 0;
          max-width: 100%;
        }
      }
    }

    &--fullwidth,
    &--fullscreen {
      .markdown-page__content {
        width: 100%;
        padding: 0 !important;
      }

      .markdown-page__toc-container {
        display: none;
      }
    }
  }

  &__page-el--standard {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__menu {
    position: sticky;
    top: $header-height;
    height: calc(100vh - #{$header-height});
    width: 330px;
    min-width: 330px;
    border-right: 1px solid $separator-color;

    .markdown-page-menu {
      padding: 32px 16px 32px 0; // page top padding
    }
  }

  &__item.q-item,
  &__item .q-item {
    letter-spacing: $letter-spacing-brand;
    border-radius: 10px;
    margin-top: 2px;
    min-height: 30px;
    padding: 0 4px 0 6px;
    color: $light-text;
    transition: none;

    &:hover {
      color: #000 !important; // $header-btn-hover-color--light makes little difference
    }

    .q-item__section {
      padding-top: 2px;
      padding-bottom: 2px;
    }

    &.q-item--dark {
      color: $dark-text;

      &:hover {
        color: $header-btn-hover-color--dark !important;
      }
    }

    .q-item__section--main ~ .q-item__section--side {
      padding-left: 4px;
    }
  }

  &__item .q-expansion-item > .q-expansion-item__container > .q-item .q-item__label {
    padding-left: 8.5px;
  }

  &__item--active {
    color: $brand-primary !important;
    background: scale-color($primary, $lightness: 90%);

    &.q-item--dark {
      background: scale-color($primary, $lightness: -50%);
    }
  }
}

@media (max-width: 1300px) {
  .markdown-layout__menu,
  .markdown-page__toc-container--flowing {
    // let's position them off-screen
    // instead of "display: none"
    // so that QScrollArea won't compute the size uselessly
    position: fixed;
    left: -1000px;
    top: 0;
  }
}

.markdown-drawer {
  // only show the shadow when the drawer is open
  .q-drawer:not(.q-layout--prevent-focus) & {
    box-shadow: 0 0 6px 3px $separator-color;
  }

  &__header {
    position: sticky;
    top: 0;
    z-index: 1;
    background: linear-gradient(to bottom, #fff 0%, #fff 75%, transparent);
  }
}

body.body--dark {
  .markdown-layout__menu {
    border-right-color: $separator-dark-color;
  }

  // only show the shadow when the drawer is open
  .q-drawer:not(.q-layout--prevent-focus) .markdown-drawer {
    box-shadow: 0 0 6px 3px $brand-primary;
  }

  .markdown-drawer__header {
    background: linear-gradient(to bottom, $dark 0%, $dark 75%, transparent);
  }
}
</style>

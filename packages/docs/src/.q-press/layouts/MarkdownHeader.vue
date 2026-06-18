<template>
  <q-header
    class="markdown-header header-toolbar markdown-brand"
    bordered
    :height-hint="siteConfig.config.headerHeightHint || 128"
  >
    <q-toolbar
      v-if="siteConfig.config.usePrimaryHeader"
      class="markdown-header__primary q-pl-lg q-pr-md no-wrap items-stretch gt-750"
    >
      <q-btn
        v-if="!siteConfig.config.useSecondaryHeader"
        class="header-btn markdown-header__leftmost q-mr-xs lt-1300"
        flat
        round
        icon="menu"
        aria-label="Menu"
        :aria-expanded="markdownStore.menuDrawer ? 'true' : 'false'"
        aria-controls="menu-drawer"
        @click="markdownStore.toggleMenuDrawer"
      >
        <q-tooltip>Menu</q-tooltip>
      </q-btn>

      <router-link
        v-if="siteConfig.logoConfig.showLogo"
        to="/"
        class="markdown-header__logo row items-center no-wrap cursor-pointer"
      >
        <img
          class="markdown-header__logo-img"
          :src="logo.img"
          :alt="logo.alt"
          width="48"
          height="48"
        />
      </router-link>

      <template v-if="siteConfig.versionConfig.showOnHeader">
        <div
          v-if="siteConfig.versionConfig.showTitle"
          class="row items-center no-wrap cursor-pointer gt-750"
        >
          <q-btn
            to="/"
            no-caps
            flat
            class="markdown-header__logo row items-center no-wrap cursor-pointer"
          >
            <div class="column">
              <div class="col text-weight-bold">
                {{ siteConfig.title }}
              </div>
              <div v-if="siteConfig.versionConfig.showVersion" class="col text-weight-light">
                {{ siteConfig.version }}
              </div>
            </div>
          </q-btn>
        </div>
      </template>

      <div class="markdown-header__primary-left-spacer gt-lg" />

      <MarkdownHeaderTextLinks
        class="markdown-header__links col text-size-16 gt-1000"
        :menu="siteConfig.links.primaryHeaderLinks"
        mq-prefix="gt"
        nav-class="text-uppercase text-size-16 letter-spacing-300"
      />

      <MarkdownSearch class="markdown-header__search q-ml-sm" />

      <div
        v-if="showThemeChanger"
        class="markdown-header-icon-links q-ml-sm row no-wrap items-center"
      >
        <!-- <q-btn class="header-btn" type="a" flat round :icon="mdiCompare" @click="toggleDark" /> -->
        <DarkModeToggle />
      </div>
    </q-toolbar>

    <q-toolbar
      v-if="siteConfig.config.useSecondaryHeader"
      class="markdown-header__secondary q-pl-lg q-pr-md no-wrap"
    >
      <q-btn
        class="header-btn markdown-header__leftmost q-mr-xs lt-1300"
        flat
        round
        icon="menu"
        aria-label="Menu"
        :aria-expanded="markdownStore.menuDrawer ? 'true' : 'false'"
        aria-controls="menu-drawer"
        @click="markdownStore.toggleMenuDrawer"
      >
        <q-tooltip>Menu</q-tooltip>
      </q-btn>

      <router-link
        v-if="!siteConfig.config.usePrimaryHeader && siteConfig.logoConfig.showLogo"
        to="/"
        class="markdown-header__logo row items-center no-wrap cursor-pointer"
      >
        <img
          class="markdown-header__logo-img"
          :src="logo.img"
          :alt="logo.alt"
          width="48"
          height="48"
        />
      </router-link>

      <template v-if="!siteConfig.config.usePrimaryHeader && siteConfig.versionConfig.showOnHeader">
        <div
          v-if="siteConfig.versionConfig.showTitle"
          class="row items-center no-wrap cursor-pointer gt-1190"
        >
          <q-btn
            to="/"
            no-caps
            flat
            class="markdown-header__logo row items-center no-wrap cursor-pointer"
          >
            <div class="column">
              <div class="col text-weight-bold">
                {{ siteConfig.title }}
              </div>
              <div v-if="siteConfig.versionConfig.showVersion" class="col text-weight-light">
                {{ siteConfig.version }}
              </div>
            </div>
          </q-btn>
        </div>
      </template>

      <div class="markdown-header__secondary-left-spacer gt-lg" />

      <div class="markdown-header__links col row items-center no-wrap">
        <MarkdownHeaderTextLinks
          :menu="siteConfig.links.secondaryHeaderLinks"
          nav-class="text-size-14 letter-spacing-100"
          mq-prefix="gt"
        />
        <MarkdownHeaderTextLinks
          v-if="siteConfig.config.useMoreLinks === true && hasMoreLinks"
          :menu="siteConfig.links.moreLinks"
          nav-class="text-size-14 letter-spacing-100 lt-1400"
          mq-prefix="lt"
        />
      </div>

      <MarkdownSearch class="markdown-header__search q-ml-sm" />

      <MarkdownHeaderIconLinks class="gt-1400" :menu="siteConfig.links.socialLinks" />

      <div
        v-if="siteConfig.config.useToc && hasToc"
        class="markdown-header-icon-links q-ml-sm lt-md row no-wrap items-center"
      >
        <q-btn
          class="header-btn"
          flat
          round
          :icon="mdiFolderPound"
          aria-label="Table of Contents"
          :aria-expanded="markdownStore.tocDrawer ? 'true' : 'false'"
          aria-controls="toc-drawer"
          @click="markdownStore.toggleTocDrawer"
        >
          <q-tooltip>Table of Contents</q-tooltip>
        </q-btn>
      </div>

      <div
        v-if="!siteConfig.config.usePrimaryHeader"
        class="markdown-header-icon-links q-ml-sm row no-wrap items-center"
      >
        <!-- <q-btn class="header-btn" type="a" flat round :icon="mdiCompare" @click="toggleDark" /> -->
        <DarkModeToggle />
      </div>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { mdiFolderPound } from '@quasar/extras/mdi-v7'
import siteConfig from '../../siteConfig'

import DarkModeToggle from '../components/DarkModeToggle.vue'

import MarkdownSearch from './MarkdownSearch.vue'
import MarkdownHeaderTextLinks from './MarkdownHeaderTextLinks.vue'
import MarkdownHeaderIconLinks from './MarkdownHeaderIconLinks.vue'

import { useRoute } from 'vue-router'
import { useMarkdownStore } from '../stores/markdown'
import { useDark } from '../composables/dark'

const markdownStore = useMarkdownStore()
const route = useRoute()
const { isDark } = useDark()

const logo = computed(() => {
  if (isDark.value === true)
    return {
      img: siteConfig.logoConfig.logoDark,
      alt: siteConfig.logoConfig.logoAlt,
    }
  return {
    img: siteConfig.logoConfig.logoLight,
    alt: siteConfig.logoConfig.logoAlt,
  }
})

const showThemeChanger = computed(() => route.meta.dark !== true)
const hasToc = computed(
  () =>
    route.meta.fullwidth !== true &&
    route.meta.fullscreen !== true &&
    siteConfig.config.useToc &&
    markdownStore.toc.length !== 0,
)
const hasMoreLinks = computed(() => siteConfig.links.moreLinks.length > 0)
</script>

<style lang="scss">
.markdown-header {
  transition: none;

  &__primary {
    height: 72px;
    border-bottom: 1px solid $separator-color;
  }

  &__secondary {
    height: 55px;
  }

  &__logo-img {
    border-radius: 50%;
  }

  &__logo {
    padding-right: 24px;
  }

  &__version {
    color: #000;
    border: 1px solid $brand-primary;
    transition: none;

    .q-focus-helper {
      color: $brand-primary;
    }
  }

  &__leftmost {
    margin-left: -8px;
  }

  /**
    Spacers are used to align the links dead center
   */
  &__primary-left-spacer {
    width: 198px;
  }
  &__secondary-left-spacer {
    width: 296px;
  }

  @media (max-width: 320px) {
    .q-btn {
      font-size: 12px;
    }
    .q-btn--rectangle {
      padding: 8px 2px 8px 10px !important;
    }
  }

  @media (max-width: 1059px) {
    &__logo-text {
      display: none;
    }
  }

  @media (max-width: 699px) {
    .q-toolbar {
      padding-left: 16px;
      padding-right: 8px;
    }
    &__logo {
      padding-right: 16px;
    }
    .markdown-search {
      width: 100%;
    }
  }

  @media (max-width: 374px) {
    &__logo {
      display: none;
    }
  }

  @media (min-width: 700px) {
    .markdown-search {
      margin-left: 8px;

      .markdown-search__logo {
        display: none;
      }
    }
  }

  &__links {
    justify-content: flex-end;

    @media (min-width: 1921px) {
      justify-content: center;
    }
  }
}

.markdown-header-menu {
  letter-spacing: $letter-spacing-brand;
  border: 1px solid $separator-color;
  font-size: ($font-size - 2px);
  box-shadow: none !important;
  background-color: #fff;

  .q-item.q-router-link--active,
  .q-item--active {
    color: $brand-primary;
  }

  .q-item {
    height: 36px;
  }

  .q-item__label--header {
    color: $brand-accent;
    padding: 16px;

    &:first-child {
      padding-top: 8px;
    }
  }

  .q-item__section--side .q-icon {
    color: $brand-primary;
  }

  &__arrow {
    margin-right: -8px;
  }
}

.markdown-header-text-links__item {
  .q-icon {
    margin-left: 0;
  }
}

body.body--dark {
  .markdown-header__primary {
    border-bottom-color: $separator-dark-color;
  }

  .markdown-header-menu {
    background: $dark-bg;
    border-color: $separator-dark-color;

    .q-item.q-router-link--active,
    .q-item--active {
      color: $brand-primary;
    }
  }

  .markdown-header {
    &__version {
      color: #fff;
    }
  }

  .markdown-header-icon-links {
    color: $brand-primary;
  }
}

$mq-list:
  375,
  470,
  510,
  600,
  780,
  860,
  910,
  1000,
  1020,
  1100,
  1130,
  1190,
  1300 /* drawer */,
  1310,
  1400;
@each $query in $mq-list {
  @media (min-width: #{$query}px) {
    .lt-#{$query} {
      display: none;
    }
  }

  @media (max-width: #{$query - 1}px) {
    .gt-#{$query} {
      display: none;
    }
  }
}
</style>

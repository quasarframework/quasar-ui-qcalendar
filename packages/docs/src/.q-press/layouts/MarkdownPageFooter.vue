<template>
  <div v-if="siteConfig.config.useFooter" class="markdown-page-footer markdown-brand">
    <template v-if="props.fullscreen">
      <nav v-once class="markdown-page-footer__nav">
        <q-list v-for="entry in links" :key="entry.name" role="list">
          <q-item-label
            class="markdown-page-footer__title markdown-page-footer__margin row items-end text-weight-bold letter-spacing-225 q-mb-md"
            >{{ entry.name }}</q-item-label
          >

          <q-item
            v-for="(item, index) in entry.children"
            :key="index"
            dense
            :flat="item.image"
            clickable
            :to="item.path"
            :href="item.external ? item.path : void 0"
            :target="item.external ? '_blank' : void 0"
            class="markdown-layout__item"
          >
            <q-item-section v-if="item.image" class="letter-spacing-100"
              ><q-img :src="item.image" :style="{ maxWidth: item.maxWidth ?? '150px' }"
            /></q-item-section>
            <q-item-section v-else class="letter-spacing-100">{{ item.name }}</q-item-section>
          </q-item>
        </q-list>
      </nav>

      <q-separator class="landing-mx--large" />
    </template>

    <div
      v-if="!!siteConfig.license"
      class="markdown-page-footer__license row justify-center q-mt-md letter-spacing-225"
    >
      <q-btn
        v-if="!!siteConfig.license.label && !!siteConfig.license.link"
        no-caps
        flat
        :href="siteConfig.license.link"
        target="_blank"
        class="header-btn text-weight-bold"
        :label="siteConfig.license.label"
      />
      <template
        v-if="!!siteConfig.privacy && !!siteConfig.privacy.label && !!siteConfig.privacy.link"
      >
        <q-btn
          v-if="isPrivacyLocal"
          no-caps
          flat
          :to="siteConfig.privacy.link"
          class="header-btn text-weight-bold"
          :label="siteConfig.privacy.label"
        />
        <q-btn
          v-else
          no-caps
          flat
          :href="siteConfig.privacy.link"
          target="_blank"
          class="header-btn text-weight-bold"
          :label="siteConfig.privacy.label"
        />
      </template>
    </div>

    <div class="markdown-page-footer__copyright text-center q-pa-lg letter-spacing-100">
      <div v-if="siteConfig.copyright.line1">
        {{ siteConfig.copyright.line1 }}
      </div>
      <div v-if="siteConfig.copyright.line2">
        {{ siteConfig.copyright.line2 }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import siteConfig from '../../siteConfig'
import type { SiteMenuItem } from '../../siteConfig'

const isPrivacyLocal = computed(() => {
  return siteConfig?.privacy?.link?.startsWith('/') || siteConfig?.privacy?.link?.startsWith('.')
})

/**
 * Loop through the menus and extract all menu items therein, including children to a flat array of menu items
 * @param menus menu items to extract from
 * @return {*[]} An array of flattened menu items (no more children, they move up to the same level as others)
 */
function getMenu(path: string): SiteMenuItem[] {
  const children: SiteMenuItem[] = []
  const menuItem: SiteMenuItem | undefined = siteConfig.sidebar.find(
    (item) => item.path === path,
  ) as SiteMenuItem

  if (menuItem !== void 0 && menuItem.children) {
    for (const item of menuItem.children) {
      if (item.children === void 0) {
        children.push({
          name: item.name,
          path: item.external === true ? item.path : `/${path}/${item.path}`,
          external: item.external,
          image: item.image ?? void 0,
        } as SiteMenuItem)
      }
    }
  }

  return children
}

const links = siteConfig.links.footerLinks.flatMap((nav) => ({
  name: nav.name,
  children: [...(nav.children || []), ...((nav.extract !== void 0 && getMenu(nav.extract)) || [])],
}))

const props = defineProps({
  fullscreen: Boolean,
})
</script>

<style lang="scss">
.markdown-page-footer {
  position: relative;
  background-color: $brand-light-bg;
  width: 100%;
  z-index: 1;
  border-top: 1px solid $separator-color;

  &__margin {
    margin-left: 6px;
  }

  .markdown-layout__item,
  &__title {
    font-size: ($font-size - 2px);
  }

  &__nav {
    display: grid;
    grid-row-gap: 64px;
    grid-column-gap: 32px;
    padding: 64px 32px;
    grid-template-columns: 1fr;

    @media (min-width: 720px) {
      padding-left: 64px;
      padding-right: 64px;
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 830px) {
      grid-column-gap: 64px;
    }

    @media (min-width: 1070px) {
      padding-top: 100px;
      padding-bottom: 100px;
      grid-row-gap: 64px;
      grid-template-columns: repeat(3, 1fr);
    }

    @media (min-width: 1417px) {
      grid-template-columns: repeat(4, 1fr);
    }

    @media (min-width: 2060px) {
      grid-template-columns: repeat(5, 1fr);
    }
  }

  &__copyright {
    font-size: ($font-size - 2px);
  }
}

body.body--dark {
  .markdown-page-footer {
    background-color: $dark-bg;
    border-top-color: $separator-dark-color;
  }
}
</style>

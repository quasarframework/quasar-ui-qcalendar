<template>
  <div v-if="siteConfig.config.useFooter" class="markdown-page-footer markdown-brand">
    <div class="markdown-page-footer__shell">
      <template v-if="props.fullscreen">
        <section class="markdown-page-footer__brand-card" aria-label="Project summary">
          <router-link
            v-if="siteConfig.logoConfig.showLogo"
            to="/"
            class="markdown-page-footer__logo-link"
          >
            <img
              :src="logo"
              :alt="siteConfig.logoConfig.logoAlt"
              class="markdown-page-footer__logo"
            />
          </router-link>

          <p class="markdown-page-footer__eyebrow letter-spacing-225">Documentation</p>
          <h2>{{ siteConfig.title }}</h2>
          <p class="markdown-page-footer__description">
            {{ siteConfig.description }}
          </p>
        </section>

        <nav v-once class="markdown-page-footer__nav" aria-label="Footer navigation">
          <section v-for="entry in links" :key="entry.name" class="markdown-page-footer__group">
            <h3 class="markdown-page-footer__title letter-spacing-225">{{ entry.name }}</h3>

            <div class="markdown-page-footer__links">
              <q-btn
                v-for="(item, index) in entry.children"
                :key="index"
                no-caps
                unelevated
                :to="item.external ? void 0 : item.path"
                :href="item.external ? item.path : void 0"
                :target="item.external ? '_blank' : void 0"
                class="markdown-page-footer__link"
              >
                <img
                  v-if="item.image"
                  :src="item.image"
                  :alt="item.name"
                  :style="{ maxWidth: item.maxWidth ?? '150px' }"
                  class="markdown-page-footer__image"
                />
                <q-icon v-else-if="getIcon(item)" :name="getIcon(item)" size="18px" />
                <span>{{ item.name }}</span>
              </q-btn>
            </div>
          </section>
        </nav>
      </template>

      <div class="markdown-page-footer__bottom">
        <div class="markdown-page-footer__copyright letter-spacing-100">
          <div v-if="siteConfig.copyright.line1">
            {{ siteConfig.copyright.line1 }}
          </div>
          <div v-if="siteConfig.copyright.line2">
            {{ siteConfig.copyright.line2 }}
          </div>
        </div>

        <div v-if="!!siteConfig.license" class="markdown-page-footer__legal letter-spacing-225">
          <q-btn
            v-if="!!siteConfig.license.label && !!siteConfig.license.link"
            no-caps
            flat
            :href="siteConfig.license.link"
            target="_blank"
            class="markdown-page-footer__legal-action text-weight-bold"
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
              class="markdown-page-footer__legal-action text-weight-bold"
              :label="siteConfig.privacy.label"
            />
            <q-btn
              v-else
              no-caps
              flat
              :href="siteConfig.privacy.link"
              target="_blank"
              class="markdown-page-footer__legal-action text-weight-bold"
              :label="siteConfig.privacy.label"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDark } from '../composables/dark'
import siteConfig from '../../siteConfig'
import type { SiteMenuItem } from '../../siteConfig'

const { isDark } = useDark()

const isPrivacyLocal = computed(() => {
  return siteConfig?.privacy?.link?.startsWith('/') || siteConfig?.privacy?.link?.startsWith('.')
})

const logo = computed(() => {
  return isDark.value ? siteConfig.logoConfig.logoDark : siteConfig.logoConfig.logoLight
})

function getIcon(item: SiteMenuItem): string | undefined {
  return (item as SiteMenuItem & { icon?: string }).icon
}

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
          icon: getIcon(item),
          image: item.image ?? void 0,
          maxWidth: item.maxWidth ?? void 0,
        } as SiteMenuItem & { icon?: string })
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
  /**
   * Flag to indicate if the page is in fullscreen mode.
   *
   * @category state
   */
  fullscreen: Boolean,
})
</script>

<style lang="scss">
@use 'sass:color';

.markdown-page-footer {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 20% 0, rgba($brand-primary, 0.12), transparent 34%),
    linear-gradient(135deg, color.scale($brand-light-bg, $lightness: -2%), $brand-light-bg 64%);
  width: 100%;
  z-index: 1;
  border-top: 1px solid rgba($brand-border-color-light, 0.5);

  &::before {
    position: absolute;
    inset: 0 0 auto;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba($brand-primary, 0.8), transparent);
    content: '';
  }

  &__shell {
    position: relative;
    display: grid;
    grid-template-columns: 1fr;
    gap: 28px;
    width: min(1180px, calc(100% - 32px));
    margin: 0 auto;
    padding: 48px 0 28px;
  }

  &__brand-card,
  &__group {
    border: 1px solid rgba($brand-border-color-light, 0.32);
    border-radius: 28px;
    background: rgba($brand-light-bg, 0.74);
    box-shadow: 0 20px 80px rgba($brand-dark, 0.08);
    backdrop-filter: blur(14px);
  }

  &__brand-card {
    padding: 28px;
  }

  &__logo-link {
    display: inline-flex;
    margin-bottom: 20px;
  }

  &__logo {
    width: 64px;
    height: 64px;
    border-radius: 18px;
    object-fit: contain;
    box-shadow: 0 16px 40px rgba($brand-dark, 0.16);
  }

  &__eyebrow,
  &__title {
    margin: 0 0 12px;
    color: $brand-accent;
    font-size: ($font-size - 5px);
    font-weight: 800;
    text-transform: uppercase;
  }

  h2 {
    margin: 0;
    color: $brand-light-text;
    font-size: clamp(30px, 5vw, 54px);
    line-height: 0.98;
    letter-spacing: -0.055em;
  }

  &__description {
    max-width: 560px;
    margin: 18px 0 0;
    color: color.scale($brand-light-text, $lightness: 12%);
    font-size: ($font-size + 1px);
  }

  &__nav {
    display: grid;
    gap: 16px;
    align-items: start;
    grid-template-columns: 1fr;
  }

  &__group {
    align-self: start;
    padding: 22px;
  }

  &__links {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  &__link {
    min-height: 40px;
    padding: 8px 14px;
    border: 1px solid rgba($brand-primary, 0.2);
    border-radius: 999px;
    color: $brand-light-text;
    background: rgba($brand-primary, 0.08);
    font-size: ($font-size - 2px);

    .q-btn__content {
      gap: 8px;
    }
  }

  &__image {
    display: block;
    width: auto;
    max-height: 24px;
    object-fit: contain;

    &[alt='Sponsor Jeff'] {
      border-radius: 999px;
    }
  }

  &__bottom {
    display: flex;
    flex-direction: column-reverse;
    gap: 16px;
    align-items: flex-start;
    justify-content: space-between;
    padding-top: 24px;
    border-top: 1px solid rgba($brand-border-color-light, 0.28);
  }

  &__copyright,
  &__legal-action {
    font-size: ($font-size - 2px);
  }

  &__copyright {
    color: color.scale($brand-light-text, $lightness: 18%);
  }

  &__legal {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__legal-action {
    color: $brand-accent;
  }

  @media (min-width: 860px) {
    &__shell {
      grid-template-columns: minmax(280px, 0.88fr) minmax(0, 1.12fr);
      gap: 22px;
      padding-top: 64px;
    }

    &__bottom {
      grid-column: 1 / -1;
      flex-direction: row;
      align-items: center;
    }
  }

  @media (min-width: 1180px) {
    &__nav {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
}

body.body--dark {
  .markdown-page-footer {
    background:
      radial-gradient(circle at 20% 0, rgba($brand-primary, 0.18), transparent 36%),
      linear-gradient(135deg, color.scale($dark-bg, $lightness: 8%), $dark-bg 68%);
    border-top-color: rgba($brand-border-color-dark, 0.48);

    &__brand-card,
    &__group {
      border-color: rgba($brand-border-color-dark, 0.26);
      background: rgba(color.scale($dark-bg, $lightness: 8%), 0.72);
      box-shadow: 0 22px 90px rgba(#000, 0.28);
    }

    h2 {
      color: $brand-dark-text;
    }

    &__description,
    &__copyright {
      color: color.scale($brand-dark-text, $lightness: -8%);
    }

    &__link {
      border-color: rgba($brand-primary, 0.32);
      color: $brand-dark-text;
      background: rgba($brand-primary, 0.1);
    }
  }
}
</style>

<template>
  <section class="landing-page markdown-brand">
    <header class="hero">
      <div class="hero__mesh hero__mesh--left" />
      <div class="hero__mesh hero__mesh--right" />

      <div class="hero__grid">
        <div class="hero__copy">
          <div class="hero__eyebrow">{{ heroEyebrow }}</div>
          <img :src="logoSrc" :alt="logoAlt" class="hero-logo" />
          <h1 class="hero-title">{{ productName }}</h1>

          <p class="hero-subtitle">{{ siteConfig.description }}</p>
          <p class="hero-lede">{{ heroLede }}</p>

          <div class="hero-buttons">
            <q-btn
              to="/getting-started/introduction"
              no-caps
              rounded
              unelevated
              class="hero-button hero-button--solid"
            >
              <div class="hero-button__content q-anchor--skip">
                <span class="hero-button__slot hero-button__slot--empty" aria-hidden="true" />
                <span class="hero-button__label">Get Started</span>
                <span class="hero-button__slot">
                  <q-icon :name="biArrowRightCircle" />
                </span>
              </div>
            </q-btn>

            <q-btn
              to="/other/upgrade-guide"
              no-caps
              rounded
              unelevated
              class="hero-button hero-button--ghost"
            >
              <div class="hero-button__content q-anchor--skip">
                <span class="hero-button__slot hero-button__slot--empty" aria-hidden="true" />
                <span class="hero-button__label">Upgrade Guide</span>
                <span class="hero-button__slot">
                  <q-icon name="upgrade" />
                </span>
              </div>
            </q-btn>

            <q-btn
              :href="githubTreeUrl"
              target="_blank"
              rel="noopener noreferrer"
              no-caps
              rounded
              unelevated
              class="hero-button hero-button--ghost"
            >
              <div class="hero-button__content q-anchor--skip">
                <span class="hero-button__slot">
                  <q-icon :name="fabGithub" />
                </span>
                <span class="hero-button__label">GitHub Repo</span>
                <span class="hero-button__slot hero-button__slot--empty" aria-hidden="true" />
              </div>
            </q-btn>
          </div>

          <div class="hero-pills">
            <span v-for="pill in heroPills" :key="pill" class="hero-pill">
              {{ pill }}
            </span>
          </div>
        </div>

        <div class="hero__visual">
          <div class="preview-panel">
            <div class="preview-panel__header">
              <span class="preview-panel__kicker">{{ previewKicker }}</span>
              <span class="preview-panel__note">Docs and app-ready</span>
            </div>

            <div class="preview-panel__body">
              <div class="preview-panel__copy">
                <h2>{{ previewTitle }}</h2>
                <p>{{ previewBody }}</p>
              </div>

              <div
                class="preview-stack"
                :class="{ 'preview-stack--single': previewImages.length === 1 }"
              >
                <div class="preview-stack__badge preview-stack__badge--top">7 view families</div>
                <div
                  v-for="(image, index) in previewImages"
                  :key="image.src"
                  class="preview-card"
                  :class="previewCardClass(index)"
                >
                  <q-img :src="image.src" :alt="image.alt" fit="contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <section class="feature-section">
      <div class="section-heading">
        <div class="section-heading__eyebrow">Included</div>
        <h2 class="section-heading__title">{{ sectionTitle }}</h2>
        <p class="section-heading__text">{{ sectionText }}</p>
      </div>

      <div class="feature-grid">
        <article v-for="feature in featureCards" :key="feature.title" class="feature-card">
          <div class="feature-card__icon">
            <q-icon :name="feature.icon" />
          </div>
          <h3 class="feature-card__title">{{ feature.title }}</h3>
          <p class="feature-card__body">{{ feature.body }}</p>
        </article>
      </div>
    </section>

    <section class="resource-section">
      <article class="resource-card resource-card--primary">
        <div class="resource-card__eyebrow">Ecosystem</div>
        <h2 class="resource-card__title">
          Built in the same docs workflow as the other md-plugins sites
        </h2>
        <p class="resource-card__body">
          This site runs on Q-Press and the shared md-plugins tooling, so {{ productName }}'s docs,
          examples, and navigation fit into the same family as the sibling Quasar UI projects.
        </p>

        <div class="resource-card__actions">
          <a :href="githubRepoUrl" target="_blank" rel="noopener noreferrer" class="resource-link">
            <q-icon :name="fabGithub" />
            <span>{{ productName }} Repo</span>
          </a>

          <a
            href="https://github.com/hawkeye64/md-plugins"
            target="_blank"
            rel="noopener noreferrer"
            class="resource-link"
          >
            <q-icon name="hub" />
            <span>md-plugins</span>
          </a>

          <a
            href="https://www.npmjs.com/package/@md-plugins/quasar-app-extension-q-press"
            target="_blank"
            rel="noopener noreferrer"
            class="resource-link"
          >
            <q-icon name="description" />
            <span>Q-Press</span>
          </a>
        </div>
      </article>

      <article class="resource-card resource-card--secondary">
        <div class="resource-card__eyebrow">Need Help?</div>
        <h2 class="resource-card__title">
          Start with quick start, then use the examples as your map
        </h2>
        <p class="resource-card__body">
          QCalendar has the broadest surface area of the sibling projects, so the docs are designed
          to move you from installation into anatomy, theming, and then the example collections for
          each calendar family.
        </p>

        <div class="resource-list">
          <div v-for="item in supportItems" :key="item.title" class="resource-list__item">
            <div class="resource-list__title">{{ item.title }}</div>
            <div class="resource-list__body">{{ item.body }}</div>
          </div>
        </div>
      </article>
    </section>
  </section>
</template>

<script setup lang="ts">
import { fabGithub } from '@quasar/extras/fontawesome-v7'
import { biArrowRightCircle } from '@quasar/extras/bootstrap-icons'
import siteConfig from '../../siteConfig'

const productName = 'QCalendar'
const logoSrc = '/qcalendar-logo.png'
const logoAlt = 'QCalendar Logo'
const githubTreeUrl = 'https://github.com/quasarframework/quasar-ui-qcalendar/tree/v5-beta'
const githubRepoUrl = 'https://github.com/quasarframework/quasar-ui-qcalendar'
const heroEyebrow = 'Vue 3 + Quasar 2'
const heroLede =
  'Build day, week, month, agenda, resource, scheduler, and task calendars with one consistent Vue and Quasar calendar system instead of stitching several widgets together.'
const previewKicker = 'Calendar System'
const previewTitle = 'One calendar family, multiple views, and room for real application workflows'
const previewBody =
  'QCalendar goes beyond a single month grid: timeline views, resource planning, mini-mode selection, scheduler layouts, and task surfaces all live inside the same API family.'
const sectionTitle =
  'A broad calendar toolkit for scheduling, planning, task views, and date-driven interfaces'
const sectionText =
  'QCalendar is intentionally wide in capability but consistent in structure: shared date logic, theming, slots, and view-specific surfaces for planning-heavy interfaces.'

const heroPills = ['Day', 'Month', 'Agenda', 'Resource', 'Scheduler', 'Task']

const previewCardClass = (index: number) =>
  [
    'preview-card--primary',
    'preview-card--secondary',
    'preview-card--tertiary',
    'preview-card--quaternary',
  ][index] ?? 'preview-card--secondary'

const previewImages = [
  {
    src: '/qcalendar-month-view.png',
    alt: 'QCalendar month view with events preview',
  },
  {
    src: '/QCalendarScheduler.png',
    alt: 'QCalendar scheduler view preview',
  },
  {
    src: '/qcalendar-month-view-mini-mode-multi-month-selection.png',
    alt: 'QCalendar mini-mode multi-month selection preview',
  },
  {
    src: '/q-calendar-month-view-mini-mode-with-selection.png',
    alt: 'QCalendar large month view with mini calendar selection preview',
  },
]

const featureCards = [
  {
    icon: 'calendar_view_day',
    title: 'Day and Week Planning',
    body: 'Use interval-based day and week views for schedules, booking flows, and detailed time-based planning.',
  },
  {
    icon: 'calendar_view_month',
    title: 'Month and Mini Mode',
    body: 'Handle classic month layouts and compact mini-mode selection with the same calendar family.',
  },
  {
    icon: 'view_agenda',
    title: 'Agenda Views',
    body: 'Build list-and-column planning surfaces when a standard grid is not the clearest way to present the schedule.',
  },
  {
    icon: 'group_work',
    title: 'Resource and Scheduler',
    body: 'Map time across people, rooms, equipment, or teams with resource-aware calendar layouts.',
  },
  {
    icon: 'timeline',
    title: 'Task and Planning Surfaces',
    body: 'Support timesheets, task views, and more planning-heavy layouts without leaving the QCalendar family.',
  },
  {
    icon: 'palette',
    title: 'Themes, Slots, and Locale',
    body: 'Adapt calendar presentation with custom themes, slot-driven rendering, and locale-aware date behavior.',
  },
]

const supportItems = [
  {
    title: 'Quick Start + Anatomy',
    body: 'Use the getting-started docs first, especially the quick start and anatomy guides, before jumping into examples.',
  },
  {
    title: 'Examples by View',
    body: 'The examples are organized by calendar family, which makes them the fastest way to compare day, month, resource, scheduler, and task patterns.',
  },
  {
    title: 'Discussions + Issues',
    body: 'Questions, bugs, and API edge cases are easiest to track in the QCalendar repo and GitHub Discussions.',
  },
]
</script>

<style lang="scss" scoped>
.landing-page {
  --landing-border: rgba(232, 246, 255, 0.14);
  --landing-border-strong: rgba(232, 246, 255, 0.22);
  --landing-surface: rgba(22, 35, 56, 0.74);
  --landing-surface-strong: rgba(29, 47, 74, 0.88);
  --landing-text-soft: rgba(232, 246, 255, 0.82);
  --landing-shadow: 0 28px 60px rgba(11, 20, 34, 0.28);
  padding: 28px clamp(16px, 2.4vw, 34px) 42px;
  color: #223447;
}

.hero {
  position: relative;
  overflow: hidden;
  margin-bottom: 32px;
  padding: clamp(24px, 4vw, 44px);
  border: 1px solid var(--landing-border);
  border-radius: 34px;
  background:
    radial-gradient(circle at top left, rgba(121, 203, 255, 0.24), transparent 34%),
    radial-gradient(circle at 82% 20%, rgba(246, 252, 255, 0.08), transparent 20%),
    linear-gradient(145deg, rgba(23, 40, 63, 0.96), rgba(12, 21, 36, 0.96));
  box-shadow: var(--landing-shadow);
}

.hero__mesh {
  position: absolute;
  width: 240px;
  height: 240px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(246, 252, 255, 0.12), transparent 68%);
  filter: blur(10px);
  pointer-events: none;
}

.hero__mesh--left {
  top: -90px;
  left: -70px;
}

.hero__mesh--right {
  right: -40px;
  bottom: -90px;
}

.hero__grid {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 24px;
  align-items: center;
  grid-template-columns: minmax(0, 1.06fr) minmax(320px, 0.94fr);
}

.hero__copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
}

.hero__eyebrow,
.section-heading__eyebrow,
.resource-card__eyebrow,
.preview-panel__kicker {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 0 14px;
  border: 1px solid var(--landing-border-strong);
  border-radius: 999px;
  background: rgba(246, 252, 255, 0.08);
  color: #cde9ff;
  font-family: 'Clash Display', 'Montserrat', 'Segoe UI', sans-serif;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.resource-card__eyebrow {
  margin-bottom: 14px;
}

.hero-logo {
  width: clamp(84px, 11vw, 120px);
  border-radius: 28px;
  box-shadow: 0 24px 48px rgba(11, 20, 34, 0.32);
}

.hero-title {
  margin: 0;
  font-family: 'Clash Display', 'Montserrat', 'Segoe UI', sans-serif;
  font-size: clamp(3.2rem, 8vw, 6rem);
  line-height: 0.95;
  font-weight: 800;
  letter-spacing: -0.05em;
  color: #f8fcff;
}

.hero-subtitle {
  max-width: 620px;
  margin: 0;
  font-family: 'Clash Display', 'Montserrat', 'Segoe UI', sans-serif;
  font-size: clamp(1.15rem, 2vw, 1.45rem);
  line-height: 1.45;
  font-weight: 700;
  color: #ecf7ff;
}

.hero-lede {
  max-width: 600px;
  margin: 0;
  font-size: 1rem;
  line-height: 1.7;
  color: var(--landing-text-soft);
}

.hero-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 12px;
  padding-top: 6px;
  margin-bottom: 6px;
}

.hero-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-top: 6px;
}

.hero-button {
  min-height: 50px;
  padding: 0 18px;
  border: 1px solid transparent;
  text-decoration: none;
  transition:
    transform 0.22s ease,
    background-color 0.22s ease,
    border-color 0.22s ease,
    color 0.22s ease,
    box-shadow 0.22s ease;
}

.hero-button:hover,
.resource-link:hover {
  transform: translateY(-1px);
}

.hero-button :deep(.q-btn__content) {
  width: 100%;
  min-width: 0;
}

.hero-button--solid {
  background: #eff8ff;
  color: #18283d;
  box-shadow: 0 18px 30px rgba(11, 20, 34, 0.2);
}

.hero-button--ghost {
  background: rgba(246, 252, 255, 0.08);
  border-color: var(--landing-border-strong);
  color: #f8fcff;
}

.hero-button__content {
  display: grid;
  grid-template-columns: 1.5rem minmax(0, 1fr) 1.5rem;
  align-items: center;
  column-gap: 12px;
  min-width: 0;
  width: 100%;
  font-family: 'Clash Display', 'Montserrat', 'Segoe UI', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
}

.hero-button__slot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
}

.hero-button__slot--empty {
  visibility: hidden;
}

.hero-button__slot :deep(.q-icon) {
  font-size: 1.3rem;
}

.hero-button__label {
  white-space: nowrap;
  text-align: center;
}

.hero-pill {
  padding: 8px 12px;
  border: 1px solid rgba(246, 252, 255, 0.12);
  border-radius: 999px;
  background: rgba(246, 252, 255, 0.05);
  color: #d7eeff;
  font-size: 0.84rem;
  font-weight: 600;
}

.preview-panel,
.feature-card,
.resource-card {
  overflow: hidden;
  border: 1px solid var(--landing-border);
  border-radius: 24px;
  background: var(--landing-surface);
  box-shadow: var(--landing-card-shadow);
}

.preview-panel {
  position: relative;
  overflow: visible;
  width: 100%;
  padding: 20px;
  background:
    linear-gradient(180deg, rgba(246, 252, 255, 0.08), rgba(246, 252, 255, 0.02)),
    rgba(14, 24, 40, 0.52);
  backdrop-filter: blur(8px);
}

.preview-panel__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.preview-panel__note,
.section-heading__text,
.feature-card__body,
.resource-card__body,
.resource-list__body {
  color: var(--landing-text-soft);
}

.preview-panel__note {
  color: var(--landing-note-text);
  font-size: 0.84rem;
  font-weight: 600;
}

.preview-panel__body {
  display: grid;
  gap: 20px;
}

.preview-panel__copy h2,
.section-heading__title,
.feature-card__title,
.resource-card__title {
  font-family: 'Clash Display', 'Montserrat', 'Segoe UI', sans-serif;
  color: #f8fcff;
}

.preview-panel__copy h2 {
  margin: 0 0 10px;
  font-size: clamp(1.35rem, 2vw, 1.7rem);
  line-height: 1.2;
}

.preview-panel__copy p,
.section-heading__text,
.feature-card__body,
.resource-card__body,
.resource-list__body {
  margin: 0;
  line-height: 1.68;
}

.preview-stack {
  position: relative;
  isolation: isolate;
  min-height: clamp(330px, 34vw, 390px);
  padding: 18px 14px 24px;
  overflow: visible;
}

.preview-stack::before {
  content: '';
  position: absolute;
  inset: 28px 18px 40px;
  z-index: -1;
  border: 1px solid var(--landing-preview-card-border);
  border-radius: 28px;
  background:
    linear-gradient(135deg, rgba(121, 203, 255, 0.2), transparent 42%), rgba(246, 252, 255, 0.06);
  transform: rotate(2deg);
}

.preview-stack__badge {
  position: absolute;
  z-index: 4;
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 13px;
  border: 1px solid var(--landing-border-strong);
  border-radius: 999px;
  background: var(--landing-chip-bg);
  color: var(--landing-chip-text);
  font-family: 'Clash Display', 'Montserrat', 'Segoe UI', sans-serif;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  box-shadow: 0 14px 28px rgba(11, 20, 34, 0.16);
}

.preview-stack__badge--top {
  top: 6px;
  right: 18px;
}

.preview-card {
  position: absolute;
  overflow: hidden;
  border: 1px solid rgba(246, 252, 255, 0.12);
  border-radius: 22px;
  background: rgba(246, 252, 255, 0.08);
  box-shadow: 0 22px 38px rgba(11, 20, 34, 0.22);
}

.preview-card :deep(.q-img) {
  display: block;
  height: 100%;
  width: 100%;
}

.preview-card :deep(.q-img__image) {
  object-fit: cover !important;
  object-position: top left;
}

.preview-card--primary {
  top: 36px;
  left: -10px;
  z-index: 2;
  width: min(84%, 410px);
  height: clamp(230px, 24vw, 290px);
  transform: rotate(-3deg);
}

.preview-card--secondary {
  right: -28px;
  bottom: 64px;
  z-index: 3;
  width: min(62%, 300px);
  height: clamp(150px, 16vw, 205px);
  transform: rotate(5deg);
}

.preview-card--tertiary {
  right: 38px;
  bottom: 22px;
  z-index: 4;
  width: min(46%, 220px);
  height: clamp(78px, 8vw, 108px);
  transform: rotate(-1deg);
}

.preview-card--quaternary {
  left: 34px;
  bottom: 2px;
  z-index: 5;
  width: min(42%, 205px);
  height: clamp(84px, 9vw, 118px);
  transform: rotate(2deg);
}

.feature-section,
.resource-section {
  margin-top: 28px;
}

.section-heading {
  max-width: 760px;
  margin: 0 auto 20px;
  text-align: center;
}

.section-heading__title {
  margin: 14px 0 10px;
  font-size: clamp(2rem, 4vw, 2.8rem);
  line-height: 1.12;
  text-wrap: balance;
}

.feature-grid,
.resource-section {
  display: grid;
  gap: 18px;
}

.feature-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.resource-section {
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
}

.feature-card,
.resource-card {
  position: relative;
  padding: 20px;
}

.feature-card::before {
  content: '';
  position: absolute;
  inset: 0 auto auto 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, rgba(121, 203, 255, 0.55), transparent 65%);
}

.feature-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  margin-bottom: 14px;
  border-radius: 14px;
  background: rgba(121, 203, 255, 0.14);
  color: #d7eeff;
  font-size: 1.35rem;
}

.feature-card__title,
.resource-card__title {
  margin: 0 0 10px;
  font-size: 1.16rem;
  line-height: 1.3;
}

.resource-card--primary {
  background:
    radial-gradient(circle at top right, rgba(121, 203, 255, 0.16), transparent 30%),
    var(--landing-surface-strong);
}

.resource-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.resource-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  padding: 0 16px;
  border: 1px solid var(--landing-border-strong);
  border-radius: 999px;
  background: rgba(246, 252, 255, 0.05);
  color: #ecf7ff;
  text-decoration: none;
  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    background-color 0.22s ease;
}

.resource-list {
  display: grid;
  gap: 0;
  margin-top: 16px;
}

.resource-list__item {
  padding: 12px 0;
  border-top: 1px solid var(--landing-resource-item-border);
}

.resource-list__item:first-child {
  padding-top: 0;
  border-top: 0;
}

.resource-list__title {
  margin-bottom: 6px;
  font-family: 'Clash Display', 'Montserrat', 'Segoe UI', sans-serif;
  font-size: 0.96rem;
  font-weight: 700;
  color: #d7eeff;
}

.feature-card__body,
.resource-card__body {
  color: var(--landing-body-text);
  font-size: 0.97rem;
}

.resource-list__body {
  color: var(--landing-body-text);
  font-size: 0.93rem;
  line-height: 1.55;
}

@media (max-width: 1100px) {
  .hero__grid,
  .resource-section,
  .feature-grid {
    grid-template-columns: 1fr;
  }

  .preview-stack {
    min-height: 360px;
  }
}

@media (max-width: 700px) {
  .landing-page {
    padding: 18px 12px 30px;
  }

  .hero {
    padding: 24px 18px;
    border-radius: 24px;
  }

  .hero__copy {
    align-items: stretch;
  }

  .hero-buttons,
  .resource-card__actions {
    flex-direction: column;
  }

  .hero-button,
  .resource-link {
    justify-content: center;
  }

  .preview-stack {
    min-height: 430px;
    padding: 6px 0 0;
  }

  .preview-stack::before,
  .preview-stack__badge {
    display: none;
  }

  .preview-card--primary {
    position: relative;
    left: auto;
    top: auto;
    width: 100%;
    height: 220px;
    transform: none;
  }

  .preview-card--secondary {
    right: auto;
    bottom: auto;
    left: 18px;
    width: calc(100% - 36px);
    transform: translateY(-24px);
  }

  .preview-card--tertiary {
    right: 18px;
    bottom: 70px;
    width: calc(100% - 72px);
    height: 84px;
    transform: none;
  }

  .preview-card--quaternary {
    left: 18px;
    bottom: 14px;
    width: calc(100% - 72px);
    height: 92px;
    transform: none;
  }

  .feature-card,
  .resource-card {
    padding: 18px;
    border-radius: 20px;
  }
}

/* codex-theme-override:start */
.landing-page {
  --landing-page-text: #{$brand-light-text};
  --landing-heading: #{$brand-light-text};
  --landing-body-text: #{rgba($brand-light-text, 0.84)};
  --landing-note-text: #{rgba($brand-light-text, 0.66)};
  --landing-border: #{rgba($brand-secondary, 0.16)};
  --landing-border-strong: #{rgba($brand-secondary, 0.24)};
  --landing-surface: #{rgba($brand-light, 0.78)};
  --landing-surface-strong: #{rgba($brand-light, 0.92)};
  --landing-text-soft: #{rgba($brand-light-text, 0.78)};
  --landing-shadow: 0 28px 60px #{rgba($brand-primary, 0.14)};
  --landing-card-shadow: 0 16px 34px #{rgba($brand-secondary, 0.12)};
  --landing-chip-bg: #{rgba($brand-light, 0.52)};
  --landing-chip-text: #{$brand-primary};
  --landing-solid-bg: #{$brand-primary};
  --landing-solid-text: #{$brand-light};
  --landing-solid-shadow: 0 18px 30px #{rgba($brand-primary, 0.24)};
  --landing-ghost-bg: #{rgba($brand-light, 0.46)};
  --landing-ghost-text: #{$brand-light-text};
  --landing-pill-border: #{rgba($brand-secondary, 0.14)};
  --landing-pill-bg: #{rgba($brand-light, 0.44)};
  --landing-pill-text: #{$brand-primary};
  --landing-panel-gradient-top: #{rgba($brand-light, 0.7)};
  --landing-panel-gradient-bottom: #{rgba($brand-light, 0.22)};
  --landing-panel-bg: #{rgba($brand-light-bg, 0.88)};
  --landing-preview-card-border: #{rgba($brand-secondary, 0.18)};
  --landing-preview-card-bg: #{rgba($brand-light, 0.82)};
  --landing-preview-card-shadow: 0 22px 38px #{rgba($brand-secondary, 0.14)};
  --landing-accent-line: #{rgba($brand-primary, 0.4)};
  --landing-icon-bg: #{rgba($brand-primary, 0.1)};
  --landing-icon-color: #{$brand-primary};
  --landing-spot-accent: #{rgba($brand-primary, 0.14)};
  --landing-resource-link-bg: #{rgba($brand-light, 0.48)};
  --landing-resource-link-text: #{$brand-light-text};
  --landing-resource-item-border: #{rgba($brand-secondary, 0.1)};
  --landing-resource-item-bg: #{rgba($brand-light, 0.42)};
  --landing-accent-text: #{$brand-primary};
  --landing-mesh-color: #{rgba($brand-primary, 0.16)};
  --landing-hero-glow-1: #{rgba($brand-primary, 0.18)};
  --landing-hero-glow-2: #{rgba($brand-secondary, 0.12)};
  --landing-hero-start: #{rgba($brand-light, 0.96)};
  --landing-hero-end: #{rgba($brand-light-bg, 0.96)};
  color: var(--landing-page-text);
}

body.body--dark .landing-page {
  --landing-page-text: #{$brand-dark-text};
  --landing-heading: #{$brand-dark-text};
  --landing-body-text: #{rgba($brand-dark-text, 0.8)};
  --landing-note-text: #{rgba($brand-dark-text, 0.64)};
  --landing-border: #{rgba($brand-light, 0.12)};
  --landing-border-strong: #{rgba($brand-light, 0.2)};
  --landing-surface: #{rgba($dark-pill, 0.74)};
  --landing-surface-strong: #{rgba($dark-pill, 0.88)};
  --landing-text-soft: #{rgba($brand-dark-text, 0.82)};
  --landing-shadow: 0 28px 60px #{rgba($brand-dark-bg, 0.28)};
  --landing-card-shadow: 0 16px 34px #{rgba($brand-dark-bg, 0.24)};
  --landing-chip-bg: #{rgba($brand-light, 0.08)};
  --landing-chip-text: #{$brand-primary};
  --landing-solid-bg: #{$brand-light};
  --landing-solid-text: #{$brand-dark-bg};
  --landing-solid-shadow: 0 18px 30px #{rgba($brand-dark-bg, 0.28)};
  --landing-ghost-bg: #{rgba($brand-light, 0.08)};
  --landing-ghost-text: #{$brand-dark-text};
  --landing-pill-border: #{rgba($brand-light, 0.12)};
  --landing-pill-bg: #{rgba($brand-light, 0.05)};
  --landing-pill-text: #{$brand-primary};
  --landing-panel-gradient-top: #{rgba($brand-light, 0.08)};
  --landing-panel-gradient-bottom: #{rgba($brand-light, 0.02)};
  --landing-panel-bg: #{rgba($brand-dark-bg, 0.56)};
  --landing-preview-card-border: #{rgba($brand-light, 0.12)};
  --landing-preview-card-bg: #{rgba($brand-dark-bg, 0.78)};
  --landing-preview-card-shadow: 0 22px 38px #{rgba($brand-dark-bg, 0.28)};
  --landing-accent-line: #{rgba($brand-primary, 0.55)};
  --landing-icon-bg: #{rgba($brand-primary, 0.16)};
  --landing-icon-color: #{$brand-primary};
  --landing-spot-accent: #{rgba($brand-primary, 0.18)};
  --landing-resource-link-bg: #{rgba($brand-light, 0.06)};
  --landing-resource-link-text: #{$brand-dark-text};
  --landing-resource-item-border: #{rgba($brand-light, 0.08)};
  --landing-resource-item-bg: #{rgba($brand-light, 0.04)};
  --landing-accent-text: #{$brand-primary};
  --landing-mesh-color: #{rgba($brand-light, 0.12)};
  --landing-hero-glow-1: #{rgba($brand-primary, 0.22)};
  --landing-hero-glow-2: #{rgba($brand-light, 0.08)};
  --landing-hero-start: #{rgba($brand-dark-bg, 0.96)};
  --landing-hero-end: #{rgba($dark-pill, 0.96)};
}

.hero {
  background:
    radial-gradient(circle at top left, var(--landing-hero-glow-1), transparent 34%),
    radial-gradient(circle at 82% 20%, var(--landing-hero-glow-2), transparent 20%),
    linear-gradient(145deg, var(--landing-hero-start), var(--landing-hero-end));
  box-shadow: var(--landing-shadow);
}

.hero__mesh {
  background: radial-gradient(circle, var(--landing-mesh-color), transparent 68%);
}

.hero__eyebrow,
.section-heading__eyebrow,
.resource-card__eyebrow,
.preview-panel__kicker {
  border-color: var(--landing-border-strong);
  background: var(--landing-chip-bg);
  color: var(--landing-chip-text);
}

.hero-title,
.hero-subtitle,
.preview-panel__copy h2,
.section-heading__title,
.feature-card__title,
.resource-card__title {
  color: var(--landing-heading);
}

.hero-button--solid {
  background: var(--landing-solid-bg);
  color: var(--landing-solid-text);
  box-shadow: var(--landing-solid-shadow);
}

.hero-button--ghost {
  background: var(--landing-ghost-bg);
  border-color: var(--landing-border-strong);
  color: var(--landing-ghost-text);
}

.hero-pill {
  border-color: var(--landing-pill-border);
  background: var(--landing-pill-bg);
  color: var(--landing-pill-text);
}

.preview-panel,
.feature-card,
.resource-card {
  background: var(--landing-surface);
  box-shadow: var(--landing-card-shadow);
}

.preview-panel {
  background:
    linear-gradient(
      180deg,
      var(--landing-panel-gradient-top),
      var(--landing-panel-gradient-bottom)
    ),
    var(--landing-panel-bg);
}

.preview-card {
  border-color: var(--landing-preview-card-border);
  background: var(--landing-preview-card-bg);
  box-shadow: var(--landing-preview-card-shadow);
}

.feature-card::before {
  background: linear-gradient(90deg, var(--landing-accent-line), transparent 65%);
}

.feature-card__icon {
  background: var(--landing-icon-bg);
  color: var(--landing-icon-color);
}

.resource-card--primary {
  background:
    radial-gradient(circle at top right, var(--landing-spot-accent), transparent 30%),
    var(--landing-surface-strong);
}

.resource-link {
  border-color: var(--landing-border-strong);
  background: var(--landing-resource-link-bg);
  color: var(--landing-resource-link-text);
}

.resource-list__item {
  border-color: var(--landing-resource-item-border);
}

.resource-list__title {
  color: var(--landing-accent-text);
}
/* codex-theme-override:end */
</style>

<template>
  <div>
    <section class="page-header">
      <div class="donate">
        <a
          :href="donateUrl"
          target="_blank"
          title="Donate"
        ><i
          class="fas fa-heart"
          style="color: red"
        /></a>
      </div>
      <div class="text-h1 project-name">
        {{ title }}
      </div>
      <div class="text-h2 project-tagline">
        {{ tagline }}
      </div>
      <q-btn
        type="a"
        :href="locationUrl"
        target="_blank"
        class="btn"
        label="View on GitHub"
        no-caps
        flat
      />
      <q-btn
        to="/docs"
        class="btn"
        label="Docs"
        no-caps
        flat
      />
      <q-btn
        to="/examples"
        class="btn"
        label="Examples"
        no-caps
        flat
      />
      <q-btn
        v-if="hasInteractiveDemo"
        to="/demo"
        class="btn"
        label="Interactive Demo"
        no-caps
        flat
      />
      <q-btn
        v-if="hasThemeBuilder"
        to="/theme-builder"
        class="btn"
        label="Theme Builder"
        no-caps
        flat
      />
      <q-btn
        type="a"
        :href="donateUrl"
        target="_blank"
        class="btn"
        label="Donate"
        no-caps
        flat
      />
      <div class="row justify-evenly items-center q-ma-sm">
        <div class="quasar">
          {{ quasarDesc }}
        </div>
        <div class="byline">
          {{ byline }} <a
            :href="bylineTwitter"
            target="_blank"
            title="Twitter"
          ><i class="fab fa-twitter" /></a>
        </div>
      </div>
    </section>
    <main class="flex flex-start justify-center inset-shadow">
      <div
        class="q-pa-md col-12-sm col-8-md col-6-lg inset-shadow"
        style="width: 100%; height: 3px;"
      />
      <div
        class="q-pa-md col-12-sm col-8-md col-6-lg shadow-1"
        style="max-width: 800px; width: 100%;"
      >
        <slot />
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'Hero',

  data () {
    return {
      title: 'QCalendar',
      tagline: 'Embeddable Calandar for your Quasar App',
      byline: 'Created and maintained by Jeff Galbraith',
      bylineTwitter: 'https://twitter.com/jgalbraith64',
      quasarDesc: 'A Quasar Framework Component and App Extension',
      locationUrl: 'https://github.com/quasarframework/quasar-ui-qcalendar',
      donateUrl: 'https://github.com/sponsors/hawkeye64',
      hasInteractiveDemo: true,
      hasThemeBuilder: true
    }
  }
}
</script>

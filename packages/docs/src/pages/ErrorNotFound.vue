<template>
  <div class="qpress-error-page markdown-technical fullscreen text-center q-pa-xl flex flex-center">
    <section class="qpress-error-page__content" aria-labelledby="qpress-error-title">
      <p class="qpress-error-page__eyebrow">Page Not Found</p>

      <h1 id="qpress-error-title" class="qpress-error-page__code">404</h1>

      <p class="qpress-error-page__message">
        The page you are looking for is not available in these docs.
      </p>

      <q-btn class="qpress-error-page__button q-mt-xl" unelevated to="/" label="Go Home" no-caps />
    </section>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'ErrorNotFound' })
</script>

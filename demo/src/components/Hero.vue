<template>
  <div>
    <section class="page-header">
      <div class="text-h1 project-name">QCalendar</div>
      <div class="text-h2 project-tagline"></div>
      <div class="byline">Created and maintained by Jeff Galbraith</div>
      <div class="quasar">A Quasar Framework Component and App Extension</div>
      <q-btn type="a" href="https://github.com/quasarframework/quasar-ui-qcalendar" target="_blank" class="btn" label="View on GitHub" no-caps flat/>
      <q-btn to="/docs" class="btn" label="Docs" no-caps flat/>
      <q-btn to="/examples" class="btn" label="Examples" no-caps flat/>
      <q-btn to="/demo" class="btn" label="Interactive Demo" no-caps flat/>
      <q-btn type="a" href="https://donate.quasar.dev" target="_blank" class="btn" label="Donate" no-caps flat/>
    </section>
    <main class="flex flex-start justify-center inset-shadow">
      <div class="q-pa-md col-12-sm col-8-md col-6-lg inset-shadow" style="width: 100%; height: 3px;" />
      <div class="q-pa-md col-12-sm col-8-md col-6-lg bg-white shadow-1" style="max-width: 800px; width: 100%;">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'Hero'
}
</script>

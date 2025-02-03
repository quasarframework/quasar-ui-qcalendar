<template>
  <div class="row justify-center">
    <div class="q-pa-md q-gutter-lg row">
      <q-btn no-caps dense @click="$emit('today')"> Today </q-btn>
      <q-btn no-caps dense @click="$emit('prev')"> &lt; Prev </q-btn>
      <q-btn no-caps dense @click="$emit('next')"> Next &gt; </q-btn>
    </div>
  </div>
</template>

<template>
  <div style="margin: 12px;">
    <div class="button-bar">
      <button
        class="button"
        style="margin: 2px;"
        @click="$emit('today')"
      >
        Today
      </button>
      <button
        class="button"
        style="margin: 2px;"
        @click="$emit('prev')"
      >
        &lt; Prev
      </button>
      <button
        class="button"
        style="margin: 2px;"
        @click="$emit('next')"
      >
        Next &gt;
      </button>
    </div>
  </div>
</template>

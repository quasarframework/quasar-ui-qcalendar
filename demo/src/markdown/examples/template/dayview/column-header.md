```
<template>
  <q-calendar
    v-model="selectedDate"
    :column-header-before="true"
    :column-header-after="true"
    view="day"
    locale="en-us"
    style="height: 400px;"
  >
    <template #columnHeaderBefore="day">
      <div class="q-ma-xs">
        columnHeaderBefore slot
      </div>
    </template>
    <template #columnHeaderAfter="day">
      <div class="q-ma-xs">
        columnHeaderAfter slot
      </div>
    </template>
  </q-calendar>
</template>
```
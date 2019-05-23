```
<template>
  <q-calendar
    v-model="selectedDate"
    :column-header-before="true"
    :column-header-after="true"
    view="week"
    locale="en-us"
    style="height: 400px;"
  >
    <template #columnHeaderBefore="days">
      <div class="q-ma-xs">
        Before
      </div>
    </template>
    <template #columnHeaderAfter="days">
      <div class="q-ma-xs">
        After
      </div>
    </template>
  </q-calendar>
</template>
```
```
<template>
  <q-calendar
    v-model="selectedDate"
    view="week"
    :short-interval-label="true"
    :hour24-format="true"
    locale="en-us"
    style="height: 400px;"
  />
</template>
```
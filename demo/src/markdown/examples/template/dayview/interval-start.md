```
<template>
  <q-calendar
    v-model="selectedDate"
    view="day"
    locale="en-us"
    :interval-start="8"
    :interval-count="10"
    style="height: 400px;"
  />
</template>
```
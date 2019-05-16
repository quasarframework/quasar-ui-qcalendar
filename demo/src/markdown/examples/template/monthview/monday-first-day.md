```
<template>
  <q-calendar
    v-model="selectedDate"
    :weekdays="[1, 2, 3, 4, 5, 6, 0]"
    view="month"
    locale="en-us"
    style="height: 400px;"
  />
</template>
```
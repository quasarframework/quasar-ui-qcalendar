```
<template>
  <q-calendar
    v-model="selectedDate"
    view="day"
    locale="en-us"
    :interval-minutes="15"
    style="height: 400px;"
  />
</template>
```
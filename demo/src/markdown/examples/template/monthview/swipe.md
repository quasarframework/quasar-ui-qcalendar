```
<template>
  <q-calendar
    ref="calendar"
    v-model="selectedDate"
    view="month"
    locale="en-us"
    v-touch-swipe.mouse.left.right="handleSwipe"
    :animated="true"
    transition-prev="slide-right"
    transition-next="slide-left"
    style="height: 400px;"
  />
</template>
```
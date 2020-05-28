<template>
  <div class="row justify-center q-pa-lg">
    <q-scroll-area
      style="height: 200px; max-width: 400px; width: 100%;"
    >
      <q-calendar
        v-model="selectedDate"
        view="month"
        locale="en-us"
        no-scroll
        bordered
        STYLE="height: 400px;"
      />
    </q-scroll-area>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectedDate: '2019-04-01'
    }
  }
}
</script>

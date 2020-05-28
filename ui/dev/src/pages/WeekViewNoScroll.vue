<template>
  <div class="row justify-center q-pa-lg">
    <q-scroll-area
      style="height: 400px; max-width: 600px; width: 100%;"
    >
      <q-calendar
        v-model="selectedDate"
        view="week"
        locale="en-us"
        no-scroll
        bordered
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

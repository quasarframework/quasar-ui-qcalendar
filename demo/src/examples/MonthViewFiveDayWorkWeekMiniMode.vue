<template>
  <q-splitter
    v-model="splitterModel"
    :limits="[50, 100]"
  >
    <template v-slot:before>
      <q-calendar
        ref="calendar"
        v-model="selectedDate"
        :weekdays="[1, 2, 3, 4, 5]"
        :mini-mode="miniMode"
        breakpoint="sm"
        view="month"
        locale="en-us"
      />
    </template>
    <template v-slot:separator>
      <q-avatar color="primary" text-color="white" size="40px" icon="drag_indicator" />
    </template>
    <template v-slot:after>
      <div style="min-width: 20px"></div>
    </template>
  </q-splitter>
</template>

<script>
export default {
  data () {
    return {
      splitterModel: 90, // start at 90%
      selectedDate: '',
      miniMode: false
    }
  },
  watch: {
    splitterModel (val) {
      const rect = this.$refs.calendar.$el.getBoundingClientRect()
      this.miniMode = rect.width < 500
    }
  }
}
</script>

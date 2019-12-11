<template>
  <q-splitter
    v-model="splitterModel"
    :limits="[50, 100]"
  >
    <template v-slot:before>
      <div style="overflow: auto">
        <q-calendar
          ref="calendar"
          v-model="selectedDate"
          view="month"
          :disabled-days="disabledDays"
          :mini-mode="miniMode"
          :day-style="modifiedStyle"
          locale="en-us"
        />
      </div>
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
      selectedDate: '2019-04-01',
      splitterModel: 90, // start at 90%
      miniMode: false,
      disabledDays: [
        '2019-04-02',
        '2019-04-03',
        '2019-04-04',
        '2019-04-05'
      ]
    }
  },
  watch: {
    splitterModel (val) {
      const rect = this.$refs.calendar.$el.getBoundingClientRect()
      this.miniMode = rect.width < 500
    }
  },
  methods: {
    modifiedStyle (scope) {
      if (scope.disabled === true) {
        return {
          backgroundColor: '#ffcb9c!important'
        }
      }
      return {}
    }
  }
}
</script>

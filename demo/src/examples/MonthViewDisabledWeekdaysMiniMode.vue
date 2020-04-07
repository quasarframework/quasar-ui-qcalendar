<template>
  <div style="max-width: 800px; width: 100%;">
    <q-splitter
      v-model="splitterModel"
      :limits="[30, 100]"
      emit-immediately
    >
    <template v-slot:before>
      <q-calendar
        ref="calendar"
        v-model="selectedDate"
        view="month"
        :disabled-weekdays="[1,5,6]"
        :mini-mode="miniMode"
        :day-style="modifiedStyle"
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectedDate: '2019-04-01',
      splitterModel: 90, // start at 90%
      miniMode: false
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
          backgroundColor: '#ffcb9c!important',
          cursor: 'not-allowed'
        }
      }
      return {}
    }
  }
}
</script>

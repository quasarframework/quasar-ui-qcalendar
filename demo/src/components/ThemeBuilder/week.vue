<template>
  <div>
    <div class="q-gutter-sm q-mb-sm">
      <q-checkbox v-model="noActiveDate" dense label="No active date" />
      <q-checkbox v-model="disabledDays" dense label="Disabled weekends" />
    </div>
    <q-calendar
      v-model="selectedDate"
      view="week"
      bordered
      :interval-minutes="15"
      :interval-count="96"
      :disabled-weekdays="disabledWeekdays"
      :no-active-date="noActiveDate"
      :interval-style="modifiedStyle"
      locale="en-us"
      style="height: 400px;"
      :style="styles"
    />
  </div>
</template>

<script>
export default {
  name: 'ThemeBuilderWeek',
  props: {
    value: String,
    styles: Object
  },
  data () {
    return {
      selectedDate: '',
      noActiveDate: false,
      disabledDays: false
    }
  },
  beforeMount () {
    this.selectedDate = this.value
  },

  watch: {
    value (val) {
      this.selectedDate = val
    }
  },

  computed: {
    disabledWeekdays () {
      return this.disabledDays === true ? [0, 6] : []
    }
  },

  methods: {
    modifiedStyle (scope) {
      if (scope.disabled === true) {
        return {
          cursor: 'not-allowed'
        }
      }
      return {}
    }
  }
}
</script>

<template>
  <div class="row justify-center full-width q-pa-md">
    <q-calendar
      ref="calendar"
      v-model="selectedDate"
      view="day-resource"
      :resources="resources"
      :resource-height="50"
      :locale="locale"
      style="height: 200px; max-width: 800px; width: 100%;"
    >
      <template #resource-header="scope">
        <div class="my-resource-header">
          {{ showDate(scope) }}
        </div>
      </template>
    </q-calendar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectedDate: '2019-04-01',
      locale: 'en-us',
      resources: [
        { label: 'John' },
        { label: 'Mary' },
        { label: 'Susan' },
        { label: 'Olivia' },
        { label: 'Board Room' },
        { label: 'Room-1' },
        { label: 'Room-2' }
      ]
    }
  },

  methods: {
    showDate (scope) {
      const date = new Date(scope.date)
      return this.monthFormatter().format(date)
    },

    monthFormatter () {
      try {
        return new Intl.DateTimeFormat(this.locale || void 0, {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          timeZone: 'UTC'
        })
      } catch (e) {
        //
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.my-resource-header
  display: flex
  flex-direction: row
  flex: 1
  justify-content: center
  align-items: center
  position: relative
  font-size: 10px
  font-weight: 700
</style>

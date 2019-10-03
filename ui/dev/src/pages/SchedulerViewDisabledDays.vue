<template>
  <q-calendar
    v-model="selectedDate"
    view="scheduler"
    :resources="resources"
    :disabled-days="disabledDays"
    :resource-style="modifiedStyle"
    locale="en-us"
    style="height: 400px;"
  />
</template>

<script>
export default {
  data () {
    return {
      selectedDate: '2019-04-01',
      disabledDays: [
        '2019-04-02',
        '2019-04-03',
        '2019-04-04',
        '2019-04-05'
      ],
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
    modifiedStyle (scope) {
      if (scope.day.disabled === true) {
        return {
          backgroundColor: '#ffcb9c!important'
        }
      }
      return {}
    }
  }
}
</script>

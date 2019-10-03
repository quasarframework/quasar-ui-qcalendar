<template>
  <q-calendar
    v-model="selectedDate"
    view="scheduler"
    :resources="resources"
    :resource-width="160"
    locale="en-us"
    style="height: 500px;"
  >
    <template #scheduler-resource="{ resource, index }">
      <div class="col-12">
        <q-btn flat class="fit" :icon="getResourceImage(resource)" :label="resource.label"/>
      </div>
    </template>
  </q-calendar>
</template>

<script>
export default {
  data () {
    return {
      selectedDate: '2019-04-08',
      resources: [
        { label: 'John', avatar: 'https://cdn.quasar.dev/img/avatar4.jpg' },
        { label: 'Mary', avatar: 'https://cdn.quasar.dev/img/avatar2.jpg' },
        { label: 'Susan', avatar: 'https://cdn.quasar.dev/img/avatar1.jpg' },
        { label: 'Olivia', avatar: 'https://cdn.quasar.dev/img/avatar6.jpg' },
        { label: 'Board Room', icon: 'meeting_room' },
        { label: 'Room-1', icon: 'meeting_room' },
        { label: 'Room-2', icon: 'meeting_room' }
      ]
    }
  },

  methods: {
    getResourceImage (resource) {
      if (resource.icon) {
        return resource.icon
      }
      if (resource.avatar) {
        return 'img:' + resource.avatar
      }
      return ''
    }
  }
}
</script>

<style lang="stylus">
img.q-icon.on-left
  border-radius 50%
</style>

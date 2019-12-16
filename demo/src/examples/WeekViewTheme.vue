<template>
  <div class="col-12">
    <div class="col-12 full-width q-pa-md">
      <q-select
        outlined
        dense
        emit-value
        map-options
        label="Change theme"
        v-model="theme"
        :options="themesList"
        class="col-12"
      ></q-select>
    </div>
    <q-separator></q-separator>
    <q-calendar
      v-model="selectedDate"
      view="week"
      locale="en-us"
      enable-theme
      :theme="theme"
    />
  </div>
</template>

<script>
import themes from '../statics/themes.js'

export default {
  data () {
    return {
      selectedDate: '',
      theme: {},
      themes
    }
  },
  computed: {
    themesList () {
      const list = []
      this.themes.forEach((theme) => {
        list.push({
          label: theme.name,
          value: { ...theme }
        })
      })
      return list
    }
  }
}
</script>

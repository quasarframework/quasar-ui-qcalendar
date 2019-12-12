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
          locale="en-us"
          enable-theme
          :theme="theme"
          :mini-mode="miniMode"
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
import themes from '../statics/themes.js'

export default {
  data () {
    return {
      splitterModel: 90,
      miniMode: false,
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
  },
  watch: {
    splitterModel (val) {
      const rect = this.$refs.calendar.$el.getBoundingClientRect()
      this.miniMode = rect.width < 500
    }
  }
}
</script>

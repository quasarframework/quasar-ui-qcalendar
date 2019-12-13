<template>
  <div class="q-pa-md row justify-evenly q-gutter-sm">
    <q-input color="blue-8" filled v-model="selectedDate" label="Enter date" mask="####-##-##">
      <template v-slot:append>
        <q-icon name="far fa-calendar" class="cursor-pointer">
          <q-popup-proxy v-model="showDatePicker" anchor="top right" self="bottom middle">
            <q-calendar
              v-model="selectedDate"
              view="month"
              :mini-mode="true"
              locale="en-us"
              style="height: 300px;"
              v-close-popup
            />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script>
import Vue from 'vue'

const QCalendarPicker = Vue.extend({
  name: 'QCalendarPicker',
  props: [],
  render (h) {
    h('q-card', {

    })
  }
})
export default {
  data () {
    return {
      selectedDate: '',
      showDatePicker: false
    }
  }
}
</script>

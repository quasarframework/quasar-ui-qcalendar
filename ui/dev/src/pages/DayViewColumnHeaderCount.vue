<template>
  <div style="max-width: 800px; width: 100%;">
    <q-calendar
      v-model="selectedDate"
      :column-header-after="true"
      :column-count="3"
      view="day"
      locale="en-us"
      style="height: 400px;"
    >
      <template #column-header-after="data">
        <div class="q-ma-xs">
          <q-item v-if="data.index === 0" clickable v-ripple>
            <q-item-section side>
              <q-avatar size="42px">
                <img src="https://cdn.quasar.dev/img/avatar1.jpg" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>Mary</q-item-label>
              <q-item-label caption>Content Writer</q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="data.index === 1" clickable v-ripple>
            <q-item-section side>
              <q-avatar size="42px">
                <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>Jessica</q-item-label>
              <q-item-label caption>Designer</q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="data.index === 2" clickable v-ripple>
            <q-item-section side>
              <q-avatar size="42px">
                <img src="https://cdn.quasar.dev/img/avatar4.jpg" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>Scott</q-item-label>
              <q-item-label caption>Software Developer</q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </template>
    </q-calendar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectedDate: ''
    }
  }
}
</script>

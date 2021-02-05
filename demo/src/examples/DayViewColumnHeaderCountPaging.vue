<template>
  <div style="max-width: 800px; width: 100%;">
    <div class="row justify-center items-center">
      <q-btn
        flat
        dense
        label="Prev"
        @click="calendarPrev"
      />
      <q-separator vertical />
      <q-btn
        flat
        dense
        label="Next"
        @click="calendarNext"
      />
    </div>
    <q-separator />
    <q-calendar
      v-model="selectedDate"
      column-header-after
      :column-count="columnCount"
      :column-index-start="columnIndexStart"
      view="day"
      locale="en-us"
      style="height: 400px;"
    >
      <template #column-header-after="{ /* timestamp, */ index }">
        <div class="q-ma-xs">
          <q-item
            v-if="index === 0"
            v-ripple
            clickable
          >
            <q-item-section side>
              <q-avatar size="42px">
                <img src="https://cdn.quasar.dev/img/avatar1.jpg">
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>Mary</q-item-label>
              <q-item-label caption>
                Content Writer
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            v-if="index === 1"
            v-ripple
            clickable
          >
            <q-item-section side>
              <q-avatar size="42px">
                <img src="https://cdn.quasar.dev/img/avatar2.jpg">
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>Jessica</q-item-label>
              <q-item-label caption>
                Designer
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            v-if="index === 2"
            v-ripple
            clickable
          >
            <q-item-section side>
              <q-avatar size="42px">
                <img src="https://cdn.quasar.dev/img/avatar4.jpg">
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>Scott</q-item-label>
              <q-item-label caption>
                Software Developer
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            v-if="index === 3"
            v-ripple
            clickable
          >
            <q-item-section side>
              <q-avatar size="42px">
                <img src="https://cdn.quasar.dev/img/avatar3.jpg">
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>Elaine</q-item-label>
              <q-item-label caption>
                Support Engineer
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            v-if="index === 4"
            v-ripple
            clickable
          >
            <q-item-section side>
              <q-avatar size="42px">
                <img src="https://cdn.quasar.dev/img/avatar5.jpg">
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>Carol</q-item-label>
              <q-item-label caption>
                Content Analyst
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            v-if="index === 5"
            v-ripple
            clickable
          >
            <q-item-section side>
              <q-avatar size="42px">
                <img src="https://cdn.quasar.dev/img/avatar6.jpg">
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>Heather</q-item-label>
              <q-item-label caption>
                Team Lead
              </q-item-label>
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
      selectedDate: '',
      columnCount: 3,
      totalPages: 2,
      currentPage: 0
    }
  },
  computed: {
    columnIndexStart () {
      return this.currentPage * this.columnCount
    }
  },
  methods: {
    calendarNext () {
      if (this.currentPage + 1 === this.totalPages) return
      ++this.currentPage
    },
    calendarPrev () {
      if (this.currentPage === 0) return
      --this.currentPage
    }
  }
}
</script>

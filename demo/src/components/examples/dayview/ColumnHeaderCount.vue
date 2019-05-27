<template>
  <div>
    <q-expansion-item
      group="someGroup"
      caption="Code"
    >
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="left"
          narrow-indicator
        >
          <q-tab name="template" label="Template" />
          <q-tab name="script" label="Script" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="template">
            <q-markdown :src="template" />
          </q-tab-panel>

          <q-tab-panel name="script">
            <q-markdown :src="script" />
          </q-tab-panel>

        </q-tab-panels>
      </q-card>
    </q-expansion-item>
    <q-separator />
    <q-calendar
      v-model="selectedDate"
      :column-header-after="true"
      :column-count="3"
      view="day"
      locale="en-us"
      style="height: 400px;"
    >
      <template #columnHeaderAfter="day">
        <div class="q-ma-xs">
          <q-item v-if="day.index === 0" clickable v-ripple>
            <q-item-section side>
              <q-avatar round size="42px">
                <img src="https://cdn.quasar.dev/img/avatar1.jpg" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>Mary</q-item-label>
              <q-item-label caption>Content Writer</q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="day.index === 1" clickable v-ripple>
            <q-item-section side>
              <q-avatar round size="42px">
                <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>Jessica</q-item-label>
              <q-item-label caption>Designer</q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="day.index === 2" clickable v-ripple>
            <q-item-section side>
              <q-avatar round size="42px">
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
import template from '../../../markdown/examples/template/dayview/column-header-count.md'
import script from '../../../markdown/examples/script/dayview/column-header-count.md'

export default {
  data () {
    return {
      tab: 'template',
      selectedDate: '2019-04-01',
      template: template,
      script: script
    }
  }
}
</script>

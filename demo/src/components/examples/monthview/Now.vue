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
      view="month"
      now
      locale="en-us"
      style="height: 400px;"
    />
  </div>
</template>

<script>
import template from '../../../markdown/examples/template/monthview/now.md'
import script from '../../../markdown/examples/script/monthview/now.md'

export default {
  name: 'MonthViewDefault',

  data () {
    return {
      tab: 'template',
      selectedDate: '',
      template: template,
      script: script
    }
  }
}
</script>

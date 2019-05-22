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
    <div style="overflow: auto">
      <q-calendar
        v-model="selectedDate"
        view="month"
        :day-height="100"
        locale="en-us"
        style="height: 400px;"
      />
    </div>
  </div>
</template>

<script>
import template from '../../../markdown/examples/template/monthview/day-height.md'
import script from '../../../markdown/examples/script/monthview/day-height.md'

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

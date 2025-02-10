<template>
  <div class="q-mr-xs q-mb-xs q-px-sm planner-item">
    <div style="display: flex; align-items: center; justify-content: start; flex-wrap: nowrap">
      <div style="max-width: 25px; min-width: 25px">
        <div :style="userIconStyle">
          <CheckboxChecked v-if="modelValue === true" @click.stop.prevent="onClicked" />
          <Checkbox v-else @click.stop.prevent="onClicked" />
        </div>
      </div>
      <div class="ellipsis" :style="userStyle" @click.stop.prevent="onClicked">
        {{ name }}
      </div>
    </div>

    <div style="display: flex; align-items: center; justify-content: start; flex-wrap: nowrap">
      <div style="max-width: 25px; min-width: 25px">
        <Location />
      </div>
      <div class="ellipsis col">{{ address }}</div>
    </div>

    <div style="display: flex; align-items: center; justify-content: start; flex-wrap: nowrap">
      <div style="max-width: 25px; min-width: 25px">
        <Email />
      </div>
      <div class="ellipsis col">{{ email }}</div>
    </div>

    <div style="display: flex; align-items: center; justify-content: start; flex-wrap: nowrap">
      <div style="max-width: 25px; min-width: 25px">
        <Phone />
      </div>
      <div class="ellipsis col">{{ phone }}</div>
    </div>

    <div style="display: flex; align-items: center; justify-content: start; flex-wrap: nowrap">
      <div style="max-width: 25px; min-width: 25px">
        <Construction />
      </div>
      <div class="ellipsis col">{{ workDone }}</div>
    </div>

    <div style="display: flex; align-items: center; justify-content: start; flex-wrap: nowrap">
      <div style="max-width: 25px; min-width: 25px">
        <Calendar />
      </div>
      <div class="ellipsis col">{{ workDate }}</div>
    </div>

    <div style="display: flex; align-items: center; justify-content: start; flex-wrap: nowrap">
      <div style="max-width: 25px; min-width: 25px">
        <CurrencyDollar />
      </div>
      <div class="ellipsis col">{{ amount }}</div>
    </div>

    <div style="display: flex; align-items: center; justify-content: start; flex-wrap: nowrap">
      <div :style="overdueIconStyle">
        <Alarm />
      </div>
      <div class="ellipsis" :style="overdueStyle">{{ daysOver }} days overdue</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQuasar } from 'quasar'
import Checkbox from '@carbon/icons-vue/es/checkbox/16'
import CheckboxChecked from '@carbon/icons-vue/es/checkbox--checked/16'
import Location from '@carbon/icons-vue/es/location/16'
import Email from '@carbon/icons-vue/es/email/16'
import Phone from '@carbon/icons-vue/es/phone/16'
import Construction from '@carbon/icons-vue/es/construction/16'
import Calendar from '@carbon/icons-vue/es/calendar/16'
import CurrencyDollar from '@carbon/icons-vue/es/currency--dollar/16'
import Alarm from '@carbon/icons-vue/es/alarm/16'

const props = defineProps({
  name: String,
  address: String,
  email: String,
  phone: String,
  workDone: String,
  workDate: String,
  amount: String,
  daysOver: Number,
})

const modelValue = defineModel()

const $q = useQuasar()

const overdueIconStyle = computed(() => ({
  color: props.daysOver === 0 ? 'inherit' : userRedStyle.value,
  'max-width': '25px',
  'min-width': '25px',
}))

const userRedStyle = computed(() => ($q.dark.isActive ? '#ff8a80' : 'red'))

const userBlueStyle = computed(() => ($q.dark.isActive ? '#82b1ff' : 'blue'))

const overdueStyle = computed(() => ({
  color: props.daysOver === 0 ? 'inherit' : userRedStyle.value,
}))

const userIconStyle = computed(() => {
  return {
    color: modelValue.value ? userRedStyle.value : userBlueStyle.value,
    cursor: 'pointer',
  }
})

const userStyle = computed(() => {
  return {
    color: modelValue.value ? userRedStyle.value : userBlueStyle.value,
  }
})

function onClicked() {
  console.info('onClicked')
  modelValue.value = !modelValue.value
}
</script>

<style lang="scss" scoped>
.planner-item {
  border: 1px solid transparent;
  box-shadow:
    0 1px 5px rgb(0 0 0 / 20%),
    0 2px 2px rgb(0 0 0 / 14%),
    0 3px 1px -2px rgb(0 0 0 / 12%);
  border-radius: 4px;
  vertical-align: top;
  padding: 2px;
  margin: 2px;
  margin-bottom: 4px;
  font-size: 12px;

  &:hover {
    border: 1px solid rgba(0, 140, 200, 0.8);
  }
}

body.body--dark {
  .planner-item {
    box-shadow:
      0 1px 5px rgb(255 255 255 / 20%),
      0 2px 2px rgb(255 255 255 / 14%),
      0 3px 1px -2px rgb(255 255 255 / 12%);
  }
}
</style>

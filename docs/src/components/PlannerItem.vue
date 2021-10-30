<template>
  <div class="q-mr-xs q-mb-xs q-px-sm planner-item">
    <div style="display: flex; align-items: center; justify-content: start; flex-wrap: nowrap;">
      <div style="max-width: 25px; min-width: 25px;">
        <CheckboxChecked
          v-if="modelValue === true"
          :style="userIconStyle"
          @clicked.stop.prevent="onClicked"
        />
        <Checkbox
          v-else
          :style="userIconStyle"
          @clicked.stop.prevent="onClicked"
        />
      </div>
      <div
        class="ellipsis"
        :style="userStyle"
      >
        {{ name }}
      </div>
    </div>

    <div style="display: flex; align-items: center; justify-content: start; flex-wrap: nowrap;">
      <div style="max-width: 25px; min-width: 25px;">
        <Location />
      </div>
      <div class="ellipsis col">{{ address }}</div>
    </div>

    <div style="display: flex; align-items: center; justify-content: start; flex-wrap: nowrap;">
      <div style="max-width: 25px; min-width: 25px;">
        <Email />
      </div>
      <div class="ellipsis col">{{ email }}</div>
    </div>

    <div style="display: flex; align-items: center; justify-content: start; flex-wrap: nowrap;">
      <div style="max-width: 25px; min-width: 25px;">
        <Phone />
      </div>
      <div class="ellipsis col">{{ phone }}</div>
    </div>

    <div style="display: flex; align-items: center; justify-content: start; flex-wrap: nowrap;">
      <div style="max-width: 25px; min-width: 25px;">
        <Construction />
      </div>
      <div class="ellipsis col">{{ workDone }}</div>
    </div>

    <div style="display: flex; align-items: center; justify-content: start; flex-wrap: nowrap;">
      <div style="max-width: 25px; min-width: 25px;">
        <Calendar />
      </div>
      <div class="ellipsis col">{{ workDate }}</div>
    </div>

    <div style="display: flex; align-items: center; justify-content: start; flex-wrap: nowrap;">
      <div style="max-width: 25px; min-width: 25px;">
        <CurrencyDollar />
      </div>
      <div class="ellipsis col">{{ amount }}</div>
    </div>

    <div style="display: flex; align-items: center; justify-content: start; flex-wrap: nowrap;">
      <div
        :style="overdueIconStyle"
      >
        <Alarm />
      </div>
      <div
        class="ellipsis"
        :style="overdueStyle"
      >
        {{ daysOver }} days overdue
      </div>
    </div>
  </div>
</template>

<script>
import Checkbox from '@carbon/icons-vue/es/checkbox/16'
import CheckboxChecked from '@carbon/icons-vue/es/checkbox--checked/16'
import Location from '@carbon/icons-vue/es/location/16'
import Email from '@carbon/icons-vue/es/email/16'
import Phone from '@carbon/icons-vue/es/phone/16'
import Construction from '@carbon/icons-vue/es/construction/16'
import Calendar from '@carbon/icons-vue/es/calendar/16'
import CurrencyDollar from '@carbon/icons-vue/es/currency--dollar/16'
import Alarm from '@carbon/icons-vue/es/alarm/16'

export default {
  name: 'PlannerItem',

  components: {
    Checkbox,
    CheckboxChecked,
    Location,
    Email,
    Phone,
    Construction,
    Calendar,
    CurrencyDollar,
    Alarm
  },

  props: {
    modelValue: Boolean,
    name: String,
    address: String,
    email: String,
    phone: String,
    workDone: String,
    workDate: String,
    amount: String,
    daysOver: Number
  },

  emits: [
    'update:model-value'
  ],

  computed: {
    overdueIconStyle () {
      return {
        color: (this.daysOver === 0 ? 'inherit' : 'red'),
        'max-width': '25px',
        'min-width': '25px'
      }
    },
    overdueStyle () {
      return {
        color: (this.daysOver === 0 ? 'inherit' : 'red')
      }
    },
    userIconStyle () {
      return {
        color: this.modelValue === true ? 'red' : 'blue',
        cursor: 'pointer'
      }
    },
    userStyle () {
      return {
        color: this.modelValue === true ? 'red' : 'blue'
      }
    }
  },
  watch: {
    modelValue (val) {
      // console.log('modelValue:', val)
    }
  },
  methods: {
    onClicked () {
      this.$emit('update:model-value', !this.modelValue)
    }
  }
}
</script>

<style lang="sass" scoped>
.planner-item
  border: 1px solid transparent
  box-shadow: 0 1px 5px rgb(0 0 0 / 20%), 0 2px 2px rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%)
  border-radius: 4px
  vertical-align: top
  background: #fff
  padding: 2px
  margin: 2px
  margin-bottom: 4px
  font-size: 12px

  &:hover
    border: 1px solid rgba(0,140,200,.8)
</style>

<template>
  <q-card class="q-mr-xs q-mb-xs q-px-sm">
    <div class="row items-center justify-start">
      <div class="col" style="max-width: 30px; width: 100%">
        <q-icon :name="value ? 'check_box' : 'check_box_outline_blank'" :class="'cursor-pointer' + (value ? ' text-red-8' : ' text-blue-8')" @click="$emit('input', !value)" />
      </div>
      <div :class="'ellipsis col-grow' + (value ? ' text-red-8' : ' text-blue-8')">{{ name }}</div>
    </div>
    <div class="row items-center justify-start">
      <div class="col" style="max-width: 30px; width: 100%">
        <q-icon name="location_on" />
      </div>
      <div class="ellipsis col-grow">{{ address }}</div>
    </div>
    <div class="row items-center justify-start">
      <div class="col" style="max-width: 30px; width: 100%">
        <q-icon name="mail_outline" />
      </div>
      <div class="ellipsis col-grow">{{ email }}</div>
    </div>
    <div class="row items-center justify-start">
      <div class="col" style="max-width: 30px; width: 100%">
        <q-icon name="call" />
      </div>
      <div class="ellipsis col-grow">{{ phone }}</div>
    </div>
    <div class="row items-center justify-start">
      <div class="col" style="max-width: 30px; width: 100%">
        <q-icon name="work" />
      </div>
      <div class="ellipsis col-grow">{{ workDone }}</div>
    </div>
    <div class="row items-center justify-start">
      <div class="col" style="max-width: 30px; width: 100%">
        <q-icon name="calendar_today" />
      </div>
      <div class="ellipsis col-grow">{{ workDate }}</div>
    </div>
    <div class="row items-center justify-start">
      <div class="col" style="max-width: 30px; width: 100%">
        <q-icon name="attach_money" />
      </div>
      <div class="ellipsis col-grow">{{ amount }}</div>
    </div>
    <div v-if="daysOver" class="row items-center justify-start">
      <div class="col text-red-8" style="max-width: 30px; width: 100%">
        <q-icon name="access_alarm" />
      </div>
      <div class="ellipsis col-grow text-red-8">{{ daysOver }} days overdue</div>
    </div>
  </q-card>
</template>

<script>
export default {
  name: 'PlannerItem',

  props: {
    value: Boolean,
    name: String,
    address: String,
    email: String,
    phone: String,
    workDone: String,
    workDate: String,
    amount: String,
    daysOver: Number
  },

  data () {
    return {}
  }
}
</script>

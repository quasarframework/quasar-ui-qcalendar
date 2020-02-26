<template>
  <q-card class="q-mr-xs q-mb-xs q-px-sm planner-item">

    <div class="row items-center justify-start no-wrap">
      <div class="col" style="max-width: 25px; min-width: 25px;">
        <q-icon :name="value ? 'check_box' : 'check_box_outline_blank'" :class="'cursor-pointer' + (value ? ' text-red-8' : ' text-blue-8')" @click.stop.prevent="$emit('input', !value)" />
      </div>
      <div :class="'ellipsis col' + (value ? ' text-red-8' : ' text-blue-8')">{{ name }}</div>
    </div>

    <div class="row items-center justify-start no-wrap">
      <div class="col" style="max-width: 25px; min-width: 25px;">
        <q-icon name="location_on" />
      </div>
      <div class="ellipsis col">{{ address }}</div>
    </div>

    <div class="row items-center justify-start no-wrap">
      <div class="col" style="max-width: 25px; min-width: 25px;">
        <q-icon name="mail_outline" />
      </div>
      <div class="ellipsis col">{{ email }}</div>
    </div>

    <div class="row items-center justify-start no-wrap">
      <div class="col" style="max-width: 25px; min-width: 25px;">
        <q-icon name="call" />
      </div>
      <div class="ellipsis col">{{ phone }}</div>
    </div>

    <div class="row items-center justify-start no-wrap">
      <div class="col" style="max-width: 25px; min-width: 25px;">
        <q-icon name="work" />
      </div>
      <div class="ellipsis col">{{ workDone }}</div>
    </div>

    <div class="row items-center justify-start no-wrap">
      <div class="col" style="max-width: 25px; min-width: 25px;">
        <q-icon name="calendar_today" />
      </div>
      <div class="ellipsis col">{{ workDate }}</div>
    </div>

    <div class="row items-center justify-start no-wrap">
      <div class="col" style="max-width: 25px; min-width: 25px;">
        <q-icon name="attach_money" />
      </div>
      <div class="ellipsis col">{{ amount }}</div>
    </div>

    <div v-if="daysOver" class="row items-center justify-start no-wrap">
      <div class="col text-red-8" style="max-width: 25px; min-width: 25px;">
        <q-icon name="access_alarm" />
      </div>
      <div class="ellipsis col text-red-8">{{ daysOver }} days overdue</div>
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

<style lang="sass" scoped>
.planner-item
  border: 1px solid transparent
  &:hover
    border: 1px solid $blue-8
    cursor: pointer
</style>

<template>
  <div class="calendar-adapter-title">
    <span class="calendar-adapter-title__calendar">{{ calendarLabel }}</span>
    <strong class="calendar-adapter-title__month" :dir="direction">
      {{ monthTitle }}
    </strong>
    <small v-if="rangeLabel" class="calendar-adapter-title__range" dir="ltr">
      <span>{{ nativeRangeLabel }}</span>
      <span v-if="gregorianRangeLabel">{{ gregorianRangeLabel }}</span>
    </small>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    calendarLabel: string
    monthTitle: string
    rangeLabel?: string
    direction?: 'ltr' | 'rtl'
  }>(),
  {
    direction: 'ltr',
    rangeLabel: '',
  },
)

const rangeParts = computed(() => {
  const match = props.rangeLabel.match(/^(.*?)\s*(\(.+\))$/)

  if (match === null) {
    return {
      native: props.rangeLabel,
      gregorian: '',
    }
  }

  return {
    native: match[1]?.trim() ?? '',
    gregorian: match[2] ?? '',
  }
})

const nativeRangeLabel = computed(() => rangeParts.value.native)
const gregorianRangeLabel = computed(() => rangeParts.value.gregorian)
</script>

<style lang="scss" scoped>
.calendar-adapter-title {
  display: grid;
  justify-items: center;
  gap: 2px;
  text-align: center;
}

.calendar-adapter-title__calendar {
  color: color-mix(in srgb, currentColor 68%, transparent);
  font-size: 0.78rem;
  font-weight: 700;
}

.calendar-adapter-title__month {
  font-size: 1.08rem;
  line-height: 1.2;
  unicode-bidi: isolate;
}

.calendar-adapter-title__range {
  display: grid;
  justify-items: center;
  color: color-mix(in srgb, currentColor 62%, transparent);
  font-size: 0.78rem;
  unicode-bidi: isolate;
}
</style>

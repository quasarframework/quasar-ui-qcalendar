<template>
  <div class="row full-width q-pa-xs rounded-borders relative-position" style="border: 2px solid rgba(25,118,210,.65);">
    <q-scroll-area class="col" style="max-width: 180px; width: 100%; max-height: 300px;">
      <q-list dense>
        <q-item
          v-for="type in types"
          :key="type.name"
          clickable
          :active="selected.name === type.name"
          @click="updateSelection(type)"
        >
          <q-item-section>
            {{ type.name }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>

    <div class="col">
      <q-calendar-month
        id="calendar-month-mini-mode"
        ref="calendar"
        bordered
        mini-mode
        show-work-weeks
        show-day-of-year-label
        style="height: 200px; max-width: 300px;"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, watch, onMounted } from 'vue'
import { QCalendarMonth } from '@quasar/quasar-ui-qcalendar'
import '@quasar/quasar-ui-qcalendar/src/index.sass'

export default defineComponent({
  name: 'QCalendarMonthMiniModeAnatomy',
  components: {
    QCalendarMonth
  },
  setup () {
    const calendar = ref(null)
    const types = reactive([
      {
        name: 'Head',
        class: 'q-calendar-month__head'
      },
      {
        name: 'Head Workweek',
        class: 'q-calendar-month__head--workweek'
      },
      {
        name: 'Workweek',
        class: 'q-calendar-month__workweek'
      },
      {
        name: 'Head Weekdays',
        class: 'q-calendar-month__head--weekdays'
      },
      {
        name: 'Head Weekday',
        class: 'q-calendar-month__head--weekday'
      },
      {
        name: 'Head Day Event',
        class: 'q-calendar-month__head--event'
      },
      {
        name: 'Week',
        class: 'q-calendar-month__week--wrapper'
      },
      {
        name: 'Week Days',
        class: 'q-calendar-month__week--days'
      },
      {
        name: 'Day',
        class: 'q-calendar-month__day'
      },
      {
        name: 'Day Label Wrapper',
        class: 'q-calendar-month__day--label__wrapper'
      },
      {
        name: 'Day Label',
        class: 'q-calendar-month__day--label'
      },
      {
        name: 'Day Content',
        class: 'q-calendar-month__day--content'
      },
      {
        name: 'Body',
        class: 'q-calendar-month__body'
      }
    ])
    const selected = ref(types[ 0 ])
    const el = ref(null)

    watch(() => selected.value, (current, prev) => {
      removeClass(prev)
      addClass(current)
    })

    onMounted(() => {
      el.value = document.getElementById('calendar-month-mini-mode')
      setTimeout(() => {
        addClass(selected.value)
      }, 350)
    })

    function updateSelection (type) {
      selected.value = type
    }

    function addClass (type) {
      if (type.class !== undefined) {
        const els = el.value.querySelectorAll('.' + type.class)
        if (els && els.length > 0) {
          els.forEach(el => {
            el.classList.add('highlight')
          })
        }
      }
    }

    function removeClass (type) {
      const els = el.value.querySelectorAll('.highlight')
      if (els && els.length > 0) {
        els.forEach(el => {
          el.classList.remove('highlight')
        })
      }
    }

    return {
      calendar,
      selected,
      types,
      updateSelection
    }
  }
})
</script>

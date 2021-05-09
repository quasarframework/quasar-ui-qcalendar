<template>
  <div class="row full-width q-pa-xs rounded-borders" style="border: 2px solid rgba(25,118,210,.65);">
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
      <q-calendar-resource
        id="calendar-resource"
        ref="calendar"
        bordered
        v-model:modelResources="resources"
        resource-key="id"
        resource-label="name"
        style="height: 300px;"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, watch, onMounted } from 'vue'
import { QCalendarResource } from '@quasar/quasar-ui-qcalendar/src/QCalendarResource.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarResource.sass'

export default defineComponent({
  name: 'QCalendarResourceAnatomy',
  components: {
    QCalendarResource
  },
  setup () {
    const calendar = ref(null)
    const types = reactive([
      {
        name: 'Head',
        class: 'q-calendar-resource__head'
      },
      {
        name: 'Head Resources',
        class: 'q-calendar-resource__head--resources'
      },
      {
        name: 'Head Intervals',
        class: 'q-calendar-resource__head--intervals'
      },
      {
        name: 'Head Interval',
        class: 'q-calendar-resource__head--interval'
      },
      {
        name: 'Body',
        class: 'q-calendar-resource__body'
      },
      {
        name: 'Container',
        class: 'q-calendar-resource__day--container'
      },
      {
        name: 'Resources Body',
        class: 'q-calendar-resource__resources--body'
      },
      {
        name: 'Resource Row',
        class: 'q-calendar-resource__resource--row'
      },
      {
        name: 'Resource',
        class: 'q-calendar-resource__resource'
      },
      {
        name: 'Resource Section',
        class: 'q-calendar-resource__resource--section'
      },
      {
        name: 'Parent',
        class: 'q-calendar__parent'
      },
      {
        name: 'Child',
        class: 'q-calendar__child'
      },
      {
        name: 'Resource Text',
        class: 'q-calendar-resource__resource--text'
      },
      {
        name: 'Resource Intervals',
        class: 'q-calendar-resource__resource--intervals'
      },
      {
        name: 'Resource Interval',
        class: 'q-calendar-resource__resource--interval'
      }
    ])
    const selected = ref(types[ 0 ])
    const el = ref(null)
    const resources = reactive([
      { id: '1', name: 'John' },
      {
        id: '2',
        name: 'Board Room',
        expanded: false,
        children: [
          { id: '2.1', name: 'Room-1' },
          {
            id: '2.2',
            name: 'Room-2',
            expanded: false,
            children: [
              { id: '2.2.1', name: 'Partition-A' },
              { id: '2.2.2', name: 'Partition-B' },
              { id: '2.2.2', name: 'Partition-C' }
            ]
          }
        ]
      },
      { id: '3', name: 'Mary' },
      { id: '4', name: 'Susan' },
      { id: '5', name: 'Olivia' }
    ])


    watch(() => selected.value, (current, prev) => {
      removeClass(prev)
      addClass(current)
    })

    onMounted(() => {
      el.value = document.getElementById('calendar-resource')
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
      updateSelection,
      resources
    }
  }
})
</script>

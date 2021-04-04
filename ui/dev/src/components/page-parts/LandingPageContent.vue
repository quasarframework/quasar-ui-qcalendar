<template>
  <div class="q-px-lg q-pb-md">
    <q-timeline :layout="layout" color="secondary">

      <q-timeline-entry heading>
        <div style="font-size: 32px; font-weight: 600;">QCalendar</div>
        <div style="font-size: 16px;">Build Beautiful, Responsive Calendars</div>
      </q-timeline-entry>

      <q-timeline-entry
        title="QCalendarDay"
        subtitle="Show as many days as you want"
        side="left"
      >
        <div>
          <q-intersection
            transition="scale"
            once
          >
            <q-img
              src="\QCalendarDay.png"
              spinner-color="white"
              style="max-width: 350px"
              class="shadow-12"
            />
          </q-intersection>
        </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="QCalendarMonth"
        side="right"
      >
        <div>
          <q-intersection
            transition="scale"
            once
          >
            <q-img
              src="\QCalendarMonth.png"
              spinner-color="white"
              style="max-width: 350px"
              class="shadow-12"
            />
          </q-intersection>
        </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="QCalendarMonth (mini-mode)"
        side="left"
      >
        <div>
          <q-intersection
            transition="scale"
            once
          >
            <q-img
              src="\QCalendarMonth--mini-mode.png"
              spinner-color="white"
              style="max-width: 350px"
              class="shadow-12"
            />
          </q-intersection>
        </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="QCalendarAgenda"
        side="right"
      >
        <div>
          <q-intersection
            transition="scale"
            once
          >
            <q-img
              src="\QCalendarAgenda.png"
              spinner-color="white"
              style="max-width: 350px"
              class="shadow-12"
            />
          </q-intersection>
        </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="QCalendarResource"
        side="left"
      >
        <div>
          <q-intersection
            transition="scale"
            once
          >
            <q-img
              src="\QCalendarResource.png"
              spinner-color="white"
              style="max-width: 350px"
              class="shadow-12"
            />
          </q-intersection>
        </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="QCalendarScheduler"
        side="right"
      >
        <div>
          <q-intersection
            transition="scale"
            once
          >
            <q-img
              src="\QCalendarScheduler.png"
              spinner-color="white"
              style="max-width: 350px"
              class="shadow-12"
            />
          </q-intersection>
        </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="QCalendarTask"
        side="left"
      >
        <div>
          <q-intersection
            transition="scale"
            once
          >
            <q-img
              src="\QCalendarTask.png"
              spinner-color="white"
              style="max-width: 350px"
              class="shadow-12"
            />
          </q-intersection>
        </div>
      </q-timeline-entry>

      <q-timeline-entry heading>
        <div style="font-size: 32px; font-weight: 600;">
          Configurable
        </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="Events"
        subtitle="Slots lets you render events"
        side="left"
      >
        <div>
          <q-intersection
            transition="scale"
            once
          >
            <q-img
              src="\qcalendarmonth-event-slots.png"
              spinner-color="white"
              style="max-width: 350px"
              class="shadow-12"
            />
          </q-intersection>
        </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="Planner"
        subtitle="Add extra columns with Agenda Calendar"
        side="right"
      >
        <div>
          <q-intersection
            transition="scale"
            once
          >
            <q-img
              src="\qcalendaragenda-planner.png"
              spinner-color="white"
              style="max-width: 350px"
              class="shadow-12"
            />
          </q-intersection>
        </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="Timesheets"
        subtitle="Task Calendar has a footer for summary"
        side="left"
      >
        <div>
          <q-intersection
            transition="scale"
            once
          >
            <q-img
              src="\QCalendarTask.png"
              spinner-color="white"
              style="max-width: 350px"
              class="shadow-12"
            />
          </q-intersection>
        </div>
      </q-timeline-entry>

      <q-timeline-entry heading>
        <div style="font-size: 32px; font-weight: 600;">
          User-defined Themes
        </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="Blue"
        side="left"
        color="blue"
      >
        <div>
          <q-intersection
            transition="scale"
            once
          >
            <q-img
              src="\qcalendarweek-blue-theme.png"
              spinner-color="white"
              style="max-width: 350px"
              class="shadow-12"
            />
          </q-intersection>
        </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="Indigo"
        side="right"
        color="indigo"
      >
        <div>
          <q-intersection
            transition="scale"
            once
          >
            <q-img
              src="\qcalendarmonth-indigo-theme.png"
              spinner-color="white"
              style="max-width: 350px"
              class="shadow-12"
            />
          </q-intersection>
        </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="Deep Purple"
        side="left"
        color="deep-purple"
      >
        <div>
          <q-intersection
            transition="scale"
            once
          >
            <q-img
              src="\qcalendarmonth-minimode-deep-purple-theme.png"
              spinner-color="white"
              style="max-width: 240px;"
              class="shadow-12"
            />
          </q-intersection>
        </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="Brown"
        side="right"
        color="brown"
      >
        <div>
          <q-intersection
            transition="scale"
            once
          >
            <q-img
              src="\qcalendarscheduler-brown-theme.png"
              spinner-color="white"
              style="max-width: 350px"
              class="shadow-12"
            />
          </q-intersection>
        </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="Teal"
        side="left"
        color="teal"
      >
        <div>
          <q-intersection
            transition="scale"
            once
          >
            <q-img
              src="\qcalendartask-teal-theme.png"
              spinner-color="white"
              style="max-width: 350px"
              class="shadow-12"
            />
          </q-intersection>
        </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="Blue"
        side="right"
        color="blue"
      >
        <div>
          <q-intersection
            transition="scale"
            once
          >
            <q-img
              src="\qcalendarweek-blue-theme.png"
              spinner-color="white"
              style="max-width: 350px"
              class="shadow-12"
            />
          </q-intersection>
        </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="Dark"
        subtitle="Automatic dark mode"
        side="left"
        color="black"
      >
        <div>
          <q-intersection
            transition="scale"
            once
          >
            <q-img
              src="\qcalendarweek-dark-mode.png"
              spinner-color="white"
              style="max-width: 350px"
              class="shadow-12"
            />
          </q-intersection>
        </div>
      </q-timeline-entry>

    </q-timeline>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'Landing Page Content',

  setup () {
    const $q = useQuasar()

    const layout = computed(() => {
      return $q.screen.lt.sm ? 'dense' : ($q.screen.lt.md ? 'comfortable' : 'loose')
    })

    return {
      layout
    }
  }
})
</script>

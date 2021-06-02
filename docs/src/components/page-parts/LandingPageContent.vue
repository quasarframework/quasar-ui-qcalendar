<template>
  <section class="flex flex-center bg-blue-10 text-white shadow-10">
    <div class="landing-page__container">
      <div class="landing-page__splash row justify-around items-center">
        <h2 class="text-weight-bold text-blue-2 q-pa-sm" style="padding-left: 20px;">Build Beautiful,<br>Responsive<br> Calendars</h2>
        <div class="q-pa-sm">
          <img
            src="/qcalendarmonth-event-slots.png"
            class="shadow-10 rounded-borders"
            style="max-width: 340px;"
          />
        </div>
      </div>
    </div>
    <div class="full-width row justify-center q-pb-xl">
      <q-btn
        to="/all-about-qcalendar/what-is-qcalendar"
        no-caps
        class="bg-red-8"
      >
        <div class="row justify-around items-center" style="width: 140px;">
          <div>Get started</div>
          <q-icon :name="biArrowRightCircle"/>
        </div>
      </q-btn>
    </div>
  </section>
  <div class="q-px-lg q-pb-xl">
    <q-timeline :layout="layout" color="primary q-mb-xl">

      <q-timeline-entry heading>
        <div style="font-size: 32px; font-weight: 600;">QCalendar</div>
        <div style="font-size: 22px; font-weight: 600;" class="text-grey">It's a Family of Calendars</div>
        <!-- <div style="font-size: 16px;">Build Beautiful,Responsive Calendars</div> -->
      </q-timeline-entry>

      <q-timeline-entry
        title="QCalendarDay"
        subtitle="Show as many days as needed"
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
              class="shadow-12 rounded-borders"
            />
          </q-intersection>
        </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="QCalendarMonth"
        subtitle="Keep track of events, reminders and tasks"
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
              class="shadow-12 rounded-borders"
            />
          </q-intersection>
        </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="QCalendarMonth (mini-mode)"
        subtitle="Create popups with multi-range selection"
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
              style="max-width: 200px"
              class="shadow-12 rounded-borders"
            />
          </q-intersection>
        </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="QCalendarAgenda"
        subtitle="Add the content you want"
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
              class="shadow-12 rounded-borders"
            />
          </q-intersection>
        </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="QCalendarResource"
        subtitle="Manage resources by time"
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
              class="shadow-12 rounded-borders"
            />
          </q-intersection>
        </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="QCalendarScheduler"
        subtitle="Manage resources daily"
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
              class="shadow-12 rounded-borders"
            />
          </q-intersection>
        </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="QCalendarTask"
        subtitle="Create timesheet and Gantt charts"
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
              class="shadow-12 rounded-borders"
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
              class="shadow-12 rounded-borders"
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
              class="shadow-12 rounded-borders"
            />
          </q-intersection>
        </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="Timesheets"
        subtitle="Use a Footer summary with Task Calendar"
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
              class="shadow-12 rounded-borders"
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
        subtitle="Change your calendar with CSS vars"
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
              class="shadow-12 rounded-borders"
            />
          </q-intersection>
        </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="Indigo"
        side="right"
        color="indigo"
        subtitle="Use our Theme Builder to create themes"
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
              class="shadow-12 rounded-borders"
            />
          </q-intersection>
        </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="Deep Purple"
        side="left"
        color="deep-purple"
        subtitle="Create stunning calendars"
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
              class="shadow-12 rounded-borders"
            />
          </q-intersection>
        </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="Brown"
        side="right"
        color="brown"
        subtitle="Be bold!"
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
              class="shadow-12 rounded-borders"
            />
          </q-intersection>
        </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="Teal"
        side="left"
        color="teal"
        subtitle="Be creative!"
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
              class="shadow-12 rounded-borders"
            />
          </q-intersection>
        </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="Dark"
        subtitle="Automatic dark mode when used with Quasar Framework"
        side="right"
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
              class="shadow-12 rounded-borders"
            />
          </q-intersection>
        </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="Interactive Theme Builder"
        subtitle="Create your own themes with Theme Builder"
        side="left"
        color="orange-8"
      >
        <div class="q-mb-xl">
          <q-intersection
            transition="scale"
            once
          >
            <q-img
              src="\theme-builder.png"
              spinner-color="white"
              style="max-width: 350px"
              class="shadow-12 rounded-borders"
            />
          </q-intersection>
        </div>
      </q-timeline-entry>
    </q-timeline>

    <div class="full-width column justify-center items-center text-h5">
      <p>No dependencies other than Vue</p>
      <p>Available for Quasar Framework CLI, Vue CLI and UMD</p>
    </div>

  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useQuasar } from 'quasar'
import {
  biArrowRightCircle
} from '@quasar/extras/bootstrap-icons'

export default defineComponent({
  name: 'Landing Page Content',

  setup () {
    const $q = useQuasar()

    const layout = computed(() => {
      return $q.screen.lt.sm ? 'dense' : ($q.screen.lt.md ? 'comfortable' : 'loose')
    })

    return {
      layout,
      biArrowRightCircle
    }
  }
})
</script>

<style lang="sass" scoped>
.landing-page-container
  position: relative
  margin: 0 auto
  @media (max-width: $breakpoint-xs-max)
    max-width: 340px
    width: 340px
  @media (min-width: $breakpoint-sm-min) and (max-width: $breakpoint-md-max)
    max-width: 480px
    width: 480px
  @media (min-width: $breakpoint-lg-min)
    max-width: 960px
    width: 960px

.landing-page__splash
  @media (max-width: $breakpoint-xs-max)
    padding: 0
  @media (min-width: $breakpoint-sm-min) and (max-width: $breakpoint-md-max)
    padding: 30px 0 60px
  @media (min-width: $breakpoint-lg-min)
    padding: 50px 0 100px

.landing-page__splash--content
  max-width: 500px

</style>

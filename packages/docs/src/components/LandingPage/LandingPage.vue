<template>
  <div class="landing-page markdown-brand">
    <header class="hero">
      <img src="/qcalendar-logo.png" alt="QCalendar Logo" class="hero-logo" />
      <h1 class="hero-title">QCalendar</h1>
      <h2 class="hero-subtitle"></h2>
      <div class="row justify-center">
        <p class="hero-subtitle2" style="max-width: 660px">
          {{ siteConfig.description }}
        </p>
      </div>

      <div class="hero-buttons">
        <router-link
          to="/getting-started/introduction"
          class="hero-button q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle q-btn--actionable q-focusable q-hoverable q-btn--no-uppercase q-btn--rounded q-btn--dense"
        >
          <div
            class="row justify-around items-center q-btn__content text-center col items-center q-anchor--skip"
            style="width: 120px"
          >
            <div>Get Started</div>
            <q-icon :name="biArrowRightCircle" />
          </div>
        </router-link>
        <a
          href="https://github.com/quasarframework/quasar-ui-qcalendar/tree/dev"
          target="_blank"
          class="hero-button q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle q-btn--actionable q-focusable q-hoverable q-btn--no-uppercase q-btn--rounded q-btn--dense"
        >
          <div
            class="row justify-around items-center q-btn__content text-center col items-center q-anchor--skip"
            style="width: 120px"
          >
            <q-icon :name="fabGithub" class="q-mr-sm" />
            GitHub Repo
          </div>
        </a>
      </div>
    </header>
    <div class="byline">
      <p>
        QCalendar is your all-in-one calendar solution for Vue and Quasar.<br />Discover the power
        of QCalendar and enhance your calendar experience!
      </p>
    </div>
    <div class="row justify-center hero">
      <div class="hero-title">QCalendar Features</div>
    </div>
    <div class="q-px-lg q-pb-xl">
      <q-timeline :layout="layout" color="primary q-mb-xl">
        <q-timeline-entry heading>
          <div style="font-size: 32px; font-weight: 600">QCalendar</div>
          <div style="font-size: 22px; font-weight: 600" class="text-grey">
            A Vue Calendar that has everything you need
          </div>
        </q-timeline-entry>

        <q-timeline-entry title="QCalendarDay" subtitle="Show as many days as needed" side="left">
          <div>
            <q-intersection transition="scale" once>
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
            <q-intersection transition="scale" once>
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
            <q-intersection transition="scale" once>
              <q-img
                src="\QCalendarMonth--mini-mode.png"
                spinner-color="white"
                style="max-width: 200px"
                class="shadow-12 rounded-borders"
              />
            </q-intersection>
          </div>
        </q-timeline-entry>

        <q-timeline-entry title="QCalendarAgenda" subtitle="Add the content you want" side="right">
          <div>
            <q-intersection transition="scale" once>
              <q-img
                src="\QCalendarAgenda.png"
                spinner-color="white"
                style="max-width: 350px"
                class="shadow-12 rounded-borders"
              />
            </q-intersection>
          </div>
        </q-timeline-entry>

        <q-timeline-entry title="QCalendarResource" subtitle="Manage resources by time" side="left">
          <div>
            <q-intersection transition="scale" once>
              <q-img
                src="\QCalendarResource.png"
                spinner-color="white"
                style="max-width: 350px"
                class="shadow-12 rounded-borders"
              />
            </q-intersection>
          </div>
        </q-timeline-entry>

        <q-timeline-entry title="QCalendarScheduler" subtitle="Manage resources daily" side="right">
          <div>
            <q-intersection transition="scale" once>
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
            <q-intersection transition="scale" once>
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
          <div style="font-size: 32px; font-weight: 600">Configurable</div>
        </q-timeline-entry>

        <q-timeline-entry title="Events" subtitle="Slots lets you render events" side="left">
          <div>
            <q-intersection transition="scale" once>
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
            <q-intersection transition="scale" once>
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
            <q-intersection transition="scale" once>
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
          <div style="font-size: 32px; font-weight: 600">User-defined Themes</div>
        </q-timeline-entry>

        <q-timeline-entry
          title="Blue"
          side="left"
          color="blue"
          subtitle="Change your calendar with CSS vars"
        >
          <div>
            <q-intersection transition="scale" once>
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
            <q-intersection transition="scale" once>
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
            <q-intersection transition="scale" once>
              <q-img
                src="\qcalendarmonth-minimode-deep-purple-theme.png"
                spinner-color="white"
                style="max-width: 240px"
                class="shadow-12 rounded-borders"
              />
            </q-intersection>
          </div>
        </q-timeline-entry>

        <q-timeline-entry title="Brown" side="right" color="brown" subtitle="Be bold!">
          <div>
            <q-intersection transition="scale" once>
              <q-img
                src="\qcalendarscheduler-brown-theme.png"
                spinner-color="white"
                style="max-width: 350px"
                class="shadow-12 rounded-borders"
              />
            </q-intersection>
          </div>
        </q-timeline-entry>

        <q-timeline-entry title="Teal" side="left" color="teal" subtitle="Be creative!">
          <div>
            <q-intersection transition="scale" once>
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
            <q-intersection transition="scale" once>
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
            <q-intersection transition="scale" once>
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

      <q-separator />
      <div class="byline">
        <p>
          Don't forget to check out the Q-Press app extension for Quasar to create beautiful
          documentation sites.
        </p>
        <p>
          This site is built with Q-Press! Install it, set it up, choose a theme and start your own
          site!
        </p>
      </div>
      <q-separator />
      <div class="byline">
        <p>
          We hope you find this documentation helpful. If you have any questions or need further
          assistance, please don't hesitate to reach out to our support team.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQuasar } from 'quasar'
import { QIcon } from 'quasar'
import { fabGithub } from '@quasar/extras/fontawesome-v6'
import siteConfig from '../../siteConfig'
import { biArrowRightCircle } from '@quasar/extras/bootstrap-icons'

const $q = useQuasar()

const layout = computed(() => {
  return $q.screen.lt.sm ? 'dense' : $q.screen.lt.md ? 'comfortable' : 'loose'
})
</script>

<style lang="scss" scoped>
.landing-page {
  font-family: 'Arial', sans-serif;
  color: #333;
}

.hero {
  background: linear-gradient(135deg, $brand-primary, $brand-secondary);
  color: white;
  text-align: center;
  padding: 50px 20px;
}

.hero-logo {
  max-width: 200px;
  margin-bottom: 20px;
  border-radius: 50%;
}

.hero-title {
  font-size: 3.5em;
  line-height: 1.2em;
  font-weight: 700;
  margin: 0;
  padding: 0.2em 0;
  text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.8);
}

.hero-subtitle {
  font-size: 1.8em;
  line-height: 1.8em;
  margin: 0;
}

.hero-subtitle2 {
  font-size: 1.2em;
  line-height: 1.2em;
  font-weight: 700;
  text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.8);
}

.hero-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.hero-button {
  background: white;
  color: $brand-primary;
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  transition: background 0.3s;
}

.hero-button:hover {
  background: #f0f0f0;
}

.byline {
  text-align: center;
  font-size: 1.2em;
  margin: 20px 0;
  color: #35495e;
}

body.body--dark .byline {
  color: #f0f0f0;
}

.content {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 20px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 10px;
  width: 100%;
  max-width: 100%;
  justify-content: center;
  align-content: center;
}

.grid-item {
  // aspect-ratio: 1 / 1;
  cursor: pointer;
}

.section {
  flex: 1 1 300px;
  margin: 20px;
  padding: 20px;
  color: white;
  text-decoration: none;
  background: linear-gradient(135deg, $brand-primary, $brand-secondary);
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.section:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  // change mouseover effects
  cursor: pointer;
}

.section h2 {
  margin-top: 0;
  color: white;
  font-size: 2.125rem;
  font-weight: 400;
  line-height: 2.5rem;
  letter-spacing: 0.00735em;
  font-weight: 700;
  text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.8);
}

.section ul {
  list-style: none;
  padding: 0;
}

.section ul li {
  margin: 10px 0;
}

.section ul li a {
  color: #35495e;
  text-decoration: none;
  transition: color 0.3s;
}

.section ul li a:hover {
  color: $brand-primary;
}

.footer {
  text-align: center;
  padding: 20px;
  background: #35495e;
  color: white;
}
</style>

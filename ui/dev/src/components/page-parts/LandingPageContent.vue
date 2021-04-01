<template>
  <div>Landing Page Content</div>
  {{ images[imageIndex] }}
  <div class="monitor-display" style="max-width: 766px; max-height: 544px;">
    <div class="window-header">
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="window-contents">
      <div class="window-inner-contents" style="height: 444px;">
        <!-- <div style="width: 100%; padding-bottom: 56.086956521739125%;"></div> -->
        <img :src="'/' + images[imageIndex]" width="auto" height="444">
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'

export default defineComponent({
  name: 'Landing Page Content',

  setup () {
    const images = [
        'qcalendarmonth-event-slots.png',
        'qcalendaragenda-planner.png',
        'qcalendarmonth-indigo-theme.png',
        'qcalendarmonth-minimode-deep-purple-theme.png',
        'qcalendarmonth-minimode-range-selection.png',
        'qcalendarmonth-workweeks.png',
        'qcalendarresource-children.png',
        'qcalendarscheduler-brown-theme.png',
        'qcalendarscheduler-children.png',
        'qcalendartask-colored-weekends.png',
        'qcalendartask-teal-theme.png',
        'qcalendarweek-blue-theme.png',
        'qcalendarweek-dark-mode.png'
      ],
      imageIndex = ref(-1)
    let timerId

    onMounted(() => {
      timerId = setInterval(() => {
        if (++imageIndex.value > images.length - 1) {
          imageIndex.value = 0
        }
        console.log('imageIndex', imageIndex.value)
      }, 1500)
    })

    onUnmounted(() => {
      clearInterval(timerId)
    })

    console.log(images)
    return {
      images,
      imageIndex
    }
  }
})
</script>

<style lang="sass">
.monitor-display
  width: 100%
  opacity: 0
  animation-delay: 0.5s
  animation-duration: 0.75s
  animation-name: slide-up
  animation-timing-function: cubic-bezier(0.25, 1, 0.5, 1)
  animation-fill-mode: forwards

@keyframes slide-up
  0%
    opacity: 0
    transform: translateY(25%)

  100%
    opacity: 1
    transform: translateY(0px)

@media (max-width: 769px)
  .window-header
    height: 11px
    border-width: 2px

.window-header
  width: 100%
  height: 26px
  background-color: rgb(255, 255, 255)
  border-width: 3px 3px 0px
  border-top-style: solid
  border-right-style: solid
  border-left-style: solid
  border-top-color: rgb(87, 84, 82)
  border-right-color: rgb(87, 84, 82)
  border-left-color: rgb(87, 84, 82)
  border-image: initial
  border-bottom-style: initial
  border-bottom-color: initial
  border-top-left-radius: 7px
  border-top-right-radius: 7px
  max-width: 918px
  margin: 0px auto
  display: flex
  -webkit-box-align: center
  align-items: center

@media (max-width: 769px)
  .window-header > span:nth-child(1)
    margin-left: 6px

.window-header > span:nth-child(1)
  margin-left: 9px

@media (max-width: 769px)
  .window-header > span
    width: 3px
    height: 3px
    border-radius: 3px
    margin-left: 4px

.window-header > span
  display: block
  width: 10px
  height: 10px
  border-radius: 10px
  margin-left: 6px
  background-color: rgb(195, 194, 193)

@media (max-width: 769px)
  .window-contents
    border-width: 2px

.window-contents
  background-color: rgb(255, 255, 200)
  position: relative
  width: 100%
  height: 100%
  max-width: 918px
  margin: 0px auto
  overflow: hidden
  border: 3px solid rgb(87, 84, 82)
  border-bottom-right-radius: 7px
  border-bottom-left-radius: 7px

.window-inner-contents
  padding-top: 0px
  // padding-bottom: 56.25%

.window-inner-contents > div
  padding-bottom: 0px !important

</style>

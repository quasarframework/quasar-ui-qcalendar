export default {
  name: 'Mouse',

  methods: {

    getDefaultMouseEventWithSuffix (suffix) {
      return {
        ['click' + suffix]: { event: 'click' },
        ['contextmenu' + suffix]: { event: 'contextmenu', prevent: true, result: false },
        ['mousedown' + suffix]: { event: 'mousedown' },
        ['mousemove' + suffix]: { event: 'mousemove' },
        ['mouseup' + suffix]: { event: 'mouseup' },
        ['mouseenter' + suffix]: { event: 'mouseenter' },
        ['mouseleave' + suffix]: { event: 'mouseleave' },
        ['touchstart' + suffix]: { event: 'touchstart' },
        ['touchmove' + suffix]: { event: 'touchmove' },
        ['touchend' + suffix]: { event: 'touchend' }
      }
    },

    getDefaultMouseEventHandlers2 (suffix1, suffix2, getEvent) {
      return this.getMouseEventHandlers({
        ['click' + suffix1]: { event: 'click' },
        ['contextmenu' + suffix1]: { event: 'contextmenu', prevent: true, result: false },
        ['mousedown' + suffix1]: { event: 'mousedown' },
        ['mousemove' + suffix1]: { event: 'mousemove' },
        ['mouseup' + suffix1]: { event: 'mouseup' },
        ['mouseenter' + suffix1]: { event: 'mouseenter' },
        ['mouseleave' + suffix1]: { event: 'mouseleave' },
        ['touchstart' + suffix1]: { event: 'touchstart' },
        ['touchmove' + suffix1]: { event: 'touchmove' },
        ['touchend' + suffix1]: { event: 'touchend' },
        ['click' + suffix2]: { event: 'click' },
        ['contextmenu' + suffix2]: { event: 'contextmenu', prevent: true, result: false },
        ['mousedown' + suffix2]: { event: 'mousedown' },
        ['mousemove' + suffix2]: { event: 'mousemove' },
        ['mouseup' + suffix2]: { event: 'mouseup' },
        ['mouseenter' + suffix2]: { event: 'mouseenter' },
        ['mouseleave' + suffix2]: { event: 'mouseleave' },
        ['touchstart' + suffix2]: { event: 'touchstart' },
        ['touchmove' + suffix2]: { event: 'touchmove' },
        ['touchend' + suffix2]: { event: 'touchend' }
      }, getEvent)
    },

    getDefaultMouseEventHandlers (suffix, getEvent) {
      return this.getMouseEventHandlers({
        ['click' + suffix]: { event: 'click' },
        ['contextmenu' + suffix]: { event: 'contextmenu', prevent: true, result: false },
        ['mousedown' + suffix]: { event: 'mousedown' },
        ['mousemove' + suffix]: { event: 'mousemove' },
        ['mouseup' + suffix]: { event: 'mouseup' },
        ['mouseenter' + suffix]: { event: 'mouseenter' },
        ['mouseleave' + suffix]: { event: 'mouseleave' },
        ['touchstart' + suffix]: { event: 'touchstart' },
        ['touchmove' + suffix]: { event: 'touchmove' },
        ['touchend' + suffix]: { event: 'touchend' }
      }, getEvent)
    },
    getMouseEventHandlers (events, getEvent) {
      const on = {}

      for (const eventName in events) {
        const eventOptions = events[eventName]

        if (!this.$listeners[eventName]) continue

        // https://vuejs.org/v2/guide/render-function.html#Event-amp-Key-Modifiers
        const prefix = eventOptions.passive ? '&' : ((eventOptions.once ? '~' : '') + (eventOptions.capture ? '!' : ''))
        const key = prefix + eventOptions.event

        const handler = (event) => {
          const mouseEvent = event
          if (eventOptions.button === undefined || (mouseEvent.buttons > 0 && mouseEvent.button === eventOptions.button)) {
            if (eventOptions.prevent) {
              mouseEvent.preventDefault()
            }
            if (eventOptions.stop) {
              mouseEvent.stopPropagation()
            }
            this.$emit(eventName, getEvent(mouseEvent, eventName))
          }

          return eventOptions.result
        }

        if (key in on) {
          if (Array.isArray(on[key])) {
            (on[key]).push(handler)
          }
          else {
            on[key] = [on[key], handler]
          }
        }
        else {
          on[key] = handler
        }
      }

      return on
    }
  }
}

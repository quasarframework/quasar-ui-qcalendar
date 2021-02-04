const toCamelCase = str => str.replace(/(-\w)/g, m => m[ 1 ].toUpperCase())
let $listeners, $emit

/**
 * Used by render function to set up specialized mouse events
 * The mouse event will not be set if there is no listener for it to key callbacks to a minimum
 * @param {Object} events undecorated events (ie: 'click-day' will be transformed to 'onClickDay')
 * @param {Function} getEvent callback for event
 * @returns {Object} contents of decorated mouse events
 */
export function getMouseEventHandlers (events, getEvent) {
  const on = {}
  for (const eventName in events) {
    const eventOptions = events[ eventName ]

    // convert eventName to vue camelCase (decorated)
    const eventKey = toCamelCase('on-' + eventName)

    // make sure listeners has been set up properly
    if ($listeners === undefined) {
      // someone forgot to call the default function export
      console.warn('$listeners has not been set up')
      return
    }

    // if there is no listener for this, then don't process it
    if ($listeners.value[ eventKey ] === undefined) continue

    // https://vuejs.org/v2/guide/render-function.html#Event-amp-Key-Modifiers
    // const prefix = eventOptions.passive ? '&' : ((eventOptions.once ? '~' : '') + (eventOptions.capture ? '!' : ''))
    // const key = prefix + eventOptions.event

    // prefix 'on' and capitalize first character
    const key = 'on' + eventOptions.event.charAt(0).toUpperCase() + eventOptions.event.slice(1)

    const handler = (event) => {
      const mouseEvent = event
      if (eventOptions.button === undefined || (mouseEvent.buttons > 0 && mouseEvent.button === eventOptions.button)) {
        if (eventOptions.prevent) {
          mouseEvent.preventDefault()
        }
        if (eventOptions.stop) {
          mouseEvent.stopPropagation()
        }
        $emit(eventName, getEvent(mouseEvent, eventName))
      }

      return eventOptions.result
    }

    if (key in on) {
      if (Array.isArray(on[ key ])) {
        (on[ key ]).push(handler)
      }
      else {
        on[ key ] = [ on[ key ], handler ]
      }
    }
    else {
      on[ key ] = handler
    }
  }

  return on
}

/**
 *
 * @param {String} suffix
 * @param {Function} getEvent The callback
 * @returns {Object} contains decorated mouse events based on listeners of that event and for each a callback
 */
export function getDefaultMouseEventHandlers (suffix, getEvent) {
  return getMouseEventHandlers(getMouseEventName(suffix), getEvent)
}

/**
 *
 * @param {String} suffix
 * @returns {Object}
 */
export function getMouseEventName (suffix) {
  return {
    [ 'click' + suffix ]: { event: 'click' },
    [ 'contextmenu' + suffix ]: { event: 'contextmenu', prevent: true, result: false },
    [ 'mousedown' + suffix ]: { event: 'mousedown' },
    [ 'mousemove' + suffix ]: { event: 'mousemove' },
    [ 'mouseup' + suffix ]: { event: 'mouseup' },
    [ 'mouseenter' + suffix ]: { event: 'mouseenter' },
    [ 'mouseleave' + suffix ]: { event: 'mouseleave' },
    [ 'touchstart' + suffix ]: { event: 'touchstart' },
    [ 'touchmove' + suffix ]: { event: 'touchmove' },
    [ 'touchend' + suffix ]: { event: 'touchend' }
  }
}

/**
 *
 * @param {String} suffix
 * @returns {Array} the array or raw listeners (ie: 'click-day' as opposed to 'onClickDay')
 */
export function getRawMouseEvents (suffix) {
  return Object.keys(getMouseEventName(suffix))
}

/**
 * export of default funtion
 * @param {VTTCue.emit} emit
 * @param {Array} listeners on the instance
 */
export default function (emit, listeners) {
  $emit = emit
  $listeners = listeners
  return {
    getMouseEventHandlers,
    getDefaultMouseEventHandlers,
    getMouseEventName,
    getRawMouseEvents
  }
}

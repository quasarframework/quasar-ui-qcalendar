import { EmitFn } from 'vue'
import { EmitListeners } from './useEmitListeners'
/**
 * Converts a kebab-case string to camelCase.
 * @param {string} str - The kebab-case string.
 * @returns {string} - The camelCase formatted string.
 */
const toCamelCase = (str: string): string => str.replace(/(-\w)/g, (m) => m[1]!.toUpperCase())

/**
 * Defines the structure for a mouse event configuration.
 */
interface MouseEventOptions {
  event: string
  button?: number
  prevent?: boolean
  stop?: boolean
  result?: any
}

/**
 * Defines a function signature for event transformation.
 */
type GetEventFunction = (_event: MouseEvent | TouchEvent, _eventName: string) => any

/**
 * Generates mouse event handlers based on event listeners.
 * @param {Function} emit - Vue's emit function.
 * @param {Ref<Listeners>} listeners - Vue ref containing event listeners.
 * @param {Record<string, MouseEventOptions>} events - Object defining mouse events and their options.
 * @param {GetEventFunction} getEvent - Function to transform event objects.
 * @returns {Record<string, Function | Function[]>} - The mapped mouse event handlers.
 */
export function getMouseEventHandlers(
  emit: EmitFn,
  listeners: EmitListeners,
  events: Record<string, MouseEventOptions>,
  getEvent: GetEventFunction,
): Record<string, Function | Function[]> {
  const on: Record<string, Function | Function[]> = {}

  for (const eventName in events) {
    const eventOptions = events[eventName]
    if (!eventOptions) continue
    const eventKey = toCamelCase('on-' + eventName)

    if (!listeners.value) {
      console.warn('$listeners has not been set up')
      return {}
    }

    if (listeners.value[eventKey] === undefined) continue

    const key = 'on' + eventOptions.event.charAt(0).toUpperCase() + eventOptions.event.slice(1)

    const handler = (event: MouseEvent | TouchEvent): any => {
      if (
        eventOptions.button === undefined ||
        ('buttons' in event && event.buttons > 0 && event.button === eventOptions.button)
      ) {
        if (eventOptions.prevent) {
          event.preventDefault()
        }
        if (eventOptions.stop) {
          event.stopPropagation()
        }
        emit(eventName, getEvent(event, eventName))
      }
      return eventOptions.result
    }

    if (key in on) {
      if (Array.isArray(on[key])) {
        ;(on[key] as Function[]).push(handler)
      } else {
        on[key] = [on[key] as Function, handler]
      }
    } else {
      on[key] = handler
    }
  }

  return on
}

/**
 * Returns default mouse event handlers based on a suffix.
 * @param {Function} emit - Vue's emit function.
 * @param {Ref<Listeners>} listeners - Vue ref containing event listeners.
 * @param {string} suffix - Event suffix (e.g., '-day' for 'click-day').
 * @param {GetEventFunction} getEvent - Function to transform event objects.
 * @returns {Record<string, Function | Function[]>} - The mapped event handlers.
 */
export function getDefaultMouseEventHandlers(
  emit: EmitFn,
  listeners: EmitListeners,
  suffix: string,
  getEvent: GetEventFunction,
): Record<string, Function | Function[]> {
  return getMouseEventHandlers(emit, listeners, getMouseEventName(suffix), getEvent)
}

/**
 * Generates event names for different mouse interactions.
 * @param {string} suffix - Event suffix (e.g., '-day' for 'click-day').
 * @returns {Record<string, MouseEventOptions>} - The event name map.
 */
export function getMouseEventName(suffix: string): Record<string, MouseEventOptions> {
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
    ['touchend' + suffix]: { event: 'touchend' },
  }
}

/**
 * Returns an array of raw event names based on a suffix.
 * @param {string} suffix - Event suffix.
 * @returns {string[]} - The raw event names.
 */
export function getRawMouseEvents(suffix: string): string[] {
  return Object.keys(getMouseEventName(suffix))
}

/**
 * Default function export that provides mouse event handling utilities.
 * @param {Function} emit - Vue's emit function.
 * @param {Ref<Listeners>} listeners - Vue ref containing event listeners.
 * @returns {Object} - Functions for managing mouse event handlers.
 */
export default function useMouseEvents(
  emit: EmitFn,
  listeners: EmitListeners,
): {
  getMouseEventHandlers: (
    _events: Record<string, MouseEventOptions>,
    _getEvent: GetEventFunction,
  ) => Record<string, Function | Function[]>
  getDefaultMouseEventHandlers: (
    _suffix: string,
    _getEvent: GetEventFunction,
  ) => Record<string, Function | Function[]>
  getMouseEventName: (_suffix: string) => Record<string, MouseEventOptions>
  getRawMouseEvents: (_suffix: string) => string[]
} {
  return {
    getMouseEventHandlers: (
      events: Record<string, MouseEventOptions>,
      getEvent: GetEventFunction,
    ): Record<string, Function | Function[]> =>
      getMouseEventHandlers(emit, listeners, events, getEvent),
    getDefaultMouseEventHandlers: (
      suffix: string,
      getEvent: GetEventFunction,
    ): Record<string, Function | Function[]> =>
      getDefaultMouseEventHandlers(emit, listeners, suffix, getEvent),
    getMouseEventName,
    getRawMouseEvents,
  }
}

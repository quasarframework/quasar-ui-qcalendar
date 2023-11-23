/**
 * Utility functions for event handling.
 */
export default function () {
  /**
   * Creates a custom event with the specified name.
   * @param {string} name - The name of the event.
   * @param {Object} options - Options for the event (bubbles, cancelable).
   * @param options.bubbles
   * @param options.cancelable
   * @returns {Event} The created event.
   */
  function createEvent(name, { bubbles = false, cancelable = false } = {}) {
    try {
      return new CustomEvent(name, { bubbles, cancelable })
    }
 catch (e) {
      // IE doesn't support `new Event()`, so...
      const evt = document.createEvent('Event')
      evt.initEvent(name, bubbles, cancelable)
      return evt
    }
  }

  /**
   * Checks if the event's keyCode matches any of the specified keyCodes.
   * @param {KeyboardEvent} evt - The keyboard event.
   * @param {number|number[]} keyCodes - The key code or an array of key codes to check against.
   * @returns {boolean} True if the keyCode matches, false otherwise.
   */
  function isKeyCode(evt, keyCodes) {
    return [].concat(keyCodes).includes(evt.keyCode)
  }

  return {
    createEvent,
    isKeyCode,
  }
}

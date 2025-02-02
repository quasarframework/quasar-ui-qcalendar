/**
 * Utility functions for event handling.
 */

interface EventUtilsReturn {
  isKeyCode: (_evt: KeyboardEvent, _keyCodes: number | number[]) => boolean
}

export default function useEventUtils(): EventUtilsReturn {
  /**
   * Checks if the event's keyCode matches any of the specified keyCodes.
   * @param {KeyboardEvent} evt - The keyboard event.
   * @param {number | number[]} keyCodes - The key code or an array of key codes to check against.
   * @returns {boolean} True if the keyCode matches, false otherwise.
   */
  function isKeyCode(evt: KeyboardEvent, keyCodes: number | number[]): boolean {
    return (Array.isArray(keyCodes) ? keyCodes : [keyCodes]).includes(evt.keyCode)
  }

  return {
    isKeyCode,
  }
}

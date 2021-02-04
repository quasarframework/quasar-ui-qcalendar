export default function () {
  function createEvent (name, { bubbles = false, cancelable = false } = {}) {
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

  function isKeyCode (evt, keyCodes) {
    return [].concat(keyCodes).includes(evt.keyCode)
  }

  return {
    createEvent,
    isKeyCode
  }
}
